import React, { Component } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";

import { Menu, Dropdown, Icon } from "semantic-ui-react";

import s from "./index.module.scss";

// eslint-disable-next-line react/prefer-stateless-function
export default class DashboardMenu extends Component {
  render() {
    return (
      <>
        <Menu.Item as={Link} to="/dashboard" className={s.menuItem}>
          Главная
        </Menu.Item>
        <Dropdown item text="Книги" className={s.menuItem}>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/dashboard/books/find">
              <Icon name="add" />
              Добавить новую
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/dashboard/books/booking-management">
              <Icon name="book" />
              Управление бронированием
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/dashboard/books/orders-management">
              <Icon name="book" />
              Управление выданными книгами
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/dashboard/books/book-list">
              <Icon name="list" />
              Все книги
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown item text="Пользователи" className={s.menuItem}>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/dashboard/users/new">
              <Icon name="add" />
              Добавить нового
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Item as={Link} to="/" className={cn(s.menuItem, s.backtoToSite)}>
          Вернуться на сайт
        </Menu.Item>
      </>
    );
  }
}
