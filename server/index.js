import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

//set port 
const port=process.env.PORT || 8080;
if(!port)
{
    console.log("port is not defined")
}
//create app and set middlwares
const app=express();
app.use(cors());
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({extended:true}));

// yhn tak ap almost har project mn krty hain...

//create a get method
app.get('/',async(req,res)=>{
    res.status(200).json({
        status:200,
        message:"Hello ali"
    })
})

const connectDB=async()=>{
        mongoose.set('strictQuery',true);
        await mongoose
        .connect(process.env.MONGODB_URL)
        .then((res)=>{
            console.log('Connected to MongoDB')
        })
        .catch((err)=>{
            console.log("error in connecting with moongoDB")
        })

}


//server start function
const startServer=async()=>
{
    try {
        connectDB();
        app.listen(port,()=>{
            console.log(`server is runnig at port http://localhost:${port}`)
        })
    } catch (error) {
        console.log(error);
    }
}
startServer();