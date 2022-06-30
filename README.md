# [devtools detect](https://github.com/MHuiG/timing-sampling-devtools-detect)
基于定时性能采样的 DevTools 检测

[Demo](https://devtools-detect.mhuig.top)


## Usage

```html
<script src="./dist/DevtoolsDetecter.js"></script>
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

