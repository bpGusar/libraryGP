import React from "react";
import {
  Menu,
  Segment,
  Dimmer,
  Loader,
  Image,
  Dropdown
} from "semantic-ui-react";
import { Link } from "react-router-dom";

import { branch } from "baobab-react/higher-order";
import { PARAMS } from "@store";
import { storeData } from "@act";

import axs from "@axios";

class Header extends React.Component {
  static handleLogOut() {
    localStorage.removeItem("token");
    document.location.href = "/";
  }

  constructor(props) {
    super(props);

    this.state = { activeItem: "home" };

    this.handleItemClick = this.handleItemClick.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    axs.post("/menu/get", { menuId: "5d0cdd7669529541dc73e657" }).then(res => {
      if (!res.data.msg.error) {
        dispatch(storeData, PARAMS.MENU, res.data.msg.payload.menu);
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

  handleItemClick(e, { name }) {
    this.setState({ activeItem: name });
  }

  generateMenu() {
    const { menu, isUserAuthorized } = this.props;
    const menuArr = [];

    Object.keys(menu).forEach(menuKey => {
      if (menuKey === "always") {
        menu[menuKey].map(el => menuArr.push(this.getLink(el.to, el.name)));
      } else if (menuKey === "authorized" && isUserAuthorized) {
        menu[menuKey].map(el => menuArr.push(this.getLink(el.to, el.name)));
      } else if (menuKey === "onlyNotAuthorized" && !isUserAuthorized) {
        menu[menuKey].map(el => menuArr.push(this.getLink(el.to, el.name)));
      }
    });
    return menuArr;
  }

  render() {
    const { isUserAuthorized, isAuthInProgress, userInfo } = this.props;
    return (
      <Segment inverted>
        <Menu secondary inverted>
          {isAuthInProgress ? (
            <>
              <Dimmer active>
                <Loader />
              </Dimmer>
              <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
            </>
          ) : (
            <>
              {this.generateMenu().map(el => el)}
              {isUserAuthorized ? (
                <Dropdown item text={userInfo.login}>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => Header.handleLogOut()}>
                      Выход
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                ""
              )}
            </>
          )}
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
    menu: PARAMS.MENU
  },
  Header
);
