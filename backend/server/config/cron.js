import fs from "fs";
import path from "path";

import staticUrls from "./staticUrl";

const cronFunctions = {
  deleteFilesFromPostersTempFolder: {
    time: "* * */3 * *",
    function: () => {
      fs.readdir(
        staticUrls.pathToTempPoster.pathToFolder,
        (readdirErr, files) => {
          if (readdirErr) throw readdirErr;

          if (files.length !== 0) {
            const todayUnixTimestamp = new Date().getTime();
            files.forEach(file => {
              const splitedPosterName = file.split("_");
              const posterCreatedAt = splitedPosterName[
                splitedPosterName.length - 1
              ].split(".");
              const secondsInThreeDays = 259200;

              if (
                todayUnixTimestamp - secondsInThreeDays > posterCreatedAt[0] ||
                todayUnixTimestamp - secondsInThreeDays === posterCreatedAt[0]
              ) {
                fs.unlink(
                  path.join(staticUrls.pathToTempPoster.pathToFolder, file),
                  unlinkErr => {
                    if (unlinkErr) throw unlinkErr;
                  }
                );
              }
            });
          }
        }
      );
    }
  }
};

export default cronFunctions;
