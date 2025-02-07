import express from "express";
import Doctor from "../models/DoctorSchema.js";

//Function to Insert Doctor Data into Database
export const signup = async (req,res)=>{
    try{
        const email = req.body.email ;

        let doc = null;
        doc = await Doctor.findOne({email});

        if(doc){
            return res.status(400).json("Already Registered");
        }

        doc = new Doctor(req.body);
        await doc.save();

        return res.status(200).json({
            success : true,
            message : "Doctor Successfully Register",
            data: doc
        });

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Some internal error"
        });
        // console.log(err);
    }
}


//Function to Retrieve All Doctors data from Database
export const getAll = async (req,res)=>{
    try {
        var doctorData = null;
        doctorData = await Doctor.find();

        if(doctorData == null)
            return res.status(400).json({error:"No Hospital in Database"});
        
        return res.status(201).json({message:"Successfully fetched all the data",data:doctorData});

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:"failed",
            message:"Some Internal Error"
        });
    }
}

//Function to update doctor data into Database
export const doctorAppointment = async (req,res)=>{
    try {
        var doctorData = null;
        var updateData = {
            $push : {appointments : [req.body.appointment]} 
            }

        doctorData = await Doctor.findById(req.body.doctor);

        if(doctorData.appointments.includes(req.body.appointment)){
            return res.status(400).json({message:"Conflict! Appointment already exists for this Doctor."})
        }

        doctorData = await Doctor.findByIdAndUpdate(req.body.doctor,updateData,{ new: true });
        
        return res.status(201).json({message:"Successfully Updated the Appointment",data:doctorData});

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:false,
            message:"Some Internal Error"
        });
    }
}

export const updateDoctor = async(req,res)=>{
    try {
        var doctorData = await Doctor.findByIdAndUpdate(req.params.id,{$set : req.body});

        return res.status(201).json({message:"Successfully Updated the Appointment",data:doctorData});
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message:"Some Internal Error"
        });
    }
}