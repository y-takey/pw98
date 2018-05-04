#!/usr/bin/env node
// @flow

import path from "path";
import fs from "fs";
import program from "commander";
import React from "react";
import { render } from "react-blessed";

import App from "./App";
import Screen from "./screen";
import pkg from "../package.json";

program.version(pkg.version).parse(process.argv);

const configPath = path.resolve(process.cwd(), program.args[0]);

if (!fs.existsSync(configPath)) {
  console.error(
    `Couldn't find config file '${configPath}' (current path is '${process.cwd()}').`
  );
  process.exit(1);
}

const config = require(configPath);

render(<App config={config} />, Screen);
