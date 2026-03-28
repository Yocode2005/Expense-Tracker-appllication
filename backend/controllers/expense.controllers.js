import { Expense } from "../models/expense.models";
import getDateRange from "../utils/dateFilter";
import{ApiError} from "../utils/ApiError.js";
import{ApiResponse} from "../utils/ApiResponse.js";
import{asyncHandler} from "../utils/asyncHandler.js";
import getDateRange from '../utils/dateFilter.js';
import XLSX from "xlsx";

// controller function to add a new expense
const addExpense = asyncHandler(async(req,res) => {
     const userId = req.user._id;
    const {description, amount, category, date} = req.body;

    try {
        if(!description || !amount || !category || !date){
            throw new ApiError(400, "All fields are required")
        }
        const newExpense = await Expense.create({
            userId,
            description,
            amount,
            category,
            date : new Date(date), // convert date string to Date object
        });
        if(!newExpense){
            throw new ApiError(500, "Failed to add expense")
        }
        await newExpense.save(); // save the new expense to the database
        res.status(201).json(new ApiResponse(true, "Expense added successfully", newExpense))
    } catch (error) {
        throw new ApiError(400, "Error while adding expense");
    }
});

// controller function to get all expenses of a user
const getAllExpenses = asyncHandler(async(req,res) => {
    const userId = req.user._id;
    try {
        const expenses = await Expense.find({userId}).sort({createdAt : -1});
        res.status(200).json(new ApiResponse(true, "Expenses fetched successfully", expenses))
    } catch (error) {
        throw new ApiError(500, "Error while fetching expenses")
    }
}
);

// controller function to update an expense entry
const updateExpense = asyncHandler(async(req,res) => {
    const userId = req.user._id;
    const {id} = req.params;
    const {description, amount, category, date} = req.body;
    try {
            const expense = await Expense.findOneAndUpdate({userId, _id: id}, {
                description,
                amount,
                category,
                date: new Date(date)
            }, {new: true}); // find the expense entry and update it, return the updated document
            if(!expense){
                throw new ApiError(404, "Expense not found")
            }
            await expense.save();
            res.status(200).json(new ApiResponse(true, "Expense updated successfully", expense))
        } catch (error) {
            throw new ApiError(500, "Error while updating expense")
        }
});

// controller function to delete an expense entry
const deleteExpense = asyncHandler(async(req,res) => {
    const userId = req.user._id; // get user id from req.user
    const {id} = req.params; // means the id of the expense entry to be deleted
    try {
        const expense = await Expense.findOneAndDelete({userId, _id: id});
        if(!expense){
            throw new ApiError(404, "Expense not found")
        }
        res.status(200).json(new ApiResponse(true, "Expense deleted successfully", expense))
    } catch (error) {
        throw new ApiError(500, "Error while deleting expense")
    }
});

// controller function to download expenses in excel sheet
const downloadExpenses = asyncHandler(async(req,res) => {
    const userId = req.user._id;
    try {
            const expenses = await Expense.find({userId}).sort({createdAt : -1});
            const plainData = expenses.map(expense => ({
                description : expense.description,
                amount : expense.amount,
                category : expense.category,
                date : new Date(expense.date).toLocaleDateString()
            }));
            const worksheet = XLSX.utils.json_to_sheet(plainData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
           XLSX.writeFile(workbook, "expense_details.xlsx");
           res.status(200).download("expense_details.xlsx")
        } catch (error) {
            throw new ApiError(500, "Error while downloading expenses")
        } 
});

// controller function to get expenses overview based on time period
const getExpenseOverview = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const {startDate, endDate} = getDateRange(req.query.timePeriod);
    try {
        const expenses = await Expense.find({
            userId,
            date : {
                $gte : startDate,
                $lte : endDate
            }
        });
        const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        const averageExpense = expenses.length > 0 ? totalExpenses / expenses.length : 0;
        const numberOfTransactions = expenses.length;

        const recentTransactions = expenses.slice(0, 5); // get 5 most recent transactions

        res.status(200).json(new ApiResponse(true, "Expense overview fetched successfully", {
            totalExpenses,
            averageExpense,
            numberOfTransactions,
            recentTransactions
        }))
    } catch (error) {
        throw new ApiError(500, "Error while fetching expense overview")
    }
});

export {
    addExpense,
    getAllExpenses,
    updateExpense,
    deleteExpense,
    downloadExpenses,
    getExpenseOverview
};

