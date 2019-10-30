import Mongoose from "mongoose";

const { Schema } = Mongoose;

const MenuSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now()
  },
  menuName: String,
  menu: {
    always: [],
    authorized: [],
    onlyNotAuthorized: []
  }
});

export default Mongoose.model("Menu", MenuSchema, "menus");
