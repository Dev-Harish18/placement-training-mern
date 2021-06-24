import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useSelector } from "react-redux";
//Components
import Navbar from "./components/Navbar";
import MyAlert from "./components/Alert";
//Pages
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Signout from "./pages/Signout";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import AllQuizes from "./pages/AllQuizes";
import Error from "./pages/Error";
import AddQuiz from "./pages/AddQuiz";
import EditQuiz from "./pages/EditQuiz";
import GetQuiz from "./pages/GetQuiz";
import Stats from "./pages/Stats";
import Details from "./pages/Details";
import ProtectedRoute from "./components/ProtectedRoute";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ff6e6c",
    },
    secondary: {
      main: "#1f1235",
    },
  },
  typography: {
    fontFamily: "Kanit,sans-serif",
    fontWeight: 300,
    h3: {
      fontWeight: 700,
    },
  },
});
const useStyles = makeStyles((theme) => ({
  dummyNav: {
    ...theme.mixins.toolbar,
    marginBottom: 20,
  },
}));

function App() {
  const classes = useStyles();
  const user = useSelector((state) => state.user.currentUser);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <div className="content">
          <Container>
            <div className={classes.dummyNav}></div>
            <MyAlert />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/users/signup" component={Signup} />
              <Route
                exact
                path="/users/signin"
                render={() => (!user ? <Signin /> : <Redirect to="/" />)}
              />
              <Route
                exact
                path="/users/signout"
                render={() => (user ? <Signout /> : <Redirect to="/" />)}
              />
              <Route
                exact
                path="/users/forgotpassword"
                component={ForgotPassword}
              />
              <Route
                exact
                path="/users/resetpassword/:token"
                component={ResetPassword}
              />
              <ProtectedRoute
                exact
                path="/users/:roll"
                component={Profile}
                authenticate
              />

              <ProtectedRoute
                exact
                path="/quizes"
                authenticate
                component={AllQuizes}
              />
              <ProtectedRoute
                exact
                path="/quizes/add/"
                authenticate
                authorize
                component={AddQuiz}
              />
              <ProtectedRoute
                exact
                authenticate
                path="/quizes/:id"
                component={GetQuiz}
              />
              <ProtectedRoute
                exact
                authenticate
                authorize
                path="/quizes/edit/:id"
                component={EditQuiz}
              />
              <ProtectedRoute
                exact
                authenticate
                authorize
                path="/quizes/stats/:id"
                component={Stats}
              />
              <ProtectedRoute
                exact
                authenticate
                authorize
                path="/details"
                component={Details}
              />
              <Route path="*" component={Error} />
            </Switch>
          </Container>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
