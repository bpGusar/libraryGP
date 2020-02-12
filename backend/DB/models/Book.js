import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BookSchema = new Schema({
  addedByUser: { type: String, required: true },
  dateAdded: { type: String, required: true },
  bookInfo: {
    title: { type: String, required: true },
    authors: [{ type: String, required: true, ref: "Authors" }],
    publisher: [{ type: String, required: true, ref: "BookPublishers" }],
    publishedDate: { type: String, required: true },
    description: { type: String, required: true },
    industryIdentifiers: [
      {
        type: { type: String, required: true },
        identifier: { type: String, required: true }
      },
      {
        type: { type: String, required: true },
        identifier: { type: String, required: true }
      }
    ],
    pageCount: { type: Number, default: 0, required: true },
    categories: [{ type: String, required: true, ref: "BookCategories" }],
    maturityRating: { type: String, required: true },
    imageLinks: {
      poster: { type: String, required: true }
    },
    language: [{ type: String, required: true, ref: "BookLanguages" }]
  },
  stockInfo: {
    freeForBooking: { type: Number, default: 0, required: true },
    maxAvailableBooks: {
      type: Number,
      default: 0,
      required: true
    }
  },
  editInfo: [
    {
      editedAt: Date,
      comment: String,
      userId: String
    }
  ],
  pseudoDeleted: {
    type: String,
    default: "false"
  }
});

export default Mongoose.model("Book", BookSchema, "books");
