import Express from "express";
import BloodBank from "../models/BloodBankSchema.js";
import Donars from "../models/DonarsSchema.js";

export const addData = async(req, res) => {
    try {
        const name = req.body.name;
        var bloodbankData = await BloodBank.findOne({name});

        if (bloodbankData) 
            return res.status(400).send({error: "Blood Bank already Exist"});
        
        bloodbankData = new BloodBank(req.body);
        await bloodbankData.save();

        return res
            .status(200)
            .json({success: true, message: "Blood Bank Successfully Register"})

    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({success: false, message: "Some internal error"});
    }
}

export const getAll = async(req, res) => {
    try {
        let bloodbanks = await BloodBank.find()
        return res
            .status(200)
            .json({success: true, data: bloodbanks, message: "Data Fetch Successfull"})
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({success: false, message: "Some Internal Server Error"});
    }

}

export const getDonars = async(req, res) => {
    try {
        let donars = await Donars.find()
        return res
            .status(200)
            .json({success: true, count: donars.length ,data: donars , message: 'Donar List fetched successfully'})
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({success: false, message: 'Error in fetching the list of donars'});
    }
}

export const addDonar = async(req,res)=>{
    try {
        let donars = new Donars(req.body);
        await donars.save();

        return res.status(200).json({
            success : true,
            data : donars,
            message : "Donar added successfully."
        })
    } catch (error) {
        return res.status(400).json({
            success : false,
            error : error.message,
            message : "Some internal error"
        });
    }
}