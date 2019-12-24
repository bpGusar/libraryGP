/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from "react";
import {
  Segment,
  Header,
  Form,
  Item,
  Modal,
  Image,
  Button,
  Message
} from "semantic-ui-react";
import _ from "lodash";

import MSG from "@msg";
import axs from "@axios";

import s from "./index.module.scss";

// eslint-disable-next-line react/prefer-stateless-function
export default class AddNewUser extends Component {
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
      sendEmail: true,
      regStatus: false,
      errors: {
        login: false,
        email: false
      },
      regExpError: {
        login: false
      },
      regInProgress: false,
      passwordsEquals: {
        equal: true,
        value: ""
      }
    };

    this.avatarInputRef = React.createRef();
  }

  onSubmit = e => {
    e.preventDefault();

    const { regData, errors, sendEmail } = this.state;

    if (!errors.email && !errors.login) {
      this.setState({
        regInProgress: true,
        sendEmail: true,
        regStatus: false
      });
      axs
        .post(
          "/users",
          {
            regData,
            send_email: sendEmail
          },
          { withCredentials: true }
        )
        .then(regRes => {
          if (!regRes.data.error) {
            this.setState({
              regStatus: true,
              regInProgress: false,
              regData: {
                avatar: "",
                email: "",
                password: "",
                login: "",
                firstName: "",
                lastName: "",
                patronymic: ""
              },
              passwordsEquals: {
                equal: true,
                value: ""
              }
            });
          } else {
            this.setState({
              regStatus: false,
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
        .get(`/users/service/check-reg-fields`, {
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
      passwordsEquals: {
        equal: regData.password === value,
        value
      }
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
      regExpError,
      passwordsEquals,
      sendEmail,
      regStatus
    } = this.state;

    return (
      <>
        {regStatus && (
          <Message
            info
            onDismiss={() =>
              this.setState({
                regStatus: false
              })
            }
          >
            <Message.Header>Новый пользователь зарегистрирован!</Message.Header>
            <p>
              Вы можете посмотреть/изменить его данные на странице "Все
              пользователи"
            </p>
          </Message>
        )}

        <Form
          onSubmit={this.onSubmit}
          size="large"
          style={{
            textAlign: "left"
          }}
        >
          <Segment.Group>
            <Segment>
              <Header as="h3">Добавить нового пользователя</Header>
            </Segment>
            <Segment>
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
              <Form.Group widths="equal">
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
              </Form.Group>
              <Form.Group widths="equal">
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
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input
                  type="password"
                  id="password"
                  value={regData.password}
                  name="password"
                  onChange={e => this.handleInputChange(e)}
                  required
                  fluid
                  error={
                    !passwordsEquals.equal && !_.isEmpty(passwordsEquals.value)
                  }
                  icon="lock"
                  iconPosition="left"
                  label="Пароль"
                />
                <Form.Input
                  type="password"
                  error={
                    !passwordsEquals.equal && !_.isEmpty(passwordsEquals.value)
                  }
                  id="rePass"
                  name="rePass"
                  value={passwordsEquals.value}
                  onChange={e => this.handleCheckPassEquals(e)}
                  required
                  disabled={_.isEmpty(regData.password)}
                  fluid
                  icon="lock"
                  iconPosition="left"
                  label="Повторите пароль"
                />
              </Form.Group>
            </Segment>
            <Segment>
              <Header as="h5">Опции</Header>
              <Form.Group inline>
                <label>Отправить подтверждение email на указанную почту</label>
                <Form.Checkbox
                  value="sendEmail"
                  checked={sendEmail}
                  onChange={() =>
                    this.setState({
                      sendEmail: !sendEmail
                    })
                  }
                />
              </Form.Group>
            </Segment>
            <Segment>
              <Button
                type="submit"
                color="blue"
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
                Добавить
              </Button>
            </Segment>
          </Segment.Group>
        </Form>
      </>
    );
  }
}
