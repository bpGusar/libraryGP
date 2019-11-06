import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BooksArchiveSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now()
  },
  book: Object,
  userId: {
    type: String,
    required: true
  }
});

export default Mongoose.model(
  "BooksArchive",
  BooksArchiveSchema,
  "booksarchive"
);
