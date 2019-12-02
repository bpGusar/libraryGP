/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import React from "react";
import { branch } from "baobab-react/higher-order";
import uniqid from "uniqid";
import _ from "lodash";
import { DateTime } from "luxon";
import { DateInput } from "semantic-ui-calendar-react";

import { Form, Button, Message, Segment } from "semantic-ui-react";

import UniqueDropdown from "@views/common/UniqueDropdown/UniqueDropdown";
import Poster from "./components/Poster/Poster";

import { PARAMS, getInitialState } from "@store";
import { storeData } from "@act";

import axs from "@axios";

import s from "./index.module.scss";

class AddBookForm extends React.Component {
  constructor(props) {
    super(props);
    const { bookToDB } = props;

    this.state = {
      isFormLoaded: true,
      msg: {
        error: false,
        msg: ""
      },
      isEdit: bookToDB.flag === "edit",
      editComment: ""
    };
  }

  componentDidMount() {
    const { bookToDB, user, dispatch } = this.props;
    const bookClone = _.cloneDeep(bookToDB);
    const today = DateTime.local().toISODate();
    _.set(bookClone.book, "dateAdded", today);

    dispatch(storeData, PARAMS.BOOK_TO_DB, bookClone);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(
      storeData,
      PARAMS.BOOK_TO_DB,
      getInitialState()[PARAMS.BOOK_TO_DB]
    );
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
            <p>Проверте введенные данные и попробуйте еще раз.</p>
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
                axiosGetLink="/book-authors"
                axiosPostLink="/book-authors"
                storeParam={PARAMS.AUTHORS}
                multiple
                required
                onChange={value =>
                  this.handleOnChangeDropdown(value, "authors")
                }
                label="Автор"
                dropdownValueName="authorName"
                showAddNewField
                currentValue={bookInfo.authors}
              />
              <UniqueDropdown
                axiosGetLink="/book-publishers"
                axiosPostLink="/book-publishers"
                storeParam={PARAMS.PUBLISHERS}
                multiple
                required
                onChange={value =>
                  this.handleOnChangeDropdown(value, "publisher")
                }
                label="Издательство"
                dropdownValueName="publisherName"
                showAddNewField
                currentValue={bookInfo.publisher}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <UniqueDropdown
                axiosGetLink="/book-categories"
                axiosPostLink="/book-categories"
                storeParam={PARAMS.CATEGORIES}
                multiple
                required
                onChange={value =>
                  this.handleOnChangeDropdown(value, "categories")
                }
                label="Категория"
                dropdownValueName="categoryName"
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
                axiosGetLink="/book-languages"
                storeParam={PARAMS.LANGUAGES}
                axiosPostLink="/book-languages"
                multiple
                required
                onChange={value =>
                  this.handleOnChangeDropdown(value, "language")
                }
                label="Язык"
                dropdownValueName="languageName"
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
    bookToDB: PARAMS.BOOK_TO_DB,
    user: PARAMS.USER_INFO
  },
  AddBookForm
);
