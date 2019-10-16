import Mongoose from "mongoose";

export function setUpConnection() {
  /* eslint max-len: "off" */
  Mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@librarygpcluster-ukzjo.mongodb.net/${process.env.DB_NAME}?retryWrites=true`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
  );
}

export function getRespData(error, msgCode = null, payload = null) {
  return {
    error,
    message: msgCode === null ? null : msgCode[process.env.APP_LANG],
    payload
  };
}
