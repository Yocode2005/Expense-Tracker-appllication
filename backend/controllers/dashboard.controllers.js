import { Expense } from "../models/expense.models.js";
import {Income} from "../models/income.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";

const getDashboardOverview = asyncHandler(async(req, res) => {
    const userId = req.user._id;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  try {
    const income = await Income.find({userId, date: {$gte: startOfMonth, $lte: now}}).lean();

    const expense = await Expense.find({userId, date: {$gte: startOfMonth, $lte: now}}).lean();

    

    const monthlyIncome = income.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
    const monthlyExpense = expense.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
    const savings = monthlyIncome - monthlyExpense;
    const savingsRate = monthlyIncome === 0 ? 0 : Math.round((savings / monthlyIncome) * 100);

    const recentTransactions = [
      ...income.map((i) => ({ ...i, type: "income" })),
      ...expense.map((e) => ({ ...e, type: "expense" })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const spendByCategory = {};
    for (const exp of expense) {
      const cat = exp.category || "Other";
      spendByCategory[cat] = (spendByCategory[cat] || 0) + Number(exp.amount || 0);
    }

    const expenseDistribution = Object.entries(spendByCategory).map(([category, amount]) => ({
      category,
      amount,
      percent: monthlyExpense === 0 ? 0 : Math.round((amount / monthlyExpense) * 100),
    }));
    return res.status(200).json(new ApiResponse(true, "Dashboard overview fetched successfully", {
      monthlyIncome,
      monthlyExpense,
      savings,
      savingsRate,
      recentTransactions,
      expenseDistribution
    }));


  } catch (error) {
    throw new ApiError(500, "Error while fetching dashboard overview");
  }
});

export {getDashboardOverview};