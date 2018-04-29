import React, { Component } from "react";

class Window extends Component {
  render() {
    const { top, left, height, width, index, name } = this.props;
    const options = {
      top,
      left,
      height,
      width,
      border: { type: "line" },
      style: { border: { fg: "white" } }
    };

    return <log ref="log" {...options} label={` ${index}: ${name} `} />;
  }
}

export default Window;
