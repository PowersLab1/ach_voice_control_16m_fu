import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Trial from "./Trial";
import { setComponentData } from "../store";
import { create_blocks_singleton } from "../lib/tt_blocks";
var _ = require("lodash");
const config = require("../config");

const TRIAL_NUM = 1;
const BLOCK_START = 0;
const BLOCK_END = 3; // not inclusive

class Trial_TT_1 extends Component {
  constructor(props) {
    super(props);
    this.startTimestamp = new Date().getTime();

    // Use explicit arguments to guarantee block creation in debug/dev
    const decibels = _.flatten(
      _.slice(create_blocks_singleton(25, 50, 75), BLOCK_START, BLOCK_END),
    );
    console.log("Trial_TT_1 decibels (before setState):", decibels);
    this.state = { decibels };
  }

  trialCompleteRenderer = (decibels, response, crossColors) => {
    // If debugging, then we're done here
    if (config.debug) {
      // return <Redirect to="/ThankYou" />;
      return <Redirect to="/Break1" />;
    } else {
      return <Redirect to="/Break1" />;
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
    setComponentData(
      TRIAL_NUM,
      decibels,
      response,
      responseTime,
      ratings,
      ratingsRaw,
      timestamps,
      this.startTimestamp,
      crossColors, // Pass the cross colors to the storage function
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

export default Trial_TT_1;
