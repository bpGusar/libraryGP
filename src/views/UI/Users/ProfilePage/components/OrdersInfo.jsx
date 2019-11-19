/* eslint-disable class-methods-use-this */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";

import { Segment, Header, List, Image, Label, Button } from "semantic-ui-react";

import axs from "@axios";

/**
 * Компонент вывода информации по книгамв брони или на руках в зависимости от URL.
 *
 * @param {String} type Принимает значения `boooked` или `ordered`
 * @param {String} url Принимает URL для запроса
 * @param {String} label Принимает значения значение лейбла блока
 */
export default class OrdersInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isCancelingInPropgress: {},
      books: []
    };
  }

  componentDidMount() {
    const { url } = this.props;
    this.handleGetBookedOrderedBooksInfo(url);
  }

  handleGetBookedOrderedBooksInfo(url) {
    axs.get(url).then(resp => {
      this.setState({
        isLoading: false,
        books: resp.data.error ? [] : resp.data.payload
      });
    });
  }

  handleCancelReservation(bookedBook) {
    const { isCancelingInPropgress } = this.state;
    this.setState({
      isCancelingInPropgress: {
        ...isCancelingInPropgress,
        [bookedBook._id]: "loading"
      }
    });
    axs
      .post(`/booked-books/cancel-reservation`, {
        bookedBookInfo: {
          createdAt: bookedBook.createdAt,
          bookId: bookedBook.bookId._id,
          userId: bookedBook.userId._id
        },
        status: "canceled",
        comment: "Отмена по инициативе пользователя"
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            isCancelingInPropgress: {
              ...isCancelingInPropgress,
              [bookedBook._id]: "done"
            }
          });
        }
      });
  }

  render() {
    const { books, isLoading, isCancelingInPropgress } = this.state;
    const { label, type } = this.props;
    const isOrdered = type === "ordered";
    const isBooked = type === "booked";

    return (
      <>
        <Header as="h3" attached="top">
          {label}
          {books.length !== 0 && <Label>{books.length}</Label>}
        </Header>
        <Segment attached>
          {isLoading && "Загрузка..."}
          {books.length !== 0 && (
            <List divided relaxed>
              {books.map(book => {
                const {
                  bookId,
                  bookId: { bookInfo }
                } = book;
                return (
                  <List.Item
                    key={book._id}
                    disabled={isCancelingInPropgress[book._id] === "done"}
                    style={{
                      opacity:
                        isCancelingInPropgress[book._id] === "done" && 0.3
                    }}
                  >
                    <List.Content floated="right">
                      {isBooked && (
                        <Button
                          onClick={() => this.handleCancelReservation(book)}
                          content="Удалить"
                          icon="remove"
                          labelPosition="left"
                          secondary
                          disabled={isCancelingInPropgress[book._id] === "done"}
                          loading={
                            isCancelingInPropgress[book._id] === "loading"
                          }
                        />
                      )}
                    </List.Content>
                    <Image avatar src={bookInfo.imageLinks.poster} />
                    <List.Content>
                      <List.Header as={Link} to={`/book/${bookId._id}`}>
                        {bookInfo.title}
                      </List.Header>
                      <List.Description as={Link} to={`/book/${bookId._id}`}>
                        {isOrdered && (
                          <span>
                            {" "}
                            Книга на руках до:{" "}
                            <b>
                              {DateTime.fromISO(book.orderedUntil)
                                .setLocale("ru")
                                .toFormat("dd MMMM yyyy")}
                            </b>
                          </span>
                        )}
                        {isBooked && (
                          <span>
                            Книга забронирована до:{" "}
                            <b>
                              {DateTime.fromISO(book.createdAt)
                                .plus({
                                  days: 3
                                })
                                .setLocale("ru")
                                .toFormat("dd MMMM yyyy")}
                            </b>
                          </span>
                        )}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          )}
          {!isLoading && books.length === 0 && "Книги отсутствуют"}
        </Segment>
      </>
    );
  }
}
