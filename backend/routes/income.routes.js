import {Router} from 'express';
import {addIncome, getAllIncomes, updateIncome, deleteIncome, downloadIncomes, getIncomeOverview} from '../controllers/income.controllers.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const incomeRouter = Router();

// protected routes
incomeRouter.route("/add").post(verifyJWT, addIncome)
incomeRouter.route("/get").get(verifyJWT, getAllIncomes);
incomeRouter.route("/overview").get(verifyJWT, getIncomeOverview);
incomeRouter.route("/downloadexcel").get(verifyJWT, downloadIncomes);
incomeRouter.route("/update/:id").put(verifyJWT, updateIncome);
incomeRouter.route("/delete/:id").delete(verifyJWT, deleteIncome);

export default incomeRouter;