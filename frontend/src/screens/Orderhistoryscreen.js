import React, { useContext, useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import Loading from '../components/Loading'
import Msg from '../components/MassageBox'
import { useNavigate } from 'react-router-dom';
import { geterror } from '../util';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { Store } from '../store';


const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' }; //action.payload is the data that we get from the backend
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}
export default function Orderhistoryscreen() {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();
    const [{ loading, error , order}, dispatch] = useReducer(reducer , {
        loading: true,
        error: '',
    });
    useEffect(()=>{
         const fetchData = async ()=>{
            dispatch({ type: 'FETCH_REQUEST' });
            try {
                const { data } = await axios.get(
                    '/api/order/mine',
                    {
                        headers : {authorization : `Bearer ${userInfo.token}`}
                    }
                );
                dispatch({type : 'FETCH_SUCCESS' , payload : data.order});
            }
            catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: geterror(error) });
            }
         };
         fetchData();
    },[userInfo])
  return (
    <div>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1>Order History</h1>
      {
        loading ?
        (
            <Loading />
        ) : (
            error ?(
                <Msg variant="danger">{error}</Msg>
            )
            : (
                <table className='table'>
                    <thead>
                        <th>ID</th>
                        <th>DATE</th>
                        <th>TOTAL</th>
                        <th>PAID</th>
                        <th>DELIVERED</th>
                        <th>ACTIONS</th>
                    </thead>
                    <tbody>
                        {order.map((order)=>{
                        return (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0,10)}</td>
                                <td>{order.totalPrice}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0,10) : 'Not Paid'}</td>
                                <td>{order.isDelivered ? order.deliveredAt.substring(0,10) : 'Not Delivered'}</td>
                                <td>
                                    <Button variant='light' type='button' onClick={()=>navigate(`/order/${order._id}`)}>
                                        View
                                    </Button>
                                </td>
                                </tr>)
                        })}
                    </tbody>
                </table>
            )
        )
      }
    </div>
  )
}
