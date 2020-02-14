import _ from "lodash";

import Blog from "../models/Blog";

import MSG from "../../config/msgCodes";
import * as config from "../config";

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

export default { addPost, getPosts };
