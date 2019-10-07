import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BookCategoriesSchema = new Schema({
  categoryName: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export default Mongoose.model(
  "BookCategories",
  BookCategoriesSchema,
  "bookcategories"
);
