import nodemailer from "nodemailer"
import dotenv from "dotenv"
import { redisClient } from "../utils/redisClient.js"
import { userModel } from "../models/userSchema.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { jobModel } from "../models/jobSchema.js"

dotenv.config({ path: "./config.env" })

// ---------------- Transporter ----------------
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASSWORD,
    }
});

function generateRandomNumber() {
    return Math.floor((Math.random() * 9000) + 1000).toString();
}

// -------------------- OTP Sender --------------------
async function sendOTP(email) {
    try {
        const otp = generateRandomNumber();

        await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Your OTP for Email Verification (valid for 5 mins)",
            text: `Your OTP is ${otp}`
        });

        redisClient.setEx(`email:${email}`, 300, otp);

        return { message: "OTP sent successfully!", status: true };
    } catch (err) {
        console.log("Error sending OTP:", err);
        return { message: "Unable to send OTP", status: false };
    }
}

async function sendOTPForPasswordReset(email) {
    try {
        const otp = generateRandomNumber();

        await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Password Reset Request",
            text: `Your password reset OTP is ${otp}. Valid for 5 mins.`
        });

        redisClient.setEx(`emailPasswordReset:${email}`, 300, otp);

        return { message: "OTP sent successfully!", status: true };
    } catch (err) {
        console.log("Error sending OTP:", err);
        return { message: "Unable to send OTP", status: false };
    }
}

// -------------------- Routes --------------------
export const test = (req, res) => {
    res.status(200).json({ message: "Welcome to user test route!" });
};

// -------------------- Register --------------------
export const handleUserRegister = async (req, res) => {
    try {
        const { name, phone, email, street, city, state, country, pincode, dob, password } = req.body;

        if (!name || !phone || !email || !street || !city || !state || !country || !pincode || !dob || !password)
            throw ("Missing required fields!");

        const existingUser = await userModel.findOne({
            $or: [{ "email.userEmail": email }, { phone }]
        });

        if (existingUser)
            throw ("Email/Phone already registered!");

        const otpResult = await sendOTP(email);
        if (!otpResult.status)
            throw (`Failed to send OTP to ${email}`);

        const address = { street, city, state, country, pincode };
        const emailObj = { userEmail: email, verified: false };

        const newUser = new userModel({ name, phone, email: emailObj, address, dob, password });
        await newUser.save();

        res.status(202).json({
            message: `User registered. OTP sent to ${email} for verification.`
        });

    } catch (err) {
        console.log("Registration error:", err);
        res.status(400).json({ message: "Unable to register user", err });
    }
};

// -------------------- Verify Email OTP --------------------
export const handleOTPVerification = async (req, res) => {
    try {
        const { email, userOtp } = req.body;

        const user = await userModel.findOne({ "email.userEmail": email });
        if (!user) throw (`Email ${email} not registered!`);

        const storedOtp = await redisClient.get(`email:${email}`);
        if (!storedOtp) throw ("OTP expired or not found!");
        if (storedOtp !== userOtp) throw ("Invalid OTP!");

        await userModel.updateOne(
            { "email.userEmail": email },
            { $set: { "email.verified": true } }
        );

        redisClient.del(`email:${email}`);

        res.status(202).json({ message: "OTP verified successfully!" });
    } catch (err) {
        console.log("OTP verification error:", err);
        res.status(500).json({ message: "Failed to verify OTP", err });
    }
};

// -------------------- Login --------------------
export const handleUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExists = await userModel.findOne({ "email.userEmail": email });

        if (!userExists) throw ("User not found! Please register first.");

        if (!userExists.email.verified) {
            // resend OTP if email not verified
            const result = await sendOTP(email);
            if (!result.status) throw (`Unable to send OTP: ${result.message}`);
            throw (`Email not verified. OTP sent to ${email}`);
        }

        // compare password
        const validPassword = await bcrypt.compare(password, userExists.password);
        if (!validPassword) throw ("Invalid email/password!");

        // Create JWT with expiration
        const token = jwt.sign(
            { email: userExists.email.userEmail },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "24h" } // token expires in 24 hours
        );

        res.status(200).json({
            message: `Welcome ${userExists.name}! Login successful.`,
            token
        });

    } catch (err) {
        console.log("Login error:", err);
        res.status(400).json({ message: err });
    }
};


{/*export const handleUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ "email.userEmail": email });
        if (!user) throw ("Email not registered!");

        if (!user.email.verified) {
            const otpResult = await sendOTP(email);
            if (!otpResult.status) throw (`Failed to resend OTP`);
            throw (`Email not verified. OTP sent to ${email}`);
        }

        const isPassCorrect = await bcrypt.compare(password, user.password);
        if (!isPassCorrect) throw ("Invalid email/password!");

        // -------------------- FIX: Add proper expiresIn --------------------
        const token = jwt.sign(
            { email: user.email.userEmail },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "24h" }  // <-- CORRECT EXPIRY FORMAT
        );

        res.status(202).json({
            message: `Welcome ${user.name}, login successful!`,
            token
        });

    } catch (err) {
        console.log("Login error:", err);
        res.status(400).json({ message: "Unable to login", err });
    }
}; */}

// -------------------- Reset Password Request --------------------
export const handleResetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) throw ("Email required!");

        const user = await userModel.findOne({ "email.userEmail": email });
        if (!user) throw ("Invalid email!");

        const otpResult = await sendOTPForPasswordReset(email);
        if (!otpResult.status) throw (`OTP send failed: ${otpResult.message}`);

        res.status(201).json({
            message: `OTP sent to ${email} for password reset.`
        });

    } catch (err) {
        console.log("Password reset request failed:", err);
        res.status(400).json({ message: "Failed to send reset OTP", err });
    }
};

// -------------------- Verify Reset OTP + Change Password --------------------
export const handleOTPForPasswordReset = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        const user = await userModel.findOne({ "email.userEmail": email });
        if (!user) throw (`Email ${email} not registered!`);

        const storedOtp = await redisClient.get(`emailPasswordReset:${email}`);
        if (!storedOtp) throw ("OTP expired or not found!");
        if (storedOtp !== otp) throw ("Invalid OTP!");

        const hash = await bcrypt.hash(password, 10);

        await userModel.updateOne({ "email.userEmail": email }, { $set: { password: hash } });

        redisClient.del(`emailPasswordReset:${email}`);

        res.status(202).json({
            message: "Password changed successfully! Please login."
        });

    } catch (err) {
        console.log("Password reset error:", err);
        res.status(500).json({
            message: "Failed to reset password!",
            err
        });
    }
};

// -------------------- File Upload --------------------
export const handleUserFileUpload = async (req, res) => {
    try {
        if (!req.file) throw new Error("No file uploaded!");

        const fileName = req.file.filename;
        const fileType = req.params.file_type;

        let updateField = {};

        if (fileType === "resume") {
            updateField = { $set: { document: fileName } };
        } else if (fileType === "profile_picture") {
            updateField = { $set: { profile_picture: fileName } };
        } else {
            throw new Error("Invalid file type!");
        }

        const result = await userModel.updateOne(
            { "email.userEmail": req.user.email.userEmail },
            updateField
        );

        if (result.modifiedCount === 0)
            throw new Error("User not found or file not saved!");

        res.status(202).json({
            message: `${fileType} uploaded successfully!`,
            fileName,
            uploadDest: `uploads/${fileType}/${fileName}`
        });

    } catch (err) {
        console.log("File upload error:", err);
        res.status(500).json({
            message: "File upload failed!",
            error: err.message
        });
    }
};

// -------------------- Fetch Profile --------------------
export const fetchProfile = async (req, res) => {
    try {
        const userData = await userModel.findOne({
            "email.userEmail": req.user.email.userEmail
        });

        if (!userData) throw ("Unable to load profile!");

        res.status(200).json({
            message: "Profile loaded!",
            userData
        });

    } catch (err) {
        console.log("Profile fetch error:", err);
        res.status(401).json({ message: "Unable to fetch profile!", err });
    }
};

// -------------------- Add Bio --------------------
export const addBio = async (req, res) => {
    try {
        const { bio } = req.body;

        await userModel.updateOne(
            { "email.userEmail": req.user.email.userEmail },
            { $set: { bio } }
        );

        res.status(202).json({ message: "Bio updated!" });

    } catch (err) {
        console.log("Bio update error:", err);
        res.status(500).json({
            message: "Failed to update bio!",
            err
        });
    }
};

// -------------------- Delete Resume --------------------
export const deleteResume = async (req, res) => {
    try {
        const result = await userModel.updateOne(
            { "email.userEmail": req.user.email.userEmail },
            { $set: { document: "" } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: "Resume not found!" });
        }

        res.status(200).json({ message: "Resume deleted!" });

    } catch (err) {
        res.status(500).json({
            message: "Failed to delete resume!",
            error: err.message
        });
    }
};


{/*

import nodemailer from "nodemailer"
import dotenv from "dotenv"
import { redisClient } from "../utils/redisClient.js"
import { userModel } from "../models/userSchema.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { jobModel } from "../models/jobSchema.js"

dotenv.config({ path: "./config.env" })

// to send a email we need a transporter 

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',   // Gmail SMTP
    port: 465,                // 465 for SSL, 587 for STARTTLS
    secure: true,             // true for 465, false for 587
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASSWORD,
    }
});

function genrateRandomNumber() {
    return Math.floor((Math.random() * 9000) + 1000).toString()
}

async function sendOTP(email) {
    try {

        let otp = genrateRandomNumber()

        let emailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: "your otp to verify email address | valid for 5 mins !",
            text: `your otp is ${otp} !`,
        }

        await transporter.sendMail(emailOptions)

        redisClient.setEx(`email:${email}`, 300, otp)

        return { messag: "otp sent successfully !", status: true }

    } catch (err) {
        console.log("error sending otp : ", err)
        return { message: "unable to send otp !", status: false }
    }
}


async function sendOTPForPasswordReset(email) {
    try {

        let otp = genrateRandomNumber()

        let emailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Password Reset Request !",
            text: `your otp is ${otp} valid for 5 mins please use this otp to reset your password !`,
        }

        await transporter.sendMail(emailOptions)

        redisClient.setEx(`emailPasswordReset:${email}`, 300, otp)

        console.log("otp is : ", otp)

        return { messag: "otp sent successfully !", status: true }

    } catch (err) {
        console.log("error sending otp : ", err)
        return { message: "unable to send otp !", status: false }
    }
}

let test = (req, res) => {
    res.status(200).json({ message: "welcome to user test route !" })
}

let handleUserRegister = async (req, res) => {
    try {
        let { name, phone, email, street, city, state, country, pincode, dob, password } = req.body

        if (!name || !phone || !email || !street || !city || !state || !country || !pincode || !dob || !password) throw ("invalid/missing data !")

        // check if user exits
        let checkIfUserExits = await userModel.findOne({ $or: [{ "email.userEmail": email }, { "phone": phone }] })

        // if found then error
        if (checkIfUserExits) throw ("uanble to register user please change email/phone and try again !")

        let emailObejct = {
            userEmail: email, verified: false
        }

        // to send otp
        let result = await sendOTP(email)

        if (!result.status) throw (`unable to send otp at ${email} | ${result.message}`)

        let address = {
            street, city, state, country, pincode
        }

        // create user object
        let newUser = new userModel({ name, phone, email: emailObejct, address, dob, password })

        await newUser.save();

        res.status(202).json({ message: `user registered successfully please verify the email using otp that is sent on email ${email}` })

    } catch (err) {
        console.log("error while registering user : ", err)
        res.status(400).json({ message: "unable to register user !", err })
    }
}

const handleOTPVerification = async (req, res) => {
    try {

        let { email, userOtp } = req.body;

        // check if email exits
        let emailExits = await userModel.findOne({ "email.userEmail": email })

        if (!emailExits) throw (`email ${email} is not registred !`)

        let storedOtp = await redisClient.get(`email:${email}`)

        if (!storedOtp) throw ("otp is expried/not found !")

        if (storedOtp != userOtp) throw ("invalid otp !")

        console.log('otp matched successfully !')

        // change verification status to true
        let updateUserObject = await userModel.updateOne({ "email.userEmail": email }, { $set: { "email.verified": true } })

        console.log(updateUserObject)

        // remove the temp otp
        redisClient.del(`email:${email}`)

        res.status(202).json({ message: "otp verified successfully please head to login !" })

    } catch (err) {
        console.log("error while verifying the otp : ", err)
        res.status(500).json({ message: "failed to verify user otp please try again later !", err })
    }
}


const handleUserLogin = async (req, res) => {
    try {

        let { email, password } = req.body

        let userExists = await userModel.findOne({ "email.userEmail": email })

        if (!userExists) throw ("unable to find the email please register the user first !")

        if (!userExists.email.verified) {

            // to send otp
            let result = await sendOTP(email)

            if (!result.status) throw (`unable to send otp at ${email} | ${result.message}`)

            // redirect user to email verification route

            throw (`user email is not verfied we have sent an otp at ${email} !`)
        }

        // compare password

        let result = await bcrypt.compare(password, userExists.password)

        if (!result) throw ("invalid email/password !")

        // create jwt and send to user 

        let token = await jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: "24hr" })

        res.status(202).json({ message: `welcome user ${userExists.name} ! login was successfull.`, token })

    } catch (err) {
        console.log("error while login : ", err)
        res.status(400).json({ message: "unable to login", err })
    }
}

const handleResetPasswordRequest = async (req, res) => {
    try {

        let { email } = req.body;

        console.log(req.body)

        if (!email) throw ("invalid/incomplete data !")

        let userExists = await userModel.findOne({ "email.userEmail": email })

        if (!userExists) throw ("invalid email address/Please register first !")

        let result = await sendOTPForPasswordReset(email)

        if (!result.status) throw (`unable to send otp at ${email} | ${result.message}`)

        res.status(201).json({ messag: `an otp sent to your email ${email} | valid for 5 mins to reset your password !` })

    } catch (err) {
        console.log("password reset request failed !", err)
        res.status(400).json({ messag: "password reset request failed !", err })
    }
}


const handleOTPForPasswordReset = async (req, res) => {
    try {

        let { email, otp, password } = req.body;

        console.log(req.body)

        // check if email exits
        let emailExits = await userModel.findOne({ "email.userEmail": email })

        if (!emailExits) throw (`email ${email} is not registred !`)

        let storedOtp = await redisClient.get(`emailPasswordReset:${email}`)

        if (!storedOtp) throw ("otp is expried/not found !")

        if (storedOtp != otp) throw ("invalid otp !")

        console.log('otp matched successfully for password reset !')

        // encrypt

        let hash = await bcrypt.hash(password, 10)

        // change verification status to true
        let updateUserObject = await userModel.updateOne({ "email.userEmail": email }, { $set: { "password": hash } })

        console.log(updateUserObject)

        // remove the temp otp
        redisClient.del(`emailPasswordReset:${email}`)

        res.status(202).json({ message: "otp verified successfully and password has been changed please head to login !" })

    } catch (err) {
        console.log("error while verifying the otp : ", err)
        res.status(500).json({ message: "failed to verify user otp please try again later !", err })
    }
}

const handleUserFileUpload = async (req, res) => {
    try {
        if (!req.file) throw new Error("Failed to upload a file!");
        const fileName = req.file.filename;
        const fileType = req.params.file_type; // 'resume' or 'profile_pictures'

        // Determine which field to update
        let updateField = {};

        if (fileType === "resume") {
            updateField = { $set: { document: fileName } };
        } else if (fileType === "profile_picture") {
            updateField = { $set: { profile_picture: fileName } };
        } else {
            throw new Error("Invalid file type. Only 'resume' or 'profile_pictures' allowed.");
        }

        // Update the user document
        const result = await userModel.updateOne(
            { "email.userEmail": req.user.email.userEmail },
            updateField
        );

        if (result.modifiedCount === 0) {
            throw new Error("User not found or file not saved.");
        }

        const uploadDest = `uploads/${fileType}/${fileName}`;

        res.status(202).json({
            message: `${fileType === "resume" ? "Resume" : "Profile picture"} uploaded successfully!`,
            fileName,
            uploadDest,
        });

    } catch (err) {
        console.error("Error in handleUserFileUpload:", err);
        res.status(500).json({
            message: "Failed to upload the file.",
            error: err.message || err,
        });
    }
};

const fetchProfile = async (req, res) => {
    try {
        let user = req.user

        let userData = await userModel.findOne({ "email.userEmail": user.email.userEmail })

        if (!userData) throw ("unable to load user profile !")

        res.status(200).json({ message: "got user profile data !", userData })

    } catch (err) {
        console.log("unable to user profile : ", err)
        res.state(401).json({ message: "unable to send user profile data !", err })
    }
}

const addBio = async (req, res) => {
    try {

        let user = req.user

        let { bio } = req.body

        if (!user) throw ("not validated as user | please relogin")

        await userModel.updateOne({ "email.userEmail": user.email.userEmail }, { $set: { bio: bio } })

        res.status(202).json({ message: "bio update successfully !" })
    } catch (err) {
        console.log("error while updating user bio : ", err)
        res.status(500).json({ message: "failed to update bio", err })
    }
    let user = req.user
}

export const deleteResume = async (req, res) => {
    try {
        const result = await userModel.updateOne(
            { "email.userEmail": req.user.email.userEmail },
            { $set: { document: "" } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: "Resume not found!" });
        }

        res.status(200).json({ message: "Resume deleted successfully!" });

    } catch (err) {
        res.status(500).json({
            message: "Failed to delete resume!",
            error: err.message
        });
    }
};

export { test, handleUserRegister, handleOTPVerification, handleUserLogin, handleResetPasswordRequest, handleOTPForPasswordReset, handleUserFileUpload, fetchProfile, addBio }
*/}
{/*import nodemailer from "nodemailer"
import dotenv from "dotenv"
import { redisClient } from "../utils/redisClient.js"
import { userModel } from "../models/userSchema.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

dotenv.config({ path: "./config.env" })

// to send a email we need a transporter 

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',   // Gmail SMTP
    port: 465,                // 465 for SSL, 587 for STARTTLS
    secure: true,             // true for 465, false for 587
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASSWORD,
    }
});

function genrateRandomNumber() {
    return Math.floor((Math.random() * 9000) + 1000).toString()
}

async function sendOTP(email) {
    try {

        let otp = genrateRandomNumber()

        let emailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: "your otp to verify email address | valid for 5 mins !",
            text: `your otp is ${otp} !`,
        }

        await transporter.sendMail(emailOptions)

        redisClient.setEx(`email:${email}`, 300, otp)

        return { messag: "otp sent successfully !", status: true }

    } catch (err) {
        console.log("error sending otp : ", err)
        return { message: "unable to send otp !", status: false }
    }
}


async function sendOTPForPasswordReset(email) {
    try {

        let otp = genrateRandomNumber()

        let emailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: "Password Reset Request !",
            text: `your otp is ${otp} valid for 5 mins please use this otp to reset your password !`,
        }

        await transporter.sendMail(emailOptions)

        redisClient.setEx(`emailPasswordReset:${email}`, 300, otp)

        return { messag: "otp sent successfully !", status: true }

    } catch (err) {
        console.log("error sending otp : ", err)
        return { message: "unable to send otp !", status: false }
    }
}

let test = (req, res) => {
    res.status(200).json({ message: "welcome to user test route !" })
}

let handleUserRegister = async (req, res) => {
    try {
        let { name, phone, email, street, city, state, country, pincode, dob, password } = req.body

        if (!name || !phone || !email || !street || !city || !state || !country || !pincode || !dob || !password) throw ("invalid/missing data !")

        // check if user exits
        let checkIfUserExits = await userModel.findOne({ $or: [{ "email.userEmail": email }, { "phone": phone }] })

        // if found then error
        if (checkIfUserExits) throw ("uanble to register user please change email/phone and try again !")

        let emailObejct = {
            userEmail: email, verified: false
        }

        // to send otp
        let result = await sendOTP(email)

        if (!result.status) throw (`unable to send otp at ${email} | ${result.message}`)

        let address = {
            street, city, state, country, pincode
        }

        // create user object
        let newUser = new userModel({ name, phone, email: emailObejct, address, dob, password })

        await newUser.save();

        res.status(202).json({ message: `user registered successfully please verify the email using otp that is sent on email ${email}` })

    } catch (err) {
        console.log("error while registering user : ", err)
        res.status(400).json({ message: "unable to register user !", err })
    }
}

const handleOTPVerification = async (req, res) => {
    try {

        let { email, userOtp } = req.body;

        // check if email exits
        let emailExits = await userModel.findOne({ "email.userEmail": email })

        if (!emailExits) throw (`email ${email} is not registred !`)

        let storedOtp = await redisClient.get(`email:${email}`)

        if (!storedOtp) throw ("otp is expried/not found !")

        if (storedOtp != userOtp) throw ("invalid otp !")

        console.log('otp matched successfully !')

        // change verification status to true
        let updateUserObject = await userModel.updateOne({ "email.userEmail": email }, { $set: { "email.verified": true } })

        console.log(updateUserObject)

        // remove the temp otp
        redisClient.del(`email:${email}`)

        res.status(202).json({ message: "otp verified successfully please head to login !" })

    } catch (err) {
        console.log("error while verifying the otp : ", err)
        res.status(500).json({ message: "failed to verify user otp please try again later !", err })
    }
}


const handleUserLogin = async (req, res) => {
    try {

        let { email, password } = req.body

        let userExists = await userModel.findOne({ "email.userEmail": email })

        if (!userExists) throw ("unable to find the email please register the user first !")

        if (!userExists.email.verified) {

            // to send otp
            let result = await sendOTP(email)

            if (!result.status) throw (`unable to send otp at ${email} | ${result.message}`)

            // redirect user to email verification route

            throw (`user email is not verfied we have sent an otp at ${email} !`)
        }

        // compare password

        let result = await bcrypt.compare(password, userExists.password)

        if (!result) throw ("invalid email/password !")

        // create jwt and send to user 

        let token = await jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: "24hr" })

        res.status(202).json({ message: `welcome user ${userExists.name} ! login was successfull.`, token })

    } catch (err) {
        console.log("error while login : ", err)
        res.status(400).json({ message: "unable to login", err })
    }
}

const handleResetPasswordRequest = async (req, res) => {
    try {

        let { email } = req.body;

        if (!email) throw ("invalid/incomplete data !")

        let userExists = await userModel.findOne({ "email.userEmail": email })

        if (!userExists) throw ("invalid email address/Please register first !")

        let result = await sendOTPForPasswordReset(email)

        if (!result.status) throw (`unable to send otp at ${email} | ${result.message}`)

        res.status(201).json({ messag: `an otp sent to your email ${email} | valid for 5 mins to reset your password !` })

    } catch (err) {
        console.log("password reset request failed !", err)
        res.status(400).json({ messag: "password reset request failed !", err })
    }
}


const handleOTPForPasswordReset = async (req, res) => {
    try {

        let { email, userOtp, newPassword } = req.body;

        // check if email exits
        let emailExits = await userModel.findOne({ "email.userEmail": email })

        if (!emailExits) throw (`email ${email} is not registred !`)

        let storedOtp = await redisClient.get(`emailPasswordReset:${email}`)

        if (!storedOtp) throw ("otp is expried/not found !")

        if (storedOtp != userOtp) throw ("invalid otp !")

        console.log('otp matched successfully for password reset !')

        // encrypt

        let hash = await bcrypt.hash(newPassword, 10)

        // change verification status to true
        let updateUserObject = await userModel.updateOne({ "email.userEmail": email }, { $set: { "password": hash } })

        console.log(updateUserObject)

        // remove the temp otp
        redisClient.del(`emailPasswordReset:${email}`)

        res.status(202).json({ message: "otp verified successfully and password has been changed please head to login !" })

    } catch (err) {
        console.log("error while verifying the otp : ", err)
        res.status(500).json({ message: "failed to verify user otp please try again later !", err })
    }
}

const handleUserFileUpload = async (req, res) => {
    try {
        if (!req.file) throw new Error("Failed to upload a file!");

        const fileName = req.file.filename;
        const fileType = req.params.file_type; // 'resume' or 'profile_pictures'

        // Determine which field to update
        let updateField = {};

        if (fileType === "resume") {
            updateField = { $push: { documents: fileName } };
        } else if (fileType === "profile_picture") {
            updateField = { $set: { profile_picture: fileName } };
        } else {
            throw new Error("Invalid file type. Only 'resume' or 'profile_pictures' allowed.");
        }

        // Update the user document
        const result = await userModel.updateOne(
            { "email.userEmail": req.user.email.userEmail },
            updateField
        );

        if (result.modifiedCount === 0) {
            throw new Error("User not found or file not saved.");
        }

        const uploadDest = `uploads/${fileType}/${fileName}`;

        res.status(202).json({
            message: `${fileType === "resume" ? "Resume" : "Profile picture"} uploaded successfully!`,
            fileName,
            uploadDest,
        });

    } catch (err) {
        console.error("Error in handleUserFileUpload:", err);
        res.status(500).json({
            message: "Failed to upload the file.",
            error: err.message || err,
        });
    }
};

const fetchProfile = async (req, res) => {
    try {
        let user = req.user

        let userData = await userModel.findOne({ "email.userEmail": user.email.userEmail })

        if (!userData) throw ("unable to load user profile !")

        res.status(200).json({ message: "got user profile data !", userData })

    } catch (err) {
        console.log("unable to user profile : ", err)
        res.state(401).json({ message: "unable to send user profile data !", err })
    }
}

export { test, handleUserRegister, handleOTPVerification, handleUserLogin, handleResetPasswordRequest, handleOTPForPasswordReset, handleUserFileUpload, fetchProfile }
*/}

