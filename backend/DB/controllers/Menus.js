import fs from "fs";
import path from "path";
import * as config from "../config";
// import Menu from "../models/Menu";

function getMenus(req, res) {
  const jsonFile = fs.readFileSync(
    path.join(__dirname, `../../config/menus/${req.params.menuName}.json`)
  );
  res.json(config.getRespData(false, null, JSON.parse(jsonFile)));
}

function saveMenu(req, res, newMenu) {
  const data = JSON.stringify(newMenu);
  fs.writeFileSync(
    path.join(__dirname, `../../config/menus/${req.params.menuName}.json`),
    data
  );
  res.json(config.getRespData(false, null, newMenu));
}

export default { getMenus, saveMenu };
