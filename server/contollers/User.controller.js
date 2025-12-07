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
        // token payload sets `{ id: ... }` so read `req.user?.id`
        const userId = req.user?.id;
        if (!userId) {
            return next(createError(401, "please login"));
        }

        const user = await User.findById(userId);
        console.log('query.date:', req.query.date);
        let date = req.query.date ? new Date(req.query.date) : new Date();
        console.log(date);
        if (!user) {
            return next(createError(404, "user not found"));
        }

        const startOfDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );
        const endOfDay = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1
        );

        const todayWorkouts = await Workout.find({
            user: userId,
            date: {
                $gte: startOfDay,
                $lt: endOfDay,
            }
        });

        const totalCaloriesBurnt = todayWorkouts.reduce((total, workout) => {
            return total + (workout.caloriesBurned || 0);
        }, 0);

        return res
            .status(200)
            .json({
                todayWorkouts,
                totalCaloriesBurnt
            });
        
    } catch (error) {
        next(error)
    }
}

// ADD WORKOUT CONTROLLER (FIXED VERSION)
export const addWorkout = async (req, res, next) => {
    try {
        const userId = req.user?.id; // userId = "user123"
        const { workoutString } = req.body;
        
        // workoutString example: 
        // "#Chest\n-Bench Press\n-3 sets x 10 reps\n-50 kg\n-30 min"
        
        if (!workoutString) {
            return next(createError(400, "Workout string is missing"));
        }

        // Split by semicolon for multiple workouts
        const eachworkout = workoutString.split(';').map((line) => line.trim());
        
        // Find categories (lines starting with #)
        const categories = eachworkout.filter((line) => line.startsWith("#"));
        
        if (categories.length === 0) {
            return next(createError(400, "No categories found in workout string"));
        }

        const parsedWorkouts = []; // Store parsed workouts
        let currentCategory = ""; // Track current category
        let count = 0; // Counter for workouts

        // Process each workout block
        for (const line of eachworkout) {
            count++;
            
            if (line.startsWith("#")) {
                // Split by newline and trim each part
                const parts = line.split('\n').map((part) => part.trim());
                console.log("Parts:", parts);
                
                // Check if all 5 parts exist
                if (parts.length < 5) {
                    return next(
                        createError(400, `Workout string is missing for ${count}th workout`)
                    );
                }
                
                // Extract category (remove #)
                currentCategory = parts[0].substring(1).trim();
                
                // Parse workout details
                const workoutDetails = parseWorkoutLine(parts);
                
                if (workoutDetails === null) {
                    return next(createError(400, "Please enter in proper format"));
                }
                
                // Add category and store
                workoutDetails.category = currentCategory;
                parsedWorkouts.push(workoutDetails);
                console.log('✅ Parsed workout:', { workoutDetails, currentCategory });
                
            } else {
                return next(
                    createError(400, `Workout string is missing for ${count}th workout`)
                );
            }
        }

        // Save each workout to database
        for (const workout of parsedWorkouts) {
            // Calculate calories
            workout.caloriesBurned = parseFloat(calculateCaloriesBurnt(workout));
            console.log('💥 Calculating calories for:', workout.workoutName, '=', workout.caloriesBurned);
            
        // Save each workout to database (explicitly set date to today)
            const savedWorkout = await Workout.create({
                ...workout,
                user: userId,
                date: new Date()
            });
            console.log('✅ Workout saved:', { 
                workoutName: workout.workoutName, 
                caloriesBurned: workout.caloriesBurned,
                duration: workout.duration,
                weight: workout.weight,
                savedId: savedWorkout._id 
            });
        }

        return res.status(201).json({
            message: "Workouts added successfully",
            workouts: parsedWorkouts
        });
        
    } catch (error) {
        next(error);
    }
};

// HELPER FUNCTION: Parse workout line
const parseWorkoutLine = (parts) => {
    const details = {};
    
    if (parts.length >= 5) {
        // Extract workout name (remove -)
        details.workoutName = parts[1].substring(1).trim();
        
        // Extract sets and reps from parts[2]
        const setsRepsPart = parts[2].substring(1).trim(); // Remove leading - and trim
        // Accept variations like '5 sets x 15 reps', '5 setsX15 reps', '5 sets×15 reps' (case-insensitive)
        const setsRepsMatch = setsRepsPart.match(/(\d+)\s*sets\s*[xX×]\s*(\d+)\s*reps/i);
        
        if (!setsRepsMatch) {
            return null; // Invalid format
        }
        
        details.sets = parseInt(setsRepsMatch[1]); // First number
        details.reps = parseInt(setsRepsMatch[2]); // Second number
        
        // Extract weight (remove - and kg)
        details.weight = parseFloat(
            parts[3].substring(1).toLowerCase().replace('kg', '').trim()
        );

        // Extract duration (remove - and min)
        details.duration = parseFloat(
            parts[4].substring(1).toLowerCase().replace('min', '').trim()
        );
        
        return details;
    }
    
    return null;
};

// HELPER FUNCTION: Calculate calories
const calculateCaloriesBurnt = (workoutDetails) => {
    const durationInMinutes = parseFloat(workoutDetails.duration);
    const weightInKg = parseFloat(workoutDetails.weight);
    const caloriesBurntPerMinute = 5; // Simplified formula
    const calories = durationInMinutes * caloriesBurntPerMinute * weightInKg;
    console.log(`📊 Calc: ${durationInMinutes} min × 5 cal/min × ${weightInKg} kg = ${calories} kcal`);
    return calories;
};





