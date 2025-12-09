import mongoose  from "mongoose";
import { MONGO_URI } from "./config";
const connectDB = async () => {

    try {

        await mongoose.connect(MONGO_URI);

        console.log("MongoDB connected");
    }
     catch(err){
        console.log('Mongoose Error',err);
     }
}

export default connectDB ;