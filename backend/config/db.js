import mongoose from "mongoose"; 

export const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://nk946432_db_user:3ARfbCOF0ghUp5CP@cluster0.sy1yqdu.mongodb.net/Job")
    .then(()=>{
        console.log("Connected to DB");
    })
}