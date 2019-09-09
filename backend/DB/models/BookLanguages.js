import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BookLanguagesSchema = new Schema({
  languageName: {
    type: String,
    unique: true
  }
});

export default Mongoose.model("BookLanguages", BookLanguagesSchema);
