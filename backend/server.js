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

// import routes
import userRoutes from "./routes/user.routes.js"
import incomeRoutes from "./routes/income.routes.js"
import expenseRouter from './routes/expense.routes.js'
import dashboardRouter from './routes/dashboard.routes.js';

// routes declaration
// app.get('/',(req,res) => {
//         res.send('Hello World!');
// })
app.use("/api/users", userRoutes);
app.use("/api/incomes",incomeRoutes);
app.use("/api/expense",expenseRouter);
app.use("/api/dashboard", dashboardRouter);

app.listen(PORT,() => {console.log(`Server is running on port ${PORT}`)})
