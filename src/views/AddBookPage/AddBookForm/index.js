/* eslint-disable array-callback-return */
import React from "react";
import { branch } from "baobab-react/higher-order";
import uniqid from "uniqid";
import _ from "lodash";
import { DateTime } from "luxon";
import { DateInput } from "semantic-ui-calendar-react";

import { Form, Button, Message } from "semantic-ui-react";

import UniqueDropdown from "./components/UniqueDropdown/UniqueDropdown";
import Poster from "./components/Poster/Poster";

import { PARAMS, getInitialState } from "@store";
import { storeData } from "@act";

import axs from "@axios";

import s from "./index.module.scss";

class AddBookForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFormLoaded: true,
      msg: {
        error: false,
        msg: ""
      }
    };
  }

  componentDidMount() {
    const { book, user, dispatch } = this.props;
    const bookClone = _.cloneDeep(book);
    const today = DateTime.local().toISODate();

    _.set(bookClone, "userIdWhoAddedBookInDb", user._id);
    _.set(bookClone, "dateAdded", today);

    dispatch(storeData, PARAMS.BOOK_TO_DB, bookClone);
  }

  handleSubmit() {
    const { book, history, dispatch } = this.props;
    const { msg } = this.state;

    this.setState({
      isFormLoaded: false,
      msg: {
        ...msg.msg,
        error: false
      }
    });

    axs.post("/books", { book }).then(resp => {
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

        history.push("/info-page");
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

  handleChangeBookInfo(e) {
    const { book, dispatch } = this.props;
    const bookClone = _.cloneDeep(book);

    _.set(bookClone, e.name, e.value);

    dispatch(storeData, PARAMS.BOOK_TO_DB, bookClone);
  }

  handleChangeISBN(e) {
    const { book, dispatch } = this.props;
    const bookClone = _.cloneDeep(book);
    const { industryIdentifiers } = bookClone.bookInfo;

    // eslint-disable-next-line consistent-return
    Object.keys(industryIdentifiers).find(key => {
      if (industryIdentifiers[key].type === e.name) {
        industryIdentifiers[key].identifier = e.value;
      } else {
        return false;
      }
    });

    dispatch(storeData, PARAMS.BOOK_TO_DB, bookClone);
  }

  render() {
    const { book } = this.props;
    const { isFormLoaded, msg } = this.state;
    const { bookInfo } = book;
    return (
      <>
        {msg.error && (
          <Message negative>
            <Message.Header>{msg.msg}</Message.Header>
            <p>Проверте введенные данные и попробуйте еще раз.</p>
          </Message>
        )}

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
              axsGetLink="/book-authors"
              axsPostLink="/book-authors"
              storeParam={PARAMS.AUTHORS}
              multiple
              required
              onChangeBookInfoObjectProperty="authors"
              label="Автор"
              book={book}
              dropdownValueName="authorName"
              showAddNewField
            />
            <UniqueDropdown
              axsGetLink="/book-publishers"
              axsPostLink="/book-publishers"
              storeParam={PARAMS.PUBLISHERS}
              multiple
              required
              onChangeBookInfoObjectProperty="publisher"
              label="Издательство"
              book={book}
              dropdownValueName="publisherName"
              showAddNewField
            />
          </Form.Group>
          <Form.Group widths="equal">
            <UniqueDropdown
              axsGetLink="/book-categories"
              axsPostLink="/book-categories"
              storeParam={PARAMS.CATEGORIES}
              multiple
              required
              onChangeBookInfoObjectProperty="categories"
              label="Категория"
              book={book}
              dropdownValueName="categoryName"
              showAddNewField
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
              label="Количество страниц в книге"
              name="bookInfo.pageCount"
              onChange={e => this.handleChangeBookInfo(e.currentTarget)}
              defaultValue={bookInfo.pageCount}
            />
            <UniqueDropdown
              axsGetLink="/book-languages"
              storeParam={PARAMS.LANGUAGES}
              axsPostLink="/book-languages"
              multiple
              required
              onChangeBookInfoObjectProperty="language"
              label="Язык"
              book={book}
              dropdownValueName="languageName"
              showAddNewField
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              required
              type="number"
              label="Максимальное количество экземпляров в библиотеке"
              name="stockInfo.maxAvailableBooks"
              onChange={e => this.handleChangeBookInfo(e.currentTarget)}
              defaultValue={book.stockInfo.maxAvailableBooks}
            />
            <Form.Field>
              <Form.Input
                fluid
                required
                type="number"
                label="Количество экземпляров доступное для выдачи"
                name="stockInfo.freeForBooking"
                onChange={e => this.handleChangeBookInfo(e.currentTarget)}
                max={book.stockInfo.maxAvailableBooks}
                value={book.stockInfo.freeForBooking}
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
          <Button type="submit" positive>
            Добавить
          </Button>
        </Form>
      </>
    );
  }
}

export default branch(
  {
    book: PARAMS.BOOK_TO_DB,
    user: PARAMS.USER_INFO
  },
  AddBookForm
);
