import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BlogSchema = new Schema({
  header: String,
  text: String,
  userId: {
    type: String,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export default Mongoose.model("Blog", BlogSchema);
