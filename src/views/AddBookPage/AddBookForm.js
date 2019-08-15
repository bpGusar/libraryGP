import React from "react";
import { branch } from "baobab-react/higher-order";
import uniqid from "uniqid";

import { Form, Input, Divider } from "semantic-ui-react";
import axios from "axios";
import { PARAMS } from "@store";

class AddBookForm extends React.Component {
  constructor(props) {
    super(props);
    const { book } = props;

    this.state = {
      currentBook: book
    };
  }

  static getAuthors(authors) {
    const promises = [];

    authors.map(el =>
      promises.push(
        axios
          .post("http://localhost:5000/api/getAuthors/", { authorName: el })
          .then(res => {
            console.log(res);
          })
      )
    );

    axios.all(promises);

    const authorsArr = [];
    const defaultValuesArr = [];

    authors.map(el =>
      authorsArr.push({
        key: el,
        text: el,
        value: el
      })
    );

    authors.map(el => defaultValuesArr.push(el));

    return {
      authors: authorsArr,
      defaultValues: defaultValuesArr
    };
  }

  render() {
    const { currentBook } = this.state;
    const { volumeInfo } = currentBook;
    return (
      <>
        {currentBook.id !== undefined ? (
          <Form>
            <Input
              label="Google Books ID"
              value={currentBook.id}
              onChange={() => false}
              action={{
                color: "teal",
                content: "Перейти",
                onClick: () =>
                  window.open(
                    `https://books.google.ru/books?id=${currentBook.id}`
                  )
              }}
            />
            <Divider />
            <Form.Field>
              <label htmlFor={uniqid(`title_`)}>
                Название
                <input id={uniqid(`title_`)} defaultValue={volumeInfo.title} />
              </label>
            </Form.Field>
            <Form.Group widths="equal">
              <Form.Dropdown
                label={`Автор${volumeInfo.authors.length > 1 ? "ы" : ""}`}
                placeholder={`Автор${volumeInfo.authors.length > 1 ? "ы" : ""}`}
                fluid
                multiple
                selection
                options={AddBookForm.getAuthors(volumeInfo.authors).authors}
                defaultValue={
                  AddBookForm.getAuthors(volumeInfo.authors).defaultValues
                }
              />
              <Form.Input
                fluid
                label="Издательство"
                defaultValue={volumeInfo.publisher}
              />
            </Form.Group>
          </Form>
        ) : (
          "данные отсутствуют"
        )}
      </>
    );
  }
}

export default branch(
  {
    book: PARAMS.BOOK
  },
  AddBookForm
);
