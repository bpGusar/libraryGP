import Mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const { Schema } = Mongoose;

const BookCategoriesSchema = new Schema({
  categoryName: {
    type: String,
    unique: true,
    uniqueCaseInsensitive: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  addedByUser: String
});

BookCategoriesSchema.plugin(uniqueValidator);

export default Mongoose.model(
  "BookCategories",
  BookCategoriesSchema,
  "bookcategories"
);
