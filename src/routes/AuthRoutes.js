import { Router } from "express";
import { login_post, signup_post } from "../controllers/AuthController.js";

const authRouter = Router();

authRouter.post("/signup", signup_post);
authRouter.post("/login", login_post);

export default authRouter;