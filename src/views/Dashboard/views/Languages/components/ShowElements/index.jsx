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

import Pagination from "@commonViews/Pagination";
import axs from "@axios";
import ItemElement from "./components/ItemElement";
import ResultFilters from "./components/ResultFilters";

export default class ShowElements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      isLoading: false,
      deletedItems: {},
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
    const { linkPrefix } = this.props;
    const { inputValue, options } = this.state;
    const clonedOptions = { ...options };

    if (getAll) {
      clonedOptions.page = 1;
    }

    this.setState({
      isLoading: true,
      inputValue: getAll ? "" : inputValue,
      data: [],
      maxElements: 0,
      deletedItems: {},
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
                languageName: { $regex: inputValue, $options: "i" }
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
        } else {
          this.setState({
            isLoading: false
          });
        }
      });
  };

  handleDeleteItem = el => {
    const { linkPrefix } = this.props;

    this.setState({
      isLoading: true,
      message: {
        type: "",
        message: ""
      }
    });

    axs.delete(`${linkPrefix}${el._id}`).then(resp => {
      if (!resp.data.error) {
        this.setState(ps => ({
          isLoading: false,
          message: {
            type: "success",
            message: `Элемент ${el.languageName} успешно удален.`
          },
          deletedItems: { ...ps.deletedItems, [el._id]: true }
        }));
      } else {
        this.setState({
          isLoading: false,
          message: {
            type: "error",
            message: `Ошибка удаления элемента ${el.languageName}.`
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
      deletedItems,
      maxElements
    } = this.state;
    const { formHeaderText, inputLabel, linkPrefix } = this.props;

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
              name="languageName"
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
                  isItemDeleted={deletedItems[el._id]}
                  onDelete={this.handleDeleteItem}
                  linkPrefix={linkPrefix}
                  onEditSubmit={() => this.handleGetItems(true)}
                />
              ))}
            </Item.Group>
          )}
        </Segment>
        {Number(maxElements) > options.limit && (
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
