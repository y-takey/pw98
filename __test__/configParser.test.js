import parse, { divideSize } from "../src/configParser";

test("divideSize", () => {
  expect(divideSize(10, 3)).toEqual([3, 3, 4]);
  expect(divideSize(12, 2)).toEqual([6, 6]);
});

const testConfig = {
  direction: "row",
  procs: [
    { name: "cont1" },
    {
      direction: "column",
      procs: [{ name: "cont2" }, { name: "cont3" }]
    }
  ]
};

test("basic", () => {
  expect(parse(testConfig, { top: 0, left: 0, height: 21, width: 30 })).toEqual(
    [
      { top: 0, left: 0, height: 21, width: 15, name: "cont1" },
      { top: 0, left: 15, height: 11, width: 15, name: "cont2" },
      { top: 11, left: 15, height: 10, width: 15, name: "cont3" }
    ]
  );
});
