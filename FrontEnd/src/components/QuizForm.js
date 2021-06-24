import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ButtonWithLoader from "../components/ButtonWithLoader";
import Container from "@material-ui/core/Container";
import Question from "../components/Question";
import AddIcon from "@material-ui/icons/Add";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  title: {
    display: "inline-block",
    borderBottom: `7px solid ${theme.palette.primary.main}`,
    marginBottom: 10,
  },
  input: {
    color: theme.palette.primary.main,
    marginBottom: 2,
    margin: 20,
    width: "80%",
  },
  grid: {
    border: "none",
    [theme.breakpoints.up(780)]: {
      border: `2px solid ${theme.palette.primary.main}`,
      width: "60%",
    },
    padding: 5,
    margin: "0 auto",
    borderRadius: 8,
    width: "100%",
  },
  form: {
    textAlign: "center",
  },
  question: {
    boxShadow: `2px 2px 10px rgba(0,0,0,0.5)`,
    margin: "20px auto",
    width: "80%",
    padding: 20,
    [theme.breakpoints.down(400)]: {
      width: "100%",
    },
  },
}));

const QuizForm = ({
  quiz,
  setQuiz,
  title,
  handleSubmit,
  handleAdd,
  showLoader,
  questions,
  setQuestions,
}) => {
  const classes = useStyles();

  return (
    <Container style={{ marginBottom: 30 }}>
      <Grid className={classes.grid} container spacing={3} justify="center">
        <form onSubmit={handleSubmit} className={classes.form}>
          <Grid item style={{ margin: "30px auto" }}>
            <Typography
              variant="h3"
              className={classes.title}
              color="secondary">
              {title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              onChange={(e) => setQuiz(e.target.value)}
              className={classes.input}
              name="name"
              variant="outlined"
              helperText="Quiz name must be unique"
              type="text"
              color="primary"
              label="Quiz Name"
              autoFocus
              value={quiz}
            />
          </Grid>
          {/* Question Component */}
          {questions.length ? (
            questions.map((q) => {
              return (
                <Question
                  key={q.id}
                  id={q.id}
                  initial={q}
                  questions={questions}
                  setQuestions={setQuestions}
                />
              );
            })
          ) : (
            <Typography
              gutterBottom
              style={{
                margin: 30,
                padding: 20,
                fontSize: 20,
              }}
              variant="body1">
              {" "}
              Click the + icon to add questions{" "}
            </Typography>
          )}

          {/* Add Question*/}
          <Grid item>
            <Tooltip title="Add Question" aria-label="add">
              <Fab color="primary" onClick={handleAdd} className={classes.fab}>
                <AddIcon />
              </Fab>
            </Tooltip>
          </Grid>
          {/* Submit button */}
          <Grid item>
            <ButtonWithLoader
              type="submit"
              loader={showLoader}
              style={{
                fontWeight: "bolder",
                marginTop: 20,
                marginBottom: 20,
              }}
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

export default QuizForm;
