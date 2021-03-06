import _ from "lodash";
import fs from "fs";
import path from "path";
import request from "request";

import Blog from "../models/Blog";

import MSG from "../../config/msgCodes";
import * as config from "../config";
import servConf from "../../config/server.json";

function updatePost(req, res) {
  const { postData, postId } = req.body;

  Blog.update({ _id: postId }, { ...postData }, err => {
    if (err) {
      res.json(config.getRespData(true, MSG.cantUpdatePost, err));
    } else {
      res.json(config.getRespData(false, MSG.postWasUpdated));
    }
  });
}

function addPost(req, res) {
  const { postData } = req.body;

  const post = new Blog({
    ...postData,
    userId: req.middlewareUserInfo._id
  });

  post.save(err => {
    if (err) {
      res.json(config.getRespData(true, MSG.cantAddBlogPost, err));
    } else {
      res.send(config.getRespData(false, MSG.postInBlogAdded));
    }
  });
}

function uploadImageByURL(req, res) {
  const { url } = req.body;
  const dateNow = Date.now();
  const posterName = `${dateNow}.png`;
  const pathToNewPostImage = path.join(
    __dirname,
    `../../${servConf.filesPaths.postImages.mainFolder}`,
    posterName
  );
  const pathToImage = `${servConf.filesPaths.postImages.urlToPostImage}/${posterName}`;

  const download = (uri, filename, callback) => {
    request.head(uri, (err, res, body) => {
      request(uri)
        .pipe(fs.createWriteStream(filename))
        .on("close", callback);
    });
  };

  download(url, pathToNewPostImage, () => {
    res.json({
      success: 1,
      file: {
        url: pathToImage
      }
    });
  });
}

function uploadImageByFile(req, res) {
  const dateNow = Date.now();
  const posterName = `${dateNow}.png`;

  const pathToNewPostImage = path.join(
    __dirname,
    `../../${servConf.filesPaths.postImages.mainFolder}`,
    posterName
  );
  const pathToImage = `${servConf.filesPaths.postImages.urlToPostImage}/${posterName}`;

  const base64Image = Buffer.from(req.files.image.data).toString("base64");

  fs.writeFile(pathToNewPostImage, base64Image, "base64", err => {
    if (err) {
      res.json({ success: 0 });
    } else {
      res.json({
        success: 1,
        file: {
          url: pathToImage
        }
      });
    }
  });
}

function deletePost(res, req) {
  const { id } = req.params;
  Blog.findOneAndUpdate(
    { _id: id },
    {
      pseudoDeleted: "true"
    },
    { new: true },
    err => {
      if (err) {
        res.json(config.getRespData(true, MSG.cantHidePost, err));
      } else {
        res.json(config.getRespData(false, MSG.postWasHidden));
      }
    }
  );
}

function restorePost(res, req) {
  const { id } = req.params;
  Blog.findOneAndUpdate(
    { _id: id },
    {
      pseudoDeleted: "false"
    },
    { new: true },
    err => {
      if (err) {
        res.json(config.getRespData(true, MSG.cantRestorePost, err));
      } else {
        res.json(config.getRespData(false, MSG.bookWasRestored));
      }
    }
  );
}

// TODO: попробовать переделать все подобные функции в одну функцию фабрику
function getPosts(req, res, data = {}) {
  let { options } = req.query;
  const clonedData = _.isEmpty(data) ? {} : JSON.parse(data);
  const findByData = _.cloneDeep(clonedData);

  if (_.isUndefined(options)) {
    options = {
      page: 1,
      limit: 99,
      sort: "desc",
      displayMode: "all"
    };
  } else {
    options = JSON.parse(options);
  }

  options.page = _.isUndefined(options.page) ? 1 : options.page;
  options.sort = _.isUndefined(options.sort) ? "desc" : options.sort;
  options.limit = _.isUndefined(options.limit) ? 99 : options.limit;
  options.displayMode = _.isUndefined(options.displayMode)
    ? "all"
    : options.displayMode;

  const getSkip = () => {
    if (options.page === 1) {
      return 0;
    }
    return options.limit * (options.page - 1);
  };

  Blog.countDocuments(
    options.displayMode === "all"
      ? findByData
      : {
          ...findByData,
          pseudoDeleted: { $eq: `${options.displayMode === "true"}` }
        },
    (countError, count) => {
      res.set({
        "max-elements": count,
        ...options
      });
      Blog.find(
        options.displayMode === "all"
          ? findByData
          : {
              ...findByData,
              pseudoDeleted: { $eq: `${options.displayMode === "true"}` }
            }
      )
        .sort({
          dateAdded: options.sort
        })
        .skip(getSkip())
        .limit(options.limit)
        .populate([
          {
            path: "userId"
          }
        ])
        .exec((findBookError, posts) => {
          if (findBookError) {
            res.json(config.getRespData(true, MSG.postNotFound, findBookError));
          } else {
            res.json(config.getRespData(false, null, posts));
          }
        });
    }
  );
}

export default {
  addPost,
  getPosts,
  updatePost,
  uploadImageByFile,
  uploadImageByURL,
  deletePost,
  restorePost
};
