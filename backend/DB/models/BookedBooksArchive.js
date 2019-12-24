import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BookedBooksArchiveSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now()
  },
  bookedBookInfo: {
    bookId: {
      type: String,
      ref: "Book"
    },
    userId: {
      type: String,
      ref: "User"
    },
    createdAt: Date
  },
  status: {
    type: String,
    required: true,
    enum: ["rejected", "ordered", "canceled"]
  },
  comment: {
    type: String,
    default: ""
  },
  userId: {
    type: String,
    ref: "User"
  }
});

export default Mongoose.model(
  "BookedBooksArchive",
  BookedBooksArchiveSchema,
  "bookedbooksarchive"
);
