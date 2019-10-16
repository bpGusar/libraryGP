import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BookedBooksArchiveSchema = new Schema({
  orderInfo: {
    bookId: {
      type: String,
      ref: "Book"
    },
    userId: {
      type: String,
      ref: "User"
    },
    readerId: {
      type: Number
    },
    createdAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: String,
    enum: ["rejected"]
  },
  comment: {
    type: String,
    default: ""
  }
});

export default Mongoose.model(
  "BookedBooksArchive",
  BookedBooksArchiveSchema,
  "bookedbooksarchive"
);
