import express from "express";
import hospitals from "../models/HospitalSchema.js";
import { ObjectId } from "mongodb";
import bycrpt from "bcryptjs";

    // Function to calculate distance between two coordinates using Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers
        return distance;
    }
    
    // currentLocation,
    // Function to filter hospitals based on distance from current location
    function filterHospitals(currentLat,currentLong,hospitals) {
        const sortedHospitals = hospitals
        .map((hospital) => (
            {
            ...hospital,
            distance: calculateDistance(currentLat,currentLong, hospital.latitude, hospital.longitude)
        }))
        .sort((a, b) => a.distance - b.distance);

    return sortedHospitals;

    }

//Function to Retrieve All Hospital Data
export const getAll = async (req,res)=>{
    try {
        var hospitalData = null;
        if(req.body.search === ""){
            hospitalData = await hospitals.find().select("-password");
        }else{
            var text = "^"+req.body.search ;
            // `/^${req.body.search}/`
            var pattern = new RegExp(text,"i");
            hospitalData = await hospitals.find({name : {$regex: pattern}}).select("-password");
        }
        const currentLat = req.body.latitude;
        const currentLong = req.body.longitude;

        const nearbyHospitals = filterHospitals(currentLat,currentLong,hospitalData);
        hospitalData = nearbyHospitals;

        if(hospitalData == null)
            return res.status(400).json({error:"No Hospital in Database"});
        
        return res.status(201).json({message:"Successfully fetched all the data",count:hospitalData.length,data:hospitalData });

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:"false",
            message:"Some Internal Error"
        });
    }
}

// Function to Get Single Hospital Details
export const hospitalLogin = async(req,res)=>{
    try{
        const {username,password} = req.body;
        
        if(!username || !password) 
            return res.status(400).send({message :"Missing data"});

        //Check if user exists in the database
        var user = await hospitals.findOne({username});

        if(user){
            //Verify password
            const validPassword = await bycrpt.compare(password ,user.password);
            
            if (!validPassword){
                return res.status(400).send({message :"Password incorrect"});
            }
        }

        // const token = geneateToken( user);
        user = await hospitals.findOne({username}).select("-password");

        return res.status(200).json({
            success : true ,
            message:"Login Successfull",
            data: user
        });

    }catch(err){
        // console.log(err);
        return res.status(400).send({
            success : "failed",
            message : "Login Failed"
        });
        
    }
}

//Function to Insert Hospital Data into Database
export const addData = async(req,res)=>{
    try {
        const name = req.body.username;
        if(!name && !req.body.password )
            return res.status(400).send({
                error:"Missing Fields"
            })
        
        var hospitalData = null;
        hospitalData = await hospitals.findOne({username : name});

        if(hospitalData)
            return res.status(400).send({error:"Hospital already Exist"});

        const salt = await bycrpt.genSalt(10);
        const hashPass = await bycrpt.hash(req.body.password,salt);

        hospitalData = new hospitals({
            name : req.body.name,
            username : req.body.username,
            password : hashPass ,
            rating : req.body.rating,
            address :req.body.address,
            pincode : req.body.pincode,
            services :req.body.services,
            thumbnail : req.body.thumbnail,
            images :req.body.images,
            contact : req.body.contact,
            doctors : req.body.doctors,
            direction : req.body.direction,
            latitude : req.body.latitude,
            longitude : req.body.longitude,
            ambulance : req.body.ambulance
        });
        await hospitalData.save();
        
        return res.status(200).json({
            success : true,
            message : "Hospital Successfully Register"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Some internal error"
        });
    }
}


//Function to Insert Hospital Data into Database
export const updateData = async (req , res) =>{
    try {
        let id = req.params.id ;
        if(!ObjectId.isValid(id)){
            return res.status(404).send().json({error:"Invalid Id"});
        }
        const hospitalData = await hospitals.findByIdAndUpdate(id,{$set:req.body},{new:true});
        return res.status(200).json({
            success : true,
            message : "Hospital Updation Successfull",
            data : hospitalData
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Some internal error"
        });
    }
}

export const upDateDoctor = async(req,res) =>{
    try {
        var hospitalData = null;
        var updateData = {
        $push : {doctors : [req.body.doctor]} 
        }

        hospitalData = await hospitals.findById(req.body.hospital);
        if(hospitalData.doctors.includes(req.body.doctor)){
            return res.status(400).json({message:"Conflict! Appointment already exists for this user."})
        }

        hospitalData = await hospitals.findByIdAndUpdate(req.body.hospital,updateData,{ new: true });
        return res.status(201).json({message:"Successfully Updated the Appointment",data:hospitalData});

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:false,
            message:"Some Internal Error"
        });
    }
}
