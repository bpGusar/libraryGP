import _ from "lodash";
import fs from "fs";
import path from "path";
import childProcess from "child_process";

/**
 * Функция генерации карты путей приложения.
 * На основе названий файлов, из папки routes, генерируется новые данные для файла routesPaths.js.
 * Из массива с названиями файлов будут убраны файлы routesPaths.js и routesGenerator.js которые не должны попасть в карту путей.
 * После записи новых данных в файл routesPaths.js он асинхронно будет импортирован, и на основе него в параметр app будут отданы новые роуты.
 * @param app Express
 */
export default function generateRoutes(app) {
  const pathToRoutesDir = path.join(__dirname, `/`);
  const pathToRoutesPathsFile = path.join(__dirname, `/routesPaths.js`);

  fs.readdir(pathToRoutesDir, (readdirErr, files) => {
    if (readdirErr) throw readdirErr;

    if (files.length !== 0) {
      const clonedFiles = _.filter(files, file => {
        if (file !== "routesPaths.js" && file !== "routesGenerator.js") {
          return file;
        }
      });

      const routesFileCode = `${clonedFiles
        .map(
          (file, i) =>
            `import ${file.split(".")[0]} from "./${file.split(".")[0]}"${
              clonedFiles.length - 1 === i ? ";" : ""
            }`
        )
        .join(";")}
      
      // eslint-disable-next-line import/prefer-default-export
      export {
        ${clonedFiles.map(file => `${file.split(".")[0]}`)}
      };
      `;

      fs.writeFile(pathToRoutesPathsFile, routesFileCode, async err => {
        if (err) throw err;

        childProcess.exec(`eslint ${pathToRoutesPathsFile} --fix`);

        const routesTest = await import("./routesPaths");

        return Object.keys(routesTest).forEach(route =>
          app.use(routesTest[route])
        );
      });
    }
  });
}
