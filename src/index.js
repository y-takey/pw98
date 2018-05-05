#!/usr/bin/env node
/* eslint no-console: "off" */

import path from "path";
import fs from "fs";
import program from "commander";
import React from "react";
import { render } from "react-blessed";

import App from "./App";
import Screen from "./Screen";
import updateCheck from "./selfUpdateChecker";
import pkg from "../package.json";

program.version(pkg.version).parse(process.argv);

const configPath = path.resolve(process.cwd(), program.args[0]);

if (!fs.existsSync(configPath)) {
  console.error(
    `Couldn't find config file '${configPath}' (current path is '${process.cwd()}').`
  );
  process.exit(1);
}

// self version check
const versionCheckResult = [];
setImmediate(updateCheck, pkg.version, versionCheckResult);
process.on("exit", () => {
  if (!versionCheckResult.length) return;

  console.log(versionCheckResult.join("\n"));
});

// eslint-disable-next-line import/no-dynamic-require
const config = require(configPath);
render(<App config={config} />, Screen);
