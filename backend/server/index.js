import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import * as config from '../DB/config';
import * as Users from '../DB/controllers/Users';

const app = express();

config.setUpConnection();

app.use(bodyParser.json());
app.use(cors());

app.listen(config.dbConfig.port, () => {
  console.log(`Server is up and running on port ${config.dbConfig.port}`);
});

app.get('/', (req, res) => {
  Users.getAll().then((data) => res.send(data));
});

app.get('/setUser', (req, res) => {
  Users
    .setTestData({
      fname: 'asdgfasdfads',
      sname: '123412341234123',
    })
    .then((data) => res.send(data));
});
