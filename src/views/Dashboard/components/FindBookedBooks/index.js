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
  Icon
} from "semantic-ui-react";
import { toast } from "react-semantic-toasts";
import _ from "lodash";

import axs from "@axios";
import * as util from "@utils";
import MSG from "@msg";

import s from "./index.module.scss";

export default class FindBookedBooks extends Component {
  constructor(props) {
    super(props);

    this.handleSubmitForm = this.handleSubmitForm.bind(this);

    this.state = {
      readerId: "",
      books: [],
      isDataLoading: false,
      emptyResults: { empty: false, readerId: "" },
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

  handleSubmitForm() {
    const { readerId } = this.state;

    this.setState({
      books: [],
      isDataLoading: true
    });

    axs
      .get("/bookedBooks/get", {
        params: {
          getQuery: {
            readerId
          }
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
      .post("/orderedBooks/add", {
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
      .post("/bookedBooksArchive/rejectOrdering", {
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

  // TODO: сделать ссылку на профиль пользователя

  render() {
    const {
      readerId,
      books,
      isDataLoading,
      emptyResults,
      ordering,
      rejecting,
      actionWithReservationInProgress
    } = this.state;

    return (
      <>
        <Header as="h3" attached="top">
          Найти забронированные книги
        </Header>
        <Segment attached loading={isDataLoading}>
          <Form onSubmit={this.handleSubmitForm}>
            <Form.Group widths="equal">
              <Form.Input
                defaultValue={readerId}
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
          </Form>
          {books.length !== 0 && (
            <>
              <Divider />
              <Card.Group>
                {books.map(bookedBook => {
                  const { bookId: bookedBookInfo, userId: user } = bookedBook;

                  return (
                    <Card key={bookedBook._id}>
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
                      <Card.Content>
                        <Image
                          floated="right"
                          size="mini"
                          src={bookedBookInfo.bookInfo.imageLinks.poster}
                          as={Link}
                          to={`/book-${bookedBookInfo._id}`}
                        />
                        <Card.Header
                          as={Link}
                          to={`/book-${bookedBookInfo._id}`}
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
                      </Card.Content>
                      <Card.Content
                        extra
                        className={
                          rejecting.rejectingInProgress[bookedBook._id]
                            ? s.rejectBlock
                            : ""
                        }
                      >
                        {rejecting.rejectingInProgress[bookedBook._id] && (
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
                                onClick={() =>
                                  this.handleRejectOrdering(bookedBook)
                                }
                                // disabled={
                                //   ordering.successfullyOrderedBooks[
                                //     bookedBook._id
                                //   ]
                                // }
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
                                // disabled={
                                //   ordering.successfullyOrderedBooks[
                                //     bookedBook._id
                                //   ]
                                // }
                              >
                                Отмена
                              </Button>
                            </div>
                          </>
                        )}

                        {!rejecting.rejectingInProgress[bookedBook._id] && (
                          <div className="ui two buttons">
                            <Button
                              basic
                              color="green"
                              onClick={() => this.handleOrderBook(bookedBook)}
                              disabled={
                                ordering.successfullyOrderedBooks[
                                  bookedBook._id
                                ]
                              }
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
                              disabled={
                                ordering.successfullyOrderedBooks[
                                  bookedBook._id
                                ]
                              }
                            >
                              Отказать
                            </Button>
                          </div>
                        )}
                      </Card.Content>
                    </Card>
                  );
                })}
              </Card.Group>
            </>
          )}
          {emptyResults.empty && (
            <Message info>
              <Message.Header>
                Забронированные книги для билета № {emptyResults.readerId}{" "}
                отсутствуют
              </Message.Header>
            </Message>
          )}
        </Segment>
      </>
    );
  }
}
