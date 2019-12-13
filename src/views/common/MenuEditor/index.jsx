/* eslint-disable no-plusplus */
import React, { Component } from "react";
import _ from "lodash";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import { Segment } from "semantic-ui-react";
import SimpleItem from "./components/SimpleItem";
import ParentItem from "./components/ParentItem";
import NewItem from "./components/NewItem";
import SaveChanges from "./components/SaveChanges";

import s from "./index.module.scss";

/**
 * Визуальный редактор меню.
 *
 * @param {String} menuId Уникальное ID меню. Если не указано вернет `undefined`.
 * @param {Array} menuData Массив с элементами меню.
 * @example
 *
 * // Пример простого элемента
   // type = simple
   // Не имеет параметра items
 *  [
      {
        "id": "zzivh3sck3fmwqlt",
        "text": "Главная",
        "type": "simple",
        "to": "/test",
        "icon": ""
      }
      ...
    ]

    // Пример элемента с дочерними элементами
    // type = dropdown
    // Имеет параметр items с дочерними элементами
    // Если в items не будет элементов, родитель будет преобразован в type = simple элемент
    // Элементы в items могут быть только type simple
    // Не имеет параметра to
    [
      {
        "id": "zzivh3sck3fmwqlu",
        "type": "dropdown",
        "text": "Главная",
        "icon": "",
        "items": [
          {
            "id": "zzivh3sck3fmwqlv",
            "type": "simple",
            "text": "Дочерняя ссылка",
            "to": "/child-link",
            "icon": "add"
          }
          ...
        ]
      }
      ...
    ]
 *
 * @param {Boolean} isLoading Параметр определяет, будет ли показываться кольцо загрузки или нет.
 * @param {Function} onSave Функция которая вернет два параметра:
 * @param {Array} menu Массив с измененным меню.
 */
class MenuEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: [],
      modifiedOrNewItems: {},
      showSave: false
    };
  }

  componentDidMount() {
    const { menuData } = this.props;
    this.setState({
      menu: menuData
    });
  }

  menuItems = () => {
    const { modifiedOrNewItems } = this.state;
    return {
      dropdown: (el, i) => (
        <ParentItem
          element={el}
          key={el.id}
          index={i}
          moveCard={this.moveCard}
          onSubmit={this.addNewItem}
          status={modifiedOrNewItems[el.id]}
          onDelete={this.handleDeleteItem}
          onSaveEdit={this.handleEditItem}
        >
          {el.items.map((menuItem, idx) => (
            <SimpleItem
              key={menuItem.id}
              isChildItem
              itemType="child"
              className={s.childItem}
              element={menuItem}
              index={idx}
              moveCard={this.moveCard}
              status={modifiedOrNewItems[menuItem.id]}
              onDelete={this.handleDeleteItem}
              onSaveEdit={this.handleEditItem}
            />
          ))}
        </ParentItem>
      ),
      simple: (el, i) => (
        <SimpleItem
          onSubmit={this.addNewItem}
          itemType="simple"
          key={el.id}
          isChildItem={false}
          className={s.parentItem}
          element={el}
          index={i}
          moveCard={this.moveCard}
          status={modifiedOrNewItems[el.id]}
          onDelete={this.handleDeleteItem}
          onSaveEdit={this.handleEditItem}
        />
      )
    };
  };

  moveCard = (hoverId, itemId) => {
    const { menu } = this.state;
    const { menuData } = this.props;
    const clonedMenu = _.cloneDeep(menu);

    const getSubMenuItem = (subMenuItems, id) => {
      const hoverIndex = subMenuItems.findIndex(
        menuItem => menuItem.id === hoverId
      );
      if (subMenuItems) {
        subMenuItems.forEach(menuElem => {
          if (menuElem.id === id && hoverIndex !== -1) {
            subMenuItems.splice(
              subMenuItems.findIndex(menuItem => menuItem.id === menuElem.id),
              1
            ); // удаляем перемещаемый элемент
            subMenuItems.splice(hoverIndex, 0, menuElem); // вставляем его туда куда наводим
            return;
          }
          if (_.has(menuElem, "items")) getSubMenuItem(menuElem.items, id);
        });
      }
    };

    getSubMenuItem(clonedMenu, itemId);

    this.setState({
      menu: clonedMenu,
      showSave: JSON.stringify(menuData) !== JSON.stringify(clonedMenu)
    });
  };

  addNewItem = (element, itemData) => {
    const { menu, modifiedOrNewItems } = this.state;

    const clonedMenu = _.cloneDeep(menu);
    const menuItem = this.recursivelyFindItem(clonedMenu, element.id);

    if (menuItem && menuItem.element.type === "dropdown") {
      menuItem.element.items.push(itemData);
    } else if (menuItem && menuItem.element.type === "simple") {
      menuItem.element.type = "dropdown";
      menuItem.element.items = [itemData];

      delete menuItem.element.to;
    } else if (element === "lvl1") {
      clonedMenu.push(itemData);
    }

    this.setState({
      menu: clonedMenu,
      modifiedOrNewItems: {
        ...modifiedOrNewItems,
        [itemData.id]: "new"
      },
      showSave: true
    });
  };

  /**
   * ВНИМАНИЕ!
   *
   * Возвращает ССЫЛКИ на объекты или массивы!
   */
  recursivelyFindItem = (subMenuItems, id) => {
    if (subMenuItems) {
      for (let i = 0; i < subMenuItems.length; i++) {
        if (subMenuItems[i].id === id) {
          return {
            element: subMenuItems[i],
            parent: subMenuItems,
            index: i
          };
        }
        const found = this.recursivelyFindItem(subMenuItems[i].items, id);
        if (found)
          return {
            element: found.element,
            parent: subMenuItems[i],
            index: found.index
          };
      }
    }
  };

  handleDeleteItem = elem => {
    const { menu } = this.state;
    const { menuData } = this.props;

    const clonedMenu = _.cloneDeep(menu);
    const menuItem = this.recursivelyFindItem(clonedMenu, elem.id);

    if (_.isArray(menuItem.parent)) {
      menuItem.parent.splice(menuItem.index, 1);
    } else {
      menuItem.parent.items.splice(menuItem.index, 1);

      if (_.isEmpty(menuItem.parent.items)) {
        delete menuItem.parent.items;

        menuItem.parent.to = "";
        menuItem.parent.type = "simple";
      }
    }

    this.setState({
      menu: clonedMenu,
      showSave: JSON.stringify(menuData) !== JSON.stringify(clonedMenu)
    });
  };

  handleEditItem = elem => {
    const { menu, modifiedOrNewItems } = this.state;
    const { menuData } = this.props;

    const clonedMenu = _.cloneDeep(menu);
    const menuItem = this.recursivelyFindItem(clonedMenu, elem.id);

    Object.keys(elem).forEach(key => {
      menuItem.element[key] = elem[key];
    });

    this.setState({
      menu: clonedMenu,
      modifiedOrNewItems:
        !_.isUndefined(modifiedOrNewItems[elem.id]) &&
        modifiedOrNewItems[elem.id] !== "edited"
          ? modifiedOrNewItems
          : {
              ...modifiedOrNewItems,
              [elem.id]: "edited"
            },
      showSave: JSON.stringify(menuData) !== JSON.stringify(clonedMenu)
    });
  };

  handleSave = () => {
    const { menu } = this.state;
    const { onSave, menuId } = this.props;
    onSave(menu, menuId);

    this.setState({
      modifiedOrNewItems: {},
      showSave: false
    });
  };

  handleCancel = () => {
    const { menuData } = this.props;
    this.setState({
      menu: menuData,
      modifiedOrNewItems: {},
      showSave: false
    });
  };

  render() {
    const { menu, showSave } = this.state;
    const { isLoading } = this.props;
    return (
      <Segment loading={isLoading}>
        <SaveChanges
          saveActive={!showSave}
          disableActive={!showSave}
          onSave={this.handleSave}
          onCancel={this.handleCancel}
        />
        <DndProvider backend={HTML5Backend}>
          <div className={s.menuList}>
            {menu.map((el, i) => this.menuItems()[el.type](el, i))}
          </div>
        </DndProvider>
        <NewItem onSubmit={this.addNewItem} element="lvl1" />
      </Segment>
    );
  }
}

export default MenuEditor;
