import express from "express";
import Booking from "../models/BookingSchema.js";
import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const appointment = async (req,res)=>{
    try {
        var appointSchedule = null;
        const {doctor,user,appointmentDate} = req.body;

        if(!doctor || !user || !appointmentDate){
            return res.status(400).json({
                status : "False",
                message:"Enter Appropriate Details"
            });
        }

        appointSchedule = new Booking(req.body);
        
        await appointSchedule.save();

        return res.status(200).json({
            success : true,
            messgae : "Appointment Schedule Successfull",
            data:appointSchedule
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Some internal error"
        });
    }
}

//Get all the bookings of a particular user
export const getAllMyAppointments = async(req , res)=> {
    try {
        const userAppointment = await Booking.find({user : req.params.id});
        //console.log("userAppointment===>",userAppointment);
        if (!userAppointment) {
            return res.status(404).json({
                status: false,
                message:'No Appointment Found'
            });
        }
        return res.status(200).json({
            status : true,
            count : userAppointment.length,
            data : userAppointment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Some internal error"
        });
    }
}

export const getAllbyhospital = async(req , res)=> {
    try {
        const userAppointment = await Booking.find({hospital : req.params.id});
        //console.log("userAppointment===>",userAppointment);
        if (userAppointment.length === 0) {
            return res.status(404).json({
                status: false,
                message:'No Appointment Found'
            });
        }
        return res.status(200).json({
            status : true,
            count : userAppointment.length, 
            data : userAppointment
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Some internal error"
        });
    }
}

//Update Appointment

export const updateData = async (req,res)=>{
    try {
        let appointment=await Booking.findByIdAndUpdate(req.params.bookId,{$set : req.body},{new:true}).catch((error)=>{
            console.log("Error in updating",error);
        });

        return res.status(200).json({
            message : "Updated Successfully",
            status : true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Some internal error"
        });
    }
}