import React from "react";
import { Form, Button, Icon } from "semantic-ui-react";

import s from "./index.module.scss";

export default function TextArea(props) {
  const { onKeyPress, innerRef, inputHeight, onButtonClick } = props;
  return (
    <Form className={s.messageForm}>
      <textarea
        onKeyPress={onKeyPress}
        ref={innerRef}
        className={s.messageTextAreaInput}
        style={{
          minHeight: inputHeight,
          maxHeight: inputHeight,
          overflow: inputHeight === 97 ? "hidden auto" : "hidden"
        }}
        placeholder="Введите сообщение..."
      />
      <Button color="blue" icon onClick={onButtonClick}>
        <Icon name="send" />
      </Button>
    </Form>
  );
}
