# [devtools detecter](https://github.com/MHuiG/devtools-detecter)

[![](https://img.shields.io/npm/v/devtools-detecter.svg?style=flat-square)](https://www.npmjs.com/package/devtools-detecter)


基于定时性能采样的 DevTools 检测

[Module Demo](https://devtools-detect.mhuig.top)

[ES5 Demo](https://devtools-detect.mhuig.top/es5/)

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

## 方案设计

### Benchmark

检测前运行一个基准函数 `Benchmark()`，计算基准的执行时间。

要求打开或关闭 devtools 对基准函数没有影响。

方案使用基准的执行时间作为下面的性能采样的临界水平。

ToDo：

- 如何选择合适的基准函数
- 基准的执行时间与性能采样的临界水平应当如何关联

### 性能采样函数

本方案使用从传统反逆向技术借鉴过来的时间差异检测来判断控制台是否打开。根据运行时间差异来判断脚本当前是否正在被调试。

性能采样函数需要具有在 DevTools 等工具环境下执行时，运行速度非常慢（时间久），正常运行时运行速度快（时间短）的特点。

本方案采用 `console` 作为判断依据。使用滑动数据窗口进行采样。

ToDo：

- 如何选择合适的性能采样函数
- 如何选择合适的采样方法
- 如何选择滑动数据窗口的大小

### 数理统计

本方案使用单位时间内采样数据组的数学期望和方差来避免偶然性和描述数据的波动性(只需要一点高中的知识)。

本方案使用滑动数据窗口进行采样，我们设滑动窗口的大小为 $n$ 。

我们将最近的一次滑动窗口作为研究对象，设离散型随机变量 $X$ 的取值为

$$
X_1,X_2,X_3,...,X_n
$$

假设离散型随机变量 $X$ 服从均匀分布（这里没有进行假设检验，先随便猜一个均匀分布），$X$ 对应取值的概率为

$$
p(X_i)=\frac{1}{n}
$$

数学期望为

$$
E(X)=X_1 \times p(X_1)+X_2 \times p(X_2)+...+X_n \times p(X_n)=\sum_{i=1}^{n}X_ip(X_i)
$$

即：

$$
E(X)=\frac{1}{n}\sum_{i=1}^{n}X_i
$$

样本方差：

$$
D(X)=E((X-E(X))^2)=\sum_{i=1}^{n}p(X_i)(X_i-E(X))^2
$$

即：

$$
D(X)=\frac{1}{n}\sum_{i=1}^{n}(X_i-\frac{1}{n}\sum_{i=1}^{n}X_i)^2
$$

本方案认为：平均值大于临界水平 或 采样值成接近临界水平的突增趋势时控制台为打开状态。其中：

平均值大于临界水平：

$$
E(X) > AverageCriticalLevel
$$

采样值接近临界水平：

$$
E(X) > AverageCriticalLevel \times 0.85
$$

样本产生了较大的波动：

$$
D(X) > VarianceCriticalLevel
$$

这里使用一个较小的滑动窗口 $m$ 来判断递增趋势:

$$
S_i = \frac{1}{m}\sum_{j=1+i}^{m+i}X_j
$$

$$
\begin{cases} S_1 > S_2 \\\\ S_2 > S_3 \\\\ .... \\\\ S_{n-m} > S_{n-m+1} \end{cases}
$$

ToDo：

- 如何选择合适的统计指标
- 如何合理建立统计指标与控制台的打开状态的映射关系

### 动态调整临界水平

实验中发现临界水平需要根据页面负载进行动态调整，以保证最佳效果。

本方案根据运行状态（即最近的采样数据）和基准数据动态调整临界水平。

设自变量临界水平为 $t$, 基准初值为 $CriticalLevel$,最近的一次滑动窗口集合 $X$,定义新的临界水平为 $f(t)$:

$$
f(t)= min(Average(X) \times 5 ,CriticalLevel)
$$

ToDo：

- 动态调整临界水平的最佳方案
- 页面负载对性能采样函数有哪些影响
- 什么是最佳的临界水平值，临界水平与哪些变量因素有关

## 离题的内容

### 非浏览器自带的控制台

例如 eruda，该方案无法判断。

###  IE 及 IE 内核的 Edge

该方案无法判断。

不过有另外的判断方法：`getter hack`.

这项技术利用的是 div 元素中的 id 属性，当 div 元素被发送至控制台（例如 **console.log(div)** ）时，浏览器会自动尝试获取其中的元素id。如果代码在调用了 **console.log** 之后又调用了 **getter** 方法，说明控制台当前正在运行。

简单的概念验证代码如下：

```javascript
let div = document.createElement('div');
let loop = setInterval(() => {
  console.log(div);
  console.clear();
});
Object.defineProperty(div,"id", {get: () => {
  clearInterval(loop);
  alert("Dev Tools detected!");
}});
```
`getter hack` 依赖于一个错误 —— 浏览器 DevTools 永远不应该自动调用 getter，因为这些可能有副作用。

高版本的浏览器已经对 `getter hack` 进行了修复，不再起作用，不过它在 IE 内核的 Edge 中仍然起作用。

也就是说这里使用了一个 Bug 解决了另一个 Bug，必须用魔法对付魔法！！！

## LICENSE

[MIT](https://github.com/MHuiG/devtools-detecter/blob/main/LICENSE)
