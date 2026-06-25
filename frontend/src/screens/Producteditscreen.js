import React, { useContext, useReducer, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Store } from '../store';
import { geterror } from '../util';
import Loading from '../components/Loading';
import Msg from '../components/MassageBox';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Container, Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false};
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
      case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false , error: action.payload };
      case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    default:
      return state;
  }
}









export default function Producteditscreen() {
    const navigate = useNavigate();

   const params = useParams();
   const { id: productId } = params;

   const { state } = useContext(Store);
   const { userInfo } = state;
   const [{ loading, error ,loadingUpdate , loadingUpload}, dispatch] = useReducer(reducer, {
     loading: true,
     error: ''
   });
    const [name , setName] = useState('');
    const [slug , setSlug] = useState('');
    const [description , setDescription] = useState('');
    const [price , setPrice] = useState('');
    const [countInStock , setCountInStock] = useState('');
    const [brand , setBrand] = useState('');
    const [rating , setRating] = useState('');
    const [numReviews , setNumReviews] = useState('');
    const [category , setCategory] = useState('');
    const [image , setImage] = useState('');

   
    useEffect(()=>{
        const fetchProduct = async ()=>{
        try{
             dispatch({type : 'FETCH_REQUEST'});
             const {data} = await axios.get(`/api/products/${productId}`);
             setName(data.name);
             setSlug(data.slug);
             setDescription(data.description);
             setPrice(data.price);
             setCountInStock(data.countInStock);
             setBrand(data.brand);
             setRating(data.rating);
             setNumReviews(data.numReviews);
             setCategory(data.category);    
             setImage(data.image);
             dispatch({type : 'FETCH_SUCCESS' , payload : data.product});
        }
        catch(e){
            dispatch({type : 'FETCH_FAIL' , payload : geterror(e)});
        }
    }
    fetchProduct();
    },[productId]);
   const uploadfileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setImage(data.secure_url);
      toast.success('Image Uploaded Successfully'); 
    } catch (error) {
        toast.error(geterror(error));
      dispatch({ type: 'UPLOAD_FAIL', payload: geterror(error) });
    }
}



    const submitHandler =  async (e) =>{
           e.preventDefault();
           try{
               dispatch({type : 'UPDATE_REQUEST'});
               const {data} = await axios.put(`/api/products/${productId}`,{
                   name,
                   slug,
                   description,
                   price,
                   countInStock,
                   brand,
                   rating,
                   numReviews,
                   category,
                   image
               },
               {
                headers : {
                    authorization : `Bearer ${userInfo.token}`
                }
               }
            );
               dispatch({type : 'UPDATE_SUCCESS'});
               toast.success('Product Updated Successfully');
               navigate(`/admin/products`);
           }
           catch(e){
               toast.error(geterror(e));
               dispatch({type : 'UPDATE_FAIL' , payload : geterror(e)});
           }
    }

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Product ${productId}</title>
      </Helmet>
      <h1>Edit Product {productId}</h1>

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
          <Form.Group className="mb-3" controlId="slug">
            <Form.Label>Slug</Form.Label>
            <Form.Control
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Price</Form.Label>
            <Form.Control
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image File</Form.Label>
            <Form.Control
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="imagefile">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              onChange={uploadfileHandler} 
              />
              {loadingUpload && <Loading></Loading>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="category">
            <Form.Label>Category</Form.Label>
            <Form.Control
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="brand">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="countInStock">
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="rating">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <Button type="submit">Update</Button>
          </div>
        </Form>
      )}
    </Container>
  )
}
