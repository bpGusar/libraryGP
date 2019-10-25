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

import Filters from "./components/Filters";

import axs from "@axios";
import ResultFilters from "./components/ResultFilters";
import BookItem from "./components/BookItem";
import PaginationBlock from "./components/Pagination";

export default class AllBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      books: [],
      searchQuery: {},
      activeAccordionIndex: -1,
      maxElements: 0,
      options: {
        fetch_type: 1,
        sort: "desc",
        limit: 10,
        page: 1
      }
    };
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
        }
      });
  };

  handleClick = (e, titleProps) =>
    this.setState(prevState => {
      const { index } = titleProps;
      const { activeAccordionIndex } = prevState;
      const newIndex = activeAccordionIndex === index ? -1 : index;
      return { activeAccordionIndex: newIndex };
    });

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

  renderBookList() {
    const { books } = this.state;

    return books.map(book => <BookItem key={book._id} book={book} />);
  }

  render() {
    const { books, isLoading, searchQuery } = this.state;
    return (
      <Segment.Group>
        <Segment>
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
            <Filters {...this.state} _this={this} />
            <Divider />
            <Button icon type="submit" primary labelPosition="left">
              <Icon name="search" />
              Поиск
            </Button>
            <Divider />
            <ResultFilters {...this.state} _this={this} />
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
            <Item.Group divided>{this.renderBookList()}</Item.Group>
          )}
        </Segment>
        {!_.isEmpty(books) && (
          <Segment>
            <PaginationBlock {...this.state} _this={this} />
          </Segment>
        )}
      </Segment.Group>
    );
  }
}
