import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const ButtonWithLoader = (props) => {
  return (
    <Button
      {...props}
      endIcon={
        props.loader ? <CircularProgress color="secondary" size={15} /> : null
      }>
      {props.content}
    </Button>
  );
};

export default ButtonWithLoader;
