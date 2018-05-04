import parse, { divideSize } from "../src/configParser";

test("divideSize", () => {
  expect(divideSize(10, 3)).toEqual([3, 3, 4]);
  expect(divideSize(12, 2)).toEqual([6, 6]);
});

const testConfig = {
  direction: "row",
  procs: [
    { name: "cont1", command: "yarn foo bar" },
    {
      direction: "column",
      procs: [
        { name: "cont2", command: "date" },
        { name: "cont3", command: "yarn hoge" }
      ]
    }
  ]
};

test("basic", () => {
  expect(parse(testConfig, { top: 0, left: 0, height: 21, width: 30 })).toEqual(
    [
      {
        top: 0,
        left: 0,
        height: 21,
        width: 15,
        name: "cont1",
        command: "yarn",
        commandArgs: ["foo", "bar"]
      },
      {
        top: 0,
        left: 15,
        height: 11,
        width: 15,
        name: "cont2",
        command: "date",
        commandArgs: []
      },
      {
        top: 11,
        left: 15,
        height: 10,
        width: 15,
        name: "cont3",
        command: "yarn",
        commandArgs: ["hoge"]
      }
    ]
  );
});

const testConfig2 = {
  direction: "row",
  procs: [
    { name: "cmd1", command: "date" },
    {
      direction: "row",
      procs: [
        { name: "cmd2", command: "date" },
        { name: "cmd3", command: "date" }
      ]
    },
    { name: "cmd4", command: "date" }
  ]
};

test("basic", () => {
  expect(
    parse(testConfig2, { top: 0, left: 0, height: 21, width: 30 })
  ).toEqual([
    {
      top: 0,
      left: 0,
      height: 21,
      width: 10,
      name: "cmd1",
      command: "date",
      commandArgs: []
    },
    {
      top: 0,
      left: 10,
      height: 21,
      width: 5,
      name: "cmd2",
      command: "date",
      commandArgs: []
    },
    {
      top: 0,
      left: 15,
      height: 21,
      width: 5,
      name: "cmd3",
      command: "date",
      commandArgs: []
    },
    {
      top: 0,
      left: 20,
      height: 21,
      width: 10,
      name: "cmd4",
      command: "date",
      commandArgs: []
    }
  ]);
});

test("example", () => {
  expect(1 + 2).toEqual(3);
});
