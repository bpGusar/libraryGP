/* eslint-disable class-methods-use-this */
import React from "react";
import { branch } from "baobab-react/higher-order";
import uniqid from "uniqid";
import _ from "lodash";

import { Form, Input, Divider, Message } from "semantic-ui-react";
import axs from "@axios";
import { PARAMS } from "@store";

class AddBookForm extends React.Component {
  constructor(props) {
    super(props);
    const { book } = props;

    this.getAuthors = this.getAuthors.bind(this);

    this.state = {
      currentBook: book,
      authorsDropdown: {
        showMessage: false,
        authors: {
          allAuthorsFromDB: [],
          defaultValue: [],
          notFoundInDatabase: []
        }
      }
    };
  }

  componentDidMount() {
    const { currentBook } = this.state;
    this.getAuthors(currentBook.volumeInfo.authors);
  }

  getAuthors(authors) {
    const { authorsDropdown } = this.state;
    const authorsDropdownCloned = _.cloneDeep(authorsDropdown);
    const promises = [];

    authors.map(el =>
      promises.push(
        axs
          .post("http://localhost:5000/api/findAuthor/", { authorName: el })
          .then(res => {
            if (res.data.msg.error) {
              authorsDropdownCloned.showMessage = true;
              authorsDropdownCloned.authors.notFoundInDatabase.push(
                res.data.msg.payload.authorName
              );
            } else {
              authorsDropdownCloned.authors.defaultValue.push(
                res.data.msg.payload.authorName
              );
            }
          })
      )
    );

    Promise.all(promises);

    axs.get("http://localhost:5000/api/getAuthors/").then(res => {
      res.data.msg.payload.map(author =>
        authorsDropdownCloned.authors.allAuthorsFromDB.push({
          // eslint-disable-next-line no-underscore-dangle
          key: author._id,
          text: author.authorName,
          value: author.authorName
        })
      );
    });

    this.setState({
      authorsDropdown: authorsDropdownCloned
    });
  }

  render() {
    const { currentBook, authorsDropdown } = this.state;
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
              <div className="field">
                <Form.Dropdown
                  label={`Автор${volumeInfo.authors.length > 1 ? "ы" : ""}`}
                  fluid
                  multiple
                  selection
                  options={authorsDropdown.authors.allAuthorsFromDB}
                  // не робит показ при загрузке
                  value={authorsDropdown.authors.defaultValue}
                />
                <Message
                  warning
                  visible={authorsDropdown.showMessage}
                  header="Could you check something!"
                  list={[
                    "That e-mail has been subscribed, but you have not yet clicked the verification link in your e-mail."
                  ]}
                />
              </div>
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
