import { Router } from "express";
import {
  getEspLists,
  postIntegrations,
} from "../controllers/integration.controller.js";
import authorise from "../middlewares/auth.middleware.js";
export const integrationRouter = Router();
integrationRouter.post("/esp", authorise, postIntegrations);
integrationRouter.get("/esp/lists", authorise, getEspLists);
