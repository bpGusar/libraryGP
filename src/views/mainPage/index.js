import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

export default class mainPage extends Component {
  render() {
    return (
      <Row className='justify-content-md-center'>
        <Col md='auto'>
          <Form>
            <Form.Group controlId='formBasicEmail'>
              <Form.Label>Email адрес</Form.Label>
              <Form.Control type='email' placeholder='Enter email' />
            </Form.Group>

            <Form.Group controlId='formBasicPassword'>
              <Form.Label>Пароль</Form.Label>
              <Form.Control type='password' placeholder='Password' />
            </Form.Group>
            <Form.Group controlId='formBasicChecbox'>
              <Form.Check type='checkbox' label='Запомнить меня' />
            </Form.Group>
            <Button variant='primary' type='submit'>
              Войти
            </Button>
          </Form>
        </Col>
      </Row>
    );
  }
}
