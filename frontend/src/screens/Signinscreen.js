import { Button, Container, Form } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";

export default function SigninScreen() {
    const {search} =useLocation();
    const redirectInURL = new URLSearchParams(search).get('redirect');
    const redirect = redirectInURL ? redirectInURL : '/';
  return (
  <Container className="small-container">
  <Helmet>
    <title>Sign In</title>
  </Helmet>
  <h1 className="my-3">Sign In</h1>
  <Form>
    <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" required /> 
        {/* //creates input field with email type and placeholder text */}
    </Form.Group>
    <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Enter Password" required /> 
        {/* //creates input field with email type and placeholder text */}
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