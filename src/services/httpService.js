import axios from "axios";
import Cookies from "js-cookie";

const ModuleName = "Edogov_General_RequestManager";
// const URL = Cookies.get('_APIBaseURL') + '/generalrequest';
const URL = "https://classroom.c-ileasing.com/api.virtualclassroom.com/public/api/v1/";
// const URL = "https://edogoverp.com/newdashboard";
const URLDOC = Cookies.get("_APIBaseURL");

export let Access_token = localStorage.getItem("token");

const Http = axios.create({
  baseURL: URL,
  // headers,
});

Http.interceptors.request.use(
  function (config) {
    config.headers["Authorization"] = Access_token
      ? `Bearer ${Access_token}`
      : "";
    config.headers["X-API-KEY"] = "fq05322d-429b-4f77-8a4p-a97ry62eb37k";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default Http;
