import Mongoose from "mongoose";

import "../models/Menu";

const Menu = Mongoose.model("Menu");

function getAll() {
  return Menu.find();
}

export default { getAll };
