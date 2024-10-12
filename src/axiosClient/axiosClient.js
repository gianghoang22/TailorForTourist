import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:7244/swagger/index.html",
});

export default instance;
