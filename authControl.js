import express from "express";
import User from "../models/UserSchema.js";
import jwt from "jsonwebtoken";
import bycrpt from "bcryptjs";


//Generate jwt Token for login
const geneateToken = user=>{
    return jwt.sign({id:user._id},process.env.JWT_SECREAT ,{
        expiresIn : '100m',
    })
}

//User Login Function
export const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        
        if(!email || !password) 
            return res.status(400).send({message :"Missing data"});

        //Check if user exists in the database
        var user = await User.findOne({email});

        if(user){
            //Verify password
            const validPassword = await bycrpt.compare(password ,user.password);
            
            if (!validPassword){
                return res.status(400).send({message :"Password incorrect"});
            }
        }

        const token = geneateToken( user);
        user = await User.findOne({email}).select("-password");

        return res.status(200).json({
            success : true ,
            message:"Login Successfull",
            data: user,
            accessToken : token
        });

    }catch(err){
        // console.log(err);
        return res.status(400).send({
            success : "failed",
            message : "Login Failed"
        });
        
    }
}

//User Register Function
export const signup = async (req,res)=>{
    const {email,password,name,gender,phone,bloodType} = req.body ;

    try{
        let user = null;
    
        user = await User.findOne({email});

        if(user){
            return res.status(400).json("Email is already in use");
        }

        const salt = await bycrpt.genSalt(10);
        const hashPass = await bycrpt.hash(password,salt);

        user = new User({
            name,
            email,
            password:hashPass,
            phone,
            bloodType,
            gender
        });

        await user.save();

        return res.status(200).json({
            success : true,
            message : "User Successfully Register"
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Some internal error"
        });
        // console.log(err);
    }
}

//Retreive User function
export const getAllUser = async (req,res)=>{
    try {
        var userData = null;
        userData = await User.find().select("-password");

        if(userData == null)
            return res.status(400).json({error:"No Hospital in Database"});
        
        return res.status(201).json({message:"Successfully fetched all the data",data:userData});

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:"failed",
            message:"Some Internal Error"
        });
    }
}

//Update the user data
export const updateUser = async(req,res)=>{
    try {
        const id = req.params.id;

        const user = await User.findByIdAndUpdate(id,{$set: req.body}, {new :true});
        res.status(200).json({
            success : true,
            message : "Successfully Updated",
            data : user
        })

    } catch (error) {
        res.status(500).json({success:false, message:'Failed to update'});
    }
}

export const userAppointment = async (req,res)=>{
    try {
        var userData = null;
        var updateData = {
        $push : {appointments : [req.body.appointment]} 
        }

        userData = await User.findById(req.body.user);

        if(userData.appointments.includes(req.body.appointment)){
            return res.status(400).json({message:"Conflict! Appointment already exists for this user."})
        }

        userData = await User.findByIdAndUpdate(req.body.user,updateData,{ new: true })
        
        return res.status(201).json({message:"Successfully Updated the Appointment",data:userData});

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:false,
            message:"Some Internal Error"
        });
    }
}

//Retreive Single User
export const getUser = async (req,res)=>{
    try {
        var userData = await User.findById(req.params.id).select("-password");

        if(userData == null)
            return res.status(400).json({error:"No User in Database"});
        
        return res.status(201).json({message:"Successfully fetched the data",data:userData});

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:"failed",
            message:"Some Internal Error"
        });
    }
}