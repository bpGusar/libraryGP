import Mongoose from "mongoose";

const { Schema } = Mongoose;

const MenuSchema = new Schema({
  menu: {
    always: [
      {
        to: String,
        name: String
      }
    ],
    authorized: [
      {
        to: String,
        name: String
      }
    ],
    onlyNotAuthorized: [
      {
        to: String,
        name: String
      }
    ]
  }
});

export default Mongoose.model("Menu", MenuSchema);
