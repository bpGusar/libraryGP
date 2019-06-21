import Mongoose from 'mongoose';

import { MSG_KEYS } from '../../../config/msgCodes';
import { getMsgByCode } from '../config';

import '../models/Users';

const Users = Mongoose.model('Users');

export function getAll() {
  return Users.find();
}

export function setUserCred(data) {
  const { login, email, password, userGroup } = data;
  const user = new Users({ login, email, password, userGroup });
  user.save(function(err) {
    if (err) {
      data.res.status(500).json({ msg: getMsgByCode(MSG_KEYS.registrationError), err });
    } else {
      data.res.status(200).send({ msg: getMsgByCode(MSG_KEYS.registrationSuccess) });
    }
  });
}
