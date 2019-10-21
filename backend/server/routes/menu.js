import express from "express";

import * as config from "../../DB/config";
import MSG from "../config/msgCodes";

import Menu from "../../DB/models/Menu";

import MenusContr from "../../DB/controllers/Menus";

const app = express();

app.get("/api/menus/:menuName", (req, res) => {
  MenusContr.getMenus(req, res);
});

app.put("/api/menus/:id", (req, res) => {
  const newmenu = {
    menu: {
      always: [
        {
          to: "/",
          name: "Главная"
        }
      ],
      authorized: [
        {
          to: "/secret",
          name: "Секрет"
        },
        {
          to: "/346345634",
          name: "34563456345"
        }
      ],
      onlyNotAuthorized: [
        {
          to: "/login",
          name: "Вход"
        }
      ]
    }
  };
  Menu.update({ _id: req.params.id }, { ...newmenu }, err => {
    if (err) {
      res.json(config.getRespData(true, MSG.cannotUpdateMenu, err));
    } else {
      res.json(config.getRespData(false, MSG.menuWasUpdated));
    }
  });
});

export default app;
