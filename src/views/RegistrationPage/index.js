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
import _ from "lodash";

import { branch } from "baobab-react/higher-order";
import { PARAMS } from "@store";

import axs from "@axios";

class SignUpPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      regData: {
        email: "",
        password: "",
        login: "",
        firstName: "",
        lastName: "",
        patronymic: ""
      },
      errors: {
        login: false,
        email: false
      },
      regInProgress: false,
      regStatus: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.checkUnique = _.debounce(this.checkUnique.bind(this), 1000);
  }

  componentDidUpdate() {
    const { isUserAuthorized, history } = this.props;

    if (isUserAuthorized) {
      history.push("/");
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const { regData, errors } = this.state;

    if (!errors.email && !errors.login) {
      this.setState({
        regInProgress: true
      });
      axs.post("/users", regData, { withCredentials: true }).then(regRes => {
        if (!regRes.data.error) {
          this.setState({
            regStatus: true,
            regInProgress: false
          });
        }
      });
    }
  }

  checkUnique(target) {
    const { value, name } = target;
    const { errors } = this.state;

    if (value !== "") {
      axs
        .get(`/users/check-reg-fields`, {
          params: {
            [name]: value
          }
        })
        .then(res => {
          this.setState({
            errors: {
              ...errors,
              [name]: _.has(res.data.payload[0], "_id")
            }
          });
        });
    }
  }

  handleInputChange(e) {
    const { value, name } = e.target;
    const { regData } = this.state;

    this.setState({
      regData: { ...regData, [name]: value }
    });
  }

  render() {
    const { regData, errors, regInProgress, regStatus } = this.state;
    return (
      <>
        {regStatus ? (
          <Segment stacked>
            Регистрация прошла успешно. <br /> На указанную почту отправлено
            письмо подтверждение.
          </Segment>
        ) : (
          <>
            <Header as="h2" color="blue" textAlign="center">
              <Image src="https://react.semantic-ui.com/logo.png" /> Регистрация
              нового аккаунта
            </Header>
            <Form
              onSubmit={this.onSubmit}
              size="large"
              style={{
                textAlign: "left"
              }}
            >
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
                  value={regData.login}
                  name="login"
                  onChange={e => [
                    this.handleInputChange(e),
                    this.checkUnique(e.target)
                  ]}
                  required
                  fluid
                  icon="user"
                  iconPosition="left"
                  label="Логин"
                />
                <Form.Input
                  type="text"
                  id="firstName"
                  value={regData.firstName}
                  name="firstName"
                  onChange={e => this.handleInputChange(e)}
                  required
                  fluid
                  icon="user"
                  iconPosition="left"
                  label="Имя"
                />
                <Form.Input
                  type="text"
                  id="lastName"
                  value={regData.lastName}
                  name="lastName"
                  onChange={e => this.handleInputChange(e)}
                  required
                  fluid
                  icon="user"
                  iconPosition="left"
                  label="Фамилия"
                />
                <Form.Input
                  type="text"
                  id="patronymic"
                  value={regData.patronymic}
                  name="patronymic"
                  onChange={e => this.handleInputChange(e)}
                  required
                  fluid
                  icon="user"
                  iconPosition="left"
                  label="Отчество"
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
                  value={regData.email}
                  name="email"
                  onChange={e => [
                    this.handleInputChange(e),
                    this.checkUnique(e.target)
                  ]}
                  required
                  fluid
                  icon="mail"
                  iconPosition="left"
                  label="E-mail"
                />
                <Form.Input
                  type="password"
                  id="password"
                  value={regData.password}
                  name="password"
                  onChange={e => this.handleInputChange(e)}
                  required
                  fluid
                  icon="lock"
                  iconPosition="left"
                  label="Пароль"
                />
                <Button
                  type="submit"
                  color="blue"
                  fluid
                  size="large"
                  disabled={regInProgress || (errors.login || errors.email)}
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
