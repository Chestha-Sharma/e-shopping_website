import React, {  useContext, useEffect, useReducer } from 'react';
import Checkoutsteps from '../components/Checkoutsteps';
import { Helmet } from 'react-helmet-async';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Store } from '../store';
import { useNavigate } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { geterror } from '../util';
import axios from 'axios';
import Loading from '../components/Loading';

const reducer = (state, action) => {
     switch (action.type) {
        case 'CREATE_REQUEST' :
            return { ...state, loading: true };
        case 'CREATE_SUCCESS':
            return { ...state, loading: false };
        case 'CREATE_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};



export default function Placeorderscreen() {
    const [{loading},dispatch] = useReducer(reducer,{loading:false});
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const navigate = useNavigate();

  const round2decimals = (num) => {
    return Math.round(num * 100 +Number.EPSILON) / 100;
  };
   cart.ItemsPrice = round2decimals(cart.cartItems.reduce((a, c) => a + c.price * c.quantity, 0));
//    In JavaScript's .reduce() method, a stands for the "Accumulator".

// The purpose of the .reduce() method is to loop through an array and boil it down to a single value (in this case, calculating the total price of all items in the cart).

// To understand exactly what is happening, let's break down the components of that line:

// JavaScript
// cart.cartItems.reduce((accumulator, currentValue) => { ... }, initialValue)
// In your specific code:

// a (Accumulator): This is a variable that stores the running total. Think of it like a calculator's memory. It carries the accumulated result from one item to the next.

// c (Current Item): This represents the current item object inside the cartItems array that is currently being processed in the loop.

// 0: This is the initial value. Before the loop starts, the accumulator a is set to 0.
   cart.itemsPrice = round2decimals(cart.cartItems.reduce((a, c) => a + c.price * c.quantity, 0));
    cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 35;
    cart.taxPrice = round2decimals(cart.itemsPrice * 0.05);
    cart.totalPrice = round2decimals(cart.itemsPrice + cart.shippingPrice + cart.taxPrice);
  const placeorderhandler = async () => {
        try{
          console.log("User Info Status:", userInfo);
            dispatch({type:'CREATE_REQUEST'});
            const {data} = await axios.post('/api/orders',{
                 orderItems : cart.cartItems,
                 shippingAddress : cart.shippingAddress,
                 paymentMethod : cart.paymentMethod,
                 itemsPrice:cart.itemsPrice,
                 taxPrice : cart.taxPrice,
                 shippingPrice : cart.shippingPrice,
                 totalPrice : cart.totalPrice
            },
            {
                headers:{
                    Authorization:`Bearer ${userInfo.token}`
                }  //by having this header we can access the user info from the backend and we can use it to create the order
            }
          );
            ctxDispatch({
                type: 'CART_CLEAR'
            });
            localStorage.removeItem('cartItems');
            dispatch({type:'CREATE_SUCCESS'});
            navigate(`/order/${data.order._id}`);
        }
        catch(error){
            dispatch({type:'CREATE_FAIL'});
            toast.error(geterror(error));
        }
  };

  useEffect(()=>{
      if(!cart.paymentMethod){
        navigate('/payment'); 
      }
  },[cart.paymentMethod,navigate]);
  return (
    <div>
      <Checkoutsteps step1 step2 step3 step4></Checkoutsteps>
      <Helmet>
        <title>Place Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping Address</Card.Title>
              <Card.Text>
                <strong>Name : </strong> {cart.shippingAddress.fullname}
                <br />
                <strong>Address : </strong> {cart.shippingAddress.address},
                {cart.shippingAddress.city},{cart.shippingAddress.postalcode},
                {cart.shippingAddress.country}
                <br />
              </Card.Text>
              <Link to="/shipping">Change</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method : </strong> {cart.paymentMethod}
                <br />
              </Card.Text>
              <Link to="/payment">Change</Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      {/* Product Image and Name Column */}
                      <Col md={6} className="d-flex align-items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail me-3" // me-3 se image aur naam ke beech gap aayega
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                          }}
                        />
                        <Link
                          to={`/product/${item.slug}`}
                          className="text-decoration-none fw-bold"
                        >
                          {item.name}
                        </Link>
                      </Col>

                      {/* Quantity Column (Centered & Clean) */}
                      <Col md={3} className="text-center">
                        <span className="fw-semibold">
                          Qty: {item.quantity}
                        </span>
                      </Col>

                      {/* Price Column (Centered & Clean) */}
                      <Col md={3} className="text-center">
                        <span>{item.price} /-</span>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link to="/cart">Change</Link>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
        <Card>
            <Card.Body>
                <Card.Title>Order Summary</Card.Title>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Row>
                            <Col>Items</Col>
                            <Col>{cart.itemsPrice.toFixed(2)} /-</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Shipping</Col>
                            <Col>{cart.shippingPrice.toFixed(2)} /-</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Tax</Col>
                            <Col>{cart.taxPrice.toFixed(2)} /-</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Total</Col>
                            <Col>{cart.totalPrice.toFixed(2)} /-</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <div className="d-grid">
                            <Button type="button"
                            onClick={placeorderhandler}
                            disabled={cart.cartItems.length === 0}
                            >
                                Place Order
                            </Button>
                        </div>
                        {loading && <Loading></Loading>}
                    </ListGroup.Item>
                </ListGroup>
            </Card.Body>
        </Card>
        </Col>
      </Row>
    </div>
  );
}
