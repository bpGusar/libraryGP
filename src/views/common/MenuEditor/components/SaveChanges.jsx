import React from "react";

import { Button, Segment } from "semantic-ui-react";

export default function SaveChanges(props) {
  const { saveActive, disableActive, onSave, onCancel } = props;
  return (
    <Segment>
      <Button size="tiny" disabled={saveActive} onClick={onSave} color="green">
        Сохранить
      </Button>
      <Button size="tiny" disabled={disableActive} onClick={onCancel}>
        Отмена
      </Button>
    </Segment>
  );
}
