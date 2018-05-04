import _ from "lodash";
import React, { Component } from "react";
import Window from "./Window";
import parse from "./configParser";

const keyDesc = _.map(
  {
    "<-/->": "Move",
    "0": "Deselect",
    "1-9": "Select",
    c: "Clear",
    m: "Maximize/Minimize",
    r: "Restart"
  },
  (v, k) => ` ${k}: ${v}`
).join(", ");

const containerOptions = {
  focused: true,
  keys: true,
  keyable: true,
  mouse: false
};

class App extends Component {
  constructor(props) {
    super(props);

    const height = process.stdout.rows - 1;
    const width = process.stdout.columns;
    const procs = parse(props.config, { top: 0, left: 0, height, width });
    procs.forEach((proc, i) => (proc.key = `proc${i + 1}`));

    this.state = { height, width, procs, selectedNo: 0, maximum: false };
  }

  moveNo = (amount, _key) => {
    let selectedNo = this.state.selectedNo + amount;
    const maxNo = this.state.procs.length;
    if (selectedNo < 0) {
      selectedNo = maxNo;
    } else if (selectedNo > maxNo) {
      selectedNo = 0;
    }

    this.setState({ selectedNo });
  };

  selectNo = key => {
    let selectedNo = Number(key.ch);
    const maxNo = this.state.procs.length;
    if (selectedNo > maxNo) selectedNo = maxNo;

    this.setState({ selectedNo });
  };

  targetProcs = () => {
    const { procs, selectedNo } = this.state;
    return selectedNo ? [procs[selectedNo - 1]] : procs;
  };

  clearLog = () => {
    this.targetProcs().forEach(proc => this.refs[proc.key].clear());
  };

  toggleWindow = () => {
    this.setState({ maximum: !this.state.maximum });
  };

  restartProc = () => {
    this.targetProcs().forEach(proc => this.refs[proc.key].restartProc());
  };

  keyBindings = keyName => {
    if (!this._keyMap) {
      this._keyMap = {
        left: _.partial(this.moveNo, -1),
        right: _.partial(this.moveNo, 1),
        "0": this.selectNo,
        "1": this.selectNo,
        "2": this.selectNo,
        "3": this.selectNo,
        "4": this.selectNo,
        "5": this.selectNo,
        "6": this.selectNo,
        "7": this.selectNo,
        "8": this.selectNo,
        "9": this.selectNo,
        c: this.clearLog,
        m: this.toggleWindow,
        r: this.restartProc
      };
    }
    return this._keyMap[keyName];
  };

  handleKeypress = (_char, key) => {
    const func = this.keyBindings(key.name || key.ch);
    if (func) func(key);
  };

  windowProps = (rawProps, no) => {
    const { height, width, selectedNo, maximum } = this.state;
    const maximize = maximum && selectedNo;
    const selected = selectedNo === no;

    let props;
    if (maximize && selected) {
      props = {
        ...rawProps,
        top: 0,
        left: 0,
        height,
        width,
        hidden: false
      };
    } else {
      props = { ...rawProps, hidden: maximize };
    }

    return {
      ...props,
      index: no,
      ref: props.key,
      selected
    };
  };

  render() {
    const { height, width, procs } = this.state;
    const layout = { top: 0, left: 0, height, width };

    return (
      <box {...containerOptions} {...layout} onKeypress={this.handleKeypress}>
        {procs.map((props, i) => (
          <Window {...this.windowProps(props, i + 1)} />
        ))}
        <text top={height}>{keyDesc}</text>
      </box>
    );
  }
}

export default App;
