import {Income} from '../models/income.model.js';
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import getDateRange from '../utils/dateFilter.js';
import XLSX from "xlsx";

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

// Controller function to update an income entry
const updateIncome = asyncHandler(async(req, res) => {
    // todolist: get user id from req.user
    // todolist: fetch the income entry from db
    // todolist: update the income entry
    // todolist: send response to frontend
     const {id} = req.params;
    const userId = req.user._id;
    const {description, amount, category, date} = req.body;
    try {
        const income = await Income.findOneAndUpdate({userId, _id: id}, {
            description,
            amount,
            category,
            date: new Date(date)
        }, {new: true}); // find the income entry and update it, return the updated document
        if(!income){
            throw new ApiError(404, "Income not found")
        }
        await income.save();
        res.status(200).json(new ApiResponse(true, "Income updated successfully", income))
    } catch (error) {
        throw new ApiError(500, "Error while updating income")
    }
});

// Controller function to delete an income entry
const deleteIncome = asyncHandler(async(req, res) => {
    // todolist: get user id from req.user
    // todolist: fetch the income entry from db
    // todolist: delete the income entry
    // todolist: send response to frontend
    const {id} = req.params;
    const userId = req.user._id;    
    try {
        const income = await Income.findOneAndDelete({userId, _id: id}); // find the income entry and delete it
        if(!income){
            throw new ApiError(404, "Income not found")
        }   
        res.status(200).json(new ApiResponse(true, "Income deleted successfully", income))
    } catch (error) {
        throw new ApiError(500, "Error while deleting income")
    }
}
);

// to download all income entries of a user in  excel sheet format
const downloadIncomes = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    try {
        const incomes = await Income.find({userId}).sort({createdAt : -1});
        const plainData = incomes.map(income => ({
            description : income.description,
            amount : income.amount,
            category : income.category,
            date : new Date(income.date).toLocaleDateString()
        }));
        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Income");
       XLSX.writeFile(workbook, "income_details.xlsx");
       res.status(200).download("income_details.xlsx")
    } catch (error) {
        throw new ApiError(500, "Error while downloading incomes")
    }     
   
   
});

// controller function to get income overview
const getIncomeOverview = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const {startDate, endDate} = getDateRange(req.query.timePeriod);
    try {
        const incomes = await Income.find({
            userId,
            date : {
                $gte : startDate,
                $lte : endDate
            }
        });
        const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);
        const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
        const nuberOfTransactions = incomes.length;

        const recentTransactions = incomes.slice(0, 5); // get 5 most recent transactions

        res.status(200).json(new ApiResponse(true, "Income overview fetched successfully", {
            totalIncome,
            averageIncome,
            nuberOfTransactions,
            recentTransactions
        }))
    } catch (error) {
        throw new ApiError(500, "Error while fetching income overview")
    }
});
export {addIncome, getAllIncomes, updateIncome, deleteIncome, downloadIncomes, getIncomeOverview}
