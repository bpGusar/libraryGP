import * as config from "../config";
import MSG from "../../server/config/msgCodes";

import Menu from "../models/Menu";

function getMenus(req, res) {
  Menu.findOne({ email: req.menuId }, (err, menu) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalServerErr, err));
    } else if (!menu) {
      res.json(config.getRespData(true, MSG.cannotFindMenu));
    } else {
      res.json(config.getRespData(false, null, menu));
    }
  });
}

export default { getMenus };
