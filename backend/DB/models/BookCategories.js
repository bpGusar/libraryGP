import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BookCategoriesSchema = new Schema({
  categoryName: {
    type: String
  }
});

export default Mongoose.model("BookCategories", BookCategoriesSchema);
