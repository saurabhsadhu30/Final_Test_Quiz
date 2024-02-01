import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import quizReducer from "./slices/quizSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
  },
});

export default store;
