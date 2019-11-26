/* eslint-disable react/no-children-prop */
/* eslint-disable prefer-template */
import React from "react";
import cn from "classnames";
import _ from "lodash";
import { Icon } from "semantic-ui-react";

import MenuItemWrapper from "./MenuItemWrapper";
import ManipulateButtons from "./ManipulateButtons";

import s from "../index.module.scss";
import NewItem from "./NewItem";

export default function SimpleItem(props) {
  const {
    element,
    index,
    moveCard,
    className,
    isChildItem,
    itemType,
    status,
    onSubmit,
    onDelete,
    onEdit
  } = props;
  const isNewItem = status === "new";
  const isEdited = status === "edited";

  return (
    <>
      <MenuItemWrapper
        itemId={element.id}
        index={index}
        className={cn(
          s.dragItem,
          className,
          isNewItem && s.newItem,
          isEdited && s.editedItem
        )}
        dragClassName={s.dragged}
        isChildItem={isChildItem}
        moveCard={moveCard}
        children={
          (itemType === "child" && (
            <div className={s.dropItem}>
              <div className={s.content}>
                {!_.isEmpty(element.icon) && (
                  <Icon className={s.dropItemIcon} name={element.icon} />
                )}
                <div className={s.header}>{element.text}</div>
                <br />
                <div className={s.link}>{element.to}</div>
              </div>
              <ManipulateButtons
                element={element}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </div>
          )) ||
          (itemType === "simple" && (
            <div
              className={cn(
                s.item,
                isNewItem && s.newItem,
                isEdited && s.editedItem
              )}
            >
              <div className={s.content}>
                {!_.isEmpty(element.icon) && <Icon name={element.icon} />}
                <div className={s.itemInfo}>
                  <div className={s.header}>{element.text}</div>
                  <br />
                  <div className={s.link}>{element.to}</div>
                </div>

                <NewItem
                  buttonClassName={s.simpleBlock}
                  onSubmit={onSubmit}
                  element={element}
                />
                <ManipulateButtons
                  element={element}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              </div>
            </div>
          ))
        }
      />
    </>
  );
}
