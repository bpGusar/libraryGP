import React from "react";
import { branch } from "baobab-react/higher-order";
import uniqid from "uniqid";
import _ from "lodash";

import { Form, Input, Divider } from "semantic-ui-react";

import AuthorsDropdown from "./components/AuthorsDropdown";
import CategoriesDropdown from "./components/CategoriesDropdown";

import { PARAMS } from "@store";

function AddBookForm(props) {
  const { book } = props;
  const { volumeInfo } = book;
  // TODO: переделать логику. должна быть голая форма которую можно заполнить а данные отправить в базу
  // а если юзаем апи то переберать данные из апи под схему в сторе и заполнять данные в форме данными из стора
  return (
    <>
      <Form>
        <Input
          label="Google Books ID"
          value={book.id}
          onChange={() => false}
          action={{
            color: "teal",
            content: "Перейти",
            onClick: () =>
              window.open(`https://books.google.ru/books?id=${book.id}`)
          }}
        />
        <Divider />
        <Form.Field>
          <label htmlFor={uniqid(`title_`)}>
            Название
            <input id={uniqid(`title_`)} defaultValue={volumeInfo.title} />
          </label>
        </Form.Field>
        {_.has(volumeInfo, "subtitle") && (
          <Form.Field>
            <label htmlFor={uniqid(`subtitle_`)}>
              Subtitle
              <input
                id={uniqid(`subtitle_`)}
                defaultValue={volumeInfo.subtitle}
              />
            </label>
          </Form.Field>
        )}
        <Form.Group widths="equal">
          <AuthorsDropdown />
          <Form.Input
            fluid
            label="Издательство"
            defaultValue={volumeInfo.publisher}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <CategoriesDropdown />
        </Form.Group>
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
