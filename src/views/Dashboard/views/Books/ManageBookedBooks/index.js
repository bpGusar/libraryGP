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

export default class ManageBookedBooks extends Component {
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
      actionWithReservationInProgress: {},
      ordering: {
        successfullyOrderedBooks: {}
      },
      rejecting: {
        rejectMsgs: {},
        successfullyRejected: {},
        rejectingInProgress: {}
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
      .get("/booked-books", {
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

  handleOrderBook(bookedBook) {
    const { ordering, actionWithReservationInProgress } = this.state;

    this.setState({
      actionWithReservationInProgress: {
        ...actionWithReservationInProgress,
        [bookedBook._id]: true
      }
    });

    axs
      .post("/ordered-books", {
        bookedBookInfo: {
          ...bookedBook
        },
        status: "ordered",
        comment: ""
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
            }
          });
        } else {
          toast(MSG.toastClassicError(resp.data.message));
        }
      });
  }

  handleRejectOrdering(bookedBook) {
    const { rejecting, actionWithReservationInProgress } = this.state;

    this.setState({
      actionWithReservationInProgress: {
        ...actionWithReservationInProgress,
        [bookedBook._id]: true
      }
    });

    axs
      .post(`/booked-books/reject-ordering`, {
        bookedBookInfo: {
          ...bookedBook
        },
        status: "rejected",
        comment: _.isUndefined(rejecting.rejectMsgs[`${bookedBook._id}-msg`])
          ? ""
          : rejecting.rejectMsgs[`${bookedBook._id}-msg`]
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            actionWithReservationInProgress: {
              ...actionWithReservationInProgress,
              [bookedBook._id]: false
            },
            rejecting: {
              ...rejecting,
              successfullyRejected: {
                ...rejecting.successfullyRejected,
                [bookedBook._id]: true
              }
            }
          });
        } else {
          toast(MSG.toastClassicError(resp.data.message));
        }
      });
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
              onClick={() => this.handleRejectOrdering(bookedBook)}
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
  }

  renderEmptyResultsBlock(emptyResults) {
    const { resultsFor } = this.state;

    if (emptyResults.empty) {
      return (
        <Message info>
          <Message.Header>
            {resultsFor === resultsForEnum.all
              ? "Забронированные книги отсутствуют"
              : `Забронированные книги для билета № ${
                  emptyResults.readerId
                }${" "}
            отсутствуют`}
          </Message.Header>
        </Message>
      );
    }
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

  // TODO: сделать ссылку на профиль пользователя

  render() {
    const {
      readerId,
      books,
      isDataLoading,
      emptyResults,
      rejecting,
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
                {books.map(bookedBook => {
                  const { bookId: bookedBookInfo, userId: user } = bookedBook;

                  return (
                    <Card key={bookedBook._id}>
                      {this.renderDimmer(bookedBook)}
                      <Card.Content>
                        <Image
                          floated="right"
                          size="mini"
                          src={bookedBookInfo.bookInfo.imageLinks.poster}
                          as={Link}
                          to={`/book/${bookedBookInfo._id}`}
                          target="blanc"
                        />
                        <Card.Header
                          as={Link}
                          to={`/book/${bookedBookInfo._id}`}
                          target="blanc"
                        >
                          {bookedBookInfo.bookInfo.title}
                        </Card.Header>
                        <Card.Meta>
                          Дата брони: {util.convertDate(bookedBook.createdAt)}
                        </Card.Meta>
                        <Card.Description>
                          Бронь на имя: {user.lastName} {user.firstName}{" "}
                          {user.patronymic} <br />
                        </Card.Description>
                        <Card.Description>
                          Чит. билет №: {bookedBook.readerId} <br />
                        </Card.Description>
                      </Card.Content>
                      <Card.Content
                        extra
                        className={
                          rejecting.rejectingInProgress[bookedBook._id]
                            ? s.rejectBlock
                            : ""
                        }
                      >
                        {this.renderRejectBlock(bookedBook)}
                        {this.renderOrderBlock(bookedBook)}
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
