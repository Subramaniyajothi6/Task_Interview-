import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  userId: {
    type: Number,       
    required: true,
    unique: true
  },
  age: {
    type: Number,
    default: null
  },
  dob: {
    type: String,
    default: ""
  },
  contact: {
    type: String,
    default: ""
  }
});

export default mongoose.model("Profile", ProfileSchema);
