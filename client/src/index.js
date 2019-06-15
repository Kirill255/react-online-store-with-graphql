import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import Navbar from "./components/Navbar";
import App from "./components/App";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Checkout from "./components/Checkout";
import Brews from "./components/Brews";

import { getTokenFromLocalStorage } from "./utils";
import * as serviceWorker from "./serviceWorker";

import "gestalt/dist/gestalt.css";
import "./index.css";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      getTokenFromLocalStorage() !== null ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const Root = () => (
  <Router>
    <>
      <Navbar />

      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
        <PrivateRoute path="/checkout" component={Checkout} />
        <Route path="/:brandId" component={Brews} />
      </Switch>
    </>
  </Router>
);

ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

if (module.hot) {
  module.hot.accept();
}
