import React from "react";
import { Menu, Dropdown, Image } from "semantic-ui-react";
import { branch } from "baobab-react/higher-order";
import { Link } from "react-router-dom";

import { PARAMS } from "@store";

import s from "./index.module.scss";

function TopMenu(props) {
  const { userInfo } = props;
  const options = [
    { key: "user", as: Link, to: "/dashboard", text: "Аккаунт", icon: "user" },
    {
      key: "settings",
      as: Link,
      to: "/dashboard",
      text: "Настройки",
      icon: "settings"
    },
    {
      key: "sign-out",
      as: Link,
      to: "/logout",
      text: "Выход",
      icon: "sign out"
    }
  ];
  return (
    <Menu className={s.menu}>
      <Menu.Menu position="right">
        <Dropdown
          item
          trigger={
            <span>
              <Image avatar src={userInfo.avatar} /> {userInfo.login}
            </span>
          }
          options={options}
          pointing="top left"
          icon={null}
        />
      </Menu.Menu>
    </Menu>
  );
}

export default branch(
  {
    userInfo: PARAMS.USER_INFO
  },
  TopMenu
);
