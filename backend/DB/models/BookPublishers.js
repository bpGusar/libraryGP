import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BookPublishersSchema = new Schema({
  publisherName: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export default Mongoose.model("BookPublishers", BookPublishersSchema);
