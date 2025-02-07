import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema(
  {
    name: 
    { 
      type: String, 
      required: true 
    },
    username:{
      type : String,
      required:true
    },
    password : {
      type:String,
      required : true
    },
    rating:{
      type : Number ,
      default : 0
    },
    address:{
      type: String,
      required:true
    },
    pincode:{
      type:Number,
      required:true
    },
    services:[
      {
        type:String
      }
    ],
    thumbnail:{
      type:String,
      default : "https://i.postimg.cc/3JPpJsbF/dummy-hospital.webp"
    },
    images:[
      {
        type:String
      }
    ],
    contact:{
      type:Number,
      required:true
    },
    doctors : {
      type: [mongoose.Types.ObjectId]
    },
    direction:{
      type:String,
      required :true
    },
    latitude :{
      type:Number
    },
    longitude:{
      type:Number
    },
    ambulance :{
      type : Number
    }

  },
  { timestamps: true }
);

export default mongoose.model("Hospital", HospitalSchema);
