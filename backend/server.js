import express from 'express'
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import companyRouter from './routes/company.routes.js';
import jobRouter from './routes/jobs.routes.js';
import applicationRouter from './routes/applications.routes.js';

const app = express();
const PORT = 5000;


//db

connectDB();

//middlewares

app.use(cors());
app.use(express.json());
app.use('/upload',express.static("uploads"))

//routes
app.use("/api/auth",authRouter)
app.use('/api/user',userRouter);
app.use('/api/company',companyRouter);
app.use('/api/job',jobRouter);
app.use('/api/application',applicationRouter);

app.get('/',(req,res)=>{
    res.send('Api working');
})


app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});