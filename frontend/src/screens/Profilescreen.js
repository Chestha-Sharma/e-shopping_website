import React, { useContext, useReducer, useState } from 'react'
import { Store } from '../store';
import { Helmet } from 'react-helmet-async';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { geterror } from '../util';
import axios from 'axios';
const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
            case 'UPDATE_SUCCESS':
                return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false, error: action.payload };
        default:
            return state;
    }
}
export default function Profilescreen() {
    const { state , dispatch : ctxdispatch} = useContext(Store);
    const { userInfo } = state;
    const [name, setName] = useState(userInfo.name );
    const [email, setEmail] = useState(userInfo.email );
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [{loadingUpdate, error},dispatch]=useReducer(reducer,{
        loadingUpdate : false,
        error : ''
    })
     const submitHandler = async (e)=>{
        e.preventDefault(); 
        if(password !== confirmPassword){
            window.alert('Passwords do not match');
            return;
        }
         try{
            dispatch({type : 'UPDATE_REQUEST'});
            const {data}= await axios.put('/api/users/profile',{  //put request http api request
                name,
                email,
                password
            },
            {
                headers : {
                    authorization : `Bearer ${userInfo.token}`
                }
            }
        );
            dispatch({type : 'UPDATE_SUCCESS'});
            ctxdispatch({type : 'SIGNIN', payload : data});
            localStorage.setItem('userInfo',JSON.stringify(data));
             toast.success('Profile updated successfully');
         }
         catch(error){
            dispatch({type : 'UPDATE_FAIL' , payload : error.message});
            toast.error(geterror(error));
         }
     };
  return (
    <div className='container small-container'>
      <Helmet>
        <title> User Profile</title>
        </Helmet>
         <h1>User Profile</h1>
         <form onSubmit={submitHandler}>
          <Form.Group className='mb-3' controlId='Name'>
            <Form.Label>Name</Form.Label> 
            <Form.Control value={name}
            onChange={(e)=>setName(e.target.value)}
            required
             />
          </Form.Group> 
          <Form.Group className='mb-3' controlId='Email'>
            <Form.Label>Email</Form.Label> 
            <Form.Control value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
             />
          </Form.Group>
          <Form.Group className='mb-3' controlId='Password'>
            <Form.Label>Password</Form.Label> 
            <Form.Control value={password}
            onChange={(e)=>setPassword(e.target.value)} 
             />
          </Form.Group>
          <Form.Group className='mb-3' controlId='Confirm Password'>
            <Form.Label>Confirm Password</Form.Label> 
            <Form.Control value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)} 
             />
          </Form.Group> 
          <Button type='submit'>Update</Button>
         </form>
    </div>
  )
}
