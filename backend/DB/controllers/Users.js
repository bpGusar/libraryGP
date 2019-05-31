import Mongoose from 'mongoose';

import '../models/Users';

const Users = Mongoose.model('Users');

export function getAll() {
  return Users.find();
}

export function setUserCred(data) {
  const userCred = new Users({
    email: data.email,
    password: data.password,
  });

  return userCred.save();
}
