import mongoose from "mongoose";

const DonarsSchema = new mongoose.Schema({
    name: {
        type: String
    },
    address: {
        type: String
    },
    bloodType: {
        type: String
    },
    contact: {
        type: Number
    },
    history: {
        type: String,
        default: "No data"
    }

}, {timestamps: true});

export default mongoose.model("Blood Donars", DonarsSchema);
