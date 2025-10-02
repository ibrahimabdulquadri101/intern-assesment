import { Router } from "express";
import {
  getEspLists,
  postIntegrations,
} from "../controllers/integration.controller.js";
export const integrationRouter = Router();
integrationRouter.post("/esp", postIntegrations);
integrationRouter.get("/esp/lists", getEspLists);
