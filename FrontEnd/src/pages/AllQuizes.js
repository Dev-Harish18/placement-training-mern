import { useState, useEffect } from "react";
import axios from "../axios";
import QuizCard from "../components/QuizCard";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core";
import { setAlert } from "../redux/alert/alertActions";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  title: {
    display: "inline-block",
    borderBottom: `7px solid ${theme.palette.primary.main}`,
    margin: "20px auto",
  },
}));

const AllQuizes = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [quizes, setQuizes] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const fetchQuizes = async () => {
      const { data } = await axios({
        method: "GET",
        url: "/events/",
      });
      setLoader(false);
      if (data.status === "success") setQuizes(data.data.events);
      else dispatch(setAlert(data.message.split(",")[0], "error"));
    };

    fetchQuizes();
  }, [dispatch]);

  return (
    <Grid container alignItems="center" spacing={3} justify="center">
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <Typography
          className={classes.title}
          align="center"
          color="secondary"
          gutterBottom
          variant="h3">
          Quizes
        </Typography>
      </Grid>
      {loader ? (
        <CircularProgress color="primary" style={{ margin: "20px auto" }} />
      ) : quizes && quizes.length ? (
        quizes.map((quiz) => {
          return (
            <QuizCard
              quizes={quizes}
              setQuizes={setQuizes}
              key={quiz._id}
              title={quiz.name}
              score={quiz.score}
              createdAt={quiz.createdAt}
              attended={quiz.attended}
              _id={quiz._id}
            />
          );
        })
      ) : (
        <Grid item>
          <Typography
            variant="h6"
            color="secondary"
            align="center"
            gutterBottom>
            No Quizes here!
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default AllQuizes;
