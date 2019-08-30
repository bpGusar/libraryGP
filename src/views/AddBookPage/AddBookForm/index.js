import React from "react";
import { branch } from "baobab-react/higher-order";
import uniqid from "uniqid";
// import _ from "lodash";

import { Form } from "semantic-ui-react";

import AuthorsDropdown from "./components/AuthorsDropdown";
import CategoriesDropdown from "./components/CategoriesDropdown";
import LanguageDropdown from "./components/LanguageDropdown";
import Poster from "./components/Poster";

import { PARAMS } from "@store";

function AddBookForm(props) {
  const { book } = props;
  const { bookInfo } = book;
  // TODO: переделать логику. должна быть голая форма которую можно заполнить а данные отправить в базу
  // а если юзаем апи то переберать данные из апи под схему в сторе и заполнять данные в форме данными из стора
  return (
    <>
      <Form>
        <Poster />
        <Form.Input fluid label="Название" defaultValue={bookInfo.title} />
        <Form.Group widths="equal">
          <AuthorsDropdown />
          <Form.Input
            fluid
            label="Издательство"
            defaultValue={bookInfo.publisher}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <CategoriesDropdown />
          <Form.Input
            fluid
            label="Возрастной рейтинг"
            defaultValue={bookInfo.maturityRating}
          />
        </Form.Group>
        <Form.Group widths="equal">
          {bookInfo.industryIdentifiers.map(el => (
            <Form.Input fluid label={el.type} defaultValue={el.identifier} />
          ))}
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Количество страниц в книге"
            defaultValue={bookInfo.pageCount}
          />
          <LanguageDropdown />
        </Form.Group>
        <Form.Field>
          <label htmlFor={uniqid(`description_`)}>
            Описание
            <textarea
              id={uniqid(`description_`)}
              defaultValue={bookInfo.description}
            />
          </label>
        </Form.Field>
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
