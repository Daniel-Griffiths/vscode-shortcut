import axios from "axios";

import { Storage } from "./utils/Storage";

export const api = axios.create({
  baseURL: `https://api.clubhouse.io/api/v2/`,
});

api.interceptors.request.use(
  function(response) {
    const token = Storage.get("token");

    response.params = !response.params ? {} : response.params;

    response.params["token"] = token;

    return response;
  },
  function(err) {
    return Promise.reject(err);
  }
);
