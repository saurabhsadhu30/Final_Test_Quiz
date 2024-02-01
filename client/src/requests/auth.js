import axios from "axios";

import { server } from ".";

export async function signup(payload) {
  let data,
    error = false;

  try {
    const res = await axios.post(`${server}/api/auth/signup`, payload);
    data = res.data;
  } catch (err) {
    error = true;
    data = err.response.data.msg;
  }

  return { data, error };
}

export async function login(payload) {
  let data,
    error = false;

  try {
    const res = await axios.post(`${server}/api/auth/login`, payload);
    data = res.data;
  } catch (err) {
    error = true;
    data = err.response.data.msg;
  }

  return { data, error };
}
