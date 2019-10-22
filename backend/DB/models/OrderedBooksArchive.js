import Mongoose from "mongoose";

const { Schema } = Mongoose;

const OrderedBooksArchiveSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now()
  },
  orderedBookInfo: {
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
    orderedAt: Date,
    orderedUntil: Date
  },
  comment: {
    type: String,
    default: ""
  },
  userId: {
    type: String,
    required: true
  }
});

export default Mongoose.model(
  "OrderedBooksArchive",
  OrderedBooksArchiveSchema,
  "orderedbooksarchive"
);
