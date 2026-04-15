import {Router} from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { getDashboardOverview } from '../controllers/dashboard.controllers.js';
const dashboardRouter = Router();
// protected route to get dashboard overview
dashboardRouter.route("/").get(verifyJWT, getDashboardOverview);

export default dashboardRouter;