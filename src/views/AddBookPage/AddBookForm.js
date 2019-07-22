import React from "react";
import { branch } from "baobab-react/higher-order";

import { Form } from "semantic-ui-react";
import { PARAMS } from "@store";

function AddBookForm(props) {
  const { book } = props;
  return (
    <>
      {Object.prototype.hasOwnProperty.call("id", book) && (
        <Form>
          <Form.Group widths="equal">
            <Form.Input fluid label="First name" value={book.id} disabled />
          </Form.Group>
        </Form>
      )}
    </>
  );
}

export default branch(
  {
    book: PARAMS.BOOK
  },
  AddBookForm
);
