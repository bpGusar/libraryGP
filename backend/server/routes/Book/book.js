import express from "express";

import withAuth from "../../middleware";

// import * as config from "../../../DB/config";
// import { MSG } from "../../../../config/msgCodes";

// import Book from "../../../DB/models/Book";

// import * as BookCategoriesContr from "../../../DB/controllers/BookCategories";

const app = express();

app.post("/api/addBook", withAuth, req => {
  console.log(req.body);
  //   const Book = new Book({ categoryName: catName });
  //   category.save(err => {
  //     if (err) {
  //       res.res.json(getRespData(true, MSG.cantAddNewBookCategory, err));
  //     } else {
  //       res.send(getRespData(false));
  //     }
  //   });
});

export default app;
