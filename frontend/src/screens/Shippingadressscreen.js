import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useContext } from 'react';
import { Store } from '../store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react'; 
import Checkoutsteps from '../components/Checkoutsteps';

export default function Shippingadressscreen() {
   
    const {state , dispatch : ctxdispatch} = useContext(Store);
    const { userInfo, cart: {shippingAddress} }= state;
    const navigate = useNavigate();

    const [fullname, setFullname] = useState(shippingAddress.fullname || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalcode, setPostalcode] = useState(shippingAddress.postalcode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');
    
    useEffect(() => {
         if(!userInfo){
            navigate('/signin?redirect=/shipping'); //using this redirect when we will sign in here then after sign in i will redirect to shipping page not at home page
         }
    },[userInfo,navigate]);


    const submithandler = (e) => {
        e.preventDefault();
        ctxdispatch({
            type : 'SAVE_SHIPPING_ADDRESS',
            payload : {
                fullname,
                address,
                city,
                postalcode,
                country
            }
        });
        localStorage.setItem('shippingAddress',JSON.stringify({fullname,address,city,postalcode,country}));
        navigate('/payment');
    } 
  return (
    <div>
        <Helmet>
            <title>Shipping Address</title>  
        </Helmet>
        <Checkoutsteps step1 step2></Checkoutsteps>
        <div className='container small-container'>
        <h1 className='my-3'>Shipping Address</h1>
        <Form onSubmit={submithandler}>
            <Form.Group className='mb-3' controlId='Full Name'>
                <Form.Label>Full Name</Form.Label>
                <Form.Control value={fullname} onChange={(e)=>setFullname(e.target.value)} required/>
            </Form.Group>
            <Form.Group className='mb-3' controlId='Address'>
                <Form.Label>Address</Form.Label>
                <Form.Control value={address} onChange={(e)=>setAddress(e.target.value)} required/>
            </Form.Group>
            <Form.Group className='mb-3' controlId='City'>
                <Form.Label>City</Form.Label>
                <Form.Control value={city} onChange={(e)=>setCity(e.target.value)} required/>
            </Form.Group>
            <Form.Group className='mb-3' controlId='Postalcode'>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control value={postalcode} onChange={(e)=>setPostalcode(e.target.value)} required/>
            </Form.Group>
            <Form.Group className='mb-3' controlId='Contry'>
                <Form.Label>Country</Form.Label>
                <Form.Control value={country} onChange={(e)=>setCountry(e.target.value)} required/>
            </Form.Group>
             <div className='mb-3'>
                <Button varient='primary' type='submit'>
                    Continue
                </Button>
             </div>
        </Form>
        </div>
    </div>
  );
}