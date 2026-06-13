import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendForgotPasswordEmail } from "../utils/emailService.js";
//to register a user

export const register = async (req, res) => {
    try {
        const { name, email, password, otp } = req.body;
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ message: "User already exists", success: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role || 'user';

        //to generate 6 digit otp

        const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationOTPExpires = Date.now() + 10 * 60 * 1000;

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: userRole,
            verificationOTP,
            verificationOTPExpiry: verificationOTPExpires
        })

        //to send the verification email

        try {
            await sendVerificationEmail(email, name, verificationOTP);
        } catch (error) {
            console.log("Failed to send verification email", error);
        }

        res.status(201).json({
            message: "User registered successfully. Please check your email for verification OTP", success: true, user: {
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: false
            }
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error", success: false

        });
    }
}


//to login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or Password"
            })
        }
        if (!user.isVerified) {
            return res.status(401).json({
                success: false,
                message: "Please verify your email address before logging in"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        //to genereate a token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error", success: false
        });
    }
}

//to verify the email

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            })
        }

        const user = await User.findOne({ email, verificationOTP: otp, verificationOTPExpires: { $gt: Date.now() } });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP or OTP has expired"
            })
        }

        user.isVerified = true;
        user.verificationOTP = undefined;
        user.verificationOTPExpiry = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully! you can now log in"
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error", success: false
        });
    }
}

// if user forgot the password

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })
        }

        const user = await findOne({ email });
        if (!user) {
            return res.staus(400).json({
                success: false,
                message: "Email not found"
            })
        }

        const resetOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const resetOTPExpires = Date.now() + 10 * 60 * 1000;

        user.resetPasswordOTP = resetOTP;
        user.resetPasswordOTPExpires = resetOTPExpires;

        try {
            await sendForgotPasswordEmail(email, user.name, resetOTP);
        } catch (error) {
            console.log("Failed to send forgot password email", error);
        }

        res.status(200).json({
            success: true,
            message: "Password reset OTP sent to your email"
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error", success: false
        });
    }
}

//to reset the password

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, OTP and new password are required"
            })
        }
        const user = await User.findOne({
            email,
            resetPasswordOTP: otp,
            resetPasswordOTPExpires: { $gt: Date.now() }
        });
        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP or OTP has expired"
            })
        }

        //to hash new password
        const hashedPassword=await bcrypt.hash(newPassword,10);
        user.password=hashedPassword;
        user.resetPasswordOTPExpiry=undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful! you can now log in with your new password"
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,success: false
        });
    }
}


