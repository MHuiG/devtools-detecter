# [devtools detecter](https://github.com/MHuiG/devtools-detecter)

[![](https://img.shields.io/npm/v/devtools-detecter.svg?style=flat-square)](https://www.npmjs.com/package/devtools-detecter)


基于定时性能采样的 DevTools 检测

[Demo](https://devtools-detect.mhuig.top)

## Install

```bash
npm install devtools-detecter
```

## Usage

```html
<script src="https://unpkg.com/devtools-detecter/dist/DevtoolsDetecter.js"></script>
<script>
  DevtoolsDetecter.debug()
  DevtoolsDetecter.addListener(isOpen => {
    if (isOpen) {
      document.title = "DevTools detected";
      document.body.style["backgroundColor"] = "red";
    } else {
      document.title = "DevTools NOT detected";
      document.body.style["backgroundColor"] = "unset";
    }
  })
  DevtoolsDetecter.launch()
</script>
```

```html
<script type="module">
  import DevtoolsDetecter from "https://unpkg.com/devtools-detecter/index.js"
  DevtoolsDetecter.debug()
  DevtoolsDetecter.addListener(isOpen => {
    if (isOpen) {
      document.title = "DevTools detected";
      document.body.style["backgroundColor"] = "red";
    } else {
      document.title = "DevTools NOT detected";
      document.body.style["backgroundColor"] = "unset";
    }
  })
  DevtoolsDetecter.launch()
</script>
```

