import axios from "axios";

import { config, server } from ".";

export async function getDashboardStats() {
  let data,
    error = false;

  try {
    const res = await axios.get(`${server}/api/dashboard`, config());
    data = res.data;
  } catch (err) {
    error = true;
    data = err.response.data.msg;
  }

  return { data, error };
}
