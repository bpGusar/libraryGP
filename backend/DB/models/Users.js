import Mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = Mongoose.Schema;

const UsersSchema = new Schema({
  login: {
    type: String,
    requiared: true,
    unique: true,
  },
  email: {
    type: String,
    requiared: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userGroup: {
    type: Number,
    required: true,
  },
});

UsersSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('password')) {
    const document = this;
    bcrypt.hash(document.password, Number(process.env.BCRYPT_SALT), function(err, hashedPassword) {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

UsersSchema.methods.isCorrectPassword = function(pass, cb) {
  bcrypt.compare(pass, this.password, function(err, same) {
    if (err) {
      cb(err);
    } else {
      cb(err, same);
    }
  });
};

export default Mongoose.model('Users', UsersSchema);
