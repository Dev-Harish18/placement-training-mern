import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import userReducer from "./user/userReducer";
import alertReducer from "./alert/alertReducer";
import quizReducer from "./quiz/quizReducer";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const rootReducer = combineReducers({
  user: userReducer,
  alerts: alertReducer,
  quiz: quizReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
