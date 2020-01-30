/* eslint-disable react/destructuring-assignment */
import React, { Component } from "react";
import {
  Segment,
  Form,
  Button,
  Header,
  Icon,
  Item,
  Divider,
  Label
} from "semantic-ui-react";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";
import { toast } from "react-semantic-toasts";
import { withRouter } from "react-router-dom";
import qStr from "query-string";

import PaginationBlock from "@commonViews/Pagination";
import BookItem from "@DUI/common/BookItem";
import BookFilters from "@DUI/common/BookFilters";

import axs from "@axios";
import ResultFilters from "./components/ResultFilters";
import ModalWindow from "./components/Modal";

import { PARAMS } from "@store";
import MSG from "@msg";

class ManageBooks extends Component {
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
        page: 1,
        whatWeSee: "all"
      },
      bookToDeleteId: "",
      deleteBookModal: {
        open: false,
        isLoading: false,
        preText: "",
        header: "",
        result: {
          BookedBooks: 0,
          OrderedBooks: 0
        }
      }
    };
  }

  componentDidMount() {
    const { showBooksWhenOpen, location } = this.props;
    const query = qStr.parse(location.search);

    if (
      _.has(query, "mode") &&
      query.mode === "delete" &&
      _.has(query, "bookId") &&
      !_.isEmpty(query.bookId)
    ) {
      this.manageConfirmWindow(
        query.bookId,
        "Вы действительно хотите удалить эту книгу?",
        "Удаление книги"
      );
    }
    if (showBooksWhenOpen) {
      this.handleSearchBooks(true);
    }
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

  handleChangeSearchQuery = (value, name, regex = false, cb = () => {}) =>
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
    }, cb);

  handleChangeResultFilterValue = (value, prop) =>
    this.setState(
      prevState => ({
        options: {
          ...prevState.options,
          [prop]: value
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
      axs.get(`/books/${bookToDeleteId}/availability`).then(availResp => {
        if (!availResp.data.error) {
          if (
            availResp.data.payload.BookedBooks.length !== 0 ||
            availResp.data.payload.OrderedBooks.length !== 0
          ) {
            this.setState({
              isLoading: false,
              deleteBookModal: {
                ...deleteBookModal,
                isLoading: false,
                result: {
                  BookedBooks: availResp.data.payload.BookedBooks.length,
                  OrderedBooks: availResp.data.payload.OrderedBooks.length
                }
              }
            });
          } else {
            axs.delete(`/books/${bookToDeleteId}`).then(deleteResp => {
              if (!deleteResp.data.error) {
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
                    toast(MSG.toastClassicSuccess(deleteResp.data.message));
                  }
                );
              } else {
                this.setState({
                  isLoading: false,
                  deleteBookModal: {
                    ...deleteBookModal,
                    isLoading: false
                  }
                });
                toast(MSG.toastClassicError(deleteResp.data.message));
              }
            });
          }
        } else {
          this.setState({
            isLoading: false,
            deleteBookModal: {
              ...deleteBookModal,
              isLoading: false
            }
          });
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

  bookRestore(bookId) {}

  goToBookEdit(currentBook) {
    const { history } = this.props;

    history.push(`/dashboard/books/new?mode=edit&bookId=${currentBook._id}`);
  }

  manageConfirmWindow(bookId, preText, header) {
    const { deleteBookModal } = this.state;
    this.setState({
      deleteBookModal: {
        ...deleteBookModal,
        preText,
        header,
        open: true
      },
      bookToDeleteId: bookId
    });
  }

  render() {
    const {
      books,
      isLoading,
      searchQuery,
      options,
      maxElements,
      deleteBookModal
    } = this.state;
    const { allAccess, formHeader } = this.props;
    return (
      <Segment.Group>
        <Segment>
          <Header as="h3">{formHeader}</Header>
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
              permanentOpen={!allAccess}
            />
            <Divider />
            <Button icon type="submit" primary labelPosition="left">
              <Icon name="search" />
              Поиск
            </Button>
            <Divider />
            <ResultFilters
              options={options}
              onChangeResultFilterValue={this.handleChangeResultFilterValue}
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
                <BookItem
                  key={book._id}
                  book={book}
                  onEditClick={bookData => this.goToBookEdit(bookData)}
                  onRestoreClick={bookData => this.bookRestore(bookData._id)}
                  onDeleteClick={bookData =>
                    this.manageConfirmWindow(bookData._id)
                  }
                  showOptions={allAccess}
                />
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
        <ModalWindow
          deleteBookModal={deleteBookModal}
          onBookDeleteClick={this.deleteBook}
          onBookRestoreClick={this.bookRestore}
        />
        <ModalWindow
          // TODO: доделать модальное окно, удаление и восстановление книги
          header={deleteBookModal.header}
          open={deleteBookModal.open}
          firstPageContent={<p>deleteBookModal.preText</p>}
          showFirstPageContent={
            !deleteBookModal.isLoading &&
            deleteBookModal.result.BookedBooks === 0 &&
            deleteBookModal.result.OrderedBooks === 0
          }
          isLoading={deleteBookModal.isLoading}
          disableRunButton={
            deleteBookModal.isLoading ||
            deleteBookModal.result.BookedBooks !== 0 ||
            deleteBookModal.result.OrderedBooks !== 0
          }
          secondPageContent={
            !deleteBookModal.isLoading &&
            (deleteBookModal.result.BookedBooks !== 0 ||
              deleteBookModal.result.OrderedBooks !== 0) && (
              <>
                <Header as="h3" color="red">
                  Произошла ошибка.
                </Header>
                <p>
                  Книги есть у пользователей на руках либо они забронированы
                </p>
                <p>
                  Забронированных книг:{" "}
                  <Label>{deleteBookModal.result.BookedBooks}</Label>
                </p>
                <p>
                  Книг на руках:{" "}
                  <Label>{deleteBookModal.result.OrderedBooks}</Label>
                </p>
              </>
            )
          }
        />
      </Segment.Group>
    );
  }
}

export default withRouter(
  branch(
    {
      bookToDB: PARAMS.BOOK_TO_DB
    },
    ManageBooks
  )
);
