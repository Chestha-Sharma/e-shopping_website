import React from 'react'
import { useContext ,useReducer } from 'react';
import { useLocation ,Link, useNavigate } from 'react-router-dom';
import { Store } from '../store.js';
import { useEffect } from 'react';
import {axiosInstance} from '../lib/axios.js';
import Loading from '../components/Loading.js';
import Msg from '../components/MassageBox.js';
import { Button, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { geterror } from '../util.js';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, products: action.payload.products, countProducts: action.payload.countProducts, page: action.payload.page, pages: action.payload.pages };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
             case 'CREATE_REQUEST':
             return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
          return {
            ...state,
            loadingCreate: false,
          };
        case 'CREATE_FAIL':
          return { ...state, loadingCreate: false };
          case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
        default:
            return state;
    }
}
export default function Productlistscreen() {

    const [{ loading, error, products, countProducts, page, pages ,loadingCreate , loadingDelete , successDelete }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        products: [],
        countProducts: 0,
        page: 1,
        pages: 0,
        loadingCreate: false,
        loadingCreate: false,
        loadingDelete: false,  
        successDelete: false,   
    }); 
    const { search } = useLocation();
    const navigate = useNavigate();
    const sp = new URLSearchParams(search);  
     const filterpage = sp.get('page') || 1;
     const { state } = useContext(Store);
     const { userInfo } = state;

     useEffect(()=>{
       
        const fetchData = async ()=>{
            try{
                dispatch({type : 'FETCH_REQUEST'});
              const { data } = await axiosInstance.get(`/api/products/search?page=${filterpage}`,{
                headers:{
                    authorization : `Bearer ${userInfo.token}`
                }
              });
              dispatch({type : 'FETCH_SUCCESS' , payload : data});
              if(successDelete){
                dispatch({type : 'DELETE_RESET'});
              }
            }
            catch(err){
               
            }
        }
  
        fetchData();
     },[userInfo,filterpage,successDelete]);

    const createHandle = async ()=>{
       
        try{
            dispatch({type : 'CREATE_REQUEST'});
            const {data} = await axiosInstance.post('/api/products',{},{
                    headers:{
                        authorization : `Bearer ${userInfo.token}`
                    } 
            });
            toast.success('Product Created Successfully');
            dispatch({type : 'CREATE_SUCCESS'});
            navigate(`/admin/products`);
        }
        catch(err){
            toast.error(geterror(err));
            dispatch({ type: 'FETCH_FAIL', payload: geterror(err) });
        }

    }

    const deleteHandler = async (product) => {
       if(window.confirm('Are you sure you want to delete this product?')){
        try{
            dispatch({type : 'DELETE_REQUEST'});
           await axiosInstance.delete(`/api/products/${product._id}`,{
               headers:{
                   authorization : `Bearer ${userInfo.token}`
               }
           });
           toast.success('Product Deleted Successfully');
           dispatch({ type: 'DELETE_SUCCESS' }); 
        }
        catch(err){
            toast.error(geterror(err));
            dispatch({ type: 'DELETE_FAIL', payload: geterror(err) });
        }
       }
    }

  return (
    <div>
      <h1>Products</h1>
      <Row>
        <Col>
        <h1>Products</h1>
        </Col>
        <Col className='col text-end'>
        <div>
            <Button type='button' onClick={createHandle}>
                Create Product
            </Button>
            </div>
        </Col>
      </Row>
      {loadingCreate && <Loading />}
      {loadingDelete && <Loading />}
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
                <th>ACTIONS</th>
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
                  <td>
                    <Button
                    type='button'
                    variant='light'
                    onClick={()=>navigate(`/admin/product/${product._id}`)}
                    >
                      Edit
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(product)}
                    >
                      Delete
                    </Button>
                  </td>
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
