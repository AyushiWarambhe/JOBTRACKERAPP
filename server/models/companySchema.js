import mongoose from "mongoose";
import bcrypt from "bcrypt";

let addressObject = {
    street: "", city: "", state: "", country: "", pincode: ""
}

let emailObject = {
    companyEmail: "", verified: false
}

let companySchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: Object,
        required: true,
        default: emailObject
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: Object,
        required: true,
        default: addressObject
    },
    description: {
        type: String,
        default: ""
    },
    postedJobs: {
        type: Array,
        default: []
    },
    verifiedJobs: {
        type: Array,
        default: []
    },
    timeStamp: {
        type: Date,
        default: Date.now()
    }
})

// Hash password before saving
companySchema.pre("save", async function () {
    try {
        console.log("company password is :", this.password)
        this.password = await bcrypt.hash(this.password, 10)
        console.log("company password hashed and saved!")
    } catch (err) {
        console.log("error in company pre-save hook:", err)
        throw err;
    }
})

let companyModel = new mongoose.model("companies", companySchema)

export { companyModel }
