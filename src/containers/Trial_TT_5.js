import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Trial from "./Trial";
import { setComponentData } from "../store";
import { create_blocks_singleton } from "../lib/tt_blocks";
var _ = require("lodash");

const TRIAL_NUM = 5;
const BLOCK_START = 12;
const BLOCK_END = 15; // not inclusive
const FIXATION_CROSSES = ["default", "green", "red"];

class Trial_TT_5 extends Component {
  constructor(props) {
    super(props);
    this.startTimestamp = new Date().getTime();

    const blocks = _.slice(create_blocks_singleton(), BLOCK_START, BLOCK_END);

    // Unique (shuffled) color for each block
    const shuffledColors = _.shuffle(FIXATION_CROSSES);
    this.blockColorMap = {};
    for (let i = BLOCK_START; i < BLOCK_END; i++) {
      this.blockColorMap[i] = shuffledColors[i - BLOCK_START];
    }

    this.blockBoundaries = [];
    let cumulative = 0;
    blocks.forEach((block) => {
      cumulative += block.length;
      this.blockBoundaries.push(cumulative);
    });

    this.state = {
      decibels: _.flatten(blocks),
      currentIndex: 0,
    };
  }

  getBlockForTrialIndex = (index) => {
    for (let i = 0; i < this.blockBoundaries.length; i++) {
      if (index < this.blockBoundaries[i]) {
        return BLOCK_START + i;
      }
    }
    return BLOCK_START;
  };

  handleTrialProgress = (index) => {
    this.setState({ currentIndex: index });
  };

  getCurrentCrossColor = () => {
    const block = this.getBlockForTrialIndex(this.state.currentIndex);
    return this.blockColorMap[block];
  };

  trialCompleteRenderer = (decibels, response, crossColors) => {
    return <Redirect to="/ThankYou" />;
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
      crossColors,
    );
  };

  render() {
    if (_.isEmpty(this.state.decibels)) {
      return <Redirect to="/Error" />;
    }
    return (
      <Trial
        decibels={this.state.decibels}
        shouldRecordRatings={true}
        trialCompleteRenderer={this.trialCompleteRenderer}
        dataHandler={this.dataHandler}
        blockIdx={TRIAL_NUM}
        constantCrossColor={this.getCurrentCrossColor()}
        onTrialProgress={this.handleTrialProgress}
      />
    );
  }
}

export default Trial_TT_5;
