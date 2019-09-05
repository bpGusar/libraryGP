import * as axios from "axios";

const axs = axios.create({
  baseURL: "http://localhost:5000/api"
});

axs.interceptors.request.use(
  config => {
    if (localStorage.getItem("token") !== null) {
      config.params = {
        ...config.params,
        token: localStorage.getItem("token")
      };
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axs;
