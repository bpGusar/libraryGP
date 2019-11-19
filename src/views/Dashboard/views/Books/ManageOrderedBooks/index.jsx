import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Segment,
  Form,
  Header,
  Divider,
  Card,
  Image,
  Message,
  Label
} from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import _ from "lodash";

import CustomDimmer from "@commonViews/CustomDimmer";

import axs from "@axios";
import * as util from "@utils";
import MSG from "@msg";

import s from "./index.module.scss";
import Reject from "./components/Reject";

const resultsForEnum = {
  all: "все"
};

// TODO: сделать группироваку по пользователям если поиск по всем

export default class ManageOrderedBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      readerId: "",
      books: [],
      isDataLoading: false,
      resultsFor: "",
      emptyResults: {
        empty: false,
        readerId: ""
      },
      actionWithOrderedBookInProgress: {},
      bookReturn: {
        successfullyReturnedBooks: {},
        returnMsgs: {},
        successfullyReturned: {},
        bookReturnInProgress: {}
      }
    };
  }

  handleSetComment = (value, orderedBook) =>
    this.setState(ps => ({
      bookReturn: {
        ...ps.bookReturn,
        returnMsgs: {
          ...ps.bookReturn.returnMsgs,
          [`${orderedBook._id}-msg`]: value
        }
      }
    }));

  handleClickCancel = orderedBook => {
    this.setState(ps => ({
      bookReturn: {
        ...ps.bookReturn,
        bookReturnInProgress: {
          ...ps.bookReturn.bookReturnInProgress,
          [orderedBook._id]: false
        }
      }
    }));
  };

  handleSubmitForm(e, getQuery) {
    const { readerId } = this.state;

    if (_.isEmpty(getQuery)) {
      e.preventDefault();

      this.setState({
        readerId: ""
      });
    }

    this.setState({
      books: [],
      isDataLoading: true,
      resultsFor: _.isEmpty(getQuery) ? resultsForEnum.all : readerId
    });

    axs
      .get("/ordered-books", {
        params: {
          getQuery
        }
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            books: resp.data.payload,
            isDataLoading: false,
            emptyResults: {
              empty: resp.data.payload.length === 0,
              readerId
            }
          });
        } else {
          this.setState({
            isDataLoading: true
          });
          toast(MSG.toastClassicError(resp.data.message));
        }
      });
  }

  handleOrderBook(orderedBook) {
    const { bookReturn, actionWithOrderedBookInProgress } = this.state;

    this.setState({
      actionWithOrderedBookInProgress: {
        ...actionWithOrderedBookInProgress,
        [orderedBook._id]: true
      }
    });

    axs
      .post("/ordered-books", {
        orderedBookInfo: {
          ...orderedBook
        },
        status: "ordered",
        comment: ""
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            bookReturn: {
              ...bookReturn,
              successfullyReturnedBooks: {
                ...bookReturn.successfullyReturnedBooks,
                [orderedBook._id]: true
              }
            },
            actionWithOrderedBookInProgress: {
              ...actionWithOrderedBookInProgress,
              [orderedBook._id]: false
            }
          });
        } else {
          toast(MSG.toastClassicError(resp.data.message));
        }
      });
  }

  handleRejectOrdering(orderedBook) {
    const { bookReturn, actionWithOrderedBookInProgress } = this.state;

    this.setState({
      actionWithOrderedBookInProgress: {
        ...actionWithOrderedBookInProgress,
        [orderedBook._id]: true
      }
    });

    axs
      .post(`/ordered-books/return`, {
        orderedBookInfo: {
          bookId: orderedBook.bookId._id,
          userId: orderedBook.userId._id,
          orderedAt: orderedBook.orderedAt,
          orderedUntil: orderedBook.orderedUntil
        },
        comment: _.isUndefined(bookReturn.returnMsgs[`${orderedBook._id}-msg`])
          ? ""
          : bookReturn.returnMsgs[`${orderedBook._id}-msg`]
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            actionWithOrderedBookInProgress: {
              ...actionWithOrderedBookInProgress,
              [orderedBook._id]: false
            },
            bookReturn: {
              ...bookReturn,
              successfullyReturned: {
                ...bookReturn.successfullyReturned,
                [orderedBook._id]: true
              }
            }
          });
        } else {
          toast(MSG.toastClassicError(resp.data.message));
        }
      });
  }

  renderRejectBlock(orderedBook) {
    const { bookReturn } = this.state;

    if (bookReturn.bookReturnInProgress[orderedBook._id]) {
      return (
        <Reject
          onChangeComment={value => this.handleSetComment(value, orderedBook)}
          onClickReject={() => this.handleRejectOrdering(orderedBook)}
          onClickCancel={() => this.handleClickCancel(orderedBook)}
          rejectButtonDisabled={
            bookReturn.successfullyReturned[orderedBook._id]
          }
          cancelButtonDisabled={
            bookReturn.successfullyReturned[orderedBook._id]
          }
        />
      );
    }
    return false;
  }

  renderOrderBlock(orderedBook) {
    const { bookReturn } = this.state;

    if (!bookReturn.bookReturnInProgress[orderedBook._id]) {
      return (
        <div className="ui two buttons">
          <Button
            basic
            color="green"
            onClick={() =>
              this.setState({
                bookReturn: {
                  ...bookReturn,
                  bookReturnInProgress: {
                    ...bookReturn.bookReturnInProgress,
                    [orderedBook._id]: true
                  }
                }
              })
            }
            disabled={bookReturn.successfullyReturnedBooks[orderedBook._id]}
          >
            Оформить возврат
          </Button>
        </div>
      );
    }
    return false;
  }

  renderEmptyResultsBlock(emptyResults) {
    const { resultsFor } = this.state;

    if (emptyResults.empty) {
      return (
        <Message info>
          <Message.Header>
            {resultsFor === resultsForEnum.all
              ? "Выданные книги отсутствуют"
              : `Выданные книги для билета № ${emptyResults.readerId}${" "}
            отсутствуют`}
          </Message.Header>
        </Message>
      );
    }
    return false;
  }

  // TODO: сделать ссылку на профиль пользователя

  render() {
    const {
      readerId,
      books,
      isDataLoading,
      emptyResults,
      bookReturn,
      resultsFor,
      actionWithOrderedBookInProgress
    } = this.state;

    return (
      <>
        <Header as="h3" attached="top">
          Управление забронированными книгами
        </Header>
        <Segment attached loading={isDataLoading}>
          <Form onSubmit={e => this.handleSubmitForm(e, { readerId })}>
            <Form.Group widths="equal">
              <Form.Input
                type="number"
                value={readerId}
                onChange={(e, { name, value }) =>
                  this.setState({
                    [name]: value
                  })
                }
                fluid
                name="readerId"
                label="Номер читательского билета"
                required
              />
              <Button type="submit" primary>
                Найти
              </Button>
            </Form.Group>
            <Divider />
            <Button onClick={e => this.handleSubmitForm(e, {})} primary>
              Показать все
            </Button>
            <Divider />
          </Form>
          {books.length !== 0 && (
            <>
              <Header as="h5">
                <span className={s.resultsForText}>Результаты для:</span>{" "}
                <Label color="blue">{resultsFor}</Label>
              </Header>
              <Card.Group>
                {books.map(orderedBook => {
                  const { bookId: orderedBookInfo, userId: user } = orderedBook;

                  return (
                    <Card key={orderedBook._id}>
                      <CustomDimmer
                        loaderText="Выполняется"
                        successIcon="check"
                        successText="Книга успешно возвращена"
                        active={
                          actionWithOrderedBookInProgress[orderedBook._id] ||
                          bookReturn.successfullyReturnedBooks[
                            orderedBook._id
                          ] ||
                          bookReturn.successfullyReturned[orderedBook._id]
                        }
                        showLoader={
                          actionWithOrderedBookInProgress[orderedBook._id]
                        }
                        success={
                          bookReturn.successfullyReturned[orderedBook._id]
                        }
                      />
                      <Card.Content>
                        <Image
                          floated="right"
                          size="mini"
                          src={orderedBookInfo.bookInfo.imageLinks.poster}
                          as={Link}
                          to={`/book/${orderedBookInfo._id}`}
                          target="blanc"
                        />
                        <Card.Header
                          as={Link}
                          to={`/book/${orderedBookInfo._id}`}
                          target="blanc"
                        >
                          {orderedBookInfo.bookInfo.title}
                        </Card.Header>
                        <Card.Meta>
                          Дата брони: {util.convertDate(orderedBook.orderedAt)}
                        </Card.Meta>
                        <Card.Description>
                          На руках у:{" "}
                          <Link target="blank" to={`/profile/${user._id}`}>
                            {user.lastName} {user.firstName} {user.patronymic}
                          </Link>{" "}
                          <br />
                        </Card.Description>
                        <Card.Description>
                          Чит. билет №: {orderedBook.readerId} <br />
                        </Card.Description>
                      </Card.Content>
                      <Card.Content
                        extra
                        className={
                          bookReturn.bookReturnInProgress[orderedBook._id]
                            ? s.rejectBlock
                            : ""
                        }
                      >
                        {this.renderRejectBlock(orderedBook)}
                        {this.renderOrderBlock(orderedBook)}
                      </Card.Content>
                    </Card>
                  );
                })}
              </Card.Group>
            </>
          )}
          {this.renderEmptyResultsBlock(emptyResults)}
        </Segment>
      </>
    );
  }
}
