function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o)
    return;
  if (typeof o === "string")
    return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor)
    n = o.constructor.name;
  if (n === "Map" || n === "Set")
    return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length)
    len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++)
    arr2[i] = arr[i];
  return arr2;
}
function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it)
        o = it;
      var i = 0;
      var F = function() {
      };
      return {
        s: F,
        n: function() {
          if (i >= o.length)
            return {
              done: true
            };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function(e) {
          throw e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true, didErr = false, err;
  return {
    s: function() {
      it = it.call(o);
    },
    n: function() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function(e) {
      didErr = true;
      err = e;
    },
    f: function() {
      try {
        if (!normalCompletion && it.return != null)
          it.return();
      } finally {
        if (didErr)
          throw err;
      }
    }
  };
}
var DevtoolsDetecter = function() {
  var isOpen = false;
  var isOpenForGetterHack = false;
  var _debug = false;
  var benchmarkMaxN = 7e6;
  var timingSamplingMaxN = 1e3;
  var timer = 500;
  var TimingSamplingCtl = null;
  var GetterHackCtl = null;
  var Status = function Status2() {
    return isOpen || isOpenForGetterHack;
  };
  var listeners = [];
  var RunListeners = function RunListeners2() {
    var _iterator = _createForOfIteratorHelper(listeners), _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var listener = _step.value;
        try {
          listener(Status());
        } catch (_unused) {
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  };
  var Print = function Print2(msg) {
    if (_debug) {
      var _div = document.createElement("div");
      _div.innerHTML = "".concat(msg, "<br>");
      document.body.appendChild(_div);
    }
  };
  var LogCat = console;
  var MathCat = Math;
  var Int8ArrayCat = Int8Array;
  var setIntervalCat = setInterval;
  var ObjectCat = Object;
  var DateCat = Date;
  var performanceCat = false;
  if (typeof performance != "undefined") {
    performanceCat = performance;
  }
  var now = function now2() {
    if (performanceCat) {
      return performanceCat.now();
    } else {
      return +new DateCat();
    }
  };
  var div = document.createElement("div");
  try {
    ObjectCat.defineProperty(div, "id", {
      get: function get() {
        isOpenForGetterHack = true;
        Print("**** !!!!!! [Getter Hack] DevTools detected !!!!! ****");
        RunListeners();
      }
    });
  } catch (_unused2) {
    isOpenForGetterHack = 0;
  }
  var GetterHack = function GetterHack2() {
    if (isOpenForGetterHack === 0)
      return;
    isOpenForGetterHack = false;
    LogCat.log(div);
    try {
      LogCat.clear();
    } catch (_unused3) {
    }
  };
  var TimingHack = function TimingHack2() {
    var startTime = now();
    for (var check = 0; check < timingSamplingMaxN; check++) {
      if (!LogCat.log) {
        alert("Hacked!");
      }
      LogCat.log(check);
      try {
        LogCat.clear();
      } catch (_unused4) {
      }
    }
    return now() - startTime;
  };
  var Average = function Average2(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum / arr.length;
  };
  var Variance = function Variance2(arr) {
    var avg = Average(arr);
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
      sum += MathCat.pow(arr[i] - avg, 2);
    }
    return sum / arr.length;
  };
  var AddSample = function AddSample2(arr, item) {
    arr.push(item);
    if (arr.length > 5) {
      arr.shift();
    }
  };
  var Benchmark = function Benchmark2() {
    var startTime = now();
    var maxn = benchmarkMaxN;
    var pris = new Int8ArrayCat(maxn + 1);
    for (var i = 2; i <= maxn; ++i) {
      if (pris[i] === 0)
        for (var j = i * i; j <= maxn; j += i) {
          pris[j] = 1;
        }
    }
    var diff = now() - startTime;
    return diff;
  };
  var SampleList = [];
  var AverageSampleList = [];
  var VarianceSampleList = [];
  var FlagID = -1;
  var CriticalLevel = Benchmark();
  var AverageCriticalLevel = CriticalLevel;
  var VarianceCriticalLevel = CriticalLevel;
  var TimingSampling = function TimingSampling2() {
    FlagID++;
    var diff = TimingHack();
    AddSample(SampleList, diff);
    Print(SampleList);
    if (FlagID && FlagID % 5 == 0) {
      var avg = Average(SampleList);
      var sd = Variance(SampleList);
      AddSample(AverageSampleList, avg);
      AddSample(VarianceSampleList, sd);
      Print("=== Average: ".concat(avg, " Variance: ").concat(sd, " === "));
      if (avg > AverageCriticalLevel || avg > AverageCriticalLevel * 0.85 && sd > VarianceCriticalLevel && Average([SampleList[0], SampleList[1], SampleList[2]]) < Average([SampleList[1], SampleList[2], SampleList[3]]) && Average([SampleList[1], SampleList[2], SampleList[3]]) < Average([SampleList[2], SampleList[3], SampleList[4]])) {
        isOpen = true;
        Print("**** !!!!!! DevTools detected !!!!! ****");
      } else {
        isOpen = false;
        if (FlagID >= 25) {
          AverageCriticalLevel = Average([MathCat.min(MathCat.max.apply(MathCat, AverageSampleList), AverageCriticalLevel), CriticalLevel]);
          VarianceCriticalLevel = Average([MathCat.min(MathCat.max.apply(MathCat, VarianceSampleList), VarianceCriticalLevel), CriticalLevel]);
          Print("=== AverageCriticalLevel: ".concat(AverageCriticalLevel, " VarianceCriticalLevel: ").concat(VarianceCriticalLevel, " ==="));
        }
      }
    }
    checkEruda();
    RunListeners();
  };
  var checkEruda = function checkEruda2() {
    if (isOpen)
      return;
    if (typeof eruda !== "undefined") {
      var _eruda, _eruda$_devTools;
      if (((_eruda = eruda) === null || _eruda === void 0 ? void 0 : (_eruda$_devTools = _eruda._devTools) === null || _eruda$_devTools === void 0 ? void 0 : _eruda$_devTools._isShow) === true) {
        isOpen = true;
        Print("**** !!!!!! [Eruda] DevTools detected !!!!! ****");
      } else {
        isOpen = false;
      }
    }
  };
  var DevtoolsDetecter2 = /* @__PURE__ */ function() {
    function DevtoolsDetecter3() {
      _classCallCheck(this, DevtoolsDetecter3);
    }
    _createClass(DevtoolsDetecter3, [{
      key: "debug",
      value: function debug() {
        _debug = true;
        Print("ua: ".concat(navigator.userAgent));
        Print("hardwareConcurrency: ".concat(navigator.hardwareConcurrency));
        try {
          if (performance && performance.memory) {
            Print("memory used: ".concat(performance.memory.usedJSHeapSize));
            Print("memory total: ".concat(performance.memory.totalJSHeapSize));
            Print("memory limit: ".concat(performance.memory.jsHeapSizeLimit));
          }
        } catch (_unused5) {
        }
        Print("Benchmark: ".concat(CriticalLevel));
      }
    }, {
      key: "getStatus",
      value: function getStatus() {
        return Status();
      }
    }, {
      key: "setBenchmarkMaxN",
      value: function setBenchmarkMaxN(n) {
        benchmarkMaxN = n;
      }
    }, {
      key: "setTimingSamplingMaxN",
      value: function setTimingSamplingMaxN(n) {
        timingSamplingMaxN = n;
      }
    }, {
      key: "setBenchmark",
      value: function setBenchmark(callBack) {
        Benchmark = callBack;
      }
    }, {
      key: "setTimer",
      value: function setTimer(t) {
        timer = t;
      }
    }, {
      key: "addListener",
      value: function addListener(callBack) {
        listeners.push(callBack);
      }
    }, {
      key: "launch",
      value: function launch() {
        TimingSamplingCtl = setIntervalCat(TimingSampling, timer);
        GetterHackCtl = setIntervalCat(GetterHack, timer);
      }
    }, {
      key: "stop",
      value: function stop() {
        clearInterval(TimingSamplingCtl);
        clearInterval(GetterHackCtl);
      }
    }]);
    return DevtoolsDetecter3;
  }();
  return new DevtoolsDetecter2();
}();
export { DevtoolsDetecter as default };
//# sourceMappingURL=DevtoolsDetecter.es.js.map
