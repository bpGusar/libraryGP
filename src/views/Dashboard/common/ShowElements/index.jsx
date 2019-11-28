/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import _ from "lodash";
import {
  Button,
  Form,
  Segment,
  Header,
  Item,
  Dropdown,
  Icon
} from "semantic-ui-react";
import cn from "classnames";

import axs from "@axios";

import s from "./index.module.scss";

export default class ShowElements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      isLoading: false,
      data: []
    };
  }

  handleGetItems = getAll => {
    const { linkPrefix, dbPropertyName } = this.props;
    const { inputValue } = this.state;

    this.setState({
      isLoading: true,
      inputValue: getAll ? "" : inputValue,
      data: []
    });

    axs
      .get(
        linkPrefix,
        getAll
          ? {}
          : {
              params: {
                searchQuery: {
                  [dbPropertyName]: { $regex: inputValue, $options: "i" }
                }
              }
            }
      )
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            isLoading: false,
            data: resp.data.payload
          });
        }
      });
  };

  render() {
    const { isLoading, inputValue, data } = this.state;
    const { dbPropertyName, formHeaderText, inputLabel } = this.props;

    return (
      <>
        <Header as="h3" attached="top">
          {formHeaderText}
        </Header>
        <Segment attached loading={isLoading}>
          <Form onSubmit={this.handleGetElements}>
            <Form.Input
              fluid
              label={inputLabel}
              name={dbPropertyName}
              placeholder={inputLabel}
              value={inputValue}
              onChange={(e, { value }) => this.setState({ inputValue: value })}
            />
            <Button
              disabled={_.isEmpty(inputValue)}
              type="submit"
              color="green"
              onClick={() => this.handleGetItems(false)}
            >
              Поиск
            </Button>
            <Button type="submit" onClick={() => this.handleGetItems(true)}>
              Показать всех
            </Button>
          </Form>
        </Segment>
        <Segment attached placeholder={_.isEmpty(data)}>
          {_.isEmpty(data) && !isLoading && (
            <Header icon>
              <Icon name="search" />
              Результатов нет
            </Header>
          )}
          {!_.isEmpty(data) && (
            <Item.Group divided>
              {data.map(el => (
                <Item key={el._id}>
                  <Item.Content>
                    <Item.Header>{el[dbPropertyName]}</Item.Header>
                    <Dropdown
                      icon="ellipsis horizontal"
                      floating
                      button
                      className={cn(s.headerDrop, "icon")}
                    >
                      <Dropdown.Menu>
                        <Dropdown.Menu scrolling>
                          <Dropdown.Item icon="pencil" text="Редактировать" />
                          <Dropdown.Item icon="trash" text="Удалить" />
                        </Dropdown.Menu>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Item.Content>
                </Item>
              ))}
            </Item.Group>
          )}
        </Segment>
      </>
    );
  }
}
