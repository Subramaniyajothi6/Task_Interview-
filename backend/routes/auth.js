import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { redisClient } from '../config/redis.js';
import { authMiddleware } from '../middleware/auth.js';
import { JWT_SECRET } from '../config/config.js';


const router = express.Router();


router.post('/register',async (req,res) =>{
    try {
        
        const {name , email , password } = req.body;
        if(!name || !email || !password){
            return res.json({success:false,message:'All fields are required'}) ;
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.json({success:false , message :'Email Already Exists'}) ;
        }

        const hashed = await bcrypt.hash(password,10);

        await User.create({name,email,passwordHash:hashed});

        res.json({success:true ,message :'Registered Successfully'})
    } catch (error) {

        res.json({success:false , message : 'Server Error'})
        
    }
});


router.post('/login',async (req, res)=>{
    try {
        
        const {email,password } = req.body;

        if(!email || !password){
            return res.json({success:false , message :'All Fields Are Required'});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.json({success:false , message:'User Not Found'});
        }

        const valid = await bcrypt.compare(password , user.passwordHash);

        if(!valid){
            return res.json({success:false , message:'Invalid Password'});
        }

        const token = jwt.sign(
            {userId:user._id},
            JWT_SECRET,
            {expiresIn:'1d'}
        );

        await redisClient.set(`session:${user._id}`,token);

        res.json({
            success:true,
            message:'Login Successful',
            token,
            userId:user._id,
        });



    } catch (error) {

        res.jons({success:false , message:error.message || 'Server Error'});
        
    }
})




router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");
    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    res.json({ success: false, message: "Error fetching profile" });
  }
});



router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { age, dob, contact } = req.body;

    await User.findByIdAndUpdate(req.userId, { age, dob, contact });

    res.json({ success: true, message: "Profile Updated" });
  } catch (err) {
    res.json({ success: false, message: "Update failed" });
  }
});



export default router;




