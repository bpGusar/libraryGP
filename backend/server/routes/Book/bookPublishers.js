import express from "express";

import withAuth from "../../middleware";

import * as config from "../../../DB/config";
import { MSG } from "../../../../config/msgCodes";

import BookPublishers from "../../../DB/models/BookPublishers";

const app = express();

app.get("/api/bookPublishers/get/all/", withAuth, (req, res) => {
  BookPublishers.find({}, (err, categories) => {
    if (err) {
      res.json(config.getRespData(true, MSG.internalErr500, err));
    } else {
      res.json(config.getRespData(false, null, categories));
    }
  });
});

app.post("/api/bookPublishers/add/one/", withAuth, (req, res) => {
  const publisher = new BookPublishers({
    publisherName: req.body.publisherName
  });
  publisher.save(err => {
    if (err) {
      res.res.json(config.getRespData(true, MSG.cantAddNewBookCategory, err));
    } else {
      res.send(config.getRespData(false));
    }
  });
});

app.post("/api/bookPublishers/find/one/", withAuth, (req, res) => {
  BookPublishers.findOne(
    { publisherName: req.body.publisherName },
    (err, publisher) => {
      if (err) {
        res.json(config.getRespData(true, MSG.internalErr500, err));
      } else if (!publisher) {
        res.json(
          config.getRespData(true, MSG.cantFindAuthor, {
            publisherName: req.body.publisherName
          })
        );
      } else {
        res.json(config.getRespData(false, null, publisher));
      }
    }
  );
});

export default app;
