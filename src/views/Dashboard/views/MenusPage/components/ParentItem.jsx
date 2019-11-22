/* eslint-disable react/no-children-prop */
/* eslint-disable prefer-template */
import React from "react";
import cn from "classnames";
import _ from "lodash";
import { Icon, Button } from "semantic-ui-react";

import MenuItemWrapper from "./MenuItemWrapper";
import ManipulateButtons from "./ManipulateButtons";

import s from "../index.module.scss";

export default function ChildItem(props) {
  const { element, motionYCoord, index, moveCard, children } = props;

  return (
    <MenuItemWrapper
      key={element.id}
      itemId={element.id}
      isChildItem={false}
      style={{
        transform: "translate3d(0, " + motionYCoord + "px, 0)"
      }}
      className={cn(s.dragItem, s.parentItem)}
      dragClassName={s.dragged}
      index={index}
      moveCard={moveCard}
      children={
        <div className={cn(s.dropBlock, s.item)}>
          <div className={s.content}>
            <Icon
              name={!_.isEmpty(element.icon) ? element.icon : "angle right"}
            />
            <div className={s.header}>{element.text}</div>
            <ManipulateButtons />
          </div>
          <div className={s.list}>
            {children}
            <Button
              size="tiny"
              icon
              labelPosition="left"
              className={s.addButton}
            >
              Добавить
              <Icon name="plus" />
            </Button>
          </div>
        </div>
      }
    />
  );
}
