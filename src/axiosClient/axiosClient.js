import axios from "axios";

const instance = axios.create({
  baseURL: "https://localhost:7194/swagger/",
});

export default instance;
