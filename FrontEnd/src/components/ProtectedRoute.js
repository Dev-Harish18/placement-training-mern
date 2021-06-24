import { Route, Redirect } from "react-router";
import { setAlert } from "../redux/alert/alertActions";
import { useSelector, useDispatch } from "react-redux";

const ProtectedRoute = ({ component, path, authenticate, authorize }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  return (
    <Route
      path={path}
      exact
      render={(props) => {
        const Component = component;
        if (authenticate) {
          if (!user) {
            dispatch(setAlert("Please sign in to do this task", "error"));
            return <Redirect to="/" />;
          }
        }
        if (authorize) {
          if (user.role !== "admin") {
            dispatch(
              setAlert("You are not authourized to do this task", "error")
            );
            return <Redirect to="/" />;
          }
        }
        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
