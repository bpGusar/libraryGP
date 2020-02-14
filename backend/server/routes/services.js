import express from "express";

import ServicesContr from "../../DB/controllers/Services";

const app = express();

app.get("/api/services/fetchMeta", (req, res) => {
  ServicesContr.getMetaDataFromURL(req, res);
});

export default app;
