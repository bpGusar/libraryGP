import React from "react";
import { Button, Form, Header } from "semantic-ui-react";

import s from "../index.module.scss";

export default function Reject(props) {
  const {
    onChangeComment,
    onClickReject,
    rejectButtonDisabled,
    onClickCancel,
    cancelButtonDisabled
  } = props;
  return (
    <>
      <Header as="h5">Возврат</Header>
      <Form.Input
        label="Введите комментарий или оставьте поле пустым."
        className={s.rejectInput}
        onChange={(e, { value }) => onChangeComment(value)}
      />
      <div className="ui two buttons">
        <Button
          basic
          color="green"
          onClick={() => onClickReject()}
          disabled={rejectButtonDisabled}
        >
          Выполнить
        </Button>
        <Button
          basic
          color="grey"
          onClick={() => onClickCancel()}
          disabled={cancelButtonDisabled}
        >
          Отмена
        </Button>
      </div>
    </>
  );
}
