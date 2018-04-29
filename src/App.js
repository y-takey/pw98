import _ from "lodash";
import React, { Component } from "react";
import Window from "./Window";
import parse from "./configParser";

class App extends Component {
  constructor(props) {
    super(props);

    const height = process.stdout.rows - 1;
    const width = process.stdout.columns;

    this.state = {
      height,
      width,
      procs: parse(props.config, { top: 0, left: 0, height, width })
    };
  }

  render() {
    const { height, width, procs } = this.state;

    return (
      <box top={0} left={0} height={height} width={width}>
        {procs.map((props, i) => (
          <Window {...props} index={i + 1} key={`proc-${i}`} />
        ))}
      </box>
    );
  }
}

export default App;
