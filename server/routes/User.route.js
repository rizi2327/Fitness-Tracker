import express from "express";
import { UserRegister } from "../contollers/User.controller.js";


const router= express.Router();

// router.post("/signup",UserRegister);//commonly used 
router.route('/signup').post(UserRegister);//used for multiple methods


export default router;