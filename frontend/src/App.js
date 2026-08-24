import { BrowserRouter ,Route,Routes ,Link, useNavigate } from "react-router-dom";
import Homescreen from "./screens/Homescreen";
import ProductScreen from "./screens/Productscreen";
import { Badge, Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useContext, useEffect, useState } from "react";
import { Store } from "./store";
import CartScreen from "./screens/Cartscreen"; 
import SigninScreen from "./screens/Signinscreen";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Shippingadressscreen from "./screens/Shippingadressscreen";
import SignupScreen from "./screens/Signupscreen";
import Paymentmethodscreen from "./screens/Paymentmethodscreen";
import Placeorderscreen from "./screens/Placeorderscreen";
import Orderscreen from "./screens/Orderscreen";
import Orderhistoryscreen from "./screens/Orderhistoryscreen";
import Profilescreen from "./screens/Profilescreen";
import { geterror } from "./util";
import axiosInstance from "./lib/axios.js";
import Searchbox from "./components/Searchbox";
import Searchscreen from "./screens/Searchscreen";
import Protectedrouter from "./components/Protectedrouter";
import Adminroute from "./components/Adminroute";
import Dashboardscreen from "./screens/Dashboardscreen";
import Productlistscreen from "./screens/Productlistscreen";
import Producteditscreen from "./screens/Producteditscreen";
import Orderlistscreen from "./screens/Orderlistscreen";
import Userlistscreen from "./screens/Userlistscreen";
import Usereditscreen from "./screens/Usereditscreen";
import { axiosInstance } from "./lib/axios";
function App() {
   const {state , dispatch : ctxdispatch} = useContext(Store); 
   const navigate = useNavigate(); 
 
   const {cart,userInfo} = state;
   const handleSignOut = () => {
    ctxdispatch({type : 'SIGNOUT'});
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    navigate('/signin');
  }; 

 const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
 const [categories, setCategories] = useState([]);
 useEffect(()=>{
   const fetchCategories = async ()=>{
    try{
     const {data} = await axiosInstance.get('/api/products/categories');
     setCategories(data);
     setCategories(data);
    }
    catch(error){
       toast.error(geterror(error));
    }
   }
   fetchCategories();
 }, []);
  return (
    <div> 
     <div className={sidebarIsOpen?
     "d-flex flex-column site-container active-cont"
      :"d-flex flex-column site-container"
      }>
      <ToastContainer position="bottom-center" limit={1}/>
      <header>
        <Navbar bg="dark" variant="dark" expand="lg"> 
          <Container>
            <Button
            variant="dark"
            onClick={()=>setSidebarIsOpen(!sidebarIsOpen)}
            >
              <i className="fas fa-bars"></i>
            </Button>
            <LinkContainer to="/">
            <Navbar.Brand href="#home">Amaozona</Navbar.Brand> 
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav"> 
              <Searchbox />
            <Nav className="me-auto w-100 justify-content-end">
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
              {
                userInfo && userInfo.isAdmin ? (
                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                    <LinkContainer to="/admin/dashboard">
                      <NavDropdown.Item>
                        Dashboard
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/products">
                      <NavDropdown.Item>
                        Products
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orders">
                      <NavDropdown.Item>
                        Orders
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/users"> 
                      <NavDropdown.Item>
                        Users 
                      </NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                ) : null
              }
            </Nav> 
            </Navbar.Collapse>
          </Container>
        </Navbar>
 
      </header>
      <div className={sidebarIsOpen?
        "site-navbar active-nav d-flex justify-content-between flex-column flex-wrap"
        :"site-navbar d-flex justify-content-between flex-column flex-wrap"}>
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
              {
              categories.map((category) => (
                 <Nav.Item key={category}>
                   <Nav.Link
                     as={Link}
                     to={`/search?category=${category}&query=all&price=all&rating=all&order=newest&page=1`}
                     onClick={() => setSidebarIsOpen(false)}
                   >
                     {category}
                   </Nav.Link>
                 </Nav.Item>
               ))
               }
            </Nav.Item>
          </Nav>
      </div>
     <main>
      <Container className="mt-3">
      <Routes>
        <Route path="/cart" element={<CartScreen />} />
        <Route path="/search" element={<Searchscreen />} />
        <Route path="/signin" element={<SigninScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/profile" element={
          <Protectedrouter>
          < Profilescreen />
          </Protectedrouter>
          } />
        <Route path="/shipping" element={<Shippingadressscreen />} />
        <Route path="/payment" element={<Paymentmethodscreen />} />
        <Route path="/placeorder" element={<Placeorderscreen />} />
        <Route path="/order/:id" element={
          <Protectedrouter>
          <Orderscreen />
          </Protectedrouter>
        }  /> 
        <Route path="/orderhistory" element={
          <Protectedrouter>
          <Orderhistoryscreen />
          </Protectedrouter>
          } />
        <Route path="/product/:slug" element={<ProductScreen />} />  
         {/* Rotes for admin */}
         <Route path="/admin/dashboard" element={
          <Adminroute>
            <Dashboardscreen />
          </Adminroute>
          }  
           />
         <Route path="/admin/products" element={
          <Adminroute>
            <Productlistscreen />
          </Adminroute>
          }  
           />
           <Route path="/admin/product/:id" element={
            <Adminroute>
              <Producteditscreen />
            </Adminroute>
            }
            />
            <Route path="/admin/orders" element={
            <Adminroute>
              <Orderlistscreen />
            </Adminroute>
            }
            /> 
            <Route path="/admin/users" element={
            <Adminroute>
              <Userlistscreen />
            </Adminroute>
            }
            />
            <Route path="/admin/user/:id" element={
            <Adminroute>
              <Usereditscreen />
            </Adminroute>
            }
            />
        <Route path="/" element={<Homescreen />} />
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
