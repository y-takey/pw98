const dmy = {
  name: "",
  command: "echo X"
};

module.exports = {
  direction: "row",
  procs: [
    dmy,
    {
      direction: "column",
      procs: [
        {
          direction: "row",
          procs: [
            {
              direction: "column",
              procs: [
                dmy,
                {
                  direction: "row",
                  procs: [dmy, dmy]
                }
              ]
            },
            dmy
          ]
        },
        dmy
      ]
    }
  ]
};
