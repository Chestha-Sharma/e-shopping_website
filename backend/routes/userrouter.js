//when user try to login then for post request \
import expressAsyncHandler from 'express-async-handler';
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/usermodel.js';
import { generateToken, isAuth } from '../utils.js';
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
      res.status(401).json( {message : 'Invalid Credentials'});
  })
);
// .send() aur .json() mein kya farq hai?
// Express mein jab aap ek object ({ message: '...' }) ko .send() ke andar dalte hain, toh Express khud andar hi andar (internally) use .json() mein convert kar deta hai.

// Lekin dono mein asli farq Content-Type Header aur code ki clarity ka hota hai:

// 1. Content-Type Header (Sabse Badi Wajah)
// res.json(object): Yeh Express ko saaf-saaf batata hai ki hum sirf aur sirf JSON data bhej rahe hain. Yeh response ke header mein automatically Content-Type: application/json set kar deta hai. Frontend (jaise Axios) is header ko dekh kar turant samajh jata hai ki aane wala data ek object hai, aur use manually parse nahi karna padta.

// res.send(object): Yeh ek generic function hai. Iske andar aap HTML string, plain text, Buffer, ya Object kuch bhi bhej sakte hain. Express aapke data ka type dekh kar khud guess karta hai ki header kya hona chahiye.

// 2. Strictness (Galti se bachna)
// Agar aap galti se kisi din object ki jagah plain string bhej dete hain (jaise aapne pehle 'Invalid Credentials' bheja tha), toh .send() use text/html ya text/plain bana dega, jisse frontend crash ho sakta hai.

// Agar aap .json('Invalid Credentials') likhenge, toh wo string ko bhi strictly JSON format ("Invalid Credentials") mein badal kar hi bhejega.

// Summary: Kya aapko code badalna chahiye?
// Agar aapne .send({ message: 'Invalid Credentials' }) likha hai aur aapka frontend use sahi se read kar paa raha hai, toh koi dikkat nahi hai, aap use waise hi chhod sakte hain. Code bilkul sahi kaam karega!

// Lekin ek achha developer banne ke liye aur standard coding practices ke mutabik:

// Jab bhi backend se JSON Object / Array bhejna ho, toh .json() ka use karein.

// Jab koi Plain Text, HTML Page, ya File bhejni ho, toh .send() ka use karein.

// Aapka concept bilkul sahi hai, bas isi tarah dhyan se samajhte rahiye!

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
const createdUser = await newUser.save(); //using this saved in database
res.send({
          _id: createdUser._id,
          name : createdUser.name,
          email : createdUser.email,
          isAdmin :  createdUser.isAdmin,
          token : generateToken(createdUser),
          cartItems: createdUser.cartItems
        });
}));
userRouter.put('/profile', isAuth, expressAsyncHandler(async (req, res) => {
   const user = await User.findById(req.user._id); //took user from database
   if (user) {
     user.name = req.body.name || user.name;
     user.email = req.body.email || user.email;
     if(req.body.password){
       user.password = bcrypt.hashSync(req.body.password, 10);
     };
     const updatedUser = await user.save(); //saved user in database
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

 

export default userRouter;






//difference in normal async function ans express async handler function is 


// The primary difference between a normal route handler function in Express and express-async-handler lies in how they capture and manage asynchronous runtime errors.

// In simple terms: a normal handler expects you to manually catch errors using try/catch and pass them down the line, whereas express-async-handler automates this process so your server doesn't crash from an unhandled exception.

// Here is a breakdown of how they compare.

// 1. The Normal Express Function Approach
// Express (specifically version 4) does not automatically catch errors thrown inside asynchronous blocks (async/await or Promises). If an error occurs during a database query inside an async function, the code halts, the promise rejects, and the error gets lost unless you wrap it up yourself.

// Scenario: Without Try/Catch (Server Will Crash ❌)
// JavaScript
// // This looks clean, but it is dangerous!
// productRouter.get('/:id', async (req, res) => {
//   // If the ID is invalid or DB is down, this throws an error.
//   const product = await Product.findById(req.params.id); 
//   res.send(product);
//   // 🚨 Result: The server hangs indefinitely or crashes!
// });
// Scenario: With Manual Try/Catch (Safe, but Bulky ⚠️)
// To keep the application stable, you must manually hook every single async operation into a try/catch block and pass the error to next().

// JavaScript
// productRouter.get('/:id', async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).send({ message: 'Not Found' });
//     res.send(product);
//   } catch (error) {
//     next(error); // 👈 Forwards the error to your global error handler middleware
//   }
// });
// Writing try/catch on every single route creates repetitive, boilerplate code (often referred to as "code khichdi").

// 2. The express-async-handler Approach
// express-async-handler is a middleware wrapper. You pass your async function inside it, and it acts as an automated safety net. It implicitly handles the promise resolve/reject states behind the scenes.

// Scenario: Using the Async Handler Wrapper (Clean & Safe  )
// JavaScript
// import expressAsyncHandler from 'express-async-handler';

// // No try/catch needed here anymore!
// productRouter.get('/:id', expressAsyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) {
//      res.status(404);
//      throw new Error('Product Not Found'); // 👈 Just throw the error directly!
//   }
//   res.send(product);
// }));
// How does it work under the hood?
// The package is incredibly simple. It does essentially this exact translation for you automatically:

// JavaScript
// // What express-async-handler basically looks like internally:
// const asyncHandler = (fn) => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };
// If your async code throws an error or rejects a database query, express-async-handler catches it instantly and calls next(err) for you.