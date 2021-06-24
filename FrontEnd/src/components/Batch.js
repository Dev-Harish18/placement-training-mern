const Batch = ({ title }) => {
  const style = {
    backgroundColor: "#f50057",
    color: "white",
    display: "inlineBlock",
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  };
  return (
    <span
      style={
        title !== "Attended"
          ? style
          : {
              ...style,
              backgroundColor: "#4caf50",
            }
      }>
      {title}
    </span>
  );
};

export default Batch;
