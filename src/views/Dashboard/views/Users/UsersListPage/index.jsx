import React, { Component } from "react";
import {
  Segment,
  Form,
  Button,
  Icon,
  Item,
  Dropdown,
  Modal,
  Divider,
  Label
} from "semantic-ui-react";
import _ from "lodash";
import { Link } from "react-router-dom";

import FormContainer from "@DUI/common/FormContainer";
import EditUser from "../EditUser";
import ResultFilters from "./components/ResultFilters";

import axs from "@axios";

class UsersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      searchQuery: {},
      users: [],
      maxElements: 0,
      options: {
        sort: "desc",
        limit: 10,
        page: 1
      }
    };
  }

  componentDidMount() {
    this.handleSubmitForm(true);
  }

  handleChangeSearchQuery = (value, name) =>
    this.setState(prevState => {
      const { searchQuery } = prevState;
      let searchQueryCloned = _.cloneDeep(searchQuery);

      if (_.isEmpty(value)) {
        delete searchQueryCloned[name];
      } else {
        searchQueryCloned = {
          ...searchQueryCloned,
          [name]: {
            $regex: value,
            $options: "i"
          }
        };
      }
      return {
        searchQuery: { ...searchQueryCloned }
      };
    });

  handleSubmitForm = (dropPageCount = false) => {
    const { searchQuery, options } = this.state;
    const clonedOptions = { ...options };

    if (dropPageCount) {
      clonedOptions.page = 1;
    }

    this.setState({
      isLoading: true,
      options: { ...clonedOptions }
    });

    axs
      .get(`/users`, {
        params: {
          searchQuery,
          options: { ...clonedOptions }
        }
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            users: resp.data.payload,
            isLoading: false,
            maxElements: resp.headers["max-elements"]
          });
        } else {
          this.setState({
            isLoading: false
          });
        }
      });
  };

  handlePageChange = data =>
    this.setState(
      prevState => ({
        options: {
          ...prevState.options,
          page: data.activePage
        }
      }),
      () => this.handleSubmitForm()
    );

  handleSortChange = value =>
    this.setState(ps => ({
      options: {
        ...ps.options,
        sort: value
      }
    }));

  handleLimitChange = value =>
    this.setState(ps => ({
      options: {
        ...ps.options,
        limit: Number(value)
      }
    }));

  render() {
    const { users, isLoading, options, maxElements } = this.state;
    const { history } = this.props;

    return (
      <FormContainer
        formHeader="Список пользователей"
        formLoading={isLoading}
        resultLoading={isLoading}
        showPagination
        pagMaxElements={maxElements}
        pagLimit={options.limit}
        pagPage={options.page}
        pagOnPageChange={this.handlePageChange}
        form={() => (
          <Form onSubmit={() => this.handleSubmitForm(true)}>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                label="Фамилия"
                name="lastName"
                onChange={(e, { value, name }) =>
                  this.handleChangeSearchQuery(value, name)
                }
              />
              <Form.Input
                fluid
                label="Имя"
                name="firstName"
                onChange={(e, { value, name }) =>
                  this.handleChangeSearchQuery(value, name)
                }
              />
              <Form.Input
                fluid
                label="Отчество"
                name="patronymic"
                onChange={(e, { value, name }) =>
                  this.handleChangeSearchQuery(value, name)
                }
              />
            </Form.Group>
            <Button icon type="submit" primary labelPosition="left">
              <Icon name="search" />
              Поиск
            </Button>
            <Divider />
            <ResultFilters
              options={options}
              onSortChange={this.handleSortChange}
              onLimitChange={this.handleLimitChange}
            />
          </Form>
        )}
        result={() => (
          <Segment loading={isLoading}>
            <Item.Group divided>
              {users.map(user => (
                <Item key={user._id}>
                  <Item.Image
                    as={Link}
                    to={`/profile/${user._id}`}
                    target="blanc"
                    size="tiny"
                    src={user.avatar}
                  />

                  <Item.Content>
                    <Item.Header>
                      <Dropdown
                        text={`${user.firstName} ${user.lastName} ${user.patronymic}`}
                      >
                        <Dropdown.Menu>
                          <Dropdown.Item
                            text="Отправить сообщение"
                            icon="send"
                            target="blanc"
                            as={Link}
                            to={`/im/${user._id}`}
                          />
                          <Dropdown.Item
                            text="Просмотр профиля"
                            icon="eye"
                            target="blanc"
                            as={Link}
                            to={`/profile/${user._id}`}
                          />
                          <Modal
                            trigger={
                              <Dropdown.Item
                                text="Редактировать"
                                icon="pencil alternate"
                              />
                            }
                          >
                            <Modal.Header>
                              Редактирование пользователя {user.login}
                            </Modal.Header>
                            <Modal.Content>
                              <Modal.Description>
                                <EditUser user={user} history={history} />
                              </Modal.Description>
                            </Modal.Content>
                          </Modal>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Item.Header>
                    <Item.Meta>{user.readerId}</Item.Meta>
                    <Item.Extra>
                      <Label color="blue">
                        <Icon name="calendar" />
                        Email: {user.email}
                      </Label>
                    </Item.Extra>
                  </Item.Content>
                </Item>
              ))}
            </Item.Group>
          </Segment>
        )}
      />
    );
  }
}

export default UsersList;
