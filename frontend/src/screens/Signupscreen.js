import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Store } from "../store"; 
import { toast } from "react-toastify";
import { geterror } from "../util";

export default function SignupScreen() {
  const navigate = useNavigate();
    const {search} =useLocation();  
    const redirectInURL = new URLSearchParams(search).get('redirect');
    const redirect = redirectInURL ? redirectInURL : '/';
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');

     const {state, dispatch : ctxdispatch} = useContext(Store);

       const {userInfo} = state;
    const submitHandler = async (e) => {
      e.preventDefault(); 
      if(password!=confirmpassword){
        toast.error('password do not match');
        return;
      }
      try{
        const {data} = await axios.post('/api/users/signup',{
              name,
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
    <title>Sign Up</title>
  </Helmet>
  <h1 className="my-3" >Sign Up</h1>
  <Form onSubmit={submitHandler}>\
    <Form.Group className="mb-3" controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control type="name" placeholder="Enter name" required onChange={(e)=> setName(e.target.value)}/> 
         </Form.Group>
    <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" required onChange={(e)=> setEmail(e.target.value)}/> 
         </Form.Group>
    <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Enter Password" required onChange={(e)=> setPassword(e.target.value)}/> 
       </Form.Group>
       <Form.Group className="mb-3" controlId="confirmpassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="password" placeholder="Confirm Password" required onChange={(e)=> setConfirmPassword(e.target.value)}/> 
         </Form.Group> 
    <div className="mb-3">
        <Button type="submit" variant="primary">
            Sign Up
        </Button>
    </div>
    <div className="mb-3">
     Already have an account?{' '}

     <Link to={`/signup?redirect=${redirect}`}>Sign-In</Link>
    </div>
  </Form>
  </Container>
  )
}