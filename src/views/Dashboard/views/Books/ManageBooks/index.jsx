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
import { toast } from "react-semantic-toasts";

import PaginationBlock from "@commonViews/Pagination";
import Filters from "./components/Filters";

import axs from "@axios";
import ResultFilters from "./components/ResultFilters";
import BookItem from "./components/BookItem";
import ModalWindow from "./components/Modal";

import { PARAMS } from "@store";
import { storeData } from "@act";
import MSG from "@msg";

class ManageBooks extends Component {
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
      },
      bookToDeleteId: "",
      deleteBookModal: {
        open: false,
        isLoading: false,
        result: {
          BookedBooks: 0,
          OrderedBooks: 0
        }
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

  handleAccordionClick = (e, titleProps) =>
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

  deleteBook = deleteBook => {
    const { bookToDeleteId, deleteBookModal } = this.state;

    if (deleteBook) {
      this.setState({
        isLoading: true,
        deleteBookModal: {
          ...deleteBookModal,
          isLoading: true
        }
      });
      axs.delete(`/books/${bookToDeleteId}`).then(resp => {
        if (!resp.data.error) {
          this.setState(
            {
              isLoading: false,
              bookToDeleteId: "",
              deleteBookModal: {
                ...deleteBookModal,
                open: false
              }
            },
            () => {
              this.handleSearchBooks(true);
              toast(MSG.toastClassicSuccess(resp.data.message));
            }
          );
        } else if (resp.data.error && _.has(resp.data.payload, "bookOnHand")) {
          this.setState({
            isLoading: false,
            deleteBookModal: {
              ...deleteBookModal,
              isLoading: false,
              result: {
                BookedBooks: resp.data.payload.result.BookedBooks,
                OrderedBooks: resp.data.payload.result.OrderedBooks
              }
            }
          });
        } else {
          this.setState({
            isLoading: false
          });
          toast(MSG.toastClassicError(resp.data.message));
        }
      });
    } else {
      this.setState({
        deleteBookModal: {
          ...deleteBookModal,
          open: false,
          result: {
            BookedBooks: 0,
            OrderedBooks: 0
          }
        }
      });
    }
  };

  putBookDataInToStore(currentBook) {
    const { dispatch, history, bookToDB } = this.props;

    this.setState({
      isLoading: true
    });

    axs
      .get(`/books/${currentBook._id}`, {
        params: {
          options: { fetch_type: 0 }
        }
      })
      .then(resp => {
        if (!resp.data.error) {
          const clonedResp = resp;
          delete clonedResp.data.payload[0].__v;

          this.setState(
            {
              isLoading: false
            },
            () => {
              dispatch(storeData, PARAMS.BOOK_TO_DB, {
                ...bookToDB,
                flag: "edit",
                book: {
                  ...clonedResp.data.payload[0]
                }
              });
              history.push("/dashboard/books/new");
            }
          );
        } else {
          this.setState({
            isLoading: false
          });
        }
      });
  }

  manageConfirmWindow(book) {
    const { deleteBookModal } = this.state;
    this.setState({
      deleteBookModal: {
        ...deleteBookModal,
        open: true
      },
      bookToDeleteId: book._id
    });
  }

  renderBookList() {
    const { books } = this.state;

    return books.map(book => (
      <BookItem
        key={book._id}
        book={book}
        onEditClick={data => this.putBookDataInToStore(data)}
        onDeleteClick={data => this.manageConfirmWindow(data)}
      />
    ));
  }

  render() {
    const {
      books,
      isLoading,
      searchQuery,
      activeAccordionIndex,
      options,
      maxElements,
      deleteBookModal
    } = this.state;
    return (
      <Segment.Group>
        <Segment>
          <Header as="h3">Список книг</Header>
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
            <Filters
              activeAccordionIndex={activeAccordionIndex}
              searchQuery={searchQuery}
              onChangeSearchQuery={(value, name) =>
                this.handleChangeSearchQuery(value, name)
              }
              onClickAccorion={(e, titleProp) =>
                this.handleAccordionClick(e, titleProp)
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
            <Item.Group divided>{this.renderBookList()}</Item.Group>
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
        <ModalWindow
          deleteBookModal={deleteBookModal}
          onBookDeleteClick={this.deleteBook}
        />
      </Segment.Group>
    );
  }
}

export default branch(
  {
    bookToDB: PARAMS.BOOK_TO_DB
  },
  ManageBooks
);
