import Mongoose from "mongoose";

const { Schema } = Mongoose;

const ChatsSchema = new Schema({
  members: [
    {
      type: String,
      required: true,
      ref: "User"
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  lastMessage: {
    message: String,
    from: String
  },
  messages: [
    {
      createdAt: {
        type: Date,
        default: Date.now()
      },
      message: String,
      from: String
    }
  ]
});

export default Mongoose.model("Chats", ChatsSchema);
