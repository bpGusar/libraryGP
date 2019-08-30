import React from "react";
import { branch } from "baobab-react/higher-order";
// import uniqid from "uniqid";
// import _ from "lodash";

import { Form } from "semantic-ui-react";

// import { declension } from "@utils";
// import axs from "@axios";

import { PARAMS } from "@store";
// import { setBookIntoStore } from "@act";

class CategoriesDropdown extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.handleChangeAuthorsDropdown = this.handleChangeAuthorsDropdown.bind(
  //     this
  //   );

  //   this.state = {
  //     isLoading: true
  //   };
  // }

  render() {
    const { book } = this.props;
    // const { isLoading } = this.state;

    return (
      <>
        <div className="field">
          <Form.Dropdown
            fluid
            multiple
            search
            selection
            onChange={this.handleChangeAuthorsDropdown}
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
    book: PARAMS.BOOK
  },
  CategoriesDropdown
);
