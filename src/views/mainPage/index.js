import React from "react";
import { Link } from "react-router-dom";
import { Card, Image } from "semantic-ui-react";

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
    axs
      .get("/books", {
        params: {
          fetch_type: 1
        }
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            isLoaded: true,
            books: [...resp.data.payload]
          });
        }
      });
  }

  render() {
    const { books, isLoaded } = this.state;

    return (
      <div>
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
