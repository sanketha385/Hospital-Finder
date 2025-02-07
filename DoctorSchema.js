import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number
    },

    specialization: {
        type: String
    },
    qualifications: {
        type: Array
    },
    available :{
        type: Boolean,
    },
    timeSlots: {
        type: Array
    },

    appointments: [
        {
            type: mongoose.Types.ObjectId
        }
    ]
});

export default mongoose.model("Doctor", DoctorSchema);
