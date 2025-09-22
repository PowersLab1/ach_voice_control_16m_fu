import React from "react";
import { Route, Switch } from "react-router-dom";
import Welcome from "./containers/Welcome";
import Instructions from "./containers/Instructions";
import NotFound from "./containers/NotFound";
import Complete from "./containers/Complete";
import Continue from "./containers/Continue";
import Continue_rating from "./containers/Continue_rating";
import TrialQ from "./containers/TrialQ";
import Trial_P from "./containers/Trial_P";
import Trial_P_rating from "./containers/Trial_P_rating";
import OnceMore from "./containers/OnceMore";
import OnceMore_rating from "./containers/OnceMore_rating";
import Trial_TT_1 from "./containers/Trial_TT_1";
import Trial_TT_2 from "./containers/Trial_TT_2";
import Trial_TT_3 from "./containers/Trial_TT_3";
import Trial_TT_4 from "./containers/Trial_TT_4";
import Trial_TT_5 from "./containers/Trial_TT_5";
import Break1 from "./containers/Break1";
import Break2 from "./containers/Break2";
import Break3 from "./containers/Break3";
import Break4 from "./containers/Break4";
import ThankYou from "./containers/ThankYou";
import Error from "./containers/Error";

export default () => (
  <Switch>
    <Route
      path="/"
      exact
      render={(props) => {
        console.log("Route: /");
        return <Welcome {...props} />;
      }}
    />
    <Route
      path="/Welcome"
      exact
      render={(props) => {
        console.log("Route: /Welcome");
        return <Welcome {...props} />;
      }}
    />
    <Route
      path="/Instructions"
      exact
      render={(props) => {
        console.log("Route: /Instructions");
        return <Instructions {...props} />;
      }}
    />
    <Route
      path="/Trial_P"
      exact
      render={(props) => {
        console.log("Route: /Trial_P");
        return <Trial_P {...props} />;
      }}
    />
    <Route
      path="/OnceMore"
      exact
      render={(props) => {
        console.log("Route: /OnceMore");
        return <OnceMore {...props} />;
      }}
    />
    <Route
      path="/Continue"
      exact
      render={(props) => {
        console.log("Route: /Continue");
        return <Continue {...props} />;
      }}
    />
    <Route
      path="/Trial_P_rating"
      exact
      render={(props) => {
        console.log("Route: /Trial_P_rating");
        return <Trial_P_rating {...props} />;
      }}
    />
    <Route
      path="/OnceMore_rating"
      exact
      render={(props) => {
        console.log("Route: /OnceMore_rating");
        return <OnceMore_rating {...props} />;
      }}
    />
    <Route
      path="/Continue_rating"
      exact
      render={(props) => {
        console.log("Route: /Continue_rating");
        return <Continue_rating {...props} />;
      }}
    />
    <Route
      path="/TrialQ"
      exact
      render={(props) => {
        console.log("Route: /TrialQ");
        return <TrialQ {...props} />;
      }}
    />
    <Route
      path="/Complete"
      exact
      render={(props) => {
        console.log("Route: /Complete");
        return <Complete {...props} />;
      }}
    />
    <Route
      path="/Trial_TT_1"
      exact
      render={(props) => {
        console.log("Route: /Trial_TT_1");
        return <Trial_TT_1 {...props} />;
      }}
    />
    <Route
      path="/Break1"
      exact
      render={(props) => {
        console.log("Route: /Break1");
        return <Break1 {...props} />;
      }}
    />
    <Route
      path="/Trial_TT_2"
      exact
      render={(props) => {
        console.log("Route: /Trial_TT_2");
        return <Trial_TT_2 {...props} />;
      }}
    />
    <Route
      path="/Break2"
      exact
      render={(props) => {
        console.log("Route: /Break2");
        return <Break2 {...props} />;
      }}
    />
    <Route
      path="/Trial_TT_3"
      exact
      render={(props) => {
        console.log("Route: /Trial_TT_3");
        return <Trial_TT_3 {...props} />;
      }}
    />
    <Route
      path="/Break3"
      exact
      render={(props) => {
        console.log("Route: /Break3");
        return <Break3 {...props} />;
      }}
    />
    <Route
      path="/Trial_TT_4"
      exact
      render={(props) => {
        console.log("Route: /Trial_TT_4");
        return <Trial_TT_4 {...props} />;
      }}
    />
    <Route
      path="/Break4"
      exact
      render={(props) => {
        console.log("Route: /Break4");
        return <Break4 {...props} />;
      }}
    />
    <Route
      path="/Trial_TT_5"
      exact
      render={(props) => {
        console.log("Route: /Trial_TT_5");
        return <Trial_TT_5 {...props} />;
      }}
    />
    <Route
      path="/ThankYou"
      exact
      render={(props) => {
        console.log("Route: /ThankYou");
        return <ThankYou {...props} />;
      }}
    />
    <Route
      path="/Error"
      exact
      render={(props) => {
        console.log("Route: /Error");
        return <Error {...props} />;
      }}
    />
    {/* Catch all unmatched routes */}
    <Route
      render={(props) => {
        console.log(
          "Route NotFound - Attempted path:",
          props.location.pathname,
        );
        console.log("Route NotFound - State:", props.location.state);
        return <NotFound {...props} />;
      }}
    />
  </Switch>
);
