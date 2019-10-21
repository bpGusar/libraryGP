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
  Dimmer,
  Loader,
  Icon,
  Label
} from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import _ from "lodash";

import axs from "@axios";
import * as util from "@utils";
import MSG from "@msg";

import s from "./index.module.scss";

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
          ...orderedBook
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
        <>
          <Header as="h5">Возврат</Header>
          <Form.Input
            label="Введите комментарий или оставьте поле пустым."
            className={s.rejectInput}
            onChange={(e, { value }) =>
              this.setState({
                bookReturn: {
                  ...bookReturn,
                  returnMsgs: {
                    ...bookReturn.returnMsgs,
                    [`${orderedBook._id}-msg`]: value
                  }
                }
              })
            }
          />
          <div className="ui two buttons">
            <Button
              basic
              color="green"
              onClick={() => this.handleRejectOrdering(orderedBook)}
              disabled={bookReturn.successfullyReturned[orderedBook._id]}
            >
              Выполнить
            </Button>
            <Button
              basic
              color="grey"
              onClick={() =>
                this.setState({
                  bookReturn: {
                    ...bookReturn,
                    bookReturnInProgress: {
                      ...bookReturn.bookReturnInProgress,
                      [orderedBook._id]: false
                    }
                  }
                })
              }
              disabled={bookReturn.successfullyReturned[orderedBook._id]}
            >
              Отмена
            </Button>
          </div>
        </>
      );
    }
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
  }

  renderDimmer(orderedBook) {
    const { actionWithOrderedBookInProgress, bookReturn } = this.state;

    return (
      <Dimmer
        active={
          actionWithOrderedBookInProgress[orderedBook._id] ||
          bookReturn.successfullyReturnedBooks[orderedBook._id] ||
          bookReturn.successfullyReturned[orderedBook._id]
        }
      >
        {actionWithOrderedBookInProgress[orderedBook._id] && (
          <Loader>Выполняется</Loader>
        )}
        {bookReturn.successfullyReturned[orderedBook._id] && (
          <>
            <Header as="h5" icon inverted>
              <Icon name="check" />
              Книга успешно возвращена
            </Header>
          </>
        )}
      </Dimmer>
    );
  }

  // TODO: сделать ссылку на профиль пользователя

  render() {
    const {
      readerId,
      books,
      isDataLoading,
      emptyResults,
      bookReturn,
      resultsFor
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
                      {this.renderDimmer(orderedBook)}
                      <Card.Content>
                        <Image
                          floated="right"
                          size="mini"
                          src={orderedBookInfo.bookInfo.imageLinks.poster}
                          as={Link}
                          to={`/book-${orderedBookInfo._id}`}
                          target="blanc"
                        />
                        <Card.Header
                          as={Link}
                          to={`/book-${orderedBookInfo._id}`}
                          target="blanc"
                        >
                          {orderedBookInfo.bookInfo.title}
                        </Card.Header>
                        <Card.Meta>
                          Дата брони: {util.convertDate(orderedBook.orderedAt)}
                        </Card.Meta>
                        <Card.Description>
                          На руках у: {user.lastName} {user.firstName}{" "}
                          {user.patronymic} <br />
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
