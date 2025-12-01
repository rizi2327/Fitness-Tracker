import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import {createError} from '../error.js';
import User from '../models/User.model.js';
import Workout from '../models/Workout.model.js';

dotenv.config();


export const UserRegister= async()=>{
    try {
        const {email, password ,name, img}=req.body;

        const existingUser= await User
        .findOne({email})
        .exec();
        if(existingUser){
            return next(createError(409,"Eamail is already exist"));
        }
    } catch (error) {
        next(err);
    }

    const salt=  bcrypt.genSaltSync(10);
    const hashedPassword= bcrypt.hashSync(password,salt);
    const user= new User({
        name,
        email,
        password:hashedPassword,
        img,
    });

    
}