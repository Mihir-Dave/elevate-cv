import express from "express";
import { loginUser,registerUser } from "../controllers/auth.controller.js";

const router = express.Router();

//creates api endpoints
router.post("/register",registerUser); //POST /api/auth/register
router.post("/login",loginUser);        //POST /api/auth/login

export default router;