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
  Label,
  Accordion
} from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import _ from "lodash";

import axs from "@axios";
import * as util from "@utils";
import MSG from "@msg";

import s from "./index.module.scss";

const ENUMresultsFor = {
  all: "все"
};

export default class ManageBookedBooks extends Component {
  constructor(props) {
    super(props);

    this.initState = {
      readerId: "",
      books: [],
      isDataLoading: false,
      resultsFor: "",
      emptyResults: {
        empty: false,
        readerId: ""
      },
      actionWithReservationInProgress: {},
      ordering: {
        successfullyOrderedBooks: {}
      },
      rejecting: {
        rejectMsgs: {},
        successfullyRejected: {},
        rejectingInProgress: {}
      },
      activeOpenedSpoiler: -1
    };

    this.state = this.initState;
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
      ...this.initState,
      ...getQuery,
      isDataLoading: true,
      resultsFor: _.isEmpty(getQuery) ? ENUMresultsFor.all : readerId
    });

    axs
      .get("/booked-books", {
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

  handleOrderBook(bookedBook) {
    const { ordering, actionWithReservationInProgress } = this.state;

    this.setState({
      actionWithReservationInProgress: {
        ...actionWithReservationInProgress,
        [bookedBook._id]: true
      },
      isDataLoading: true
    });

    axs
      .post(`/ordered-books/${bookedBook._id}`, {
        status: "ordered",
        comment: "",
        userId: bookedBook.userId._id
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            ordering: {
              ...ordering,
              successfullyOrderedBooks: {
                ...ordering.successfullyOrderedBooks,
                [bookedBook._id]: true
              }
            },
            actionWithReservationInProgress: {
              ...actionWithReservationInProgress,
              [bookedBook._id]: false
            },
            isDataLoading: false
          });
        } else {
          toast(MSG.toastClassicError(resp.data.message));
        }
      });
  }

  handleRejectOrdering(bookedBookId) {
    const { rejecting, actionWithReservationInProgress } = this.state;

    this.setState({
      actionWithReservationInProgress: {
        ...actionWithReservationInProgress,
        [bookedBookId]: true
      },
      isDataLoading: true
    });

    axs
      .post(`/booked-books/${bookedBookId}/cancel-reservation`, {
        status: "rejected",
        comment: _.isUndefined(rejecting.rejectMsgs[`${bookedBookId}-msg`])
          ? ""
          : rejecting.rejectMsgs[`${bookedBookId}-msg`]
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            actionWithReservationInProgress: {
              ...actionWithReservationInProgress,
              [bookedBookId]: false
            },
            rejecting: {
              ...rejecting,
              successfullyRejected: {
                ...rejecting.successfullyRejected,
                [bookedBookId]: true
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

  renderRejectBlock(bookedBook) {
    const { rejecting } = this.state;

    if (rejecting.rejectingInProgress[bookedBook._id]) {
      return (
        <>
          <Header as="h5">Отказ в выдаче</Header>
          <Form.Input
            label="Введите комментарий или оставьте поле пустым."
            className={s.rejectInput}
            onChange={(e, { value }) =>
              this.setState({
                rejecting: {
                  ...rejecting,
                  rejectMsgs: {
                    ...rejecting.rejectMsgs,
                    [`${bookedBook._id}-msg`]: value
                  }
                }
              })
            }
          />
          <div className="ui two buttons">
            <Button
              basic
              color="red"
              onClick={() => this.handleRejectOrdering(bookedBook._id)}
              disabled={rejecting.successfullyRejected[bookedBook._id]}
            >
              Отказать
            </Button>
            <Button
              basic
              color="grey"
              onClick={() =>
                this.setState({
                  rejecting: {
                    ...rejecting,
                    rejectingInProgress: {
                      ...rejecting.rejectingInProgress,
                      [bookedBook._id]: false
                    }
                  }
                })
              }
              disabled={rejecting.successfullyRejected[bookedBook._id]}
            >
              Отмена
            </Button>
          </div>
        </>
      );
    }
    return false;
  }

  renderOrderBlock(bookedBook) {
    const { ordering, rejecting } = this.state;

    if (!rejecting.rejectingInProgress[bookedBook._id]) {
      return (
        <div className="ui two buttons">
          <Button
            basic
            color="green"
            onClick={() => this.handleOrderBook(bookedBook)}
            disabled={ordering.successfullyOrderedBooks[bookedBook._id]}
          >
            Выдать
          </Button>
          <Button
            basic
            color="red"
            onClick={() =>
              this.setState({
                rejecting: {
                  ...rejecting,
                  rejectingInProgress: {
                    ...rejecting.rejectingInProgress,
                    [bookedBook._id]: true
                  }
                }
              })
            }
            disabled={ordering.successfullyOrderedBooks[bookedBook._id]}
          >
            Отказать
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
            {resultsFor === ENUMresultsFor.all
              ? "Забронированные книги отсутствуют"
              : `Забронированные книги для билета № ${
                  emptyResults.readerId
                }${" "}
            отсутствуют`}
          </Message.Header>
        </Message>
      );
    }
    return false;
  }

  renderDimmer(bookedBook) {
    const { actionWithReservationInProgress, ordering, rejecting } = this.state;

    return (
      <Dimmer
        active={
          actionWithReservationInProgress[bookedBook._id] ||
          ordering.successfullyOrderedBooks[bookedBook._id] ||
          rejecting.successfullyRejected[bookedBook._id]
        }
      >
        {actionWithReservationInProgress[bookedBook._id] && (
          <Loader>Выполняется</Loader>
        )}
        {ordering.successfullyOrderedBooks[bookedBook._id] && (
          <>
            <Header as="h5" icon inverted>
              <Icon name="check" />
              Книга добавлена в выданные
            </Header>
          </>
        )}
        {rejecting.successfullyRejected[bookedBook._id] && (
          <>
            <Header as="h5" icon inverted>
              <Icon name="close" />В выдаче книги отказано
            </Header>
          </>
        )}
      </Dimmer>
    );
  }

  render() {
    const {
      readerId,
      books,
      isDataLoading,
      emptyResults,
      rejecting,
      resultsFor,
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
                  <Accordion key={key}>
                    <Accordion.Title
                      active={activeOpenedSpoiler === key}
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
                            <Card key={orderedBook._id}>
                              {this.renderDimmer(orderedBook)}
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
                                  {util.convertDate(orderedBook.createdAt)}
                                </Card.Meta>
                                <Card.Description>
                                  Бронь на имя: {user.userName} <br />
                                </Card.Description>
                                <Card.Description>
                                  Чит. билет №: {orderedBook.readerId} <br />
                                </Card.Description>
                              </Card.Content>
                              <Card.Content
                                extra
                                className={
                                  rejecting.rejectingInProgress[orderedBook._id]
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
