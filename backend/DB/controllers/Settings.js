import Settings from "../models/Settings";

import MSG from "../../config/msgCodes";
import * as config from "../config";

function updateSettings(req, res) {
  const { settings } = req.body;

  Settings.update({ _id: "5e43cc7d44d3965198f91ff2" }, { settings }, err => {
    if (err) {
      res.json(config.getRespData(true, MSG.cantUpdateSettings, err));
    } else {
      res.json(config.getRespData(false, MSG.settingsWasUpdated));
    }
  });
}
function getSettings(req, res) {
  Settings.findOne({ _id: "5e43cc7d44d3965198f91ff2" }, (err, settings) => {
    if (err) {
      res.json(config.getRespData(true, MSG.cantUpdateSettings, err));
    } else {
      res.json(config.getRespData(false, MSG.settingsWasUpdated, settings));
    }
  });
}

export default { updateSettings, getSettings };
