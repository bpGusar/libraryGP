import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

import { branch } from 'baobab-react/higher-order';
import { PARAMS } from '@store';
import { authStatus, setUserInfo } from '@act';

import { axs } from '@axios';

class loginPage extends Component {
  state = {
    email: '',
    password: '',
  };

  componentDidMount() {
    if (this.props.isUserAuthorized) {
      this.props.history.push('/');
    }
  }

  handleInputChange(e) {
    const { value, name } = e.target;

    this.setState({
      [name]: value,
    });
  }

  onSubmit = (event) => {
    event.preventDefault();

    axs.post('/auth/', this.state, { withCredentials: true }).then((res) => {
      if (res.status === 200) {
        this.props.dispatch(authStatus, true);
        this.props.dispatch(setUserInfo, res.data.login);
        document.location.href = '/';
      } else {
        this.props.dispatch(authStatus, false);
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

export default branch({ isUserAuthorized: PARAMS.IS_USER_AUTHORIZED }, loginPage);
