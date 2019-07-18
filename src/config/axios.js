import axios from "axios";

export default function axs() {
  return axios.create({
    baseURL: "http://localhost:5000/api"
  });
}

axs().interceptors.request.use(
  config => {
    if (localStorage.getItem("token") !== null) {
      config.headers["x-access-token"] = localStorage.getItem("token");
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
