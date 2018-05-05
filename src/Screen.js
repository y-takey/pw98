import blessed from "blessed";

const Screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  dockBorders: false,
  fullUnicode: true,
  title: "PW98"
});

Screen.key(["C-c"], () => process.exit(0));

export default Screen;
