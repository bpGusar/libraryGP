import React from "react";
import { branch } from "baobab-react/higher-order";
import uniqid from "uniqid";
import _ from "lodash";

import { Form, Divider, Message, Button, Icon } from "semantic-ui-react";

import { declension } from "@utils";
import axs from "@axios";

import { PARAMS } from "@store";
import { setBookIntoStore } from "@act";

class AuthorsDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.handleChangeAuthorsDropdown = this.handleChangeAuthorsDropdown.bind(
      this
    );

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    const { book } = this.props;
    this.getAuthors(book.volumeInfo.authors);
  }

  getAuthors(authors) {
    this.setState({
      isLoading: true
    });
    const { book, dispatch } = this.props;
    const currentBookCloned = _.cloneDeep(book);
    const promises = [];
    const defaultAuthors = _.isArray(currentBookCloned.volumeInfo.authors)
      ? currentBookCloned.volumeInfo.authors
      : currentBookCloned.volumeInfo.authors.authors.defaultAuthors;

    currentBookCloned.volumeInfo.authors = {
      showMessage: false,
      authors: {
        defaultAuthors,
        allAuthorsFromDB: [],
        defaultValue: [],
        notFoundInDatabase: {}
      }
    };

    authors.map(el =>
      promises.push(
        axs.post("/findAuthor/", { authorName: el }).then(res => {
          const buttonId = uniqid("addAuthorButton_");
          if (res.data.msg.error) {
            currentBookCloned.volumeInfo.authors.showMessage = true;
            currentBookCloned.volumeInfo.authors.authors.notFoundInDatabase[
              buttonId
            ] = {
              id: buttonId,
              authorName: res.data.msg.payload.authorName,
              isLoading: false
            };
          } else {
            currentBookCloned.volumeInfo.authors.authors.defaultValue.push(
              _.snakeCase(res.data.msg.payload.authorName)
            );
          }
        })
      )
    );

    promises.push(
      axs.get("/getAuthors/").then(res => {
        const arr = [];
        // eslint-disable-next-line array-callback-return
        res.data.msg.payload.map((author, i) => {
          arr.push({
            // eslint-disable-next-line no-underscore-dangle
            key: author._id,
            text: author.authorName,
            value: _.snakeCase(author.authorName)
          });
          if (res.data.msg.payload.length - 1 === i) {
            currentBookCloned.volumeInfo.authors.authors.allAuthorsFromDB = arr;
          }
        });
      })
    );

    Promise.all(promises).then(() => {
      dispatch(setBookIntoStore, currentBookCloned);
      setTimeout(() => {
        this.setState({
          isLoading: false
        });
      }, 500);
    });
  }

  getNonExistAuthorList() {
    const { book } = this.props;
    const { notFoundInDatabase } = book.volumeInfo.authors.authors;

    return (
      <ul className="list">
        {Object.keys(notFoundInDatabase).map(key => {
          const button = (
            <Button
              id={notFoundInDatabase[key].id}
              size="mini"
              loading={notFoundInDatabase[key].isLoading}
              disabled={notFoundInDatabase[key].isLoading}
              icon
              color="green"
              onClick={() => this.addAuthorToDB(notFoundInDatabase[key])}
            >
              <Icon name="plus" />
            </Button>
          );

          return (
            <li className="content" key={notFoundInDatabase[key].authorName}>
              <span>
                <span>{notFoundInDatabase[key].authorName}</span>{" "}
                <span>{button}</span>
              </span>
            </li>
          );
        })}
      </ul>
    );
  }

  handleChangeAuthorsDropdown(e, { value }) {
    const { book, dispatch } = this.props;
    console.log({ book, dispatch });
    const currentBookCloned = _.cloneDeep(book);

    currentBookCloned.volumeInfo.authors.authors.defaultValue = value;

    dispatch(setBookIntoStore, currentBookCloned);
  }

  addAuthorToDB(el) {
    const { book, dispatch } = this.props;
    const currentBookCloned = _.cloneDeep(book);

    currentBookCloned.volumeInfo.authors.authors.notFoundInDatabase[
      el.id
    ].isLoading = true;

    dispatch(setBookIntoStore, currentBookCloned);

    axs.post("/addAuthor/", { authorName: el.authorName }).then(res => {
      if (!res.data.msg.error) {
        this.getAuthors(book.volumeInfo.authors.authors.defaultAuthors);
      }
    });
  }

  render() {
    const { book } = this.props;
    const { isLoading } = this.state;

    return (
      <>
        <div className="field">
          <Form.Dropdown
            disabled={isLoading}
            loading={isLoading}
            fluid
            multiple
            search
            selection
            onChange={this.handleChangeAuthorsDropdown}
            {...(!isLoading
              ? {
                  ...{
                    label: `Автор${declension(
                      book.volumeInfo.authors.authors.defaultValue.length > 1,
                      "ы",
                      ""
                    )}`,
                    options: book.volumeInfo.authors.authors.allAuthorsFromDB,
                    value: book.volumeInfo.authors.authors.defaultValue
                  }
                }
              : { ...{ label: `Автор` } })}
          />
          {!isLoading ? (
            <Message warning visible={book.volumeInfo.authors.showMessage}>
              <Message.Header>{`Следующи${declension(
                book.volumeInfo.authors.authors.notFoundInDatabase.length > 1,
                "е",
                "й"
              )} автор${declension(
                book.volumeInfo.authors.authors.notFoundInDatabase.length > 1,
                "ы",
                ""
              )} не был${declension(
                book.volumeInfo.authors.authors.notFoundInDatabase.length > 1,
                "и",
                ""
              )} найден${declension(
                book.volumeInfo.authors.authors.notFoundInDatabase.length > 1,
                "ы",
                ""
              )} в базе данных:`}</Message.Header>
              {this.getNonExistAuthorList()}
              <Divider />
              Что бы добавить отсутствующего автора в базу данных нажмите на
              знак &ldquo;+&ldquo; напротив имени автора.
            </Message>
          ) : (
            ""
          )}
        </div>
      </>
    );
  }
}

export default branch(
  {
    book: PARAMS.BOOK
  },
  AuthorsDropdown
);
