const DevtoolsDetecter = function() {
  let isOpen = false;
  let isOpenForGetterHack = false;
  let debug = false;
  let benchmarkMaxN = 7e6;
  let timingSamplingMaxN = 1e3;
  let timer = 500;
  let TimingSamplingCtl = null;
  let GetterHackCtl = null;
  const Status = () => {
    return isOpen || isOpenForGetterHack;
  };
  const listeners = [];
  const RunListeners = () => {
    for (const listener of listeners) {
      try {
        listener(Status());
      } catch (e) {
      }
    }
  };
  const Print = (msg) => {
    if (debug) {
      const div2 = document.createElement("div");
      div2.innerHTML = `${msg}<br>`;
      document.body.append(div2);
    }
  };
  const MyBigCat = () => {
    try {
      const p = [Object, Array, Set, Map, RegExp, String, ""];
      for (const iterator of p) {
        if (iterator && iterator.__proto__ && iterator.__proto__.__proto__ && iterator.__proto__.__proto__.constructor) {
          if (iterator.__proto__.__proto__.constructor.name == "Object") {
            return iterator;
          }
        }
      }
      for (const iterator of Object.keys(window)) {
        if (window[iterator] && window[iterator].__proto__ && window[iterator].__proto__.__proto__ && window[iterator].__proto__.__proto__.constructor) {
          if (window[iterator].__proto__.__proto__.constructor.name == "Object") {
            return window[iterator];
          }
        }
      }
    } catch (error) {
    }
  };
  const MyWhiteCat = (key, child, parent) => {
    MyBigCat().__proto__.__proto__[key] = child.bind(parent);
  };
  const MyBlackCat = (parentKey, childKey, child, parent) => {
    const dog = MyBigCat().__proto__.__proto__;
    if (typeof dog[parentKey] == "undefined") {
      dog[parentKey] = {};
    }
    dog[parentKey][childKey] = child.bind(parent);
  };
  const MyWhiteDog = () => {
    try {
      return MathCat.random().toString(36).substring(2);
    } catch (error) {
      return Math.random().toString(36).substring(2);
    }
  };
  const MyBlackDog = (key) => {
    return window[key] || document[key] || MyBigCat()[key];
  };
  const MyRedCat = (child, parent) => {
    const key = MyWhiteDog();
    MyWhiteCat(key, child, parent);
    return MyBlackDog(key);
  };
  const consoleDog = MyWhiteDog();
  ["log", "clear"].forEach(function(method) {
    MyBlackCat(consoleDog, method, console[method], console);
  });
  const setIntervalCat = MyRedCat(setInterval, window);
  const performanceNowCat = MyRedCat(performance.now, performance);
  const Int8ArrayCat = MyRedCat(Int8Array, window);
  const MathDog = MyWhiteDog();
  ["pow", "min", "max", "random"].forEach(function(method) {
    MyBlackCat(MathDog, method, Math[method], Math);
  });
  const MathCat = MyBlackDog(MathDog);
  const LogCat = MyBlackDog(consoleDog);
  const log = console;
  const div = document.createElement("div");
  Object.defineProperty(div, "id", {
    get: () => {
      isOpenForGetterHack = true;
      Print(`**** !!!!!! [Getter Hack] DevTools detected !!!!! ****`);
      RunListeners();
    }
  });
  const GetterHack = () => {
    isOpenForGetterHack = false;
    log.log(div);
    log.clear(div);
  };
  const Average = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum / arr.length;
  };
  const Variance = (arr) => {
    let avg = Average(arr);
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += MathCat.pow(arr[i] - avg, 2);
    }
    return sum / arr.length;
  };
  const AddSample = (arr, item) => {
    arr.push(item);
    if (arr.length > 5) {
      arr.shift();
    }
  };
  let Benchmark = () => {
    const startTime = performanceNowCat();
    const maxn = benchmarkMaxN;
    const pris = new Int8ArrayCat(maxn + 1);
    for (var i = 2; i <= maxn; ++i)
      if (pris[i] === 0)
        for (var j = i * i; j <= maxn; j += i)
          pris[j] = 1;
    const diff = performanceNowCat() - startTime;
    return diff;
  };
  const SampleList = [];
  const AverageSampleList = [];
  const VarianceSampleList = [];
  let FlagID = -1;
  const CriticalLevel = Benchmark();
  let AverageCriticalLevel = CriticalLevel;
  let VarianceCriticalLevel = CriticalLevel;
  const TimingSampling = () => {
    FlagID++;
    const startTime = performanceNowCat();
    for (let check = 0; check < timingSamplingMaxN; check++) {
      if (!LogCat.log) {
        alert("Hacked!");
      }
      LogCat.log(check);
      LogCat.clear();
    }
    const diff = performanceNowCat() - startTime;
    AddSample(SampleList, diff);
    Print(SampleList);
    if (FlagID && FlagID % 5 == 0) {
      const avg = Average(SampleList);
      const sd = Variance(SampleList);
      AddSample(AverageSampleList, avg);
      AddSample(VarianceSampleList, sd);
      Print(`=== Average: ${avg} Variance: ${sd} === `);
      if (avg > AverageCriticalLevel || avg > AverageCriticalLevel * 0.85 && sd > VarianceCriticalLevel && Average([SampleList[0], SampleList[1], SampleList[2]]) < Average([SampleList[1], SampleList[2], SampleList[3]]) && Average([SampleList[1], SampleList[2], SampleList[3]]) < Average([SampleList[2], SampleList[3], SampleList[4]])) {
        isOpen = true;
        Print(`**** !!!!!! DevTools detected !!!!! ****`);
      } else {
        isOpen = false;
        if (FlagID >= 25) {
          AverageCriticalLevel = Average([MathCat.min(MathCat.max(...AverageSampleList), AverageCriticalLevel), CriticalLevel]);
          VarianceCriticalLevel = Average([MathCat.min(MathCat.max(...VarianceSampleList), VarianceCriticalLevel), CriticalLevel]);
          Print(`=== AverageCriticalLevel: ${AverageCriticalLevel} VarianceCriticalLevel: ${VarianceCriticalLevel} ===`);
        }
      }
    }
    checkEruda();
    RunListeners();
  };
  const checkEruda = () => {
    var _a;
    if (isOpen)
      return;
    if (typeof eruda !== "undefined") {
      if (((_a = eruda == null ? void 0 : eruda._devTools) == null ? void 0 : _a._isShow) === true) {
        isOpen = true;
        Print(`**** !!!!!! [Eruda] DevTools detected !!!!! ****`);
      } else {
        isOpen = false;
      }
    }
  };
  class DevtoolsDetecter2 {
    debug() {
      debug = true;
      Print(`ua: ${navigator.userAgent}`);
      Print(`hardwareConcurrency: ${navigator.hardwareConcurrency}`);
      if (performance && performance.memory) {
        Print(`memory used: ${performance.memory.usedJSHeapSize}`);
        Print(`memory total: ${performance.memory.totalJSHeapSize}`);
        Print(`memory limit: ${performance.memory.jsHeapSizeLimit}`);
      }
      Print(`Benchmark: ${CriticalLevel}`);
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
  return new DevtoolsDetecter2();
}();
export { DevtoolsDetecter as default };
//# sourceMappingURL=DevtoolsDetecter.es.js.map
