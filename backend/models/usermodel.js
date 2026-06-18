import mongoose from "mongoose";

// Pehla Block {} (Data Fields/Structure): Isme aap yeh batate hain ki aapke document ke andar kaun-kaun se columns ya keys rahengi (jaise name aur email) aur unka data type kya hoga.

// Doosra Block {} (Schema Options/Settings): Isme data nahi hota, balki isme pure table (collection) ki global settings hoti hain. timestamps: true ek setting hai, koi data field nahi.
const userSchema = new mongoose.Schema(
     {
         name: {
             type: String,
             required: true,
         },
         email: {
             type: String,
             required: true,
             unique: true,
         },
         password: {
             type: String,
             required: true,
         },
         isAdmin: {
             type: Boolean,
             default: false,
             required: true,
         }, 
         cartItems: { type: Array, default: [] }    
         },
     {
         timestamps: true,
     }
);

const User = mongoose.model("User", userSchema);
export default User;