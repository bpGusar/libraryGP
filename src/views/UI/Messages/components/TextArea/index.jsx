/* eslint-disable jsx-a11y/control-has-associated-label */
import React from "react";
import { Form, Button } from "semantic-ui-react";
import ContentEditable from "react-contenteditable";

import s from "./index.module.scss";

export default function TextArea(props) {
  // доделать высоту при ентер и т.д
  const { value, onChange, onSubmit } = props;
  return (
    <Form reply className={s.messageForm}>
      <ContentEditable
        onChange={onChange}
        html={value}
        className={s.messageTextAreaInput}
      />
      <Button
        content="Отправить"
        labelPosition="left"
        icon="edit"
        primary
        onClick={() => onSubmit()}
      />
    </Form>
  );
}
