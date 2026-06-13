import express from 'express'
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.routes.js';

const app = express();
const PORT = 5000;


//db

connectDB();

//middlewares

app.use(cors());
app.use(express.json());


//routes
app.use("/api/auth",authRouter)

app.get('/',(req,res)=>{
    res.send('Api working');
})

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});