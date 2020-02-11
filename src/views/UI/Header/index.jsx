import React from "react";
import { Menu, Dropdown, Container, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

import SearchBox from "@views/Common/SearchBox";

import { branch } from "baobab-react/higher-order";
import { PARAMS } from "@store";
import { storeData } from "@act";

import axs from "@axios";

import s from "./Header.module.scss";

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
          mainMenu: res.data.payload
        });
      }
    });
  }

  getLink(to, name) {
    const { activeItem } = this.state;
    return (
      <Menu.Item
        style={{
          marginBottom: 13
        }}
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

  render() {
    const {
      isUserAuthorized,
      userInfo,
      headerMenuStyle,
      userRoles
    } = this.props;

    return (
      <Menu inverted pointing secondary className={headerMenuStyle}>
        <Container>
          <>
            <Menu.Menu position="left">
              {this.generateMenu().map(el => el)}
            </Menu.Menu>
            <Menu.Menu position="right" className={s.rightMenu}>
              <Menu.Item
                style={{
                  padding: 0
                }}
              >
                <SearchBox />
              </Menu.Item>
              {isUserAuthorized ? (
                <Menu.Item>
                  <Image src={userInfo.avatar} avatar />
                  <Dropdown item text={userInfo.login}>
                    <Dropdown.Menu>
                      {userInfo.userGroup === userRoles.admin.value && (
                        <Dropdown.Item as={Link} to="/dashboard">
                          Dashboard
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item as={Link} to={`/profile/${userInfo._id}`}>
                        Профиль
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/logout">
                        Выход
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Menu.Item>
              ) : (
                ""
              )}
            </Menu.Menu>
          </>
        </Container>
      </Menu>
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
