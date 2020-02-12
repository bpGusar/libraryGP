import React from "react";
import { Link } from "react-router-dom";
import { Card, Image } from "semantic-ui-react";
import { branch } from "baobab-react/higher-order";
import InfiniteScroll from "react-infinite-scroll-component";

import CustomLoader from "@views/Common/Loader";

import { PARAMS } from "@store";

import axs from "@axios";

class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      books: [],
      queryOptions: {
        fetch_type: 1,
        displayMode: props.settings.showHiddenBooksOnMainPage.toString(),
        limit: 15,
        page: 1
      },
      maxElements: 0
    };
  }

  componentDidMount() {
    this.getBooks();
  }

  // TODO: переделать главную
  getBooks(loadNextPage) {
    const { queryOptions } = this.state;

    axs
      .get("/books", {
        params: {
          options: {
            ...queryOptions,
            page: loadNextPage ? queryOptions.page + 1 : queryOptions.page
          }
        }
      })
      .then(resp => {
        if (!resp.data.error) {
          this.setState(ps => ({
            isLoaded: true,
            books: [...ps.books, ...resp.data.payload],
            maxElements: Number(resp.headers["max-elements"])
          }));
        } else {
          this.setState({
            isLoaded: true
          });
        }
      });
  }

  render() {
    const { books, isLoaded, maxElements } = this.state;

    return (
      <>
        {!isLoaded ? (
          <CustomLoader />
        ) : (
          <InfiniteScroll
            dataLength={books.length}
            next={() => this.getBooks(true)}
            hasMore={books.length < maxElements}
            loader={<CustomLoader />}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Конец кассовой ленты!</b>
              </p>
            }
            style={{
              overflow: "none"
            }}
          >
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
          </InfiniteScroll>
        )}
      </>
    );
  }
}

export default branch({ settings: PARAMS.SETTINGS }, MainPage);
