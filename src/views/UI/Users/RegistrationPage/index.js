import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Form,
  Header,
  Image,
  Message,
  Segment,
  Item,
  Modal
} from "semantic-ui-react";
import _ from "lodash";

import { branch } from "baobab-react/higher-order";
import { PARAMS } from "@store";

import axs from "@axios";
import MSG from "@msg";

import s from "./index.module.scss";

class SignUpPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      regData: {
        avatar: "",
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
      regExpError: {
        login: false
      },
      regInProgress: false,
      regStatus: false,
      passwordsEquals: true
    };
    this.avatarInputRef = React.createRef();
  }

  componentDidUpdate() {
    const { isUserAuthorized, history } = this.props;

    if (isUserAuthorized) {
      history.push("/");
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const { regData, errors } = this.state;

    if (!errors.email && !errors.login) {
      this.setState({
        regInProgress: true
      });
      axs
        .post("/users", { regData }, { withCredentials: true })
        .then(regRes => {
          if (!regRes.data.error) {
            this.setState({
              regStatus: true,
              regInProgress: false
            });
          }
        });
    }
  };

  newAvatar = e => {
    e.preventDefault();

    const { regData } = this.state;

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        regData: {
          ...regData,
          avatar: reader.result
        }
      });
    };

    reader.readAsDataURL(file);
  };

  checkUnique = target => {
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
  };

  handleCheckPassEquals = e => {
    const { value } = e.target;
    const { regData } = this.state;

    this.setState({
      passwordsEquals: regData.password === value
    });
  };

  handleInputChange(e) {
    const { value, name } = e.target;
    const { regData, regExpError } = this.state;
    const reg = new RegExp(/^[a-z0-9]{3,16}$/gim);

    this.setState({
      regData: { ...regData, [name]: value },
      regExpError: {
        ...regExpError,
        login: !reg.test(value) && name === "login"
      }
    });
  }

  render() {
    const {
      regData,
      errors,
      regInProgress,
      regStatus,
      regExpError,
      passwordsEquals
    } = this.state;
    return (
      <>
        {regStatus ? (
          <Segment stacked>{MSG.singUpPage.successfullSignUp}</Segment>
        ) : (
          <>
            <Header as="h2" color="blue" textAlign="center">
              <Image src="https://react.semantic-ui.com/logo.png" />
              {MSG.singUpPage.pageTitle}
            </Header>
            <Form
              onSubmit={this.onSubmit}
              size="large"
              style={{
                textAlign: "left"
              }}
            >
              <Segment stacked>
                <Item.Group>
                  <Item>
                    <Modal
                      trigger={
                        <Image
                          src={
                            regData.avatar ||
                            "http://localhost:5000/placeholder/imagePlaceholder.png"
                          }
                          wrapped
                          ui={false}
                          className={s.posterImg}
                        />
                      }
                      basic
                      size="small"
                    >
                      <Modal.Content>
                        <Image
                          src={
                            regData.avatar ||
                            "http://localhost:5000/placeholder/imagePlaceholder.png"
                          }
                          wrapped
                          ui={false}
                          className={s.posterImgInModal}
                        />
                      </Modal.Content>
                    </Modal>

                    <Item.Content>
                      <Item.Description>
                        <Button
                          content="Выберите аватар"
                          labelPosition="left"
                          icon="file"
                          onClick={e => {
                            e.preventDefault();
                            this.avatarInputRef.current.click();
                          }}
                        />
                        <input
                          type="file"
                          ref={this.avatarInputRef}
                          hidden
                          onChange={this.newAvatar}
                          accept="image/x-png"
                        />
                      </Item.Description>
                    </Item.Content>
                  </Item>
                </Item.Group>
                <Form.Input
                  error={
                    (errors.login && {
                      content: MSG.singUpPage.userWThatLoginExistError,
                      pointing: "below"
                    }) ||
                    (regExpError.login && {
                      content: MSG.singUpPage.loginRegExpError,
                      pointing: "below"
                    })
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
                      content: MSG.singUpPage.userWThatEmailExistError,
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
                  error={!passwordsEquals}
                  icon="lock"
                  iconPosition="left"
                  label="Пароль"
                />
                <Form.Input
                  type="password"
                  error={!passwordsEquals}
                  id="rePass"
                  name="rePass"
                  onChange={e => this.handleCheckPassEquals(e)}
                  required
                  disabled={_.isEmpty(regData.password)}
                  fluid
                  icon="lock"
                  iconPosition="left"
                  label="Повторите пароль"
                />
                <Button
                  type="submit"
                  color="blue"
                  fluid
                  size="large"
                  disabled={
                    regInProgress ||
                    errors.login ||
                    errors.email ||
                    regExpError.login ||
                    !passwordsEquals
                  }
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
