import Mongoose from "mongoose";

const { Schema } = Mongoose;

const SettingsSchema = new Schema({
  settings: {
    showHiddenBooksOnMainPage: ""
  }
});

export default Mongoose.model("settings", SettingsSchema, "settings");
