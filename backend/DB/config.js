import Mongoose from 'mongoose';

export const dbConfig = {
  port: 4000,
  user: 'bpgusar',
  pass: 'qwerty123',
  dbName: 'libraryGPdb',
};

export function setUpConnection() {
  Mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@librarygpcluster-ukzjo.mongodb.net/${process.env.DB_NAME}?retryWrites=true`, {
    useNewUrlParser: true,
  });
}

export function buildModel(schemaName, schemaTypes) {
  const Schema = Mongoose.Schema;

  const newSchema = new Schema(schemaTypes);

  Mongoose.model(schemaName, newSchema);
}
