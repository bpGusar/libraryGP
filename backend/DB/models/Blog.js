import Mongoose from "mongoose";

const { Schema } = Mongoose;

const BlogSchema = new Schema({
  header: String,
  text: Object,
  userId: {
    type: String,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  pseudoDeleted: {
    type: String,
    default: "false"
  }
});

export default Mongoose.model("Blog", BlogSchema);
