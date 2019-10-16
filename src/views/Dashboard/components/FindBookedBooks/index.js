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

import axs from "@axios";
import * as util from "@utils";
import MSG from "@msg";

export default class FindBookedBooks extends Component {
  constructor(props) {
    super(props);

    this.handleSubmitForm = this.handleSubmitForm.bind(this);

    this.state = {
      readerId: "",
      books: [],
      isDataLoading: false,
      emptyResults: { empty: false, readerId: "" },
      orderedBooks: {},
      orderingInProgress: {}
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
    const { orderingInProgress, orderedBooks } = this.state;

    this.setState({
      orderingInProgress: {
        ...orderingInProgress,
        [bookedBook._id]: true
      }
    });
    // TODO: сделать кнопку отказать
    axs
      .post("/orderedBooks/add", {
        bookId: bookedBook.bookId._id,
        userId: bookedBook.userId._id,
        readerId: bookedBook.readerId
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            orderedBooks: {
              ...orderedBooks,
              [bookedBook._id]: true
            },
            orderingInProgress: {
              ...orderingInProgress,
              [bookedBook._id]: false
            }
          });
        } else {
          toast(MSG.toastClassicError(resp.data.message));
        }
      });
  }

  // eslint-disable-next-line class-methods-use-this
  handleRejectOrdering(bookedBook) {
    console.log(bookedBook);
    axs
      .post("/ordersArchive/add", {
        orderType: "booking",
        orderDetails: {
          orderInfo: {
            ...bookedBook,
            orderedAt: bookedBook.createdAt
          }
        }
      })
      .then(resp => {
        if (!resp.data.error) {
          console.log("object");
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
      orderedBooks,
      orderingInProgress
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
                          orderingInProgress[bookedBook._id] ||
                          orderedBooks[bookedBook._id]
                        }
                        inverted={!orderedBooks[bookedBook._id]}
                      >
                        {orderingInProgress[bookedBook._id] && (
                          <Loader>Выполняется</Loader>
                        )}
                        {orderedBooks[bookedBook._id] && (
                          <>
                            <Header as="h5" icon inverted>
                              <Icon name="check" />
                              Книга добавлена в выданные
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
                          Бронировал: {user.lastName} {user.firstName}{" "}
                          {user.patronymic} <br />
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <div className="ui two buttons">
                          <Button
                            basic
                            color="green"
                            onClick={() => this.handleOrderBook(bookedBook)}
                            disabled={orderedBooks[bookedBook._id]}
                          >
                            Выдать
                          </Button>
                          <Button
                            basic
                            color="red"
                            onClick={() =>
                              this.handleRejectOrdering(bookedBook)
                            }
                            disabled={orderedBooks[bookedBook._id]}
                          >
                            Отказать
                          </Button>
                        </div>
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
