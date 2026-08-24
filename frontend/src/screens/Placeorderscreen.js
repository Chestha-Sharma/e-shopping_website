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
   cart.itemsPrice = round2decimals(cart.cartItems.reduce((a, c) => a + c.price * c.quantity, 0));
    cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 35;
    cart.taxPrice = round2decimals(cart.itemsPrice * 0.05);
    cart.totalPrice = round2decimals(cart.itemsPrice + cart.shippingPrice + cart.taxPrice);
  const placeorderhandler = async () => {
        try{
          console.log("User Info Status:", userInfo);
            dispatch({type:'CREATE_REQUEST'});
            const {data} = await axios.post('/api/order',{
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
                }  
            }
          );
           await axios.put('/api/users/update-cart', {
      userId: userInfo._id,
      cartItems: []
    }, {
      headers: { Authorization: `Bearer ${userInfo.token}` }
    });

    ctxDispatch({ type: 'CART_CLEAR' });
    dispatch({type: 'CREATE_SUCCESS'});
    navigate(`/order/${data.order._id}`);
  } catch(error) {
    dispatch({type: 'CREATE_FAIL'});
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
                      <Col md={6} className="d-flex align-items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail me-3" 
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
                      <Col md={3} className="text-center">
                        <span className="fw-semibold">
                          Qty: {item.quantity}
                        </span>
                      </Col> 
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
