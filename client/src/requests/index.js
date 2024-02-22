import Cookies from "js-cookie";

export const server = location.href.includes("localhost")
  ? "http://127.0.0.1:8080"
  : "https://quizzie-api-cozd.onrender.com";

export function config() {
  const token = Cookies.get("token");
  return {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
}
