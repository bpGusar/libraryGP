import Mongoose from "mongoose";

const { Schema } = Mongoose;

const OrderedBooksArchiveSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now()
  },
  orderedBookInfo: {
    bookInfo: Object,
    userInfo: Object,
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
