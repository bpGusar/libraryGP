import React from "react";
import { Menu, Segment, Dropdown, Container, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { branch } from "baobab-react/higher-order";
import { PARAMS } from "@store";
import { storeData } from "@act";

import axs from "@axios";

import s from "./Header.module.scss";
// TODO: переосмыслить меню. сделать генерацию выпадающего меню и т.д
class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = { activeItem: "Главная" };
  }

  componentDidMount() {
    const { dispatch, menu } = this.props;
    const clonedMenu = { ...menu };

    axs.get(`/menus/topMenu`).then(res => {
      if (!res.data.error) {
        dispatch(storeData, PARAMS.MENU, {
          ...clonedMenu,
          mainMenu: res.data.payload.menu
        });
      }
    });
  }

  getLink(to, name) {
    const { activeItem } = this.state;
    return (
      <Menu.Item
        onClick={this.handleItemClick}
        active={activeItem === name}
        name={name}
        as={Link}
        to={to}
        key={name}
        content={name}
      />
    );
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  generateMenu() {
    const { menu, isUserAuthorized } = this.props;
    const menuArr = [];
    Object.keys(menu.mainMenu).forEach(menuKey => {
      if (menuKey === "always") {
        menu.mainMenu[menuKey].map(el =>
          menuArr.push(this.getLink(el.to, el.name))
        );
      } else if (menuKey === "authorized" && isUserAuthorized) {
        menu.mainMenu[menuKey].map(el =>
          menuArr.push(this.getLink(el.to, el.name))
        );
      } else if (menuKey === "onlyNotAuthorized" && !isUserAuthorized) {
        menu.mainMenu[menuKey].map(el =>
          menuArr.push(this.getLink(el.to, el.name))
        );
      }
    });
    return menuArr;
  }
  // TODO: сделать профиль

  render() {
    const {
      isUserAuthorized,
      isAuthInProgress,
      userInfo,
      headerSegmentStyle,
      headerMenuStyle,
      userRoles
    } = this.props;

    return (
      <Segment
        inverted
        loading={isAuthInProgress}
        className={headerSegmentStyle}
      >
        <Menu inverted pointing secondary className={headerMenuStyle}>
          <Container>
            <>
              {this.generateMenu().map(el => el)}
              {isUserAuthorized ? (
                <Menu.Menu position="right" className={s.rightMenu}>
                  <Image src={userInfo.avatar} avatar />
                  <Dropdown item text={userInfo.login}>
                    <Dropdown.Menu>
                      {userInfo.userGroup === userRoles.admin && (
                        <Dropdown.Item as={Link} to="/dashboard">
                          Dashboard
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item as={Link} to="/profile">
                        Профиль
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/logout">
                        Выход
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Menu>
              ) : (
                ""
              )}
            </>
          </Container>
        </Menu>
      </Segment>
    );
  }
}

export default branch(
  {
    isUserAuthorized: PARAMS.IS_USER_AUTHORIZED,
    isAuthInProgress: PARAMS.IS_AUTH_IN_PROGRESS,
    userInfo: PARAMS.USER_INFO,
    menu: PARAMS.MENU,
    userRoles: PARAMS.USER_ROLES
  },
  Header
);
