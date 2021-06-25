import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    border: `2px solid ${theme.palette.primary.main}`,
    padding: 16,
    margin: "20px auto",
  },
}));

const CustomTable = ({ details }) => {
  const classes = useStyles();
  return (
    <Grid item xs={12}>
      <TableContainer className={classes.container} component={Paper}>
        <Table>
          <TableBody>
            {details &&
              details.map((row, index) => (
                <TableRow key={index}>
                  {row.map((col) => (
                    <TableCell
                      style={
                        index === 0
                          ? { fontWeight: "bolder", textAlign: "center" }
                          : { textAlign: "center" }
                      }>
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default CustomTable;
