import jwt  from 'jsonwebtoken';
import {createError} from '../error.js';


export const verifyToken = async( req , res , next )=>{
    try {
        if(!req.headers.authorization)
        {
            return  next(createError(401,"You are not authentication"))
        }
        const token = req.headers.authorization.spilt(" ")[1];

        if (!token){
            return next(createError(401,"you are not authenticating"))
        }

        const decode= jwt.verify(token,process.env.JWT);
        req.user= decode;
        return next()

    } catch (error) {
        next(error);
    }
}