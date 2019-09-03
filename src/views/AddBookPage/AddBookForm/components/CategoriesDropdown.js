/* eslint-disable no-underscore-dangle */
import React from "react";
import { branch } from "baobab-react/higher-order";
import _ from "lodash";

import { Form } from "semantic-ui-react";

import axs from "@axios";

import { PARAMS } from "@store";
import { storeData } from "@act";

class CategoriesDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.handleChangeCategoriesDropdown = this.handleChangeCategoriesDropdown.bind(
      this
    );

    this.state = {
      isLoaded: false,
      options: []
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;

    axs.get("/bookCategories/getAll/").then(resp => {
      if (!resp.data.msg.error) {
        dispatch(storeData, PARAMS.CATEGORIES, resp.data.msg.payload);
        this.handleConvertAuthorsFromBDToOptions(resp.data.msg.payload);
      }
    });
  }

  handleConvertAuthorsFromBDToOptions(categories) {
    const optionsArr = [];

    // eslint-disable-next-line array-callback-return
    categories.map((cat, i) => {
      optionsArr.push({
        key: cat._id,
        text: cat.categoryName,
        value: cat._id
      });
      if (categories.length - 1 === i) {
        this.setState({
          isLoaded: true,
          options: optionsArr
        });
      }
    });
  }

  handleChangeCategoriesDropdown(e, { value }) {
    const { dispatch, book } = this.props;
    const bookCloned = _.cloneDeep(book);

    bookCloned.bookInfo.categories.push(...value);

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
            onChange={this.handleChangeCategoriesDropdown}
            label="Категория"
            defaultValue={book.bookInfo.categories}
          />
        </div>
      </>
    );
  }
}

export default branch(
  {
    book: PARAMS.BOOK,
    categories: PARAMS.CATEGORIES
  },
  CategoriesDropdown
);
