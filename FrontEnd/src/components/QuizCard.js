import { useState } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import cardQuiz from "../images/cardQuiz.jpg";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import ShowChartIcon from "@material-ui/icons/ShowChart";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../axios";
import { setAlert } from "../redux/alert/alertActions";
import Batch from "../components/Batch";

const useStyles = makeStyles((theme) => ({
  card: {
    borderTop: `5px solid ${theme.palette.primary.main}`,
    width: "100%",
    height: "100%",
    boxShadow: "0px 0px 15px rgba(0,0,0,0.5)",
    position: "relative",
  },
  media: {
    height: 140,
  },
  footer: {
    marginTop: 20,
  },
  fab: {
    backgroundColor: "#2835b3",
    color: "white",
    "&:hover": {
      backgroundColor: "#0a0653",
    },
  },
}));

const QuizCard = ({ title, createdAt, attended, _id, quizes, setQuizes }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleDelete = async () => {
    const { data } = await axios({
      method: "DELETE",
      url: `/events/${_id}`,
    });
    if (data.status === "success")
      dispatch(setAlert("Quiz deleted successfully", "success"));
    else dispatch(setAlert("Something went wrong", "error"));
    setQuizes(quizes.filter((quiz) => quiz._id !== _id));
  };

  return (
    <Grid item xs={10} sm={6} md={4} lg={3}>
      <Card className={classes.card}>
        {attended ? <Batch title="Attended" /> : <Batch title="Not attended" />}
        <CardHeader
          title={title}
          subheader={
            "Created at : " +
            new Date(createdAt).toUTCString().split(" ").slice(0, 4).join(" ")
          }
        />
        <CardMedia className={classes.media} image={cardQuiz} title="Quiz" />

        <CardActions className={classes.footer}>
          <Link to={`/quizes/${_id}`}>
            <Button variant="contained" color="primary">
              Go
            </Button>
          </Link>
          {user && (
            <>
              <Link style={{ marginLeft: "auto" }} to={`/quizes/stats/${_id}`}>
                <Tooltip title="stats" aria-label="stats">
                  <Fab className={classes.fab} size="small">
                    <ShowChartIcon />
                  </Fab>
                </Tooltip>
              </Link>
              <Link to={`/quizes/edit/${_id}`}>
                <Tooltip
                  title="Edit quiz"
                  className={classes.fab}
                  size="small"
                  aria-label="edit">
                  <Fab>
                    <EditIcon />
                  </Fab>
                </Tooltip>
              </Link>
              <Tooltip
                title="Delete quiz"
                className={classes.fab}
                size="small"
                aria-label="delete">
                <Fab onClick={() => setOpen(true)}>
                  <DeleteIcon />
                </Fab>
              </Tooltip>
            </>
          )}
        </CardActions>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {`Do you really want to delete quiz "${title}"`}
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              handleDelete();
              handleClose();
            }}
            color="primary"
            autoFocus>
            Yes
          </Button>
          <Button
            onClick={() => {
              handleClose();
            }}
            color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default QuizCard;
