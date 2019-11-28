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
  },
  addedByUser: String
});

export default Mongoose.model("Authors", AuthorsSchema);
