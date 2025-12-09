import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    age: { type: Number, default: null },
    dob: { type: String, default: null },
    contact: { type: String, default: null },
})


export default mongoose.model('User', UserSchema);