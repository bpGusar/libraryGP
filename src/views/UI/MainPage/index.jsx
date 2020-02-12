import React from "react";
import { Link } from "react-router-dom";
import { Card, Image } from "semantic-ui-react";
import { branch } from "baobab-react/higher-order";

import CustomLoader from "@views/Common/Loader";

import { PARAMS } from "@store";

import axs from "@axios";

class MainPage extends React.Component {
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
    const { settings } = this.props;

    axs
      .get("/books", {
        params: {
          options: {
            fetch_type: 1,
            displayMode: settings.showHiddenBooksOnMainPage.toString()
          }
        }
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState({
            isLoaded: true,
            books: [...resp.data.payload]
          });
        } else {
          this.setState({
            isLoaded: true
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
          <Card.Group itemsPerRow={5}>
            {books.map(book => (
              <Card key={book._id}>
                <Image
                  as={Link}
                  to={`/book/${book._id}`}
                  src={book.bookInfo.imageLinks.poster}
                  wrapped
                  ui={false}
                />
                <Card.Content>
                  <Card.Header as={Link} to={`/book/${book._id}`}>
                    {book.bookInfo.title}
                  </Card.Header>
                  <Card.Meta>
                    <span className="date">
                      {book.bookInfo.authors
                        .map(el => el.authorName)
                        .join(", ")}
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

export default branch({ settings: PARAMS.SETTINGS }, MainPage);
