import { Fragment, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import Quiz from "../components/Quiz";
import axios from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { setAlert } from "../redux/alert/alertActions";
import ButtonWithLoader from "../components/ButtonWithLoader";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  questionContainer: {
    margin: "30px auto",
    padding: 8,
    borderRadius: "8px",
    [theme.breakpoints.up("md")]: {
      boxShadow: "2px 2px 10px rgba(0,0,0,0.5)",
      width: "70%",
      padding: 16,
    },
  },
}));
const GetQuiz = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const answers = useSelector((state) => state.quiz);
  const classes = useStyles();
  const [quiz, setQuiz] = useState(null);
  const [loader, setLoader] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(-1);
  let startTime = Date.now();

  useEffect(() => {
    const fetchQuiz = async () => {
      const { data } = await axios({
        method: "GET",
        url: `/events/${props.match.params.id}`,
      });
      if (data.status === "success") setQuiz(data.data.event);
      else {
        dispatch(setAlert(data.message.split(",")[0], "error"));
        return history.push("/");
      }
    };
    fetchQuiz();
  }, [dispatch, history, props.match.params.id]);

  useEffect(() => {
    let data;
    const updateUser = async () => {
      const timeTaken = Date.now() - startTime;
      let minutes = Math.round(timeTaken / 60000);

      data = await axios({
        method: "POST",
        url: `/events/${props.match.params.id}`,
        data: {
          score,
          time: minutes,
        },
      });
    };
    if (data.data.status !== "success") {
      return dispatch(setAlert(data.message.split(",")[0], "error"));
    }
    if (score !== -1) dispatch(setAlert(`Your score is ${score}`, "success"));
    if (quiz && !quiz.attended) {
      updateUser();
    }
  }, [score, dispatch, props.match.params.id, quiz, startTime]);

  //Handle submit
  const handleSubmit = (e) => {
    setLoader(true);
    setIsSubmitted(true);

    let count = 0;
    for (let i = 0; i < quiz.total; i++) if (answers[i] === true) count++;

    setScore(count);

    setLoader(false);
  };

  return (
    <Fragment>
      <Grid container justify="center" className={classes.questionContainer}>
        <Grid
          item
          xs={12}
          style={{
            display: "inlineBlock",
            marginBottom: 20,
            borderBottom: "1px solid rgba(0,0,0,0.5)",
          }}>
          <Typography gutterBottom color="primary" align="center" variant="h3">
            {quiz ? quiz.name : "Quiz Name"}
          </Typography>
        </Grid>
        {quiz &&
          quiz.questions &&
          quiz.questions.map((q, idx) => {
            return (
              <Quiz key={q.id} info={{ ...q, quesNo: idx, isSubmitted }} />
            );
          })}
        <Grid
          item
          xs={12}
          style={{ textAlign: "center", marginBottom: "20px" }}>
          <ButtonWithLoader
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            content="submit"
            loader={loader}
          />
        </Grid>
        {isSubmitted && quiz.attended === false && (
          <Grid item>
            <Typography variant="h3">
              Your score is : {`${score}/${quiz.total}`}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Fragment>
  );
};

export default GetQuiz;
