import { useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useDispatch } from "react-redux";
import axios from "../axios";
import { setAlert } from "../redux/alert/alertActions";
import ButtonWithLoader from "../components/ButtonWithLoader";

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

const ForgotPassword = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  //Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoader(true);

    const { data } = await axios({
      method: "POST",
      url: "/users/forgotpassword",
      data: {
        email,
      },
    });

    if (data.status === "success") {
      dispatch(
        setAlert(
          "Email has been sent to email (Expires in 30 minutes)",
          "success",
          true
        )
      );
    } else {
      dispatch(setAlert(data.message.split(",")[0], "error"));
    }
    setShowLoader(false);
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
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
              Forgot Password
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              className={classes.input}
              name="email"
              inputProps={{ required: true }}
              onChange={handleChange}
              variant="outlined"
              type="text"
              color="primary"
              placeholder="eg.abc@gmail.com"
              label="Email">
              {email}
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

export default ForgotPassword;
