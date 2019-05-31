import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';

import * as config from '../DB/config';
import * as Users from '../DB/controllers/Users';

const app = express();
const secret = 'mysecretsshhh';

config.setUpConnection();

app.use(bodyParser.json());
app.use(cors());

app.listen(config.dbConfig.port, () => {
  console.log(`Server is up and running on port ${config.dbConfig.port}`);
});

app.get('/api/', (req, res) => {
  Users.getAll().then((data) => res.send(data));
});

app.post('/api/register', (req, res) => {
  Users.setUserCred({
    login: 'admin',
    email: 'admin@admin.kek',
    password: '123412341234123',
    res,
  });
});


// сделать авторизацию