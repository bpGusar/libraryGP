import Mongoose from "mongoose";

const { Schema } = Mongoose;

const AuthorsSchema = new Schema({
  authorName: {
    type: String,
    requiared: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export default Mongoose.model("Authors", AuthorsSchema);
