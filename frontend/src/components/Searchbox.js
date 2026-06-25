import React, { useState } from 'react'
import { Button, Form, FormControl, InputGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

export default function Searchbox() {
    const [query,setQuery] = useState('');
    const navigate = useNavigate();
    const submitHandler =(e)=>{
        e.preventDefault();
        navigate(query ? `/search?query=${query}`:'/search');
        }
  return (
    <Form className='d-flex me-auto' onSubmit={submitHandler}>
          <InputGroup>
          <FormControl type="text"
          name="q"
          id="q"
          onChange={(e)=>setQuery(e.target.value)}
          placeholder='search products...'
          area-describedby="button-search"
          > 
          </FormControl>
            <Button variant='outline-primary' type='submit' id='button-search'> 
                {/* we used same id in formcontrol to connect both of these */}
                 <i className='fas fa-search'></i>
            </Button>
          </InputGroup>
        </Form>
  )
}
