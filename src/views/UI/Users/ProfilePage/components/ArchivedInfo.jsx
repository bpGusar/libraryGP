import React, { Component } from "react";
import {
  Segment,
  List,
  Image,
  Divider,
  Header,
  Label
} from "semantic-ui-react";
import { DateTime } from "luxon";
import _ from "lodash";

import Pagination from "./Pagination";

import axs from "@axios";

export default class ArchivedInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      archivedBooks: [],
      options: {
        fetch_type: 1,
        sort: "desc",
        limit: 5,
        page: 1
      },
      maxElements: 0
    };
  }

  componentDidMount() {
    const { url } = this.props;
    this.handleGetBookedOrderedBooksInfo(url);
  }

  handleOnPageChange = data => {
    const { options } = this.state;
    const { url } = this.props;

    this.setState(
      {
        options: {
          ...options,
          page: data.activePage
        }
      },
      () => this.handleGetBookedOrderedBooksInfo(url)
    );
  };

  handleGetBookedOrderedBooksInfo(url) {
    const { options } = this.state;

    this.setState({
      isLoading: true
    });

    axs
      .get(url, {
        params: {
          options
        }
      })
      .then(resp => {
        this.setState({
          isLoading: false,
          archivedBooks: resp.data.error ? [] : resp.data.payload,
          maxElements: resp.headers["max-elements"]
        });
      });
  }

  render() {
    const { isLoading, archivedBooks, maxElements, options } = this.state;
    const { dataObjPropName, componentType } = this.props;
    const isRejected = archivedBook => archivedBook.status === "rejected";
    const isOrdered = archivedBook => archivedBook.status === "ordered";
    const isCanceled = archivedBook => archivedBook.status === "canceled";

    return (
      <>
        <Header as="h3" attached="top">
          Всего:
          {<Label>{maxElements}</Label>}
        </Header>
        <Segment loading={isLoading} attached>
          {archivedBooks.length !== 0 && (
            <>
              <List divided relaxed>
                {archivedBooks.map(archivedBook => {
                  const bookInfoProp = archivedBook[dataObjPropName];
                  if (
                    _.isNull(bookInfoProp.bookId) ||
                    _.isNull(bookInfoProp.userId)
                  )
                    return;
                  const {
                    bookId: { bookInfo }
                  } = bookInfoProp;

                  return (
                    <List.Item key={archivedBook._id}>
                      <Image avatar src={bookInfo.imageLinks.poster} />
                      <List.Content>
                        <List.Header>
                          {bookInfo.title}{" "}
                          {componentType === "booked" &&
                            isRejected(archivedBook) && (
                              <Label color="red">Отказ</Label>
                            )}
                          {componentType === "booked" &&
                            isOrdered(archivedBook) && (
                              <Label color="green">Выдана</Label>
                            )}
                          {componentType === "booked" &&
                            isCanceled(archivedBook) && (
                              <Label color="grey">Отмена</Label>
                            )}
                        </List.Header>
                        <List.Description>
                          {componentType === "ordered" && (
                            <>
                              <p>
                                Дата выдачи:{" "}
                                <b>
                                  {DateTime.fromISO(bookInfoProp.orderedAt)
                                    .setLocale("ru")
                                    .toFormat("dd MMMM yyyy")}
                                </b>
                                <br />
                                Дата возврата:{" "}
                                <b>
                                  {DateTime.fromISO(archivedBook.createdAt)
                                    .setLocale("ru")
                                    .toFormat("dd MMMM yyyy")}
                                </b>
                              </p>
                            </>
                          )}
                          {componentType === "booked" && (
                            <>
                              {isRejected && (
                                <p>Причина отказа: {archivedBook.comment}</p>
                              )}
                              <p>
                                Дата создания брони:{" "}
                                <b>
                                  {DateTime.fromISO(bookInfoProp.createdAt)
                                    .setLocale("ru")
                                    .toFormat("dd MMMM yyyy")}
                                </b>
                                <br />
                                Дата перемещения в архив:{" "}
                                <b>
                                  {DateTime.fromISO(archivedBook.createdAt)
                                    .setLocale("ru")
                                    .toFormat("dd MMMM yyyy")}
                                </b>
                              </p>
                            </>
                          )}
                        </List.Description>
                      </List.Content>
                    </List.Item>
                  );
                })}
              </List>
              {Number(maxElements) > options.limit && (
                <>
                  <Divider />
                  <Pagination
                    options={options}
                    maxElements={maxElements}
                    handleOnPageChange={this.handleOnPageChange}
                  />
                </>
              )}
            </>
          )}
          {archivedBooks.length === 0 && "Данные отсутствуют"}
        </Segment>
      </>
    );
  }
}
