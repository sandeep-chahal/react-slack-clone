import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import firebase from "./firebase";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import rootReducer from "./Redux/Reducers";
import { setUser } from "./Redux/Actions";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter
} from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
class Root extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.history.push("/");
        this.props.setUser(user);
      }
    });
  }
  render() {
    return (
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => dispatch(setUser(user))
  };
};

const RootWithAuth = withRouter(connect(null, mapDispatchToProps)(Root));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
