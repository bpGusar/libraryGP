/* eslint-disable react/prefer-stateless-function */
import React from "react";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";

import { Segment, List } from "semantic-ui-react";

import SearchQueryLink from "@commonViews/SearchQueryLink";

import axs from "@axios";

import { PARAMS } from "@store";
import { storeData } from "@act";

import s from "./index.module.scss";

class BookPage extends React.Component {
  componentDidMount() {
    const { match, history, dispatch, book } = this.props;

    axs
      .get(`/books/${match.params.id}`, {
        params: {
          options: { fetch_type: 1 }
        }
      })
      .then(resp => {
        if (!resp.data.error) {
          if (!_.isEqual(book, resp.data.payload[0])) {
            dispatch(storeData, PARAMS.BOOK, ...resp.data.payload);
          }
        } else {
          dispatch(storeData, PARAMS.INFO_PAGE, {
            text: resp.data.message,
            type: "error"
          });

          history.push("/info-page");
        }
      });
  }

  shouldComponentUpdate(nextProps) {
    const { book } = this.props;
    if (!_.isEqual(book, nextProps.book)) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(storeData, PARAMS.BOOK, {});
  }

  render() {
    const { book } = this.props;
    return (
      <>
        {!_.isEmpty(book) && (
          <Segment>
            <List divided relaxed>
              <List.Item>
                <List.Content>
                  <List.Header className={s.listHeader}>
                    <List.Icon name="copyright" />
                    Издатель
                  </List.Header>
                  {book.bookInfo.publisher.map((el, i) => (
                    <>
                      <SearchQueryLink
                        key={el._id}
                        className={s.queryLink}
                        text={el.publisherName}
                        url="/search"
                        param="bookInfo.publisher"
                        value={el._id}
                      />
                      {book.bookInfo.publisher.length - 1 !== i && " • "}
                    </>
                  ))}
                </List.Content>
              </List.Item>

              <List.Item>
                <List.Content>
                  <List.Header className={s.listHeader}>
                    <List.Icon name="language" />
                    Язык
                  </List.Header>
                  {book.bookInfo.language.map((el, i) => (
                    <>
                      <SearchQueryLink
                        key={el._id}
                        className={s.queryLink}
                        text={el.languageName}
                        url="/search"
                        param="bookInfo.language"
                        value={el._id}
                      />
                      {book.bookInfo.language.length - 1 !== i && " • "}
                    </>
                  ))}
                </List.Content>
              </List.Item>

              <List.Item>
                <List.Content>
                  <List.Header className={s.listHeader}>
                    <List.Icon name="barcode" />
                    ISBN 13
                  </List.Header>
                  {book.bookInfo.industryIdentifiers[0].identifier}
                </List.Content>
              </List.Item>

              <List.Item>
                <List.Content>
                  <List.Header className={s.listHeader}>
                    <List.Icon name="barcode" />
                    ISBN 10
                  </List.Header>
                  {book.bookInfo.industryIdentifiers[1].identifier}
                </List.Content>
              </List.Item>

              <List.Item>
                <List.Content>
                  <List.Header className={s.listHeader}>
                    <List.Icon name="book" />
                    Страниц в книге
                  </List.Header>
                  {book.bookInfo.pageCount}
                </List.Content>
              </List.Item>

              <List.Item>
                <List.Content>
                  <List.Header className={s.listHeader}>
                    <List.Icon name="square full" />
                    Возрастной рейтинг
                  </List.Header>
                  {book.bookInfo.maturityRating}
                </List.Content>
              </List.Item>
            </List>
          </Segment>
        )}
      </>
    );
  }
}

export default branch({ book: PARAMS.BOOK }, BookPage);
