import React, { Component } from "react";
import spawn from "cross-spawn";

class Window extends Component {
  state = { active: false };

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
    this.childProc.on("close", this.deactivate);
    this.setState({ active: true });
  };

  stopProc = () => {
    if (!this.childProc) return;
    this.childProc.kill();
    this.deactivate();
  };

  restartProc = () => {
    this.stopProc();
    this.startProc();
  };

  deactivate = () => {
    this.childProc = null;
    this.setState({ active: false });
  };

  clear = () => {
    this.refs.log.setContent("");
  };

  addLog = data => {
    const nowTime = Date.now();
    if (this.lastOutputTime + 3000 < nowTime) {
      const timeStamp = new Date().toTimeString().slice(0, 8);
      this.refs.log.add("");
      this.refs.log.add(
        `{gray-fg}${"=".repeat(this.props.width - 13)} ${timeStamp}{/gray-fg}`
      );
      this.refs.log.add("");
    }

    this.refs.log.add(data.toString("utf8").replace(/\n+$/g, ""));
    this.lastOutputTime = nowTime;
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

    const borderColor = selected
      ? "cyan"
      : this.state.active
        ? "white"
        : "gray";
    const options = {
      top,
      left,
      height,
      width,
      hidden,
      scrollable: true,
      alwaysScroll: true,
      scrollbar: {
        ch: " ",
        inverse: true
      },
      tags: true,
      border: { type: "line" },
      mouse: true,
      style: {
        border: { fg: borderColor },
        scrollbar: { bg: "white" }
      }
    };

    return (
      <log
        ref="log"
        {...options}
        label={` [${index}] ${name} ${this.state.active ? "" : "(inactive) "}`}
      />
    );
  }
}

export default Window;
