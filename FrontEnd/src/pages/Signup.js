import { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ButtonWithLoader from "../components/ButtonWithLoader";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "../axios";
import { useDispatch } from "react-redux";
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

const Signup = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [showLoader, setShowLoader] = useState(false);
  //Form State
  const [rollNo, setRollNo] = useState({
    value: "",
    error: false,
    helperText: "",
  });
  const [name, setName] = useState({
    value: "",
    error: false,
    helperText: "",
  });
  const [email, setEmail] = useState({
    value: "",
    error: false,
    helperText: "",
  });
  const [password, setPassword] = useState({
    value: "",
    error: false,
    helperText: "Password must be atleast 8 characters",
  });
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    error: false,
    helperText: "",
  });

  //Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoader(true);

    const { data } = await axios({
      method: "POST",
      url: "/users/",
      data: {
        name: name.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
        roll: rollNo.value,
      },
    });

    if (data.status === "success") {
      dispatch(setAlert("Signup Successful", "success"));
      dispatch(setCurrentUser(data.data.user));
    } else {
      dispatch(setAlert(data.message.split(",")[0], "error"));
    }
    setShowLoader(false);
  };

  //Updates and validates state when form changes
  const handleChange = (e) => {
    let error = false,
      helperText = "";
    switch (e.target.name) {
      case "rollNo":
        if (!e.target.value) {
          error = true;
          helperText = "This field is required";
        } else if (!/^1818[L1][0-9]{2}$/.test(e.target.value)) {
          error = true;
          helperText = "Invalid Roll Number";
        }
        setRollNo({
          value: e.target.value,
          error,
          helperText,
        });
        break;
      case "name":
        if (!e.target.value) {
          error = true;
          helperText = "This field is required";
        } else if (e.target.value.length < 3) {
          error = true;
          helperText = "Name must be atleast 3 characters long";
        } else if (!/^[a-zA-Z ]+$/.test(e.target.value)) {
          error = true;
          helperText = "Name must contain only alphabets";
        }
        setName({
          value: e.target.value,
          error,
          helperText,
        });
        break;
      case "email":
        setEmail({
          value: e.target.value,
          error,
          helperText,
        });
        break;
      case "password":
        if (!e.target.value) {
          error = true;
          helperText = "This field is required";
        } else if (e.target.value.length < 8) {
          error = true;
          helperText = "Password must be atleast 8 characters long";
        }
        setPassword({
          value: e.target.value,
          error,
          helperText,
        });
        break;
      case "confirmPassword":
        if (!e.target.value) {
          error = true;
          helperText = "This field is required";
        } else if (e.target.value !== password.value) {
          error = true;
          helperText = "Passwords did not match";
        }
        setConfirmPassword({
          value: e.target.value,
          error,
          helperText,
        });
        break;
      default:
        break;
    }
  };
  //Returns the componenet
  return (
    <Container style={{ marginBottom: 30 }}>
      <Grid className={classes.grid} container spacing={3} justify="center">
        <form onSubmit={handleSubmit}>
          <Grid item style={{ margin: "30px auto" }}>
            <Typography
              variant="h3"
              color="secondary"
              className={classes.title}>
              Signup
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              className={classes.input}
              name="rollNo"
              required
              error={rollNo.error}
              helperText={rollNo.helperText}
              variant="outlined"
              type="text"
              color="primary"
              onChange={handleChange}
              placeholder="eg.1818126"
              label="Roll No.">
              {rollNo.value}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              className={classes.input}
              error={name.error}
              helperText={name.helperText}
              name="name"
              required
              onChange={handleChange}
              variant="outlined"
              type="text"
              color="primary"
              placeholder="eg.Harish"
              label="Name">
              {name.value}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              className={classes.input}
              name="email"
              error={email.error}
              helperText={email.helperText}
              onChange={handleChange}
              variant="outlined"
              type="text"
              color="primary"
              required
              placeholder="eg.abc@gmail.com"
              label="Email">
              {email.value}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              className={classes.input}
              name="password"
              error={password.error}
              required
              helperText={password.helperText}
              onChange={handleChange}
              variant="outlined"
              type="password"
              color="primary"
              label="Password">
              {password.value}
            </TextField>
          </Grid>
          <Grid item>
            <TextField
              className={classes.input}
              error={confirmPassword.error}
              required
              helperText={confirmPassword.helperText}
              name="confirmPassword"
              onChange={handleChange}
              variant="outlined"
              type="password"
              color="primary"
              label="Confirm Password">
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
          <Grid item style={{ marinTop: 20 }}>
            <Typography variant="body1">
              Already have an account?
              <Link to="/users/signin" style={{ fontWeight: "bolder" }}>
                {" "}
                Signin
              </Link>{" "}
              Here
            </Typography>
          </Grid>
        </form>
      </Grid>
    </Container>
  );
};

export default Signup;
