import Mongoose from 'mongoose';

import '../models/Users';

const Users = Mongoose.model('Users');

export function getAll() {
  return Users.find();
}

export function setTestData(data) {
  const testData = new Users({
    fname: data.fname,
    sname: data.sname,
  });

  return testData.save();
}
