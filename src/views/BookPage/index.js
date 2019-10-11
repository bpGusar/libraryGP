/* eslint-disable react/prefer-stateless-function */
import React from "react";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";

import { Segment, List } from "semantic-ui-react";

import axs from "@axios";

import { PARAMS } from "@store";
import { storeData } from "@act";

import s from "./index.module.scss";

class BookPage extends React.Component {
  componentDidMount() {
    const { match, history, dispatch } = this.props;

    axs
      .get("/books/get", {
        params: { howMuch: "one", id: match.params.id, getFullBookInfo: true }
      })
      .then(resp => {
        if (!resp.data.error) {
          dispatch(storeData, PARAMS.BOOK, ...resp.data.payload);
        } else {
          dispatch(storeData, PARAMS.INFO_PAGE, {
            text: resp.data.message,
            type: "error"
          });

          history.push("/infoPage");
        }
      });
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
                  {book.bookInfo.publisher.map(el => el.publisherName)}
                </List.Content>
              </List.Item>

              <List.Item>
                <List.Content>
                  <List.Header className={s.listHeader}>
                    <List.Icon name="language" />
                    Язык
                  </List.Header>
                  {book.bookInfo.language.map(el => el.languageName)}
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
