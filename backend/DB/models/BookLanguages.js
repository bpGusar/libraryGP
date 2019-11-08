import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BookLanguagesSchema = new Schema({
  languageName: {
    type: String,
    unique: true
  },
  langCode: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export default Mongoose.model(
  "BookLanguages",
  BookLanguagesSchema,
  "booklanguages"
);
