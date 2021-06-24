import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";

const useStyles = makeStyles((theme) => ({
  title: {
    display: "inline-block",
    borderBottom: `5px solid ${theme.palette.primary.main}`,
    marginBottom: 10,
    fontSize: 25,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: "80%",
  },
  input: {
    color: theme.palette.primary.main,
    marginBottom: 2,
    width: "80%",
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

const Question = ({ id, setQuestions, questions, initial, quiz }) => {
  const classes = useStyles();
  const [questionData, setQuestionData] = useState(initial);

  useEffect(() => {
    //Adding to questions array
    let idx = questions.findIndex((q) => q.id === questionData.id);
    if (idx !== -1) {
      setQuestions([
        ...questions.slice(0, idx),
        questionData,
        ...questions.slice(idx + 1),
      ]);
    } else {
      setQuestions([...questions, questionData]);
    }
  }, [questionData]);

  //Handle change
  const handleChange = (e) => {
    if (e.target.name.startsWith("option")) {
      let index = e.target.name.charAt(6) * 1 - 1;
      setQuestionData({
        ...questionData,
        options: [
          ...questionData.options.slice(0, index),
          e.target.value,
          ...questionData.options.slice(index + 1),
        ],
      });
    } else {
      setQuestionData({
        ...questionData,
        [e.target.name]: e.target.value,
      });
    }
  };

  //handle delete
  const handleDelete = () => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <Grid
      item
      container
      spacing={2}
      className={classes.question}
      alignItems="center"
      justify="center">
      <Grid item xs={12}>
        <Typography variant="h3" className={classes.title}>
          Question
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          className={classes.input}
          name="name"
          multiline
          rows={2}
          variant="outlined"
          onChange={handleChange}
          type="text"
          color="primary"
          autoFocus
          label="Question"
          value={questionData.name}
        />
      </Grid>
      <Grid item container spacing={3} justify="center">
        <Grid item container spacing={1}>
          {[1, 2, 3, 4].map((option, index) => (
            <Grid item key={index} xs={12} md={6}>
              <TextField
                required
                key={option}
                onChange={handleChange}
                className={classes.input}
                name={`option${option}`}
                variant="outlined"
                type="text"
                autoFocus
                color="primary"
                autoFocus
                label={`Option ${option}`}
                value={questionData.options[index]}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <FormControl className={classes.formControl}>
          <InputLabel shrink style={{ padding: "2px 10px" }}>
            Correct Option *
          </InputLabel>
          <Select
            variant="outlined"
            name="correctOption"
            color="primary"
            onChange={handleChange}
            value={questionData.correctOption}
            inputProps={{ required: true }}>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <TextField
          className={classes.input}
          name="explanation"
          variant="outlined"
          onChange={handleChange}
          type="text"
          color="primary"
          multiline
          rows={2}
          label="Explanation"
          autoFocus
          value={questionData.explanation}
        />
      </Grid>
      <Grid item style={{ textAlign: "right", marginLeft: "auto" }}>
        <Tooltip title="Delete Question" aria-label="delete">
          <Fab color="primary" onClick={handleDelete} className={classes.fab}>
            <DeleteIcon />
          </Fab>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default Question;
