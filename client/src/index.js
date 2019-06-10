import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import App from "./components/App";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Checkout from "./components/Checkout";

import * as serviceWorker from "./serviceWorker";

import "gestalt/dist/gestalt.css";

const Root = () => (
  <Router>
    <>
      <Navbar />

      <Switch>
        <Route to="/" exact component={App} />
        <Route to="/signin" component={Signin} />
        <Route to="/signup" component={Signup} />
        <Route to="/checkout" component={Checkout} />
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
