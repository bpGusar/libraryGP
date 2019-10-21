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
  pathPlaceholder: {
    url: servConf.filesPaths.placeholders.urlToPlaceholder,
    pathToFolder: path.join(
      __dirname,
      `../${servConf.filesPaths.placeholders.mainFolder}`
    )
  },
  pathAvatar: {
    url: servConf.filesPaths.avatars.urlToAvatar,
    pathToFolder: path.join(
      __dirname,
      `../${servConf.filesPaths.avatars.mainFolder}`
    )
  }
};

export default staticUrls;
