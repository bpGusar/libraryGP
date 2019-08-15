import Mongoose from "mongoose";

const { Schema } = Mongoose;

const AuthorsSchema = new Schema({
  authorName: {
    type: String,
    requiared: true,
    unique: true
  }
});

export default Mongoose.model("Authors", AuthorsSchema);
