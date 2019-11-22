/* eslint-disable react/no-children-prop */
/* eslint-disable prefer-template */
import React from "react";
import cn from "classnames";
import _ from "lodash";
import { Icon } from "semantic-ui-react";

import MenuItemWrapper from "./MenuItemWrapper";
import ManipulateButtons from "./ManipulateButtons";

import s from "../index.module.scss";

export default function ChildItem(props) {
  const {
    element,
    motionYCoord,
    index,
    moveCard,
    className,
    isChildItem,
    itemType
  } = props;

  return (
    <>
      <MenuItemWrapper
        key={element.id}
        itemId={element.id}
        index={index}
        style={{
          transform: "translate3d(0, " + motionYCoord + "px, 0)"
        }}
        className={cn(s.dragItem, className)}
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
              </div>
              <ManipulateButtons />
            </div>
          )) ||
          (itemType === "simple" && (
            <div className={s.item}>
              <div className={s.content}>
                {!_.isEmpty(element.icon) && <Icon name={element.icon} />}
                <div className={s.header}>{element.text}</div>
                <ManipulateButtons />
              </div>
            </div>
          ))
        }
      />
    </>
  );
}
