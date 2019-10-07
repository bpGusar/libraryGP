/* eslint-disable consistent-return */
import express from "express";
import path from "path";
import mkdirp from "mkdirp";
import fs from "fs";

import * as config from "../../DB/config";
import MSG from "../config/msgCodes";

const app = express();

const pathToPostersFolder = path.join(__dirname, "../files/posters/");

app.post("/api/upload/book/poster", (req, res) => {
  const imageFile = req.files.file;
  const uploadFile = () => {
    const imageName = `${req.files.file.md5}_${Date.now()}`;

    imageFile.mv(`${pathToPostersFolder}${imageName}.png`, err => {
      if (err) {
        return res.json(config.getRespData(true, MSG.cannotUploadPoster, err));
      }

      return res.json(
        config.getRespData(false, null, {
          posterPath: `http://localhost:5000/posters/${imageName}.png`
        })
      );
    });
  };

  if (fs.existsSync(pathToPostersFolder)) {
    uploadFile();
  } else {
    mkdirp(pathToPostersFolder, err => {
      if (err) {
        console.log(err);
      } else {
        uploadFile();
      }
    });
  }
});

export default app;
