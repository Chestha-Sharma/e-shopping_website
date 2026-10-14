import { Link, useNavigate } from "react-router-dom";
import { Badge, Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Store } from "./store";
import { geterror } from "./util";
import { axiosInstance } from "./lib/axios.js";
import Searchbox from "./components/Searchbox";
import Footer from "./components/Footer";
import AppRoutes from "./Routes/AppRoutes.js";

function App() {
  const { state, dispatch: ctxdispatch } = useContext(Store);
  const navigate = useNavigate();
  const { cart, userInfo } = state;

  const handleSignOut = () => {
    ctxdispatch({ type: "SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    navigate("/signin");
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get("/api/products/categories");
        setCategories(data);
      } catch (error) {
        toast.error(geterror(error));
      }
    };
    fetchCategories();
  }, []);

  return (
   <div>
  <div
    className={
      sidebarIsOpen
        ? "d-flex flex-column site-container active-cont"
        : "d-flex flex-column site-container"
    }
  >
    <ToastContainer position="bottom-center" limit={1} />
 
    <header className="site-header">
      <Navbar variant="dark" expand="lg" className="main-navbar py-2">
        <Container>
          <Button
            variant="link"
            className="menu-btn"
            aria-label="Menu"
            onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
          >
            <i className="fas fa-bars"></i>
          </Button>

          <LinkContainer to="/">
            <Navbar.Brand className="brand">
              <i className="fas fa-shopping-bag me-2"></i>Amaozona
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <div className="search-wrap">
              <Searchbox />
            </div>

            <Nav className="ms-auto align-items-lg-center gap-lg-2">
              <Link to="/cart" className="nav-link cart-link">
                <i className="fas fa-shopping-cart me-1"></i> Cart
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="danger">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </Badge>
                )}
              </Link>

              {userInfo ? (
                <NavDropdown
                  align="end"
                  id="basic-nav-dropdown"
                  title={
                    <span>
                      <i className="fas fa-user-circle me-1"></i>
                      {userInfo.name}
                    </span>
                  }
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>
                      <i className="fas fa-user me-2"></i>Your Profile
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/orderhistory">
                    <NavDropdown.Item>
                      <i className="fas fa-box me-2"></i>Order History
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <Link className="dropdown-item" to="#signout" onClick={handleSignOut}>
                    <i className="fas fa-sign-out-alt me-2"></i>Sign Out
                  </Link>
                </NavDropdown>
              ) : (
                <Link className="btn btn-warning btn-sm fw-semibold px-3" to="/signin">
                  Sign In
                </Link>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="admin-nav-dropdown" align="end">
                  <LinkContainer to="/admin/dashboard">
                    <NavDropdown.Item>
                      <i className="fas fa-chart-line me-2"></i>Dashboard
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/products">
                    <NavDropdown.Item>
                      <i className="fas fa-tags me-2"></i>Products
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>
                      <i className="fas fa-receipt me-2"></i>Orders
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/users">
                    <NavDropdown.Item>
                      <i className="fas fa-users me-2"></i>Users
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
 
    <div
      className={
        sidebarIsOpen
          ? "site-navbar active-nav d-flex flex-column"
          : "site-navbar d-flex flex-column"
      }
    >
      <div className="sidebar-head d-flex justify-content-between align-items-center">
        <span><i className="fas fa-th-large me-2"></i>Categories</span>
        <button className="sidebar-close" onClick={() => setSidebarIsOpen(false)} aria-label="Close">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <Nav className="flex-column p-2">
        <Nav.Link
          as={Link}
          className="sidebar-link"
          to="/search?category=all&query=all&price=all&rating=all&order=newest&page=1"
          onClick={() => setSidebarIsOpen(false)}
        >
          All Products <i className="fas fa-chevron-right"></i>
        </Nav.Link>
        {categories.map((category) => (
          <Nav.Link
            key={category}
            as={Link}
            className="sidebar-link"
            to={`/search?category=${category}&query=all&price=all&rating=all&order=newest&page=1`}
            onClick={() => setSidebarIsOpen(false)}
          >
            {category} <i className="fas fa-chevron-right"></i>
          </Nav.Link>
        ))}
      </Nav>
    </div>
 
    <main className="flex-grow-1">
      <Container className="mt-3">
        <AppRoutes />
      </Container>
    </main>

    <Footer />
  </div>
</div>
  );
}

export default App;