import { Routes, Route } from "react-router-dom"; 
import Homescreen from "../screens/Homescreen.js";
import ProductScreen from "../screens/Productscreen.js";
import CartScreen from "../screens/Cartscreen.js";
import SigninScreen from "../screens/Signinscreen.js";
import SignupScreen from "../screens/Signupscreen.js";
import Shippingadressscreen from "../screens/Shippingadressscreen.js";
import Paymentmethodscreen from "../screens/Paymentmethodscreen.js";
import Placeorderscreen from "../screens/Placeorderscreen.js";
import Orderscreen from "../screens/Orderscreen.js";
import Orderhistoryscreen from "../screens/Orderhistoryscreen.js";
import Profilescreen from "../screens/Profilescreen.js";
import Searchscreen from "../screens/Searchscreen.js";
import Dashboardscreen from "../screens/Dashboardscreen.js";
import Productlistscreen from "../screens/Productlistscreen.js";
import Producteditscreen from "../screens/Producteditscreen.js";
import Orderlistscreen from "../screens/Orderlistscreen.js";
import Userlistscreen from "../screens/Userlistscreen.js";
import Usereditscreen from "../screens/Usereditscreen.js";
import Protectedrouter from "../components/Protectedrouter.js";
import Adminroute from "../components/Adminroute.js";

function AppRoutes() {
  return (
    <Routes> 
      <Route path="/" element={<Homescreen />} />
      <Route path="/product/:slug" element={<ProductScreen />} />
      <Route path="/search" element={<Searchscreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/signin" element={<SigninScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/shipping" element={<Shippingadressscreen />} />
      <Route path="/payment" element={<Paymentmethodscreen />} />
      <Route path="/placeorder" element={<Placeorderscreen />} />
 
      <Route path="/profile" element={<Protectedrouter><Profilescreen /></Protectedrouter>} />
      <Route path="/order/:id" element={<Protectedrouter><Orderscreen /></Protectedrouter>} />
      <Route path="/orderhistory" element={<Protectedrouter><Orderhistoryscreen /></Protectedrouter>} />
 
      <Route path="/admin/dashboard" element={<Adminroute><Dashboardscreen /></Adminroute>} />
      <Route path="/admin/products" element={<Adminroute><Productlistscreen /></Adminroute>} />
      <Route path="/admin/product/:id" element={<Adminroute><Producteditscreen /></Adminroute>} />
      <Route path="/admin/orders" element={<Adminroute><Orderlistscreen /></Adminroute>} />
      <Route path="/admin/users" element={<Adminroute><Userlistscreen /></Adminroute>} />
      <Route path="/admin/user/:id" element={<Adminroute><Usereditscreen /></Adminroute>} />
    </Routes>
  );
}

export default AppRoutes;