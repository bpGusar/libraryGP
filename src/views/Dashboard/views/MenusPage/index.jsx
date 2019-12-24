/* eslint-disable no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-plusplus */
import React, { Component } from "react";
import { branch } from "baobab-react/higher-order";
import _ from "lodash";

import MenuEditor from "@commonViews/MenuEditor";

import { PARAMS } from "@store";
import { storeData } from "@act";

import axs from "@axios";

class Menus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  handleSave = newMenuData => {
    const { menu, dispatch } = this.props;
    const clonedMenu = _.cloneDeep(menu);

    clonedMenu.dashboardMenu = newMenuData;

    this.setState({
      isLoading: true
    });

    axs
      .put(`/menus/dashboardMenu`, {
        newMenu: clonedMenu.dashboardMenu
      })
      .then(resp => {
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
    const { menu } = this.props;
    const { isLoading } = this.state;

    return (
      <>
        {!_.isEmpty(menu.dashboardMenu) && !_.isEmpty(menu.dashboardMenu) && (
          <MenuEditor
            menuId="dashboardMenu"
            menuData={menu.dashboardMenu}
            isLoading={isLoading}
            onSave={this.handleSave}
          />
        )}
      </>
    );
  }
}

export default branch(
  {
    menu: PARAMS.MENU
  },
  Menus
);
