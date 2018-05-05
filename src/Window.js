// @flow
import * as React from "react";
import spawn from "cross-spawn";

type Props = {
  top: number,
  left: number,
  height: number,
  width: number,
  index: number,
  name: string,
  command: string,
  commandArgs: Array<string>,
  onKeypress: Function,
  selected: boolean,
  hidden: boolean
};

type State = {
  active: boolean
};

class Window extends React.Component<Props, State> {
  state: State = { active: false };
  childProc: any = null;
  log: any = null;
  lastOutputTime: number = 0;

  componentDidMount() {
    this.startProc();
  }

  componentWillUnmount() {
    this.stopProc();
  }

  startProc = () => {
    const { command, commandArgs } = this.props;
    if (this.childProc) this.stopProc();

    this.childProc = spawn(command, commandArgs, {
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
    this.log.setContent("");
  };

  addLog = (data: any) => {
    const nowTime = Date.now();
    if (this.lastOutputTime + 3000 < nowTime) {
      const timeStamp = new Date().toTimeString().slice(0, 8);
      this.log.add("");
      this.log.add(
        `{gray-fg}${"=".repeat(this.props.width - 13)} ${timeStamp}{/gray-fg}`
      );
      this.log.add("");
    }

    this.log.add(data.toString("utf8").replace(/\n+$/g, ""));
    this.lastOutputTime = nowTime;
  };

  getBorderColor(): string {
    if (this.props.selected) return "cyan";

    return this.state.active ? "white" : "gray";
  }

  render() {
    const {
      top,
      left,
      height,
      width,
      index,
      name,
      hidden,
      onKeypress
    } = this.props;

    const options = {
      top,
      left,
      height,
      width,
      hidden,
      onKeypress,
      scrollable: true,
      alwaysScroll: true,
      scrollbar: {
        ch: " ",
        inverse: true
      },
      tags: true,
      border: { type: "line" },
      keyable: true,
      mouse: true,
      style: {
        border: { fg: this.getBorderColor() },
        scrollbar: { bg: "white" }
      }
    };

    return (
      <log
        ref={log => {
          this.log = log;
        }}
        {...options}
        label={` [${index}] ${name} ${this.state.active ? "" : "(inactive) "}`}
      />
    );
  }
}

export default Window;
