import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BookedBooksSchema = new Schema({
  bookId: {
    type: String,
    ref: "Book"
  },
  userId: {
    type: String,
    ref: "User"
  },
  readerId: Number,
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export default Mongoose.model("BookedBooks", BookedBooksSchema, "bookedbooks");
