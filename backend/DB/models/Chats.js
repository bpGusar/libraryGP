import Mongoose from "mongoose";

const { Schema } = Mongoose;

const ChatsSchema = new Schema({
  from: {
    type: String,
    ref: "User"
  },
  to: {
    type: String,
    ref: "User"
  },
  messages: [
    {
      createdAt: {
        type: Date,
        default: Date.now()
      },
      message: String
    }
  ]
});

export default Mongoose.model("Chats", ChatsSchema);
