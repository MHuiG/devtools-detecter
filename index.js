// 屏幕打印
const Print = (msg) => {
  const div = document.createElement("div")
  div.innerHTML = `${msg}<br>`
  document.body.append(div)
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
// CPU 核数
const hardwareConcurrency = navigator.hardwareConcurrency || 4;
Print(`hardwareConcurrency: ${hardwareConcurrency}`)
if (performance && performance.memory) {
  Print(`memory used: ${performance.memory.usedJSHeapSize}`)
  Print(`memory total: ${performance.memory.totalJSHeapSize}`)
  Print(`memory limit: ${performance.memory.jsHeapSizeLimit}`)
}
// 临界水平
const CriticalLevel = Benchmark();
Print(`Benchmark: ${CriticalLevel}`)
// const CriticalLevel = 120 + (hardwareConcurrency < 4 ? (4 - hardwareConcurrency) * 5 : 0);
// 平均临界水平
let AverageCriticalLevel = CriticalLevel;
// 方差临界水平
let VarianceCriticalLevel = CriticalLevel;
// 原型污染 猫鼠游戏？？？？
Array().__proto__.__proto__.FuckLog = {};
['log', 'clear'].forEach(function (method) {
  Array().__proto__.__proto__.FuckLog[method] = console[method].bind(console);
});
// 计时采样
const TimingSampling = () => {
  FlagID++;
  const startTime = performance.now();
  for (let check = 0; check < 1000; check++) {
    const FuckLog = window.FuckLog || document.FuckLog || console.FuckLog || alert.FuckLog || Object.FuckLog || Array().FuckLog;
    if (!FuckLog.log) {
      alert("Hacked!");
    }
    FuckLog.log(check);
    FuckLog.clear();
  }
  const diff = performance.now() - startTime;
  AddSample(SampleList, diff);
  Print(SampleList);
  if (FlagID && FlagID % 5 == 0 && DevToolsVisibilityState) {
    const avg = Average(SampleList);
    const sd = Variance(SampleList);
    AddSample(AverageSampleList, avg);
    AddSample(VarianceSampleList, sd);
    Print(`=== Average: ${avg} Variance: ${sd} === `);
    // 平均值大于临界水平 或 采样值成突增趋势
    if (avg > AverageCriticalLevel || (sd > VarianceCriticalLevel && Average([SampleList[0], SampleList[1], SampleList[2]]) < Average([SampleList[1], SampleList[2], SampleList[3]]) && Average([SampleList[1], SampleList[2], SampleList[3]]) < Average([SampleList[2], SampleList[3], SampleList[4]]))) {
      // 检测到 DevTools
      Print(`**** !!!!!! DevTools detected !!!!! ****`);
    } else {
      // 没有检测到 DevTools 微调参数水平
      if (FlagID >= 25) {
        AverageCriticalLevel = Average([Math.min(Math.max(...AverageSampleList), AverageCriticalLevel), CriticalLevel]);
        VarianceCriticalLevel = Average([Math.min(Math.max(...VarianceSampleList), VarianceCriticalLevel), CriticalLevel]);
        Print(`=== AverageCriticalLevel: ${AverageCriticalLevel} VarianceCriticalLevel: ${VarianceCriticalLevel} ===`);
      }
    }
  }
}
if (typeof DevToolsVisibilityState == "undefined") {
  DevToolsVisibilityState = 1;
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState == "visible") {
      DevToolsVisibilityState = 1;
    }
    if (document.visibilityState == "hidden") {
      DevToolsVisibilityState = 0;
    }
  });
}
setInterval(TimingSampling, 500);

