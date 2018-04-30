import { fill, flatMap } from "lodash";

const divideSize = (max, length) => {
  const per = Math.round(max / length);
  const ary = fill(new Array(length), per);
  ary[length - 1] = max - per * (length - 1);
  return ary;
};

export { divideSize };

const parse = ({ direction, procs }, { top, left, height, width }) => {
  const size = divideSize(direction === "row" ? width : height, procs.length);
  const currentPos = { top, left, height, width };

  return flatMap(procs, (proc, i) => {
    if (direction === "row") {
      currentPos.width = size[i];
      currentPos.left = size[0] * i;
    } else {
      currentPos.height = size[i];
      currentPos.top = size[0] * i;
    }
    if (proc.direction) return parse(proc, currentPos);
    const [command, ...commandArgs] = proc.command.split(" ");

    return { ...currentPos, name: proc.name, command, commandArgs };
  });
};

export default parse;
