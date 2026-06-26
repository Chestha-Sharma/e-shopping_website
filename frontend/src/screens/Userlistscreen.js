import React from 'react'
import Loading from '../components/Loading';
import Msg from '../components/MassageBox';
import { useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useContext } from 'react';
import { Store } from '../store';
import { useEffect } from 'react';
import { geterror } from '../util';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
     case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false }
    default:
      return state;
  }
};


export default function Userlistscreen() {
 const [{ loading, error, users , loadingDelete , successDelete}, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/users`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: geterror(err),
        });
      }
    };
    if(successDelete){
        dispatch({ type: 'DELETE_RESET' });
    }
    else
    fetchData();
  }, [userInfo,successDelete]);

   
    const deleteHandler = async (user) => {
       if(window.confirm('Are you sure you want to delete this user?')){
        try{
            dispatch({type : 'DELETE_REQUEST'});
            await axios.delete(`/api/users/${user._id}`,{
                headers : {
                    authorization : `Bearer ${userInfo.token}`
                }
            });
            toast.success('User Deleted Successfully');
            dispatch({ type: 'DELETE_SUCCESS' });
        }
        catch(e){
            toast.error(geterror(e));
            dispatch({ type: 'DELETE_FAIL', payload: geterror(e) });
        }
       }
    }



  return (
    <div>
      <Helmet>
        <title>Users</title>
      </Helmet>
      <h1>Users</h1>
      {loadingDelete && <Loading />}
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <Msg variant="danger">{error}</Msg>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>IS ADMIN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                <td>
                    <Button type='button' variant='light' onClick={()=>navigate(`/admin/user/${user._id}`)}>
                        Edit
                    </Button>
                     &nbsp;
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => deleteHandler(user)}
                  >
                    Delete
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
