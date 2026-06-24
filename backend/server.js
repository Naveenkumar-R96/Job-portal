import express from 'express'
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import companyRouter from './routes/company.routes.js';
import jobRouter from './routes/jobs.routes.js';
import applicationRouter from './routes/applications.routes.js';
import interviewRouter from './routes/interview.routes.js';
import savedRouter from './routes/saved.routes.js';
import inquiryRouter from './routes/inquiry.routes.js';

const app = express();
const PORT = 5000;


//db

connectDB();

//middlewares

app.use(cors({
    origin:["http://localhost:5173","http://localhost:5174"],
    credentials:true
}));
app.use(express.json());
app.use('/upload',express.static("uploads"))

//routes
app.use("/api/auth",authRouter)
app.use('/api/user',userRouter);
app.use('/api/company',companyRouter);
app.use('/api/job',jobRouter);
app.use('/api/application',applicationRouter);
app.use('/api/interview',interviewRouter);
app.use('/api/saved',savedRouter);
app.use('/api/inquiry',inquiryRouter);
app.get('/',(req,res)=>{
    res.send('Api working');
})


app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});