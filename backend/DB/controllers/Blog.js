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

export default { addPost };
