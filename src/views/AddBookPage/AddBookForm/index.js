/* eslint-disable array-callback-return */
import React from "react";
import { branch } from "baobab-react/higher-order";
import uniqid from "uniqid";
import _ from "lodash";
import { DateInput } from "semantic-ui-calendar-react";

import { Form, Button } from "semantic-ui-react";

import AuthorsDropdown from "./components/AuthorsDropdown";
import CategoriesDropdown from "./components/CategoriesDropdown";
import LanguageDropdown from "./components/LanguageDropdown";
import Poster from "./components/Poster";

import { PARAMS } from "@store";
import { storeData } from "@act";

import axs from "@axios";

class AddBookForm extends React.Component {
  componentDidMount() {
    const { book, user, dispatch } = this.props;
    const bookClone = _.cloneDeep(book);
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = today.getFullYear();

    _.set(bookClone, "bookInfo.userIdWhoAddedBookInDb", user.id);
    _.set(bookClone, "dateAdded", `${dd}.${mm}.${yyyy}`);

    dispatch(storeData, PARAMS.BOOK, bookClone);
  }

  handleSubmit() {
    const { book } = this.props;
    axs.post("/addBook", { book });
  }

  handleChangeBookInfo(e) {
    const { book, dispatch } = this.props;
    const bookClone = _.cloneDeep(book);

    _.set(bookClone, e.name, e.value);

    dispatch(storeData, PARAMS.BOOK, bookClone);
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

    dispatch(storeData, PARAMS.BOOK, bookClone);
  }

  render() {
    const { book } = this.props;
    const { bookInfo } = book;
    return (
      <>
        <Form>
          <Poster />
          <Form.Input
            fluid
            label="Название"
            name="bookInfo.title"
            onChange={e => this.handleChangeBookInfo(e.currentTarget)}
            defaultValue={bookInfo.title}
          />
          <Form.Group widths="equal">
            <AuthorsDropdown />
            <Form.Dropdown
              fluid
              multiple
              search
              selection
              onChange={e => this.handleChangeBookInfo(e.currentTarget)}
              label="Издательство"
              name="bookInfo.publisher"
              defaultValue={bookInfo.publisher}
            />
          </Form.Group>
          <Form.Group widths="equal">
            <CategoriesDropdown />
            <Form.Input
              fluid
              label="Возрастной рейтинг"
              name="bookInfo.maturityRating"
              onChange={e => this.handleChangeBookInfo(e.currentTarget)}
              defaultValue={bookInfo.maturityRating}
            />
          </Form.Group>
          <Form.Group widths="equal">
            {bookInfo.industryIdentifiers.map(el => (
              <Form.Input
                fluid
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
              type="number"
              label="Количество страниц в книге"
              name="bookInfo.pageCount"
              onChange={e => this.handleChangeBookInfo(e.currentTarget)}
              defaultValue={bookInfo.pageCount}
            />
            <LanguageDropdown />
          </Form.Group>
          <Form.Group widths="equal">
            <DateInput
              name="bookInfo.publishedDate"
              label="Дата публикации"
              animation="off"
              value={bookInfo.publishedDate}
              iconPosition="left"
              // eslint-disable-next-line react/jsx-no-bind
              onChange={(e, { name, value }) =>
                this.handleChangeBookInfo({ name, value })
              }
            />
            <Form.Input
              fluid
              type="number"
              label="Количество книг в наличии"
              name="stockInfo.quantityInStock"
              onChange={e => this.handleChangeBookInfo(e.currentTarget)}
              defaultValue={book.stockInfo.quantityInStock}
            />
          </Form.Group>
          <Form.Field>
            <label htmlFor={uniqid(`description_`)}>
              Описание
              <textarea
                id={uniqid(`description_`)}
                name="bookInfo.description"
                onChange={e => this.handleChangeBookInfo(e.currentTarget)}
                defaultValue={bookInfo.description}
              />
            </label>
          </Form.Field>
          <Button onClick={() => this.handleSubmit()}>Добавить</Button>
        </Form>
      </>
    );
  }
}

export default branch(
  {
    book: PARAMS.BOOK,
    user: PARAMS.USER_INFO,
    isBookDataLoaded: PARAMS.IS_BOOK_DATA_LOADED
  },
  AddBookForm
);
