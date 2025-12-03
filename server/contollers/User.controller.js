import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
// import dotenv from "dotenv";
import {createError} from '../error.js';
import User from '../models/User.model.js';
import Workout from '../models/Workout.model.js';

// dotenv.config(); ye 1 time hi use hota hai index ya app js mn

//user register controller
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

    //create jwt token for user login decison that how much time user the login 
    const token=jwt.sign({id :createdUser._id},process.env.JWT,{
        expiresIn:"9999 years"
    });

    //send response with token and user
    return res
    .status(200)
    .json({
        token,
        user
    });
    } catch (error) {
        next(err);
    }

    

    
}


//user login controller
export const UserLogin=async(req,res,next)=>{
    try {

        //take data from front end
        const {email,password} =req.body;
        
        //find user from data base
        const user=await User.findOne({email});
        if(!user)
        {
            return next(createError(404,"user not found"));
        }

        console.log(password,user);
        //compare password / check password 
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect)
        {
            return next(createError(403,'Incorrect Password'))
        }

        //create json web token
        const token = jwt.sign({id:user._id}, process.env.JWT,
            {expiresIn:"9999 years"}
        );
        

        //send response
         return res
         .status(200)
         .json({
            message:"user is successfully loged In",
            token,
            user
         })

    } catch (error) {
        //send error to next middleware like global error handler
            next(error)
    }
}

//user get profile / Dashboard
export const UserDashboard=async(req,res,next)=>{
    try {

    // 1. User find karein
    // 2. current  start/end date set karein
    // 3. total calories nikalein
    // 4. total workout per day find kro
    // 5. Weekly averages calculate karein  
    // 6. Category trends nikalein
    // 7. Pie Chart data set kro 
    // 8. Response format karein

        //take userId from verify user by auth middleware
        const  userId=req.user?.id;
        //find this user from datbase
        const user = await User.findById(userId)
        if(!user)
        {
            return next(createError(404,"user not found"));
        }

        //today ka user ka data collect krn  kly user date set krna 
        const currentDateFormatted = new Date();
        const startToday =  new Date(
            currentDateFormatted.getFullYear(),
            currentDateFormatted.getMonth(),
            currentDateFormatted.getDate(),
        );
        const endToday= new Date(
            currentDateFormatted.getFullYear(),
            currentDateFormatted.getMonth(),
            currentDateFormatted.getDate()+1,
        )
        //calculate burnt calories today
        const totalCaloriesBurnt = await Workout.aggregate([
            {
                $match:
                {
                    user:user._id,
                    date:{
                        $gte:startToday,
                        $lte:endToday,
                    }
                }
            },
            {
                $group:
                {
                    _id:null,
                    totalCaloriesBurnt:{
                        $sum:"caloriesBurned"
                    }
                }
            },
        ]);
        //total workout per day
        const totalWorkout= await Workout.countDocuments({//counts all the docoments
            user:user._id,
            date:{
                $gte:startToday,
                $lte:endToday,
            },
        });
        

        //Calculate average calories burnt per workout
        const  avgCaloriesBurntPerWorkout =
            totalCaloriesBurnt.length > 0 ?
             totalCaloriesBurnt[0]
             .totalCaloriesBurnt / totalWorkout 
             :
             0;


        //fetch Categories of Workout
        const categoryCalories = await Workout.aggregate([
            {
                $match:
                {
                    user:user._id,
                    date:
                    {
                        $gte:startToday,
                        $lte:endToday
                    }
                }
            },
            {
                $group:{
                    _id:"$category",
                    totalCaloriesBurnt:{$sum:"$caloriesBurned"}
                }
            }
        ]);

        //Formate category data for pie Chart
        const pieChartData= categoryCalories.map((category,index)=>({
            id:index,
            value:category.totalCaloriesBurnt,
            label : category._id
        }));

        const weeks =[];
        const caloriesBurned = [];
        for (let i = 6; i >=0 ; i--)
        {
            const date= new Date(
                currentDateFormatted.getTime() - i * 24 * 60 * 60 *1000 
            );
            weeks.push(`${date.getDate()}th`);
            const startOfDay = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );
            const endOfDay = new Date (
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + 1
            );

            const weekData = await Workout.aggregate([
    {
        $match: {
            user: user._id,
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        }
    },
    {
        $group: {
            _id: {
                $dateToString: {
                    format: "%Y-%m-%d",  // ✅ Ye format automatically sort hoga
                    date: "$date"
                }
            },
            totalCaloriesBurnt: { $sum: "$caloriesBurned" }
        }
    },
    {
        $sort: {
            _id: 1  // ✅ String sorting (YYYY-MM-DD format se sahi sort hoga)
        }
    }
]);

            caloriesBurned.push(
                weekData[0]?.totalCaloriesBurnt ? weekData[0]?.totalCaloriesBurnt :0
            )
        };

        return res
        .status(200)
        .json({
            totalCaloriesBurnt:
            totalCaloriesBurnt.length>0
            ?totalCaloriesBurnt[0].totalCaloriesBurnt
            :0,
            totalWorkout:
            totalWorkout,
            avgCaloriesBurntPerWorkout:avgCaloriesBurntPerWorkout,
            totalWeeksCaloriesBurnt:
            {
                weeks:weeks,
                caloriesBurned:caloriesBurned
            },
            pieChartData:pieChartData
        });
    } catch (error) {
        next(error);
    }
}



//every day workout detail 
export const getWorkoutsByDate=async (req ,res ,next)=>{
    try {
        const userId=req.user?._id;
        if(!userId)
        {
            next(createError(401,"please login"));
        }
        const user= await User.findById(userId);
        if(!user){
            return next(404,"user not found")
        }
        console.log(req.query.date);
        let date= req.query.date ? new Date(req.query.date) : new Date();
        console.log(date);
        
    } catch (error) {
        next(error)
    }
}
