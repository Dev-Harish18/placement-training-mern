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

export default quizReducer;
