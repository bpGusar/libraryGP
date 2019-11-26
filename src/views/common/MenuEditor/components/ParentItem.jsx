/* eslint-disable react/no-children-prop */
/* eslint-disable prefer-template */
import React from "react";
import cn from "classnames";
import _ from "lodash";
import { Icon } from "semantic-ui-react";

import MenuItemWrapper from "./MenuItemWrapper";
import ManipulateButtons from "./ManipulateButtons";
import NewItem from "./NewItem";

import s from "../index.module.scss";

export default function ParentItem(props) {
  const {
    element,
    index,
    moveCard,
    children,
    onSubmit,
    status,
    onDelete,
    onSaveEdit
  } = props;
  const isNewItem = status === "new";
  const isEdited = status === "edited";
  return (
    <MenuItemWrapper
      itemId={element.id}
      isChildItem={false}
      className={cn(s.dragItem, s.parentItem)}
      dragClassName={s.dragged}
      index={index}
      moveCard={moveCard}
      children={
        <div
          className={cn(
            s.dropBlock,
            s.item,
            isNewItem && s.newItem,
            isEdited && s.editedItem
          )}
        >
          <div className={s.content}>
            <Icon
              name={!_.isEmpty(element.icon) ? element.icon : "angle right"}
            />
            <div className={s.header}>{element.text}</div>
            <ManipulateButtons
              element={element}
              onDelete={onDelete}
              onSaveEdit={onSaveEdit}
            />
          </div>
          <div className={s.list}>
            {children}
            <NewItem onSubmit={onSubmit} element={element} />
          </div>
        </div>
      }
    />
  );
}
