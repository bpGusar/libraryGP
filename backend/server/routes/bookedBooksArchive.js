import express from "express";

import withAuth from "../middleware";

import BookedBooksArchiveContr from "../../DB/controllers/BookedBooksArchive";

const app = express();

app.post("/api/bookedBooksArchive/add", withAuth, (req, res) => {
  BookedBooksArchiveContr.addBookedBookInAchive(req.body, res);
});

export default app;
