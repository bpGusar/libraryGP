import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BookSchema = new Schema({
  userIdWhoAddedBookInDb: { type: String, requiared: true },
  dateAdded: { type: String, requiared: true },
  bookInfo: {
    title: { type: String, requiared: true },
    authors: [{ type: String, requiared: true }],
    publisher: { type: String, requiared: true },
    publishedDate: { type: String, requiared: true },
    description: { type: String, requiared: true },
    industryIdentifiers: [
      {
        type: { type: String, requiared: true },
        identifier: { type: String, requiared: true }
      },
      {
        type: { type: String, requiared: true },
        identifier: { type: String, requiared: true }
      }
    ],
    pageCount: { type: Number, default: 0, requiared: true },
    categories: [{ type: String, requiared: true }],
    maturityRating: { type: String, requiared: true },
    imageLinks: {
      poster: { type: String, requiared: true }
    },
    language: { type: String, requiared: true }
  },
  stockInfo: {
    quantityInStock: { type: Number, default: 0, requiared: true }
  }
});

export default Mongoose.model("Book", BookSchema);
