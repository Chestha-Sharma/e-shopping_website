// import data from "./data";  ise hatane ke baad ab hame forntend ke data.js ki jarurat nhi h kyoki ab ham backend se data fetch kar rhe h to ab backend ko bhi ek terminal me permemnent on rahna hoga taki jab bhi frontend se backend se data fetch karne ki request aaye to backend se data mil sake aur frontend me show ho sake.
//chaho to frontend ke data.js ko delete bhi kar sakte h kyoki ab ham backend se data fetch kar rhe h to ab backend ko bhi ek terminal me permemnent on rahna hoga taki jab bhi frontend se backend se data fetch karne ki request aaye to backend se data mil sake aur frontend me show ho sake.
import { BrowserRouter ,Route,Routes ,Link } from "react-router-dom";
import Homescreen from "./screens/Homescreen";
import ProductScreen from "./screens/Productscreen";
import { Badge, Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useContext } from "react";
import { Store } from "./store";
import CartScreen from "./screens/Cartscreen"; 
import SigninScreen from "./screens/Signinscreen";
function App() {
   const {state} = useContext(Store);
   const {cart} = state;
  return (
    <BrowserRouter> 
     <div className="d-flex flex-column site-container">
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
    </BrowserRouter> 
  );
}

export default App;
