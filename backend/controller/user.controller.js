import User from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
//get user profile

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        res.status(200).json({
            success: true,
            user
        })
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

//update user profile

export const updateProfile = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;

        if (req.file && req.user.role == "user") {
            const originalName = req.file.originalname;
            const extension = originalName.split('.').pop().toLowerCase();

            // Sanitized filename but keep the extension for raw files
            const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
            const sanitizedBase = nameWithoutExt.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9\-_]/g, "");
            const sanitizedFileName = `${sanitizedBase}.${extension}`;

            // Determine resource type: images should be 'image', docs/pdfs often safer as 'raw' for delivery
            const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(extension);
            const resourceType = isImage ? "image" : "raw";

            const uploadResult = await uploadToCloudinary(req.file.buffer, "jobportal/resume", resourceType, sanitizedFileName);

            if(uploadResult){
                updateData.resume = uploadResult.secure_url;
                updateData.resumePublicId = uploadResult.public_id;
            }
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}