import React, { Component } from "react";
import {
  Segment,
  Form,
  Button,
  Header,
  Icon,
  Item,
  Divider
} from "semantic-ui-react";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";

import PaginationBlock from "@commonViews/Pagination";
import BookItem from "@DUI/common/BookItem";
import BookFilters from "@DUI/common/BookFilters";

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
      .get(`/books`, {
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
            <Form.Input
              fluid
              label="Название книги"
              value={
                _.has(searchQuery["bookInfo.title"], "$regex")
                  ? searchQuery["bookInfo.title"].$regex
                  : ""
              }
              name="bookInfo.title"
              onChange={(e, { value, name }) =>
                this.handleChangeSearchQuery(value, name, true)
              }
            />
            <BookFilters
              searchQuery={searchQuery}
              onChangeSearchQuery={(value, name) =>
                this.handleChangeSearchQuery(value, name)
              }
            />
            <Divider />
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
              {books.map(book => (
                <BookItem key={book._id} book={book} />
              ))}
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
