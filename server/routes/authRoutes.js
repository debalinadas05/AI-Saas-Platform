import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { auth } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", auth, getMe);

export default authRouter;