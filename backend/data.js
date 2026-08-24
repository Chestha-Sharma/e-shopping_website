import bcrypt from 'bcryptjs';
const data = {
  users: [
    {
      name : "Chestha Sharma",
      email : "chesthasharma@gmail.com",
      password : bcrypt.hashSync("123456", 10),
      isAdmin : true,
      cartItems: []
    },
    {
      name : "Unknown",
      email : "unknown@gmail.com",
      password : bcrypt.hashSync("123456", 10),
      isAdmin : false,
      cartItems: []
    }
  ],
    products : [
        { 
            name : 'Nike Shirt',
            slug : 'Nike-Shirt',
            category : 'Shirts',
            image : '/p1.jpg',
            price : 120,
            countInStock : 10,
            brand : 'Nike',
            rating : 4.5,
            numReviews : 10,
            description : 'high quality shirt'
        },
          { 
            name : 'Adidas Shirt',
            slug : 'Adidas-Shirt',
            category : 'Shirts',
            image : '/p2.jpg',
            price : 100,
            countInStock : 20,
            brand : 'Adidas',
            rating : 4.0,
            numReviews : 10,
            description : 'high quality shirt'
          },
          { 
            name : 'Lacoste Pant',
            slug : 'Lacoste-Pant',
            category : 'Pants',
            image : '/p3.jpg',
            price : 220,
            countInStock : 0,
            brand : 'Lacoste',
            rating : 4.8,
            numReviews : 17,
            description : 'high quality shirt'
          },
          { 
            name : 'Nike Pants',
            slug : 'Nike-Pants',
            category : 'Pants',
            image : '/p4.jpg',
            price : 78,
            countInStock : 15,
            brand : 'Nike',
            rating : 4.5,
            numReviews : 14,
            description : 'high quality pants'
          },{ 
            name : 'Puma Shirt',
            slug : 'Puma-Shirt',
            category : 'Shirts',
            image : '/p5.jpg',
            price : 65,
            countInStock : 0,
            brand : 'Puma',
            rating : 4.5,
            numReviews : 10,
            description : 'high quality shirt'
          }
    ],
}
export default data;

 