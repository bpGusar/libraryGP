import * as axios from "axios";
import { toast } from "react-semantic-toasts";

import MSG from "@msg";

const axs = axios.create({
  baseURL: "http://localhost:5000/api"
});

axs.interceptors.request.use(
  config => {
    if (localStorage.getItem("token") !== null) {
      config.headers["x-access-token"] = localStorage.getItem("token");
    }
    return config;
  },
  error => {
    toast(MSG.serverError);
    return Promise.reject(error);
  }
);

axs.interceptors.response.use(
  response => response,
  error => {
    toast(MSG.serverError);
    return Promise.reject(error);
  }
);

export default axs;
