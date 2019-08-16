import React, { Component } from "react";
import { Button, Checkbox, Form } from "semantic-ui-react";

import { branch } from "baobab-react/higher-order";
import { PARAMS } from "@store";
import { authStatus } from "@act";

import axs from "@axios";

class loginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      rememberMe: true
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate() {
    const { isUserAuthorized, history } = this.props;
    if (isUserAuthorized) {
      history.push("/");
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const { dispatch } = this.props;

    axs.post("/auth/", this.state, { withCredentials: true }).then(res => {
      if (!res.data.msg.error) {
        localStorage.setItem("token", res.data.msg.payload);
        document.location.href = "/";
      } else {
        dispatch(authStatus, false);
        const error = new Error(res.error);
        throw error;
      }
    });
  }

  handleInputChange(e) {
    const { value, name } = e.target;

    this.setState({
      [name]: value
    });
  }

  render() {
    const { email, password, rememberMe } = this.state;
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Field>
          <label htmlFor="email">
            Email адрес
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Enter email"
              name="email"
              onChange={e => this.handleInputChange(e)}
              required
            />
          </label>
        </Form.Field>
        <Form.Field>
          <label htmlFor="password">
            Пароль
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              name="password"
              onChange={e => this.handleInputChange(e)}
              required
            />
          </label>
        </Form.Field>

        <Form.Field>
          <Checkbox
            name="rememberMe"
            checked={rememberMe}
            type="checkbox"
            label="Запомнить меня"
            onChange={() => this.setState({ rememberMe: !rememberMe })}
          />
        </Form.Field>
        <Button type="submit">Войти</Button>
      </Form>
    );
  }
}

export default branch(
  { isUserAuthorized: PARAMS.IS_USER_AUTHORIZED },
  loginPage
);
