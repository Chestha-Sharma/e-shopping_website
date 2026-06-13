import axios from 'axios';
import { useContext } from 'react';
import { Button, Card, Col, ListGroup } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../store';
// Removed unused Row, Col, and useNavigate imports

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const updatecarthandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  const removeitem = (item) => {
    ctxDispatch({
      type: 'CART_REMOVE_ITEM',
      payload: item,
    });
  };
  const checkouthandler = () => {
    navigate('/signin?redirect=/shipping');
  };
  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1 className="my-4">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="alert alert-info">
          Cart is empty. <Link to="/">Go to Home</Link>
        </div>
      ) : (
        <ListGroup>
          {cartItems.map((item) => (
            <ListGroup.Item key={item._id} className="p-3">
              {/* Flex container holding the entire row */}
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                {/* Product Image & Name */}
                <div
                  className="d-flex align-items-center gap-3"
                  style={{ flex: '2', minWidth: '200px' }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded img-thumbnail"
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                    }}
                  />
                  <Link
                    to={`/product/${item._id}`}
                    className="text-decoration-none fw-bold"
                  >
                    {item.name}
                  </Link>
                </div>

                {/* Quantity Controls */}
                <div
                  className="d-flex align-items-center gap-2"
                  style={{ flex: '1', minWidth: '120px' }}
                >
                  <Button
                    variant="light"
                    onClick={() => updatecarthandler(item, item.quantity - 1)}
                    disabled={item.quantity === 1}
                  >
                    <i className="fas fa-minus-circle"></i>
                  </Button>
                  <span className="fw-bold px-2">{item.quantity}</span>
                  <Button
                    variant="light"
                    onClick={() => updatecarthandler(item, item.quantity + 1)}
                    disabled={item.quantity === item.countInStock}
                  >
                    <i className="fas fa-plus-circle"></i>
                  </Button>
                </div>

                {/* Price */}
                <div
                  className="fw-bold fs-5"
                  style={{ flex: '1', minWidth: '80px' }}
                >
                  {item.price} /-
                </div>

                {/* Delete Button */}
                <div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeitem(item)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
      <Col md={4}>
        <Card>
          <Card.Body>
            <ListGroup varinent="flush">
              <ListGroup.Item>
                <h3>
                  SubTotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                  items) :
                  {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  {'/-'}
                </h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <div className="d-grid">
                  <Button
                    type="button"
                    variant="primary"
                    disabled={cartItems.length === 0}
                    onClick={checkouthandler}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </div>
  );
}
