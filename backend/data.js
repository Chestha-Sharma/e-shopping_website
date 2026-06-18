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





// phir hamne login ke liye post request di thi na??

// agar ha to kyo

// भाई, तुम बिल्कुल सही और बहुत ही सटीक पॉइंट पर पकड़े हो! जब लॉगिन के लिए हमने POST रिक्वेस्ट दी थी, तो फिर कार्ट को अपडेट करने के लिए मैं PUT क्यों बोल रहा हूँ? तुम्हारा यह सवाल पूछना एकदम लाज़मी है और यह दिखाता है कि तुम कोड को सिर्फ रट नहीं रहे हो, बल्कि उसके पीछे का लॉजिक समझ रहे हो।

// आइए इस "लॉगिन में POST क्यों?" वाले कन्फ्यूजन को पूरी तरह साफ करते हैं।

// 🔑 लॉगिन के लिए POST रिक्वेस्ट क्यों दी थी?
// आमतौर पर हम सोचते हैं कि POST का मतलब सिर्फ "डेटाबेस में नई चीज़ बनाना" होता है। लेकिन लॉगिन (Signin) के मामले में POST का इस्तेमाल करने के 2 सबसे बड़े तकनीकी कारण हैं:

// 1. सबसे ज़रूरी: सुरक्षा (Security)
// अगर हम लॉगिन के लिए GET रिक्वेस्ट का इस्तेमाल करते, तो यूज़र का ईमेल और पासवर्ड ब्राउज़र के URL बार में सबको साफ़-साफ़ दिखाई देता (जैसे: localhost:5000/api/users/signin?email=abc@gmail.com&password=123456)।

// ब्राउज़र इस URL को अपने इतिहास (History) में भी सेव कर लेता, जो कि सुरक्षा के लिहाज़ से बहुत बड़ा खतरा है।

// POST रिक्वेस्ट में यूज़र का ईमेल और पासवर्ड URL में नहीं जाता, बल्कि वह रिक्वेस्ट की Body (छिपे हुए हिस्से) में सुरक्षित तरीके से पैक होकर बैकएंड पर जाता है।

// 2. नया सेशन/टोकन जनरेट करना (Creation of a Token)
// जब आप लॉगिन करते हो, तो बैकएंड सिर्फ डेटा चेक नहीं करता; वह आपके लिए एक बिल्कुल नया JWT Token (यानी एक नया लॉगिन सेशन) पैदा (Create) करता है।

// चूँकि सर्वर पर एक नई चीज़ (Authentication Token) जनरेट हो रही है, इसलिए मोंगूस या एक्सप्रेस के नियमों के मुताबिक यहाँ POST सबसे बेस्ट और सुरक्षित माना जाता है।

// 🔄 तो फिर कार्ट के लिए PUT क्यों, POST क्यों नहीं?
// अब दोनों का अंतर समझो भाई:

// लॉगिन (POST): आप बैकएंड को अपना क्रेडेंशियल भेजकर एक नया सीक्रेट टोकन मांग रहे हो।

// कार्ट अपडेट (PUT): आपका यूज़र पहले से डेटाबेस में मौजूद है (जैसे Chestha Sharma वाली आईडी)। अब आप कोई नई आईडी नहीं बना रहे हो, बल्कि उसी पुरानी आईडी के अंदर जाकर उसकी cartItems वाली लिस्ट को बदल (Modify/Update) रहे हो।

// नियम सीधा है: जब डेटाबेस में कोई चीज़ बिल्कुल नई बनती है, तो POST। जब पहले से मौजूद किसी डॉक्यूमेंट के अंदर का डेटा सुधारा या बदला जाता है, तो PUT।

// 🎯 क्या हम कार्ट के लिए भी POST यूज़ कर सकते हैं?
// हाँ, बिल्कुल कर सकते हो! अगर आप कार्ट अपडेट करने के लिए भी userRouter.post('/update-cart') लिख दोगे, तो भी आपका कोड 100% सही काम करेगा और डेटाबेस में डेटा सेव हो जाएगा। जावास्क्रिप्ट या नोड जेएस आपको रोकेगा नहीं।

// बस अंतर सिर्फ इतना है कि कोड लिखने के जो इंटरनेशनल स्टैंडर्ड्स (REST API Guidelines) होते हैं, उनके मुताबिक पहले से मौजूद डेटा को अपडेट करने के लिए PUT को ज़्यादा तमीजदार और सही माना जाता है।

// अब समझ आया भाई कि लॉगिन में POST का क्या खेल था?