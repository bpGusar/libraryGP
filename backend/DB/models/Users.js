import Mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = Mongoose;

const UsersSchema = new Schema({
  login: {
    type: String,
    requiared: true,
    unique: true
  },
  email: {
    type: String,
    requiared: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userGroup: {
    type: Number,
    required: true
  }
});

UsersSchema.pre("save", next => {
  if (this.isNew || this.isModified("password")) {
    const document = this;
    bcrypt.hash(
      document.password,
      Number(process.env.BCRYPT_SALT),
      (err, hashedPassword) => {
        if (err) {
          next(err);
        } else {
          document.password = hashedPassword;
          next();
        }
      }
    );
  } else {
    next();
  }
});

UsersSchema.methods.isCorrectPassword = (bodyPass, userPass, cb) => {
  bcrypt.compare(bodyPass, userPass, (err, same) => {
    if (err) {
      cb(err);
    } else {
      cb(err, same);
    }
  });
};

export default Mongoose.model("Users", UsersSchema);
