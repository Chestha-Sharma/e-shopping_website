//when user try to login then for post request \
import expressAsyncHandler from 'express-async-handler';
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/usermodel.js';
import { generateToken } from '../utils.js';
const userRouter = express.Router();

userRouter.post(
  '/signin',
  //if this get error then from server.js app.use((err,req,res,next)=>{res.status(500).send({message:err.message});}); will trigger
  expressAsyncHandler(async (req, res) => {
      const user = await User.findOne({ email: req.body.email });
      if(user){
        if(bcrypt.compareSync(req.body.password, user.password)){
          res.send({
          _id: user._id,
          name : user.name,
          email : user.email,
          isAdmin : user.isAdmin,
          token : generateToken(user),
          cartItems: user.cartItems
        });
        return;
        }
      }
      res.status(401).send('Invalid Credentials');
  })
);


userRouter.put('/update-cart', async (req, res) => {
  try {
    const { userId, cartItems } = req.body;
    
    // 1. डेटाबेस में यूज़र को ढूंढें
    const user = await User.findById(userId);

    if (user) {
      // 2. यूज़र की पुरानी कार्ट को नए आइटम्स से रिप्लेस करें
      user.cartItems = cartItems; 
      
      // 3. डेटाबेस में सेव करें
      const updatedUser = await user.save();
      
      res.send({ message: 'Cart updated successfully in DB', cartItems: updatedUser.cartItems });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Server Error', error: error.message });
  }
});

export default userRouter;
