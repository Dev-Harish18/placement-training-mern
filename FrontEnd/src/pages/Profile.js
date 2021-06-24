import { Fragment, useEffect, useState } from "react";
import profileImg from "../images/profile.jpg";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import CheckCircleOutlinedIcon from "@material-ui/icons/CheckCircleOutlined";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/styles";
import axios from "../axios";
import { setAlert } from "../redux/alert/alertActions";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  profileImage: {
    display: "block",
    height: "90%",
    width: "90%",
    margin: "10px auto",
  },
  title: {
    display: "inlineBlock",
    color: "#2835b3",
    borderBottom: `1px solid ${theme.palette.secondary.main}`,
  },
  fab: {
    fontWeight: "bolder",
    backgroundColor: "#2835b3",
    color: "white",
    "&:hover": {
      backgroundColor: "#0a0653",
    },
  },
  container: {
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
    borderRadius: 12,
    marginTop: 20,
    padding: 16,
    [theme.breakpoints.up("md")]: {
      width: "75%",
      padding: "24px",
    },
  },
  outerContainer: {
    marginBottom: 20,
  },
}));
const Profile = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  const [isEditing, setIsEditing] = useState(false);
  const [loader, setLoader] = useState(true);

  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [email, setEmail] = useState("");
  const [gpData, setGpData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await axios({
        method: "GET",
        url: `/users/${props.match.params.roll}`,
      });

      if (userData.data.status !== "success") {
        dispatch(setAlert("No such users found", "error"));
        return history.push("/");
      }
      setName(userData.data.data.user.name);
      setEmail(userData.data.data.user.email);
      setRoll(userData.data.data.user.roll);
      const { data } = await axios({
        method: "POST",
        url: "/details/filter",
        data: {
          filterData: [
            {
              index: 0,
              operator: "==",
              value: String(userData.data.data.user.roll),
            },
          ],
        },
      });
      setLoader(false);

      if (data.status !== "success") {
        dispatch(setAlert(data.message.split(",")[0], "error"));
        return history.push("/");
      }
      setGpData(data.data.filteredData[1]);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "name") setName(e.target.value);
    else if (e.target.name === "roll") setRoll(e.target.value);
    else setEmail(e.target.value);
  };
  const handleUpdate = async () => {
    const { data } = await axios({
      method: "PATCH",
      url: `/users/${props.match.params.roll}`,
      data: {
        name,
        roll,
        email,
      },
    });

    if (data.status !== "success") {
      return dispatch(setAlert(data.message.split(",")[0], "error"));
    }
    dispatch(setAlert("Profile updated", "success"));
    setIsEditing(false);
  };

  return (
    <Grid
      container
      className={classes.profileContainer}
      justify="center"
      alignItems="center">
      <Grid item xs={12} md={6}>
        <img
          src={profileImg}
          className={classes.profileImage}
          alt="profile-img"
        />
      </Grid>

      <Grid
        item
        container
        className={classes.outerContainer}
        xs={12}
        md={6}
        justify="center"
        alignItems="center">
        {/* Outer container */}

        <Grid
          className={classes.container}
          container
          item
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          <Grid
            container
            item
            style={{
              marginBottom: 20,
              borderBottom: "1px solid rgba(0,0,0,0.5)",
            }}>
            <Grid item xs={6}>
              <Typography variant="h6" className="title" color="primary">
                Basic Info
              </Typography>
            </Grid>
            {props.match.params.roll === user.roll && (
              <Grid item xs={6}>
                {!isEditing ? (
                  <EditIcon
                    size="small"
                    style={{
                      display: "block",
                      marginLeft: "auto",
                      cursor: "pointer",
                    }}
                    onClick={(e) => setIsEditing(true)}
                  />
                ) : (
                  <CheckCircleOutlinedIcon
                    style={{
                      display: "block",
                      marginLeft: "auto",
                      cursor: "pointer",
                      fontWeight: "bolder",
                      color: "green",
                    }}
                    size="small"
                    onClick={handleUpdate}
                  />
                )}
              </Grid>
            )}
          </Grid>
          {/* Name */}
          <Grid container item>
            <Grid item xs={4}>
              <Typography gutterBottom>Name</Typography>
            </Grid>
            <Grid item xs={6}>
              {isEditing ? (
                <TextField
                  value={name}
                  name="name"
                  onChange={handleChange}
                  autoFocus
                  color="primary"
                />
              ) : (
                <Typography gutterBottom>{name}</Typography>
              )}
            </Grid>
          </Grid>
          {/* Roll No */}
          <Grid container item>
            <Grid item xs={4}>
              <Typography gutterBottom>Roll No</Typography>
            </Grid>
            <Grid item xs={6}>
              {isEditing ? (
                <TextField
                  value={roll}
                  name="roll"
                  onChange={handleChange}
                  autoFocus
                  color="primary"
                />
              ) : (
                <Typography gutterBottom>{roll}</Typography>
              )}
            </Grid>
          </Grid>
          {/* Email */}
          <Grid container item>
            <Grid item xs={4}>
              <Typography gutterBottom>Email</Typography>
            </Grid>
            <Grid item xs={6} justify="flex-end">
              {isEditing ? (
                <TextField
                  name="email"
                  value={email}
                  onChange={handleChange}
                  autoFocus
                  color="primary"
                />
              ) : (
                <Typography gutterBottom>{email}</Typography>
              )}
            </Grid>
          </Grid>
        </Grid>

        <Grid className={classes.container} container item>
          <Grid
            item
            xs={12}
            style={{
              marginBottom: 20,
              borderBottom: "1px solid rgba(0,0,0,0.5)",
            }}>
            <Typography variant="h6" className="title" color="primary">
              Academic Info
            </Typography>
          </Grid>
          {loader ? (
            <CircularProgress color="primary" style={{ margin: "20px auto" }} />
          ) : (
            <>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                return (
                  <Fragment key={sem}>
                    <Grid item xs={6}>
                      <Typography gutterBottom>{`Sem ${sem} GPA`}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="center" gutterBottom>
                        {gpData[9 + sem]}
                      </Typography>
                    </Grid>
                  </Fragment>
                );
              })}

              <Grid item xs={6}>
                <Typography>CGPA</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="center">{gpData[18]}</Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Profile;
