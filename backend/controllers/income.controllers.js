import {Income} from '../models/income.model.js';
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";

// Controller function to add income
const addIncome = asyncHandler(async(req, res) => {
    // todolist: validate data coming from frontend
    // todolist: create income entry in db
    //todolist : save the income entry to the database
    // todolist: send response to frontend
    const userId = req.user._id;
    const {description, amount, category, date} = req.body;
try {
    if(!description || !amount || !category || !date){
        throw new ApiError(400, "All fields are required")
    }
    const newIncome = await Income.create({
        userId,
        description,
        amount,
        category,
        date : new Date(date), // convert date string to Date object    
    });
    if(!newIncome){
        throw new ApiError(500, "Failed to add income")
    }
    await newIncome.save(); // save the new income to the database
    res.status(201).json(new ApiResponse(true, "Income added successfully", newIncome))

   

} catch (error) {
    throw new ApiError(500, "Error while adding income")
}
});

// Controller function to get all income entries of a user
const getAllIncomes = asyncHandler(async(req, res) => {
    // todolist: get user id from req.user
    // todolist: fetch all income entries of the user from db
    // todolist: send response to frontend
    const userId = req.user._id;
    try {
        const incomes = await Income.find({userId}).sort({createdAt : -1});
        res.status(200).json(new ApiResponse(true, "Incomes fetched successfully", incomes))
    } catch (error) {
        throw new ApiError(500, "Error while fetching incomes")
    }
});

