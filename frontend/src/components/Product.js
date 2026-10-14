import { axiosInstance } from "../lib/axios.js";
import { useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../store.js";
import Rating from "./Rating.js";

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addtocarthandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axiosInstance.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      toast.error("Sorry product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const outOfStock = product.countInStock === 0;

  return (
    <Card className="product-card h-100">
      <Link to={`/product/${product.slug}`} className="product-img-wrap">
        <img src={product.image} className="product-img" alt={product.name} loading="lazy" />
        {outOfStock && <span className="stock-badge">Out of Stock</span>}
      </Link>

      <Card.Body className="d-flex flex-column">
        <div className="product-category">{product.category}</div>
        <Link to={`/product/${product.slug}`} className="product-title">
          {product.name}
        </Link>
        <div className="product-brand">by {product.brand}</div>
        <Rating rating={product.rating} numReviews={product.numReviews} />

        <div className="mt-auto pt-3 d-flex align-items-center justify-content-between">
          <span className="product-price">₹{Number(product.price).toLocaleString("en-IN")}</span>
          {outOfStock ? (
            <Button disabled variant="light" size="sm">Sold out</Button>
          ) : (
            <Button variant="warning" size="sm" className="fw-semibold" onClick={() => addtocarthandler(product)}>
              <i className="fas fa-cart-plus me-1"></i>Add
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default Product;