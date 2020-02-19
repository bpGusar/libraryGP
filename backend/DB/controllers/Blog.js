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

// TODO: попробовать переделать все подобные функции в одну функцию фабрику
function getPosts(req, res, data = {}) {
  let { options } = req.query;

  if (_.isUndefined(options)) {
    options = {
      page: 1,
      limit: 99,
      sort: "desc"
    };
  } else {
    options = JSON.parse(options);
  }

  options.page = _.isUndefined(options.page) ? 1 : options.page;
  options.sort = _.isUndefined(options.sort) ? 1 : options.sort;
  options.limit = _.isUndefined(options.limit) ? 99 : options.limit;

  const getSkip = () => {
    if (options.page === 1) {
      return 0;
    }
    return options.limit * (options.page - 1);
  };

  Blog.countDocuments(
    _.isEmpty(data) ? {} : JSON.parse(data),
    (countError, count) => {
      res.set({
        "max-elements": count,
        ...options
      });
      Blog.find(_.isEmpty(data) ? {} : JSON.parse(data))
        .sort({ createdAt: options.sort })
        .skip(getSkip())
        .limit(options.limit)
        .exec((err, posts) => {
          if (err) {
            res.json(config.getRespData(true, MSG.internalServerErr, err));
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
  uploadImageByURL
};
