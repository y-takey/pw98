const test = {
  name: "test",
  command: "jest"
};
const lint = {
  name: "lint",
  command: "yarn lint"
};
const flow = {
  name: "flow",
  command: "yarn flow"
};

module.exports = {
  direction: "row",
  procs: [
    test,
    {
      direction: "column",
      procs: [lint, flow]
    }
  ]
};
