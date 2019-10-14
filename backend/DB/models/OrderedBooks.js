import Mongoose from "mongoose";

import servConf from "../../server/config/server.json";

const { Schema } = Mongoose;

const OrderedBooksSchema = new Schema({
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
  orderedAt: {
    type: Date,
    default: Date.now()
  },
  orderedUntil: Date
});

// TODO: сделать крон для отправки имейла за 3 дня до даты сдачи книги
// TODO: сделать крон для отправки имейла если книга просрочена
OrderedBooksSchema.pre("save", function(next) {
  const document = this;

  const orderedUntilDate = new Date();
  orderedUntilDate.setDate(
    orderedUntilDate.getDate() + servConf.theRaderCanTakeTheBookForDays
  );

  document.orderedUntil = orderedUntilDate;
  next();
});

export default Mongoose.model(
  "OrderedBooks",
  OrderedBooksSchema,
  "orderedbooks"
);
