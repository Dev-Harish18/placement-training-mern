import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import { useSelector, useDispatch } from "react-redux";
import { removeAlert } from "../redux/alert/alertActions";

const MyAlert = () => {
  const alerts = useSelector((state) => state.alerts);
  const dispatch = useDispatch();
  return (
    alerts &&
    alerts.length > 0 &&
    alerts.map(({ id, type, message, autoHide }) => (
      <Snackbar
        key={id}
        open={true}
        autoHideDuration={autoHide ? null : 5000}
        onClose={() => {
          dispatch(removeAlert(id));
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              dispatch(removeAlert(id));
            }}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }>
        <Alert
          variant="filled"
          m={2}
          severity={type}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => dispatch(removeAlert(id))}>
              <CloseIcon></CloseIcon>
            </IconButton>
          }>
          {message}
        </Alert>
      </Snackbar>
    ))
  );
};

export default MyAlert;
