import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {axiosInstance} from "./lib/axios.js";
import React, { useEffect, useState, useContext } from "react";
import { Store } from "../store"; 
import { toast } from "react-toastify";
import { geterror } from "../util";

export default function SigninScreen() {
  const navigate = useNavigate();
    const {search} =useLocation(); 
    const redirectInURL = new URLSearchParams(search).get('redirect');
    const redirect = redirectInURL ? redirectInURL : '/';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

     const {state, dispatch : ctxdispatch} = useContext(Store);

       const {userInfo} = state;
    const submitHandler = async (e) => {
      e.preventDefault(); 
      try{
        const {data} = await axiosInstance.post('/api/users/signin',{
              email,
              password
        });
        ctxdispatch({type: 'SIGNIN', payload: data}); 
        navigate(redirect || '/');
      } catch (error) {
        toast.error(geterror(error)); 
      }
    };

    useEffect(() => {
      if(userInfo){
        navigate(redirect);
      }
    },[navigate,redirect,userInfo]);
  return (
  <Container className="small-container">
  <Helmet>
    <title>Sign In</title>
  </Helmet>
  <h1 className="my-3" >Sign In</h1>
  <Form onSubmit={submitHandler}>
    <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" required onChange={(e)=> setEmail(e.target.value)}/>  
    </Form.Group>
    <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Enter Password" required onChange={(e)=> setPassword(e.target.value)}/> 
    </Form.Group>
    <div className="mb-3">
        <Button type="submit" variant="primary">
            Sign In
        </Button>
    </div>
    <div className="mb-3">
     New Costomer?{' '}

     <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
    </div>
  </Form>
  </Container>
  )
}