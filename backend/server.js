import express from 'express';
import data from './data.js';
const app = express();
const PORT = process.env.PORT || 5000; //port number set kiya taki jab bhi server start ho to ye port number use kare
 
app.get('/api/products', (req, res) => {
  res.send(data.products);
});//backend me data.js liya taki frontend se backend se alag rakha ja sake taki data leak ki problem na create ho sake
app.get('/api/products/slug/:slug', (req, res) => {//by :slug user can access the product details page by clicking on the product image or name and then we can use that slug to fetch the product details from the backend and show it on the product details page.
  const product = data.products.find((x) => x.slug === req.params.slug);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });//ye keval 404 error ke liye hai agar product nahi milta to ye message show karega aur agar product mil jata to uska data show karega
  } 
});
app.get('/api/products/:id', (req, res) => {
    const product = data.products.find((x) => x._id === req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });//ye keval 404 error ke liye hai agar product nahi milta to ye message show karega aur agar product mil jata to uska data show karega
  } 
});
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});//server start karne ke liye listen method use kiya aur port number diya jisme server run karega, aur console me message print hoga jab server start ho jayega
// npm install nodemon --save--dev used save dev because using only for development not anymore