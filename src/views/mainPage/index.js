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
        promises.push(
          axs
            .get("/authors/get", {
              params: {
                howMuch: "all"
              }
            })
            .then(authorsResp => {
              booksArr.map(book => {
                const authorsObjs = [];
                book.bookInfo.authors.map(bookAuthor => {
                  authorsObjs.push(
                    authorsResp.data.payload.find(
                      authorObj => authorObj._id === bookAuthor
                    )
                  );
                  book.bookInfo.authors = authorsObjs;
                });
              });
            })
        );

        Promise.all(promises).finally(() => {
          this.setState({
            isLoaded: true,
            books: [...booksArr]
          });
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
          <Card.Group itemsPerRow={4}>
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
                      {book.bookInfo.authors.map(el => `${el.authorName}, `)}
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
