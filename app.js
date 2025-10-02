import express from "express";
import { PORT } from "./config/env.js";
import connectToDatabase from "./db.js";
import { userRoute } from "./router/user.routes.js";
import { integrationRouter } from "./router/integration.routes.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/integration", integrationRouter);
app.get("/", (req, res) => {
  res.send("Welcome to Intern Assesment");
});
app.listen(PORT, async () => {
  console.log("App up and running");
  await connectToDatabase();
});
