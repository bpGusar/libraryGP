import express from "express";
import uniqid from "uniqid";

import * as config from "../../DB/config";
import MSG from "../config/msgCodes";

import Menu from "../../DB/models/Menu";

import MenusContr from "../../DB/controllers/Menus";

const app = express();

app.get("/api/menus/:menuName", (req, res) => {
  MenusContr.getMenus(req, res);
});

app.post("/api/menus/", (req, res) => {
  const MenuModel = new Menu({
    menuName: "dashboardMenu",
    menu: {
      always: [
        {
          id: uniqid(),
          text: "Главная",
          type: "simple",
          to: "/dashboard",
          icon: ""
        },
        {
          id: uniqid(),
          type: "dropdown",
          text: "Книги",
          items: [
            {
              id: uniqid(),
              type: "simple",
              text: "Добавить новую",
              to: "/dashboard/books/find",
              icon: "add"
            },
            {
              id: uniqid(),
              type: "simple",
              text: "Управление бронированием",
              to: "/dashboard/books/booking-management",
              icon: "book"
            },
            {
              id: uniqid(),
              type: "simple",
              text: " Управление выданными книгами",
              to: "/dashboard/books/orders-management",
              icon: "book"
            },
            {
              id: uniqid(),
              type: "simple",
              text: "Все книги",
              to: "/dashboard/books/book-list",
              icon: "list"
            }
          ]
        },

        {
          id: uniqid(),
          type: "dropdown",
          text: "Пользователи",
          items: [
            {
              id: uniqid(),
              type: "simple",
              text: "Добавить нового",
              to: "/dashboard/users/new",
              icon: "add"
            },
            {
              id: uniqid(),
              type: "simple",
              text: "Список пользователей",
              to: "/dashboard/users/list",
              icon: "list"
            }
          ]
        }
      ],
      authorized: [],
      onlyNotAuthorized: []
    }
  });

  MenuModel.save(saveError => {
    if (saveError) {
      res.json(config.getRespData(true, MSG.cannotUpdateMenu, saveError));
    } else {
      res.json(config.getRespData(false, MSG.menuWasUpdated));
    }
  });
});

app.put("/api/menus/:menuId", (req, res) => {
  const { menuId } = req.params;
  const { newMenu } = req.body;

  Menu.findOneAndUpdate(
    { _id: menuId },
    { ...newMenu },
    { new: true },
    (err, menu) => {
      if (err) {
        res.json(config.getRespData(true, MSG.cannotUpdateMenu, err));
      } else {
        res.json(config.getRespData(false, MSG.menuWasUpdated, menu));
      }
    }
  );
});

export default app;
