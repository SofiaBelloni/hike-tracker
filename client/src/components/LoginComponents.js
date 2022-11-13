import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { BackButton } from './Utility';
import { Link } from 'react-router-dom';
//import './ComponentsStyle.css'


function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    props.setErrorMessage('');
    const credentials = { username, password };

    // validation that forms are not empty
    let valid = true;
    if (username === '') {
      valid = false;
      props.setErrorMessage('Inserire username valido');
    } else if (password === '') {
      valid = false;
      props.setErrorMessage('Inserire password valida');
    }
    if (valid) {
      props.login(credentials);
    }
  };

  return (
    <Container className='login-container'>
      <Row className="justify-content-center">
        <Col xs={6}>
          <h2 className='text-center'>Login</h2>
          <Form >
            <Form.Group controlId='username' className='base-form'>
              <Form.Label>Email:</Form.Label>
              <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
            </Form.Group>
            <Form.Group controlId='password' className='base-form'>
              <Form.Label>Password:</Form.Label>
              <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
            </Form.Group>
            <Col className='text-center my-3'>
              <Button type='submit' className='primary' onClick={handleSubmit}>Login</Button>
              <p className='alternative'>Not registered? <Link to='/signup'>Create</Link> an account</p>
            </Col>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export { LoginForm };