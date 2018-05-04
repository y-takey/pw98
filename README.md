# pw98

Terminal application that customizable multiple process window.

![basic](https://raw.githubusercontent.com/y-takey/pw98/master/demo/ss1-basic.png)

![maximum](https://raw.githubusercontent.com/y-takey/pw98/master/demo/ss2-maximum.png)

# Installation

```
yarn add global pw98
# or
npm install -g pw98
```

you can install it to project local, too

# Usage

```
cd your/project/path
pw98 ./config.json
# or
pw98 /any/config/absolute/path.js
```

# Operation

| key                          | target pane                | description                                                       |
| ---------------------------- | -------------------------- | ----------------------------------------------------------------- |
| <kbd>←</kbd> or <kbd>→</kbd> | -                          | move selected pane. [none] -> [pane1] -> [pane2] -> ... -> [none] |
| <kbd>1</kbd> - <kbd>9</kbd>  | -                          | select Nth pane                                                   |
| <kbd>0</kbd>                 | -                          | deselect pane                                                     |
| <kbd>m</kbd>                 | selected pane              | toggle maximum / minimum pane                                     |
| <kbd>c</kbd>                 | selected pane or all panes | clear log                                                         |
| <kbd>r</kbd>                 | selected pane or all panes | restart process                                                   |
| <kbd>Ctrl+c</kbd>            | -                          | exit pw98                                                         |

# Config Structure

## Pane

| key         | type                          | desc                    |
| ----------- | ----------------------------- | ----------------------- |
| `direction` | "row" &#124; "column"         | direction to split pane |
| `procs`     | Array&lt;Proc &#124; Pane&gt; | can be nested           |

## Proc

| key       | type   | example       |
| --------- | ------ | ------------- |
| `name`    | string | `"test"`      |
| `command` | string | `"yarn jest"` |

## Examples

### 1. Simple ver (JSON)

```json
{
  "direction": "row",
  "procs": [
    { "name": "pane1", "command": "echo sample1-1" },
    { "name": "pane2", "command": "echo sample1-2" }
  ]
}
```

![example1](https://raw.githubusercontent.com/y-takey/pw98/master/demo/ss3-example1.png)

### 2. Complex ver (CommonJS Style)

```js
const pane1 = { name: "pane1", command: "echo sample2-1" };
const pane2 = { name: "pane2", command: "echo sample2-2" };
const pane3 = { name: "pane3", command: "echo sample2-3" };
const pane4 = { name: "pane4", command: "echo sample2-4" };

module.exports = {
  direction: "row",
  procs: [
    pane1,
    {
      direction: "column",
      procs: [
        {
          direction: "row",
          procs: [pane2, pane3]
        },
        pane4
      ]
    }
  ]
};
```

![example2](https://raw.githubusercontent.com/y-takey/pw98/master/demo/ss4-example2.png)

---

# Development

### Build (automaticaly)

```
$ yarn watch
```

### Test

```
$ node bin/index.js ./examples/config.js
```
