import mongoose from 'mongoose';
import { MONGO_URI } from './env.js';

export async function connectDB() {
    await mongoose.connect(MONGO_URI);
    console.log("connect to mongodb")
}