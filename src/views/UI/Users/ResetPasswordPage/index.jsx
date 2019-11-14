/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
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

import axs from "@axios";

class ResetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      isResetInProcess: false,
      emailChecked: false
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

    const { email } = this.state;

    this.setState({
      isResetInProcess: true
    });

    axs
      .post(
        "/users/service/reset-password",
        { email },
        {
          withCredentials: true
        }
      )
      .then(res => {
        if (!res.data.error) {
          this.setState({
            isResetInProcess: false,
            emailChecked: true
          });
        }
      });
  }

  handleInputChange(e) {
    const { value, name } = e.target;

    this.setState({
      [name]: value
    });
  }
  // TODO: сделать редактирование профиля на сайте

  render() {
    const { email, isResetInProcess, emailChecked } = this.state;
    return (
      <>
        <Header as="h2" color="blue" textAlign="center">
          <Image src="https://react.semantic-ui.com/logo.png" /> Восстановление
          пароля
        </Header>
        {emailChecked && (
          <Message
            success
            header="Отлично!"
            content="Если пользователь с введенным адресом электронной почты существует, то ему будет отправлено письмо с инструкциями."
          />
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
              disabled={isResetInProcess || emailChecked}
              type="email"
              id="email"
              value={email}
              name="email"
              onChange={e => this.handleInputChange(e)}
              required
              fluid
              icon="mail"
              iconPosition="left"
              label="Введите свой Email"
            />
            <Button
              type="submit"
              color="blue"
              fluid
              size="large"
              disabled={isResetInProcess}
            >
              Восстановить
            </Button>
            <br />
            <center>
              <Link to="/login">Войти</Link>
            </center>
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

export default ResetPasswordPage;
