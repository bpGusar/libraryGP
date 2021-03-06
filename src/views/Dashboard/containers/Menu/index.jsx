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
          <Dropdown.Item key={dropItemEl.id} as={Link} to={dropItemEl.to}>
            {!_.isEmpty(dropItemEl.icon) && <Icon name={dropItemEl.icon} />}
            {dropItemEl.text}
          </Dropdown.Item>
        );
        return (
          <Dropdown
            key={el.id}
            item
            text={
              <p>
                {!_.isEmpty(el.icon) && (
                  <Icon name={el.icon} className={s.dropdownIcon} />
                )}
                {el.text}
              </p>
            }
            className={s.menuItem}
          >
            <Dropdown.Menu>
              {el.items.map(menuItem => dropItem(menuItem))}
            </Dropdown.Menu>
          </Dropdown>
        );
      },
      simple: el => (
        <Menu.Item key={el.id} className={s.menuItem} as={Link} to={el.to}>
          {!_.isEmpty(el.icon) && (
            <p className={s.menuItemIcon}>
              <Icon
                name={el.icon}
                style={{
                  fontSize: "17px!important"
                }}
              />
            </p>
          )}
          <span>{el.text}</span>
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
          dashboardMenu: resp.data.payload
        });

        this.setState({
          isLoading: false
        });
      } else {
        this.setState({
          isLoading: false
        });
      }
    });
  };

  render() {
    const { isLoading } = this.state;
    const { menu } = this.props;
    return (
      <>
        {_.isEmpty(menu.dashboardMenu) || isLoading ? (
          "Загрузка меню..."
        ) : (
          <>
            {menu.dashboardMenu.map(el => this.menuItems[el.type](el))}
            <Menu.Item
              as={Link}
              to="/"
              className={cn(s.menuItem, s.backToTheSite)}
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
