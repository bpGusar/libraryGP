import React from "react";
import { Link } from "react-router-dom";
import cn from "classnames";

import { Container, Sidebar, Menu, Dropdown } from "semantic-ui-react";

// import Header from "@views/Header";

import s from "./index.module.scss";

export default function MainLayout(props) {
  const { children } = props;

  return (
    <div className={s.dashboardWrapper}>
      <div className={s.sideBarWrapper}>
        <Sidebar
          className={s.sidebar}
          as={Menu}
          direction="left"
          icon="labeled"
          inverted
          vertical
          visible
          width="thin"
        >
          <Menu.Item as={Link} to="/dashboard" className={s.menuItem}>
            Главная
          </Menu.Item>
          <Dropdown item text="Книги" className={s.menuItem}>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/dashboard/findBook">
                Добавить новую
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/dashboard/bookingManagement">
                Управление бронированием
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/dashboard/ordersManagement">
                Управление выданными книгами
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item
            as={Link}
            to="/"
            className={cn(s.menuItem, s.backtoToSite)}
          >
            Вернуться на сайт
          </Menu.Item>
        </Sidebar>
      </div>

      <Container
        fluid
        className={s.mainContainer}
        style={{
          marginLeft: `${0}px !important`,
          marginRight: `${0}px !important`
        }}
      >
        <div className="m-3">{children}</div>
      </Container>
    </div>
  );
}
