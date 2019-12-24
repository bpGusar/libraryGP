import Mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const { Schema } = Mongoose;

const AuthorsSchema = new Schema({
  authorName: {
    type: String,
    requiared: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  addedByUser: String
});

AuthorsSchema.plugin(uniqueValidator);

export default Mongoose.model("Authors", AuthorsSchema);
