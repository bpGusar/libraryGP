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
import { setBookData } from "@act";

import axs from "@axios";

function AddBookForm(props) {
  const { book, dispatch } = props;
  const { bookInfo } = book;

  const handleSubmit = () => {
    axs.post("/addBook", { book });
  };

  const handleChangeBookInfo = e => {
    const bookClone = _.cloneDeep(book);

    _.set(bookClone, e.name, e.value);

    dispatch(setBookData, bookClone);
  };

  // const handleChangeISBN = e => {
  //   const bookClone = _.cloneDeep(book);

  //   bookClone.find();

  //   dispatch(setBookData, bookClone);
  // };

  return (
    <>
      <Form>
        <Poster />
        <Form.Input
          fluid
          label="Название"
          name="bookInfo.title"
          onChange={e => handleChangeBookInfo(e.currentTarget)}
          defaultValue={bookInfo.title}
        />
        <Form.Group widths="equal">
          <AuthorsDropdown />
          <Form.Dropdown
            fluid
            multiple
            search
            selection
            onChange={e => handleChangeBookInfo(e.currentTarget)}
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
            onChange={e => handleChangeBookInfo(e.currentTarget)}
            defaultValue={bookInfo.maturityRating}
          />
        </Form.Group>
        <Form.Group widths="equal">
          {bookInfo.industryIdentifiers.map(el => (
            <Form.Input
              fluid
              label={el.type}
              name={el.type}
              // onChange={e => handleChangeISBN(e.currentTarget)}
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
            onChange={e => handleChangeBookInfo(e.currentTarget)}
            defaultValue={bookInfo.pageCount}
          />
          <LanguageDropdown />
        </Form.Group>
        <Form.Group widths="equal">
          <DateInput
            name="bookInfo.publishedDate"
            placeholder="Дата публикации"
            value={bookInfo.publishedDate}
            iconPosition="left"
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(e, { name, value }) =>
              handleChangeBookInfo({ name, value })
            }
          />
          <Form.Input
            fluid
            type="number"
            label="Количество книг в наличии"
            name="stockInfo.quantityInStock"
            onChange={e => handleChangeBookInfo(e.currentTarget)}
            defaultValue={book.stockInfo.quantityInStock}
          />
        </Form.Group>
        <Form.Field>
          <label htmlFor={uniqid(`description_`)}>
            Описание
            <textarea
              id={uniqid(`description_`)}
              name="bookInfo.description"
              onChange={e => handleChangeBookInfo(e.currentTarget)}
              defaultValue={bookInfo.description}
            />
          </label>
        </Form.Field>
        <Button onClick={() => handleSubmit()}>Добавить</Button>
      </Form>
    </>
  );
}

export default branch(
  {
    book: PARAMS.BOOK,
    isBookDataLoaded: PARAMS.IS_BOOK_DATA_LOADED
  },
  AddBookForm
);
