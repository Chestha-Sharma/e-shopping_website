import axios from 'axios';
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
    case 'FETCH_REQUEST': //when we start fetching data from backend then we set loading to true and when we get the data from backend then we set loading to false and set products to the data we got from backend and if there is an error then we set loading to false and set error to the error we got from backend.
      return { ...state, loading: true }; //loading true loading box show karega aur jab data mil jayega to loading false ho jayega aur products show karega aur agar error aata hai to loading false ho jayega aur error show karega.
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false }; //...state means we are keeping the previous state and then we are updating the error and loading state.
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
      //when we start fetching data from backend then we set loading to true and when we get the data from backend then we set loading to false and set products to the data we got from backend and if there is an error then we set loading to false and set error to the error we got from backend.
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: geterror(err) }); // ye kaam kiya kyoki yaha 404 status wali error aayegi jab product nahi milega to uske liye geterror function use kiya hai jo ki util.js me define hai aur wo function error message ko handle karega aur agar backend se message aata hai to wo message show karega aur agar backend se message nahi aata hai to wo generic error message show karega.
        //message coming from server.js through geterror function in util.js and we are passing the error we got from backend to geterror function and it will return the message we got from backend if there is a message in the response and if there is no message in the response then it will return the generic error message we got from browser.
      }
    };
    fetchData();
  }, [slug]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  //dispatch: ctxDispatch dispatch is renamed to ctxDispatch because we are using dispatch in this component and we are also using dispatch in the global state management so to avoid confusion we are renaming dispatch to ctxDispatch.
  const addToCartHandler = async () => {
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
     navigate('/cart');
  };
  //   Yahan par type ka kaam ek "Label" ya "Instruction" ki tarah hota hai.
  // Jab aap ctxDispatch call karte hain, toh aap Reducer function ko ek signal bhej rahe hote hain. Reducer ke paas bahut saare kaam ho sakte hain (jaise item add karna, item remove karna, ya cart clear karna). type hi wo cheez hai jo Reducer ko batati hai ki kaunsa logic execute karna hai.
  // Isko real-life example se samajhte hain:
  // 1. Restaurant Example
  // Sochiye aap ek restaurant mein hain:
  // dispatch: Aapka Waiter hai.
  // type: Aapka Order hai (e.g., "MUMBAI_SANDWICH").
  // payload: Aapki Special instructions hain (e.g., "Extra cheese, no onions").
  // Reducer: Aapka Chef hai.
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
                {/* React Bootstrap mein variant="flush" ka matlab hai "Borders ko remove karna aur edges ko flat karna.*/}
                <ListGroup.Item>
                  <Helmet>
                    <title>{product.name}</title>
                  </Helmet>
                  {/* from this helmet we can manage the document head in our React application */}
                  {/* we can manage the title, meta tags, and other elements in the document head */}
                  {/*but after using it here if i do not use it elsewhere then it will show same title other places so we should use it in all our pages */}
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
              {/* Bootstrap ke Grid System mein md aur xs ka matlab hota hai Breakpoints. Ye tay karte hain ki alag-alag screen sizes (Laptop, Tablet, Mobile) par aapka column kitni jagah lega. */}
              <Card>
                <Card.Body>
                  {/* card body se padding mil jayegi aur card ke andar content ko center me show karega */}
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      {/* Price : {product.price} /-  or we can write it as */}
                      <Row>
                        {/* used row first so that ek hi line me aaye and then col taki col bhi ek hi ho*/}
                        <Col>Price:</Col>
                        <Col>{product.price}/-</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        {/* see  here we used badge  it also comes form react-bootstrap */}
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
                        {/* d-grid is a bootstrap class that makes the button take the full width of the container */}
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
