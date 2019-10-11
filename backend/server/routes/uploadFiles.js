/* eslint-disable consistent-return */
import express from "express";
import path from "path";
import mkdirp from "mkdirp";
import fs from "fs";

import * as config from "../../DB/config";
import MSG from "../config/msgCodes";
import servConf from "../config/server.json";
import withAuth from "../middleware";

const app = express();

const pathToPostersFolder = path.join(
  __dirname,
  `../${servConf.filesPaths.bookPoster.tempFolder}`
);

app.post("/api/upload/book/poster/temp", withAuth, (req, res) => {
  const imageFile = req.files.file;
  const uploadFile = () => {
    const imageName = `${req.files.file.md5}_${Date.now()}.png`;

    imageFile.mv(`${pathToPostersFolder}${imageName}`, err => {
      if (err) {
        return res.json(config.getRespData(true, MSG.cannotUploadPoster, err));
      }

      return res.json(
        config.getRespData(false, null, {
          posterPath: `http://localhost:${process.env.BACK_PORT}${servConf.filesPaths.bookPoster.urlToPostersTemp}/${imageName}`
        })
      );
    });
  };

  if (fs.existsSync(pathToPostersFolder)) {
    uploadFile();
  } else {
    mkdirp(pathToPostersFolder, err => {
      if (!err) {
        uploadFile();
      }
    });
  }
});

export default app;
