import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/productmodel.js';

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  // 1. Ready-made products free public API se lo
  const res = await fetch('https://dummyjson.com/products?limit=0');
  const { products } = await res.json();

  // 2. Unko apne product schema mein badlo
  const items = products.map((p) => ({
    name: p.title,
    slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    image: p.thumbnail,
    price: Math.round(p.price * 85),            // USD se INR
    brand: p.brand || 'Generic',
    category: p.category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    description: p.description,
    countInStock: p.stock,
    rating: p.rating,
    numReviews: p.reviews.length,
  }));

  // 3. Purane products hatao aur naye save karo
  await Product.deleteMany({});
  await Product.insertMany(items);

  console.log(`${items.length} products added`);
  await mongoose.disconnect();
};

run();