import React, { Component } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import _ from "lodash";

import { Menu, Dropdown, Icon } from "semantic-ui-react";

import Menus from "@src/common/menus";

import s from "./index.module.scss";

const menuType = {
  simple: "simple",
  drop: "dropdown"
};

// eslint-disable-next-line react/prefer-stateless-function
export default class DashboardMenu extends Component {
  generateMenu = () => {
    const menu = [];

    const dropItem = el => (
      <Dropdown.Item key={el.to} as={Link} to={el.to}>
        {!_.isEmpty(el.icon) && <Icon name={el.icon} />}
        {el.text}
      </Dropdown.Item>
    );

    const dropBlock = el => (
      <Dropdown key={el.to} item text={el.text} className={s.menuItem}>
        <Dropdown.Menu>
          {el.items.map(menuItem => dropItem(menuItem))}
        </Dropdown.Menu>
      </Dropdown>
    );

    const simpleItem = el => (
      <Menu.Item key={el.to} className={s.menuItem} as={Link} to={el.to}>
        {!_.isEmpty(el.icon) && <Icon name={el.icon} />}
        {el.text}
      </Menu.Item>
    );

    Menus.dashMain.forEach(el => {
      if (el.type === menuType.simple) {
        menu.push(simpleItem(el));
      } else if (el.type === menuType.drop) {
        menu.push(dropBlock(el));
      }
    });

    return menu;
  };

  render() {
    return (
      <>
        {this.generateMenu()}
        <Menu.Item as={Link} to="/" className={cn(s.menuItem, s.backtoToSite)}>
          Вернуться на сайт
        </Menu.Item>
      </>
    );
  }
}
