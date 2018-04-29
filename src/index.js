#!/usr/bin/env node
// @flow

import program from "commander";
import spawn from "cross-spawn";
import React from "react";
import { render } from "react-blessed";

import App from "./App";
import Screen from "./screen";
import pkg from "../package.json";

program.version(pkg.version).parse(process.argv);

const config = require(program.args[0]);
// console.log("config is ", config);

// Spawn NPM asynchronously
// const child = spawn("yarn", ["test"], { stdio: "inherit" });

render(<App config={config} />, Screen);
