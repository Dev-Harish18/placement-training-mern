import React, { useState } from "react";
import Appbar from "@material-ui/core/Appbar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Avatar from "@material-ui/core/Avatar";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import { Button, ListItem, List, ListItemText } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "../images/logo.png";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
  },
  appBar: {
    display: "flex",
    color: "#2835b3",
  },
  title: {
    flexGrow: 1,
    fontWeight: 800,
  },
  logo: {
    objectFit: "contain",
    width: "100%",
    height: "100%",
  },
  avatar: {
    fontWeight: "bolder",
    backgroundColor: "#2835b3",
    color: "white",
    "&:hover": {
      backgroundColor: "#0a0653",
    },
  },
  profile: {
    color: "#1f1235",
    fontWeight: 900,
    display: "flex",
    placeItems: "center",
    fontSize: 18,
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const [stateOfDrawer, setStateOfDrawer] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const name = user && user.name ? user.name.split(" ")[0].toLowerCase() : null;
  let loggedIn = Boolean(user);
  let isAdmin = Boolean(user && user.role === "admin"),
    list;
  if (loggedIn && isAdmin)
    list = [
      { key: 1, name: "Add Quiz", path: "/quizes/add" },
      { key: 2, name: "Quizzes", path: "/quizes" },
      { key: 3, name: "Placement Details", path: `/details` },
      { key: 4, name: "Signout", path: "/users/signout" },
    ];
  else if (loggedIn && !isAdmin)
    list = [
      { key: 1, name: "Quizzes", path: "/quizes" },
      { key: 2, name: "Signout", path: "/users/signout" },
    ];
  else
    list = [
      { key: 1, name: "Signin", path: "/users/signin" },
      { key: 2, name: "Signup", path: "/users/signup" },
    ];
  const toggleDrawer = () => {
    setStateOfDrawer(!stateOfDrawer);
  };
  return (
    <div className={classes.root}>
      <Appbar component="nav" className={classes.appBar}>
        <Toolbar>
          <IconButton onClick={toggleDrawer}>
            <MenuIcon color="secondary" />
          </IconButton>
          <Typography className={classes.title} variant="h6">
            <Link style={{ color: "#1f1235" }} to="/">
              Placement Training
            </Link>
          </Typography>
          {loggedIn ? (
            <Link
              className={classes.profile}
              to={`/users/${(user && user.roll) || 1818126}`}>
              <IconButton>
                <Avatar className={classes.avatar}>
                  {name && name[0].toUpperCase()}
                </Avatar>
              </IconButton>
            </Link>
          ) : (
            <Link to="/users/signin">
              <Button
                style={{ fontWeight: "bolder" }}
                variant="contained"
                color="secondary">
                Signin
              </Button>
            </Link>
          )}
        </Toolbar>
      </Appbar>
      <SwipeableDrawer
        open={stateOfDrawer}
        onClose={() => setStateOfDrawer(false)}
        onOpen={() => setStateOfDrawer(true)}>
        <Link to="/" onClick={() => setStateOfDrawer(false)}>
          <img className={classes.logo} src={Logo} alt="logo" />
        </Link>
        <Divider />
        <List component="nav">
          {list.map((item) => (
            <Link
              key={item.key}
              onClick={() => setStateOfDrawer(false)}
              to={item.path}>
              <ListItem button divider>
                <ListItemText
                  style={{
                    textDecoration: "none",
                    color: "#ff6e6c",
                    fontWeight: "800",
                    fontSize: 20,
                  }}
                  className={classes.navLink}
                  primary={item.name}
                />
              </ListItem>
            </Link>
          ))}
        </List>
      </SwipeableDrawer>
    </div>
  );
};

export default Navbar;
