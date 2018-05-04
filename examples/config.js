module.exports = {
  direction: "row",
  procs: [
    {
      direction: "colomn",
      procs: [
        { name: "build", command: "yarn watch" },
        { name: "test", command: "yarn test" }
      ]
    },
    {
      direction: "colomn",
      procs: [
        { name: "lint", command: "yarn lint" },
        { name: "flow", command: "yarn flow" }
      ]
    }
  ]
};
