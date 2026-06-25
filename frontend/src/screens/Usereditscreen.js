import React from 'react'
import { Store } from '../store';
import { useContext  } from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { geterror } from '../util';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import Msg from '../components/MassageBox';
import axios from 'axios';
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useReducer } from 'react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};




export default function Usereditscreen() {

    const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '', 
    });
    const { state , dispatch : ctxdispatch} = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();
    const params = useParams();
    const { id: userId } = params;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axios.get(`/api/users/${userId}`,{
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                });
                setName(data.name);
                setEmail(data.email);
                setIsAdmin(data.isAdmin);
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: geterror(error) });
            }
        };
        fetchUser();
    }, [userId , userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            const { data } = await axios.put(`/api/users/${userId}`, {
                name,
                email,
                isAdmin
            }, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            });
            //agar ham usi id me change kr rhe jisme currently login h to 

            if (userInfo._id === userId) {  
            ctxdispatch({ 
                type: 'USER_SIGNIN', 
                payload: { ...userInfo, name, email, isAdmin } 
            });
            localStorage.setItem(
                'userInfo',
                JSON.stringify({ ...userInfo, name, email, isAdmin })
            );

        }
            dispatch({ type: 'UPDATE_SUCCESS' });
            toast.success('User Updated Successfully');
            navigate(`/admin/users`);
        } catch (error) {
            toast.error(geterror(error));
            dispatch({ type: 'UPDATE_FAIL', payload: geterror(error) });
        }
    };


  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit User ${userId}</title>
      </Helmet>
      <h1>Edit User {userId}</h1>

      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <Msg variant="danger">{error}</Msg>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Check
            className="mb-3"
            type="checkbox"
            id="isAdmin"
            label="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />

          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <Loading></Loading>}
          </div>
        </Form>
      )}
    </Container>
  );
}
