import React, { Component } from "react";
import {
  Segment,
  Form,
  Button,
  Header,
  Icon,
  Item,
  Divider,
  List
} from "semantic-ui-react";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";

import PaginationBlock from "@commonViews/Pagination";
import BookItem from "@DUI/common/BookItem";
import UniqueDropdown from "@views/common/UniqueDropdown/UniqueDropdown";

import axs from "@axios";
import ResultFilters from "./components/ResultFilters";

import { PARAMS } from "@store";

class OrdersArchive extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      books: [],
      searchQuery: {},
      maxElements: 0,
      options: {
        fetch_type: 1,
        sort: "desc",
        limit: 10,
        page: 1
      }
    };
  }

  componentDidMount() {
    this.handleSearchBooks(true);
  }

  handleSearchBooks = (dropPageCount = false) => {
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
      .get(`/ordered-books/archive`, {
        params: {
          searchQuery,
          options: { ...clonedOptions }
        }
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            books: resp.data.payload,
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

  handleChangeSearchQuery = (value, name, regex = false) =>
    this.setState(prevState => {
      const { searchQuery } = prevState;
      let searchQueryCloned = _.cloneDeep(searchQuery);
      if (_.isEmpty(value)) {
        delete searchQueryCloned[name];
      } else {
        searchQueryCloned = {
          ...searchQueryCloned,
          [name]: regex
            ? {
                $regex: value,
                $options: "i"
              }
            : {
                $in: value
              }
        };
      }
      return {
        searchQuery: { ...searchQueryCloned }
      };
    });

  handleChangeSortType = value =>
    this.setState(
      prevState => ({
        options: {
          ...prevState.options,
          sort: value
        }
      }),
      () => this.handleSearchBooks()
    );

  handleChangeLimit = value =>
    this.setState(prevState => ({
      options: {
        ...prevState.options,
        limit: Number(value)
      }
    }));

  handlePageChange = data =>
    this.setState(
      prevState => ({
        options: {
          ...prevState.options,
          page: data.activePage
        }
      }),
      () => this.handleSearchBooks()
    );

  render() {
    const { books, isLoading, searchQuery, options, maxElements } = this.state;
    return (
      <Segment.Group>
        <Segment>
          <Header as="h3">Архив выданных книг</Header>
        </Segment>
        <Segment loading={isLoading}>
          <Form onSubmit={() => this.handleSearchBooks(true)}>
            <UniqueDropdown
              axiosGetLink="/books"
              storeParam={PARAMS.BOOKS_LIST}
              required
              multiple
              onChange={value =>
                this.handleChangeSearchQuery(
                  value,
                  "orderedBookInfo.bookId",
                  false
                )
              }
              label="Фильтр по книге"
              getValueFromProperty="bookInfo.title"
              currentValue={
                _.has(searchQuery["orderedBookInfo.bookId"], "$in")
                  ? searchQuery["orderedBookInfo.bookId"].$in
                  : []
              }
            />
            <Button icon type="submit" primary labelPosition="left">
              <Icon name="search" />
              Поиск
            </Button>
            <Divider />
            <ResultFilters
              options={options}
              onChangeSort={this.handleChangeSortType}
              onChangeLimit={this.handleChangeLimit}
            />
          </Form>
        </Segment>
        <Segment placeholder={_.isEmpty(books)} loading={isLoading}>
          {_.isEmpty(books) && !isLoading && (
            <Header icon>
              <Icon name="search" />
              Результатов нет
            </Header>
          )}
          {!_.isEmpty(books) && (
            <Item.Group divided>
              {books.map(book => {
                const {
                  orderedBookInfo: { bookId },
                  orderedBookInfo
                } = book;
                return (
                  <BookItem
                    key={bookId._id}
                    book={bookId}
                    dividedInfo
                    renderCustomInfo={() => (
                      <>
                        <strong
                          style={{
                            color: "black"
                          }}
                        >
                          Информация о возврате:
                        </strong>
                        <Segment>
                          <List divided relaxed>
                            <List.Item>
                              <List.Content>
                                <List.Header>Дата аренды:</List.Header>
                                <List.Description>
                                  {DateTime.fromISO(orderedBookInfo.orderedAt)
                                    .setLocale("ru")
                                    .toFormat("dd MMMM yyyy")}
                                </List.Description>
                              </List.Content>
                            </List.Item>
                            <List.Item>
                              <List.Content>
                                <List.Header>
                                  Планируемая дата возврата:
                                </List.Header>
                                <List.Description>
                                  {DateTime.fromISO(
                                    orderedBookInfo.orderedUntil
                                  )
                                    .setLocale("ru")
                                    .toFormat("dd MMMM yyyy")}
                                </List.Description>
                              </List.Content>
                            </List.Item>
                            <List.Item>
                              <List.Content>
                                <List.Header>Дата возврата:</List.Header>
                                <List.Description>
                                  {DateTime.fromISO(book.createdAt)
                                    .setLocale("ru")
                                    .toFormat("dd MMMM yyyy")}
                                </List.Description>
                              </List.Content>
                            </List.Item>
                            <List.Item>
                              <List.Content>
                                <List.Header>
                                  Была выдана на руки пользователю:
                                </List.Header>
                                <List.Description>
                                  <Link
                                    to={`/profile/${orderedBookInfo.userId._id}`}
                                    target="blanc"
                                  >
                                    {orderedBookInfo.userId.login}
                                  </Link>
                                </List.Description>
                              </List.Content>
                            </List.Item>
                            <List.Item>
                              <List.Content>
                                <List.Header>Возврат произвел:</List.Header>
                                <List.Description>
                                  <Link
                                    to={`/profile/${book.userId._id}`}
                                    target="blanc"
                                  >
                                    {book.userId.login}
                                  </Link>
                                </List.Description>
                              </List.Content>
                            </List.Item>
                            <List.Item>
                              <List.Content>
                                <List.Header>Комментарий:</List.Header>
                                <List.Description>
                                  {book.comment}
                                </List.Description>
                              </List.Content>
                            </List.Item>
                          </List>
                        </Segment>
                      </>
                    )}
                  />
                );
              })}
            </Item.Group>
          )}
        </Segment>
        {Number(maxElements) > options.limit && (
          <Segment>
            <PaginationBlock
              onPageChange={this.handlePageChange}
              page={options.page}
              limit={options.limit}
              maxElements={maxElements}
            />
          </Segment>
        )}
      </Segment.Group>
    );
  }
}

export default branch(
  {
    bookToDB: PARAMS.BOOK_TO_DB
  },
  OrdersArchive
);
