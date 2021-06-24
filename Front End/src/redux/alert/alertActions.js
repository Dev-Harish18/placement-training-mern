import { v4 as uuidv4 } from "uuid";
import alertActionTypes from "./alertActionTypes";

export const setAlert = (message, type, autoHide = false) => {
  const id = uuidv4();
  return {
    type: alertActionTypes.SET_ALERT,
    payload: {
      id,
      message,
      type,
      autoHide,
    },
  };
};

export const removeAlert = (id) => {
  return {
    type: alertActionTypes.REMOVE_ALERT,
    payload: id,
  };
};
