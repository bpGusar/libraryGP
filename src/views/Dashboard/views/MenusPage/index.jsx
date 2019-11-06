import React, { Component } from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { branch } from "baobab-react/higher-order";
import _ from "lodash";

import { List } from "semantic-ui-react";
import MenuItemWrapper from "./MenuItemWrapper";

import { PARAMS } from "@store";
// TODO: доделать редактирование меню
// eslint-disable-next-line react/prefer-stateless-function
class Menus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menus: props.menu
    };

    this.menuItems = {
      dropdown: (el, i) => {
        const dropItem = dropItemEl => (
          <MenuItemWrapper
            key={el.text}
            index={i}
            moveCard={this.moveCard}
            cildren={
              <List.Item>
                {!_.isEmpty(dropItemEl.icon) && (
                  <List.Icon name={dropItemEl.icon} />
                )}
                <List.Content>
                  <List.Header>{dropItemEl.text}</List.Header>
                </List.Content>
              </List.Item>
            }
          />
        );
        return (
          <MenuItemWrapper
            key={el.text}
            index={i}
            moveCard={this.moveCard}
            cildren={
              <List.Item>
                {!_.isEmpty(el.icon) && <List.Icon name={el.icon} />}
                <List.Content>
                  <List.Header>{el.text}</List.Header>
                  <List.List>
                    {el.items.map(menuItem => dropItem(menuItem))}
                  </List.List>
                </List.Content>
              </List.Item>
            }
          />
        );
      },
      simple: (el, i) => (
        <MenuItemWrapper
          key={el.to}
          index={i}
          moveCard={this.moveCard}
          cildren={
            <List.Item>
              {!_.isEmpty(el.icon) && <List.Icon name={el.icon} />}
              <List.Content>
                <List.Header>{el.text}</List.Header>
              </List.Content>
            </List.Item>
          }
        />
      )
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { menus } = this.state;
    const { menu } = this.props;
    if (JSON.stringify(menu) !== JSON.stringify(nextProps.menu)) {
      this.setState(
        {
          menus: nextProps.menu
        },
        () => true
      );
      this.forceUpdate();
    } else if (JSON.stringify(menus) !== JSON.stringify(nextState.menus)) {
      this.setState(
        {
          menus: nextState.menus
        },
        () => true
      );
      this.forceUpdate();
    }
    return false;
  }

  moveCard = (dragIndex, hoverIndex) => {
    const { menus } = this.state;
    const clonedMenu = _.cloneDeep(menus);
    const dragCard = clonedMenu.dashboardMenu.always[dragIndex];

    clonedMenu.dashboardMenu.always.splice(dragIndex, 1); // removing what you are dragging.
    clonedMenu.dashboardMenu.always.splice(hoverIndex, 0, dragCard); // inserting it into hoverIndex.

    this.setState({
      menus: clonedMenu
    });
  };

  render() {
    const { menus } = this.state;
    return (
      <DndProvider backend={HTML5Backend}>
        {!_.isEmpty(menus.dashboardMenu.always) && (
          <List>
            {menus.dashboardMenu.always.map((el, i) =>
              this.menuItems[el.type](el, i)
            )}
          </List>
        )}
      </DndProvider>
    );
  }
}

export default branch(
  {
    menu: PARAMS.MENU
  },
  Menus
);
