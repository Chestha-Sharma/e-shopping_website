import React from 'react'
import { useContext ,useReducer } from 'react';
import { useLocation ,Link } from 'react-router-dom';
import { Store } from '../store';
import { useEffect } from 'react';
import axios from 'axios';
import Loading from '../components/Loading';
import Msg from '../components/MassageBox';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, products: action.payload.products, countProducts: action.payload.countProducts, page: action.payload.page, pages: action.payload.pages };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}
export default function Productlistscreen() {

    const [{ loading, error, products, countProducts, page, pages }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        products: [],
        countProducts: 0,
        page: 1,
        pages: 0
    });

//     {
//   pathname: "/search",             // यह बताता है कि आप किस पेज पर हैं
//   search: "?query=shirts&page=2",  // यह '?' के बाद का पूरा हिस्सा (Query String) देता है
//   hash: "",                        // URL में अगर '#' के बाद कुछ है (जैसे #about)
//   state: null                      // पिछले पेज से भेजा गया कोई गुप्त डेटा (Hidden Data)
// }
// इसे कब, कहाँ और कैसे यूज़ करना है? (How to Know?)
// आपको इसका इस्तेमाल तब करना है जब आपकी स्क्रीन पर दिखने वाला डेटा सीधे ब्राउज़र के URL पर निर्भर करता हो। इसके कुछ मुख्य उदाहरण नीचे दिए गए हैं:

// क) जब URL से Query Parameters (जैसे सर्च टर्म, फिल्टर, या पेज नंबर) निकालने हों
// कब: जब आप सर्च स्क्रीन (Searchscreen.js) बना रहे हैं और यूजर ने ऊपर सर्च बॉक्स में "shirts" लिखा है। URL बन गया /search?query=shirts.

    const { search , pathname } = useLocation();
    const sp = new URLSearchParams(search); // /search?category=Shirts
     const filterpage = sp.get('page') || 1;
     const { state } = useContext(Store);
     const { userInfo } = state;

     useEffect(()=>{
       
        const fetchData = async ()=>{
            try{
                dispatch({type : 'FETCH_REQUEST'});
              const { data } = await axios.get(`/api/products/search?page=${filterpage}`,{
                headers:{
                    authorization : `Bearer ${userInfo.token}`
                }
              });
              dispatch({type : 'FETCH_SUCCESS' , payload : data});
            }
            catch(err){
               
            }
        }
  
        fetchData();
     },[userInfo,filterpage])
  return (
    <div>
      <h1>Products</h1>
      {
        loading ?
        <Loading />
        : error ?
        <Msg variant="danger">{error}</Msg>
        :
        <>
        <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/products?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      }
      </div>
  )
}
