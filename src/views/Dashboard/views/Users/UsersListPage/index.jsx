import React, { Component } from "react";
import {
  Segment,
  Header,
  Form,
  Button,
  Icon,
  Item,
  Dropdown,
  Modal,
  Divider
} from "semantic-ui-react";
import _ from "lodash";
import { Link } from "react-router-dom";

import EditUser from "../EditUser";
import PaginationBlock from "./components/Pagination";
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
        }
      });
  };

  render() {
    const { users, isLoading, options, maxElements } = this.state;
    const { history } = this.props;

    return (
      <Segment.Group>
        <Segment>
          <Header as="h3">Список пользователей</Header>
        </Segment>
        <Segment loading={isLoading}>
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
            <ResultFilters options={options} _this={this} />
          </Form>
        </Segment>
        <Segment loading={isLoading}>
          <Item.Group divided>
            {users.map(user => (
              <Item key={user._id}>
                <Item.Image
                  as={Link}
                  to={`/profile/${user.login}`}
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
                        <Dropdown.Divider />
                        <Dropdown.Item text="Удалить" icon="close" />
                      </Dropdown.Menu>
                    </Dropdown>
                  </Item.Header>
                  <Item.Meta>Description</Item.Meta>
                  <Item.Description>
                    {/* <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" /> */}
                  </Item.Description>
                  <Item.Extra>Additional Details</Item.Extra>
                </Item.Content>
              </Item>
            ))}
          </Item.Group>
        </Segment>
        {!_.isEmpty(users) && (
          <Segment>
            <PaginationBlock
              options={options}
              maxElements={maxElements}
              _this={this}
            />
          </Segment>
        )}
      </Segment.Group>
    );
  }
}

export default UsersList;
