import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Segment,
  Form,
  Header,
  Divider,
  Card,
  Image
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
      isDataLoading: false
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
            isDataLoading: false
          });
        } else {
          toast(MSG.toastClassicError(resp.data.message));
        }
      });
  }

  // eslint-disable-next-line class-methods-use-this
  handleOrderBook(bookedBook) {
    this.setState({
      isDataLoading: true
    });
    // TODO: сделать вывод сообщения об успешной выдаче книги
    // TODO: сделать вывод сообщения на странице книги что книга уже у чела на руках
    axs
      .post("/orderedBooks/add", {
        bookId: bookedBook.bookId._id,
        userId: bookedBook.userId._id,
        readerId: bookedBook.readerId
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            isDataLoading: false
          });
        } else {
          toast(MSG.toastClassicError(resp.data.message));
        }
      });
  }

  // TODO: сделать ссылку на профиль пользователя

  render() {
    const { readerId, books, isDataLoading } = this.state;

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
                    <Card>
                      <Card.Content>
                        <Image
                          floated="right"
                          size="mini"
                          src={bookedBookInfo.bookInfo.imageLinks.poster}
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
                          >
                            Выдать
                          </Button>
                          <Button basic color="red">
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
        </Segment>
      </>
    );
  }
}
