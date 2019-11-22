import React from "react";
import { Button, Icon } from "semantic-ui-react";

import s from "../index.module.scss";

export default function ManipulateButtons() {
  return (
    <div className={s.buttonGroupBlock}>
      <Button.Group className={s.buttonGroup}>
        <Button className={s.button} icon size="mini">
          <Icon className={s.icon} name="close" />
        </Button>
      </Button.Group>
    </div>
  );
}
