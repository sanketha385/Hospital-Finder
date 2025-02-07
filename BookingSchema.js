import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hospital: {
      type: mongoose.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    status :{
      type:String,
      enum : ["scheduled","completed"],
      default : "scheduled"
    },
    purpose :{
      type:String,
      default : "General Checkup"
    },
    timeSlot : {
      type : String
    },
    prescription : {
      type : String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
