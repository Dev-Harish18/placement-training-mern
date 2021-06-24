import { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ButtonWithLoader from "../components/ButtonWithLoader";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useDispatch } from "react-redux";
import axios from "../axios";
import { setAlert } from "../redux/alert/alertActions";

const useStyles = makeStyles((theme) => ({
  title: {
    display: "inline-block",
    borderBottom: `7px solid ${theme.palette.primary.main}`,
    marginBottom: 10,
  },
  input: {
    color: theme.palette.primary.main,
    marginBottom: 20,
    margin: "0 auto",
  },
  grid: {
    border: "none",
    [theme.breakpoints.up(780)]: {
      border: `2px solid ${theme.palette.primary.main}`,
      width: "50%",
    },
    padding: 20,
    margin: "0 auto",
    borderRadius: 8,
    width: "100%",
  },
}));

const ResetPassword = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);

  const [password, setPassword] = useState({
    value: "",
    error: false,
    helperText: "Passwords must be atleast 8 characters long",
  });
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    error: false,
    helperText: "",
  });

  //Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoader(true);

    const { data } = await axios({
      method: "PATCH",
      url: `/users/resetpassword/${props.match.params.token}`,
      data: {
        password: password.value,
        confirmPassword: confirmPassword.value,
      },
    });

    if (data.status === "success") {
      dispatch(setAlert("Password reset successful", "success"));
    } else {
      dispatch(setAlert(data.message.split(",")[0], "error"));
    }
    setShowLoader(false);
  };

  const handleChange = (e) => {
    let error = false,
      helperText = "";
    switch (e.target.name) {
      case "confirmPassword":
        if (e.target.value !== password.value) {
          error = true;
          helperText = "Passwords do not match";
        }
        setConfirmPassword({ value: e.target.value, error, helperText });
        break;
      case "password":
        if (e.target.value.length < 8) {
          error = true;
          helperText = "Passwords must be atleast 8 characters long";
        }
        setPassword({ value: e.target.value, error, helperText });
        break;
      default:
        break;
    }
  };

  return (
    <Container style={{ marginBottom: 30 }}>
      <Grid className={classes.grid} container spacing={3} justify="center">
        <form onSubmit={handleSubmit}>
          <Grid item style={{ margin: "30px auto" }}>
            <Typography
              variant="h3"
              color="secondary"
              className={classes.title}>
              Reset Password
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              className={classes.input}
              required
              error={password.error}
              name="password"
              onChange={handleChange}
              variant="outlined"
              type="password"
              color="primary"
              helperText={password.helperText}
              label="New Password">
              {password.value}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              className={classes.input}
              required
              error={confirmPassword.error}
              helperText={confirmPassword.helperText}
              name="confirmPassword"
              onChange={handleChange}
              variant="outlined"
              type="password"
              color="primary"
              placeholder="eg.abc@gmail.com"
              label="Confirm New Password">
              {confirmPassword.value}
            </TextField>
          </Grid>
          <Grid item>
            <ButtonWithLoader
              type="submit"
              loader={showLoader}
              style={{ fontWeight: "bolder", marginTop: 20, marginBottom: 20 }}
              variant="contained"
              color="primary"
              content="Submit"
            />
          </Grid>
        </form>
      </Grid>
    </Container>
  );
};

export default ResetPassword;
