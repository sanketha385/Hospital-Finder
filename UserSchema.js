import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    // photo: { type: String },
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    bloodType: {
        type: String
    },
    dob: {
        type: Date
    },

});

export default mongoose.model("User", UserSchema);
