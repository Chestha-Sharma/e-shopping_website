import React from 'react';
import Loading from '../components/Loading';
import Msg from '../components/MassageBox';
import { useReducer, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { geterror } from '../util';
import axiosInstance from '../lib/axios.js';
import { Helmet } from 'react-helmet-async';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { Store } from '../store';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, order: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'PAY_REQUEST':
            return { ...state, loadingPay: true };
        case 'PAY_SUCCESS':
            return { ...state, loadingPay: false, successPay: true };
        case 'PAY_FAIL':
            return { ...state, loadingPay: false, errorPay: action.payload };
        case 'PAY_RESET':
            return { ...state, loadingPay: false, successPay: false };
            case 'DELIVER_REQUEST':
                 return { ...state, loadingDeliver: true };
             case 'DELIVER_SUCCESS':
               return { ...state, loadingDeliver: false, successDeliver: true };
             case 'DELIVER_FAIL':
               return { ...state, loadingDeliver: false };
             case 'DELIVER_RESET':
               return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
        default:
            return state;
    }
}

export default function Orderscreen() {
    const { state } = useContext(Store);
    const { userInfo } = state;
    const params = useParams(); 
    const { id: orderId } = params;
    const navigate = useNavigate();

    const [{ loading, error, order, successPay, loadingPay , successDeliver , loadingDeliver }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
        order: {},
        successPay: false,
        loadingPay: false,
        errorPay: '',
        successDeliver: false,
        loadingDeliver: false
    });
    
    const [{ isPending }, Paypaldispatch] = usePayPalScriptReducer();

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice.toFixed(2),
                        currency_code: 'USD', //paypal inr accept nhi kr rha tha kyoki same contry me paypal allow nhi h
                    },
                },
            ],
        });
    }

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                dispatch({ type: 'PAY_REQUEST' });
                const { data } = await axiosInstance.put(`/api/order/${orderId}/pay`, details, {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    } 
                });
                dispatch({ type: 'PAY_SUCCESS', payload: data });
                toast.success('Payment Successful');
            } catch (e) {
                dispatch({ type: 'PAY_FAIL', payload: geterror(e) });
                toast.error(geterror(e));
            }
        });
    }

    function onError(err) { 
        toast.error(err.message);
    }

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });
                const { data } = await axiosInstance.get(`/api/order/${orderId}`, {
                    headers: {
                        'Authorization': `Bearer ${userInfo.token}`
                    }
                });
                dispatch({ type: 'FETCH_SUCCESS', payload: data.order });
            } catch (error) {
                dispatch({ type: 'FETCH_FAIL', payload: geterror(error) });
            }
        };

        if (!userInfo) {
            return navigate('/signin'); 
        }

        if (!order._id || successPay || successDeliver || (order._id !== orderId)) {
            fetchOrder();
            if (successPay) {
                dispatch({ type: 'PAY_RESET' });
            }
            if (successDeliver) {
                dispatch({ type: 'DELIVER_RESET' });
            }
        } else {
            const loadPaypalScript = async () => {
                try {
                    const { data: clientId } = await axiosInstance.get('/api/keys/paypal', {
                        headers: {
                            authorization: `Bearer ${userInfo.token}`
                        }
                    });
                    Paypaldispatch({
                        type: 'resetOptions',
                        value: {
                            'client-id': clientId,
                            currency: 'USD',
                        }
                    });
                    Paypaldispatch({
                        type: 'setLoadingStatus',
                        value: 'pending'
                    });
                } catch (err) {
                    toast.error(geterror(err));
                }
            };
            loadPaypalScript();
        }
    }, [orderId, userInfo, order, navigate, Paypaldispatch, successPay , successDeliver]);


    async function deliverorderHandler(){
        try{
            dispatch({ type: 'DELIVER_REQUEST' });
            const {data} = await axiosInstance.put(`/api/order/${orderId}/deliver`,{}, {
                // वह खाली ऑब्जेक्ट {} रिक्वेस्ट बॉडी (Request Body) के लिए है।जब आप axiosInstance.put या axiosInstance.post का इस्तेमाल करते हैं, तो सिंटैक्स का नियम (Structure) कुछ इस तरह होता है:$$\text{axiosInstance.put}(\text{url}, \text{data}, \text{config})$$
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            });
            dispatch({ type: 'DELIVER_SUCCESS' });
        }
        catch(error){
            toast.error(geterror(error));
            dispatch({ type: 'DELIVER_FAIL', payload: geterror(error) });
        }
    }

    return loading ? (
        <Loading />
    ) : error ? (
        <Msg variant="danger">{error}</Msg>
    ) : (
        <div>
            <Helmet>
                <title>Order {orderId}</title>
            </Helmet>
            <h1 className="my-3">Order {orderId}</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name:</strong> {order?.shippingAddress?.fullName} <br />
                                <strong>Address: </strong> {order?.shippingAddress?.address},
                                {order?.shippingAddress?.city}, {order?.shippingAddress?.postalCode}, 
                                {order?.shippingAddress?.country}
                            </Card.Text>
                            {order?.isDelivered ? (
                                <Msg variant="success">Delivered at {order.deliveredAt}</Msg>
                            ) : (
                                <Msg variant="danger">Not Delivered</Msg>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <strong>Method:</strong> {order?.paymentMethod}
                            </Card.Text>
                            {order?.isPaid ? (
                                <Msg variant="success">Paid at {order.paidAt}</Msg>
                            ) : (
                                <Msg variant="danger">Not Paid</Msg>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Items</Card.Title>
                            <ListGroup variant="flush">
                                {order?.orderItems?.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid rounded img-thumbnail"
                                                />{' '}
                                                <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={3}>
                                                <span>{item.quantity}</span>
                                            </Col>
                                            <Col md={3}>${item.price}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={4}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>{order?.itemsPrice?.toFixed(2)} /-</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>{order?.shippingPrice?.toFixed(2)} /-</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>{order?.taxPrice?.toFixed(2)} /-</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col><strong>Order Total</strong></Col>
                                        <Col><strong>{order?.totalPrice?.toFixed(2)} /-</strong></Col>
                                    </Row>
                                </ListGroup.Item> 
                                {!order.isPaid && (
                                    <ListGroup.Item>
                                        {isPending ? (
                                            <Loading />
                                        ) : (
                                            <div>
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                />
                                            </div>
                                        )}
                                        {loadingPay && <Loading />}
                                    </ListGroup.Item>
                                )}
                                {
                                    userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                        <ListGroup.Item>
                                            {
                                                loadingDeliver && <Loading /> 
                                            }
                                            <div className='d-grid'>
                                                <Button type='button' onClick={deliverorderHandler}>
                                                    Deliver Order
                                                </Button>
                                            </div>
                                        </ListGroup.Item>
                                    )
                                }
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

 