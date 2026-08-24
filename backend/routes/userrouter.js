//when user try to login then for post request \
import expressAsyncHandler from 'express-async-handler';
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/usermodel.js';
import { generateToken, isAuth , isAdmin } from '../utils.js';
const userRouter = express.Router();
 
userRouter.put('/profile', isAuth, expressAsyncHandler(async (req, res) => {
   const user = await User.findById(req.user._id);  
   if (user) {
     user.name = req.body.name || user.name;
     user.email = req.body.email || user.email;
     if(req.body.password){
       user.password = bcrypt.hashSync(req.body.password, 10);
     };
     const updatedUser = await user.save();  
     res.send({
       _id: updatedUser._id,
       name: updatedUser.name,
       email: updatedUser.email,
       isAdmin: updatedUser.isAdmin,
       token: generateToken(updatedUser),
       cartItems: updatedUser.cartItems
     });
   } else {
     res.status(404).send({ message: 'User not found' });
   }
}));



userRouter.post(
  '/signin', 
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
      res.status(401).json( {message : 'Invalid Credentials'});
  })
); 
userRouter.put('/update-cart', isAuth, expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.cartItems = req.body.cartItems;
    await user.save();
    res.send({ message: 'Cart updated successfully' });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
}));


userRouter.post('/signup', expressAsyncHandler(async (req, res) => {
const newUser = new User({
  name : req.body.name,
  email : req.body.email, 
  password : bcrypt.hashSync(req.body.password, 10),
  isAdmin : false,
  cartItems: []
});
const createdUser = await newUser.save();  
res.send({
          _id: createdUser._id,
          name : createdUser.name,
          email : createdUser.email,
          isAdmin :  createdUser.isAdmin,
          token : generateToken(createdUser),
          cartItems: createdUser.cartItems
        });
}));


userRouter.get('/',isAuth,isAdmin,
  expressAsyncHandler(async (req,res)=>{
    const users = await User.find({});
    res.send(users);
  })
);


userRouter.get('/:id',isAuth,isAdmin,
  expressAsyncHandler(async (req,res)=>{
    const user = await User.findById(req.params.id);
    if(user){
      res.send(user);
    }
    else{
      res.status(404).send({message : 'User Not Found'});
    }
  })
);


userRouter.put('/:id',isAuth,isAdmin,
  expressAsyncHandler(async (req,res)=>{
    const user = await User.findById(req.params.id);
    if(user){
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      const newIsAdmin = Boolean(req.body.isAdmin );
      if(user.isAdmin && !newIsAdmin){
        const adminCount = await User.countDocuments({isAdmin : true});
        if(adminCount <= 1){
          res.status(403).send({message : 'You cannot delete the last admin'});
          return;
        }
      }
      user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;
      await user.save();
      res.send({message : 'User Updated Successfully'});
    }
    else{
      res.status(404).send({message : 'User Not Found'});
    }
  })
);

userRouter.delete('/:id',isAuth,isAdmin,
  expressAsyncHandler(async (req,res)=>{
    const user = await User.findById(req.params.id);
    if(user){
      if(user.isAdmin){
        res.status(403).send({message : 'You cannot delete an admin'});
        return;
      }
      else{
      await user.deleteOne();
      res.send({message : 'User Deleted Successfully'});
      }
    }
    else{
      res.status(404).send({message : 'User Not Found'});
    }
  })
);
 

export default userRouter;


 