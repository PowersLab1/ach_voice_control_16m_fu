import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Trial from "./Trial";
import { setComponentData } from "../store";
import { create_blocks_singleton } from "../lib/tt_blocks";
var _ = require("lodash");
const config = require("../config");

const TRIAL_NUM = 2;
const BLOCK_START = 3;
const BLOCK_END = 6; // not inclusive

class Trial_TT_2 extends Component {
  constructor(props) {
    super(props);
    this.startTimestamp = new Date().getTime();

    // Use explicit arguments to guarantee block creation in debug/dev
    const decibels = _.flatten(
      _.slice(create_blocks_singleton(25, 50, 75), BLOCK_START, BLOCK_END),
    );
    console.log("Trial_TT_2 decibels (before setState):", decibels);
    this.state = {
      decibels,
    };
  }

  trialCompleteRenderer = (decibels, response, crossColors) => {
    console.log("Trial_TT_2 complete, redirecting to Break2");
    // If debugging, then we're done here
    if (config.debug) {
      return <Redirect to="/Break2" />;
    } else {
      return <Redirect to="/Break2" />;
    }
  };

  dataHandler = (
    decibels,
    response,
    responseTime,
    ratings,
    ratingsRaw,
    timestamps,
    crossColors,
  ) => {
    console.log("Trial_TT_2 data handler called");
    setComponentData(
      TRIAL_NUM,
      decibels,
      response,
      responseTime,
      ratings,
      ratingsRaw,
      timestamps,
      this.startTimestamp,
      crossColors,
    );
  };

  render() {
    // If decibels is empty, show error
    if (_.isEmpty(this.state.decibels)) {
      return <div>Error: No decibels</div>;
      // Or, if you want to redirect:
      // return <Redirect to="/Error" />;
    }

    return (
      <Trial
        decibels={this.state.decibels}
        shouldRecordRatings={true}
        trialCompleteRenderer={this.trialCompleteRenderer}
        dataHandler={this.dataHandler}
        blockIdx={TRIAL_NUM}
        constantCrossColor="default"
      />
    );
  }
}

export default Trial_TT_2;
