import React from "react";
import { Link } from "react-router-dom";
import { Button, Divider, Card, Image } from "semantic-ui-react";

import axs from "@axios";

export default class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      books: []
    };
  }

  componentDidMount() {
    this.getBooks();
  }

  getBooks() {
    const promises = [];
    let booksArr = [];
    axs
      .get("/books/get", { params: { howMuch: "all" } })
      .then(resp => {
        if (!resp.data.error) {
          booksArr = resp.data.payload;
        }
      })
      .then(() => {
        booksArr.map((book, i) => {
          promises.push(
            axs
              .get("/authors/get", {
                params: {
                  howMuch: "some",
                  authorsArr: {
                    _id: {
                      $in: book.bookInfo.authors
                    }
                  }
                }
              })
              .then(authorsResp => {
                book.bookInfo.authors = authorsResp.data.payload;
              })
          );

          promises.push(
            axs
              .get("/bookLanguages/get", {
                params: {
                  howMuch: "some",
                  authorsArr: {
                    _id: {
                      $in: book.bookInfo.categories
                    }
                  }
                }
              })
              .then(authorsResp => {
                book.bookInfo.categories = authorsResp.data.payload;
              })
          );

          // доделать загрузки по остальным айдишникам

          if (booksArr.length - 1 === i) {
            Promise.all(promises).finally(() => {
              this.setState({
                isLoaded: true,
                books: [...booksArr]
              });
            });
          }
        });
      });
  }

  render() {
    const { books, isLoaded } = this.state;
    return (
      <div>
        <Button as={Link} to="/findBook" color="blue">
          Добавить книгу
        </Button>
        <Divider />
        {isLoaded && (
          <Card.Group>
            {books.map(book => (
              <Card>
                <Image
                  src={book.bookInfo.imageLinks.poster}
                  wrapped
                  ui={false}
                />
                <Card.Content>
                  <Card.Header>{book.bookInfo.title}</Card.Header>
                  <Card.Meta>
                    <span className="date">
                      {book.bookInfo.authors.map(el => el.authorName)}
                    </span>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        )}
      </div>
    );
  }
}
