import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAnswer } from "../redux/quiz/quizActions";

const useStyles = makeStyles((theme) => ({
  quiz: {
    borderBottom: "1px solid grey",
    margin: "10px auto",
    [theme.breakpoints.up(700)]: {
      width: "60%",
    },
  },
}));

const Quiz = ({ info }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const { correctOption, explanation, name, options, isSubmitted, quesNo } =
    info;

  useEffect(() => {
    dispatch(setAnswer(quesNo, value == correctOption - 1));
  }, [value]);
  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <Grid container className={classes.quiz} spacing={2} item justify="center">
      <Grid item xs={12}>
        <Typography>{name}</Typography>
      </Grid>
      <Grid item xs={12}>
        <RadioGroup name="question" value={value} onChange={handleChange}>
          {options &&
            options.map((option, index) => {
              return (
                <FormControlLabel
                  style={
                    isSubmitted && index === correctOption - 1
                      ? {
                          backgroundColor: "green",
                          color: "white",
                          borderRadius: "5px",
                        }
                      : null
                  }
                  key={index}
                  value={index + ""}
                  control={
                    <Radio
                      color="primary"
                      style={
                        isSubmitted && index === correctOption - 1
                          ? { color: "white" }
                          : null
                      }
                    />
                  }
                  label={option}
                />
              );
            })}
        </RadioGroup>
      </Grid>
      {isSubmitted && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6">
              Correct Answer :{" "}
              <span style={{ color: "#ff6e6c" }}>
                {options[correctOption - 1]}
              </span>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">
              Explanation : {explanation || "No explanation provided"}
            </Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default Quiz;
