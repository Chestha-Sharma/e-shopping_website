// import data from "./data";  ise hatane ke baad ab hame forntend ke data.js ki jarurat nhi h kyoki ab ham backend se data fetch kar rhe h to ab backend ko bhi ek terminal me permemnent on rahna hoga taki jab bhi frontend se backend se data fetch karne ki request aaye to backend se data mil sake aur frontend me show ho sake.
//chaho to frontend ke data.js ko delete bhi kar sakte h kyoki ab ham backend se data fetch kar rhe h to ab backend ko bhi ek terminal me permemnent on rahna hoga taki jab bhi frontend se backend se data fetch karne ki request aaye to backend se data mil sake aur frontend me show ho sake.
import { BrowserRouter ,Route,Routes ,Link, useNavigate } from "react-router-dom";
import Homescreen from "./screens/Homescreen";
import ProductScreen from "./screens/Productscreen";
import { Badge, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useContext } from "react";
import { Store } from "./store";
import CartScreen from "./screens/Cartscreen"; 
import SigninScreen from "./screens/Signinscreen";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
   const {state , dispatch : ctxdispatch} = useContext(Store); 
   const navigate = useNavigate();
  //  इसका सीधा सा मतलब यह है कि आप useNavigate() हुक का इस्तेमाल सिर्फ और सिर्फ उसी कंपोनेंट के अंदर कर सकते हैं जो <BrowserRouter> के अंदर (Nested) लिपटा हुआ हो।
  //isliye BrowserRouter ka use yaha na krke index.js me kiya h



  
//   BrowserRouter रिएक्ट राउटिंग (React Router) का सबसे मुख्य हिस्सा है। इसे आप अपनी वेबसाइट का "ट्रैफिक पुलिस" या "रास्ता दिखाने वाला गाइड" समझ सकते हैं।

// इसका मुख्य काम यह है कि यह आपकी पूरी वेबसाइट को Single Page Application (SPA) बनाए रखता है। आइए समझते हैं कि यह पर्दे के पीछे क्या-क्या करता है:

// 1. HTML5 History API का उपयोग करना
// यह ब्राउज़र के History API (जैसे window.history) का इस्तेमाल करता है। इसका मतलब है कि जब भी आपकी वेबसाइट पर कोई नया पेज खुलता है (जैसे /cart या /signin), तो BrowserRouter ब्राउज़र के एड्रेस बार (URL) को अपडेट कर देता है, लेकिन पेज को लोड या रिफ्रेश नहीं होने देता।

// 2. URL और UI के बीच तालमेल बिठाना
// इसका सबसे बड़ा काम यह देखना है कि ब्राउज़र के URL बार में अभी क्या लिखा है, और उसी के हिसाब से स्क्रीन पर सही कंपोनेंट को दिखाना।

// अगर URL / है 👉 तो यह Homescreen को दिखाता है।

// अगर URL /signin हो गया 👉 तो यह बिना पूरा पेज रीलोड किए तुरंत SigninScreen को स्क्रीन पर लाकर रख देता है।

// इसे एक रियल-लाइफ उदाहरण से समझें:
// मान लीजिए आपकी वेबसाइट एक बड़ी यूनिवर्सिटी है:

// BrowserRouter वह यूनिवर्सिटी का मेन गेट और कैंपस है। इसके अंदर कदम रखते ही आप यूनिवर्सिटी के नियम-कानून के दायरे में आ जाते हैं।

// Routes वह दिशा-सूचक बोर्ड (Signboard) है, जो बताता है कि कौन सा कमरा कहाँ है।

// Route वे अलग-अलग कमरे (Classrooms) हैं—जैसे कंप्यूटर लैब (/cart) या एडमिन ऑफिस (/signin)।

// Link या useNavigate वे स्टूडेंट्स (यूजर्स) हैं जो एक कमरे से दूसरे कमरे में जा रहे हैं।

// ⚠️ नियम: अगर कोई स्टूडेंट (जैसे useNavigate) कैंपस (BrowserRouter) के बाहर खड़ा होकर चिल्लाएगा कि "मुझे कंप्यूटर लैब जाना है!", तो यूनिवर्सिटी का सिस्टम काम नहीं करेगा और एरर आ जाएगा। यही वजह थी कि जब आपने useNavigate को BrowserRouter के बाहर इस्तेमाल किया, तो आपका कोड क्रैश हो गया था।

// अगर BrowserRouter न हो तो क्या होगा?
// अगर आप इसका इस्तेमाल नहीं करेंगे, तो आपकी वेबसाइट एक पुरानी पारंपरिक (Traditional) वेबसाइट की तरह व्यवहार करेगी:

// हर बार किसी लिंक पर क्लिक करने पर पूरा पेज सफेद (Blank) होगा, ब्राउज़र का रीलोडर घूमेगा, और सर्वर से नया पेज लोड होगा।

// इससे यूजर का एक्सपीरियंस खराब होता है और वेबसाइट स्लो महसूस होती है।

// संक्षेप में: BrowserRouter आपकी पूरी वेबसाइट को चारों तरफ से घेर कर एक ऐसा माहौल बनाता है जिसमें आपकी वेबसाइट के सारे पेज, लिंक्स और नेविगेशन हुक्स बिना पेज रिफ्रेश किए बिजली की रफ्तार से काम कर सकें।



   const {cart,userInfo} = state;
   const handleSignOut = () => {
    ctxdispatch({type : 'SIGNOUT'});
    localStorage.removeItem('userInfo');
    navigate('/');
  };
  return (
    <div> 
     <div className="d-flex flex-column site-container">
      <ToastContainer position="bottom-center" limit={1}/>
      <header>
        <Navbar bg="dark" variant="dark">
          <Container>
            <LinkContainer to="/">
            <Navbar.Brand href="#home">Amaozona</Navbar.Brand>
            {/* amazona is a brand link and navbar.brand use for it */}
            </LinkContainer>
            <Nav className="me-auto">
              <Link to="/cart" className="nav-link">
              Cart
              {cart.cartItems.length > 0 && (
                <Badge pill bg="danger">
                  {cart.cartItems.reduce((a,c) => a + c.quantity, 0)}
                </Badge>
              )}
              </Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                  <LinkContainer to="/profile">
                  <NavDropdown.Item>
                     Your Profile
                  </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orderhistory">
                  <NavDropdown.Item>
                     Order History
                  </NavDropdown.Item>
                  </LinkContainer>
                  <Link
                  className="dropdown-item"
                  to="#signout"
                  onClick={handleSignOut}
                  >
                  Sign Out
                  </Link>
                </NavDropdown>
              ) : (
                <Link className="nav-link" to="/signin">
                Sign In
                </Link>
              )}
            </Nav>
          </Container>
        </Navbar>


      {/* <Link to="/">amaozona</Link>  */}
      {/* a ki jagah Link use kiya page refresh na ho or good responsiveness mile user ko ,single page website bane */}
      </header>
     <main>
      <Container className="mt-3">
      <Routes>
        <Route path="/" element={<Homescreen />} />
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/signin" element={<SigninScreen />} />
        <Route path="/product/:slug" element={<ProductScreen />} />  
      </Routes>
      </Container>
     </main>
     <footer>
      <div className="text-center">Footer Content</div>
     </footer>
    </div>
    </div> 
  );
}

export default App;
