import React, { Component } from "react";
import spawn from "cross-spawn";

class Window extends Component {
  componentDidMount() {
    this.startProc();
  }

  componentWillUnmount() {
    this.stopProc();
  }

  startProc = () => {
    const { command, commandArgs } = this.props;
    if (this.childProc) this.stopProc();

    this.childProc = spawn(command, [...commandArgs, "--color"], {
      stdio: [null, null, null, null],
      detached: true
    });
    this.childProc.stdout.on("data", this.addLog);
    this.childProc.stderr.on("data", this.addLog);
    this.childProc.on("close", () => (this.childProc = null));
  };

  stopProc = () => {
    if (!this.childProc) return;
    this.childProc.kill();
    this.childProc = null;
  };

  restartProc = () => {
    this.stopProc();
    this.startProc();
  };

  clear = () => {
    this.refs.log.setContent("");
  };

  addLog = data => {
    this.refs.log.add(data.toString("utf8").replace(/\n+$/g, ""));
  };

  render() {
    const {
      top,
      left,
      height,
      width,
      index,
      name,
      selected,
      hidden
    } = this.props;

    const options = {
      top,
      left,
      height,
      width,
      hidden,
      scrollable: true,
      border: { type: "line" },
      style: { border: { fg: selected ? "cyan" : "white" } }
    };

    return <log ref="log" {...options} label={` [${index}] ${name} `} />;
  }
}

export default Window;
