/* eslint-disable no-underscore-dangle */
import React from "react";
import { branch } from "baobab-react/higher-order";
// import uniqid from "uniqid";
import _ from "lodash";

import { Form } from "semantic-ui-react";

// import { declension } from "@utils";
import axs from "@axios";

import { PARAMS } from "@store";
import { storeData } from "@act";

class AuthorsDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.handleChangeAuthorsDropdown = this.handleChangeAuthorsDropdown.bind(
      this
    );

    this.state = {
      isLoaded: false,
      options: []
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    axs.get("/authors/getAll/").then(resp => {
      if (!resp.data.msg.error) {
        dispatch(storeData, PARAMS.AUTHORS, resp.data.msg.payload);
        this.handleConvertAuthorsFromBDToOptions(resp.data.msg.payload);
      }
    });
  }

  handleConvertAuthorsFromBDToOptions(authors) {
    const optionsArr = [];

    // eslint-disable-next-line array-callback-return
    authors.map((author, i) => {
      optionsArr.push({
        key: author._id,
        text: author.authorName,
        value: author._id
      });
      if (authors.length - 1 === i) {
        this.setState({
          isLoaded: true,
          options: optionsArr
        });
      }
    });
  }

  handleChangeAuthorsDropdown(e, { value }) {
    const { dispatch, book } = this.props;
    const bookCloned = _.cloneDeep(book);

    bookCloned.bookInfo.authors = value;

    dispatch(storeData, PARAMS.BOOK, bookCloned);
  }

  render() {
    const { book } = this.props;
    const { options, isLoaded } = this.state;

    return (
      <>
        <div className="field">
          <Form.Dropdown
            fluid
            multiple
            search
            selection
            loading={!isLoaded}
            options={options}
            onChange={this.handleChangeAuthorsDropdown}
            label="Автор"
            defaultValue={book.bookInfo.authors}
          />
        </div>
      </>
    );
  }
}

export default branch(
  {
    book: PARAMS.BOOK,
    authors: PARAMS.AUTHORS
  },
  AuthorsDropdown
);
