import { useState, useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core";

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

const Filter = ({ filters, filter, setFilters }) => {
  const classes = useStyles();
  const [data, setData] = useState(filter);
  const { id } = filter;

  useEffect(() => {
    setFilters(filters.map((filter) => (filter.id === id ? data : filter)));
  }, [data]);
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = () => {
    setFilters(filters.filter((el) => el.id !== id));
  };
  return (
    <Grid
      item
      container
      justify="space-around"
      alignItems="center"
      className={classes.container}
      spacing={2}>
      <Grid item>
        <Select
          name="index"
          value={data.index}
          onChange={handleChange}
          label="Field">
          <MenuItem value={4}>Gender</MenuItem>
          <MenuItem value={7}>10th Mark %</MenuItem>
          <MenuItem value={8}>12th mark %</MenuItem>
          <MenuItem value={9}>Diploma mark %</MenuItem>
          <MenuItem value={20}>No. of Current Arrears</MenuItem>
          <MenuItem value={21}>History of arrears</MenuItem>
          <MenuItem value={22}>CGPA %</MenuItem>
          <MenuItem value={23}>Grade</MenuItem>
        </Select>
      </Grid>
      <Grid item>
        <Select
          value={data.operator}
          name="operator"
          onChange={handleChange}
          label="Operator">
          <MenuItem value="==">Equals</MenuItem>
          <MenuItem value="!=">Not Equals</MenuItem>
          <MenuItem value=">">Greater than</MenuItem>
          <MenuItem value=">=">Greater than or Equals</MenuItem>
          <MenuItem value="<">Lesser than</MenuItem>
          <MenuItem value="<=">Lesser than or Equals</MenuItem>
        </Select>
      </Grid>
      <Grid item>
        <TextField
          name="value"
          label="Value"
          value={data.value}
          onChange={handleChange}
        />
      </Grid>
      <Grid item>
        <Tooltip title="Add Question" aria-label="add">
          <Fab color="primary" onClick={handleDelete}>
            <DeleteIcon />
          </Fab>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default Filter;
