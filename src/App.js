import React, { Component } from "react";
import "./App.css";
import Routes from "./Routes";

class App extends Component {
  constructor(props) {
    super(props);
    console.log("App constructor called");
  }

  render() {
    console.log("App render called");
    return (
      <div>
        <Routes />
      </div>
    );
  }
}

export default App;
