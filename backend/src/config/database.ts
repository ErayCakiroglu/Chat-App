import mongoose from "mongoose";

export const connectDB = async () => {

    try {

        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined");
        }

        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Mongodb connected successfully");

    } catch (error) {
        console.log("Mongodb connection error : ", error);
        process.exit(1);
    }
}