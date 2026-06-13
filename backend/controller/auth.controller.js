import User from "../models/user.model.js";
import bcrypt from "bcrypt";
//to register a user

export const register=async(req,res)=>{
    try{
        const{name,email,password,otp}=req.body;
        const userExist=await User.findOne({email});

        if(userExist){
            return res.status(400).json({message:"User already exists",success:false});
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const userRole=role || 'user';

        //to generate 6 digit otp

        const verificationOTP=Math.floor(100000+Math.random()*900000).toString();
        const verificationOTPExpires=Date.now()+10*60*1000;

        const user =await User.create({
            name,
            email,
            password:hashedPassword,
            role:userRole,
            verificationOTP,
            verificationOTPExpiry:verificationOTPExpires
        })

        //to send the verification email
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal server error",success:false});
    }
}