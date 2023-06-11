import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://kagi.com/api/v0",
});

export default axiosClient;
