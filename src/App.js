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

class App extends Component {
  constructor(props) {
    super(props);

    const height = process.stdout.rows - 1;
    const width = process.stdout.columns;

    this.state = {
      height,
      width,
      selectedNo: 0,
      procs: parse(props.config, { top: 0, left: 0, height, width })
    };
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

  clearLog = () => {};

  toggleWindow = () => {};

  restartProc = () => {};

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

  render() {
    const { height, width, procs, selectedNo } = this.state;
    const containerOptions = {
      keys: true,
      keyable: true,
      mouse: false,
      focused: true,
      scrollable: false
    };

    return (
      <box
        {...containerOptions}
        top={0}
        left={0}
        height={height}
        width={width}
        onKeypress={this.handleKeypress}
      >
        {procs.map((props, i) => (
          <Window
            {...props}
            index={i + 1}
            key={`proc-${i}`}
            selected={selectedNo - 1 === i}
          />
        ))}
        <text top={height}>{keyDesc}</text>
      </box>
    );
  }
}

export default App;
