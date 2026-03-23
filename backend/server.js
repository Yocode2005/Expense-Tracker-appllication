import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
dotenv.config({
    path: './.env'
})
const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// DB connection
connectDB();

// routes
app.get('/',(req,res) => {
        res.send('Hello World!');
})

app.listen(PORT,() => {console.log(`Server is running on port ${PORT}`)})
