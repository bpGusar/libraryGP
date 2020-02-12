import express from "express";

import withAuth from "../middleware";

import SettingsContr from "../../DB/controllers/Settings";

const app = express();

app.put(
  "/api/settings",
  (req, res, next) => withAuth(req, res, next, [1]),
  (req, res) => SettingsContr.updateSettings(req, res)
);

app.get("/api/settings", (req, res) => SettingsContr.getSettings(req, res));

export default app;
