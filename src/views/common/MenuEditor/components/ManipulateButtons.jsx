import React from "react";
import { Button, Icon } from "semantic-ui-react";

import EditItem from "./EditItem";

import s from "../index.module.scss";

export default function ManipulateButtons(props) {
  const { onDelete, element, onSaveEdit } = props;
  return (
    <div className={s.buttonGroupBlock}>
      <Button.Group className={s.buttonGroup}>
        <EditItem element={element} onSaveEdit={onSaveEdit} />
        <Button
          className={s.button}
          icon
          size="mini"
          onClick={() => onDelete(element)}
        >
          <Icon className={s.icon} name="close" />
        </Button>
      </Button.Group>
    </div>
  );
}
