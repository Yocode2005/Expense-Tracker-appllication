import {Income} from '../models/income.model.js';
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";

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

