import express from "express";

import withAuth from "../middleware";

import BookPublishersContr from "../../DB/controllers/BookPublishers";

const app = express();

app.get("/api/bookPublishers", withAuth, (req, res) =>
  BookPublishersContr.findPublishers(res)
);

app.post("/api/bookPublishers", withAuth, (req, res) =>
  BookPublishersContr.addOnePublisher(req.body, res)
);

export default app;
