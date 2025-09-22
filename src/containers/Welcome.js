import React, { Component } from "react";
import logo from "../media/psych_logo.jpg";
import "./Welcome.css";
import { Redirect } from "react-router-dom";
import {
  setEncryptedMetadata,
  getEncryptedMetadata,
  getDataSent,
  setSurveyUrl,
} from "../store";

var qs = require("query-string");
var _ = require("lodash");

// Check if running locally
const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
    ),
);

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.keyFunction = this.keyFunction.bind(this);
    this.state = {
      continue: false,
      invalid: false,
      dataSent: false,
    };
  }

  keyFunction(event) {
    if (event.keyCode === 81) {
      this.setState((state, props) => ({
        continue: true,
      }));
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keyFunction, false);

    // Get the full hash part (everything after #)
    const hashPart = window.location.hash || "";
    console.log("Hash part:", hashPart);

    // Extract the query string from the hash
    let searchString = "";
    if (hashPart.includes("?")) {
      searchString = "?" + hashPart.split("?")[1];
    }
    console.log("Extracted search string:", searchString);

    // Parse parameters
    const params = qs.parse(searchString, { ignoreQueryPrefix: true });
    console.log("Parsed params:", params);

    // Update encrypted metadata (param id)
    if (_.isUndefined(params.id)) {
      // If running locally and no ID, use a default test ID
      if (isLocalhost) {
        console.log("Local development detected - using test ID");
        setEncryptedMetadata("local_test_id");
      }
      // If not local and no metadata, show error
      else if (_.isUndefined(getEncryptedMetadata())) {
        this.setState({ invalid: true });
      }
    } else {
      // If metadata is passed in as a param, then we set it.
      console.log("Setting ID from URL:", params.id);
      setEncryptedMetadata(params.id);
    }

    if (!_.isUndefined(params.survey_url)) {
      console.log("Setting survey URL:", params.survey_url);
      setSurveyUrl(params.survey_url);
    }

    // After we update the id and data is still "sent",
    // then redirect.
    if (getDataSent()) {
      this.setState({ dataSent: true });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyFunction, false);
  }

  render() {
    if (this.state.invalid) {
      return <Redirect to="/Error" />;
    } else if (this.state.dataSent) {
      // If we already sent out data, we're done.
      return <Redirect to="/ThankYou" />;
    } else if (this.state.continue === true) {
      return <Redirect to="/Instructions" />;
    }

    return (
      <div className="Welcome">
        <input type="hidden" />
        <header className="Welcome-header">
          <div className="text-container">
            <p className="Welcome-text">
              <span className="bigger">Welcome to the study! </span>
              <br />
              <br /> In this task you will be asked to indicate whether you hear
              a tone being played.
              <br />
              <br />
              Please enter responses to the questions asked by pressing the:
              <br />
              <br />{" "}
              <font size="+2">
                {" "}
                <b> 'Q' key for 'YES I HEAR IT'</b> or{" "}
                <b> 'E' key for "NO I DO NOT'</b>{" "}
              </font>
              <br />
              <br />
              <br />
              <br /> Sometimes it may be difficult to answer, but if you do not
              know, please make your best guess.
              <br />
              <br />
              <br />
              <br /> Please keep your volume (including headphones) and screen
              brightness at maximum level throughout the experiment.
              <br />
              <br />
              <br />
              <br /> PRESS the <b> YES I HEAR IT / 'Q' key </b> to CONTINUE
            </p>
          </div>
          <a
            href="https://medicine.yale.edu/psychiatry/care/cmhc/"
            title="Learn more about the Connecticut Mental Health Center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={logo} className="Site-link" alt="logo" />
          </a>
        </header>
      </div>
    );
  }
}

export default Welcome;
