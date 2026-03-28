import {Router} from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import {addExpense,getAllExpenses,updateExpense,deleteExpense,downloadExpenses,getExpenseOverview} from '../controllers/expense.controllers.js';
const expenseRouter = Router();

// protected routes
expenseRouter.route("/add").post(verifyJWT, addExpense);
expenseRouter.route("/get").get(verifyJWT, getAllExpenses);
expenseRouter.route("/overview").get(verifyJWT, getExpenseOverview);
expenseRouter.route("/downloadexcel").get(verifyJWT, downloadExpenses);
expenseRouter.route("/update/:id").put(verifyJWT, updateExpense);
expenseRouter.route("/delete/:id").delete(verifyJWT, deleteExpense);

export default expenseRouter;