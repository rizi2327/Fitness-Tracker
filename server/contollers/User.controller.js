import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
// import dotenv from "dotenv";
import {createError} from '../error.js';
import User from '../models/User.model.js';
import Workout from '../models/Workout.model.js';

// dotenv.config(); ye 1 time hi use hota hai index ya app js mn


export const UserRegister= async(req,res,next)=>{
    try {

        //take data from frontend
        const {email, password ,name, img}=req.body;

        //check user already existed are not
        const existingUser= await User
        .findOne({email})
        .exec();
        if(existingUser){
            return next(createError(409,"Eamail is already exist"));
        }

        //salt:adding random stirng to password for security purpose and encrypt the  password 
        const salt=  bcrypt.genSaltSync(10);
        const hashedPassword= bcrypt.hashSync(password,salt);

        // create new user in data base and add credentials for examples name email password and img which we take from front end
          const user= new User({
        name,
        email,
        password:hashedPassword,
        img,
    });

    //save new use in data base
    const createdUser = await user.save();

    //create jwt token for user login decison that how much user the login 
    const token=jwt.sign({id :createdUser._id},process.env.JWT,{
        expiresIn:"9999 years"
    });

    //send response with token and user
    return res.status(200)
    .json({
        token,user
    });


    } catch (error) {
        next(err);
    }

    

    
}