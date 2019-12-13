import express from "express";
// import uniqid from "uniqid";

// import * as config from "../../DB/config";
// import MSG from "../../config/msgCodes";

import MenusContr from "../../DB/controllers/Menus";

const app = express();

app.get("/api/menus/:menuName", (req, res) => {
  MenusContr.getMenus(res);
});

app.put("/api/menus/dashboard", (req, res) => {
  const { newMenu } = req.body;

  MenusContr.saveMenu(res, newMenu);
});

export default app;
