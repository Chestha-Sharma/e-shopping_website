//use to create schema of product

import mongoose from "mongoose";

//id auto generate hogi
//mongoose.schema accept object as parameter and it will create a schema for us

const productSchema = new mongoose.Schema(
      {
        name: {
            unique: true,
            type: String,
            required: true,
        },
        slug: {
            unique: true,
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        countInStock: {
            type: Number,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        numReviews: {
            type: Number,
            required: true,
        },
        brand :{
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        }
      },
      {
        timestamps: true, //last update and  create time of product
      }
);

const Product = mongoose.model("Product", productSchema);
export default Product;