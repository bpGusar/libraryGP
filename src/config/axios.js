import * as axios from "axios";

const axs = axios.create({
  baseURL: "/api"
});

axs.interceptors.request.use(
  config => {
    const clonedConfig = config;
    if (localStorage.getItem("token") !== null) {
      clonedConfig.headers["x-access-token"] = localStorage.getItem("token");
    }
    return clonedConfig;
  },
  error => {
    return Promise.reject(error);
  }
);

axs.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export default axs;
