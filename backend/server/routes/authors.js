import express from "express";

import withAuth from "../middleware";

import * as config from "../../DB/config";
import { MSG } from "../../../config/msgCodes";

import * as AuthorsContr from "../../DB/controllers/Authors";
import Authors from "../../DB/models/Authors";

const app = express();

app.post("/api/findAuthor/", withAuth, (req, res) => {
  Authors.findOne({ authorName: req.body.authorName }, (err, author) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else if (!author) {
      res.json(
        config.getRespData(true, MSG.cantFindAuthor, {
          authorName: req.body.authorName
        })
      );
    } else {
      res.json(config.getRespData(false, null, author));
    }
  });
});

app.post("/api/addAuthor/", withAuth, (req, res) => {
  AuthorsContr.setAuthor(req.body.authorName, res);
});

app.get("/api/getAuthors/", withAuth, (req, res) => {
  Authors.find({}, (err, author) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else {
      res.json(config.getRespData(false, null, author));
    }
  });
});

export default app;
