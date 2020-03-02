import Chats from "../models/Chats";
import _ from "lodash";

import MSG from "../../config/msgCodes";
import * as config from "../config";

function getChats(req, res) {
  const {
    middlewareUserInfo,
    params: { userId }
  } = req;

  if (_.toString(middlewareUserInfo._id) !== _.toString(userId)) {
    res.json(config.getRespData(false, "низя", null));
    return;
  } else {
    Chats.find({ from: userId })
      .populate([
        {
          path: "from",
          select:
            "-password -emailVerified -userGroup -createdAt -readerId -email -login"
        },
        {
          path: "to",
          select:
            "-password -emailVerified -userGroup -createdAt -readerId -email -login"
        }
      ])
      .exec((err, chatsArr) => {
        if (err) {
          res.json(config.getRespData(true, MSG.cantUpdateSettings, err));
        } else {
          res.json(config.getRespData(false, MSG.settingsWasUpdated, chatsArr));
        }
      });
  }
}

export default { getChats };
