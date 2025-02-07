import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import hospitalData from "./Router/hospitalRoute.js";
import userRoute from "./Router/userRoute.js";
import doctorRoute from "./Router/doctorRoute.js";
import appointment from "./Router/appointmentRoute.js";
import bloodBank from './Router/bloodbankRoute.js';



dotenv.config();
const URI = process.env.MURI ;      //MongoDb URI

//Rest Object
const app = express();
const port = process.env.PORT || 8000 ;

const corsOption ={
    origin : true
}


//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));


//Connecting to MongoDB Database
mongoose.set('strictQuery',false);
const connection = async()=>{
    try{
        await mongoose.connect(URI)
        console.log("Mongoose Database Connection Successfull".bgYellow.white);

    }catch(err){
        console.log("Connection error ",err);
    }
}

//Routes
app.use('/api/auth', userRoute);
app.use('/api/data', hospitalData ,bloodBank);
app.use('/api/doctor',doctorRoute);
app.use('/api/appointment',appointment);

//Listen
app.listen(port,()=>{
    connection();
    console.log(`Node Server is running on port ${port}`.bgBlue.white);
})