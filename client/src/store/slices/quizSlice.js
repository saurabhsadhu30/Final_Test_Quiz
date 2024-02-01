import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modal: false,
  data: null,
  shareQuizModal: false,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    openQuiz: (state) => {
      state.modal = true;
    },
    closeQuiz: (state) => {
      state.modal = false;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
    toggleShareModal: (state, action) => {
      state.shareQuizModal = action.payload;
    },
  },
});

export const { openQuiz, closeQuiz, setData, toggleShareModal } =
  quizSlice.actions;

export default quizSlice.reducer;
