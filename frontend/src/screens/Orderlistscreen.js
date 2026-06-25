import React from 'react'
import { useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../store';
import { useContext } from 'react';
import { useEffect } from 'react';
import { geterror } from '../util';
import Loading from '../components/Loading';
import Msg from '../components/MassageBox';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';


const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


export default function Orderlistscreen() {
    const navigate = useNavigate();
    const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '', 
    });
   const { state } = useContext(Store);
   const { userInfo } = state;


   useEffect(()=>{
    

    const fetchData = async ()=>{
      try{
        dispatch({type : 'FETCH_REQUEST'});
        const {data} = await axios.get('/api/order',{
          headers : {
            authorization : `Bearer ${userInfo.token}`
          }
        });
        dispatch({type : 'FETCH_SUCCESS' , payload : data});
      }
      catch(err){ 
        dispatch({type : 'FETCH_FAIL' , payload : geterror(err)});
      }
    }


    fetchData();
   },[userInfo])


  return (
    <div>
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <Msg variant="danger">{error}</Msg>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user ? order.user.name : 'DELETED USER'}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td> 
                <td>
                  {order.isDelivered
                    ? order.deliveredAt.substring(0, 10)
                    : 'No'}
                </td>
                <td>
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      navigate(`/order/${order._id}`);
                    }}
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
