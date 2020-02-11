/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React from "react";
import { branch } from "baobab-react/higher-order";
import uniqid from "uniqid";
import _ from "lodash";
import { DateTime } from "luxon";
import { DateInput } from "semantic-ui-calendar-react";
import qStr from "query-string";

import { Form, Button, Message, Segment } from "semantic-ui-react";

import UniqueDropdown from "@views/Common/UniqueDropdown/";
import Poster from "./components/Poster/Poster";

import { PARAMS, getInitialState } from "@store";
import { storeData } from "@act";

import axs from "@axios";

import s from "./index.module.scss";

class AddBookForm extends React.Component {
  constructor(props) {
    super(props);
    const { location } = props;

    const query = qStr.parse(location.search);

    this.state = {
      isFormLoaded: true,
      msg: {
        error: false,
        msg: ""
      },
      isEdit: query.mode === "edit",
      editComment: ""
    };
  }

  componentDidMount() {
    const { bookToDB, dispatch, location } = this.props;
    const { isEdit } = this.state;
    const query = qStr.parse(location.search);
    if (!isEdit) {
      const bookClone = _.cloneDeep(bookToDB);
      const today = DateTime.local().toISODate();
      _.set(bookClone.book, "dateAdded", today);

      dispatch(storeData, PARAMS.BOOK_TO_DB, bookClone);
    } else {
      this.getBookForEdit(query);
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(
      storeData,
      PARAMS.BOOK_TO_DB,
      getInitialState()[PARAMS.BOOK_TO_DB]
    );
  }

  getBookForEdit(query) {
    const { dispatch, bookToDB } = this.props;
    this.setState({
      isFormLoaded: false
    });

    axs
      .get(`/books/${query.bookId}`, {
        params: {
          options: { fetch_type: 0 }
        }
      })
      .then(resp => {
        if (!resp.data.error) {
          const clonedResp = resp;
          delete clonedResp.data.payload[0].__v;

          this.setState(
            {
              isFormLoaded: true
            },
            () => {
              dispatch(storeData, PARAMS.BOOK_TO_DB, {
                ...bookToDB,
                flag: "edit",
                book: {
                  ...clonedResp.data.payload[0]
                }
              });
            }
          );
        } else {
          this.setState({
            isFormLoaded: true
          });
        }
      });
  }

  handleChangeISBN(e) {
    const { bookToDB, dispatch } = this.props;
    const bookClone = _.cloneDeep(bookToDB);
    const { industryIdentifiers } = bookClone.book.bookInfo;

    Object.keys(industryIdentifiers).find(key => {
      if (industryIdentifiers[key].type === e.name) {
        industryIdentifiers[key].identifier = e.value;
      }
    });

    dispatch(storeData, PARAMS.BOOK_TO_DB, bookClone);
  }

  handleChangeBookInfo(e) {
    const { bookToDB, dispatch } = this.props;
    const bookClone = _.cloneDeep(bookToDB);
    console.log(e.max);
    _.set(bookClone.book, e.name, e.value);

    dispatch(storeData, PARAMS.BOOK_TO_DB, bookClone);
  }

  handleSubmit() {
    const { bookToDB, history, dispatch } = this.props;
    const { msg, isEdit, editComment } = this.state;
    const clonedBookToDB = _.cloneDeep(bookToDB);

    this.setState({
      isFormLoaded: false,
      msg: {
        ...msg.msg,
        error: false
      }
    });

    if (isEdit) {
      clonedBookToDB.book.editInfo = [
        ...clonedBookToDB.book.editInfo,
        {
          comment: editComment
        }
      ];
    }

    axs({
      method: isEdit ? "put" : "post",
      url: "/books",
      data: { book: clonedBookToDB.book }
    }).then(resp => {
      if (!resp.data.error) {
        this.setState({
          isFormLoaded: true
        });
        dispatch(storeData, PARAMS.INFO_PAGE, {
          text: resp.data.message,
          type: "success"
        });
        dispatch(
          storeData,
          PARAMS.BOOK_TO_DB,
          getInitialState()[PARAMS.BOOK_TO_DB]
        );
        history.push("/dashboard/info-page");
      } else {
        this.setState({
          isFormLoaded: true,
          msg: {
            error: true,
            msg: resp.data.message
          }
        });
      }
    });
  }

  handleOnChangeDropdown(value, bookInfoObjectProperty) {
    const { dispatch, bookToDB } = this.props;
    const bookCloned = _.cloneDeep(bookToDB);

    bookCloned.book.bookInfo[bookInfoObjectProperty] = value;

    dispatch(storeData, PARAMS.BOOK_TO_DB, bookCloned);
  }

  render() {
    const { bookToDB } = this.props;
    const { isFormLoaded, msg, isEdit, editComment } = this.state;
    const { bookInfo } = bookToDB.book;

    return (
      <>
        {msg.error && (
          <Message negative>
            <Message.Header>{msg.msg}</Message.Header>
            <p>Проверьте введенные данные и попробуйте еще раз.</p>
          </Message>
        )}
        {isEdit && (
          <Message warning>
            <Message.Header>Редактирование книги</Message.Header>
          </Message>
        )}
        <Segment>
          <Form loading={!isFormLoaded} onSubmit={() => this.handleSubmit()}>
            <Poster />
            <Form.Group widths="equal">
              <Form.Input
                fluid
                required
                label="Название"
                name="bookInfo.title"
                onChange={e => this.handleChangeBookInfo(e.currentTarget)}
                defaultValue={bookInfo.title}
              />
              <DateInput
                name="bookInfo.publishedDate"
                label="Дата публикации"
                required
                animation="off"
                value={bookInfo.publishedDate}
                iconPosition="left"
                onChange={(e, { name, value }) =>
                  this.handleChangeBookInfo({ name, value })
                }
              />
            </Form.Group>
            <Form.Group widths="equal">
              <UniqueDropdown
                axsQuery={{ params: { options: { limit: 999 } } }}
                axiosGetLink="/book-authors"
                axiosPostLink="/book-authors"
                storeParam={PARAMS.AUTHORS}
                multiple
                required
                onChange={value =>
                  this.handleOnChangeDropdown(value, "authors")
                }
                label="Автор"
                getValueFromProperty="authorName"
                showAddNewField
                currentValue={bookInfo.authors}
              />
              <UniqueDropdown
                axsQuery={{ params: { options: { limit: 999 } } }}
                axiosGetLink="/book-publishers"
                axiosPostLink="/book-publishers"
                storeParam={PARAMS.PUBLISHERS}
                multiple
                required
                onChange={value =>
                  this.handleOnChangeDropdown(value, "publisher")
                }
                label="Издательство"
                getValueFromProperty="publisherName"
                showAddNewField
                currentValue={bookInfo.publisher}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <UniqueDropdown
                axsQuery={{ params: { options: { limit: 999 } } }}
                axiosGetLink="/book-categories"
                axiosPostLink="/book-categories"
                storeParam={PARAMS.CATEGORIES}
                multiple
                required
                onChange={value =>
                  this.handleOnChangeDropdown(value, "categories")
                }
                label="Категория"
                getValueFromProperty="categoryName"
                showAddNewField
                currentValue={bookInfo.categories}
              />
              <Form.Input
                fluid
                required
                label="Возрастной рейтинг"
                name="bookInfo.maturityRating"
                onChange={e => this.handleChangeBookInfo(e.currentTarget)}
                defaultValue={bookInfo.maturityRating}
              />
            </Form.Group>
            <Form.Group widths="equal">
              {bookInfo.industryIdentifiers.map(el => (
                <Form.Input
                  key={el.type}
                  fluid
                  required
                  label={el.type}
                  name={el.type}
                  onChange={e => this.handleChangeISBN(e.currentTarget)}
                  defaultValue={el.identifier}
                />
              ))}
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                required
                type="number"
                min={0}
                label="Количество страниц в книге"
                name="bookInfo.pageCount"
                onChange={e => this.handleChangeBookInfo(e.currentTarget)}
                defaultValue={bookInfo.pageCount}
              />
              <UniqueDropdown
                axsQuery={{ params: { options: { limit: 999 } } }}
                axiosGetLink="/book-languages"
                storeParam={PARAMS.LANGUAGES}
                axiosPostLink="/book-languages"
                multiple
                required
                onChange={value =>
                  this.handleOnChangeDropdown(value, "language")
                }
                label="Язык"
                getValueFromProperty="languageName"
                currentValue={bookInfo.language}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                required
                min={0}
                type="number"
                label="Максимальное количество экземпляров в библиотеке"
                name="stockInfo.maxAvailableBooks"
                onChange={e => this.handleChangeBookInfo(e.currentTarget)}
                defaultValue={bookToDB.book.stockInfo.maxAvailableBooks}
              />
              <Form.Field>
                <Form.Input
                  fluid
                  required
                  min={0}
                  type="number"
                  label="Количество экземпляров доступное для выдачи"
                  name="stockInfo.freeForBooking"
                  onChange={e => this.handleChangeBookInfo(e.currentTarget)}
                  max={bookToDB.book.stockInfo.maxAvailableBooks}
                  value={bookToDB.book.stockInfo.freeForBooking}
                />
                <p className={s.fieldSubText}>
                  Не может превышать значение в поле Максимальное количество
                  экземпляров в библиотеке
                </p>
              </Form.Field>
            </Form.Group>
            <Form.Field>
              <label htmlFor={uniqid(`description_`)}>
                Описание
                <textarea
                  id={uniqid(`description_`)}
                  required="required"
                  name="bookInfo.description"
                  onChange={e => this.handleChangeBookInfo(e.currentTarget)}
                  defaultValue={bookInfo.description}
                />
              </label>
            </Form.Field>
            {isEdit && (
              <Form.Field>
                <Form.Input
                  fluid
                  required
                  label="Комментарий к редактированию"
                  onChange={(e, { value }) =>
                    this.setState({
                      editComment: value
                    })
                  }
                  value={editComment}
                />
              </Form.Field>
            )}
            <Button type="submit" positive>
              {isEdit ? "Сохранить" : "Добавить"}
            </Button>
          </Form>
        </Segment>
      </>
    );
  }
}

export default branch(
  {
    bookToDB: PARAMS.BOOK_TO_DB
  },
  AddBookForm
);
