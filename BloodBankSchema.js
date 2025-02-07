import mongoose from "mongoose";

const BloodBankSchema = new mongoose.Schema(
  {
    name: 
    { 
      type: String, 
      required: true 
    },
    address:{
      type: String,
      required:true
    },
    thumbnail:{
      type:String,
      default : "https://i.postimg.cc/3JPpJsbF/dummy-hospital.webp"
    },
    contact:{
      type:Number,
      required:true
    },
    direction:{
      type:String,
      required :true
    }

  },
  { timestamps: true }
);

export default mongoose.model("Blood Bank", BloodBankSchema);
