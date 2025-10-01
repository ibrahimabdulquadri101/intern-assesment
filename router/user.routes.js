import { Router } from "express";
import { signIn, signUp } from "../controllers/user.controller.js";
export const userRoute = Router();
userRoute.post("/sign-up", signUp);
userRoute.post("/sign-in", signIn);
