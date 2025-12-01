import express from "express";
import { UserLogin, UserRegister } from "../contollers/User.controller.js";


const router= express.Router();

// router.post("/signup",UserRegister);//commonly used 
router.route('/signup').post(UserRegister);//used for multiple methods
router.route('/login').post(UserLogin);


export default router;