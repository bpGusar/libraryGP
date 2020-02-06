/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from "react";
import { branch } from "baobab-react/higher-order";
import { withRouter } from "react-router-dom";
import {
  Form,
  Item,
  Modal,
  Image,
  Button,
  Message,
  Divider
} from "semantic-ui-react";
import _ from "lodash";

import CustomSelect from "@views/Common/CustomSelect";

import MSG from "@msg";
import axs from "@axios";

import { PARAMS } from "@store";

class EditUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      updateData: _.cloneDeep(props.user),
      regStatus: false,
      errors: {
        login: false,
        email: false
      },
      regExpError: {
        login: false
      },
      passwordsEquals: {
        equal: true,
        value: ""
      }
    };

    this.avatarInputRef = React.createRef();
  }

  onSubmit = e => {
    e.preventDefault();

    const { updateData, errors } = this.state;
    const { user, history } = this.props;

    if (!errors.email && !errors.login) {
      this.setState({
        regStatus: false,
        isLoading: true
      });
      axs
        .put("/users", {
          updateData,
          send_email: updateData.email !== user.email
        })
        .then(regRes => {
          if (!regRes.data.error) {
            this.setState({
              regStatus: true,
              isLoading: false,
              passwordsEquals: {
                equal: true,
                value: ""
              }
            });
            if (
              _.has(updateData, "password") ||
              updateData.email !== user.email
            ) {
              history.push("/logout");
            } else {
              document.location.reload(true);
            }
          }
        });
    }
  };

  newAvatar = e => {
    e.preventDefault();

    const { updateData } = this.state;

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        updateData: {
          ...updateData,
          avatar: reader.result
        }
      });
    };

    reader.readAsDataURL(file);
  };

  checkUnique = target => {
    const { value, name } = target;
    const { errors, updateData } = this.state;

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
              [name]:
                _.has(res.data.payload[0], "_id") &&
                !_.has(
                  res.data.payload.find(el => el._id === updateData._id),
                  "_id"
                )
            }
          });
        });
    }
  };

  handleCheckPassEquals = e => {
    const { value } = e.target;
    const { updateData } = this.state;

    this.setState({
      passwordsEquals: {
        equal: updateData.password === value,
        value
      }
    });
  };

  handleInputChange = (value, name) =>
    this.setState(prevState => {
      const { updateData, regExpError } = prevState;
      let clonedUpdateData = _.cloneDeep(updateData);
      const reg = new RegExp(/^[a-z0-9]{3,16}$/gim);

      if (value.length === 0) {
        delete clonedUpdateData[name];
      } else {
        clonedUpdateData = {
          ...clonedUpdateData,
          [name]: value
        };
      }

      return {
        updateData: clonedUpdateData,
        regExpError: {
          ...regExpError,
          login: !reg.test(value) && name === "login"
        }
      };
    });

  handleGetUserGroupsOptions = userRoles =>
    Object.keys(userRoles).map(key => ({
      key,
      value: userRoles[key].value,
      text: userRoles[key].name
    }));

  render() {
    const {
      errors,
      regExpError,
      passwordsEquals,
      regStatus,
      updateData,
      isLoading
    } = this.state;

    const { user, userRoles, trigger } = this.props;

    return (
      <Modal trigger={trigger}>
        <Modal.Header>Изменить профиль</Modal.Header>
        <Modal.Content>
          <Modal.Description>
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
                  <Message.Header>{MSG.editUser.successUpdate}</Message.Header>
                  {updateData.email !== user.email && (
                    <p>{MSG.editUser.emailVerify}</p>
                  )}
                </Message>
              )}

              <Form
                loading={isLoading}
                onSubmit={this.onSubmit}
                size="large"
                style={{
                  textAlign: "left"
                }}
              >
                <Item.Group>
                  <Item>
                    <Modal
                      trigger={
                        <Image
                          src={
                            updateData.avatar ||
                            "http://localhost:5000/placeholder/imagePlaceholder.png"
                          }
                          wrapped
                          ui={false}
                        />
                      }
                      basic
                      size="small"
                    >
                      <Modal.Content>
                        <Image
                          src={
                            updateData.avatar ||
                            "http://localhost:5000/placeholder/imagePlaceholder.png"
                          }
                          wrapped
                          ui={false}
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
                    value={updateData.firstName}
                    name="firstName"
                    onChange={(e, { value, name }) =>
                      this.handleInputChange(value, name)
                    }
                    required
                    fluid
                    icon="user"
                    iconPosition="left"
                    label="Имя"
                  />
                  <Form.Input
                    type="text"
                    id="lastName"
                    value={updateData.lastName}
                    name="lastName"
                    onChange={(e, { value, name }) =>
                      this.handleInputChange(value, name)
                    }
                    required
                    fluid
                    icon="user"
                    iconPosition="left"
                    label="Фамилия"
                  />
                  <Form.Input
                    type="text"
                    id="patronymic"
                    value={updateData.patronymic}
                    name="patronymic"
                    onChange={(e, { value, name }) =>
                      this.handleInputChange(value, name)
                    }
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
                        content: MSG.editUser.userWThatLoginExistError,
                        pointing: "below"
                      }) ||
                      (regExpError.login && {
                        content: MSG.editUser.loginRegExpError,
                        pointing: "below"
                      })
                    }
                    type="text"
                    id="login"
                    value={updateData.login}
                    name="login"
                    onChange={(e, { value, name }) => [
                      this.handleInputChange(value, name),
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
                        content: MSG.editUser.userWThatEmailExistError,
                        pointing: "below"
                      }
                    }
                    type="email"
                    id="email"
                    value={updateData.email}
                    name="email"
                    onChange={(e, { value, name }) => [
                      this.handleInputChange(value, name),
                      this.checkUnique(e.target)
                    ]}
                    required
                    fluid
                    icon="mail"
                    iconPosition="left"
                    label="E-mail"
                  />
                  {user.userGroup === userRoles.admin.value && (
                    <CustomSelect
                      label="Группа пользователя"
                      name="userGroup"
                      options={this.handleGetUserGroupsOptions(userRoles)}
                      defaultValue={updateData.userGroup}
                      onChange={this.handleInputChange}
                    />
                  )}
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Input
                    type="password"
                    id="password"
                    value={updateData.password}
                    name="password"
                    onChange={(e, { value, name }) =>
                      this.handleInputChange(value, name)
                    }
                    fluid
                    error={
                      !passwordsEquals.equal &&
                      !_.isEmpty(passwordsEquals.value)
                    }
                    icon="lock"
                    iconPosition="left"
                    label="Пароль"
                  />
                  <Form.Input
                    type="password"
                    error={
                      !passwordsEquals.equal &&
                      !_.isEmpty(passwordsEquals.value)
                    }
                    id="rePass"
                    name="rePass"
                    value={passwordsEquals.value}
                    onChange={e => this.handleCheckPassEquals(e)}
                    disabled={_.isEmpty(updateData.password)}
                    fluid
                    icon="lock"
                    iconPosition="left"
                    label="Повторите пароль"
                  />
                </Form.Group>
                <Divider />
                <Button
                  type="submit"
                  disabled={
                    errors.login ||
                    errors.email ||
                    regExpError.login ||
                    !passwordsEquals
                  }
                  color="green"
                >
                  Сохранить
                </Button>
              </Form>
            </>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default withRouter(
  branch(
    {
      user: PARAMS.USER_INFO,
      userRoles: PARAMS.USER_ROLES
    },
    EditUser
  )
);
