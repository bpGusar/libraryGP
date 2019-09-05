import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BookLanguagesSchema = new Schema({
  languageName: {
    type: String
  }
});

export default Mongoose.model("BookLanguages", BookLanguagesSchema);
