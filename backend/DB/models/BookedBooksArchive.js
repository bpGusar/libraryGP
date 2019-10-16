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
    readerId: {
      type: Number
    },
    createdAt: Date
  },
  status: {
    type: String,
    required: true,
    enum: ["rejected", "ordered"]
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
