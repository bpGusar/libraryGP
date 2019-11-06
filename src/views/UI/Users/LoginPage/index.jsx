import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Checkbox,
  Form,
  Header,
  Image,
  Message,
  Segment
} from "semantic-ui-react";

import { branch } from "baobab-react/higher-order";
import { PARAMS } from "@store";
import { storeData } from "@act";

import axs from "@axios";

class loginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      rememberMe: true,
      isError: {
        msg: "",
        error: false
      },
      isLoginInProcess: false
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

    this.setState({
      isError: { error: false, msg: "" },
      isLoginInProcess: true
    });

    axs
      .post("/users/service/login", this.state, { withCredentials: true })
      .then(res => {
        if (!res.data.error) {
          localStorage.setItem("token", res.data.payload);
          document.location.href = "/";
        } else {
          this.setState({
            isError: { error: true, msg: res.data.message },
            isLoginInProcess: false
          });
          dispatch(storeData, PARAMS.IS_USER_AUTHORIZED, false);
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
    const {
      email,
      password,
      rememberMe,
      isError,
      isLoginInProcess
    } = this.state;
    return (
      <>
        <Header as="h2" color="blue" textAlign="center">
          <Image src="https://react.semantic-ui.com/logo.png" /> Войти в свой
          аккаунт
        </Header>
        {isError.error && (
          <Message negative attached header="Ошибка" content={isError.msg} />
        )}
        <Form
          attached="true"
          onSubmit={this.onSubmit}
          size="large"
          style={{
            textAlign: "left"
          }}
        >
          <Segment stacked>
            <Form.Input
              error={isError.error}
              disabled={isLoginInProcess}
              type="email"
              id="email"
              value={email}
              name="email"
              onChange={e => this.handleInputChange(e)}
              required
              fluid
              icon="user"
              iconPosition="left"
              label="E-mail"
            />
            <Form.Input
              error={isError.error}
              disabled={isLoginInProcess}
              type="password"
              id="password"
              value={password}
              name="password"
              onChange={e => this.handleInputChange(e)}
              required
              fluid
              icon="lock"
              iconPosition="left"
              label="Пароль"
            />

            <Form.Field>
              <Checkbox
                name="rememberMe"
                checked={rememberMe}
                type="checkbox"
                label="Запомнить меня"
                onChange={() => this.setState({ rememberMe: !rememberMe })}
              />
            </Form.Field>
            <Button
              type="submit"
              color="blue"
              fluid
              size="large"
              disabled={isLoginInProcess}
            >
              Войти
            </Button>
          </Segment>
        </Form>
        <Message>
          Не зарегистрированы? <br />
          <br />
          <Button href="#" to="/signup" color="green" as={Link}>
            Создать новый аккаунт
          </Button>
        </Message>
      </>
    );
  }
}

export default branch(
  { isUserAuthorized: PARAMS.IS_USER_AUTHORIZED },
  loginPage
);
