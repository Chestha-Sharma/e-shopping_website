import { axiosInstance } from "../lib/axios.js";
import { useEffect, useReducer } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Loading from "../components/Loading.js";
import Msg from "../components/MassageBox.js";
import Product from "../components/Product.js";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axiosInstance.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Helmet>
        <title>E_SHOPPING</title>
      </Helmet>
 
      <section className="hero">
        <h1>Shop smarter,<br />live better.</h1>
        <p>Thousands of quality products at the best prices, delivered fast to your door.</p>
        <Button as={Link} to="/search" variant="warning" size="lg" className="fw-semibold px-4">
          Shop Now <i className="fas fa-arrow-right ms-1"></i>
        </Button>
      </section>

      <h2 className="section-title mb-4">Featured Products</h2>

      {loading ? (
        <Loading />
      ) : error ? (
        <Msg variant="danger">{error}</Msg>
      ) : (
        <>
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {products.slice(0, 12).map((product) => (
              <Col key={product.slug}>
                <Product product={product} />
              </Col>
            ))}
          </Row>

          <div className="text-center my-5">
            <Button as={Link} to="/search" variant="dark" className="px-4">
              View All Products
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default HomeScreen;