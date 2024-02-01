import axios from "axios";

import { config, server } from ".";

export async function getAllQuizzes() {
  let data,
    error = false;

  try {
    const res = await axios.get(`${server}/api/quiz`, config());
    data = res.data;
  } catch (err) {
    error = true;
    data = err.response.data.msg;
  }

  return { data, error };
}

export async function createQuiz(payload) {
  let data,
    error = false;

  try {
    const res = await axios.post(`${server}/api/quiz`, payload, config());
    data = res.data;
  } catch (err) {
    error = true;
    data = err.response.data.msg;
  }

  return { data, error };
}

export async function getQuiz(slug) {
  let data,
    error = false;

  try {
    const res = await axios.get(`${server}/api/quiz/${slug}`, config());
    data = res.data;
  } catch (err) {
    error = true;
    data = err.response.data.msg;
  }

  return { data, error };
}

export async function getPublicQuiz(slug) {
  let data,
    error = false;

  try {
    const res = await axios.get(`${server}/api/quiz/public/${slug}`);
    data = res.data;
  } catch (err) {
    error = true;
    data = err.response.data.msg;
  }

  return { data, error };
}

export async function checkAttemptQuiz(payload) {
  let data,
    error = false;

  try {
    const res = await axios.post(`${server}/api/quiz/attempt`, payload);
    data = res.data;
  } catch (err) {
    error = true;
    data = err.response.data.msg;
  }

  return { data, error };
}

export async function deleteQuiz(quizId) {
  let data,
    error = false;

  try {
    const res = await axios.delete(`${server}/api/quiz/${quizId}`, config());
    data = res.data;
  } catch (err) {
    error = true;
    data = err.response.data.msg;
  }

  return { data, error };
}

// questions
export async function createQuestions(payload) {
  let data,
    error = false;

  try {
    const res = await axios.post(`${server}/api/question`, payload, config());
    data = res.data;
  } catch (err) {
    error = true;
    data = err.response.data.msg;
  }

  return { data, error };
}

export async function updateQuestions(payload) {
  let data,
    error = false;

  try {
    const res = await axios.patch(`${server}/api/question`, payload, config());
    data = res.data;
  } catch (err) {
    error = true;
    data = err.response.data.msg;
  }

  return { data, error };
}
