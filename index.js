const DevtoolsDetecter = (function () {
  let isOpen = false;
  let isOpenForGetterHack = false;
  let debug = false;
  let benchmarkMaxN = 7000000;
  let timingSamplingMaxN = 1000;
  let timer = 500;
  let TimingSamplingCtl = null;
  let GetterHackCtl = null;

  const Status = () => {
    return isOpen || isOpenForGetterHack;
  }
  const listeners = [];
  const RunListeners = () => {
    for (const listener of listeners) {
      try {
        listener(Status());
      } catch { }
    }
  }
  // 屏幕打印
  const Print = (msg) => {
    if (debug) {
      const div = document.createElement("div");
      div.innerHTML = `${msg}<br>`;
      document.body.appendChild(div);
    }
  }
  // Cats
  const LogCat = console;
  const MathCat = Math;
  const Int8ArrayCat = Int8Array;
  const setIntervalCat = setInterval;
  const DateCat = Date;
  let performanceCat = false;
  if (typeof performance != "undefined") {
    performanceCat = performance;
  }
  const now = () => {
    if (performanceCat) {
      return performanceCat.now();
    } else {
      return +new DateCat;
    }
  }

  // getter hack check for IE
  const div = document.createElement('div');
  try {
    div.__defineGetter__('id', function () {
      isOpenForGetterHack = true;
      Print(`**** !!!!!! [Getter Hack] DevTools detected !!!!! ****`);
      RunListeners();
    });
  } catch {
    isOpenForGetterHack = 0;
  }

  const GetterHack = () => {
    if (isOpenForGetterHack === 0)
      return;
    isOpenForGetterHack = false;
    LogCat.log(div);
    try {
      LogCat.clear();
    } catch { }
  }
  const TimingHack = () => {
    const startTime = now();
    for (let check = 0; check < timingSamplingMaxN; check++) {
      if (!LogCat.log) {
        alert("Hacked!");
      }
      LogCat.log(check);
      try {
        LogCat.clear();
      } catch { }
    }
    return now() - startTime;
  }
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
      sum += MathCat.pow(arr[i] - avg, 2);
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
  let Benchmark = () => {
    const startTime = now();
    const maxn = benchmarkMaxN;
    const pris = new Int8ArrayCat(maxn + 1)
    for (var i = 2; i <= maxn; ++i)
      if (pris[i] === 0)
        for (var j = i * i; j <= maxn; j += i)
          pris[j] = 1;
    const diff = now() - startTime;
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
  // 平均临界水平
  let AverageCriticalLevel = CriticalLevel;
  // 方差临界水平
  let VarianceCriticalLevel = CriticalLevel;
  // 计时采样
  const TimingSampling = () => {
    FlagID++;
    const diff = TimingHack();
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
          AverageCriticalLevel = MathCat.min(Average(AverageSampleList) * 5, CriticalLevel);
          VarianceCriticalLevel = MathCat.min(Average(VarianceSampleList) * 5, CriticalLevel);
          Print(`=== AverageCriticalLevel: ${AverageCriticalLevel} VarianceCriticalLevel: ${VarianceCriticalLevel} ===`);
        }
      }
    }
    checkEruda();
    RunListeners();
  }
  const checkEruda = () => {
    if (isOpen)
      return
    if (typeof eruda !== 'undefined') {
      if (eruda?._devTools?._isShow === true) {
        isOpen = true;
        Print(`**** !!!!!! [Eruda] DevTools detected !!!!! ****`);
      } else {
        isOpen = false;
      }
    }
  }

  class DevtoolsDetecter {
    debug() {
      debug = true;
      Print(`ua: ${navigator.userAgent}`)
      Print(`hardwareConcurrency: ${navigator.hardwareConcurrency}`)
      try {
        if (performance && performance.memory) {
          Print(`memory used: ${performance.memory.usedJSHeapSize}`)
          Print(`memory total: ${performance.memory.totalJSHeapSize}`)
          Print(`memory limit: ${performance.memory.jsHeapSizeLimit}`)
        }
      } catch { }
      Print(`Benchmark: ${CriticalLevel}`)
    }
    getStatus() {
      return Status();
    }
    setBenchmarkMaxN(n) {
      benchmarkMaxN = n;
    }
    setTimingSamplingMaxN(n) {
      timingSamplingMaxN = n;
    }
    setBenchmark(callBack) {
      Benchmark = callBack;
    }
    setTimer(t) {
      timer = t;
    }
    addListener(callBack) {
      listeners.push(callBack);
    }
    launch() {
      TimingSamplingCtl = setIntervalCat(TimingSampling, timer);
      GetterHackCtl = setIntervalCat(GetterHack, timer);
    }
    stop() {
      clearInterval(TimingSamplingCtl);
      clearInterval(GetterHackCtl);
    }
  }
  return new DevtoolsDetecter();
})()

export default DevtoolsDetecter;