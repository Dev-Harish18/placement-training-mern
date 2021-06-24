import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import gif from "../images/404_gif.gif";
const Error = () => {
  return (
    <>
      <Typography variant="h3" align="center">
        Page Not Found
      </Typography>
      <Grid container justify="center">
        <img src={gif} alt="404-gif" />
      </Grid>
    </>
  );
};

export default Error;
