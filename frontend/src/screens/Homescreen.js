//react bootstrap ko isliye use kiya hai taki hamare website ka design aur layout achha lage aur responsive ho jisse ki website mobile aur desktop dono par achhi lage aur use karne me easy ho.
//bootstrap adds its inbuilt css like tailwind css and make ui responsive and good looking and we can use its components like navbar, container, button etc. to make our website look better and responsive.
// import data from "../data"; static data ko backend se fetch karne ke liye useEffect aur axios ka use kiya hai not from frontend
import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import logger from 'use-reducer-logger';
import Loading from '../components/Loading';
import Msg from '../components/MassageBox';
import Product from '../components/Product';
//logger is like console.log for reducer it will log the action and the state before and after the action is dispatched and it will help us to debug our reducer and see how the state is changing based on the actions dispatched.
//  We use a logger in a useReducer setup primarily for debugging and state tracking.
// In a complex application, the state changes many times. Without a logger, it is difficult to know exactly when the state changed, what action triggered it, and what the data looked like before and after the update.
// logger is just for testing and debugging purpose and it will log the action and the state before and after the action is dispatched and it will help us to debug our reducer and see how the state is changing based on the actions dispatched. It is not necessary to use logger in production code, it is just for development and debugging purpose.
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': //when we start fetching data from backend then we set loading to true and when we get the data from backend then we set loading to false and set products to the data we got from backend and if there is an error then we set loading to false and set error to the error we got from backend.
      return { ...state, loading: true }; //loading true loading box show karega aur jab data mil jayega to loading false ho jayega aur products show karega aur agar error aata hai to loading false ho jayega aur error show karega.
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false }; //...state means we are keeping the previous state and then we are updating the error and loading state.
    default:
      return state;
  }
};
function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });
  //usereducer have two parameters one is reducer function and other is initial state and it returns an array with two elements first is state and second is dispatch function and we can use destructuring to get the state and dispatch function from the array returned by useReducer.
  //dispatch is used to send the action to the reducer and then the reducer will update the state based on the action type and payload.
  // difference in action and payload is that action is an object that has a type and a payload and type is used to identify the action and payload is used to pass the data to the reducer and then the reducer will update the state based on the action type and payload.

  // const [products, setProducts] = useState([]);

  //we are replaxing usestate with reducer in order to manage the state of products more efficiently and handle different actions related to products in a more organized way.
  //beacause reducer allows us to centralize the logic for updating the state based on different actions, making it easier to maintain and scale our application as it grows.
  //and in state next state depends on previous state but in reducer we can manage the state more efficiently and handle different actions related to products in a more organized way.
  //and state is complex and we have to manage multiple states related to products like loading, error, success etc. but in reducer we can manage all these states in a single place and handle different actions related to products in a more organized way.
  useEffect(() => {
    //important is that ab ham backend se data fetch kar rhe h to ab backend ko bhi ek terminal me permemnent on rahna hoga taki jab bhi frontend se backend se data fetch karne ki request aaye to backend se data mil sake aur frontend me show ho sake.
    const fetchData = async () => {
      //when we start fetching data from backend then we set loading to true and when we get the data from backend then we set loading to false and set products to the data we got from backend and if there is an error then we set loading to false and set error to the error we got from backend.
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []); //ARRAY EMPTY KYOKI HAMWE USEEFFECT KO RENDING KE TIME EK HI BAR CHALANA CHAHTE HAI
  return (
    <div>
      <Helmet>
        <title>Amazona</title>
      </Helmet>
      <h1>Products</h1>
      <div className="products">
        {loading ? (
          <Loading />
        ) : error ? (
          <Msg variant="danger">{error}</Msg>
        ) : (
          // data.products.map((products)
          <Row>
            {products.map((product) => (
              <Col sm={6} md={4} lg={3} className="mb-3" key={product.slug}>
                {/* here sm, md, lg are for different screen sizes they  are no of columns for each screen size sg means small screen, md means medium screen, lg means large screens*/
                /*sm is 6 means 12/6 = 2 items in row similarly for others */}
                {/* <div className="product" key={product.slug}>
              <Link to={`/product/${product.slug}`}>
                <img src={product.image} alt={product.name} />
              </Link>
              <div className="product-info"> 
                <Link to={`/product/${product.slug}`}>
                  <p><strong>{product.name}</strong></p>
                </Link>
                <p>Price : {product.price} /-</p>
                <button>Add to cart</button>
              </div>
            </div> */}

                {/* now we will use new component named Produxt(made by us) instead of this because we are using product items at multiple places fron this jsx */}

                <Product product={product}></Product>
                {/* product={product}this is props for product component */}
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
