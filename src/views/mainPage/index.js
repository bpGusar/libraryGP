import React from "react";
import { Link } from "react-router-dom";
import { Button, Divider, Card, Image } from "semantic-ui-react";

import CustomLoader from "@views/Loader";

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

  // TODO: переделать главную
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
        <Button as={Link} to="/dashboard/findBook" color="blue">
          Добавить книгу
        </Button>
        <Divider />
        {!isLoaded ? (
          <CustomLoader />
        ) : (
          <Card.Group itemsPerRow={4}>
            {books.map(book => (
              <Card key={book._id}>
                <Image
                  as={Link}
                  to={`/book-${book._id}`}
                  src={book.bookInfo.imageLinks.poster}
                  wrapped
                  ui={false}
                />
                <Card.Content>
                  <Card.Header as={Link} to={`/book-${book._id}`}>
                    {book.bookInfo.title}
                  </Card.Header>
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
