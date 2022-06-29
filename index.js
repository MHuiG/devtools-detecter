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
// 标准差
const StandardDeviation = (arr) => {
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
const StandardDeviationSampleList = [];
// 标记
let FlagID = -1;
// 临界水平
const CriticalLevel = 120;
// 平均临界水平
let AverageCriticalLevel = CriticalLevel;
// 标准差临界水平
let StandardDeviationCriticalLevel = CriticalLevel;
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
    const sd = StandardDeviation(SampleList);
    AddSample(AverageSampleList, avg);
    AddSample(StandardDeviationSampleList, sd);
    Print(`=== Average: ${avg} StandardDeviation: ${sd} === `);
    if (avg > AverageCriticalLevel || (sd > StandardDeviationCriticalLevel && SampleList[0] < SampleList[SampleList.length - 1])) {
      // 检测到 DevTools
      Print(`**** !!!!!! DevTools detected !!!!! ****`);
    } else {
      // 没有检测到 DevTools 调低参数水平
      if (FlagID >= 25) {
        AverageCriticalLevel = Average([Math.min(Math.max(...AverageSampleList), AverageCriticalLevel), CriticalLevel]);
        StandardDeviationCriticalLevel = Average([Math.min(Math.max(...StandardDeviationSampleList), StandardDeviationCriticalLevel), CriticalLevel]);
        Print(`=== AverageCriticalLevel: ${AverageCriticalLevel} StandardDeviationCriticalLevel: ${StandardDeviationCriticalLevel} ===`);
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

