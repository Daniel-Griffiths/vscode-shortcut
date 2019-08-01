import axios from "axios";

export const api = axios.create({
  baseURL: `https://api.clubhouse.io/api/v2/`,
});
