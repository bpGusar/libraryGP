import React, { Component } from "react";
import { Segment, Header, List, Image, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";

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

  render() {
    const { books, isLoading } = this.state;
    const { label, type } = this.props;

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
                  <List.Item key={book._id}>
                    <Image avatar src={bookInfo.imageLinks.poster} />
                    <List.Content>
                      <List.Header as={Link} to={`/book/${bookId._id}`}>
                        {bookInfo.title}
                      </List.Header>
                      <List.Description as={Link} to={`/book/${bookId._id}`}>
                        {type === "ordered" && (
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
                        {type === "booked" && (
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
