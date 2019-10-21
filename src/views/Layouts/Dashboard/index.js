import React from "react";
import { Link } from "react-router-dom";
import cn from "classnames";

import { Container, Sidebar, Menu, Dropdown } from "semantic-ui-react";

import s from "./index.module.scss";

export default class MainLayout extends React.Component {
  componentDidMount() {
    const { accessGranted, history } = this.props;

    if (!accessGranted) {
      history.push("/");
    }
  }

  render() {
    const { children } = this.props;

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
                <Dropdown.Item as={Link} to="/dashboard/find-book">
                  Добавить новую
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/dashboard/booking-management">
                  Управление бронированием
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/dashboard/orders-management">
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
}
