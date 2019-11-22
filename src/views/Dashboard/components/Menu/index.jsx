import React, { Component } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import _ from "lodash";

import { Menu, Dropdown, Icon } from "semantic-ui-react";
import { branch } from "baobab-react/higher-order";

import { PARAMS } from "@store";
import { storeData } from "@act";

import axs from "@axios";

import s from "./index.module.scss";

class DashboardMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };

    this.menuItems = {
      dropdown: el => {
        const dropItem = dropItemEl => (
          <Dropdown.Item key={dropItemEl.to} as={Link} to={dropItemEl.to}>
            {!_.isEmpty(dropItemEl.icon) && <Icon name={dropItemEl.icon} />}
            {dropItemEl.text}
          </Dropdown.Item>
        );
        return (
          <Dropdown item text={el.text} className={s.menuItem}>
            <Dropdown.Menu>
              {el.items.map(menuItem => dropItem(menuItem))}
            </Dropdown.Menu>
          </Dropdown>
        );
      },
      simple: el => (
        <Menu.Item className={s.menuItem} as={Link} to={el.to}>
          {!_.isEmpty(el.icon) && <Icon name={el.icon} />}
          {el.text}
        </Menu.Item>
      )
    };
  }

  componentDidMount() {
    this.handleGetMenu();
  }

  handleGetMenu = () => {
    const { dispatch, menu } = this.props;
    const clonedMenu = { ...menu };

    axs.get(`/menus/dashboardMenu`).then(resp => {
      if (!resp.data.error) {
        dispatch(storeData, PARAMS.MENU, {
          ...clonedMenu,
          dashboardMenu: resp.data.payload.menu
        });

        this.setState({
          isLoading: false
        });
      }
    });
  };

  render() {
    const { isLoading } = this.state;
    const { menu } = this.props;
    console.log(menu.dashboardMenu.always);
    return (
      <>
        {_.isEmpty(menu.dashboardMenu) || isLoading ? (
          "Загрузка меню..."
        ) : (
          <>
            {menu.dashboardMenu.always.map(el => this.menuItems[el.type](el))}
            <Menu.Item
              as={Link}
              to="/"
              className={cn(s.menuItem, s.backtoToSite)}
            >
              Вернуться на сайт
            </Menu.Item>
          </>
        )}
      </>
    );
  }
}

export default branch(
  {
    menu: PARAMS.MENU
  },
  DashboardMenu
);
