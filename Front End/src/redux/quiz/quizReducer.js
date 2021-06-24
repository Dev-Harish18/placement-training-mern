import quizActionTypes from "./quizActionTypes";

const initialState = {};

const quizReducer = (state = initialState, action) => {
  switch (action.type) {
    case quizActionTypes.SET_ANSWER:
      return {
        ...state,
        [action.payload.quesNo]: action.payload.answer,
      };
    default:
      return state;
  }
};

const addAnswer = (answers = [], quesNo, answer) => {
  if (answers.find((ans) => ans.quesNo === quesNo))
    return answers.map((ans) =>
      ans.quesNo === quesNo ? { [quesNo]: answer } : ans
    );
  return [...answers, { [quesNo]: answer }];
};

export default quizReducer;
