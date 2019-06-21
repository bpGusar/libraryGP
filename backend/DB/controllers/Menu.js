import Mongoose from 'mongoose';

import '../models/Menu';

const Menu = Mongoose.model('Menu');

export function getAll() {
  return Menu.find();
}
