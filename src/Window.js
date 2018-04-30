import React, { Component } from "react";

class Window extends Component {
  componentDidMount() {
    this.timer = setInterval(() => {
      this.refs.log.add(new Date());
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { top, left, height, width, index, name, selected } = this.props;

    const options = {
      top,
      left,
      height,
      width,
      border: { type: "line" },
      style: { border: { fg: selected ? "cyan" : "white" } }
    };

    return <log ref="log" {...options} label={` [${index}] ${name} `} />;
  }
}

export default Window;
