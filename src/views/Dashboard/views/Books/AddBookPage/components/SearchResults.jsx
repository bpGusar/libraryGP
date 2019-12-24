/* eslint-disable react/destructuring-assignment */
import React from "react";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";
import {
  Button,
  Icon,
  Item,
  Label,
  Segment,
  Header,
  Dimmer,
  Loader
} from "semantic-ui-react";
import { DateTime } from "luxon";

import ResultsModal from "./ResultsModal";

import { PARAMS } from "@store";
import { storeData } from "@act";

import axs from "@axios";

class SearchResults extends React.Component {
  static handleFindInfoInDB(url, data, stateProp, postUrl) {
    let results = {
      postUrl,
      propName: stateProp,
      found: [],
      notFound: []
    };

    const promises = [];
    data.forEach(el =>
      promises.push(
        axs.get(`${url}${el}`).then(resp => {
          if (!resp.data.error) {
            results = {
              ...results,
              found: !_.isEmpty(resp.data.payload)
                ? [...results.found, ...resp.data.payload]
                : results.found,
              notFound: _.isEmpty(resp.data.payload)
                ? [...results.notFound, el]
                : results.notFound
            };
          }
        })
      )
    );

    return new Promise(resolve =>
      Promise.all(promises).then(() => resolve(results))
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      dbResp: [],
      modalOpen: false
    };
  }

  addBookToStore(book) {
    const { bookToDB, dispatch, history } = this.props;
    const clonedBookToDB = _.cloneDeep(bookToDB);

    this.setState({
      isLoading: true
    });

    _.set(clonedBookToDB, "flag", "google");

    _.set(clonedBookToDB.book, "bookInfo.title", book.volumeInfo.title);

    const date = DateTime.fromISO(book.volumeInfo.publishedDate).setLocale(
      "ru"
    );
    _.set(
      clonedBookToDB.book,
      "bookInfo.publishedDate",
      date.toFormat("dd-MM-yyyy")
    );

    _.set(
      clonedBookToDB.book,
      "bookInfo.description",
      _.has(book.volumeInfo, "description") ? book.volumeInfo.description : ""
    );

    _.set(
      clonedBookToDB.book,
      "bookInfo.maturityRating",
      _.has(book.volumeInfo, "maturityRating")
        ? book.volumeInfo.maturityRating
        : ""
    );

    if (_.has(book.volumeInfo, "industryIdentifiers")) {
      clonedBookToDB.book.bookInfo.industryIdentifiers.forEach(el => {
        const findedIden = book.volumeInfo.industryIdentifiers.find(
          fEl => fEl.type === el.type
        );
        const parEl = el;
        if (findedIden) {
          parEl.identifier = findedIden.identifier;
        }
      });
    }

    _.set(
      clonedBookToDB.book,
      "bookInfo.imageLinks.poster",
      _.has(book.volumeInfo, "imageLinks")
        ? book.volumeInfo.imageLinks.thumbnail
        : ""
    );

    const promises = [];

    const generatePromiseArr = dataList => {
      dataList.forEach(el => {
        if (
          _.has(book.volumeInfo, el.name) &&
          !_.isEmpty(book.volumeInfo[el.name])
        ) {
          promises.push(
            SearchResults.handleFindInfoInDB(
              el.url,
              _.isArray(book.volumeInfo[el.name])
                ? book.volumeInfo[el.name]
                : [book.volumeInfo[el.name]],
              el.name,
              el.postUrl
            )
          );
        }
      });
    };

    generatePromiseArr([
      {
        url: "/book-authors/byname/",
        name: "authors",
        postUrl: "/book-authors"
      },
      {
        url: "/book-categories/byname/",
        name: "categories",
        postUrl: "/book-categories"
      },
      {
        url: "/book-publishers/byname/",
        name: "publisher",
        postUrl: "/book-publishers"
      },
      {
        url: "/book-languages/bycode/",
        name: "language",
        postUrl: "/book-languages"
      }
    ]);

    Promise.all(promises).then(res => {
      let modalOpen = false;

      res.map(resEl =>
        _.set(
          clonedBookToDB.book,
          `bookInfo[${resEl.propName}]`,
          !_.isEmpty(resEl.found) ? resEl.found.map(el => el._id) : []
        )
      );
      dispatch(storeData, PARAMS.BOOK_TO_DB, clonedBookToDB);

      this.setState(
        () => {
          if (res.find(resEl => !_.isEmpty(resEl.notFound))) {
            modalOpen = true;
          }

          return {
            dbResp: res,
            isLoading: false,
            modalOpen
          };
        },
        () => {
          if (!modalOpen) {
            history.push("/dashboard/books/new");
          }
        }
      );
    });
  }

  render() {
    const { results, history } = this.props;
    const { isLoading, dbResp, modalOpen } = this.state;
    return (
      <>
        {results.totalItems !== 0 ? (
          <>
            <Dimmer.Dimmable as={Segment} dimmed={isLoading}>
              <Dimmer active={isLoading} verticalAlign="top">
                <Loader
                  style={{
                    position: "relative",
                    top: 100
                  }}
                >
                  Загрузка
                </Loader>
              </Dimmer>
              <Item.Group divided>
                {results.items.map(resultItem => (
                  <Item key={resultItem.id}>
                    <Item.Image
                      src={
                        _.has(resultItem.volumeInfo, "imageLinks")
                          ? resultItem.volumeInfo.imageLinks.thumbnail
                          : "https://react.semantic-ui.com/images/wireframe/image.png"
                      }
                    />

                    <Item.Content>
                      <Item.Header>{resultItem.volumeInfo.title}</Item.Header>
                      <Item.Meta>
                        <span className="cinema">
                          {[
                            resultItem.volumeInfo.publisher,
                            resultItem.volumeInfo.publishedDate
                          ].join(" | ")}
                        </span>
                      </Item.Meta>
                      <Item.Description>
                        {resultItem.volumeInfo.description}
                      </Item.Description>
                      <Item.Extra>
                        <Button
                          primary
                          floated="right"
                          onClick={() => this.addBookToStore(resultItem)}
                        >
                          Открыть в редакторе
                          <Icon name="right chevron" />
                        </Button>
                        {_.has(resultItem.volumeInfo, "authors") &&
                          resultItem.volumeInfo.authors.map(author => {
                            return (
                              <Label
                                icon="pencil alternate"
                                content={author}
                                key={author}
                              />
                            );
                          })}
                      </Item.Extra>
                    </Item.Content>
                  </Item>
                ))}
              </Item.Group>
            </Dimmer.Dimmable>
            <ResultsModal
              modalOpen={modalOpen}
              dbResp={dbResp}
              onModalClose={() =>
                this.setState({
                  modalOpen: false
                })
              }
              history={history}
            />
          </>
        ) : (
          <Segment placeholder>
            <Header icon>
              <Icon name="search" color="blue" />
              Поиск не дал результатов.
            </Header>
          </Segment>
        )}
      </>
    );
  }
}

export default branch(
  {
    bookToDB: PARAMS.BOOK_TO_DB,
    user: PARAMS.USER_INFO
  },
  SearchResults
);
