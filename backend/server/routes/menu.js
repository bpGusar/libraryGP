import express from "express";

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
    menuName: "topMenu",
    menu: {
      always: [
        {
          to: "/",
          name: "Главная"
        }
      ],
      authorized: [],
      onlyNotAuthorized: [
        {
          to: "/login",
          name: "Вход"
        }
      ]
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

app.put("/api/menus", (req, res) => {
  const newmenu = {};
  Menu.update({ _id: "5db94f2e4321e23ab46dc649" }, { ...newmenu }, err => {
    if (err) {
      res.json(config.getRespData(true, MSG.cannotUpdateMenu, err));
    } else {
      res.json(config.getRespData(false, MSG.menuWasUpdated));
    }
  });
});

export default app;
