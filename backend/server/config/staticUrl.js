import path from "path";

import serverConfig from "./server.json";

const staticUrls = {
  pathToPoster: {
    url: serverConfig.filesPaths.bookPoster.urlToPoster,
    pathToFolder: path.join(
      __dirname,
      `../${serverConfig.filesPaths.bookPoster.mainFolder}`
    )
  },
  pathToTempPoster: {
    url: serverConfig.filesPaths.bookPoster.urlToPostersTemp,
    pathToFolder: path.join(
      __dirname,
      `../${serverConfig.filesPaths.bookPoster.tempFolder}`
    )
  },
  pathPlaceholder: {
    url: serverConfig.filesPaths.placeholders.urlToPlaceholder,
    pathToFolder: path.join(
      __dirname,
      `../${serverConfig.filesPaths.placeholders.mainFolder}`
    )
  }
};

export default staticUrls;
