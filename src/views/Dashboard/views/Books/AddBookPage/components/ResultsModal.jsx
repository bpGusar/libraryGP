import React, { Component } from "react";
import { Button, Header, Icon, Modal, List, Divider } from "semantic-ui-react";
import _ from "lodash";
import { branch } from "baobab-react/higher-order";

import { PARAMS } from "@store";
import { storeData } from "@act";

import axs from "@axios";

const dataEnums = {
  authors: {
    name: "Автор",
    dbName: "authorName"
  },
  categories: {
    name: "Категория",
    dbName: "categoryName"
  },
  publisher: {
    name: "Издатель",
    dbName: "publisherName"
  },
  language: {
    name: "Язык",
    dbName: "languageName"
  }
};

class ResultsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: {},
      someLoading: false
    };
  }

  handleAddNewInfoInDB(url, body, uniqId, setTo) {
    const { isLoading } = this.state;
    const { bookToDB, dispatch } = this.props;
    const clonedBookToDB = _.cloneDeep(bookToDB);

    this.setState({
      isLoading: {
        ...isLoading,
        [uniqId]: "progress"
      },
      someLoading: true
    });

    axs.post(url, body).then(resp => {
      if (!resp.data.error) {
        this.setState(
          {
            isLoading: {
              ...isLoading,
              [uniqId]: "done"
            },
            someLoading: false
          },
          () => {
            _.set(clonedBookToDB.book, `bookInfo[${setTo}]`, [
              ...clonedBookToDB.book.bookInfo[setTo],
              resp.data.payload._id
            ]);

            dispatch(storeData, PARAMS.BOOK_TO_DB, clonedBookToDB);
          }
        );
      }
    });
  }

  render() {
    const { modalOpen, dbResp, _this, history } = this.props;
    const { isLoading, someLoading } = this.state;
    return (
      <Modal
        open={modalOpen}
        onClose={() =>
          _this.setState({
            modalOpen: false
          })
        }
        size="small"
      >
        <Header
          icon="browser"
          content="Следующие данные отсутствуют в базе данных"
        />
        <Modal.Content>
          <small>
            Некоторые данные могут уже присутствовать в базе данных, но иметь
            другое написание.
            <br />
            Будьте внимательны при добавлении новых данных, иногда они могут не
            отражать суть тех данных, которые хотелось бы видеть в описании
            книги!
          </small>
          <Divider />
        </Modal.Content>
        {dbResp.map(el => {
          if (el.notFound.length !== 0) {
            return (
              <Modal.Content key={dataEnums[el.propName].name}>
                <h3>{dataEnums[el.propName].name}</h3>
                {el.notFound.map((nfEl, i) => {
                  return (
                    <List divided verticalAlign="middle" key={nfEl}>
                      <List.Item>
                        <List.Content floated="right">
                          <Button
                            disabled={
                              isLoading[`${nfEl}${i}`] === "done" || someLoading
                            }
                            loading={isLoading[`${nfEl}${i}`] === "progress"}
                            onClick={() =>
                              this.handleAddNewInfoInDB(
                                el.postUrl,
                                {
                                  [dataEnums[el.propName].dbName]: nfEl
                                },
                                `${nfEl}${i}`,
                                el.propName
                              )
                            }
                            primary
                          >
                            {isLoading[`${nfEl}${i}`] === "done" && (
                              <Icon name="checkmark" />
                            )}
                            Добавить в базу
                          </Button>
                        </List.Content>
                        <List.Content>{nfEl}</List.Content>
                      </List.Item>
                    </List>
                  );
                })}
              </Modal.Content>
            );
          }
        })}

        <Modal.Actions>
          <Button
            color="green"
            onClick={() => history.push("/dashboard/books/new")}
            inverted
          >
            <Icon name="checkmark" /> Продолжить
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default branch(
  {
    bookToDB: PARAMS.BOOK_TO_DB
  },
  ResultsModal
);
