import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { useContext } from "react";
import { Store } from "../store.js";
import axios from "axios";

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  const addToCart = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;  
    try {
    const { data } = await axios.get(`/api/products/${product._id}`); 
    } catch (error) {
        console.log(error);
    }
    if (product.countInStock < quantity) {
        window.alert('Sorry. Product is out of stock');
        return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity},
    }); 
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title><strong>{product.name}</strong></Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>Price: {product.price} /-</Card.Text>
        <Button className="btn-primary" onClick={addToCart}>
          Add to cart
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Product;