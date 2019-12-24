import express from "express";

import MenusContr from "../../DB/controllers/Menus";

const app = express();

app.get("/api/menus/:menuName", (req, res) => {
  MenusContr.getMenus(req, res);
});

app.put("/api/menus/:menuName", (req, res) => {
  const { newMenu } = req.body;

  MenusContr.saveMenu(req, res, newMenu);
});

export default app;
