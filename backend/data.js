import bcrypt from 'bcryptjs';

// Aapne pucha ki hum bcryptjs ka use kyun karte hain?

// Jab hum website par user registration aur login banate hain, toh hum kabhi bhi user ka password database (chahe local ho ya Atlas) mein seedha (Plain Text) save nahi karte. Agar hum aisa karenge aur kal ko database leak ya hack ho gaya, toh sabke passwords chori ho jayenge.

// bcryptjs ka kaam hai users ke passwords ko secure karna. Yeh passwords ko ek aise code mein badal deta hai jise koi dhang se padh ya decode nahi kar sakta.

// 🛠️ bcryptjs Ke Do Main Kaam
// 1. Password ko Hash (Encrypt) Karna (Registration ke waqt)
// Jab koi naya user apna password (jaise: Chestha@123) dalta hai, toh bcryptjs use ek lambe aur ajeeb se secure string mein badal deta hai jise Hash kehte hain.

// JavaScript
// // Example Hash: $2a$10$vI8aWBNW3fID.35glnoM7uS6kZOMp/boKu8gPpJ4b1D9r8fW24uB6
// Database mein yeh lambi string save hoti hai, aapka asli password nahi. Kal ko agar koi database dekh bhi le, toh use asli password kabhi pata nahi chalega.

// 2. Password ko Compare karna (Login ke waqt)
// Jab user login karne ke liye dobara password daalega, toh bcryptjs check karta hai ki kya naya daala hua password database mein maujood hash se match kar raha hai ya nahi.
const data = {
  users: [
    {
      name : "Chestha Sharma",
      email : "chesthasharma@gmail.com",
      password : bcrypt.hashSync("123456", 10),//bcrypt is a package from bcryptjs which is used to hash/encrypt the password 
      //ab ye password git ho ya db sabme keval hash form me dikhega
      // 10 Kya Hai? (What is 10?)Bcrypt mein is 10 ko "Salt Rounds" ya "Cost Factor" kaha jata hai.Iska aasan matlab yeh hai ki bcrypt aapke password ko kitni baar ghuma-fira kar (loop chalakar) encrypt karega. Yeh rounds $2^{\text{Rounds}}$ ke hisab se chalte hain. Yaani agar aapne 10 likha hai, toh bcrypt background mein $2^{10} = 1024$ baar encryption ka chakkar chalayega tab jaakar aapka password hash hoga.💡 Salt Rounds Ka Asli Kaam Kya Hai?Aap soch rahe honge ki ek hi baar mein encrypt kyun nahi kar dete? 1024 baar ghumane ki kya zaroorat hai?Iska sabse bada fayda hai Brute-Force Attack (Hacking) se bachna:Agar kal ko koi hacker aapka database chura bhi leta hai, aur woh kisi powerful computer ya supercomputer se crores of combinations try karke aapka password guess karne ki koshish karta hai, toh yeh 10 rounds uske computer ki speed ko bohot dheema kar denge.10 rounds ki wajah se hacker ke computer ko har ek guess check karne mein thoda waqt lagega, jisse aapka password crack karne mein use saalon ya sadiyan lag sakti hain!
      isAdmin : true,
    },
    {
      name : "Unknown",
      email : "unknown@gmail.com",
      password : bcrypt.hashSync("123456", 10),
      isAdmin : false,
    }
  ],
    products : [
        {
          // _id : '1',
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
            // _id : '2',
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
            // _id : '3',
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
            // _id : '4',
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
            // _id : '5',
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