import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BookPublishersSchema = new Schema({
  publisherName: {
    type: String,
    unique: true
  }
});

export default Mongoose.model("BookPublishers", BookPublishersSchema);
