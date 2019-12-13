import fs from "fs";
import path from "path";
import * as config from "../config";
// import MSG from "../../config/msgCodes";

function getMenus(res) {
  const jsonFile = fs.readFileSync(
    path.join(__dirname, `../../config/menus/dashboardMenu.json`)
  );
  res.json(config.getRespData(false, null, JSON.parse(jsonFile)));
}

function saveMenu(res, newMenu) {
  const data = JSON.stringify(newMenu);
  fs.writeFileSync(
    path.join(__dirname, `../../config/menus/dashboardMenu.json`),
    data
  );
  res.json(config.getRespData(false, null, newMenu));
}

export default { getMenus, saveMenu };
