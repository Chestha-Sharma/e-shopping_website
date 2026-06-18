import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Store } from "../store"; 
import { toast } from "react-toastify";
import { geterror } from "../util";

export default function SigninScreen() {
  const navigate = useNavigate();
    const {search} =useLocation(); 
//     लाइन const { search } = useLocation(); रिएक्ट राउटिंग (React Router) का एक हिस्सा है। इसका मुख्य काम URL के अंदर मौजूद क्वैरी स्ट्रिंग (Query String) को निकालना होता है।

// सरल शब्दों में कहें तो, यह वर्तमान पेज के URL में क्वेश्चन मार्क (?) के बाद लिखे हुए पूरे हिस्से को पकड़ कर आपको दे देता है।

// यह कैसे काम करता है? (एक उदाहरण से समझें)
// मान लीजिए कोई यूजर आपकी वेबसाइट के लॉगिन पेज पर आया, और उसका URL कुछ ऐसा दिख रहा है:
// http://localhost:3000/signin?redirect=/shipping

// जब आप इस पेज पर useLocation() को कॉल करते हैं, तो यह आपको एक ऑब्जेक्ट देता है जिसमें पूरे URL की जन्मकुंडली होती है। उस ऑब्जेक्ट में से हम सिर्फ { search } को डिस्ट्रक्चर (निकाल) कर रहे हैं।

// यहाँ search के अंदर यह वैल्यू आएगी:
// "?redirect=/shipping"

// आपके कोड में इसका इस्तेमाल क्यों हो रहा है?
// आपके SigninScreen वाले कोड में इसके ठीक नीचे यह लॉजिक लिखा है:

// JavaScript
// const { search } = useLocation(); // "?redirect=/shipping" मिला
// const redirectInURL = new URLSearchParams(search).get('redirect'); // "/shipping" निकाला
// const redirect = redirectInURL ? redirectInURL : '/'; // अगर कुछ नहीं मिला तो होम पेज ('/') पर भेजेंगे
// इसका असली फायदा (Real-world Use Case):

// यूजर ने कार्ट में सामान डाला और "Proceed to Checkout" पर क्लिक किया।

// लेकिन क्योंकि वह लॉगिन नहीं था, आपने उसे लॉगिन पेज पर भेज दिया, पर साथ ही URL में याद रखा कि वह कहाँ जाना चाहता था (?redirect=/shipping)।

// अब जैसे ही यूजर अपना सही ईमेल-पासवर्ड डालेगा, आपका कोड Maps(redirect) चलाएगा, जिससे यूजर सीधे वापस Shipping वाले पेज पर पहुँच जाएगा। उसे दोबारा कार्ट में जाकर क्लिक नहीं करना पड़ेगा।
    const redirectInURL = new URLSearchParams(search).get('redirect');
    const redirect = redirectInURL ? redirectInURL : '/';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

     const {state, dispatch : ctxdispatch} = useContext(Store);

       const {userInfo} = state;
    const submitHandler = async (e) => {
      e.preventDefault(); //prevent refreshing page when user tries to signin
      try{
        const {data} = await axios.post('/api/users/signin',{
              email,
              password
        });
        ctxdispatch({type: 'SIGNIN', payload: data}); 
        navigate(redirect || '/');
      } catch (error) {
        toast.error(geterror(error)); //utils ke error liya static error na deke error network me bhi show ho
      }
    };

    useEffect(() => {
      if(userInfo){
        navigate(redirect);
      }
    },[navigate,redirect,userInfo]);
  return (
  <Container className="small-container">
  <Helmet>
    <title>Sign In</title>
  </Helmet>
  <h1 className="my-3" >Sign In</h1>
  <Form onSubmit={submitHandler}>
    <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" required onChange={(e)=> setEmail(e.target.value)}/> 
        {/* //creates input field with email type and placeholder text */}
    </Form.Group>
    <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Enter Password" required onChange={(e)=> setPassword(e.target.value)}/> 
        {/* //creates input field with email type and placeholder text */}
    </Form.Group>
    <div className="mb-3">
        <Button type="submit" variant="primary">
            Sign In
        </Button>
    </div>
    <div className="mb-3">
     New Costomer?{' '}

     <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
    </div>
  </Form>
  </Container>
  )
}