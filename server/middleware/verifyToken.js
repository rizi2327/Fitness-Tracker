import jwt  from 'jsonwebtoken';
import {createError} from '../error.js';


export const verifyToken = async( req , res , next )=>{
    try {

        //check headers for tokem
        if(!req.headers.authorization)
        {
            return  next(createError(401,"You are not authentication"))
        }

        //take token from headers and split it into " "
        const token = req.headers.authorization.split(" ")[1];

        if (!token){
            return next(createError(401,"you are not authenticating"))
        }


        //verify then token
        const decode= jwt.verify(token,process.env.JWT);
        //send user information into req.user
        req.user= decode;
        return next()

    } catch (error) {
        next(error);
    }
}