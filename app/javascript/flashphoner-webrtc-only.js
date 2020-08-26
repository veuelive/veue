(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Flashphoner = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
'use strict';

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
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
/**
* KalmanFilter
* @class
* @author Wouter Bulten
* @see {@link http://github.com/wouterbulten/kalmanjs}
* @version Version: 1.0.0-beta
* @copyright Copyright 2015-2018 Wouter Bulten
* @license MIT License
* @preserve
*/


var KalmanFilter = /*#__PURE__*/function () {
  /**
  * Create 1-dimensional kalman filter
  * @param  {Number} options.R Process noise
  * @param  {Number} options.Q Measurement noise
  * @param  {Number} options.A State vector
  * @param  {Number} options.B Control vector
  * @param  {Number} options.C Measurement vector
  * @return {KalmanFilter}
  */
  function KalmanFilter() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$R = _ref.R,
        R = _ref$R === void 0 ? 1 : _ref$R,
        _ref$Q = _ref.Q,
        Q = _ref$Q === void 0 ? 1 : _ref$Q,
        _ref$A = _ref.A,
        A = _ref$A === void 0 ? 1 : _ref$A,
        _ref$B = _ref.B,
        B = _ref$B === void 0 ? 0 : _ref$B,
        _ref$C = _ref.C,
        C = _ref$C === void 0 ? 1 : _ref$C;

    _classCallCheck(this, KalmanFilter);

    this.R = R; // noise power desirable

    this.Q = Q; // noise power estimated

    this.A = A;
    this.C = C;
    this.B = B;
    this.cov = NaN;
    this.x = NaN; // estimated signal without noise
  }
  /**
  * Filter a new value
  * @param  {Number} z Measurement
  * @param  {Number} u Control
  * @return {Number}
  */


  _createClass(KalmanFilter, [{
    key: "filter",
    value: function filter(z) {
      var u = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (isNaN(this.x)) {
        this.x = 1 / this.C * z;
        this.cov = 1 / this.C * this.Q * (1 / this.C);
      } else {
        // Compute prediction
        var predX = this.predict(u);
        var predCov = this.uncertainty(); // Kalman gain

        var K = predCov * this.C * (1 / (this.C * predCov * this.C + this.Q)); // Correction

        this.x = predX + K * (z - this.C * predX);
        this.cov = predCov - K * this.C * predCov;
      }

      return this.x;
    }
    /**
    * Predict next value
    * @param  {Number} [u] Control
    * @return {Number}
    */

  }, {
    key: "predict",
    value: function predict() {
      var u = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return this.A * this.x + this.B * u;
    }
    /**
    * Return uncertainty of filter
    * @return {Number}
    */

  }, {
    key: "uncertainty",
    value: function uncertainty() {
      return this.A * this.cov * this.A + this.R;
    }
    /**
    * Return the last filtered measurement
    * @return {Number}
    */

  }, {
    key: "lastMeasurement",
    value: function lastMeasurement() {
      return this.x;
    }
    /**
    * Set measurement noise Q
    * @param {Number} noise
    */

  }, {
    key: "setMeasurementNoise",
    value: function setMeasurementNoise(noise) {
      this.Q = noise;
    }
    /**
    * Set the process noise R
    * @param {Number} noise
    */

  }, {
    key: "setProcessNoise",
    value: function setProcessNoise(noise) {
      this.R = noise;
    }
  }]);

  return KalmanFilter;
}();

module.exports = KalmanFilter;

},{}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};

},{}],4:[function(require,module,exports){
(function (setImmediate){
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (root) {
  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {} // Polyfill for Function.prototype.bind


  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (!(this instanceof Promise)) throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];
    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }

    if (self._state === 0) {
      self._deferreds.push(deferred);

      return;
    }

    self._handled = true;

    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;

      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }

      var ret;

      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }

      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');

      if (newValue && (_typeof(newValue) === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;

        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }

      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function () {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }

    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }
  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */


  function doResolve(fn, self) {
    var done = false;

    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new this.constructor(noop);
    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    return new Promise(function (resolve, reject) {
      if (!arr || typeof arr.length === 'undefined') throw new TypeError('Promise.all accepts an array');
      var args = Array.prototype.slice.call(arr);
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (_typeof(val) === 'object' || typeof val === 'function')) {
            var then = val.then;

            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }

          args[i] = val;

          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && _typeof(value) === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  }; // Use polyfill for setImmediate for performance gains


  Promise._immediateFn = typeof setImmediate === 'function' && function (fn) {
    setImmediate(fn);
  } || function (fn) {
    setTimeoutFunc(fn, 0);
  };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };
  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */


  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };
  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */


  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }
})(this);

}).call(this,require("timers").setImmediate)
},{"timers":7}],5:[function(require,module,exports){
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

var SDPUtils = require('sdp');

function fixStatsType(stat) {
  return {
    inboundrtp: 'inbound-rtp',
    outboundrtp: 'outbound-rtp',
    candidatepair: 'candidate-pair',
    localcandidate: 'local-candidate',
    remotecandidate: 'remote-candidate'
  }[stat.type] || stat.type;
}

function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps); // Map ICE parameters (ufrag, pwd) to SDP.

  sdp += SDPUtils.writeIceParameters(transceiver.iceGatherer.getLocalParameters()); // Map DTLS parameters to SDP.

  sdp += SDPUtils.writeDtlsParameters(transceiver.dtlsTransport.getLocalParameters(), type === 'offer' ? 'actpass' : dtlsRole || 'active');
  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    var trackId = transceiver.rtpSender._initialTrackId || transceiver.rtpSender.track.id;
    transceiver.rtpSender._initialTrackId = trackId; // spec.

    var msid = 'msid:' + (stream ? stream.id : '-') + ' ' + trackId + '\r\n';
    sdp += 'a=' + msid; // for Chrome. Legacy should no longer be required.

    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' ' + msid; // RTX

    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc + ' ' + msid;
      sdp += 'a=ssrc-group:FID ' + transceiver.sendEncodingParameters[0].ssrc + ' ' + transceiver.sendEncodingParameters[0].rtx.ssrc + '\r\n';
    }
  } // FIXME: this should be written by writeRtpDescription.


  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' cname:' + SDPUtils.localCName + '\r\n';

  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc + ' cname:' + SDPUtils.localCName + '\r\n';
  }

  return sdp;
} // Edge does not like
// 1) stun: filtered after 14393 unless ?transport=udp is present
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times


function filterIceServers(iceServers, edgeVersion) {
  var hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(function (server) {
    if (server && (server.urls || server.url)) {
      var urls = server.urls || server.url;

      if (server.url && !server.urls) {
        console.warn('RTCIceServer.url is deprecated! Use urls instead.');
      }

      var isString = typeof urls === 'string';

      if (isString) {
        urls = [urls];
      }

      urls = urls.filter(function (url) {
        var validTurn = url.indexOf('turn:') === 0 && url.indexOf('transport=udp') !== -1 && url.indexOf('turn:[') === -1 && !hasTurn;

        if (validTurn) {
          hasTurn = true;
          return true;
        }

        return url.indexOf('stun:') === 0 && edgeVersion >= 14393 && url.indexOf('?transport=udp') === -1;
      });
      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
  });
} // Determines the intersection of local and remote capabilities.


function getCommonCapabilities(localCapabilities, remoteCapabilities) {
  var commonCapabilities = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: []
  };

  var findCodecByPayloadType = function findCodecByPayloadType(pt, codecs) {
    pt = parseInt(pt, 10);

    for (var i = 0; i < codecs.length; i++) {
      if (codecs[i].payloadType === pt || codecs[i].preferredPayloadType === pt) {
        return codecs[i];
      }
    }
  };

  var rtxCapabilityMatches = function rtxCapabilityMatches(lRtx, rRtx, lCodecs, rCodecs) {
    var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
    var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
    return lCodec && rCodec && lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
  };

  localCapabilities.codecs.forEach(function (lCodec) {
    for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
      var rCodec = remoteCapabilities.codecs[i];

      if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() && lCodec.clockRate === rCodec.clockRate) {
        if (lCodec.name.toLowerCase() === 'rtx' && lCodec.parameters && rCodec.parameters.apt) {
          // for RTX we need to find the local rtx that has a apt
          // which points to the same local codec as the remote one.
          if (!rtxCapabilityMatches(lCodec, rCodec, localCapabilities.codecs, remoteCapabilities.codecs)) {
            continue;
          }
        }

        rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
        // number of channels is the highest common number of channels

        rCodec.numChannels = Math.min(lCodec.numChannels, rCodec.numChannels); // push rCodec so we reply with offerer payload type

        commonCapabilities.codecs.push(rCodec); // determine common feedback mechanisms

        rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function (fb) {
          for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
            if (lCodec.rtcpFeedback[j].type === fb.type && lCodec.rtcpFeedback[j].parameter === fb.parameter) {
              return true;
            }
          }

          return false;
        }); // FIXME: also need to determine .parameters
        //  see https://github.com/openpeer/ortc/issues/569

        break;
      }
    }
  });
  localCapabilities.headerExtensions.forEach(function (lHeaderExtension) {
    for (var i = 0; i < remoteCapabilities.headerExtensions.length; i++) {
      var rHeaderExtension = remoteCapabilities.headerExtensions[i];

      if (lHeaderExtension.uri === rHeaderExtension.uri) {
        commonCapabilities.headerExtensions.push(rHeaderExtension);
        break;
      }
    }
  }); // FIXME: fecMechanisms

  return commonCapabilities;
} // is action=setLocalDescription with type allowed in signalingState


function isActionAllowedInSignalingState(action, type, signalingState) {
  return {
    offer: {
      setLocalDescription: ['stable', 'have-local-offer'],
      setRemoteDescription: ['stable', 'have-remote-offer']
    },
    answer: {
      setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
      setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
    }
  }[type][action].indexOf(signalingState) !== -1;
}

function maybeAddCandidate(iceTransport, candidate) {
  // Edge's internal representation adds some fields therefore
  // not all fieldѕ are taken into account.
  var alreadyAdded = iceTransport.getRemoteCandidates().find(function (remoteCandidate) {
    return candidate.foundation === remoteCandidate.foundation && candidate.ip === remoteCandidate.ip && candidate.port === remoteCandidate.port && candidate.priority === remoteCandidate.priority && candidate.protocol === remoteCandidate.protocol && candidate.type === remoteCandidate.type;
  });

  if (!alreadyAdded) {
    iceTransport.addRemoteCandidate(candidate);
  }

  return !alreadyAdded;
}

function makeError(name, description) {
  var e = new Error(description);
  e.name = name; // legacy error codes from https://heycam.github.io/webidl/#idl-DOMException-error-names

  e.code = {
    NotSupportedError: 9,
    InvalidStateError: 11,
    InvalidAccessError: 15,
    TypeError: undefined,
    OperationError: undefined
  }[name];
  return e;
}

module.exports = function (window, edgeVersion) {
  // https://w3c.github.io/mediacapture-main/#mediastream
  // Helper function to add the track to the stream and
  // dispatch the event ourselves.
  function addTrackToStreamAndFireEvent(track, stream) {
    stream.addTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('addtrack', {
      track: track
    }));
  }

  function removeTrackFromStreamAndFireEvent(track, stream) {
    stream.removeTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('removetrack', {
      track: track
    }));
  }

  function fireAddTrack(pc, track, receiver, streams) {
    var trackEvent = new Event('track');
    trackEvent.track = track;
    trackEvent.receiver = receiver;
    trackEvent.transceiver = {
      receiver: receiver
    };
    trackEvent.streams = streams;
    window.setTimeout(function () {
      pc._dispatchEvent('track', trackEvent);
    });
  }

  var RTCPeerConnection = function RTCPeerConnection(config) {
    var pc = this;

    var _eventTarget = document.createDocumentFragment();

    ['addEventListener', 'removeEventListener', 'dispatchEvent'].forEach(function (method) {
      pc[method] = _eventTarget[method].bind(_eventTarget);
    });
    this.canTrickleIceCandidates = null;
    this.needNegotiation = false;
    this.localStreams = [];
    this.remoteStreams = [];
    this._localDescription = null;
    this._remoteDescription = null;
    this.signalingState = 'stable';
    this.iceConnectionState = 'new';
    this.connectionState = 'new';
    this.iceGatheringState = 'new';
    config = JSON.parse(JSON.stringify(config || {}));
    this.usingBundle = config.bundlePolicy === 'max-bundle';

    if (config.rtcpMuxPolicy === 'negotiate') {
      throw makeError('NotSupportedError', 'rtcpMuxPolicy \'negotiate\' is not supported');
    } else if (!config.rtcpMuxPolicy) {
      config.rtcpMuxPolicy = 'require';
    }

    switch (config.iceTransportPolicy) {
      case 'all':
      case 'relay':
        break;

      default:
        config.iceTransportPolicy = 'all';
        break;
    }

    switch (config.bundlePolicy) {
      case 'balanced':
      case 'max-compat':
      case 'max-bundle':
        break;

      default:
        config.bundlePolicy = 'balanced';
        break;
    }

    config.iceServers = filterIceServers(config.iceServers || [], edgeVersion);
    this._iceGatherers = [];

    if (config.iceCandidatePoolSize) {
      for (var i = config.iceCandidatePoolSize; i > 0; i--) {
        this._iceGatherers.push(new window.RTCIceGatherer({
          iceServers: config.iceServers,
          gatherPolicy: config.iceTransportPolicy
        }));
      }
    } else {
      config.iceCandidatePoolSize = 0;
    }

    this._config = config; // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
    // everything that is needed to describe a SDP m-line.

    this.transceivers = [];
    this._sdpSessionId = SDPUtils.generateSessionId();
    this._sdpSessionVersion = 0;
    this._dtlsRole = undefined; // role for a=setup to use in answers.

    this._isClosed = false;
  };

  Object.defineProperty(RTCPeerConnection.prototype, 'localDescription', {
    configurable: true,
    get: function get() {
      return this._localDescription;
    }
  });
  Object.defineProperty(RTCPeerConnection.prototype, 'remoteDescription', {
    configurable: true,
    get: function get() {
      return this._remoteDescription;
    }
  }); // set up event handlers on prototype

  RTCPeerConnection.prototype.onicecandidate = null;
  RTCPeerConnection.prototype.onaddstream = null;
  RTCPeerConnection.prototype.ontrack = null;
  RTCPeerConnection.prototype.onremovestream = null;
  RTCPeerConnection.prototype.onsignalingstatechange = null;
  RTCPeerConnection.prototype.oniceconnectionstatechange = null;
  RTCPeerConnection.prototype.onconnectionstatechange = null;
  RTCPeerConnection.prototype.onicegatheringstatechange = null;
  RTCPeerConnection.prototype.onnegotiationneeded = null;
  RTCPeerConnection.prototype.ondatachannel = null;

  RTCPeerConnection.prototype._dispatchEvent = function (name, event) {
    if (this._isClosed) {
      return;
    }

    this.dispatchEvent(event);

    if (typeof this['on' + name] === 'function') {
      this['on' + name](event);
    }
  };

  RTCPeerConnection.prototype._emitGatheringStateChange = function () {
    var event = new Event('icegatheringstatechange');

    this._dispatchEvent('icegatheringstatechange', event);
  };

  RTCPeerConnection.prototype.getConfiguration = function () {
    return this._config;
  };

  RTCPeerConnection.prototype.getLocalStreams = function () {
    return this.localStreams;
  };

  RTCPeerConnection.prototype.getRemoteStreams = function () {
    return this.remoteStreams;
  }; // internal helper to create a transceiver object.
  // (which is not yet the same as the WebRTC 1.0 transceiver)


  RTCPeerConnection.prototype._createTransceiver = function (kind, doNotAdd) {
    var hasBundleTransport = this.transceivers.length > 0;
    var transceiver = {
      track: null,
      iceGatherer: null,
      iceTransport: null,
      dtlsTransport: null,
      localCapabilities: null,
      remoteCapabilities: null,
      rtpSender: null,
      rtpReceiver: null,
      kind: kind,
      mid: null,
      sendEncodingParameters: null,
      recvEncodingParameters: null,
      stream: null,
      associatedRemoteMediaStreams: [],
      wantReceive: true
    };

    if (this.usingBundle && hasBundleTransport) {
      transceiver.iceTransport = this.transceivers[0].iceTransport;
      transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
    } else {
      var transports = this._createIceAndDtlsTransports();

      transceiver.iceTransport = transports.iceTransport;
      transceiver.dtlsTransport = transports.dtlsTransport;
    }

    if (!doNotAdd) {
      this.transceivers.push(transceiver);
    }

    return transceiver;
  };

  RTCPeerConnection.prototype.addTrack = function (track, stream) {
    if (this._isClosed) {
      throw makeError('InvalidStateError', 'Attempted to call addTrack on a closed peerconnection.');
    }

    var alreadyExists = this.transceivers.find(function (s) {
      return s.track === track;
    });

    if (alreadyExists) {
      throw makeError('InvalidAccessError', 'Track already exists.');
    }

    var transceiver;

    for (var i = 0; i < this.transceivers.length; i++) {
      if (!this.transceivers[i].track && this.transceivers[i].kind === track.kind) {
        transceiver = this.transceivers[i];
      }
    }

    if (!transceiver) {
      transceiver = this._createTransceiver(track.kind);
    }

    this._maybeFireNegotiationNeeded();

    if (this.localStreams.indexOf(stream) === -1) {
      this.localStreams.push(stream);
    }

    transceiver.track = track;
    transceiver.stream = stream;
    transceiver.rtpSender = new window.RTCRtpSender(track, transceiver.dtlsTransport);
    return transceiver.rtpSender;
  };

  RTCPeerConnection.prototype.addStream = function (stream) {
    var pc = this;

    if (edgeVersion >= 15025) {
      stream.getTracks().forEach(function (track) {
        pc.addTrack(track, stream);
      });
    } else {
      // Clone is necessary for local demos mostly, attaching directly
      // to two different senders does not work (build 10547).
      // Fixed in 15025 (or earlier)
      var clonedStream = stream.clone();
      stream.getTracks().forEach(function (track, idx) {
        var clonedTrack = clonedStream.getTracks()[idx];
        track.addEventListener('enabled', function (event) {
          clonedTrack.enabled = event.enabled;
        });
      });
      clonedStream.getTracks().forEach(function (track) {
        pc.addTrack(track, clonedStream);
      });
    }
  };

  RTCPeerConnection.prototype.removeTrack = function (sender) {
    if (this._isClosed) {
      throw makeError('InvalidStateError', 'Attempted to call removeTrack on a closed peerconnection.');
    }

    if (!(sender instanceof window.RTCRtpSender)) {
      throw new TypeError('Argument 1 of RTCPeerConnection.removeTrack ' + 'does not implement interface RTCRtpSender.');
    }

    var transceiver = this.transceivers.find(function (t) {
      return t.rtpSender === sender;
    });

    if (!transceiver) {
      throw makeError('InvalidAccessError', 'Sender was not created by this connection.');
    }

    var stream = transceiver.stream;
    transceiver.rtpSender.stop();
    transceiver.rtpSender = null;
    transceiver.track = null;
    transceiver.stream = null; // remove the stream from the set of local streams

    var localStreams = this.transceivers.map(function (t) {
      return t.stream;
    });

    if (localStreams.indexOf(stream) === -1 && this.localStreams.indexOf(stream) > -1) {
      this.localStreams.splice(this.localStreams.indexOf(stream), 1);
    }

    this._maybeFireNegotiationNeeded();
  };

  RTCPeerConnection.prototype.removeStream = function (stream) {
    var pc = this;
    stream.getTracks().forEach(function (track) {
      var sender = pc.getSenders().find(function (s) {
        return s.track === track;
      });

      if (sender) {
        pc.removeTrack(sender);
      }
    });
  };

  RTCPeerConnection.prototype.getSenders = function () {
    return this.transceivers.filter(function (transceiver) {
      return !!transceiver.rtpSender;
    }).map(function (transceiver) {
      return transceiver.rtpSender;
    });
  };

  RTCPeerConnection.prototype.getReceivers = function () {
    return this.transceivers.filter(function (transceiver) {
      return !!transceiver.rtpReceiver;
    }).map(function (transceiver) {
      return transceiver.rtpReceiver;
    });
  };

  RTCPeerConnection.prototype._createIceGatherer = function (sdpMLineIndex, usingBundle) {
    var pc = this;

    if (usingBundle && sdpMLineIndex > 0) {
      return this.transceivers[0].iceGatherer;
    } else if (this._iceGatherers.length) {
      return this._iceGatherers.shift();
    }

    var iceGatherer = new window.RTCIceGatherer({
      iceServers: this._config.iceServers,
      gatherPolicy: this._config.iceTransportPolicy
    });
    Object.defineProperty(iceGatherer, 'state', {
      value: 'new',
      writable: true
    });
    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];

    this.transceivers[sdpMLineIndex].bufferCandidates = function (event) {
      var end = !event.candidate || Object.keys(event.candidate).length === 0; // polyfill since RTCIceGatherer.state is not implemented in
      // Edge 10547 yet.

      iceGatherer.state = end ? 'completed' : 'gathering';

      if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
        pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
      }
    };

    iceGatherer.addEventListener('localcandidate', this.transceivers[sdpMLineIndex].bufferCandidates);
    return iceGatherer;
  }; // start gathering from an RTCIceGatherer.


  RTCPeerConnection.prototype._gather = function (mid, sdpMLineIndex) {
    var pc = this;
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;

    if (iceGatherer.onlocalcandidate) {
      return;
    }

    var bufferedCandidateEvents = this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
    iceGatherer.removeEventListener('localcandidate', this.transceivers[sdpMLineIndex].bufferCandidates);

    iceGatherer.onlocalcandidate = function (evt) {
      if (pc.usingBundle && sdpMLineIndex > 0) {
        // if we know that we use bundle we can drop candidates with
        // ѕdpMLineIndex > 0. If we don't do this then our state gets
        // confused since we dispose the extra ice gatherer.
        return;
      }

      var event = new Event('icecandidate');
      event.candidate = {
        sdpMid: mid,
        sdpMLineIndex: sdpMLineIndex
      };
      var cand = evt.candidate; // Edge emits an empty object for RTCIceCandidateComplete‥

      var end = !cand || Object.keys(cand).length === 0;

      if (end) {
        // polyfill since RTCIceGatherer.state is not implemented in
        // Edge 10547 yet.
        if (iceGatherer.state === 'new' || iceGatherer.state === 'gathering') {
          iceGatherer.state = 'completed';
        }
      } else {
        if (iceGatherer.state === 'new') {
          iceGatherer.state = 'gathering';
        } // RTCIceCandidate doesn't have a component, needs to be added


        cand.component = 1; // also the usernameFragment. TODO: update SDP to take both variants.

        cand.ufrag = iceGatherer.getLocalParameters().usernameFragment;
        var serializedCandidate = SDPUtils.writeCandidate(cand);
        event.candidate = Object.assign(event.candidate, SDPUtils.parseCandidate(serializedCandidate));
        event.candidate.candidate = serializedCandidate;

        event.candidate.toJSON = function () {
          return {
            candidate: event.candidate.candidate,
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            usernameFragment: event.candidate.usernameFragment
          };
        };
      } // update local description.


      var sections = SDPUtils.getMediaSections(pc._localDescription.sdp);

      if (!end) {
        sections[event.candidate.sdpMLineIndex] += 'a=' + event.candidate.candidate + '\r\n';
      } else {
        sections[event.candidate.sdpMLineIndex] += 'a=end-of-candidates\r\n';
      }

      pc._localDescription.sdp = SDPUtils.getDescription(pc._localDescription.sdp) + sections.join('');
      var complete = pc.transceivers.every(function (transceiver) {
        return transceiver.iceGatherer && transceiver.iceGatherer.state === 'completed';
      });

      if (pc.iceGatheringState !== 'gathering') {
        pc.iceGatheringState = 'gathering';

        pc._emitGatheringStateChange();
      } // Emit candidate. Also emit null candidate when all gatherers are
      // complete.


      if (!end) {
        pc._dispatchEvent('icecandidate', event);
      }

      if (complete) {
        pc._dispatchEvent('icecandidate', new Event('icecandidate'));

        pc.iceGatheringState = 'complete';

        pc._emitGatheringStateChange();
      }
    }; // emit already gathered candidates.


    window.setTimeout(function () {
      bufferedCandidateEvents.forEach(function (e) {
        iceGatherer.onlocalcandidate(e);
      });
    }, 0);
  }; // Create ICE transport and DTLS transport.


  RTCPeerConnection.prototype._createIceAndDtlsTransports = function () {
    var pc = this;
    var iceTransport = new window.RTCIceTransport(null);

    iceTransport.onicestatechange = function () {
      pc._updateIceConnectionState();

      pc._updateConnectionState();
    };

    var dtlsTransport = new window.RTCDtlsTransport(iceTransport);

    dtlsTransport.ondtlsstatechange = function () {
      pc._updateConnectionState();
    };

    dtlsTransport.onerror = function () {
      // onerror does not set state to failed by itself.
      Object.defineProperty(dtlsTransport, 'state', {
        value: 'failed',
        writable: true
      });

      pc._updateConnectionState();
    };

    return {
      iceTransport: iceTransport,
      dtlsTransport: dtlsTransport
    };
  }; // Destroy ICE gatherer, ICE transport and DTLS transport.
  // Without triggering the callbacks.


  RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function (sdpMLineIndex) {
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;

    if (iceGatherer) {
      delete iceGatherer.onlocalcandidate;
      delete this.transceivers[sdpMLineIndex].iceGatherer;
    }

    var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;

    if (iceTransport) {
      delete iceTransport.onicestatechange;
      delete this.transceivers[sdpMLineIndex].iceTransport;
    }

    var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;

    if (dtlsTransport) {
      delete dtlsTransport.ondtlsstatechange;
      delete dtlsTransport.onerror;
      delete this.transceivers[sdpMLineIndex].dtlsTransport;
    }
  }; // Start the RTP Sender and Receiver for a transceiver.


  RTCPeerConnection.prototype._transceive = function (transceiver, send, recv) {
    var params = getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);

    if (send && transceiver.rtpSender) {
      params.encodings = transceiver.sendEncodingParameters;
      params.rtcp = {
        cname: SDPUtils.localCName,
        compound: transceiver.rtcpParameters.compound
      };

      if (transceiver.recvEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
      }

      transceiver.rtpSender.send(params);
    }

    if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
      // remove RTX field in Edge 14942
      if (transceiver.kind === 'video' && transceiver.recvEncodingParameters && edgeVersion < 15019) {
        transceiver.recvEncodingParameters.forEach(function (p) {
          delete p.rtx;
        });
      }

      if (transceiver.recvEncodingParameters.length) {
        params.encodings = transceiver.recvEncodingParameters;
      } else {
        params.encodings = [{}];
      }

      params.rtcp = {
        compound: transceiver.rtcpParameters.compound
      };

      if (transceiver.rtcpParameters.cname) {
        params.rtcp.cname = transceiver.rtcpParameters.cname;
      }

      if (transceiver.sendEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
      }

      transceiver.rtpReceiver.receive(params);
    }
  };

  RTCPeerConnection.prototype.setLocalDescription = function (description) {
    var pc = this; // Note: pranswer is not supported.

    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError', 'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setLocalDescription', description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError', 'Can not set local ' + description.type + ' in state ' + pc.signalingState));
    }

    var sections;
    var sessionpart;

    if (description.type === 'offer') {
      // VERY limited support for SDP munging. Limited to:
      // * changing the order of codecs
      sections = SDPUtils.splitSections(description.sdp);
      sessionpart = sections.shift();
      sections.forEach(function (mediaSection, sdpMLineIndex) {
        var caps = SDPUtils.parseRtpParameters(mediaSection);
        pc.transceivers[sdpMLineIndex].localCapabilities = caps;
      });
      pc.transceivers.forEach(function (transceiver, sdpMLineIndex) {
        pc._gather(transceiver.mid, sdpMLineIndex);
      });
    } else if (description.type === 'answer') {
      sections = SDPUtils.splitSections(pc._remoteDescription.sdp);
      sessionpart = sections.shift();
      var isIceLite = SDPUtils.matchPrefix(sessionpart, 'a=ice-lite').length > 0;
      sections.forEach(function (mediaSection, sdpMLineIndex) {
        var transceiver = pc.transceivers[sdpMLineIndex];
        var iceGatherer = transceiver.iceGatherer;
        var iceTransport = transceiver.iceTransport;
        var dtlsTransport = transceiver.dtlsTransport;
        var localCapabilities = transceiver.localCapabilities;
        var remoteCapabilities = transceiver.remoteCapabilities; // treat bundle-only as not-rejected.

        var rejected = SDPUtils.isRejected(mediaSection) && SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;

        if (!rejected && !transceiver.rejected) {
          var remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
          var remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart);

          if (isIceLite) {
            remoteDtlsParameters.role = 'server';
          }

          if (!pc.usingBundle || sdpMLineIndex === 0) {
            pc._gather(transceiver.mid, sdpMLineIndex);

            if (iceTransport.state === 'new') {
              iceTransport.start(iceGatherer, remoteIceParameters, isIceLite ? 'controlling' : 'controlled');
            }

            if (dtlsTransport.state === 'new') {
              dtlsTransport.start(remoteDtlsParameters);
            }
          } // Calculate intersection of capabilities.


          var params = getCommonCapabilities(localCapabilities, remoteCapabilities); // Start the RTCRtpSender. The RTCRtpReceiver for this
          // transceiver has already been started in setRemoteDescription.

          pc._transceive(transceiver, params.codecs.length > 0, false);
        }
      });
    }

    pc._localDescription = {
      type: description.type,
      sdp: description.sdp
    };

    if (description.type === 'offer') {
      pc._updateSignalingState('have-local-offer');
    } else {
      pc._updateSignalingState('stable');
    }

    return Promise.resolve();
  };

  RTCPeerConnection.prototype.setRemoteDescription = function (description) {
    var pc = this; // Note: pranswer is not supported.

    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError', 'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setRemoteDescription', description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError', 'Can not set remote ' + description.type + ' in state ' + pc.signalingState));
    }

    var streams = {};
    pc.remoteStreams.forEach(function (stream) {
      streams[stream.id] = stream;
    });
    var receiverList = [];
    var sections = SDPUtils.splitSections(description.sdp);
    var sessionpart = sections.shift();
    var isIceLite = SDPUtils.matchPrefix(sessionpart, 'a=ice-lite').length > 0;
    var usingBundle = SDPUtils.matchPrefix(sessionpart, 'a=group:BUNDLE ').length > 0;
    pc.usingBundle = usingBundle;
    var iceOptions = SDPUtils.matchPrefix(sessionpart, 'a=ice-options:')[0];

    if (iceOptions) {
      pc.canTrickleIceCandidates = iceOptions.substr(14).split(' ').indexOf('trickle') >= 0;
    } else {
      pc.canTrickleIceCandidates = false;
    }

    sections.forEach(function (mediaSection, sdpMLineIndex) {
      var lines = SDPUtils.splitLines(mediaSection);
      var kind = SDPUtils.getKind(mediaSection); // treat bundle-only as not-rejected.

      var rejected = SDPUtils.isRejected(mediaSection) && SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
      var protocol = lines[0].substr(2).split(' ')[2];
      var direction = SDPUtils.getDirection(mediaSection, sessionpart);
      var remoteMsid = SDPUtils.parseMsid(mediaSection);
      var mid = SDPUtils.getMid(mediaSection) || SDPUtils.generateIdentifier(); // Reject datachannels which are not implemented yet.

      if (rejected || kind === 'application' && (protocol === 'DTLS/SCTP' || protocol === 'UDP/DTLS/SCTP')) {
        // TODO: this is dangerous in the case where a non-rejected m-line
        //     becomes rejected.
        pc.transceivers[sdpMLineIndex] = {
          mid: mid,
          kind: kind,
          protocol: protocol,
          rejected: true
        };
        return;
      }

      if (!rejected && pc.transceivers[sdpMLineIndex] && pc.transceivers[sdpMLineIndex].rejected) {
        // recycle a rejected transceiver.
        pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
      }

      var transceiver;
      var iceGatherer;
      var iceTransport;
      var dtlsTransport;
      var rtpReceiver;
      var sendEncodingParameters;
      var recvEncodingParameters;
      var localCapabilities;
      var track; // FIXME: ensure the mediaSection has rtcp-mux set.

      var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
      var remoteIceParameters;
      var remoteDtlsParameters;

      if (!rejected) {
        remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
        remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart);
        remoteDtlsParameters.role = 'client';
      }

      recvEncodingParameters = SDPUtils.parseRtpEncodingParameters(mediaSection);
      var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);
      var isComplete = SDPUtils.matchPrefix(mediaSection, 'a=end-of-candidates', sessionpart).length > 0;
      var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:').map(function (cand) {
        return SDPUtils.parseCandidate(cand);
      }).filter(function (cand) {
        return cand.component === 1;
      }); // Check if we can use BUNDLE and dispose transports.

      if ((description.type === 'offer' || description.type === 'answer') && !rejected && usingBundle && sdpMLineIndex > 0 && pc.transceivers[sdpMLineIndex]) {
        pc._disposeIceAndDtlsTransports(sdpMLineIndex);

        pc.transceivers[sdpMLineIndex].iceGatherer = pc.transceivers[0].iceGatherer;
        pc.transceivers[sdpMLineIndex].iceTransport = pc.transceivers[0].iceTransport;
        pc.transceivers[sdpMLineIndex].dtlsTransport = pc.transceivers[0].dtlsTransport;

        if (pc.transceivers[sdpMLineIndex].rtpSender) {
          pc.transceivers[sdpMLineIndex].rtpSender.setTransport(pc.transceivers[0].dtlsTransport);
        }

        if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
          pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(pc.transceivers[0].dtlsTransport);
        }
      }

      if (description.type === 'offer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex] || pc._createTransceiver(kind);
        transceiver.mid = mid;

        if (!transceiver.iceGatherer) {
          transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex, usingBundle);
        }

        if (cands.length && transceiver.iceTransport.state === 'new') {
          if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
            transceiver.iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function (candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        localCapabilities = window.RTCRtpReceiver.getCapabilities(kind); // filter RTX until additional stuff needed for RTX is implemented
        // in adapter.js

        if (edgeVersion < 15019) {
          localCapabilities.codecs = localCapabilities.codecs.filter(function (codec) {
            return codec.name !== 'rtx';
          });
        }

        sendEncodingParameters = transceiver.sendEncodingParameters || [{
          ssrc: (2 * sdpMLineIndex + 2) * 1001
        }]; // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams

        var isNewTrack = false;

        if (direction === 'sendrecv' || direction === 'sendonly') {
          isNewTrack = !transceiver.rtpReceiver;
          rtpReceiver = transceiver.rtpReceiver || new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);

          if (isNewTrack) {
            var stream;
            track = rtpReceiver.track; // FIXME: does not work with Plan B.

            if (remoteMsid && remoteMsid.stream === '-') {// no-op. a stream id of '-' means: no associated stream.
            } else if (remoteMsid) {
              if (!streams[remoteMsid.stream]) {
                streams[remoteMsid.stream] = new window.MediaStream();
                Object.defineProperty(streams[remoteMsid.stream], 'id', {
                  get: function get() {
                    return remoteMsid.stream;
                  }
                });
              }

              Object.defineProperty(track, 'id', {
                get: function get() {
                  return remoteMsid.track;
                }
              });
              stream = streams[remoteMsid.stream];
            } else {
              if (!streams["default"]) {
                streams["default"] = new window.MediaStream();
              }

              stream = streams["default"];
            }

            if (stream) {
              addTrackToStreamAndFireEvent(track, stream);
              transceiver.associatedRemoteMediaStreams.push(stream);
            }

            receiverList.push([track, rtpReceiver, stream]);
          }
        } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
          transceiver.associatedRemoteMediaStreams.forEach(function (s) {
            var nativeTrack = s.getTracks().find(function (t) {
              return t.id === transceiver.rtpReceiver.track.id;
            });

            if (nativeTrack) {
              removeTrackFromStreamAndFireEvent(nativeTrack, s);
            }
          });
          transceiver.associatedRemoteMediaStreams = [];
        }

        transceiver.localCapabilities = localCapabilities;
        transceiver.remoteCapabilities = remoteCapabilities;
        transceiver.rtpReceiver = rtpReceiver;
        transceiver.rtcpParameters = rtcpParameters;
        transceiver.sendEncodingParameters = sendEncodingParameters;
        transceiver.recvEncodingParameters = recvEncodingParameters; // Start the RTCRtpReceiver now. The RTPSender is started in
        // setLocalDescription.

        pc._transceive(pc.transceivers[sdpMLineIndex], false, isNewTrack);
      } else if (description.type === 'answer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex];
        iceGatherer = transceiver.iceGatherer;
        iceTransport = transceiver.iceTransport;
        dtlsTransport = transceiver.dtlsTransport;
        rtpReceiver = transceiver.rtpReceiver;
        sendEncodingParameters = transceiver.sendEncodingParameters;
        localCapabilities = transceiver.localCapabilities;
        pc.transceivers[sdpMLineIndex].recvEncodingParameters = recvEncodingParameters;
        pc.transceivers[sdpMLineIndex].remoteCapabilities = remoteCapabilities;
        pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;

        if (cands.length && iceTransport.state === 'new') {
          if ((isIceLite || isComplete) && (!usingBundle || sdpMLineIndex === 0)) {
            iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function (candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        if (!usingBundle || sdpMLineIndex === 0) {
          if (iceTransport.state === 'new') {
            iceTransport.start(iceGatherer, remoteIceParameters, 'controlling');
          }

          if (dtlsTransport.state === 'new') {
            dtlsTransport.start(remoteDtlsParameters);
          }
        } // If the offer contained RTX but the answer did not,
        // remove RTX from sendEncodingParameters.


        var commonCapabilities = getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);
        var hasRtx = commonCapabilities.codecs.filter(function (c) {
          return c.name.toLowerCase() === 'rtx';
        }).length;

        if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
          delete transceiver.sendEncodingParameters[0].rtx;
        }

        pc._transceive(transceiver, direction === 'sendrecv' || direction === 'recvonly', direction === 'sendrecv' || direction === 'sendonly'); // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams


        if (rtpReceiver && (direction === 'sendrecv' || direction === 'sendonly')) {
          track = rtpReceiver.track;

          if (remoteMsid) {
            if (!streams[remoteMsid.stream]) {
              streams[remoteMsid.stream] = new window.MediaStream();
            }

            addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
            receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
          } else {
            if (!streams["default"]) {
              streams["default"] = new window.MediaStream();
            }

            addTrackToStreamAndFireEvent(track, streams["default"]);
            receiverList.push([track, rtpReceiver, streams["default"]]);
          }
        } else {
          // FIXME: actually the receiver should be created later.
          delete transceiver.rtpReceiver;
        }
      }
    });

    if (pc._dtlsRole === undefined) {
      pc._dtlsRole = description.type === 'offer' ? 'active' : 'passive';
    }

    pc._remoteDescription = {
      type: description.type,
      sdp: description.sdp
    };

    if (description.type === 'offer') {
      pc._updateSignalingState('have-remote-offer');
    } else {
      pc._updateSignalingState('stable');
    }

    Object.keys(streams).forEach(function (sid) {
      var stream = streams[sid];

      if (stream.getTracks().length) {
        if (pc.remoteStreams.indexOf(stream) === -1) {
          pc.remoteStreams.push(stream);
          var event = new Event('addstream');
          event.stream = stream;
          window.setTimeout(function () {
            pc._dispatchEvent('addstream', event);
          });
        }

        receiverList.forEach(function (item) {
          var track = item[0];
          var receiver = item[1];

          if (stream.id !== item[2].id) {
            return;
          }

          fireAddTrack(pc, track, receiver, [stream]);
        });
      }
    });
    receiverList.forEach(function (item) {
      if (item[2]) {
        return;
      }

      fireAddTrack(pc, item[0], item[1], []);
    }); // check whether addIceCandidate({}) was called within four seconds after
    // setRemoteDescription.

    window.setTimeout(function () {
      if (!(pc && pc.transceivers)) {
        return;
      }

      pc.transceivers.forEach(function (transceiver) {
        if (transceiver.iceTransport && transceiver.iceTransport.state === 'new' && transceiver.iceTransport.getRemoteCandidates().length > 0) {
          console.warn('Timeout for addRemoteCandidate. Consider sending ' + 'an end-of-candidates notification');
          transceiver.iceTransport.addRemoteCandidate({});
        }
      });
    }, 4000);
    return Promise.resolve();
  };

  RTCPeerConnection.prototype.close = function () {
    this.transceivers.forEach(function (transceiver) {
      /* not yet
      if (transceiver.iceGatherer) {
        transceiver.iceGatherer.close();
      }
      */
      if (transceiver.iceTransport) {
        transceiver.iceTransport.stop();
      }

      if (transceiver.dtlsTransport) {
        transceiver.dtlsTransport.stop();
      }

      if (transceiver.rtpSender) {
        transceiver.rtpSender.stop();
      }

      if (transceiver.rtpReceiver) {
        transceiver.rtpReceiver.stop();
      }
    }); // FIXME: clean up tracks, local streams, remote streams, etc

    this._isClosed = true;

    this._updateSignalingState('closed');
  }; // Update the signaling state.


  RTCPeerConnection.prototype._updateSignalingState = function (newState) {
    this.signalingState = newState;
    var event = new Event('signalingstatechange');

    this._dispatchEvent('signalingstatechange', event);
  }; // Determine whether to fire the negotiationneeded event.


  RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function () {
    var pc = this;

    if (this.signalingState !== 'stable' || this.needNegotiation === true) {
      return;
    }

    this.needNegotiation = true;
    window.setTimeout(function () {
      if (pc.needNegotiation) {
        pc.needNegotiation = false;
        var event = new Event('negotiationneeded');

        pc._dispatchEvent('negotiationneeded', event);
      }
    }, 0);
  }; // Update the ice connection state.


  RTCPeerConnection.prototype._updateIceConnectionState = function () {
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      checking: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function (transceiver) {
      if (transceiver.iceTransport && !transceiver.rejected) {
        states[transceiver.iceTransport.state]++;
      }
    });
    newState = 'new';

    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.checking > 0) {
      newState = 'checking';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states["new"] > 0) {
      newState = 'new';
    } else if (states.connected > 0) {
      newState = 'connected';
    } else if (states.completed > 0) {
      newState = 'completed';
    }

    if (newState !== this.iceConnectionState) {
      this.iceConnectionState = newState;
      var event = new Event('iceconnectionstatechange');

      this._dispatchEvent('iceconnectionstatechange', event);
    }
  }; // Update the connection state.


  RTCPeerConnection.prototype._updateConnectionState = function () {
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      connecting: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function (transceiver) {
      if (transceiver.iceTransport && transceiver.dtlsTransport && !transceiver.rejected) {
        states[transceiver.iceTransport.state]++;
        states[transceiver.dtlsTransport.state]++;
      }
    }); // ICETransport.completed and connected are the same for this purpose.

    states.connected += states.completed;
    newState = 'new';

    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.connecting > 0) {
      newState = 'connecting';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states["new"] > 0) {
      newState = 'new';
    } else if (states.connected > 0) {
      newState = 'connected';
    }

    if (newState !== this.connectionState) {
      this.connectionState = newState;
      var event = new Event('connectionstatechange');

      this._dispatchEvent('connectionstatechange', event);
    }
  };

  RTCPeerConnection.prototype.createOffer = function () {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError', 'Can not call createOffer after close'));
    }

    var numAudioTracks = pc.transceivers.filter(function (t) {
      return t.kind === 'audio';
    }).length;
    var numVideoTracks = pc.transceivers.filter(function (t) {
      return t.kind === 'video';
    }).length; // Determine number of audio and video tracks we need to send/recv.

    var offerOptions = arguments[0];

    if (offerOptions) {
      // Reject Chrome legacy constraints.
      if (offerOptions.mandatory || offerOptions.optional) {
        throw new TypeError('Legacy mandatory/optional constraints not supported.');
      }

      if (offerOptions.offerToReceiveAudio !== undefined) {
        if (offerOptions.offerToReceiveAudio === true) {
          numAudioTracks = 1;
        } else if (offerOptions.offerToReceiveAudio === false) {
          numAudioTracks = 0;
        } else {
          numAudioTracks = offerOptions.offerToReceiveAudio;
        }
      }

      if (offerOptions.offerToReceiveVideo !== undefined) {
        if (offerOptions.offerToReceiveVideo === true) {
          numVideoTracks = 1;
        } else if (offerOptions.offerToReceiveVideo === false) {
          numVideoTracks = 0;
        } else {
          numVideoTracks = offerOptions.offerToReceiveVideo;
        }
      }
    }

    pc.transceivers.forEach(function (transceiver) {
      if (transceiver.kind === 'audio') {
        numAudioTracks--;

        if (numAudioTracks < 0) {
          transceiver.wantReceive = false;
        }
      } else if (transceiver.kind === 'video') {
        numVideoTracks--;

        if (numVideoTracks < 0) {
          transceiver.wantReceive = false;
        }
      }
    }); // Create M-lines for recvonly streams.

    while (numAudioTracks > 0 || numVideoTracks > 0) {
      if (numAudioTracks > 0) {
        pc._createTransceiver('audio');

        numAudioTracks--;
      }

      if (numVideoTracks > 0) {
        pc._createTransceiver('video');

        numVideoTracks--;
      }
    }

    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId, pc._sdpSessionVersion++);
    pc.transceivers.forEach(function (transceiver, sdpMLineIndex) {
      // For each track, create an ice gatherer, ice transport,
      // dtls transport, potentially rtpsender and rtpreceiver.
      var track = transceiver.track;
      var kind = transceiver.kind;
      var mid = transceiver.mid || SDPUtils.generateIdentifier();
      transceiver.mid = mid;

      if (!transceiver.iceGatherer) {
        transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex, pc.usingBundle);
      }

      var localCapabilities = window.RTCRtpSender.getCapabilities(kind); // filter RTX until additional stuff needed for RTX is implemented
      // in adapter.js

      if (edgeVersion < 15019) {
        localCapabilities.codecs = localCapabilities.codecs.filter(function (codec) {
          return codec.name !== 'rtx';
        });
      }

      localCapabilities.codecs.forEach(function (codec) {
        // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
        // by adding level-asymmetry-allowed=1
        if (codec.name === 'H264' && codec.parameters['level-asymmetry-allowed'] === undefined) {
          codec.parameters['level-asymmetry-allowed'] = '1';
        } // for subsequent offers, we might have to re-use the payload
        // type of the last offer.


        if (transceiver.remoteCapabilities && transceiver.remoteCapabilities.codecs) {
          transceiver.remoteCapabilities.codecs.forEach(function (remoteCodec) {
            if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() && codec.clockRate === remoteCodec.clockRate) {
              codec.preferredPayloadType = remoteCodec.payloadType;
            }
          });
        }
      });
      localCapabilities.headerExtensions.forEach(function (hdrExt) {
        var remoteExtensions = transceiver.remoteCapabilities && transceiver.remoteCapabilities.headerExtensions || [];
        remoteExtensions.forEach(function (rHdrExt) {
          if (hdrExt.uri === rHdrExt.uri) {
            hdrExt.id = rHdrExt.id;
          }
        });
      }); // generate an ssrc now, to be used later in rtpSender.send

      var sendEncodingParameters = transceiver.sendEncodingParameters || [{
        ssrc: (2 * sdpMLineIndex + 1) * 1001
      }];

      if (track) {
        // add RTX
        if (edgeVersion >= 15019 && kind === 'video' && !sendEncodingParameters[0].rtx) {
          sendEncodingParameters[0].rtx = {
            ssrc: sendEncodingParameters[0].ssrc + 1
          };
        }
      }

      if (transceiver.wantReceive) {
        transceiver.rtpReceiver = new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);
      }

      transceiver.localCapabilities = localCapabilities;
      transceiver.sendEncodingParameters = sendEncodingParameters;
    }); // always offer BUNDLE and dispose on return if not supported.

    if (pc._config.bundlePolicy !== 'max-compat') {
      sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function (t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }

    sdp += 'a=ice-options:trickle\r\n';
    pc.transceivers.forEach(function (transceiver, sdpMLineIndex) {
      sdp += writeMediaSection(transceiver, transceiver.localCapabilities, 'offer', transceiver.stream, pc._dtlsRole);
      sdp += 'a=rtcp-rsize\r\n';

      if (transceiver.iceGatherer && pc.iceGatheringState !== 'new' && (sdpMLineIndex === 0 || !pc.usingBundle)) {
        transceiver.iceGatherer.getLocalCandidates().forEach(function (cand) {
          cand.component = 1;
          sdp += 'a=' + SDPUtils.writeCandidate(cand) + '\r\n';
        });

        if (transceiver.iceGatherer.state === 'completed') {
          sdp += 'a=end-of-candidates\r\n';
        }
      }
    });
    var desc = new window.RTCSessionDescription({
      type: 'offer',
      sdp: sdp
    });
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.createAnswer = function () {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError', 'Can not call createAnswer after close'));
    }

    if (!(pc.signalingState === 'have-remote-offer' || pc.signalingState === 'have-local-pranswer')) {
      return Promise.reject(makeError('InvalidStateError', 'Can not call createAnswer in signalingState ' + pc.signalingState));
    }

    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId, pc._sdpSessionVersion++);

    if (pc.usingBundle) {
      sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function (t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }

    sdp += 'a=ice-options:trickle\r\n';
    var mediaSectionsInOffer = SDPUtils.getMediaSections(pc._remoteDescription.sdp).length;
    pc.transceivers.forEach(function (transceiver, sdpMLineIndex) {
      if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
        return;
      }

      if (transceiver.rejected) {
        if (transceiver.kind === 'application') {
          if (transceiver.protocol === 'DTLS/SCTP') {
            // legacy fmt
            sdp += 'm=application 0 DTLS/SCTP 5000\r\n';
          } else {
            sdp += 'm=application 0 ' + transceiver.protocol + ' webrtc-datachannel\r\n';
          }
        } else if (transceiver.kind === 'audio') {
          sdp += 'm=audio 0 UDP/TLS/RTP/SAVPF 0\r\n' + 'a=rtpmap:0 PCMU/8000\r\n';
        } else if (transceiver.kind === 'video') {
          sdp += 'm=video 0 UDP/TLS/RTP/SAVPF 120\r\n' + 'a=rtpmap:120 VP8/90000\r\n';
        }

        sdp += 'c=IN IP4 0.0.0.0\r\n' + 'a=inactive\r\n' + 'a=mid:' + transceiver.mid + '\r\n';
        return;
      } // FIXME: look at direction.


      if (transceiver.stream) {
        var localTrack;

        if (transceiver.kind === 'audio') {
          localTrack = transceiver.stream.getAudioTracks()[0];
        } else if (transceiver.kind === 'video') {
          localTrack = transceiver.stream.getVideoTracks()[0];
        }

        if (localTrack) {
          // add RTX
          if (edgeVersion >= 15019 && transceiver.kind === 'video' && !transceiver.sendEncodingParameters[0].rtx) {
            transceiver.sendEncodingParameters[0].rtx = {
              ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
            };
          }
        }
      } // Calculate intersection of capabilities.


      var commonCapabilities = getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);
      var hasRtx = commonCapabilities.codecs.filter(function (c) {
        return c.name.toLowerCase() === 'rtx';
      }).length;

      if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
        delete transceiver.sendEncodingParameters[0].rtx;
      }

      sdp += writeMediaSection(transceiver, commonCapabilities, 'answer', transceiver.stream, pc._dtlsRole);

      if (transceiver.rtcpParameters && transceiver.rtcpParameters.reducedSize) {
        sdp += 'a=rtcp-rsize\r\n';
      }
    });
    var desc = new window.RTCSessionDescription({
      type: 'answer',
      sdp: sdp
    });
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.addIceCandidate = function (candidate) {
    var pc = this;
    var sections;

    if (candidate && !(candidate.sdpMLineIndex !== undefined || candidate.sdpMid)) {
      return Promise.reject(new TypeError('sdpMLineIndex or sdpMid required'));
    } // TODO: needs to go into ops queue.


    return new Promise(function (resolve, reject) {
      if (!pc._remoteDescription) {
        return reject(makeError('InvalidStateError', 'Can not add ICE candidate without a remote description'));
      } else if (!candidate || candidate.candidate === '') {
        for (var j = 0; j < pc.transceivers.length; j++) {
          if (pc.transceivers[j].rejected) {
            continue;
          }

          pc.transceivers[j].iceTransport.addRemoteCandidate({});
          sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
          sections[j] += 'a=end-of-candidates\r\n';
          pc._remoteDescription.sdp = SDPUtils.getDescription(pc._remoteDescription.sdp) + sections.join('');

          if (pc.usingBundle) {
            break;
          }
        }
      } else {
        var sdpMLineIndex = candidate.sdpMLineIndex;

        if (candidate.sdpMid) {
          for (var i = 0; i < pc.transceivers.length; i++) {
            if (pc.transceivers[i].mid === candidate.sdpMid) {
              sdpMLineIndex = i;
              break;
            }
          }
        }

        var transceiver = pc.transceivers[sdpMLineIndex];

        if (transceiver) {
          if (transceiver.rejected) {
            return resolve();
          }

          var cand = Object.keys(candidate.candidate).length > 0 ? SDPUtils.parseCandidate(candidate.candidate) : {}; // Ignore Chrome's invalid candidates since Edge does not like them.

          if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
            return resolve();
          } // Ignore RTCP candidates, we assume RTCP-MUX.


          if (cand.component && cand.component !== 1) {
            return resolve();
          } // when using bundle, avoid adding candidates to the wrong
          // ice transport. And avoid adding candidates added in the SDP.


          if (sdpMLineIndex === 0 || sdpMLineIndex > 0 && transceiver.iceTransport !== pc.transceivers[0].iceTransport) {
            if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
              return reject(makeError('OperationError', 'Can not add ICE candidate'));
            }
          } // update the remoteDescription.


          var candidateString = candidate.candidate.trim();

          if (candidateString.indexOf('a=') === 0) {
            candidateString = candidateString.substr(2);
          }

          sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
          sections[sdpMLineIndex] += 'a=' + (cand.type ? candidateString : 'end-of-candidates') + '\r\n';
          pc._remoteDescription.sdp = SDPUtils.getDescription(pc._remoteDescription.sdp) + sections.join('');
        } else {
          return reject(makeError('OperationError', 'Can not add ICE candidate'));
        }
      }

      resolve();
    });
  };

  RTCPeerConnection.prototype.getStats = function (selector) {
    if (selector && selector instanceof window.MediaStreamTrack) {
      var senderOrReceiver = null;
      this.transceivers.forEach(function (transceiver) {
        if (transceiver.rtpSender && transceiver.rtpSender.track === selector) {
          senderOrReceiver = transceiver.rtpSender;
        } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track === selector) {
          senderOrReceiver = transceiver.rtpReceiver;
        }
      });

      if (!senderOrReceiver) {
        throw makeError('InvalidAccessError', 'Invalid selector.');
      }

      return senderOrReceiver.getStats();
    }

    var promises = [];
    this.transceivers.forEach(function (transceiver) {
      ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport', 'dtlsTransport'].forEach(function (method) {
        if (transceiver[method]) {
          promises.push(transceiver[method].getStats());
        }
      });
    });
    return Promise.all(promises).then(function (allStats) {
      var results = new Map();
      allStats.forEach(function (stats) {
        stats.forEach(function (stat) {
          results.set(stat.id, stat);
        });
      });
      return results;
    });
  }; // fix low-level stat names and return Map instead of object.


  var ortcObjects = ['RTCRtpSender', 'RTCRtpReceiver', 'RTCIceGatherer', 'RTCIceTransport', 'RTCDtlsTransport'];
  ortcObjects.forEach(function (ortcObjectName) {
    var obj = window[ortcObjectName];

    if (obj && obj.prototype && obj.prototype.getStats) {
      var nativeGetstats = obj.prototype.getStats;

      obj.prototype.getStats = function () {
        return nativeGetstats.apply(this).then(function (nativeStats) {
          var mapStats = new Map();
          Object.keys(nativeStats).forEach(function (id) {
            nativeStats[id].type = fixStatsType(nativeStats[id]);
            mapStats.set(id, nativeStats[id]);
          });
          return mapStats;
        });
      };
    }
  }); // legacy callback shims. Should be moved to adapter.js some days.

  var methods = ['createOffer', 'createAnswer'];
  methods.forEach(function (method) {
    var nativeMethod = RTCPeerConnection.prototype[method];

    RTCPeerConnection.prototype[method] = function () {
      var args = arguments;

      if (typeof args[0] === 'function' || typeof args[1] === 'function') {
        // legacy
        return nativeMethod.apply(this, [arguments[2]]).then(function (description) {
          if (typeof args[0] === 'function') {
            args[0].apply(null, [description]);
          }
        }, function (error) {
          if (typeof args[1] === 'function') {
            args[1].apply(null, [error]);
          }
        });
      }

      return nativeMethod.apply(this, arguments);
    };
  });
  methods = ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'];
  methods.forEach(function (method) {
    var nativeMethod = RTCPeerConnection.prototype[method];

    RTCPeerConnection.prototype[method] = function () {
      var args = arguments;

      if (typeof args[1] === 'function' || typeof args[2] === 'function') {
        // legacy
        return nativeMethod.apply(this, arguments).then(function () {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        }, function (error) {
          if (typeof args[2] === 'function') {
            args[2].apply(null, [error]);
          }
        });
      }

      return nativeMethod.apply(this, arguments);
    };
  }); // getStats is special. It doesn't have a spec legacy method yet we support
  // getStats(something, cb) without error callbacks.

  ['getStats'].forEach(function (method) {
    var nativeMethod = RTCPeerConnection.prototype[method];

    RTCPeerConnection.prototype[method] = function () {
      var args = arguments;

      if (typeof args[1] === 'function') {
        return nativeMethod.apply(this, arguments).then(function () {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        });
      }

      return nativeMethod.apply(this, arguments);
    };
  });
  return RTCPeerConnection;
};

},{"sdp":6}],6:[function(require,module,exports){
/* eslint-env node */
'use strict'; // SDP helpers.

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var SDPUtils = {}; // Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883

SDPUtils.generateIdentifier = function () {
  return Math.random().toString(36).substr(2, 10);
}; // The RTCP CNAME used by all peerconnections from the same JS.


SDPUtils.localCName = SDPUtils.generateIdentifier(); // Splits SDP into lines, dealing with both CRLF and LF.

SDPUtils.splitLines = function (blob) {
  return blob.trim().split('\n').map(function (line) {
    return line.trim();
  });
}; // Splits SDP into sessionpart and mediasections. Ensures CRLF.


SDPUtils.splitSections = function (blob) {
  var parts = blob.split('\nm=');
  return parts.map(function (part, index) {
    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
  });
}; // returns the session description.


SDPUtils.getDescription = function (blob) {
  var sections = SDPUtils.splitSections(blob);
  return sections && sections[0];
}; // returns the individual media sections.


SDPUtils.getMediaSections = function (blob) {
  var sections = SDPUtils.splitSections(blob);
  sections.shift();
  return sections;
}; // Returns lines that start with a certain prefix.


SDPUtils.matchPrefix = function (blob, prefix) {
  return SDPUtils.splitLines(blob).filter(function (line) {
    return line.indexOf(prefix) === 0;
  });
}; // Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"


SDPUtils.parseCandidate = function (line) {
  var parts; // Parse both variants.

  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parseInt(parts[1], 10),
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    address: parts[4],
    // address is an alias for ip.
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;

      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;

      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;

      case 'ufrag':
        candidate.ufrag = parts[i + 1]; // for backward compability.

        candidate.usernameFragment = parts[i + 1];
        break;

      default:
        // extension handling, in particular ufrag
        candidate[parts[i]] = parts[i + 1];
        break;
    }
  }

  return candidate;
}; // Translates a candidate object into SDP candidate attribute.


SDPUtils.writeCandidate = function (candidate) {
  var sdp = [];
  sdp.push(candidate.foundation);
  sdp.push(candidate.component);
  sdp.push(candidate.protocol.toUpperCase());
  sdp.push(candidate.priority);
  sdp.push(candidate.address || candidate.ip);
  sdp.push(candidate.port);
  var type = candidate.type;
  sdp.push('typ');
  sdp.push(type);

  if (type !== 'host' && candidate.relatedAddress && candidate.relatedPort) {
    sdp.push('raddr');
    sdp.push(candidate.relatedAddress);
    sdp.push('rport');
    sdp.push(candidate.relatedPort);
  }

  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
    sdp.push('tcptype');
    sdp.push(candidate.tcpType);
  }

  if (candidate.usernameFragment || candidate.ufrag) {
    sdp.push('ufrag');
    sdp.push(candidate.usernameFragment || candidate.ufrag);
  }

  return 'candidate:' + sdp.join(' ');
}; // Parses an ice-options line, returns an array of option tags.
// a=ice-options:foo bar


SDPUtils.parseIceOptions = function (line) {
  return line.substr(14).split(' ');
}; // Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2


SDPUtils.parseRtpMap = function (line) {
  var parts = line.substr(9).split(' ');
  var parsed = {
    payloadType: parseInt(parts.shift(), 10) // was: id

  };
  parts = parts[0].split('/');
  parsed.name = parts[0];
  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate

  parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1; // legacy alias, got renamed back to channels in ORTC.

  parsed.numChannels = parsed.channels;
  return parsed;
}; // Generate an a=rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.


SDPUtils.writeRtpMap = function (codec) {
  var pt = codec.payloadType;

  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }

  var channels = codec.channels || codec.numChannels || 1;
  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate + (channels !== 1 ? '/' + channels : '') + '\r\n';
}; // Parses an a=extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset


SDPUtils.parseExtmap = function (line) {
  var parts = line.substr(9).split(' ');
  return {
    id: parseInt(parts[0], 10),
    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
    uri: parts[1]
  };
}; // Generates a=extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.


SDPUtils.writeExtmap = function (headerExtension) {
  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) + (headerExtension.direction && headerExtension.direction !== 'sendrecv' ? '/' + headerExtension.direction : '') + ' ' + headerExtension.uri + '\r\n';
}; // Parses an ftmp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on


SDPUtils.parseFmtp = function (line) {
  var parsed = {};
  var kv;
  var parts = line.substr(line.indexOf(' ') + 1).split(';');

  for (var j = 0; j < parts.length; j++) {
    kv = parts[j].trim().split('=');
    parsed[kv[0].trim()] = kv[1];
  }

  return parsed;
}; // Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.


SDPUtils.writeFmtp = function (codec) {
  var line = '';
  var pt = codec.payloadType;

  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }

  if (codec.parameters && Object.keys(codec.parameters).length) {
    var params = [];
    Object.keys(codec.parameters).forEach(function (param) {
      if (codec.parameters[param]) {
        params.push(param + '=' + codec.parameters[param]);
      } else {
        params.push(param);
      }
    });
    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  }

  return line;
}; // Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi


SDPUtils.parseRtcpFb = function (line) {
  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
  return {
    type: parts.shift(),
    parameter: parts.join(' ')
  };
}; // Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.


SDPUtils.writeRtcpFb = function (codec) {
  var lines = '';
  var pt = codec.payloadType;

  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }

  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
    // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(function (fb) {
      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type + (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') + '\r\n';
    });
  }

  return lines;
}; // Parses an RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something


SDPUtils.parseSsrcMedia = function (line) {
  var sp = line.indexOf(' ');
  var parts = {
    ssrc: parseInt(line.substr(7, sp - 7), 10)
  };
  var colon = line.indexOf(':', sp);

  if (colon > -1) {
    parts.attribute = line.substr(sp + 1, colon - sp - 1);
    parts.value = line.substr(colon + 1);
  } else {
    parts.attribute = line.substr(sp + 1);
  }

  return parts;
};

SDPUtils.parseSsrcGroup = function (line) {
  var parts = line.substr(13).split(' ');
  return {
    semantics: parts.shift(),
    ssrcs: parts.map(function (ssrc) {
      return parseInt(ssrc, 10);
    })
  };
}; // Extracts the MID (RFC 5888) from a media section.
// returns the MID or undefined if no mid line was found.


SDPUtils.getMid = function (mediaSection) {
  var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];

  if (mid) {
    return mid.substr(6);
  }
};

SDPUtils.parseFingerprint = function (line) {
  var parts = line.substr(14).split(' ');
  return {
    algorithm: parts[0].toLowerCase(),
    // algorithm is case-sensitive in Edge.
    value: parts[1]
  };
}; // Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.


SDPUtils.getDtlsParameters = function (mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=fingerprint:'); // Note: a=setup line is ignored since we use the 'auto' role.
  // Note2: 'algorithm' is not case sensitive except in Edge.

  return {
    role: 'auto',
    fingerprints: lines.map(SDPUtils.parseFingerprint)
  };
}; // Serializes DTLS parameters to SDP.


SDPUtils.writeDtlsParameters = function (params, setupType) {
  var sdp = 'a=setup:' + setupType + '\r\n';
  params.fingerprints.forEach(function (fp) {
    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  });
  return sdp;
}; // Parses a=crypto lines into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#dictionary-rtcsrtpsdesparameters-members


SDPUtils.parseCryptoLine = function (line) {
  var parts = line.substr(9).split(' ');
  return {
    tag: parseInt(parts[0], 10),
    cryptoSuite: parts[1],
    keyParams: parts[2],
    sessionParams: parts.slice(3)
  };
};

SDPUtils.writeCryptoLine = function (parameters) {
  return 'a=crypto:' + parameters.tag + ' ' + parameters.cryptoSuite + ' ' + (_typeof(parameters.keyParams) === 'object' ? SDPUtils.writeCryptoKeyParams(parameters.keyParams) : parameters.keyParams) + (parameters.sessionParams ? ' ' + parameters.sessionParams.join(' ') : '') + '\r\n';
}; // Parses the crypto key parameters into
//   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#rtcsrtpkeyparam*


SDPUtils.parseCryptoKeyParams = function (keyParams) {
  if (keyParams.indexOf('inline:') !== 0) {
    return null;
  }

  var parts = keyParams.substr(7).split('|');
  return {
    keyMethod: 'inline',
    keySalt: parts[0],
    lifeTime: parts[1],
    mkiValue: parts[2] ? parts[2].split(':')[0] : undefined,
    mkiLength: parts[2] ? parts[2].split(':')[1] : undefined
  };
};

SDPUtils.writeCryptoKeyParams = function (keyParams) {
  return keyParams.keyMethod + ':' + keyParams.keySalt + (keyParams.lifeTime ? '|' + keyParams.lifeTime : '') + (keyParams.mkiValue && keyParams.mkiLength ? '|' + keyParams.mkiValue + ':' + keyParams.mkiLength : '');
}; // Extracts all SDES paramters.


SDPUtils.getCryptoParameters = function (mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=crypto:');
  return lines.map(SDPUtils.parseCryptoLine);
}; // Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.


SDPUtils.getIceParameters = function (mediaSection, sessionpart) {
  var ufrag = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=ice-ufrag:')[0];
  var pwd = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=ice-pwd:')[0];

  if (!(ufrag && pwd)) {
    return null;
  }

  return {
    usernameFragment: ufrag.substr(12),
    password: pwd.substr(10)
  };
}; // Serializes ICE parameters to SDP.


SDPUtils.writeIceParameters = function (params) {
  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' + 'a=ice-pwd:' + params.password + '\r\n';
}; // Parses the SDP media section and returns RTCRtpParameters.


SDPUtils.parseRtpParameters = function (mediaSection) {
  var description = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: [],
    rtcp: []
  };
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');

  for (var i = 3; i < mline.length; i++) {
    // find all codecs from mline[3..]
    var pt = mline[i];
    var rtpmapline = SDPUtils.matchPrefix(mediaSection, 'a=rtpmap:' + pt + ' ')[0];

    if (rtpmapline) {
      var codec = SDPUtils.parseRtpMap(rtpmapline);
      var fmtps = SDPUtils.matchPrefix(mediaSection, 'a=fmtp:' + pt + ' '); // Only the first a=fmtp:<pt> is considered.

      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
      codec.rtcpFeedback = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-fb:' + pt + ' ').map(SDPUtils.parseRtcpFb);
      description.codecs.push(codec); // parse FEC mechanisms from rtpmap lines.

      switch (codec.name.toUpperCase()) {
        case 'RED':
        case 'ULPFEC':
          description.fecMechanisms.push(codec.name.toUpperCase());
          break;

        default:
          // only RED and ULPFEC are recognized as FEC mechanisms.
          break;
      }
    }
  }

  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function (line) {
    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  }); // FIXME: parse rtcp.

  return description;
}; // Generates parts of the SDP media section describing the capabilities /
// parameters.


SDPUtils.writeRtpDescription = function (kind, caps) {
  var sdp = ''; // Build the mline.

  sdp += 'm=' + kind + ' ';
  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.

  sdp += ' UDP/TLS/RTP/SAVPF ';
  sdp += caps.codecs.map(function (codec) {
    if (codec.preferredPayloadType !== undefined) {
      return codec.preferredPayloadType;
    }

    return codec.payloadType;
  }).join(' ') + '\r\n';
  sdp += 'c=IN IP4 0.0.0.0\r\n';
  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n'; // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.

  caps.codecs.forEach(function (codec) {
    sdp += SDPUtils.writeRtpMap(codec);
    sdp += SDPUtils.writeFmtp(codec);
    sdp += SDPUtils.writeRtcpFb(codec);
  });
  var maxptime = 0;
  caps.codecs.forEach(function (codec) {
    if (codec.maxptime > maxptime) {
      maxptime = codec.maxptime;
    }
  });

  if (maxptime > 0) {
    sdp += 'a=maxptime:' + maxptime + '\r\n';
  }

  sdp += 'a=rtcp-mux\r\n';

  if (caps.headerExtensions) {
    caps.headerExtensions.forEach(function (extension) {
      sdp += SDPUtils.writeExtmap(extension);
    });
  } // FIXME: write fecMechanisms.


  return sdp;
}; // Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.


SDPUtils.parseRtpEncodingParameters = function (mediaSection) {
  var encodingParameters = [];
  var description = SDPUtils.parseRtpParameters(mediaSection);
  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1; // filter a=ssrc:... cname:, ignore PlanB-msid

  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
    return SDPUtils.parseSsrcMedia(line);
  }).filter(function (parts) {
    return parts.attribute === 'cname';
  });
  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  var secondarySsrc;
  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID').map(function (line) {
    var parts = line.substr(17).split(' ');
    return parts.map(function (part) {
      return parseInt(part, 10);
    });
  });

  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
    secondarySsrc = flows[0][1];
  }

  description.codecs.forEach(function (codec) {
    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
      var encParam = {
        ssrc: primarySsrc,
        codecPayloadType: parseInt(codec.parameters.apt, 10)
      };

      if (primarySsrc && secondarySsrc) {
        encParam.rtx = {
          ssrc: secondarySsrc
        };
      }

      encodingParameters.push(encParam);

      if (hasRed) {
        encParam = JSON.parse(JSON.stringify(encParam));
        encParam.fec = {
          ssrc: primarySsrc,
          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
        };
        encodingParameters.push(encParam);
      }
    }
  });

  if (encodingParameters.length === 0 && primarySsrc) {
    encodingParameters.push({
      ssrc: primarySsrc
    });
  } // we support both b=AS and b=TIAS but interpret AS as TIAS.


  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');

  if (bandwidth.length) {
    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(7), 10);
    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
      // use formula from JSEP to convert b=AS to TIAS value.
      bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95 - 50 * 40 * 8;
    } else {
      bandwidth = undefined;
    }

    encodingParameters.forEach(function (params) {
      params.maxBitrate = bandwidth;
    });
  }

  return encodingParameters;
}; // parses http://draft.ortc.org/#rtcrtcpparameters*


SDPUtils.parseRtcpParameters = function (mediaSection) {
  var rtcpParameters = {}; // Gets the first SSRC. Note tha with RTX there might be multiple
  // SSRCs.

  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
    return SDPUtils.parseSsrcMedia(line);
  }).filter(function (obj) {
    return obj.attribute === 'cname';
  })[0];

  if (remoteSsrc) {
    rtcpParameters.cname = remoteSsrc.value;
    rtcpParameters.ssrc = remoteSsrc.ssrc;
  } // Edge uses the compound attribute instead of reducedSize
  // compound is !reducedSize


  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  rtcpParameters.reducedSize = rsize.length > 0;
  rtcpParameters.compound = rsize.length === 0; // parses the rtcp-mux attrіbute.
  // Note that Edge does not support unmuxed RTCP.

  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  rtcpParameters.mux = mux.length > 0;
  return rtcpParameters;
}; // parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.


SDPUtils.parseMsid = function (mediaSection) {
  var parts;
  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');

  if (spec.length === 1) {
    parts = spec[0].substr(7).split(' ');
    return {
      stream: parts[0],
      track: parts[1]
    };
  }

  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
    return SDPUtils.parseSsrcMedia(line);
  }).filter(function (msidParts) {
    return msidParts.attribute === 'msid';
  });

  if (planB.length > 0) {
    parts = planB[0].value.split(' ');
    return {
      stream: parts[0],
      track: parts[1]
    };
  }
}; // SCTP
// parses draft-ietf-mmusic-sctp-sdp-26 first and falls back
// to draft-ietf-mmusic-sctp-sdp-05


SDPUtils.parseSctpDescription = function (mediaSection) {
  var mline = SDPUtils.parseMLine(mediaSection);
  var maxSizeLine = SDPUtils.matchPrefix(mediaSection, 'a=max-message-size:');
  var maxMessageSize;

  if (maxSizeLine.length > 0) {
    maxMessageSize = parseInt(maxSizeLine[0].substr(19), 10);
  }

  if (isNaN(maxMessageSize)) {
    maxMessageSize = 65536;
  }

  var sctpPort = SDPUtils.matchPrefix(mediaSection, 'a=sctp-port:');

  if (sctpPort.length > 0) {
    return {
      port: parseInt(sctpPort[0].substr(12), 10),
      protocol: mline.fmt,
      maxMessageSize: maxMessageSize
    };
  }

  var sctpMapLines = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:');

  if (sctpMapLines.length > 0) {
    var parts = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:')[0].substr(10).split(' ');
    return {
      port: parseInt(parts[0], 10),
      protocol: parts[1],
      maxMessageSize: maxMessageSize
    };
  }
}; // SCTP
// outputs the draft-ietf-mmusic-sctp-sdp-26 version that all browsers
// support by now receiving in this format, unless we originally parsed
// as the draft-ietf-mmusic-sctp-sdp-05 format (indicated by the m-line
// protocol of DTLS/SCTP -- without UDP/ or TCP/)


SDPUtils.writeSctpDescription = function (media, sctp) {
  var output = [];

  if (media.protocol !== 'DTLS/SCTP') {
    output = ['m=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.protocol + '\r\n', 'c=IN IP4 0.0.0.0\r\n', 'a=sctp-port:' + sctp.port + '\r\n'];
  } else {
    output = ['m=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.port + '\r\n', 'c=IN IP4 0.0.0.0\r\n', 'a=sctpmap:' + sctp.port + ' ' + sctp.protocol + ' 65535\r\n'];
  }

  if (sctp.maxMessageSize !== undefined) {
    output.push('a=max-message-size:' + sctp.maxMessageSize + '\r\n');
  }

  return output.join('');
}; // Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range


SDPUtils.generateSessionId = function () {
  return Math.random().toString().substr(2, 21);
}; // Write boilder plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
// sessUser is optional and defaults to 'thisisadapterortc'


SDPUtils.writeSessionBoilerplate = function (sessId, sessVer, sessUser) {
  var sessionId;
  var version = sessVer !== undefined ? sessVer : 2;

  if (sessId) {
    sessionId = sessId;
  } else {
    sessionId = SDPUtils.generateSessionId();
  }

  var user = sessUser || 'thisisadapterortc'; // FIXME: sess-id should be an NTP timestamp.

  return 'v=0\r\n' + 'o=' + user + ' ' + sessionId + ' ' + version + ' IN IP4 127.0.0.1\r\n' + 's=-\r\n' + 't=0 0\r\n';
};

SDPUtils.writeMediaSection = function (transceiver, caps, type, stream) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps); // Map ICE parameters (ufrag, pwd) to SDP.

  sdp += SDPUtils.writeIceParameters(transceiver.iceGatherer.getLocalParameters()); // Map DTLS parameters to SDP.

  sdp += SDPUtils.writeDtlsParameters(transceiver.dtlsTransport.getLocalParameters(), type === 'offer' ? 'actpass' : 'active');
  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.direction) {
    sdp += 'a=' + transceiver.direction + '\r\n';
  } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    // spec.
    var msid = 'msid:' + stream.id + ' ' + transceiver.rtpSender.track.id + '\r\n';
    sdp += 'a=' + msid; // for Chrome.

    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' ' + msid;

    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc + ' ' + msid;
      sdp += 'a=ssrc-group:FID ' + transceiver.sendEncodingParameters[0].ssrc + ' ' + transceiver.sendEncodingParameters[0].rtx.ssrc + '\r\n';
    }
  } // FIXME: this should be written by writeRtpDescription.


  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' cname:' + SDPUtils.localCName + '\r\n';

  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc + ' cname:' + SDPUtils.localCName + '\r\n';
  }

  return sdp;
}; // Gets the direction from the mediaSection or the sessionpart.


SDPUtils.getDirection = function (mediaSection, sessionpart) {
  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  var lines = SDPUtils.splitLines(mediaSection);

  for (var i = 0; i < lines.length; i++) {
    switch (lines[i]) {
      case 'a=sendrecv':
      case 'a=sendonly':
      case 'a=recvonly':
      case 'a=inactive':
        return lines[i].substr(2);

      default: // FIXME: What should happen here?

    }
  }

  if (sessionpart) {
    return SDPUtils.getDirection(sessionpart);
  }

  return 'sendrecv';
};

SDPUtils.getKind = function (mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  return mline[0].substr(2);
};

SDPUtils.isRejected = function (mediaSection) {
  return mediaSection.split(' ', 2)[1] === '0';
};

SDPUtils.parseMLine = function (mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var parts = lines[0].substr(2).split(' ');
  return {
    kind: parts[0],
    port: parseInt(parts[1], 10),
    protocol: parts[2],
    fmt: parts.slice(3).join(' ')
  };
};

SDPUtils.parseOLine = function (mediaSection) {
  var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
  var parts = line.substr(2).split(' ');
  return {
    username: parts[0],
    sessionId: parts[1],
    sessionVersion: parseInt(parts[2], 10),
    netType: parts[3],
    addressType: parts[4],
    address: parts[5]
  };
}; // a very naive interpretation of a valid SDP.


SDPUtils.isValidSDP = function (blob) {
  if (typeof blob !== 'string' || blob.length === 0) {
    return false;
  }

  var lines = SDPUtils.splitLines(blob);

  for (var i = 0; i < lines.length; i++) {
    if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
      return false;
    } // TODO: check the modifier a bit more.

  }

  return true;
}; // Expose public methods.


if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object') {
  module.exports = SDPUtils;
}

},{}],7:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;

var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0; // DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};

exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};

exports.clearTimeout = exports.clearInterval = function (timeout) {
  timeout.close();
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}

Timeout.prototype.unref = Timeout.prototype.ref = function () {};

Timeout.prototype.close = function () {
  this._clearFn.call(window, this._id);
}; // Does not start the time, just sets up the members needed.


exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);
  var msecs = item._idleTimeout;

  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
}; // That's not how node.js implements it but the exposed api is the same.


exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function (fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
  immediateIds[id] = true;
  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      } // Prevent ids from leaking


      exports.clearImmediate(id);
    }
  });
  return id;
};
exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function (id) {
  delete immediateIds[id];
};

}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":3,"timers":7}],8:[function(require,module,exports){
/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex; // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4

  return [bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]]].join('');
}

module.exports = bytesToUuid;

},{}],9:[function(require,module,exports){
// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto);

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

},{}],10:[function(require,module,exports){
var rng = require('./lib/rng');

var bytesToUuid = require('./lib/bytesToUuid'); // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html


var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = rng();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;

},{"./lib/bytesToUuid":8,"./lib/rng":9}],11:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _adapter_factory = require('./adapter_factory.js');

var adapter = (0, _adapter_factory.adapterFactory)({
  window: typeof window === 'undefined' ? undefined : window
});
exports["default"] = adapter;

},{"./adapter_factory.js":12}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adapterFactory = adapterFactory;

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _chrome_shim = require('./chrome/chrome_shim');

var chromeShim = _interopRequireWildcard(_chrome_shim);

var _edge_shim = require('./edge/edge_shim');

var edgeShim = _interopRequireWildcard(_edge_shim);

var _firefox_shim = require('./firefox/firefox_shim');

var firefoxShim = _interopRequireWildcard(_firefox_shim);

var _safari_shim = require('./safari/safari_shim');

var safariShim = _interopRequireWildcard(_safari_shim);

var _common_shim = require('./common_shim');

var commonShim = _interopRequireWildcard(_common_shim);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
} // Shimming starts here.

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */


function adapterFactory() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      window = _ref.window;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    shimChrome: true,
    shimFirefox: true,
    shimEdge: true,
    shimSafari: true
  }; // Utils.

  var logging = utils.log;
  var browserDetails = utils.detectBrowser(window);
  var adapter = {
    browserDetails: browserDetails,
    commonShim: commonShim,
    extractVersion: utils.extractVersion,
    disableLog: utils.disableLog,
    disableWarnings: utils.disableWarnings
  }; // Shim browser if found.

  switch (browserDetails.browser) {
    case 'chrome':
      if (!chromeShim || !chromeShim.shimPeerConnection || !options.shimChrome) {
        logging('Chrome shim is not included in this adapter release.');
        return adapter;
      }

      if (browserDetails.version === null) {
        logging('Chrome shim can not determine version, not shimming.');
        return adapter;
      }

      logging('adapter.js shimming chrome.'); // Export to the adapter global object visible in the browser.

      adapter.browserShim = chromeShim;
      chromeShim.shimGetUserMedia(window);
      chromeShim.shimMediaStream(window);
      chromeShim.shimPeerConnection(window);
      chromeShim.shimOnTrack(window);
      chromeShim.shimAddTrackRemoveTrack(window);
      chromeShim.shimGetSendersWithDtmf(window);
      chromeShim.shimGetStats(window);
      chromeShim.shimSenderReceiverGetStats(window);
      chromeShim.fixNegotiationNeeded(window);
      commonShim.shimRTCIceCandidate(window);
      commonShim.shimConnectionState(window);
      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      commonShim.removeAllowExtmapMixed(window);
      break;

    case 'firefox':
      if (!firefoxShim || !firefoxShim.shimPeerConnection || !options.shimFirefox) {
        logging('Firefox shim is not included in this adapter release.');
        return adapter;
      }

      logging('adapter.js shimming firefox.'); // Export to the adapter global object visible in the browser.

      adapter.browserShim = firefoxShim;
      firefoxShim.shimGetUserMedia(window);
      firefoxShim.shimPeerConnection(window);
      firefoxShim.shimOnTrack(window);
      firefoxShim.shimRemoveStream(window);
      firefoxShim.shimSenderGetStats(window);
      firefoxShim.shimReceiverGetStats(window);
      firefoxShim.shimRTCDataChannel(window);
      firefoxShim.shimAddTransceiver(window);
      firefoxShim.shimGetParameters(window);
      firefoxShim.shimCreateOffer(window);
      firefoxShim.shimCreateAnswer(window);
      commonShim.shimRTCIceCandidate(window);
      commonShim.shimConnectionState(window);
      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      break;

    case 'edge':
      if (!edgeShim || !edgeShim.shimPeerConnection || !options.shimEdge) {
        logging('MS edge shim is not included in this adapter release.');
        return adapter;
      }

      logging('adapter.js shimming edge.'); // Export to the adapter global object visible in the browser.

      adapter.browserShim = edgeShim;
      edgeShim.shimGetUserMedia(window);
      edgeShim.shimGetDisplayMedia(window);
      edgeShim.shimPeerConnection(window);
      edgeShim.shimReplaceTrack(window); // the edge shim implements the full RTCIceCandidate object.

      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      break;

    case 'safari':
      if (!safariShim || !options.shimSafari) {
        logging('Safari shim is not included in this adapter release.');
        return adapter;
      }

      logging('adapter.js shimming safari.'); // Export to the adapter global object visible in the browser.

      adapter.browserShim = safariShim;
      safariShim.shimRTCIceServerUrls(window);
      safariShim.shimCreateOfferLegacy(window);
      safariShim.shimCallbacksAPI(window);
      safariShim.shimLocalStreamsAPI(window);
      safariShim.shimRemoteStreamsAPI(window);
      safariShim.shimTrackEventTransceiver(window);
      safariShim.shimGetUserMedia(window);
      safariShim.shimAudioContext(window);
      commonShim.shimRTCIceCandidate(window);
      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      commonShim.removeAllowExtmapMixed(window);
      break;

    default:
      logging('Unsupported browser!');
      break;
  }

  return adapter;
} // Browser shims.

},{"./chrome/chrome_shim":13,"./common_shim":16,"./edge/edge_shim":17,"./firefox/firefox_shim":21,"./safari/safari_shim":24,"./utils":25}],13:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

var _getusermedia = require('./getusermedia');

Object.defineProperty(exports, 'shimGetUserMedia', {
  enumerable: true,
  get: function get() {
    return _getusermedia.shimGetUserMedia;
  }
});

var _getdisplaymedia = require('./getdisplaymedia');

Object.defineProperty(exports, 'shimGetDisplayMedia', {
  enumerable: true,
  get: function get() {
    return _getdisplaymedia.shimGetDisplayMedia;
  }
});
exports.shimMediaStream = shimMediaStream;
exports.shimOnTrack = shimOnTrack;
exports.shimGetSendersWithDtmf = shimGetSendersWithDtmf;
exports.shimGetStats = shimGetStats;
exports.shimSenderReceiverGetStats = shimSenderReceiverGetStats;
exports.shimAddTrackRemoveTrackWithNative = shimAddTrackRemoveTrackWithNative;
exports.shimAddTrackRemoveTrack = shimAddTrackRemoveTrack;
exports.shimPeerConnection = shimPeerConnection;
exports.fixNegotiationNeeded = fixNegotiationNeeded;

var _utils = require('../utils.js');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function shimMediaStream(window) {
  window.MediaStream = window.MediaStream || window.webkitMediaStream;
}

function shimOnTrack(window) {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('ontrack' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
      get: function get() {
        return this._ontrack;
      },
      set: function set(f) {
        if (this._ontrack) {
          this.removeEventListener('track', this._ontrack);
        }

        this.addEventListener('track', this._ontrack = f);
      },
      enumerable: true,
      configurable: true
    });
    var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;

    window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
      var _this = this;

      if (!this._ontrackpoly) {
        this._ontrackpoly = function (e) {
          // onaddstream does not fire when a track is added to an existing
          // stream. But stream.onaddtrack is implemented so we use that.
          e.stream.addEventListener('addtrack', function (te) {
            var receiver = void 0;

            if (window.RTCPeerConnection.prototype.getReceivers) {
              receiver = _this.getReceivers().find(function (r) {
                return r.track && r.track.id === te.track.id;
              });
            } else {
              receiver = {
                track: te.track
              };
            }

            var event = new Event('track');
            event.track = te.track;
            event.receiver = receiver;
            event.transceiver = {
              receiver: receiver
            };
            event.streams = [e.stream];

            _this.dispatchEvent(event);
          });
          e.stream.getTracks().forEach(function (track) {
            var receiver = void 0;

            if (window.RTCPeerConnection.prototype.getReceivers) {
              receiver = _this.getReceivers().find(function (r) {
                return r.track && r.track.id === track.id;
              });
            } else {
              receiver = {
                track: track
              };
            }

            var event = new Event('track');
            event.track = track;
            event.receiver = receiver;
            event.transceiver = {
              receiver: receiver
            };
            event.streams = [e.stream];

            _this.dispatchEvent(event);
          });
        };

        this.addEventListener('addstream', this._ontrackpoly);
      }

      return origSetRemoteDescription.apply(this, arguments);
    };
  } else {
    // even if RTCRtpTransceiver is in window, it is only used and
    // emitted in unified-plan. Unfortunately this means we need
    // to unconditionally wrap the event.
    utils.wrapPeerConnectionEvent(window, 'track', function (e) {
      if (!e.transceiver) {
        Object.defineProperty(e, 'transceiver', {
          value: {
            receiver: e.receiver
          }
        });
      }

      return e;
    });
  }
}

function shimGetSendersWithDtmf(window) {
  // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && !('getSenders' in window.RTCPeerConnection.prototype) && 'createDTMFSender' in window.RTCPeerConnection.prototype) {
    var shimSenderWithDtmf = function shimSenderWithDtmf(pc, track) {
      return {
        track: track,

        get dtmf() {
          if (this._dtmf === undefined) {
            if (track.kind === 'audio') {
              this._dtmf = pc.createDTMFSender(track);
            } else {
              this._dtmf = null;
            }
          }

          return this._dtmf;
        },

        _pc: pc
      };
    }; // augment addTrack when getSenders is not available.


    if (!window.RTCPeerConnection.prototype.getSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        this._senders = this._senders || [];
        return this._senders.slice(); // return a copy of the internal state.
      };

      var origAddTrack = window.RTCPeerConnection.prototype.addTrack;

      window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
        var sender = origAddTrack.apply(this, arguments);

        if (!sender) {
          sender = shimSenderWithDtmf(this, track);

          this._senders.push(sender);
        }

        return sender;
      };

      var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;

      window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
        origRemoveTrack.apply(this, arguments);

        var idx = this._senders.indexOf(sender);

        if (idx !== -1) {
          this._senders.splice(idx, 1);
        }
      };
    }

    var origAddStream = window.RTCPeerConnection.prototype.addStream;

    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      var _this2 = this;

      this._senders = this._senders || [];
      origAddStream.apply(this, [stream]);
      stream.getTracks().forEach(function (track) {
        _this2._senders.push(shimSenderWithDtmf(_this2, track));
      });
    };

    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;

    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      var _this3 = this;

      this._senders = this._senders || [];
      origRemoveStream.apply(this, [stream]);
      stream.getTracks().forEach(function (track) {
        var sender = _this3._senders.find(function (s) {
          return s.track === track;
        });

        if (sender) {
          // remove sender
          _this3._senders.splice(_this3._senders.indexOf(sender), 1);
        }
      });
    };
  } else if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && 'getSenders' in window.RTCPeerConnection.prototype && 'createDTMFSender' in window.RTCPeerConnection.prototype && window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
    var origGetSenders = window.RTCPeerConnection.prototype.getSenders;

    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
      var _this4 = this;

      var senders = origGetSenders.apply(this, []);
      senders.forEach(function (sender) {
        return sender._pc = _this4;
      });
      return senders;
    };

    Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
      get: function get() {
        if (this._dtmf === undefined) {
          if (this.track.kind === 'audio') {
            this._dtmf = this._pc.createDTMFSender(this.track);
          } else {
            this._dtmf = null;
          }
        }

        return this._dtmf;
      }
    });
  }
}

function shimGetStats(window) {
  if (!window.RTCPeerConnection) {
    return;
  }

  var origGetStats = window.RTCPeerConnection.prototype.getStats;

  window.RTCPeerConnection.prototype.getStats = function getStats() {
    var _this5 = this;

    var _arguments = Array.prototype.slice.call(arguments),
        selector = _arguments[0],
        onSucc = _arguments[1],
        onErr = _arguments[2]; // If selector is a function then we are in the old style stats so just
    // pass back the original getStats format to avoid breaking old users.


    if (arguments.length > 0 && typeof selector === 'function') {
      return origGetStats.apply(this, arguments);
    } // When spec-style getStats is supported, return those when called with
    // either no arguments or the selector argument is null.


    if (origGetStats.length === 0 && (arguments.length === 0 || typeof selector !== 'function')) {
      return origGetStats.apply(this, []);
    }

    var fixChromeStats_ = function fixChromeStats_(response) {
      var standardReport = {};
      var reports = response.result();
      reports.forEach(function (report) {
        var standardStats = {
          id: report.id,
          timestamp: report.timestamp,
          type: {
            localcandidate: 'local-candidate',
            remotecandidate: 'remote-candidate'
          }[report.type] || report.type
        };
        report.names().forEach(function (name) {
          standardStats[name] = report.stat(name);
        });
        standardReport[standardStats.id] = standardStats;
      });
      return standardReport;
    }; // shim getStats with maplike support


    var makeMapStats = function makeMapStats(stats) {
      return new Map(Object.keys(stats).map(function (key) {
        return [key, stats[key]];
      }));
    };

    if (arguments.length >= 2) {
      var successCallbackWrapper_ = function successCallbackWrapper_(response) {
        onSucc(makeMapStats(fixChromeStats_(response)));
      };

      return origGetStats.apply(this, [successCallbackWrapper_, selector]);
    } // promise-support


    return new Promise(function (resolve, reject) {
      origGetStats.apply(_this5, [function (response) {
        resolve(makeMapStats(fixChromeStats_(response)));
      }, reject]);
    }).then(onSucc, onErr);
  };
}

function shimSenderReceiverGetStats(window) {
  if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender && window.RTCRtpReceiver)) {
    return;
  } // shim sender stats.


  if (!('getStats' in window.RTCRtpSender.prototype)) {
    var origGetSenders = window.RTCPeerConnection.prototype.getSenders;

    if (origGetSenders) {
      window.RTCPeerConnection.prototype.getSenders = function getSenders() {
        var _this6 = this;

        var senders = origGetSenders.apply(this, []);
        senders.forEach(function (sender) {
          return sender._pc = _this6;
        });
        return senders;
      };
    }

    var origAddTrack = window.RTCPeerConnection.prototype.addTrack;

    if (origAddTrack) {
      window.RTCPeerConnection.prototype.addTrack = function addTrack() {
        var sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
      };
    }

    window.RTCRtpSender.prototype.getStats = function getStats() {
      var sender = this;
      return this._pc.getStats().then(function (result) {
        return (
          /* Note: this will include stats of all senders that
           *   send a track with the same id as sender.track as
           *   it is not possible to identify the RTCRtpSender.
           */
          utils.filterStats(result, sender.track, true)
        );
      });
    };
  } // shim receiver stats.


  if (!('getStats' in window.RTCRtpReceiver.prototype)) {
    var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;

    if (origGetReceivers) {
      window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
        var _this7 = this;

        var receivers = origGetReceivers.apply(this, []);
        receivers.forEach(function (receiver) {
          return receiver._pc = _this7;
        });
        return receivers;
      };
    }

    utils.wrapPeerConnectionEvent(window, 'track', function (e) {
      e.receiver._pc = e.srcElement;
      return e;
    });

    window.RTCRtpReceiver.prototype.getStats = function getStats() {
      var receiver = this;
      return this._pc.getStats().then(function (result) {
        return utils.filterStats(result, receiver.track, false);
      });
    };
  }

  if (!('getStats' in window.RTCRtpSender.prototype && 'getStats' in window.RTCRtpReceiver.prototype)) {
    return;
  } // shim RTCPeerConnection.getStats(track).


  var origGetStats = window.RTCPeerConnection.prototype.getStats;

  window.RTCPeerConnection.prototype.getStats = function getStats() {
    if (arguments.length > 0 && arguments[0] instanceof window.MediaStreamTrack) {
      var track = arguments[0];
      var sender = void 0;
      var receiver = void 0;
      var err = void 0;
      this.getSenders().forEach(function (s) {
        if (s.track === track) {
          if (sender) {
            err = true;
          } else {
            sender = s;
          }
        }
      });
      this.getReceivers().forEach(function (r) {
        if (r.track === track) {
          if (receiver) {
            err = true;
          } else {
            receiver = r;
          }
        }

        return r.track === track;
      });

      if (err || sender && receiver) {
        return Promise.reject(new DOMException('There are more than one sender or receiver for the track.', 'InvalidAccessError'));
      } else if (sender) {
        return sender.getStats();
      } else if (receiver) {
        return receiver.getStats();
      }

      return Promise.reject(new DOMException('There is no sender or receiver for the track.', 'InvalidAccessError'));
    }

    return origGetStats.apply(this, arguments);
  };
}

function shimAddTrackRemoveTrackWithNative(window) {
  // shim addTrack/removeTrack with native variants in order to make
  // the interactions with legacy getLocalStreams behave as in other browsers.
  // Keeps a mapping stream.id => [stream, rtpsenders...]
  window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
    var _this8 = this;

    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    return Object.keys(this._shimmedLocalStreams).map(function (streamId) {
      return _this8._shimmedLocalStreams[streamId][0];
    });
  };

  var origAddTrack = window.RTCPeerConnection.prototype.addTrack;

  window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
    if (!stream) {
      return origAddTrack.apply(this, arguments);
    }

    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    var sender = origAddTrack.apply(this, arguments);

    if (!this._shimmedLocalStreams[stream.id]) {
      this._shimmedLocalStreams[stream.id] = [stream, sender];
    } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
      this._shimmedLocalStreams[stream.id].push(sender);
    }

    return sender;
  };

  var origAddStream = window.RTCPeerConnection.prototype.addStream;

  window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    var _this9 = this;

    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    stream.getTracks().forEach(function (track) {
      var alreadyExists = _this9.getSenders().find(function (s) {
        return s.track === track;
      });

      if (alreadyExists) {
        throw new DOMException('Track already exists.', 'InvalidAccessError');
      }
    });
    var existingSenders = this.getSenders();
    origAddStream.apply(this, arguments);
    var newSenders = this.getSenders().filter(function (newSender) {
      return existingSenders.indexOf(newSender) === -1;
    });
    this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
  };

  var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;

  window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
    this._shimmedLocalStreams = this._shimmedLocalStreams || {};
    delete this._shimmedLocalStreams[stream.id];
    return origRemoveStream.apply(this, arguments);
  };

  var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;

  window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
    var _this10 = this;

    this._shimmedLocalStreams = this._shimmedLocalStreams || {};

    if (sender) {
      Object.keys(this._shimmedLocalStreams).forEach(function (streamId) {
        var idx = _this10._shimmedLocalStreams[streamId].indexOf(sender);

        if (idx !== -1) {
          _this10._shimmedLocalStreams[streamId].splice(idx, 1);
        }

        if (_this10._shimmedLocalStreams[streamId].length === 1) {
          delete _this10._shimmedLocalStreams[streamId];
        }
      });
    }

    return origRemoveTrack.apply(this, arguments);
  };
}

function shimAddTrackRemoveTrack(window) {
  if (!window.RTCPeerConnection) {
    return;
  }

  var browserDetails = utils.detectBrowser(window); // shim addTrack and removeTrack.

  if (window.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) {
    return shimAddTrackRemoveTrackWithNative(window);
  } // also shim pc.getLocalStreams when addTrack is shimmed
  // to return the original streams.


  var origGetLocalStreams = window.RTCPeerConnection.prototype.getLocalStreams;

  window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
    var _this11 = this;

    var nativeStreams = origGetLocalStreams.apply(this);
    this._reverseStreams = this._reverseStreams || {};
    return nativeStreams.map(function (stream) {
      return _this11._reverseStreams[stream.id];
    });
  };

  var origAddStream = window.RTCPeerConnection.prototype.addStream;

  window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
    var _this12 = this;

    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};
    stream.getTracks().forEach(function (track) {
      var alreadyExists = _this12.getSenders().find(function (s) {
        return s.track === track;
      });

      if (alreadyExists) {
        throw new DOMException('Track already exists.', 'InvalidAccessError');
      }
    }); // Add identity mapping for consistency with addTrack.
    // Unless this is being used with a stream from addTrack.

    if (!this._reverseStreams[stream.id]) {
      var newStream = new window.MediaStream(stream.getTracks());
      this._streams[stream.id] = newStream;
      this._reverseStreams[newStream.id] = stream;
      stream = newStream;
    }

    origAddStream.apply(this, [stream]);
  };

  var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;

  window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};
    origRemoveStream.apply(this, [this._streams[stream.id] || stream]);
    delete this._reverseStreams[this._streams[stream.id] ? this._streams[stream.id].id : stream.id];
    delete this._streams[stream.id];
  };

  window.RTCPeerConnection.prototype.addTrack = function addTrack(track, stream) {
    var _this13 = this;

    if (this.signalingState === 'closed') {
      throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
    }

    var streams = [].slice.call(arguments, 1);

    if (streams.length !== 1 || !streams[0].getTracks().find(function (t) {
      return t === track;
    })) {
      // this is not fully correct but all we can manage without
      // [[associated MediaStreams]] internal slot.
      throw new DOMException('The adapter.js addTrack polyfill only supports a single ' + ' stream which is associated with the specified track.', 'NotSupportedError');
    }

    var alreadyExists = this.getSenders().find(function (s) {
      return s.track === track;
    });

    if (alreadyExists) {
      throw new DOMException('Track already exists.', 'InvalidAccessError');
    }

    this._streams = this._streams || {};
    this._reverseStreams = this._reverseStreams || {};
    var oldStream = this._streams[stream.id];

    if (oldStream) {
      // this is using odd Chrome behaviour, use with caution:
      // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
      // Note: we rely on the high-level addTrack/dtmf shim to
      // create the sender with a dtmf sender.
      oldStream.addTrack(track); // Trigger ONN async.

      Promise.resolve().then(function () {
        _this13.dispatchEvent(new Event('negotiationneeded'));
      });
    } else {
      var newStream = new window.MediaStream([track]);
      this._streams[stream.id] = newStream;
      this._reverseStreams[newStream.id] = stream;
      this.addStream(newStream);
    }

    return this.getSenders().find(function (s) {
      return s.track === track;
    });
  }; // replace the internal stream id with the external one and
  // vice versa.


  function replaceInternalStreamId(pc, description) {
    var sdp = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach(function (internalId) {
      var externalStream = pc._reverseStreams[internalId];
      var internalStream = pc._streams[externalStream.id];
      sdp = sdp.replace(new RegExp(internalStream.id, 'g'), externalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp: sdp
    });
  }

  function replaceExternalStreamId(pc, description) {
    var sdp = description.sdp;
    Object.keys(pc._reverseStreams || []).forEach(function (internalId) {
      var externalStream = pc._reverseStreams[internalId];
      var internalStream = pc._streams[externalStream.id];
      sdp = sdp.replace(new RegExp(externalStream.id, 'g'), internalStream.id);
    });
    return new RTCSessionDescription({
      type: description.type,
      sdp: sdp
    });
  }

  ['createOffer', 'createAnswer'].forEach(function (method) {
    var nativeMethod = window.RTCPeerConnection.prototype[method];

    var methodObj = _defineProperty({}, method, function () {
      var _this14 = this;

      var args = arguments;
      var isLegacyCall = arguments.length && typeof arguments[0] === 'function';

      if (isLegacyCall) {
        return nativeMethod.apply(this, [function (description) {
          var desc = replaceInternalStreamId(_this14, description);
          args[0].apply(null, [desc]);
        }, function (err) {
          if (args[1]) {
            args[1].apply(null, err);
          }
        }, arguments[2]]);
      }

      return nativeMethod.apply(this, arguments).then(function (description) {
        return replaceInternalStreamId(_this14, description);
      });
    });

    window.RTCPeerConnection.prototype[method] = methodObj[method];
  });
  var origSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;

  window.RTCPeerConnection.prototype.setLocalDescription = function setLocalDescription() {
    if (!arguments.length || !arguments[0].type) {
      return origSetLocalDescription.apply(this, arguments);
    }

    arguments[0] = replaceExternalStreamId(this, arguments[0]);
    return origSetLocalDescription.apply(this, arguments);
  }; // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier


  var origLocalDescription = Object.getOwnPropertyDescriptor(window.RTCPeerConnection.prototype, 'localDescription');
  Object.defineProperty(window.RTCPeerConnection.prototype, 'localDescription', {
    get: function get() {
      var description = origLocalDescription.get.apply(this);

      if (description.type === '') {
        return description;
      }

      return replaceInternalStreamId(this, description);
    }
  });

  window.RTCPeerConnection.prototype.removeTrack = function removeTrack(sender) {
    var _this15 = this;

    if (this.signalingState === 'closed') {
      throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
    } // We can not yet check for sender instanceof RTCRtpSender
    // since we shim RTPSender. So we check if sender._pc is set.


    if (!sender._pc) {
      throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' + 'does not implement interface RTCRtpSender.', 'TypeError');
    }

    var isLocal = sender._pc === this;

    if (!isLocal) {
      throw new DOMException('Sender was not created by this connection.', 'InvalidAccessError');
    } // Search for the native stream the senders track belongs to.


    this._streams = this._streams || {};
    var stream = void 0;
    Object.keys(this._streams).forEach(function (streamid) {
      var hasTrack = _this15._streams[streamid].getTracks().find(function (track) {
        return sender.track === track;
      });

      if (hasTrack) {
        stream = _this15._streams[streamid];
      }
    });

    if (stream) {
      if (stream.getTracks().length === 1) {
        // if this is the last track of the stream, remove the stream. This
        // takes care of any shimmed _senders.
        this.removeStream(this._reverseStreams[stream.id]);
      } else {
        // relying on the same odd chrome behaviour as above.
        stream.removeTrack(sender.track);
      }

      this.dispatchEvent(new Event('negotiationneeded'));
    }
  };
}

function shimPeerConnection(window) {
  var browserDetails = utils.detectBrowser(window);

  if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
    // very basic support for old versions.
    window.RTCPeerConnection = window.webkitRTCPeerConnection;
  }

  if (!window.RTCPeerConnection) {
    return;
  }

  var addIceCandidateNullSupported = window.RTCPeerConnection.prototype.addIceCandidate.length === 0; // shim implicit creation of RTCSessionDescription/RTCIceCandidate

  if (browserDetails.version < 53) {
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
      var nativeMethod = window.RTCPeerConnection.prototype[method];

      var methodObj = _defineProperty({}, method, function () {
        arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
        return nativeMethod.apply(this, arguments);
      });

      window.RTCPeerConnection.prototype[method] = methodObj[method];
    });
  } // support for addIceCandidate(null or undefined)


  var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;

  window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
    if (!addIceCandidateNullSupported && !arguments[0]) {
      if (arguments[1]) {
        arguments[1].apply(null);
      }

      return Promise.resolve();
    } // Firefox 68+ emits and processes {candidate: "", ...}, ignore
    // in older versions. Native support planned for Chrome M77.


    if (browserDetails.version < 78 && arguments[0] && arguments[0].candidate === '') {
      return Promise.resolve();
    }

    return nativeAddIceCandidate.apply(this, arguments);
  };
} // Attempt to fix ONN in plan-b mode.


function fixNegotiationNeeded(window) {
  var browserDetails = utils.detectBrowser(window);
  utils.wrapPeerConnectionEvent(window, 'negotiationneeded', function (e) {
    var pc = e.target;

    if (browserDetails.version < 72 || pc.getConfiguration && pc.getConfiguration().sdpSemantics === 'plan-b') {
      if (pc.signalingState !== 'stable') {
        return;
      }
    }

    return e;
  });
}

},{"../utils.js":25,"./getdisplaymedia":14,"./getusermedia":15}],14:[function(require,module,exports){
/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shimGetDisplayMedia = shimGetDisplayMedia;

function shimGetDisplayMedia(window, getSourceId) {
  if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }

  if (!window.navigator.mediaDevices) {
    return;
  } // getSourceId is a function that returns a promise resolving with
  // the sourceId of the screen/window/tab to be shared.


  if (typeof getSourceId !== 'function') {
    console.error('shimGetDisplayMedia: getSourceId argument is not ' + 'a function');
    return;
  }

  window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
    return getSourceId(constraints).then(function (sourceId) {
      var widthSpecified = constraints.video && constraints.video.width;
      var heightSpecified = constraints.video && constraints.video.height;
      var frameRateSpecified = constraints.video && constraints.video.frameRate;
      constraints.video = {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sourceId,
          maxFrameRate: frameRateSpecified || 3
        }
      };

      if (widthSpecified) {
        constraints.video.mandatory.maxWidth = widthSpecified;
      }

      if (heightSpecified) {
        constraints.video.mandatory.maxHeight = heightSpecified;
      }

      return window.navigator.mediaDevices.getUserMedia(constraints);
    });
  };
}

},{}],15:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

exports.shimGetUserMedia = shimGetUserMedia;

var _utils = require('../utils.js');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

var logging = utils.log;

function shimGetUserMedia(window) {
  var navigator = window && window.navigator;

  if (!navigator.mediaDevices) {
    return;
  }

  var browserDetails = utils.detectBrowser(window);

  var constraintsToChrome_ = function constraintsToChrome_(c) {
    if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) !== 'object' || c.mandatory || c.optional) {
      return c;
    }

    var cc = {};
    Object.keys(c).forEach(function (key) {
      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
        return;
      }

      var r = _typeof(c[key]) === 'object' ? c[key] : {
        ideal: c[key]
      };

      if (r.exact !== undefined && typeof r.exact === 'number') {
        r.min = r.max = r.exact;
      }

      var oldname_ = function oldname_(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }

        return name === 'deviceId' ? 'sourceId' : name;
      };

      if (r.ideal !== undefined) {
        cc.optional = cc.optional || [];
        var oc = {};

        if (typeof r.ideal === 'number') {
          oc[oldname_('min', key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_('max', key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_('', key)] = r.ideal;
          cc.optional.push(oc);
        }
      }

      if (r.exact !== undefined && typeof r.exact !== 'number') {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_('', key)] = r.exact;
      } else {
        ['min', 'max'].forEach(function (mix) {
          if (r[mix] !== undefined) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });

    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }

    return cc;
  };

  var shimConstraints_ = function shimConstraints_(constraints, func) {
    if (browserDetails.version >= 61) {
      return func(constraints);
    }

    constraints = JSON.parse(JSON.stringify(constraints));

    if (constraints && _typeof(constraints.audio) === 'object') {
      var remap = function remap(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };

      constraints = JSON.parse(JSON.stringify(constraints));
      remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
      remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
      constraints.audio = constraintsToChrome_(constraints.audio);
    }

    if (constraints && _typeof(constraints.video) === 'object') {
      // Shim facingMode for mobile & surface pro.
      var face = constraints.video.facingMode;
      face = face && ((typeof face === 'undefined' ? 'undefined' : _typeof(face)) === 'object' ? face : {
        ideal: face
      });
      var getSupportedFacingModeLies = browserDetails.version < 66;

      if (face && (face.exact === 'user' || face.exact === 'environment' || face.ideal === 'user' || face.ideal === 'environment') && !(navigator.mediaDevices.getSupportedConstraints && navigator.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
        delete constraints.video.facingMode;
        var matches = void 0;

        if (face.exact === 'environment' || face.ideal === 'environment') {
          matches = ['back', 'rear'];
        } else if (face.exact === 'user' || face.ideal === 'user') {
          matches = ['front'];
        }

        if (matches) {
          // Look for matches in label, or use last cam for back (typical).
          return navigator.mediaDevices.enumerateDevices().then(function (devices) {
            devices = devices.filter(function (d) {
              return d.kind === 'videoinput';
            });
            var dev = devices.find(function (d) {
              return matches.some(function (match) {
                return d.label.toLowerCase().includes(match);
              });
            });

            if (!dev && devices.length && matches.includes('back')) {
              dev = devices[devices.length - 1]; // more likely the back cam
            }

            if (dev) {
              constraints.video.deviceId = face.exact ? {
                exact: dev.deviceId
              } : {
                ideal: dev.deviceId
              };
            }

            constraints.video = constraintsToChrome_(constraints.video);
            logging('chrome: ' + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }

      constraints.video = constraintsToChrome_(constraints.video);
    }

    logging('chrome: ' + JSON.stringify(constraints));
    return func(constraints);
  };

  var shimError_ = function shimError_(e) {
    if (browserDetails.version >= 64) {
      return e;
    }

    return {
      name: {
        PermissionDeniedError: 'NotAllowedError',
        PermissionDismissedError: 'NotAllowedError',
        InvalidStateError: 'NotAllowedError',
        DevicesNotFoundError: 'NotFoundError',
        ConstraintNotSatisfiedError: 'OverconstrainedError',
        TrackStartError: 'NotReadableError',
        MediaDeviceFailedDueToShutdown: 'NotAllowedError',
        MediaDeviceKillSwitchOn: 'NotAllowedError',
        TabCaptureError: 'AbortError',
        ScreenCaptureError: 'AbortError',
        DeviceCaptureError: 'AbortError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraint || e.constraintName,
      toString: function toString() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
    shimConstraints_(constraints, function (c) {
      navigator.webkitGetUserMedia(c, onSuccess, function (e) {
        if (onError) {
          onError(shimError_(e));
        }
      });
    });
  };

  navigator.getUserMedia = getUserMedia_.bind(navigator); // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
  // function which returns a Promise, it does not accept spec-style
  // constraints.

  if (navigator.mediaDevices.getUserMedia) {
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

    navigator.mediaDevices.getUserMedia = function (cs) {
      return shimConstraints_(cs, function (c) {
        return origGetUserMedia(c).then(function (stream) {
          if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
            stream.getTracks().forEach(function (track) {
              track.stop();
            });
            throw new DOMException('', 'NotFoundError');
          }

          return stream;
        }, function (e) {
          return Promise.reject(shimError_(e));
        });
      });
    };
  }
}

},{"../utils.js":25}],16:[function(require,module,exports){
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

exports.shimRTCIceCandidate = shimRTCIceCandidate;
exports.shimMaxMessageSize = shimMaxMessageSize;
exports.shimSendThrowTypeError = shimSendThrowTypeError;
exports.shimConnectionState = shimConnectionState;
exports.removeAllowExtmapMixed = removeAllowExtmapMixed;

var _sdp = require('sdp');

var _sdp2 = _interopRequireDefault(_sdp);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function shimRTCIceCandidate(window) {
  // foundation is arbitrarily chosen as an indicator for full support for
  // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
  if (!window.RTCIceCandidate || window.RTCIceCandidate && 'foundation' in window.RTCIceCandidate.prototype) {
    return;
  }

  var NativeRTCIceCandidate = window.RTCIceCandidate;

  window.RTCIceCandidate = function RTCIceCandidate(args) {
    // Remove the a= which shouldn't be part of the candidate string.
    if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object' && args.candidate && args.candidate.indexOf('a=') === 0) {
      args = JSON.parse(JSON.stringify(args));
      args.candidate = args.candidate.substr(2);
    }

    if (args.candidate && args.candidate.length) {
      // Augment the native candidate with the parsed fields.
      var nativeCandidate = new NativeRTCIceCandidate(args);

      var parsedCandidate = _sdp2["default"].parseCandidate(args.candidate);

      var augmentedCandidate = Object.assign(nativeCandidate, parsedCandidate); // Add a serializer that does not serialize the extra attributes.

      augmentedCandidate.toJSON = function toJSON() {
        return {
          candidate: augmentedCandidate.candidate,
          sdpMid: augmentedCandidate.sdpMid,
          sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
          usernameFragment: augmentedCandidate.usernameFragment
        };
      };

      return augmentedCandidate;
    }

    return new NativeRTCIceCandidate(args);
  };

  window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype; // Hook up the augmented candidate in onicecandidate and
  // addEventListener('icecandidate', ...)

  utils.wrapPeerConnectionEvent(window, 'icecandidate', function (e) {
    if (e.candidate) {
      Object.defineProperty(e, 'candidate', {
        value: new window.RTCIceCandidate(e.candidate),
        writable: 'false'
      });
    }

    return e;
  });
}

function shimMaxMessageSize(window) {
  if (!window.RTCPeerConnection) {
    return;
  }

  var browserDetails = utils.detectBrowser(window);

  if (!('sctp' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
      get: function get() {
        return typeof this._sctp === 'undefined' ? null : this._sctp;
      }
    });
  }

  var sctpInDescription = function sctpInDescription(description) {
    if (!description || !description.sdp) {
      return false;
    }

    var sections = _sdp2["default"].splitSections(description.sdp);

    sections.shift();
    return sections.some(function (mediaSection) {
      var mLine = _sdp2["default"].parseMLine(mediaSection);

      return mLine && mLine.kind === 'application' && mLine.protocol.indexOf('SCTP') !== -1;
    });
  };

  var getRemoteFirefoxVersion = function getRemoteFirefoxVersion(description) {
    // TODO: Is there a better solution for detecting Firefox?
    var match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);

    if (match === null || match.length < 2) {
      return -1;
    }

    var version = parseInt(match[1], 10); // Test for NaN (yes, this is ugly)

    return version !== version ? -1 : version;
  };

  var getCanSendMaxMessageSize = function getCanSendMaxMessageSize(remoteIsFirefox) {
    // Every implementation we know can send at least 64 KiB.
    // Note: Although Chrome is technically able to send up to 256 KiB, the
    //       data does not reach the other peer reliably.
    //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
    var canSendMaxMessageSize = 65536;

    if (browserDetails.browser === 'firefox') {
      if (browserDetails.version < 57) {
        if (remoteIsFirefox === -1) {
          // FF < 57 will send in 16 KiB chunks using the deprecated PPID
          // fragmentation.
          canSendMaxMessageSize = 16384;
        } else {
          // However, other FF (and RAWRTC) can reassemble PPID-fragmented
          // messages. Thus, supporting ~2 GiB when sending.
          canSendMaxMessageSize = 2147483637;
        }
      } else if (browserDetails.version < 60) {
        // Currently, all FF >= 57 will reset the remote maximum message size
        // to the default value when a data channel is created at a later
        // stage. :(
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
        canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
      } else {
        // FF >= 60 supports sending ~2 GiB
        canSendMaxMessageSize = 2147483637;
      }
    }

    return canSendMaxMessageSize;
  };

  var getMaxMessageSize = function getMaxMessageSize(description, remoteIsFirefox) {
    // Note: 65536 bytes is the default value from the SDP spec. Also,
    //       every implementation we know supports receiving 65536 bytes.
    var maxMessageSize = 65536; // FF 57 has a slightly incorrect default remote max message size, so
    // we need to adjust it here to avoid a failure when sending.
    // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697

    if (browserDetails.browser === 'firefox' && browserDetails.version === 57) {
      maxMessageSize = 65535;
    }

    var match = _sdp2["default"].matchPrefix(description.sdp, 'a=max-message-size:');

    if (match.length > 0) {
      maxMessageSize = parseInt(match[0].substr(19), 10);
    } else if (browserDetails.browser === 'firefox' && remoteIsFirefox !== -1) {
      // If the maximum message size is not present in the remote SDP and
      // both local and remote are Firefox, the remote peer can receive
      // ~2 GiB.
      maxMessageSize = 2147483637;
    }

    return maxMessageSize;
  };

  var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;

  window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
    this._sctp = null; // Chrome decided to not expose .sctp in plan-b mode.
    // As usual, adapter.js has to do an 'ugly worakaround'
    // to cover up the mess.

    if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
      var _getConfiguration = this.getConfiguration(),
          sdpSemantics = _getConfiguration.sdpSemantics;

      if (sdpSemantics === 'plan-b') {
        Object.defineProperty(this, 'sctp', {
          get: function get() {
            return typeof this._sctp === 'undefined' ? null : this._sctp;
          },
          enumerable: true,
          configurable: true
        });
      }
    }

    if (sctpInDescription(arguments[0])) {
      // Check if the remote is FF.
      var isFirefox = getRemoteFirefoxVersion(arguments[0]); // Get the maximum message size the local peer is capable of sending

      var canSendMMS = getCanSendMaxMessageSize(isFirefox); // Get the maximum message size of the remote peer.

      var remoteMMS = getMaxMessageSize(arguments[0], isFirefox); // Determine final maximum message size

      var maxMessageSize = void 0;

      if (canSendMMS === 0 && remoteMMS === 0) {
        maxMessageSize = Number.POSITIVE_INFINITY;
      } else if (canSendMMS === 0 || remoteMMS === 0) {
        maxMessageSize = Math.max(canSendMMS, remoteMMS);
      } else {
        maxMessageSize = Math.min(canSendMMS, remoteMMS);
      } // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
      // attribute.


      var sctp = {};
      Object.defineProperty(sctp, 'maxMessageSize', {
        get: function get() {
          return maxMessageSize;
        }
      });
      this._sctp = sctp;
    }

    return origSetRemoteDescription.apply(this, arguments);
  };
}

function shimSendThrowTypeError(window) {
  if (!(window.RTCPeerConnection && 'createDataChannel' in window.RTCPeerConnection.prototype)) {
    return;
  } // Note: Although Firefox >= 57 has a native implementation, the maximum
  //       message size can be reset for all data channels at a later stage.
  //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831


  function wrapDcSend(dc, pc) {
    var origDataChannelSend = dc.send;

    dc.send = function send() {
      var data = arguments[0];
      var length = data.length || data.size || data.byteLength;

      if (dc.readyState === 'open' && pc.sctp && length > pc.sctp.maxMessageSize) {
        throw new TypeError('Message too large (can send a maximum of ' + pc.sctp.maxMessageSize + ' bytes)');
      }

      return origDataChannelSend.apply(dc, arguments);
    };
  }

  var origCreateDataChannel = window.RTCPeerConnection.prototype.createDataChannel;

  window.RTCPeerConnection.prototype.createDataChannel = function createDataChannel() {
    var dataChannel = origCreateDataChannel.apply(this, arguments);
    wrapDcSend(dataChannel, this);
    return dataChannel;
  };

  utils.wrapPeerConnectionEvent(window, 'datachannel', function (e) {
    wrapDcSend(e.channel, e.target);
    return e;
  });
}
/* shims RTCConnectionState by pretending it is the same as iceConnectionState.
 * See https://bugs.chromium.org/p/webrtc/issues/detail?id=6145#c12
 * for why this is a valid hack in Chrome. In Firefox it is slightly incorrect
 * since DTLS failures would be hidden. See
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1265827
 * for the Firefox tracking bug.
 */


function shimConnectionState(window) {
  if (!window.RTCPeerConnection || 'connectionState' in window.RTCPeerConnection.prototype) {
    return;
  }

  var proto = window.RTCPeerConnection.prototype;
  Object.defineProperty(proto, 'connectionState', {
    get: function get() {
      return {
        completed: 'connected',
        checking: 'connecting'
      }[this.iceConnectionState] || this.iceConnectionState;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(proto, 'onconnectionstatechange', {
    get: function get() {
      return this._onconnectionstatechange || null;
    },
    set: function set(cb) {
      if (this._onconnectionstatechange) {
        this.removeEventListener('connectionstatechange', this._onconnectionstatechange);
        delete this._onconnectionstatechange;
      }

      if (cb) {
        this.addEventListener('connectionstatechange', this._onconnectionstatechange = cb);
      }
    },
    enumerable: true,
    configurable: true
  });
  ['setLocalDescription', 'setRemoteDescription'].forEach(function (method) {
    var origMethod = proto[method];

    proto[method] = function () {
      if (!this._connectionstatechangepoly) {
        this._connectionstatechangepoly = function (e) {
          var pc = e.target;

          if (pc._lastConnectionState !== pc.connectionState) {
            pc._lastConnectionState = pc.connectionState;
            var newEvent = new Event('connectionstatechange', e);
            pc.dispatchEvent(newEvent);
          }

          return e;
        };

        this.addEventListener('iceconnectionstatechange', this._connectionstatechangepoly);
      }

      return origMethod.apply(this, arguments);
    };
  });
}

function removeAllowExtmapMixed(window) {
  /* remove a=extmap-allow-mixed for webrtc.org < M71 */
  if (!window.RTCPeerConnection) {
    return;
  }

  var browserDetails = utils.detectBrowser(window);

  if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
    return;
  }

  if (browserDetails.browser === 'safari' && browserDetails.version >= 605) {
    return;
  }

  var nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;

  window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription(desc) {
    if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
      desc.sdp = desc.sdp.split('\n').filter(function (line) {
        return line.trim() !== 'a=extmap-allow-mixed';
      }).join('\n');
    }

    return nativeSRD.apply(this, arguments);
  };
}

},{"./utils":25,"sdp":6}],17:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;

var _getusermedia = require('./getusermedia');

Object.defineProperty(exports, 'shimGetUserMedia', {
  enumerable: true,
  get: function get() {
    return _getusermedia.shimGetUserMedia;
  }
});

var _getdisplaymedia = require('./getdisplaymedia');

Object.defineProperty(exports, 'shimGetDisplayMedia', {
  enumerable: true,
  get: function get() {
    return _getdisplaymedia.shimGetDisplayMedia;
  }
});
exports.shimPeerConnection = shimPeerConnection;
exports.shimReplaceTrack = shimReplaceTrack;

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

var _filtericeservers = require('./filtericeservers');

var _rtcpeerconnectionShim = require('rtcpeerconnection-shim');

var _rtcpeerconnectionShim2 = _interopRequireDefault(_rtcpeerconnectionShim);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

function shimPeerConnection(window) {
  var browserDetails = utils.detectBrowser(window);

  if (window.RTCIceGatherer) {
    if (!window.RTCIceCandidate) {
      window.RTCIceCandidate = function RTCIceCandidate(args) {
        return args;
      };
    }

    if (!window.RTCSessionDescription) {
      window.RTCSessionDescription = function RTCSessionDescription(args) {
        return args;
      };
    } // this adds an additional event listener to MediaStrackTrack that signals
    // when a tracks enabled property was changed. Workaround for a bug in
    // addStream, see below. No longer required in 15025+


    if (browserDetails.version < 15025) {
      var origMSTEnabled = Object.getOwnPropertyDescriptor(window.MediaStreamTrack.prototype, 'enabled');
      Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
        set: function set(value) {
          origMSTEnabled.set.call(this, value);
          var ev = new Event('enabled');
          ev.enabled = value;
          this.dispatchEvent(ev);
        }
      });
    }
  } // ORTC defines the DTMF sender a bit different.
  // https://github.com/w3c/ortc/issues/714


  if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
    Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
      get: function get() {
        if (this._dtmf === undefined) {
          if (this.track.kind === 'audio') {
            this._dtmf = new window.RTCDtmfSender(this);
          } else if (this.track.kind === 'video') {
            this._dtmf = null;
          }
        }

        return this._dtmf;
      }
    });
  } // Edge currently only implements the RTCDtmfSender, not the
  // RTCDTMFSender alias. See http://draft.ortc.org/#rtcdtmfsender2*


  if (window.RTCDtmfSender && !window.RTCDTMFSender) {
    window.RTCDTMFSender = window.RTCDtmfSender;
  }

  var RTCPeerConnectionShim = (0, _rtcpeerconnectionShim2["default"])(window, browserDetails.version);

  window.RTCPeerConnection = function RTCPeerConnection(config) {
    if (config && config.iceServers) {
      config.iceServers = (0, _filtericeservers.filterIceServers)(config.iceServers, browserDetails.version);
      utils.log('ICE servers after filtering:', config.iceServers);
    }

    return new RTCPeerConnectionShim(config);
  };

  window.RTCPeerConnection.prototype = RTCPeerConnectionShim.prototype;
}

function shimReplaceTrack(window) {
  // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
  if (window.RTCRtpSender && !('replaceTrack' in window.RTCRtpSender.prototype)) {
    window.RTCRtpSender.prototype.replaceTrack = window.RTCRtpSender.prototype.setTrack;
  }
}

},{"../utils":25,"./filtericeservers":18,"./getdisplaymedia":19,"./getusermedia":20,"rtcpeerconnection-shim":5}],18:[function(require,module,exports){
/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterIceServers = filterIceServers;

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
} // Edge does not like
// 1) stun: filtered after 14393 unless ?transport=udp is present
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times


function filterIceServers(iceServers, edgeVersion) {
  var hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(function (server) {
    if (server && (server.urls || server.url)) {
      var urls = server.urls || server.url;

      if (server.url && !server.urls) {
        utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
      }

      var isString = typeof urls === 'string';

      if (isString) {
        urls = [urls];
      }

      urls = urls.filter(function (url) {
        // filter STUN unconditionally.
        if (url.indexOf('stun:') === 0) {
          return false;
        }

        var validTurn = url.startsWith('turn') && !url.startsWith('turn:[') && url.includes('transport=udp');

        if (validTurn && !hasTurn) {
          hasTurn = true;
          return true;
        }

        return validTurn && !hasTurn;
      });
      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
  });
}

},{"../utils":25}],19:[function(require,module,exports){
/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shimGetDisplayMedia = shimGetDisplayMedia;

function shimGetDisplayMedia(window) {
  if (!('getDisplayMedia' in window.navigator)) {
    return;
  }

  if (!window.navigator.mediaDevices) {
    return;
  }

  if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }

  window.navigator.mediaDevices.getDisplayMedia = window.navigator.getDisplayMedia.bind(window.navigator);
}

},{}],20:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shimGetUserMedia = shimGetUserMedia;

function shimGetUserMedia(window) {
  var navigator = window && window.navigator;

  var shimError_ = function shimError_(e) {
    return {
      name: {
        PermissionDeniedError: 'NotAllowedError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraint,
      toString: function toString() {
        return this.name;
      }
    };
  }; // getUserMedia error shim.


  var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

  navigator.mediaDevices.getUserMedia = function (c) {
    return origGetUserMedia(c)["catch"](function (e) {
      return Promise.reject(shimError_(e));
    });
  };
}

},{}],21:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shimGetDisplayMedia = exports.shimGetUserMedia = undefined;

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

var _getusermedia = require('./getusermedia');

Object.defineProperty(exports, 'shimGetUserMedia', {
  enumerable: true,
  get: function get() {
    return _getusermedia.shimGetUserMedia;
  }
});

var _getdisplaymedia = require('./getdisplaymedia');

Object.defineProperty(exports, 'shimGetDisplayMedia', {
  enumerable: true,
  get: function get() {
    return _getdisplaymedia.shimGetDisplayMedia;
  }
});
exports.shimOnTrack = shimOnTrack;
exports.shimPeerConnection = shimPeerConnection;
exports.shimSenderGetStats = shimSenderGetStats;
exports.shimReceiverGetStats = shimReceiverGetStats;
exports.shimRemoveStream = shimRemoveStream;
exports.shimRTCDataChannel = shimRTCDataChannel;
exports.shimAddTransceiver = shimAddTransceiver;
exports.shimGetParameters = shimGetParameters;
exports.shimCreateOffer = shimCreateOffer;
exports.shimCreateAnswer = shimCreateAnswer;

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function shimOnTrack(window) {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
      get: function get() {
        return {
          receiver: this.receiver
        };
      }
    });
  }
}

function shimPeerConnection(window) {
  var browserDetails = utils.detectBrowser(window);

  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
    return; // probably media.peerconnection.enabled=false in about:config
  }

  if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
    // very basic support for old versions.
    window.RTCPeerConnection = window.mozRTCPeerConnection;
  }

  if (browserDetails.version < 53) {
    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
      var nativeMethod = window.RTCPeerConnection.prototype[method];

      var methodObj = _defineProperty({}, method, function () {
        arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
        return nativeMethod.apply(this, arguments);
      });

      window.RTCPeerConnection.prototype[method] = methodObj[method];
    });
  } // support for addIceCandidate(null or undefined)
  // as well as ignoring {sdpMid, candidate: ""}


  if (browserDetails.version < 68) {
    var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;

    window.RTCPeerConnection.prototype.addIceCandidate = function addIceCandidate() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }

        return Promise.resolve();
      } // Firefox 68+ emits and processes {candidate: "", ...}, ignore
      // in older versions.


      if (arguments[0] && arguments[0].candidate === '') {
        return Promise.resolve();
      }

      return nativeAddIceCandidate.apply(this, arguments);
    };
  }

  var modernStatsTypes = {
    inboundrtp: 'inbound-rtp',
    outboundrtp: 'outbound-rtp',
    candidatepair: 'candidate-pair',
    localcandidate: 'local-candidate',
    remotecandidate: 'remote-candidate'
  };
  var nativeGetStats = window.RTCPeerConnection.prototype.getStats;

  window.RTCPeerConnection.prototype.getStats = function getStats() {
    var _arguments = Array.prototype.slice.call(arguments),
        selector = _arguments[0],
        onSucc = _arguments[1],
        onErr = _arguments[2];

    return nativeGetStats.apply(this, [selector || null]).then(function (stats) {
      if (browserDetails.version < 53 && !onSucc) {
        // Shim only promise getStats with spec-hyphens in type names
        // Leave callback version alone; misc old uses of forEach before Map
        try {
          stats.forEach(function (stat) {
            stat.type = modernStatsTypes[stat.type] || stat.type;
          });
        } catch (e) {
          if (e.name !== 'TypeError') {
            throw e;
          } // Avoid TypeError: "type" is read-only, in old versions. 34-43ish


          stats.forEach(function (stat, i) {
            stats.set(i, Object.assign({}, stat, {
              type: modernStatsTypes[stat.type] || stat.type
            }));
          });
        }
      }

      return stats;
    }).then(onSucc, onErr);
  };
}

function shimSenderGetStats(window) {
  if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
    return;
  }

  if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
    return;
  }

  var origGetSenders = window.RTCPeerConnection.prototype.getSenders;

  if (origGetSenders) {
    window.RTCPeerConnection.prototype.getSenders = function getSenders() {
      var _this = this;

      var senders = origGetSenders.apply(this, []);
      senders.forEach(function (sender) {
        return sender._pc = _this;
      });
      return senders;
    };
  }

  var origAddTrack = window.RTCPeerConnection.prototype.addTrack;

  if (origAddTrack) {
    window.RTCPeerConnection.prototype.addTrack = function addTrack() {
      var sender = origAddTrack.apply(this, arguments);
      sender._pc = this;
      return sender;
    };
  }

  window.RTCRtpSender.prototype.getStats = function getStats() {
    return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map());
  };
}

function shimReceiverGetStats(window) {
  if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
    return;
  }

  if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
    return;
  }

  var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;

  if (origGetReceivers) {
    window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
      var _this2 = this;

      var receivers = origGetReceivers.apply(this, []);
      receivers.forEach(function (receiver) {
        return receiver._pc = _this2;
      });
      return receivers;
    };
  }

  utils.wrapPeerConnectionEvent(window, 'track', function (e) {
    e.receiver._pc = e.srcElement;
    return e;
  });

  window.RTCRtpReceiver.prototype.getStats = function getStats() {
    return this._pc.getStats(this.track);
  };
}

function shimRemoveStream(window) {
  if (!window.RTCPeerConnection || 'removeStream' in window.RTCPeerConnection.prototype) {
    return;
  }

  window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
    var _this3 = this;

    utils.deprecated('removeStream', 'removeTrack');
    this.getSenders().forEach(function (sender) {
      if (sender.track && stream.getTracks().includes(sender.track)) {
        _this3.removeTrack(sender);
      }
    });
  };
}

function shimRTCDataChannel(window) {
  // rename DataChannel to RTCDataChannel (native fix in FF60):
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
  if (window.DataChannel && !window.RTCDataChannel) {
    window.RTCDataChannel = window.DataChannel;
  }
}

function shimAddTransceiver(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
    return;
  }

  var origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;

  if (origAddTransceiver) {
    window.RTCPeerConnection.prototype.addTransceiver = function addTransceiver() {
      this.setParametersPromises = [];
      var initParameters = arguments[1];
      var shouldPerformCheck = initParameters && 'sendEncodings' in initParameters;

      if (shouldPerformCheck) {
        // If sendEncodings params are provided, validate grammar
        initParameters.sendEncodings.forEach(function (encodingParam) {
          if ('rid' in encodingParam) {
            var ridRegex = /^[a-z0-9]{0,16}$/i;

            if (!ridRegex.test(encodingParam.rid)) {
              throw new TypeError('Invalid RID value provided.');
            }
          }

          if ('scaleResolutionDownBy' in encodingParam) {
            if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
              throw new RangeError('scale_resolution_down_by must be >= 1.0');
            }
          }

          if ('maxFramerate' in encodingParam) {
            if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
              throw new RangeError('max_framerate must be >= 0.0');
            }
          }
        });
      }

      var transceiver = origAddTransceiver.apply(this, arguments);

      if (shouldPerformCheck) {
        // Check if the init options were applied. If not we do this in an
        // asynchronous way and save the promise reference in a global object.
        // This is an ugly hack, but at the same time is way more robust than
        // checking the sender parameters before and after the createOffer
        // Also note that after the createoffer we are not 100% sure that
        // the params were asynchronously applied so we might miss the
        // opportunity to recreate offer.
        var sender = transceiver.sender;
        var params = sender.getParameters();

        if (!('encodings' in params) || // Avoid being fooled by patched getParameters() below.
        params.encodings.length === 1 && Object.keys(params.encodings[0]).length === 0) {
          params.encodings = initParameters.sendEncodings;
          sender.sendEncodings = initParameters.sendEncodings;
          this.setParametersPromises.push(sender.setParameters(params).then(function () {
            delete sender.sendEncodings;
          })["catch"](function () {
            delete sender.sendEncodings;
          }));
        }
      }

      return transceiver;
    };
  }
}

function shimGetParameters(window) {
  if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCRtpSender)) {
    return;
  }

  var origGetParameters = window.RTCRtpSender.prototype.getParameters;

  if (origGetParameters) {
    window.RTCRtpSender.prototype.getParameters = function getParameters() {
      var params = origGetParameters.apply(this, arguments);

      if (!('encodings' in params)) {
        params.encodings = [].concat(this.sendEncodings || [{}]);
      }

      return params;
    };
  }
}

function shimCreateOffer(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
    return;
  }

  var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;

  window.RTCPeerConnection.prototype.createOffer = function createOffer() {
    var _this4 = this,
        _arguments2 = arguments;

    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises).then(function () {
        return origCreateOffer.apply(_this4, _arguments2);
      })["finally"](function () {
        _this4.setParametersPromises = [];
      });
    }

    return origCreateOffer.apply(this, arguments);
  };
}

function shimCreateAnswer(window) {
  // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
  // Firefox ignores the init sendEncodings options passed to addTransceiver
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
  if (!((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCPeerConnection)) {
    return;
  }

  var origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;

  window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
    var _this5 = this,
        _arguments3 = arguments;

    if (this.setParametersPromises && this.setParametersPromises.length) {
      return Promise.all(this.setParametersPromises).then(function () {
        return origCreateAnswer.apply(_this5, _arguments3);
      })["finally"](function () {
        _this5.setParametersPromises = [];
      });
    }

    return origCreateAnswer.apply(this, arguments);
  };
}

},{"../utils":25,"./getdisplaymedia":22,"./getusermedia":23}],22:[function(require,module,exports){
/*
 *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shimGetDisplayMedia = shimGetDisplayMedia;

function shimGetDisplayMedia(window, preferredMediaSource) {
  if (window.navigator.mediaDevices && 'getDisplayMedia' in window.navigator.mediaDevices) {
    return;
  }

  if (!window.navigator.mediaDevices) {
    return;
  }

  window.navigator.mediaDevices.getDisplayMedia = function getDisplayMedia(constraints) {
    if (!(constraints && constraints.video)) {
      var err = new DOMException('getDisplayMedia without video ' + 'constraints is undefined');
      err.name = 'NotFoundError'; // from https://heycam.github.io/webidl/#idl-DOMException-error-names

      err.code = 8;
      return Promise.reject(err);
    }

    if (constraints.video === true) {
      constraints.video = {
        mediaSource: preferredMediaSource
      };
    } else {
      constraints.video.mediaSource = preferredMediaSource;
    }

    return window.navigator.mediaDevices.getUserMedia(constraints);
  };
}

},{}],23:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

exports.shimGetUserMedia = shimGetUserMedia;

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

function shimGetUserMedia(window) {
  var browserDetails = utils.detectBrowser(window);
  var navigator = window && window.navigator;
  var MediaStreamTrack = window && window.MediaStreamTrack;

  navigator.getUserMedia = function (constraints, onSuccess, onError) {
    // Replace Firefox 44+'s deprecation warning with unprefixed version.
    utils.deprecated('navigator.getUserMedia', 'navigator.mediaDevices.getUserMedia');
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };

  if (!(browserDetails.version > 55 && 'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
    var remap = function remap(obj, a, b) {
      if (a in obj && !(b in obj)) {
        obj[b] = obj[a];
        delete obj[a];
      }
    };

    var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

    navigator.mediaDevices.getUserMedia = function (c) {
      if ((typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object' && _typeof(c.audio) === 'object') {
        c = JSON.parse(JSON.stringify(c));
        remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
        remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
      }

      return nativeGetUserMedia(c);
    };

    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
      var nativeGetSettings = MediaStreamTrack.prototype.getSettings;

      MediaStreamTrack.prototype.getSettings = function () {
        var obj = nativeGetSettings.apply(this, arguments);
        remap(obj, 'mozAutoGainControl', 'autoGainControl');
        remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
        return obj;
      };
    }

    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
      var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;

      MediaStreamTrack.prototype.applyConstraints = function (c) {
        if (this.kind === 'audio' && (typeof c === 'undefined' ? 'undefined' : _typeof(c)) === 'object') {
          c = JSON.parse(JSON.stringify(c));
          remap(c, 'autoGainControl', 'mozAutoGainControl');
          remap(c, 'noiseSuppression', 'mozNoiseSuppression');
        }

        return nativeApplyConstraints.apply(this, [c]);
      };
    }
  }
}

},{"../utils":25}],24:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict';

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

exports.shimLocalStreamsAPI = shimLocalStreamsAPI;
exports.shimRemoteStreamsAPI = shimRemoteStreamsAPI;
exports.shimCallbacksAPI = shimCallbacksAPI;
exports.shimGetUserMedia = shimGetUserMedia;
exports.shimConstraints = shimConstraints;
exports.shimRTCIceServerUrls = shimRTCIceServerUrls;
exports.shimTrackEventTransceiver = shimTrackEventTransceiver;
exports.shimCreateOfferLegacy = shimCreateOfferLegacy;
exports.shimAudioContext = shimAudioContext;

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
}

function shimLocalStreamsAPI(window) {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
    return;
  }

  if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.getLocalStreams = function getLocalStreams() {
      if (!this._localStreams) {
        this._localStreams = [];
      }

      return this._localStreams;
    };
  }

  if (!('addStream' in window.RTCPeerConnection.prototype)) {
    var _addTrack = window.RTCPeerConnection.prototype.addTrack;

    window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
      var _this = this;

      if (!this._localStreams) {
        this._localStreams = [];
      }

      if (!this._localStreams.includes(stream)) {
        this._localStreams.push(stream);
      } // Try to emulate Chrome's behaviour of adding in audio-video order.
      // Safari orders by track id.


      stream.getAudioTracks().forEach(function (track) {
        return _addTrack.call(_this, track, stream);
      });
      stream.getVideoTracks().forEach(function (track) {
        return _addTrack.call(_this, track, stream);
      });
    };

    window.RTCPeerConnection.prototype.addTrack = function addTrack(track) {
      var _this2 = this;

      for (var _len = arguments.length, streams = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        streams[_key - 1] = arguments[_key];
      }

      if (streams) {
        streams.forEach(function (stream) {
          if (!_this2._localStreams) {
            _this2._localStreams = [stream];
          } else if (!_this2._localStreams.includes(stream)) {
            _this2._localStreams.push(stream);
          }
        });
      }

      return _addTrack.apply(this, arguments);
    };
  }

  if (!('removeStream' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.removeStream = function removeStream(stream) {
      var _this3 = this;

      if (!this._localStreams) {
        this._localStreams = [];
      }

      var index = this._localStreams.indexOf(stream);

      if (index === -1) {
        return;
      }

      this._localStreams.splice(index, 1);

      var tracks = stream.getTracks();
      this.getSenders().forEach(function (sender) {
        if (tracks.includes(sender.track)) {
          _this3.removeTrack(sender);
        }
      });
    };
  }
}

function shimRemoteStreamsAPI(window) {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
    return;
  }

  if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
    window.RTCPeerConnection.prototype.getRemoteStreams = function getRemoteStreams() {
      return this._remoteStreams ? this._remoteStreams : [];
    };
  }

  if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
    Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
      get: function get() {
        return this._onaddstream;
      },
      set: function set(f) {
        var _this4 = this;

        if (this._onaddstream) {
          this.removeEventListener('addstream', this._onaddstream);
          this.removeEventListener('track', this._onaddstreampoly);
        }

        this.addEventListener('addstream', this._onaddstream = f);
        this.addEventListener('track', this._onaddstreampoly = function (e) {
          e.streams.forEach(function (stream) {
            if (!_this4._remoteStreams) {
              _this4._remoteStreams = [];
            }

            if (_this4._remoteStreams.includes(stream)) {
              return;
            }

            _this4._remoteStreams.push(stream);

            var event = new Event('addstream');
            event.stream = stream;

            _this4.dispatchEvent(event);
          });
        });
      }
    });
    var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;

    window.RTCPeerConnection.prototype.setRemoteDescription = function setRemoteDescription() {
      var pc = this;

      if (!this._onaddstreampoly) {
        this.addEventListener('track', this._onaddstreampoly = function (e) {
          e.streams.forEach(function (stream) {
            if (!pc._remoteStreams) {
              pc._remoteStreams = [];
            }

            if (pc._remoteStreams.indexOf(stream) >= 0) {
              return;
            }

            pc._remoteStreams.push(stream);

            var event = new Event('addstream');
            event.stream = stream;
            pc.dispatchEvent(event);
          });
        });
      }

      return origSetRemoteDescription.apply(pc, arguments);
    };
  }
}

function shimCallbacksAPI(window) {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
    return;
  }

  var prototype = window.RTCPeerConnection.prototype;
  var origCreateOffer = prototype.createOffer;
  var origCreateAnswer = prototype.createAnswer;
  var setLocalDescription = prototype.setLocalDescription;
  var setRemoteDescription = prototype.setRemoteDescription;
  var addIceCandidate = prototype.addIceCandidate;

  prototype.createOffer = function createOffer(successCallback, failureCallback) {
    var options = arguments.length >= 2 ? arguments[2] : arguments[0];
    var promise = origCreateOffer.apply(this, [options]);

    if (!failureCallback) {
      return promise;
    }

    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };

  prototype.createAnswer = function createAnswer(successCallback, failureCallback) {
    var options = arguments.length >= 2 ? arguments[2] : arguments[0];
    var promise = origCreateAnswer.apply(this, [options]);

    if (!failureCallback) {
      return promise;
    }

    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };

  var withCallback = function withCallback(description, successCallback, failureCallback) {
    var promise = setLocalDescription.apply(this, [description]);

    if (!failureCallback) {
      return promise;
    }

    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };

  prototype.setLocalDescription = withCallback;

  withCallback = function withCallback(description, successCallback, failureCallback) {
    var promise = setRemoteDescription.apply(this, [description]);

    if (!failureCallback) {
      return promise;
    }

    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };

  prototype.setRemoteDescription = withCallback;

  withCallback = function withCallback(candidate, successCallback, failureCallback) {
    var promise = addIceCandidate.apply(this, [candidate]);

    if (!failureCallback) {
      return promise;
    }

    promise.then(successCallback, failureCallback);
    return Promise.resolve();
  };

  prototype.addIceCandidate = withCallback;
}

function shimGetUserMedia(window) {
  var navigator = window && window.navigator;

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // shim not needed in Safari 12.1
    var mediaDevices = navigator.mediaDevices;

    var _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);

    navigator.mediaDevices.getUserMedia = function (constraints) {
      return _getUserMedia(shimConstraints(constraints));
    };
  }

  if (!navigator.getUserMedia && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
      navigator.mediaDevices.getUserMedia(constraints).then(cb, errcb);
    }.bind(navigator);
  }
}

function shimConstraints(constraints) {
  if (constraints && constraints.video !== undefined) {
    return Object.assign({}, constraints, {
      video: utils.compactObject(constraints.video)
    });
  }

  return constraints;
}

function shimRTCIceServerUrls(window) {
  if (!window.RTCPeerConnection) {
    return;
  } // migrate from non-spec RTCIceServer.url to RTCIceServer.urls


  var OrigPeerConnection = window.RTCPeerConnection;

  window.RTCPeerConnection = function RTCPeerConnection(pcConfig, pcConstraints) {
    if (pcConfig && pcConfig.iceServers) {
      var newIceServers = [];

      for (var i = 0; i < pcConfig.iceServers.length; i++) {
        var server = pcConfig.iceServers[i];

        if (!server.hasOwnProperty('urls') && server.hasOwnProperty('url')) {
          utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
          server = JSON.parse(JSON.stringify(server));
          server.urls = server.url;
          delete server.url;
          newIceServers.push(server);
        } else {
          newIceServers.push(pcConfig.iceServers[i]);
        }
      }

      pcConfig.iceServers = newIceServers;
    }

    return new OrigPeerConnection(pcConfig, pcConstraints);
  };

  window.RTCPeerConnection.prototype = OrigPeerConnection.prototype; // wrap static methods. Currently just generateCertificate.

  if ('generateCertificate' in OrigPeerConnection) {
    Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
      get: function get() {
        return OrigPeerConnection.generateCertificate;
      }
    });
  }
}

function shimTrackEventTransceiver(window) {
  // Add event.transceiver member over deprecated event.receiver
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
    Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
      get: function get() {
        return {
          receiver: this.receiver
        };
      }
    });
  }
}

function shimCreateOfferLegacy(window) {
  var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;

  window.RTCPeerConnection.prototype.createOffer = function createOffer(offerOptions) {
    if (offerOptions) {
      if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
        // support bit values
        offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
      }

      var audioTransceiver = this.getTransceivers().find(function (transceiver) {
        return transceiver.receiver.track.kind === 'audio';
      });

      if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
        if (audioTransceiver.direction === 'sendrecv') {
          if (audioTransceiver.setDirection) {
            audioTransceiver.setDirection('sendonly');
          } else {
            audioTransceiver.direction = 'sendonly';
          }
        } else if (audioTransceiver.direction === 'recvonly') {
          if (audioTransceiver.setDirection) {
            audioTransceiver.setDirection('inactive');
          } else {
            audioTransceiver.direction = 'inactive';
          }
        }
      } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
        this.addTransceiver('audio');
      }

      if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
        // support bit values
        offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
      }

      var videoTransceiver = this.getTransceivers().find(function (transceiver) {
        return transceiver.receiver.track.kind === 'video';
      });

      if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
        if (videoTransceiver.direction === 'sendrecv') {
          if (videoTransceiver.setDirection) {
            videoTransceiver.setDirection('sendonly');
          } else {
            videoTransceiver.direction = 'sendonly';
          }
        } else if (videoTransceiver.direction === 'recvonly') {
          if (videoTransceiver.setDirection) {
            videoTransceiver.setDirection('inactive');
          } else {
            videoTransceiver.direction = 'inactive';
          }
        }
      } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
        this.addTransceiver('video');
      }
    }

    return origCreateOffer.apply(this, arguments);
  };
}

function shimAudioContext(window) {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' || window.AudioContext) {
    return;
  }

  window.AudioContext = window.webkitAudioContext;
}

},{"../utils":25}],25:[function(require,module,exports){
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

/* eslint-env node */
'use strict';

function _typeof2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
};

exports.extractVersion = extractVersion;
exports.wrapPeerConnectionEvent = wrapPeerConnectionEvent;
exports.disableLog = disableLog;
exports.disableWarnings = disableWarnings;
exports.log = log;
exports.deprecated = deprecated;
exports.detectBrowser = detectBrowser;
exports.compactObject = compactObject;
exports.walkStats = walkStats;
exports.filterStats = filterStats;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var logDisabled_ = true;
var deprecationWarnings_ = true;
/**
 * Extract browser version out of the provided user agent string.
 *
 * @param {!string} uastring userAgent string.
 * @param {!string} expr Regular expression used as match criteria.
 * @param {!number} pos position in the version string to be returned.
 * @return {!number} browser version.
 */

function extractVersion(uastring, expr, pos) {
  var match = uastring.match(expr);
  return match && match.length >= pos && parseInt(match[pos], 10);
} // Wraps the peerconnection event eventNameToWrap in a function
// which returns the modified event object (or false to prevent
// the event).


function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
  if (!window.RTCPeerConnection) {
    return;
  }

  var proto = window.RTCPeerConnection.prototype;
  var nativeAddEventListener = proto.addEventListener;

  proto.addEventListener = function (nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap) {
      return nativeAddEventListener.apply(this, arguments);
    }

    var wrappedCallback = function wrappedCallback(e) {
      var modifiedEvent = wrapper(e);

      if (modifiedEvent) {
        if (cb.handleEvent) {
          cb.handleEvent(modifiedEvent);
        } else {
          cb(modifiedEvent);
        }
      }
    };

    this._eventMap = this._eventMap || {};

    if (!this._eventMap[eventNameToWrap]) {
      this._eventMap[eventNameToWrap] = new Map();
    }

    this._eventMap[eventNameToWrap].set(cb, wrappedCallback);

    return nativeAddEventListener.apply(this, [nativeEventName, wrappedCallback]);
  };

  var nativeRemoveEventListener = proto.removeEventListener;

  proto.removeEventListener = function (nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[eventNameToWrap]) {
      return nativeRemoveEventListener.apply(this, arguments);
    }

    if (!this._eventMap[eventNameToWrap].has(cb)) {
      return nativeRemoveEventListener.apply(this, arguments);
    }

    var unwrappedCb = this._eventMap[eventNameToWrap].get(cb);

    this._eventMap[eventNameToWrap]["delete"](cb);

    if (this._eventMap[eventNameToWrap].size === 0) {
      delete this._eventMap[eventNameToWrap];
    }

    if (Object.keys(this._eventMap).length === 0) {
      delete this._eventMap;
    }

    return nativeRemoveEventListener.apply(this, [nativeEventName, unwrappedCb]);
  };

  Object.defineProperty(proto, 'on' + eventNameToWrap, {
    get: function get() {
      return this['_on' + eventNameToWrap];
    },
    set: function set(cb) {
      if (this['_on' + eventNameToWrap]) {
        this.removeEventListener(eventNameToWrap, this['_on' + eventNameToWrap]);
        delete this['_on' + eventNameToWrap];
      }

      if (cb) {
        this.addEventListener(eventNameToWrap, this['_on' + eventNameToWrap] = cb);
      }
    },
    enumerable: true,
    configurable: true
  });
}

function disableLog(bool) {
  if (typeof bool !== 'boolean') {
    return new Error('Argument type: ' + (typeof bool === 'undefined' ? 'undefined' : _typeof(bool)) + '. Please use a boolean.');
  }

  logDisabled_ = bool;
  return bool ? 'adapter.js logging disabled' : 'adapter.js logging enabled';
}
/**
 * Disable or enable deprecation warnings
 * @param {!boolean} bool set to true to disable warnings.
 */


function disableWarnings(bool) {
  if (typeof bool !== 'boolean') {
    return new Error('Argument type: ' + (typeof bool === 'undefined' ? 'undefined' : _typeof(bool)) + '. Please use a boolean.');
  }

  deprecationWarnings_ = !bool;
  return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
}

function log() {
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
    if (logDisabled_) {
      return;
    }

    if (typeof console !== 'undefined' && typeof console.log === 'function') {
      console.log.apply(console, arguments);
    }
  }
}
/**
 * Shows a deprecation warning suggesting the modern and spec-compatible API.
 */


function deprecated(oldMethod, newMethod) {
  if (!deprecationWarnings_) {
    return;
  }

  console.warn(oldMethod + ' is deprecated, please use ' + newMethod + ' instead.');
}
/**
 * Browser detector.
 *
 * @return {object} result containing browser and version
 *     properties.
 */


function detectBrowser(window) {
  // Returned result object.
  var result = {
    browser: null,
    version: null
  }; // Fail early if it's not a browser

  if (typeof window === 'undefined' || !window.navigator) {
    result.browser = 'Not a browser.';
    return result;
  }

  var navigator = window.navigator;

  if (navigator.mozGetUserMedia) {
    // Firefox.
    result.browser = 'firefox';
    result.version = extractVersion(navigator.userAgent, /Firefox\/(\d+)\./, 1);
  } else if (navigator.webkitGetUserMedia || window.isSecureContext === false && window.webkitRTCPeerConnection && !window.RTCIceGatherer) {
    // Chrome, Chromium, Webview, Opera.
    // Version matches Chrome/WebRTC version.
    // Chrome 74 removed webkitGetUserMedia on http as well so we need the
    // more complicated fallback to webkitRTCPeerConnection.
    result.browser = 'chrome';
    result.version = extractVersion(navigator.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
  } else if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
    // Edge.
    result.browser = 'edge';
    result.version = extractVersion(navigator.userAgent, /Edge\/(\d+).(\d+)$/, 2);
  } else if (window.RTCPeerConnection && navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
    // Safari.
    result.browser = 'safari';
    result.version = extractVersion(navigator.userAgent, /AppleWebKit\/(\d+)\./, 1);
    result.supportsUnifiedPlan = window.RTCRtpTransceiver && 'currentDirection' in window.RTCRtpTransceiver.prototype;
  } else {
    // Default fallthrough: not supported.
    result.browser = 'Not a supported browser.';
    return result;
  }

  return result;
}
/**
 * Checks if something is an object.
 *
 * @param {*} val The something you want to check.
 * @return true if val is an object, false otherwise.
 */


function isObject(val) {
  return Object.prototype.toString.call(val) === '[object Object]';
}
/**
 * Remove all empty objects and undefined values
 * from a nested object -- an enhanced and vanilla version
 * of Lodash's `compact`.
 */


function compactObject(data) {
  if (!isObject(data)) {
    return data;
  }

  return Object.keys(data).reduce(function (accumulator, key) {
    var isObj = isObject(data[key]);
    var value = isObj ? compactObject(data[key]) : data[key];
    var isEmptyObject = isObj && !Object.keys(value).length;

    if (value === undefined || isEmptyObject) {
      return accumulator;
    }

    return Object.assign(accumulator, _defineProperty({}, key, value));
  }, {});
}
/* iterates the stats graph recursively. */


function walkStats(stats, base, resultSet) {
  if (!base || resultSet.has(base.id)) {
    return;
  }

  resultSet.set(base.id, base);
  Object.keys(base).forEach(function (name) {
    if (name.endsWith('Id')) {
      walkStats(stats, stats.get(base[name]), resultSet);
    } else if (name.endsWith('Ids')) {
      base[name].forEach(function (id) {
        walkStats(stats, stats.get(id), resultSet);
      });
    }
  });
}
/* filter getStats for a sender/receiver track. */


function filterStats(result, track, outbound) {
  var streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
  var filteredResult = new Map();

  if (track === null) {
    return filteredResult;
  }

  var trackStats = [];
  result.forEach(function (value) {
    if (value.type === 'track' && value.trackIdentifier === track.id) {
      trackStats.push(value);
    }
  });
  trackStats.forEach(function (trackStat) {
    result.forEach(function (stats) {
      if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
        walkStats(result, stats, filteredResult);
      }
    });
  });
  return filteredResult;
}

},{}],26:[function(require,module,exports){
'use strict';
/**
 * @namespace Flashphoner.constants.SESSION_STATUS
 * @see Session
 */

var sessionStatus = {};
/**
 * Fires when {@link Session} ws socket opens.
 * @event CONNECTED
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'CONNECTED', 'CONNECTED');
/**
 * Fires when {@link Session} receives connect ack from REST App.
 * @event ESTABLISHED
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'ESTABLISHED', 'ESTABLISHED');
/**
 * Fires when {@link Session} disconnects.
 * @event DISCONNECTED
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'DISCONNECTED', 'DISCONNECTED');
/**
 * Fires if {@link Session} call of rest method error.
 * @event WARN
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'WARN', 'WARN');
/**
 * Fires if {@link Session} connection failed.
 * Some of the reasons can be network connection failed, REST App failed
 * @event FAILED
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'FAILED', 'FAILED');
/**
 * Fires wneh {@link Session} receives debug event
 * @event DEBUG
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'DEBUG', 'DEBUG');
/**
 * Fires when {@link Session} receives custom REST App message.
 *
 * @event APP_DATA
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'APP_DATA', 'APP_DATA');
/**
 * Fires when {@link Session} receives status of sendData operation.
 *
 * @event SEND_DATA_STATUS
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'SEND_DATA_STATUS', 'SEND_DATA_STATUS'); //State of newly created Session

define(sessionStatus, 'PENDING', 'PENDING');
/**
 * Fires when {@link Session} registers as sip client.
 *
 * @event APP_DATA
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'REGISTERED', 'REGISTERED');
/**
 * Fires when {@link Session} unregisters as sip client.
 *
 * @event APP_DATA
 * @memberof Flashphoner.constants.SESSION_STATUS
 */

define(sessionStatus, 'UNREGISTERED', 'UNREGISTERED');
define(sessionStatus, 'INCOMING_CALL', 'INCOMING_CALL');
/**
 * @namespace Flashphoner.constants.STREAM_STATUS
 * @see Stream
 */

var streamStatus = {}; //State of newly created Stream

define(streamStatus, 'NEW', 'NEW'); //State between publish/play and server response

define(streamStatus, 'PENDING', 'PENDING');
/**
 * Fires when {@link Stream} starts publishing.
 * @event PUBLISHING
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'PUBLISHING', 'PUBLISHING');
/**
 * Fires when {@link Stream} starts playing.
 * @event PLAYING
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'PLAYING', 'PLAYING');
/**
 * Fires if {@link Stream} paused.
 * @event PAUSED
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'PAUSED', 'PAUSED');
/**
 * Fires if {@link Stream} was unpublished.
 * @event UNPUBLISHING
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'UNPUBLISHED', 'UNPUBLISHED');
/**
 * Fires if {@link Stream} was stopped.
 * @event STOPPED
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'STOPPED', 'STOPPED');
/**
 * Fires if {@link Stream} failed.
 * @event FAILED
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'FAILED', 'FAILED');
/**
 * Fires if {@link Stream} playback problem.
 * @event PLAYBACK_PROBLEM
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'PLAYBACK_PROBLEM', 'PLAYBACK_PROBLEM');
/**
 * Fires if {@link Stream} resize.
 * @event RESIZE
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'RESIZE', 'RESIZE');
/**
 * Fires when {@link Stream} snapshot becomes available.
 * Snapshot is base64 encoded png available through {@link Stream.getInfo}
 * @event SNAPSHOT_COMPLETE
 * @memberof Flashphoner.constants.STREAM_STATUS
 */

define(streamStatus, 'SNAPSHOT_COMPLETE', 'SNAPSHOT_COMPLETE');
/**
 * Fires on subscribe {@link Stream} if bitrate is higher than available network bandwidth.
 * @event NOT_ENOUGH_BANDWIDTH
 * @memberof Flashphoner.constants.NOT_ENOUGH_BANDWIDTH
 */

define(streamStatus, 'NOT_ENOUGH_BANDWIDTH', 'NOT_ENOUGH_BANDWIDTH');
/**
 * @namespace Flashphoner.constants.CALL_STATUS
 * @see Call
 */

var callStatus = {}; //State of newly created Call

define(callStatus, 'NEW', 'NEW');
define(callStatus, 'RING', 'RING');
define(callStatus, 'RING_MEDIA', 'RING_MEDIA');
define(callStatus, 'HOLD', 'HOLD');
define(callStatus, 'ESTABLISHED', 'ESTABLISHED');
define(callStatus, 'FINISH', 'FINISH');
define(callStatus, 'BUSY', 'BUSY');
define(callStatus, 'SESSION_PROGRESS', 'SESSION_PROGRESS');
define(callStatus, 'FAILED', 'FAILED');
define(callStatus, 'PENDING', 'PENDING');
define(callStatus, 'TRYING', 'TRYING');
/**
* @namespace Flashphoner.constants.STREAM_STATUS_INFO
* @see Stream
*/

var streamStatusInfo = {};
/**
 * Indicates general error during ICE negotiation. Usually occurs if client is behind some exotic nat/firewall.
 * @event FAILED_BY_ICE_ERROR
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_ICE_ERROR', 'Failed by ICE error');
/**
 * Timeout has been reached during ICE establishment.
 * @event FAILED_BY_ICE_TIMEOUT
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_ICE_TIMEOUT', 'Failed by ICE timeout');
/**
 * ICE refresh failed on session.
 * @event FAILED_BY_KEEP_ALIVE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_KEEP_ALIVE', 'Failed by ICE keep alive');
/**
 * DTLS has wrong fingerprint.
 * @event FAILED_BY_DTLS_FINGERPRINT_ERROR
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_DTLS_FINGERPRINT_ERROR', 'Failed by DTLS fingerprint error');
/**
 * Client did not send DTLS packets or packets were lost/corrupted during transmission.
 * @event FAILED_BY_DTLS_ERROR
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_DTLS_ERROR', 'Failed by DTLS error');
/**
 * Indicates general HLS packetizer error, can occur during initialization or packetization (wrong input or out of disk space).
 * @event FAILED_BY_HLS_WRITER_ERROR
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_HLS_WRITER_ERROR', 'Failed by HLS writer error');
/**
 * Indicates general RTMP republishing error, can occur during initialization or rtmp packetization.
 * @event FAILED_BY_RTMP_WRITER_ERROR
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_RTMP_WRITER_ERROR', 'Failed by RTMP writer error');
/**
 * RTP session failed by RTP activity timer.
 * @event FAILED_BY_RTP_ACTIVITY
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_RTP_ACTIVITY', 'Failed by RTP activity');
/**
 * Related session was disconnected.
 * @event STOPPED_BY_SESSION_DISCONNECT
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'STOPPED_BY_SESSION_DISCONNECT', 'Stopped by session disconnect');
/**
 * Stream was stopped by rest terminate request.
 * @event STOPPED_BY_REST_TERMINATE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'STOPPED_BY_REST_TERMINATE', 'Stopped by rest /terminate');
/**
 * Related publisher stopped its stream or lost connection.
 * @event STOPPED_BY_PUBLISHER_STOP
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'STOPPED_BY_PUBLISHER_STOP', 'Stopped by publisher stop');
/**
 * Stop the media session by user after call was finished or unpublish stream.
 * @event STOPPED_BY_USER
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'STOPPED_BY_USER', 'Stopped by user');
/**
 * Error occurred on the stream.
 * @event FAILED_BY_ERROR
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_BY_ERROR', 'Failed by error');
/**
 * Indicates that error occurred during media session creation. This might be SDP parsing error, all ports are busy, wrong session related config etc.
 * @event FAILED_TO_ADD_STREAM_TO_PROXY
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_TO_ADD_STREAM_TO_PROXY', 'Failed to add stream to proxy');
/**
 * Stopped shapshot distributor.
 * @event DISTRIBUTOR_STOPPED
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'DISTRIBUTOR_STOPPED', 'Distributor stopped');
/**
 * Publish stream is not ready, try again later.
 * @event PUBLISH_STREAM_IS_NOT_READY
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'PUBLISH_STREAM_IS_NOT_READY', 'Publish stream is not ready');
/**
 * Stream with this name is not found, check the correct of the name.
 * @event STREAM_NOT_FOUND
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'STREAM_NOT_FOUND', 'Stream not found');
/**
 * Server already has a publish stream with the same name, try using different one.
 * @event STREAM_NAME_ALREADY_IN_USE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'STREAM_NAME_ALREADY_IN_USE', 'Stream name is already in use');
/**
 * Error indicates that stream object received by server has empty mediaSessionId field.
 * @event MEDIASESSION_ID_NULL
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'MEDIASESSION_ID_NULL', 'MediaSessionId is null');
/**
 * Published or subscribed sessions used this MediaSessionId.
 * @event MEDIASESSION_ID_ALREADY_IN_USE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'MEDIASESSION_ID_ALREADY_IN_USE', 'MediaSessionId is already in use');
/**
 * Session is not initialized or terminated on play ordinary stream.
 * @event SESSION_NOT_READY
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'SESSION_NOT_READY', 'Session not ready');
/**
 * Actual session does not exist.
 * @event SESSION_DOES_NOT_EXIST
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'SESSION_DOES_NOT_EXIST', 'Session does not exist');
/**
 * RTSP has wrong format on play stream, check correct of the RTSP url.
 * @event RTSP_HAS_WRONG_FORMAT
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'RTSP_HAS_WRONG_FORMAT', 'Rtsp has wrong format');
/**
 * Failed to play vod stream, this format is not supported.
 * @event FILE_HAS_WRONG_FORMAT
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FILE_HAS_WRONG_FORMAT', 'File has wrong format');
/**
 * Failed to connect to rtsp stream.
 * @event FAILED_TO_CONNECT_TO_RTSP_STREAM
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_TO_CONNECT_TO_RTSP_STREAM', 'Failed to connect to rtsp stream');
/**
 * Rtsp stream is not found, agent received "404-Not Found".
 * @event RTSP_STREAM_NOT_FOUND
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'RTSP_STREAM_NOT_FOUND', 'Rtsp stream not found');
/**
 * On shutdown RTSP agent.
 * @event RTSPAGENT_SHUTDOWN
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'RTSPAGENT_SHUTDOWN', 'RtspAgent shutdown');
/**
 * Stream failed
 * @event STREAM_FAILED
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'STREAM_FAILED', 'Stream failed');
/**
 * No common codecs on setup track, did not found corresponding trackId->mediaPort.
 * @event NO_COMMON_CODECS
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'NO_COMMON_CODECS', 'No common codecs');
/**
 * Bad referenced rtsp link, check for correct, example: rtsp://user:b@d_password@127.0.0.1/stream.
 * @event BAD_URI
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'BAD_URI', 'Bad URI');
/**
 * General VOD error, indicates that Exception occurred while reading/processing media file.
 * @event GOT_EXCEPTION_WHILE_STREAMING_FILE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'GOT_EXCEPTION_WHILE_STREAMING_FILE', 'Got exception while streaming file');
/**
 * Requested stream shutdown.
 * @event REQUESTED_STREAM_SHUTDOWN
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'REQUESTED_STREAM_SHUTDOWN', 'Requested stream shutdown');
/**
 * Failed to create movie, file can not be read.
 * @event FAILED_TO_READ_FILE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_TO_READ_FILE', 'Failed to read file');
/**
 * File does not exist, check filename.
 * @event FILE_NOT_FOUND
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FILE_NOT_FOUND', 'File not found');
/**
 * Server failed to establish websocket connection with origin server.
 * @event FAILED_TO_CONNECT_TO_ORIGIN_STREAM
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_TO_CONNECT_TO_ORIGIN_STREAM', 'Failed to connect to origin stream');
/**
 * CDN stream not found.
 * @event CDN_STREAM_NOT_FOUND
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'CDN_STREAM_NOT_FOUND', 'CDN stream not found');
/**
 * Indicates that provided URL protocol in stream name is invalid.
 * Valid: vod://file.mp4
 * Invalid: dov://file.mp4
 * @event FAILED_TO_GET_AGENT_STORAGE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'FAILED_TO_GET_AGENT_STORAGE', 'Failed to get agent storage');
/**
 * Shutdown agent servicing origin stream.
 * @event AGENT_SERVICING_ORIGIN_STREAM_IS_SHUTTING_DOWN
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'AGENT_SERVICING_ORIGIN_STREAM_IS_SHUTTING_DOWN', 'Agent servicing origin stream is shutting down');
/**
 * Terminated by keep-alive on walk through subscribers.
 * @event TERMINATED_BY_KEEP_ALIVE
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'TERMINATED_BY_KEEP_ALIVE', 'Terminated by keep-alive');
/**
 * Transcoding required, but disabled in settings
 * @event TRANSCODING_REQUIRED_BUT_DISABLED
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'TRANSCODING_REQUIRED_BUT_DISABLED', 'Transcoding required, but disabled');
/**
 * Access restricted by access list
 * @event RESTRICTED_ACCESS
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'RESTRICTED_ACCESS', 'Restricted access');
/**
 * No available transcoders for stream
 * @event RESTRICTED_ACCESS
 * @memberof Flashphoner.constants.STREAM_STATUS_INFO
 */

define(streamStatusInfo, 'NO_AVAILABLE_TRANSCODERS', 'No available transcoders');
/**
* @namespace Flashphoner.constants.CALL_STATUS_INFO
* @see Call
*/

var callStatusInfo = {};
/**
 * Normal call hangup.
 * @event NORMAL_CALL_CLEARING
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'NORMAL_CALL_CLEARING', 'Normal call clearing');
/**
 * Error occurred on session creation.
 * @event FAILED_BY_SESSION_CREATION
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_SESSION_CREATION', 'Failed by session creation');
/**
 * Failed by error during ICE establishment.
 * @event FAILED_BY_ICE_ERROR
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_ICE_ERROR', 'Failed by ICE error');
/**
 * RTP session failed by RTP activity timer.
 * @event FAILED_BY_RTP_ACTIVITY
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_RTP_ACTIVITY', 'Failed by RTP activity');
/**
 * FF writer was failed on RTMP.
 * @event FAILED_BY_RTMP_WRITER_ERROR
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_RTMP_WRITER_ERROR', 'Failed by RTMP writer error');
/**
 * DTLS wrong fingerprint.
 * @event FAILED_BY_DTLS_FINGERPRINT_ERROR
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_DTLS_FINGERPRINT_ERROR', 'Failed by DTLS fingerprint error');
/**
 * No common codecs in sdp
 * @event NO_COMMON_CODECS
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'NO_COMMON_CODECS', 'No common codecs');
/**
 * Client did not send DTLS packets or packets were lost/corrupted during transmission.
 * @event FAILED_BY_DTLS_ERROR
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_DTLS_ERROR', 'Failed by DTLS error');
/**
 * Error occurred during call
 * @event FAILED_BY_ERROR
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_ERROR', 'Failed by error');
/**
 * Call failed by request timeout
 * @event FAILED_BY_REQUEST_TIMEOUT
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'FAILED_BY_REQUEST_TIMEOUT', 'Failed by request timeout');
/**
 * Transcoding required, but disabled in settings
 * @event TRANSCODING_REQUIRED_BUT_DISABLED
 * @memberof Flashphoner.constants.CALL_STATUS_INFO
 */

define(callStatusInfo, 'TRANSCODING_REQUIRED_BUT_DISABLED', 'Transcoding required, but disabled');
/**
* @namespace Flashphoner.constants.ERROR_INFO
*/

var errorInfo = {};
/**
 * Error if none of MediaProviders available
 * @event NONE_OF_MEDIAPROVIDERS_AVAILABLE
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'NONE_OF_MEDIAPROVIDERS_AVAILABLE', 'None of MediaProviders available');
/**
 * Error if none of preferred MediaProviders available
 * @event NONE_OF_PREFERRED_MEDIAPROVIDERS_AVAILABLE
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'NONE_OF_PREFERRED_MEDIAPROVIDERS_AVAILABLE', 'None of preferred MediaProviders available');
/**
 * Error if API is not initialized
 * @event FLASHPHONER_API_NOT_INITIALIZED
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'FLASHPHONER_API_NOT_INITIALIZED', 'Flashphoner API is not initialized');
/**
 * Error if options.urlServer is not specified
 * @event OPTIONS_URLSERVER_MUST_BE_PROVIDED
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'OPTIONS_URLSERVER_MUST_BE_PROVIDED', 'options.urlServer must be provided');
/**
 * Error if session state is not REGISTERED
 * @event INVALID_SESSION_STATE
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'INVALID_SESSION_STATE', 'Invalid session state');
/**
 * Error if no options provided
 * @event OPTIONS_MUST_BE_PROVIDED
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'OPTIONS_MUST_BE_PROVIDED', 'options must be provided');
/**
 * Error if call status is not {@link Flashphoner.constants.CALL_STATUS.NEW}
 * @event INVALID_CALL_STATE
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'INVALID_CALL_STATE', 'Invalid call state');
/**
 * Error if event is not specified
 * @event EVENT_CANT_BE_NULL
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'EVENT_CANT_BE_NULL', 'Event can\'t be null');
/**
 * Error if callback is not a valid function
 * @event CALLBACK_NEEDS_TO_BE_A_VALID_FUNCTION
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'CALLBACK_NEEDS_TO_BE_A_VALID_FUNCTION', 'Callback needs to be a valid function');
/**
 * Error if session state is not ESTABLISHED
 * @event INVALID_SESSION_STATE
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'INVALID_SESSION_STATE', 'Invalid session state');
/**
 * Error if options.name is not specified
 * @event OPTIONS_NAME_MUST_BE_PROVIDED
 * @memberof Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'OPTIONS_NAME_MUST_BE_PROVIDED', 'options.name must be provided');
/**
 * Error if number of cams is less than 2 or already used custom stream
 * @event CAN_NOT_SWITCH_CAM
 * @memberOf Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'CAN_NOT_SWITCH_CAM', 'Number of cams is less than 2 or already used custom stream');
/**
 * Error if number of mics is less than 2 or already used custom stream
 * @event CAN_NOT_SWITCH_MIC
 * @memberOf Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'CAN_NOT_SWITCH_MIC', 'Number of mics is less than 2 or already used custom stream');
/**
 * Error if recived local error
 * @event CAN_NOT_SWITCH_MIC
 * @memberOf Flashphoner.constants.ERROR_INFO
 */

define(errorInfo, 'LOCAL_ERROR', 'Local error');
var mediaDeviceKind = {};
define(mediaDeviceKind, 'OUTPUT', 'output');
define(mediaDeviceKind, 'INPUT', 'input');
define(mediaDeviceKind, 'ALL', 'all');
var transportType = {};
define(transportType, 'UDP', 'UDP');
define(transportType, 'TCP', 'TCP');
var connectionQuality = {};
define(connectionQuality, 'PERFECT', 'PERFECT');
define(connectionQuality, 'GOOD', 'GOOD');
define(connectionQuality, 'BAD', 'BAD');
define(connectionQuality, 'UNKNOWN', 'UNKNOWN');
define(connectionQuality, 'UPDATE', 'UPDATE');
var constants = {};
define(constants, 'SESSION_STATUS', sessionStatus);
define(constants, 'STREAM_STATUS', streamStatus);
define(constants, 'CALL_STATUS', callStatus);
define(constants, 'STREAM_STATUS_INFO', streamStatusInfo);
define(constants, 'CALL_STATUS_INFO', callStatusInfo);
define(constants, 'ERROR_INFO', errorInfo);
define(constants, 'MEDIA_DEVICE_KIND', mediaDeviceKind);
define(constants, 'TRANSPORT_TYPE', transportType);
define(constants, 'CONNECTION_QUALITY', connectionQuality); //define helper

function define(obj, name, value) {
  Object.defineProperty(obj, name, {
    value: value,
    enumerable: true
  });
}

module.exports = constants;

},{}],27:[function(require,module,exports){
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var uuid_v1 = require('uuid/v1');

var constants = require("./constants");

var util = require('./util');

var logger = require('./util').logger;

var loggerConf = {
  push: false,
  severity: "INFO"
};

var Promise = require('promise-polyfill');

var KalmanFilter = require('kalmanjs');

var browserDetails = require('webrtc-adapter')["default"].browserDetails;

var LOG_PREFIX = "core";
var isUsingTemasysPlugin = false;
/**
 * @namespace Flashphoner
 */

var SESSION_STATUS = constants.SESSION_STATUS;
var STREAM_STATUS = constants.STREAM_STATUS;
var CALL_STATUS = constants.CALL_STATUS;
var TRANSPORT_TYPE = constants.TRANSPORT_TYPE;
var CONNECTION_QUALITY = constants.CONNECTION_QUALITY;
var ERROR_INFO = constants.ERROR_INFO;
var VIDEO_RATE_GOOD_QUALITY_PERCENT_DIFFERENCE = 20;
var VIDEO_RATE_BAD_QUALITY_PERCENT_DIFFERENCE = 50;
var LOW_VIDEO_RATE_THRESHOLD_BAD_PERFECT = 50000;
var LOW_VIDEO_RATE_BAD_QUALITY_PERCENT_DIFFERENCE = 150;
var OUTBOUND_VIDEO_RATE = "outboundVideoRate";
var INBOUND_VIDEO_RATE = "inboundVideoRate";
var MediaProvider = {};
var sessions = {};
var initialized = false;
var disableConnectionQualityCalculation;
/**
 * Static initializer.
 *
 * @param {Object} options Global api options
 * @param {Function=} options.mediaProvidersReadyCallback Callback of initialized WebRTC Plugin
 * @param {String=} options.flashMediaProviderSwfLocation Location of media-provider.swf file
 * @param {string=} options.preferredMediaProvider DEPRECATED: Use preferred media provider if available
 * @param {Array=} options.preferredMediaProviders Use preferred media providers order
 * @param {String=} options.receiverLocation Location of WSReceiver.js file
 * @param {String=} options.decoderLocation Location of video-worker2.js file
 * @param {String=} options.screenSharingExtensionId Chrome screen sharing extension id
 * @param {Object=} options.constraints Default local media constraints
 * @param {Object=} options.logger Enable logging
 * @throws {Error} Error if none of MediaProviders available
 * @memberof Flashphoner
 */

var init = function init(options) {
  if (!initialized) {
    if (!options) {
      options = {};
    }

    loggerConf = options.logger || loggerConf;

    if (options.logger !== null) {
      loggerConf.enableLogs = true;
    } // init logger


    logger.init(loggerConf.severity || "INFO", loggerConf.push || false, loggerConf.customLogger, loggerConf.enableLogs);
    var waitingTemasys = false;

    try {
      var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn("Failed to create audio context");
    }

    disableConnectionQualityCalculation = options.disableConnectionQualityCalculation;

    var webRtcProvider = require("./webrtc-media-provider");

    if (webRtcProvider && webRtcProvider.hasOwnProperty('available') && webRtcProvider.available()) {
      MediaProvider.WebRTC = webRtcProvider;
      var webRtcConf = {
        constraints: options.constraints || getDefaultMediaConstraints(),
        extensionId: options.screenSharingExtensionId,
        audioContext: audioContext,
        logger: logger,
        createMicGainNode: options.createMicGainNode
      };
      webRtcProvider.configure(webRtcConf);
    } else {
      webRtcProvider = require("./temasys-media-provider");

      if (webRtcProvider && webRtcProvider.hasOwnProperty('available') && AdapterJS) {
        waitingTemasys = true;
        AdapterJS.webRTCReady(function (isUsingPlugin) {
          isUsingTemasysPlugin = isUsingPlugin;

          if (isUsingPlugin || webRtcProvider.available()) {
            MediaProvider.WebRTC = webRtcProvider;
            var webRtcConf = {
              constraints: options.constraints || getDefaultMediaConstraints(),
              extensionId: options.screenSharingExtensionId,
              logger: logger
            };
            webRtcProvider.configure(webRtcConf); // Just reorder media provider list

            var _MediaProvider = {};
            _MediaProvider.WebRTC = MediaProvider.WebRTC;

            for (var p in MediaProvider) {
              _MediaProvider[p] = MediaProvider[p];
            }

            MediaProvider = _MediaProvider;
          }

          if (options.mediaProvidersReadyCallback) {
            options.mediaProvidersReadyCallback(Object.keys(MediaProvider));
          }
        });
      }
    }

    var flashProvider = require("./flash-media-provider");

    if (flashProvider && flashProvider.hasOwnProperty('available') && flashProvider.available() && (!MediaProvider.WebRTC || options.preferredMediaProviders && options.preferredMediaProviders.indexOf("Flash") >= 0)) {
      MediaProvider.Flash = flashProvider;
      var flashConf = {
        constraints: options.constraints || getDefaultMediaConstraints(),
        flashMediaProviderSwfLocation: options.flashMediaProviderSwfLocation,
        logger: logger
      };
      flashProvider.configure(flashConf);
    }

    var mediaSourceMediaProvider = require("./media-source-media-provider");

    if (mediaSourceMediaProvider && mediaSourceMediaProvider.hasOwnProperty('available') && mediaSourceMediaProvider.available()) {
      MediaProvider.MSE = mediaSourceMediaProvider;
      var mseConf = {
        audioContext: audioContext,
        browserDetails: browserDetails.browser
      };
      mediaSourceMediaProvider.configure(mseConf);
    }

    var websocketProvider = require("./websocket-media-provider");

    if (websocketProvider && websocketProvider.hasOwnProperty('available') && websocketProvider.available(audioContext)) {
      MediaProvider.WSPlayer = websocketProvider;
      var wsConf = {
        receiverLocation: options.receiverLocation,
        decoderLocation: options.decoderLocation,
        audioContext: audioContext,
        logger: logger
      };
      websocketProvider.configure(wsConf);
    } //check at least 1 provider available


    if (getMediaProviders().length == 0) {
      throw new Error('None of MediaProviders available');
    } else if (options.preferredMediaProvider) {
      if (MediaProvider.hasOwnProperty(options.preferredMediaProvider)) {
        if (getMediaProviders()[0] != options.preferredMediaProvider) {
          // Just reorder media provider list
          var _MediaProvider = {};
          _MediaProvider[options.preferredMediaProvider] = MediaProvider[options.preferredMediaProvider];

          for (var p in MediaProvider) {
            _MediaProvider[p] = MediaProvider[p];
          }

          MediaProvider = _MediaProvider;
        }
      } else {
        logger.warn(LOG_PREFIX, "Preferred media provider is not available.");
      }
    }

    if (options.preferredMediaProviders && options.preferredMediaProviders.length > 0) {
      var newMediaProvider = {};

      for (var i in options.preferredMediaProviders) {
        if (options.preferredMediaProviders.hasOwnProperty(i)) {
          var pMP = options.preferredMediaProviders[i];

          if (MediaProvider.hasOwnProperty(pMP)) {
            newMediaProvider[pMP] = MediaProvider[pMP];
          }
        }
      }

      if (util.isEmptyObject(newMediaProvider)) {
        throw new Error("None of preferred MediaProviders available");
      } else {
        MediaProvider = newMediaProvider;
      }
    }

    if (!waitingTemasys && options.mediaProvidersReadyCallback) {
      options.mediaProvidersReadyCallback(Object.keys(MediaProvider));
    }

    logger.info(LOG_PREFIX, "Initialized");
    initialized = true;
  }
};
/**
 * Get available MediaProviders.
 *
 * @returns {Array} Available MediaProviders
 * @memberof Flashphoner
 */


var getMediaProviders = function getMediaProviders() {
  return Object.keys(MediaProvider);
};
/**
 * Play audio chunk
 * @param {boolean} noise Use noise in playing
 * @memberof Flashphoner
 */


var playFirstSound = function playFirstSound(noise) {
  var mediaProvider = getMediaProviders()[0];
  MediaProvider[mediaProvider].playFirstSound(noise);
};
/**
 * Play video chunk
 *
 * @memberof Flashphoner
 */


var playFirstVideo = function playFirstVideo(display, isLocal, src) {
  for (var mp in MediaProvider) {
    return MediaProvider[mp].playFirstVideo(display, isLocal, src);
  }
};
/**
 * Get logger
 *
 * @returns {Object} Logger
 * @memberof Flashphoner
 */


var getLogger = function getLogger() {
  if (!initialized) {
    console.warn("Initialize API first.");
  } else {
    return logger;
  }
};
/**
 * @typedef Flashphoner.MediaDeviceList
 * @type Object
 * @property {Flashphoner.MediaDevice[]} audio Audio devices (microphones)
 * @property {Flashphoner.MediaDevice[]} video Video devices (cameras)
 */

/**
 * @typedef Flashphoner.MediaDevice
 * @type Object
 * @property {String} type Type of device: mic, camera, screen
 * @property {String} id Unique id
 * @property {String} label Device label
 */

/**
 * Get available local media devices
 *
 * @param {String=} mediaProvider Media provider that will be asked for device list
 * @param {Boolean=} labels Ask user for microphone access before getting device list.
 * This will make device label available.
 * @param {Flashphoner.constants.MEDIA_DEVICE_KIND} kind Media devices kind to access:
 * MEDIA_DEVICE_KIND.INPUT (default) get access to input devices only (camera, mic).
 * MEDIA_DEVICE_KIND.OUTPUT get access to output devices only (speaker, headphone).
 * MEDIA_DEVICE_KIND.ALL get access to all devices (cam, mic, speaker, headphone).
 * @param {Object=} deviceConstraints If labels == true.
 * If {audio: true, video: false}, then access to the camera will not be requested.
 * If {audio: false, video: true}, then access to the microphone will not be requested.
 * @returns {Promise.<Flashphoner.MediaDeviceList>} Promise with media device list on fulfill
 * @throws {Error} Error if API is not initialized
 * @memberof Flashphoner
 */


var getMediaDevices = function getMediaDevices(mediaProvider, labels, kind, deviceConstraints) {
  if (!initialized) {
    throw new Error("Flashphoner API is not initialized");
  }

  if (!mediaProvider) {
    mediaProvider = getMediaProviders()[0];
  }

  return MediaProvider[mediaProvider].listDevices(labels, kind, deviceConstraints);
};
/**
 * Get access to local media
 *
 * @param {Object} constraints Media constraints
 * @param {Object} constraints.audio Audio constraints
 * @param {String=} constraints.audio.deviceId Audio device id
 * @param {Object} constraints.video Video constraints
 * @param {String=} constraints.video.deviceId Video device id
 * @param {number} constraints.video.width Video width
 * @param {number} constraints.video.height Video height
 * @param {number} constraints.video.frameRate Video fps
 * @param {String} constraints.video.type Video device type: camera, screen
 * @param {String} constraints.video.mediaSource Video source type for FF: screen, window
 * @param {HTMLElement} display Div element local media should be displayed in
 * @param {String} mediaProvider Media provider type
 * @param {Boolean} disableConstraintsNormalization Disable constraints normalization
 * @returns {Promise.<HTMLElement>} Promise with display on fulfill
 * @throws {Error} Error if API is not initialized
 * @memberof Flashphoner
 */


var getMediaAccess = function getMediaAccess(constraints, display, mediaProvider, disableConstraintsNormalization) {
  if (!initialized) {
    throw new Error("Flashphoner API is not initialized");
  }

  if (!mediaProvider) {
    mediaProvider = getMediaProviders()[0];
  }

  return MediaProvider[mediaProvider].getMediaAccess(constraints, display, disableConstraintsNormalization);
}; //default constraints helper


var getDefaultMediaConstraints = function getDefaultMediaConstraints() {
  if (browserDetails.browser == "safari") {
    return {
      audio: true,
      video: {
        width: {
          min: 320,
          max: 640
        },
        height: {
          min: 240,
          max: 480
        }
      }
    };
  } else {
    return {
      audio: true,
      video: {
        width: 320,
        height: 240
      }
    };
  }
};

function getConstraintsProperty(constraints, property, defaultValue) {
  if (!constraints || !property) return defaultValue;
  var res;
  var properties = property.split(".");

  for (var prop in constraints) {
    if (prop == properties[0]) {
      res = constraints[prop];
      if (properties.length > 1) res = getConstraintsProperty(constraints[prop], properties[1], defaultValue);
    } else if (_typeof(constraints[prop]) === "object") {
      for (var p in constraints[prop]) {
        if (p == property) res = constraints[prop][p];
      }
    }
  }

  if (typeof res === "boolean") return res;
  return res || defaultValue;
}
/**
 * Release local media
 *
 * @param {HTMLElement} display Div element with local media
 * @param {String=} mediaProvider Media provider type
 * @returns {Boolean} True if media was found and released
 * @throws {Error} Error if API is not initialized
 * @memberof Flashphoner
 */


var releaseLocalMedia = function releaseLocalMedia(display, mediaProvider) {
  if (!initialized) {
    throw new Error("Flashphoner API is not initialized");
  }

  if (!mediaProvider) {
    mediaProvider = getMediaProviders()[0];
  }

  return MediaProvider[mediaProvider].releaseMedia(display);
};
/**
 * Get active sessions.
 *
 * @returns {Session[]} Array containing active sessions
 * @memberof Flashphoner
 */


var getSessions = function getSessions() {
  return util.copyObjectToArray(sessions);
};
/**
 * Get session by id.
 *
 * @param {string} id Session id
 * @returns {Session} Session
 * @memberof Flashphoner
 */


var getSession = function getSession(id) {
  return sessions[id];
};
/**
 * Create new session and connect to server.
 *
 * @param {Object} options Session options
 * @param {string} options.urlServer Server address in form of [ws,wss]://host.domain:port
 * @param {string} options.authToken Token for auth on server with keepalived client
 * @param {Boolean=} options.keepAlive Keep alive client on server after disconnect
 * @param {string=} options.lbUrl Load-balancer address
 * @param {string=} options.flashProto Flash protocol [rtmp,rtmfp]
 * @param {Integer=} options.flashPort Flash server port [1935]
 * @param {string=} options.appKey REST App key
 * @param {Object=} options.custom User provided custom object that will be available in REST App code
 * @param {Object=} options.sipOptions Sip configuration
 * @param {Object=} options.mediaOptions Media connection configuration
 * @param {Integer=} options.timeout Connection timeout in milliseconds
 * @returns {Session} Created session
 * @throws {Error} Error if API is not initialized
 * @throws {TypeError} Error if options.urlServer is not specified
 * @memberof Flashphoner
 */


var createSession = function createSession(options) {
  if (!initialized) {
    throw new Error("Flashphoner API is not initialized");
  }

  if (!options || !options.urlServer) {
    throw new TypeError("options.urlServer must be provided");
  }

  var id_ = uuid_v1();
  var sessionStatus = SESSION_STATUS.PENDING;
  var urlServer = options.urlServer;
  var lbUrl = options.lbUrl;
  var flashProto = options.flashProto || "rtmfp";
  var flashPort = options.flashPort || 1935;
  var appKey = options.appKey || "defaultApp";
  var mediaOptions = options.mediaOptions;
  var keepAlive = options.keepAlive;
  var timeout = options.timeout;
  var connectionTimeout;
  var cConfig; //SIP config

  var sipConfig;

  if (options.sipOptions) {
    sipConfig = {
      sipLogin: options.sipOptions.login,
      sipAuthenticationName: options.sipOptions.authenticationName,
      sipPassword: options.sipOptions.password,
      sipDomain: options.sipOptions.domain,
      sipOutboundProxy: options.sipOptions.outboundProxy,
      sipProxy: options.sipOptions.proxy,
      sipPort: options.sipOptions.port,
      sipRegisterRequired: options.sipOptions.registerRequired
    };
  } //media provider auth token received from server


  var authToken = options.authToken; //object for storing new and active streams

  var streams = {};
  var calls = {};
  var mediaConnections = {}; //session to stream callbacks

  var streamRefreshHandlers = {}; //session to call callbacks

  var callRefreshHandlers = {};
  /**
   * Represents connection to REST App.
   * Can create and store Streams.
   *
   * @see Flashphoner.createSession
   * @namespace Session
   */

  var session = {}; //callbacks added using session.on()

  var callbacks = {};
  var wsConnection;

  if (lbUrl) {
    requestURL(lbUrl);
  } else {
    createWS(urlServer);
  } //todo remove


  var remoteSdpCache = {}; //Request URL from load-balancer

  function requestURL(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.timeout = 5000;

    request.ontimeout = function () {
      logger.warn(LOG_PREFIX, "Timeout during geting url from balancer!");
      createWS(urlServer);
    };

    request.error = function () {
      logger.warn(LOG_PREFIX, "Error during geting url from balancer!");
      createWS(urlServer);
    };

    request.onload = function (e) {
      if (request.status == 200 && request.readyState == 4) {
        var result = JSON.parse(request.responseText);

        if (urlServer.indexOf("wss://") !== -1) {
          urlServer = "wss://" + result.server + ":" + result.wss;
        } else {
          urlServer = "ws://" + result.server + ":" + result.ws;
        }

        flashPort = result.flash;
        logger.debug(LOG_PREFIX, "Got url from load balancer " + result.server);
        createWS(urlServer);
      }
    };

    request.send();
  } //connect session to server


  function createWS(url) {
    wsConnection = new WebSocket(url);

    if (timeout != undefined && timeout > 0) {
      connectionTimeout = setTimeout(function () {
        if (wsConnection.readyState == 0) {
          console.log("WS connection timeout");
          wsConnection.close();
        }
      }, timeout);
    }

    wsConnection.onerror = function () {
      onSessionStatusChange(SESSION_STATUS.FAILED);
    };

    wsConnection.onclose = function () {
      if (sessionStatus !== SESSION_STATUS.FAILED) {
        onSessionStatusChange(SESSION_STATUS.DISCONNECTED);
      }
    };

    wsConnection.onopen = function () {
      onSessionStatusChange(SESSION_STATUS.CONNECTED);
      clearTimeout(connectionTimeout);
      cConfig = {
        appKey: appKey,
        mediaProviders: Object.keys(MediaProvider),
        keepAlive: keepAlive,
        authToken: authToken,
        clientVersion: "0.5.28",
        clientOSVersion: window.navigator.appVersion,
        clientBrowserVersion: window.navigator.userAgent,
        msePacketizationVersion: 2,
        custom: options.custom
      };

      if (sipConfig) {
        util.copyObjectPropsToAnotherObject(sipConfig, cConfig);
      } //connect to REST App


      send("connection", cConfig);
      logger.setConnection(wsConnection);
    };

    wsConnection.onmessage = function (event) {
      var data = {};

      if (event.data instanceof Blob) {
        data.message = "binaryData";
      } else {
        data = JSON.parse(event.data);
        var obj = data.data[0];
      }

      switch (data.message) {
        case 'ping':
          send("pong", null);
          break;

        case 'getUserData':
          authToken = obj.authToken;
          cConfig = obj;
          onSessionStatusChange(SESSION_STATUS.ESTABLISHED, obj);
          break;

        case 'setRemoteSDP':
          var mediaSessionId = data.data[0];
          var sdp = data.data[1];

          if (streamRefreshHandlers[mediaSessionId]) {
            //pass server's sdp to stream
            streamRefreshHandlers[mediaSessionId](null, sdp);
          } else if (callRefreshHandlers[mediaSessionId]) {
            //pass server's sdp to call
            callRefreshHandlers[mediaSessionId](null, sdp);
          } else {
            remoteSdpCache[mediaSessionId] = sdp;
            logger.info(LOG_PREFIX, "Media not found, id " + mediaSessionId);
          }

          break;

        case 'notifyVideoFormat':
        case 'notifyStreamStatusEvent':
          if (streamRefreshHandlers[obj.mediaSessionId]) {
            //update stream status
            streamRefreshHandlers[obj.mediaSessionId](obj);
          }

          break;

        case 'DataStatusEvent':
          restAppCommunicator.resolveData(obj);
          break;

        case 'OnDataEvent':
          if (callbacks[SESSION_STATUS.APP_DATA]) {
            callbacks[SESSION_STATUS.APP_DATA](obj);
          }

          break;

        case 'fail':
          if (obj.apiMethod && obj.apiMethod == "StreamStatusEvent") {
            if (streamRefreshHandlers[obj.id]) {
              //update stream status
              streamRefreshHandlers[obj.id](obj);
            }
          }

          if (callbacks[SESSION_STATUS.WARN]) {
            callbacks[SESSION_STATUS.WARN](obj);
          }

          break;

        case 'registered':
          onSessionStatusChange(SESSION_STATUS.REGISTERED);
          break;

        case 'notifyAudioCodec':
          // This case for Flash only
          var mediaSessionId = data.data[0];
          var codec = data.data[1];

          if (callRefreshHandlers[mediaSessionId]) {
            callRefreshHandlers[mediaSessionId](null, null, codec);
          }

          break;

        case 'notifyTransferEvent':
          callRefreshHandlers[obj.callId](null, null, null, obj);
          break;

        case 'notifyTryingResponse':
        case 'hold':
        case 'ring':
        case 'talk':
        case 'finish':
          if (callRefreshHandlers[obj.callId]) {
            //update call status
            callRefreshHandlers[obj.callId](obj);
          }

          break;

        case 'notifyIncomingCall':
          if (callRefreshHandlers[obj.callId]) {
            logger.error(LOG_PREFIX, "Call already exists, id " + obj.callId);
          }

          if (callbacks[SESSION_STATUS.INCOMING_CALL]) {
            callbacks[SESSION_STATUS.INCOMING_CALL](createCall(obj));
          } else {//todo hangup call
          }

          break;

        case 'notifySessionDebugEvent':
          logger.info(LOG_PREFIX, "Session debug status " + obj.status);

          if (callbacks[SESSION_STATUS.DEBUG]) {
            callbacks[SESSION_STATUS.DEBUG](obj);
          }

          break;

        case 'availableStream':
          var availableStream = {};
          availableStream.mediaSessionId = obj.id;
          availableStream.available = obj.status;

          if (streamRefreshHandlers[availableStream.mediaSessionId]) {
            streamRefreshHandlers[availableStream.mediaSessionId](availableStream);
          }

          break;

        case OUTBOUND_VIDEO_RATE:
        case INBOUND_VIDEO_RATE:
          if (streamRefreshHandlers[obj.mediaSessionId]) {
            obj.status = data.message;
            streamRefreshHandlers[obj.mediaSessionId](obj);
          }

          break;

        default: //logger.info(LOG_PREFIX, "Unknown server message " + data.message);

      }
    };
  } //WebSocket send helper


  function send(message, data) {
    wsConnection.send(JSON.stringify({
      message: message,
      data: [data]
    }));
  } //Session status update helper


  function onSessionStatusChange(newStatus, obj) {
    sessionStatus = newStatus;

    if (sessionStatus == SESSION_STATUS.DISCONNECTED || sessionStatus == SESSION_STATUS.FAILED) {
      //remove streams
      for (var prop in streamRefreshHandlers) {
        if (streamRefreshHandlers.hasOwnProperty(prop) && typeof streamRefreshHandlers[prop] === 'function') {
          streamRefreshHandlers[prop]({
            status: STREAM_STATUS.FAILED
          });
        }
      } //remove session from list


      delete sessions[id_];
    }

    if (callbacks[sessionStatus]) {
      callbacks[sessionStatus](session, obj);
    }
  }
  /**
   * @callback sdpHook
   * @param {Object} sdp Callback options
   * @param {String} sdp.sdpString Sdp from the server
   * @returns {String} sdp New sdp
   */

  /**
   * Create call.
   *
   * @param {Object} options Call options
   * @param {string} options.callee Call remote party id
   * @param {string=} options.visibleName Call caller visible name
   * @param {Object} options.constraints Call constraints
   * @param {string} options.mediaProvider MediaProvider type to use with this call
   * @param {Boolean=} options.receiveAudio Receive audio
   * @param {Boolean=} options.receiveVideo Receive video
   * @param {Boolean=} options.cacheLocalResources Display will contain local video after call release
   * @param {HTMLElement} options.localVideoDisplay Div element local video should be displayed in
   * @param {HTMLElement} options.remoteVideoDisplay Div element remote video should be displayed in
   * @param {Object=} options.custom User provided custom object that will be available in REST App code
   * @param {Array<string>=} options.stripCodecs Array of codecs which should be stripped from SDP (WebRTC)
   * @param {Array<string>=} options.sipSDP Array of custom SDP params (ex. bandwidth (b=))
   * @param {Array<string>=} options.sipHeaders Array of custom SIP headers
   * @param {sdpHook} sdpHook The callback that handles sdp from the server
   * @returns {Call} Call
   * @throws {TypeError} Error if no options provided
   * @throws {Error} Error if session state is not REGISTERED
   * @memberof Session
   * @inner
   */


  var createCall = function createCall(options) {
    //check session state
    if (sessionStatus !== SESSION_STATUS.REGISTERED && sessionStatus !== SESSION_STATUS.ESTABLISHED) {
      logger.info(LOG_PREFIX, "Status is " + sessionStatus);
      throw new Error('Invalid session state');
    } //check options


    if (!options) {
      throw new TypeError("options must be provided");
    }

    var login = appKey == 'clickToCallApp' ? '' : cConfig.sipLogin;
    var caller_ = options.incoming ? options.caller : login;
    var callee_ = options.callee;
    var visibleName_ = options.visibleName || login;
    var id_ = options.callId || uuid_v1();
    var mediaProvider = options.mediaProvider || getMediaProviders()[0];
    var mediaConnection;
    var localDisplay = options.localVideoDisplay;
    var remoteDisplay = options.remoteVideoDisplay;
    var info_;
    var errorInfo_; // Constraints

    if (options.constraints) {
      var constraints = options.constraints;
    }

    if (options.disableConstraintsNormalization) {
      var disableConstraintsNormalization = options.disableConstraintsNormalization;
    }

    var audioOutputId;
    var audioProperty = getConstraintsProperty(constraints, "audio", undefined);

    if (_typeof(audioProperty) === 'object') {
      audioOutputId = getConstraintsProperty(audioProperty, "outputId", 0);
    }

    var stripCodecs = options.stripCodecs || []; // Receive media

    var receiveAudio = typeof options.receiveAudio !== 'undefined' ? options.receiveAudio : true;
    var receiveVideo = typeof options.receiveVideo !== 'undefined' ? options.receiveVideo : true;
    var cacheLocalResources = options.cacheLocalResources;
    var status_ = CALL_STATUS.NEW;
    var callbacks = {};
    var hasTransferredCall = false;
    var sdpHook = options.sdpHook;
    var sipSDP = options.sipSDP;
    var sipHeaders = options.sipHeaders;
    /**
     * Represents sip call.
     *
     * @namespace Call
     * @see Session~createCall
     */

    var call = {};

    callRefreshHandlers[id_] = function (callInfo, sdp, codec, transfer) {
      if (transfer) {
        if (!mediaConnections[id_]) {
          mediaConnections[id_] = mediaConnection;
        }

        if (transfer.status == "COMPLETED") {
          delete mediaConnections[id_];
        }

        return;
      } //transferred call


      if (!mediaConnection && Object.keys(mediaConnections).length != 0) {
        for (var mc in mediaConnections) {
          mediaConnection = mediaConnections[mc];
          hasTransferredCall = true;
          delete mediaConnections[mc];
        }
      } //set audio codec (Flash only)


      if (codec) {
        if (mediaProvider == "Flash") {
          mediaConnection.changeAudioCodec(codec.name);
        }

        return;
      } //set remote sdp


      if (sdp && sdp !== '') {
        sdp = sdpHookHandler(sdp, sdpHook);
        mediaConnection.setRemoteSdp(sdp, hasTransferredCall, id_).then(function () {});
        return;
      }

      var event = callInfo.status;
      status_ = event; //release call

      if (event == CALL_STATUS.FAILED || event == CALL_STATUS.FINISH || event == CALL_STATUS.BUSY) {
        delete calls[id_];
        delete callRefreshHandlers[id_];

        if (Object.keys(calls).length == 0) {
          if (mediaConnection) mediaConnection.close(cacheLocalResources);
        }
      } //fire call event


      if (callbacks[event]) {
        callbacks[event](call);
      }
    };
    /**
     * Initiate outgoing call.
     *
     * @throws {Error} Error if call status is not {@link Flashphoner.constants.CALL_STATUS.NEW}
     * @memberof Call
     * @name call
     * @inner
     */


    var call_ = function call_() {
      if (status_ !== CALL_STATUS.NEW) {
        throw new Error("Invalid call state");
      }

      status_ = CALL_STATUS.PENDING;
      var hasAudio = true; //get access to camera

      MediaProvider[mediaProvider].getMediaAccess(constraints, localDisplay, disableConstraintsNormalization).then(function () {
        if (status_ == CALL_STATUS.FAILED) {
          //call failed while we were waiting for media access, release media
          if (!cacheLocalResources) {
            releaseLocalMedia(localDisplay, mediaProvider);
          }

          return;
        } //create mediaProvider connection


        MediaProvider[mediaProvider].createConnection({
          id: id_,
          localDisplay: localDisplay,
          remoteDisplay: remoteDisplay,
          authToken: authToken,
          mainUrl: urlServer,
          flashProto: flashProto,
          flashPort: flashPort,
          bidirectional: true,
          login: login,
          constraints: constraints,
          connectionConfig: mediaOptions,
          audioOutputId: audioOutputId
        }).then(function (newConnection) {
          mediaConnection = newConnection;
          return mediaConnection.createOffer({
            sendAudio: true,
            sendVideo: true,
            receiveAudio: receiveAudio,
            receiveVideo: receiveVideo,
            stripCodecs: stripCodecs
          });
        }).then(function (offer) {
          send("call", {
            callId: id_,
            incoming: false,
            hasVideo: offer.hasVideo,
            hasAudio: offer.hasAudio,
            status: status_,
            mediaProvider: mediaProvider,
            sdp: offer.sdp,
            sipSDP: sipSDP,
            caller: login,
            callee: callee_,
            custom: options.custom,
            visibleName: visibleName_
          });
        });
      })["catch"](function (error) {
        logger.error(LOG_PREFIX, error);
        status_ = CALL_STATUS.FAILED;
        info_ = ERROR_INFO.LOCAL_ERROR;
        errorInfo_ = error.message;
        callRefreshHandlers[id_]({
          status: CALL_STATUS.FAILED
        });
        hangup();
      });
    };
    /**
     * Hangup call.
     *
     * @memberof Call
     * @inner
     */


    var hangup = function hangup() {
      if (status_ == CALL_STATUS.NEW) {
        callRefreshHandlers[id_]({
          status: CALL_STATUS.FAILED
        });
        return;
      } else if (status_ == CALL_STATUS.PENDING) {
        if (!cacheLocalResources) {
          releaseLocalMedia(localDisplay, mediaProvider);
        }

        callRefreshHandlers[id_]({
          status: CALL_STATUS.FAILED
        });

        if (options.incoming) {
          send("hangup", {
            callId: id_
          });
        }

        return;
      }

      send("hangup", {
        callId: id_
      }); //free media provider

      if (mediaConnection) {
        mediaConnection.close(cacheLocalResources);
      }
    };
    /**
     * @callback sdpHook
     * @param {Object} sdp Callback options
     * @param {String} sdp.sdpString Sdp from the server
     * @returns {String} sdp New sdp
     */

    /**
     * Answer incoming call.
     * @param {Object} answerOptions Call options
     * @param {HTMLElement} answerOptions.localVideoDisplay Div element local video should be displayed in
     * @param {HTMLElement} answerOptions.remoteVideoDisplay Div element remote video should be displayed in
     * @param {Boolean=} answerOptions.receiveAudio Receive audio
     * @param {Boolean=} answerOptions.receiveVideo Receive video
     * @param {String=} answerOptions.constraints Answer call with constraints
     * @param {Array<string>=} answerOptions.stripCodecs Array of codecs which should be stripped from SDP (WebRTC)
     * @param {Array<string>=} answerOptions.sipSDP Array of custom SDP params (ex. bandwidth (b=))
     * @param {Array<string>=} answerOptions.sipHeaders Array of custom SIP headers
     * @param {sdpHook} sdpHook The callback that handles sdp from the server
     * @throws {Error} Error if call status is not {@link Flashphoner.constants.CALL_STATUS.NEW}
     * @memberof Call
     * @name call
     * @inner
     */


    var answer = function answer(answerOptions) {
      if (status_ !== CALL_STATUS.NEW && status_ !== CALL_STATUS.RING) {
        throw new Error("Invalid call state");
      }

      localDisplay = answerOptions.localVideoDisplay;
      remoteDisplay = answerOptions.remoteVideoDisplay;
      constraints = answerOptions.constraints || getDefaultMediaConstraints();
      status_ = CALL_STATUS.PENDING;
      var sdp;
      var sdpHook = answerOptions.sdpHook;
      sipSDP = answerOptions.sipSDP;
      sipHeaders = answerOptions.sipHeaders;

      if (!remoteSdpCache[id_]) {
        logger.error(LOG_PREFIX, "No remote sdp available");
        throw new Error("No remote sdp available");
      } else {
        sdp = sdpHookHandler(remoteSdpCache[id_], sdpHook);
        delete remoteSdpCache[id_];
      }

      if (util.SDP.matchPrefix(sdp, "m=video").length == 0) {
        constraints.video = false;
      }

      var stripCodecs = answerOptions.stripCodecs || [];
      var hasAudio = true; //get access to camera

      MediaProvider[mediaProvider].getMediaAccess(constraints, localDisplay, disableConstraintsNormalization).then(function () {
        if (status_ == CALL_STATUS.FAILED) {
          //call failed while we were waiting for media access, release media
          if (!cacheLocalResources) {
            releaseLocalMedia(localDisplay, mediaProvider);
          }

          return;
        } //create mediaProvider connection


        MediaProvider[mediaProvider].createConnection({
          id: id_,
          localDisplay: localDisplay,
          remoteDisplay: remoteDisplay,
          authToken: authToken,
          mainUrl: urlServer,
          flashProto: flashProto,
          flashPort: flashPort,
          bidirectional: true,
          login: cConfig.sipLogin,
          constraints: constraints,
          connectionConfig: mediaOptions,
          audioOutputId: audioOutputId
        }).then(function (newConnection) {
          mediaConnection = newConnection;
          return mediaConnection.setRemoteSdp(sdp);
        }).then(function () {
          return mediaConnection.createAnswer({
            receiveAudio: options.receiveAudio,
            receiveVideo: options.receiveVideo,
            stripCodecs: stripCodecs
          });
        }).then(function (sdp) {
          if (status_ != CALL_STATUS.FINISH && status_ != CALL_STATUS.FAILED) {
            send("answer", {
              callId: id_,
              incoming: true,
              hasVideo: true,
              hasAudio: hasAudio,
              status: status_,
              mediaProvider: mediaProvider,
              sdp: sdp,
              sipSDP: sipSDP,
              caller: cConfig.login,
              callee: callee_,
              custom: options.custom
            });
          } else {
            hangup();
          }
        });
      })["catch"](function (error) {
        logger.error(LOG_PREFIX, error);
        info_ = ERROR_INFO.LOCAL_ERROR;
        errorInfo_ = error.message;
        status_ = CALL_STATUS.FAILED;
        callRefreshHandlers[id_]({
          status: CALL_STATUS.FAILED
        });
      });
    };
    /**
     * Get call status.
     *
     * @returns {string} One of {@link Flashphoner.constants.CALL_STATUS}
     * @memberof Call
     * @inner
     */


    var status = function status() {
      return status_;
    };
    /**
     * Get call id.
     *
     * @returns {string} Call id
     * @memberof Call
     * @inner
     */


    var id = function id() {
      return id_;
    };
    /**
     * Get caller id.
     *
     * @returns {string} Caller id
     * @memberof Call
     * @inner
     */


    var caller = function caller() {
      return caller_;
    };
    /**
     * Get callee id.
     *
     * @returns {string} Callee id
     * @memberof Call
     * @inner
     */


    var callee = function callee() {
      return callee_;
    };
    /**
     * Get caller visible name.
     *
     * @returns {string} Caller visible name
     * @memberof Call
     * @inner
     */


    var visibleName = function visibleName() {
      return visibleName_;
    };
    /**
     * Media controls
     */

    /**
     * Set other oupout audio device
     *
     * @param {string} id Id of output device
     * @memberof Call
     * @inner
     */


    var setAudioOutputId = function setAudioOutputId(id) {
      audioOutputId = id;

      if (mediaConnection && mediaConnection.setAudioOutputId) {
        return mediaConnection.setAudioOutputId(id);
      }
    };
    /**
     * Set volume of remote media
     *
     * @param {number} volume Volume between 0 and 100
     * @memberof Call
     * @inner
     */


    var setVolume = function setVolume(volume) {
      if (mediaConnection) {
        mediaConnection.setVolume(volume);
      }
    };
    /**
     * Get current volume
     *
     * @returns {number} Volume or -1 if audio is not available
     * @memberof Call
     * @inner
     */


    var getVolume = function getVolume() {
      if (mediaConnection) {
        return mediaConnection.getVolume();
      }

      return -1;
    };
    /**
     * Mute outgoing audio
     *
     * @memberof Call
     * @inner
     */


    var muteAudio = function muteAudio() {
      if (mediaConnection) {
        mediaConnection.muteAudio();
      }
    };
    /**
     * Unmute outgoing audio
     *
     * @memberof Call
     * @inner
     */


    var unmuteAudio = function unmuteAudio() {
      if (mediaConnection) {
        mediaConnection.unmuteAudio();
      }
    };
    /**
     * Check outgoing audio mute state
     *
     * @returns {boolean} True if audio is muted or not available
     * @memberof Call
     * @inner
     */


    var isAudioMuted = function isAudioMuted() {
      if (mediaConnection) {
        return mediaConnection.isAudioMuted();
      }

      return true;
    };
    /**
     * Mute outgoing video
     *
     * @memberof Call
     * @inner
     */


    var muteVideo = function muteVideo() {
      if (mediaConnection) {
        mediaConnection.muteVideo();
      }
    };
    /**
     * Unmute outgoing video
     *
     * @memberof Call
     * @inner
     */


    var unmuteVideo = function unmuteVideo() {
      if (mediaConnection) {
        mediaConnection.unmuteVideo();
      }
    };
    /**
     * Check outgoing video mute state
     *
     * @returns {boolean} True if video is muted or not available
     * @memberof Call
     * @inner
     */


    var isVideoMuted = function isVideoMuted() {
      if (mediaConnection) {
        return mediaConnection.isVideoMuted();
      }

      return true;
    };
    /**
     * @callback callbackFn
     * @param {Object} result
     */

    /**
     * Get statistics
     *
     * @param {callbackFn} callbackFn The callback that handles response
     * @param {Boolean} nativeStats  If true, use native browser statistics
     * @returns {Object} Call audio\video statistics
     * @memberof Call
     * @inner
     */


    var getStats = function getStats(callbackFn, nativeStats) {
      if (mediaConnection) {
        mediaConnection.getStats(callbackFn, nativeStats);
      }
    };
    /**
     * Place call on hold
     *
     * @memberof Call
     * @inner
     */


    var hold = function hold() {
      send("hold", {
        callId: id_
      });
    };
    /**
     * Place call on hold for transfer
     *
     * @memberof Call
     * @inner
     */


    var holdForTransfer = function holdForTransfer() {
      send("hold", {
        callId: id_,
        holdForTransfer: true
      });
    };
    /**
     * Unhold the call
     *
     * @memberof Call
     * @inner
     */


    var unhold = function unhold() {
      send("unhold", {
        callId: id_
      });
    };
    /**
     * Send DTMF
     *
     * @param {number} number Number
     * @param {string=} type DTMF Type (RFC2833, INFO, INFO_RELAY)
     * @memberof Call
     * @inner
     */


    var sendDTMF = function sendDTMF(number, type) {
      send("sendDtmf", {
        callId: id_,
        type: type || "RFC2833",
        dtmf: number
      });
    };
    /**
     * Transfer call
     *
     * @param {String} traget Transfer target
     * @memberof Call
     * @inner
     */


    var transfer = function transfer(target) {
      send("transfer", {
        callId: id_,
        target: target
      });
    };
    /**
     * Call event callback.
     *
     * @callback Call~eventCallback
     * @param {Call} call Call that corresponds to the event
     */

    /**
     * Add call event callback.
     *
     * @param {string} event One of {@link Flashphoner.constants.CALL_STATUS} events
     * @param {Call~eventCallback} callback Callback function
     * @returns {Call} Call callback was attached to
     * @throws {TypeError} Error if event is not specified
     * @throws {Error} Error if callback is not a valid function
     * @memberof Call
     * @inner
     */


    var on = function on(event, callback) {
      if (!event) {
        throw new TypeError("Event can't be null");
      }

      if (!callback || typeof callback !== 'function') {
        throw new Error("Callback needs to be a valid function");
      }

      callbacks[event] = callback;
      return call;
    };
    /**
     * Switch camera in real-time.
     * Works only with WebRTC
     *
     * @memberOf Call
     * @inner
     * @throws {Error} Error if call status is not {@link Flashphoner.constants.CALL_STATUS.ESTABLISHED} and not {@link Flashphoner.constants.CALL_STATUS.HOLD}
     */


    var switchCam = function switchCam(deviceId) {
      if (status_ !== CALL_STATUS.ESTABLISHED && !constraints.video && status_ !== CALL_STATUS.HOLD) {
        throw new Error('Invalid call state');
      }

      return mediaConnection.switchCam(deviceId);
    };
    /**
     * Switch mic in real-time.
     * Works only with WebRTC
     *
     * @memberOf Call
     * @inner
     * @throws {Error} Error if call status is not {@link Flashphoner.constants.CALL_STATUS.ESTABLISHED} and not {@link Flashphoner.constants.CALL_STATUS.HOLD}
     */


    var switchMic = function switchMic(deviceId) {
      if (status_ !== CALL_STATUS.ESTABLISHED && status_ !== CALL_STATUS.HOLD) {
        throw new Error('Invalid call state');
      }

      return mediaConnection.switchMic(deviceId);
    };
    /**
     * Switch to screen in real-time.
     * Works only with WebRTC
     *
     * @param {String} source Screen sharing source (for firefox)
     * @param {Boolean} woExtension Screen sharing without extension (for chrome)
     * @memberOf Call
     * @inner
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.PUBLISHING}
     */


    var switchToScreen = function switchToScreen(source, woExtension) {
      if (status_ !== CALL_STATUS.ESTABLISHED && status_ !== CALL_STATUS.HOLD) {
        throw new Error('Invalid call state');
      }

      return mediaConnection.switchToScreen(source, woExtension);
    };
    /**
     * Switch to cam in real-time.
     * Works only with WebRTC
     *
     * @memberOf Call
     * @inner
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.PUBLISHING}
     */


    var switchToCam = function switchToCam() {
      if (status_ !== CALL_STATUS.ESTABLISHED && status_ !== CALL_STATUS.HOLD) {
        throw new Error('Invalid call state');
      }

      mediaConnection.switchToCam();
    };
    /**
     * Get call info
     * @returns {string} Info
     * @memberof Stream
     * @inner
     */


    var getInfo = function getInfo() {
      return info_;
    };
    /**
     * Get stream error info
     * @returns {string} Error info
     * @memberof Stream
     * @inner
     */


    var getErrorInfo = function getErrorInfo() {
      return errorInfo_;
    };

    call.call = call_;
    call.answer = answer;
    call.hangup = hangup;
    call.id = id;
    call.getInfo = getInfo;
    call.getErrorInfo = getErrorInfo;
    call.status = status;
    call.getStats = getStats;
    call.setAudioOutputId = setAudioOutputId;
    call.setVolume = setVolume;
    call.getVolume = getVolume;
    call.muteAudio = muteAudio;
    call.unmuteAudio = unmuteAudio;
    call.isAudioMuted = isAudioMuted;
    call.muteVideo = muteVideo;
    call.unmuteVideo = unmuteVideo;
    call.isVideoMuted = isVideoMuted;
    call.caller = caller;
    call.callee = callee;
    call.visibleName = visibleName;
    call.hold = hold;
    call.holdForTransfer = holdForTransfer;
    call.unhold = unhold;
    call.sendDTMF = sendDTMF;
    call.transfer = transfer;
    call.on = on;
    call.switchCam = switchCam;
    call.switchMic = switchMic;
    call.switchToScreen = switchToScreen;
    call.switchToCam = switchToCam;
    calls[id_] = call;
    return call;
  };
  /**
   * @callback sdpHook
   * @param {Object} sdp Callback options
   * @param {String} sdp.sdpString Sdp from the server
   * @returns {String} sdp New sdp
   */

  /**
   * Create stream.
   *
   * @param {Object} options Stream options
   * @param {string} options.name Stream name
   * @param {Object=} options.constraints Stream constraints
   * @param {Boolean|Object} [options.constraints.audio=true] Specifies if published stream should have audio. Played stream always should have audio: the property should not be set to false in that case.
   * @param {string=} [options.constraints.audio.outputId] Set width to publish or play stream with this value
   * @param {Boolean|Object} [options.constraints.video=true] Specifies if published or played stream should have video, or sets video constraints
   * @param {Integer} [options.constraints.video.width=0] Set width to publish or play stream with this value
   * @param {Integer} [options.constraints.video.height=0] Set height to publish or play stream with this value
   * @param {Integer} [options.constraints.video.bitrate=0] DEPRECATED FOR PUBLISH: Set bitrate to publish or play stream with this value
   * @param {Integer} [options.constraints.video.minBitrate=0] Set minimal bitrate to publish stream with this value
   * @param {Integer} [options.constraints.video.maxBitrate=0] Set maximal bitrate to publish stream with this value
   * @param {Integer} [options.constraints.video.quality=0] Set quality to play stream with this value
   * @param {MediaStream} [options.constraints.customStream] Set a MediaStream  for publish stream from canvas.
   * @param {Boolean=} options.receiveAudio DEPRECATED: Receive audio
   * @param {Boolean=} options.receiveVideo DEPRECATED: Receive video
   * @param {Integer=} options.playWidth DEPRECATED: Set width to play stream with this value
   * @param {Integer=} options.playHeight DEPRECATED: Set height to play stream with this value
   * @param {string=} options.mediaProvider MediaProvider type to use with this stream
   * @param {Boolean} [options.record=false] Enable stream recording
   * @param {Boolean=} options.cacheLocalResources Display will contain local video after stream release
   * @param {HTMLElement} options.display Div element stream should be displayed in
   * @param {Object=} options.custom User provided custom object that will be available in REST App code
   * @param {Integer} [options.flashBufferTime=0] Specifies how long to buffer messages before starting to display the stream (Flash-only)
   * @param {Array<string>=} options.stripCodecs Array of codecs which should be stripped from SDP (WebRTC)
   * @param {string=} options.rtmpUrl Rtmp url stream should be forwarded to
   * @param {Object=} options.mediaConnectionConstraints Stream specific constraints for underlying RTCPeerConnection
   * @param {Boolean=} options.flashShowFullScreenButton Show full screen button in flash
   * @param {string=} options.transport Transport to be used by server for WebRTC media, {@link Flashphoner.constants.TRANSPORT_TYPE}
   * @param {Boolean=} options.cvoExtension Enable rtp video orientation extension
   * @param {Integer=} options.playoutDelay Time delay between network reception of media and playout
   * @param {sdpHook} sdpHook The callback that handles sdp from the server
   * @returns {Stream} Stream
   * @throws {TypeError} Error if no options provided
   * @throws {TypeError} Error if options.name is not specified
   * @throws {Error} Error if session state is not ESTABLISHED
   * @memberof Session
   * @inner
   */


  var createStream = function createStream(options) {
    //Array to transmit promises from stream.available() to streamRefreshHandlers
    var availableCallbacks = []; //check session state

    if (sessionStatus !== SESSION_STATUS.ESTABLISHED) {
      throw new Error('Invalid session state');
    } //check options


    if (!options) {
      throw new TypeError("options must be provided");
    }

    if (!options.name) {
      throw new TypeError("options.name must be provided");
    }

    var clientKf = new KalmanFilter();
    var serverKf = new KalmanFilter();
    var id_ = uuid_v1();
    var name_ = options.name;
    var mediaProvider = options.mediaProvider || getMediaProviders()[0];
    var mediaConnection;
    var display = options.display; // Constraints

    if (options.constraints && Object.keys(options.constraints).length != 0) {
      var constraints = options.constraints;
    }

    if (options.disableConstraintsNormalization) {
      var disableConstraintsNormalization = options.disableConstraintsNormalization;
    }

    var mediaConnectionConstraints = options.mediaConnectionConstraints; // Receive media

    var receiveAudio;
    var audioOutputId;
    var audioProperty = getConstraintsProperty(constraints, "audio", undefined);

    if (typeof audioProperty === 'boolean') {
      receiveAudio = audioProperty;
    } else if (_typeof(audioProperty) === 'object') {
      receiveAudio = true;

      var _stereo = getConstraintsProperty(audioProperty, "stereo", 0);

      var _bitrate = getConstraintsProperty(audioProperty, "bitrate", 0);

      var _fec = getConstraintsProperty(audioProperty, "fec", 0);

      audioOutputId = getConstraintsProperty(audioProperty, "outputId", 0);
      var _codecOptions = "";
      if (_bitrate) _codecOptions += "maxaveragebitrate=" + _bitrate + ";";
      if (_stereo) _codecOptions += "stereo=1;sprop-stereo=1;";
      if (_fec) _codecOptions += "useinbandfec=1;";
    } else {
      receiveAudio = typeof options.receiveAudio !== 'undefined' ? options.receiveAudio : true;
    }

    var receiveVideo;
    var videoProperty = getConstraintsProperty(constraints, "video", undefined);

    if (typeof videoProperty === 'boolean') {
      receiveVideo = videoProperty;
    } else if (_typeof(videoProperty) === 'object') {
      receiveVideo = true;
    } else {
      receiveVideo = typeof options.receiveVideo !== 'undefined' ? options.receiveVideo : true;
    } // Bitrate


    var bitrate = getConstraintsProperty(constraints, "video.bitrate", 0);
    var minBitrate = getConstraintsProperty(constraints, "video.minBitrate", 0);
    var maxBitrate = getConstraintsProperty(constraints, "video.maxBitrate", 0); // Quality

    var quality = getConstraintsProperty(constraints, "video.quality", 0);
    if (quality > 100) quality = 100; // Play resolution

    var playWidth = typeof options.playWidth !== 'undefined' ? options.playWidth : getConstraintsProperty(constraints, "video.width", 0);
    var playHeight = typeof options.playHeight !== 'undefined' ? options.playHeight : getConstraintsProperty(constraints, "video.height", 0);
    var stripCodecs = options.stripCodecs || [];
    var resolution = {};
    var published_ = false;
    var record_ = options.record || false;
    var recordFileName = null;
    var cacheLocalResources = options.cacheLocalResources;
    var status_ = STREAM_STATUS.NEW;
    var rtmpUrl = options.rtmpUrl;
    var info_;
    var errorInfo_;
    var remoteBitrate = -1;
    var networkBandwidth = -1;
    var sdpHook = options.sdpHook;
    var transportType = options.transport;
    var cvoExtension = options.cvoExtension;
    var remoteVideo = options.remoteVideo; //callbacks added using stream.on()

    var callbacks = {};
    var playoutDelay = options.playoutDelay;
    var connectionQuality;
    var videoBytes = 0;
    /**
     * Represents media stream.
     *
     * @namespace Stream
     * @see Session~createStream
     */

    var stream = {};

    streamRefreshHandlers[id_] = function (streamInfo, sdp) {
      //set remote sdp
      if (sdp && sdp !== '') {
        var _sdp = sdp;
        if (_codecOptions) _sdp = util.SDP.writeFmtp(sdp, _codecOptions, "opus");
        _sdp = sdpHookHandler(_sdp, sdpHook);
        mediaConnection.setRemoteSdp(_sdp).then(function () {});
        return;
      }

      if (streamInfo.available != undefined) {
        for (var i = 0; i < availableCallbacks.length; i++) {
          if (streamInfo.available == "true") {
            availableCallbacks[i].resolve(stream);
          } else {
            availableCallbacks[i].reject(stream);
          }
        }

        availableCallbacks = [];
        return;
      }

      var event = streamInfo.status;

      if (event == INBOUND_VIDEO_RATE || event == OUTBOUND_VIDEO_RATE) {
        detectConnectionQuality(event, streamInfo);
        return;
      }

      if (event == STREAM_STATUS.RESIZE) {
        resolution.width = streamInfo.streamerVideoWidth;
        resolution.height = streamInfo.streamerVideoHeight;
      } else if (event == STREAM_STATUS.SNAPSHOT_COMPLETE) {} else if (event == STREAM_STATUS.NOT_ENOUGH_BANDWIDTH) {
        var info = streamInfo.info.split("/");
        remoteBitrate = info[0];
        networkBandwidth = info[1];
      } else {
        status_ = event;
      }

      if (streamInfo.info) info_ = streamInfo.info; //release stream

      if (event == STREAM_STATUS.FAILED || event == STREAM_STATUS.STOPPED || event == STREAM_STATUS.UNPUBLISHED) {
        delete streams[id_];
        delete streamRefreshHandlers[id_];

        if (mediaConnection) {
          mediaConnection.close(cacheLocalResources);
        }
      }

      if (record_ && typeof streamInfo.recordName !== 'undefined') {
        recordFileName = streamInfo.recordName;
      } //fire stream event


      if (callbacks[event]) {
        callbacks[event](stream);
      }
    };

    var detectConnectionQuality = function detectConnectionQuality(event, streamInfo) {
      if (disableConnectionQualityCalculation) {
        return;
      }

      mediaConnection.getStats(function (stats) {
        var bytesSentReceived = 0;

        if (stats) {
          if (event == OUTBOUND_VIDEO_RATE && stats.inboundStream && stats.inboundStream.video && stats.inboundStream.video.bytesReceived > 0) {
            bytesSentReceived = stats.inboundStream.video.bytesReceived;
          } else if (stats.outboundStream && stats.outboundStream.video && stats.outboundStream.video.bytesSent > 0) {
            bytesSentReceived = stats.outboundStream.video.bytesSent;
          } else {
            return;
          }
        }

        if (!videoBytes) {
          videoBytes = bytesSentReceived;
          return;
        }

        var currentVideoRate = (bytesSentReceived - videoBytes) * 8;

        if (currentVideoRate == 0) {
          return;
        }

        var clientFiltered = clientKf.filter(currentVideoRate);
        var serverFiltered = serverKf.filter(streamInfo.videoRate);
        var videoRateDifference = Math.abs((serverFiltered - clientFiltered) / ((serverFiltered + clientFiltered) / 2)) * 100;
        var currentQuality;

        if (serverFiltered < LOW_VIDEO_RATE_THRESHOLD_BAD_PERFECT || clientFiltered < LOW_VIDEO_RATE_THRESHOLD_BAD_PERFECT) {
          if (videoRateDifference > LOW_VIDEO_RATE_BAD_QUALITY_PERCENT_DIFFERENCE) {
            currentQuality = CONNECTION_QUALITY.BAD;
          } else {
            currentQuality = CONNECTION_QUALITY.PERFECT;
          }
        } else {
          if (videoRateDifference > VIDEO_RATE_BAD_QUALITY_PERCENT_DIFFERENCE) {
            currentQuality = CONNECTION_QUALITY.BAD;
          } else if (videoRateDifference > VIDEO_RATE_GOOD_QUALITY_PERCENT_DIFFERENCE) {
            currentQuality = CONNECTION_QUALITY.GOOD;
          } else {
            currentQuality = CONNECTION_QUALITY.PERFECT;
          }
        }

        if (callbacks[CONNECTION_QUALITY.UPDATE]) {
          connectionQuality = currentQuality;
          callbacks[CONNECTION_QUALITY.UPDATE](connectionQuality, clientFiltered, serverFiltered);
        }

        videoBytes = bytesSentReceived;
      });
      return;
    };
    /**
     * Play stream.
     *
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.NEW}
     * @memberof Stream
     * @inner
     */


    var play = function play() {
      logger.debug(LOG_PREFIX, "Play stream " + name_);

      if (status_ !== STREAM_STATUS.NEW) {
        throw new Error("Invalid stream state");
      }

      status_ = STREAM_STATUS.PENDING; //create mediaProvider connection

      MediaProvider[mediaProvider].createConnection({
        id: id_,
        display: display,
        authToken: authToken,
        mainUrl: urlServer,
        flashProto: flashProto,
        flashPort: flashPort,
        flashBufferTime: options.flashBufferTime || 0,
        flashShowFullScreenButton: options.flashShowFullScreenButton || false,
        connectionConfig: mediaOptions,
        connectionConstraints: mediaConnectionConstraints,
        audioOutputId: audioOutputId,
        remoteVideo: remoteVideo,
        playoutDelay: playoutDelay
      }, streamRefreshHandlers[id_]).then(function (newConnection) {
        mediaConnection = newConnection;

        try {
          streamRefreshHandlers[id_]({
            status: status_
          });
        } catch (e) {
          console.warn(e);
        }

        return mediaConnection.createOffer({
          receiveAudio: receiveAudio,
          receiveVideo: receiveVideo,
          stripCodecs: stripCodecs
        });
      }).then(function (offer) {
        logger.debug(LOG_PREFIX, "Offer SDP:\n" + offer.sdp); //request stream with offer sdp from server

        send("playStream", {
          mediaSessionId: id_,
          name: name_,
          published: published_,
          hasVideo: true,
          hasAudio: true,
          status: status_,
          record: false,
          width: playWidth,
          height: playHeight,
          mediaProvider: mediaProvider,
          sdp: offer.sdp,
          custom: options.custom,
          bitrate: bitrate,
          minBitrate: minBitrate,
          maxBitrate: maxBitrate,
          quality: quality,
          constraints: constraints,
          transport: transportType,
          cvoExtension: cvoExtension
        });

        if (offer.player) {
          offer.player.play(id_);
        }
      })["catch"](function (error) {
        //todo fire stream failed status
        throw error;
      });
    };
    /**
     * Publish stream.
     *
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.NEW}
     * @memberof Stream
     * @inner
     */


    var publish = function publish() {
      logger.debug(LOG_PREFIX, "Publish stream " + name_);

      if (status_ !== STREAM_STATUS.NEW) {
        throw new Error("Invalid stream state");
      }

      status_ = STREAM_STATUS.PENDING;
      published_ = true;
      var hasAudio = true;

      if (constraints && constraints.video && constraints.video.type && constraints.video.type == "screen") {
        hasAudio = false;
      } //get access to camera


      MediaProvider[mediaProvider].getMediaAccess(constraints, display, disableConstraintsNormalization).then(function () {
        if (status_ == STREAM_STATUS.FAILED) {
          //stream failed while we were waiting for media access, release media
          if (!cacheLocalResources) {
            releaseLocalMedia(display, mediaProvider);
          }

          return;
        } //create mediaProvider connection


        MediaProvider[mediaProvider].createConnection({
          id: id_,
          display: display,
          authToken: authToken,
          mainUrl: urlServer,
          flashProto: flashProto,
          flashPort: flashPort,
          constraints: constraints,
          connectionConfig: mediaOptions,
          connectionConstraints: mediaConnectionConstraints,
          customStream: constraints && constraints.customStream ? constraints.customStream : false
        }).then(function (newConnection) {
          mediaConnection = newConnection;
          return mediaConnection.createOffer({
            stripCodecs: stripCodecs
          });
        }).then(function (offer) {
          logger.debug(LOG_PREFIX, "Offer SDP:\n" + offer.sdp); //publish stream with offer sdp to server

          send("publishStream", {
            mediaSessionId: id_,
            name: name_,
            published: published_,
            hasVideo: offer.hasVideo,
            hasAudio: offer.hasAudio,
            status: status_,
            record: record_,
            mediaProvider: mediaProvider,
            sdp: offer.sdp,
            custom: options.custom,
            bitrate: bitrate,
            minBitrate: minBitrate,
            maxBitrate: maxBitrate,
            rtmpUrl: rtmpUrl,
            constraints: constraints,
            transport: transportType,
            cvoExtension: cvoExtension
          });
        });
      })["catch"](function (error) {
        logger.warn(LOG_PREFIX, error);
        info_ = ERROR_INFO.LOCAL_ERROR;
        errorInfo_ = error.message;
        status_ = STREAM_STATUS.FAILED; //fire stream event

        if (callbacks[status_]) {
          callbacks[status_](stream);
        }
      });
    };
    /**
     * Switch camera in real-time.
     * Works only with WebRTC
     *
     * @memberOf Stream
     * @inner
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.PUBLISHING}
     */


    var switchCam = function switchCam(deviceId) {
      if (status_ !== STREAM_STATUS.PUBLISHING) {
        throw new Error('Invalid stream state');
      }

      return mediaConnection.switchCam(deviceId);
    };
    /**
     * Switch microphone in real-time.
     * Works only with WebRTC
     *
     * @memberOf Stream
     * @inner
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.PUBLISHING}
     */


    var switchMic = function switchMic(deviceId) {
      if (status_ !== STREAM_STATUS.PUBLISHING) {
        throw new Error('Invalid stream state');
      }

      return mediaConnection.switchMic(deviceId);
    };
    /**
     * Switch to screen in real-time.
     * Works only with WebRTC
     *
     * @param {String} source Screen sharing source (for firefox)
     * @param {Boolean} woExtension Screen sharing without extension (for chrome)
     * @memberOf Stream
     * @inner
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.PUBLISHING}
     */


    var switchToScreen = function switchToScreen(source, woExtension) {
      if (status_ !== STREAM_STATUS.PUBLISHING) {
        throw new Error('Invalid stream state');
      }

      return mediaConnection.switchToScreen(source, woExtension);
    };
    /**
     * Switch to cam in real-time.
     * Works only with WebRTC
     *
     * @memberOf Stream
     * @inner
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.PUBLISHING}
     */


    var switchToCam = function switchToCam() {
      if (status_ !== STREAM_STATUS.PUBLISHING) {
        throw new Error('Invalid stream state');
      }

      mediaConnection.switchToCam();
    };
    /**
     * Unmute remote audio
     *
     * @memberOf Stream
     * @inner
     */


    var unmuteRemoteAudio = function unmuteRemoteAudio() {
      if (mediaConnection && mediaProvider != 'Flash') {
        mediaConnection.unmuteRemoteAudio();
      }
    };
    /**
     * Mute remote audio
     *
     * @memberOf Stream
     * @inner
     */


    var muteRemoteAudio = function muteRemoteAudio() {
      if (mediaConnection && mediaProvider != 'Flash') {
        mediaConnection.muteRemoteAudio();
      }
    };
    /**
     * Is remote audio muted
     *
     * @memberOf Stream
     * @inner
     */


    var isRemoteAudioMuted = function isRemoteAudioMuted() {
      if (mediaConnection && mediaProvider != 'Flash') {
        return mediaConnection.isRemoteAudioMuted();
      }

      return false;
    };
    /**
     * Set Microphone Gain
     *
     * @memberOf Stream
     * @inner
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.PUBLISHING}
     */


    var setMicrophoneGain = function setMicrophoneGain(volume) {
      if (status_ !== STREAM_STATUS.PUBLISHING) {
        throw new Error('Invalid stream state');
      }

      mediaConnection.setMicrophoneGain(volume);
    };
    /**
     * Stop stream.
     *
     * @memberof Stream
     * @inner
     */


    var stop = function stop() {
      logger.debug(LOG_PREFIX, "Stop stream " + name_);

      if (status_ == STREAM_STATUS.NEW) {
        //trigger FAILED status
        streamRefreshHandlers[id_]({
          status: STREAM_STATUS.FAILED
        });
        return;
      } else if (status_ == STREAM_STATUS.PENDING) {
        logger.warn(LOG_PREFIX, "Stopping stream before server response " + id_);
        setTimeout(stop, 200);
        return;
      } else if (status_ == STREAM_STATUS.FAILED) {
        logger.warn(LOG_PREFIX, "Stream status FAILED");
        return;
      }

      if (published_) {
        send("unPublishStream", {
          mediaSessionId: id_,
          name: name_,
          published: published_,
          hasVideo: true,
          hasAudio: true,
          status: status_,
          record: false
        });
      } else {
        send("stopStream", {
          mediaSessionId: id_,
          name: name_,
          published: published_,
          hasVideo: true,
          hasAudio: true,
          status: status_,
          record: false
        });
      } //free media provider


      if (mediaConnection) {
        mediaConnection.close(cacheLocalResources);
      }
    };
    /**
     * Request remote stream snapshot.
     * @throws {Error} Error if stream status is not {@link Flashphoner.constants.STREAM_STATUS.NEW}
     * @memberof Stream
     * @inner
     */


    var snapshot = function snapshot() {
      logger.debug(LOG_PREFIX, "Request snapshot, stream " + name_);

      if (status_ !== STREAM_STATUS.NEW && status_ !== STREAM_STATUS.PLAYING && status_ !== STREAM_STATUS.PUBLISHING) {
        throw new Error("Invalid stream state");
      }

      send("snapshot", {
        name: name_,
        mediaSessionId: id_
      });
    };
    /**
     * Get stream status.
     *
     * @returns {string} One of {@link Flashphoner.constants.STREAM_STATUS}
     * @memberof Stream
     * @inner
     */


    var status = function status() {
      return status_;
    };
    /**
     * Get stream id.
     *
     * @returns {string} Stream id
     * @memberof Stream
     * @inner
     */


    var id = function id() {
      return id_;
    };
    /**
     * Get stream name.
     *
     * @returns {string} Stream name
     * @memberof Stream
     * @inner
     */


    var name = function name() {
      return name_;
    };
    /**
     * Is stream published.
     *
     * @returns {Boolean} True if stream published, otherwise false
     * @memberof Stream
     * @inner
     */


    var published = function published() {
      return published_;
    };
    /**
     * Get record file name
     * @returns {string} File name
     * @memberof Stream
     * @inner
     */


    var getRecordInfo = function getRecordInfo() {
      return recordFileName;
    };
    /**
     * Get stream info
     * @returns {string} Info
     * @memberof Stream
     * @inner
     */


    var getInfo = function getInfo() {
      return info_;
    };
    /**
     * Get stream error info
     * @returns {string} Error info
     * @memberof Stream
     * @inner
     */


    var getErrorInfo = function getErrorInfo() {
      return errorInfo_;
    };
    /**
     * Get stream video size
     * @returns {Object} Video size
     * @memberof Stream
     * @inner
     */


    var videoResolution = function videoResolution() {
      if (!published_) {
        return resolution;
      } else {
        throw new Error("This function available only on playing stream");
      }
    };
    /**
     * Media controls
     */

    /**
     * Set other oupout audio device
     *
     * @param {string} id Id of output device
     * @memberof Call
     * @inner
     */


    var setAudioOutputId = function setAudioOutputId(id) {
      audioOutputId = id;

      if (mediaConnection && mediaConnection.setAudioOutputId) {
        return mediaConnection.setAudioOutputId(id);
      }
    };
    /**
     * Set volume of remote media
     *
     * @param {number} volume Volume between 0 and 100
     * @memberof Stream
     * @inner
     */


    var setVolume = function setVolume(volume) {
      if (mediaConnection) {
        mediaConnection.setVolume(volume);
      }
    };
    /**
     * Get current volume
     *
     * @returns {number} Volume or -1 if audio is not available
     * @memberof Stream
     * @inner
     */


    var getVolume = function getVolume() {
      if (mediaConnection) {
        return mediaConnection.getVolume();
      }

      return -1;
    };
    /**
     * Mute outgoing audio
     *
     * @memberof Stream
     * @inner
     */


    var muteAudio = function muteAudio() {
      if (mediaConnection) {
        mediaConnection.muteAudio();
      }
    };
    /**
     * Unmute outgoing audio
     *
     * @memberof Stream
     * @inner
     */


    var unmuteAudio = function unmuteAudio() {
      if (mediaConnection) {
        mediaConnection.unmuteAudio();
      }
    };
    /**
     * Check outgoing audio mute state
     *
     * @returns {boolean} True if audio is muted or not available
     * @memberof Stream
     * @inner
     */


    var isAudioMuted = function isAudioMuted() {
      if (mediaConnection) {
        return mediaConnection.isAudioMuted();
      }

      return true;
    };
    /**
     * Mute outgoing video
     *
     * @memberof Stream
     * @inner
     */


    var muteVideo = function muteVideo() {
      if (mediaConnection) {
        mediaConnection.muteVideo();
      }
    };
    /**
     * Unmute outgoing video
     *
     * @memberof Stream
     * @inner
     */


    var unmuteVideo = function unmuteVideo() {
      if (mediaConnection) {
        mediaConnection.unmuteVideo();
      }
    };
    /**
     * Check outgoing video mute state
     *
     * @returns {boolean} True if video is muted or not available
     * @memberof Stream
     * @inner
     */


    var isVideoMuted = function isVideoMuted() {
      if (mediaConnection) {
        return mediaConnection.isVideoMuted();
      }

      return true;
    };
    /**
     * Get statistics
     *
     * @param {callbackFn} callbackFn The callback that handles response
     * @param {Boolean} nativeStats If true, use native browser statistics
     * @returns {Object} Stream audio\video statistics
     * @memberof Stream
     * @inner
     */


    var getStats = function getStats(callbackFn, nativeStats) {
      if (mediaConnection) {
        mediaConnection.getStats(callbackFn, nativeStats);
      }
    };
    /**
     * Get remote bitrate reported by server, works only for subscribe Stream
     *
     * @returns {number} Remote bitrate in bps or -1
     * @memberof Stream
     * @inner
     */


    var getRemoteBitrate = function getRemoteBitrate() {
      return remoteBitrate;
    };
    /**
     * Get network bandwidth reported by server, works only for subscribe Stream
     *
     * @returns {number} Network bandwidth in bps or -1
     * @memberof Stream
     * @inner
     */


    var getNetworkBandwidth = function getNetworkBandwidth() {
      return networkBandwidth;
    };
    /**
     * Request full screen for player stream
     * @memberof Stream
     * @inner
     */


    var fullScreen = function fullScreen() {
      if (published()) {
        logger.warn(LOG_PREFIX, "Full screen is allowed only for played streams");
      } else {
        if (mediaConnection) mediaConnection.fullScreen();
      }
    };
    /**
     * Stream event callback.
     *
     * @callback Stream~eventCallback
     * @param {Stream} stream Stream that corresponds to the event
     */

    /**
     * Add stream event callback.
     *
     * @param {string} event One of {@link Flashphoner.constants.STREAM_STATUS} events
     * @param {Stream~eventCallback} callback Callback function
     * @returns {Stream} Stream callback was attached to
     * @throws {TypeError} Error if event is not specified
     * @throws {Error} Error if callback is not a valid function
     * @memberof Stream
     * @inner
     */


    var on = function on(event, callback) {
      if (!event) {
        throw new TypeError("Event can't be null");
      }

      if (!callback || typeof callback !== 'function') {
        throw new Error("Callback needs to be a valid function");
      }

      callbacks[event] = callback;
      return stream;
    };
    /**
     * Сhecks the availability of stream on the server
     *
     * @returns {Promise} Resolves if is stream available, otherwise rejects
     * @memberof Stream
     * @inner
     */


    var available = function available() {
      return new Promise(function (resolve, reject) {
        send("availableStream", {
          mediaSessionId: id_,
          name: name_
        });
        var promise = {};
        promise.resolve = resolve;
        promise.reject = reject;
        availableCallbacks.push(promise);
      });
    };

    stream.play = play;
    stream.publish = publish;
    stream.stop = stop;
    stream.id = id;
    stream.status = status;
    stream.name = name;
    stream.published = published;
    stream.getRecordInfo = getRecordInfo;
    stream.getInfo = getInfo;
    stream.getErrorInfo = getErrorInfo;
    stream.videoResolution = videoResolution;
    stream.setAudioOutputId = setAudioOutputId;
    stream.setVolume = setVolume;
    stream.unmuteRemoteAudio = unmuteRemoteAudio;
    stream.muteRemoteAudio = muteRemoteAudio;
    stream.isRemoteAudioMuted = isRemoteAudioMuted;
    stream.setMicrophoneGain = setMicrophoneGain;
    stream.getVolume = getVolume;
    stream.muteAudio = muteAudio;
    stream.unmuteAudio = unmuteAudio;
    stream.isAudioMuted = isAudioMuted;
    stream.muteVideo = muteVideo;
    stream.unmuteVideo = unmuteVideo;
    stream.isVideoMuted = isVideoMuted;
    stream.getStats = getStats;
    stream.snapshot = snapshot;
    stream.getNetworkBandwidth = getNetworkBandwidth;
    stream.getRemoteBitrate = getRemoteBitrate;
    stream.fullScreen = fullScreen;
    stream.on = on;
    stream.available = available;
    stream.switchCam = switchCam;
    stream.switchMic = switchMic;
    stream.switchToScreen = switchToScreen;
    stream.switchToCam = switchToCam;
    streams[id_] = stream;
    return stream;
  };
  /**
   * Disconnect session.
   *
   * @memberof Session
   * @inner
   */


  var disconnect = function disconnect() {
    if (wsConnection) {
      wsConnection.close();
    }
  };
  /**
   * Get session id
   *
   * @returns {string} session id
   * @memberof Session
   * @inner
   */


  var id = function id() {
    return id_;
  };
  /**
   * Get server address
   *
   * @returns {string} Server url
   * @memberof Session
   * @inner
   */


  var getServerUrl = function getServerUrl() {
    return urlServer;
  };
  /**
   * Get session status
   *
   * @returns {string} One of {@link Flashphoner.constants.SESSION_STATUS}
   * @memberof Session
   * @inner
   */


  var status = function status() {
    return sessionStatus;
  };
  /**
   * Get stream by id.
   *
   * @param {string} streamId Stream id
   * @returns {Stream} Stream
   * @memberof Session
   * @inner
   */


  var getStream = function getStream(streamId) {
    return streams[streamId];
  };
  /**
   * Get streams.
   *
   * @returns {Array<Stream>} Streams
   * @memberof Session
   * @inner
   */


  var getStreams = function getStreams() {
    return util.copyObjectToArray(streams);
  };
  /**
   * Submit bug report.
   *
   * @param {Object} reportObject Report object
   * @memberof Session
   * @inner
   */


  var submitBugReport = function submitBugReport(reportObject) {
    send("submitBugReport", reportObject);
  };
  /**
   * Start session debug
   * @memberof Session
   * @inner
   */


  var startDebug = function startDebug() {
    logger.setPushLogs(true);
    logger.setLevel("DEBUG");
    send("sessionDebug", {
      command: "start"
    });
  };
  /**
   * Stop session debug
   * @memberof Session
   * @inner
   */


  var stopDebug = function stopDebug() {
    logger.setLevel("INFO");
    send("sessionDebug", {
      command: "stop"
    });
  };
  /**
   * Session event callback.
   *
   * @callback Session~eventCallback
   * @param {Session} session Session that corresponds to the event
   */

  /**
   * Add session event callback.
   *
   * @param {string} event One of {@link Flashphoner.constants.SESSION_STATUS} events
   * @param {Session~eventCallback} callback Callback function
   * @returns {Session} Session
   * @throws {TypeError} Error if event is not specified
   * @throws {Error} Error if callback is not a valid function
   * @memberof Session
   * @inner
   */


  var on = function on(event, callback) {
    if (!event) {
      throw new Error("Event can't be null", "TypeError");
    }

    if (!callback || typeof callback !== 'function') {
      throw new Error("Callback needs to be a valid function");
    }

    callbacks[event] = callback;
    return session;
  };

  var restAppCommunicator = function () {
    var pending = {};
    var exports = {};
    /**
     * Send data to REST App
     *
     * @param {Object} data Object to send
     * @returns {Promise} Resolves if data accepted, otherwise rejects
     * @memberof Session
     * @name sendData
     * @method
     * @inner
     */

    exports.sendData = function (data) {
      return new Promise(function (resolve, reject) {
        var obj = {
          operationId: uuid_v1(),
          payload: data
        };
        pending[obj.operationId] = {
          FAILED: function FAILED(info) {
            reject(info);
          },
          ACCEPTED: function ACCEPTED(info) {
            resolve(info);
          }
        };
        send("sendData", obj);
      });
    };

    exports.resolveData = function (data) {
      if (pending[data.operationId]) {
        var handler = pending[data.operationId];
        delete pending[data.operationId];
        delete data.operationId;
        handler[data.status](data);
      }
    };

    return exports;
  }();

  var sdpHookHandler = function sdpHookHandler(sdp, sdpHook) {
    if (sdpHook != undefined && typeof sdpHook == 'function') {
      var sdpObject = {
        sdpString: sdp
      };
      var newSdp = sdpHook(sdpObject);

      if (newSdp != null && newSdp != "") {
        return newSdp;
      }

      return sdp;
    }

    return sdp;
  }; //export Session


  session.id = id;
  session.status = status;
  session.getServerUrl = getServerUrl;
  session.createStream = createStream;
  session.createCall = createCall;
  session.getStream = getStream;
  session.getStreams = getStreams;
  session.sendData = restAppCommunicator.sendData;
  session.disconnect = disconnect;
  session.submitBugReport = submitBugReport;
  session.startDebug = startDebug;
  session.stopDebug = stopDebug;
  session.on = on; //save interface to global map

  sessions[id_] = session;
  return session;
};

var isUsingTemasys = function isUsingTemasys() {
  return isUsingTemasysPlugin;
};

module.exports = {
  init: init,
  isUsingTemasys: isUsingTemasys,
  getMediaProviders: getMediaProviders,
  getMediaDevices: getMediaDevices,
  getMediaAccess: getMediaAccess,
  releaseLocalMedia: releaseLocalMedia,
  getSessions: getSessions,
  getSession: getSession,
  createSession: createSession,
  playFirstSound: playFirstSound,
  playFirstVideo: playFirstVideo,
  getLogger: getLogger,
  roomApi: require('./room-module'),
  constants: constants,

  /**
   * The Screensharing whitelist is no longer needed to share your screen or windows starting Firefox 52
   * https://wiki.mozilla.org/Screensharing
   */
  firefoxScreenSharingExtensionInstalled: true
};

},{"./constants":26,"./flash-media-provider":1,"./media-source-media-provider":1,"./room-module":28,"./temasys-media-provider":1,"./util":29,"./webrtc-media-provider":30,"./websocket-media-provider":1,"kalmanjs":2,"promise-polyfill":4,"uuid/v1":10,"webrtc-adapter":11}],28:[function(require,module,exports){
'use strict';

var SESSION_STATUS = require('./constants').SESSION_STATUS;

var STREAM_STATUS = require('./constants').STREAM_STATUS;

var Promise = require('promise-polyfill');

var util = require('./util');

var uuid_v1 = require('uuid/v1');

var ROOM_REST_APP = "roomApp";
/**
 * Room api based on core api
 *
 * @namespace roomApi
 */

/**
 * Initialize connection
 *
 * @param {Object} options session options
 * @param {String} options.urlServer Server address in form of [ws,wss]://host.domain:port
 * @param {String} options.username Username to login with
 * @returns {roomApi.Session}
 * @memberof roomApi
 * @method connect
 */

var appSession = function appSession(options) {
  /**
   * Represents connection to room api app
   *
   * @namespace roomApi.Session
   */
  var callbacks = {};
  var rooms = {};
  var username_ = options.username;
  var exports;
  var roomHandlers = {};
  var session = Flashphoner.createSession({
    urlServer: options.urlServer,
    mediaOptions: options.mediaOptions,
    appKey: options.appKey && options.appKey.length != 0 ? options.appKey : ROOM_REST_APP,
    custom: {
      login: options.username,
      token: options.token
    }
  }).on(SESSION_STATUS.ESTABLISHED, function (session) {
    if (callbacks[session.status()]) {
      callbacks[session.status()](exports);
    }
  }).on(SESSION_STATUS.APP_DATA, function (data) {
    if (roomHandlers[data.payload.roomName]) {
      roomHandlers[data.payload.roomName](data.payload);
    } else {
      console.warn("Failed to find room");
    }
  }).on(SESSION_STATUS.DISCONNECTED, sessionDied).on(SESSION_STATUS.FAILED, sessionDied); //teardown helper

  function sessionDied(session) {
    if (callbacks[session.status()]) {
      callbacks[session.status()](exports);
    }
  }
  /**
   * Disconnect session
   *
   * @memberof roomApi.Session
   * @inner
   */


  var disconnect = function disconnect() {
    session.disconnect();
  };
  /**
   * Get session status
   *
   * @returns {string} One of {@link Flashphoner.constants.SESSION_STATUS}
   * @memberof roomApi.Session
   * @inner
   */


  var status = function status() {
    return session.status();
  };
  /**
   * Get session id
   *
   * @returns {string} session id
   * @memberof roomApi.Session
   * @inner
   */


  var id = function id() {
    return session.id();
  };
  /**
   * Get server address
   *
   * @returns {string} Server url
   * @memberof roomApi.Session
   * @inner
   */


  var getServerUrl = function getServerUrl() {
    return session.getServerUrl();
  };
  /**
   * Get session username
   *
   * @returns {string} username
   * @memberof roomApi.Session
   * @inner
   */


  var username = function username() {
    return username_;
  };
  /**
   * Get rooms
   *
   * @returns {roomApi.Room[]}
   * @memberof roomApi.Session
   * @inner
   */


  var getRooms = function getRooms() {
    return util.copyObjectToArray(rooms);
  };
  /**
   * Add session event callback.
   *
   * @param {string} event One of {@link Flashphoner.constants.SESSION_STATUS} events
   * @param {Session~eventCallback} callback Callback function
   * @returns {roomApi.Session} Session
   * @throws {TypeError} Error if event is not specified
   * @throws {Error} Error if callback is not a valid function
   * @memberof roomApi.Session
   * @inner
   */


  var on = function on(event, callback) {
    if (!event) {
      throw new Error("Event can't be null", "TypeError");
    }

    if (!callback || typeof callback !== 'function') {
      throw new Error("Callback needs to be a valid function");
    }

    callbacks[event] = callback;
    return exports;
  };
  /**
   * Join room
   *
   * @param {Object} options Room options
   * @param {String} options.name Room name
   * @returns {roomApi.Room}
   * @memberof roomApi.Session
   * @inner
   */


  var join = function join(options) {
    /**
     * Room
     *
     * @namespace roomApi.Room
     */
    var room = {};
    var name_ = options.name;
    var participants = {};
    var callbacks = {};
    var stateStreams = {};

    roomHandlers[name_] = function (data) {
      /**
       * Room participant
       *
       * @namespace roomApi.Room.Participant
       */
      var participant;

      if (data.name == "STATE") {
        if (data.info) {
          for (var i = 0; i < data.info.length; i++) {
            participantFromState(data.info[i]);
          }

          stateStreams = {};
        }

        if (callbacks["STATE"]) {
          callbacks["STATE"](room);
        }
      } else if (data.name == "JOINED") {
        participants[data.info] = {
          streams: {},
          name: function name() {
            return data.info;
          },
          sendMessage: attachSendMessage(data.info),
          getStreams: function getStreams() {
            return util.copyObjectToArray(this.streams);
          }
        };

        if (callbacks["JOINED"]) {
          callbacks["JOINED"](participants[data.info]);
        }
      } else if (data.name == "LEFT") {
        participant = participants[data.info];
        delete participants[data.info];

        if (callbacks["LEFT"]) {
          callbacks["LEFT"](participant);
        }
      } else if (data.name == "PUBLISHED") {
        participant = participants[data.info.login];
        participant.streams[data.info.name] = {
          play: play(data.info.name),
          stop: stop(data.info.name),
          id: id(data.info.name),
          streamName: function streamName() {
            return data.info.name;
          }
        };

        if (callbacks["PUBLISHED"]) {
          callbacks["PUBLISHED"](participant);
        }
      } else if (data.name == "FAILED" || data.name == "UNPUBLISHED") {
        participant = participants[data.info.login];
        if (participant != null) delete participant.streams[data.info.name];
      } else if (data.name == "MESSAGE") {
        if (callbacks["MESSAGE"]) {
          callbacks["MESSAGE"]({
            from: participants[data.info.from],
            text: data.info.text
          });
        }
      }
    }; //participant creation helper


    function participantFromState(state) {
      var participant = {};

      if (state.hasOwnProperty("login")) {
        var login = state.login;
        var _streamName = state.name;
        stateStreams[_streamName] = {
          /**
           * Play participant stream
           *
           * @param {HTMLElement} display Div element stream should be displayed in
           * @returns {Stream} Local stream object
           * @memberof roomApi.Room.Participant.Stream
           * @inner
           */
          play: play(_streamName),

          /**
           * Stop participant stream
           *
           * @memberof roomApi.Room.Participant.Stream
           * @inner
           */
          stop: stop(_streamName),

          /**
           * Get participant stream id
           *
           * @returns {String} Stream id
           * @memberof roomApi.Room.Participant.Stream
           * @inner
           */
          id: id(_streamName),

          /**
           * Get participant stream name
           *
           * @returns {String} Stream name
           * @memberof roomApi.Room.Participant.Stream
           * @inner
           */
          streamName: function streamName() {
            return _streamName;
          }
        };

        if (participants[login] != null) {
          participant = participants[login];
        } else {
          participant = {
            streams: {},

            /**
             * Get participant name
             *
             * @returns {String} Participant name
             * @memberof roomApi.Room.Participant
             * @inner
             */
            name: function name() {
              return login;
            },

            /**
             * Send message to participant
             *
             * @param {String} message Message to send
             * @param {Function} error Error callback
             * @memberof roomApi.Room.Participant
             * @inner
             */
            sendMessage: attachSendMessage(login),

            /**
             * Get participant streams
             *
             * @returns {Array<roomApi.Room.Participant.Stream>} Streams
             * @memberof roomApi.Room.Participant
             * @inner
             */
            getStreams: function getStreams() {
              return util.copyObjectToArray(this.streams);
            }
          };
          participants[participant.name()] = participant;
        }
        /**
         * Room participant
         *
         * @namespace roomApi.Room.Participant.Stream
         */

      } else {
        participant = {
          streams: {},
          name: function name() {
            return state;
          },
          sendMessage: attachSendMessage(state),
          getStreams: function getStreams() {
            return util.copyObjectToArray(this.streams);
          }
        };
      }

      if (Object.keys(stateStreams).length != 0) {
        for (var k in stateStreams) {
          if (stateStreams.hasOwnProperty(k)) {
            participant.streams[k] = stateStreams[k];
            delete stateStreams[k];
          }
        }
      }

      participants[participant.name()] = participant;
      return participant;
    }
    /**
     * Get room name
     *
     * @returns {String} Room name
     * @memberof roomApi.Room
     * @inner
     */


    var name = function name() {
      return name_;
    };
    /**
     * Leave room
     *
     * @returns {Promise<room>}
     * @memberof roomApi.Room
     * @inner
     */


    var leave = function leave() {
      return new Promise(function (resolve, reject) {
        sendAppCommand("leave", {
          name: name_
        }).then(function () {
          cleanUp();
          resolve(room);
        }, function () {
          cleanUp();
          reject(room);
        });

        function cleanUp() {
          //clear streams
          var streams = session.getStreams();

          for (var i = 0; i < streams.length; i++) {
            if (streams[i].name().indexOf(name_ + "-" + username_) !== -1 && streams[i].status() != STREAM_STATUS.UNPUBLISHED) {
              streams[i].stop();
            } else if (streams[i].name().indexOf(name_) !== -1 && streams[i].status() != STREAM_STATUS.STOPPED) {
              streams[i].stop();
            }
          }

          delete roomHandlers[name_];
          delete rooms[name_];
        }
      });
    };
    /**
     * Publish stream inside room
     *
     * @param {Object} options Stream options
     * @param {string=} options.name Stream name
     * @param {Object=} options.constraints Stream constraints
     * @param {Boolean=} options.record Enable stream recording
     * @param {Boolean=} options.cacheLocalResources Display will contain local video after stream release
     * @param {HTMLElement} options.display Div element stream should be displayed in
     * @returns {Stream}
     * @memberof roomApi.Room
     * @inner
     */


    var publish = function publish(options) {
      options.name = options.name ? name_ + "-" + username_ + "-" + uuid_v1().substr(0, 4) + "-" + options.name : name_ + "-" + username_ + "-" + uuid_v1().substr(0, 4);
      options.cacheLocalResources = typeof options.cacheLocalResources === "boolean" ? options.cacheLocalResources : true;
      options.custom = {
        name: name_
      };
      var stream = session.createStream(options);
      stream.publish();
      return stream;
    };
    /**
     * Add room event callback.
     *
     * @param {string} event One of {@link roomApi.events} events
     * @param {roomApi.Room~eventCallback} callback Callback function
     * @returns {roomApi.Room} room
     * @throws {TypeError} Error if event is not specified
     * @throws {Error} Error if callback is not a valid function
     * @memberof roomApi.Room
     * @inner
     */


    var on = function on(event, callback) {
      if (!event) {
        throw new Error("Event can't be null", "TypeError");
      }

      if (!callback || typeof callback !== 'function') {
        throw new Error("Callback needs to be a valid function");
      }

      callbacks[event] = callback;
      return room;
    };
    /**
     * Get participants
     *
     * @returns {roomApi.Room.Participant}
     * @memberof roomApi.Room
     * @inner
     */


    var getParticipants = function getParticipants() {
      return util.copyObjectToArray(participants);
    }; //participant helpers


    function play(streamName) {
      return function (display) {
        var stream = session.createStream({
          name: streamName,
          display: display,
          custom: {
            name: name_
          }
        });
        stream.play();
        return stream;
      };
    }

    function stop(streamName) {
      return function () {
        var streams = session.getStreams();

        for (var i = 0; i < streams.length; i++) {
          if (streams[i].name() == streamName && streams[i].status() != STREAM_STATUS.UNPUBLISHED) {
            streams[i].stop();
          }
        }
      };
    }

    function id(streamName) {
      return function () {
        var streams = session.getStreams();

        for (var i = 0; i < streams.length; i++) {
          if (streams[i].name() == streamName) return streams[i].id();
        }
      };
    }

    function attachSendMessage(recipientName) {
      return function (text, error) {
        var message = {
          roomConfig: {
            name: name_
          },
          to: recipientName,
          text: text
        };
        sendAppCommand("sendMessage", message).then(function () {}, function () {
          if (error) {
            error();
          }
        });
      };
    } //sendData helper


    function sendAppCommand(commandName, data) {
      var command = {
        command: commandName,
        options: data
      };
      return session.sendData(command);
    }

    sendAppCommand("join", {
      name: name_
    }).then(function () {}, function (info) {
      if (callbacks["FAILED"]) {
        callbacks["FAILED"](room, info.info);
      }
    });
    room.name = name;
    room.leave = leave;
    room.publish = publish;
    room.getParticipants = getParticipants;
    room.on = on;
    rooms[name_] = room;
    return room;
  };

  exports = {
    disconnect: disconnect,
    id: id,
    getServerUrl: getServerUrl,
    username: username,
    status: status,
    getRooms: getRooms,
    join: join,
    on: on
  };
  return exports;
};

var events = {
  STATE: "STATE",
  JOINED: "JOINED",
  LEFT: "LEFT",
  PUBLISHED: "PUBLISHED",
  MESSAGE: "MESSAGE",
  FAILED: "FAILED"
};
module.exports = {
  connect: appSession,
  events: events
};

},{"./constants":26,"./util":29,"promise-polyfill":4,"uuid/v1":10}],29:[function(require,module,exports){
'use strict';

module.exports = {
  isEmptyObject: function isEmptyObject(obj) {
    for (var name in obj) {
      return false;
    }

    return true;
  },

  /**
   * Copy values of object own properties to array.
   *
   * @param obj
   * @returns {Array}
   */
  copyObjectToArray: function copyObjectToArray(obj) {
    var ret = [];

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        ret.push(obj[prop]);
      }
    }

    return ret;
  },

  /**
   * Copy src properties to dst object.
   * Will overwrite dst prop with src prop in case of dst prop exist.
   */
  copyObjectPropsToAnotherObject: function copyObjectPropsToAnotherObject(src, dst) {
    for (var prop in src) {
      if (src.hasOwnProperty(prop)) {
        dst[prop] = src[prop];
      }
    }
  },
  browser: function browser() {
    var browser;
    var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
    if (isAndroid) browser = "Android";
    var isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isiOS) browser = "iOS"; // Opera 8.0+

    var isOpera = !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    if (isOpera) browser = "Opera"; // Firefox 1.0+

    var isFirefox = typeof InstallTrigger !== 'undefined';
    if (isFirefox) browser = "Firefox"; // At least Safari 3+: "[object HTMLElementConstructor]"

    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    if (isSafari) browser = "Safari"; // Internet Explorer 6-11

    var isIE =
    /*@cc_on!@*/
    false || !!document.documentMode;
    if (isIE) browser = "IE"; // Edge 20+

    var isEdge = !isIE && !!window.StyleMedia;
    if (isEdge) browser = "Edge"; // Chrome 1+

    var isChrome = !!window.chrome && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) && !/OPR/.test(navigator.userAgent);
    if (isChrome) browser = "Chrome";
    return browser;
  },
  processRtcStatsReport: function processRtcStatsReport(browser, report) {
    var result = {};

    if (browser == "chrome") {
      /**
       * Report types: googComponent, googCandidatePair, googCertificate, googLibjingleSession, googTrack, ssrc
       */
      var gotResult = false;

      if (report.type && report.type == "googCandidatePair") {
        //check if this is active pair
        if (report.googActiveConnection == "true") {
          gotResult = true;
        }
      }

      if (report.type && report.type == "ssrc") {
        gotResult = true;
      }

      if (gotResult) {
        for (var k in report) {
          if (report.hasOwnProperty(k)) {
            result[k] = report[k];
          }
        }
      }

      return result;
    } else if (browser == "firefox") {
      /**
       * RTCStatsReport http://mxr.mozilla.org/mozilla-central/source/dom/webidl/RTCStatsReport.webidl
       */
      if (report.type && (report.type == "outboundrtp" || report.type == "inboundrtp") && report.id.indexOf("rtcp") == -1) {
        result = {};

        for (var k in report) {
          if (report.hasOwnProperty(k)) {
            result[k] = report[k];
          }
        }
      }

      return result;
    } else {
      return result;
    }

    ;
  },
  Browser: {
    isIE: function isIE() {
      return (
        /*@cc_on!@*/
        false || !!document.documentMode
      );
    },
    isFirefox: function isFirefox() {
      return typeof InstallTrigger !== 'undefined';
    },
    isChrome: function isChrome() {
      return !!window.chrome && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) && !/OPR/.test(navigator.userAgent);
    },
    isEdge: function isEdge() {
      return !isIE && !!window.StyleMedia;
    },
    isOpera: function isOpera() {
      return !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    },
    isiOS: function isiOS() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    },
    isSafari: function isSafari() {
      return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    },
    isAndroid: function isAndroid() {
      return navigator.userAgent.toLowerCase().indexOf("android") > -1;
    },
    isSafariWebRTC: function isSafariWebRTC() {
      return navigator.mediaDevices && Browser.isSafari();
    }
  },
  SDP: {
    matchPrefix: function matchPrefix(sdp, prefix) {
      var parts = sdp.trim().split('\n').map(function (line) {
        return line.trim();
      });
      return parts.filter(function (line) {
        return line.indexOf(prefix) === 0;
      });
    },
    writeFmtp: function writeFmtp(sdp, param, codec) {
      var sdpArray = sdp.split("\n");
      var i;

      for (i = 0; i < sdpArray.length; i++) {
        if (sdpArray[i].search(codec) != -1 && sdpArray[i].indexOf("a=rtpmap") == 0) {
          sdpArray[i] += "\na=fmtp:" + sdpArray[i].match(/[0-9]+/)[0] + " " + param + "\r";
        }
      } //normalize sdp after modifications


      var result = "";

      for (i = 0; i < sdpArray.length; i++) {
        if (sdpArray[i] != "") {
          result += sdpArray[i] + "\n";
        }
      }

      return result;
    }
  },
  logger: {
    init: function init(verbosity, enablePushLogs, customLogger, enableLogs) {
      switch (verbosity.toUpperCase()) {
        case "DEBUG":
          this.verbosity = 3;
          break;

        case "INFO":
          this.verbosity = 2;
          break;

        case "ERROR":
          this.verbosity = 0;
          break;

        case "WARN":
          this.verbosity = 1;
          break;

        case "TRACE":
          this.verbosity = 4;
          break;

        default:
          this.verbosity = 2;
      }

      ;

      this.date = function () {
        return new Date().toTimeString().split(" ")[0];
      };

      this.enablePushLogs = enablePushLogs;
      var delayedLogs = [];
      this.customLogger = customLogger;
      this.enableLogs = enableLogs;

      this.pushLogs = function (log) {
        if (this.wsConnection && this.enablePushLogs) {
          if (delayedLogs.length) {
            for (var i = 0; i < delayedLogs.length; i++) {
              this.wsConnection.send(JSON.stringify({
                message: "pushLogs",
                data: [{
                  logs: delayedLogs[i]
                }]
              }));
            }
          }

          delayedLogs = [];
          this.wsConnection.send(JSON.stringify({
            message: "pushLogs",
            data: [{
              logs: log
            }]
          }));
        } else {
          // Save logs to send it later
          delayedLogs.push(log);
        }
      };
    },
    info: function info(src, text) {
      if (!this.enableLogs) {
        return;
      }

      var prefix = this.date() + " INFO " + src + " - ";
      this.pushLogs(prefix + JSON.stringify(text) + '\n');

      if (this.verbosity >= 2) {
        if (this.customLogger != null) {
          this.customLogger.info(text);
        } else {
          console.log(prefix, text);
        }
      }
    },
    debug: function debug(src, text) {
      if (!this.enableLogs) {
        return;
      }

      var prefix = this.date() + " DEBUG " + src + " - ";
      this.pushLogs(prefix + JSON.stringify(text) + '\n');

      if (this.verbosity >= 3) {
        if (this.customLogger != null) {
          this.customLogger.debug(text);
        } else {
          console.log(prefix, text);
        }
      }
    },
    trace: function trace(src, text) {
      if (!this.enableLogs) {
        return;
      }

      var prefix = this.date() + " TRACE " + src + " - ";
      this.pushLogs(prefix + JSON.stringify(text) + '\n');

      if (this.verbosity >= 4) {
        if (this.customLogger != null) {
          this.customLogger.trace(text);
        } else {
          console.log(prefix, text);
        }
      }
    },
    warn: function warn(src, text) {
      if (!this.enableLogs) {
        return;
      }

      var prefix = this.date() + " WARN " + src + " - ";
      this.pushLogs(prefix + JSON.stringify(text) + '\n');

      if (this.verbosity >= 1) {
        if (this.customLogger != null) {
          this.customLogger.warn(text);
        } else {
          console.warn(prefix, text);
        }
      }
    },
    error: function error(src, text) {
      if (!this.enableLogs) {
        return;
      }

      var prefix = this.date() + " ERROR " + src + " - ";
      this.pushLogs(prefix + JSON.stringify(text) + '\n');

      if (this.verbosity >= 0) {
        if (this.customLogger != null) {
          this.customLogger.error(text);
        } else {
          console.error(prefix, text);
        }
      }
    },
    setEnableLogs: function setEnableLogs(enableLogs) {
      this.enableLogs = enableLogs;
    },
    setCustomLogger: function setCustomLogger(customLogger) {
      this.customLogger = customLogger;
    },
    setConnection: function setConnection(connection) {
      this.wsConnection = connection;
    },
    setPushLogs: function setPushLogs(pushLogs) {
      this.enablePushLogs = pushLogs;
    },
    setLevel: function setLevel(level) {
      switch (level.toUpperCase()) {
        case "DEBUG":
          this.verbosity = 3;
          break;

        case "INFO":
          this.verbosity = 2;
          break;

        case "ERROR":
          this.verbosity = 0;
          break;

        case "WARN":
          this.verbosity = 1;
          break;

        case "TRACE":
          this.verbosity = 4;
          break;

        default:
          this.verbosity = 2;
      }

      ;
    }
  },
  stripCodecs: function stripCodecs(sdp, codecs) {
    if (!codecs.length) return sdp;
    var sdpArray = sdp.split("\n");
    var codecsArray = codecs.split(","); //search and delete codecs line

    var pt = [];
    var i;

    for (var p = 0; p < codecsArray.length; p++) {
      console.log("Searching for codec " + codecsArray[p]);

      for (i = 0; i < sdpArray.length; i++) {
        if (sdpArray[i].search(new RegExp(codecsArray[p], 'i')) != -1 && sdpArray[i].indexOf("a=rtpmap") == 0) {
          console.log(codecsArray[p] + " detected");
          pt.push(sdpArray[i].match(/[0-9]+/)[0]);
          sdpArray[i] = "";
        }
      }
    }

    if (pt.length) {
      //searching for fmtp
      for (p = 0; p < pt.length; p++) {
        for (i = 0; i < sdpArray.length; i++) {
          if (sdpArray[i].search("a=fmtp:" + pt[p]) != -1 || sdpArray[i].search("a=rtcp-fb:" + pt[p]) != -1) {
            sdpArray[i] = "";
          }
        }
      } //delete entries from m= line


      for (i = 0; i < sdpArray.length; i++) {
        if (sdpArray[i].search("m=audio") != -1 || sdpArray[i].search("m=video") != -1) {
          var mLineSplitted = sdpArray[i].split(" ");
          var newMLine = "";

          for (var m = 0; m < mLineSplitted.length; m++) {
            if (pt.indexOf(mLineSplitted[m].trim()) == -1 || m <= 2) {
              newMLine += mLineSplitted[m];

              if (m < mLineSplitted.length - 1) {
                newMLine = newMLine + " ";
              }
            }
          }

          sdpArray[i] = newMLine;
        }
      }
    } //normalize sdp after modifications


    var result = "";

    for (i = 0; i < sdpArray.length; i++) {
      if (sdpArray[i] != "") {
        result += sdpArray[i] + "\n";
      }
    }

    return result;
  },
  getCurrentCodecAndSampleRate: function getCurrentCodecAndSampleRate(sdp, mediaType) {
    var rows = sdp.split("\n");
    var codecPt;

    for (var i = 0; i < rows.length; i++) {
      if (codecPt && rows[i].indexOf("a=rtpmap:" + codecPt) != -1) {
        var ret = {};
        ret.name = rows[i].split(" ")[1].split("/")[0];
        ret.sampleRate = rows[i].split(" ")[1].split("/")[1];
        return ret;
      } //WCS-2136. WebRTC statistics doesn't work for VP8


      if (rows[i].indexOf("m=" + mediaType) != -1) {
        codecPt = rows[i].split(" ")[3].trim();
      }
    }
  }
};

},{}],30:[function(require,module,exports){
'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var browserDetails = require('webrtc-adapter')["default"].browserDetails;

var uuid_v1 = require('uuid/v1');

var util = require('./util');

var connections = {};
var LOCAL_CACHED_VIDEO = "-LOCAL_CACHED_VIDEO";
var REMOTE_CACHED_VIDEO = "-REMOTE_CACHED_VIDEO";
var extensionId;
var defaultConstraints;
var logger;
var LOG_PREFIX = "webrtc";
var audioContext;
var createMicGainNode;
var microphoneGain;

var constants = require('./constants');

var validBrowsers = ["firefox", "chrome", "safari"];

var createConnection = function createConnection(options) {
  return new Promise(function (resolve, reject) {
    var id = options.id;
    var connectionConfig = options.connectionConfig || {
      "iceServers": []
    };
    var connectionConstraints = options.connectionConstraints || {};

    if (!connectionConstraints.hasOwnProperty("optional")) {
      connectionConstraints.optional = [{
        "DtlsSrtpKeyAgreement": true
      }];
    }

    connectionConfig.bundlePolicy = "max-compat";
    var connection = new RTCPeerConnection(connectionConfig, connectionConstraints); //unidirectional display

    var display = options.display; //bidirectional local

    var localDisplay = options.localDisplay; //bidirectional remote

    var remoteDisplay = options.remoteDisplay;
    var bidirectional = options.bidirectional;
    var localVideo; //tweak for custom video players #WCS-1511

    var remoteVideo = options.remoteVideo;
    var videoCams = [];
    var switchCamCount = 0;
    var mics = [];
    var switchMicCount = 0;
    var customStream = options.customStream;
    var currentAudioTrack;
    var currentVideoTrack;
    var systemSoundTrack;
    var constraints = options.constraints ? options.constraints : {};
    var screenShare = false;
    var playoutDelay = options.playoutDelay;

    if (bidirectional) {
      localVideo = getCacheInstance(localDisplay);

      if (localVideo) {
        //made for safari, if sip call without audio and video, because function playFirstVideo() creates a video element
        if (localVideo.srcObject) {
          localVideo.id = id + "-local";
          connection.addStream(localVideo.srcObject);
        } else {
          localVideo = null;
        }
      }

      remoteVideo = getCacheInstance(remoteDisplay);

      if (!remoteVideo) {
        remoteVideo = document.createElement('video');
        remoteDisplay.appendChild(remoteVideo);
      }

      remoteVideo.id = id + "-remote";

      if (options.audioOutputId && typeof remoteVideo.setSinkId !== "undefined") {
        remoteVideo.setSinkId(options.audioOutputId);
      }
      /**
       * Workaround for Android 6, 7, Chrome 61.
       * https://bugs.chromium.org/p/chromium/issues/detail?id=769622
       */


      remoteVideo.style = "border-radius: 1px";
    } else {
      //tweak for custom video players. In order to put MediaStream in srcObject #WCS-1511
      if (!remoteVideo) {
        var cachedVideo = getCacheInstance(display);

        if (!cachedVideo || cachedVideo.id.indexOf(REMOTE_CACHED_VIDEO) !== -1 || !cachedVideo.srcObject) {
          if (cachedVideo) {
            remoteVideo = cachedVideo;
          } else {
            remoteVideo = document.createElement('video');
            display.appendChild(remoteVideo);
          }

          remoteVideo.id = id;

          if (options.audioOutputId && typeof remoteVideo.setSinkId !== "undefined") {
            remoteVideo.setSinkId(options.audioOutputId);
          }
          /**
           * Workaround for Android 6, 7, Chrome 61.
           * https://bugs.chromium.org/p/chromium/issues/detail?id=769622
           */


          remoteVideo.style = "border-radius: 1px";
        } else {
          localVideo = cachedVideo;
          localVideo.id = id;
          connection.addStream(localVideo.srcObject);
        }
      }
    }

    if (localVideo) {
      var videoTrack = localVideo.srcObject.getVideoTracks()[0];

      if (videoTrack) {
        listDevices(false).then(function (devices) {
          devices.video.forEach(function (device) {
            if (videoTrack.label === device.label) {
              switchCamCount = videoCams.length;
            }

            videoCams.push(device.id);
          });
        });
      }

      var audioTrack = localVideo.srcObject.getAudioTracks()[0];

      if (audioTrack) {
        listDevices(false).then(function (devices) {
          devices.audio.forEach(function (device) {
            if (audioTrack.label === device.label) {
              switchMicCount = mics.length;
            }

            mics.push(device.id);
          });
        });
      }
    }

    connection.ontrack = function (event) {
      if (remoteVideo) {
        remoteVideo.srcObject = event.streams[0];

        remoteVideo.onloadedmetadata = function (e) {
          if (remoteVideo) {
            remoteVideo.play()["catch"](function (e) {
              if (browserDetails.browser == 'chrome' || browserDetails.browser == 'safari') {
                //WCS-1698. fixed autoplay in chromium based browsers
                //WCS-2375. fixed autoplay in ios safari
                logger.info(LOG_PREFIX, "Autoplay detected! Trying to play a video with a muted sound...");
                remoteVideo.muted = true;
                remoteVideo.play();
              } else {
                logger.error(LOG_PREFIX, e);
              }
            });
          }
        };
      } //WCS-2771 add playback delay


      connection.getReceivers().forEach(function (track) {
        if (track.playoutDelayHint === undefined) {
          logger.warn("playout delay unsupported");
        }

        track.playoutDelayHint = playoutDelay;
      });
    };

    connection.onremovestream = function (event) {
      if (remoteVideo) {
        remoteVideo.pause();
      }
    };

    connection.onsignalingstatechange = function (event) {};

    connection.oniceconnectionstatechange = function (event) {};

    connection.onicecandidate = function (event) {
      if (event.candidate != null) {
        logger.debug(LOG_PREFIX, "Added icecandidate: " + event.candidate.candidate);
      }
    };

    var state = function state() {
      return connection.signalingState;
    };

    var close = function close(cacheCamera) {
      if (remoteVideo) {
        removeVideoElement(remoteVideo); //tweak for custom video players #WCS-1511

        if (!options.remoteVideo) {
          remoteVideo.id = remoteVideo.id + REMOTE_CACHED_VIDEO;
        }

        remoteVideo = null;
      }

      if (localVideo && !getCacheInstance(localDisplay || display) && cacheCamera) {
        localVideo.id = localVideo.id + LOCAL_CACHED_VIDEO;
        unmuteAudio();
        unmuteVideo();
        localVideo = null;
      } else if (localVideo) {
        localVideo.id = localVideo.id + LOCAL_CACHED_VIDEO;
        removeVideoElement(localVideo);
        localVideo = null;
      }

      if (connection.signalingState !== "closed") {
        connection.close();
      }

      delete connections[id];
    };

    var createOffer = function createOffer(options) {
      return new Promise(function (resolve, reject) {
        var hasAudio = true;
        var hasVideo = true;

        if (localVideo) {
          if (!localVideo.srcObject.getAudioTracks()[0]) {
            hasAudio = false;
          }

          if (!localVideo.srcObject.getVideoTracks()[0]) {
            hasVideo = false;
            options.receiveVideo = false;
          }
        } else if (browserDetails.browser == "safari" && !connection.getTransceivers().length) {
          if (options.receiveAudio) {
            connection.addTransceiver('audio', {
              direction: "recvonly"
            });
          }

          if (options.receiveVideo) {
            connection.addTransceiver('video', {
              direction: "recvonly"
            });
          }
        }

        var constraints = {
          offerToReceiveAudio: options.receiveAudio ? 1 : 0,
          offerToReceiveVideo: options.receiveVideo ? 1 : 0
        }; //create offer and set local sdp

        connection.createOffer(constraints).then(function (offer) {
          connection.setLocalDescription(offer).then(function () {
            var o = {};
            o.sdp = util.stripCodecs(offer.sdp, options.stripCodecs);
            o.hasAudio = hasAudio;
            o.hasVideo = hasVideo;
            resolve(o);
          });
        });
      });
    };

    var createAnswer = function createAnswer(options) {
      return new Promise(function (resolve, reject) {
        //create offer and set local sdp
        connection.createAnswer().then(function (answer) {
          connection.setLocalDescription(answer).then(function () {
            resolve(util.stripCodecs(answer.sdp, options.stripCodecs));
          });
        });
      });
    };

    var changeAudioCodec = function changeAudioCodec(codec) {
      return false;
    };

    var setRemoteSdp = function setRemoteSdp(sdp) {
      logger.debug(LOG_PREFIX, "setRemoteSDP:");
      logger.debug(LOG_PREFIX, sdp);
      return new Promise(function (resolve, reject) {
        var sdpType;

        if (connection.signalingState == 'have-local-offer') {
          sdpType = 'answer';
        } else {
          sdpType = 'offer';
        }

        var rtcSdp = new RTCSessionDescription({
          type: sdpType,
          sdp: sdp
        });
        connection.setRemoteDescription(rtcSdp).then(function () {
          //use in edge for ice
          if (browserDetails.browser == "edge") {// var sdpArray = sdp.split("\n");
            // var i;
            // for (i = 0; i < sdpArray.length; i++) {
            //     if (sdpArray[i].indexOf("m=video") == 0) {
            //         break;
            //     }
            //     if (sdpArray[i].indexOf("a=candidate:1 1") == 0 || sdpArray[i].indexOf("a=candidate:2 1") == 0) {
            //         var rtcIceCandidate = new RTCIceCandidate({
            //             candidate: sdpArray[i],
            //             sdpMid: "audio",
            //             sdpMLineIndex: 0
            //         });
            //         connection.addIceCandidate(rtcIceCandidate);
            //     }
            // }
            // var video = false;
            // for (i = 0; i < sdpArray.length; i++) {
            //     if (sdpArray[i].indexOf("m=video") == 0) {
            //         video = true;
            //     }
            //     if (video && (sdpArray[i].indexOf("a=candidate:1 1") == 0 || sdpArray[i].indexOf("a=candidate:2 1") == 0)) {
            //         var rtcIceCandidate2 = new RTCIceCandidate({
            //             candidate: sdpArray[i],
            //             sdpMid: "video",
            //             sdpMLineIndex: 1
            //         });
            //         connection.addIceCandidate(rtcIceCandidate2);
            //     }
            // }
            // WCS-2204. fixed InvalidStateError
            // connection.addIceCandidate(null);
          }

          resolve();
        })["catch"](function (error) {
          reject(error);
        });
      });
    };

    var setAudioOutputId = function setAudioOutputId(id) {
      if (remoteVideo) {
        //WCS-2063. fixed output device switch
        if (browserDetails.browser == "edge") {
          var srcObject = remoteVideo.srcObject;
          remoteVideo.srcObject = null;
          var res = remoteVideo.setSinkId(id);
          remoteVideo.srcObject = srcObject;
          return res;
        }

        return remoteVideo.setSinkId(id);
      }
    };

    var getVolume = function getVolume() {
      if (remoteVideo && remoteVideo.srcObject && remoteVideo.srcObject.getAudioTracks().length > 0) {
        //return remoteVideo.srcObject.getAudioTracks()[0].volume * 100;
        return remoteVideo.volume * 100;
      }

      return -1;
    };

    var setVolume = function setVolume(volume) {
      if (remoteVideo && remoteVideo.srcObject && remoteVideo.srcObject.getAudioTracks().length > 0) {
        remoteVideo.volume = volume / 100;
      }
    };

    var unmuteRemoteAudio = function unmuteRemoteAudio() {
      if (remoteVideo && remoteVideo.srcObject && remoteVideo.srcObject.getAudioTracks().length > 0) {
        remoteVideo.muted = false;
      }
    };

    var muteRemoteAudio = function muteRemoteAudio() {
      if (remoteVideo && remoteVideo.srcObject && remoteVideo.srcObject.getAudioTracks().length > 0) {
        remoteVideo.muted = true;
      }
    };

    var isRemoteAudioMuted = function isRemoteAudioMuted() {
      if (remoteVideo && remoteVideo.srcObject && remoteVideo.srcObject.getAudioTracks().length > 0) {
        return remoteVideo.muted;
      }

      return true;
    };

    var setMicrophoneGain = function setMicrophoneGain(volume) {
      if (microphoneGain) {
        microphoneGain.gain.value = volume / 100;
      }
    };

    var muteAudio = function muteAudio() {
      if (localVideo && localVideo.srcObject && localVideo.srcObject.getAudioTracks().length > 0) {
        localVideo.srcObject.getAudioTracks()[0].enabled = false;
      }
    };

    var unmuteAudio = function unmuteAudio() {
      if (localVideo && localVideo.srcObject && localVideo.srcObject.getAudioTracks().length > 0) {
        localVideo.srcObject.getAudioTracks()[0].enabled = true;
      }
    };

    var isAudioMuted = function isAudioMuted() {
      if (localVideo && localVideo.srcObject && localVideo.srcObject.getAudioTracks().length > 0) {
        return !localVideo.srcObject.getAudioTracks()[0].enabled;
      }

      return true;
    };

    var muteVideo = function muteVideo() {
      if (localVideo && localVideo.srcObject && localVideo.srcObject.getVideoTracks().length > 0) {
        localVideo.srcObject.getVideoTracks()[0].enabled = false;
      }
    };

    var unmuteVideo = function unmuteVideo() {
      if (localVideo && localVideo.srcObject && localVideo.srcObject.getVideoTracks().length > 0) {
        localVideo.srcObject.getVideoTracks()[0].enabled = true;
      }
    };

    var isVideoMuted = function isVideoMuted() {
      if (localVideo && localVideo.srcObject && localVideo.srcObject.getVideoTracks().length > 0) {
        return !localVideo.srcObject.getVideoTracks()[0].enabled;
      }

      return true;
    };

    var getStat = function getStat(callbackFn, nativeStats) {
      var browser = browserDetails.browser;
      var result = {
        outboundStream: {},
        inboundStream: {},
        otherStats: []
      };

      if (connection && validBrowsers.includes(browser)) {
        if (nativeStats) {
          return connection.getStats(null);
        } else {
          connection.getStats(null).then(function (stat) {
            if (stat) {
              stat.forEach(function (report) {
                if (!report.isRemote) {
                  if (report.type == 'outbound-rtp') {
                    fillStatObject(result.outboundStream, report);

                    if (report.mediaType == 'video') {
                      var vSettings = localVideo.srcObject.getVideoTracks()[0].getSettings();
                      result.outboundStream[report.mediaType].height = vSettings.height;
                      result.outboundStream[report.mediaType].width = vSettings.width;
                    }
                  } else if (report.type == 'inbound-rtp') {
                    fillStatObject(result.inboundStream, report);

                    if (report.mediaType == 'video' && remoteVideo != undefined) {
                      result.inboundStream[report.mediaType].height = remoteVideo.videoHeight;
                      result.inboundStream[report.mediaType].width = remoteVideo.videoWidth;
                    }
                  }
                }
              });
            }

            callbackFn(result);
          });
        }
      }
    };

    function fillStatObject(obj, report) {
      var mediaType = report.mediaType;
      obj[mediaType] = {}; //WCS-1922, currentRemoteDescription - browser compatibilitySection: Chrome 70, FF 57, Safari 11

      var description = connection.currentRemoteDescription != undefined ? connection.currentRemoteDescription : connection.remoteDescription;
      var codec = util.getCurrentCodecAndSampleRate(description.sdp, mediaType);
      obj[mediaType]["codec"] = codec.name;
      obj[mediaType]["codecRate"] = codec.sampleRate;
      Object.keys(report).forEach(function (key) {
        if (key.startsWith("bytes") || key.startsWith("packets") || key.indexOf("Count") != -1) {
          obj[mediaType][key] = report[key];
        }
      });
    }

    var fullScreen = function fullScreen() {
      var video = document.getElementById(id);

      if (video) {
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
          if (video.requestFullscreen) {
            video.requestFullscreen();
          } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
          } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
          } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
          } else if (video.webkitEnterFullscreen) {
            video.webkitEnterFullscreen(); //hack for iOS safari. Video is getting paused when switching from fullscreen to normal mode.

            video.addEventListener("pause", function () {
              video.play();
            });
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
      }
    };

    var switchCam = function switchCam(deviceId) {
      return new Promise(function (resolve, reject) {
        if (localVideo && localVideo.srcObject && videoCams.length > 1 && !customStream && !screenShare) {
          connection.getSenders().forEach(function (sender) {
            if (sender.track.kind === 'audio') return;
            switchCamCount = (switchCamCount + 1) % videoCams.length;
            sender.track.stop();
            var cam = typeof deviceId !== "undefined" ? deviceId : videoCams[switchCamCount]; //use the settings that were set during connection initiation

            var clonedConstraints = Object.assign({}, constraints);
            clonedConstraints.video.deviceId = {
              exact: cam
            };
            clonedConstraints.audio = false;
            navigator.mediaDevices.getUserMedia(clonedConstraints).then(function (newStream) {
              var newVideoTrack = newStream.getVideoTracks()[0];
              newVideoTrack.enabled = localVideo.srcObject.getVideoTracks()[0].enabled;
              var audioTrack = localVideo.srcObject.getAudioTracks()[0];
              sender.replaceTrack(newVideoTrack);
              localVideo.srcObject = newStream; // On Safari mobile _newStream_ doesn't contain audio track, so we need to add track from previous stream

              if (localVideo.srcObject.getAudioTracks().length == 0 && audioTrack) {
                localVideo.srcObject.addTrack(audioTrack);
              }

              logger.info("Switch camera to " + cam);
              resolve(cam);
            })["catch"](function (reason) {
              logger.error(LOG_PREFIX, reason);
              reject(reason);
            });
          });
        } else {
          reject(constants.ERROR_INFO.CAN_NOT_SWITCH_CAM);
        }
      });
    };

    var switchMic = function switchMic(deviceId) {
      return new Promise(function (resolve, reject) {
        if (localVideo && localVideo.srcObject && mics.length > 1 && !customStream) {
          connection.getSenders().forEach(function (sender) {
            if (sender.track.kind === 'video') return;
            switchMicCount = (switchMicCount + 1) % mics.length;
            sender.track.stop();

            if (microphoneGain) {
              microphoneGain.release();
            }

            var mic = typeof deviceId !== "undefined" ? deviceId : mics[switchMicCount]; //use the settings that were set during connection initiation

            var clonedConstraints = Object.assign({}, constraints);
            clonedConstraints.audio.deviceId = {
              exact: mic
            };
            clonedConstraints.video = false;
            navigator.mediaDevices.getUserMedia(clonedConstraints).then(function (newStream) {
              if (microphoneGain) {
                var currentGain = microphoneGain.gain.value;
                microphoneGain = createGainNode(newStream);
                microphoneGain.gain.value = currentGain;
              }

              var newAudioTrack = newStream.getAudioTracks()[0];
              newAudioTrack.enabled = localVideo.srcObject.getAudioTracks()[0].enabled;
              currentAudioTrack = newAudioTrack;
              var videoTrack = localVideo.srcObject.getVideoTracks()[0];

              if (systemSoundTrack) {
                var mixedTrack = mixAudioTracks(new MediaStream([newAudioTrack]), new MediaStream([systemSoundTrack]));
                mixedTrack.enabled = newAudioTrack.enabled;
                sender.replaceTrack(mixedTrack);
                localVideo.srcObject = new MediaStream([mixedTrack]);
              } else {
                sender.replaceTrack(newAudioTrack);
                localVideo.srcObject = newStream;
              }

              if (videoTrack) {
                localVideo.srcObject.addTrack(videoTrack);
              }

              logger.info("Switch mic to " + mic);
              resolve(mic);
            })["catch"](function (reason) {
              logger.error(LOG_PREFIX, reason);
              reject(reason);
            });
          });
        } else {
          reject(constants.ERROR_INFO.CAN_NOT_SWITCH_MIC);
        }
      });
    };

    var switchToScreen = function switchToScreen(source, woExtension) {
      return new Promise(function (resolve, reject) {
        if (!screenShare) {
          var clonedConstraints = {
            video: Object.assign({}, constraints.video),
            audio: Object.assign({}, constraints.audio)
          };

          if (browserDetails.browser === 'firefox') {
            clonedConstraints.video.mediaSource = source;
          }

          if (window.chrome && woExtension) {
            getScreenDeviceIdWoExtension(clonedConstraints).then(function (screenSharingConstraints) {
              navigator.mediaDevices.getDisplayMedia(screenSharingConstraints).then(function (stream) {
                processScreenStream(stream, resolve);
              })["catch"](reject);
            });
            return;
          }

          getScreenDeviceId(clonedConstraints).then(function (screenSharingConstraints) {
            clonedConstraints.sourceId = screenSharingConstraints.sourceId;

            if (screenSharingConstraints.audioMandatory) {
              clonedConstraints.audio = {
                mandatory: screenSharingConstraints.audioMandatory,
                optional: []
              };
            } else {
              delete clonedConstraints.audio;
            }

            if (browserDetails.browser == "firefox") {
              clonedConstraints.video = screenSharingConstraints;
            } else if (browserDetails.browser == "chrome") {
              delete clonedConstraints.video;
              clonedConstraints.video = {
                mandatory: screenSharingConstraints.mandatory
              };
            }

            navigator.mediaDevices.getUserMedia(clonedConstraints).then(function (stream) {
              processScreenStream(stream, resolve);
            })["catch"](function (reason) {
              logger.error(reason);
              reject(reason);
            });
          })["catch"](function (reason) {
            logger.error(reason);
            reject(reason);
          });
        }
      });
    };

    var processScreenStream = function processScreenStream(stream, resolve) {
      connection.getSenders().forEach(function (sender) {
        if (sender.track.kind === 'audio') return;
        currentAudioTrack = localVideo.srcObject.getAudioTracks()[0];
        currentVideoTrack = localVideo.srcObject.getVideoTracks()[0];
        var newVideoTrack = stream.getVideoTracks()[0];
        newVideoTrack.enabled = currentVideoTrack.enabled;
        sender.replaceTrack(newVideoTrack);
        localVideo.srcObject = stream;

        if (stream.getAudioTracks()[0]) {
          systemSoundTrack = stream.getAudioTracks()[0];
          connection.getSenders().forEach(function (sender) {
            if (sender.track.kind === 'video') return;
            var mixedTrack = mixAudioTracks(stream, new MediaStream([sender.track]));
            mixedTrack.enabled = currentAudioTrack.enabled;
            sender.replaceTrack(mixedTrack);
            localVideo.srcObject.removeTrack(stream.getAudioTracks()[0]);
            localVideo.srcObject.addTrack(mixedTrack);
            currentAudioTrack.enabled = true;
          });
        } else {
          localVideo.srcObject.addTrack(currentAudioTrack);
        }
      });
      logger.info("Switch to screen");
      screenShare = true;
      resolve();
    };

    var switchToCam = function switchToCam() {
      if (screenShare) {
        connection.getSenders().forEach(function (sender) {
          if (sender.track.kind === 'audio') return;
          currentVideoTrack.enabled = sender.track.enabled;
          sender.track.stop();
          localVideo.srcObject = new MediaStream([currentVideoTrack]);
          sender.replaceTrack(currentVideoTrack);

          if (currentAudioTrack) {
            connection.getSenders().forEach(function (sender) {
              if (sender.track.kind === 'video') return;

              if (systemSoundTrack) {
                currentAudioTrack.enabled = sender.track.enabled;
                sender.track.stop();
                systemSoundTrack.stop();
                systemSoundTrack = null;
                sender.replaceTrack(currentAudioTrack);
              }

              localVideo.srcObject.addTrack(currentAudioTrack);
            });
          }
        });
      }

      logger.info("Switch to cam");
      screenShare = false;
    };

    var exports = {};
    exports.state = state;
    exports.createOffer = createOffer;
    exports.createAnswer = createAnswer;
    exports.setRemoteSdp = setRemoteSdp;
    exports.changeAudioCodec = changeAudioCodec;
    exports.close = close;
    exports.setAudioOutputId = setAudioOutputId;
    exports.setVolume = setVolume;
    exports.unmuteRemoteAudio = unmuteRemoteAudio;
    exports.muteRemoteAudio = muteRemoteAudio;
    exports.isRemoteAudioMuted = isRemoteAudioMuted;
    exports.setMicrophoneGain = setMicrophoneGain;
    exports.getVolume = getVolume;
    exports.muteAudio = muteAudio;
    exports.unmuteAudio = unmuteAudio;
    exports.isAudioMuted = isAudioMuted;
    exports.muteVideo = muteVideo;
    exports.unmuteVideo = unmuteVideo;
    exports.isVideoMuted = isVideoMuted;
    exports.getStats = getStat;
    exports.fullScreen = fullScreen;
    exports.switchCam = switchCam;
    exports.switchMic = switchMic;
    exports.switchToScreen = switchToScreen;
    exports.switchToCam = switchToCam;
    connections[id] = exports;
    resolve(exports);
  });
};

var mixAudioTracks = function mixAudioTracks(stream1, stream2) {
  var stream1Sound = audioContext.createMediaStreamSource(stream1);
  var stream2Sound = audioContext.createMediaStreamSource(stream2);
  var destination = audioContext.createMediaStreamDestination();
  var newStream = destination.stream;
  stream1Sound.connect(destination);
  stream2Sound.connect(destination);
  return newStream.getAudioTracks()[0];
};

var getMediaAccess = function getMediaAccess(constraints, display, disableConstraintsNormalization) {
  return new Promise(function (resolve, reject) {
    if (!constraints) {
      constraints = defaultConstraints;
    }

    if (!disableConstraintsNormalization) {
      constraints = normalizeConstraints(constraints);
    }

    var cacheInstance = getCacheInstance(display);

    if (cacheInstance && cacheInstance.srcObject && JSON.stringify(display.mediaTrackConstraints) == JSON.stringify(constraints) && !constraints.customStream) {
      resolve(display);
      return;
    }

    display.mediaTrackConstraints = constraints;
    releaseMedia(display);

    if (!constraints.video && !constraints.audio && !constraints.customStream) {
      resolve(display);
      return;
    } //check if this is screen sharing


    if (constraints.video && constraints.video.type && constraints.video.type == "screen") {
      delete constraints.video.type;

      if (window.chrome && constraints.video.withoutExtension) {
        getScreenDeviceIdWoExtension(constraints).then(function (screenSharingConstraints) {
          getScreenAccessWoExtension(screenSharingConstraints, constraints.audio);
        });
        return;
      }

      var requestAudioConstraints = null;
      getScreenDeviceId(constraints).then(function (screenSharingConstraints) {
        //copy constraints
        constraints.sourceId = screenSharingConstraints.sourceId;
        requestAudioConstraints = constraints.audio;

        if (screenSharingConstraints.audioMandatory) {
          constraints.audio = {
            mandatory: screenSharingConstraints.audioMandatory,
            optional: []
          };
        } else {
          if (window.chrome) {
            constraints.audio = false;
          }
        }

        delete screenSharingConstraints.audioMandatory;
        delete screenSharingConstraints.sourceId;

        for (var prop in screenSharingConstraints) {
          if (screenSharingConstraints.hasOwnProperty(prop)) {
            constraints.video[prop] = screenSharingConstraints[prop];
          }
        }

        if (browserDetails.browser == "chrome") {
          delete constraints.video.frameRate;
          delete constraints.video.height;
          delete constraints.video.width;
          delete constraints.systemSound;
        }

        getAccess(constraints, true, requestAudioConstraints);
      }, reject);
    } else {
      getAccess(constraints);
    }

    function getScreenAccessWoExtension(constraints, requestAudioConstraints) {
      //WCS-1952. exact constraints and system audio are not supported!
      navigator.mediaDevices.getDisplayMedia(constraints).then(function (stream) {
        loadVideo(display, stream, true, requestAudioConstraints, resolve, constraints);
      })["catch"](reject);
    }

    function getAccess(constraints, screenShare, requestAudioConstraints) {
      logger.info(LOG_PREFIX, constraints);

      if (constraints.customStream) {
        //get tracks if we have at least one defined constraint
        if (constraints.audio || constraints.video) {
          //remove customStream from constraints before passing to GUM
          var normalizedConstraints = {
            audio: constraints.audio ? constraints.audio : false,
            video: constraints.video ? constraints.video : false
          };
          navigator.getUserMedia(normalizedConstraints, function (stream) {
            //add resulting tracks to customStream
            stream.getTracks().forEach(function (track) {
              constraints.customStream.addTrack(track);
            }); //display customStream

            loadVideo(display, constraints.customStream, screenShare, requestAudioConstraints, resolve, constraints);
          }, reject);
        } else {
          //display customStream
          loadVideo(display, constraints.customStream, screenShare, requestAudioConstraints, resolve, constraints);
        }
      } else {
        navigator.getUserMedia(constraints, function (stream) {
          loadVideo(display, stream, screenShare, requestAudioConstraints, resolve, constraints);
        }, reject);
      }
    }
  });
};

var loadVideo = function loadVideo(display, stream, screenShare, requestAudioConstraints, resolve, constraints) {
  var video = getCacheInstance(display);

  if (!video) {
    video = document.createElement('video');
    display.appendChild(video);
  }

  if (createMicGainNode && stream.getAudioTracks().length > 0 && browserDetails.browser == "chrome") {
    //WCS-1696. We need to start audioContext to work with gain control
    audioContext.resume();
    microphoneGain = createGainNode(stream);
  }

  video.id = uuid_v1() + LOCAL_CACHED_VIDEO;
  video.srcObject = stream; //mute audio

  video.muted = true;

  video.onloadedmetadata = function (e) {
    if (screenShare && !window.chrome) {
      setScreenResolution(video, stream, constraints);
    }

    video.play();
  };

  if (constraints.systemSound && browserDetails.browser == "chrome") {
    addSystemSound();
  } else {
    resolveCallback();
  }

  function resolveCallback() {
    // This hack for chrome only, firefox supports screen-sharing + audio natively
    if (requestAudioConstraints && browserDetails.browser == "chrome") {
      logger.info(LOG_PREFIX, "Request for audio stream");
      navigator.getUserMedia({
        audio: requestAudioConstraints
      }, function (stream) {
        logger.info(LOG_PREFIX, "Got audio stream, add it to video stream");

        if (video.srcObject.getAudioTracks()[0]) {
          var mixedTrack = mixAudioTracks(stream, video.srcObject);
          var originalTrack = video.srcObject.getAudioTracks()[0];
          video.srcObject.removeTrack(originalTrack);
          video.srcObject.addTrack(mixedTrack);
        } else {
          video.srcObject.addTrack(stream.getAudioTracks()[0]);
        }

        resolve(display);
      });
    } else {
      resolve(display);
    }
  }

  function addSystemSound() {
    chrome.runtime.sendMessage(extensionId, {
      type: "isInstalled"
    }, function (response) {
      if (response) {
        chrome.runtime.sendMessage(extensionId, {
          type: "getSourceId"
        }, function (response) {
          if (response.error) {
            resolveCallback();
            logger.error(LOG_PREFIX, response.error);
          } else {
            if (response.systemSoundAccess) {
              var constraints = {
                audio: {
                  mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: response.sourceId,
                    echoCancellation: true
                  },
                  optional: []
                },
                video: {
                  mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: response.sourceId
                  },
                  optional: []
                }
              };
              navigator.getUserMedia(constraints, function (audioStream) {
                if (stream.getAudioTracks().length > 0) {
                  var originalAudioTrack = stream.getAudioTracks()[0];
                  var mixedTrack = mixAudioTracks(stream, audioStream);
                  stream.addTrack(mixedTrack);
                  stream.removeTrack(originalAudioTrack);
                } else {
                  stream.addTrack(audioStream.getAudioTracks()[0]);
                }

                resolveCallback();
              }, function (reason) {
                resolveCallback();
                logger.error(LOG_PREFIX, reason);
              });
            } else {
              resolveCallback();
              logger.error(LOG_PREFIX, "System sound: access is denied by the user");
            }
          }
        });
      } else {
        resolveCallback();
      }
    });
  }
};

var createGainNode = function createGainNode(stream) {
  var audioCtx = audioContext;
  var source = audioCtx.createMediaStreamSource(stream);
  var gainNode = audioCtx.createGain();
  var destination = audioCtx.createMediaStreamDestination();
  var outputStream = destination.stream;
  source.connect(gainNode);
  gainNode.connect(destination);
  var sourceAudioTrack = stream.getAudioTracks()[0];
  gainNode.sourceAudioTrack = sourceAudioTrack;

  gainNode.release = function () {
    this.sourceAudioTrack.stop();
    this.disconnect();
  };

  stream.addTrack(outputStream.getAudioTracks()[0]);
  stream.removeTrack(sourceAudioTrack);
  return gainNode;
}; //Fix to set screen resolution for screen sharing in Firefox


var setScreenResolution = function setScreenResolution(video, stream, constraints) {
  var newHeight;
  var newWidth;
  var videoRatio;

  if (video.videoWidth > video.videoHeight) {
    videoRatio = video.videoWidth / video.videoHeight;
    newHeight = constraints.video.videoWidth / videoRatio;
    newWidth = constraints.video.videoWidth;
  } else {
    videoRatio = video.videoHeight / video.videoWidth;
    newWidth = constraints.video.videoHeight / videoRatio;
    newHeight = constraints.video.videoHeight;
  }

  console.log("videoRatio === " + videoRatio);
  stream.getVideoTracks()[0].applyConstraints({
    height: newHeight,
    width: newWidth
  });
}; //for chrome


var getScreenDeviceIdWoExtension = function getScreenDeviceIdWoExtension(constraints) {
  return new Promise(function (resolve, reject) {
    //WCS-1952. exact constraints are not supported.
    //WCS-1986. added audio: true to constraints.
    resolve({
      video: true,
      audio: true
    });
  });
};

var getScreenDeviceId = function getScreenDeviceId(constraints) {
  return new Promise(function (resolve, reject) {
    var o = {};

    if (window.chrome) {
      chrome.runtime.sendMessage(extensionId, {
        type: "isInstalled"
      }, function (response) {
        //WCS-1972. fixed "TypeError"
        if (response) {
          o.maxWidth = constraints && constraints.video && constraints.video.width ? constraints.video.width : 320;
          o.maxHeight = constraints && constraints.video && constraints.video.height ? constraints.video.height : 240;
          o.maxFrameRate = constraints && constraints.video && constraints.video.frameRate && constraints.video.frameRate.ideal ? constraints.video.frameRate.ideal : 30;
          o.chromeMediaSource = "desktop";
          chrome.runtime.sendMessage(extensionId, {
            type: "getSourceId"
          }, function (response) {
            if (response.error) {
              reject(new Error("Screen access denied"));
            } else {
              o.chromeMediaSourceId = response.sourceId;
              var result = {
                mandatory: o,
                sourceId: response.sourceId
              };

              if (response.systemSoundAccess) {
                result.audioMandatory = {
                  chromeMediaSource: "desktop",
                  chromeMediaSourceId: response.sourceId,
                  echoCancellation: true
                };
              }

              resolve(result);
            }
          });
        } else {
          reject(new Error("Screen sharing extension is not available"));
        }
      });
    } else {
      //firefox case
      o.mediaSource = constraints.video.mediaSource;
      o.width = {};
      o.height = {};
      o.frameRate = {
        min: constraints.video.frameRate.max,
        max: constraints.video.frameRate.max
      };
      o.videoWidth = constraints.video.width;
      o.videoHeight = constraints.video.height;
      resolve(o);
    }
  });
};

var releaseMedia = function releaseMedia(display) {
  var video = getCacheInstance(display);

  if (video) {
    removeVideoElement(video);
    return true;
  }

  return false;
};

function getCacheInstance(display) {
  if (!display) return;
  var i;

  for (i = 0; i < display.children.length; i++) {
    if (display.children[i] && (display.children[i].id.indexOf(LOCAL_CACHED_VIDEO) != -1 || display.children[i].id.indexOf(REMOTE_CACHED_VIDEO) != -1)) {
      logger.info(LOG_PREFIX, "FOUND WEBRTC CACHED INSTANCE, id " + display.children[i].id);
      return display.children[i];
    }
  }
}

function removeVideoElement(video) {
  if (video.srcObject) {
    //pause
    video.pause(); //stop media tracks

    var tracks = video.srcObject.getTracks();

    for (var i = 0; i < tracks.length; i++) {
      tracks[i].stop();

      if (video.id.indexOf(LOCAL_CACHED_VIDEO) != -1 && tracks[i].kind == 'audio' && microphoneGain) {
        microphoneGain.release();
      }
    }

    video.srcObject = null;
  }
}
/**
 * Check WebRTC available
 *
 * @returns {boolean} webrtc available
 */


var available = function available() {
  //return (adapter.browserDetails.browser != "edge") ? navigator.getUserMedia && RTCPeerConnection : false;
  return 'getUserMedia' in navigator && 'RTCPeerConnection' in window;
};

var listDevices = function listDevices(labels, kind, deviceConstraints) {
  //WCS-1963. added deviceConstraints.
  if (!deviceConstraints) {
    deviceConstraints = {
      audio: true,
      video: true
    };
  }

  if (!kind) {
    kind = constants.MEDIA_DEVICE_KIND.INPUT;
  } else if (kind == "all") {
    kind = "";
  }

  var getConstraints = function getConstraints(devices) {
    var constraints = {};

    for (var i = 0; i < devices.length; i++) {
      var device = devices[i];

      if (device.kind.indexOf("audio" + kind) === 0 && deviceConstraints.audio) {
        constraints.audio = true;
      } else if (device.kind.indexOf("video" + kind) === 0 && deviceConstraints.video) {
        constraints.video = true;
      } else {
        logger.debug(LOG_PREFIX, "unknown device " + device.kind + " id " + device.deviceId);
      }
    }

    return constraints;
  };

  var getList = function getList(devices) {
    var list = {
      audio: [],
      video: []
    };
    var micCount = 0;
    var outputCount = 0;
    var camCount = 0;

    for (var i = 0; i < devices.length; i++) {
      var device = devices[i];
      var ret = {
        id: device.deviceId,
        label: device.label
      };

      if (device.kind.indexOf("audio" + kind) === 0 && device.deviceId != "communications") {
        ret.type = device.kind == "audioinput" ? "mic" : "speaker";

        if (ret.type == "mic" && ret.label == "") {
          ret.label = 'microphone' + ++micCount;
        }

        if (ret.type == "speaker" && ret.label == "") {
          ret.label = 'speaker' + ++outputCount;
        }

        list.audio.push(ret);
      } else if (device.kind.indexOf("video" + kind) === 0) {
        if (ret.label == "") {
          ret.label = 'camera' + ++camCount;
        }

        ret.type = "camera";
        list.video.push(ret);
      } else {
        logger.debug(LOG_PREFIX, "unknown device " + device.kind + " id " + device.deviceId);
      }
    }

    return list;
  };

  return new Promise(function (resolve, reject) {
    navigator.mediaDevices.enumerateDevices().then(function (devices) {
      if (labels) {
        //WCS-2708. Fixed uncaught exception if no camera and mic
        var constraints = getConstraints(devices);

        if (Object.keys(constraints).length === 0) {
          reject(new Error(kind + " media devices not found"));
          return;
        }

        navigator.getUserMedia(constraints, function (stream) {
          navigator.mediaDevices.enumerateDevices().then(function (devicesWithLabales) {
            resolve(getList(devicesWithLabales));
            stream.getTracks().forEach(function (track) {
              track.stop();
            });
          }, reject);
        }, reject);
      } else {
        resolve(getList(devices));
      }
    }, reject);
  });
};

function normalizeConstraints(constraints) {
  //WCS-2010. fixed TypeError after publish->stop->publish
  //WCS-2373. fixed customStream
  var customStream = constraints.customStream;
  constraints = JSON.parse(JSON.stringify(constraints));
  constraints.customStream = customStream;

  if (constraints.video) {
    if (constraints.video === true) {
      constraints.video = {};
    }

    if (_typeof(constraints.video) === 'object') {
      var width = constraints.video.width;
      var height = constraints.video.height;

      if (browserDetails.browser == "safari") {
        if (!width || !height) {
          constraints.video.width = {
            min: 320,
            max: 640
          };
          constraints.video.height = {
            min: 240,
            max: 480
          };
        } else if (_typeof(width) !== 'object' || _typeof(height) !== 'object') {
          constraints.video.width = {
            min: width,
            max: width
          };
          constraints.video.height = {
            min: height,
            max: height
          };
        }
      } else if (isNaN(width) || width === 0 || isNaN(height) || height === 0) {
        constraints.video.width = 320;
        constraints.video.height = 240;
      } //WCS-1972. fixed "TypeError"
      // Set default FPS value


      var frameRate = !constraints.video.frameRate || constraints.video.frameRate == 0 ? 30 : constraints.video.frameRate;
      constraints.video.frameRate = {
        ideal: frameRate
      };
    }
  }

  if (constraints.audio) {
    // The WebRTC AEC implementation doesn't work well on stereophonic sound and makes mono on output
    if (constraints.audio.stereo) {
      constraints.audio.echoCancellation = false;
      constraints.audio.googEchoCancellation = false;
    }
  }

  return constraints;
}

var playFirstSound = function playFirstSound() {
  if (audioContext) {
    var buffer = audioContext.createBuffer(1, 441, 44100);
    var output = buffer.getChannelData(0);

    for (var i = 0; i < output.length; i++) {
      output[i] = 0;
    }

    var source = audioContext.createBufferSource();
    source.buffer = buffer; // Connect to output (speakers)

    source.connect(audioContext.destination); // Play sound

    if (source.start) {
      source.start(0);
    } else if (source.play) {
      source.play(0);
    } else if (source.noteOn) {
      source.noteOn(0);
    }

    return true;
  }

  return false;
};

var playFirstVideo = function playFirstVideo(display, isLocal, src) {
  return new Promise(function (resolve, reject) {
    if (!getCacheInstance(display)) {
      var video = document.createElement('video');
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.id = uuid_v1() + (isLocal ? LOCAL_CACHED_VIDEO : REMOTE_CACHED_VIDEO); //in WCS-1560 we removed video.play() call, because it triggers the “Unhandled Promise Rejection” exception in iOS Safari
      //in WCS-2160 we rolled back the changes made in WCS-1560 due to no audio on first playback in iOS Safari

      if (src) {
        video.src = src;
        video.play().then(function () {
          display.appendChild(video);
          resolve();
        })["catch"](function () {
          //WCS-2375. fixed autoplay in ios safari
          logger.info(LOG_PREFIX, "Autoplay detected! Trying to play a video with a muted sound...");
          video.muted = true;
          video.play().then(function () {
            display.appendChild(video);
            resolve();
          }); //WCS-2375. low power mode suspends video play

          video.onsuspend = function (event) {
            reject();
          };
        });
        return;
      }
    }

    resolve();
  });
};

module.exports = {
  createConnection: createConnection,
  getMediaAccess: getMediaAccess,
  releaseMedia: releaseMedia,
  listDevices: listDevices,
  playFirstSound: playFirstSound,
  playFirstVideo: playFirstVideo,
  available: available,
  configure: function configure(configuration) {
    extensionId = configuration.extensionId;
    defaultConstraints = configuration.constraints;
    audioContext = configuration.audioContext;
    logger = configuration.logger;
    createMicGainNode = typeof configuration.createMicGainNode !== 'undefined' ? configuration.createMicGainNode : true;
    logger.info(LOG_PREFIX, "Initialized");
  }
};

},{"./constants":26,"./util":29,"uuid/v1":10,"webrtc-adapter":11}]},{},[27])(27)
});
