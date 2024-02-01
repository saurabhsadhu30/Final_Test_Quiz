import Cookies from "js-cookie";

export const server = location.href.includes("localhost")
  ? "http://127.0.0.1:8080"
  : "final-test-quiz-8x9j.vercel.app";

export function config() {
  const token = Cookies.get("token");
  return {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
}
