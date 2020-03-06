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
    default: Date.now(),
    required: true
  },
  lastMessage: {
    message: {
      type: String,
      required: true
    },
    from: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      required: true
    }
  },
  messages: [
    {
      createdAt: {
        type: Date,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      from: {
        type: String,
        ref: "User",
        required: true
      }
    }
  ]
});

export default Mongoose.model("Chats", ChatsSchema);
