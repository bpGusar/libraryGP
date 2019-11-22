/* eslint-disable prefer-template */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-children-prop */
import React, { Component } from "react";
import { branch } from "baobab-react/higher-order";
import _ from "lodash";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { Motion, spring } from "react-motion";

import SimpleItem from "./components/SimpleItem";
import ParentItem from "./components/ParentItem";

import { PARAMS } from "@store";

import s from "./index.module.scss";

// TODO: доделать редактирование меню
class Menus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menus: props.menu
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { menus } = this.state;
    const { menu } = this.props;
    if (JSON.stringify(menu) !== JSON.stringify(nextProps.menu)) {
      this.setState(
        {
          menus: nextProps.menu
        },
        () => true
      );
      this.forceUpdate();
    } else if (JSON.stringify(menus) !== JSON.stringify(nextState.menus)) {
      this.setState(
        {
          menus: nextState.menus
        },
        () => true
      );
      this.forceUpdate();
    }
    return false;
  }

  menuItems = () => ({
    dropdown: (el, i, parentYCoord) => (
      <ParentItem
        element={el}
        motionYCoord={parentYCoord}
        index={i}
        moveCard={this.moveCard}
      >
        {el.items.map((menuItem, idx) => (
          <Motion
            key={menuItem.id}
            style={{
              childYCoord: spring(idx * 5, { stiffness: 500, damping: 32 })
            }}
          >
            {({ childYCoord }) => (
              <SimpleItem
                isChildItem
                itemType="child"
                className={s.childItem}
                element={menuItem}
                index={idx}
                motionYCoord={childYCoord}
                moveCard={this.moveCard}
              />
            )}
          </Motion>
        ))}
      </ParentItem>
    ),
    simple: (el, i, YCoord) => (
      <SimpleItem
        itemType="simple"
        isChildItem={false}
        className={s.parentItem}
        element={el}
        index={i}
        motionYCoord={YCoord}
        moveCard={this.moveCard}
      />
    )
  });

  moveCard = (hoverId, itemId) => {
    const { menus } = this.state;
    const clonedMenu = _.cloneDeep(menus);

    const getSubMenuItem = (subMenuItems, id) => {
      const hoverIndex = subMenuItems.findIndex(fiEl => fiEl.id === hoverId);
      if (subMenuItems) {
        subMenuItems.forEach(el => {
          if (el.id === id && hoverIndex !== -1) {
            const dragCard = el;
            subMenuItems.splice(
              subMenuItems.findIndex(fiEl => fiEl.id === el.id),
              1
            );
            subMenuItems.splice(hoverIndex, 0, dragCard);
            return;
          }
          if (_.has(el, "items")) getSubMenuItem(el.items, id);
        });
      }
    };

    getSubMenuItem(clonedMenu.dashboardMenu.always, itemId);

    this.setState({
      menus: clonedMenu
    });
  };

  render() {
    const { menus } = this.state;
    return (
      <>
        {!_.isEmpty(menus.dashboardMenu.always) && (
          <DndProvider backend={HTML5Backend}>
            <div className={s.menuList}>
              {menus.dashboardMenu.always.map((el, i) => (
                <Motion
                  key={el.id}
                  style={{
                    y: spring(i * 5, { stiffness: 500, damping: 32 })
                  }}
                >
                  {({ y }) => this.menuItems()[el.type](el, i, y)}
                </Motion>
              ))}
            </div>
          </DndProvider>
        )}
      </>
    );
  }
}

export default branch(
  {
    menu: PARAMS.MENU
  },
  Menus
);
