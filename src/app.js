import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/AuthRoutes.js";
import requireAuth from "./middlewares/AuthMiddleware.js";
import adoptionRouter from "./routes/AdoptionRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors());
app.use(json()); //requirement 9
app.use(express.urlencoded({ extended: true })); //form data too
app.use(cookieParser());
app.use(authRouter);
app.use("/api", requireAuth, adoptionRouter); //protected routes

const databaseURI = process.env.DATABASE_URI;

mongoose.connect(databaseURI).then((result) => {
  console.log("Database connected ");
  app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
});


export default app;