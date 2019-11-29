import Mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const { Schema } = Mongoose;

const BookPublishersSchema = new Schema({
  publisherName: {
    type: String,
    unique: true,
    uniqueCaseInsensitive: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  addedByUser: String
});

BookPublishersSchema.plugin(uniqueValidator);

export default Mongoose.model(
  "BookPublishers",
  BookPublishersSchema,
  "bookpublishers"
);
