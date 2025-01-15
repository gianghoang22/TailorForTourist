import axios from "axios";

const instance = axios.create({
  baseURL: "https://vesttour.xyz/",
});

export default instance;
