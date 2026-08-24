import {axiosInstance} from '../lib/axios.js';
import { useContext, useEffect, useReducer } from 'react';
import { Badge, Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Msg from '../components/MassageBox';
import Rating from '../components/Rating';
import { Store } from '../store';
import { geterror } from '../util';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': 
    return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false };
      default:
      return state;
  }
};
function ProductScreen() {
  const navigate = useNavigate();
  const param = useParams();
  const { slug } = param;
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axiosInstance.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: geterror(err) }); // ye kaam kiya kyoki yaha 404 status wali error aayegi jab product nahi milega to uske liye geterror function use kiya hai jo ki util.js me define hai aur wo function error message ko handle karega aur agar backend se message aata hai to wo message show karega aur agar backend se message nahi aata hai to wo generic error message show karega.
          }
    };
    fetchData();
  }, [slug]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
    const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;  
    try {
    const { data } = await axiosInstance.get(`/api/products/${product._id}`);
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
     navigate('/cart');
  }; 
  return (
    <Card>
      <Card.Body>
        {loading ? (
          <Loading />
        ) : error ? (
          <Msg variant="danger">{error}</Msg>
        ) : (
          <Row>
            <Col md={6}>
              <img
                className="img-large"
                src={product.image}
                alt={product.name}
              ></img>
            </Col>
            <Col md={3}>
              <ListGroup variant="flush"> 
                <ListGroup.Item>
                  <Helmet>
                    <title>{product.name}</title>
                  </Helmet> 
                  <h1>{product.name}</h1>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  ></Rating>
                </ListGroup.Item>
                <ListGroup.Item>Price : {product.price} /-</ListGroup.Item>
                <ListGroup.Item>
                  Description : {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
               <Card>
                <Card.Body> 
                  <ListGroup variant="flush">
                    <ListGroup.Item> 
                      <Row> 
                        <Col>Price:</Col>
                        <Col>{product.price}/-</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row> 
                        <Col>Status : </Col>
                        <Col>
                          {product.countInStock > 0 ? (
                            <Badge bg="success">In Stock</Badge>
                          ) : (
                            <Badge bg="danger">Out of Stock</Badge>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Rating
                          rating={product.rating}
                          numReviews={product.numReviews}
                        ></Rating>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className="d-grid"> 
                        <Button onClick={addToCartHandler} className="btn btn-primary">
                          Add to cart
                        </Button>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}

export default ProductScreen;
