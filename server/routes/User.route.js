import express from "express";
import { UserDashboard, UserLogin, UserRegister } from "../contollers/User.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";


const router= express.Router();

// router.post("/signup",UserRegister);//commonly used 
router.route('/signup').post(UserRegister);//used for multiple methods
router.route('/signin').post(UserLogin);
router.route('/dashboard').get(verifyToken,UserDashboard);


export default router;