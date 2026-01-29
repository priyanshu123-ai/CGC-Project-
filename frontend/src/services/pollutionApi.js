import { serverUrl } from "@/main";
import axios from "axios";

export const getCityPollution = async (city) => {
  const res = await axios.post(`${serverUrl}/api/v5/city`, {
    city,
  });
  console.log(res.data)
  return res.data;
};
