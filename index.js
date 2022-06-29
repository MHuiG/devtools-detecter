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
// 采样列表
const SampleList = [];
// 平均采样列表
const AverageSampleList = [];
// 标准差采样列表
const VarianceSampleList = [];
// 标记
let FlagID = -1;
// 临界水平
const CriticalLevel = 120;
// 平均临界水平
let AverageCriticalLevel = CriticalLevel;
// 标准差临界水平
let VarianceCriticalLevel = CriticalLevel;
// 计时采样
const TimingSampling = () => {
  FlagID++;
  const startTime = performance.now();
  for (let check = 0; check < 1000; check++) {
    console.log(check);
    console.clear();
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
    if (avg > AverageCriticalLevel || (sd > VarianceCriticalLevel && SampleList[0] < SampleList[SampleList.length - 1])) {
      // 检测到 DevTools
      Print(`**** !!!!!! DevTools detected !!!!! ****`);
    } else {
      // 没有检测到 DevTools 调低参数水平
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

