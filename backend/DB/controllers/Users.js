import Mongoose from 'mongoose';

import '../models/Users';

const Users = Mongoose.model('Users');

export function getAll() {
  return Users.find();
}

export function setUserCred(data) {
  const { login, email, password } = data;
  const user = new Users({ login, email, password });
  user.save(function(err) {
    if (err) {
      data.res.status(500).send('Error registering new user please try again.');
    } else {
      data.res.status(200).send('Welcome to the club!');
    }
  });
}
