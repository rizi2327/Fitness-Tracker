import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();

const app=express();
app.use(cors());
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({extended:true}))