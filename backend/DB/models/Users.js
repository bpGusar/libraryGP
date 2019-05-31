import Mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const saltRnd = 10;

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
});

UsersSchema.pre('save', function(next) {
  // Check if document is new or a new password has been set
  if (this.isNew || this.isModified('password')) {
    // Saving reference to this because of changing scopes
    const document = this;
    bcrypt.hash(document.password, saltRnd, function(err, hashedPassword) {
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
  bcrypt.compare(pass, this.pass, function(err, same) {
    if (err) {
      cb(err);
    } else {
      cb(err, same);
    }
  });
};

Mongoose.model('Users', UsersSchema);
