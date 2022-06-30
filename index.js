const DevtoolsDetector = (function () {
  let isOpen = false;
  let debug = false;
  const listeners = [];
  const RunListeners = () => {
    for (const listener of listeners) {
      try {
        listener(isOpen);
      } catch { }
    }
  }
  // 屏幕打印
  const Print = (msg) => {
    if (debug) {
      const div = document.createElement("div")
      div.innerHTML = `${msg}<br>`
      document.body.append(div)
    }
  }
  // Dogs And Cats
  const MyWhiteCat = (key, child, parent) => {
    Array().__proto__.__proto__[key] = child.bind(parent);
  }
  const MyBlackCat = (parentKey, childKey, child, parent) => {
    const dog = Array().__proto__.__proto__;
    if (typeof dog[parentKey] == "undefined") {
      dog[parentKey] = {};
    }
    dog[parentKey][childKey] = child.bind(parent);
  }
  const MyWhiteDog = () => {
    return Math.random().toString(36).substring(2);
  }
  const MyBlackDog = (key) => {
    return window[key] || document[key] || console[key] || alert[key] || Object[key] || Array()[key];
  }
  const MyRedCat = (child, parent) => {
    const key = MyWhiteDog();
    MyWhiteCat(key, child, parent);
    return MyBlackDog(key);
  }
  const consoleDog = MyWhiteDog();
  ['log', 'clear'].forEach(function (method) {
    MyBlackCat(consoleDog, method, console[method], console)
  });
  const setTimeoutCat = MyRedCat(setTimeout, window)

  // 平均值
  const Average = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum / arr.length;
  }
  // 方差
  const Variance = (arr) => {
    let avg = Average(arr);
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += Math.pow(arr[i] - avg, 2);
    }
    return sum / arr.length;
  }
  // 添加样本
  const AddSample = (arr, item) => {
    arr.push(item);
    if (arr.length > 5) {
      arr.shift();
    }
  }
  // 基准
  const Benchmark = () => {
    const startTime = performance.now();
    const maxn = 7000000;
    const pris = new Int8Array(maxn + 1)
    for (var i = 2; i <= maxn; ++i)
      if (pris[i] === 0)
        for (var j = i * i; j <= maxn; j += i)
          pris[j] = 1
    const diff = performance.now() - startTime;
    return diff;
  }
  // 采样列表
  const SampleList = [];
  // 平均采样列表
  const AverageSampleList = [];
  // 方差采样列表
  const VarianceSampleList = [];
  // 标记
  let FlagID = -1;
  // 临界水平
  const CriticalLevel = Benchmark();
  Print(`Benchmark: ${CriticalLevel}`)
  // 平均临界水平
  let AverageCriticalLevel = CriticalLevel;
  // 方差临界水平
  let VarianceCriticalLevel = CriticalLevel;
  // 计时采样
  const TimingSampling = () => {
    FlagID++;
    const consoleDogBrother = MyWhiteDog();
    const LogCat = MyBlackDog(consoleDog);
    ['log', 'clear'].forEach(function (method) {
      MyBlackCat(consoleDogBrother, method, LogCat[method], LogCat)
    });
    const startTime = performance.now();
    for (let check = 0; check < 1000; check++) {
      const LogCatBrother = MyBlackDog(consoleDogBrother)
      if (!LogCatBrother.log) {
        alert("Hacked!");
      }
      LogCatBrother.log(check);
      LogCatBrother.clear();
    }
    const diff = performance.now() - startTime;
    AddSample(SampleList, diff);
    Print(SampleList);
    if (FlagID && FlagID % 5 == 0) {
      const avg = Average(SampleList);
      const sd = Variance(SampleList);
      AddSample(AverageSampleList, avg);
      AddSample(VarianceSampleList, sd);
      Print(`=== Average: ${avg} Variance: ${sd} === `);
      // 平均值大于临界水平 或 采样值成接近临界水平的突增趋势
      if (avg > AverageCriticalLevel || (avg > AverageCriticalLevel * 0.85 && sd > VarianceCriticalLevel && Average([SampleList[0], SampleList[1], SampleList[2]]) < Average([SampleList[1], SampleList[2], SampleList[3]]) && Average([SampleList[1], SampleList[2], SampleList[3]]) < Average([SampleList[2], SampleList[3], SampleList[4]]))) {
        // 检测到 DevTools
        isOpen = true;
        Print(`**** !!!!!! DevTools detected !!!!! ****`);
      } else {
        // 没有检测到 DevTools
        isOpen = false;
        // 微调参数水平
        if (FlagID >= 25) {
          AverageCriticalLevel = Average([Math.min(Math.max(...AverageSampleList), AverageCriticalLevel), CriticalLevel]);
          VarianceCriticalLevel = Average([Math.min(Math.max(...VarianceSampleList), VarianceCriticalLevel), CriticalLevel]);
          Print(`=== AverageCriticalLevel: ${AverageCriticalLevel} VarianceCriticalLevel: ${VarianceCriticalLevel} ===`);
        }
      }
    }
    RunListeners();
    setTimeoutCat(TimingSampling, 500);
  }

  class DevtoolsDetector {
    debug() {
      debug = true;
      Print(`hardwareConcurrency: ${navigator.hardwareConcurrency || 4}`)
      if (performance && performance.memory) {
        Print(`memory used: ${performance.memory.usedJSHeapSize}`)
        Print(`memory total: ${performance.memory.totalJSHeapSize}`)
        Print(`memory limit: ${performance.memory.jsHeapSizeLimit}`)
      }
    }
    getStatus() {
      return isOpen;
    }
    addListener(callBack) {
      listeners.push(callBack);
    }
    launch() {
      return TimingSampling();
    }
  }
  return new DevtoolsDetector();
})()

DevtoolsDetector.debug()
DevtoolsDetector.addListener(isOpen => {
  if (isOpen) {
    document.title = "DevTools detected";
  } else {
    document.title = "DevTools NOT detected";
  }
})
DevtoolsDetector.launch()
