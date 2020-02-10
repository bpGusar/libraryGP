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
  Label,
  Accordion,
  Icon
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

export default class ManageOrderedBooks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      readerId: "",
      books: {},
      activeOpenedSpoiler: -1,
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
      resultsFor: _.isEmpty(getQuery) ? resultsForEnum.all : readerId,
      activeOpenedSpoiler: -1
    });

    axs
      .get("/ordered-books", {
        params: {
          getQuery
        }
      })
      .then(resp => {
        if (!resp.data.error) {
          let books = {};

          resp.data.payload.forEach(el => {
            books = {
              ...books,
              [el.userId._id]: {
                userName: `${el.userId.lastName} ${el.userId.firstName} ${el.userId.patronymic}`,
                books: resp.data.payload.filter(
                  els => els.userId._id === el.userId._id
                )
              }
            };
          });

          this.setState({
            books,
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

  handleReturnBook(orderedBookId) {
    const { bookReturn, actionWithOrderedBookInProgress } = this.state;

    this.setState({
      actionWithOrderedBookInProgress: {
        ...actionWithOrderedBookInProgress,
        [orderedBookId]: true
      },
      isDataLoading: true
    });

    axs
      .post(`/ordered-books/${orderedBookId}/return`, {
        comment: _.isUndefined(bookReturn.returnMsgs[`${orderedBookId}-msg`])
          ? ""
          : bookReturn.returnMsgs[`${orderedBookId}-msg`]
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            actionWithOrderedBookInProgress: {
              ...actionWithOrderedBookInProgress,
              [orderedBookId]: false
            },
            bookReturn: {
              ...bookReturn,
              successfullyReturned: {
                ...bookReturn.successfullyReturned,
                [orderedBookId]: true
              }
            },
            isDataLoading: false
          });
        } else {
          toast(MSG.toastClassicError(resp.data.message));
        }
      });
  }

  handleClickAccordion(key) {
    this.setState(ps => ({
      activeOpenedSpoiler: key === ps.activeOpenedSpoiler ? -1 : key
    }));
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

  render() {
    const {
      readerId,
      books,
      isDataLoading,
      emptyResults,
      bookReturn,
      resultsFor,
      actionWithOrderedBookInProgress,
      activeOpenedSpoiler
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
          {!_.isEmpty(books) && (
            <>
              <Header as="h5">
                <span className={s.resultsForText}>Результаты для:</span>{" "}
                <Label color="blue">{resultsFor}</Label>
              </Header>
              {Object.keys(books).map(key => {
                const user = books[key];
                return (
                  <Accordion>
                    <Accordion.Title
                      active={activeOpenedSpoiler === key}
                      key={key}
                      index={0}
                      onClick={() => this.handleClickAccordion(key)}
                      as={Segment}
                    >
                      <Icon name="dropdown" />
                      {user.userName}
                    </Accordion.Title>
                    <Accordion.Content active={activeOpenedSpoiler === key}>
                      <Card.Group
                        style={{
                          margin: "-20px -6px 0px"
                        }}
                      >
                        {user.books.map(orderedBook => {
                          const book = orderedBook.bookId;
                          return (
                            <Card>
                              <CustomDimmer
                                loaderText="Выполняется"
                                successIcon="check"
                                successText="Книга успешно возвращена"
                                active={
                                  actionWithOrderedBookInProgress[
                                    orderedBook._id
                                  ] ||
                                  bookReturn.successfullyReturnedBooks[
                                    orderedBook._id
                                  ] ||
                                  bookReturn.successfullyReturned[
                                    orderedBook._id
                                  ]
                                }
                                showLoader={
                                  actionWithOrderedBookInProgress[
                                    orderedBook._id
                                  ]
                                }
                                success={
                                  bookReturn.successfullyReturned[
                                    orderedBook._id
                                  ]
                                }
                              />
                              <Card.Content>
                                <Image
                                  floated="right"
                                  size="mini"
                                  src={book.bookInfo.imageLinks.poster}
                                  as={Link}
                                  to={`/book/${book._id}`}
                                  target="blanc"
                                />
                                <Card.Header
                                  as={Link}
                                  to={`/book/${book._id}`}
                                  target="blanc"
                                >
                                  {book.bookInfo.title}
                                </Card.Header>
                                <Card.Meta>
                                  Дата брони:{" "}
                                  {util.convertDate(orderedBook.orderedAt)}
                                </Card.Meta>
                                <Card.Description>
                                  На руках у:{" "}
                                  <Link target="blank" to={`/profile/${key}`}>
                                    {user.userName}
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
                                  bookReturn.bookReturnInProgress[
                                    orderedBook._id
                                  ]
                                    ? s.rejectBlock
                                    : ""
                                }
                              >
                                {bookReturn.bookReturnInProgress[
                                  orderedBook._id
                                ] && (
                                  <Reject
                                    onChangeComment={value =>
                                      this.handleSetComment(value, orderedBook)
                                    }
                                    onClickReject={() =>
                                      this.handleReturnBook(orderedBook._id)
                                    }
                                    onClickCancel={() =>
                                      this.handleClickCancel(orderedBook)
                                    }
                                    rejectButtonDisabled={
                                      bookReturn.successfullyReturned[
                                        orderedBook._id
                                      ]
                                    }
                                    cancelButtonDisabled={
                                      bookReturn.successfullyReturned[
                                        orderedBook._id
                                      ]
                                    }
                                  />
                                )}
                                {!bookReturn.bookReturnInProgress[
                                  orderedBook._id
                                ] && (
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
                                      disabled={
                                        bookReturn.successfullyReturnedBooks[
                                          orderedBook._id
                                        ]
                                      }
                                    >
                                      Оформить возврат
                                    </Button>
                                  </div>
                                )}
                              </Card.Content>
                            </Card>
                          );
                        })}
                      </Card.Group>
                    </Accordion.Content>
                  </Accordion>
                );
              })}
            </>
          )}
          {this.renderEmptyResultsBlock(emptyResults)}
        </Segment>
      </>
    );
  }
}
