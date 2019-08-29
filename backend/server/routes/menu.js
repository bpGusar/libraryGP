import express from "express";

import * as config from "../../DB/config";
import { MSG } from "../../../config/msgCodes";

import Menu from "../../DB/models/Menu";

const app = express();

app.post("/api/getMenu", (req, res) => {
  Menu.findOne({ email: req.menuId }, (err, menu) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else if (!menu) {
      res.json(config.getRespData(true, MSG.cannotFindMenu));
    } else {
      res.json(config.getRespData(false, null, menu));
    }
  });
});

app.put("/api/menu", (req, res) => {
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
  Menu.update({ _id: "5d0cdd7669529541dc73e657" }, { ...newmenu }, err => {
    if (err) {
      res.json(config.getRespData(true, MSG.cannotUpdateMenu, err));
    } else {
      res.json(config.getRespData(false, MSG.menuWasUpdated));
    }
  });
});

export default app;
