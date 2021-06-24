import axios from "../axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setAlert } from "../redux/alert/alertActions";
import { useState } from "react";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  container: {
    border: `2px solid ${theme.palette.primary.main}`,
    padding: 16,
    margin: "20px auto",
    [theme.breakpoints.up("md")]: {
      width: "70%",
    },
  },
}));

const Stats = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      //Fetch Data
      const { data } = await axios({
        method: "GET",
        url: `/events/stats/${props.match.params.id}`,
      });

      if (data.status !== "success") {
        dispatch(setAlert(data.message.split(",")[0], "error"));
        return history.push("/");
      }

      //create State
      let event = data.data.event;
      const users = event.users.map((el) => {
        return {
          name: el.name,
          roll: el.roll,
          score: el.events[0].score,
          time: el.events[0].time,
        };
      });
      const state = {
        name: event.name,
        total: event.total,
        users: users,
      };
      setStats(state);
    };
    fetchStats();
  }, []);

  return (
    <Grid container justify="center" spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" align="center" color="primary">
          {stats && stats.name[0].toUpperCase() + stats.name.slice(1)}
        </Typography>
      </Grid>
      {/*Start of the Table */}
      {!(stats && stats.users && stats.users.length) ? (
        <Typography variant="h6" align="center">
          No users attended this quiz
        </Typography>
      ) : (
        <Grid item xs={12}>
          <TableContainer className={classes.container} component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ fontSize: "bolder" }}>
                  <TableCell>Roll No</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Score</TableCell>
                  <TableCell align="center">Time Taken (minutes)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.users.map((row) => (
                  <TableRow key={row.roll}>
                    <TableCell component="th" scope="row">
                      {row.roll}
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">{`${row.score}/${stats.total}`}</TableCell>
                    <TableCell align="center">{row.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      )}
      {/* End of the table */}
    </Grid>
  );
};

export default Stats;
