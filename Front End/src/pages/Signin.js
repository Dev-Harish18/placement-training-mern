import { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ButtonWithLoader from "../components/ButtonWithLoader";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "../axios";
import { setAlert } from "../redux/alert/alertActions";
import { setCurrentUser } from "../redux/user/userActions";

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

const Signin = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [roll, setRoll] = useState("");
  const [password, setPassword] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const handleChange = (e) => {
    switch (e.target.name) {
      case "roll":
        setRoll(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  //Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoader(true);

    const { data } = await axios({
      method: "POST",
      url: "/users/signin",
      data: {
        roll,
        password,
      },
    });

    if (data.status === "success") {
      dispatch(setAlert("Login Successful", "success"));
      dispatch(setCurrentUser(data.data.user));
    } else {
      dispatch(setAlert(data.message.split(",")[0], "error"));
    }
    setShowLoader(false);
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
              Signin
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              inputProps={{ required: true }}
              className={classes.input}
              name="roll"
              onChange={handleChange}
              variant="outlined"
              type="text"
              color="primary"
              placeholder="eg.1818126"
              label="Roll No">
              {roll}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              className={classes.input}
              name="password"
              inputProps={{ required: true }}
              onChange={handleChange}
              variant="outlined"
              type="password"
              color="primary"
              label="Password">
              {password}
            </TextField>
          </Grid>
          <Grid item>
            <ButtonWithLoader
              type="submit"
              loader={showLoader}
              style={{ fontWeight: "bolder", marginTop: 20, marginBottom: 20 }}
              variant="contained"
              color="primary"
              content="Signin"
            />
          </Grid>
          <Grid item>
            <Link to="/users/forgotpassword">
              <Typography
                style={{
                  fontWeight: "bold",
                  marginTop: 20,
                  textAlign: "right",
                  textDecoration: "underline",
                  marginBottom: 20,
                }}
                gutterBottom>
                Forgot password?
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              Don't have an account?
              <Link to="/users/signup" style={{ fontWeight: "bolder" }}>
                {" "}
                Signup
              </Link>{" "}
              Here
            </Typography>
          </Grid>
        </form>
      </Grid>
    </Container>
  );
};

export default Signin;
