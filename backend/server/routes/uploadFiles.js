/* eslint-disable consistent-return */
import express from "express";
import path from "path";

import * as config from "../../DB/config";
import { MSG } from "../../../config/msgCodes";

const app = express();

const pathToPostersFolder = path.join(__dirname, "../files/posters/");

app.post("/api/uploadBookPoster", (req, res) => {
  const imageFile = req.files.file;
  imageFile.mv(`${pathToPostersFolder}${req.files.file.md5}.png`, err => {
    if (err) {
      return res.json(config.getRespData(true, MSG.cannotUploadPoster, err));
    }

    return res.json(
      config.getRespData(false, null, {
        posterPath: `http://localhost:5000/images/${req.files.file.md5}.png`
      })
    );
  });
});

export default app;
