import React from "react";
import { Dropdown } from "semantic-ui-react";
import cn from "classnames";

import s from "./index.module.scss";

export default function BookOptions(props) {
  const {
    onEditClick,
    onDeleteClick,
    onRestoreClick,
    isBookHidden,
    isAdmin,
    pointing,
    additionPosition
  } = props;
  return (
    <>
      {isAdmin && (
        <Dropdown
          icon="ellipsis horizontal"
          floating
          button
          className={cn(s.headerDrop, "icon")}
          pointing={pointing}
          additionPosition={additionPosition}
        >
          <Dropdown.Menu>
            <Dropdown.Menu scrolling>
              {onEditClick && (
                <Dropdown.Item
                  text="Редактировать"
                  icon="pencil alternate"
                  onClick={() => onEditClick()}
                />
              )}
              {onEditClick && onDeleteClick && <Dropdown.Divider />}
              {!isBookHidden && onDeleteClick && (
                <Dropdown.Item
                  text="Скрыть"
                  icon="close"
                  onClick={() => onDeleteClick()}
                />
              )}
              {isBookHidden && onRestoreClick && (
                <Dropdown.Item
                  text="Восстановить видимость"
                  icon="reply"
                  onClick={() => onRestoreClick()}
                />
              )}
            </Dropdown.Menu>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  );
}
