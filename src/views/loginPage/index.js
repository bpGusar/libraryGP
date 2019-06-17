import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

import { axs } from '@axios';

export default class loginPage extends Component {
  state = {
    email: '',
    password: '',
  };

  handleInputChange(e) {
    const { value, name } = e.target;

    this.setState({
      [name]: value,
    });
  }

  onSubmit = (event) => {
    event.preventDefault();

    axs.post('/api/auth/', this.state, { withCredentials: true }).then((res) => {
      if (res.status === 200) {
        this.props.history.push('/');
      } else {
        const error = new Error(res.error);
        throw error;
      }
    });
  };

  render() {
    return (
      <Row className='justify-content-md-center'>
        <Col md='auto'>
          <Form onSubmit={this.onSubmit}>
            <Form.Group controlId='formBasicEmail'>
              <Form.Label>Email адрес</Form.Label>
              <Form.Control
                type='email'
                value={this.state.email}
                placeholder='Enter email'
                name='email'
                onChange={(e) => this.handleInputChange(e)}
                required
              />
            </Form.Group>

            <Form.Group controlId='formBasicPassword'>
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type='password'
                value={this.state.password}
                placeholder='Password'
                name='password'
                onChange={(e) => this.handleInputChange(e)}
                required
              />
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
