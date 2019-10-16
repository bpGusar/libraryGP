import express from "express";

import withAuth from "../middleware";

import BookedBooksArchiveContr from "../../DB/controllers/BookedBooksArchive";

const app = express();

app.post("/api/bookedBooksArchive/rejectOrdering", withAuth, (req, res) => {
  BookedBooksArchiveContr.rejectOrdering(req.body, res);
});

export default app;
