import path from "path";

import servConf from "./server.json";

const staticUrls = {
  pathToPoster: {
    url: servConf.filesPaths.bookPoster.urlToPoster,
    pathToFolder: path.join(
      __dirname,
      `../${servConf.filesPaths.bookPoster.mainFolder}`
    )
  },
  pathToTempPoster: {
    url: servConf.filesPaths.bookPoster.urlToPostersTemp,
    pathToFolder: path.join(
      __dirname,
      `../${servConf.filesPaths.bookPoster.tempFolder}`
    )
  },
  pathPlaceholder: {
    url: servConf.filesPaths.placeholders.urlToPlaceholder,
    pathToFolder: path.join(
      __dirname,
      `../${servConf.filesPaths.placeholders.mainFolder}`
    )
  }
};

export default staticUrls;
