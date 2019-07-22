import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BookSchema = new Schema({
  always: [
    {
      to: String,
      name: String
    }
  ]
});

export default Mongoose.model("Book", BookSchema);
