import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async'; 
import Loading from '../components/Loading';
import Msg from '../components/MassageBox';
import Product from '../components/Product';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST': 
    return { ...state, loading: true }; 
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, error: action.payload, loading: false }; 
      default:
      return state;
  }
};
function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer((reducer), {
    products: [],
    loading: true,
    error: '',
  });
  useEffect(() => {
        const fetchData = async () => {
       dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);  
  return (
    <div>
      <Helmet>
        <title>E_SHOPPING</title>
      </Helmet>
      <h1>Products</h1>
      <div className="products">
        {loading ? (
          <Loading />
        ) : error ? (
          <Msg variant="danger">{error}</Msg>
        ) : ( 
          <Row>
            {products.map((product) => (
              <Col sm={6} md={4} lg={3} className="mb-3" key={product.slug}>
               <Product product={product}></Product> 
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
