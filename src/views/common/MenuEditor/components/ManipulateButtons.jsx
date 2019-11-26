import React from "react";
import { Button, Icon } from "semantic-ui-react";

import s from "../index.module.scss";

export default function ManipulateButtons(props) {
  const { onDelete, element, onEdit } = props;
  return (
    <div className={s.buttonGroupBlock}>
      <Button.Group className={s.buttonGroup}>
        <Button
          className={s.button}
          icon
          size="mini"
          onClick={() => onEdit(element)}
        >
          <Icon className={s.icon} name="pencil" />
        </Button>
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
