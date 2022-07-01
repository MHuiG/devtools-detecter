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

## API

- debug()
  开发调试打印
- getStatus()
  获取控制台是否打开状态 返回 `true` 或 `false`
- setBenchmarkMaxN(value: number)
  设置基准最大的N， 默认初始值：`7000000`
- setBenchmark(value: function)
  设置基准函数，默认详见源码
- setTimingSamplingMaxN(value: number)
  设置计时采样最大的N，默认初始值：`1000`
- setTimer(t: number)
  设置检测周期，默认初始值：`500`
- addListener(callBack: (isOpen: boolean) => void)
  添加监听器
- launch()
  开始检测
- stop()
  停止检测


