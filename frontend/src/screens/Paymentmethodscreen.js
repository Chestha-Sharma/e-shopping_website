import React, { useEffect } from 'react'
import { useState } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store } from '../store';
import {Button, Form} from 'react-bootstrap';
import {Helmet} from 'react-helmet-async';
import Checkoutsteps from '../components/Checkoutsteps';
import { toast } from 'react-toastify';
export default function Paymentmethodscreen() {
    const navigate = useNavigate();
    const {state , dispatch : ctxdispatch} = useContext(Store);
    const {
        cart : {shippingAddress , paymentMethod}
    } = state;

    const [paymentMethodName, setPaymentMethod] = useState(localStorage.getItem('paymentMethod')||'');

    useEffect(()=>{
        if(!shippingAddress){
            navigate('/shipping');
        }
    },[shippingAddress,navigate]);

    const submithandler = (e) => {
        e.preventDefault();
        if(paymentMethodName===''){
            toast.error('Please select a payment method');
            return;
        }
        ctxdispatch({
               type: 'SAVE_PAYMENT_METHOD',
               payload: paymentMethodName
           });
        localStorage.setItem('paymentMethod',paymentMethodName);
        navigate('/placeorder');
    };
    const handleRadioClick = (value) => {
        if(value===paymentMethodName){
            setPaymentMethod('');
        }
        else{
            setPaymentMethod(value);
        }
    };
  return (
    <div>
      <Checkoutsteps step1 step2 step3></Checkoutsteps>
      <div className='container small-container'>
        <Helmet>
            <title>Payment Method</title>
        </Helmet>
        <h1 className='my-3'>Payment Method</h1>
        <Form onSubmit={submithandler}>
          <div className='mb-3'>
            <Form.Check
            type="radio"
            id="paypal"
            label="Paypal"
            value="paypal"
            onClick={()=>handleRadioClick('paypal')}
            onChange={(e) => setPaymentMethod(e.target.value)}
            checked={paymentMethodName === "paypal"}
              />
              <Form.Check
            type="radio"
            id="stripe"
            label="Stripe"
            value="stripe"
            onClick={()=>handleRadioClick('stripe')}
            onChange={(e) => setPaymentMethod(e.target.value)}
            checked={paymentMethodName === "stripe"}
              />
              <Form.Check
            type="radio"
            id="phonepay"
            label="Phone Pay"
            value="phonepay"
            onChange={(e) => setPaymentMethod(e.target.value)}
            onClick={()=>handleRadioClick('phonepay')}
            checked={paymentMethodName === "phonepay"}
              />
          </div>
          <div className='mb-3'>
            <Button type="submit" variant="primary">
                Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
