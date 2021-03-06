// @flow
import tty from "tty";
import _ from "lodash";
import * as React from "react";
import Window from "./Window";
import parse from "./configParser";

type Proc = { name: string, command: string };
type Pane = { direction: "row" | "column", procs: Array<Proc | Pane> };
type Props = { config: Pane };
type State = {
  height: number,
  width: number,
  procs: Array<Object>,
  selectedNo: number,
  maximum: boolean
};

const keyDesc = _.map(
  [
    ["<-/->", "Move"],
    ["1-9", "Select"],
    ["0", "Deselect"],
    ["c", "Clear"],
    ["m", "Max/Min"],
    ["r", "Restart"],
    ["Ctrl+c", "Exit"]
  ],
  ([k, v]) => ` ${k}: ${v}`
).join("  ");

const containerOptions = {
  focused: true,
  keyable: true,
  mouse: false
};

class App extends React.Component<Props, State> {
  keyMap = null;
  panes = {};

  constructor(props: Props) {
    super(props);

    this.state = { ...this.calcProcInfo(), selectedNo: 0, maximum: false };
  }

  calcProcInfo = () => {
    if (!(process.stdout instanceof tty.WriteStream))
      return { height: 0, width: 0, procs: [] };

    const { rows, columns } = process.stdout;
    const height = rows - 1;
    const width = columns;
    const procs = parse(this.props.config, {
      top: 0,
      left: 0,
      height,
      width
    }).map((proc, i) => ({
      ...proc,
      key: `proc${i + 1}`
    }));

    return { height, width, procs };
  };

  handleResize = () => {
    this.setState(this.calcProcInfo());
  };

  moveNo = (amount: number) => {
    let selectedNo = this.state.selectedNo + amount;
    const maxNo = this.state.procs.length;
    if (selectedNo < 0) {
      selectedNo = maxNo;
    } else if (selectedNo > maxNo) {
      selectedNo = 0;
    }

    this.setState({ selectedNo });
  };

  selectNo = (key: Object) => {
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
    this.targetProcs().forEach(proc => this.panes[proc.key].clear());
  };

  toggleWindow = () => {
    this.setState({ maximum: !this.state.maximum });
  };

  restartProc = () => {
    this.targetProcs().forEach(proc => this.panes[proc.key].restartProc());
  };

  keyBindings = (keyName: string) => {
    if (!this.keyMap) {
      this.keyMap = {
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
    return this.keyMap[keyName];
  };

  handleKeypress = (_char: any, key: Object) => {
    const func = this.keyBindings(key.name || key.ch);
    if (func) func(key);
  };

  windowProps = (rawProps: Object, no: number) => {
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
      ref: pane => {
        this.panes[props.key] = pane;
      },
      selected
    };
  };

  render() {
    const { height, width, procs } = this.state;
    const layout = { top: 0, left: 0, height, width };

    return (
      <box
        {...containerOptions}
        {...layout}
        onKeypress={this.handleKeypress}
        onResize={this.handleResize}
      >
        {procs.map((props, i) => (
          <Window
            {...this.windowProps(props, i + 1)}
            key={props.key}
            onKeypress={this.handleKeypress}
          />
        ))}
        <box
          top={height}
          height={1}
          style={{ fg: "black", bg: "white" }}
          content={keyDesc}
        />
      </box>
    );
  }
}

export default App;
