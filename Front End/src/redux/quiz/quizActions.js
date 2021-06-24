import quizActionTypes from "./quizActionTypes";

export const setAnswer = (quesNo, answer) => {
  return {
    type: quizActionTypes.SET_ANSWER,
    payload: {
      quesNo,
      answer,
    },
  };
};
