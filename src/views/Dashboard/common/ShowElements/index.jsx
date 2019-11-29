/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import _ from "lodash";
import {
  Button,
  Form,
  Segment,
  Header,
  Item,
  Icon,
  Message
} from "semantic-ui-react";

import ItemElement from "./components/ItemElement";
import Pagination from "./components/Pagination";
import ResultFilters from "./components/ResultFilters";

import axs from "@axios";

export default class ShowElements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      isLoading: false,
      data: [],
      message: {
        type: "",
        message: ""
      },
      options: {
        page: 1,
        limit: 10,
        sort: "desc"
      },
      maxElements: 0
    };
  }

  componentDidMount() {
    this.handleGetItems(true);
  }

  handleGetItems = getAll => {
    const { linkPrefix, dbPropertyName } = this.props;
    const { inputValue, options } = this.state;
    const clonedOptions = { ...options };

    if (getAll) {
      clonedOptions.page = 1;
    }

    this.setState({
      isLoading: true,
      inputValue: getAll ? "" : inputValue,
      data: [],
      message: {
        type: "",
        message: ""
      }
    });

    axs
      .get(linkPrefix, {
        params: {
          searchQuery: getAll
            ? {}
            : {
                [dbPropertyName]: { $regex: inputValue, $options: "i" }
              },
          options: { ...clonedOptions }
        }
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            isLoading: false,
            data: resp.data.payload,
            maxElements: resp.headers["max-elements"]
          });
        }
      });
  };

  handleDeleteBook = el => {
    const { linkPrefix, dbPropertyName } = this.props;

    this.setState({
      isLoading: true,
      message: {
        type: "",
        message: ""
      }
    });

    axs.delete(`${linkPrefix}${el._id}`).then(resp => {
      if (!resp.data.error) {
        this.handleGetItems(true);
        this.setState({
          isLoading: true,
          message: {
            type: "success",
            message: `Элемент ${el[dbPropertyName]} успешно удален.`
          }
        });
      } else {
        this.setState({
          isLoading: false,
          message: {
            type: "error",
            message: `Ошибка удаления элемента ${el[dbPropertyName]}.`
          }
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
      () => this.handleGetItems(false)
    );

  handleChangeSortType = value =>
    this.setState(
      prevState => ({
        options: {
          ...prevState.options,
          sort: value
        }
      }),
      () => this.handleGetItems(true)
    );

  handleChangeLimit = value =>
    this.setState(prevState => ({
      options: {
        ...prevState.options,
        limit: Number(value)
      }
    }));

  render() {
    const {
      isLoading,
      inputValue,
      data,
      message,
      options,
      maxElements
    } = this.state;
    const {
      dbPropertyName,
      formHeaderText,
      inputLabel,
      linkPrefix
    } = this.props;

    const isError = message.type === "error";
    const isSuccess = message.type === "success";

    return (
      <>
        <Header as="h3" attached="top">
          {formHeaderText}
        </Header>
        <Segment attached loading={isLoading}>
          {!_.isEmpty(message.type) && (
            <Message negative={isError} positive={isSuccess}>
              <Message.Header>
                {isSuccess && "Успешно"}
                {isError && "Ошибка"}
              </Message.Header>
              <p>{message.message}</p>
            </Message>
          )}
          <Form>
            <Form.Input
              fluid
              label={inputLabel}
              name={dbPropertyName}
              placeholder={inputLabel}
              value={inputValue}
              onChange={(e, { value }) => this.setState({ inputValue: value })}
            />
            <ResultFilters
              sort={options.sort}
              limit={options.limit}
              onChangeSort={this.handleChangeSortType}
              onChangeLimit={this.handleChangeLimit}
            />
            <Button
              disabled={_.isEmpty(inputValue)}
              type="submit"
              primary
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
                <ItemElement
                  key={el._id}
                  element={el}
                  dbPropertyName={dbPropertyName}
                  onDelete={this.handleDeleteBook}
                  linkPrefix={linkPrefix}
                  onEditSubmit={() => this.handleGetItems(true)}
                />
              ))}
            </Item.Group>
          )}
        </Segment>
        {!_.isEmpty(data) && (
          <Segment attached>
            <Pagination
              onPageChange={this.handlePageChange}
              page={options.page}
              limit={options.limit}
              maxElements={maxElements}
            />
          </Segment>
        )}
      </>
    );
  }
}
