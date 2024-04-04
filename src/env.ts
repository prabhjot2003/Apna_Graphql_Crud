import { config } from "dotenv"
import mongoose from "mongoose";

config();

export const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017/userData";
export const PORT = process.env.PORT || 3000;
mongoose.set('strictQuery', false)

