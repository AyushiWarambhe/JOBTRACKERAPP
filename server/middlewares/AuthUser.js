import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "../models/userSchema.js";

dotenv.config({ path: "./config.env" });

const AuthUser = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token) return res.status(401).json({ message: "Token not found! Please login." });

        // Remove "Bearer " prefix if present
        if (token.startsWith("Bearer ")) token = token.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await userModel.findOne({ "email.userEmail": decoded.email });

        if (!user) return res.status(401).json({ message: "User not found!" });
        if (!user.email.verified) return res.status(401).json({ message: "Email not verified!" });

        req.user = user;
        next();

    } catch (err) {
        console.log("Auth failed:", err);
        // If token expired, return specific message
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please login again." });
        }
        res.status(401).json({ message: "Authentication failed. Please login." });
    }
};

export { AuthUser };



{/*import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "../models/userSchema.js";

dotenv.config({ path: "./config.env" });

const AuthUser = async (req, res, next) => {
    try {
        // Header is lowercase in Node
        let userToken = req.headers.authorization;

        if (!userToken) throw "Token not found!";

        // Remove "Bearer " if it exists
        if (userToken.startsWith("Bearer ")) {
            userToken = userToken.split(" ")[1];
        }

        // Verify token
        const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);

        // Find user by email
        const user = await userModel.findOne({ "email.userEmail": decoded.email });
        if (!user) throw "User not found!";
        if (!user.email.verified) throw "Email not verified!";

        req.user = user;
        next();
    } catch (err) {
        console.log("Auth failed :", err);
        res.status(401).json({ message: "Authentication failed. Please login again!" });
    }
};

export { AuthUser };
*/}

{/*import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userModel } from "../models/userSchema.js";

dotenv.config({ path: "./config.env" });

const AuthUser = async (req, res, next) => {
  try {
    // Accept all cases
    let userToken =
      req.headers.authorization ||
      req.headers.Authorization ||
      req.headers["authorization"];

    if (!userToken) {
      return res.status(401).json({ message: "Token missing!" });
    }

    // Remove Bearer prefix
    if (userToken.startsWith("Bearer ")) {
      userToken = userToken.split(" ")[1];
    }

    // Verify token
    const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);

    // Find user
    const user = await userModel.findOne({
      "email.userEmail": decoded.email,
    });

    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    if (!user.email.verified) {
      return res.status(401).json({
        message: "Email not verified!",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Auth error:", err);
    res.status(401).json({ message: "Unauthorized!" });
  }
};

export { AuthUser };
*/}


{/*
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { userModel } from "../models/userSchema.js"

dotenv.config({ path: "./config.env" })

const AuthUser = async (req, res, next) => {
    try {
        // Header must be lowercase
       // let userToken = req.headers.authorization;

         let userToken =
             req.headers.authorization ||
             req.headers.Authorization ||
             req.headers["authorization"];


        if (!userToken) throw ("Token not found!");

        // If token starts with 'Bearer ' remove it
        if (userToken.startsWith("Bearer ")) {
            userToken = userToken.split(" ")[1];
        }

        // Verify the token
        const decoded = jwt.verify(userToken, process.env.JWT_SECRET_KEY);

        // Find user using email inside token
        const user = await userModel.findOne({ "email.userEmail": decoded.email });

        if (!user) throw ("User not found!");

        if (!user.email.verified) {
            throw ("Email not verified. Please verify first!");
        }

        req.user = user;
        next();

    } catch (err) {
        console.log("Auth failed :", err);
        res.status(401).json({ message: "Authentication failed. Please login again!" });
    }
};

export { AuthUser };

*/}
{/*
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { userModel } from "../models/userSchema.js"

dotenv.config({ path: "./config.env" })

const AuthUser = async (req, res, next) => {
    try {
        // FIX #1 → header must be lowercase
        let authHeader = req.headers.authorization;

        if (!authHeader) {
            throw "Authorization header missing!";
        }

        // FIX #2 → Extract token after "Bearer "
        let userToken = authHeader.split(" ")[1];

        if (!userToken) {
            throw "Token missing!";
        }

        // FIX #3 → Use your JWT secret key
        let result = jwt.verify(userToken, process.env.JWT_SECRET_KEY);

        // FIX #4 → your DB query is wrong: email.userEmail ??
        let user = await userModel.findOne({ email: result.email });

        if (!user) throw "User not found!";
        if (!user.verified) throw "Email not verified!";

        req.user = user;
        next();

    } catch (err) {
        console.log("Auth failed:", err);
        res.status(401).json({
            message: "Auth failed! Please login."
        });
    }
};

export { AuthUser };
*/}


{/*
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { userModel } from "../models/userSchema.js"

dotenv.config({ path: "./config.env" })

const AuthUser = async (req, res, next) => {
    try {

        let userToken = req.headers.Authorization

        if (!userToken) throw ("token not found/invalid token !")

        // verify

        let result = jwt.verify(userToken, process.env.JWT_SECRET_KEY)

        let user = await userModel.findOne({ "email.userEmail": result.email })

        if (!user) throw ("user not found !")

        if (!user.email.verified) throw ('email not verified please verify the email first to perform this action !')

        req.user = user

        next()

    } catch (err) {
        console.log("auth failed with an error : ", err)
        res.status(401).json({ message: "auth user failed please login !" })
    }
}

export { AuthUser }  */}