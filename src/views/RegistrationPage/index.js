import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Form,
  Header,
  Image,
  Message,
  Segment
} from "semantic-ui-react";

import { branch } from "baobab-react/higher-order";
import { PARAMS } from "@store";

import axs from "@axios";

class SignUpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "bpgusar@gmail.com",
      password: "123",
      login: "bpgusar",
      firstName: "edfasdf",
      lastName: "asdfasdf",
      patronymic: "asdfasd",
      errors: {
        login: false,
        email: false
      },
      regInProgress: false,
      regStatus: false
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

    this.setState({
      regInProgress: true
    });

    axs.post("/signup", this.state, { withCredentials: true }).then(regRes => {
      if (!regRes.data.error) {
        this.setState({
          regStatus: true,
          regInProgress: false
        });
      }
    });
  }

  checkUnique(e) {
    const { value, name } = e.target;
    const { errors } = this.state;

    if (value !== "") {
      axs
        .get("/doesUserWithThatCredsExist", { params: { [name]: value } })
        .then(res => {
          this.setState({
            errors: { ...errors, [name]: res.data.error }
          });
        });
    }
  }

  handleInputChange(e) {
    const { value, name } = e.target;
    const { errors } = this.state;

    this.setState({
      [name]: value,
      errors: { ...errors, [name]: false }
    });
  }

  render() {
    const {
      email,
      password,
      login,
      firstName,
      lastName,
      patronymic,
      errors,
      regInProgress,
      regStatus
    } = this.state;
    return (
      <>
        {regStatus ? (
          <Segment stacked>
            Регистрация прошла успешно. <br /> На указанную почту отправлено
            подтверждение.
          </Segment>
        ) : (
          <>
            <Header as="h2" color="blue" textAlign="center">
              <Image src="https://react.semantic-ui.com/logo.png" /> Регистрация
              нового аккаунта
            </Header>
            <Form onSubmit={this.onSubmit} size="large">
              <Segment stacked>
                <Form.Input
                  error={
                    errors.login && {
                      content: "Пользователь с таким логином уже существует",
                      pointing: "below"
                    }
                  }
                  type="text"
                  id="login"
                  value={login}
                  name="login"
                  onChange={e => this.handleInputChange(e)}
                  required
                  onBlur={e => this.checkUnique(e)}
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Логин"
                />
                <Form.Input
                  type="text"
                  id="firstName"
                  value={firstName}
                  name="firstName"
                  onChange={e => this.handleInputChange(e)}
                  required
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Имя"
                />
                <Form.Input
                  type="text"
                  id="lastName"
                  value={lastName}
                  name="lastName"
                  onChange={e => this.handleInputChange(e)}
                  required
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Фамилия"
                />
                <Form.Input
                  type="text"
                  id="patronymic"
                  value={patronymic}
                  name="patronymic"
                  onChange={e => this.handleInputChange(e)}
                  required
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Отчество"
                />
                <Form.Input
                  error={
                    errors.email && {
                      content: "Пользователь с таким имейлом уже существует",
                      pointing: "below"
                    }
                  }
                  type="email"
                  id="email"
                  value={email}
                  name="email"
                  onChange={e => this.handleInputChange(e)}
                  onBlur={e => this.checkUnique(e)}
                  required
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="E-mail"
                />
                <Form.Input
                  type="password"
                  id="password"
                  value={password}
                  name="password"
                  onChange={e => this.handleInputChange(e)}
                  required
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Пароль"
                />
                <Button
                  type="submit"
                  color="blue"
                  fluid
                  size="large"
                  disabled={regInProgress}
                  loading={regInProgress}
                >
                  Регистрация
                </Button>
              </Segment>
            </Form>
          </>
        )}
        <Message>
          Уже зарегистрированы? <br />
          <br />
          <Button href="#" to="/login" color="green" as={Link}>
            Войти
          </Button>
        </Message>
      </>
    );
  }
}

export default branch(
  { isUserAuthorized: PARAMS.IS_USER_AUTHORIZED },
  SignUpPage
);
