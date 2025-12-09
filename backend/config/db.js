import mongoose  from "mongoose";

const connectDB = async () => {

    try {

        await mongoose.connect("mongodb+srv://subramaniyajothi2002:sritharpeter6@cluster0.ldqjnek.mongodb.net/interview_auth");

        console.log("MongoDB connected");
    }
     catch(err){
        console.log('Mongoose Error',err);
     }
}

export default connectDB ;