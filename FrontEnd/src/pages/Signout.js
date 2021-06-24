import { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../redux/user/userActions";
import axios from "../axios";
import { setAlert } from "../redux/alert/alertActions";

const Signout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function signOut() {
      const { data } = await axios({
        method: "POST",
        url: "/users/signout",
      });

      if (data.status === "success") {
        dispatch(setCurrentUser(null));
        dispatch(setAlert("Signout successful", "success"));
      } else dispatch(setAlert(data.message.split(",")[0], "error"));
    }
    signOut();
  });

  return <Redirect to="/" />;
};

export default Signout;
