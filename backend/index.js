import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api',authRouter)

const serverPort = process.env.PORT;
app.listen(serverPort, ()=> {
    console.log("server is running on port:", serverPort)
})