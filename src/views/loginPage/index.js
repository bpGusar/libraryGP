import React, { Component } from 'react';
import { Button, Checkbox, Form } from 'semantic-ui-react';

import { branch } from 'baobab-react/higher-order';
import { PARAMS } from '@store';
import { authStatus } from '@act';

import { axs } from '@axios';

class loginPage extends Component {
  state = {
    email: '',
    password: '',
    rememberMe: true,
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

  onSubmit = (e) => {
    e.preventDefault();

    axs.post('/auth/', this.state, { withCredentials: true }).then((res) => {
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
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
      <Form onSubmit={this.onSubmit}>
        <Form.Field>
          <label>Email адрес</label>
          <input type='email' value={this.state.email} placeholder='Enter email' name='email' onChange={(e) => this.handleInputChange(e)} required />
        </Form.Field>
        <Form.Field>
          <label>Пароль</label>
          <input
            type='password'
            value={this.state.password}
            placeholder='Password'
            name='password'
            onChange={(e) => this.handleInputChange(e)}
            required
          />
        </Form.Field>

        <Form.Field>
          <Checkbox
            name='rememberMe'
            checked={this.state.rememberMe}
            type='checkbox'
            label='Запомнить меня'
            onChange={(e) => this.setState({ [e.currentTarget.name]: !this.state.rememberMe })}
          />
        </Form.Field>
        <Button type='submit'>Войти</Button>
      </Form>
    );
  }
}

export default branch({ isUserAuthorized: PARAMS.IS_USER_AUTHORIZED }, loginPage);
