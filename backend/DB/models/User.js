import Mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = Mongoose;

const UserSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now()
  },
  readerId: {
    type: Number
  },
  login: {
    type: String,
    requiared: true,
    unique: true
  },
  firstName: {
    type: String,
    requiared: true
  },
  lastName: {
    type: String,
    requiared: true
  },
  patronymic: {
    type: String
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
    required: true,
    default: 0
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  avatar: String
});

UserSchema.pre("save", function(next) {
  if (this.isNew || this.isModified("password")) {
    const document = this;
    document.readerId = new Date().getTime();
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

UserSchema.methods.isCorrectPassword = function(bodyPass, userPass, cb) {
  bcrypt.compare(bodyPass, userPass, (err, same) => {
    if (err) {
      cb(err);
    } else {
      cb(err, same);
    }
  });
};

export default Mongoose.model("User", UserSchema);
