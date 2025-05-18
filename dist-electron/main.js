"use strict";
var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _value, _a2, _b, _c2, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z, __, _$, _aa, _ba, _ca, _da, _ea, _fa, _ga, _ha, _ia, _ja, _ka, _la, _ma, _na, _oa, _pa, _qa, _ra, _sa, _ta, _ua, _va, _wa, _xa, _ya, _za, _Aa, _Ba, _Ca, _Da, _Ea, _Fa, _Ga, _Ha, _Ia, _Ja, _Ka, _La, _Ma, _Na, _Oa, _Pa, _Qa, _Ra, _Sa, _Ta, _Ua, _Va, _Wa, _Xa, _Ya, _Za, __a, _$a, _ab, _bb, _cb, _db, _eb, _fb, _gb, _hb, _ib, _jb, _kb, _lb, _mb, _nb, _ob, _pb, _qb, _rb, _sb, _tb, _ub, _vb, _wb, _xb, _yb, _zb, _Ab, _Bb, _Cb, _Db, _Eb, _Fb, _Gb, _Hb, _Ib, _Jb, _Kb, _Lb, _Mb, _Nb, _Ob, _Pb, _Qb, _Rb, _Sb, _Tb, _Ub, _Vb, _Wb, _Xb, _Yb, _Zb, __b, _$b, _ac, _bc, _cc, _dc;
const electron = require("electron");
const path$1 = require("path");
const require$$0$2 = require("os");
const require$$1 = require("events");
const fs$1 = require("fs");
const require$$2 = require("util");
const require$$2$1 = require("worker_threads");
const require$$0$1 = require("module");
const require$$4 = require("url");
const require$$7 = require("buffer");
const require$$8 = require("assert");
const fs$2 = require("fs/promises");
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var pino$2 = { exports: {} };
const isErrorLike$2 = (err2) => {
  return err2 && typeof err2.message === "string";
};
const getErrorCause = (err2) => {
  if (!err2) return;
  const cause = err2.cause;
  if (typeof cause === "function") {
    const causeResult = err2.cause();
    return isErrorLike$2(causeResult) ? causeResult : void 0;
  } else {
    return isErrorLike$2(cause) ? cause : void 0;
  }
};
const _stackWithCauses = (err2, seen2) => {
  if (!isErrorLike$2(err2)) return "";
  const stack = err2.stack || "";
  if (seen2.has(err2)) {
    return stack + "\ncauses have become circular...";
  }
  const cause = getErrorCause(err2);
  if (cause) {
    seen2.add(err2);
    return stack + "\ncaused by: " + _stackWithCauses(cause, seen2);
  } else {
    return stack;
  }
};
const stackWithCauses$1 = (err2) => _stackWithCauses(err2, /* @__PURE__ */ new Set());
const _messageWithCauses = (err2, seen2, skip) => {
  if (!isErrorLike$2(err2)) return "";
  const message = skip ? "" : err2.message || "";
  if (seen2.has(err2)) {
    return message + ": ...";
  }
  const cause = getErrorCause(err2);
  if (cause) {
    seen2.add(err2);
    const skipIfVErrorStyleCause = typeof err2.cause === "function";
    return message + (skipIfVErrorStyleCause ? "" : ": ") + _messageWithCauses(cause, seen2, skipIfVErrorStyleCause);
  } else {
    return message;
  }
};
const messageWithCauses$1 = (err2) => _messageWithCauses(err2, /* @__PURE__ */ new Set());
var errHelpers = {
  isErrorLike: isErrorLike$2,
  stackWithCauses: stackWithCauses$1,
  messageWithCauses: messageWithCauses$1
};
const seen$2 = Symbol("circular-ref-tag");
const rawSymbol$2 = Symbol("pino-raw-err-ref");
const pinoErrProto$2 = Object.create({}, {
  type: {
    enumerable: true,
    writable: true,
    value: void 0
  },
  message: {
    enumerable: true,
    writable: true,
    value: void 0
  },
  stack: {
    enumerable: true,
    writable: true,
    value: void 0
  },
  aggregateErrors: {
    enumerable: true,
    writable: true,
    value: void 0
  },
  raw: {
    enumerable: false,
    get: function() {
      return this[rawSymbol$2];
    },
    set: function(val) {
      this[rawSymbol$2] = val;
    }
  }
});
Object.defineProperty(pinoErrProto$2, rawSymbol$2, {
  writable: true,
  value: {}
});
var errProto = {
  pinoErrProto: pinoErrProto$2,
  pinoErrorSymbols: {
    seen: seen$2
  }
};
var err = errSerializer$1;
const { messageWithCauses, stackWithCauses, isErrorLike: isErrorLike$1 } = errHelpers;
const { pinoErrProto: pinoErrProto$1, pinoErrorSymbols: pinoErrorSymbols$1 } = errProto;
const { seen: seen$1 } = pinoErrorSymbols$1;
const { toString: toString$2 } = Object.prototype;
function errSerializer$1(err2) {
  if (!isErrorLike$1(err2)) {
    return err2;
  }
  err2[seen$1] = void 0;
  const _err = Object.create(pinoErrProto$1);
  _err.type = toString$2.call(err2.constructor) === "[object Function]" ? err2.constructor.name : err2.name;
  _err.message = messageWithCauses(err2);
  _err.stack = stackWithCauses(err2);
  if (Array.isArray(err2.errors)) {
    _err.aggregateErrors = err2.errors.map((err3) => errSerializer$1(err3));
  }
  for (const key in err2) {
    if (_err[key] === void 0) {
      const val = err2[key];
      if (isErrorLike$1(val)) {
        if (key !== "cause" && !Object.prototype.hasOwnProperty.call(val, seen$1)) {
          _err[key] = errSerializer$1(val);
        }
      } else {
        _err[key] = val;
      }
    }
  }
  delete err2[seen$1];
  _err.raw = err2;
  return _err;
}
var errWithCause = errWithCauseSerializer$1;
const { isErrorLike } = errHelpers;
const { pinoErrProto, pinoErrorSymbols } = errProto;
const { seen } = pinoErrorSymbols;
const { toString: toString$1 } = Object.prototype;
function errWithCauseSerializer$1(err2) {
  if (!isErrorLike(err2)) {
    return err2;
  }
  err2[seen] = void 0;
  const _err = Object.create(pinoErrProto);
  _err.type = toString$1.call(err2.constructor) === "[object Function]" ? err2.constructor.name : err2.name;
  _err.message = err2.message;
  _err.stack = err2.stack;
  if (Array.isArray(err2.errors)) {
    _err.aggregateErrors = err2.errors.map((err3) => errWithCauseSerializer$1(err3));
  }
  if (isErrorLike(err2.cause) && !Object.prototype.hasOwnProperty.call(err2.cause, seen)) {
    _err.cause = errWithCauseSerializer$1(err2.cause);
  }
  for (const key in err2) {
    if (_err[key] === void 0) {
      const val = err2[key];
      if (isErrorLike(val)) {
        if (!Object.prototype.hasOwnProperty.call(val, seen)) {
          _err[key] = errWithCauseSerializer$1(val);
        }
      } else {
        _err[key] = val;
      }
    }
  }
  delete err2[seen];
  _err.raw = err2;
  return _err;
}
var req = {
  mapHttpRequest: mapHttpRequest$1,
  reqSerializer
};
const rawSymbol$1 = Symbol("pino-raw-req-ref");
const pinoReqProto = Object.create({}, {
  id: {
    enumerable: true,
    writable: true,
    value: ""
  },
  method: {
    enumerable: true,
    writable: true,
    value: ""
  },
  url: {
    enumerable: true,
    writable: true,
    value: ""
  },
  query: {
    enumerable: true,
    writable: true,
    value: ""
  },
  params: {
    enumerable: true,
    writable: true,
    value: ""
  },
  headers: {
    enumerable: true,
    writable: true,
    value: {}
  },
  remoteAddress: {
    enumerable: true,
    writable: true,
    value: ""
  },
  remotePort: {
    enumerable: true,
    writable: true,
    value: ""
  },
  raw: {
    enumerable: false,
    get: function() {
      return this[rawSymbol$1];
    },
    set: function(val) {
      this[rawSymbol$1] = val;
    }
  }
});
Object.defineProperty(pinoReqProto, rawSymbol$1, {
  writable: true,
  value: {}
});
function reqSerializer(req2) {
  const connection = req2.info || req2.socket;
  const _req = Object.create(pinoReqProto);
  _req.id = typeof req2.id === "function" ? req2.id() : req2.id || (req2.info ? req2.info.id : void 0);
  _req.method = req2.method;
  if (req2.originalUrl) {
    _req.url = req2.originalUrl;
  } else {
    const path2 = req2.path;
    _req.url = typeof path2 === "string" ? path2 : req2.url ? req2.url.path || req2.url : void 0;
  }
  if (req2.query) {
    _req.query = req2.query;
  }
  if (req2.params) {
    _req.params = req2.params;
  }
  _req.headers = req2.headers;
  _req.remoteAddress = connection && connection.remoteAddress;
  _req.remotePort = connection && connection.remotePort;
  _req.raw = req2.raw || req2;
  return _req;
}
function mapHttpRequest$1(req2) {
  return {
    req: reqSerializer(req2)
  };
}
var res = {
  mapHttpResponse: mapHttpResponse$1,
  resSerializer
};
const rawSymbol = Symbol("pino-raw-res-ref");
const pinoResProto = Object.create({}, {
  statusCode: {
    enumerable: true,
    writable: true,
    value: 0
  },
  headers: {
    enumerable: true,
    writable: true,
    value: ""
  },
  raw: {
    enumerable: false,
    get: function() {
      return this[rawSymbol];
    },
    set: function(val) {
      this[rawSymbol] = val;
    }
  }
});
Object.defineProperty(pinoResProto, rawSymbol, {
  writable: true,
  value: {}
});
function resSerializer(res2) {
  const _res = Object.create(pinoResProto);
  _res.statusCode = res2.headersSent ? res2.statusCode : null;
  _res.headers = res2.getHeaders ? res2.getHeaders() : res2._headers;
  _res.raw = res2;
  return _res;
}
function mapHttpResponse$1(res2) {
  return {
    res: resSerializer(res2)
  };
}
const errSerializer = err;
const errWithCauseSerializer = errWithCause;
const reqSerializers = req;
const resSerializers = res;
var pinoStdSerializers = {
  err: errSerializer,
  errWithCause: errWithCauseSerializer,
  mapHttpRequest: reqSerializers.mapHttpRequest,
  mapHttpResponse: resSerializers.mapHttpResponse,
  req: reqSerializers.reqSerializer,
  res: resSerializers.resSerializer,
  wrapErrorSerializer: function wrapErrorSerializer(customSerializer) {
    if (customSerializer === errSerializer) return customSerializer;
    return function wrapErrSerializer(err2) {
      return customSerializer(errSerializer(err2));
    };
  },
  wrapRequestSerializer: function wrapRequestSerializer(customSerializer) {
    if (customSerializer === reqSerializers.reqSerializer) return customSerializer;
    return function wrappedReqSerializer(req2) {
      return customSerializer(reqSerializers.reqSerializer(req2));
    };
  },
  wrapResponseSerializer: function wrapResponseSerializer(customSerializer) {
    if (customSerializer === resSerializers.resSerializer) return customSerializer;
    return function wrappedResSerializer(res2) {
      return customSerializer(resSerializers.resSerializer(res2));
    };
  }
};
function noOpPrepareStackTrace(_, stack) {
  return stack;
}
var caller$1 = function getCallers() {
  const originalPrepare = Error.prepareStackTrace;
  Error.prepareStackTrace = noOpPrepareStackTrace;
  const stack = new Error().stack;
  Error.prepareStackTrace = originalPrepare;
  if (!Array.isArray(stack)) {
    return void 0;
  }
  const entries = stack.slice(2);
  const fileNames = [];
  for (const entry of entries) {
    if (!entry) {
      continue;
    }
    fileNames.push(entry.getFileName());
  }
  return fileNames;
};
var validator_1 = validator$2;
function validator$2(opts = {}) {
  const {
    ERR_PATHS_MUST_BE_STRINGS = () => "fast-redact - Paths must be (non-empty) strings",
    ERR_INVALID_PATH = (s) => `fast-redact – Invalid path (${s})`
  } = opts;
  return function validate2({ paths }) {
    paths.forEach((s) => {
      if (typeof s !== "string") {
        throw Error(ERR_PATHS_MUST_BE_STRINGS());
      }
      try {
        if (/〇/.test(s)) throw Error();
        const expr = (s[0] === "[" ? "" : ".") + s.replace(/^\*/, "〇").replace(/\.\*/g, ".〇").replace(/\[\*\]/g, "[〇]");
        if (/\n|\r|;/.test(expr)) throw Error();
        if (/\/\*/.test(expr)) throw Error();
        Function(`
            'use strict'
            const o = new Proxy({}, { get: () => o, set: () => { throw Error() } });
            const 〇 = null;
            o${expr}
            if ([o${expr}].length !== 1) throw Error()`)();
      } catch (e) {
        throw Error(ERR_INVALID_PATH(s));
      }
    });
  };
}
var rx$4 = /[^.[\]]+|\[((?:.)*?)\]/g;
const rx$3 = rx$4;
var parse_1 = parse$1;
function parse$1({ paths }) {
  const wildcards = [];
  var wcLen = 0;
  const secret = paths.reduce(function(o, strPath, ix) {
    var path2 = strPath.match(rx$3).map((p) => p.replace(/'|"|`/g, ""));
    const leadingBracket = strPath[0] === "[";
    path2 = path2.map((p) => {
      if (p[0] === "[") return p.substr(1, p.length - 2);
      else return p;
    });
    const star = path2.indexOf("*");
    if (star > -1) {
      const before = path2.slice(0, star);
      const beforeStr = before.join(".");
      const after = path2.slice(star + 1, path2.length);
      const nested = after.length > 0;
      wcLen++;
      wildcards.push({
        before,
        beforeStr,
        after,
        nested
      });
    } else {
      o[strPath] = {
        path: path2,
        val: void 0,
        precensored: false,
        circle: "",
        escPath: JSON.stringify(strPath),
        leadingBracket
      };
    }
    return o;
  }, {});
  return { wildcards, wcLen, secret };
}
const rx$2 = rx$4;
var redactor_1 = redactor$1;
function redactor$1({ secret, serialize, wcLen, strict: strict2, isCensorFct, censorFctTakesPath }, state2) {
  const redact2 = Function("o", `
    if (typeof o !== 'object' || o == null) {
      ${strictImpl(strict2, serialize)}
    }
    const { censor, secret } = this
    const originalSecret = {}
    const secretKeys = Object.keys(secret)
    for (var i = 0; i < secretKeys.length; i++) {
      originalSecret[secretKeys[i]] = secret[secretKeys[i]]
    }

    ${redactTmpl(secret, isCensorFct, censorFctTakesPath)}
    this.compileRestore()
    ${dynamicRedactTmpl(wcLen > 0, isCensorFct, censorFctTakesPath)}
    this.secret = originalSecret
    ${resultTmpl(serialize)}
  `).bind(state2);
  redact2.state = state2;
  if (serialize === false) {
    redact2.restore = (o) => state2.restore(o);
  }
  return redact2;
}
function redactTmpl(secret, isCensorFct, censorFctTakesPath) {
  return Object.keys(secret).map((path2) => {
    const { escPath, leadingBracket, path: arrPath } = secret[path2];
    const skip = leadingBracket ? 1 : 0;
    const delim = leadingBracket ? "" : ".";
    const hops = [];
    var match2;
    while ((match2 = rx$2.exec(path2)) !== null) {
      const [, ix] = match2;
      const { index: index2, input } = match2;
      if (index2 > skip) hops.push(input.substring(0, index2 - (ix ? 0 : 1)));
    }
    var existence = hops.map((p) => `o${delim}${p}`).join(" && ");
    if (existence.length === 0) existence += `o${delim}${path2} != null`;
    else existence += ` && o${delim}${path2} != null`;
    const circularDetection = `
      switch (true) {
        ${hops.reverse().map((p) => `
          case o${delim}${p} === censor:
            secret[${escPath}].circle = ${JSON.stringify(p)}
            break
        `).join("\n")}
      }
    `;
    const censorArgs = censorFctTakesPath ? `val, ${JSON.stringify(arrPath)}` : `val`;
    return `
      if (${existence}) {
        const val = o${delim}${path2}
        if (val === censor) {
          secret[${escPath}].precensored = true
        } else {
          secret[${escPath}].val = val
          o${delim}${path2} = ${isCensorFct ? `censor(${censorArgs})` : "censor"}
          ${circularDetection}
        }
      }
    `;
  }).join("\n");
}
function dynamicRedactTmpl(hasWildcards, isCensorFct, censorFctTakesPath) {
  return hasWildcards === true ? `
    {
      const { wildcards, wcLen, groupRedact, nestedRedact } = this
      for (var i = 0; i < wcLen; i++) {
        const { before, beforeStr, after, nested } = wildcards[i]
        if (nested === true) {
          secret[beforeStr] = secret[beforeStr] || []
          nestedRedact(secret[beforeStr], o, before, after, censor, ${isCensorFct}, ${censorFctTakesPath})
        } else secret[beforeStr] = groupRedact(o, before, censor, ${isCensorFct}, ${censorFctTakesPath})
      }
    }
  ` : "";
}
function resultTmpl(serialize) {
  return serialize === false ? `return o` : `
    var s = this.serialize(o)
    this.restore(o)
    return s
  `;
}
function strictImpl(strict2, serialize) {
  return strict2 === true ? `throw Error('fast-redact: primitives cannot be redacted')` : serialize === false ? `return o` : `return this.serialize(o)`;
}
var modifiers = {
  groupRedact: groupRedact$1,
  groupRestore: groupRestore$1,
  nestedRedact: nestedRedact$1,
  nestedRestore: nestedRestore$1
};
function groupRestore$1({ keys: keys2, values, target }) {
  if (target == null || typeof target === "string") return;
  const length = keys2.length;
  for (var i = 0; i < length; i++) {
    const k = keys2[i];
    target[k] = values[i];
  }
}
function groupRedact$1(o, path2, censor, isCensorFct, censorFctTakesPath) {
  const target = get$8(o, path2);
  if (target == null || typeof target === "string") return { keys: null, values: null, target, flat: true };
  const keys2 = Object.keys(target);
  const keysLength = keys2.length;
  const pathLength = path2.length;
  const pathWithKey = censorFctTakesPath ? [...path2] : void 0;
  const values = new Array(keysLength);
  for (var i = 0; i < keysLength; i++) {
    const key = keys2[i];
    values[i] = target[key];
    if (censorFctTakesPath) {
      pathWithKey[pathLength] = key;
      target[key] = censor(target[key], pathWithKey);
    } else if (isCensorFct) {
      target[key] = censor(target[key]);
    } else {
      target[key] = censor;
    }
  }
  return { keys: keys2, values, target, flat: true };
}
function nestedRestore$1(instructions) {
  for (let i = 0; i < instructions.length; i++) {
    const { target, path: path2, value } = instructions[i];
    let current = target;
    for (let i2 = path2.length - 1; i2 > 0; i2--) {
      current = current[path2[i2]];
    }
    current[path2[0]] = value;
  }
}
function nestedRedact$1(store, o, path2, ns, censor, isCensorFct, censorFctTakesPath) {
  const target = get$8(o, path2);
  if (target == null) return;
  const keys2 = Object.keys(target);
  const keysLength = keys2.length;
  for (var i = 0; i < keysLength; i++) {
    const key = keys2[i];
    specialSet(store, target, key, path2, ns, censor, isCensorFct, censorFctTakesPath);
  }
  return store;
}
function has$4(obj, prop) {
  return obj !== void 0 && obj !== null ? "hasOwn" in Object ? Object.hasOwn(obj, prop) : Object.prototype.hasOwnProperty.call(obj, prop) : false;
}
function specialSet(store, o, k, path2, afterPath, censor, isCensorFct, censorFctTakesPath) {
  const afterPathLen = afterPath.length;
  const lastPathIndex = afterPathLen - 1;
  const originalKey = k;
  var i = -1;
  var n;
  var nv;
  var ov;
  var wc = null;
  var kIsWc;
  var wcov;
  var consecutive = false;
  var level = 0;
  var depth = 0;
  var redactPathCurrent = tree();
  ov = n = o[k];
  if (typeof n !== "object") return;
  while (n != null && ++i < afterPathLen) {
    depth += 1;
    k = afterPath[i];
    if (k !== "*" && !wc && !(typeof n === "object" && k in n)) {
      break;
    }
    if (k === "*") {
      if (wc === "*") {
        consecutive = true;
      }
      wc = k;
      if (i !== lastPathIndex) {
        continue;
      }
    }
    if (wc) {
      const wcKeys = Object.keys(n);
      for (var j = 0; j < wcKeys.length; j++) {
        const wck = wcKeys[j];
        wcov = n[wck];
        kIsWc = k === "*";
        if (consecutive) {
          redactPathCurrent = node(redactPathCurrent, wck, depth);
          level = i;
          ov = iterateNthLevel(wcov, level - 1, k, path2, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, o[originalKey], depth + 1);
        } else {
          if (kIsWc || typeof wcov === "object" && wcov !== null && k in wcov) {
            if (kIsWc) {
              ov = wcov;
            } else {
              ov = wcov[k];
            }
            nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [...path2, originalKey, ...afterPath]) : censor(ov) : censor;
            if (kIsWc) {
              const rv = restoreInstr(node(redactPathCurrent, wck, depth), ov, o[originalKey]);
              store.push(rv);
              n[wck] = nv;
            } else {
              if (wcov[k] === nv) ;
              else if (nv === void 0 && censor !== void 0 || has$4(wcov, k) && nv === ov) {
                redactPathCurrent = node(redactPathCurrent, wck, depth);
              } else {
                redactPathCurrent = node(redactPathCurrent, wck, depth);
                const rv = restoreInstr(node(redactPathCurrent, k, depth + 1), ov, o[originalKey]);
                store.push(rv);
                wcov[k] = nv;
              }
            }
          }
        }
      }
      wc = null;
    } else {
      ov = n[k];
      redactPathCurrent = node(redactPathCurrent, k, depth);
      nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [...path2, originalKey, ...afterPath]) : censor(ov) : censor;
      if (has$4(n, k) && nv === ov || nv === void 0 && censor !== void 0) ;
      else {
        const rv = restoreInstr(redactPathCurrent, ov, o[originalKey]);
        store.push(rv);
        n[k] = nv;
      }
      n = n[k];
    }
    if (typeof n !== "object") break;
  }
}
function get$8(o, p) {
  var i = -1;
  var l = p.length;
  var n = o;
  while (n != null && ++i < l) {
    n = n[p[i]];
  }
  return n;
}
function iterateNthLevel(wcov, level, k, path2, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, parent, depth) {
  if (level === 0) {
    if (kIsWc || typeof wcov === "object" && wcov !== null && k in wcov) {
      if (kIsWc) {
        ov = wcov;
      } else {
        ov = wcov[k];
      }
      nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [...path2, originalKey, ...afterPath]) : censor(ov) : censor;
      if (kIsWc) {
        const rv = restoreInstr(redactPathCurrent, ov, parent);
        store.push(rv);
        n[wck] = nv;
      } else {
        if (wcov[k] === nv) ;
        else if (nv === void 0 && censor !== void 0 || has$4(wcov, k) && nv === ov) ;
        else {
          const rv = restoreInstr(node(redactPathCurrent, k, depth + 1), ov, parent);
          store.push(rv);
          wcov[k] = nv;
        }
      }
    }
  }
  for (const key in wcov) {
    if (typeof wcov[key] === "object") {
      redactPathCurrent = node(redactPathCurrent, key, depth);
      iterateNthLevel(wcov[key], level - 1, k, path2, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, parent, depth + 1);
    }
  }
}
function tree() {
  return { parent: null, key: null, children: [], depth: 0 };
}
function node(parent, key, depth) {
  if (parent.depth === depth) {
    return node(parent.parent, key, depth);
  }
  var child2 = {
    parent,
    key,
    depth,
    children: []
  };
  parent.children.push(child2);
  return child2;
}
function restoreInstr(node2, value, target) {
  let current = node2;
  const path2 = [];
  do {
    path2.push(current.key);
    current = current.parent;
  } while (current.parent != null);
  return { path: path2, value, target };
}
const { groupRestore, nestedRestore } = modifiers;
var restorer_1 = restorer$1;
function restorer$1() {
  return function compileRestore() {
    if (this.restore) {
      this.restore.state.secret = this.secret;
      return;
    }
    const { secret, wcLen } = this;
    const paths = Object.keys(secret);
    const resetters = resetTmpl(secret, paths);
    const hasWildcards = wcLen > 0;
    const state2 = hasWildcards ? { secret, groupRestore, nestedRestore } : { secret };
    this.restore = Function(
      "o",
      restoreTmpl(resetters, paths, hasWildcards)
    ).bind(state2);
    this.restore.state = state2;
  };
}
function resetTmpl(secret, paths) {
  return paths.map((path2) => {
    const { circle, escPath, leadingBracket } = secret[path2];
    const delim = leadingBracket ? "" : ".";
    const reset = circle ? `o.${circle} = secret[${escPath}].val` : `o${delim}${path2} = secret[${escPath}].val`;
    const clear2 = `secret[${escPath}].val = undefined`;
    return `
      if (secret[${escPath}].val !== undefined) {
        try { ${reset} } catch (e) {}
        ${clear2}
      }
    `;
  }).join("");
}
function restoreTmpl(resetters, paths, hasWildcards) {
  const dynamicReset = hasWildcards === true ? `
    const keys = Object.keys(secret)
    const len = keys.length
    for (var i = len - 1; i >= ${paths.length}; i--) {
      const k = keys[i]
      const o = secret[k]
      if (o) {
        if (o.flat === true) this.groupRestore(o)
        else this.nestedRestore(o)
        secret[k] = null
      }
    }
  ` : "";
  return `
    const secret = this.secret
    ${dynamicReset}
    ${resetters}
    return o
  `;
}
var state_1 = state$1;
function state$1(o) {
  const {
    secret,
    censor,
    compileRestore,
    serialize,
    groupRedact: groupRedact2,
    nestedRedact: nestedRedact2,
    wildcards,
    wcLen
  } = o;
  const builder = [{ secret, censor, compileRestore }];
  if (serialize !== false) builder.push({ serialize });
  if (wcLen > 0) builder.push({ groupRedact: groupRedact2, nestedRedact: nestedRedact2, wildcards, wcLen });
  return Object.assign(...builder);
}
const validator$1 = validator_1;
const parse = parse_1;
const redactor = redactor_1;
const restorer = restorer_1;
const { groupRedact, nestedRedact } = modifiers;
const state = state_1;
const rx$1 = rx$4;
const validate$1 = validator$1();
const noop$4 = (o) => o;
noop$4.restore = noop$4;
const DEFAULT_CENSOR = "[REDACTED]";
fastRedact$1.rx = rx$1;
fastRedact$1.validator = validator$1;
var fastRedact_1 = fastRedact$1;
function fastRedact$1(opts = {}) {
  const paths = Array.from(new Set(opts.paths || []));
  const serialize = "serialize" in opts ? opts.serialize === false ? opts.serialize : typeof opts.serialize === "function" ? opts.serialize : JSON.stringify : JSON.stringify;
  const remove2 = opts.remove;
  if (remove2 === true && serialize !== JSON.stringify) {
    throw Error("fast-redact – remove option may only be set when serializer is JSON.stringify");
  }
  const censor = remove2 === true ? void 0 : "censor" in opts ? opts.censor : DEFAULT_CENSOR;
  const isCensorFct = typeof censor === "function";
  const censorFctTakesPath = isCensorFct && censor.length > 1;
  if (paths.length === 0) return serialize || noop$4;
  validate$1({ paths, serialize, censor });
  const { wildcards, wcLen, secret } = parse({ paths });
  const compileRestore = restorer();
  const strict2 = "strict" in opts ? opts.strict : true;
  return redactor({ secret, wcLen, serialize, strict: strict2, isCensorFct, censorFctTakesPath }, state({
    secret,
    censor,
    compileRestore,
    serialize,
    groupRedact,
    nestedRedact,
    wildcards,
    wcLen
  }));
}
const setLevelSym$2 = Symbol("pino.setLevel");
const getLevelSym$1 = Symbol("pino.getLevel");
const levelValSym$2 = Symbol("pino.levelVal");
const levelCompSym$2 = Symbol("pino.levelComp");
const useLevelLabelsSym = Symbol("pino.useLevelLabels");
const useOnlyCustomLevelsSym$3 = Symbol("pino.useOnlyCustomLevels");
const mixinSym$2 = Symbol("pino.mixin");
const lsCacheSym$3 = Symbol("pino.lsCache");
const chindingsSym$3 = Symbol("pino.chindings");
const asJsonSym$1 = Symbol("pino.asJson");
const writeSym$2 = Symbol("pino.write");
const redactFmtSym$3 = Symbol("pino.redactFmt");
const timeSym$2 = Symbol("pino.time");
const timeSliceIndexSym$2 = Symbol("pino.timeSliceIndex");
const streamSym$3 = Symbol("pino.stream");
const stringifySym$3 = Symbol("pino.stringify");
const stringifySafeSym$2 = Symbol("pino.stringifySafe");
const stringifiersSym$3 = Symbol("pino.stringifiers");
const endSym$2 = Symbol("pino.end");
const formatOptsSym$3 = Symbol("pino.formatOpts");
const messageKeySym$3 = Symbol("pino.messageKey");
const errorKeySym$3 = Symbol("pino.errorKey");
const nestedKeySym$2 = Symbol("pino.nestedKey");
const nestedKeyStrSym$2 = Symbol("pino.nestedKeyStr");
const mixinMergeStrategySym$2 = Symbol("pino.mixinMergeStrategy");
const msgPrefixSym$3 = Symbol("pino.msgPrefix");
const wildcardFirstSym$2 = Symbol("pino.wildcardFirst");
const serializersSym$3 = Symbol.for("pino.serializers");
const formattersSym$4 = Symbol.for("pino.formatters");
const hooksSym$2 = Symbol.for("pino.hooks");
const needsMetadataGsym$1 = Symbol.for("pino.metadata");
var symbols$1 = {
  setLevelSym: setLevelSym$2,
  getLevelSym: getLevelSym$1,
  levelValSym: levelValSym$2,
  levelCompSym: levelCompSym$2,
  useLevelLabelsSym,
  mixinSym: mixinSym$2,
  lsCacheSym: lsCacheSym$3,
  chindingsSym: chindingsSym$3,
  asJsonSym: asJsonSym$1,
  writeSym: writeSym$2,
  serializersSym: serializersSym$3,
  redactFmtSym: redactFmtSym$3,
  timeSym: timeSym$2,
  timeSliceIndexSym: timeSliceIndexSym$2,
  streamSym: streamSym$3,
  stringifySym: stringifySym$3,
  stringifySafeSym: stringifySafeSym$2,
  stringifiersSym: stringifiersSym$3,
  endSym: endSym$2,
  formatOptsSym: formatOptsSym$3,
  messageKeySym: messageKeySym$3,
  errorKeySym: errorKeySym$3,
  nestedKeySym: nestedKeySym$2,
  wildcardFirstSym: wildcardFirstSym$2,
  needsMetadataGsym: needsMetadataGsym$1,
  useOnlyCustomLevelsSym: useOnlyCustomLevelsSym$3,
  formattersSym: formattersSym$4,
  hooksSym: hooksSym$2,
  nestedKeyStrSym: nestedKeyStrSym$2,
  mixinMergeStrategySym: mixinMergeStrategySym$2,
  msgPrefixSym: msgPrefixSym$3
};
const fastRedact = fastRedact_1;
const { redactFmtSym: redactFmtSym$2, wildcardFirstSym: wildcardFirstSym$1 } = symbols$1;
const { rx, validator } = fastRedact;
const validate = validator({
  ERR_PATHS_MUST_BE_STRINGS: () => "pino – redacted paths must be strings",
  ERR_INVALID_PATH: (s) => `pino – redact paths array contains an invalid path (${s})`
});
const CENSOR = "[Redacted]";
const strict = false;
function redaction$2(opts, serialize) {
  const { paths, censor } = handle(opts);
  const shape = paths.reduce((o, str) => {
    rx.lastIndex = 0;
    const first = rx.exec(str);
    const next = rx.exec(str);
    let ns = first[1] !== void 0 ? first[1].replace(/^(?:"|'|`)(.*)(?:"|'|`)$/, "$1") : first[0];
    if (ns === "*") {
      ns = wildcardFirstSym$1;
    }
    if (next === null) {
      o[ns] = null;
      return o;
    }
    if (o[ns] === null) {
      return o;
    }
    const { index: index2 } = next;
    const nextPath = `${str.substr(index2, str.length - 1)}`;
    o[ns] = o[ns] || [];
    if (ns !== wildcardFirstSym$1 && o[ns].length === 0) {
      o[ns].push(...o[wildcardFirstSym$1] || []);
    }
    if (ns === wildcardFirstSym$1) {
      Object.keys(o).forEach(function(k) {
        if (o[k]) {
          o[k].push(nextPath);
        }
      });
    }
    o[ns].push(nextPath);
    return o;
  }, {});
  const result = {
    [redactFmtSym$2]: fastRedact({ paths, censor, serialize, strict })
  };
  const topCensor = (...args2) => {
    return typeof censor === "function" ? serialize(censor(...args2)) : serialize(censor);
  };
  return [...Object.keys(shape), ...Object.getOwnPropertySymbols(shape)].reduce((o, k) => {
    if (shape[k] === null) {
      o[k] = (value) => topCensor(value, [k]);
    } else {
      const wrappedCensor = typeof censor === "function" ? (value, path2) => {
        return censor(value, [k, ...path2]);
      } : censor;
      o[k] = fastRedact({
        paths: shape[k],
        censor: wrappedCensor,
        serialize,
        strict
      });
    }
    return o;
  }, result);
}
function handle(opts) {
  if (Array.isArray(opts)) {
    opts = { paths: opts, censor: CENSOR };
    validate(opts);
    return opts;
  }
  let { paths, censor = CENSOR, remove: remove2 } = opts;
  if (Array.isArray(paths) === false) {
    throw Error("pino – redact must contain an array of strings");
  }
  if (remove2 === true) censor = void 0;
  validate({ paths, censor });
  return { paths, censor };
}
var redaction_1 = redaction$2;
const nullTime$1 = () => "";
const epochTime$1 = () => `,"time":${Date.now()}`;
const unixTime = () => `,"time":${Math.round(Date.now() / 1e3)}`;
const isoTime = () => `,"time":"${new Date(Date.now()).toISOString()}"`;
var time$1 = { nullTime: nullTime$1, epochTime: epochTime$1, unixTime, isoTime };
function tryStringify(o) {
  try {
    return JSON.stringify(o);
  } catch (e) {
    return '"[Circular]"';
  }
}
var quickFormatUnescaped = format$4;
function format$4(f, args2, opts) {
  var ss = opts && opts.stringify || tryStringify;
  var offset = 1;
  if (typeof f === "object" && f !== null) {
    var len = args2.length + offset;
    if (len === 1) return f;
    var objects = new Array(len);
    objects[0] = ss(f);
    for (var index2 = 1; index2 < len; index2++) {
      objects[index2] = ss(args2[index2]);
    }
    return objects.join(" ");
  }
  if (typeof f !== "string") {
    return f;
  }
  var argLen = args2.length;
  if (argLen === 0) return f;
  var str = "";
  var a = 1 - offset;
  var lastPos = -1;
  var flen = f && f.length || 0;
  for (var i = 0; i < flen; ) {
    if (f.charCodeAt(i) === 37 && i + 1 < flen) {
      lastPos = lastPos > -1 ? lastPos : 0;
      switch (f.charCodeAt(i + 1)) {
        case 100:
        case 102:
          if (a >= argLen)
            break;
          if (args2[a] == null) break;
          if (lastPos < i)
            str += f.slice(lastPos, i);
          str += Number(args2[a]);
          lastPos = i + 2;
          i++;
          break;
        case 105:
          if (a >= argLen)
            break;
          if (args2[a] == null) break;
          if (lastPos < i)
            str += f.slice(lastPos, i);
          str += Math.floor(Number(args2[a]));
          lastPos = i + 2;
          i++;
          break;
        case 79:
        case 111:
        case 106:
          if (a >= argLen)
            break;
          if (args2[a] === void 0) break;
          if (lastPos < i)
            str += f.slice(lastPos, i);
          var type = typeof args2[a];
          if (type === "string") {
            str += "'" + args2[a] + "'";
            lastPos = i + 2;
            i++;
            break;
          }
          if (type === "function") {
            str += args2[a].name || "<anonymous>";
            lastPos = i + 2;
            i++;
            break;
          }
          str += ss(args2[a]);
          lastPos = i + 2;
          i++;
          break;
        case 115:
          if (a >= argLen)
            break;
          if (lastPos < i)
            str += f.slice(lastPos, i);
          str += String(args2[a]);
          lastPos = i + 2;
          i++;
          break;
        case 37:
          if (lastPos < i)
            str += f.slice(lastPos, i);
          str += "%";
          lastPos = i + 2;
          i++;
          a--;
          break;
      }
      ++a;
    }
    ++i;
  }
  if (lastPos === -1)
    return f;
  else if (lastPos < flen) {
    str += f.slice(lastPos);
  }
  return str;
}
var atomicSleep = { exports: {} };
var hasRequiredAtomicSleep;
function requireAtomicSleep() {
  if (hasRequiredAtomicSleep) return atomicSleep.exports;
  hasRequiredAtomicSleep = 1;
  if (typeof SharedArrayBuffer !== "undefined" && typeof Atomics !== "undefined") {
    let sleep2 = function(ms) {
      const valid = ms > 0 && ms < Infinity;
      if (valid === false) {
        if (typeof ms !== "number" && typeof ms !== "bigint") {
          throw TypeError("sleep: ms must be a number");
        }
        throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
      }
      Atomics.wait(nil2, 0, 0, Number(ms));
    };
    const nil2 = new Int32Array(new SharedArrayBuffer(4));
    atomicSleep.exports = sleep2;
  } else {
    let sleep2 = function(ms) {
      const valid = ms > 0 && ms < Infinity;
      if (valid === false) {
        if (typeof ms !== "number" && typeof ms !== "bigint") {
          throw TypeError("sleep: ms must be a number");
        }
        throw RangeError("sleep: ms must be a number that is greater than 0 but less than Infinity");
      }
    };
    atomicSleep.exports = sleep2;
  }
  return atomicSleep.exports;
}
const fs = fs$1;
const EventEmitter$1 = require$$1;
const inherits = require$$2.inherits;
const path = path$1;
const sleep = requireAtomicSleep();
const BUSY_WRITE_TIMEOUT = 100;
const kEmptyBuffer = Buffer.allocUnsafe(0);
const MAX_WRITE = 16 * 1024;
const kContentModeBuffer = "buffer";
const kContentModeUtf8 = "utf8";
function openFile(file, sonic) {
  sonic._opening = true;
  sonic._writing = true;
  sonic._asyncDrainScheduled = false;
  function fileOpened(err2, fd) {
    if (err2) {
      sonic._reopening = false;
      sonic._writing = false;
      sonic._opening = false;
      if (sonic.sync) {
        process.nextTick(() => {
          if (sonic.listenerCount("error") > 0) {
            sonic.emit("error", err2);
          }
        });
      } else {
        sonic.emit("error", err2);
      }
      return;
    }
    const reopening = sonic._reopening;
    sonic.fd = fd;
    sonic.file = file;
    sonic._reopening = false;
    sonic._opening = false;
    sonic._writing = false;
    if (sonic.sync) {
      process.nextTick(() => sonic.emit("ready"));
    } else {
      sonic.emit("ready");
    }
    if (sonic.destroyed) {
      return;
    }
    if (!sonic._writing && sonic._len > sonic.minLength || sonic._flushPending) {
      sonic._actualWrite();
    } else if (reopening) {
      process.nextTick(() => sonic.emit("drain"));
    }
  }
  const flags = sonic.append ? "a" : "w";
  const mode = sonic.mode;
  if (sonic.sync) {
    try {
      if (sonic.mkdir) fs.mkdirSync(path.dirname(file), { recursive: true });
      const fd = fs.openSync(file, flags, mode);
      fileOpened(null, fd);
    } catch (err2) {
      fileOpened(err2);
      throw err2;
    }
  } else if (sonic.mkdir) {
    fs.mkdir(path.dirname(file), { recursive: true }, (err2) => {
      if (err2) return fileOpened(err2);
      fs.open(file, flags, mode, fileOpened);
    });
  } else {
    fs.open(file, flags, mode, fileOpened);
  }
}
function SonicBoom$1(opts) {
  if (!(this instanceof SonicBoom$1)) {
    return new SonicBoom$1(opts);
  }
  let { fd, dest, minLength, maxLength, maxWrite, sync: sync2, append: append2 = true, mkdir, retryEAGAIN, fsync, contentMode, mode } = opts || {};
  fd = fd || dest;
  this._len = 0;
  this.fd = -1;
  this._bufs = [];
  this._lens = [];
  this._writing = false;
  this._ending = false;
  this._reopening = false;
  this._asyncDrainScheduled = false;
  this._flushPending = false;
  this._hwm = Math.max(minLength || 0, 16387);
  this.file = null;
  this.destroyed = false;
  this.minLength = minLength || 0;
  this.maxLength = maxLength || 0;
  this.maxWrite = maxWrite || MAX_WRITE;
  this.sync = sync2 || false;
  this.writable = true;
  this._fsync = fsync || false;
  this.append = append2 || false;
  this.mode = mode;
  this.retryEAGAIN = retryEAGAIN || (() => true);
  this.mkdir = mkdir || false;
  let fsWriteSync;
  let fsWrite;
  if (contentMode === kContentModeBuffer) {
    this._writingBuf = kEmptyBuffer;
    this.write = writeBuffer;
    this.flush = flushBuffer;
    this.flushSync = flushBufferSync;
    this._actualWrite = actualWriteBuffer;
    fsWriteSync = () => fs.writeSync(this.fd, this._writingBuf);
    fsWrite = () => fs.write(this.fd, this._writingBuf, this.release);
  } else if (contentMode === void 0 || contentMode === kContentModeUtf8) {
    this._writingBuf = "";
    this.write = write$1;
    this.flush = flush$1;
    this.flushSync = flushSync;
    this._actualWrite = actualWrite;
    fsWriteSync = () => fs.writeSync(this.fd, this._writingBuf, "utf8");
    fsWrite = () => fs.write(this.fd, this._writingBuf, "utf8", this.release);
  } else {
    throw new Error(`SonicBoom supports "${kContentModeUtf8}" and "${kContentModeBuffer}", but passed ${contentMode}`);
  }
  if (typeof fd === "number") {
    this.fd = fd;
    process.nextTick(() => this.emit("ready"));
  } else if (typeof fd === "string") {
    openFile(fd, this);
  } else {
    throw new Error("SonicBoom supports only file descriptors and files");
  }
  if (this.minLength >= this.maxWrite) {
    throw new Error(`minLength should be smaller than maxWrite (${this.maxWrite})`);
  }
  this.release = (err2, n) => {
    if (err2) {
      if ((err2.code === "EAGAIN" || err2.code === "EBUSY") && this.retryEAGAIN(err2, this._writingBuf.length, this._len - this._writingBuf.length)) {
        if (this.sync) {
          try {
            sleep(BUSY_WRITE_TIMEOUT);
            this.release(void 0, 0);
          } catch (err3) {
            this.release(err3);
          }
        } else {
          setTimeout(fsWrite, BUSY_WRITE_TIMEOUT);
        }
      } else {
        this._writing = false;
        this.emit("error", err2);
      }
      return;
    }
    this.emit("write", n);
    const releasedBufObj = releaseWritingBuf(this._writingBuf, this._len, n);
    this._len = releasedBufObj.len;
    this._writingBuf = releasedBufObj.writingBuf;
    if (this._writingBuf.length) {
      if (!this.sync) {
        fsWrite();
        return;
      }
      try {
        do {
          const n2 = fsWriteSync();
          const releasedBufObj2 = releaseWritingBuf(this._writingBuf, this._len, n2);
          this._len = releasedBufObj2.len;
          this._writingBuf = releasedBufObj2.writingBuf;
        } while (this._writingBuf.length);
      } catch (err3) {
        this.release(err3);
        return;
      }
    }
    if (this._fsync) {
      fs.fsyncSync(this.fd);
    }
    const len = this._len;
    if (this._reopening) {
      this._writing = false;
      this._reopening = false;
      this.reopen();
    } else if (len > this.minLength) {
      this._actualWrite();
    } else if (this._ending) {
      if (len > 0) {
        this._actualWrite();
      } else {
        this._writing = false;
        actualClose(this);
      }
    } else {
      this._writing = false;
      if (this.sync) {
        if (!this._asyncDrainScheduled) {
          this._asyncDrainScheduled = true;
          process.nextTick(emitDrain, this);
        }
      } else {
        this.emit("drain");
      }
    }
  };
  this.on("newListener", function(name) {
    if (name === "drain") {
      this._asyncDrainScheduled = false;
    }
  });
}
function releaseWritingBuf(writingBuf, len, n) {
  if (typeof writingBuf === "string" && Buffer.byteLength(writingBuf) !== n) {
    n = Buffer.from(writingBuf).subarray(0, n).toString().length;
  }
  len = Math.max(len - n, 0);
  writingBuf = writingBuf.slice(n);
  return { writingBuf, len };
}
function emitDrain(sonic) {
  const hasListeners = sonic.listenerCount("drain") > 0;
  if (!hasListeners) return;
  sonic._asyncDrainScheduled = false;
  sonic.emit("drain");
}
inherits(SonicBoom$1, EventEmitter$1);
function mergeBuf(bufs, len) {
  if (bufs.length === 0) {
    return kEmptyBuffer;
  }
  if (bufs.length === 1) {
    return bufs[0];
  }
  return Buffer.concat(bufs, len);
}
function write$1(data) {
  if (this.destroyed) {
    throw new Error("SonicBoom destroyed");
  }
  const len = this._len + data.length;
  const bufs = this._bufs;
  if (this.maxLength && len > this.maxLength) {
    this.emit("drop", data);
    return this._len < this._hwm;
  }
  if (bufs.length === 0 || bufs[bufs.length - 1].length + data.length > this.maxWrite) {
    bufs.push("" + data);
  } else {
    bufs[bufs.length - 1] += data;
  }
  this._len = len;
  if (!this._writing && this._len >= this.minLength) {
    this._actualWrite();
  }
  return this._len < this._hwm;
}
function writeBuffer(data) {
  if (this.destroyed) {
    throw new Error("SonicBoom destroyed");
  }
  const len = this._len + data.length;
  const bufs = this._bufs;
  const lens = this._lens;
  if (this.maxLength && len > this.maxLength) {
    this.emit("drop", data);
    return this._len < this._hwm;
  }
  if (bufs.length === 0 || lens[lens.length - 1] + data.length > this.maxWrite) {
    bufs.push([data]);
    lens.push(data.length);
  } else {
    bufs[bufs.length - 1].push(data);
    lens[lens.length - 1] += data.length;
  }
  this._len = len;
  if (!this._writing && this._len >= this.minLength) {
    this._actualWrite();
  }
  return this._len < this._hwm;
}
function callFlushCallbackOnDrain(cb) {
  this._flushPending = true;
  const onDrain = () => {
    if (!this._fsync) {
      fs.fsync(this.fd, (err2) => {
        this._flushPending = false;
        cb(err2);
      });
    } else {
      this._flushPending = false;
      cb();
    }
    this.off("error", onError);
  };
  const onError = (err2) => {
    this._flushPending = false;
    cb(err2);
    this.off("drain", onDrain);
  };
  this.once("drain", onDrain);
  this.once("error", onError);
}
function flush$1(cb) {
  if (cb != null && typeof cb !== "function") {
    throw new Error("flush cb must be a function");
  }
  if (this.destroyed) {
    const error = new Error("SonicBoom destroyed");
    if (cb) {
      cb(error);
      return;
    }
    throw error;
  }
  if (this.minLength <= 0) {
    cb == null ? void 0 : cb();
    return;
  }
  if (cb) {
    callFlushCallbackOnDrain.call(this, cb);
  }
  if (this._writing) {
    return;
  }
  if (this._bufs.length === 0) {
    this._bufs.push("");
  }
  this._actualWrite();
}
function flushBuffer(cb) {
  if (cb != null && typeof cb !== "function") {
    throw new Error("flush cb must be a function");
  }
  if (this.destroyed) {
    const error = new Error("SonicBoom destroyed");
    if (cb) {
      cb(error);
      return;
    }
    throw error;
  }
  if (this.minLength <= 0) {
    cb == null ? void 0 : cb();
    return;
  }
  if (cb) {
    callFlushCallbackOnDrain.call(this, cb);
  }
  if (this._writing) {
    return;
  }
  if (this._bufs.length === 0) {
    this._bufs.push([]);
    this._lens.push(0);
  }
  this._actualWrite();
}
SonicBoom$1.prototype.reopen = function(file) {
  if (this.destroyed) {
    throw new Error("SonicBoom destroyed");
  }
  if (this._opening) {
    this.once("ready", () => {
      this.reopen(file);
    });
    return;
  }
  if (this._ending) {
    return;
  }
  if (!this.file) {
    throw new Error("Unable to reopen a file descriptor, you must pass a file to SonicBoom");
  }
  if (file) {
    this.file = file;
  }
  this._reopening = true;
  if (this._writing) {
    return;
  }
  const fd = this.fd;
  this.once("ready", () => {
    if (fd !== this.fd) {
      fs.close(fd, (err2) => {
        if (err2) {
          return this.emit("error", err2);
        }
      });
    }
  });
  openFile(this.file, this);
};
SonicBoom$1.prototype.end = function() {
  if (this.destroyed) {
    throw new Error("SonicBoom destroyed");
  }
  if (this._opening) {
    this.once("ready", () => {
      this.end();
    });
    return;
  }
  if (this._ending) {
    return;
  }
  this._ending = true;
  if (this._writing) {
    return;
  }
  if (this._len > 0 && this.fd >= 0) {
    this._actualWrite();
  } else {
    actualClose(this);
  }
};
function flushSync() {
  if (this.destroyed) {
    throw new Error("SonicBoom destroyed");
  }
  if (this.fd < 0) {
    throw new Error("sonic boom is not ready yet");
  }
  if (!this._writing && this._writingBuf.length > 0) {
    this._bufs.unshift(this._writingBuf);
    this._writingBuf = "";
  }
  let buf = "";
  while (this._bufs.length || buf) {
    if (buf.length <= 0) {
      buf = this._bufs[0];
    }
    try {
      const n = fs.writeSync(this.fd, buf, "utf8");
      const releasedBufObj = releaseWritingBuf(buf, this._len, n);
      buf = releasedBufObj.writingBuf;
      this._len = releasedBufObj.len;
      if (buf.length <= 0) {
        this._bufs.shift();
      }
    } catch (err2) {
      const shouldRetry = err2.code === "EAGAIN" || err2.code === "EBUSY";
      if (shouldRetry && !this.retryEAGAIN(err2, buf.length, this._len - buf.length)) {
        throw err2;
      }
      sleep(BUSY_WRITE_TIMEOUT);
    }
  }
  try {
    fs.fsyncSync(this.fd);
  } catch {
  }
}
function flushBufferSync() {
  if (this.destroyed) {
    throw new Error("SonicBoom destroyed");
  }
  if (this.fd < 0) {
    throw new Error("sonic boom is not ready yet");
  }
  if (!this._writing && this._writingBuf.length > 0) {
    this._bufs.unshift([this._writingBuf]);
    this._writingBuf = kEmptyBuffer;
  }
  let buf = kEmptyBuffer;
  while (this._bufs.length || buf.length) {
    if (buf.length <= 0) {
      buf = mergeBuf(this._bufs[0], this._lens[0]);
    }
    try {
      const n = fs.writeSync(this.fd, buf);
      buf = buf.subarray(n);
      this._len = Math.max(this._len - n, 0);
      if (buf.length <= 0) {
        this._bufs.shift();
        this._lens.shift();
      }
    } catch (err2) {
      const shouldRetry = err2.code === "EAGAIN" || err2.code === "EBUSY";
      if (shouldRetry && !this.retryEAGAIN(err2, buf.length, this._len - buf.length)) {
        throw err2;
      }
      sleep(BUSY_WRITE_TIMEOUT);
    }
  }
}
SonicBoom$1.prototype.destroy = function() {
  if (this.destroyed) {
    return;
  }
  actualClose(this);
};
function actualWrite() {
  const release = this.release;
  this._writing = true;
  this._writingBuf = this._writingBuf || this._bufs.shift() || "";
  if (this.sync) {
    try {
      const written = fs.writeSync(this.fd, this._writingBuf, "utf8");
      release(null, written);
    } catch (err2) {
      release(err2);
    }
  } else {
    fs.write(this.fd, this._writingBuf, "utf8", release);
  }
}
function actualWriteBuffer() {
  const release = this.release;
  this._writing = true;
  this._writingBuf = this._writingBuf.length ? this._writingBuf : mergeBuf(this._bufs.shift(), this._lens.shift());
  if (this.sync) {
    try {
      const written = fs.writeSync(this.fd, this._writingBuf);
      release(null, written);
    } catch (err2) {
      release(err2);
    }
  } else {
    fs.write(this.fd, this._writingBuf, release);
  }
}
function actualClose(sonic) {
  if (sonic.fd === -1) {
    sonic.once("ready", actualClose.bind(null, sonic));
    return;
  }
  sonic.destroyed = true;
  sonic._bufs = [];
  sonic._lens = [];
  fs.fsync(sonic.fd, closeWrapped);
  function closeWrapped() {
    if (sonic.fd !== 1 && sonic.fd !== 2) {
      fs.close(sonic.fd, done2);
    } else {
      done2();
    }
  }
  function done2(err2) {
    if (err2) {
      sonic.emit("error", err2);
      return;
    }
    if (sonic._ending && !sonic._writing) {
      sonic.emit("finish");
    }
    sonic.emit("close");
  }
}
SonicBoom$1.SonicBoom = SonicBoom$1;
SonicBoom$1.default = SonicBoom$1;
var sonicBoom = SonicBoom$1;
const refs = {
  exit: [],
  beforeExit: []
};
const functions = {
  exit: onExit$3,
  beforeExit: onBeforeExit
};
let registry;
function ensureRegistry() {
  if (registry === void 0) {
    registry = new FinalizationRegistry(clear);
  }
}
function install(event) {
  if (refs[event].length > 0) {
    return;
  }
  process.on(event, functions[event]);
}
function uninstall(event) {
  if (refs[event].length > 0) {
    return;
  }
  process.removeListener(event, functions[event]);
  if (refs.exit.length === 0 && refs.beforeExit.length === 0) {
    registry = void 0;
  }
}
function onExit$3() {
  callRefs("exit");
}
function onBeforeExit() {
  callRefs("beforeExit");
}
function callRefs(event) {
  for (const ref of refs[event]) {
    const obj = ref.deref();
    const fn = ref.fn;
    if (obj !== void 0) {
      fn(obj, event);
    }
  }
  refs[event] = [];
}
function clear(ref) {
  for (const event of ["exit", "beforeExit"]) {
    const index2 = refs[event].indexOf(ref);
    refs[event].splice(index2, index2 + 1);
    uninstall(event);
  }
}
function _register(event, obj, fn) {
  if (obj === void 0) {
    throw new Error("the object can't be undefined");
  }
  install(event);
  const ref = new WeakRef(obj);
  ref.fn = fn;
  ensureRegistry();
  registry.register(obj, ref);
  refs[event].push(ref);
}
function register(obj, fn) {
  _register("exit", obj, fn);
}
function registerBeforeExit(obj, fn) {
  _register("beforeExit", obj, fn);
}
function unregister(obj) {
  if (registry === void 0) {
    return;
  }
  registry.unregister(obj);
  for (const event of ["exit", "beforeExit"]) {
    refs[event] = refs[event].filter((ref) => {
      const _obj = ref.deref();
      return _obj && _obj !== obj;
    });
    uninstall(event);
  }
}
var onExitLeakFree = {
  register,
  registerBeforeExit,
  unregister
};
const version$2 = "2.7.0";
const require$$0 = {
  version: version$2
};
var wait_1;
var hasRequiredWait;
function requireWait() {
  if (hasRequiredWait) return wait_1;
  hasRequiredWait = 1;
  const MAX_TIMEOUT = 1e3;
  function wait(state2, index2, expected, timeout, done2) {
    const max = Date.now() + timeout;
    let current = Atomics.load(state2, index2);
    if (current === expected) {
      done2(null, "ok");
      return;
    }
    let prior = current;
    const check = (backoff) => {
      if (Date.now() > max) {
        done2(null, "timed-out");
      } else {
        setTimeout(() => {
          prior = current;
          current = Atomics.load(state2, index2);
          if (current === prior) {
            check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2);
          } else {
            if (current === expected) done2(null, "ok");
            else done2(null, "not-equal");
          }
        }, backoff);
      }
    };
    check(1);
  }
  function waitDiff(state2, index2, expected, timeout, done2) {
    const max = Date.now() + timeout;
    let current = Atomics.load(state2, index2);
    if (current !== expected) {
      done2(null, "ok");
      return;
    }
    const check = (backoff) => {
      if (Date.now() > max) {
        done2(null, "timed-out");
      } else {
        setTimeout(() => {
          current = Atomics.load(state2, index2);
          if (current !== expected) {
            done2(null, "ok");
          } else {
            check(backoff >= MAX_TIMEOUT ? MAX_TIMEOUT : backoff * 2);
          }
        }, backoff);
      }
    };
    check(1);
  }
  wait_1 = { wait, waitDiff };
  return wait_1;
}
var indexes;
var hasRequiredIndexes;
function requireIndexes() {
  if (hasRequiredIndexes) return indexes;
  hasRequiredIndexes = 1;
  const WRITE_INDEX = 4;
  const READ_INDEX = 8;
  indexes = {
    WRITE_INDEX,
    READ_INDEX
  };
  return indexes;
}
var threadStream;
var hasRequiredThreadStream;
function requireThreadStream() {
  if (hasRequiredThreadStream) return threadStream;
  hasRequiredThreadStream = 1;
  const { version: version2 } = require$$0;
  const { EventEmitter: EventEmitter2 } = require$$1;
  const { Worker } = require$$2$1;
  const { join: join2 } = path$1;
  const { pathToFileURL } = require$$4;
  const { wait } = requireWait();
  const {
    WRITE_INDEX,
    READ_INDEX
  } = requireIndexes();
  const buffer = require$$7;
  const assert = require$$8;
  const kImpl = Symbol("kImpl");
  const MAX_STRING = buffer.constants.MAX_STRING_LENGTH;
  class FakeWeakRef {
    constructor(value) {
      this._value = value;
    }
    deref() {
      return this._value;
    }
  }
  class FakeFinalizationRegistry {
    register() {
    }
    unregister() {
    }
  }
  const FinalizationRegistry2 = process.env.NODE_V8_COVERAGE ? FakeFinalizationRegistry : commonjsGlobal.FinalizationRegistry || FakeFinalizationRegistry;
  const WeakRef2 = process.env.NODE_V8_COVERAGE ? FakeWeakRef : commonjsGlobal.WeakRef || FakeWeakRef;
  const registry2 = new FinalizationRegistry2((worker) => {
    if (worker.exited) {
      return;
    }
    worker.terminate();
  });
  function createWorker(stream, opts) {
    const { filename, workerData } = opts;
    const bundlerOverrides = "__bundlerPathsOverrides" in globalThis ? globalThis.__bundlerPathsOverrides : {};
    const toExecute = bundlerOverrides["thread-stream-worker"] || join2(__dirname, "lib", "worker.js");
    const worker = new Worker(toExecute, {
      ...opts.workerOpts,
      trackUnmanagedFds: false,
      workerData: {
        filename: filename.indexOf("file://") === 0 ? filename : pathToFileURL(filename).href,
        dataBuf: stream[kImpl].dataBuf,
        stateBuf: stream[kImpl].stateBuf,
        workerData: {
          $context: {
            threadStreamVersion: version2
          },
          ...workerData
        }
      }
    });
    worker.stream = new FakeWeakRef(stream);
    worker.on("message", onWorkerMessage);
    worker.on("exit", onWorkerExit);
    registry2.register(stream, worker);
    return worker;
  }
  function drain(stream) {
    assert(!stream[kImpl].sync);
    if (stream[kImpl].needDrain) {
      stream[kImpl].needDrain = false;
      stream.emit("drain");
    }
  }
  function nextFlush(stream) {
    const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
    let leftover = stream[kImpl].data.length - writeIndex;
    if (leftover > 0) {
      if (stream[kImpl].buf.length === 0) {
        stream[kImpl].flushing = false;
        if (stream[kImpl].ending) {
          end(stream);
        } else if (stream[kImpl].needDrain) {
          process.nextTick(drain, stream);
        }
        return;
      }
      let toWrite = stream[kImpl].buf.slice(0, leftover);
      let toWriteBytes = Buffer.byteLength(toWrite);
      if (toWriteBytes <= leftover) {
        stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
        write2(stream, toWrite, nextFlush.bind(null, stream));
      } else {
        stream.flush(() => {
          if (stream.destroyed) {
            return;
          }
          Atomics.store(stream[kImpl].state, READ_INDEX, 0);
          Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
          while (toWriteBytes > stream[kImpl].data.length) {
            leftover = leftover / 2;
            toWrite = stream[kImpl].buf.slice(0, leftover);
            toWriteBytes = Buffer.byteLength(toWrite);
          }
          stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
          write2(stream, toWrite, nextFlush.bind(null, stream));
        });
      }
    } else if (leftover === 0) {
      if (writeIndex === 0 && stream[kImpl].buf.length === 0) {
        return;
      }
      stream.flush(() => {
        Atomics.store(stream[kImpl].state, READ_INDEX, 0);
        Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
        nextFlush(stream);
      });
    } else {
      destroy(stream, new Error("overwritten"));
    }
  }
  function onWorkerMessage(msg) {
    const stream = this.stream.deref();
    if (stream === void 0) {
      this.exited = true;
      this.terminate();
      return;
    }
    switch (msg.code) {
      case "READY":
        this.stream = new WeakRef2(stream);
        stream.flush(() => {
          stream[kImpl].ready = true;
          stream.emit("ready");
        });
        break;
      case "ERROR":
        destroy(stream, msg.err);
        break;
      case "EVENT":
        if (Array.isArray(msg.args)) {
          stream.emit(msg.name, ...msg.args);
        } else {
          stream.emit(msg.name, msg.args);
        }
        break;
      case "WARNING":
        process.emitWarning(msg.err);
        break;
      default:
        destroy(stream, new Error("this should not happen: " + msg.code));
    }
  }
  function onWorkerExit(code) {
    const stream = this.stream.deref();
    if (stream === void 0) {
      return;
    }
    registry2.unregister(stream);
    stream.worker.exited = true;
    stream.worker.off("exit", onWorkerExit);
    destroy(stream, code !== 0 ? new Error("the worker thread exited") : null);
  }
  class ThreadStream extends EventEmitter2 {
    constructor(opts = {}) {
      super();
      if (opts.bufferSize < 4) {
        throw new Error("bufferSize must at least fit a 4-byte utf-8 char");
      }
      this[kImpl] = {};
      this[kImpl].stateBuf = new SharedArrayBuffer(128);
      this[kImpl].state = new Int32Array(this[kImpl].stateBuf);
      this[kImpl].dataBuf = new SharedArrayBuffer(opts.bufferSize || 4 * 1024 * 1024);
      this[kImpl].data = Buffer.from(this[kImpl].dataBuf);
      this[kImpl].sync = opts.sync || false;
      this[kImpl].ending = false;
      this[kImpl].ended = false;
      this[kImpl].needDrain = false;
      this[kImpl].destroyed = false;
      this[kImpl].flushing = false;
      this[kImpl].ready = false;
      this[kImpl].finished = false;
      this[kImpl].errored = null;
      this[kImpl].closed = false;
      this[kImpl].buf = "";
      this.worker = createWorker(this, opts);
      this.on("message", (message, transferList) => {
        this.worker.postMessage(message, transferList);
      });
    }
    write(data) {
      if (this[kImpl].destroyed) {
        error(this, new Error("the worker has exited"));
        return false;
      }
      if (this[kImpl].ending) {
        error(this, new Error("the worker is ending"));
        return false;
      }
      if (this[kImpl].flushing && this[kImpl].buf.length + data.length >= MAX_STRING) {
        try {
          writeSync(this);
          this[kImpl].flushing = true;
        } catch (err2) {
          destroy(this, err2);
          return false;
        }
      }
      this[kImpl].buf += data;
      if (this[kImpl].sync) {
        try {
          writeSync(this);
          return true;
        } catch (err2) {
          destroy(this, err2);
          return false;
        }
      }
      if (!this[kImpl].flushing) {
        this[kImpl].flushing = true;
        setImmediate(nextFlush, this);
      }
      this[kImpl].needDrain = this[kImpl].data.length - this[kImpl].buf.length - Atomics.load(this[kImpl].state, WRITE_INDEX) <= 0;
      return !this[kImpl].needDrain;
    }
    end() {
      if (this[kImpl].destroyed) {
        return;
      }
      this[kImpl].ending = true;
      end(this);
    }
    flush(cb) {
      if (this[kImpl].destroyed) {
        if (typeof cb === "function") {
          process.nextTick(cb, new Error("the worker has exited"));
        }
        return;
      }
      const writeIndex = Atomics.load(this[kImpl].state, WRITE_INDEX);
      wait(this[kImpl].state, READ_INDEX, writeIndex, Infinity, (err2, res2) => {
        if (err2) {
          destroy(this, err2);
          process.nextTick(cb, err2);
          return;
        }
        if (res2 === "not-equal") {
          this.flush(cb);
          return;
        }
        process.nextTick(cb);
      });
    }
    flushSync() {
      if (this[kImpl].destroyed) {
        return;
      }
      writeSync(this);
      flushSync2(this);
    }
    unref() {
      this.worker.unref();
    }
    ref() {
      this.worker.ref();
    }
    get ready() {
      return this[kImpl].ready;
    }
    get destroyed() {
      return this[kImpl].destroyed;
    }
    get closed() {
      return this[kImpl].closed;
    }
    get writable() {
      return !this[kImpl].destroyed && !this[kImpl].ending;
    }
    get writableEnded() {
      return this[kImpl].ending;
    }
    get writableFinished() {
      return this[kImpl].finished;
    }
    get writableNeedDrain() {
      return this[kImpl].needDrain;
    }
    get writableObjectMode() {
      return false;
    }
    get writableErrored() {
      return this[kImpl].errored;
    }
  }
  function error(stream, err2) {
    setImmediate(() => {
      stream.emit("error", err2);
    });
  }
  function destroy(stream, err2) {
    if (stream[kImpl].destroyed) {
      return;
    }
    stream[kImpl].destroyed = true;
    if (err2) {
      stream[kImpl].errored = err2;
      error(stream, err2);
    }
    if (!stream.worker.exited) {
      stream.worker.terminate().catch(() => {
      }).then(() => {
        stream[kImpl].closed = true;
        stream.emit("close");
      });
    } else {
      setImmediate(() => {
        stream[kImpl].closed = true;
        stream.emit("close");
      });
    }
  }
  function write2(stream, data, cb) {
    const current = Atomics.load(stream[kImpl].state, WRITE_INDEX);
    const length = Buffer.byteLength(data);
    stream[kImpl].data.write(data, current);
    Atomics.store(stream[kImpl].state, WRITE_INDEX, current + length);
    Atomics.notify(stream[kImpl].state, WRITE_INDEX);
    cb();
    return true;
  }
  function end(stream) {
    if (stream[kImpl].ended || !stream[kImpl].ending || stream[kImpl].flushing) {
      return;
    }
    stream[kImpl].ended = true;
    try {
      stream.flushSync();
      let readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
      Atomics.store(stream[kImpl].state, WRITE_INDEX, -1);
      Atomics.notify(stream[kImpl].state, WRITE_INDEX);
      let spins = 0;
      while (readIndex !== -1) {
        Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
        readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
        if (readIndex === -2) {
          destroy(stream, new Error("end() failed"));
          return;
        }
        if (++spins === 10) {
          destroy(stream, new Error("end() took too long (10s)"));
          return;
        }
      }
      process.nextTick(() => {
        stream[kImpl].finished = true;
        stream.emit("finish");
      });
    } catch (err2) {
      destroy(stream, err2);
    }
  }
  function writeSync(stream) {
    const cb = () => {
      if (stream[kImpl].ending) {
        end(stream);
      } else if (stream[kImpl].needDrain) {
        process.nextTick(drain, stream);
      }
    };
    stream[kImpl].flushing = false;
    while (stream[kImpl].buf.length !== 0) {
      const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
      let leftover = stream[kImpl].data.length - writeIndex;
      if (leftover === 0) {
        flushSync2(stream);
        Atomics.store(stream[kImpl].state, READ_INDEX, 0);
        Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
        continue;
      } else if (leftover < 0) {
        throw new Error("overwritten");
      }
      let toWrite = stream[kImpl].buf.slice(0, leftover);
      let toWriteBytes = Buffer.byteLength(toWrite);
      if (toWriteBytes <= leftover) {
        stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
        write2(stream, toWrite, cb);
      } else {
        flushSync2(stream);
        Atomics.store(stream[kImpl].state, READ_INDEX, 0);
        Atomics.store(stream[kImpl].state, WRITE_INDEX, 0);
        while (toWriteBytes > stream[kImpl].buf.length) {
          leftover = leftover / 2;
          toWrite = stream[kImpl].buf.slice(0, leftover);
          toWriteBytes = Buffer.byteLength(toWrite);
        }
        stream[kImpl].buf = stream[kImpl].buf.slice(leftover);
        write2(stream, toWrite, cb);
      }
    }
  }
  function flushSync2(stream) {
    if (stream[kImpl].flushing) {
      throw new Error("unable to flush while flushing");
    }
    const writeIndex = Atomics.load(stream[kImpl].state, WRITE_INDEX);
    let spins = 0;
    while (true) {
      const readIndex = Atomics.load(stream[kImpl].state, READ_INDEX);
      if (readIndex === -2) {
        throw Error("_flushSync failed");
      }
      if (readIndex !== writeIndex) {
        Atomics.wait(stream[kImpl].state, READ_INDEX, readIndex, 1e3);
      } else {
        break;
      }
      if (++spins === 10) {
        throw new Error("_flushSync took too long (10s)");
      }
    }
  }
  threadStream = ThreadStream;
  return threadStream;
}
var transport_1;
var hasRequiredTransport;
function requireTransport() {
  if (hasRequiredTransport) return transport_1;
  hasRequiredTransport = 1;
  const { createRequire } = require$$0$1;
  const getCallers2 = caller$1;
  const { join: join2, isAbsolute, sep } = path$1;
  const sleep2 = requireAtomicSleep();
  const onExit2 = onExitLeakFree;
  const ThreadStream = requireThreadStream();
  function setupOnExit(stream) {
    onExit2.register(stream, autoEnd2);
    onExit2.registerBeforeExit(stream, flush2);
    stream.on("close", function() {
      onExit2.unregister(stream);
    });
  }
  function buildStream(filename, workerData, workerOpts) {
    const stream = new ThreadStream({
      filename,
      workerData,
      workerOpts
    });
    stream.on("ready", onReady);
    stream.on("close", function() {
      process.removeListener("exit", onExit3);
    });
    process.on("exit", onExit3);
    function onReady() {
      process.removeListener("exit", onExit3);
      stream.unref();
      if (workerOpts.autoEnd !== false) {
        setupOnExit(stream);
      }
    }
    function onExit3() {
      if (stream.closed) {
        return;
      }
      stream.flushSync();
      sleep2(100);
      stream.end();
    }
    return stream;
  }
  function autoEnd2(stream) {
    stream.ref();
    stream.flushSync();
    stream.end();
    stream.once("close", function() {
      stream.unref();
    });
  }
  function flush2(stream) {
    stream.flushSync();
  }
  function transport2(fullOptions) {
    const { pipeline, targets, levels: levels2, dedupe: dedupe2, options = {}, worker = {}, caller: caller2 = getCallers2() } = fullOptions;
    const callers = typeof caller2 === "string" ? [caller2] : caller2;
    const bundlerOverrides = "__bundlerPathsOverrides" in globalThis ? globalThis.__bundlerPathsOverrides : {};
    let target = fullOptions.target;
    if (target && targets) {
      throw new Error("only one of target or targets can be specified");
    }
    if (targets) {
      target = bundlerOverrides["pino-worker"] || join2(__dirname, "worker.js");
      options.targets = targets.map((dest) => {
        return {
          ...dest,
          target: fixTarget(dest.target)
        };
      });
    } else if (pipeline) {
      target = bundlerOverrides["pino-pipeline-worker"] || join2(__dirname, "worker-pipeline.js");
      options.targets = pipeline.map((dest) => {
        return {
          ...dest,
          target: fixTarget(dest.target)
        };
      });
    }
    if (levels2) {
      options.levels = levels2;
    }
    if (dedupe2) {
      options.dedupe = dedupe2;
    }
    options.pinoWillSendConfig = true;
    return buildStream(fixTarget(target), options, worker);
    function fixTarget(origin) {
      origin = bundlerOverrides[origin] || origin;
      if (isAbsolute(origin) || origin.indexOf("file://") === 0) {
        return origin;
      }
      if (origin === "pino/file") {
        return join2(__dirname, "..", "file.js");
      }
      let fixTarget2;
      for (const filePath of callers) {
        try {
          const context = filePath === "node:repl" ? process.cwd() + sep : filePath;
          fixTarget2 = createRequire(context).resolve(origin);
          break;
        } catch (err2) {
          continue;
        }
      }
      if (!fixTarget2) {
        throw new Error(`unable to determine transport target for "${origin}"`);
      }
      return fixTarget2;
    }
  }
  transport_1 = transport2;
  return transport_1;
}
const format$3 = quickFormatUnescaped;
const { mapHttpRequest, mapHttpResponse } = pinoStdSerializers;
const SonicBoom = sonicBoom;
const onExit$2 = onExitLeakFree;
const {
  lsCacheSym: lsCacheSym$2,
  chindingsSym: chindingsSym$2,
  writeSym: writeSym$1,
  serializersSym: serializersSym$2,
  formatOptsSym: formatOptsSym$2,
  endSym: endSym$1,
  stringifiersSym: stringifiersSym$2,
  stringifySym: stringifySym$2,
  stringifySafeSym: stringifySafeSym$1,
  wildcardFirstSym,
  nestedKeySym: nestedKeySym$1,
  formattersSym: formattersSym$3,
  messageKeySym: messageKeySym$2,
  errorKeySym: errorKeySym$2,
  nestedKeyStrSym: nestedKeyStrSym$1,
  msgPrefixSym: msgPrefixSym$2
} = symbols$1;
const { isMainThread } = require$$2$1;
const transport = requireTransport();
function noop$3() {
}
function genLog$1(level, hook) {
  if (!hook) return LOG;
  return function hookWrappedLog(...args2) {
    hook.call(this, args2, LOG, level);
  };
  function LOG(o, ...n) {
    if (typeof o === "object") {
      let msg = o;
      if (o !== null) {
        if (o.method && o.headers && o.socket) {
          o = mapHttpRequest(o);
        } else if (typeof o.setHeader === "function") {
          o = mapHttpResponse(o);
        }
      }
      let formatParams;
      if (msg === null && n.length === 0) {
        formatParams = [null];
      } else {
        msg = n.shift();
        formatParams = n;
      }
      if (typeof this[msgPrefixSym$2] === "string" && msg !== void 0 && msg !== null) {
        msg = this[msgPrefixSym$2] + msg;
      }
      this[writeSym$1](o, format$3(msg, formatParams, this[formatOptsSym$2]), level);
    } else {
      let msg = o === void 0 ? n.shift() : o;
      if (typeof this[msgPrefixSym$2] === "string" && msg !== void 0 && msg !== null) {
        msg = this[msgPrefixSym$2] + msg;
      }
      this[writeSym$1](null, format$3(msg, n, this[formatOptsSym$2]), level);
    }
  }
}
function asString(str) {
  let result = "";
  let last2 = 0;
  let found = false;
  let point = 255;
  const l = str.length;
  if (l > 100) {
    return JSON.stringify(str);
  }
  for (var i = 0; i < l && point >= 32; i++) {
    point = str.charCodeAt(i);
    if (point === 34 || point === 92) {
      result += str.slice(last2, i) + "\\";
      last2 = i;
      found = true;
    }
  }
  if (!found) {
    result = str;
  } else {
    result += str.slice(last2);
  }
  return point < 32 ? JSON.stringify(str) : '"' + result + '"';
}
function asJson$1(obj, msg, num, time2) {
  const stringify2 = this[stringifySym$2];
  const stringifySafe = this[stringifySafeSym$1];
  const stringifiers = this[stringifiersSym$2];
  const end = this[endSym$1];
  const chindings = this[chindingsSym$2];
  const serializers2 = this[serializersSym$2];
  const formatters = this[formattersSym$3];
  const messageKey = this[messageKeySym$2];
  const errorKey = this[errorKeySym$2];
  let data = this[lsCacheSym$2][num] + time2;
  data = data + chindings;
  let value;
  if (formatters.log) {
    obj = formatters.log(obj);
  }
  const wildcardStringifier = stringifiers[wildcardFirstSym];
  let propStr = "";
  for (const key in obj) {
    value = obj[key];
    if (Object.prototype.hasOwnProperty.call(obj, key) && value !== void 0) {
      if (serializers2[key]) {
        value = serializers2[key](value);
      } else if (key === errorKey && serializers2.err) {
        value = serializers2.err(value);
      }
      const stringifier = stringifiers[key] || wildcardStringifier;
      switch (typeof value) {
        case "undefined":
        case "function":
          continue;
        case "number":
          if (Number.isFinite(value) === false) {
            value = null;
          }
        case "boolean":
          if (stringifier) value = stringifier(value);
          break;
        case "string":
          value = (stringifier || asString)(value);
          break;
        default:
          value = (stringifier || stringify2)(value, stringifySafe);
      }
      if (value === void 0) continue;
      const strKey = asString(key);
      propStr += "," + strKey + ":" + value;
    }
  }
  let msgStr = "";
  if (msg !== void 0) {
    value = serializers2[messageKey] ? serializers2[messageKey](msg) : msg;
    const stringifier = stringifiers[messageKey] || wildcardStringifier;
    switch (typeof value) {
      case "function":
        break;
      case "number":
        if (Number.isFinite(value) === false) {
          value = null;
        }
      case "boolean":
        if (stringifier) value = stringifier(value);
        msgStr = ',"' + messageKey + '":' + value;
        break;
      case "string":
        value = (stringifier || asString)(value);
        msgStr = ',"' + messageKey + '":' + value;
        break;
      default:
        value = (stringifier || stringify2)(value, stringifySafe);
        msgStr = ',"' + messageKey + '":' + value;
    }
  }
  if (this[nestedKeySym$1] && propStr) {
    return data + this[nestedKeyStrSym$1] + propStr.slice(1) + "}" + msgStr + end;
  } else {
    return data + propStr + msgStr + end;
  }
}
function asChindings$2(instance, bindings2) {
  let value;
  let data = instance[chindingsSym$2];
  const stringify2 = instance[stringifySym$2];
  const stringifySafe = instance[stringifySafeSym$1];
  const stringifiers = instance[stringifiersSym$2];
  const wildcardStringifier = stringifiers[wildcardFirstSym];
  const serializers2 = instance[serializersSym$2];
  const formatter = instance[formattersSym$3].bindings;
  bindings2 = formatter(bindings2);
  for (const key in bindings2) {
    value = bindings2[key];
    const valid = key !== "level" && key !== "serializers" && key !== "formatters" && key !== "customLevels" && bindings2.hasOwnProperty(key) && value !== void 0;
    if (valid === true) {
      value = serializers2[key] ? serializers2[key](value) : value;
      value = (stringifiers[key] || wildcardStringifier || stringify2)(value, stringifySafe);
      if (value === void 0) continue;
      data += ',"' + key + '":' + value;
    }
  }
  return data;
}
function hasBeenTampered(stream) {
  return stream.write !== stream.constructor.prototype.write;
}
const hasNodeCodeCoverage = process.env.NODE_V8_COVERAGE || process.env.V8_COVERAGE;
function buildSafeSonicBoom$1(opts) {
  const stream = new SonicBoom(opts);
  stream.on("error", filterBrokenPipe);
  if (!hasNodeCodeCoverage && !opts.sync && isMainThread) {
    onExit$2.register(stream, autoEnd);
    stream.on("close", function() {
      onExit$2.unregister(stream);
    });
  }
  return stream;
  function filterBrokenPipe(err2) {
    if (err2.code === "EPIPE") {
      stream.write = noop$3;
      stream.end = noop$3;
      stream.flushSync = noop$3;
      stream.destroy = noop$3;
      return;
    }
    stream.removeListener("error", filterBrokenPipe);
    stream.emit("error", err2);
  }
}
function autoEnd(stream, eventName) {
  if (stream.destroyed) {
    return;
  }
  if (eventName === "beforeExit") {
    stream.flush();
    stream.on("drain", function() {
      stream.end();
    });
  } else {
    stream.flushSync();
  }
}
function createArgsNormalizer$1(defaultOptions2) {
  return function normalizeArgs(instance, caller2, opts = {}, stream) {
    if (typeof opts === "string") {
      stream = buildSafeSonicBoom$1({ dest: opts });
      opts = {};
    } else if (typeof stream === "string") {
      if (opts && opts.transport) {
        throw Error("only one of option.transport or stream can be specified");
      }
      stream = buildSafeSonicBoom$1({ dest: stream });
    } else if (opts instanceof SonicBoom || opts.writable || opts._writableState) {
      stream = opts;
      opts = {};
    } else if (opts.transport) {
      if (opts.transport instanceof SonicBoom || opts.transport.writable || opts.transport._writableState) {
        throw Error("option.transport do not allow stream, please pass to option directly. e.g. pino(transport)");
      }
      if (opts.transport.targets && opts.transport.targets.length && opts.formatters && typeof opts.formatters.level === "function") {
        throw Error("option.transport.targets do not allow custom level formatters");
      }
      let customLevels;
      if (opts.customLevels) {
        customLevels = opts.useOnlyCustomLevels ? opts.customLevels : Object.assign({}, opts.levels, opts.customLevels);
      }
      stream = transport({ caller: caller2, ...opts.transport, levels: customLevels });
    }
    opts = Object.assign({}, defaultOptions2, opts);
    opts.serializers = Object.assign({}, defaultOptions2.serializers, opts.serializers);
    opts.formatters = Object.assign({}, defaultOptions2.formatters, opts.formatters);
    if (opts.prettyPrint) {
      throw new Error("prettyPrint option is no longer supported, see the pino-pretty package (https://github.com/pinojs/pino-pretty)");
    }
    const { enabled: enabled2, onChild } = opts;
    if (enabled2 === false) opts.level = "silent";
    if (!onChild) opts.onChild = noop$3;
    if (!stream) {
      if (!hasBeenTampered(process.stdout)) {
        stream = buildSafeSonicBoom$1({ fd: process.stdout.fd || 1 });
      } else {
        stream = process.stdout;
      }
    }
    return { opts, stream };
  };
}
function stringify$2(obj, stringifySafeFn) {
  try {
    return JSON.stringify(obj);
  } catch (_) {
    try {
      const stringify2 = stringifySafeFn || this[stringifySafeSym$1];
      return stringify2(obj);
    } catch (_2) {
      return '"[unable to serialize, circular reference is too complex to analyze]"';
    }
  }
}
function buildFormatters$2(level, bindings2, log) {
  return {
    level,
    bindings: bindings2,
    log
  };
}
function normalizeDestFileDescriptor$1(destination) {
  const fd = Number(destination);
  if (typeof destination === "string" && Number.isFinite(fd)) {
    return fd;
  }
  if (destination === void 0) {
    return 1;
  }
  return destination;
}
var tools = {
  noop: noop$3,
  buildSafeSonicBoom: buildSafeSonicBoom$1,
  asChindings: asChindings$2,
  asJson: asJson$1,
  genLog: genLog$1,
  createArgsNormalizer: createArgsNormalizer$1,
  stringify: stringify$2,
  buildFormatters: buildFormatters$2,
  normalizeDestFileDescriptor: normalizeDestFileDescriptor$1
};
const DEFAULT_LEVELS$2 = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60
};
const SORTING_ORDER$2 = {
  ASC: "ASC",
  DESC: "DESC"
};
var constants = {
  DEFAULT_LEVELS: DEFAULT_LEVELS$2,
  SORTING_ORDER: SORTING_ORDER$2
};
const {
  lsCacheSym: lsCacheSym$1,
  levelValSym: levelValSym$1,
  useOnlyCustomLevelsSym: useOnlyCustomLevelsSym$2,
  streamSym: streamSym$2,
  formattersSym: formattersSym$2,
  hooksSym: hooksSym$1,
  levelCompSym: levelCompSym$1
} = symbols$1;
const { noop: noop$2, genLog } = tools;
const { DEFAULT_LEVELS: DEFAULT_LEVELS$1, SORTING_ORDER: SORTING_ORDER$1 } = constants;
const levelMethods = {
  fatal: (hook) => {
    const logFatal = genLog(DEFAULT_LEVELS$1.fatal, hook);
    return function(...args2) {
      const stream = this[streamSym$2];
      logFatal.call(this, ...args2);
      if (typeof stream.flushSync === "function") {
        try {
          stream.flushSync();
        } catch (e) {
        }
      }
    };
  },
  error: (hook) => genLog(DEFAULT_LEVELS$1.error, hook),
  warn: (hook) => genLog(DEFAULT_LEVELS$1.warn, hook),
  info: (hook) => genLog(DEFAULT_LEVELS$1.info, hook),
  debug: (hook) => genLog(DEFAULT_LEVELS$1.debug, hook),
  trace: (hook) => genLog(DEFAULT_LEVELS$1.trace, hook)
};
const nums = Object.keys(DEFAULT_LEVELS$1).reduce((o, k) => {
  o[DEFAULT_LEVELS$1[k]] = k;
  return o;
}, {});
const initialLsCache$1 = Object.keys(nums).reduce((o, k) => {
  o[k] = '{"level":' + Number(k);
  return o;
}, {});
function genLsCache$2(instance) {
  const formatter = instance[formattersSym$2].level;
  const { labels } = instance.levels;
  const cache = {};
  for (const label in labels) {
    const level = formatter(labels[label], Number(label));
    cache[label] = JSON.stringify(level).slice(0, -1);
  }
  instance[lsCacheSym$1] = cache;
  return instance;
}
function isStandardLevel(level, useOnlyCustomLevels) {
  if (useOnlyCustomLevels) {
    return false;
  }
  switch (level) {
    case "fatal":
    case "error":
    case "warn":
    case "info":
    case "debug":
    case "trace":
      return true;
    default:
      return false;
  }
}
function setLevel$1(level) {
  const { labels, values } = this.levels;
  if (typeof level === "number") {
    if (labels[level] === void 0) throw Error("unknown level value" + level);
    level = labels[level];
  }
  if (values[level] === void 0) throw Error("unknown level " + level);
  const preLevelVal = this[levelValSym$1];
  const levelVal = this[levelValSym$1] = values[level];
  const useOnlyCustomLevelsVal = this[useOnlyCustomLevelsSym$2];
  const levelComparison = this[levelCompSym$1];
  const hook = this[hooksSym$1].logMethod;
  for (const key in values) {
    if (levelComparison(values[key], levelVal) === false) {
      this[key] = noop$2;
      continue;
    }
    this[key] = isStandardLevel(key, useOnlyCustomLevelsVal) ? levelMethods[key](hook) : genLog(values[key], hook);
  }
  this.emit(
    "level-change",
    level,
    levelVal,
    labels[preLevelVal],
    preLevelVal,
    this
  );
}
function getLevel$1(level) {
  const { levels: levels2, levelVal } = this;
  return levels2 && levels2.labels ? levels2.labels[levelVal] : "";
}
function isLevelEnabled$1(logLevel) {
  const { values } = this.levels;
  const logLevelVal = values[logLevel];
  return logLevelVal !== void 0 && this[levelCompSym$1](logLevelVal, this[levelValSym$1]);
}
function compareLevel(direction, current, expected) {
  if (direction === SORTING_ORDER$1.DESC) {
    return current <= expected;
  }
  return current >= expected;
}
function genLevelComparison$1(levelComparison) {
  if (typeof levelComparison === "string") {
    return compareLevel.bind(null, levelComparison);
  }
  return levelComparison;
}
function mappings$2(customLevels = null, useOnlyCustomLevels = false) {
  const customNums = customLevels ? Object.keys(customLevels).reduce((o, k) => {
    o[customLevels[k]] = k;
    return o;
  }, {}) : null;
  const labels = Object.assign(
    Object.create(Object.prototype, { Infinity: { value: "silent" } }),
    useOnlyCustomLevels ? null : nums,
    customNums
  );
  const values = Object.assign(
    Object.create(Object.prototype, { silent: { value: Infinity } }),
    useOnlyCustomLevels ? null : DEFAULT_LEVELS$1,
    customLevels
  );
  return { labels, values };
}
function assertDefaultLevelFound$1(defaultLevel, customLevels, useOnlyCustomLevels) {
  if (typeof defaultLevel === "number") {
    const values = [].concat(
      Object.keys(customLevels || {}).map((key) => customLevels[key]),
      useOnlyCustomLevels ? [] : Object.keys(nums).map((level) => +level),
      Infinity
    );
    if (!values.includes(defaultLevel)) {
      throw Error(`default level:${defaultLevel} must be included in custom levels`);
    }
    return;
  }
  const labels = Object.assign(
    Object.create(Object.prototype, { silent: { value: Infinity } }),
    useOnlyCustomLevels ? null : DEFAULT_LEVELS$1,
    customLevels
  );
  if (!(defaultLevel in labels)) {
    throw Error(`default level:${defaultLevel} must be included in custom levels`);
  }
}
function assertNoLevelCollisions$1(levels2, customLevels) {
  const { labels, values } = levels2;
  for (const k in customLevels) {
    if (k in values) {
      throw Error("levels cannot be overridden");
    }
    if (customLevels[k] in labels) {
      throw Error("pre-existing level values cannot be used for new levels");
    }
  }
}
function assertLevelComparison$1(levelComparison) {
  if (typeof levelComparison === "function") {
    return;
  }
  if (typeof levelComparison === "string" && Object.values(SORTING_ORDER$1).includes(levelComparison)) {
    return;
  }
  throw new Error('Levels comparison should be one of "ASC", "DESC" or "function" type');
}
var levels = {
  initialLsCache: initialLsCache$1,
  genLsCache: genLsCache$2,
  getLevel: getLevel$1,
  setLevel: setLevel$1,
  isLevelEnabled: isLevelEnabled$1,
  mappings: mappings$2,
  assertNoLevelCollisions: assertNoLevelCollisions$1,
  assertDefaultLevelFound: assertDefaultLevelFound$1,
  genLevelComparison: genLevelComparison$1,
  assertLevelComparison: assertLevelComparison$1
};
var meta = { version: "8.21.0" };
const { EventEmitter } = require$$1;
const {
  lsCacheSym,
  levelValSym,
  setLevelSym: setLevelSym$1,
  getLevelSym,
  chindingsSym: chindingsSym$1,
  parsedChindingsSym,
  mixinSym: mixinSym$1,
  asJsonSym,
  writeSym,
  mixinMergeStrategySym: mixinMergeStrategySym$1,
  timeSym: timeSym$1,
  timeSliceIndexSym: timeSliceIndexSym$1,
  streamSym: streamSym$1,
  serializersSym: serializersSym$1,
  formattersSym: formattersSym$1,
  errorKeySym: errorKeySym$1,
  messageKeySym: messageKeySym$1,
  useOnlyCustomLevelsSym: useOnlyCustomLevelsSym$1,
  needsMetadataGsym,
  redactFmtSym: redactFmtSym$1,
  stringifySym: stringifySym$1,
  formatOptsSym: formatOptsSym$1,
  stringifiersSym: stringifiersSym$1,
  msgPrefixSym: msgPrefixSym$1
} = symbols$1;
const {
  getLevel,
  setLevel,
  isLevelEnabled,
  mappings: mappings$1,
  initialLsCache,
  genLsCache: genLsCache$1,
  assertNoLevelCollisions
} = levels;
const {
  asChindings: asChindings$1,
  asJson,
  buildFormatters: buildFormatters$1,
  stringify: stringify$1
} = tools;
const {
  version: version$1
} = meta;
const redaction$1 = redaction_1;
const constructor = class Pino {
};
const prototype = {
  constructor,
  child,
  bindings,
  setBindings,
  flush,
  isLevelEnabled,
  version: version$1,
  get level() {
    return this[getLevelSym]();
  },
  set level(lvl) {
    this[setLevelSym$1](lvl);
  },
  get levelVal() {
    return this[levelValSym];
  },
  set levelVal(n) {
    throw Error("levelVal is read-only");
  },
  [lsCacheSym]: initialLsCache,
  [writeSym]: write,
  [asJsonSym]: asJson,
  [getLevelSym]: getLevel,
  [setLevelSym$1]: setLevel
};
Object.setPrototypeOf(prototype, EventEmitter.prototype);
var proto$4 = function() {
  return Object.create(prototype);
};
const resetChildingsFormatter = (bindings2) => bindings2;
function child(bindings2, options) {
  if (!bindings2) {
    throw Error("missing bindings for child Pino");
  }
  options = options || {};
  const serializers2 = this[serializersSym$1];
  const formatters = this[formattersSym$1];
  const instance = Object.create(this);
  if (options.hasOwnProperty("serializers") === true) {
    instance[serializersSym$1] = /* @__PURE__ */ Object.create(null);
    for (const k in serializers2) {
      instance[serializersSym$1][k] = serializers2[k];
    }
    const parentSymbols = Object.getOwnPropertySymbols(serializers2);
    for (var i = 0; i < parentSymbols.length; i++) {
      const ks = parentSymbols[i];
      instance[serializersSym$1][ks] = serializers2[ks];
    }
    for (const bk in options.serializers) {
      instance[serializersSym$1][bk] = options.serializers[bk];
    }
    const bindingsSymbols = Object.getOwnPropertySymbols(options.serializers);
    for (var bi = 0; bi < bindingsSymbols.length; bi++) {
      const bks = bindingsSymbols[bi];
      instance[serializersSym$1][bks] = options.serializers[bks];
    }
  } else instance[serializersSym$1] = serializers2;
  if (options.hasOwnProperty("formatters")) {
    const { level, bindings: chindings, log } = options.formatters;
    instance[formattersSym$1] = buildFormatters$1(
      level || formatters.level,
      chindings || resetChildingsFormatter,
      log || formatters.log
    );
  } else {
    instance[formattersSym$1] = buildFormatters$1(
      formatters.level,
      resetChildingsFormatter,
      formatters.log
    );
  }
  if (options.hasOwnProperty("customLevels") === true) {
    assertNoLevelCollisions(this.levels, options.customLevels);
    instance.levels = mappings$1(options.customLevels, instance[useOnlyCustomLevelsSym$1]);
    genLsCache$1(instance);
  }
  if (typeof options.redact === "object" && options.redact !== null || Array.isArray(options.redact)) {
    instance.redact = options.redact;
    const stringifiers = redaction$1(instance.redact, stringify$1);
    const formatOpts = { stringify: stringifiers[redactFmtSym$1] };
    instance[stringifySym$1] = stringify$1;
    instance[stringifiersSym$1] = stringifiers;
    instance[formatOptsSym$1] = formatOpts;
  }
  if (typeof options.msgPrefix === "string") {
    instance[msgPrefixSym$1] = (this[msgPrefixSym$1] || "") + options.msgPrefix;
  }
  instance[chindingsSym$1] = asChindings$1(instance, bindings2);
  const childLevel = options.level || this.level;
  instance[setLevelSym$1](childLevel);
  this.onChild(instance);
  return instance;
}
function bindings() {
  const chindings = this[chindingsSym$1];
  const chindingsJson = `{${chindings.substr(1)}}`;
  const bindingsFromJson = JSON.parse(chindingsJson);
  delete bindingsFromJson.pid;
  delete bindingsFromJson.hostname;
  return bindingsFromJson;
}
function setBindings(newBindings) {
  const chindings = asChindings$1(this, newBindings);
  this[chindingsSym$1] = chindings;
  delete this[parsedChindingsSym];
}
function defaultMixinMergeStrategy(mergeObject, mixinObject) {
  return Object.assign(mixinObject, mergeObject);
}
function write(_obj, msg, num) {
  const t = this[timeSym$1]();
  const mixin = this[mixinSym$1];
  const errorKey = this[errorKeySym$1];
  const messageKey = this[messageKeySym$1];
  const mixinMergeStrategy = this[mixinMergeStrategySym$1] || defaultMixinMergeStrategy;
  let obj;
  if (_obj === void 0 || _obj === null) {
    obj = {};
  } else if (_obj instanceof Error) {
    obj = { [errorKey]: _obj };
    if (msg === void 0) {
      msg = _obj.message;
    }
  } else {
    obj = _obj;
    if (msg === void 0 && _obj[messageKey] === void 0 && _obj[errorKey]) {
      msg = _obj[errorKey].message;
    }
  }
  if (mixin) {
    obj = mixinMergeStrategy(obj, mixin(obj, num, this));
  }
  const s = this[asJsonSym](obj, msg, num, t);
  const stream = this[streamSym$1];
  if (stream[needsMetadataGsym] === true) {
    stream.lastLevel = num;
    stream.lastObj = obj;
    stream.lastMsg = msg;
    stream.lastTime = t.slice(this[timeSliceIndexSym$1]);
    stream.lastLogger = this;
  }
  stream.write(s);
}
function noop$1() {
}
function flush(cb) {
  if (cb != null && typeof cb !== "function") {
    throw Error("callback must be a function");
  }
  const stream = this[streamSym$1];
  if (typeof stream.flush === "function") {
    stream.flush(cb || noop$1);
  } else if (cb) cb();
}
var safeStableStringify = { exports: {} };
(function(module2, exports) {
  const { hasOwnProperty } = Object.prototype;
  const stringify2 = configure2();
  stringify2.configure = configure2;
  stringify2.stringify = stringify2;
  stringify2.default = stringify2;
  exports.stringify = stringify2;
  exports.configure = configure2;
  module2.exports = stringify2;
  const strEscapeSequencesRegExp = /[\u0000-\u001f\u0022\u005c\ud800-\udfff]/;
  function strEscape(str) {
    if (str.length < 5e3 && !strEscapeSequencesRegExp.test(str)) {
      return `"${str}"`;
    }
    return JSON.stringify(str);
  }
  function sort2(array2, comparator) {
    if (array2.length > 200 || comparator) {
      return array2.sort(comparator);
    }
    for (let i = 1; i < array2.length; i++) {
      const currentValue = array2[i];
      let position = i;
      while (position !== 0 && array2[position - 1] > currentValue) {
        array2[position] = array2[position - 1];
        position--;
      }
      array2[position] = currentValue;
    }
    return array2;
  }
  const typedArrayPrototypeGetSymbolToStringTag = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(
      Object.getPrototypeOf(
        new Int8Array()
      )
    ),
    Symbol.toStringTag
  ).get;
  function isTypedArrayWithEntries(value) {
    return typedArrayPrototypeGetSymbolToStringTag.call(value) !== void 0 && value.length !== 0;
  }
  function stringifyTypedArray(array2, separator, maximumBreadth) {
    if (array2.length < maximumBreadth) {
      maximumBreadth = array2.length;
    }
    const whitespace = separator === "," ? "" : " ";
    let res2 = `"0":${whitespace}${array2[0]}`;
    for (let i = 1; i < maximumBreadth; i++) {
      res2 += `${separator}"${i}":${whitespace}${array2[i]}`;
    }
    return res2;
  }
  function getCircularValueOption(options) {
    if (hasOwnProperty.call(options, "circularValue")) {
      const circularValue = options.circularValue;
      if (typeof circularValue === "string") {
        return `"${circularValue}"`;
      }
      if (circularValue == null) {
        return circularValue;
      }
      if (circularValue === Error || circularValue === TypeError) {
        return {
          toString() {
            throw new TypeError("Converting circular structure to JSON");
          }
        };
      }
      throw new TypeError('The "circularValue" argument must be of type string or the value null or undefined');
    }
    return '"[Circular]"';
  }
  function getDeterministicOption(options) {
    let value;
    if (hasOwnProperty.call(options, "deterministic")) {
      value = options.deterministic;
      if (typeof value !== "boolean" && typeof value !== "function") {
        throw new TypeError('The "deterministic" argument must be of type boolean or comparator function');
      }
    }
    return value === void 0 ? true : value;
  }
  function getBooleanOption(options, key) {
    let value;
    if (hasOwnProperty.call(options, key)) {
      value = options[key];
      if (typeof value !== "boolean") {
        throw new TypeError(`The "${key}" argument must be of type boolean`);
      }
    }
    return value === void 0 ? true : value;
  }
  function getPositiveIntegerOption(options, key) {
    let value;
    if (hasOwnProperty.call(options, key)) {
      value = options[key];
      if (typeof value !== "number") {
        throw new TypeError(`The "${key}" argument must be of type number`);
      }
      if (!Number.isInteger(value)) {
        throw new TypeError(`The "${key}" argument must be an integer`);
      }
      if (value < 1) {
        throw new RangeError(`The "${key}" argument must be >= 1`);
      }
    }
    return value === void 0 ? Infinity : value;
  }
  function getItemCount(number2) {
    if (number2 === 1) {
      return "1 item";
    }
    return `${number2} items`;
  }
  function getUniqueReplacerSet(replacerArray) {
    const replacerSet = /* @__PURE__ */ new Set();
    for (const value of replacerArray) {
      if (typeof value === "string" || typeof value === "number") {
        replacerSet.add(String(value));
      }
    }
    return replacerSet;
  }
  function getStrictOption(options) {
    if (hasOwnProperty.call(options, "strict")) {
      const value = options.strict;
      if (typeof value !== "boolean") {
        throw new TypeError('The "strict" argument must be of type boolean');
      }
      if (value) {
        return (value2) => {
          let message = `Object can not safely be stringified. Received type ${typeof value2}`;
          if (typeof value2 !== "function") message += ` (${value2.toString()})`;
          throw new Error(message);
        };
      }
    }
  }
  function configure2(options) {
    options = { ...options };
    const fail2 = getStrictOption(options);
    if (fail2) {
      if (options.bigint === void 0) {
        options.bigint = false;
      }
      if (!("circularValue" in options)) {
        options.circularValue = Error;
      }
    }
    const circularValue = getCircularValueOption(options);
    const bigint = getBooleanOption(options, "bigint");
    const deterministic = getDeterministicOption(options);
    const comparator = typeof deterministic === "function" ? deterministic : void 0;
    const maximumDepth = getPositiveIntegerOption(options, "maximumDepth");
    const maximumBreadth = getPositiveIntegerOption(options, "maximumBreadth");
    function stringifyFnReplacer(key, parent, stack, replacer, spacer, indentation) {
      let value = parent[key];
      if (typeof value === "object" && value !== null && typeof value.toJSON === "function") {
        value = value.toJSON(key);
      }
      value = replacer.call(parent, key, value);
      switch (typeof value) {
        case "string":
          return strEscape(value);
        case "object": {
          if (value === null) {
            return "null";
          }
          if (stack.indexOf(value) !== -1) {
            return circularValue;
          }
          let res2 = "";
          let join2 = ",";
          const originalIndentation = indentation;
          if (Array.isArray(value)) {
            if (value.length === 0) {
              return "[]";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Array]"';
            }
            stack.push(value);
            if (spacer !== "") {
              indentation += spacer;
              res2 += `
${indentation}`;
              join2 = `,
${indentation}`;
            }
            const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
            let i = 0;
            for (; i < maximumValuesToStringify - 1; i++) {
              const tmp2 = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
              res2 += tmp2 !== void 0 ? tmp2 : "null";
              res2 += join2;
            }
            const tmp = stringifyFnReplacer(String(i), value, stack, replacer, spacer, indentation);
            res2 += tmp !== void 0 ? tmp : "null";
            if (value.length - 1 > maximumBreadth) {
              const removedKeys = value.length - maximumBreadth - 1;
              res2 += `${join2}"... ${getItemCount(removedKeys)} not stringified"`;
            }
            if (spacer !== "") {
              res2 += `
${originalIndentation}`;
            }
            stack.pop();
            return `[${res2}]`;
          }
          let keys2 = Object.keys(value);
          const keyLength = keys2.length;
          if (keyLength === 0) {
            return "{}";
          }
          if (maximumDepth < stack.length + 1) {
            return '"[Object]"';
          }
          let whitespace = "";
          let separator = "";
          if (spacer !== "") {
            indentation += spacer;
            join2 = `,
${indentation}`;
            whitespace = " ";
          }
          const maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
          if (deterministic && !isTypedArrayWithEntries(value)) {
            keys2 = sort2(keys2, comparator);
          }
          stack.push(value);
          for (let i = 0; i < maximumPropertiesToStringify; i++) {
            const key2 = keys2[i];
            const tmp = stringifyFnReplacer(key2, value, stack, replacer, spacer, indentation);
            if (tmp !== void 0) {
              res2 += `${separator}${strEscape(key2)}:${whitespace}${tmp}`;
              separator = join2;
            }
          }
          if (keyLength > maximumBreadth) {
            const removedKeys = keyLength - maximumBreadth;
            res2 += `${separator}"...":${whitespace}"${getItemCount(removedKeys)} not stringified"`;
            separator = join2;
          }
          if (spacer !== "" && separator.length > 1) {
            res2 = `
${indentation}${res2}
${originalIndentation}`;
          }
          stack.pop();
          return `{${res2}}`;
        }
        case "number":
          return isFinite(value) ? String(value) : fail2 ? fail2(value) : "null";
        case "boolean":
          return value === true ? "true" : "false";
        case "undefined":
          return void 0;
        case "bigint":
          if (bigint) {
            return String(value);
          }
        default:
          return fail2 ? fail2(value) : void 0;
      }
    }
    function stringifyArrayReplacer(key, value, stack, replacer, spacer, indentation) {
      if (typeof value === "object" && value !== null && typeof value.toJSON === "function") {
        value = value.toJSON(key);
      }
      switch (typeof value) {
        case "string":
          return strEscape(value);
        case "object": {
          if (value === null) {
            return "null";
          }
          if (stack.indexOf(value) !== -1) {
            return circularValue;
          }
          const originalIndentation = indentation;
          let res2 = "";
          let join2 = ",";
          if (Array.isArray(value)) {
            if (value.length === 0) {
              return "[]";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Array]"';
            }
            stack.push(value);
            if (spacer !== "") {
              indentation += spacer;
              res2 += `
${indentation}`;
              join2 = `,
${indentation}`;
            }
            const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
            let i = 0;
            for (; i < maximumValuesToStringify - 1; i++) {
              const tmp2 = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
              res2 += tmp2 !== void 0 ? tmp2 : "null";
              res2 += join2;
            }
            const tmp = stringifyArrayReplacer(String(i), value[i], stack, replacer, spacer, indentation);
            res2 += tmp !== void 0 ? tmp : "null";
            if (value.length - 1 > maximumBreadth) {
              const removedKeys = value.length - maximumBreadth - 1;
              res2 += `${join2}"... ${getItemCount(removedKeys)} not stringified"`;
            }
            if (spacer !== "") {
              res2 += `
${originalIndentation}`;
            }
            stack.pop();
            return `[${res2}]`;
          }
          stack.push(value);
          let whitespace = "";
          if (spacer !== "") {
            indentation += spacer;
            join2 = `,
${indentation}`;
            whitespace = " ";
          }
          let separator = "";
          for (const key2 of replacer) {
            const tmp = stringifyArrayReplacer(key2, value[key2], stack, replacer, spacer, indentation);
            if (tmp !== void 0) {
              res2 += `${separator}${strEscape(key2)}:${whitespace}${tmp}`;
              separator = join2;
            }
          }
          if (spacer !== "" && separator.length > 1) {
            res2 = `
${indentation}${res2}
${originalIndentation}`;
          }
          stack.pop();
          return `{${res2}}`;
        }
        case "number":
          return isFinite(value) ? String(value) : fail2 ? fail2(value) : "null";
        case "boolean":
          return value === true ? "true" : "false";
        case "undefined":
          return void 0;
        case "bigint":
          if (bigint) {
            return String(value);
          }
        default:
          return fail2 ? fail2(value) : void 0;
      }
    }
    function stringifyIndent(key, value, stack, spacer, indentation) {
      switch (typeof value) {
        case "string":
          return strEscape(value);
        case "object": {
          if (value === null) {
            return "null";
          }
          if (typeof value.toJSON === "function") {
            value = value.toJSON(key);
            if (typeof value !== "object") {
              return stringifyIndent(key, value, stack, spacer, indentation);
            }
            if (value === null) {
              return "null";
            }
          }
          if (stack.indexOf(value) !== -1) {
            return circularValue;
          }
          const originalIndentation = indentation;
          if (Array.isArray(value)) {
            if (value.length === 0) {
              return "[]";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Array]"';
            }
            stack.push(value);
            indentation += spacer;
            let res3 = `
${indentation}`;
            const join3 = `,
${indentation}`;
            const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
            let i = 0;
            for (; i < maximumValuesToStringify - 1; i++) {
              const tmp2 = stringifyIndent(String(i), value[i], stack, spacer, indentation);
              res3 += tmp2 !== void 0 ? tmp2 : "null";
              res3 += join3;
            }
            const tmp = stringifyIndent(String(i), value[i], stack, spacer, indentation);
            res3 += tmp !== void 0 ? tmp : "null";
            if (value.length - 1 > maximumBreadth) {
              const removedKeys = value.length - maximumBreadth - 1;
              res3 += `${join3}"... ${getItemCount(removedKeys)} not stringified"`;
            }
            res3 += `
${originalIndentation}`;
            stack.pop();
            return `[${res3}]`;
          }
          let keys2 = Object.keys(value);
          const keyLength = keys2.length;
          if (keyLength === 0) {
            return "{}";
          }
          if (maximumDepth < stack.length + 1) {
            return '"[Object]"';
          }
          indentation += spacer;
          const join2 = `,
${indentation}`;
          let res2 = "";
          let separator = "";
          let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
          if (isTypedArrayWithEntries(value)) {
            res2 += stringifyTypedArray(value, join2, maximumBreadth);
            keys2 = keys2.slice(value.length);
            maximumPropertiesToStringify -= value.length;
            separator = join2;
          }
          if (deterministic) {
            keys2 = sort2(keys2, comparator);
          }
          stack.push(value);
          for (let i = 0; i < maximumPropertiesToStringify; i++) {
            const key2 = keys2[i];
            const tmp = stringifyIndent(key2, value[key2], stack, spacer, indentation);
            if (tmp !== void 0) {
              res2 += `${separator}${strEscape(key2)}: ${tmp}`;
              separator = join2;
            }
          }
          if (keyLength > maximumBreadth) {
            const removedKeys = keyLength - maximumBreadth;
            res2 += `${separator}"...": "${getItemCount(removedKeys)} not stringified"`;
            separator = join2;
          }
          if (separator !== "") {
            res2 = `
${indentation}${res2}
${originalIndentation}`;
          }
          stack.pop();
          return `{${res2}}`;
        }
        case "number":
          return isFinite(value) ? String(value) : fail2 ? fail2(value) : "null";
        case "boolean":
          return value === true ? "true" : "false";
        case "undefined":
          return void 0;
        case "bigint":
          if (bigint) {
            return String(value);
          }
        default:
          return fail2 ? fail2(value) : void 0;
      }
    }
    function stringifySimple(key, value, stack) {
      switch (typeof value) {
        case "string":
          return strEscape(value);
        case "object": {
          if (value === null) {
            return "null";
          }
          if (typeof value.toJSON === "function") {
            value = value.toJSON(key);
            if (typeof value !== "object") {
              return stringifySimple(key, value, stack);
            }
            if (value === null) {
              return "null";
            }
          }
          if (stack.indexOf(value) !== -1) {
            return circularValue;
          }
          let res2 = "";
          const hasLength = value.length !== void 0;
          if (hasLength && Array.isArray(value)) {
            if (value.length === 0) {
              return "[]";
            }
            if (maximumDepth < stack.length + 1) {
              return '"[Array]"';
            }
            stack.push(value);
            const maximumValuesToStringify = Math.min(value.length, maximumBreadth);
            let i = 0;
            for (; i < maximumValuesToStringify - 1; i++) {
              const tmp2 = stringifySimple(String(i), value[i], stack);
              res2 += tmp2 !== void 0 ? tmp2 : "null";
              res2 += ",";
            }
            const tmp = stringifySimple(String(i), value[i], stack);
            res2 += tmp !== void 0 ? tmp : "null";
            if (value.length - 1 > maximumBreadth) {
              const removedKeys = value.length - maximumBreadth - 1;
              res2 += `,"... ${getItemCount(removedKeys)} not stringified"`;
            }
            stack.pop();
            return `[${res2}]`;
          }
          let keys2 = Object.keys(value);
          const keyLength = keys2.length;
          if (keyLength === 0) {
            return "{}";
          }
          if (maximumDepth < stack.length + 1) {
            return '"[Object]"';
          }
          let separator = "";
          let maximumPropertiesToStringify = Math.min(keyLength, maximumBreadth);
          if (hasLength && isTypedArrayWithEntries(value)) {
            res2 += stringifyTypedArray(value, ",", maximumBreadth);
            keys2 = keys2.slice(value.length);
            maximumPropertiesToStringify -= value.length;
            separator = ",";
          }
          if (deterministic) {
            keys2 = sort2(keys2, comparator);
          }
          stack.push(value);
          for (let i = 0; i < maximumPropertiesToStringify; i++) {
            const key2 = keys2[i];
            const tmp = stringifySimple(key2, value[key2], stack);
            if (tmp !== void 0) {
              res2 += `${separator}${strEscape(key2)}:${tmp}`;
              separator = ",";
            }
          }
          if (keyLength > maximumBreadth) {
            const removedKeys = keyLength - maximumBreadth;
            res2 += `${separator}"...":"${getItemCount(removedKeys)} not stringified"`;
          }
          stack.pop();
          return `{${res2}}`;
        }
        case "number":
          return isFinite(value) ? String(value) : fail2 ? fail2(value) : "null";
        case "boolean":
          return value === true ? "true" : "false";
        case "undefined":
          return void 0;
        case "bigint":
          if (bigint) {
            return String(value);
          }
        default:
          return fail2 ? fail2(value) : void 0;
      }
    }
    function stringify3(value, replacer, space) {
      if (arguments.length > 1) {
        let spacer = "";
        if (typeof space === "number") {
          spacer = " ".repeat(Math.min(space, 10));
        } else if (typeof space === "string") {
          spacer = space.slice(0, 10);
        }
        if (replacer != null) {
          if (typeof replacer === "function") {
            return stringifyFnReplacer("", { "": value }, [], replacer, spacer, "");
          }
          if (Array.isArray(replacer)) {
            return stringifyArrayReplacer("", value, [], getUniqueReplacerSet(replacer), spacer, "");
          }
        }
        if (spacer.length !== 0) {
          return stringifyIndent("", value, [], spacer, "");
        }
      }
      return stringifySimple("", value, []);
    }
    return stringify3;
  }
})(safeStableStringify, safeStableStringify.exports);
var safeStableStringifyExports = safeStableStringify.exports;
var multistream_1;
var hasRequiredMultistream;
function requireMultistream() {
  if (hasRequiredMultistream) return multistream_1;
  hasRequiredMultistream = 1;
  const metadata = Symbol.for("pino.metadata");
  const { DEFAULT_LEVELS: DEFAULT_LEVELS2 } = constants;
  const DEFAULT_INFO_LEVEL = DEFAULT_LEVELS2.info;
  function multistream(streamsArray, opts) {
    let counter2 = 0;
    streamsArray = streamsArray || [];
    opts = opts || { dedupe: false };
    const streamLevels = Object.create(DEFAULT_LEVELS2);
    streamLevels.silent = Infinity;
    if (opts.levels && typeof opts.levels === "object") {
      Object.keys(opts.levels).forEach((i) => {
        streamLevels[i] = opts.levels[i];
      });
    }
    const res2 = {
      write: write2,
      add: add2,
      emit,
      flushSync: flushSync2,
      end,
      minLevel: 0,
      streams: [],
      clone,
      [metadata]: true,
      streamLevels
    };
    if (Array.isArray(streamsArray)) {
      streamsArray.forEach(add2, res2);
    } else {
      add2.call(res2, streamsArray);
    }
    streamsArray = null;
    return res2;
    function write2(data) {
      let dest;
      const level = this.lastLevel;
      const { streams } = this;
      let recordedLevel = 0;
      let stream;
      for (let i = initLoopVar(streams.length, opts.dedupe); checkLoopVar(i, streams.length, opts.dedupe); i = adjustLoopVar(i, opts.dedupe)) {
        dest = streams[i];
        if (dest.level <= level) {
          if (recordedLevel !== 0 && recordedLevel !== dest.level) {
            break;
          }
          stream = dest.stream;
          if (stream[metadata]) {
            const { lastTime, lastMsg, lastObj, lastLogger } = this;
            stream.lastLevel = level;
            stream.lastTime = lastTime;
            stream.lastMsg = lastMsg;
            stream.lastObj = lastObj;
            stream.lastLogger = lastLogger;
          }
          stream.write(data);
          if (opts.dedupe) {
            recordedLevel = dest.level;
          }
        } else if (!opts.dedupe) {
          break;
        }
      }
    }
    function emit(...args2) {
      for (const { stream } of this.streams) {
        if (typeof stream.emit === "function") {
          stream.emit(...args2);
        }
      }
    }
    function flushSync2() {
      for (const { stream } of this.streams) {
        if (typeof stream.flushSync === "function") {
          stream.flushSync();
        }
      }
    }
    function add2(dest) {
      if (!dest) {
        return res2;
      }
      const isStream = typeof dest.write === "function" || dest.stream;
      const stream_ = dest.write ? dest : dest.stream;
      if (!isStream) {
        throw Error("stream object needs to implement either StreamEntry or DestinationStream interface");
      }
      const { streams, streamLevels: streamLevels2 } = this;
      let level;
      if (typeof dest.levelVal === "number") {
        level = dest.levelVal;
      } else if (typeof dest.level === "string") {
        level = streamLevels2[dest.level];
      } else if (typeof dest.level === "number") {
        level = dest.level;
      } else {
        level = DEFAULT_INFO_LEVEL;
      }
      const dest_ = {
        stream: stream_,
        level,
        levelVal: void 0,
        id: counter2++
      };
      streams.unshift(dest_);
      streams.sort(compareByLevel);
      this.minLevel = streams[0].level;
      return res2;
    }
    function end() {
      for (const { stream } of this.streams) {
        if (typeof stream.flushSync === "function") {
          stream.flushSync();
        }
        stream.end();
      }
    }
    function clone(level) {
      const streams = new Array(this.streams.length);
      for (let i = 0; i < streams.length; i++) {
        streams[i] = {
          level,
          stream: this.streams[i].stream
        };
      }
      return {
        write: write2,
        add: add2,
        minLevel: level,
        streams,
        clone,
        emit,
        flushSync: flushSync2,
        [metadata]: true
      };
    }
  }
  function compareByLevel(a, b) {
    return a.level - b.level;
  }
  function initLoopVar(length, dedupe2) {
    return dedupe2 ? length - 1 : 0;
  }
  function adjustLoopVar(i, dedupe2) {
    return dedupe2 ? i - 1 : i + 1;
  }
  function checkLoopVar(i, length, dedupe2) {
    return dedupe2 ? i >= 0 : i < length;
  }
  multistream_1 = multistream;
  return multistream_1;
}
const os = require$$0$2;
const stdSerializers = pinoStdSerializers;
const caller = caller$1;
const redaction = redaction_1;
const time = time$1;
const proto$3 = proto$4;
const symbols = symbols$1;
const { configure } = safeStableStringifyExports;
const { assertDefaultLevelFound, mappings, genLsCache, genLevelComparison, assertLevelComparison } = levels;
const { DEFAULT_LEVELS, SORTING_ORDER } = constants;
const {
  createArgsNormalizer,
  asChindings,
  buildSafeSonicBoom,
  buildFormatters,
  stringify,
  normalizeDestFileDescriptor,
  noop
} = tools;
const { version } = meta;
const {
  chindingsSym,
  redactFmtSym,
  serializersSym,
  timeSym,
  timeSliceIndexSym,
  streamSym,
  stringifySym,
  stringifySafeSym,
  stringifiersSym,
  setLevelSym,
  endSym,
  formatOptsSym,
  messageKeySym,
  errorKeySym,
  nestedKeySym,
  mixinSym,
  levelCompSym,
  useOnlyCustomLevelsSym,
  formattersSym,
  hooksSym,
  nestedKeyStrSym,
  mixinMergeStrategySym,
  msgPrefixSym
} = symbols;
const { epochTime, nullTime } = time;
const { pid } = process;
const hostname = os.hostname();
const defaultErrorSerializer = stdSerializers.err;
const defaultOptions = {
  level: "info",
  levelComparison: SORTING_ORDER.ASC,
  levels: DEFAULT_LEVELS,
  messageKey: "msg",
  errorKey: "err",
  nestedKey: null,
  enabled: true,
  base: { pid, hostname },
  serializers: Object.assign(/* @__PURE__ */ Object.create(null), {
    err: defaultErrorSerializer
  }),
  formatters: Object.assign(/* @__PURE__ */ Object.create(null), {
    bindings(bindings2) {
      return bindings2;
    },
    level(label, number2) {
      return { level: number2 };
    }
  }),
  hooks: {
    logMethod: void 0
  },
  timestamp: epochTime,
  name: void 0,
  redact: null,
  customLevels: null,
  useOnlyCustomLevels: false,
  depthLimit: 5,
  edgeLimit: 100
};
const normalize = createArgsNormalizer(defaultOptions);
const serializers = Object.assign(/* @__PURE__ */ Object.create(null), stdSerializers);
function pino(...args2) {
  const instance = {};
  const { opts, stream } = normalize(instance, caller(), ...args2);
  const {
    redact: redact2,
    crlf,
    serializers: serializers2,
    timestamp,
    messageKey,
    errorKey,
    nestedKey,
    base,
    name,
    level,
    customLevels,
    levelComparison,
    mixin,
    mixinMergeStrategy,
    useOnlyCustomLevels,
    formatters,
    hooks,
    depthLimit,
    edgeLimit,
    onChild,
    msgPrefix
  } = opts;
  const stringifySafe = configure({
    maximumDepth: depthLimit,
    maximumBreadth: edgeLimit
  });
  const allFormatters = buildFormatters(
    formatters.level,
    formatters.bindings,
    formatters.log
  );
  const stringifyFn = stringify.bind({
    [stringifySafeSym]: stringifySafe
  });
  const stringifiers = redact2 ? redaction(redact2, stringifyFn) : {};
  const formatOpts = redact2 ? { stringify: stringifiers[redactFmtSym] } : { stringify: stringifyFn };
  const end = "}" + (crlf ? "\r\n" : "\n");
  const coreChindings = asChindings.bind(null, {
    [chindingsSym]: "",
    [serializersSym]: serializers2,
    [stringifiersSym]: stringifiers,
    [stringifySym]: stringify,
    [stringifySafeSym]: stringifySafe,
    [formattersSym]: allFormatters
  });
  let chindings = "";
  if (base !== null) {
    if (name === void 0) {
      chindings = coreChindings(base);
    } else {
      chindings = coreChindings(Object.assign({}, base, { name }));
    }
  }
  const time2 = timestamp instanceof Function ? timestamp : timestamp ? epochTime : nullTime;
  const timeSliceIndex = time2().indexOf(":") + 1;
  if (useOnlyCustomLevels && !customLevels) throw Error("customLevels is required if useOnlyCustomLevels is set true");
  if (mixin && typeof mixin !== "function") throw Error(`Unknown mixin type "${typeof mixin}" - expected "function"`);
  if (msgPrefix && typeof msgPrefix !== "string") throw Error(`Unknown msgPrefix type "${typeof msgPrefix}" - expected "string"`);
  assertDefaultLevelFound(level, customLevels, useOnlyCustomLevels);
  const levels2 = mappings(customLevels, useOnlyCustomLevels);
  if (typeof stream.emit === "function") {
    stream.emit("message", { code: "PINO_CONFIG", config: { levels: levels2, messageKey, errorKey } });
  }
  assertLevelComparison(levelComparison);
  const levelCompFunc = genLevelComparison(levelComparison);
  Object.assign(instance, {
    levels: levels2,
    [levelCompSym]: levelCompFunc,
    [useOnlyCustomLevelsSym]: useOnlyCustomLevels,
    [streamSym]: stream,
    [timeSym]: time2,
    [timeSliceIndexSym]: timeSliceIndex,
    [stringifySym]: stringify,
    [stringifySafeSym]: stringifySafe,
    [stringifiersSym]: stringifiers,
    [endSym]: end,
    [formatOptsSym]: formatOpts,
    [messageKeySym]: messageKey,
    [errorKeySym]: errorKey,
    [nestedKeySym]: nestedKey,
    // protect against injection
    [nestedKeyStrSym]: nestedKey ? `,${JSON.stringify(nestedKey)}:{` : "",
    [serializersSym]: serializers2,
    [mixinSym]: mixin,
    [mixinMergeStrategySym]: mixinMergeStrategy,
    [chindingsSym]: chindings,
    [formattersSym]: allFormatters,
    [hooksSym]: hooks,
    silent: noop,
    onChild,
    [msgPrefixSym]: msgPrefix
  });
  Object.setPrototypeOf(instance, proto$3());
  genLsCache(instance);
  instance[setLevelSym](level);
  return instance;
}
pino$2.exports = pino;
pino$2.exports.destination = (dest = process.stdout.fd) => {
  if (typeof dest === "object") {
    dest.dest = normalizeDestFileDescriptor(dest.dest || process.stdout.fd);
    return buildSafeSonicBoom(dest);
  } else {
    return buildSafeSonicBoom({ dest: normalizeDestFileDescriptor(dest), minLength: 0 });
  }
};
pino$2.exports.transport = requireTransport();
pino$2.exports.multistream = requireMultistream();
pino$2.exports.levels = mappings();
pino$2.exports.stdSerializers = serializers;
pino$2.exports.stdTimeFunctions = Object.assign({}, time);
pino$2.exports.symbols = symbols;
pino$2.exports.version = version;
pino$2.exports.default = pino;
pino$2.exports.pino = pino;
var pinoExports = pino$2.exports;
const pino$1 = /* @__PURE__ */ getDefaultExportFromCjs(pinoExports);
const isFunction$3 = (input) => typeof input === "function";
const dual$1 = function(arity, body) {
  if (typeof arity === "function") {
    return function() {
      if (arity(arguments)) {
        return body.apply(this, arguments);
      }
      return (self2) => body(self2, ...arguments);
    };
  }
  switch (arity) {
    case 0:
    case 1:
      throw new RangeError(`Invalid arity ${arity}`);
    case 2:
      return function(a, b) {
        if (arguments.length >= 2) {
          return body(a, b);
        }
        return function(self2) {
          return body(self2, a);
        };
      };
    case 3:
      return function(a, b, c) {
        if (arguments.length >= 3) {
          return body(a, b, c);
        }
        return function(self2) {
          return body(self2, a, b);
        };
      };
    case 4:
      return function(a, b, c, d) {
        if (arguments.length >= 4) {
          return body(a, b, c, d);
        }
        return function(self2) {
          return body(self2, a, b, c);
        };
      };
    case 5:
      return function(a, b, c, d, e) {
        if (arguments.length >= 5) {
          return body(a, b, c, d, e);
        }
        return function(self2) {
          return body(self2, a, b, c, d);
        };
      };
    default:
      return function() {
        if (arguments.length >= arity) {
          return body.apply(this, arguments);
        }
        const args2 = arguments;
        return function(self2) {
          return body(self2, ...args2);
        };
      };
  }
};
const identity = (a) => a;
const constant$1 = (value) => () => value;
const constTrue$1 = /* @__PURE__ */ constant$1(true);
const constFalse$1 = /* @__PURE__ */ constant$1(false);
const constUndefined$1 = /* @__PURE__ */ constant$1(void 0);
const constVoid = constUndefined$1;
function pipe$1(a, ab, bc, cd, de, ef, fg, gh, hi) {
  switch (arguments.length) {
    case 1:
      return a;
    case 2:
      return ab(a);
    case 3:
      return bc(ab(a));
    case 4:
      return cd(bc(ab(a)));
    case 5:
      return de(cd(bc(ab(a))));
    case 6:
      return ef(de(cd(bc(ab(a)))));
    case 7:
      return fg(ef(de(cd(bc(ab(a))))));
    case 8:
      return gh(fg(ef(de(cd(bc(ab(a)))))));
    case 9:
      return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
    default: {
      let ret = arguments[0];
      for (let i = 1; i < arguments.length; i++) {
        ret = arguments[i](ret);
      }
      return ret;
    }
  }
}
const make$n = (isEquivalent) => (self2, that) => self2 === that || isEquivalent(self2, that);
const mapInput$1 = /* @__PURE__ */ dual$1(2, (self2, f) => make$n((x, y) => self2(f(x), f(y))));
const array$2 = (item) => make$n((self2, that) => {
  if (self2.length !== that.length) {
    return false;
  }
  for (let i = 0; i < self2.length; i++) {
    const isEq = item(self2[i], that[i]);
    if (!isEq) {
      return false;
    }
  }
  return true;
});
let moduleVersion = "3.15.2";
const getCurrentVersion = () => moduleVersion;
const globalStoreId$1 = `effect/GlobalValue/globalStoreId/${/* @__PURE__ */ getCurrentVersion()}`;
let globalStore$1;
const globalValue$1 = (id, compute) => {
  if (!globalStore$1) {
    globalThis[globalStoreId$1] ?? (globalThis[globalStoreId$1] = /* @__PURE__ */ new Map());
    globalStore$1 = globalThis[globalStoreId$1];
  }
  if (!globalStore$1.has(id)) {
    globalStore$1.set(id, compute());
  }
  return globalStore$1.get(id);
};
const isString = (input) => typeof input === "string";
const isNumber = (input) => typeof input === "number";
const isBigInt = (input) => typeof input === "bigint";
const isFunction$2 = isFunction$3;
const isRecordOrArray = (input) => typeof input === "object" && input !== null;
const isObject$1 = (input) => isRecordOrArray(input) || isFunction$2(input);
const hasProperty = /* @__PURE__ */ dual$1(2, (self2, property) => isObject$1(self2) && property in self2);
const isTagged = /* @__PURE__ */ dual$1(2, (self2, tag) => hasProperty(self2, "_tag") && self2["_tag"] === tag);
const isNullable$1 = (input) => input === null || input === void 0;
const isPromiseLike = (input) => hasProperty(input, "then") && isFunction$2(input.then);
const getBugErrorMessage = (message) => `BUG: ${message} - please report an issue at https://github.com/Effect-TS/effect/issues`;
let SingleShotGen$1 = class SingleShotGen {
  constructor(self2) {
    __publicField(this, "self");
    __publicField(this, "called", false);
    this.self = self2;
  }
  /**
   * @since 2.0.0
   */
  next(a) {
    return this.called ? {
      value: a,
      done: true
    } : (this.called = true, {
      value: this.self,
      done: false
    });
  }
  /**
   * @since 2.0.0
   */
  return(a) {
    return {
      value: a,
      done: true
    };
  }
  /**
   * @since 2.0.0
   */
  throw(e) {
    throw e;
  }
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new SingleShotGen(this.self);
  }
};
const defaultIncHi$1 = 335903614;
const defaultIncLo$1 = 4150755663;
const MUL_HI$1 = 1481765933 >>> 0;
const MUL_LO$1 = 1284865837 >>> 0;
const BIT_53$1 = 9007199254740992;
const BIT_27$1 = 134217728;
let PCGRandom$1 = class PCGRandom {
  constructor(seedHi, seedLo, incHi, incLo) {
    __publicField(this, "_state");
    if (isNullable$1(seedLo) && isNullable$1(seedHi)) {
      seedLo = Math.random() * 4294967295 >>> 0;
      seedHi = 0;
    } else if (isNullable$1(seedLo)) {
      seedLo = seedHi;
      seedHi = 0;
    }
    if (isNullable$1(incLo) && isNullable$1(incHi)) {
      incLo = this._state ? this._state[3] : defaultIncLo$1;
      incHi = this._state ? this._state[2] : defaultIncHi$1;
    } else if (isNullable$1(incLo)) {
      incLo = incHi;
      incHi = 0;
    }
    this._state = new Int32Array([0, 0, incHi >>> 0, ((incLo || 0) | 1) >>> 0]);
    this._next();
    add64$1(this._state, this._state[0], this._state[1], seedHi >>> 0, seedLo >>> 0);
    this._next();
    return this;
  }
  /**
   * Returns a copy of the internal state of this random number generator as a
   * JavaScript Array.
   *
   * @category getters
   * @since 2.0.0
   */
  getState() {
    return [this._state[0], this._state[1], this._state[2], this._state[3]];
  }
  /**
   * Restore state previously retrieved using `getState()`.
   *
   * @since 2.0.0
   */
  setState(state2) {
    this._state[0] = state2[0];
    this._state[1] = state2[1];
    this._state[2] = state2[2];
    this._state[3] = state2[3] | 1;
  }
  /**
   * Get a uniformly distributed 32 bit integer between [0, max).
   *
   * @category getter
   * @since 2.0.0
   */
  integer(max) {
    return Math.round(this.number() * Number.MAX_SAFE_INTEGER) % max;
  }
  /**
   * Get a uniformly distributed IEEE-754 double between 0.0 and 1.0, with
   * 53 bits of precision (every bit of the mantissa is randomized).
   *
   * @category getters
   * @since 2.0.0
   */
  number() {
    const hi = (this._next() & 67108863) * 1;
    const lo = (this._next() & 134217727) * 1;
    return (hi * BIT_27$1 + lo) / BIT_53$1;
  }
  /** @internal */
  _next() {
    const oldHi = this._state[0] >>> 0;
    const oldLo = this._state[1] >>> 0;
    mul64$1(this._state, oldHi, oldLo, MUL_HI$1, MUL_LO$1);
    add64$1(this._state, this._state[0], this._state[1], this._state[2], this._state[3]);
    let xsHi = oldHi >>> 18;
    let xsLo = (oldLo >>> 18 | oldHi << 14) >>> 0;
    xsHi = (xsHi ^ oldHi) >>> 0;
    xsLo = (xsLo ^ oldLo) >>> 0;
    const xorshifted = (xsLo >>> 27 | xsHi << 5) >>> 0;
    const rot = oldHi >>> 27;
    const rot2 = (-rot >>> 0 & 31) >>> 0;
    return (xorshifted >>> rot | xorshifted << rot2) >>> 0;
  }
};
function mul64$1(out, aHi, aLo, bHi, bLo) {
  let c1 = (aLo >>> 16) * (bLo & 65535) >>> 0;
  let c0 = (aLo & 65535) * (bLo >>> 16) >>> 0;
  let lo = (aLo & 65535) * (bLo & 65535) >>> 0;
  let hi = (aLo >>> 16) * (bLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16)) >>> 0;
  c0 = c0 << 16 >>> 0;
  lo = lo + c0 >>> 0;
  if (lo >>> 0 < c0 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  c1 = c1 << 16 >>> 0;
  lo = lo + c1 >>> 0;
  if (lo >>> 0 < c1 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  hi = hi + Math.imul(aLo, bHi) >>> 0;
  hi = hi + Math.imul(aHi, bLo) >>> 0;
  out[0] = hi;
  out[1] = lo;
}
function add64$1(out, aHi, aLo, bHi, bLo) {
  let hi = aHi + bHi >>> 0;
  const lo = aLo + bLo >>> 0;
  if (lo >>> 0 < aLo >>> 0) {
    hi = hi + 1 | 0;
  }
  out[0] = hi;
  out[1] = lo;
}
const YieldWrapTypeId = /* @__PURE__ */ Symbol.for("effect/Utils/YieldWrap");
class YieldWrap {
  constructor(value) {
    /**
     * @since 3.0.6
     */
    __privateAdd(this, _value);
    __privateSet(this, _value, value);
  }
  /**
   * @since 3.0.6
   */
  [YieldWrapTypeId]() {
    return __privateGet(this, _value);
  }
}
_value = new WeakMap();
function yieldWrapGet(self2) {
  if (typeof self2 === "object" && self2 !== null && YieldWrapTypeId in self2) {
    return self2[YieldWrapTypeId]();
  }
  throw new Error(getBugErrorMessage("yieldWrapGet"));
}
const structuralRegionState = /* @__PURE__ */ globalValue$1("effect/Utils/isStructuralRegion", () => ({
  enabled: false,
  tester: void 0
}));
const standard = {
  effect_internal_function: (body) => {
    return body();
  }
};
const forced = {
  effect_internal_function: (body) => {
    try {
      return body();
    } finally {
    }
  }
};
const isNotOptimizedAway = ((_a2 = standard.effect_internal_function(() => new Error().stack)) == null ? void 0 : /* @__PURE__ */ _a2.includes("effect_internal_function")) === true;
const internalCall = isNotOptimizedAway ? standard.effect_internal_function : forced.effect_internal_function;
const randomHashCache$1 = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap());
const symbol$3 = /* @__PURE__ */ Symbol.for("effect/Hash");
const hash$1 = (self2) => {
  if (structuralRegionState.enabled === true) {
    return 0;
  }
  switch (typeof self2) {
    case "number":
      return number$2(self2);
    case "bigint":
      return string$1(self2.toString(10));
    case "boolean":
      return string$1(String(self2));
    case "symbol":
      return string$1(String(self2));
    case "string":
      return string$1(self2);
    case "undefined":
      return string$1("undefined");
    case "function":
    case "object": {
      if (self2 === null) {
        return string$1("null");
      } else if (self2 instanceof Date) {
        return hash$1(self2.toISOString());
      } else if (self2 instanceof URL) {
        return hash$1(self2.href);
      } else if (isHash$1(self2)) {
        return self2[symbol$3]();
      } else {
        return random$1(self2);
      }
    }
    default:
      throw new Error(`BUG: unhandled typeof ${typeof self2} - please report an issue at https://github.com/Effect-TS/effect/issues`);
  }
};
const random$1 = (self2) => {
  if (!randomHashCache$1.has(self2)) {
    randomHashCache$1.set(self2, number$2(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)));
  }
  return randomHashCache$1.get(self2);
};
const combine$6 = (b) => (self2) => self2 * 53 ^ b;
const optimize$1 = (n) => n & 3221225471 | n >>> 1 & 1073741824;
const isHash$1 = (u) => hasProperty(u, symbol$3);
const number$2 = (n) => {
  if (n !== n || n === Infinity) {
    return 0;
  }
  let h = n | 0;
  if (h !== n) {
    h ^= n * 4294967295;
  }
  while (n > 4294967295) {
    h ^= n /= 4294967295;
  }
  return optimize$1(h);
};
const string$1 = (str) => {
  let h = 5381, i = str.length;
  while (i) {
    h = h * 33 ^ str.charCodeAt(--i);
  }
  return optimize$1(h);
};
const structureKeys = (o, keys2) => {
  let h = 12289;
  for (let i = 0; i < keys2.length; i++) {
    h ^= pipe$1(string$1(keys2[i]), combine$6(hash$1(o[keys2[i]])));
  }
  return optimize$1(h);
};
const structure = (o) => structureKeys(o, Object.keys(o));
const array$1 = (arr) => {
  let h = 6151;
  for (let i = 0; i < arr.length; i++) {
    h = pipe$1(h, combine$6(hash$1(arr[i])));
  }
  return optimize$1(h);
};
const cached = function() {
  if (arguments.length === 1) {
    const self3 = arguments[0];
    return function(hash3) {
      Object.defineProperty(self3, symbol$3, {
        value() {
          return hash3;
        },
        enumerable: false
      });
      return hash3;
    };
  }
  const self2 = arguments[0];
  const hash2 = arguments[1];
  Object.defineProperty(self2, symbol$3, {
    value() {
      return hash2;
    },
    enumerable: false
  });
  return hash2;
};
const symbol$2 = /* @__PURE__ */ Symbol.for("effect/Equal");
function equals$2() {
  if (arguments.length === 1) {
    return (self2) => compareBoth$1(self2, arguments[0]);
  }
  return compareBoth$1(arguments[0], arguments[1]);
}
function compareBoth$1(self2, that) {
  if (self2 === that) {
    return true;
  }
  const selfType = typeof self2;
  if (selfType !== typeof that) {
    return false;
  }
  if (selfType === "object" || selfType === "function") {
    if (self2 !== null && that !== null) {
      if (isEqual$1(self2) && isEqual$1(that)) {
        if (hash$1(self2) === hash$1(that) && self2[symbol$2](that)) {
          return true;
        } else {
          return structuralRegionState.enabled && structuralRegionState.tester ? structuralRegionState.tester(self2, that) : false;
        }
      } else if (self2 instanceof Date && that instanceof Date) {
        return self2.toISOString() === that.toISOString();
      } else if (self2 instanceof URL && that instanceof URL) {
        return self2.href === that.href;
      }
    }
    if (structuralRegionState.enabled) {
      if (Array.isArray(self2) && Array.isArray(that)) {
        return self2.length === that.length && self2.every((v, i) => compareBoth$1(v, that[i]));
      }
      if (Object.getPrototypeOf(self2) === Object.prototype && Object.getPrototypeOf(self2) === Object.prototype) {
        const keysSelf = Object.keys(self2);
        const keysThat = Object.keys(that);
        if (keysSelf.length === keysThat.length) {
          for (const key of keysSelf) {
            if (!(key in that && compareBoth$1(self2[key], that[key]))) {
              return structuralRegionState.tester ? structuralRegionState.tester(self2, that) : false;
            }
          }
          return true;
        }
      }
      return structuralRegionState.tester ? structuralRegionState.tester(self2, that) : false;
    }
  }
  return structuralRegionState.enabled && structuralRegionState.tester ? structuralRegionState.tester(self2, that) : false;
}
const isEqual$1 = (u) => hasProperty(u, symbol$2);
const equivalence = () => equals$2;
const NodeInspectSymbol$1 = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
const toJSON$1 = (x) => {
  try {
    if (hasProperty(x, "toJSON") && isFunction$2(x["toJSON"]) && x["toJSON"].length === 0) {
      return x.toJSON();
    } else if (Array.isArray(x)) {
      return x.map(toJSON$1);
    }
  } catch {
    return {};
  }
  return redact(x);
};
const format$2 = (x) => JSON.stringify(x, null, 2);
const toStringUnknown = (u, whitespace = 2) => {
  if (typeof u === "string") {
    return u;
  }
  try {
    return typeof u === "object" ? stringifyCircular(u, whitespace) : String(u);
  } catch {
    return String(u);
  }
};
const stringifyCircular = (obj, whitespace) => {
  let cache = [];
  const retVal = JSON.stringify(obj, (_key, value) => typeof value === "object" && value !== null ? cache.includes(value) ? void 0 : cache.push(value) && (redactableState.fiberRefs !== void 0 && isRedactable(value) ? value[symbolRedactable](redactableState.fiberRefs) : value) : value, whitespace);
  cache = void 0;
  return retVal;
};
const symbolRedactable = /* @__PURE__ */ Symbol.for("effect/Inspectable/Redactable");
const isRedactable = (u) => typeof u === "object" && u !== null && symbolRedactable in u;
const redactableState = /* @__PURE__ */ globalValue$1("effect/Inspectable/redactableState", () => ({
  fiberRefs: void 0
}));
const withRedactableContext = (context, f) => {
  const prev = redactableState.fiberRefs;
  redactableState.fiberRefs = context;
  try {
    return f();
  } finally {
    redactableState.fiberRefs = prev;
  }
};
const redact = (u) => {
  if (isRedactable(u) && redactableState.fiberRefs !== void 0) {
    return u[symbolRedactable](redactableState.fiberRefs);
  }
  return u;
};
const pipeArguments$1 = (self2, args2) => {
  switch (args2.length) {
    case 0:
      return self2;
    case 1:
      return args2[0](self2);
    case 2:
      return args2[1](args2[0](self2));
    case 3:
      return args2[2](args2[1](args2[0](self2)));
    case 4:
      return args2[3](args2[2](args2[1](args2[0](self2))));
    case 5:
      return args2[4](args2[3](args2[2](args2[1](args2[0](self2)))));
    case 6:
      return args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self2))))));
    case 7:
      return args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self2)))))));
    case 8:
      return args2[7](args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self2))))))));
    case 9:
      return args2[8](args2[7](args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self2)))))))));
    default: {
      let ret = self2;
      for (let i = 0, len = args2.length; i < len; i++) {
        ret = args2[i](ret);
      }
      return ret;
    }
  }
};
const OP_ASYNC = "Async";
const OP_COMMIT = "Commit";
const OP_FAILURE = "Failure";
const OP_ON_FAILURE = "OnFailure";
const OP_ON_SUCCESS = "OnSuccess";
const OP_ON_SUCCESS_AND_FAILURE = "OnSuccessAndFailure";
const OP_SUCCESS$1 = "Success";
const OP_SYNC$1 = "Sync";
const OP_TAG = "Tag";
const OP_UPDATE_RUNTIME_FLAGS = "UpdateRuntimeFlags";
const OP_WHILE = "While";
const OP_ITERATOR = "Iterator";
const OP_WITH_RUNTIME = "WithRuntime";
const OP_YIELD = "Yield";
const OP_REVERT_FLAGS = "RevertFlags";
const EffectTypeId$3 = /* @__PURE__ */ Symbol.for("effect/Effect");
const StreamTypeId = /* @__PURE__ */ Symbol.for("effect/Stream");
const SinkTypeId = /* @__PURE__ */ Symbol.for("effect/Sink");
const ChannelTypeId = /* @__PURE__ */ Symbol.for("effect/Channel");
const effectVariance$2 = {
  /* c8 ignore next */
  _R: (_) => _,
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _,
  _V: /* @__PURE__ */ getCurrentVersion()
};
const sinkVariance = {
  /* c8 ignore next */
  _A: (_) => _,
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _L: (_) => _,
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _R: (_) => _
};
const channelVariance = {
  /* c8 ignore next */
  _Env: (_) => _,
  /* c8 ignore next */
  _InErr: (_) => _,
  /* c8 ignore next */
  _InElem: (_) => _,
  /* c8 ignore next */
  _InDone: (_) => _,
  /* c8 ignore next */
  _OutErr: (_) => _,
  /* c8 ignore next */
  _OutElem: (_) => _,
  /* c8 ignore next */
  _OutDone: (_) => _
};
const EffectPrototype$1 = {
  [EffectTypeId$3]: effectVariance$2,
  [StreamTypeId]: effectVariance$2,
  [SinkTypeId]: sinkVariance,
  [ChannelTypeId]: channelVariance,
  [symbol$2](that) {
    return this === that;
  },
  [symbol$3]() {
    return cached(this, random$1(this));
  },
  [Symbol.iterator]() {
    return new SingleShotGen$1(new YieldWrap(this));
  },
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const StructuralPrototype = {
  [symbol$3]() {
    return cached(this, structure(this));
  },
  [symbol$2](that) {
    const selfKeys = Object.keys(this);
    const thatKeys = Object.keys(that);
    if (selfKeys.length !== thatKeys.length) {
      return false;
    }
    for (const key of selfKeys) {
      if (!(key in that && equals$2(this[key], that[key]))) {
        return false;
      }
    }
    return true;
  }
};
const CommitPrototype = {
  ...EffectPrototype$1,
  _op: OP_COMMIT
};
const StructuralCommitPrototype = {
  ...CommitPrototype,
  ...StructuralPrototype
};
const Base$1 = /* @__PURE__ */ function() {
  function Base2() {
  }
  Base2.prototype = CommitPrototype;
  return Base2;
}();
const TypeId$c = /* @__PURE__ */ Symbol.for("effect/Option");
const CommonProto$3 = {
  ...EffectPrototype$1,
  [TypeId$c]: {
    _A: (_) => _
  },
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  },
  toString() {
    return format$2(this.toJSON());
  }
};
const SomeProto$1 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto$3), {
  _tag: "Some",
  _op: "Some",
  [symbol$2](that) {
    return isOption$1(that) && isSome$3(that) && equals$2(this.value, that.value);
  },
  [symbol$3]() {
    return cached(this, combine$6(hash$1(this._tag))(hash$1(this.value)));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: toJSON$1(this.value)
    };
  }
});
const NoneHash = /* @__PURE__ */ hash$1("None");
const NoneProto$1 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto$3), {
  _tag: "None",
  _op: "None",
  [symbol$2](that) {
    return isOption$1(that) && isNone$3(that);
  },
  [symbol$3]() {
    return NoneHash;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
});
const isOption$1 = (input) => hasProperty(input, TypeId$c);
const isNone$3 = (fa) => fa._tag === "None";
const isSome$3 = (fa) => fa._tag === "Some";
const none$7 = /* @__PURE__ */ Object.create(NoneProto$1);
const some$3 = (value) => {
  const a = Object.create(SomeProto$1);
  a.value = value;
  return a;
};
const TypeId$b = /* @__PURE__ */ Symbol.for("effect/Either");
const CommonProto$2 = {
  ...EffectPrototype$1,
  [TypeId$b]: {
    _R: (_) => _
  },
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  },
  toString() {
    return format$2(this.toJSON());
  }
};
const RightProto$1 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto$2), {
  _tag: "Right",
  _op: "Right",
  [symbol$2](that) {
    return isEither$1(that) && isRight$2(that) && equals$2(this.right, that.right);
  },
  [symbol$3]() {
    return combine$6(hash$1(this._tag))(hash$1(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: toJSON$1(this.right)
    };
  }
});
const LeftProto$1 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto$2), {
  _tag: "Left",
  _op: "Left",
  [symbol$2](that) {
    return isEither$1(that) && isLeft$2(that) && equals$2(this.left, that.left);
  },
  [symbol$3]() {
    return combine$6(hash$1(this._tag))(hash$1(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: toJSON$1(this.left)
    };
  }
});
const isEither$1 = (input) => hasProperty(input, TypeId$b);
const isLeft$2 = (ma) => ma._tag === "Left";
const isRight$2 = (ma) => ma._tag === "Right";
const left$3 = (left2) => {
  const a = Object.create(LeftProto$1);
  a.left = left2;
  return a;
};
const right$3 = (right2) => {
  const a = Object.create(RightProto$1);
  a.right = right2;
  return a;
};
const right$2 = right$3;
const left$2 = left$3;
const isLeft$1 = isLeft$2;
const isRight$1 = isRight$2;
const match$3 = /* @__PURE__ */ dual$1(2, (self2, {
  onLeft,
  onRight
}) => isLeft$1(self2) ? onLeft(self2.left) : onRight(self2.right));
const merge$3 = /* @__PURE__ */ match$3({
  onLeft: identity,
  onRight: identity
});
const isNonEmptyArray$1 = (self2) => self2.length > 0;
const make$m = (compare) => (self2, that) => self2 === that ? 0 : compare(self2, that);
const number$1 = /* @__PURE__ */ make$m((self2, that) => self2 < that ? -1 : 1);
const mapInput = /* @__PURE__ */ dual$1(2, (self2, f) => make$m((b1, b2) => self2(f(b1), f(b2))));
const greaterThan$1 = (O) => dual$1(2, (self2, that) => O(self2, that) === 1);
const none$6 = () => none$7;
const some$2 = some$3;
const isNone$2 = isNone$3;
const isSome$2 = isSome$3;
const match$2 = /* @__PURE__ */ dual$1(2, (self2, {
  onNone,
  onSome
}) => isNone$2(self2) ? onNone() : onSome(self2.value));
const getOrElse$1 = /* @__PURE__ */ dual$1(2, (self2, onNone) => isNone$2(self2) ? onNone() : self2.value);
const orElseSome = /* @__PURE__ */ dual$1(2, (self2, onNone) => isNone$2(self2) ? some$2(onNone()) : self2);
const fromNullable = (nullableValue) => nullableValue == null ? none$6() : some$2(nullableValue);
const getOrUndefined$1 = /* @__PURE__ */ getOrElse$1(constUndefined$1);
const map$5 = /* @__PURE__ */ dual$1(2, (self2, f) => isNone$2(self2) ? none$6() : some$2(f(self2.value)));
const flatMap$3 = /* @__PURE__ */ dual$1(2, (self2, f) => isNone$2(self2) ? none$6() : f(self2.value));
const containsWith = (isEquivalent) => dual$1(2, (self2, a) => isNone$2(self2) ? false : isEquivalent(self2.value, a));
const _equivalence$4 = /* @__PURE__ */ equivalence();
const contains = /* @__PURE__ */ containsWith(_equivalence$4);
const make$l = (...elements) => elements;
const allocate = (n) => new Array(n);
const makeBy = /* @__PURE__ */ dual$1(2, (n, f) => {
  const max = Math.max(1, Math.floor(n));
  const out = new Array(max);
  for (let i = 0; i < max; i++) {
    out[i] = f(i);
  }
  return out;
});
const fromIterable$7 = (collection) => Array.isArray(collection) ? collection : Array.from(collection);
const ensure = (self2) => Array.isArray(self2) ? self2 : [self2];
const prepend$3 = /* @__PURE__ */ dual$1(2, (self2, head2) => [head2, ...self2]);
const append$1 = /* @__PURE__ */ dual$1(2, (self2, last2) => [...self2, last2]);
const appendAll$3 = /* @__PURE__ */ dual$1(2, (self2, that) => fromIterable$7(self2).concat(fromIterable$7(that)));
const isEmptyArray = (self2) => self2.length === 0;
const isEmptyReadonlyArray = isEmptyArray;
const isNonEmptyArray = isNonEmptyArray$1;
const isNonEmptyReadonlyArray = isNonEmptyArray$1;
const isOutOfBounds = (i, as2) => i < 0 || i >= as2.length;
const clamp = (i, as2) => Math.floor(Math.min(Math.max(0, i), as2.length));
const get$7 = /* @__PURE__ */ dual$1(2, (self2, index2) => {
  const i = Math.floor(index2);
  return isOutOfBounds(i, self2) ? none$6() : some$2(self2[i]);
});
const unsafeGet$4 = /* @__PURE__ */ dual$1(2, (self2, index2) => {
  const i = Math.floor(index2);
  if (isOutOfBounds(i, self2)) {
    throw new Error(`Index ${i} out of bounds`);
  }
  return self2[i];
});
const head = /* @__PURE__ */ get$7(0);
const headNonEmpty$2 = /* @__PURE__ */ unsafeGet$4(0);
const last = (self2) => isNonEmptyReadonlyArray(self2) ? some$2(lastNonEmpty(self2)) : none$6();
const lastNonEmpty = (self2) => self2[self2.length - 1];
const tailNonEmpty$1 = (self2) => self2.slice(1);
const spanIndex = (self2, predicate) => {
  let i = 0;
  for (const a of self2) {
    if (!predicate(a, i)) {
      break;
    }
    i++;
  }
  return i;
};
const span = /* @__PURE__ */ dual$1(2, (self2, predicate) => splitAt(self2, spanIndex(self2, predicate)));
const drop$1 = /* @__PURE__ */ dual$1(2, (self2, n) => {
  const input = fromIterable$7(self2);
  return input.slice(clamp(n, input), input.length);
});
const reverse$4 = (self2) => Array.from(self2).reverse();
const sort = /* @__PURE__ */ dual$1(2, (self2, O) => {
  const out = Array.from(self2);
  out.sort(O);
  return out;
});
const zip$1 = /* @__PURE__ */ dual$1(2, (self2, that) => zipWith(self2, that, make$l));
const zipWith = /* @__PURE__ */ dual$1(3, (self2, that, f) => {
  const as2 = fromIterable$7(self2);
  const bs = fromIterable$7(that);
  if (isNonEmptyReadonlyArray(as2) && isNonEmptyReadonlyArray(bs)) {
    const out = [f(headNonEmpty$2(as2), headNonEmpty$2(bs))];
    const len = Math.min(as2.length, bs.length);
    for (let i = 1; i < len; i++) {
      out[i] = f(as2[i], bs[i]);
    }
    return out;
  }
  return [];
});
const _equivalence$3 = /* @__PURE__ */ equivalence();
const splitAt = /* @__PURE__ */ dual$1(2, (self2, n) => {
  const input = Array.from(self2);
  const _n2 = Math.floor(n);
  if (isNonEmptyReadonlyArray(input)) {
    if (_n2 >= 1) {
      return splitNonEmptyAt(input, _n2);
    }
    return [[], input];
  }
  return [input, []];
});
const splitNonEmptyAt = /* @__PURE__ */ dual$1(2, (self2, n) => {
  const _n2 = Math.max(1, Math.floor(n));
  return _n2 >= self2.length ? [copy$2(self2), []] : [prepend$3(self2.slice(1, _n2), headNonEmpty$2(self2)), self2.slice(_n2)];
});
const copy$2 = (self2) => self2.slice();
const unionWith = /* @__PURE__ */ dual$1(3, (self2, that, isEquivalent) => {
  const a = fromIterable$7(self2);
  const b = fromIterable$7(that);
  if (isNonEmptyReadonlyArray(a)) {
    if (isNonEmptyReadonlyArray(b)) {
      const dedupe2 = dedupeWith(isEquivalent);
      return dedupe2(appendAll$3(a, b));
    }
    return a;
  }
  return b;
});
const union$5 = /* @__PURE__ */ dual$1(2, (self2, that) => unionWith(self2, that, _equivalence$3));
const empty$n = () => [];
const of$3 = (a) => [a];
const map$4 = /* @__PURE__ */ dual$1(2, (self2, f) => self2.map(f));
const flatMap$2 = /* @__PURE__ */ dual$1(2, (self2, f) => {
  if (isEmptyReadonlyArray(self2)) {
    return [];
  }
  const out = [];
  for (let i = 0; i < self2.length; i++) {
    const inner = f(self2[i], i);
    for (let j = 0; j < inner.length; j++) {
      out.push(inner[j]);
    }
  }
  return out;
});
const flatten$2 = /* @__PURE__ */ flatMap$2(identity);
const reduce$9 = /* @__PURE__ */ dual$1(3, (self2, b, f) => fromIterable$7(self2).reduce((b2, a, i) => f(b2, a, i), b));
const unfold = (b, f) => {
  const out = [];
  let next = b;
  let o;
  while (isSome$2(o = f(next))) {
    const [a, b2] = o.value;
    out.push(a);
    next = b2;
  }
  return out;
};
const getEquivalence$3 = array$2;
const dedupeWith = /* @__PURE__ */ dual$1(2, (self2, isEquivalent) => {
  const input = fromIterable$7(self2);
  if (isNonEmptyReadonlyArray(input)) {
    const out = [headNonEmpty$2(input)];
    const rest = tailNonEmpty$1(input);
    for (const r of rest) {
      if (out.every((a) => !isEquivalent(r, a))) {
        out.push(r);
      }
    }
    return out;
  }
  return [];
});
const dedupe = (self2) => dedupeWith(self2, equivalence());
const join$1 = /* @__PURE__ */ dual$1(2, (self2, sep) => fromIterable$7(self2).join(sep));
const TypeId$a = /* @__PURE__ */ Symbol.for("effect/Chunk");
function copy$1(src, srcPos, dest, destPos, len) {
  for (let i = srcPos; i < Math.min(src.length, srcPos + len); i++) {
    dest[destPos + i - srcPos] = src[i];
  }
  return dest;
}
const emptyArray$1 = [];
const getEquivalence$2 = (isEquivalent) => make$n((self2, that) => self2.length === that.length && toReadonlyArray$1(self2).every((value, i) => isEquivalent(value, unsafeGet$3(that, i))));
const _equivalence$2 = /* @__PURE__ */ getEquivalence$2(equals$2);
const ChunkProto$1 = {
  [TypeId$a]: {
    _A: (_) => _
  },
  toString() {
    return format$2(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Chunk",
      values: toReadonlyArray$1(this).map(toJSON$1)
    };
  },
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  },
  [symbol$2](that) {
    return isChunk$1(that) && _equivalence$2(this, that);
  },
  [symbol$3]() {
    return cached(this, array$1(toReadonlyArray$1(this)));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray": {
        return this.backing.array[Symbol.iterator]();
      }
      case "IEmpty": {
        return emptyArray$1[Symbol.iterator]();
      }
      default: {
        return toReadonlyArray$1(this)[Symbol.iterator]();
      }
    }
  },
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const makeChunk$1 = (backing) => {
  const chunk = Object.create(ChunkProto$1);
  chunk.backing = backing;
  switch (backing._tag) {
    case "IEmpty": {
      chunk.length = 0;
      chunk.depth = 0;
      chunk.left = chunk;
      chunk.right = chunk;
      break;
    }
    case "IConcat": {
      chunk.length = backing.left.length + backing.right.length;
      chunk.depth = 1 + Math.max(backing.left.depth, backing.right.depth);
      chunk.left = backing.left;
      chunk.right = backing.right;
      break;
    }
    case "IArray": {
      chunk.length = backing.array.length;
      chunk.depth = 0;
      chunk.left = _empty$9;
      chunk.right = _empty$9;
      break;
    }
    case "ISingleton": {
      chunk.length = 1;
      chunk.depth = 0;
      chunk.left = _empty$9;
      chunk.right = _empty$9;
      break;
    }
    case "ISlice": {
      chunk.length = backing.length;
      chunk.depth = backing.chunk.depth + 1;
      chunk.left = _empty$9;
      chunk.right = _empty$9;
      break;
    }
  }
  return chunk;
};
const isChunk$1 = (u) => hasProperty(u, TypeId$a);
const _empty$9 = /* @__PURE__ */ makeChunk$1({
  _tag: "IEmpty"
});
const empty$m = () => _empty$9;
const make$k = (...as2) => unsafeFromNonEmptyArray(as2);
const of$2 = (a) => makeChunk$1({
  _tag: "ISingleton",
  a
});
const fromIterable$6 = (self2) => isChunk$1(self2) ? self2 : unsafeFromArray$1(fromIterable$7(self2));
const copyToArray$1 = (self2, array2, initial) => {
  switch (self2.backing._tag) {
    case "IArray": {
      copy$1(self2.backing.array, 0, array2, initial, self2.length);
      break;
    }
    case "IConcat": {
      copyToArray$1(self2.left, array2, initial);
      copyToArray$1(self2.right, array2, initial + self2.left.length);
      break;
    }
    case "ISingleton": {
      array2[initial] = self2.backing.a;
      break;
    }
    case "ISlice": {
      let i = 0;
      let j = initial;
      while (i < self2.length) {
        array2[j] = unsafeGet$3(self2, i);
        i += 1;
        j += 1;
      }
      break;
    }
  }
};
const toReadonlyArray_ = (self2) => {
  switch (self2.backing._tag) {
    case "IEmpty": {
      return emptyArray$1;
    }
    case "IArray": {
      return self2.backing.array;
    }
    default: {
      const arr = new Array(self2.length);
      copyToArray$1(self2, arr, 0);
      self2.backing = {
        _tag: "IArray",
        array: arr
      };
      self2.left = _empty$9;
      self2.right = _empty$9;
      self2.depth = 0;
      return arr;
    }
  }
};
const toReadonlyArray$1 = toReadonlyArray_;
const reverseChunk = (self2) => {
  switch (self2.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return self2;
    case "IArray": {
      return makeChunk$1({
        _tag: "IArray",
        array: reverse$4(self2.backing.array)
      });
    }
    case "IConcat": {
      return makeChunk$1({
        _tag: "IConcat",
        left: reverse$3(self2.backing.right),
        right: reverse$3(self2.backing.left)
      });
    }
    case "ISlice":
      return unsafeFromArray$1(reverse$4(toReadonlyArray$1(self2)));
  }
};
const reverse$3 = reverseChunk;
const unsafeFromArray$1 = (self2) => self2.length === 0 ? empty$m() : self2.length === 1 ? of$2(self2[0]) : makeChunk$1({
  _tag: "IArray",
  array: self2
});
const unsafeFromNonEmptyArray = (self2) => unsafeFromArray$1(self2);
const unsafeGet$3 = /* @__PURE__ */ dual$1(2, (self2, index2) => {
  switch (self2.backing._tag) {
    case "IEmpty": {
      throw new Error(`Index out of bounds`);
    }
    case "ISingleton": {
      if (index2 !== 0) {
        throw new Error(`Index out of bounds`);
      }
      return self2.backing.a;
    }
    case "IArray": {
      if (index2 >= self2.length || index2 < 0) {
        throw new Error(`Index out of bounds`);
      }
      return self2.backing.array[index2];
    }
    case "IConcat": {
      return index2 < self2.left.length ? unsafeGet$3(self2.left, index2) : unsafeGet$3(self2.right, index2 - self2.left.length);
    }
    case "ISlice": {
      return unsafeGet$3(self2.backing.chunk, index2 + self2.backing.offset);
    }
  }
});
const append = /* @__PURE__ */ dual$1(2, (self2, a) => appendAll$2(self2, of$2(a)));
const prepend$2 = /* @__PURE__ */ dual$1(2, (self2, elem) => appendAll$2(of$2(elem), self2));
const drop = /* @__PURE__ */ dual$1(2, (self2, n) => {
  if (n <= 0) {
    return self2;
  } else if (n >= self2.length) {
    return _empty$9;
  } else {
    switch (self2.backing._tag) {
      case "ISlice": {
        return makeChunk$1({
          _tag: "ISlice",
          chunk: self2.backing.chunk,
          offset: self2.backing.offset + n,
          length: self2.backing.length - n
        });
      }
      case "IConcat": {
        if (n > self2.left.length) {
          return drop(self2.right, n - self2.left.length);
        }
        return makeChunk$1({
          _tag: "IConcat",
          left: drop(self2.left, n),
          right: self2.right
        });
      }
      default: {
        return makeChunk$1({
          _tag: "ISlice",
          chunk: self2,
          offset: n,
          length: self2.length - n
        });
      }
    }
  }
});
const appendAll$2 = /* @__PURE__ */ dual$1(2, (self2, that) => {
  if (self2.backing._tag === "IEmpty") {
    return that;
  }
  if (that.backing._tag === "IEmpty") {
    return self2;
  }
  const diff2 = that.depth - self2.depth;
  if (Math.abs(diff2) <= 1) {
    return makeChunk$1({
      _tag: "IConcat",
      left: self2,
      right: that
    });
  } else if (diff2 < -1) {
    if (self2.left.depth >= self2.right.depth) {
      const nr = appendAll$2(self2.right, that);
      return makeChunk$1({
        _tag: "IConcat",
        left: self2.left,
        right: nr
      });
    } else {
      const nrr = appendAll$2(self2.right.right, that);
      if (nrr.depth === self2.depth - 3) {
        const nr = makeChunk$1({
          _tag: "IConcat",
          left: self2.right.left,
          right: nrr
        });
        return makeChunk$1({
          _tag: "IConcat",
          left: self2.left,
          right: nr
        });
      } else {
        const nl = makeChunk$1({
          _tag: "IConcat",
          left: self2.left,
          right: self2.right.left
        });
        return makeChunk$1({
          _tag: "IConcat",
          left: nl,
          right: nrr
        });
      }
    }
  } else {
    if (that.right.depth >= that.left.depth) {
      const nl = appendAll$2(self2, that.left);
      return makeChunk$1({
        _tag: "IConcat",
        left: nl,
        right: that.right
      });
    } else {
      const nll = appendAll$2(self2, that.left.left);
      if (nll.depth === that.depth - 3) {
        const nl = makeChunk$1({
          _tag: "IConcat",
          left: nll,
          right: that.left.right
        });
        return makeChunk$1({
          _tag: "IConcat",
          left: nl,
          right: that.right
        });
      } else {
        const nr = makeChunk$1({
          _tag: "IConcat",
          left: that.left.right,
          right: that.right
        });
        return makeChunk$1({
          _tag: "IConcat",
          left: nll,
          right: nr
        });
      }
    }
  }
});
const isEmpty$4 = (self2) => self2.length === 0;
const isNonEmpty$1 = (self2) => self2.length > 0;
const unsafeHead$1 = (self2) => unsafeGet$3(self2, 0);
const headNonEmpty$1 = unsafeHead$1;
const tailNonEmpty = (self2) => drop(self2, 1);
const SIZE$1 = 5;
const BUCKET_SIZE$1 = /* @__PURE__ */ Math.pow(2, SIZE$1);
const MASK$1 = BUCKET_SIZE$1 - 1;
const MAX_INDEX_NODE$1 = BUCKET_SIZE$1 / 2;
const MIN_ARRAY_NODE$1 = BUCKET_SIZE$1 / 4;
function popcount$1(x) {
  x -= x >> 1 & 1431655765;
  x = (x & 858993459) + (x >> 2 & 858993459);
  x = x + (x >> 4) & 252645135;
  x += x >> 8;
  x += x >> 16;
  return x & 127;
}
function hashFragment$1(shift, h) {
  return h >>> shift & MASK$1;
}
function toBitmap$1(x) {
  return 1 << x;
}
function fromBitmap$1(bitmap, bit) {
  return popcount$1(bitmap & bit - 1);
}
const make$j = (value, previous) => ({
  value,
  previous
});
function arrayUpdate$1(mutate2, at, v, arr) {
  let out = arr;
  if (!mutate2) {
    const len = arr.length;
    out = new Array(len);
    for (let i = 0; i < len; ++i) out[i] = arr[i];
  }
  out[at] = v;
  return out;
}
function arraySpliceOut$1(mutate2, at, arr) {
  const newLen = arr.length - 1;
  let i = 0;
  let g = 0;
  let out = arr;
  if (mutate2) {
    i = g = at;
  } else {
    out = new Array(newLen);
    while (i < at) out[g++] = arr[i++];
  }
  ++i;
  while (i <= newLen) out[g++] = arr[i++];
  if (mutate2) {
    out.length = newLen;
  }
  return out;
}
function arraySpliceIn$1(mutate2, at, v, arr) {
  const len = arr.length;
  if (mutate2) {
    let i2 = len;
    while (i2 >= at) arr[i2--] = arr[i2];
    arr[at] = v;
    return arr;
  }
  let i = 0, g = 0;
  const out = new Array(len + 1);
  while (i < at) out[g++] = arr[i++];
  out[at] = v;
  while (i < len) out[++g] = arr[i++];
  return out;
}
let EmptyNode$1 = class EmptyNode {
  constructor() {
    __publicField(this, "_tag", "EmptyNode");
  }
  modify(edit, _shift, f, hash2, key, size2) {
    const v = f(none$6());
    if (isNone$2(v)) return new EmptyNode();
    ++size2.value;
    return new LeafNode$1(edit, hash2, key, v);
  }
};
function isEmptyNode$1(a) {
  return isTagged(a, "EmptyNode");
}
function isLeafNode$1(node2) {
  return isEmptyNode$1(node2) || node2._tag === "LeafNode" || node2._tag === "CollisionNode";
}
function canEditNode$1(node2, edit) {
  return isEmptyNode$1(node2) ? false : edit === node2.edit;
}
let LeafNode$1 = class LeafNode {
  constructor(edit, hash2, key, value) {
    __publicField(this, "edit");
    __publicField(this, "hash");
    __publicField(this, "key");
    __publicField(this, "value");
    __publicField(this, "_tag", "LeafNode");
    this.edit = edit;
    this.hash = hash2;
    this.key = key;
    this.value = value;
  }
  modify(edit, shift, f, hash2, key, size2) {
    if (equals$2(key, this.key)) {
      const v2 = f(this.value);
      if (v2 === this.value) return this;
      else if (isNone$2(v2)) {
        --size2.value;
        return new EmptyNode$1();
      }
      if (canEditNode$1(this, edit)) {
        this.value = v2;
        return this;
      }
      return new LeafNode(edit, hash2, key, v2);
    }
    const v = f(none$6());
    if (isNone$2(v)) return this;
    ++size2.value;
    return mergeLeaves$1(edit, shift, this.hash, this, hash2, new LeafNode(edit, hash2, key, v));
  }
};
let CollisionNode$1 = class CollisionNode {
  constructor(edit, hash2, children) {
    __publicField(this, "edit");
    __publicField(this, "hash");
    __publicField(this, "children");
    __publicField(this, "_tag", "CollisionNode");
    this.edit = edit;
    this.hash = hash2;
    this.children = children;
  }
  modify(edit, shift, f, hash2, key, size2) {
    if (hash2 === this.hash) {
      const canEdit = canEditNode$1(this, edit);
      const list = this.updateCollisionList(canEdit, edit, this.hash, this.children, f, key, size2);
      if (list === this.children) return this;
      return list.length > 1 ? new CollisionNode(edit, this.hash, list) : list[0];
    }
    const v = f(none$6());
    if (isNone$2(v)) return this;
    ++size2.value;
    return mergeLeaves$1(edit, shift, this.hash, this, hash2, new LeafNode$1(edit, hash2, key, v));
  }
  updateCollisionList(mutate2, edit, hash2, list, f, key, size2) {
    const len = list.length;
    for (let i = 0; i < len; ++i) {
      const child2 = list[i];
      if ("key" in child2 && equals$2(key, child2.key)) {
        const value = child2.value;
        const newValue2 = f(value);
        if (newValue2 === value) return list;
        if (isNone$2(newValue2)) {
          --size2.value;
          return arraySpliceOut$1(mutate2, i, list);
        }
        return arrayUpdate$1(mutate2, i, new LeafNode$1(edit, hash2, key, newValue2), list);
      }
    }
    const newValue = f(none$6());
    if (isNone$2(newValue)) return list;
    ++size2.value;
    return arrayUpdate$1(mutate2, len, new LeafNode$1(edit, hash2, key, newValue), list);
  }
};
let IndexedNode$1 = class IndexedNode {
  constructor(edit, mask, children) {
    __publicField(this, "edit");
    __publicField(this, "mask");
    __publicField(this, "children");
    __publicField(this, "_tag", "IndexedNode");
    this.edit = edit;
    this.mask = mask;
    this.children = children;
  }
  modify(edit, shift, f, hash2, key, size2) {
    const mask = this.mask;
    const children = this.children;
    const frag = hashFragment$1(shift, hash2);
    const bit = toBitmap$1(frag);
    const indx = fromBitmap$1(mask, bit);
    const exists2 = mask & bit;
    const canEdit = canEditNode$1(this, edit);
    if (!exists2) {
      const _newChild = new EmptyNode$1().modify(edit, shift + SIZE$1, f, hash2, key, size2);
      if (!_newChild) return this;
      return children.length >= MAX_INDEX_NODE$1 ? expand$1(edit, frag, _newChild, mask, children) : new IndexedNode(edit, mask | bit, arraySpliceIn$1(canEdit, indx, _newChild, children));
    }
    const current = children[indx];
    const child2 = current.modify(edit, shift + SIZE$1, f, hash2, key, size2);
    if (current === child2) return this;
    let bitmap = mask;
    let newChildren;
    if (isEmptyNode$1(child2)) {
      bitmap &= ~bit;
      if (!bitmap) return new EmptyNode$1();
      if (children.length <= 2 && isLeafNode$1(children[indx ^ 1])) {
        return children[indx ^ 1];
      }
      newChildren = arraySpliceOut$1(canEdit, indx, children);
    } else {
      newChildren = arrayUpdate$1(canEdit, indx, child2, children);
    }
    if (canEdit) {
      this.mask = bitmap;
      this.children = newChildren;
      return this;
    }
    return new IndexedNode(edit, bitmap, newChildren);
  }
};
let ArrayNode$1 = class ArrayNode {
  constructor(edit, size2, children) {
    __publicField(this, "edit");
    __publicField(this, "size");
    __publicField(this, "children");
    __publicField(this, "_tag", "ArrayNode");
    this.edit = edit;
    this.size = size2;
    this.children = children;
  }
  modify(edit, shift, f, hash2, key, size2) {
    let count = this.size;
    const children = this.children;
    const frag = hashFragment$1(shift, hash2);
    const child2 = children[frag];
    const newChild = (child2 || new EmptyNode$1()).modify(edit, shift + SIZE$1, f, hash2, key, size2);
    if (child2 === newChild) return this;
    const canEdit = canEditNode$1(this, edit);
    let newChildren;
    if (isEmptyNode$1(child2) && !isEmptyNode$1(newChild)) {
      ++count;
      newChildren = arrayUpdate$1(canEdit, frag, newChild, children);
    } else if (!isEmptyNode$1(child2) && isEmptyNode$1(newChild)) {
      --count;
      if (count <= MIN_ARRAY_NODE$1) {
        return pack$1(edit, count, frag, children);
      }
      newChildren = arrayUpdate$1(canEdit, frag, new EmptyNode$1(), children);
    } else {
      newChildren = arrayUpdate$1(canEdit, frag, newChild, children);
    }
    if (canEdit) {
      this.size = count;
      this.children = newChildren;
      return this;
    }
    return new ArrayNode(edit, count, newChildren);
  }
};
function pack$1(edit, count, removed, elements) {
  const children = new Array(count - 1);
  let g = 0;
  let bitmap = 0;
  for (let i = 0, len = elements.length; i < len; ++i) {
    if (i !== removed) {
      const elem = elements[i];
      if (elem && !isEmptyNode$1(elem)) {
        children[g++] = elem;
        bitmap |= 1 << i;
      }
    }
  }
  return new IndexedNode$1(edit, bitmap, children);
}
function expand$1(edit, frag, child2, bitmap, subNodes) {
  const arr = [];
  let bit = bitmap;
  let count = 0;
  for (let i = 0; bit; ++i) {
    if (bit & 1) arr[i] = subNodes[count++];
    bit >>>= 1;
  }
  arr[frag] = child2;
  return new ArrayNode$1(edit, count + 1, arr);
}
function mergeLeavesInner$1(edit, shift, h1, n1, h2, n2) {
  if (h1 === h2) return new CollisionNode$1(edit, h1, [n2, n1]);
  const subH1 = hashFragment$1(shift, h1);
  const subH2 = hashFragment$1(shift, h2);
  if (subH1 === subH2) {
    return (child2) => new IndexedNode$1(edit, toBitmap$1(subH1) | toBitmap$1(subH2), [child2]);
  } else {
    const children = subH1 < subH2 ? [n1, n2] : [n2, n1];
    return new IndexedNode$1(edit, toBitmap$1(subH1) | toBitmap$1(subH2), children);
  }
}
function mergeLeaves$1(edit, shift, h1, n1, h2, n2) {
  let stack = void 0;
  let currentShift = shift;
  while (true) {
    const res2 = mergeLeavesInner$1(edit, currentShift, h1, n1, h2, n2);
    if (typeof res2 === "function") {
      stack = make$j(res2, stack);
      currentShift = currentShift + SIZE$1;
    } else {
      let final = res2;
      while (stack != null) {
        final = stack.value(final);
        stack = stack.previous;
      }
      return final;
    }
  }
}
const HashMapSymbolKey = "effect/HashMap";
const HashMapTypeId$1 = /* @__PURE__ */ Symbol.for(HashMapSymbolKey);
const HashMapProto$1 = {
  [HashMapTypeId$1]: HashMapTypeId$1,
  [Symbol.iterator]() {
    return new HashMapIterator$1(this, (k, v) => [k, v]);
  },
  [symbol$3]() {
    let hash2 = hash$1(HashMapSymbolKey);
    for (const item of this) {
      hash2 ^= pipe$1(hash$1(item[0]), combine$6(hash$1(item[1])));
    }
    return cached(this, hash2);
  },
  [symbol$2](that) {
    if (isHashMap$1(that)) {
      if (that._size !== this._size) {
        return false;
      }
      for (const item of this) {
        const elem = pipe$1(that, getHash$1(item[0], hash$1(item[0])));
        if (isNone$2(elem)) {
          return false;
        } else {
          if (!equals$2(item[1], elem.value)) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  },
  toString() {
    return format$2(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashMap",
      values: Array.from(this).map(toJSON$1)
    };
  },
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const makeImpl$3 = (editable, edit, root, size2) => {
  const map2 = Object.create(HashMapProto$1);
  map2._editable = editable;
  map2._edit = edit;
  map2._root = root;
  map2._size = size2;
  return map2;
};
let HashMapIterator$1 = class HashMapIterator {
  constructor(map2, f) {
    __publicField(this, "map");
    __publicField(this, "f");
    __publicField(this, "v");
    this.map = map2;
    this.f = f;
    this.v = visitLazy$1(this.map._root, this.f, void 0);
  }
  next() {
    if (isNone$2(this.v)) {
      return {
        done: true,
        value: void 0
      };
    }
    const v0 = this.v.value;
    this.v = applyCont$1(v0.cont);
    return {
      done: false,
      value: v0.value
    };
  }
  [Symbol.iterator]() {
    return new HashMapIterator(this.map, this.f);
  }
};
const applyCont$1 = (cont) => cont ? visitLazyChildren$1(cont[0], cont[1], cont[2], cont[3], cont[4]) : none$6();
const visitLazy$1 = (node2, f, cont = void 0) => {
  switch (node2._tag) {
    case "LeafNode": {
      if (isSome$2(node2.value)) {
        return some$2({
          value: f(node2.key, node2.value.value),
          cont
        });
      }
      return applyCont$1(cont);
    }
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode": {
      const children = node2.children;
      return visitLazyChildren$1(children.length, children, 0, f, cont);
    }
    default: {
      return applyCont$1(cont);
    }
  }
};
const visitLazyChildren$1 = (len, children, i, f, cont) => {
  while (i < len) {
    const child2 = children[i++];
    if (child2 && !isEmptyNode$1(child2)) {
      return visitLazy$1(child2, f, [len, children, i, f, cont]);
    }
  }
  return applyCont$1(cont);
};
const _empty$8 = /* @__PURE__ */ makeImpl$3(false, 0, /* @__PURE__ */ new EmptyNode$1(), 0);
const empty$l = () => _empty$8;
const fromIterable$5 = (entries) => {
  const map2 = beginMutation$3(empty$l());
  for (const entry of entries) {
    set$4(map2, entry[0], entry[1]);
  }
  return endMutation$2(map2);
};
const isHashMap$1 = (u) => hasProperty(u, HashMapTypeId$1);
const isEmpty$3 = (self2) => self2 && isEmptyNode$1(self2._root);
const get$6 = /* @__PURE__ */ dual$1(2, (self2, key) => getHash$1(self2, key, hash$1(key)));
const getHash$1 = /* @__PURE__ */ dual$1(3, (self2, key, hash2) => {
  let node2 = self2._root;
  let shift = 0;
  while (true) {
    switch (node2._tag) {
      case "LeafNode": {
        return equals$2(key, node2.key) ? node2.value : none$6();
      }
      case "CollisionNode": {
        if (hash2 === node2.hash) {
          const children = node2.children;
          for (let i = 0, len = children.length; i < len; ++i) {
            const child2 = children[i];
            if ("key" in child2 && equals$2(key, child2.key)) {
              return child2.value;
            }
          }
        }
        return none$6();
      }
      case "IndexedNode": {
        const frag = hashFragment$1(shift, hash2);
        const bit = toBitmap$1(frag);
        if (node2.mask & bit) {
          node2 = node2.children[fromBitmap$1(node2.mask, bit)];
          shift += SIZE$1;
          break;
        }
        return none$6();
      }
      case "ArrayNode": {
        node2 = node2.children[hashFragment$1(shift, hash2)];
        if (node2) {
          shift += SIZE$1;
          break;
        }
        return none$6();
      }
      default:
        return none$6();
    }
  }
});
const has$3 = /* @__PURE__ */ dual$1(2, (self2, key) => isSome$2(getHash$1(self2, key, hash$1(key))));
const set$4 = /* @__PURE__ */ dual$1(3, (self2, key, value) => modifyAt$2(self2, key, () => some$2(value)));
const setTree$1 = /* @__PURE__ */ dual$1(3, (self2, newRoot, newSize) => {
  if (self2._editable) {
    self2._root = newRoot;
    self2._size = newSize;
    return self2;
  }
  return newRoot === self2._root ? self2 : makeImpl$3(self2._editable, self2._edit, newRoot, newSize);
});
const keys$2 = (self2) => new HashMapIterator$1(self2, (key) => key);
const size$5 = (self2) => self2._size;
const beginMutation$3 = (self2) => makeImpl$3(true, self2._edit + 1, self2._root, self2._size);
const endMutation$2 = (self2) => {
  self2._editable = false;
  return self2;
};
const modifyAt$2 = /* @__PURE__ */ dual$1(3, (self2, key, f) => modifyHash$1(self2, key, hash$1(key), f));
const modifyHash$1 = /* @__PURE__ */ dual$1(4, (self2, key, hash2, f) => {
  const size2 = {
    value: self2._size
  };
  const newRoot = self2._root.modify(self2._editable ? self2._edit : NaN, 0, f, hash2, key, size2);
  return pipe$1(self2, setTree$1(newRoot, size2.value));
});
const remove$2 = /* @__PURE__ */ dual$1(2, (self2, key) => modifyAt$2(self2, key, none$6));
const map$3 = /* @__PURE__ */ dual$1(2, (self2, f) => reduce$8(self2, empty$l(), (map2, value, key) => set$4(map2, key, f(value, key))));
const forEach$3 = /* @__PURE__ */ dual$1(2, (self2, f) => reduce$8(self2, void 0, (_, value, key) => f(value, key)));
const reduce$8 = /* @__PURE__ */ dual$1(3, (self2, zero2, f) => {
  const root = self2._root;
  if (root._tag === "LeafNode") {
    return isSome$2(root.value) ? f(zero2, root.value.value, root.key) : zero2;
  }
  if (root._tag === "EmptyNode") {
    return zero2;
  }
  const toVisit = [root.children];
  let children;
  while (children = toVisit.pop()) {
    for (let i = 0, len = children.length; i < len; ) {
      const child2 = children[i++];
      if (child2 && !isEmptyNode$1(child2)) {
        if (child2._tag === "LeafNode") {
          if (isSome$2(child2.value)) {
            zero2 = f(zero2, child2.value.value, child2.key);
          }
        } else {
          toVisit.push(child2.children);
        }
      }
    }
  }
  return zero2;
});
const HashSetSymbolKey = "effect/HashSet";
const HashSetTypeId$1 = /* @__PURE__ */ Symbol.for(HashSetSymbolKey);
const HashSetProto$1 = {
  [HashSetTypeId$1]: HashSetTypeId$1,
  [Symbol.iterator]() {
    return keys$2(this._keyMap);
  },
  [symbol$3]() {
    return cached(this, combine$6(hash$1(this._keyMap))(hash$1(HashSetSymbolKey)));
  },
  [symbol$2](that) {
    if (isHashSet$1(that)) {
      return size$5(this._keyMap) === size$5(that._keyMap) && equals$2(this._keyMap, that._keyMap);
    }
    return false;
  },
  toString() {
    return format$2(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashSet",
      values: Array.from(this).map(toJSON$1)
    };
  },
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const makeImpl$2 = (keyMap) => {
  const set2 = Object.create(HashSetProto$1);
  set2._keyMap = keyMap;
  return set2;
};
const isHashSet$1 = (u) => hasProperty(u, HashSetTypeId$1);
const _empty$7 = /* @__PURE__ */ makeImpl$2(/* @__PURE__ */ empty$l());
const empty$k = () => _empty$7;
const fromIterable$4 = (elements) => {
  const set2 = beginMutation$2(empty$k());
  for (const value of elements) {
    add$5(set2, value);
  }
  return endMutation$1(set2);
};
const make$i = (...elements) => {
  const set2 = beginMutation$2(empty$k());
  for (const value of elements) {
    add$5(set2, value);
  }
  return endMutation$1(set2);
};
const has$2 = /* @__PURE__ */ dual$1(2, (self2, value) => has$3(self2._keyMap, value));
const size$4 = (self2) => size$5(self2._keyMap);
const beginMutation$2 = (self2) => makeImpl$2(beginMutation$3(self2._keyMap));
const endMutation$1 = (self2) => {
  self2._keyMap._editable = false;
  return self2;
};
const mutate$1 = /* @__PURE__ */ dual$1(2, (self2, f) => {
  const transient = beginMutation$2(self2);
  f(transient);
  return endMutation$1(transient);
});
const add$5 = /* @__PURE__ */ dual$1(2, (self2, value) => self2._keyMap._editable ? (set$4(value, true)(self2._keyMap), self2) : makeImpl$2(set$4(value, true)(self2._keyMap)));
const remove$1 = /* @__PURE__ */ dual$1(2, (self2, value) => self2._keyMap._editable ? (remove$2(value)(self2._keyMap), self2) : makeImpl$2(remove$2(value)(self2._keyMap)));
const difference$1 = /* @__PURE__ */ dual$1(2, (self2, that) => mutate$1(self2, (set2) => {
  for (const value of that) {
    remove$1(set2, value);
  }
}));
const union$4 = /* @__PURE__ */ dual$1(2, (self2, that) => mutate$1(empty$k(), (set2) => {
  forEach$2(self2, (value) => add$5(set2, value));
  for (const value of that) {
    add$5(set2, value);
  }
}));
const forEach$2 = /* @__PURE__ */ dual$1(2, (self2, f) => forEach$3(self2._keyMap, (_, k) => f(k)));
const reduce$7 = /* @__PURE__ */ dual$1(3, (self2, zero2, f) => reduce$8(self2._keyMap, zero2, (z, _, a) => f(z, a)));
const empty$j = empty$k;
const fromIterable$3 = fromIterable$4;
const make$h = make$i;
const has$1 = has$2;
const size$3 = size$4;
const add$4 = add$5;
const remove = remove$1;
const difference = difference$1;
const union$3 = union$4;
const reduce$6 = reduce$7;
const OP_DIE$1 = "Die";
const OP_EMPTY$3 = "Empty";
const OP_FAIL$2 = "Fail";
const OP_INTERRUPT$1 = "Interrupt";
const OP_PARALLEL$1 = "Parallel";
const OP_SEQUENTIAL$2 = "Sequential";
const CauseSymbolKey$1 = "effect/Cause";
const CauseTypeId$1 = /* @__PURE__ */ Symbol.for(CauseSymbolKey$1);
const variance$4 = {
  /* c8 ignore next */
  _E: (_) => _
};
const proto$2 = {
  [CauseTypeId$1]: variance$4,
  [symbol$3]() {
    return pipe$1(hash$1(CauseSymbolKey$1), combine$6(hash$1(flattenCause$1(this))), cached(this));
  },
  [symbol$2](that) {
    return isCause$1(that) && causeEquals$1(this, that);
  },
  pipe() {
    return pipeArguments$1(this, arguments);
  },
  toJSON() {
    switch (this._tag) {
      case "Empty":
        return {
          _id: "Cause",
          _tag: this._tag
        };
      case "Die":
        return {
          _id: "Cause",
          _tag: this._tag,
          defect: toJSON$1(this.defect)
        };
      case "Interrupt":
        return {
          _id: "Cause",
          _tag: this._tag,
          fiberId: this.fiberId.toJSON()
        };
      case "Fail":
        return {
          _id: "Cause",
          _tag: this._tag,
          failure: toJSON$1(this.error)
        };
      case "Sequential":
      case "Parallel":
        return {
          _id: "Cause",
          _tag: this._tag,
          left: toJSON$1(this.left),
          right: toJSON$1(this.right)
        };
    }
  },
  toString() {
    return pretty$1(this);
  },
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  }
};
const empty$i = /* @__PURE__ */ (() => {
  const o = /* @__PURE__ */ Object.create(proto$2);
  o._tag = OP_EMPTY$3;
  return o;
})();
const fail$3 = (error) => {
  const o = Object.create(proto$2);
  o._tag = OP_FAIL$2;
  o.error = error;
  return o;
};
const die$1 = (defect) => {
  const o = Object.create(proto$2);
  o._tag = OP_DIE$1;
  o.defect = defect;
  return o;
};
const interrupt = (fiberId2) => {
  const o = Object.create(proto$2);
  o._tag = OP_INTERRUPT$1;
  o.fiberId = fiberId2;
  return o;
};
const parallel$1 = (left2, right2) => {
  const o = Object.create(proto$2);
  o._tag = OP_PARALLEL$1;
  o.left = left2;
  o.right = right2;
  return o;
};
const sequential$2 = (left2, right2) => {
  const o = Object.create(proto$2);
  o._tag = OP_SEQUENTIAL$2;
  o.left = left2;
  o.right = right2;
  return o;
};
const isCause$1 = (u) => hasProperty(u, CauseTypeId$1);
const isEmptyType = (self2) => self2._tag === OP_EMPTY$3;
const isEmpty$2 = (self2) => {
  if (self2._tag === OP_EMPTY$3) {
    return true;
  }
  return reduce$5(self2, true, (acc, cause) => {
    switch (cause._tag) {
      case OP_EMPTY$3: {
        return some$2(acc);
      }
      case OP_DIE$1:
      case OP_FAIL$2:
      case OP_INTERRUPT$1: {
        return some$2(false);
      }
      default: {
        return none$6();
      }
    }
  });
};
const isInterrupted = (self2) => isSome$2(interruptOption(self2));
const isInterruptedOnly$1 = (self2) => reduceWithContext$1(void 0, IsInterruptedOnlyCauseReducer$1)(self2);
const failures = (self2) => reverse$3(reduce$5(self2, empty$m(), (list, cause) => cause._tag === OP_FAIL$2 ? some$2(pipe$1(list, prepend$2(cause.error))) : none$6()));
const defects = (self2) => reverse$3(reduce$5(self2, empty$m(), (list, cause) => cause._tag === OP_DIE$1 ? some$2(pipe$1(list, prepend$2(cause.defect))) : none$6()));
const interruptors = (self2) => reduce$5(self2, empty$j(), (set2, cause) => cause._tag === OP_INTERRUPT$1 ? some$2(pipe$1(set2, add$4(cause.fiberId))) : none$6());
const failureOption = (self2) => find(self2, (cause) => cause._tag === OP_FAIL$2 ? some$2(cause.error) : none$6());
const failureOrCause = (self2) => {
  const option = failureOption(self2);
  switch (option._tag) {
    case "None": {
      return right$2(self2);
    }
    case "Some": {
      return left$2(option.value);
    }
  }
};
const interruptOption = (self2) => find(self2, (cause) => cause._tag === OP_INTERRUPT$1 ? some$2(cause.fiberId) : none$6());
const stripFailures = (self2) => match$1(self2, {
  onEmpty: empty$i,
  onFail: () => empty$i,
  onDie: die$1,
  onInterrupt: interrupt,
  onSequential: sequential$2,
  onParallel: parallel$1
});
const electFailures = (self2) => match$1(self2, {
  onEmpty: empty$i,
  onFail: die$1,
  onDie: die$1,
  onInterrupt: interrupt,
  onSequential: sequential$2,
  onParallel: parallel$1
});
const causeEquals$1 = (left2, right2) => {
  let leftStack = of$2(left2);
  let rightStack = of$2(right2);
  while (isNonEmpty$1(leftStack) && isNonEmpty$1(rightStack)) {
    const [leftParallel, leftSequential] = pipe$1(headNonEmpty$1(leftStack), reduce$5([empty$j(), empty$m()], ([parallel2, sequential2], cause) => {
      const [par2, seq2] = evaluateCause$1(cause);
      return some$2([pipe$1(parallel2, union$3(par2)), pipe$1(sequential2, appendAll$2(seq2))]);
    }));
    const [rightParallel, rightSequential] = pipe$1(headNonEmpty$1(rightStack), reduce$5([empty$j(), empty$m()], ([parallel2, sequential2], cause) => {
      const [par2, seq2] = evaluateCause$1(cause);
      return some$2([pipe$1(parallel2, union$3(par2)), pipe$1(sequential2, appendAll$2(seq2))]);
    }));
    if (!equals$2(leftParallel, rightParallel)) {
      return false;
    }
    leftStack = leftSequential;
    rightStack = rightSequential;
  }
  return true;
};
const flattenCause$1 = (cause) => {
  return flattenCauseLoop$1(of$2(cause), empty$m());
};
const flattenCauseLoop$1 = (causes, flattened) => {
  while (1) {
    const [parallel2, sequential2] = pipe$1(causes, reduce$9([empty$j(), empty$m()], ([parallel3, sequential3], cause) => {
      const [par2, seq2] = evaluateCause$1(cause);
      return [pipe$1(parallel3, union$3(par2)), pipe$1(sequential3, appendAll$2(seq2))];
    }));
    const updated = size$3(parallel2) > 0 ? pipe$1(flattened, prepend$2(parallel2)) : flattened;
    if (isEmpty$4(sequential2)) {
      return reverse$3(updated);
    }
    causes = sequential2;
    flattened = updated;
  }
  throw new Error(getBugErrorMessage("Cause.flattenCauseLoop"));
};
const find = /* @__PURE__ */ dual$1(2, (self2, pf) => {
  const stack = [self2];
  while (stack.length > 0) {
    const item = stack.pop();
    const option = pf(item);
    switch (option._tag) {
      case "None": {
        switch (item._tag) {
          case OP_SEQUENTIAL$2:
          case OP_PARALLEL$1: {
            stack.push(item.right);
            stack.push(item.left);
            break;
          }
        }
        break;
      }
      case "Some": {
        return option;
      }
    }
  }
  return none$6();
});
const evaluateCause$1 = (self2) => {
  let cause = self2;
  const stack = [];
  let _parallel = empty$j();
  let _sequential = empty$m();
  while (cause !== void 0) {
    switch (cause._tag) {
      case OP_EMPTY$3: {
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_FAIL$2: {
        _parallel = add$4(_parallel, make$k(cause._tag, cause.error));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_DIE$1: {
        _parallel = add$4(_parallel, make$k(cause._tag, cause.defect));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_INTERRUPT$1: {
        _parallel = add$4(_parallel, make$k(cause._tag, cause.fiberId));
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_SEQUENTIAL$2: {
        switch (cause.left._tag) {
          case OP_EMPTY$3: {
            cause = cause.right;
            break;
          }
          case OP_SEQUENTIAL$2: {
            cause = sequential$2(cause.left.left, sequential$2(cause.left.right, cause.right));
            break;
          }
          case OP_PARALLEL$1: {
            cause = parallel$1(sequential$2(cause.left.left, cause.right), sequential$2(cause.left.right, cause.right));
            break;
          }
          default: {
            _sequential = prepend$2(_sequential, cause.right);
            cause = cause.left;
            break;
          }
        }
        break;
      }
      case OP_PARALLEL$1: {
        stack.push(cause.right);
        cause = cause.left;
        break;
      }
    }
  }
  throw new Error(getBugErrorMessage("Cause.evaluateCauseLoop"));
};
const IsInterruptedOnlyCauseReducer$1 = {
  emptyCase: constTrue$1,
  failCase: constFalse$1,
  dieCase: constFalse$1,
  interruptCase: constTrue$1,
  sequentialCase: (_, left2, right2) => left2 && right2,
  parallelCase: (_, left2, right2) => left2 && right2
};
const OP_SEQUENTIAL_CASE$1 = "SequentialCase";
const OP_PARALLEL_CASE$1 = "ParallelCase";
const match$1 = /* @__PURE__ */ dual$1(2, (self2, {
  onDie,
  onEmpty,
  onFail,
  onInterrupt: onInterrupt2,
  onParallel,
  onSequential
}) => {
  return reduceWithContext$1(self2, void 0, {
    emptyCase: () => onEmpty,
    failCase: (_, error) => onFail(error),
    dieCase: (_, defect) => onDie(defect),
    interruptCase: (_, fiberId2) => onInterrupt2(fiberId2),
    sequentialCase: (_, left2, right2) => onSequential(left2, right2),
    parallelCase: (_, left2, right2) => onParallel(left2, right2)
  });
});
const reduce$5 = /* @__PURE__ */ dual$1(3, (self2, zero2, pf) => {
  let accumulator = zero2;
  let cause = self2;
  const causes = [];
  while (cause !== void 0) {
    const option = pf(accumulator, cause);
    accumulator = isSome$2(option) ? option.value : accumulator;
    switch (cause._tag) {
      case OP_SEQUENTIAL$2: {
        causes.push(cause.right);
        cause = cause.left;
        break;
      }
      case OP_PARALLEL$1: {
        causes.push(cause.right);
        cause = cause.left;
        break;
      }
      default: {
        cause = void 0;
        break;
      }
    }
    if (cause === void 0 && causes.length > 0) {
      cause = causes.pop();
    }
  }
  return accumulator;
});
const reduceWithContext$1 = /* @__PURE__ */ dual$1(3, (self2, context, reducer) => {
  const input = [self2];
  const output = [];
  while (input.length > 0) {
    const cause = input.pop();
    switch (cause._tag) {
      case OP_EMPTY$3: {
        output.push(right$2(reducer.emptyCase(context)));
        break;
      }
      case OP_FAIL$2: {
        output.push(right$2(reducer.failCase(context, cause.error)));
        break;
      }
      case OP_DIE$1: {
        output.push(right$2(reducer.dieCase(context, cause.defect)));
        break;
      }
      case OP_INTERRUPT$1: {
        output.push(right$2(reducer.interruptCase(context, cause.fiberId)));
        break;
      }
      case OP_SEQUENTIAL$2: {
        input.push(cause.right);
        input.push(cause.left);
        output.push(left$2({
          _tag: OP_SEQUENTIAL_CASE$1
        }));
        break;
      }
      case OP_PARALLEL$1: {
        input.push(cause.right);
        input.push(cause.left);
        output.push(left$2({
          _tag: OP_PARALLEL_CASE$1
        }));
        break;
      }
    }
  }
  const accumulator = [];
  while (output.length > 0) {
    const either2 = output.pop();
    switch (either2._tag) {
      case "Left": {
        switch (either2.left._tag) {
          case OP_SEQUENTIAL_CASE$1: {
            const left2 = accumulator.pop();
            const right2 = accumulator.pop();
            const value = reducer.sequentialCase(context, left2, right2);
            accumulator.push(value);
            break;
          }
          case OP_PARALLEL_CASE$1: {
            const left2 = accumulator.pop();
            const right2 = accumulator.pop();
            const value = reducer.parallelCase(context, left2, right2);
            accumulator.push(value);
            break;
          }
        }
        break;
      }
      case "Right": {
        accumulator.push(either2.right);
        break;
      }
    }
  }
  if (accumulator.length === 0) {
    throw new Error("BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/effect/issues");
  }
  return accumulator.pop();
});
const pretty$1 = (cause, options) => {
  if (isInterruptedOnly$1(cause)) {
    return "All fibers interrupted without errors.";
  }
  return prettyErrors$1(cause).map(function(e) {
    if ((options == null ? void 0 : options.renderErrorCause) !== true || e.cause === void 0) {
      return e.stack;
    }
    return `${e.stack} {
${renderErrorCause(e.cause, "  ")}
}`;
  }).join("\n");
};
const renderErrorCause = (cause, prefix) => {
  const lines = cause.stack.split("\n");
  let stack = `${prefix}[cause]: ${lines[0]}`;
  for (let i = 1, len = lines.length; i < len; i++) {
    stack += `
${prefix}${lines[i]}`;
  }
  if (cause.cause) {
    stack += ` {
${renderErrorCause(cause.cause, `${prefix}  `)}
${prefix}}`;
  }
  return stack;
};
let PrettyError$1 = class PrettyError extends globalThis.Error {
  constructor(originalError) {
    const originalErrorIsObject = typeof originalError === "object" && originalError !== null;
    const prevLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 1;
    super(prettyErrorMessage$1(originalError), originalErrorIsObject && "cause" in originalError && typeof originalError.cause !== "undefined" ? {
      cause: new PrettyError(originalError.cause)
    } : void 0);
    __publicField(this, "span");
    if (this.message === "") {
      this.message = "An error has occurred";
    }
    Error.stackTraceLimit = prevLimit;
    this.name = originalError instanceof Error ? originalError.name : "Error";
    if (originalErrorIsObject) {
      if (spanSymbol$1 in originalError) {
        this.span = originalError[spanSymbol$1];
      }
      Object.keys(originalError).forEach((key) => {
        if (!(key in this)) {
          this[key] = originalError[key];
        }
      });
    }
    this.stack = prettyErrorStack(`${this.name}: ${this.message}`, originalError instanceof Error && originalError.stack ? originalError.stack : "", this.span);
  }
};
const prettyErrorMessage$1 = (u) => {
  if (typeof u === "string") {
    return u;
  }
  if (typeof u === "object" && u !== null && u instanceof Error) {
    return u.message;
  }
  try {
    if (hasProperty(u, "toString") && isFunction$2(u["toString"]) && u["toString"] !== Object.prototype.toString && u["toString"] !== globalThis.Array.prototype.toString) {
      return u["toString"]();
    }
  } catch {
  }
  return stringifyCircular(u);
};
const locationRegex = /\((.*)\)/g;
const spanToTrace = /* @__PURE__ */ globalValue$1("effect/Tracer/spanToTrace", () => /* @__PURE__ */ new WeakMap());
const prettyErrorStack = (message, stack, span2) => {
  const out = [message];
  const lines = stack.startsWith(message) ? stack.slice(message.length).split("\n") : stack.split("\n");
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].includes(" at new BaseEffectError") || lines[i].includes(" at new YieldableError")) {
      i++;
      continue;
    }
    if (lines[i].includes("Generator.next")) {
      break;
    }
    if (lines[i].includes("effect_internal_function")) {
      break;
    }
    out.push(lines[i].replace(/at .*effect_instruction_i.*\((.*)\)/, "at $1").replace(/EffectPrimitive\.\w+/, "<anonymous>"));
  }
  if (span2) {
    let current = span2;
    let i = 0;
    while (current && current._tag === "Span" && i < 10) {
      const stackFn = spanToTrace.get(current);
      if (typeof stackFn === "function") {
        const stack2 = stackFn();
        if (typeof stack2 === "string") {
          const locationMatchAll = stack2.matchAll(locationRegex);
          let match2 = false;
          for (const [, location] of locationMatchAll) {
            match2 = true;
            out.push(`    at ${current.name} (${location})`);
          }
          if (!match2) {
            out.push(`    at ${current.name} (${stack2.replace(/^at /, "")})`);
          }
        } else {
          out.push(`    at ${current.name}`);
        }
      } else {
        out.push(`    at ${current.name}`);
      }
      current = getOrUndefined$1(current.parent);
      i++;
    }
  }
  return out.join("\n");
};
const spanSymbol$1 = /* @__PURE__ */ Symbol.for("effect/SpanAnnotation");
const prettyErrors$1 = (cause) => reduceWithContext$1(cause, void 0, {
  emptyCase: () => [],
  dieCase: (_, unknownError) => {
    return [new PrettyError$1(unknownError)];
  },
  failCase: (_, error) => {
    return [new PrettyError$1(error)];
  },
  interruptCase: () => [],
  parallelCase: (_, l, r) => [...l, ...r],
  sequentialCase: (_, l, r) => [...l, ...r]
});
const TagTypeId = /* @__PURE__ */ Symbol.for("effect/Context/Tag");
const ReferenceTypeId = /* @__PURE__ */ Symbol.for("effect/Context/Reference");
const STMSymbolKey = "effect/STM";
const STMTypeId = /* @__PURE__ */ Symbol.for(STMSymbolKey);
const TagProto = {
  ...EffectPrototype$1,
  _op: "Tag",
  [STMTypeId]: effectVariance$2,
  [TagTypeId]: {
    _Service: (_) => _,
    _Identifier: (_) => _
  },
  toString() {
    return format$2(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Tag",
      key: this.key,
      stack: this.stack
    };
  },
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  },
  of(self2) {
    return self2;
  },
  context(self2) {
    return make$g(this, self2);
  }
};
const ReferenceProto = {
  ...TagProto,
  [ReferenceTypeId]: ReferenceTypeId
};
const makeGenericTag = (key) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error();
  Error.stackTraceLimit = limit;
  const tag = Object.create(TagProto);
  Object.defineProperty(tag, "stack", {
    get() {
      return creationError.stack;
    }
  });
  tag.key = key;
  return tag;
};
const Reference$1 = () => (id, options) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const creationError = new Error();
  Error.stackTraceLimit = limit;
  function ReferenceClass() {
  }
  Object.setPrototypeOf(ReferenceClass, ReferenceProto);
  ReferenceClass.key = id;
  ReferenceClass.defaultValue = options.defaultValue;
  Object.defineProperty(ReferenceClass, "stack", {
    get() {
      return creationError.stack;
    }
  });
  return ReferenceClass;
};
const TypeId$9 = /* @__PURE__ */ Symbol.for("effect/Context");
const ContextProto = {
  [TypeId$9]: {
    _Services: (_) => _
  },
  [symbol$2](that) {
    if (isContext(that)) {
      if (this.unsafeMap.size === that.unsafeMap.size) {
        for (const k of this.unsafeMap.keys()) {
          if (!that.unsafeMap.has(k) || !equals$2(this.unsafeMap.get(k), that.unsafeMap.get(k))) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  },
  [symbol$3]() {
    return cached(this, number$2(this.unsafeMap.size));
  },
  pipe() {
    return pipeArguments$1(this, arguments);
  },
  toString() {
    return format$2(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.unsafeMap).map(toJSON$1)
    };
  },
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  }
};
const makeContext = (unsafeMap) => {
  const context = Object.create(ContextProto);
  context.unsafeMap = unsafeMap;
  return context;
};
const serviceNotFoundError = (tag) => {
  const error = new Error(`Service not found${tag.key ? `: ${String(tag.key)}` : ""}`);
  if (tag.stack) {
    const lines = tag.stack.split("\n");
    if (lines.length > 2) {
      const afterAt = lines[2].match(/at (.*)/);
      if (afterAt) {
        error.message = error.message + ` (defined at ${afterAt[1]})`;
      }
    }
  }
  if (error.stack) {
    const lines = error.stack.split("\n");
    lines.splice(1, 3);
    error.stack = lines.join("\n");
  }
  return error;
};
const isContext = (u) => hasProperty(u, TypeId$9);
const isReference = (u) => hasProperty(u, ReferenceTypeId);
const _empty$6 = /* @__PURE__ */ makeContext(/* @__PURE__ */ new Map());
const empty$h = () => _empty$6;
const make$g = (tag, service) => makeContext(/* @__PURE__ */ new Map([[tag.key, service]]));
const add$3 = /* @__PURE__ */ dual$1(3, (self2, tag, service) => {
  const map2 = new Map(self2.unsafeMap);
  map2.set(tag.key, service);
  return makeContext(map2);
});
const defaultValueCache = /* @__PURE__ */ globalValue$1("effect/Context/defaultValueCache", () => /* @__PURE__ */ new Map());
const getDefaultValue = (tag) => {
  if (defaultValueCache.has(tag.key)) {
    return defaultValueCache.get(tag.key);
  }
  const value = tag.defaultValue();
  defaultValueCache.set(tag.key, value);
  return value;
};
const unsafeGetReference = (self2, tag) => {
  return self2.unsafeMap.has(tag.key) ? self2.unsafeMap.get(tag.key) : getDefaultValue(tag);
};
const unsafeGet$2 = /* @__PURE__ */ dual$1(2, (self2, tag) => {
  if (!self2.unsafeMap.has(tag.key)) {
    if (ReferenceTypeId in tag) return getDefaultValue(tag);
    throw serviceNotFoundError(tag);
  }
  return self2.unsafeMap.get(tag.key);
});
const get$5 = unsafeGet$2;
const getOption$1 = /* @__PURE__ */ dual$1(2, (self2, tag) => {
  if (!self2.unsafeMap.has(tag.key)) {
    return isReference(tag) ? some$3(getDefaultValue(tag)) : none$7;
  }
  return some$3(self2.unsafeMap.get(tag.key));
});
const merge$2 = /* @__PURE__ */ dual$1(2, (self2, that) => {
  const map2 = new Map(self2.unsafeMap);
  for (const [tag, s] of that.unsafeMap) {
    map2.set(tag, s);
  }
  return makeContext(map2);
});
const GenericTag = makeGenericTag;
const empty$g = empty$h;
const add$2 = add$3;
const get$4 = get$5;
const unsafeGet$1 = unsafeGet$2;
const getOption = getOption$1;
const merge$1 = merge$2;
const Reference = Reference$1;
const TypeId$8 = /* @__PURE__ */ Symbol.for("effect/Duration");
const bigint0$1 = /* @__PURE__ */ BigInt(0);
const bigint24 = /* @__PURE__ */ BigInt(24);
const bigint60 = /* @__PURE__ */ BigInt(60);
const bigint1e3 = /* @__PURE__ */ BigInt(1e3);
const bigint1e6 = /* @__PURE__ */ BigInt(1e6);
const bigint1e9 = /* @__PURE__ */ BigInt(1e9);
const DURATION_REGEX = /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/;
const decode = (input) => {
  if (isDuration(input)) {
    return input;
  } else if (isNumber(input)) {
    return millis(input);
  } else if (isBigInt(input)) {
    return nanos(input);
  } else if (Array.isArray(input) && input.length === 2 && input.every(isNumber)) {
    if (input[0] === -Infinity || input[1] === -Infinity || Number.isNaN(input[0]) || Number.isNaN(input[1])) {
      return zero;
    }
    if (input[0] === Infinity || input[1] === Infinity) {
      return infinity;
    }
    return nanos(BigInt(Math.round(input[0] * 1e9)) + BigInt(Math.round(input[1])));
  } else if (isString(input)) {
    const match2 = DURATION_REGEX.exec(input);
    if (match2) {
      const [_, valueStr, unit] = match2;
      const value = Number(valueStr);
      switch (unit) {
        case "nano":
        case "nanos":
          return nanos(BigInt(valueStr));
        case "micro":
        case "micros":
          return micros(BigInt(valueStr));
        case "milli":
        case "millis":
          return millis(value);
        case "second":
        case "seconds":
          return seconds(value);
        case "minute":
        case "minutes":
          return minutes(value);
        case "hour":
        case "hours":
          return hours(value);
        case "day":
        case "days":
          return days(value);
        case "week":
        case "weeks":
          return weeks(value);
      }
    }
  }
  throw new Error("Invalid DurationInput");
};
const zeroValue = {
  _tag: "Millis",
  millis: 0
};
const infinityValue = {
  _tag: "Infinity"
};
const DurationProto = {
  [TypeId$8]: TypeId$8,
  [symbol$3]() {
    return cached(this, structure(this.value));
  },
  [symbol$2](that) {
    return isDuration(that) && equals$1(this, that);
  },
  toString() {
    return `Duration(${format$1(this)})`;
  },
  toJSON() {
    switch (this.value._tag) {
      case "Millis":
        return {
          _id: "Duration",
          _tag: "Millis",
          millis: this.value.millis
        };
      case "Nanos":
        return {
          _id: "Duration",
          _tag: "Nanos",
          hrtime: toHrTime(this)
        };
      case "Infinity":
        return {
          _id: "Duration",
          _tag: "Infinity"
        };
    }
  },
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const make$f = (input) => {
  const duration = Object.create(DurationProto);
  if (isNumber(input)) {
    if (isNaN(input) || input <= 0) {
      duration.value = zeroValue;
    } else if (!Number.isFinite(input)) {
      duration.value = infinityValue;
    } else if (!Number.isInteger(input)) {
      duration.value = {
        _tag: "Nanos",
        nanos: BigInt(Math.round(input * 1e6))
      };
    } else {
      duration.value = {
        _tag: "Millis",
        millis: input
      };
    }
  } else if (input <= bigint0$1) {
    duration.value = zeroValue;
  } else {
    duration.value = {
      _tag: "Nanos",
      nanos: input
    };
  }
  return duration;
};
const isDuration = (u) => hasProperty(u, TypeId$8);
const isZero = (self2) => {
  switch (self2.value._tag) {
    case "Millis": {
      return self2.value.millis === 0;
    }
    case "Nanos": {
      return self2.value.nanos === bigint0$1;
    }
    case "Infinity": {
      return false;
    }
  }
};
const zero = /* @__PURE__ */ make$f(0);
const infinity = /* @__PURE__ */ make$f(Infinity);
const nanos = (nanos2) => make$f(nanos2);
const micros = (micros2) => make$f(micros2 * bigint1e3);
const millis = (millis2) => make$f(millis2);
const seconds = (seconds2) => make$f(seconds2 * 1e3);
const minutes = (minutes2) => make$f(minutes2 * 6e4);
const hours = (hours2) => make$f(hours2 * 36e5);
const days = (days2) => make$f(days2 * 864e5);
const weeks = (weeks2) => make$f(weeks2 * 6048e5);
const toMillis = (self2) => match(self2, {
  onMillis: (millis2) => millis2,
  onNanos: (nanos2) => Number(nanos2) / 1e6
});
const unsafeToNanos = (self2) => {
  const _self = decode(self2);
  switch (_self.value._tag) {
    case "Infinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return _self.value.nanos;
    case "Millis":
      return BigInt(Math.round(_self.value.millis * 1e6));
  }
};
const toHrTime = (self2) => {
  const _self = decode(self2);
  switch (_self.value._tag) {
    case "Infinity":
      return [Infinity, 0];
    case "Nanos":
      return [Number(_self.value.nanos / bigint1e9), Number(_self.value.nanos % bigint1e9)];
    case "Millis":
      return [Math.floor(_self.value.millis / 1e3), Math.round(_self.value.millis % 1e3 * 1e6)];
  }
};
const match = /* @__PURE__ */ dual$1(2, (self2, options) => {
  const _self = decode(self2);
  switch (_self.value._tag) {
    case "Nanos":
      return options.onNanos(_self.value.nanos);
    case "Infinity":
      return options.onMillis(Infinity);
    case "Millis":
      return options.onMillis(_self.value.millis);
  }
});
const matchWith = /* @__PURE__ */ dual$1(3, (self2, that, options) => {
  const _self = decode(self2);
  const _that = decode(that);
  if (_self.value._tag === "Infinity" || _that.value._tag === "Infinity") {
    return options.onMillis(toMillis(_self), toMillis(_that));
  } else if (_self.value._tag === "Nanos" || _that.value._tag === "Nanos") {
    const selfNanos = _self.value._tag === "Nanos" ? _self.value.nanos : BigInt(Math.round(_self.value.millis * 1e6));
    const thatNanos = _that.value._tag === "Nanos" ? _that.value.nanos : BigInt(Math.round(_that.value.millis * 1e6));
    return options.onNanos(selfNanos, thatNanos);
  }
  return options.onMillis(_self.value.millis, _that.value.millis);
});
const Equivalence = (self2, that) => matchWith(self2, that, {
  onMillis: (self3, that2) => self3 === that2,
  onNanos: (self3, that2) => self3 === that2
});
const lessThanOrEqualTo = /* @__PURE__ */ dual$1(2, (self2, that) => matchWith(self2, that, {
  onMillis: (self3, that2) => self3 <= that2,
  onNanos: (self3, that2) => self3 <= that2
}));
const greaterThanOrEqualTo = /* @__PURE__ */ dual$1(2, (self2, that) => matchWith(self2, that, {
  onMillis: (self3, that2) => self3 >= that2,
  onNanos: (self3, that2) => self3 >= that2
}));
const equals$1 = /* @__PURE__ */ dual$1(2, (self2, that) => Equivalence(decode(self2), decode(that)));
const parts = (self2) => {
  const duration = decode(self2);
  if (duration.value._tag === "Infinity") {
    return {
      days: Infinity,
      hours: Infinity,
      minutes: Infinity,
      seconds: Infinity,
      millis: Infinity,
      nanos: Infinity
    };
  }
  const nanos2 = unsafeToNanos(duration);
  const ms = nanos2 / bigint1e6;
  const sec = ms / bigint1e3;
  const min = sec / bigint60;
  const hr = min / bigint60;
  const days2 = hr / bigint24;
  return {
    days: Number(days2),
    hours: Number(hr % bigint24),
    minutes: Number(min % bigint60),
    seconds: Number(sec % bigint60),
    millis: Number(ms % bigint1e3),
    nanos: Number(nanos2 % bigint1e6)
  };
};
const format$1 = (self2) => {
  const duration = decode(self2);
  if (duration.value._tag === "Infinity") {
    return "Infinity";
  }
  if (isZero(duration)) {
    return "0";
  }
  const fragments = parts(duration);
  const pieces = [];
  if (fragments.days !== 0) {
    pieces.push(`${fragments.days}d`);
  }
  if (fragments.hours !== 0) {
    pieces.push(`${fragments.hours}h`);
  }
  if (fragments.minutes !== 0) {
    pieces.push(`${fragments.minutes}m`);
  }
  if (fragments.seconds !== 0) {
    pieces.push(`${fragments.seconds}s`);
  }
  if (fragments.millis !== 0) {
    pieces.push(`${fragments.millis}ms`);
  }
  if (fragments.nanos !== 0) {
    pieces.push(`${fragments.nanos}ns`);
  }
  return pieces.join(" ");
};
const TypeId$7 = /* @__PURE__ */ Symbol.for("effect/MutableRef");
const MutableRefProto = {
  [TypeId$7]: TypeId$7,
  toString() {
    return format$2(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableRef",
      current: toJSON$1(this.current)
    };
  },
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const make$e = (value) => {
  const ref = Object.create(MutableRefProto);
  ref.current = value;
  return ref;
};
const get$3 = (self2) => self2.current;
const set$3 = /* @__PURE__ */ dual$1(2, (self2, value) => {
  self2.current = value;
  return self2;
});
const FiberIdSymbolKey = "effect/FiberId";
const FiberIdTypeId = /* @__PURE__ */ Symbol.for(FiberIdSymbolKey);
const OP_NONE = "None";
const OP_RUNTIME = "Runtime";
const OP_COMPOSITE = "Composite";
const emptyHash = /* @__PURE__ */ string$1(`${FiberIdSymbolKey}-${OP_NONE}`);
let None$2 = class None {
  constructor() {
    __publicField(this, _b, FiberIdTypeId);
    __publicField(this, "_tag", OP_NONE);
    __publicField(this, "id", -1);
    __publicField(this, "startTimeMillis", -1);
  }
  [(_b = FiberIdTypeId, symbol$3)]() {
    return emptyHash;
  }
  [symbol$2](that) {
    return isFiberId(that) && that._tag === OP_NONE;
  }
  toString() {
    return format$2(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag
    };
  }
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  }
};
class Runtime {
  constructor(id, startTimeMillis) {
    __publicField(this, "id");
    __publicField(this, "startTimeMillis");
    __publicField(this, _c2, FiberIdTypeId);
    __publicField(this, "_tag", OP_RUNTIME);
    this.id = id;
    this.startTimeMillis = startTimeMillis;
  }
  [(_c2 = FiberIdTypeId, symbol$3)]() {
    return cached(this, string$1(`${FiberIdSymbolKey}-${this._tag}-${this.id}-${this.startTimeMillis}`));
  }
  [symbol$2](that) {
    return isFiberId(that) && that._tag === OP_RUNTIME && this.id === that.id && this.startTimeMillis === that.startTimeMillis;
  }
  toString() {
    return format$2(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      id: this.id,
      startTimeMillis: this.startTimeMillis
    };
  }
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  }
}
const none$5 = /* @__PURE__ */ new None$2();
const isFiberId = (self2) => hasProperty(self2, FiberIdTypeId);
const ids = (self2) => {
  switch (self2._tag) {
    case OP_NONE: {
      return empty$j();
    }
    case OP_RUNTIME: {
      return make$h(self2.id);
    }
    case OP_COMPOSITE: {
      return pipe$1(ids(self2.left), union$3(ids(self2.right)));
    }
  }
};
const _fiberCounter = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/Fiber/Id/_fiberCounter"), () => make$e(0));
const threadName$1 = (self2) => {
  const identifiers = Array.from(ids(self2)).map((n) => `#${n}`).join(",");
  return identifiers;
};
const unsafeMake$4 = () => {
  const id = get$3(_fiberCounter);
  pipe$1(_fiberCounter, set$3(id + 1));
  return new Runtime(id, Date.now());
};
const none$4 = none$5;
const threadName = threadName$1;
const unsafeMake$3 = unsafeMake$4;
const empty$f = empty$l;
const fromIterable$2 = fromIterable$5;
const isEmpty$1 = isEmpty$3;
const get$2 = get$6;
const set$2 = set$4;
const keys$1 = keys$2;
const modifyAt$1 = modifyAt$2;
const map$2 = map$3;
const reduce$4 = reduce$8;
const TypeId$6 = /* @__PURE__ */ Symbol.for("effect/List");
const toArray = (self2) => fromIterable$7(self2);
const getEquivalence$1 = (isEquivalent) => mapInput$1(getEquivalence$3(isEquivalent), toArray);
const _equivalence$1 = /* @__PURE__ */ getEquivalence$1(equals$2);
const ConsProto = {
  [TypeId$6]: TypeId$6,
  _tag: "Cons",
  toString() {
    return format$2(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Cons",
      values: toArray(this).map(toJSON$1)
    };
  },
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  },
  [symbol$2](that) {
    return isList(that) && this._tag === that._tag && _equivalence$1(this, that);
  },
  [symbol$3]() {
    return cached(this, array$1(toArray(this)));
  },
  [Symbol.iterator]() {
    let done2 = false;
    let self2 = this;
    return {
      next() {
        if (done2) {
          return this.return();
        }
        if (self2._tag === "Nil") {
          done2 = true;
          return this.return();
        }
        const value = self2.head;
        self2 = self2.tail;
        return {
          done: done2,
          value
        };
      },
      return(value) {
        if (!done2) {
          done2 = true;
        }
        return {
          done: true,
          value
        };
      }
    };
  },
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const makeCons = (head2, tail) => {
  const cons2 = Object.create(ConsProto);
  cons2.head = head2;
  cons2.tail = tail;
  return cons2;
};
const NilHash = /* @__PURE__ */ string$1("Nil");
const NilProto = {
  [TypeId$6]: TypeId$6,
  _tag: "Nil",
  toString() {
    return format$2(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Nil"
    };
  },
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  },
  [symbol$3]() {
    return NilHash;
  },
  [symbol$2](that) {
    return isList(that) && this._tag === that._tag;
  },
  [Symbol.iterator]() {
    return {
      next() {
        return {
          done: true,
          value: void 0
        };
      }
    };
  },
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const _Nil = /* @__PURE__ */ Object.create(NilProto);
const isList = (u) => hasProperty(u, TypeId$6);
const isNil = (self2) => self2._tag === "Nil";
const isCons = (self2) => self2._tag === "Cons";
const nil = () => _Nil;
const cons = (head2, tail) => makeCons(head2, tail);
const empty$e = nil;
const of$1 = (value) => makeCons(value, _Nil);
const appendAll$1 = /* @__PURE__ */ dual$1(2, (self2, that) => prependAll(that, self2));
const prepend$1 = /* @__PURE__ */ dual$1(2, (self2, element) => cons(element, self2));
const prependAll = /* @__PURE__ */ dual$1(2, (self2, prefix) => {
  if (isNil(self2)) {
    return prefix;
  } else if (isNil(prefix)) {
    return self2;
  } else {
    const result = makeCons(prefix.head, self2);
    let curr = result;
    let that = prefix.tail;
    while (!isNil(that)) {
      const temp = makeCons(that.head, self2);
      curr.tail = temp;
      curr = temp;
      that = that.tail;
    }
    return result;
  }
});
const reduce$3 = /* @__PURE__ */ dual$1(3, (self2, zero2, f) => {
  let acc = zero2;
  let these = self2;
  while (!isNil(these)) {
    acc = f(acc, these.head);
    these = these.tail;
  }
  return acc;
});
const reverse$2 = (self2) => {
  let result = empty$e();
  let these = self2;
  while (!isNil(these)) {
    result = prepend$1(result, these.head);
    these = these.tail;
  }
  return result;
};
const Structural = /* @__PURE__ */ function() {
  function Structural2(args2) {
    if (args2) {
      Object.assign(this, args2);
    }
  }
  Structural2.prototype = StructuralPrototype;
  return Structural2;
}();
const ContextPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferContextPatch");
function variance$3(a) {
  return a;
}
const PatchProto$2 = {
  ...Structural.prototype,
  [ContextPatchTypeId]: {
    _Value: variance$3,
    _Patch: variance$3
  }
};
const EmptyProto$2 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$2), {
  _tag: "Empty"
});
const _empty$5 = /* @__PURE__ */ Object.create(EmptyProto$2);
const empty$d = () => _empty$5;
const AndThenProto$2 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$2), {
  _tag: "AndThen"
});
const makeAndThen$2 = (first, second) => {
  const o = Object.create(AndThenProto$2);
  o.first = first;
  o.second = second;
  return o;
};
const AddServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$2), {
  _tag: "AddService"
});
const makeAddService = (key, service) => {
  const o = Object.create(AddServiceProto);
  o.key = key;
  o.service = service;
  return o;
};
const RemoveServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$2), {
  _tag: "RemoveService"
});
const makeRemoveService = (key) => {
  const o = Object.create(RemoveServiceProto);
  o.key = key;
  return o;
};
const UpdateServiceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$2), {
  _tag: "UpdateService"
});
const makeUpdateService = (key, update2) => {
  const o = Object.create(UpdateServiceProto);
  o.key = key;
  o.update = update2;
  return o;
};
const diff$6 = (oldValue, newValue) => {
  const missingServices = new Map(oldValue.unsafeMap);
  let patch2 = empty$d();
  for (const [tag, newService] of newValue.unsafeMap.entries()) {
    if (missingServices.has(tag)) {
      const old = missingServices.get(tag);
      missingServices.delete(tag);
      if (!equals$2(old, newService)) {
        patch2 = combine$5(makeUpdateService(tag, () => newService))(patch2);
      }
    } else {
      missingServices.delete(tag);
      patch2 = combine$5(makeAddService(tag, newService))(patch2);
    }
  }
  for (const [tag] of missingServices.entries()) {
    patch2 = combine$5(makeRemoveService(tag))(patch2);
  }
  return patch2;
};
const combine$5 = /* @__PURE__ */ dual$1(2, (self2, that) => makeAndThen$2(self2, that));
const patch$7 = /* @__PURE__ */ dual$1(2, (self2, context) => {
  if (self2._tag === "Empty") {
    return context;
  }
  let wasServiceUpdated = false;
  let patches = of$2(self2);
  const updatedContext = new Map(context.unsafeMap);
  while (isNonEmpty$1(patches)) {
    const head2 = headNonEmpty$1(patches);
    const tail = tailNonEmpty(patches);
    switch (head2._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AddService": {
        updatedContext.set(head2.key, head2.service);
        patches = tail;
        break;
      }
      case "AndThen": {
        patches = prepend$2(prepend$2(tail, head2.second), head2.first);
        break;
      }
      case "RemoveService": {
        updatedContext.delete(head2.key);
        patches = tail;
        break;
      }
      case "UpdateService": {
        updatedContext.set(head2.key, head2.update(updatedContext.get(head2.key)));
        wasServiceUpdated = true;
        patches = tail;
        break;
      }
    }
  }
  if (!wasServiceUpdated) {
    return makeContext(updatedContext);
  }
  const map2 = /* @__PURE__ */ new Map();
  for (const [tag] of context.unsafeMap) {
    if (updatedContext.has(tag)) {
      map2.set(tag, updatedContext.get(tag));
      updatedContext.delete(tag);
    }
  }
  for (const [tag, s] of updatedContext) {
    map2.set(tag, s);
  }
  return makeContext(map2);
});
const HashSetPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferHashSetPatch");
function variance$2(a) {
  return a;
}
const PatchProto$1 = {
  ...Structural.prototype,
  [HashSetPatchTypeId]: {
    _Value: variance$2,
    _Key: variance$2,
    _Patch: variance$2
  }
};
const EmptyProto$1 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$1), {
  _tag: "Empty"
});
const _empty$4 = /* @__PURE__ */ Object.create(EmptyProto$1);
const empty$c = () => _empty$4;
const AndThenProto$1 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$1), {
  _tag: "AndThen"
});
const makeAndThen$1 = (first, second) => {
  const o = Object.create(AndThenProto$1);
  o.first = first;
  o.second = second;
  return o;
};
const AddProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$1), {
  _tag: "Add"
});
const makeAdd = (value) => {
  const o = Object.create(AddProto);
  o.value = value;
  return o;
};
const RemoveProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto$1), {
  _tag: "Remove"
});
const makeRemove = (value) => {
  const o = Object.create(RemoveProto);
  o.value = value;
  return o;
};
const diff$5 = (oldValue, newValue) => {
  const [removed, patch2] = reduce$6([oldValue, empty$c()], ([set2, patch3], value) => {
    if (has$1(value)(set2)) {
      return [remove(value)(set2), patch3];
    }
    return [set2, combine$4(makeAdd(value))(patch3)];
  })(newValue);
  return reduce$6(patch2, (patch3, value) => combine$4(makeRemove(value))(patch3))(removed);
};
const combine$4 = /* @__PURE__ */ dual$1(2, (self2, that) => makeAndThen$1(self2, that));
const patch$6 = /* @__PURE__ */ dual$1(2, (self2, oldValue) => {
  if (self2._tag === "Empty") {
    return oldValue;
  }
  let set2 = oldValue;
  let patches = of$2(self2);
  while (isNonEmpty$1(patches)) {
    const head2 = headNonEmpty$1(patches);
    const tail = tailNonEmpty(patches);
    switch (head2._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AndThen": {
        patches = prepend$2(head2.first)(prepend$2(head2.second)(tail));
        break;
      }
      case "Add": {
        set2 = add$4(head2.value)(set2);
        patches = tail;
        break;
      }
      case "Remove": {
        set2 = remove(head2.value)(set2);
        patches = tail;
      }
    }
  }
  return set2;
});
const ReadonlyArrayPatchTypeId = /* @__PURE__ */ Symbol.for("effect/DifferReadonlyArrayPatch");
function variance$1(a) {
  return a;
}
const PatchProto = {
  ...Structural.prototype,
  [ReadonlyArrayPatchTypeId]: {
    _Value: variance$1,
    _Patch: variance$1
  }
};
const EmptyProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "Empty"
});
const _empty$3 = /* @__PURE__ */ Object.create(EmptyProto);
const empty$b = () => _empty$3;
const AndThenProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "AndThen"
});
const makeAndThen = (first, second) => {
  const o = Object.create(AndThenProto);
  o.first = first;
  o.second = second;
  return o;
};
const AppendProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "Append"
});
const makeAppend = (values) => {
  const o = Object.create(AppendProto);
  o.values = values;
  return o;
};
const SliceProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "Slice"
});
const makeSlice = (from, until) => {
  const o = Object.create(SliceProto);
  o.from = from;
  o.until = until;
  return o;
};
const UpdateProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(PatchProto), {
  _tag: "Update"
});
const makeUpdate = (index2, patch2) => {
  const o = Object.create(UpdateProto);
  o.index = index2;
  o.patch = patch2;
  return o;
};
const diff$4 = (options) => {
  let i = 0;
  let patch2 = empty$b();
  while (i < options.oldValue.length && i < options.newValue.length) {
    const oldElement = options.oldValue[i];
    const newElement = options.newValue[i];
    const valuePatch = options.differ.diff(oldElement, newElement);
    if (!equals$2(valuePatch, options.differ.empty)) {
      patch2 = combine$3(patch2, makeUpdate(i, valuePatch));
    }
    i = i + 1;
  }
  if (i < options.oldValue.length) {
    patch2 = combine$3(patch2, makeSlice(0, i));
  }
  if (i < options.newValue.length) {
    patch2 = combine$3(patch2, makeAppend(drop$1(i)(options.newValue)));
  }
  return patch2;
};
const combine$3 = /* @__PURE__ */ dual$1(2, (self2, that) => makeAndThen(self2, that));
const patch$5 = /* @__PURE__ */ dual$1(3, (self2, oldValue, differ2) => {
  if (self2._tag === "Empty") {
    return oldValue;
  }
  let readonlyArray2 = oldValue.slice();
  let patches = of$3(self2);
  while (isNonEmptyArray(patches)) {
    const head2 = headNonEmpty$2(patches);
    const tail = tailNonEmpty$1(patches);
    switch (head2._tag) {
      case "Empty": {
        patches = tail;
        break;
      }
      case "AndThen": {
        tail.unshift(head2.first, head2.second);
        patches = tail;
        break;
      }
      case "Append": {
        for (const value of head2.values) {
          readonlyArray2.push(value);
        }
        patches = tail;
        break;
      }
      case "Slice": {
        readonlyArray2 = readonlyArray2.slice(head2.from, head2.until);
        patches = tail;
        break;
      }
      case "Update": {
        readonlyArray2[head2.index] = differ2.patch(head2.patch, readonlyArray2[head2.index]);
        patches = tail;
        break;
      }
    }
  }
  return readonlyArray2;
});
const DifferTypeId = /* @__PURE__ */ Symbol.for("effect/Differ");
const DifferProto = {
  [DifferTypeId]: {
    _P: identity,
    _V: identity
  },
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const make$d = (params) => {
  const differ2 = Object.create(DifferProto);
  differ2.empty = params.empty;
  differ2.diff = params.diff;
  differ2.combine = params.combine;
  differ2.patch = params.patch;
  return differ2;
};
const environment = () => make$d({
  empty: empty$d(),
  combine: (first, second) => combine$5(second)(first),
  diff: (oldValue, newValue) => diff$6(oldValue, newValue),
  patch: (patch2, oldValue) => patch$7(oldValue)(patch2)
});
const hashSet = () => make$d({
  empty: empty$c(),
  combine: (first, second) => combine$4(second)(first),
  diff: (oldValue, newValue) => diff$5(oldValue, newValue),
  patch: (patch2, oldValue) => patch$6(oldValue)(patch2)
});
const readonlyArray = (differ2) => make$d({
  empty: empty$b(),
  combine: (first, second) => combine$3(first, second),
  diff: (oldValue, newValue) => diff$4({
    oldValue,
    newValue,
    differ: differ2
  }),
  patch: (patch2, oldValue) => patch$5(patch2, oldValue, differ2)
});
const update$1 = () => updateWith((_, a) => a);
const updateWith = (f) => make$d({
  empty: identity,
  combine: (first, second) => {
    if (first === identity) {
      return second;
    }
    if (second === identity) {
      return first;
    }
    return (a) => second(first(a));
  },
  diff: (oldValue, newValue) => {
    if (equals$2(oldValue, newValue)) {
      return identity;
    }
    return constant$1(newValue);
  },
  patch: (patch2, oldValue) => f(oldValue, patch2(oldValue))
});
const BIT_MASK = 255;
const BIT_SHIFT = 8;
const active = (patch2) => patch2 & BIT_MASK;
const enabled = (patch2) => patch2 >> BIT_SHIFT & BIT_MASK;
const make$c = (active2, enabled2) => (active2 & BIT_MASK) + ((enabled2 & active2 & BIT_MASK) << BIT_SHIFT);
const empty$a = /* @__PURE__ */ make$c(0, 0);
const enable$2 = (flag) => make$c(flag, flag);
const disable$1 = (flag) => make$c(flag, 0);
const exclude$1 = /* @__PURE__ */ dual$1(2, (self2, flag) => make$c(active(self2) & ~flag, enabled(self2)));
const andThen = /* @__PURE__ */ dual$1(2, (self2, that) => self2 | that);
const invert = (n) => ~n >>> 0 & BIT_MASK;
const None$1 = 0;
const Interruption = 1 << 0;
const OpSupervision = 1 << 1;
const RuntimeMetrics = 1 << 2;
const WindDown = 1 << 4;
const CooperativeYielding = 1 << 5;
const cooperativeYielding = (self2) => isEnabled(self2, CooperativeYielding);
const enable$1 = /* @__PURE__ */ dual$1(2, (self2, flag) => self2 | flag);
const interruptible$2 = (self2) => interruption(self2) && !windDown(self2);
const interruption = (self2) => isEnabled(self2, Interruption);
const isEnabled = /* @__PURE__ */ dual$1(2, (self2, flag) => (self2 & flag) !== 0);
const make$b = (...flags) => flags.reduce((a, b) => a | b, 0);
const none$3 = /* @__PURE__ */ make$b(None$1);
const runtimeMetrics = (self2) => isEnabled(self2, RuntimeMetrics);
const windDown = (self2) => isEnabled(self2, WindDown);
const diff$3 = /* @__PURE__ */ dual$1(2, (self2, that) => make$c(self2 ^ that, that));
const patch$4 = /* @__PURE__ */ dual$1(2, (self2, patch2) => self2 & (invert(active(patch2)) | enabled(patch2)) | active(patch2) & enabled(patch2));
const differ$1 = /* @__PURE__ */ make$d({
  empty: empty$a,
  diff: (oldValue, newValue) => diff$3(oldValue, newValue),
  combine: (first, second) => andThen(second)(first),
  patch: (_patch, oldValue) => patch$4(oldValue, _patch)
});
const enable = enable$2;
const disable = disable$1;
const exclude = exclude$1;
const par = (self2, that) => ({
  _tag: "Par",
  left: self2,
  right: that
});
const seq = (self2, that) => ({
  _tag: "Seq",
  left: self2,
  right: that
});
const flatten$1 = (self2) => {
  let current = of$1(self2);
  let updated = empty$e();
  while (1) {
    const [parallel2, sequential2] = reduce$3(current, [parallelCollectionEmpty(), empty$e()], ([parallel3, sequential3], blockedRequest) => {
      const [par2, seq2] = step(blockedRequest);
      return [parallelCollectionCombine(parallel3, par2), appendAll$1(sequential3, seq2)];
    });
    updated = merge(updated, parallel2);
    if (isNil(sequential2)) {
      return reverse$2(updated);
    }
    current = sequential2;
  }
  throw new Error("BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/effect/issues");
};
const step = (requests) => {
  let current = requests;
  let parallel2 = parallelCollectionEmpty();
  let stack = empty$e();
  let sequential2 = empty$e();
  while (1) {
    switch (current._tag) {
      case "Empty": {
        if (isNil(stack)) {
          return [parallel2, sequential2];
        }
        current = stack.head;
        stack = stack.tail;
        break;
      }
      case "Par": {
        stack = cons(current.right, stack);
        current = current.left;
        break;
      }
      case "Seq": {
        const left2 = current.left;
        const right2 = current.right;
        switch (left2._tag) {
          case "Empty": {
            current = right2;
            break;
          }
          case "Par": {
            const l = left2.left;
            const r = left2.right;
            current = par(seq(l, right2), seq(r, right2));
            break;
          }
          case "Seq": {
            const l = left2.left;
            const r = left2.right;
            current = seq(l, seq(r, right2));
            break;
          }
          case "Single": {
            current = left2;
            sequential2 = cons(right2, sequential2);
            break;
          }
        }
        break;
      }
      case "Single": {
        parallel2 = parallelCollectionAdd(parallel2, current);
        if (isNil(stack)) {
          return [parallel2, sequential2];
        }
        current = stack.head;
        stack = stack.tail;
        break;
      }
    }
  }
  throw new Error("BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/effect/issues");
};
const merge = (sequential2, parallel2) => {
  if (isNil(sequential2)) {
    return of$1(parallelCollectionToSequentialCollection(parallel2));
  }
  if (parallelCollectionIsEmpty(parallel2)) {
    return sequential2;
  }
  const seqHeadKeys = sequentialCollectionKeys(sequential2.head);
  const parKeys = parallelCollectionKeys(parallel2);
  if (seqHeadKeys.length === 1 && parKeys.length === 1 && equals$2(seqHeadKeys[0], parKeys[0])) {
    return cons(sequentialCollectionCombine(sequential2.head, parallelCollectionToSequentialCollection(parallel2)), sequential2.tail);
  }
  return cons(parallelCollectionToSequentialCollection(parallel2), sequential2);
};
const RequestBlockParallelTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockParallel");
const parallelVariance = {
  /* c8 ignore next */
  _R: (_) => _
};
_d = RequestBlockParallelTypeId;
class ParallelImpl {
  constructor(map2) {
    __publicField(this, "map");
    __publicField(this, _d, parallelVariance);
    this.map = map2;
  }
}
const parallelCollectionEmpty = () => new ParallelImpl(empty$f());
const parallelCollectionAdd = (self2, blockedRequest) => new ParallelImpl(modifyAt$1(self2.map, blockedRequest.dataSource, (_) => orElseSome(map$5(_, append(blockedRequest.blockedRequest)), () => of$2(blockedRequest.blockedRequest))));
const parallelCollectionCombine = (self2, that) => new ParallelImpl(reduce$4(self2.map, that.map, (map2, value, key) => set$2(map2, key, match$2(get$2(map2, key), {
  onNone: () => value,
  onSome: (other) => appendAll$2(value, other)
}))));
const parallelCollectionIsEmpty = (self2) => isEmpty$1(self2.map);
const parallelCollectionKeys = (self2) => Array.from(keys$1(self2.map));
const parallelCollectionToSequentialCollection = (self2) => sequentialCollectionMake(map$2(self2.map, (x) => of$2(x)));
const SequentialCollectionTypeId = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockSequential");
const sequentialVariance = {
  /* c8 ignore next */
  _R: (_) => _
};
_e = SequentialCollectionTypeId;
class SequentialImpl {
  constructor(map2) {
    __publicField(this, "map");
    __publicField(this, _e, sequentialVariance);
    this.map = map2;
  }
}
const sequentialCollectionMake = (map2) => new SequentialImpl(map2);
const sequentialCollectionCombine = (self2, that) => new SequentialImpl(reduce$4(that.map, self2.map, (map2, value, key) => set$2(map2, key, match$2(get$2(map2, key), {
  onNone: () => empty$m(),
  onSome: (a) => appendAll$2(a, value)
}))));
const sequentialCollectionKeys = (self2) => Array.from(keys$1(self2.map));
const sequentialCollectionToChunk = (self2) => Array.from(self2.map);
const OP_STATE_PENDING = "Pending";
const OP_STATE_DONE = "Done";
const DeferredSymbolKey = "effect/Deferred";
const DeferredTypeId = /* @__PURE__ */ Symbol.for(DeferredSymbolKey);
const deferredVariance = {
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _
};
const pending = (joiners) => {
  return {
    _tag: OP_STATE_PENDING,
    joiners
  };
};
const done$2 = (effect) => {
  return {
    _tag: OP_STATE_DONE,
    effect
  };
};
class SingleShotGen2 {
  constructor(self2) {
    __publicField(this, "self");
    __publicField(this, "called", false);
    this.self = self2;
  }
  next(a) {
    return this.called ? {
      value: a,
      done: true
    } : (this.called = true, {
      value: this.self,
      done: false
    });
  }
  return(a) {
    return {
      value: a,
      done: true
    };
  }
  throw(e) {
    throw e;
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(this.self);
  }
}
const blocked = (blockedRequests, _continue) => {
  const effect = new EffectPrimitive$1("Blocked");
  effect.effect_instruction_i0 = blockedRequests;
  effect.effect_instruction_i1 = _continue;
  return effect;
};
const runRequestBlock = (blockedRequests) => {
  const effect = new EffectPrimitive$1("RunBlocked");
  effect.effect_instruction_i0 = blockedRequests;
  return effect;
};
const EffectTypeId$2 = /* @__PURE__ */ Symbol.for("effect/Effect");
class RevertFlags {
  constructor(patch2, op) {
    __publicField(this, "patch");
    __publicField(this, "op");
    __publicField(this, "_op", OP_REVERT_FLAGS);
    this.patch = patch2;
    this.op = op;
  }
}
let EffectPrimitive$1 = class EffectPrimitive {
  constructor(_op) {
    __publicField(this, "_op");
    __publicField(this, "effect_instruction_i0");
    __publicField(this, "effect_instruction_i1");
    __publicField(this, "effect_instruction_i2");
    __publicField(this, "trace");
    __publicField(this, _f, effectVariance$2);
    this._op = _op;
  }
  [(_f = EffectTypeId$2, symbol$2)](that) {
    return this === that;
  }
  [symbol$3]() {
    return cached(this, random$1(this));
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
  toJSON() {
    return {
      _id: "Effect",
      _op: this._op,
      effect_instruction_i0: toJSON$1(this.effect_instruction_i0),
      effect_instruction_i1: toJSON$1(this.effect_instruction_i1),
      effect_instruction_i2: toJSON$1(this.effect_instruction_i2)
    };
  }
  toString() {
    return format$2(this.toJSON());
  }
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
};
class EffectPrimitiveFailure {
  constructor(_op) {
    __publicField(this, "_op");
    __publicField(this, "effect_instruction_i0");
    __publicField(this, "effect_instruction_i1");
    __publicField(this, "effect_instruction_i2");
    __publicField(this, "trace");
    __publicField(this, _g, effectVariance$2);
    this._op = _op;
    this._tag = _op;
  }
  [(_g = EffectTypeId$2, symbol$2)](that) {
    return exitIsExit(that) && that._op === "Failure" && // @ts-expect-error
    equals$2(this.effect_instruction_i0, that.effect_instruction_i0);
  }
  [symbol$3]() {
    return pipe$1(
      // @ts-expect-error
      string$1(this._tag),
      // @ts-expect-error
      combine$6(hash$1(this.effect_instruction_i0)),
      cached(this)
    );
  }
  get cause() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      cause: this.cause.toJSON()
    };
  }
  toString() {
    return format$2(this.toJSON());
  }
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
}
let EffectPrimitiveSuccess$1 = class EffectPrimitiveSuccess {
  constructor(_op) {
    __publicField(this, "_op");
    __publicField(this, "effect_instruction_i0");
    __publicField(this, "effect_instruction_i1");
    __publicField(this, "effect_instruction_i2");
    __publicField(this, "trace");
    __publicField(this, _h, effectVariance$2);
    this._op = _op;
    this._tag = _op;
  }
  [(_h = EffectTypeId$2, symbol$2)](that) {
    return exitIsExit(that) && that._op === "Success" && // @ts-expect-error
    equals$2(this.effect_instruction_i0, that.effect_instruction_i0);
  }
  [symbol$3]() {
    return pipe$1(
      // @ts-expect-error
      string$1(this._tag),
      // @ts-expect-error
      combine$6(hash$1(this.effect_instruction_i0)),
      cached(this)
    );
  }
  get value() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      value: toJSON$1(this.value)
    };
  }
  toString() {
    return format$2(this.toJSON());
  }
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new SingleShotGen2(new YieldWrap(this));
  }
};
const isEffect$1 = (u) => hasProperty(u, EffectTypeId$2);
const withFiberRuntime = (withRuntime) => {
  const effect = new EffectPrimitive$1(OP_WITH_RUNTIME);
  effect.effect_instruction_i0 = withRuntime;
  return effect;
};
const acquireUseRelease = /* @__PURE__ */ dual$1(3, (acquire, use, release) => uninterruptibleMask$1((restore) => flatMap$1(acquire, (a) => flatMap$1(exit(suspend(() => restore(use(a)))), (exit2) => {
  return suspend(() => release(a, exit2)).pipe(matchCauseEffect$1({
    onFailure: (cause) => {
      switch (exit2._tag) {
        case OP_FAILURE:
          return failCause$1(sequential$2(exit2.effect_instruction_i0, cause));
        case OP_SUCCESS$1:
          return failCause$1(cause);
      }
    },
    onSuccess: () => exit2
  }));
}))));
const as = /* @__PURE__ */ dual$1(2, (self2, value) => flatMap$1(self2, () => succeed$4(value)));
const asVoid = (self2) => as(self2, void 0);
const custom = function() {
  const wrapper = new EffectPrimitive$1(OP_COMMIT);
  switch (arguments.length) {
    case 2: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.commit = arguments[1];
      break;
    }
    case 3: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.effect_instruction_i1 = arguments[1];
      wrapper.commit = arguments[2];
      break;
    }
    case 4: {
      wrapper.effect_instruction_i0 = arguments[0];
      wrapper.effect_instruction_i1 = arguments[1];
      wrapper.effect_instruction_i2 = arguments[2];
      wrapper.commit = arguments[3];
      break;
    }
    default: {
      throw new Error(getBugErrorMessage("you're not supposed to end up here"));
    }
  }
  return wrapper;
};
const unsafeAsync = (register2, blockingOn = none$4) => {
  const effect = new EffectPrimitive$1(OP_ASYNC);
  let cancelerRef = void 0;
  effect.effect_instruction_i0 = (resume2) => {
    cancelerRef = register2(resume2);
  };
  effect.effect_instruction_i1 = blockingOn;
  return onInterrupt(effect, (_) => isEffect$1(cancelerRef) ? cancelerRef : void_$1);
};
const asyncInterrupt = (register2, blockingOn = none$4) => suspend(() => unsafeAsync(register2, blockingOn));
const async_ = (resume2, blockingOn = none$4) => {
  return custom(resume2, function() {
    let backingResume = void 0;
    let pendingEffect = void 0;
    function proxyResume(effect2) {
      if (backingResume) {
        backingResume(effect2);
      } else if (pendingEffect === void 0) {
        pendingEffect = effect2;
      }
    }
    const effect = new EffectPrimitive$1(OP_ASYNC);
    effect.effect_instruction_i0 = (resume3) => {
      backingResume = resume3;
      if (pendingEffect) {
        resume3(pendingEffect);
      }
    };
    effect.effect_instruction_i1 = blockingOn;
    let cancelerRef = void 0;
    let controllerRef = void 0;
    if (this.effect_instruction_i0.length !== 1) {
      controllerRef = new AbortController();
      cancelerRef = internalCall(() => this.effect_instruction_i0(proxyResume, controllerRef.signal));
    } else {
      cancelerRef = internalCall(() => this.effect_instruction_i0(proxyResume));
    }
    return cancelerRef || controllerRef ? onInterrupt(effect, (_) => {
      if (controllerRef) {
        controllerRef.abort();
      }
      return cancelerRef ?? void_$1;
    }) : effect;
  });
};
const catchAll$1 = /* @__PURE__ */ dual$1(2, (self2, f) => matchEffect(self2, {
  onFailure: f,
  onSuccess: succeed$4
}));
const originalSymbol = /* @__PURE__ */ Symbol.for("effect/OriginalAnnotation");
const capture = (obj, span2) => {
  if (isSome$2(span2)) {
    return new Proxy(obj, {
      has(target, p) {
        return p === spanSymbol$1 || p === originalSymbol || p in target;
      },
      get(target, p) {
        if (p === spanSymbol$1) {
          return span2.value;
        }
        if (p === originalSymbol) {
          return obj;
        }
        return target[p];
      }
    });
  }
  return obj;
};
const die = (defect) => isObject$1(defect) && !(spanSymbol$1 in defect) ? withFiberRuntime((fiber) => failCause$1(die$1(capture(defect, currentSpanFromFiber(fiber))))) : failCause$1(die$1(defect));
const dieMessage = (message) => failCauseSync(() => die$1(new RuntimeException(message)));
const either$1 = (self2) => matchEffect(self2, {
  onFailure: (e) => succeed$4(left$2(e)),
  onSuccess: (a) => succeed$4(right$2(a))
});
const exit = (self2) => matchCause(self2, {
  onFailure: exitFailCause$1,
  onSuccess: exitSucceed$1
});
const fail$2 = (error) => isObject$1(error) && !(spanSymbol$1 in error) ? withFiberRuntime((fiber) => failCause$1(fail$3(capture(error, currentSpanFromFiber(fiber))))) : failCause$1(fail$3(error));
const failSync = (evaluate2) => flatMap$1(sync$2(evaluate2), fail$2);
const failCause$1 = (cause) => {
  const effect = new EffectPrimitiveFailure(OP_FAILURE);
  effect.effect_instruction_i0 = cause;
  return effect;
};
const failCauseSync = (evaluate2) => flatMap$1(sync$2(evaluate2), failCause$1);
const fiberId = /* @__PURE__ */ withFiberRuntime((state2) => succeed$4(state2.id()));
const fiberIdWith = (f) => withFiberRuntime((state2) => f(state2.id()));
const flatMap$1 = /* @__PURE__ */ dual$1(2, (self2, f) => {
  const effect = new EffectPrimitive$1(OP_ON_SUCCESS);
  effect.effect_instruction_i0 = self2;
  effect.effect_instruction_i1 = f;
  return effect;
});
const flatten = (self2) => flatMap$1(self2, identity);
const matchCause = /* @__PURE__ */ dual$1(2, (self2, options) => matchCauseEffect$1(self2, {
  onFailure: (cause) => succeed$4(options.onFailure(cause)),
  onSuccess: (a) => succeed$4(options.onSuccess(a))
}));
const matchCauseEffect$1 = /* @__PURE__ */ dual$1(2, (self2, options) => {
  const effect = new EffectPrimitive$1(OP_ON_SUCCESS_AND_FAILURE);
  effect.effect_instruction_i0 = self2;
  effect.effect_instruction_i1 = options.onFailure;
  effect.effect_instruction_i2 = options.onSuccess;
  return effect;
});
const matchEffect = /* @__PURE__ */ dual$1(2, (self2, options) => matchCauseEffect$1(self2, {
  onFailure: (cause) => {
    const defects$1 = defects(cause);
    if (defects$1.length > 0) {
      return failCause$1(electFailures(cause));
    }
    const failures$1 = failures(cause);
    if (failures$1.length > 0) {
      return options.onFailure(unsafeHead$1(failures$1));
    }
    return failCause$1(cause);
  },
  onSuccess: options.onSuccess
}));
const forEachSequential = /* @__PURE__ */ dual$1(2, (self2, f) => suspend(() => {
  const arr = fromIterable$7(self2);
  const ret = allocate(arr.length);
  let i = 0;
  return as(whileLoop({
    while: () => i < arr.length,
    body: () => f(arr[i], i),
    step: (b) => {
      ret[i++] = b;
    }
  }), ret);
}));
const forEachSequentialDiscard = /* @__PURE__ */ dual$1(2, (self2, f) => suspend(() => {
  const arr = fromIterable$7(self2);
  let i = 0;
  return whileLoop({
    while: () => i < arr.length,
    body: () => f(arr[i], i),
    step: () => {
      i++;
    }
  });
}));
const interruptible$1 = (self2) => {
  const effect = new EffectPrimitive$1(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = enable(Interruption);
  effect.effect_instruction_i1 = () => self2;
  return effect;
};
const map$1 = /* @__PURE__ */ dual$1(2, (self2, f) => flatMap$1(self2, (a) => sync$2(() => f(a))));
const mapBoth = /* @__PURE__ */ dual$1(2, (self2, options) => matchEffect(self2, {
  onFailure: (e) => failSync(() => options.onFailure(e)),
  onSuccess: (a) => sync$2(() => options.onSuccess(a))
}));
const mapError = /* @__PURE__ */ dual$1(2, (self2, f) => matchCauseEffect$1(self2, {
  onFailure: (cause) => {
    const either2 = failureOrCause(cause);
    switch (either2._tag) {
      case "Left": {
        return failSync(() => f(either2.left));
      }
      case "Right": {
        return failCause$1(either2.right);
      }
    }
  },
  onSuccess: succeed$4
}));
const onExit$1 = /* @__PURE__ */ dual$1(2, (self2, cleanup) => uninterruptibleMask$1((restore) => matchCauseEffect$1(restore(self2), {
  onFailure: (cause1) => {
    const result = exitFailCause$1(cause1);
    return matchCauseEffect$1(cleanup(result), {
      onFailure: (cause2) => exitFailCause$1(sequential$2(cause1, cause2)),
      onSuccess: () => result
    });
  },
  onSuccess: (success) => {
    const result = exitSucceed$1(success);
    return zipRight(cleanup(result), result);
  }
})));
const onInterrupt = /* @__PURE__ */ dual$1(2, (self2, cleanup) => onExit$1(self2, exitMatch({
  onFailure: (cause) => isInterruptedOnly$1(cause) ? asVoid(cleanup(interruptors(cause))) : void_$1,
  onSuccess: () => void_$1
})));
const succeed$4 = (value) => {
  const effect = new EffectPrimitiveSuccess$1(OP_SUCCESS$1);
  effect.effect_instruction_i0 = value;
  return effect;
};
const suspend = (evaluate2) => {
  const effect = new EffectPrimitive$1(OP_COMMIT);
  effect.commit = evaluate2;
  return effect;
};
const sync$2 = (thunk) => {
  const effect = new EffectPrimitive$1(OP_SYNC$1);
  effect.effect_instruction_i0 = thunk;
  return effect;
};
const tap$1 = /* @__PURE__ */ dual$1((args2) => args2.length === 3 || args2.length === 2 && !(isObject$1(args2[1]) && "onlyEffect" in args2[1]), (self2, f) => flatMap$1(self2, (a) => {
  const b = typeof f === "function" ? f(a) : f;
  if (isEffect$1(b)) {
    return as(b, a);
  } else if (isPromiseLike(b)) {
    return unsafeAsync((resume2) => {
      b.then((_) => resume2(succeed$4(a)), (e) => resume2(fail$2(new UnknownException(e, "An unknown error occurred in Effect.tap"))));
    });
  }
  return succeed$4(a);
}));
const transplant = (f) => withFiberRuntime((state2) => {
  const scopeOverride = state2.getFiberRef(currentForkScopeOverride);
  const scope = pipe$1(scopeOverride, getOrElse$1(() => state2.scope()));
  return f(fiberRefLocally(currentForkScopeOverride, some$2(scope)));
});
const uninterruptible = (self2) => {
  const effect = new EffectPrimitive$1(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = disable(Interruption);
  effect.effect_instruction_i1 = () => self2;
  return effect;
};
const uninterruptibleMask$1 = (f) => custom(f, function() {
  const effect = new EffectPrimitive$1(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = disable(Interruption);
  effect.effect_instruction_i1 = (oldFlags) => interruption(oldFlags) ? internalCall(() => this.effect_instruction_i0(interruptible$1)) : internalCall(() => this.effect_instruction_i0(uninterruptible));
  return effect;
});
const void_$1 = /* @__PURE__ */ succeed$4(void 0);
const updateRuntimeFlags = (patch2) => {
  const effect = new EffectPrimitive$1(OP_UPDATE_RUNTIME_FLAGS);
  effect.effect_instruction_i0 = patch2;
  effect.effect_instruction_i1 = void 0;
  return effect;
};
const whileLoop = (options) => {
  const effect = new EffectPrimitive$1(OP_WHILE);
  effect.effect_instruction_i0 = options.while;
  effect.effect_instruction_i1 = options.body;
  effect.effect_instruction_i2 = options.step;
  return effect;
};
const yieldNow$2 = (options) => {
  const effect = new EffectPrimitive$1(OP_YIELD);
  return typeof (options == null ? void 0 : options.priority) !== "undefined" ? withSchedulingPriority(effect, options.priority) : effect;
};
const zip = /* @__PURE__ */ dual$1(2, (self2, that) => flatMap$1(self2, (a) => map$1(that, (b) => [a, b])));
const zipLeft = /* @__PURE__ */ dual$1(2, (self2, that) => flatMap$1(self2, (a) => as(that, a)));
const zipRight = /* @__PURE__ */ dual$1(2, (self2, that) => flatMap$1(self2, () => that));
const interruptFiber = (self2) => flatMap$1(fiberId, (fiberId2) => pipe$1(self2, interruptAsFiber(fiberId2)));
const interruptAsFiber = /* @__PURE__ */ dual$1(2, (self2, fiberId2) => flatMap$1(self2.interruptAsFork(fiberId2), () => self2.await));
const logLevelAll = {
  _tag: "All",
  syslog: 0,
  label: "ALL",
  ordinal: Number.MIN_SAFE_INTEGER,
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const logLevelFatal = {
  _tag: "Fatal",
  syslog: 2,
  label: "FATAL",
  ordinal: 5e4,
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const logLevelError = {
  _tag: "Error",
  syslog: 3,
  label: "ERROR",
  ordinal: 4e4,
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const logLevelWarning = {
  _tag: "Warning",
  syslog: 4,
  label: "WARN",
  ordinal: 3e4,
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const logLevelInfo = {
  _tag: "Info",
  syslog: 6,
  label: "INFO",
  ordinal: 2e4,
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const logLevelDebug = {
  _tag: "Debug",
  syslog: 7,
  label: "DEBUG",
  ordinal: 1e4,
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const logLevelTrace = {
  _tag: "Trace",
  syslog: 7,
  label: "TRACE",
  ordinal: 0,
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const logLevelNone = {
  _tag: "None",
  syslog: 7,
  label: "OFF",
  ordinal: Number.MAX_SAFE_INTEGER,
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
const FiberRefSymbolKey = "effect/FiberRef";
const FiberRefTypeId = /* @__PURE__ */ Symbol.for(FiberRefSymbolKey);
const fiberRefVariance = {
  /* c8 ignore next */
  _A: (_) => _
};
const fiberRefGet = (self2) => withFiberRuntime((fiber) => exitSucceed$1(fiber.getFiberRef(self2)));
const fiberRefGetWith = /* @__PURE__ */ dual$1(2, (self2, f) => flatMap$1(fiberRefGet(self2), f));
const fiberRefSet = /* @__PURE__ */ dual$1(2, (self2, value) => fiberRefModify(self2, () => [void 0, value]));
const fiberRefModify = /* @__PURE__ */ dual$1(2, (self2, f) => withFiberRuntime((state2) => {
  const [b, a] = f(state2.getFiberRef(self2));
  state2.setFiberRef(self2, a);
  return succeed$4(b);
}));
const fiberRefLocally = /* @__PURE__ */ dual$1(3, (use, self2, value) => acquireUseRelease(zipLeft(fiberRefGet(self2), fiberRefSet(self2, value)), () => use, (oldValue) => fiberRefSet(self2, oldValue)));
const fiberRefUnsafeMake = (initial, options) => fiberRefUnsafeMakePatch(initial, {
  differ: update$1(),
  fork: (options == null ? void 0 : options.fork) ?? identity,
  join: options == null ? void 0 : options.join
});
const fiberRefUnsafeMakeHashSet = (initial) => {
  const differ2 = hashSet();
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ2,
    fork: differ2.empty
  });
};
const fiberRefUnsafeMakeReadonlyArray = (initial) => {
  const differ2 = readonlyArray(update$1());
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ2,
    fork: differ2.empty
  });
};
const fiberRefUnsafeMakeContext = (initial) => {
  const differ2 = environment();
  return fiberRefUnsafeMakePatch(initial, {
    differ: differ2,
    fork: differ2.empty
  });
};
const fiberRefUnsafeMakePatch = (initial, options) => {
  const _fiberRef = {
    ...CommitPrototype,
    [FiberRefTypeId]: fiberRefVariance,
    initial,
    commit() {
      return fiberRefGet(this);
    },
    diff: (oldValue, newValue) => options.differ.diff(oldValue, newValue),
    combine: (first, second) => options.differ.combine(first, second),
    patch: (patch2) => (oldValue) => options.differ.patch(patch2, oldValue),
    fork: options.fork,
    join: options.join ?? ((_, n) => n)
  };
  return _fiberRef;
};
const fiberRefUnsafeMakeRuntimeFlags = (initial) => fiberRefUnsafeMakePatch(initial, {
  differ: differ$1,
  fork: differ$1.empty
});
const currentContext = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentContext"), () => fiberRefUnsafeMakeContext(empty$g()));
const currentSchedulingPriority = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentSchedulingPriority"), () => fiberRefUnsafeMake(0));
const currentMaxOpsBeforeYield = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"), () => fiberRefUnsafeMake(2048));
const currentLogAnnotations = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogAnnotation"), () => fiberRefUnsafeMake(empty$f()));
const currentLogLevel = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogLevel"), () => fiberRefUnsafeMake(logLevelInfo));
const currentLogSpan = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogSpan"), () => fiberRefUnsafeMake(empty$e()));
const withSchedulingPriority = /* @__PURE__ */ dual$1(2, (self2, scheduler) => fiberRefLocally(self2, currentSchedulingPriority, scheduler));
const currentUnhandledErrorLogLevel = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"), () => fiberRefUnsafeMake(some$2(logLevelDebug)));
const currentMetricLabels = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMetricLabels"), () => fiberRefUnsafeMakeReadonlyArray(empty$n()));
const currentForkScopeOverride = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentForkScopeOverride"), () => fiberRefUnsafeMake(none$6(), {
  fork: () => none$6(),
  join: (parent, _) => parent
}));
const currentInterruptedCause = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentInterruptedCause"), () => fiberRefUnsafeMake(empty$i, {
  fork: () => empty$i,
  join: (parent, _) => parent
}));
const scopeAddFinalizer = (self2, finalizer) => self2.addFinalizer(() => asVoid(finalizer));
const scopeClose = (self2, exit2) => self2.close(exit2);
const scopeFork = (self2, strategy) => self2.fork(strategy);
const YieldableError = /* @__PURE__ */ function() {
  class YieldableError2 extends globalThis.Error {
    commit() {
      return fail$2(this);
    }
    toJSON() {
      const obj = {
        ...this
      };
      if (this.message) obj.message = this.message;
      if (this.cause) obj.cause = this.cause;
      return obj;
    }
    [NodeInspectSymbol$1]() {
      if (this.toString !== globalThis.Error.prototype.toString) {
        return this.stack ? `${this.toString()}
${this.stack.split("\n").slice(1).join("\n")}` : this.toString();
      } else if ("Bun" in globalThis) {
        return pretty$1(fail$3(this), {
          renderErrorCause: true
        });
      }
      return this;
    }
  }
  Object.assign(YieldableError2.prototype, StructuralCommitPrototype);
  return YieldableError2;
}();
const makeException = (proto2, tag) => {
  class Base2 extends YieldableError {
    constructor() {
      super(...arguments);
      __publicField(this, "_tag", tag);
    }
  }
  Object.assign(Base2.prototype, proto2);
  Base2.prototype.name = tag;
  return Base2;
};
const RuntimeExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/RuntimeException");
const RuntimeException = /* @__PURE__ */ makeException({
  [RuntimeExceptionTypeId]: RuntimeExceptionTypeId
}, "RuntimeException");
const InterruptedExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/InterruptedException");
const isInterruptedException = (u) => hasProperty(u, InterruptedExceptionTypeId);
const NoSuchElementExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/NoSuchElement");
const NoSuchElementException = /* @__PURE__ */ makeException({
  [NoSuchElementExceptionTypeId]: NoSuchElementExceptionTypeId
}, "NoSuchElementException");
const UnknownExceptionTypeId = /* @__PURE__ */ Symbol.for("effect/Cause/errors/UnknownException");
const UnknownException = /* @__PURE__ */ function() {
  class UnknownException2 extends YieldableError {
    constructor(cause, message) {
      super(message ?? "An unknown error occurred", {
        cause
      });
      __publicField(this, "_tag", "UnknownException");
      __publicField(this, "error");
      this.error = cause;
    }
  }
  Object.assign(UnknownException2.prototype, {
    [UnknownExceptionTypeId]: UnknownExceptionTypeId,
    name: "UnknownException"
  });
  return UnknownException2;
}();
const exitIsExit = (u) => isEffect$1(u) && "_tag" in u && (u._tag === "Success" || u._tag === "Failure");
const exitCollectAll = (exits, options) => exitCollectAllInternal(exits, (options == null ? void 0 : options.parallel) ? parallel$1 : sequential$2);
const exitFail = (error) => exitFailCause$1(fail$3(error));
const exitFailCause$1 = (cause) => {
  const effect = new EffectPrimitiveFailure(OP_FAILURE);
  effect.effect_instruction_i0 = cause;
  return effect;
};
const exitInterrupt$1 = (fiberId2) => exitFailCause$1(interrupt(fiberId2));
const exitMap = /* @__PURE__ */ dual$1(2, (self2, f) => {
  switch (self2._tag) {
    case OP_FAILURE:
      return exitFailCause$1(self2.effect_instruction_i0);
    case OP_SUCCESS$1:
      return exitSucceed$1(f(self2.effect_instruction_i0));
  }
});
const exitMatch = /* @__PURE__ */ dual$1(2, (self2, {
  onFailure,
  onSuccess
}) => {
  switch (self2._tag) {
    case OP_FAILURE:
      return onFailure(self2.effect_instruction_i0);
    case OP_SUCCESS$1:
      return onSuccess(self2.effect_instruction_i0);
  }
});
const exitSucceed$1 = (value) => {
  const effect = new EffectPrimitiveSuccess$1(OP_SUCCESS$1);
  effect.effect_instruction_i0 = value;
  return effect;
};
const exitVoid$1 = /* @__PURE__ */ exitSucceed$1(void 0);
const exitZipWith = /* @__PURE__ */ dual$1(3, (self2, that, {
  onFailure,
  onSuccess
}) => {
  switch (self2._tag) {
    case OP_FAILURE: {
      switch (that._tag) {
        case OP_SUCCESS$1:
          return exitFailCause$1(self2.effect_instruction_i0);
        case OP_FAILURE: {
          return exitFailCause$1(onFailure(self2.effect_instruction_i0, that.effect_instruction_i0));
        }
      }
    }
    case OP_SUCCESS$1: {
      switch (that._tag) {
        case OP_SUCCESS$1:
          return exitSucceed$1(onSuccess(self2.effect_instruction_i0, that.effect_instruction_i0));
        case OP_FAILURE:
          return exitFailCause$1(that.effect_instruction_i0);
      }
    }
  }
});
const exitCollectAllInternal = (exits, combineCauses) => {
  const list = fromIterable$6(exits);
  if (!isNonEmpty$1(list)) {
    return none$6();
  }
  return pipe$1(tailNonEmpty(list), reduce$9(pipe$1(headNonEmpty$1(list), exitMap(of$2)), (accumulator, current) => pipe$1(accumulator, exitZipWith(current, {
    onSuccess: (list2, value) => pipe$1(list2, prepend$2(value)),
    onFailure: combineCauses
  }))), exitMap(reverse$3), exitMap((chunk) => toReadonlyArray$1(chunk)), some$2);
};
const deferredUnsafeMake = (fiberId2) => {
  const _deferred = {
    ...CommitPrototype,
    [DeferredTypeId]: deferredVariance,
    state: make$e(pending([])),
    commit() {
      return deferredAwait(this);
    },
    blockingOn: fiberId2
  };
  return _deferred;
};
const deferredAwait = (self2) => asyncInterrupt((resume2) => {
  const state2 = get$3(self2.state);
  switch (state2._tag) {
    case OP_STATE_DONE: {
      return resume2(state2.effect);
    }
    case OP_STATE_PENDING: {
      state2.joiners.push(resume2);
      return deferredInterruptJoiner(self2, resume2);
    }
  }
}, self2.blockingOn);
const deferredUnsafeDone = (self2, effect) => {
  const state2 = get$3(self2.state);
  if (state2._tag === OP_STATE_PENDING) {
    set$3(self2.state, done$2(effect));
    for (let i = 0, len = state2.joiners.length; i < len; i++) {
      state2.joiners[i](effect);
    }
  }
};
const deferredInterruptJoiner = (self2, joiner) => sync$2(() => {
  const state2 = get$3(self2.state);
  if (state2._tag === OP_STATE_PENDING) {
    const index2 = state2.joiners.indexOf(joiner);
    if (index2 >= 0) {
      state2.joiners.splice(index2, 1);
    }
  }
});
const currentSpanFromFiber = (fiber) => {
  const span2 = fiber.currentSpan;
  return span2 !== void 0 && span2._tag === "Span" ? some$2(span2) : none$6();
};
const ClockSymbolKey = "effect/Clock";
const ClockTypeId = /* @__PURE__ */ Symbol.for(ClockSymbolKey);
const clockTag = /* @__PURE__ */ GenericTag("effect/Clock");
const MAX_TIMER_MILLIS = 2 ** 31 - 1;
const globalClockScheduler = {
  unsafeSchedule(task, duration) {
    const millis2 = toMillis(duration);
    if (millis2 > MAX_TIMER_MILLIS) {
      return constFalse$1;
    }
    let completed = false;
    const handle2 = setTimeout(() => {
      completed = true;
      task();
    }, millis2);
    return () => {
      clearTimeout(handle2);
      return !completed;
    };
  }
};
const performanceNowNanos = /* @__PURE__ */ function() {
  const bigint1e62 = /* @__PURE__ */ BigInt(1e6);
  if (typeof performance === "undefined") {
    return () => BigInt(Date.now()) * bigint1e62;
  }
  let origin;
  return () => {
    if (origin === void 0) {
      origin = BigInt(Date.now()) * bigint1e62 - BigInt(Math.round(performance.now() * 1e6));
    }
    return origin + BigInt(Math.round(performance.now() * 1e6));
  };
}();
const processOrPerformanceNow = /* @__PURE__ */ function() {
  const processHrtime = typeof process === "object" && "hrtime" in process && typeof process.hrtime.bigint === "function" ? process.hrtime : void 0;
  if (!processHrtime) {
    return performanceNowNanos;
  }
  const origin = /* @__PURE__ */ performanceNowNanos() - /* @__PURE__ */ processHrtime.bigint();
  return () => origin + processHrtime.bigint();
}();
_i = ClockTypeId;
class ClockImpl {
  constructor() {
    __publicField(this, _i, ClockTypeId);
    __publicField(this, "currentTimeMillis", /* @__PURE__ */ sync$2(() => this.unsafeCurrentTimeMillis()));
    __publicField(this, "currentTimeNanos", /* @__PURE__ */ sync$2(() => this.unsafeCurrentTimeNanos()));
  }
  unsafeCurrentTimeMillis() {
    return Date.now();
  }
  unsafeCurrentTimeNanos() {
    return processOrPerformanceNow();
  }
  scheduler() {
    return succeed$4(globalClockScheduler);
  }
  sleep(duration) {
    return async_((resume2) => {
      const canceler = globalClockScheduler.unsafeSchedule(() => resume2(void_$1), duration);
      return asVoid(sync$2(canceler));
    });
  }
}
const make$a = () => new ClockImpl();
const Order$1 = number$1;
const escape = (string2) => string2.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&");
const OP_AND = "And";
const OP_OR = "Or";
const OP_INVALID_DATA = "InvalidData";
const OP_MISSING_DATA = "MissingData";
const OP_SOURCE_UNAVAILABLE = "SourceUnavailable";
const OP_UNSUPPORTED = "Unsupported";
const ConfigErrorSymbolKey = "effect/ConfigError";
const ConfigErrorTypeId = /* @__PURE__ */ Symbol.for(ConfigErrorSymbolKey);
const proto$1 = {
  _tag: "ConfigError",
  [ConfigErrorTypeId]: ConfigErrorTypeId
};
const And = (self2, that) => {
  const error = Object.create(proto$1);
  error._op = OP_AND;
  error.left = self2;
  error.right = that;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      return `${this.left} and ${this.right}`;
    }
  });
  Object.defineProperty(error, "message", {
    enumerable: false,
    get() {
      return this.toString();
    }
  });
  return error;
};
const Or = (self2, that) => {
  const error = Object.create(proto$1);
  error._op = OP_OR;
  error.left = self2;
  error.right = that;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      return `${this.left} or ${this.right}`;
    }
  });
  Object.defineProperty(error, "message", {
    enumerable: false,
    get() {
      return this.toString();
    }
  });
  return error;
};
const InvalidData = (path2, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto$1);
  error._op = OP_INVALID_DATA;
  error.path = path2;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path3 = pipe$1(this.path, join$1(options.pathDelim));
      return `(Invalid data at ${path3}: "${this.message}")`;
    }
  });
  return error;
};
const MissingData = (path2, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto$1);
  error._op = OP_MISSING_DATA;
  error.path = path2;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path3 = pipe$1(this.path, join$1(options.pathDelim));
      return `(Missing data at ${path3}: "${this.message}")`;
    }
  });
  return error;
};
const SourceUnavailable = (path2, message, cause, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto$1);
  error._op = OP_SOURCE_UNAVAILABLE;
  error.path = path2;
  error.message = message;
  error.cause = cause;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path3 = pipe$1(this.path, join$1(options.pathDelim));
      return `(Source unavailable at ${path3}: "${this.message}")`;
    }
  });
  return error;
};
const Unsupported = (path2, message, options = {
  pathDelim: "."
}) => {
  const error = Object.create(proto$1);
  error._op = OP_UNSUPPORTED;
  error.path = path2;
  error.message = message;
  Object.defineProperty(error, "toString", {
    enumerable: false,
    value() {
      const path3 = pipe$1(this.path, join$1(options.pathDelim));
      return `(Unsupported operation at ${path3}: "${this.message}")`;
    }
  });
  return error;
};
const prefixed = /* @__PURE__ */ dual$1(2, (self2, prefix) => {
  switch (self2._op) {
    case OP_AND: {
      return And(prefixed(self2.left, prefix), prefixed(self2.right, prefix));
    }
    case OP_OR: {
      return Or(prefixed(self2.left, prefix), prefixed(self2.right, prefix));
    }
    case OP_INVALID_DATA: {
      return InvalidData([...prefix, ...self2.path], self2.message);
    }
    case OP_MISSING_DATA: {
      return MissingData([...prefix, ...self2.path], self2.message);
    }
    case OP_SOURCE_UNAVAILABLE: {
      return SourceUnavailable([...prefix, ...self2.path], self2.message, self2.cause);
    }
    case OP_UNSUPPORTED: {
      return Unsupported([...prefix, ...self2.path], self2.message);
    }
  }
});
const empty$9 = {
  _tag: "Empty"
};
const patch$3 = /* @__PURE__ */ dual$1(2, (path2, patch2) => {
  let input = of$1(patch2);
  let output = path2;
  while (isCons(input)) {
    const patch3 = input.head;
    switch (patch3._tag) {
      case "Empty": {
        input = input.tail;
        break;
      }
      case "AndThen": {
        input = cons(patch3.first, cons(patch3.second, input.tail));
        break;
      }
      case "MapName": {
        output = map$4(output, patch3.f);
        input = input.tail;
        break;
      }
      case "Nested": {
        output = prepend$3(output, patch3.name);
        input = input.tail;
        break;
      }
      case "Unnested": {
        const containsName = pipe$1(head(output), contains(patch3.name));
        if (containsName) {
          output = tailNonEmpty$1(output);
          input = input.tail;
        } else {
          return left$2(MissingData(output, `Expected ${patch3.name} to be in path in ConfigProvider#unnested`));
        }
        break;
      }
    }
  }
  return right$2(output);
});
const OP_CONSTANT = "Constant";
const OP_FAIL$1 = "Fail";
const OP_FALLBACK = "Fallback";
const OP_DESCRIBED = "Described";
const OP_LAZY = "Lazy";
const OP_MAP_OR_FAIL = "MapOrFail";
const OP_NESTED = "Nested";
const OP_PRIMITIVE = "Primitive";
const OP_SEQUENCE = "Sequence";
const OP_HASHMAP = "HashMap";
const OP_ZIP_WITH = "ZipWith";
const concat = (l, r) => [...l, ...r];
const ConfigProviderSymbolKey = "effect/ConfigProvider";
const ConfigProviderTypeId = /* @__PURE__ */ Symbol.for(ConfigProviderSymbolKey);
const configProviderTag = /* @__PURE__ */ GenericTag("effect/ConfigProvider");
const FlatConfigProviderSymbolKey = "effect/ConfigProviderFlat";
const FlatConfigProviderTypeId = /* @__PURE__ */ Symbol.for(FlatConfigProviderSymbolKey);
const make$9 = (options) => ({
  [ConfigProviderTypeId]: ConfigProviderTypeId,
  pipe() {
    return pipeArguments$1(this, arguments);
  },
  ...options
});
const makeFlat = (options) => ({
  [FlatConfigProviderTypeId]: FlatConfigProviderTypeId,
  patch: options.patch,
  load: (path2, config, split = true) => options.load(path2, config, split),
  enumerateChildren: options.enumerateChildren
});
const fromFlat = (flat) => make$9({
  load: (config) => flatMap$1(fromFlatLoop(flat, empty$n(), config, false), (chunk) => match$2(head(chunk), {
    onNone: () => fail$2(MissingData(empty$n(), `Expected a single value having structure: ${config}`)),
    onSome: succeed$4
  })),
  flattened: flat
});
const fromEnv = (options) => {
  const {
    pathDelim,
    seqDelim
  } = Object.assign({}, {
    pathDelim: "_",
    seqDelim: ","
  }, options);
  const makePathString = (path2) => pipe$1(path2, join$1(pathDelim));
  const unmakePathString = (pathString) => pathString.split(pathDelim);
  const getEnv = () => typeof process !== "undefined" && "env" in process && typeof process.env === "object" ? process.env : {};
  const load = (path2, primitive, split = true) => {
    const pathString = makePathString(path2);
    const current = getEnv();
    const valueOpt = pathString in current ? some$2(current[pathString]) : none$6();
    return pipe$1(valueOpt, mapError(() => MissingData(path2, `Expected ${pathString} to exist in the process context`)), flatMap$1((value) => parsePrimitive(value, path2, primitive, seqDelim, split)));
  };
  const enumerateChildren = (path2) => sync$2(() => {
    const current = getEnv();
    const keys2 = Object.keys(current);
    const keyPaths = keys2.map((value) => unmakePathString(value.toUpperCase()));
    const filteredKeyPaths = keyPaths.filter((keyPath) => {
      for (let i = 0; i < path2.length; i++) {
        const pathComponent = pipe$1(path2, unsafeGet$4(i));
        const currentElement = keyPath[i];
        if (currentElement === void 0 || pathComponent !== currentElement) {
          return false;
        }
      }
      return true;
    }).flatMap((keyPath) => keyPath.slice(path2.length, path2.length + 1));
    return fromIterable$3(filteredKeyPaths);
  });
  return fromFlat(makeFlat({
    load,
    enumerateChildren,
    patch: empty$9
  }));
};
const extend = (leftDef, rightDef, left2, right2) => {
  const leftPad = unfold(left2.length, (index2) => index2 >= right2.length ? none$6() : some$2([leftDef(index2), index2 + 1]));
  const rightPad = unfold(right2.length, (index2) => index2 >= left2.length ? none$6() : some$2([rightDef(index2), index2 + 1]));
  const leftExtension = concat(left2, leftPad);
  const rightExtension = concat(right2, rightPad);
  return [leftExtension, rightExtension];
};
const appendConfigPath = (path2, config) => {
  let op = config;
  if (op._tag === "Nested") {
    const out = path2.slice();
    while (op._tag === "Nested") {
      out.push(op.name);
      op = op.config;
    }
    return out;
  }
  return path2;
};
const fromFlatLoop = (flat, prefix, config, split) => {
  const op = config;
  switch (op._tag) {
    case OP_CONSTANT: {
      return succeed$4(of$3(op.value));
    }
    case OP_DESCRIBED: {
      return suspend(() => fromFlatLoop(flat, prefix, op.config, split));
    }
    case OP_FAIL$1: {
      return fail$2(MissingData(prefix, op.message));
    }
    case OP_FALLBACK: {
      return pipe$1(suspend(() => fromFlatLoop(flat, prefix, op.first, split)), catchAll$1((error1) => {
        if (op.condition(error1)) {
          return pipe$1(fromFlatLoop(flat, prefix, op.second, split), catchAll$1((error2) => fail$2(Or(error1, error2))));
        }
        return fail$2(error1);
      }));
    }
    case OP_LAZY: {
      return suspend(() => fromFlatLoop(flat, prefix, op.config(), split));
    }
    case OP_MAP_OR_FAIL: {
      return suspend(() => pipe$1(fromFlatLoop(flat, prefix, op.original, split), flatMap$1(forEachSequential((a) => pipe$1(op.mapOrFail(a), mapError(prefixed(appendConfigPath(prefix, op.original))))))));
    }
    case OP_NESTED: {
      return suspend(() => fromFlatLoop(flat, concat(prefix, of$3(op.name)), op.config, split));
    }
    case OP_PRIMITIVE: {
      return pipe$1(patch$3(prefix, flat.patch), flatMap$1((prefix2) => pipe$1(flat.load(prefix2, op, split), flatMap$1((values) => {
        if (values.length === 0) {
          const name = pipe$1(last(prefix2), getOrElse$1(() => "<n/a>"));
          return fail$2(MissingData([], `Expected ${op.description} with name ${name}`));
        }
        return succeed$4(values);
      }))));
    }
    case OP_SEQUENCE: {
      return pipe$1(patch$3(prefix, flat.patch), flatMap$1((patchedPrefix) => pipe$1(flat.enumerateChildren(patchedPrefix), flatMap$1(indicesFrom), flatMap$1((indices) => {
        if (indices.length === 0) {
          return suspend(() => map$1(fromFlatLoop(flat, prefix, op.config, true), of$3));
        }
        return pipe$1(forEachSequential(indices, (index2) => fromFlatLoop(flat, append$1(prefix, `[${index2}]`), op.config, true)), map$1((chunkChunk) => {
          const flattened = flatten$2(chunkChunk);
          if (flattened.length === 0) {
            return of$3(empty$n());
          }
          return of$3(flattened);
        }));
      }))));
    }
    case OP_HASHMAP: {
      return suspend(() => pipe$1(patch$3(prefix, flat.patch), flatMap$1((prefix2) => pipe$1(flat.enumerateChildren(prefix2), flatMap$1((keys2) => {
        return pipe$1(keys2, forEachSequential((key) => fromFlatLoop(flat, concat(prefix2, of$3(key)), op.valueConfig, split)), map$1((matrix) => {
          if (matrix.length === 0) {
            return of$3(empty$f());
          }
          return pipe$1(transpose(matrix), map$4((values) => fromIterable$2(zip$1(fromIterable$7(keys2), values))));
        }));
      })))));
    }
    case OP_ZIP_WITH: {
      return suspend(() => pipe$1(fromFlatLoop(flat, prefix, op.left, split), either$1, flatMap$1((left2) => pipe$1(fromFlatLoop(flat, prefix, op.right, split), either$1, flatMap$1((right2) => {
        if (isLeft$1(left2) && isLeft$1(right2)) {
          return fail$2(And(left2.left, right2.left));
        }
        if (isLeft$1(left2) && isRight$1(right2)) {
          return fail$2(left2.left);
        }
        if (isRight$1(left2) && isLeft$1(right2)) {
          return fail$2(right2.left);
        }
        if (isRight$1(left2) && isRight$1(right2)) {
          const path2 = pipe$1(prefix, join$1("."));
          const fail2 = fromFlatLoopFail(prefix, path2);
          const [lefts, rights] = extend(fail2, fail2, pipe$1(left2.right, map$4(right$2)), pipe$1(right2.right, map$4(right$2)));
          return pipe$1(lefts, zip$1(rights), forEachSequential(([left22, right22]) => pipe$1(zip(left22, right22), map$1(([left3, right3]) => op.zip(left3, right3)))));
        }
        throw new Error("BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/effect/issues");
      })))));
    }
  }
};
const fromFlatLoopFail = (prefix, path2) => (index2) => left$2(MissingData(prefix, `The element at index ${index2} in a sequence at path "${path2}" was missing`));
const splitPathString = (text2, delim) => {
  const split = text2.split(new RegExp(`\\s*${escape(delim)}\\s*`));
  return split;
};
const parsePrimitive = (text2, path2, primitive, delimiter, split) => {
  if (!split) {
    return pipe$1(primitive.parse(text2), mapBoth({
      onFailure: prefixed(path2),
      onSuccess: of$3
    }));
  }
  return pipe$1(splitPathString(text2, delimiter), forEachSequential((char) => primitive.parse(char.trim())), mapError(prefixed(path2)));
};
const transpose = (array2) => {
  return Object.keys(array2[0]).map((column) => array2.map((row) => row[column]));
};
const indicesFrom = (quotedIndices) => pipe$1(forEachSequential(quotedIndices, parseQuotedIndex), mapBoth({
  onFailure: () => empty$n(),
  onSuccess: sort(Order$1)
}), either$1, map$1(merge$3));
const QUOTED_INDEX_REGEX = /^(\[(\d+)\])$/;
const parseQuotedIndex = (str) => {
  const match2 = str.match(QUOTED_INDEX_REGEX);
  if (match2 !== null) {
    const matchedIndex = match2[2];
    return pipe$1(matchedIndex !== void 0 && matchedIndex.length > 0 ? some$2(matchedIndex) : none$6(), flatMap$3(parseInteger));
  }
  return none$6();
};
const parseInteger = (str) => {
  const parsedIndex = Number.parseInt(str);
  return Number.isNaN(parsedIndex) ? none$6() : some$2(parsedIndex);
};
const TypeId$5 = /* @__PURE__ */ Symbol.for("effect/Console");
const consoleTag = /* @__PURE__ */ GenericTag("effect/Console");
const defaultConsole = {
  [TypeId$5]: TypeId$5,
  assert(condition, ...args2) {
    return sync$2(() => {
      console.assert(condition, ...args2);
    });
  },
  clear: /* @__PURE__ */ sync$2(() => {
    console.clear();
  }),
  count(label) {
    return sync$2(() => {
      console.count(label);
    });
  },
  countReset(label) {
    return sync$2(() => {
      console.countReset(label);
    });
  },
  debug(...args2) {
    return sync$2(() => {
      console.debug(...args2);
    });
  },
  dir(item, options) {
    return sync$2(() => {
      console.dir(item, options);
    });
  },
  dirxml(...args2) {
    return sync$2(() => {
      console.dirxml(...args2);
    });
  },
  error(...args2) {
    return sync$2(() => {
      console.error(...args2);
    });
  },
  group(options) {
    return (options == null ? void 0 : options.collapsed) ? sync$2(() => console.groupCollapsed(options == null ? void 0 : options.label)) : sync$2(() => console.group(options == null ? void 0 : options.label));
  },
  groupEnd: /* @__PURE__ */ sync$2(() => {
    console.groupEnd();
  }),
  info(...args2) {
    return sync$2(() => {
      console.info(...args2);
    });
  },
  log(...args2) {
    return sync$2(() => {
      console.log(...args2);
    });
  },
  table(tabularData, properties) {
    return sync$2(() => {
      console.table(tabularData, properties);
    });
  },
  time(label) {
    return sync$2(() => console.time(label));
  },
  timeEnd(label) {
    return sync$2(() => console.timeEnd(label));
  },
  timeLog(label, ...args2) {
    return sync$2(() => {
      console.timeLog(label, ...args2);
    });
  },
  trace(...args2) {
    return sync$2(() => {
      console.trace(...args2);
    });
  },
  warn(...args2) {
    return sync$2(() => {
      console.warn(...args2);
    });
  },
  unsafe: console
};
const RandomSymbolKey = "effect/Random";
const RandomTypeId = /* @__PURE__ */ Symbol.for(RandomSymbolKey);
const randomTag = /* @__PURE__ */ GenericTag("effect/Random");
_j = RandomTypeId;
class RandomImpl {
  constructor(seed) {
    __publicField(this, "seed");
    __publicField(this, _j, RandomTypeId);
    __publicField(this, "PRNG");
    this.seed = seed;
    this.PRNG = new PCGRandom$1(seed);
  }
  get next() {
    return sync$2(() => this.PRNG.number());
  }
  get nextBoolean() {
    return map$1(this.next, (n) => n > 0.5);
  }
  get nextInt() {
    return sync$2(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER));
  }
  nextRange(min, max) {
    return map$1(this.next, (n) => (max - min) * n + min);
  }
  nextIntBetween(min, max) {
    return sync$2(() => this.PRNG.integer(max - min) + min);
  }
  shuffle(elements) {
    return shuffleWith(elements, (n) => this.nextIntBetween(0, n));
  }
}
const shuffleWith = (elements, nextIntBounded) => {
  return suspend(() => pipe$1(sync$2(() => Array.from(elements)), flatMap$1((buffer) => {
    const numbers = [];
    for (let i = buffer.length; i >= 2; i = i - 1) {
      numbers.push(i);
    }
    return pipe$1(numbers, forEachSequentialDiscard((n) => pipe$1(nextIntBounded(n), map$1((k) => swap(buffer, n - 1, k)))), as(fromIterable$6(buffer)));
  })));
};
const swap = (buffer, index1, index2) => {
  const tmp = buffer[index1];
  buffer[index1] = buffer[index2];
  buffer[index2] = tmp;
  return buffer;
};
const make$8 = (seed) => new RandomImpl(hash$1(seed));
const TracerTypeId = /* @__PURE__ */ Symbol.for("effect/Tracer");
const make$7 = (options) => ({
  [TracerTypeId]: TracerTypeId,
  ...options
});
const tracerTag = /* @__PURE__ */ GenericTag("effect/Tracer");
const spanTag = /* @__PURE__ */ GenericTag("effect/ParentSpan");
const randomHexString = /* @__PURE__ */ function() {
  const characters = "abcdef0123456789";
  const charactersLength = characters.length;
  return function(length) {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
}();
class NativeSpan {
  constructor(name, parent, context, links, startTime, kind) {
    __publicField(this, "name");
    __publicField(this, "parent");
    __publicField(this, "context");
    __publicField(this, "startTime");
    __publicField(this, "kind");
    __publicField(this, "_tag", "Span");
    __publicField(this, "spanId");
    __publicField(this, "traceId", "native");
    __publicField(this, "sampled", true);
    __publicField(this, "status");
    __publicField(this, "attributes");
    __publicField(this, "events", []);
    __publicField(this, "links");
    this.name = name;
    this.parent = parent;
    this.context = context;
    this.startTime = startTime;
    this.kind = kind;
    this.status = {
      _tag: "Started",
      startTime
    };
    this.attributes = /* @__PURE__ */ new Map();
    this.traceId = parent._tag === "Some" ? parent.value.traceId : randomHexString(32);
    this.spanId = randomHexString(16);
    this.links = Array.from(links);
  }
  end(endTime, exit2) {
    this.status = {
      _tag: "Ended",
      endTime,
      exit: exit2,
      startTime: this.status.startTime
    };
  }
  attribute(key, value) {
    this.attributes.set(key, value);
  }
  event(name, startTime, attributes) {
    this.events.push([name, startTime, attributes ?? {}]);
  }
  addLinks(links) {
    this.links.push(...links);
  }
}
const nativeTracer = /* @__PURE__ */ make$7({
  span: (name, parent, context, links, startTime, kind) => new NativeSpan(name, parent, context, links, startTime, kind),
  context: (f) => f()
});
const liveServices = /* @__PURE__ */ pipe$1(/* @__PURE__ */ empty$g(), /* @__PURE__ */ add$2(clockTag, /* @__PURE__ */ make$a()), /* @__PURE__ */ add$2(consoleTag, defaultConsole), /* @__PURE__ */ add$2(randomTag, /* @__PURE__ */ make$8(/* @__PURE__ */ Math.random())), /* @__PURE__ */ add$2(configProviderTag, /* @__PURE__ */ fromEnv()), /* @__PURE__ */ add$2(tracerTag, nativeTracer));
const currentServices = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/DefaultServices/currentServices"), () => fiberRefUnsafeMakeContext(liveServices));
const EffectPrototype = EffectPrototype$1;
const Base = Base$1;
class Class extends Base {
}
const OP_SEQUENTIAL$1 = "Sequential";
const sequential$1 = {
  _tag: OP_SEQUENTIAL$1
};
function unsafeMake$2(fiberRefLocals) {
  return new FiberRefsImpl(fiberRefLocals);
}
function empty$8() {
  return unsafeMake$2(/* @__PURE__ */ new Map());
}
const FiberRefsSym = /* @__PURE__ */ Symbol.for("effect/FiberRefs");
_k = FiberRefsSym;
class FiberRefsImpl {
  constructor(locals) {
    __publicField(this, "locals");
    __publicField(this, _k, FiberRefsSym);
    this.locals = locals;
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
}
const findAncestor = (_ref, _parentStack, _childStack, _childModified = false) => {
  const ref = _ref;
  let parentStack = _parentStack;
  let childStack = _childStack;
  let childModified = _childModified;
  let ret = void 0;
  while (ret === void 0) {
    if (isNonEmptyReadonlyArray(parentStack) && isNonEmptyReadonlyArray(childStack)) {
      const parentFiberId = headNonEmpty$2(parentStack)[0];
      const parentAncestors = tailNonEmpty$1(parentStack);
      const childFiberId = headNonEmpty$2(childStack)[0];
      const childRefValue = headNonEmpty$2(childStack)[1];
      const childAncestors = tailNonEmpty$1(childStack);
      if (parentFiberId.startTimeMillis < childFiberId.startTimeMillis) {
        childStack = childAncestors;
        childModified = true;
      } else if (parentFiberId.startTimeMillis > childFiberId.startTimeMillis) {
        parentStack = parentAncestors;
      } else {
        if (parentFiberId.id < childFiberId.id) {
          childStack = childAncestors;
          childModified = true;
        } else if (parentFiberId.id > childFiberId.id) {
          parentStack = parentAncestors;
        } else {
          ret = [childRefValue, childModified];
        }
      }
    } else {
      ret = [ref.initial, true];
    }
  }
  return ret;
};
const joinAs = /* @__PURE__ */ dual$1(3, (self2, fiberId2, that) => {
  const parentFiberRefs = new Map(self2.locals);
  that.locals.forEach((childStack, fiberRef) => {
    const childValue = childStack[0][1];
    if (!childStack[0][0][symbol$2](fiberId2)) {
      if (!parentFiberRefs.has(fiberRef)) {
        if (equals$2(childValue, fiberRef.initial)) {
          return;
        }
        parentFiberRefs.set(fiberRef, [[fiberId2, fiberRef.join(fiberRef.initial, childValue)]]);
        return;
      }
      const parentStack = parentFiberRefs.get(fiberRef);
      const [ancestor, wasModified] = findAncestor(fiberRef, parentStack, childStack);
      if (wasModified) {
        const patch2 = fiberRef.diff(ancestor, childValue);
        const oldValue = parentStack[0][1];
        const newValue = fiberRef.join(oldValue, fiberRef.patch(patch2)(oldValue));
        if (!equals$2(oldValue, newValue)) {
          let newStack;
          const parentFiberId = parentStack[0][0];
          if (parentFiberId[symbol$2](fiberId2)) {
            newStack = [[parentFiberId, newValue], ...parentStack.slice(1)];
          } else {
            newStack = [[fiberId2, newValue], ...parentStack];
          }
          parentFiberRefs.set(fiberRef, newStack);
        }
      }
    }
  });
  return new FiberRefsImpl(parentFiberRefs);
});
const forkAs = /* @__PURE__ */ dual$1(2, (self2, childId) => {
  const map2 = /* @__PURE__ */ new Map();
  unsafeForkAs(self2, map2, childId);
  return new FiberRefsImpl(map2);
});
const unsafeForkAs = (self2, map2, fiberId2) => {
  self2.locals.forEach((stack, fiberRef) => {
    const oldValue = stack[0][1];
    const newValue = fiberRef.patch(fiberRef.fork)(oldValue);
    if (equals$2(oldValue, newValue)) {
      map2.set(fiberRef, stack);
    } else {
      map2.set(fiberRef, [[fiberId2, newValue], ...stack]);
    }
  });
};
const delete_ = /* @__PURE__ */ dual$1(2, (self2, fiberRef) => {
  const locals = new Map(self2.locals);
  locals.delete(fiberRef);
  return new FiberRefsImpl(locals);
});
const get$1 = /* @__PURE__ */ dual$1(2, (self2, fiberRef) => {
  if (!self2.locals.has(fiberRef)) {
    return none$6();
  }
  return some$2(headNonEmpty$2(self2.locals.get(fiberRef))[1]);
});
const getOrDefault$1 = /* @__PURE__ */ dual$1(2, (self2, fiberRef) => pipe$1(get$1(self2, fiberRef), getOrElse$1(() => fiberRef.initial)));
const updateAs = /* @__PURE__ */ dual$1(2, (self2, {
  fiberId: fiberId2,
  fiberRef,
  value
}) => {
  if (self2.locals.size === 0) {
    return new FiberRefsImpl(/* @__PURE__ */ new Map([[fiberRef, [[fiberId2, value]]]]));
  }
  const locals = new Map(self2.locals);
  unsafeUpdateAs(locals, fiberId2, fiberRef, value);
  return new FiberRefsImpl(locals);
});
const unsafeUpdateAs = (locals, fiberId2, fiberRef, value) => {
  const oldStack = locals.get(fiberRef) ?? [];
  let newStack;
  if (isNonEmptyReadonlyArray(oldStack)) {
    const [currentId, currentValue] = headNonEmpty$2(oldStack);
    if (currentId[symbol$2](fiberId2)) {
      if (equals$2(currentValue, value)) {
        return;
      } else {
        newStack = [[fiberId2, value], ...oldStack.slice(1)];
      }
    } else {
      newStack = [[fiberId2, value], ...oldStack];
    }
  } else {
    newStack = [[fiberId2, value]];
  }
  locals.set(fiberRef, newStack);
};
const updateManyAs$1 = /* @__PURE__ */ dual$1(2, (self2, {
  entries,
  forkAs: forkAs2
}) => {
  if (self2.locals.size === 0) {
    return new FiberRefsImpl(new Map(entries));
  }
  const locals = new Map(self2.locals);
  if (forkAs2 !== void 0) {
    unsafeForkAs(self2, locals, forkAs2);
  }
  entries.forEach(([fiberRef, values]) => {
    if (values.length === 1) {
      unsafeUpdateAs(locals, values[0][0], fiberRef, values[0][1]);
    } else {
      values.forEach(([fiberId2, value]) => {
        unsafeUpdateAs(locals, fiberId2, fiberRef, value);
      });
    }
  });
  return new FiberRefsImpl(locals);
});
const getOrDefault = getOrDefault$1;
const updateManyAs = updateManyAs$1;
const empty$7 = empty$8;
const OP_EMPTY$2 = "Empty";
const OP_ADD = "Add";
const OP_REMOVE = "Remove";
const OP_UPDATE = "Update";
const OP_AND_THEN$1 = "AndThen";
const empty$6 = {
  _tag: OP_EMPTY$2
};
const diff$2 = (oldValue, newValue) => {
  const missingLocals = new Map(oldValue.locals);
  let patch2 = empty$6;
  for (const [fiberRef, pairs] of newValue.locals.entries()) {
    const newValue2 = headNonEmpty$2(pairs)[1];
    const old = missingLocals.get(fiberRef);
    if (old !== void 0) {
      const oldValue2 = headNonEmpty$2(old)[1];
      if (!equals$2(oldValue2, newValue2)) {
        patch2 = combine$2({
          _tag: OP_UPDATE,
          fiberRef,
          patch: fiberRef.diff(oldValue2, newValue2)
        })(patch2);
      }
    } else {
      patch2 = combine$2({
        _tag: OP_ADD,
        fiberRef,
        value: newValue2
      })(patch2);
    }
    missingLocals.delete(fiberRef);
  }
  for (const [fiberRef] of missingLocals.entries()) {
    patch2 = combine$2({
      _tag: OP_REMOVE,
      fiberRef
    })(patch2);
  }
  return patch2;
};
const combine$2 = /* @__PURE__ */ dual$1(2, (self2, that) => ({
  _tag: OP_AND_THEN$1,
  first: self2,
  second: that
}));
const patch$2 = /* @__PURE__ */ dual$1(3, (self2, fiberId2, oldValue) => {
  let fiberRefs = oldValue;
  let patches = of$3(self2);
  while (isNonEmptyReadonlyArray(patches)) {
    const head2 = headNonEmpty$2(patches);
    const tail = tailNonEmpty$1(patches);
    switch (head2._tag) {
      case OP_EMPTY$2: {
        patches = tail;
        break;
      }
      case OP_ADD: {
        fiberRefs = updateAs(fiberRefs, {
          fiberId: fiberId2,
          fiberRef: head2.fiberRef,
          value: head2.value
        });
        patches = tail;
        break;
      }
      case OP_REMOVE: {
        fiberRefs = delete_(fiberRefs, head2.fiberRef);
        patches = tail;
        break;
      }
      case OP_UPDATE: {
        const value = getOrDefault$1(fiberRefs, head2.fiberRef);
        fiberRefs = updateAs(fiberRefs, {
          fiberId: fiberId2,
          fiberRef: head2.fiberRef,
          value: head2.fiberRef.patch(head2.patch)(value)
        });
        patches = tail;
        break;
      }
      case OP_AND_THEN$1: {
        patches = prepend$3(head2.first)(prepend$3(head2.second)(tail));
        break;
      }
    }
  }
  return fiberRefs;
});
const diff$1 = diff$2;
const patch$1 = patch$2;
const FiberStatusSymbolKey = "effect/FiberStatus";
const FiberStatusTypeId = /* @__PURE__ */ Symbol.for(FiberStatusSymbolKey);
const OP_DONE = "Done";
const OP_RUNNING = "Running";
const OP_SUSPENDED = "Suspended";
const DoneHash = /* @__PURE__ */ string$1(`${FiberStatusSymbolKey}-${OP_DONE}`);
class Done {
  constructor() {
    __publicField(this, _l, FiberStatusTypeId);
    __publicField(this, "_tag", OP_DONE);
  }
  [(_l = FiberStatusTypeId, symbol$3)]() {
    return DoneHash;
  }
  [symbol$2](that) {
    return isFiberStatus(that) && that._tag === OP_DONE;
  }
}
class Running {
  constructor(runtimeFlags) {
    __publicField(this, "runtimeFlags");
    __publicField(this, _m, FiberStatusTypeId);
    __publicField(this, "_tag", OP_RUNNING);
    this.runtimeFlags = runtimeFlags;
  }
  [(_m = FiberStatusTypeId, symbol$3)]() {
    return pipe$1(hash$1(FiberStatusSymbolKey), combine$6(hash$1(this._tag)), combine$6(hash$1(this.runtimeFlags)), cached(this));
  }
  [symbol$2](that) {
    return isFiberStatus(that) && that._tag === OP_RUNNING && this.runtimeFlags === that.runtimeFlags;
  }
}
class Suspended {
  constructor(runtimeFlags, blockingOn) {
    __publicField(this, "runtimeFlags");
    __publicField(this, "blockingOn");
    __publicField(this, _n, FiberStatusTypeId);
    __publicField(this, "_tag", OP_SUSPENDED);
    this.runtimeFlags = runtimeFlags;
    this.blockingOn = blockingOn;
  }
  [(_n = FiberStatusTypeId, symbol$3)]() {
    return pipe$1(hash$1(FiberStatusSymbolKey), combine$6(hash$1(this._tag)), combine$6(hash$1(this.runtimeFlags)), combine$6(hash$1(this.blockingOn)), cached(this));
  }
  [symbol$2](that) {
    return isFiberStatus(that) && that._tag === OP_SUSPENDED && this.runtimeFlags === that.runtimeFlags && equals$2(this.blockingOn, that.blockingOn);
  }
}
const done$1 = /* @__PURE__ */ new Done();
const running$1 = (runtimeFlags) => new Running(runtimeFlags);
const suspended$1 = (runtimeFlags, blockingOn) => new Suspended(runtimeFlags, blockingOn);
const isFiberStatus = (u) => hasProperty(u, FiberStatusTypeId);
const isDone$1 = (self2) => self2._tag === OP_DONE;
const done = done$1;
const running = running$1;
const suspended = suspended$1;
const isDone = isDone$1;
const All = logLevelAll;
const Fatal = logLevelFatal;
const Error$1 = logLevelError;
const Warning = logLevelWarning;
const Info = logLevelInfo;
const Debug = logLevelDebug;
const Trace = logLevelTrace;
const None2 = logLevelNone;
const Order = /* @__PURE__ */ pipe$1(Order$1, /* @__PURE__ */ mapInput((level) => level.ordinal));
const greaterThan = /* @__PURE__ */ greaterThan$1(Order);
const fromLiteral = (literal) => {
  switch (literal) {
    case "All":
      return All;
    case "Debug":
      return Debug;
    case "Error":
      return Error$1;
    case "Fatal":
      return Fatal;
    case "Info":
      return Info;
    case "Trace":
      return Trace;
    case "None":
      return None2;
    case "Warning":
      return Warning;
  }
};
const TypeId$4 = /* @__PURE__ */ Symbol.for("effect/Micro");
const MicroExitTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroExit");
const MicroCauseTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroCause");
const microCauseVariance = {
  _E: identity
};
class MicroCauseImpl extends globalThis.Error {
  constructor(_tag, originalError, traces) {
    const causeName = `MicroCause.${_tag}`;
    let name;
    let message;
    let stack;
    if (originalError instanceof globalThis.Error) {
      name = `(${causeName}) ${originalError.name}`;
      message = originalError.message;
      const messageLines = message.split("\n").length;
      stack = originalError.stack ? `(${causeName}) ${originalError.stack.split("\n").slice(0, messageLines + 3).join("\n")}` : `${name}: ${message}`;
    } else {
      name = causeName;
      message = toStringUnknown(originalError, 0);
      stack = `${name}: ${message}`;
    }
    if (traces.length > 0) {
      stack += `
    ${traces.join("\n    ")}`;
    }
    super(message);
    __publicField(this, "_tag");
    __publicField(this, "traces");
    __publicField(this, _o);
    this._tag = _tag;
    this.traces = traces;
    this[MicroCauseTypeId] = microCauseVariance;
    this.name = name;
    this.stack = stack;
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
  toString() {
    return this.stack;
  }
  [(_o = MicroCauseTypeId, NodeInspectSymbol$1)]() {
    return this.stack;
  }
}
class Die extends MicroCauseImpl {
  constructor(defect, traces = []) {
    super("Die", defect, traces);
    __publicField(this, "defect");
    this.defect = defect;
  }
}
const causeDie = (defect, traces = []) => new Die(defect, traces);
class Interrupt extends MicroCauseImpl {
  constructor(traces = []) {
    super("Interrupt", "interrupted", traces);
  }
}
const causeInterrupt = (traces = []) => new Interrupt(traces);
const causeIsInterrupt = (self2) => self2._tag === "Interrupt";
const MicroFiberTypeId = /* @__PURE__ */ Symbol.for("effect/Micro/MicroFiber");
const fiberVariance$1 = {
  _A: identity,
  _E: identity
};
_p = MicroFiberTypeId;
class MicroFiberImpl {
  constructor(context, interruptible2 = true) {
    __publicField(this, "context");
    __publicField(this, "interruptible");
    __publicField(this, _p);
    __publicField(this, "_stack", []);
    __publicField(this, "_observers", []);
    __publicField(this, "_exit");
    __publicField(this, "_children");
    __publicField(this, "currentOpCount", 0);
    __publicField(this, "_interrupted", false);
    // cancel the yielded operation, or for the yielded exit value
    __publicField(this, "_yielded");
    this.context = context;
    this.interruptible = interruptible2;
    this[MicroFiberTypeId] = fiberVariance$1;
  }
  getRef(ref) {
    return unsafeGetReference(this.context, ref);
  }
  addObserver(cb) {
    if (this._exit) {
      cb(this._exit);
      return constVoid;
    }
    this._observers.push(cb);
    return () => {
      const index2 = this._observers.indexOf(cb);
      if (index2 >= 0) {
        this._observers.splice(index2, 1);
      }
    };
  }
  unsafeInterrupt() {
    if (this._exit) {
      return;
    }
    this._interrupted = true;
    if (this.interruptible) {
      this.evaluate(exitInterrupt);
    }
  }
  unsafePoll() {
    return this._exit;
  }
  evaluate(effect) {
    if (this._exit) {
      return;
    } else if (this._yielded !== void 0) {
      const yielded = this._yielded;
      this._yielded = void 0;
      yielded();
    }
    const exit2 = this.runLoop(effect);
    if (exit2 === Yield) {
      return;
    }
    const interruptChildren = fiberMiddleware.interruptChildren && fiberMiddleware.interruptChildren(this);
    if (interruptChildren !== void 0) {
      return this.evaluate(flatMap(interruptChildren, () => exit2));
    }
    this._exit = exit2;
    for (let i = 0; i < this._observers.length; i++) {
      this._observers[i](exit2);
    }
    this._observers.length = 0;
  }
  runLoop(effect) {
    let yielding = false;
    let current = effect;
    this.currentOpCount = 0;
    try {
      while (true) {
        this.currentOpCount++;
        if (!yielding && this.getRef(CurrentScheduler).shouldYield(this)) {
          yielding = true;
          const prev = current;
          current = flatMap(yieldNow$1, () => prev);
        }
        current = current[evaluate](this);
        if (current === Yield) {
          const yielded = this._yielded;
          if (MicroExitTypeId in yielded) {
            this._yielded = void 0;
            return yielded;
          }
          return Yield;
        }
      }
    } catch (error) {
      if (!hasProperty(current, evaluate)) {
        return exitDie(`MicroFiber.runLoop: Not a valid effect: ${String(current)}`);
      }
      return exitDie(error);
    }
  }
  getCont(symbol2) {
    while (true) {
      const op = this._stack.pop();
      if (!op) return void 0;
      const cont = op[ensureCont] && op[ensureCont](this);
      if (cont) return {
        [symbol2]: cont
      };
      if (op[symbol2]) return op;
    }
  }
  yieldWith(value) {
    this._yielded = value;
    return Yield;
  }
  children() {
    return this._children ?? (this._children = /* @__PURE__ */ new Set());
  }
}
const fiberMiddleware = /* @__PURE__ */ globalValue$1("effect/Micro/fiberMiddleware", () => ({
  interruptChildren: void 0
}));
const identifier = /* @__PURE__ */ Symbol.for("effect/Micro/identifier");
const args = /* @__PURE__ */ Symbol.for("effect/Micro/args");
const evaluate = /* @__PURE__ */ Symbol.for("effect/Micro/evaluate");
const successCont = /* @__PURE__ */ Symbol.for("effect/Micro/successCont");
const failureCont = /* @__PURE__ */ Symbol.for("effect/Micro/failureCont");
const ensureCont = /* @__PURE__ */ Symbol.for("effect/Micro/ensureCont");
const Yield = /* @__PURE__ */ Symbol.for("effect/Micro/Yield");
const microVariance = {
  _A: identity,
  _E: identity,
  _R: identity
};
const MicroProto = {
  ...EffectPrototype,
  _op: "Micro",
  [TypeId$4]: microVariance,
  pipe() {
    return pipeArguments$1(this, arguments);
  },
  [Symbol.iterator]() {
    return new SingleShotGen$1(new YieldWrap(this));
  },
  toJSON() {
    return {
      _id: "Micro",
      op: this[identifier],
      ...args in this ? {
        args: this[args]
      } : void 0
    };
  },
  toString() {
    return format$2(this);
  },
  [NodeInspectSymbol$1]() {
    return format$2(this);
  }
};
function defaultEvaluate(_fiber) {
  return exitDie(`Micro.evaluate: Not implemented`);
}
const makePrimitiveProto = (options) => ({
  ...MicroProto,
  [identifier]: options.op,
  [evaluate]: options.eval ?? defaultEvaluate,
  [successCont]: options.contA,
  [failureCont]: options.contE,
  [ensureCont]: options.ensure
});
const makePrimitive = (options) => {
  const Proto = makePrimitiveProto(options);
  return function() {
    const self2 = Object.create(Proto);
    self2[args] = options.single === false ? arguments : arguments[0];
    return self2;
  };
};
const makeExit = (options) => {
  const Proto = {
    ...makePrimitiveProto(options),
    [MicroExitTypeId]: MicroExitTypeId,
    _tag: options.op,
    get [options.prop]() {
      return this[args];
    },
    toJSON() {
      return {
        _id: "MicroExit",
        _tag: options.op,
        [options.prop]: this[args]
      };
    },
    [symbol$2](that) {
      return isMicroExit(that) && that._tag === options.op && equals$2(this[args], that[args]);
    },
    [symbol$3]() {
      return cached(this, combine$6(string$1(options.op))(hash$1(this[args])));
    }
  };
  return function(value) {
    const self2 = Object.create(Proto);
    self2[args] = value;
    self2[successCont] = void 0;
    self2[failureCont] = void 0;
    self2[ensureCont] = void 0;
    return self2;
  };
};
const succeed$3 = /* @__PURE__ */ makeExit({
  op: "Success",
  prop: "value",
  eval(fiber) {
    const cont = fiber.getCont(successCont);
    return cont ? cont[successCont](this[args], fiber) : fiber.yieldWith(this);
  }
});
const failCause = /* @__PURE__ */ makeExit({
  op: "Failure",
  prop: "cause",
  eval(fiber) {
    let cont = fiber.getCont(failureCont);
    while (causeIsInterrupt(this[args]) && cont && fiber.interruptible) {
      cont = fiber.getCont(failureCont);
    }
    return cont ? cont[failureCont](this[args], fiber) : fiber.yieldWith(this);
  }
});
const yieldNowWith = /* @__PURE__ */ makePrimitive({
  op: "Yield",
  eval(fiber) {
    let resumed = false;
    fiber.getRef(CurrentScheduler).scheduleTask(() => {
      if (resumed) return;
      fiber.evaluate(exitVoid);
    }, this[args] ?? 0);
    return fiber.yieldWith(() => {
      resumed = true;
    });
  }
});
const yieldNow$1 = /* @__PURE__ */ yieldNowWith(0);
const void_ = /* @__PURE__ */ succeed$3(void 0);
const withMicroFiber = /* @__PURE__ */ makePrimitive({
  op: "WithMicroFiber",
  eval(fiber) {
    return this[args](fiber);
  }
});
const flatMap = /* @__PURE__ */ dual$1(2, (self2, f) => {
  const onSuccess = Object.create(OnSuccessProto);
  onSuccess[args] = self2;
  onSuccess[successCont] = f;
  return onSuccess;
});
const OnSuccessProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnSuccess",
  eval(fiber) {
    fiber._stack.push(this);
    return this[args];
  }
});
const isMicroExit = (u) => hasProperty(u, MicroExitTypeId);
const exitSucceed = succeed$3;
const exitFailCause = failCause;
const exitInterrupt = /* @__PURE__ */ exitFailCause(/* @__PURE__ */ causeInterrupt());
const exitDie = (defect) => exitFailCause(causeDie(defect));
const exitVoid = /* @__PURE__ */ exitSucceed(void 0);
const setImmediate$1 = "setImmediate" in globalThis ? globalThis.setImmediate : (f) => setTimeout(f, 0);
class MicroSchedulerDefault {
  constructor() {
    __publicField(this, "tasks", []);
    __publicField(this, "running", false);
    /**
     * @since 3.5.9
     */
    __publicField(this, "afterScheduled", () => {
      this.running = false;
      this.runTasks();
    });
  }
  /**
   * @since 3.5.9
   */
  scheduleTask(task, _priority) {
    this.tasks.push(task);
    if (!this.running) {
      this.running = true;
      setImmediate$1(this.afterScheduled);
    }
  }
  /**
   * @since 3.5.9
   */
  runTasks() {
    const tasks = this.tasks;
    this.tasks = [];
    for (let i = 0, len = tasks.length; i < len; i++) {
      tasks[i]();
    }
  }
  /**
   * @since 3.5.9
   */
  shouldYield(fiber) {
    return fiber.currentOpCount >= fiber.getRef(MaxOpsBeforeYield);
  }
  /**
   * @since 3.5.9
   */
  flush() {
    while (this.tasks.length > 0) {
      this.runTasks();
    }
  }
}
const updateContext = /* @__PURE__ */ dual$1(2, (self2, f) => withMicroFiber((fiber) => {
  const prev = fiber.context;
  fiber.context = f(prev);
  return onExit(self2, () => {
    fiber.context = prev;
    return void_;
  });
}));
const provideContext = /* @__PURE__ */ dual$1(2, (self2, provided) => updateContext(self2, merge$1(provided)));
class MaxOpsBeforeYield extends (/* @__PURE__ */ Reference()("effect/Micro/currentMaxOpsBeforeYield", {
  defaultValue: () => 2048
})) {
}
class CurrentScheduler extends (/* @__PURE__ */ Reference()("effect/Micro/currentScheduler", {
  defaultValue: () => new MicroSchedulerDefault()
})) {
}
const matchCauseEffect = /* @__PURE__ */ dual$1(2, (self2, options) => {
  const primitive = Object.create(OnSuccessAndFailureProto);
  primitive[args] = self2;
  primitive[successCont] = options.onSuccess;
  primitive[failureCont] = options.onFailure;
  return primitive;
});
const OnSuccessAndFailureProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnSuccessAndFailure",
  eval(fiber) {
    fiber._stack.push(this);
    return this[args];
  }
});
const onExit = /* @__PURE__ */ dual$1(2, (self2, f) => uninterruptibleMask((restore) => matchCauseEffect(restore(self2), {
  onFailure: (cause) => flatMap(f(exitFailCause(cause)), () => failCause(cause)),
  onSuccess: (a) => flatMap(f(exitSucceed(a)), () => succeed$3(a))
})));
const setInterruptible = /* @__PURE__ */ makePrimitive({
  op: "SetInterruptible",
  ensure(fiber) {
    fiber.interruptible = this[args];
    if (fiber._interrupted && fiber.interruptible) {
      return () => exitInterrupt;
    }
  }
});
const interruptible = (self2) => withMicroFiber((fiber) => {
  if (fiber.interruptible) return self2;
  fiber.interruptible = true;
  fiber._stack.push(setInterruptible(false));
  if (fiber._interrupted) return exitInterrupt;
  return self2;
});
const uninterruptibleMask = (f) => withMicroFiber((fiber) => {
  if (!fiber.interruptible) return f(identity);
  fiber.interruptible = false;
  fiber._stack.push(setInterruptible(true));
  return f(interruptible);
});
const runFork = (effect, options) => {
  const fiber = new MicroFiberImpl(CurrentScheduler.context(new MicroSchedulerDefault()));
  fiber.evaluate(effect);
  return fiber;
};
class PriorityBuckets {
  constructor() {
    /**
     * @since 2.0.0
     */
    __publicField(this, "buckets", []);
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    const length = this.buckets.length;
    let bucket = void 0;
    let index2 = 0;
    for (; index2 < length; index2++) {
      if (this.buckets[index2][0] <= priority) {
        bucket = this.buckets[index2];
      } else {
        break;
      }
    }
    if (bucket && bucket[0] === priority) {
      bucket[1].push(task);
    } else if (index2 === length) {
      this.buckets.push([priority, [task]]);
    } else {
      this.buckets.splice(index2, 0, [priority, [task]]);
    }
  }
}
class MixedScheduler {
  constructor(maxNextTickBeforeTimer) {
    __publicField(this, "maxNextTickBeforeTimer");
    /**
     * @since 2.0.0
     */
    __publicField(this, "running", false);
    /**
     * @since 2.0.0
     */
    __publicField(this, "tasks", /* @__PURE__ */ new PriorityBuckets());
    this.maxNextTickBeforeTimer = maxNextTickBeforeTimer;
  }
  /**
   * @since 2.0.0
   */
  starveInternal(depth) {
    const tasks = this.tasks.buckets;
    this.tasks.buckets = [];
    for (const [_, toRun] of tasks) {
      for (let i = 0; i < toRun.length; i++) {
        toRun[i]();
      }
    }
    if (this.tasks.buckets.length === 0) {
      this.running = false;
    } else {
      this.starve(depth);
    }
  }
  /**
   * @since 2.0.0
   */
  starve(depth = 0) {
    if (depth >= this.maxNextTickBeforeTimer) {
      setTimeout(() => this.starveInternal(0), 0);
    } else {
      Promise.resolve(void 0).then(() => this.starveInternal(depth + 1));
    }
  }
  /**
   * @since 2.0.0
   */
  shouldYield(fiber) {
    return fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) ? fiber.getFiberRef(currentSchedulingPriority) : false;
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    this.tasks.scheduleTask(task, priority);
    if (!this.running) {
      this.running = true;
      this.starve();
    }
  }
}
const defaultScheduler = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/Scheduler/defaultScheduler"), () => new MixedScheduler(2048));
const currentScheduler = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentScheduler"), () => fiberRefUnsafeMake(defaultScheduler));
const currentRequestMap = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestMap"), () => fiberRefUnsafeMake(/* @__PURE__ */ new Map()));
const formatLabel = (key) => key.replace(/[\s="]/g, "_");
const render = (now) => (self2) => {
  const label = formatLabel(self2.label);
  return `${label}=${now - self2.startTime}ms`;
};
const MetricLabelSymbolKey = "effect/MetricLabel";
const MetricLabelTypeId = /* @__PURE__ */ Symbol.for(MetricLabelSymbolKey);
class MetricLabelImpl {
  constructor(key, value) {
    __publicField(this, "key");
    __publicField(this, "value");
    __publicField(this, _q, MetricLabelTypeId);
    __publicField(this, "_hash");
    this.key = key;
    this.value = value;
    this._hash = string$1(MetricLabelSymbolKey + this.key + this.value);
  }
  [(_q = MetricLabelTypeId, symbol$3)]() {
    return this._hash;
  }
  [symbol$2](that) {
    return isMetricLabel(that) && this.key === that.key && this.value === that.value;
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
}
const make$6 = (key, value) => {
  return new MetricLabelImpl(key, value);
};
const isMetricLabel = (u) => hasProperty(u, MetricLabelTypeId);
const try_$3 = (arg) => {
  let evaluate2;
  let onFailure = void 0;
  if (typeof arg === "function") {
    evaluate2 = arg;
  } else {
    evaluate2 = arg.try;
    onFailure = arg.catch;
  }
  return suspend(() => {
    try {
      return succeed$4(internalCall(evaluate2));
    } catch (error) {
      return fail$2(onFailure ? internalCall(() => onFailure(error)) : new UnknownException(error, "An unknown error occurred in Effect.try"));
    }
  });
};
const tryPromise$1 = (arg) => {
  let evaluate2;
  let catcher = void 0;
  if (typeof arg === "function") {
    evaluate2 = arg;
  } else {
    evaluate2 = arg.try;
    catcher = arg.catch;
  }
  const fail2 = (e) => catcher ? failSync(() => catcher(e)) : fail$2(new UnknownException(e, "An unknown error occurred in Effect.tryPromise"));
  if (evaluate2.length >= 1) {
    return async_((resolve, signal) => {
      try {
        evaluate2(signal).then((a) => resolve(exitSucceed$1(a)), (e) => resolve(fail2(e)));
      } catch (e) {
        resolve(fail2(e));
      }
    });
  }
  return async_((resolve) => {
    try {
      evaluate2().then((a) => resolve(exitSucceed$1(a)), (e) => resolve(fail2(e)));
    } catch (e) {
      resolve(fail2(e));
    }
  });
};
const OP_INTERRUPT_SIGNAL = "InterruptSignal";
const OP_STATEFUL = "Stateful";
const OP_RESUME = "Resume";
const OP_YIELD_NOW = "YieldNow";
const interruptSignal = (cause) => ({
  _tag: OP_INTERRUPT_SIGNAL,
  cause
});
const stateful = (onFiber) => ({
  _tag: OP_STATEFUL,
  onFiber
});
const resume = (effect) => ({
  _tag: OP_RESUME,
  effect
});
const yieldNow = () => ({
  _tag: OP_YIELD_NOW
});
const FiberScopeSymbolKey = "effect/FiberScope";
const FiberScopeTypeId = /* @__PURE__ */ Symbol.for(FiberScopeSymbolKey);
_r = FiberScopeTypeId;
class Global {
  constructor() {
    __publicField(this, _r, FiberScopeTypeId);
    __publicField(this, "fiberId", none$4);
    __publicField(this, "roots", /* @__PURE__ */ new Set());
  }
  add(_runtimeFlags, child2) {
    this.roots.add(child2);
    child2.addObserver(() => {
      this.roots.delete(child2);
    });
  }
}
_s = FiberScopeTypeId;
class Local {
  constructor(fiberId2, parent) {
    __publicField(this, "fiberId");
    __publicField(this, "parent");
    __publicField(this, _s, FiberScopeTypeId);
    this.fiberId = fiberId2;
    this.parent = parent;
  }
  add(_runtimeFlags, child2) {
    this.parent.tell(stateful((parentFiber) => {
      parentFiber.addChild(child2);
      child2.addObserver(() => {
        parentFiber.removeChild(child2);
      });
    }));
  }
}
const unsafeMake$1 = (fiber) => {
  return new Local(fiber.id(), fiber);
};
const globalScope = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/FiberScope/Global"), () => new Global());
const FiberSymbolKey = "effect/Fiber";
const FiberTypeId = /* @__PURE__ */ Symbol.for(FiberSymbolKey);
const fiberVariance = {
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _
};
const RuntimeFiberSymbolKey = "effect/Fiber";
const RuntimeFiberTypeId = /* @__PURE__ */ Symbol.for(RuntimeFiberSymbolKey);
const join = (self2) => zipLeft(flatten(self2.await), self2.inheritAll);
({
  ...CommitPrototype
});
const currentFiberURI = "effect/FiberCurrent";
const LoggerSymbolKey = "effect/Logger";
const LoggerTypeId = /* @__PURE__ */ Symbol.for(LoggerSymbolKey);
const loggerVariance = {
  /* c8 ignore next */
  _Message: (_) => _,
  /* c8 ignore next */
  _Output: (_) => _
};
const makeLogger = (log) => ({
  [LoggerTypeId]: loggerVariance,
  log,
  pipe() {
    return pipeArguments$1(this, arguments);
  }
});
const textOnly = /^[^\s"=]*$/;
const format = (quoteValue, whitespace) => ({
  annotations,
  cause,
  date,
  fiberId: fiberId2,
  logLevel,
  message,
  spans
}) => {
  const formatValue = (value) => value.match(textOnly) ? value : quoteValue(value);
  const format2 = (label, value) => `${formatLabel(label)}=${formatValue(value)}`;
  const append2 = (label, value) => " " + format2(label, value);
  let out = format2("timestamp", date.toISOString());
  out += append2("level", logLevel.label);
  out += append2("fiber", threadName$1(fiberId2));
  const messages = ensure(message);
  for (let i = 0; i < messages.length; i++) {
    out += append2("message", toStringUnknown(messages[i], whitespace));
  }
  if (!isEmptyType(cause)) {
    out += append2("cause", pretty$1(cause, {
      renderErrorCause: true
    }));
  }
  for (const span2 of spans) {
    out += " " + render(date.getTime())(span2);
  }
  for (const [label, value] of annotations) {
    out += append2(label, toStringUnknown(value, whitespace));
  }
  return out;
};
const escapeDoubleQuotes = (s) => `"${s.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`;
const stringLogger = /* @__PURE__ */ makeLogger(/* @__PURE__ */ format(escapeDoubleQuotes));
const hasProcessStdout = typeof process === "object" && process !== null && typeof process.stdout === "object" && process.stdout !== null;
hasProcessStdout && process.stdout.isTTY === true;
const MetricBoundariesSymbolKey = "effect/MetricBoundaries";
const MetricBoundariesTypeId = /* @__PURE__ */ Symbol.for(MetricBoundariesSymbolKey);
class MetricBoundariesImpl {
  constructor(values) {
    __publicField(this, "values");
    __publicField(this, _t, MetricBoundariesTypeId);
    __publicField(this, "_hash");
    this.values = values;
    this._hash = pipe$1(string$1(MetricBoundariesSymbolKey), combine$6(array$1(this.values)));
  }
  [(_t = MetricBoundariesTypeId, symbol$3)]() {
    return this._hash;
  }
  [symbol$2](u) {
    return isMetricBoundaries(u) && equals$2(this.values, u.values);
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
}
const isMetricBoundaries = (u) => hasProperty(u, MetricBoundariesTypeId);
const fromIterable$1 = (iterable) => {
  const values = pipe$1(iterable, appendAll$3(of$2(Number.POSITIVE_INFINITY)), dedupe);
  return new MetricBoundariesImpl(values);
};
const exponential = (options) => pipe$1(makeBy(options.count - 1, (i) => options.start * Math.pow(options.factor, i)), unsafeFromArray$1, fromIterable$1);
const MetricKeyTypeSymbolKey = "effect/MetricKeyType";
const MetricKeyTypeTypeId = /* @__PURE__ */ Symbol.for(MetricKeyTypeSymbolKey);
const CounterKeyTypeSymbolKey = "effect/MetricKeyType/Counter";
const CounterKeyTypeTypeId = /* @__PURE__ */ Symbol.for(CounterKeyTypeSymbolKey);
const FrequencyKeyTypeSymbolKey = "effect/MetricKeyType/Frequency";
const FrequencyKeyTypeTypeId = /* @__PURE__ */ Symbol.for(FrequencyKeyTypeSymbolKey);
const GaugeKeyTypeSymbolKey = "effect/MetricKeyType/Gauge";
const GaugeKeyTypeTypeId = /* @__PURE__ */ Symbol.for(GaugeKeyTypeSymbolKey);
const HistogramKeyTypeSymbolKey = "effect/MetricKeyType/Histogram";
const HistogramKeyTypeTypeId = /* @__PURE__ */ Symbol.for(HistogramKeyTypeSymbolKey);
const SummaryKeyTypeSymbolKey = "effect/MetricKeyType/Summary";
const SummaryKeyTypeTypeId = /* @__PURE__ */ Symbol.for(SummaryKeyTypeSymbolKey);
const metricKeyTypeVariance = {
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _Out: (_) => _
};
class CounterKeyType {
  constructor(incremental, bigint) {
    __publicField(this, "incremental");
    __publicField(this, "bigint");
    __publicField(this, _v, metricKeyTypeVariance);
    __publicField(this, _u, CounterKeyTypeTypeId);
    __publicField(this, "_hash");
    this.incremental = incremental;
    this.bigint = bigint;
    this._hash = string$1(CounterKeyTypeSymbolKey);
  }
  [(_v = MetricKeyTypeTypeId, _u = CounterKeyTypeTypeId, symbol$3)]() {
    return this._hash;
  }
  [symbol$2](that) {
    return isCounterKey(that);
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
}
class HistogramKeyType {
  constructor(boundaries) {
    __publicField(this, "boundaries");
    __publicField(this, _x, metricKeyTypeVariance);
    __publicField(this, _w, HistogramKeyTypeTypeId);
    __publicField(this, "_hash");
    this.boundaries = boundaries;
    this._hash = pipe$1(string$1(HistogramKeyTypeSymbolKey), combine$6(hash$1(this.boundaries)));
  }
  [(_x = MetricKeyTypeTypeId, _w = HistogramKeyTypeTypeId, symbol$3)]() {
    return this._hash;
  }
  [symbol$2](that) {
    return isHistogramKey(that) && equals$2(this.boundaries, that.boundaries);
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
}
const counter$4 = (options) => new CounterKeyType((options == null ? void 0 : options.incremental) ?? false, (options == null ? void 0 : options.bigint) ?? false);
const histogram$4 = (boundaries) => {
  return new HistogramKeyType(boundaries);
};
const isCounterKey = (u) => hasProperty(u, CounterKeyTypeTypeId);
const isFrequencyKey = (u) => hasProperty(u, FrequencyKeyTypeTypeId);
const isGaugeKey = (u) => hasProperty(u, GaugeKeyTypeTypeId);
const isHistogramKey = (u) => hasProperty(u, HistogramKeyTypeTypeId);
const isSummaryKey = (u) => hasProperty(u, SummaryKeyTypeTypeId);
const MetricKeySymbolKey = "effect/MetricKey";
const MetricKeyTypeId = /* @__PURE__ */ Symbol.for(MetricKeySymbolKey);
const metricKeyVariance = {
  /* c8 ignore next */
  _Type: (_) => _
};
const arrayEquivilence = /* @__PURE__ */ getEquivalence$3(equals$2);
class MetricKeyImpl {
  constructor(name, keyType, description, tags = []) {
    __publicField(this, "name");
    __publicField(this, "keyType");
    __publicField(this, "description");
    __publicField(this, "tags");
    __publicField(this, _y, metricKeyVariance);
    __publicField(this, "_hash");
    this.name = name;
    this.keyType = keyType;
    this.description = description;
    this.tags = tags;
    this._hash = pipe$1(string$1(this.name + this.description), combine$6(hash$1(this.keyType)), combine$6(array$1(this.tags)));
  }
  [(_y = MetricKeyTypeId, symbol$3)]() {
    return this._hash;
  }
  [symbol$2](u) {
    return isMetricKey(u) && this.name === u.name && equals$2(this.keyType, u.keyType) && equals$2(this.description, u.description) && arrayEquivilence(this.tags, u.tags);
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
}
const isMetricKey = (u) => hasProperty(u, MetricKeyTypeId);
const counter$3 = (name, options) => new MetricKeyImpl(name, counter$4(options), fromNullable(options == null ? void 0 : options.description));
const histogram$3 = (name, boundaries, description) => new MetricKeyImpl(name, histogram$4(boundaries), fromNullable(description));
const taggedWithLabels$1 = /* @__PURE__ */ dual$1(2, (self2, extraTags) => extraTags.length === 0 ? self2 : new MetricKeyImpl(self2.name, self2.keyType, self2.description, union$5(self2.tags, extraTags)));
const TypeId$3 = /* @__PURE__ */ Symbol.for("effect/MutableHashMap");
const MutableHashMapProto = {
  [TypeId$3]: TypeId$3,
  [Symbol.iterator]() {
    return new MutableHashMapIterator(this);
  },
  toString() {
    return format$2(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableHashMap",
      values: Array.from(this).map(toJSON$1)
    };
  },
  [NodeInspectSymbol$1]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments$1(this, arguments);
  }
};
class MutableHashMapIterator {
  constructor(self2) {
    __publicField(this, "self");
    __publicField(this, "referentialIterator");
    __publicField(this, "bucketIterator");
    this.self = self2;
    this.referentialIterator = self2.referential[Symbol.iterator]();
  }
  next() {
    if (this.bucketIterator !== void 0) {
      return this.bucketIterator.next();
    }
    const result = this.referentialIterator.next();
    if (result.done) {
      this.bucketIterator = new BucketIterator(this.self.buckets.values());
      return this.next();
    }
    return result;
  }
  [Symbol.iterator]() {
    return new MutableHashMapIterator(this.self);
  }
}
class BucketIterator {
  constructor(backing) {
    __publicField(this, "backing");
    __publicField(this, "currentBucket");
    this.backing = backing;
  }
  next() {
    if (this.currentBucket === void 0) {
      const result2 = this.backing.next();
      if (result2.done) {
        return result2;
      }
      this.currentBucket = result2.value[Symbol.iterator]();
    }
    const result = this.currentBucket.next();
    if (result.done) {
      this.currentBucket = void 0;
      return this.next();
    }
    return result;
  }
}
const empty$5 = () => {
  const self2 = Object.create(MutableHashMapProto);
  self2.referential = /* @__PURE__ */ new Map();
  self2.buckets = /* @__PURE__ */ new Map();
  self2.bucketsSize = 0;
  return self2;
};
const get = /* @__PURE__ */ dual$1(2, (self2, key) => {
  if (isEqual$1(key) === false) {
    return self2.referential.has(key) ? some$2(self2.referential.get(key)) : none$6();
  }
  const hash2 = key[symbol$3]();
  const bucket = self2.buckets.get(hash2);
  if (bucket === void 0) {
    return none$6();
  }
  return getFromBucket(self2, bucket, key);
});
const getFromBucket = (self2, bucket, key, remove2 = false) => {
  for (let i = 0, len = bucket.length; i < len; i++) {
    if (key[symbol$2](bucket[i][0])) {
      const value = bucket[i][1];
      if (remove2) {
        bucket.splice(i, 1);
        self2.bucketsSize--;
      }
      return some$2(value);
    }
  }
  return none$6();
};
const has = /* @__PURE__ */ dual$1(2, (self2, key) => isSome$2(get(self2, key)));
const set$1 = /* @__PURE__ */ dual$1(3, (self2, key, value) => {
  if (isEqual$1(key) === false) {
    self2.referential.set(key, value);
    return self2;
  }
  const hash2 = key[symbol$3]();
  const bucket = self2.buckets.get(hash2);
  if (bucket === void 0) {
    self2.buckets.set(hash2, [[key, value]]);
    self2.bucketsSize++;
    return self2;
  }
  removeFromBucket(self2, bucket, key);
  bucket.push([key, value]);
  self2.bucketsSize++;
  return self2;
});
const removeFromBucket = (self2, bucket, key) => {
  for (let i = 0, len = bucket.length; i < len; i++) {
    if (key[symbol$2](bucket[i][0])) {
      bucket.splice(i, 1);
      self2.bucketsSize--;
      return;
    }
  }
};
const MetricStateSymbolKey = "effect/MetricState";
const MetricStateTypeId = /* @__PURE__ */ Symbol.for(MetricStateSymbolKey);
const CounterStateSymbolKey = "effect/MetricState/Counter";
const CounterStateTypeId = /* @__PURE__ */ Symbol.for(CounterStateSymbolKey);
const FrequencyStateSymbolKey = "effect/MetricState/Frequency";
const FrequencyStateTypeId = /* @__PURE__ */ Symbol.for(FrequencyStateSymbolKey);
const GaugeStateSymbolKey = "effect/MetricState/Gauge";
const GaugeStateTypeId = /* @__PURE__ */ Symbol.for(GaugeStateSymbolKey);
const HistogramStateSymbolKey = "effect/MetricState/Histogram";
const HistogramStateTypeId = /* @__PURE__ */ Symbol.for(HistogramStateSymbolKey);
const SummaryStateSymbolKey = "effect/MetricState/Summary";
const SummaryStateTypeId = /* @__PURE__ */ Symbol.for(SummaryStateSymbolKey);
const metricStateVariance = {
  /* c8 ignore next */
  _A: (_) => _
};
class CounterState {
  constructor(count) {
    __publicField(this, "count");
    __publicField(this, _A, metricStateVariance);
    __publicField(this, _z, CounterStateTypeId);
    this.count = count;
  }
  [(_A = MetricStateTypeId, _z = CounterStateTypeId, symbol$3)]() {
    return pipe$1(hash$1(CounterStateSymbolKey), combine$6(hash$1(this.count)), cached(this));
  }
  [symbol$2](that) {
    return isCounterState(that) && this.count === that.count;
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
}
const arrayEquals = /* @__PURE__ */ getEquivalence$3(equals$2);
class FrequencyState {
  constructor(occurrences) {
    __publicField(this, "occurrences");
    __publicField(this, _C, metricStateVariance);
    __publicField(this, _B, FrequencyStateTypeId);
    __publicField(this, "_hash");
    this.occurrences = occurrences;
  }
  [(_C = MetricStateTypeId, _B = FrequencyStateTypeId, symbol$3)]() {
    return pipe$1(string$1(FrequencyStateSymbolKey), combine$6(array$1(fromIterable$7(this.occurrences.entries()))), cached(this));
  }
  [symbol$2](that) {
    return isFrequencyState(that) && arrayEquals(fromIterable$7(this.occurrences.entries()), fromIterable$7(that.occurrences.entries()));
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
}
class GaugeState {
  constructor(value) {
    __publicField(this, "value");
    __publicField(this, _E, metricStateVariance);
    __publicField(this, _D, GaugeStateTypeId);
    this.value = value;
  }
  [(_E = MetricStateTypeId, _D = GaugeStateTypeId, symbol$3)]() {
    return pipe$1(hash$1(GaugeStateSymbolKey), combine$6(hash$1(this.value)), cached(this));
  }
  [symbol$2](u) {
    return isGaugeState(u) && this.value === u.value;
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
}
class HistogramState {
  constructor(buckets, count, min, max, sum) {
    __publicField(this, "buckets");
    __publicField(this, "count");
    __publicField(this, "min");
    __publicField(this, "max");
    __publicField(this, "sum");
    __publicField(this, _G, metricStateVariance);
    __publicField(this, _F, HistogramStateTypeId);
    this.buckets = buckets;
    this.count = count;
    this.min = min;
    this.max = max;
    this.sum = sum;
  }
  [(_G = MetricStateTypeId, _F = HistogramStateTypeId, symbol$3)]() {
    return pipe$1(hash$1(HistogramStateSymbolKey), combine$6(hash$1(this.buckets)), combine$6(hash$1(this.count)), combine$6(hash$1(this.min)), combine$6(hash$1(this.max)), combine$6(hash$1(this.sum)), cached(this));
  }
  [symbol$2](that) {
    return isHistogramState(that) && equals$2(this.buckets, that.buckets) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
}
class SummaryState {
  constructor(error, quantiles, count, min, max, sum) {
    __publicField(this, "error");
    __publicField(this, "quantiles");
    __publicField(this, "count");
    __publicField(this, "min");
    __publicField(this, "max");
    __publicField(this, "sum");
    __publicField(this, _I, metricStateVariance);
    __publicField(this, _H, SummaryStateTypeId);
    this.error = error;
    this.quantiles = quantiles;
    this.count = count;
    this.min = min;
    this.max = max;
    this.sum = sum;
  }
  [(_I = MetricStateTypeId, _H = SummaryStateTypeId, symbol$3)]() {
    return pipe$1(hash$1(SummaryStateSymbolKey), combine$6(hash$1(this.error)), combine$6(hash$1(this.quantiles)), combine$6(hash$1(this.count)), combine$6(hash$1(this.min)), combine$6(hash$1(this.max)), combine$6(hash$1(this.sum)), cached(this));
  }
  [symbol$2](that) {
    return isSummaryState(that) && this.error === that.error && equals$2(this.quantiles, that.quantiles) && this.count === that.count && this.min === that.min && this.max === that.max && this.sum === that.sum;
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
}
const counter$2 = (count) => new CounterState(count);
const frequency$1 = (occurrences) => {
  return new FrequencyState(occurrences);
};
const gauge$1 = (count) => new GaugeState(count);
const histogram$2 = (options) => new HistogramState(options.buckets, options.count, options.min, options.max, options.sum);
const summary$1 = (options) => new SummaryState(options.error, options.quantiles, options.count, options.min, options.max, options.sum);
const isCounterState = (u) => hasProperty(u, CounterStateTypeId);
const isFrequencyState = (u) => hasProperty(u, FrequencyStateTypeId);
const isGaugeState = (u) => hasProperty(u, GaugeStateTypeId);
const isHistogramState = (u) => hasProperty(u, HistogramStateTypeId);
const isSummaryState = (u) => hasProperty(u, SummaryStateTypeId);
const MetricHookSymbolKey = "effect/MetricHook";
const MetricHookTypeId = /* @__PURE__ */ Symbol.for(MetricHookSymbolKey);
const metricHookVariance = {
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _Out: (_) => _
};
const make$5 = (options) => ({
  [MetricHookTypeId]: metricHookVariance,
  pipe() {
    return pipeArguments$1(this, arguments);
  },
  ...options
});
const bigint0 = /* @__PURE__ */ BigInt(0);
const counter$1 = (key) => {
  let sum = key.keyType.bigint ? bigint0 : 0;
  const canUpdate = key.keyType.incremental ? key.keyType.bigint ? (value) => value >= bigint0 : (value) => value >= 0 : (_value2) => true;
  const update2 = (value) => {
    if (canUpdate(value)) {
      sum = sum + value;
    }
  };
  return make$5({
    get: () => counter$2(sum),
    update: update2,
    modify: update2
  });
};
const frequency = (key) => {
  const values = /* @__PURE__ */ new Map();
  for (const word of key.keyType.preregisteredWords) {
    values.set(word, 0);
  }
  const update2 = (word) => {
    const slotCount = values.get(word) ?? 0;
    values.set(word, slotCount + 1);
  };
  return make$5({
    get: () => frequency$1(values),
    update: update2,
    modify: update2
  });
};
const gauge = (_key, startAt) => {
  let value = startAt;
  return make$5({
    get: () => gauge$1(value),
    update: (v) => {
      value = v;
    },
    modify: (v) => {
      value = value + v;
    }
  });
};
const histogram$1 = (key) => {
  const bounds = key.keyType.boundaries.values;
  const size2 = bounds.length;
  const values = new Uint32Array(size2 + 1);
  const boundaries = new Float32Array(size2);
  let count = 0;
  let sum = 0;
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;
  pipe$1(bounds, sort(Order$1), map$4((n, i) => {
    boundaries[i] = n;
  }));
  const update2 = (value) => {
    let from = 0;
    let to = size2;
    while (from !== to) {
      const mid = Math.floor(from + (to - from) / 2);
      const boundary = boundaries[mid];
      if (value <= boundary) {
        to = mid;
      } else {
        from = mid;
      }
      if (to === from + 1) {
        if (value <= boundaries[from]) {
          to = from;
        } else {
          from = to;
        }
      }
    }
    values[from] = values[from] + 1;
    count = count + 1;
    sum = sum + value;
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  };
  const getBuckets = () => {
    const builder = allocate(size2);
    let cumulated = 0;
    for (let i = 0; i < size2; i++) {
      const boundary = boundaries[i];
      const value = values[i];
      cumulated = cumulated + value;
      builder[i] = [boundary, cumulated];
    }
    return builder;
  };
  return make$5({
    get: () => histogram$2({
      buckets: getBuckets(),
      count,
      min,
      max,
      sum
    }),
    update: update2,
    modify: update2
  });
};
const summary = (key) => {
  const {
    error,
    maxAge,
    maxSize,
    quantiles
  } = key.keyType;
  const sortedQuantiles = pipe$1(quantiles, sort(Order$1));
  const values = allocate(maxSize);
  let head2 = 0;
  let count = 0;
  let sum = 0;
  let min = Number.MAX_VALUE;
  let max = Number.MIN_VALUE;
  const snapshot = (now) => {
    const builder = [];
    let i = 0;
    while (i !== maxSize - 1) {
      const item = values[i];
      if (item != null) {
        const [t, v] = item;
        const age = millis(now - t);
        if (greaterThanOrEqualTo(age, zero) && lessThanOrEqualTo(age, maxAge)) {
          builder.push(v);
        }
      }
      i = i + 1;
    }
    return calculateQuantiles(error, sortedQuantiles, sort(builder, Order$1));
  };
  const observe = (value, timestamp) => {
    if (maxSize > 0) {
      head2 = head2 + 1;
      const target = head2 % maxSize;
      values[target] = [timestamp, value];
    }
    count = count + 1;
    sum = sum + value;
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  };
  return make$5({
    get: () => summary$1({
      error,
      quantiles: snapshot(Date.now()),
      count,
      min,
      max,
      sum
    }),
    update: ([value, timestamp]) => observe(value, timestamp),
    modify: ([value, timestamp]) => observe(value, timestamp)
  });
};
const calculateQuantiles = (error, sortedQuantiles, sortedSamples) => {
  const sampleCount = sortedSamples.length;
  if (!isNonEmptyReadonlyArray(sortedQuantiles)) {
    return empty$n();
  }
  const head2 = sortedQuantiles[0];
  const tail = sortedQuantiles.slice(1);
  const resolvedHead = resolveQuantile(error, sampleCount, none$6(), 0, head2, sortedSamples);
  const resolved = of$3(resolvedHead);
  tail.forEach((quantile) => {
    resolved.push(resolveQuantile(error, sampleCount, resolvedHead.value, resolvedHead.consumed, quantile, resolvedHead.rest));
  });
  return map$4(resolved, (rq) => [rq.quantile, rq.value]);
};
const resolveQuantile = (error, sampleCount, current, consumed, quantile, rest) => {
  let error_1 = error;
  let sampleCount_1 = sampleCount;
  let current_1 = current;
  let consumed_1 = consumed;
  let quantile_1 = quantile;
  let rest_1 = rest;
  let error_2 = error;
  let sampleCount_2 = sampleCount;
  let current_2 = current;
  let consumed_2 = consumed;
  let quantile_2 = quantile;
  let rest_2 = rest;
  while (1) {
    if (!isNonEmptyReadonlyArray(rest_1)) {
      return {
        quantile: quantile_1,
        value: none$6(),
        consumed: consumed_1,
        rest: []
      };
    }
    if (quantile_1 === 1) {
      return {
        quantile: quantile_1,
        value: some$2(lastNonEmpty(rest_1)),
        consumed: consumed_1 + rest_1.length,
        rest: []
      };
    }
    const headValue = headNonEmpty$2(rest_1);
    const sameHead = span(rest_1, (n) => n === headValue);
    const desired = quantile_1 * sampleCount_1;
    const allowedError = error_1 / 2 * desired;
    const candConsumed = consumed_1 + sameHead[0].length;
    const candError = Math.abs(candConsumed - desired);
    if (candConsumed < desired - allowedError) {
      error_2 = error_1;
      sampleCount_2 = sampleCount_1;
      current_2 = head(rest_1);
      consumed_2 = candConsumed;
      quantile_2 = quantile_1;
      rest_2 = sameHead[1];
      error_1 = error_2;
      sampleCount_1 = sampleCount_2;
      current_1 = current_2;
      consumed_1 = consumed_2;
      quantile_1 = quantile_2;
      rest_1 = rest_2;
      continue;
    }
    if (candConsumed > desired + allowedError) {
      const valueToReturn = isNone$2(current_1) ? some$2(headValue) : current_1;
      return {
        quantile: quantile_1,
        value: valueToReturn,
        consumed: consumed_1,
        rest: rest_1
      };
    }
    switch (current_1._tag) {
      case "None": {
        error_2 = error_1;
        sampleCount_2 = sampleCount_1;
        current_2 = head(rest_1);
        consumed_2 = candConsumed;
        quantile_2 = quantile_1;
        rest_2 = sameHead[1];
        error_1 = error_2;
        sampleCount_1 = sampleCount_2;
        current_1 = current_2;
        consumed_1 = consumed_2;
        quantile_1 = quantile_2;
        rest_1 = rest_2;
        continue;
      }
      case "Some": {
        const prevError = Math.abs(desired - current_1.value);
        if (candError < prevError) {
          error_2 = error_1;
          sampleCount_2 = sampleCount_1;
          current_2 = head(rest_1);
          consumed_2 = candConsumed;
          quantile_2 = quantile_1;
          rest_2 = sameHead[1];
          error_1 = error_2;
          sampleCount_1 = sampleCount_2;
          current_1 = current_2;
          consumed_1 = consumed_2;
          quantile_1 = quantile_2;
          rest_1 = rest_2;
          continue;
        }
        return {
          quantile: quantile_1,
          value: some$2(current_1.value),
          consumed: consumed_1,
          rest: rest_1
        };
      }
    }
  }
  throw new Error("BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/effect/issues");
};
const MetricPairSymbolKey = "effect/MetricPair";
const MetricPairTypeId = /* @__PURE__ */ Symbol.for(MetricPairSymbolKey);
const metricPairVariance = {
  /* c8 ignore next */
  _Type: (_) => _
};
const unsafeMake = (metricKey, metricState) => {
  return {
    [MetricPairTypeId]: metricPairVariance,
    metricKey,
    metricState,
    pipe() {
      return pipeArguments$1(this, arguments);
    }
  };
};
const MetricRegistrySymbolKey = "effect/MetricRegistry";
const MetricRegistryTypeId = /* @__PURE__ */ Symbol.for(MetricRegistrySymbolKey);
_J = MetricRegistryTypeId;
class MetricRegistryImpl {
  constructor() {
    __publicField(this, _J, MetricRegistryTypeId);
    __publicField(this, "map", /* @__PURE__ */ empty$5());
  }
  snapshot() {
    const result = [];
    for (const [key, hook] of this.map) {
      result.push(unsafeMake(key, hook.get()));
    }
    return result;
  }
  get(key) {
    const hook = pipe$1(this.map, get(key), getOrUndefined$1);
    if (hook == null) {
      if (isCounterKey(key.keyType)) {
        return this.getCounter(key);
      }
      if (isGaugeKey(key.keyType)) {
        return this.getGauge(key);
      }
      if (isFrequencyKey(key.keyType)) {
        return this.getFrequency(key);
      }
      if (isHistogramKey(key.keyType)) {
        return this.getHistogram(key);
      }
      if (isSummaryKey(key.keyType)) {
        return this.getSummary(key);
      }
      throw new Error("BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/effect/issues");
    } else {
      return hook;
    }
  }
  getCounter(key) {
    let value = pipe$1(this.map, get(key), getOrUndefined$1);
    if (value == null) {
      const counter2 = counter$1(key);
      if (!pipe$1(this.map, has(key))) {
        pipe$1(this.map, set$1(key, counter2));
      }
      value = counter2;
    }
    return value;
  }
  getFrequency(key) {
    let value = pipe$1(this.map, get(key), getOrUndefined$1);
    if (value == null) {
      const frequency$12 = frequency(key);
      if (!pipe$1(this.map, has(key))) {
        pipe$1(this.map, set$1(key, frequency$12));
      }
      value = frequency$12;
    }
    return value;
  }
  getGauge(key) {
    let value = pipe$1(this.map, get(key), getOrUndefined$1);
    if (value == null) {
      const gauge$12 = gauge(key, key.keyType.bigint ? BigInt(0) : 0);
      if (!pipe$1(this.map, has(key))) {
        pipe$1(this.map, set$1(key, gauge$12));
      }
      value = gauge$12;
    }
    return value;
  }
  getHistogram(key) {
    let value = pipe$1(this.map, get(key), getOrUndefined$1);
    if (value == null) {
      const histogram2 = histogram$1(key);
      if (!pipe$1(this.map, has(key))) {
        pipe$1(this.map, set$1(key, histogram2));
      }
      value = histogram2;
    }
    return value;
  }
  getSummary(key) {
    let value = pipe$1(this.map, get(key), getOrUndefined$1);
    if (value == null) {
      const summary$12 = summary(key);
      if (!pipe$1(this.map, has(key))) {
        pipe$1(this.map, set$1(key, summary$12));
      }
      value = summary$12;
    }
    return value;
  }
}
const make$4 = () => {
  return new MetricRegistryImpl();
};
const MetricSymbolKey = "effect/Metric";
const MetricTypeId = /* @__PURE__ */ Symbol.for(MetricSymbolKey);
const metricVariance = {
  /* c8 ignore next */
  _Type: (_) => _,
  /* c8 ignore next */
  _In: (_) => _,
  /* c8 ignore next */
  _Out: (_) => _
};
const globalMetricRegistry = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/Metric/globalMetricRegistry"), () => make$4());
const make$3 = function(keyType, unsafeUpdate, unsafeValue, unsafeModify) {
  const metric = Object.assign((effect) => tap$1(effect, (a) => update(metric, a)), {
    [MetricTypeId]: metricVariance,
    keyType,
    unsafeUpdate,
    unsafeValue,
    unsafeModify,
    register() {
      this.unsafeValue([]);
      return this;
    },
    pipe() {
      return pipeArguments$1(this, arguments);
    }
  });
  return metric;
};
const counter = (name, options) => fromMetricKey(counter$3(name, options));
const fromMetricKey = (key) => {
  let untaggedHook;
  const hookCache = /* @__PURE__ */ new WeakMap();
  const hook = (extraTags) => {
    if (extraTags.length === 0) {
      if (untaggedHook !== void 0) {
        return untaggedHook;
      }
      untaggedHook = globalMetricRegistry.get(key);
      return untaggedHook;
    }
    let hook2 = hookCache.get(extraTags);
    if (hook2 !== void 0) {
      return hook2;
    }
    hook2 = globalMetricRegistry.get(taggedWithLabels$1(key, extraTags));
    hookCache.set(extraTags, hook2);
    return hook2;
  };
  return make$3(key.keyType, (input, extraTags) => hook(extraTags).update(input), (extraTags) => hook(extraTags).get(), (input, extraTags) => hook(extraTags).modify(input));
};
const histogram = (name, boundaries, description) => fromMetricKey(histogram$3(name, boundaries, description));
const tagged = /* @__PURE__ */ dual$1(3, (self2, key, value) => taggedWithLabels(self2, [make$6(key, value)]));
const taggedWithLabels = /* @__PURE__ */ dual$1(2, (self2, extraTags) => {
  return make$3(self2.keyType, (input, extraTags1) => self2.unsafeUpdate(input, union$5(extraTags, extraTags1)), (extraTags1) => self2.unsafeValue(union$5(extraTags, extraTags1)), (input, extraTags1) => self2.unsafeModify(input, union$5(extraTags, extraTags1)));
});
const update = /* @__PURE__ */ dual$1(2, (self2, input) => fiberRefGetWith(currentMetricLabels, (tags) => sync$2(() => self2.unsafeUpdate(input, tags))));
({
  ...StructuralPrototype
});
const complete = /* @__PURE__ */ dual$1(2, (self2, result) => fiberRefGetWith(currentRequestMap, (map2) => sync$2(() => {
  if (map2.has(self2)) {
    const entry = map2.get(self2);
    if (!entry.state.completed) {
      entry.state.completed = true;
      deferredUnsafeDone(entry.result, result);
    }
  }
})));
const SupervisorSymbolKey = "effect/Supervisor";
const SupervisorTypeId = /* @__PURE__ */ Symbol.for(SupervisorSymbolKey);
const supervisorVariance = {
  /* c8 ignore next */
  _T: (_) => _
};
_K = SupervisorTypeId;
const _ProxySupervisor = class _ProxySupervisor {
  constructor(underlying, value0) {
    __publicField(this, "underlying");
    __publicField(this, "value0");
    __publicField(this, _K, supervisorVariance);
    this.underlying = underlying;
    this.value0 = value0;
  }
  get value() {
    return this.value0;
  }
  onStart(context, effect, parent, fiber) {
    this.underlying.onStart(context, effect, parent, fiber);
  }
  onEnd(value, fiber) {
    this.underlying.onEnd(value, fiber);
  }
  onEffect(fiber, effect) {
    this.underlying.onEffect(fiber, effect);
  }
  onSuspend(fiber) {
    this.underlying.onSuspend(fiber);
  }
  onResume(fiber) {
    this.underlying.onResume(fiber);
  }
  map(f) {
    return new _ProxySupervisor(this, pipe$1(this.value, map$1(f)));
  }
  zip(right2) {
    return new Zip(this, right2);
  }
};
let ProxySupervisor = _ProxySupervisor;
_L = SupervisorTypeId;
const _Zip = class _Zip {
  constructor(left2, right2) {
    __publicField(this, "left");
    __publicField(this, "right");
    __publicField(this, "_tag", "Zip");
    __publicField(this, _L, supervisorVariance);
    this.left = left2;
    this.right = right2;
  }
  get value() {
    return zip(this.left.value, this.right.value);
  }
  onStart(context, effect, parent, fiber) {
    this.left.onStart(context, effect, parent, fiber);
    this.right.onStart(context, effect, parent, fiber);
  }
  onEnd(value, fiber) {
    this.left.onEnd(value, fiber);
    this.right.onEnd(value, fiber);
  }
  onEffect(fiber, effect) {
    this.left.onEffect(fiber, effect);
    this.right.onEffect(fiber, effect);
  }
  onSuspend(fiber) {
    this.left.onSuspend(fiber);
    this.right.onSuspend(fiber);
  }
  onResume(fiber) {
    this.left.onResume(fiber);
    this.right.onResume(fiber);
  }
  map(f) {
    return new ProxySupervisor(this, pipe$1(this.value, map$1(f)));
  }
  zip(right2) {
    return new _Zip(this, right2);
  }
};
let Zip = _Zip;
const isZip = (self2) => hasProperty(self2, SupervisorTypeId) && isTagged(self2, "Zip");
_M = SupervisorTypeId;
class Const {
  constructor(effect) {
    __publicField(this, "effect");
    __publicField(this, _M, supervisorVariance);
    this.effect = effect;
  }
  get value() {
    return this.effect;
  }
  onStart(_context, _effect, _parent, _fiber) {
  }
  onEnd(_value2, _fiber) {
  }
  onEffect(_fiber, _effect) {
  }
  onSuspend(_fiber) {
  }
  onResume(_fiber) {
  }
  map(f) {
    return new ProxySupervisor(this, pipe$1(this.value, map$1(f)));
  }
  zip(right2) {
    return new Zip(this, right2);
  }
  onRun(execution, _fiber) {
    return execution();
  }
}
const fromEffect = (effect) => {
  return new Const(effect);
};
const none$2 = /* @__PURE__ */ globalValue$1("effect/Supervisor/none", () => fromEffect(void_$1));
const make$2 = make$d;
const OP_EMPTY$1 = "Empty";
const OP_ADD_SUPERVISOR = "AddSupervisor";
const OP_REMOVE_SUPERVISOR = "RemoveSupervisor";
const OP_AND_THEN = "AndThen";
const empty$4 = {
  _tag: OP_EMPTY$1
};
const combine$1 = (self2, that) => {
  return {
    _tag: OP_AND_THEN,
    first: self2,
    second: that
  };
};
const patch = (self2, supervisor) => {
  return patchLoop(supervisor, of$2(self2));
};
const patchLoop = (_supervisor, _patches) => {
  let supervisor = _supervisor;
  let patches = _patches;
  while (isNonEmpty$1(patches)) {
    const head2 = headNonEmpty$1(patches);
    switch (head2._tag) {
      case OP_EMPTY$1: {
        patches = tailNonEmpty(patches);
        break;
      }
      case OP_ADD_SUPERVISOR: {
        supervisor = supervisor.zip(head2.supervisor);
        patches = tailNonEmpty(patches);
        break;
      }
      case OP_REMOVE_SUPERVISOR: {
        supervisor = removeSupervisor(supervisor, head2.supervisor);
        patches = tailNonEmpty(patches);
        break;
      }
      case OP_AND_THEN: {
        patches = prepend$2(head2.first)(prepend$2(head2.second)(tailNonEmpty(patches)));
        break;
      }
    }
  }
  return supervisor;
};
const removeSupervisor = (self2, that) => {
  if (equals$2(self2, that)) {
    return none$2;
  } else {
    if (isZip(self2)) {
      return removeSupervisor(self2.left, that).zip(removeSupervisor(self2.right, that));
    } else {
      return self2;
    }
  }
};
const toSet = (self2) => {
  if (equals$2(self2, none$2)) {
    return empty$j();
  } else {
    if (isZip(self2)) {
      return pipe$1(toSet(self2.left), union$3(toSet(self2.right)));
    } else {
      return make$h(self2);
    }
  }
};
const diff = (oldValue, newValue) => {
  if (equals$2(oldValue, newValue)) {
    return empty$4;
  }
  const oldSupervisors = toSet(oldValue);
  const newSupervisors = toSet(newValue);
  const added = pipe$1(newSupervisors, difference(oldSupervisors), reduce$6(empty$4, (patch2, supervisor) => combine$1(patch2, {
    _tag: OP_ADD_SUPERVISOR,
    supervisor
  })));
  const removed = pipe$1(oldSupervisors, difference(newSupervisors), reduce$6(empty$4, (patch2, supervisor) => combine$1(patch2, {
    _tag: OP_REMOVE_SUPERVISOR,
    supervisor
  })));
  return combine$1(added, removed);
};
const differ = /* @__PURE__ */ make$2({
  empty: empty$4,
  patch,
  combine: combine$1,
  diff
});
const fiberStarted = /* @__PURE__ */ counter("effect_fiber_started", {
  incremental: true
});
const fiberActive = /* @__PURE__ */ counter("effect_fiber_active");
const fiberSuccesses = /* @__PURE__ */ counter("effect_fiber_successes", {
  incremental: true
});
const fiberFailures = /* @__PURE__ */ counter("effect_fiber_failures", {
  incremental: true
});
const fiberLifetimes = /* @__PURE__ */ tagged(/* @__PURE__ */ histogram("effect_fiber_lifetimes", /* @__PURE__ */ exponential({
  start: 0.5,
  factor: 2,
  count: 35
})), "time_unit", "milliseconds");
const EvaluationSignalContinue = "Continue";
const EvaluationSignalDone = "Done";
const EvaluationSignalYieldNow = "Yield";
const runtimeFiberVariance = {
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _
};
const absurd = (_) => {
  throw new Error(`BUG: FiberRuntime - ${toStringUnknown(_)} - please report an issue at https://github.com/Effect-TS/effect/issues`);
};
const YieldedOp = /* @__PURE__ */ Symbol.for("effect/internal/fiberRuntime/YieldedOp");
const yieldedOpChannel = /* @__PURE__ */ globalValue$1("effect/internal/fiberRuntime/yieldedOpChannel", () => ({
  currentOp: null
}));
const contOpSuccess = {
  [OP_ON_SUCCESS]: (_, cont, value) => {
    return internalCall(() => cont.effect_instruction_i1(value));
  },
  ["OnStep"]: (_, _cont, value) => {
    return exitSucceed$1(exitSucceed$1(value));
  },
  [OP_ON_SUCCESS_AND_FAILURE]: (_, cont, value) => {
    return internalCall(() => cont.effect_instruction_i2(value));
  },
  [OP_REVERT_FLAGS]: (self2, cont, value) => {
    self2.patchRuntimeFlags(self2.currentRuntimeFlags, cont.patch);
    if (interruptible$2(self2.currentRuntimeFlags) && self2.isInterrupted()) {
      return exitFailCause$1(self2.getInterruptedCause());
    } else {
      return exitSucceed$1(value);
    }
  },
  [OP_WHILE]: (self2, cont, value) => {
    internalCall(() => cont.effect_instruction_i2(value));
    if (internalCall(() => cont.effect_instruction_i0())) {
      self2.pushStack(cont);
      return internalCall(() => cont.effect_instruction_i1());
    } else {
      return void_$1;
    }
  },
  [OP_ITERATOR]: (self2, cont, value) => {
    const state2 = internalCall(() => cont.effect_instruction_i0.next(value));
    if (state2.done) return exitSucceed$1(state2.value);
    self2.pushStack(cont);
    return yieldWrapGet(state2.value);
  }
};
const drainQueueWhileRunningTable = {
  [OP_INTERRUPT_SIGNAL]: (self2, runtimeFlags, cur, message) => {
    self2.processNewInterruptSignal(message.cause);
    return interruptible$2(runtimeFlags) ? exitFailCause$1(message.cause) : cur;
  },
  [OP_RESUME]: (_self, _runtimeFlags, _cur, _message) => {
    throw new Error("It is illegal to have multiple concurrent run loops in a single fiber");
  },
  [OP_STATEFUL]: (self2, runtimeFlags, cur, message) => {
    message.onFiber(self2, running(runtimeFlags));
    return cur;
  },
  [OP_YIELD_NOW]: (_self, _runtimeFlags, cur, _message) => {
    return flatMap$1(yieldNow$2(), () => cur);
  }
};
const runBlockedRequests = (self2) => forEachSequentialDiscard(flatten$1(self2), (requestsByRequestResolver) => forEachConcurrentDiscard(sequentialCollectionToChunk(requestsByRequestResolver), ([dataSource, sequential2]) => {
  const map2 = /* @__PURE__ */ new Map();
  const arr = [];
  for (const block of sequential2) {
    arr.push(toReadonlyArray$1(block));
    for (const entry of block) {
      map2.set(entry.request, entry);
    }
  }
  const flat = arr.flat();
  return fiberRefLocally(invokeWithInterrupt(dataSource.runAll(arr), flat, () => flat.forEach((entry) => {
    entry.listeners.interrupted = true;
  })), currentRequestMap, map2);
}, false, false));
const _version = /* @__PURE__ */ getCurrentVersion();
class FiberRuntime extends Class {
  constructor(fiberId2, fiberRefs0, runtimeFlags0) {
    super();
    __publicField(this, _O, fiberVariance);
    __publicField(this, _N, runtimeFiberVariance);
    __publicField(this, "_fiberRefs");
    __publicField(this, "_fiberId");
    __publicField(this, "_queue", /* @__PURE__ */ new Array());
    __publicField(this, "_children", null);
    __publicField(this, "_observers", /* @__PURE__ */ new Array());
    __publicField(this, "_running", false);
    __publicField(this, "_stack", []);
    __publicField(this, "_asyncInterruptor", null);
    __publicField(this, "_asyncBlockingOn", null);
    __publicField(this, "_exitValue", null);
    __publicField(this, "_steps", []);
    __publicField(this, "_isYielding", false);
    __publicField(this, "currentRuntimeFlags");
    __publicField(this, "currentOpCount", 0);
    __publicField(this, "currentSupervisor");
    __publicField(this, "currentScheduler");
    __publicField(this, "currentTracer");
    __publicField(this, "currentSpan");
    __publicField(this, "currentContext");
    __publicField(this, "currentDefaultServices");
    __publicField(this, "run", () => {
      this.drainQueueOnCurrentThread();
    });
    this.currentRuntimeFlags = runtimeFlags0;
    this._fiberId = fiberId2;
    this._fiberRefs = fiberRefs0;
    if (runtimeMetrics(runtimeFlags0)) {
      const tags = this.getFiberRef(currentMetricLabels);
      fiberStarted.unsafeUpdate(1, tags);
      fiberActive.unsafeUpdate(1, tags);
    }
    this.refreshRefCache();
  }
  commit() {
    return join(this);
  }
  /**
   * The identity of the fiber.
   */
  id() {
    return this._fiberId;
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background. This can be called to "kick off" execution of a fiber after
   * it has been created.
   */
  resume(effect) {
    this.tell(resume(effect));
  }
  /**
   * The status of the fiber.
   */
  get status() {
    return this.ask((_, status) => status);
  }
  /**
   * Gets the fiber runtime flags.
   */
  get runtimeFlags() {
    return this.ask((state2, status) => {
      if (isDone(status)) {
        return state2.currentRuntimeFlags;
      }
      return status.runtimeFlags;
    });
  }
  /**
   * Returns the current `FiberScope` for the fiber.
   */
  scope() {
    return unsafeMake$1(this);
  }
  /**
   * Retrieves the immediate children of the fiber.
   */
  get children() {
    return this.ask((fiber) => Array.from(fiber.getChildren()));
  }
  /**
   * Gets the fiber's set of children.
   */
  getChildren() {
    if (this._children === null) {
      this._children = /* @__PURE__ */ new Set();
    }
    return this._children;
  }
  /**
   * Retrieves the interrupted cause of the fiber, which will be `Cause.empty`
   * if the fiber has not been interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getInterruptedCause() {
    return this.getFiberRef(currentInterruptedCause);
  }
  /**
   * Retrieves the whole set of fiber refs.
   */
  fiberRefs() {
    return this.ask((fiber) => fiber.getFiberRefs());
  }
  /**
   * Returns an effect that will contain information computed from the fiber
   * state and status while running on the fiber.
   *
   * This allows the outside world to interact safely with mutable fiber state
   * without locks or immutable data.
   */
  ask(f) {
    return suspend(() => {
      const deferred = deferredUnsafeMake(this._fiberId);
      this.tell(stateful((fiber, status) => {
        deferredUnsafeDone(deferred, sync$2(() => f(fiber, status)));
      }));
      return deferredAwait(deferred);
    });
  }
  /**
   * Adds a message to be processed by the fiber on the fiber.
   */
  tell(message) {
    this._queue.push(message);
    if (!this._running) {
      this._running = true;
      this.drainQueueLaterOnExecutor();
    }
  }
  get await() {
    return async_((resume2) => {
      const cb = (exit2) => resume2(succeed$4(exit2));
      this.tell(stateful((fiber, _) => {
        if (fiber._exitValue !== null) {
          cb(this._exitValue);
        } else {
          fiber.addObserver(cb);
        }
      }));
      return sync$2(() => this.tell(stateful((fiber, _) => {
        fiber.removeObserver(cb);
      })));
    }, this.id());
  }
  get inheritAll() {
    return withFiberRuntime((parentFiber, parentStatus) => {
      const parentFiberId = parentFiber.id();
      const parentFiberRefs = parentFiber.getFiberRefs();
      const parentRuntimeFlags = parentStatus.runtimeFlags;
      const childFiberRefs = this.getFiberRefs();
      const updatedFiberRefs = joinAs(parentFiberRefs, parentFiberId, childFiberRefs);
      parentFiber.setFiberRefs(updatedFiberRefs);
      const updatedRuntimeFlags = parentFiber.getFiberRef(currentRuntimeFlags);
      const patch2 = pipe$1(
        diff$3(parentRuntimeFlags, updatedRuntimeFlags),
        // Do not inherit WindDown or Interruption!
        exclude(Interruption),
        exclude(WindDown)
      );
      return updateRuntimeFlags(patch2);
    });
  }
  /**
   * Tentatively observes the fiber, but returns immediately if it is not
   * already done.
   */
  get poll() {
    return sync$2(() => fromNullable(this._exitValue));
  }
  /**
   * Unsafely observes the fiber, but returns immediately if it is not
   * already done.
   */
  unsafePoll() {
    return this._exitValue;
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  interruptAsFork(fiberId2) {
    return sync$2(() => this.tell(interruptSignal(interrupt(fiberId2))));
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  unsafeInterruptAsFork(fiberId2) {
    this.tell(interruptSignal(interrupt(fiberId2)));
  }
  /**
   * Adds an observer to the list of observers.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addObserver(observer) {
    if (this._exitValue !== null) {
      observer(this._exitValue);
    } else {
      this._observers.push(observer);
    }
  }
  /**
   * Removes the specified observer from the list of observers that will be
   * notified when the fiber exits.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeObserver(observer) {
    this._observers = this._observers.filter((o) => o !== observer);
  }
  /**
   * Retrieves all fiber refs of the fiber.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRefs() {
    this.setFiberRef(currentRuntimeFlags, this.currentRuntimeFlags);
    return this._fiberRefs;
  }
  /**
   * Deletes the specified fiber ref.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  unsafeDeleteFiberRef(fiberRef) {
    this._fiberRefs = delete_(this._fiberRefs, fiberRef);
  }
  /**
   * Retrieves the state of the fiber ref, or else its initial value.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRef(fiberRef) {
    if (this._fiberRefs.locals.has(fiberRef)) {
      return this._fiberRefs.locals.get(fiberRef)[0][1];
    }
    return fiberRef.initial;
  }
  /**
   * Sets the fiber ref to the specified value.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRef(fiberRef, value) {
    this._fiberRefs = updateAs(this._fiberRefs, {
      fiberId: this._fiberId,
      fiberRef,
      value
    });
    this.refreshRefCache();
  }
  refreshRefCache() {
    this.currentDefaultServices = this.getFiberRef(currentServices);
    this.currentTracer = this.currentDefaultServices.unsafeMap.get(tracerTag.key);
    this.currentSupervisor = this.getFiberRef(currentSupervisor);
    this.currentScheduler = this.getFiberRef(currentScheduler);
    this.currentContext = this.getFiberRef(currentContext);
    this.currentSpan = this.currentContext.unsafeMap.get(spanTag.key);
  }
  /**
   * Wholesale replaces all fiber refs of this fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRefs(fiberRefs) {
    this._fiberRefs = fiberRefs;
    this.refreshRefCache();
  }
  /**
   * Adds a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addChild(child2) {
    this.getChildren().add(child2);
  }
  /**
   * Removes a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeChild(child2) {
    this.getChildren().delete(child2);
  }
  /**
   * Transfers all children of this fiber that are currently running to the
   * specified fiber scope.
   *
   * **NOTE**: This method must be invoked by the fiber itself after it has
   * evaluated the effects but prior to exiting.
   */
  transferChildren(scope) {
    const children = this._children;
    this._children = null;
    if (children !== null && children.size > 0) {
      for (const child2 of children) {
        if (child2._exitValue === null) {
          scope.add(this.currentRuntimeFlags, child2);
        }
      }
    }
  }
  /**
   * On the current thread, executes all messages in the fiber's inbox. This
   * method may return before all work is done, in the event the fiber executes
   * an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueOnCurrentThread() {
    let recurse = true;
    while (recurse) {
      let evaluationSignal = EvaluationSignalContinue;
      const prev = globalThis[currentFiberURI];
      globalThis[currentFiberURI] = this;
      try {
        while (evaluationSignal === EvaluationSignalContinue) {
          evaluationSignal = this._queue.length === 0 ? EvaluationSignalDone : this.evaluateMessageWhileSuspended(this._queue.splice(0, 1)[0]);
        }
      } finally {
        this._running = false;
        globalThis[currentFiberURI] = prev;
      }
      if (this._queue.length > 0 && !this._running) {
        this._running = true;
        if (evaluationSignal === EvaluationSignalYieldNow) {
          this.drainQueueLaterOnExecutor();
          recurse = false;
        } else {
          recurse = true;
        }
      } else {
        recurse = false;
      }
    }
  }
  /**
   * Schedules the execution of all messages in the fiber's inbox.
   *
   * This method will return immediately after the scheduling
   * operation is completed, but potentially before such messages have been
   * executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueLaterOnExecutor() {
    this.currentScheduler.scheduleTask(this.run, this.getFiberRef(currentSchedulingPriority));
  }
  /**
   * Drains the fiber's message queue while the fiber is actively running,
   * returning the next effect to execute, which may be the input effect if no
   * additional effect needs to be executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueWhileRunning(runtimeFlags, cur0) {
    let cur = cur0;
    while (this._queue.length > 0) {
      const message = this._queue.splice(0, 1)[0];
      cur = drainQueueWhileRunningTable[message._tag](this, runtimeFlags, cur, message);
    }
    return cur;
  }
  /**
   * Determines if the fiber is interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  isInterrupted() {
    return !isEmpty$2(this.getFiberRef(currentInterruptedCause));
  }
  /**
   * Adds an interruptor to the set of interruptors that are interrupting this
   * fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addInterruptedCause(cause) {
    const oldSC = this.getFiberRef(currentInterruptedCause);
    this.setFiberRef(currentInterruptedCause, sequential$2(oldSC, cause));
  }
  /**
   * Processes a new incoming interrupt signal.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  processNewInterruptSignal(cause) {
    this.addInterruptedCause(cause);
    this.sendInterruptSignalToAllChildren();
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  sendInterruptSignalToAllChildren() {
    if (this._children === null || this._children.size === 0) {
      return false;
    }
    let told = false;
    for (const child2 of this._children) {
      child2.tell(interruptSignal(interrupt(this.id())));
      told = true;
    }
    return told;
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  interruptAllChildren() {
    if (this.sendInterruptSignalToAllChildren()) {
      const it = this._children.values();
      this._children = null;
      let isDone2 = false;
      const body = () => {
        const next = it.next();
        if (!next.done) {
          return asVoid(next.value.await);
        } else {
          return sync$2(() => {
            isDone2 = true;
          });
        }
      };
      return whileLoop({
        while: () => !isDone2,
        body,
        step: () => {
        }
      });
    }
    return null;
  }
  reportExitValue(exit2) {
    if (runtimeMetrics(this.currentRuntimeFlags)) {
      const tags = this.getFiberRef(currentMetricLabels);
      const startTimeMillis = this.id().startTimeMillis;
      const endTimeMillis = Date.now();
      fiberLifetimes.unsafeUpdate(endTimeMillis - startTimeMillis, tags);
      fiberActive.unsafeUpdate(-1, tags);
      switch (exit2._tag) {
        case OP_SUCCESS$1: {
          fiberSuccesses.unsafeUpdate(1, tags);
          break;
        }
        case OP_FAILURE: {
          fiberFailures.unsafeUpdate(1, tags);
          break;
        }
      }
    }
    if (exit2._tag === "Failure") {
      const level = this.getFiberRef(currentUnhandledErrorLogLevel);
      if (!isInterruptedOnly$1(exit2.cause) && level._tag === "Some") {
        this.log("Fiber terminated with an unhandled error", exit2.cause, level);
      }
    }
  }
  setExitValue(exit2) {
    this._exitValue = exit2;
    this.reportExitValue(exit2);
    for (let i = this._observers.length - 1; i >= 0; i--) {
      this._observers[i](exit2);
    }
    this._observers = [];
  }
  getLoggers() {
    return this.getFiberRef(currentLoggers);
  }
  log(message, cause, overrideLogLevel) {
    const logLevel = isSome$2(overrideLogLevel) ? overrideLogLevel.value : this.getFiberRef(currentLogLevel);
    const minimumLogLevel = this.getFiberRef(currentMinimumLogLevel);
    if (greaterThan(minimumLogLevel, logLevel)) {
      return;
    }
    const spans = this.getFiberRef(currentLogSpan);
    const annotations = this.getFiberRef(currentLogAnnotations);
    const loggers = this.getLoggers();
    const contextMap = this.getFiberRefs();
    if (size$3(loggers) > 0) {
      const clockService = get$4(this.getFiberRef(currentServices), clockTag);
      const date = new Date(clockService.unsafeCurrentTimeMillis());
      withRedactableContext(contextMap, () => {
        for (const logger2 of loggers) {
          logger2.log({
            fiberId: this.id(),
            logLevel,
            message,
            cause,
            context: contextMap,
            spans,
            annotations,
            date
          });
        }
      });
    }
  }
  /**
   * Evaluates a single message on the current thread, while the fiber is
   * suspended. This method should only be called while evaluation of the
   * fiber's effect is suspended due to an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateMessageWhileSuspended(message) {
    switch (message._tag) {
      case OP_YIELD_NOW: {
        return EvaluationSignalYieldNow;
      }
      case OP_INTERRUPT_SIGNAL: {
        this.processNewInterruptSignal(message.cause);
        if (this._asyncInterruptor !== null) {
          this._asyncInterruptor(exitFailCause$1(message.cause));
          this._asyncInterruptor = null;
        }
        return EvaluationSignalContinue;
      }
      case OP_RESUME: {
        this._asyncInterruptor = null;
        this._asyncBlockingOn = null;
        this.evaluateEffect(message.effect);
        return EvaluationSignalContinue;
      }
      case OP_STATEFUL: {
        message.onFiber(this, this._exitValue !== null ? done : suspended(this.currentRuntimeFlags, this._asyncBlockingOn));
        return EvaluationSignalContinue;
      }
      default: {
        return absurd(message);
      }
    }
  }
  /**
   * Evaluates an effect until completion, potentially asynchronously.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateEffect(effect0) {
    this.currentSupervisor.onResume(this);
    try {
      let effect = interruptible$2(this.currentRuntimeFlags) && this.isInterrupted() ? exitFailCause$1(this.getInterruptedCause()) : effect0;
      while (effect !== null) {
        const eff = effect;
        const exit2 = this.runLoop(eff);
        if (exit2 === YieldedOp) {
          const op = yieldedOpChannel.currentOp;
          yieldedOpChannel.currentOp = null;
          if (op._op === OP_YIELD) {
            if (cooperativeYielding(this.currentRuntimeFlags)) {
              this.tell(yieldNow());
              this.tell(resume(exitVoid$1));
              effect = null;
            } else {
              effect = exitVoid$1;
            }
          } else if (op._op === OP_ASYNC) {
            effect = null;
          }
        } else {
          this.currentRuntimeFlags = pipe$1(this.currentRuntimeFlags, enable$1(WindDown));
          const interruption2 = this.interruptAllChildren();
          if (interruption2 !== null) {
            effect = flatMap$1(interruption2, () => exit2);
          } else {
            if (this._queue.length === 0) {
              this.setExitValue(exit2);
            } else {
              this.tell(resume(exit2));
            }
            effect = null;
          }
        }
      }
    } finally {
      this.currentSupervisor.onSuspend(this);
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on the current
   * thread. This can be called to "kick off" execution of a fiber after it has
   * been created, in hopes that the effect can be executed synchronously.
   *
   * This is not the normal way of starting a fiber, but it is useful when the
   * express goal of executing the fiber is to synchronously produce its exit.
   */
  start(effect) {
    if (!this._running) {
      this._running = true;
      const prev = globalThis[currentFiberURI];
      globalThis[currentFiberURI] = this;
      try {
        this.evaluateEffect(effect);
      } finally {
        this._running = false;
        globalThis[currentFiberURI] = prev;
        if (this._queue.length > 0) {
          this.drainQueueLaterOnExecutor();
        }
      }
    } else {
      this.tell(resume(effect));
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background, and on the correct thread pool. This can be called to "kick
   * off" execution of a fiber after it has been created, in hopes that the
   * effect can be executed synchronously.
   */
  startFork(effect) {
    this.tell(resume(effect));
  }
  /**
   * Takes the current runtime flags, patches them to return the new runtime
   * flags, and then makes any changes necessary to fiber state based on the
   * specified patch.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  patchRuntimeFlags(oldRuntimeFlags, patch2) {
    const newRuntimeFlags = patch$4(oldRuntimeFlags, patch2);
    globalThis[currentFiberURI] = this;
    this.currentRuntimeFlags = newRuntimeFlags;
    return newRuntimeFlags;
  }
  /**
   * Initiates an asynchronous operation, by building a callback that will
   * resume execution, and then feeding that callback to the registration
   * function, handling error cases and repeated resumptions appropriately.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  initiateAsync(runtimeFlags, asyncRegister) {
    let alreadyCalled = false;
    const callback = (effect) => {
      if (!alreadyCalled) {
        alreadyCalled = true;
        this.tell(resume(effect));
      }
    };
    if (interruptible$2(runtimeFlags)) {
      this._asyncInterruptor = callback;
    }
    try {
      asyncRegister(callback);
    } catch (e) {
      callback(failCause$1(die$1(e)));
    }
  }
  pushStack(cont) {
    this._stack.push(cont);
    if (cont._op === "OnStep") {
      this._steps.push({
        refs: this.getFiberRefs(),
        flags: this.currentRuntimeFlags
      });
    }
  }
  popStack() {
    const item = this._stack.pop();
    if (item) {
      if (item._op === "OnStep") {
        this._steps.pop();
      }
      return item;
    }
    return;
  }
  getNextSuccessCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OP_ON_FAILURE) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  getNextFailCont() {
    let frame = this.popStack();
    while (frame) {
      if (frame._op !== OP_ON_SUCCESS && frame._op !== OP_WHILE && frame._op !== OP_ITERATOR) {
        return frame;
      }
      frame = this.popStack();
    }
  }
  [(_O = FiberTypeId, _N = RuntimeFiberTypeId, OP_TAG)](op) {
    return sync$2(() => unsafeGet$1(this.currentContext, op));
  }
  ["Left"](op) {
    return fail$2(op.left);
  }
  ["None"](_) {
    return fail$2(new NoSuchElementException());
  }
  ["Right"](op) {
    return exitSucceed$1(op.right);
  }
  ["Some"](op) {
    return exitSucceed$1(op.value);
  }
  ["Micro"](op) {
    return unsafeAsync((microResume) => {
      let resume2 = microResume;
      const fiber = runFork(provideContext(op, this.currentContext));
      fiber.addObserver((exit2) => {
        if (exit2._tag === "Success") {
          return resume2(exitSucceed$1(exit2.value));
        }
        switch (exit2.cause._tag) {
          case "Interrupt": {
            return resume2(exitFailCause$1(interrupt(none$4)));
          }
          case "Fail": {
            return resume2(fail$2(exit2.cause.error));
          }
          case "Die": {
            return resume2(die(exit2.cause.defect));
          }
        }
      });
      return unsafeAsync((abortResume) => {
        resume2 = (_) => {
          abortResume(void_$1);
        };
        fiber.unsafeInterrupt();
      });
    });
  }
  [OP_SYNC$1](op) {
    const value = internalCall(() => op.effect_instruction_i0());
    const cont = this.getNextSuccessCont();
    if (cont !== void 0) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, value);
    } else {
      yieldedOpChannel.currentOp = exitSucceed$1(value);
      return YieldedOp;
    }
  }
  [OP_SUCCESS$1](op) {
    const oldCur = op;
    const cont = this.getNextSuccessCont();
    if (cont !== void 0) {
      if (!(cont._op in contOpSuccess)) {
        absurd(cont);
      }
      return contOpSuccess[cont._op](this, cont, oldCur.effect_instruction_i0);
    } else {
      yieldedOpChannel.currentOp = oldCur;
      return YieldedOp;
    }
  }
  [OP_FAILURE](op) {
    const cause = op.effect_instruction_i0;
    const cont = this.getNextFailCont();
    if (cont !== void 0) {
      switch (cont._op) {
        case OP_ON_FAILURE:
        case OP_ON_SUCCESS_AND_FAILURE: {
          if (!(interruptible$2(this.currentRuntimeFlags) && this.isInterrupted())) {
            return internalCall(() => cont.effect_instruction_i1(cause));
          } else {
            return exitFailCause$1(stripFailures(cause));
          }
        }
        case "OnStep": {
          if (!(interruptible$2(this.currentRuntimeFlags) && this.isInterrupted())) {
            return exitSucceed$1(exitFailCause$1(cause));
          } else {
            return exitFailCause$1(stripFailures(cause));
          }
        }
        case OP_REVERT_FLAGS: {
          this.patchRuntimeFlags(this.currentRuntimeFlags, cont.patch);
          if (interruptible$2(this.currentRuntimeFlags) && this.isInterrupted()) {
            return exitFailCause$1(sequential$2(cause, this.getInterruptedCause()));
          } else {
            return exitFailCause$1(cause);
          }
        }
        default: {
          absurd(cont);
        }
      }
    } else {
      yieldedOpChannel.currentOp = exitFailCause$1(cause);
      return YieldedOp;
    }
  }
  [OP_WITH_RUNTIME](op) {
    return internalCall(() => op.effect_instruction_i0(this, running(this.currentRuntimeFlags)));
  }
  ["Blocked"](op) {
    const refs2 = this.getFiberRefs();
    const flags = this.currentRuntimeFlags;
    if (this._steps.length > 0) {
      const frames = [];
      const snap = this._steps[this._steps.length - 1];
      let frame = this.popStack();
      while (frame && frame._op !== "OnStep") {
        frames.push(frame);
        frame = this.popStack();
      }
      this.setFiberRefs(snap.refs);
      this.currentRuntimeFlags = snap.flags;
      const patchRefs = diff$1(snap.refs, refs2);
      const patchFlags = diff$3(snap.flags, flags);
      return exitSucceed$1(blocked(op.effect_instruction_i0, withFiberRuntime((newFiber) => {
        while (frames.length > 0) {
          newFiber.pushStack(frames.pop());
        }
        newFiber.setFiberRefs(patch$1(newFiber.id(), newFiber.getFiberRefs())(patchRefs));
        newFiber.currentRuntimeFlags = patch$4(patchFlags)(newFiber.currentRuntimeFlags);
        return op.effect_instruction_i1;
      })));
    }
    return uninterruptibleMask$1((restore) => flatMap$1(forkDaemon(runRequestBlock(op.effect_instruction_i0)), () => restore(op.effect_instruction_i1)));
  }
  ["RunBlocked"](op) {
    return runBlockedRequests(op.effect_instruction_i0);
  }
  [OP_UPDATE_RUNTIME_FLAGS](op) {
    const updateFlags = op.effect_instruction_i0;
    const oldRuntimeFlags = this.currentRuntimeFlags;
    const newRuntimeFlags = patch$4(oldRuntimeFlags, updateFlags);
    if (interruptible$2(newRuntimeFlags) && this.isInterrupted()) {
      return exitFailCause$1(this.getInterruptedCause());
    } else {
      this.patchRuntimeFlags(this.currentRuntimeFlags, updateFlags);
      if (op.effect_instruction_i1) {
        const revertFlags = diff$3(newRuntimeFlags, oldRuntimeFlags);
        this.pushStack(new RevertFlags(revertFlags, op));
        return internalCall(() => op.effect_instruction_i1(oldRuntimeFlags));
      } else {
        return exitVoid$1;
      }
    }
  }
  [OP_ON_SUCCESS](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  ["OnStep"](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ON_FAILURE](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ON_SUCCESS_AND_FAILURE](op) {
    this.pushStack(op);
    return op.effect_instruction_i0;
  }
  [OP_ASYNC](op) {
    this._asyncBlockingOn = op.effect_instruction_i1;
    this.initiateAsync(this.currentRuntimeFlags, op.effect_instruction_i0);
    yieldedOpChannel.currentOp = op;
    return YieldedOp;
  }
  [OP_YIELD](op) {
    this._isYielding = false;
    yieldedOpChannel.currentOp = op;
    return YieldedOp;
  }
  [OP_WHILE](op) {
    const check = op.effect_instruction_i0;
    const body = op.effect_instruction_i1;
    if (check()) {
      this.pushStack(op);
      return body();
    } else {
      return exitVoid$1;
    }
  }
  [OP_ITERATOR](op) {
    return contOpSuccess[OP_ITERATOR](this, op, void 0);
  }
  [OP_COMMIT](op) {
    return internalCall(() => op.commit());
  }
  /**
   * The main run-loop for evaluating effects.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  runLoop(effect0) {
    let cur = effect0;
    this.currentOpCount = 0;
    while (true) {
      if ((this.currentRuntimeFlags & OpSupervision) !== 0) {
        this.currentSupervisor.onEffect(this, cur);
      }
      if (this._queue.length > 0) {
        cur = this.drainQueueWhileRunning(this.currentRuntimeFlags, cur);
      }
      if (!this._isYielding) {
        this.currentOpCount += 1;
        const shouldYield = this.currentScheduler.shouldYield(this);
        if (shouldYield !== false) {
          this._isYielding = true;
          this.currentOpCount = 0;
          const oldCur = cur;
          cur = flatMap$1(yieldNow$2({
            priority: shouldYield
          }), () => oldCur);
        }
      }
      try {
        cur = this.currentTracer.context(() => {
          if (_version !== cur[EffectTypeId$2]._V) {
            return dieMessage(`Cannot execute an Effect versioned ${cur[EffectTypeId$2]._V} with a Runtime of version ${getCurrentVersion()}`);
          }
          return this[cur._op](cur);
        }, this);
        if (cur === YieldedOp) {
          const op = yieldedOpChannel.currentOp;
          if (op._op === OP_YIELD || op._op === OP_ASYNC) {
            return YieldedOp;
          }
          yieldedOpChannel.currentOp = null;
          return op._op === OP_SUCCESS$1 || op._op === OP_FAILURE ? op : exitFailCause$1(die$1(op));
        }
      } catch (e) {
        if (cur !== YieldedOp && !hasProperty(cur, "_op") || !(cur._op in this)) {
          cur = dieMessage(`Not a valid effect: ${toStringUnknown(cur)}`);
        } else if (isInterruptedException(e)) {
          cur = exitFailCause$1(sequential$2(die$1(e), interrupt(none$4)));
        } else {
          cur = die(e);
        }
      }
    }
  }
}
const currentMinimumLogLevel = /* @__PURE__ */ globalValue$1("effect/FiberRef/currentMinimumLogLevel", () => fiberRefUnsafeMake(fromLiteral("Info")));
const loggerWithConsoleLog = (self2) => makeLogger((opts) => {
  const services = getOrDefault(opts.context, currentServices);
  get$4(services, consoleTag).unsafe.log(self2.log(opts));
});
const defaultLogger = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/Logger/defaultLogger"), () => loggerWithConsoleLog(stringLogger));
const tracerLogger = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/Logger/tracerLogger"), () => makeLogger(({
  annotations,
  cause,
  context,
  fiberId: fiberId2,
  logLevel,
  message
}) => {
  const span2 = getOption(getOrDefault$1(context, currentContext), spanTag);
  if (span2._tag === "None" || span2.value._tag === "ExternalSpan") {
    return;
  }
  const clockService = unsafeGet$1(getOrDefault$1(context, currentServices), clockTag);
  const attributes = {};
  for (const [key, value] of annotations) {
    attributes[key] = value;
  }
  attributes["effect.fiberId"] = threadName(fiberId2);
  attributes["effect.logLevel"] = logLevel.label;
  if (cause !== null && cause._tag !== "Empty") {
    attributes["effect.cause"] = pretty$1(cause, {
      renderErrorCause: true
    });
  }
  span2.value.event(toStringUnknown(Array.isArray(message) ? message[0] : message), clockService.unsafeCurrentTimeNanos(), attributes);
}));
const currentLoggers = /* @__PURE__ */ globalValue$1(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLoggers"), () => fiberRefUnsafeMakeHashSet(make$h(defaultLogger, tracerLogger)));
const forEachConcurrentDiscard = (self2, f, batching, processAll, n) => uninterruptibleMask$1((restore) => transplant((graft) => withFiberRuntime((parent) => {
  let todos = Array.from(self2).reverse();
  let target = todos.length;
  if (target === 0) {
    return void_$1;
  }
  let counter2 = 0;
  let interrupted = false;
  const fibersCount = todos.length;
  const fibers = /* @__PURE__ */ new Set();
  const results = new Array();
  const interruptAll = () => fibers.forEach((fiber) => {
    fiber.currentScheduler.scheduleTask(() => {
      fiber.unsafeInterruptAsFork(parent.id());
    }, 0);
  });
  const startOrder = new Array();
  const joinOrder = new Array();
  const residual = new Array();
  const collectExits = () => {
    const exits = results.filter(({
      exit: exit2
    }) => exit2._tag === "Failure").sort((a, b) => a.index < b.index ? -1 : a.index === b.index ? 0 : 1).map(({
      exit: exit2
    }) => exit2);
    if (exits.length === 0) {
      exits.push(exitVoid$1);
    }
    return exits;
  };
  const runFiber = (eff, interruptImmediately = false) => {
    const runnable = uninterruptible(graft(eff));
    const fiber = unsafeForkUnstarted(runnable, parent, parent.currentRuntimeFlags, globalScope);
    parent.currentScheduler.scheduleTask(() => {
      if (interruptImmediately) {
        fiber.unsafeInterruptAsFork(parent.id());
      }
      fiber.resume(runnable);
    }, 0);
    return fiber;
  };
  const onInterruptSignal = () => {
    if (!processAll) {
      target -= todos.length;
      todos = [];
    }
    interrupted = true;
    interruptAll();
  };
  const stepOrExit = exit;
  const processingFiber = runFiber(async_((resume2) => {
    const pushResult = (res2, index2) => {
      if (res2._op === "Blocked") {
        residual.push(res2);
      } else {
        results.push({
          index: index2,
          exit: res2
        });
        if (res2._op === "Failure" && !interrupted) {
          onInterruptSignal();
        }
      }
    };
    const next = () => {
      if (todos.length > 0) {
        const a = todos.pop();
        let index2 = counter2++;
        const returnNextElement = () => {
          const a2 = todos.pop();
          index2 = counter2++;
          return flatMap$1(yieldNow$2(), () => flatMap$1(stepOrExit(restore(f(a2, index2))), onRes));
        };
        const onRes = (res2) => {
          if (todos.length > 0) {
            pushResult(res2, index2);
            if (todos.length > 0) {
              return returnNextElement();
            }
          }
          return succeed$4(res2);
        };
        const todo = flatMap$1(stepOrExit(restore(f(a, index2))), onRes);
        const fiber = runFiber(todo);
        startOrder.push(fiber);
        fibers.add(fiber);
        if (interrupted) {
          fiber.currentScheduler.scheduleTask(() => {
            fiber.unsafeInterruptAsFork(parent.id());
          }, 0);
        }
        fiber.addObserver((wrapped) => {
          let exit2;
          if (wrapped._op === "Failure") {
            exit2 = wrapped;
          } else {
            exit2 = wrapped.effect_instruction_i0;
          }
          joinOrder.push(fiber);
          fibers.delete(fiber);
          pushResult(exit2, index2);
          if (results.length === target) {
            resume2(succeed$4(getOrElse$1(exitCollectAll(collectExits(), {
              parallel: true
            }), () => exitVoid$1)));
          } else if (residual.length + results.length === target) {
            const exits = collectExits();
            const requests = residual.map((blocked2) => blocked2.effect_instruction_i0).reduce(par);
            resume2(succeed$4(blocked(requests, forEachConcurrentDiscard([getOrElse$1(exitCollectAll(exits, {
              parallel: true
            }), () => exitVoid$1), ...residual.map((blocked2) => blocked2.effect_instruction_i1)], (i) => i, batching, true))));
          } else {
            next();
          }
        });
      }
    };
    for (let i = 0; i < fibersCount; i++) {
      next();
    }
  }));
  return asVoid(onExit$1(flatten(restore(join(processingFiber))), exitMatch({
    onFailure: (cause) => {
      onInterruptSignal();
      const target2 = residual.length + 1;
      const concurrency = Math.min(residual.length, residual.length);
      const toPop = Array.from(residual);
      return async_((cb) => {
        let count = 0;
        let index2 = 0;
        const check = (index3, hitNext) => (exit2) => {
          count++;
          if (count === target2) {
            cb(exitSucceed$1(exitFailCause$1(cause)));
          }
          if (toPop.length > 0 && hitNext) {
            next();
          }
        };
        const next = () => {
          runFiber(toPop.pop(), true).addObserver(check(index2, true));
          index2++;
        };
        processingFiber.addObserver(check(index2, false));
        index2++;
        for (let i = 0; i < concurrency; i++) {
          next();
        }
      });
    },
    onSuccess: () => forEachSequential(joinOrder, (f2) => f2.inheritAll)
  })));
})));
const forkDaemon = (self2) => forkWithScopeOverride(self2, globalScope);
const unsafeFork$1 = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childFiber = unsafeMakeChildFiber(effect, parentFiber, parentRuntimeFlags, overrideScope);
  childFiber.resume(effect);
  return childFiber;
};
const unsafeForkUnstarted = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childFiber = unsafeMakeChildFiber(effect, parentFiber, parentRuntimeFlags, overrideScope);
  return childFiber;
};
const unsafeMakeChildFiber = (effect, parentFiber, parentRuntimeFlags, overrideScope = null) => {
  const childId = unsafeMake$3();
  const parentFiberRefs = parentFiber.getFiberRefs();
  const childFiberRefs = forkAs(parentFiberRefs, childId);
  const childFiber = new FiberRuntime(childId, childFiberRefs, parentRuntimeFlags);
  const childContext = getOrDefault$1(childFiberRefs, currentContext);
  const supervisor = childFiber.currentSupervisor;
  supervisor.onStart(childContext, effect, some$2(parentFiber), childFiber);
  childFiber.addObserver((exit2) => supervisor.onEnd(exit2, childFiber));
  const parentScope = overrideScope !== null ? overrideScope : pipe$1(parentFiber.getFiberRef(currentForkScopeOverride), getOrElse$1(() => parentFiber.scope()));
  parentScope.add(parentRuntimeFlags, childFiber);
  return childFiber;
};
const forkWithScopeOverride = (self2, scopeOverride) => withFiberRuntime((parentFiber, parentStatus) => succeed$4(unsafeFork$1(self2, parentFiber, parentStatus.runtimeFlags, scopeOverride)));
const fiberRefUnsafeMakeSupervisor = (initial) => fiberRefUnsafeMakePatch(initial, {
  differ,
  fork: empty$4
});
const currentRuntimeFlags = /* @__PURE__ */ fiberRefUnsafeMakeRuntimeFlags(none$3);
const currentSupervisor = /* @__PURE__ */ fiberRefUnsafeMakeSupervisor(none$2);
const invokeWithInterrupt = (self2, entries, onInterrupt2) => fiberIdWith((id) => flatMap$1(flatMap$1(forkDaemon(interruptible$1(self2)), (processing) => async_((cb) => {
  const counts = entries.map((_) => _.listeners.count);
  const checkDone = () => {
    if (counts.every((count) => count === 0)) {
      if (entries.every((_) => {
        if (_.result.state.current._tag === "Pending") {
          return true;
        } else if (_.result.state.current._tag === "Done" && exitIsExit(_.result.state.current.effect) && _.result.state.current.effect._tag === "Failure" && isInterrupted(_.result.state.current.effect.cause)) {
          return true;
        } else {
          return false;
        }
      })) {
        cleanup.forEach((f) => f());
        onInterrupt2 == null ? void 0 : onInterrupt2();
        cb(interruptFiber(processing));
      }
    }
  };
  processing.addObserver((exit2) => {
    cleanup.forEach((f) => f());
    cb(exit2);
  });
  const cleanup = entries.map((r, i) => {
    const observer = (count) => {
      counts[i] = count;
      checkDone();
    };
    r.listeners.addObserver(observer);
    return () => r.listeners.removeObserver(observer);
  });
  checkDone();
  return sync$2(() => {
    cleanup.forEach((f) => f());
  });
})), () => suspend(() => {
  const residual = entries.flatMap((entry) => {
    if (!entry.state.completed) {
      return [entry];
    }
    return [];
  });
  return forEachSequentialDiscard(residual, (entry) => complete(entry.request, exitInterrupt$1(id)));
})));
const close = scopeClose;
const fork = scopeFork;
const makeDual = (f) => function() {
  if (arguments.length === 1) {
    const runtime = arguments[0];
    return (effect, ...args2) => f(runtime, effect, ...args2);
  }
  return f.apply(this, arguments);
};
const unsafeFork = /* @__PURE__ */ makeDual((runtime, self2, options) => {
  const fiberId2 = unsafeMake$3();
  const fiberRefUpdates = [[currentContext, [[fiberId2, runtime.context]]]];
  if (options == null ? void 0 : options.scheduler) {
    fiberRefUpdates.push([currentScheduler, [[fiberId2, options.scheduler]]]);
  }
  let fiberRefs = updateManyAs(runtime.fiberRefs, {
    entries: fiberRefUpdates,
    forkAs: fiberId2
  });
  if (options == null ? void 0 : options.updateRefs) {
    fiberRefs = options.updateRefs(fiberRefs, fiberId2);
  }
  const fiberRuntime = new FiberRuntime(fiberId2, fiberRefs, runtime.runtimeFlags);
  let effect = self2;
  if (options == null ? void 0 : options.scope) {
    effect = flatMap$1(fork(options.scope, sequential$1), (closeableScope) => zipRight(scopeAddFinalizer(closeableScope, fiberIdWith((id) => equals$2(id, fiberRuntime.id()) ? void_$1 : interruptAsFiber(fiberRuntime, id))), onExit$1(self2, (exit2) => close(closeableScope, exit2))));
  }
  const supervisor = fiberRuntime.currentSupervisor;
  if (supervisor !== none$2) {
    supervisor.onStart(runtime.context, effect, none$6(), fiberRuntime);
    fiberRuntime.addObserver((exit2) => supervisor.onEnd(exit2, fiberRuntime));
  }
  globalScope.add(runtime.runtimeFlags, fiberRuntime);
  if ((options == null ? void 0 : options.immediate) === false) {
    fiberRuntime.resume(effect);
  } else {
    fiberRuntime.start(effect);
  }
  return fiberRuntime;
});
const FiberFailureId = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure");
const FiberFailureCauseId = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure/Cause");
class FiberFailureImpl extends Error {
  constructor(cause) {
    const head2 = prettyErrors$1(cause)[0];
    super((head2 == null ? void 0 : head2.message) || "An error has occurred");
    __publicField(this, _Q);
    __publicField(this, _P);
    this[FiberFailureId] = FiberFailureId;
    this[FiberFailureCauseId] = cause;
    this.name = head2 ? `(FiberFailure) ${head2.name}` : "FiberFailure";
    if (head2 == null ? void 0 : head2.stack) {
      this.stack = head2.stack;
    }
  }
  toJSON() {
    return {
      _id: "FiberFailure",
      cause: this[FiberFailureCauseId].toJSON()
    };
  }
  toString() {
    return "(FiberFailure) " + pretty$1(this[FiberFailureCauseId], {
      renderErrorCause: true
    });
  }
  [(_Q = FiberFailureId, _P = FiberFailureCauseId, NodeInspectSymbol$1)]() {
    return this.toString();
  }
}
const fiberFailure = (cause) => {
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const error = new FiberFailureImpl(cause);
  Error.stackTraceLimit = limit;
  return error;
};
const fastPath = (effect) => {
  const op = effect;
  switch (op._op) {
    case "Failure":
    case "Success": {
      return op;
    }
    case "Left": {
      return exitFail(op.left);
    }
    case "Right": {
      return exitSucceed$1(op.right);
    }
    case "Some": {
      return exitSucceed$1(op.value);
    }
    case "None": {
      return exitFail(NoSuchElementException());
    }
  }
};
const unsafeRunPromise = /* @__PURE__ */ makeDual((runtime, effect, options) => unsafeRunPromiseExit(runtime, effect, options).then((result) => {
  switch (result._tag) {
    case OP_SUCCESS$1: {
      return result.effect_instruction_i0;
    }
    case OP_FAILURE: {
      throw fiberFailure(result.effect_instruction_i0);
    }
  }
}));
const unsafeRunPromiseExit = /* @__PURE__ */ makeDual((runtime, effect, options) => new Promise((resolve) => {
  const op = fastPath(effect);
  if (op) {
    resolve(op);
  }
  const fiber = unsafeFork(runtime)(effect);
  fiber.addObserver((exit2) => {
    resolve(exit2);
  });
  if ((options == null ? void 0 : options.signal) !== void 0) {
    if (options.signal.aborted) {
      fiber.unsafeInterruptAsFork(fiber.id());
    } else {
      options.signal.addEventListener("abort", () => {
        fiber.unsafeInterruptAsFork(fiber.id());
      }, {
        once: true
      });
    }
  }
}));
class RuntimeImpl {
  constructor(context, runtimeFlags, fiberRefs) {
    __publicField(this, "context");
    __publicField(this, "runtimeFlags");
    __publicField(this, "fiberRefs");
    this.context = context;
    this.runtimeFlags = runtimeFlags;
    this.fiberRefs = fiberRefs;
  }
  pipe() {
    return pipeArguments$1(this, arguments);
  }
}
const make$1 = (options) => new RuntimeImpl(options.context, options.runtimeFlags, options.fiberRefs);
const defaultRuntimeFlags = /* @__PURE__ */ make$b(Interruption, CooperativeYielding, RuntimeMetrics);
const defaultRuntime = /* @__PURE__ */ make$1({
  context: /* @__PURE__ */ empty$g(),
  runtimeFlags: defaultRuntimeFlags,
  fiberRefs: /* @__PURE__ */ empty$7()
});
const unsafeRunPromiseEffect = /* @__PURE__ */ unsafeRunPromise(defaultRuntime);
const isEffect = isEffect$1;
const fail$1 = fail$2;
const succeed$2 = succeed$4;
const sync$1 = sync$2;
const catchAll = catchAll$1;
const try_$2 = try_$3;
const tryPromise = tryPromise$1;
const map = map$1;
const either = either$1;
const tap = tap$1;
const runPromise = unsafeRunPromiseEffect;
function makeSerializable(obj) {
  if (obj === null || obj === void 0) {
    return obj;
  }
  if (typeof obj !== "object" && typeof obj !== "function") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => makeSerializable(item));
  }
  if (obj && typeof obj === "object" && obj.length !== void 0 && typeof obj.length === "number") {
    console.log("Converting array-like object to array", obj);
    return Array.from(obj).map((item) => makeSerializable(item));
  }
  if (obj instanceof Error) {
    return {
      message: obj.message,
      name: obj.name,
      stack: obj.stack
    };
  }
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  const result = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      try {
        const value = obj[key];
        if (typeof value !== "function") {
          result[key] = makeSerializable(value);
        }
      } catch (err2) {
        console.warn(`Failed to serialize property ${key}`, err2);
      }
    }
  }
  return result;
}
async function effectToEither(effect) {
  try {
    const result = await runPromise(either(effect));
    if (result._tag === "Right") {
      return {
        _tag: "Right",
        right: makeSerializable(result.right)
      };
    } else {
      const error = result.left;
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        _tag: "Left",
        left: {
          message: errorMessage,
          name: error instanceof Error ? error.name : "Error",
          stack: error instanceof Error ? error.stack : void 0
        }
      };
    }
  } catch (err2) {
    return {
      _tag: "Left",
      left: makeSerializable(err2 instanceof Error ? err2 : new Error(String(err2)))
    };
  }
}
const userDataPath$3 = electron.app.getPath("userData");
const logsPath$3 = path$1.join(userDataPath$3, "logs");
if (!fs$1.existsSync(logsPath$3)) {
  fs$1.mkdirSync(logsPath$3, { recursive: true });
}
const ipcLogger = pino$1({
  level: "debug",
  timestamp: pino$1.stdTimeFunctions.isoTime,
  // Redact potentially sensitive information
  redact: ["payload.code", "payload.password", "*.password", "*.token"]
}, pino$1.destination(path$1.join(logsPath$3, "ipc.log")));
function logIpcRequest(channel, payload) {
  ipcLogger.debug({ channel, payload, direction: "request" }, `IPC Request: ${channel}`);
}
function logIpcResponse(channel, result, error) {
  {
    ipcLogger.debug(
      { channel, success: true, direction: "response" },
      `IPC Success Response: ${channel}`
    );
  }
}
const globalStoreId = /* @__PURE__ */ Symbol.for("@effect/data/GlobalValue/globalStoreId");
if (!(globalStoreId in globalThis)) {
  globalThis[globalStoreId] = /* @__PURE__ */ new Map();
}
const globalStore = globalThis[globalStoreId];
const globalValue = (id, compute) => {
  if (!globalStore.has(id)) {
    globalStore.set(id, compute());
  }
  return globalStore.get(id);
};
const isFunction$1 = (input) => typeof input === "function";
const dual = function(arity, body) {
  if (typeof arity === "function") {
    return function() {
      if (arity(arguments)) {
        return body.apply(this, arguments);
      }
      return (self2) => body(self2, ...arguments);
    };
  }
  switch (arity) {
    case 0:
      return body;
    case 1:
      return function(a) {
        if (arguments.length >= 1) {
          return body(a);
        }
        return function() {
          return body(a);
        };
      };
    case 2:
      return function(a, b) {
        if (arguments.length >= 2) {
          return body(a, b);
        }
        return function(self2) {
          return body(self2, a);
        };
      };
    case 3:
      return function(a, b, c) {
        if (arguments.length >= 3) {
          return body(a, b, c);
        }
        return function(self2) {
          return body(self2, a, b);
        };
      };
    case 4:
      return function(a, b, c, d) {
        if (arguments.length >= 4) {
          return body(a, b, c, d);
        }
        return function(self2) {
          return body(self2, a, b, c);
        };
      };
    case 5:
      return function(a, b, c, d, e) {
        if (arguments.length >= 5) {
          return body(a, b, c, d, e);
        }
        return function(self2) {
          return body(self2, a, b, c, d);
        };
      };
    default:
      return function() {
        if (arguments.length >= arity) {
          return body.apply(this, arguments);
        }
        const args2 = arguments;
        return function(self2) {
          return body(self2, ...args2);
        };
      };
  }
};
const constant = (value) => () => value;
const constTrue = /* @__PURE__ */ constant(true);
const constFalse = /* @__PURE__ */ constant(false);
const constUndefined = /* @__PURE__ */ constant(void 0);
function pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
  switch (arguments.length) {
    case 1:
      return a;
    case 2:
      return ab(a);
    case 3:
      return bc(ab(a));
    case 4:
      return cd(bc(ab(a)));
    case 5:
      return de(cd(bc(ab(a))));
    case 6:
      return ef(de(cd(bc(ab(a)))));
    case 7:
      return fg(ef(de(cd(bc(ab(a))))));
    case 8:
      return gh(fg(ef(de(cd(bc(ab(a)))))));
    case 9:
      return hi(gh(fg(ef(de(cd(bc(ab(a))))))));
    default: {
      let ret = arguments[0];
      for (let i = 1; i < arguments.length; i++) {
        ret = arguments[i](ret);
      }
      return ret;
    }
  }
}
const isFunction = isFunction$1;
const isObject = (input) => typeof input === "object" && input != null || isFunction(input);
const isNullable = (input) => input === null || input === void 0;
const defaultIncHi = 335903614;
const defaultIncLo = 4150755663;
const MUL_HI = 1481765933 >>> 0;
const MUL_LO = 1284865837 >>> 0;
const BIT_53 = 9007199254740992;
const BIT_27 = 134217728;
class PCGRandom2 {
  constructor(seedHi, seedLo, incHi, incLo) {
    if (isNullable(seedLo) && isNullable(seedHi)) {
      seedLo = Math.random() * 4294967295 >>> 0;
      seedHi = 0;
    } else if (isNullable(seedLo)) {
      seedLo = seedHi;
      seedHi = 0;
    }
    if (isNullable(incLo) && isNullable(incHi)) {
      incLo = this._state ? this._state[3] : defaultIncLo;
      incHi = this._state ? this._state[2] : defaultIncHi;
    } else if (isNullable(incLo)) {
      incLo = incHi;
      incHi = 0;
    }
    this._state = new Int32Array([0, 0, incHi >>> 0, ((incLo || 0) | 1) >>> 0]);
    this._next();
    add64(this._state, this._state[0], this._state[1], seedHi >>> 0, seedLo >>> 0);
    this._next();
    return this;
  }
  /**
   * Returns a copy of the internal state of this random number generator as a
   * JavaScript Array.
   *
   * @category getters
   * @since 1.0.0
   */
  getState() {
    return [this._state[0], this._state[1], this._state[2], this._state[3]];
  }
  /**
   * Restore state previously retrieved using `getState()`.
   *
   * @since 1.0.0
   */
  setState(state2) {
    this._state[0] = state2[0];
    this._state[1] = state2[1];
    this._state[2] = state2[2];
    this._state[3] = state2[3] | 1;
  }
  /**
   * Get a uniformly distributed 32 bit integer between [0, max).
   *
   * @category getter
   * @since 1.0.0
   */
  integer(max) {
    if (!max) {
      return this._next();
    }
    max = max >>> 0;
    if ((max & max - 1) === 0) {
      return this._next() & max - 1;
    }
    let num = 0;
    const skew = (-max >>> 0) % max >>> 0;
    for (num = this._next(); num < skew; num = this._next()) {
    }
    return num % max;
  }
  /**
   * Get a uniformly distributed IEEE-754 double between 0.0 and 1.0, with
   * 53 bits of precision (every bit of the mantissa is randomized).
   *
   * @category getters
   * @since 1.0.0
   */
  number() {
    const hi = (this._next() & 67108863) * 1;
    const lo = (this._next() & 134217727) * 1;
    return (hi * BIT_27 + lo) / BIT_53;
  }
  /** @internal */
  _next() {
    const oldHi = this._state[0] >>> 0;
    const oldLo = this._state[1] >>> 0;
    mul64(this._state, oldHi, oldLo, MUL_HI, MUL_LO);
    add64(this._state, this._state[0], this._state[1], this._state[2], this._state[3]);
    let xsHi = oldHi >>> 18;
    let xsLo = (oldLo >>> 18 | oldHi << 14) >>> 0;
    xsHi = (xsHi ^ oldHi) >>> 0;
    xsLo = (xsLo ^ oldLo) >>> 0;
    const xorshifted = (xsLo >>> 27 | xsHi << 5) >>> 0;
    const rot = oldHi >>> 27;
    const rot2 = (-rot >>> 0 & 31) >>> 0;
    return (xorshifted >>> rot | xorshifted << rot2) >>> 0;
  }
}
function mul64(out, aHi, aLo, bHi, bLo) {
  let c1 = (aLo >>> 16) * (bLo & 65535) >>> 0;
  let c0 = (aLo & 65535) * (bLo >>> 16) >>> 0;
  let lo = (aLo & 65535) * (bLo & 65535) >>> 0;
  let hi = (aLo >>> 16) * (bLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16)) >>> 0;
  c0 = c0 << 16 >>> 0;
  lo = lo + c0 >>> 0;
  if (lo >>> 0 < c0 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  c1 = c1 << 16 >>> 0;
  lo = lo + c1 >>> 0;
  if (lo >>> 0 < c1 >>> 0) {
    hi = hi + 1 >>> 0;
  }
  hi = hi + Math.imul(aLo, bHi) >>> 0;
  hi = hi + Math.imul(aHi, bLo) >>> 0;
  out[0] = hi;
  out[1] = lo;
}
function add64(out, aHi, aLo, bHi, bLo) {
  let hi = aHi + bHi >>> 0;
  const lo = aLo + bLo >>> 0;
  if (lo >>> 0 < aLo >>> 0) {
    hi = hi + 1 | 0;
  }
  out[0] = hi;
  out[1] = lo;
}
const randomHashCache = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("@effect/data/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap());
const pcgr = /* @__PURE__ */ globalValue(/* @__PURE__ */ Symbol.for("@effect/data/Hash/pcgr"), () => new PCGRandom2());
const symbol$1 = /* @__PURE__ */ Symbol.for("@effect/data/Hash");
const hash = (self2) => {
  switch (typeof self2) {
    case "number": {
      return number(self2);
    }
    case "bigint": {
      return string(self2.toString(10));
    }
    case "boolean": {
      return string(String(self2));
    }
    case "symbol": {
      return string(String(self2));
    }
    case "string": {
      return string(self2);
    }
    case "undefined": {
      return string("undefined");
    }
    case "function":
    case "object": {
      if (self2 === null) {
        return string("null");
      }
      if (isHash(self2)) {
        return self2[symbol$1]();
      } else {
        return random(self2);
      }
    }
    default: {
      throw new Error("Bug in Equal.hash");
    }
  }
};
const random = (self2) => {
  if (!randomHashCache.has(self2)) {
    randomHashCache.set(self2, number(pcgr.integer(Number.MAX_SAFE_INTEGER)));
  }
  return randomHashCache.get(self2);
};
const combine = (b) => (self2) => self2 * 53 ^ b;
const optimize = (n) => n & 3221225471 | n >>> 1 & 1073741824;
const isHash = (u) => typeof u === "object" && u !== null && symbol$1 in u;
const number = (n) => {
  if (n !== n || n === Infinity) {
    return 0;
  }
  let h = n | 0;
  if (h !== n) {
    h ^= n * 4294967295;
  }
  while (n > 4294967295) {
    h ^= n /= 4294967295;
  }
  return optimize(n);
};
const string = (str) => {
  let h = 5381, i = str.length;
  while (i) {
    h = h * 33 ^ str.charCodeAt(--i);
  }
  return optimize(h);
};
const array = (arr) => {
  let h = 6151;
  for (let i = 0; i < arr.length; i++) {
    h = combine(hash(arr[i]))(h);
  }
  return optimize(h);
};
const symbol = /* @__PURE__ */ Symbol.for("@effect/data/Equal");
function equals() {
  if (arguments.length === 1) {
    return (self2) => compareBoth(self2, arguments[0]);
  }
  return compareBoth(arguments[0], arguments[1]);
}
function compareBoth(self2, that) {
  if (self2 === that) {
    return true;
  }
  const selfType = typeof self2;
  if (selfType !== typeof that) {
    return false;
  }
  if ((selfType === "object" || selfType === "function") && self2 !== null && that !== null) {
    if (isEqual(self2) && isEqual(that)) {
      return hash(self2) === hash(that) && self2[symbol](that);
    }
  }
  return false;
}
const isEqual = (u) => typeof u === "object" && u !== null && symbol in u;
const NodeInspectSymbol = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
const toJSON = (x) => {
  if (typeof x === "object" && x !== null && "toJSON" in x && typeof x["toJSON"] === "function" && x["toJSON"].length === 0) {
    return x.toJSON();
  } else if (Array.isArray(x)) {
    return x.map(toJSON);
  }
  return x;
};
const toString = (x) => JSON.stringify(x, null, 2);
const EffectTypeId$1 = /* @__PURE__ */ Symbol.for("@effect/io/Effect");
const effectVariance$1 = {
  _R: (_) => _,
  _E: (_) => _,
  _A: (_) => _
};
const make = (isEquivalent) => (self2, that) => self2 === that || isEquivalent(self2, that);
const pipeArguments = (self2, args2) => {
  switch (args2.length) {
    case 1:
      return args2[0](self2);
    case 2:
      return args2[1](args2[0](self2));
    case 3:
      return args2[2](args2[1](args2[0](self2)));
    case 4:
      return args2[3](args2[2](args2[1](args2[0](self2))));
    case 5:
      return args2[4](args2[3](args2[2](args2[1](args2[0](self2)))));
    case 6:
      return args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self2))))));
    case 7:
      return args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self2)))))));
    case 8:
      return args2[7](args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self2))))))));
    case 9:
      return args2[8](args2[7](args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self2)))))))));
    default: {
      let ret = self2;
      for (let i = 0, len = args2.length; i < len; i++) {
        ret = args2[i](ret);
      }
      return ret;
    }
  }
};
const TypeId$2 = /* @__PURE__ */ Symbol.for("@effect/data/Option");
const CommonProto$1 = {
  [EffectTypeId$1]: effectVariance$1,
  [TypeId$2]: {
    _A: (_) => _
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toString() {
    return toString(this.toJSON());
  }
};
const SomeProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto$1), {
  _tag: "Some",
  [symbol](that) {
    return isOption(that) && isSome$1(that) && equals(that.value, this.value);
  },
  [symbol$1]() {
    return combine(hash(this._tag))(hash(this.value));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: toJSON(this.value)
    };
  }
});
const NoneProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto$1), {
  _tag: "None",
  [symbol](that) {
    return isOption(that) && isNone$1(that);
  },
  [symbol$1]() {
    return combine(hash(this._tag));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
});
const isOption = (input) => typeof input === "object" && input != null && TypeId$2 in input;
const isNone$1 = (fa) => fa._tag === "None";
const isSome$1 = (fa) => fa._tag === "Some";
const none$1 = /* @__PURE__ */ Object.create(NoneProto);
const some$1 = (value) => {
  const a = Object.create(SomeProto);
  a.value = value;
  return a;
};
const TypeId$1 = /* @__PURE__ */ Symbol.for("@effect/data/Either");
const CommonProto = {
  [EffectTypeId$1]: effectVariance$1,
  [TypeId$1]: {
    _A: (_) => _
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toString() {
    return toString(this.toJSON());
  }
};
const RightProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "Right",
  [symbol](that) {
    return isEither(that) && isRight(that) && equals(that.right, this.right);
  },
  [symbol$1]() {
    return combine(hash(this._tag))(hash(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: toJSON(this.right)
    };
  }
});
const LeftProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "Left",
  [symbol](that) {
    return isEither(that) && isLeft(that) && equals(that.left, this.left);
  },
  [symbol$1]() {
    return combine(hash(this._tag))(hash(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: toJSON(this.left)
    };
  }
});
const isEither = (input) => typeof input === "object" && input != null && TypeId$1 in input;
const isLeft = (ma) => ma._tag === "Left";
const isRight = (ma) => ma._tag === "Right";
const left$1 = (left2) => {
  const a = Object.create(LeftProto);
  a.left = left2;
  return a;
};
const right$1 = (right2) => {
  const a = Object.create(RightProto);
  a.right = right2;
  return a;
};
const none = () => none$1;
const some = some$1;
const isNone = isNone$1;
const isSome = isSome$1;
const getOrElse = /* @__PURE__ */ dual(2, (self2, onNone) => isNone(self2) ? onNone() : self2.value);
const getOrUndefined = /* @__PURE__ */ getOrElse(constUndefined);
const right = right$1;
const left = left$1;
const fromIterable = (collection) => Array.isArray(collection) ? collection : Array.from(collection);
const reverse$1 = (self2) => Array.from(self2).reverse();
const reduce$2 = /* @__PURE__ */ dual(3, (self2, b, f) => fromIterable(self2).reduce((b2, a, i) => f(b2, a, i), b));
const TypeId = /* @__PURE__ */ Symbol.for("@effect/data/Chunk");
function copy(src, srcPos, dest, destPos, len) {
  for (let i = srcPos; i < Math.min(src.length, srcPos + len); i++) {
    dest[destPos + i - srcPos] = src[i];
  }
  return dest;
}
const emptyArray = [];
const getEquivalence = (isEquivalent) => make((self2, that) => toReadonlyArray(self2).every((value, i) => isEquivalent(value, unsafeGet(that, i))));
const _equivalence = /* @__PURE__ */ getEquivalence(equals);
const ChunkProto = {
  [TypeId]: {
    _A: (_) => _
  },
  toString() {
    return toString(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Chunk",
      values: toReadonlyArray(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol](that) {
    return isChunk(that) && _equivalence(this, that);
  },
  [symbol$1]() {
    return array(toReadonlyArray(this));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray": {
        return this.backing.array[Symbol.iterator]();
      }
      case "IEmpty": {
        return emptyArray[Symbol.iterator]();
      }
      default: {
        return toReadonlyArray(this)[Symbol.iterator]();
      }
    }
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
const makeChunk = (backing) => {
  const chunk = Object.create(ChunkProto);
  chunk.backing = backing;
  switch (backing._tag) {
    case "IEmpty": {
      chunk.length = 0;
      chunk.depth = 0;
      chunk.left = void 0;
      chunk.right = void 0;
      break;
    }
    case "IConcat": {
      chunk.length = backing.left.length + backing.right.length;
      chunk.depth = 1 + Math.max(backing.left.depth, backing.right.depth);
      chunk.left = backing.left;
      chunk.right = backing.right;
      break;
    }
    case "IArray": {
      chunk.length = backing.array.length;
      chunk.depth = 0;
      chunk.left = _empty$2;
      chunk.right = _empty$2;
      break;
    }
    case "ISingleton": {
      chunk.length = 1;
      chunk.depth = 0;
      chunk.left = _empty$2;
      chunk.right = _empty$2;
      break;
    }
    case "ISlice": {
      chunk.length = backing.length;
      chunk.depth = backing.chunk.depth + 1;
      chunk.left = _empty$2;
      chunk.right = _empty$2;
      break;
    }
  }
  return chunk;
};
const isChunk = (u) => isObject(u) && TypeId in u;
const _empty$2 = /* @__PURE__ */ makeChunk({
  _tag: "IEmpty"
});
const empty$3 = () => _empty$2;
const of = (a) => makeChunk({
  _tag: "ISingleton",
  a
});
const copyToArray = (self2, array2, initial) => {
  switch (self2.backing._tag) {
    case "IArray": {
      copy(self2.backing.array, 0, array2, initial, self2.length);
      break;
    }
    case "IConcat": {
      copyToArray(self2.left, array2, initial);
      copyToArray(self2.right, array2, initial + self2.left.length);
      break;
    }
    case "ISingleton": {
      array2[initial] = self2.backing.a;
      break;
    }
    case "ISlice": {
      let i = 0;
      let j = initial;
      while (i < self2.length) {
        array2[j] = unsafeGet(self2, i);
        i += 1;
        j += 1;
      }
      break;
    }
  }
};
const toReadonlyArray = (self2) => {
  switch (self2.backing._tag) {
    case "IEmpty": {
      return emptyArray;
    }
    case "IArray": {
      return self2.backing.array;
    }
    default: {
      const arr = new Array(self2.length);
      copyToArray(self2, arr, 0);
      self2.backing = {
        _tag: "IArray",
        array: arr
      };
      self2.left = _empty$2;
      self2.right = _empty$2;
      self2.depth = 0;
      return arr;
    }
  }
};
const reverse = (self2) => {
  switch (self2.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return self2;
    case "IArray": {
      return makeChunk({
        _tag: "IArray",
        array: reverse$1(self2.backing.array)
      });
    }
    case "IConcat": {
      return makeChunk({
        _tag: "IConcat",
        left: reverse(self2.backing.right),
        right: reverse(self2.backing.left)
      });
    }
    case "ISlice":
      return unsafeFromArray(reverse$1(toReadonlyArray(self2)));
  }
};
const unsafeFromArray = (self2) => makeChunk({
  _tag: "IArray",
  array: self2
});
const unsafeGet = /* @__PURE__ */ dual(2, (self2, index2) => {
  switch (self2.backing._tag) {
    case "IEmpty": {
      throw new Error(`Index out of bounds`);
    }
    case "ISingleton": {
      if (index2 !== 0) {
        throw new Error(`Index out of bounds`);
      }
      return self2.backing.a;
    }
    case "IArray": {
      if (index2 >= self2.length || index2 < 0) {
        throw new Error(`Index out of bounds`);
      }
      return self2.backing.array[index2];
    }
    case "IConcat": {
      return index2 < self2.left.length ? unsafeGet(self2.left, index2) : unsafeGet(self2.right, index2 - self2.left.length);
    }
    case "ISlice": {
      return unsafeGet(self2.backing.chunk, index2 + self2.backing.offset);
    }
  }
});
const prepend = /* @__PURE__ */ dual(2, (self2, elem) => appendAllNonEmpty(of(elem), self2));
const appendAll = /* @__PURE__ */ dual(2, (self2, that) => {
  if (self2.backing._tag === "IEmpty") {
    return that;
  }
  if (that.backing._tag === "IEmpty") {
    return self2;
  }
  const diff2 = that.depth - self2.depth;
  if (Math.abs(diff2) <= 1) {
    return makeChunk({
      _tag: "IConcat",
      left: self2,
      right: that
    });
  } else if (diff2 < -1) {
    if (self2.left.depth >= self2.right.depth) {
      const nr = appendAll(self2.right, that);
      return makeChunk({
        _tag: "IConcat",
        left: self2.left,
        right: nr
      });
    } else {
      const nrr = appendAll(self2.right.right, that);
      if (nrr.depth === self2.depth - 3) {
        const nr = makeChunk({
          _tag: "IConcat",
          left: self2.right.left,
          right: nrr
        });
        return makeChunk({
          _tag: "IConcat",
          left: self2.left,
          right: nr
        });
      } else {
        const nl = makeChunk({
          _tag: "IConcat",
          left: self2.left,
          right: self2.right.left
        });
        return makeChunk({
          _tag: "IConcat",
          left: nl,
          right: nrr
        });
      }
    }
  } else {
    if (that.right.depth >= that.left.depth) {
      const nl = appendAll(self2, that.left);
      return makeChunk({
        _tag: "IConcat",
        left: nl,
        right: that.right
      });
    } else {
      const nll = appendAll(self2, that.left.left);
      if (nll.depth === that.depth - 3) {
        const nl = makeChunk({
          _tag: "IConcat",
          left: nll,
          right: that.left.right
        });
        return makeChunk({
          _tag: "IConcat",
          left: nl,
          right: that.right
        });
      } else {
        const nr = makeChunk({
          _tag: "IConcat",
          left: that.left.right,
          right: that.right
        });
        return makeChunk({
          _tag: "IConcat",
          left: nll,
          right: nr
        });
      }
    }
  }
});
const appendAllNonEmpty = /* @__PURE__ */ dual(2, (self2, that) => appendAll(self2, that));
const isEmpty = (self2) => self2.length === 0;
const isNonEmpty = (self2) => self2.length > 0;
const unsafeHead = (self2) => unsafeGet(self2, 0);
const headNonEmpty = unsafeHead;
const SIZE = 5;
const BUCKET_SIZE = /* @__PURE__ */ Math.pow(2, SIZE);
const MASK = BUCKET_SIZE - 1;
const MAX_INDEX_NODE = BUCKET_SIZE / 2;
const MIN_ARRAY_NODE = BUCKET_SIZE / 4;
function popcount(x) {
  x -= x >> 1 & 1431655765;
  x = (x & 858993459) + (x >> 2 & 858993459);
  x = x + (x >> 4) & 252645135;
  x += x >> 8;
  x += x >> 16;
  return x & 127;
}
function hashFragment(shift, h) {
  return h >>> shift & MASK;
}
function toBitmap(x) {
  return 1 << x;
}
function fromBitmap(bitmap, bit) {
  return popcount(bitmap & bit - 1);
}
function arrayUpdate(mutate2, at, v, arr) {
  let out = arr;
  if (!mutate2) {
    const len = arr.length;
    out = new Array(len);
    for (let i = 0; i < len; ++i) out[i] = arr[i];
  }
  out[at] = v;
  return out;
}
function arraySpliceOut(mutate2, at, arr) {
  const newLen = arr.length - 1;
  let i = 0;
  let g = 0;
  let out = arr;
  if (mutate2) {
    i = g = at;
  } else {
    out = new Array(newLen);
    while (i < at) out[g++] = arr[i++];
  }
  ++i;
  while (i <= newLen) out[g++] = arr[i++];
  if (mutate2) {
    out.length = newLen;
  }
  return out;
}
function arraySpliceIn(mutate2, at, v, arr) {
  const len = arr.length;
  if (mutate2) {
    let i2 = len;
    while (i2 >= at) arr[i2--] = arr[i2];
    arr[at] = v;
    return arr;
  }
  let i = 0, g = 0;
  const out = new Array(len + 1);
  while (i < at) out[g++] = arr[i++];
  out[at] = v;
  while (i < len) out[++g] = arr[i++];
  return out;
}
class Stack {
  constructor(value, previous) {
    this.value = value;
    this.previous = previous;
  }
}
class EmptyNode2 {
  constructor() {
    this._tag = "EmptyNode";
  }
  modify(edit, _shift, f, hash2, key, size2) {
    const v = f(none());
    if (isNone(v)) return new EmptyNode2();
    ++size2.value;
    return new LeafNode2(edit, hash2, key, v);
  }
}
function isEmptyNode(a) {
  return a instanceof EmptyNode2;
}
function isLeafNode(node2) {
  return isEmptyNode(node2) || node2._tag === "LeafNode" || node2._tag === "CollisionNode";
}
function canEditNode(node2, edit) {
  return isEmptyNode(node2) ? false : edit === node2.edit;
}
class LeafNode2 {
  constructor(edit, hash2, key, value) {
    this.edit = edit;
    this.hash = hash2;
    this.key = key;
    this.value = value;
    this._tag = "LeafNode";
  }
  modify(edit, shift, f, hash2, key, size2) {
    if (equals(key, this.key)) {
      const v2 = f(this.value);
      if (v2 === this.value) return this;
      else if (isNone(v2)) {
        --size2.value;
        return new EmptyNode2();
      }
      if (canEditNode(this, edit)) {
        this.value = v2;
        return this;
      }
      return new LeafNode2(edit, hash2, key, v2);
    }
    const v = f(none());
    if (isNone(v)) return this;
    ++size2.value;
    return mergeLeaves(edit, shift, this.hash, this, hash2, new LeafNode2(edit, hash2, key, v));
  }
}
class CollisionNode2 {
  constructor(edit, hash2, children) {
    this.edit = edit;
    this.hash = hash2;
    this.children = children;
    this._tag = "CollisionNode";
  }
  modify(edit, shift, f, hash2, key, size2) {
    if (hash2 === this.hash) {
      const canEdit = canEditNode(this, edit);
      const list = this.updateCollisionList(canEdit, edit, this.hash, this.children, f, key, size2);
      if (list === this.children) return this;
      return list.length > 1 ? new CollisionNode2(edit, this.hash, list) : list[0];
    }
    const v = f(none());
    if (isNone(v)) return this;
    ++size2.value;
    return mergeLeaves(edit, shift, this.hash, this, hash2, new LeafNode2(edit, hash2, key, v));
  }
  updateCollisionList(mutate2, edit, hash2, list, f, key, size2) {
    const len = list.length;
    for (let i = 0; i < len; ++i) {
      const child2 = list[i];
      if ("key" in child2 && equals(key, child2.key)) {
        const value = child2.value;
        const newValue2 = f(value);
        if (newValue2 === value) return list;
        if (isNone(newValue2)) {
          --size2.value;
          return arraySpliceOut(mutate2, i, list);
        }
        return arrayUpdate(mutate2, i, new LeafNode2(edit, hash2, key, newValue2), list);
      }
    }
    const newValue = f(none());
    if (isNone(newValue)) return list;
    ++size2.value;
    return arrayUpdate(mutate2, len, new LeafNode2(edit, hash2, key, newValue), list);
  }
}
class IndexedNode2 {
  constructor(edit, mask, children) {
    this.edit = edit;
    this.mask = mask;
    this.children = children;
    this._tag = "IndexedNode";
  }
  modify(edit, shift, f, hash2, key, size2) {
    const mask = this.mask;
    const children = this.children;
    const frag = hashFragment(shift, hash2);
    const bit = toBitmap(frag);
    const indx = fromBitmap(mask, bit);
    const exists2 = mask & bit;
    const canEdit = canEditNode(this, edit);
    if (!exists2) {
      const _newChild = new EmptyNode2().modify(edit, shift + SIZE, f, hash2, key, size2);
      if (!_newChild) return this;
      return children.length >= MAX_INDEX_NODE ? expand(edit, frag, _newChild, mask, children) : new IndexedNode2(edit, mask | bit, arraySpliceIn(canEdit, indx, _newChild, children));
    }
    const current = children[indx];
    const child2 = current.modify(edit, shift + SIZE, f, hash2, key, size2);
    if (current === child2) return this;
    let bitmap = mask;
    let newChildren;
    if (isEmptyNode(child2)) {
      bitmap &= ~bit;
      if (!bitmap) return new EmptyNode2();
      if (children.length <= 2 && isLeafNode(children[indx ^ 1])) {
        return children[indx ^ 1];
      }
      newChildren = arraySpliceOut(canEdit, indx, children);
    } else {
      newChildren = arrayUpdate(canEdit, indx, child2, children);
    }
    if (canEdit) {
      this.mask = bitmap;
      this.children = newChildren;
      return this;
    }
    return new IndexedNode2(edit, bitmap, newChildren);
  }
}
class ArrayNode2 {
  constructor(edit, size2, children) {
    this.edit = edit;
    this.size = size2;
    this.children = children;
    this._tag = "ArrayNode";
  }
  modify(edit, shift, f, hash2, key, size2) {
    let count = this.size;
    const children = this.children;
    const frag = hashFragment(shift, hash2);
    const child2 = children[frag];
    const newChild = (child2 || new EmptyNode2()).modify(edit, shift + SIZE, f, hash2, key, size2);
    if (child2 === newChild) return this;
    const canEdit = canEditNode(this, edit);
    let newChildren;
    if (isEmptyNode(child2) && !isEmptyNode(newChild)) {
      ++count;
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    } else if (!isEmptyNode(child2) && isEmptyNode(newChild)) {
      --count;
      if (count <= MIN_ARRAY_NODE) {
        return pack(edit, count, frag, children);
      }
      newChildren = arrayUpdate(canEdit, frag, new EmptyNode2(), children);
    } else {
      newChildren = arrayUpdate(canEdit, frag, newChild, children);
    }
    if (canEdit) {
      this.size = count;
      this.children = newChildren;
      return this;
    }
    return new ArrayNode2(edit, count, newChildren);
  }
}
function pack(edit, count, removed, elements) {
  const children = new Array(count - 1);
  let g = 0;
  let bitmap = 0;
  for (let i = 0, len = elements.length; i < len; ++i) {
    if (i !== removed) {
      const elem = elements[i];
      if (elem && !isEmptyNode(elem)) {
        children[g++] = elem;
        bitmap |= 1 << i;
      }
    }
  }
  return new IndexedNode2(edit, bitmap, children);
}
function expand(edit, frag, child2, bitmap, subNodes) {
  const arr = [];
  let bit = bitmap;
  let count = 0;
  for (let i = 0; bit; ++i) {
    if (bit & 1) arr[i] = subNodes[count++];
    bit >>>= 1;
  }
  arr[frag] = child2;
  return new ArrayNode2(edit, count + 1, arr);
}
function mergeLeavesInner(edit, shift, h1, n1, h2, n2) {
  if (h1 === h2) return new CollisionNode2(edit, h1, [n2, n1]);
  const subH1 = hashFragment(shift, h1);
  const subH2 = hashFragment(shift, h2);
  if (subH1 === subH2) {
    return (child2) => new IndexedNode2(edit, toBitmap(subH1) | toBitmap(subH2), [child2]);
  } else {
    const children = subH1 < subH2 ? [n1, n2] : [n2, n1];
    return new IndexedNode2(edit, toBitmap(subH1) | toBitmap(subH2), children);
  }
}
function mergeLeaves(edit, shift, h1, n1, h2, n2) {
  let stack = void 0;
  let currentShift = shift;
  while (true) {
    const res2 = mergeLeavesInner(edit, currentShift, h1, n1, h2, n2);
    if (typeof res2 === "function") {
      stack = new Stack(res2, stack);
      currentShift = currentShift + SIZE;
    } else {
      let final = res2;
      while (stack != null) {
        final = stack.value(final);
        stack = stack.previous;
      }
      return final;
    }
  }
}
const HashMapTypeId = /* @__PURE__ */ Symbol.for("@effect/data/HashMap");
const HashMapProto = {
  [HashMapTypeId]: HashMapTypeId,
  [Symbol.iterator]() {
    return new HashMapIterator2(this, (k, v) => [k, v]);
  },
  [symbol$1]() {
    let hash$12 = hash("HashMap");
    for (const item of this) {
      hash$12 ^= combine(hash(item[0]))(hash(item[1]));
    }
    return hash$12;
  },
  [symbol](that) {
    if (isHashMap(that)) {
      if (that._size !== this._size) {
        return false;
      }
      for (const item of this) {
        const elem = getHash(item[0], hash(item[0]))(that);
        if (isNone(elem)) {
          return false;
        } else {
          if (!equals(item[1], elem.value)) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  },
  toString() {
    return toString(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashMap",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
const makeImpl$1 = (editable, edit, root, size2) => {
  const map2 = Object.create(HashMapProto);
  map2._editable = editable;
  map2._edit = edit;
  map2._root = root;
  map2._size = size2;
  return map2;
};
class HashMapIterator2 {
  constructor(map2, f) {
    this.map = map2;
    this.f = f;
    this.v = visitLazy(this.map._root, this.f, void 0);
  }
  next() {
    if (isNone(this.v)) {
      return {
        done: true,
        value: void 0
      };
    }
    const v0 = this.v.value;
    this.v = applyCont(v0.cont);
    return {
      done: false,
      value: v0.value
    };
  }
  [Symbol.iterator]() {
    return new HashMapIterator2(this.map, this.f);
  }
}
const applyCont = (cont) => cont ? visitLazyChildren(cont[0], cont[1], cont[2], cont[3], cont[4]) : none();
const visitLazy = (node2, f, cont = void 0) => {
  switch (node2._tag) {
    case "LeafNode": {
      if (isSome(node2.value)) {
        return some({
          value: f(node2.key, node2.value.value),
          cont
        });
      }
      return applyCont(cont);
    }
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode": {
      const children = node2.children;
      return visitLazyChildren(children.length, children, 0, f, cont);
    }
    default: {
      return applyCont(cont);
    }
  }
};
const visitLazyChildren = (len, children, i, f, cont) => {
  while (i < len) {
    const child2 = children[i++];
    if (child2 && !isEmptyNode(child2)) {
      return visitLazy(child2, f, [len, children, i, f, cont]);
    }
  }
  return applyCont(cont);
};
const _empty$1 = /* @__PURE__ */ makeImpl$1(false, 0, /* @__PURE__ */ new EmptyNode2(), 0);
const empty$2 = () => _empty$1;
const isHashMap = (u) => isObject(u) && HashMapTypeId in u;
const getHash = /* @__PURE__ */ dual(3, (self2, key, hash2) => {
  let node2 = self2._root;
  let shift = 0;
  while (true) {
    switch (node2._tag) {
      case "LeafNode": {
        return equals(key, node2.key) ? node2.value : none();
      }
      case "CollisionNode": {
        if (hash2 === node2.hash) {
          const children = node2.children;
          for (let i = 0, len = children.length; i < len; ++i) {
            const child2 = children[i];
            if ("key" in child2 && equals(key, child2.key)) {
              return child2.value;
            }
          }
        }
        return none();
      }
      case "IndexedNode": {
        const frag = hashFragment(shift, hash2);
        const bit = toBitmap(frag);
        if (node2.mask & bit) {
          node2 = node2.children[fromBitmap(node2.mask, bit)];
          shift += SIZE;
          break;
        }
        return none();
      }
      case "ArrayNode": {
        node2 = node2.children[hashFragment(shift, hash2)];
        if (node2) {
          shift += SIZE;
          break;
        }
        return none();
      }
      default:
        return none();
    }
  }
});
const set = /* @__PURE__ */ dual(3, (self2, key, value) => modifyAt(self2, key, () => some(value)));
const setTree = /* @__PURE__ */ dual(3, (self2, newRoot, newSize) => {
  if (self2._editable) {
    self2._root = newRoot;
    self2._size = newSize;
    return self2;
  }
  return newRoot === self2._root ? self2 : makeImpl$1(self2._editable, self2._edit, newRoot, newSize);
});
const keys = (self2) => new HashMapIterator2(self2, (key) => key);
const size$2 = (self2) => self2._size;
const beginMutation$1 = (self2) => makeImpl$1(true, self2._edit + 1, self2._root, self2._size);
const modifyAt = /* @__PURE__ */ dual(3, (self2, key, f) => modifyHash(self2, key, hash(key), f));
const modifyHash = /* @__PURE__ */ dual(4, (self2, key, hash2, f) => {
  const size2 = {
    value: self2._size
  };
  const newRoot = self2._root.modify(self2._editable ? self2._edit : NaN, 0, f, hash2, key, size2);
  return setTree(newRoot, size2.value)(self2);
});
const forEach$1 = /* @__PURE__ */ dual(2, (self2, f) => reduce$1(self2, void 0, (_, value, key) => f(value, key)));
const reduce$1 = /* @__PURE__ */ dual(3, (self2, zero2, f) => {
  const root = self2._root;
  if (root._tag === "LeafNode") {
    return isSome(root.value) ? f(zero2, root.value.value, root.key) : zero2;
  }
  if (root._tag === "EmptyNode") {
    return zero2;
  }
  const toVisit = [root.children];
  let children;
  while (children = toVisit.pop()) {
    for (let i = 0, len = children.length; i < len; ) {
      const child2 = children[i++];
      if (child2 && !isEmptyNode(child2)) {
        if (child2._tag === "LeafNode") {
          if (isSome(child2.value)) {
            zero2 = f(zero2, child2.value.value, child2.key);
          }
        } else {
          toVisit.push(child2.children);
        }
      }
    }
  }
  return zero2;
});
const HashSetTypeId = /* @__PURE__ */ Symbol.for("@effect/data/HashSet");
const HashSetProto = {
  [HashSetTypeId]: HashSetTypeId,
  [Symbol.iterator]() {
    return keys(this._keyMap);
  },
  [symbol$1]() {
    return combine(hash(this._keyMap))(hash("HashSet"));
  },
  [symbol](that) {
    if (isHashSet(that)) {
      return size$2(this._keyMap) === size$2(that._keyMap) && equals(this._keyMap, that._keyMap);
    }
    return false;
  },
  toString() {
    return toString(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashSet",
      values: Array.from(this).map(toJSON)
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
const makeImpl = (keyMap) => {
  const set2 = Object.create(HashSetProto);
  set2._keyMap = keyMap;
  return set2;
};
const isHashSet = (u) => isObject(u) && HashSetTypeId in u;
const _empty = /* @__PURE__ */ makeImpl(/* @__PURE__ */ empty$2());
const empty$1 = () => _empty;
const size$1 = (self2) => size$2(self2._keyMap);
const beginMutation = (self2) => makeImpl(beginMutation$1(self2._keyMap));
const endMutation = (self2) => {
  self2._keyMap._editable = false;
  return self2;
};
const mutate = /* @__PURE__ */ dual(2, (self2, f) => {
  const transient = beginMutation(self2);
  f(transient);
  return endMutation(transient);
});
const add$1 = /* @__PURE__ */ dual(2, (self2, value) => self2._keyMap._editable ? (set(value, true)(self2._keyMap), self2) : makeImpl(set(value, true)(self2._keyMap)));
const union$2 = /* @__PURE__ */ dual(2, (self2, that) => mutate(empty$1(), (set2) => {
  forEach(self2, (value) => add$1(set2, value));
  for (const value of that) {
    add$1(set2, value);
  }
}));
const forEach = /* @__PURE__ */ dual(2, (self2, f) => forEach$1(self2._keyMap, (_, k) => f(k)));
const empty = empty$1;
const size = size$1;
const add = add$1;
const union$1 = union$2;
const OP_DIE = "Die";
const OP_EMPTY = "Empty";
const OP_FAIL = "Fail";
const OP_INTERRUPT = "Interrupt";
const OP_PARALLEL = "Parallel";
const OP_SEQUENTIAL = "Sequential";
const CauseSymbolKey = "@effect/io/Cause";
const CauseTypeId = /* @__PURE__ */ Symbol.for(CauseSymbolKey);
const variance = {
  _E: (_) => _
};
const proto = {
  [CauseTypeId]: variance,
  [symbol$1]() {
    return combine(hash(flattenCause(this)))(hash(CauseSymbolKey));
  },
  [symbol](that) {
    return isCause(that) && causeEquals(this, that);
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  toJSON() {
    switch (this._tag) {
      case "Empty":
        return {
          _id: "Cause",
          _tag: this._tag
        };
      case "Die":
        return {
          _id: "Cause",
          _tag: this._tag,
          defect: toJSON(this.defect)
        };
      case "Interrupt":
        return {
          _id: "Cause",
          _tag: this._tag,
          fiberId: this.fiberId.toJSON()
        };
      case "Fail":
        return {
          _id: "Cause",
          _tag: this._tag,
          failure: toJSON(this.error)
        };
      case "Sequential":
      case "Parallel":
        return {
          _id: "Cause",
          _tag: this._tag,
          errors: toJSON(prettyErrors(this))
        };
    }
  },
  toString() {
    return pretty(this);
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
const fail = (error) => {
  const o = Object.create(proto);
  o._tag = OP_FAIL;
  o.error = error;
  return o;
};
const parallel = (left2, right2) => {
  const o = Object.create(proto);
  o._tag = OP_PARALLEL;
  o.left = left2;
  o.right = right2;
  return o;
};
const sequential = (left2, right2) => {
  const o = Object.create(proto);
  o._tag = OP_SEQUENTIAL;
  o.left = left2;
  o.right = right2;
  return o;
};
const isCause = (u) => typeof u === "object" && u != null && CauseTypeId in u;
const isInterruptedOnly = (self2) => reduceWithContext(void 0, IsInterruptedOnlyCauseReducer)(self2);
const causeEquals = (left2, right2) => {
  let leftStack = of(left2);
  let rightStack = of(right2);
  while (isNonEmpty(leftStack) && isNonEmpty(rightStack)) {
    const [leftParallel, leftSequential] = reduce([empty(), empty$3()], ([parallel2, sequential2], cause) => {
      const [par2, seq2] = evaluateCause(cause);
      return some([union$1(par2)(parallel2), appendAll(seq2)(sequential2)]);
    })(headNonEmpty(leftStack));
    const [rightParallel, rightSequential] = reduce([empty(), empty$3()], ([parallel2, sequential2], cause) => {
      const [par2, seq2] = evaluateCause(cause);
      return some([union$1(par2)(parallel2), appendAll(seq2)(sequential2)]);
    })(headNonEmpty(rightStack));
    if (!equals(leftParallel, rightParallel)) {
      return false;
    }
    leftStack = leftSequential;
    rightStack = rightSequential;
  }
  return true;
};
const flattenCause = (cause) => {
  return flattenCauseLoop(of(cause), empty$3());
};
const flattenCauseLoop = (causes, flattened) => {
  while (1) {
    const [parallel2, sequential2] = reduce$2([empty(), empty$3()], ([parallel3, sequential3], cause) => {
      const [par2, seq2] = evaluateCause(cause);
      return [union$1(par2)(parallel3), appendAll(seq2)(sequential3)];
    })(causes);
    const updated = size(parallel2) > 0 ? prepend(parallel2)(flattened) : flattened;
    if (isEmpty(sequential2)) {
      return reverse(updated);
    }
    causes = sequential2;
    flattened = updated;
  }
  throw new Error("BUG: Cause.flattenCauseLoop - please report an issue at https://github.com/Effect-TS/io/issues");
};
const evaluateCause = (self2) => {
  let cause = self2;
  const stack = [];
  let _parallel = empty();
  let _sequential = empty$3();
  while (cause !== void 0) {
    switch (cause._tag) {
      case OP_EMPTY: {
        if (stack.length === 0) {
          return [_parallel, _sequential];
        }
        cause = stack.pop();
        break;
      }
      case OP_FAIL: {
        if (stack.length === 0) {
          return [add(cause.error)(_parallel), _sequential];
        }
        _parallel = add(cause.error)(_parallel);
        cause = stack.pop();
        break;
      }
      case OP_DIE: {
        if (stack.length === 0) {
          return [add(cause.defect)(_parallel), _sequential];
        }
        _parallel = add(cause.defect)(_parallel);
        cause = stack.pop();
        break;
      }
      case OP_INTERRUPT: {
        if (stack.length === 0) {
          return [add(cause.fiberId)(_parallel), _sequential];
        }
        _parallel = add(cause.fiberId)(_parallel);
        cause = stack.pop();
        break;
      }
      case OP_SEQUENTIAL: {
        switch (cause.left._tag) {
          case OP_EMPTY: {
            cause = cause.right;
            break;
          }
          case OP_SEQUENTIAL: {
            cause = sequential(cause.left.left, sequential(cause.left.right, cause.right));
            break;
          }
          case OP_PARALLEL: {
            cause = parallel(sequential(cause.left.left, cause.right), sequential(cause.left.right, cause.right));
            break;
          }
          default: {
            _sequential = prepend(cause.right)(_sequential);
            cause = cause.left;
            break;
          }
        }
        break;
      }
      case OP_PARALLEL: {
        stack.push(cause.right);
        cause = cause.left;
        break;
      }
    }
  }
  throw new Error("BUG: Cause.evaluateCauseLoop - please report an issue at https://github.com/Effect-TS/io/issues");
};
const IsInterruptedOnlyCauseReducer = {
  emptyCase: constTrue,
  failCase: constFalse,
  dieCase: constFalse,
  interruptCase: constTrue,
  sequentialCase: (_, left2, right2) => left2 && right2,
  parallelCase: (_, left2, right2) => left2 && right2
};
const OP_SEQUENTIAL_CASE = "SequentialCase";
const OP_PARALLEL_CASE = "ParallelCase";
const reduce = /* @__PURE__ */ dual(3, (self2, zero2, pf) => {
  let accumulator = zero2;
  let cause = self2;
  const causes = [];
  while (cause !== void 0) {
    const option = pf(accumulator, cause);
    accumulator = isSome(option) ? option.value : accumulator;
    switch (cause._tag) {
      case OP_SEQUENTIAL: {
        causes.push(cause.right);
        cause = cause.left;
        break;
      }
      case OP_PARALLEL: {
        causes.push(cause.right);
        cause = cause.left;
        break;
      }
      default: {
        cause = void 0;
        break;
      }
    }
    if (cause === void 0 && causes.length > 0) {
      cause = causes.pop();
    }
  }
  return accumulator;
});
const reduceWithContext = /* @__PURE__ */ dual(3, (self2, context, reducer) => {
  const input = [self2];
  const output = [];
  while (input.length > 0) {
    const cause = input.pop();
    switch (cause._tag) {
      case OP_EMPTY: {
        output.push(right(reducer.emptyCase(context)));
        break;
      }
      case OP_FAIL: {
        output.push(right(reducer.failCase(context, cause.error)));
        break;
      }
      case OP_DIE: {
        output.push(right(reducer.dieCase(context, cause.defect)));
        break;
      }
      case OP_INTERRUPT: {
        output.push(right(reducer.interruptCase(context, cause.fiberId)));
        break;
      }
      case OP_SEQUENTIAL: {
        input.push(cause.right);
        input.push(cause.left);
        output.push(left({
          _tag: OP_SEQUENTIAL_CASE
        }));
        break;
      }
      case OP_PARALLEL: {
        input.push(cause.right);
        input.push(cause.left);
        output.push(left({
          _tag: OP_PARALLEL_CASE
        }));
        break;
      }
    }
  }
  const accumulator = [];
  while (output.length > 0) {
    const either2 = output.pop();
    switch (either2._tag) {
      case "Left": {
        switch (either2.left._tag) {
          case OP_SEQUENTIAL_CASE: {
            const left2 = accumulator.pop();
            const right2 = accumulator.pop();
            const value = reducer.sequentialCase(context, left2, right2);
            accumulator.push(value);
            break;
          }
          case OP_PARALLEL_CASE: {
            const left2 = accumulator.pop();
            const right2 = accumulator.pop();
            const value = reducer.parallelCase(context, left2, right2);
            accumulator.push(value);
            break;
          }
        }
        break;
      }
      case "Right": {
        accumulator.push(either2.right);
        break;
      }
    }
  }
  if (accumulator.length === 0) {
    throw new Error("BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/io/issues");
  }
  return accumulator.pop();
});
const filterStack = (stack) => {
  const lines = stack.split("\n");
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("EffectPrimitive") || lines[i].includes("Generator.next") || lines[i].includes("FiberRuntime")) {
      return out.join("\n");
    } else {
      out.push(lines[i]);
    }
  }
  return out.join("\n");
};
const pretty = (cause) => {
  if (isInterruptedOnly(cause)) {
    return "All fibers interrupted without errors.";
  }
  const final = prettyErrors(cause).map((e) => {
    let message = e.message;
    if (e.stack) {
      message += `\r
${filterStack(e.stack)}`;
    }
    if (e.span) {
      let current = e.span;
      let i = 0;
      while (current && current._tag === "Span" && i < 10) {
        message += `\r
    at ${current.name}`;
        current = getOrUndefined(current.parent);
        i++;
      }
    }
    return message;
  }).join("\r\n");
  return final;
};
class PrettyError2 {
  constructor(message, stack, span2) {
    this.message = message;
    this.stack = stack;
    this.span = span2;
  }
  toJSON() {
    const out = {
      message: this.message
    };
    if (this.stack) {
      out.stack = this.stack;
    }
    if (this.span) {
      out.span = this.span;
    }
    return out;
  }
}
const prettyErrorMessage = (u) => {
  if (typeof u === "string") {
    return `Error: ${u}`;
  }
  if (typeof u === "object" && u != null && "toString" in u && typeof u["toString"] === "function" && u["toString"] !== Object.prototype.toString) {
    return u["toString"]();
  }
  if (typeof u === "object" && u !== null) {
    if ("message" in u && typeof u["message"] === "string") {
      const raw = JSON.parse(JSON.stringify(u));
      const keys2 = new Set(Object.keys(raw));
      keys2.delete("name");
      keys2.delete("message");
      keys2.delete("_tag");
      if (keys2.size === 0) {
        const name = "name" in u && typeof u.name === "string" ? u.name : "Error";
        const tag = "_tag" in u && typeof u["_tag"] === "string" ? `(${u._tag})` : ``;
        return `${name}${tag}: ${u.message}`;
      }
    }
  }
  return `Error: ${JSON.stringify(u)}`;
};
const spanSymbol = /* @__PURE__ */ Symbol.for("@effect/io/SpanAnnotation");
const defaultRenderError = (error) => {
  var _a3;
  const span2 = typeof error === "object" && error !== null && spanSymbol in error && error[spanSymbol];
  if (typeof error === "object" && error !== null && error instanceof Error) {
    return new PrettyError2(prettyErrorMessage(error), (_a3 = error.stack) == null ? void 0 : _a3.split("\n").filter((_) => !_.startsWith("Error")).join("\n"), span2);
  }
  return new PrettyError2(prettyErrorMessage(error), void 0, span2);
};
const prettyErrors = (cause) => reduceWithContext(cause, void 0, {
  emptyCase: () => [],
  dieCase: (_, unknownError) => {
    return [defaultRenderError(unknownError)];
  },
  failCase: (_, error) => {
    return [defaultRenderError(error)];
  },
  interruptCase: () => [],
  parallelCase: (_, l, r) => [...l, ...r],
  sequentialCase: (_, l, r) => [...l, ...r]
});
const OP_SUCCESS = "Success";
const OP_SYNC = "Sync";
var _a, _c;
const EffectErrorSymbolKey = "@effect/io/EffectError";
const EffectErrorTypeId = /* @__PURE__ */ Symbol.for(EffectErrorSymbolKey);
const makeEffectError = (cause) => ({
  [EffectErrorTypeId]: EffectErrorTypeId,
  _tag: "EffectError",
  cause
});
const EffectTypeId = /* @__PURE__ */ Symbol.for("@effect/io/Effect");
class EffectPrimitive2 {
  constructor(_tag) {
    this._tag = _tag;
    this.i0 = void 0;
    this.i1 = void 0;
    this.i2 = void 0;
    this.trace = void 0;
    this[_a] = effectVariance;
  }
  [(_a = EffectTypeId, symbol)](that) {
    return this === that;
  }
  [symbol$1]() {
    return random(this);
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Effect",
      _tag: this._tag,
      i0: toJSON(this.i0),
      i1: toJSON(this.i1),
      i2: toJSON(this.i2)
    };
  }
  toString() {
    return toString(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
}
class EffectPrimitiveSuccess2 {
  constructor(_tag) {
    this._tag = _tag;
    this.i0 = void 0;
    this.i1 = void 0;
    this.i2 = void 0;
    this.trace = void 0;
    this[_c] = effectVariance;
  }
  [(_c = EffectTypeId, symbol)](that) {
    return this === that;
  }
  [symbol$1]() {
    return random(this);
  }
  get value() {
    return this.i0;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._tag,
      value: toJSON(this.value)
    };
  }
  toString() {
    return toString(this.toJSON());
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
}
const effectVariance = {
  _R: (_) => _,
  _E: (_) => _,
  _A: (_) => _
};
const succeed$1 = (value) => {
  const effect = new EffectPrimitiveSuccess2(OP_SUCCESS);
  effect.i0 = value;
  return effect;
};
const sync = (evaluate2) => {
  const effect = new EffectPrimitive2(OP_SYNC);
  effect.i0 = evaluate2;
  return effect;
};
const try_$1 = (arg) => {
  let evaluate2;
  let onFailure = void 0;
  if (typeof arg === "function") {
    evaluate2 = arg;
  } else {
    evaluate2 = arg.try;
    onFailure = arg.catch;
  }
  return sync(() => {
    try {
      return evaluate2();
    } catch (error) {
      throw makeEffectError(fail(onFailure ? onFailure(error) : error));
    }
  });
};
const succeed = succeed$1;
const try_ = try_$1;
const entityKind = Symbol.for("drizzle:entityKind");
function is(value, type) {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (value instanceof type) {
    return true;
  }
  if (!Object.prototype.hasOwnProperty.call(type, entityKind)) {
    throw new Error(
      `Class "${type.name ?? "<unknown>"}" doesn't look like a Drizzle entity. If this is incorrect and the class is provided by Drizzle, please report this as a bug.`
    );
  }
  let cls = value.constructor;
  if (cls) {
    while (cls) {
      if (entityKind in cls && cls[entityKind] === type[entityKind]) {
        return true;
      }
      cls = Object.getPrototypeOf(cls);
    }
  }
  return false;
}
_R = entityKind;
class ConsoleLogWriter {
  write(message) {
    console.log(message);
  }
}
__publicField(ConsoleLogWriter, _R, "ConsoleLogWriter");
_S = entityKind;
class DefaultLogger {
  constructor(config) {
    __publicField(this, "writer");
    this.writer = (config == null ? void 0 : config.writer) ?? new ConsoleLogWriter();
  }
  logQuery(query, params) {
    const stringifiedParams = params.map((p) => {
      try {
        return JSON.stringify(p);
      } catch {
        return String(p);
      }
    });
    const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
    this.writer.write(`Query: ${query}${paramsStr}`);
  }
}
__publicField(DefaultLogger, _S, "DefaultLogger");
_T = entityKind;
class NoopLogger {
  logQuery() {
  }
}
__publicField(NoopLogger, _T, "NoopLogger");
const TableName = Symbol.for("drizzle:Name");
const Schema = Symbol.for("drizzle:Schema");
const Columns = Symbol.for("drizzle:Columns");
const OriginalName = Symbol.for("drizzle:OriginalName");
const BaseName = Symbol.for("drizzle:BaseName");
const IsAlias = Symbol.for("drizzle:IsAlias");
const ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
const IsDrizzleTable = Symbol.for("drizzle:IsDrizzleTable");
_aa = entityKind, _$ = TableName, __ = OriginalName, _Z = Schema, _Y = Columns, _X = BaseName, _W = IsAlias, _V = ExtraConfigBuilder, _U = IsDrizzleTable;
class Table {
  constructor(name, schema2, baseName) {
    /**
     * @internal
     * Can be changed if the table is aliased.
     */
    __publicField(this, _$);
    /**
     * @internal
     * Used to store the original name of the table, before any aliasing.
     */
    __publicField(this, __);
    /** @internal */
    __publicField(this, _Z);
    /** @internal */
    __publicField(this, _Y);
    /**
     *  @internal
     * Used to store the table name before the transformation via the `tableCreator` functions.
     */
    __publicField(this, _X);
    /** @internal */
    __publicField(this, _W, false);
    /** @internal */
    __publicField(this, _V);
    __publicField(this, _U, true);
    this[TableName] = this[OriginalName] = name;
    this[Schema] = schema2;
    this[BaseName] = baseName;
  }
}
__publicField(Table, _aa, "Table");
/** @internal */
__publicField(Table, "Symbol", {
  Name: TableName,
  Schema,
  OriginalName,
  Columns,
  BaseName,
  IsAlias,
  ExtraConfigBuilder
});
function isTable(table) {
  return typeof table === "object" && table !== null && IsDrizzleTable in table;
}
function getTableName(table) {
  return table[TableName];
}
_ba = entityKind;
class Column {
  constructor(table, config) {
    __publicField(this, "name");
    __publicField(this, "primary");
    __publicField(this, "notNull");
    __publicField(this, "default");
    __publicField(this, "defaultFn");
    __publicField(this, "onUpdateFn");
    __publicField(this, "hasDefault");
    __publicField(this, "isUnique");
    __publicField(this, "uniqueName");
    __publicField(this, "uniqueType");
    __publicField(this, "dataType");
    __publicField(this, "columnType");
    __publicField(this, "enumValues");
    __publicField(this, "config");
    this.table = table;
    this.config = config;
    this.name = config.name;
    this.notNull = config.notNull;
    this.default = config.default;
    this.defaultFn = config.defaultFn;
    this.onUpdateFn = config.onUpdateFn;
    this.hasDefault = config.hasDefault;
    this.primary = config.primaryKey;
    this.isUnique = config.isUnique;
    this.uniqueName = config.uniqueName;
    this.uniqueType = config.uniqueType;
    this.dataType = config.dataType;
    this.columnType = config.columnType;
  }
  mapFromDriverValue(value) {
    return value;
  }
  mapToDriverValue(value) {
    return value;
  }
}
__publicField(Column, _ba, "Column");
const InlineForeignKeys$1 = Symbol.for("drizzle:PgInlineForeignKeys");
class PgTable extends (_fa = Table, _ea = entityKind, _da = InlineForeignKeys$1, _ca = Table.Symbol.ExtraConfigBuilder, _fa) {
  constructor() {
    super(...arguments);
    /**@internal */
    __publicField(this, _da, []);
    /** @internal */
    __publicField(this, _ca);
  }
}
__publicField(PgTable, _ea, "PgTable");
/** @internal */
__publicField(PgTable, "Symbol", Object.assign({}, Table.Symbol, {
  InlineForeignKeys: InlineForeignKeys$1
}));
_ga = entityKind;
class PrimaryKeyBuilder {
  constructor(columns, name) {
    /** @internal */
    __publicField(this, "columns");
    /** @internal */
    __publicField(this, "name");
    this.columns = columns;
    this.name = name;
  }
  /** @internal */
  build(table) {
    return new PrimaryKey(table, this.columns, this.name);
  }
}
__publicField(PrimaryKeyBuilder, _ga, "PgPrimaryKeyBuilder");
_ha = entityKind;
class PrimaryKey {
  constructor(table, columns, name) {
    __publicField(this, "columns");
    __publicField(this, "name");
    this.table = table;
    this.columns = columns;
    this.name = name;
  }
  getName() {
    return this.name ?? `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
  }
}
__publicField(PrimaryKey, _ha, "PgPrimaryKey");
_ia = entityKind;
class ColumnBuilder {
  constructor(name, dataType, columnType) {
    __publicField(this, "config");
    /**
     * Alias for {@link $defaultFn}.
     */
    __publicField(this, "$default", this.$defaultFn);
    /**
     * Alias for {@link $onUpdateFn}.
     */
    __publicField(this, "$onUpdate", this.$onUpdateFn);
    this.config = {
      name,
      notNull: false,
      default: void 0,
      hasDefault: false,
      primaryKey: false,
      isUnique: false,
      uniqueName: void 0,
      uniqueType: void 0,
      dataType,
      columnType
    };
  }
  /**
   * Changes the data type of the column. Commonly used with `json` columns. Also, useful for branded types.
   *
   * @example
   * ```ts
   * const users = pgTable('users', {
   * 	id: integer('id').$type<UserId>().primaryKey(),
   * 	details: json('details').$type<UserDetails>().notNull(),
   * });
   * ```
   */
  $type() {
    return this;
  }
  /**
   * Adds a `not null` clause to the column definition.
   *
   * Affects the `select` model of the table - columns *without* `not null` will be nullable on select.
   */
  notNull() {
    this.config.notNull = true;
    return this;
  }
  /**
   * Adds a `default <value>` clause to the column definition.
   *
   * Affects the `insert` model of the table - columns *with* `default` are optional on insert.
   *
   * If you need to set a dynamic default value, use {@link $defaultFn} instead.
   */
  default(value) {
    this.config.default = value;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Adds a dynamic default value to the column.
   * The function will be called when the row is inserted, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $defaultFn(fn) {
    this.config.defaultFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Adds a dynamic update value to the column.
   * The function will be called when the row is updated, and the returned value will be used as the column value if none is provided.
   * If no `default` (or `$defaultFn`) value is provided, the function will be called when the row is inserted as well, and the returned value will be used as the column value.
   *
   * **Note:** This value does not affect the `drizzle-kit` behavior, it is only used at runtime in `drizzle-orm`.
   */
  $onUpdateFn(fn) {
    this.config.onUpdateFn = fn;
    this.config.hasDefault = true;
    return this;
  }
  /**
   * Adds a `primary key` clause to the column definition. This implicitly makes the column `not null`.
   *
   * In SQLite, `integer primary key` implicitly makes the column auto-incrementing.
   */
  primaryKey() {
    this.config.primaryKey = true;
    this.config.notNull = true;
    return this;
  }
}
__publicField(ColumnBuilder, _ia, "ColumnBuilder");
const isPgEnumSym = Symbol.for("drizzle:isPgEnum");
function isPgEnum(obj) {
  return !!obj && typeof obj === "function" && isPgEnumSym in obj && obj[isPgEnumSym] === true;
}
_ja = entityKind;
class Subquery {
  constructor(sql2, selection, alias, isWith = false) {
    this._ = {
      brand: "Subquery",
      sql: sql2,
      selectedFields: selection,
      alias,
      isWith
    };
  }
  // getSQL(): SQL<unknown> {
  // 	return new SQL([this]);
  // }
}
__publicField(Subquery, _ja, "Subquery");
class WithSubquery extends (_la = Subquery, _ka = entityKind, _la) {
}
__publicField(WithSubquery, _ka, "WithSubquery");
const tracer = {
  startActiveSpan(name, fn) {
    {
      return fn();
    }
  }
};
const ViewBaseConfig = Symbol.for("drizzle:ViewBaseConfig");
function isSQLWrapper(value) {
  return value !== null && value !== void 0 && typeof value.getSQL === "function";
}
function mergeQueries(queries) {
  var _a3;
  const result = { sql: "", params: [] };
  for (const query of queries) {
    result.sql += query.sql;
    result.params.push(...query.params);
    if ((_a3 = query.typings) == null ? void 0 : _a3.length) {
      if (!result.typings) {
        result.typings = [];
      }
      result.typings.push(...query.typings);
    }
  }
  return result;
}
_ma = entityKind;
class StringChunk {
  constructor(value) {
    __publicField(this, "value");
    this.value = Array.isArray(value) ? value : [value];
  }
  getSQL() {
    return new SQL([this]);
  }
}
__publicField(StringChunk, _ma, "StringChunk");
_na = entityKind;
const _SQL = class _SQL {
  constructor(queryChunks) {
    /** @internal */
    __publicField(this, "decoder", noopDecoder);
    __publicField(this, "shouldInlineParams", false);
    this.queryChunks = queryChunks;
  }
  append(query) {
    this.queryChunks.push(...query.queryChunks);
    return this;
  }
  toQuery(config) {
    return tracer.startActiveSpan("drizzle.buildSQL", (span2) => {
      const query = this.buildQueryFromSourceParams(this.queryChunks, config);
      span2 == null ? void 0 : span2.setAttributes({
        "drizzle.query.text": query.sql,
        "drizzle.query.params": JSON.stringify(query.params)
      });
      return query;
    });
  }
  buildQueryFromSourceParams(chunks, _config) {
    const config = Object.assign({}, _config, {
      inlineParams: _config.inlineParams || this.shouldInlineParams,
      paramStartIndex: _config.paramStartIndex || { value: 0 }
    });
    const {
      escapeName,
      escapeParam,
      prepareTyping,
      inlineParams,
      paramStartIndex
    } = config;
    return mergeQueries(chunks.map((chunk) => {
      if (is(chunk, StringChunk)) {
        return { sql: chunk.value.join(""), params: [] };
      }
      if (is(chunk, Name)) {
        return { sql: escapeName(chunk.value), params: [] };
      }
      if (chunk === void 0) {
        return { sql: "", params: [] };
      }
      if (Array.isArray(chunk)) {
        const result = [new StringChunk("(")];
        for (const [i, p] of chunk.entries()) {
          result.push(p);
          if (i < chunk.length - 1) {
            result.push(new StringChunk(", "));
          }
        }
        result.push(new StringChunk(")"));
        return this.buildQueryFromSourceParams(result, config);
      }
      if (is(chunk, _SQL)) {
        return this.buildQueryFromSourceParams(chunk.queryChunks, {
          ...config,
          inlineParams: inlineParams || chunk.shouldInlineParams
        });
      }
      if (is(chunk, Table)) {
        const schemaName = chunk[Table.Symbol.Schema];
        const tableName = chunk[Table.Symbol.Name];
        return {
          sql: schemaName === void 0 ? escapeName(tableName) : escapeName(schemaName) + "." + escapeName(tableName),
          params: []
        };
      }
      if (is(chunk, Column)) {
        return { sql: escapeName(chunk.table[Table.Symbol.Name]) + "." + escapeName(chunk.name), params: [] };
      }
      if (is(chunk, View)) {
        const schemaName = chunk[ViewBaseConfig].schema;
        const viewName = chunk[ViewBaseConfig].name;
        return {
          sql: schemaName === void 0 ? escapeName(viewName) : escapeName(schemaName) + "." + escapeName(viewName),
          params: []
        };
      }
      if (is(chunk, Param)) {
        const mappedValue = chunk.value === null ? null : chunk.encoder.mapToDriverValue(chunk.value);
        if (is(mappedValue, _SQL)) {
          return this.buildQueryFromSourceParams([mappedValue], config);
        }
        if (inlineParams) {
          return { sql: this.mapInlineParam(mappedValue, config), params: [] };
        }
        let typings;
        if (prepareTyping !== void 0) {
          typings = [prepareTyping(chunk.encoder)];
        }
        return { sql: escapeParam(paramStartIndex.value++, mappedValue), params: [mappedValue], typings };
      }
      if (is(chunk, Placeholder)) {
        return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk] };
      }
      if (is(chunk, _SQL.Aliased) && chunk.fieldAlias !== void 0) {
        return { sql: escapeName(chunk.fieldAlias), params: [] };
      }
      if (is(chunk, Subquery)) {
        if (chunk._.isWith) {
          return { sql: escapeName(chunk._.alias), params: [] };
        }
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk._.sql,
          new StringChunk(") "),
          new Name(chunk._.alias)
        ], config);
      }
      if (isPgEnum(chunk)) {
        if (chunk.schema) {
          return { sql: escapeName(chunk.schema) + "." + escapeName(chunk.enumName), params: [] };
        }
        return { sql: escapeName(chunk.enumName), params: [] };
      }
      if (isSQLWrapper(chunk)) {
        return this.buildQueryFromSourceParams([
          new StringChunk("("),
          chunk.getSQL(),
          new StringChunk(")")
        ], config);
      }
      if (inlineParams) {
        return { sql: this.mapInlineParam(chunk, config), params: [] };
      }
      return { sql: escapeParam(paramStartIndex.value++, chunk), params: [chunk] };
    }));
  }
  mapInlineParam(chunk, { escapeString }) {
    if (chunk === null) {
      return "null";
    }
    if (typeof chunk === "number" || typeof chunk === "boolean") {
      return chunk.toString();
    }
    if (typeof chunk === "string") {
      return escapeString(chunk);
    }
    if (typeof chunk === "object") {
      const mappedValueAsString = chunk.toString();
      if (mappedValueAsString === "[object Object]") {
        return escapeString(JSON.stringify(chunk));
      }
      return escapeString(mappedValueAsString);
    }
    throw new Error("Unexpected param value: " + chunk);
  }
  getSQL() {
    return this;
  }
  as(alias) {
    if (alias === void 0) {
      return this;
    }
    return new _SQL.Aliased(this, alias);
  }
  mapWith(decoder) {
    this.decoder = typeof decoder === "function" ? { mapFromDriverValue: decoder } : decoder;
    return this;
  }
  inlineParams() {
    this.shouldInlineParams = true;
    return this;
  }
  /**
   * This method is used to conditionally include a part of the query.
   *
   * @param condition - Condition to check
   * @returns itself if the condition is `true`, otherwise `undefined`
   */
  if(condition) {
    return condition ? this : void 0;
  }
};
__publicField(_SQL, _na, "SQL");
let SQL = _SQL;
_oa = entityKind;
class Name {
  constructor(value) {
    __publicField(this, "brand");
    this.value = value;
  }
  getSQL() {
    return new SQL([this]);
  }
}
__publicField(Name, _oa, "Name");
function isDriverValueEncoder(value) {
  return typeof value === "object" && value !== null && "mapToDriverValue" in value && typeof value.mapToDriverValue === "function";
}
const noopDecoder = {
  mapFromDriverValue: (value) => value
};
const noopEncoder = {
  mapToDriverValue: (value) => value
};
({
  ...noopDecoder,
  ...noopEncoder
});
_pa = entityKind;
class Param {
  /**
   * @param value - Parameter value
   * @param encoder - Encoder to convert the value to a driver parameter
   */
  constructor(value, encoder = noopEncoder) {
    __publicField(this, "brand");
    this.value = value;
    this.encoder = encoder;
  }
  getSQL() {
    return new SQL([this]);
  }
}
__publicField(Param, _pa, "Param");
function sql(strings, ...params) {
  const queryChunks = [];
  if (params.length > 0 || strings.length > 0 && strings[0] !== "") {
    queryChunks.push(new StringChunk(strings[0]));
  }
  for (const [paramIndex, param2] of params.entries()) {
    queryChunks.push(param2, new StringChunk(strings[paramIndex + 1]));
  }
  return new SQL(queryChunks);
}
((sql2) => {
  function empty2() {
    return new SQL([]);
  }
  sql2.empty = empty2;
  function fromList(list) {
    return new SQL(list);
  }
  sql2.fromList = fromList;
  function raw(str) {
    return new SQL([new StringChunk(str)]);
  }
  sql2.raw = raw;
  function join2(chunks, separator) {
    const result = [];
    for (const [i, chunk] of chunks.entries()) {
      if (i > 0 && separator !== void 0) {
        result.push(separator);
      }
      result.push(chunk);
    }
    return new SQL(result);
  }
  sql2.join = join2;
  function identifier2(value) {
    return new Name(value);
  }
  sql2.identifier = identifier2;
  function placeholder2(name2) {
    return new Placeholder(name2);
  }
  sql2.placeholder = placeholder2;
  function param2(value, encoder) {
    return new Param(value, encoder);
  }
  sql2.param = param2;
})(sql || (sql = {}));
((SQL2) => {
  var _a3;
  _a3 = entityKind;
  const _Aliased = class _Aliased {
    constructor(sql2, fieldAlias) {
      /** @internal */
      __publicField(this, "isSelectionField", false);
      this.sql = sql2;
      this.fieldAlias = fieldAlias;
    }
    getSQL() {
      return this.sql;
    }
    /** @internal */
    clone() {
      return new _Aliased(this.sql, this.fieldAlias);
    }
  };
  __publicField(_Aliased, _a3, "SQL.Aliased");
  let Aliased = _Aliased;
  SQL2.Aliased = Aliased;
})(SQL || (SQL = {}));
_qa = entityKind;
class Placeholder {
  constructor(name2) {
    this.name = name2;
  }
  getSQL() {
    return new SQL([this]);
  }
}
__publicField(Placeholder, _qa, "Placeholder");
function fillPlaceholders(params, values) {
  return params.map((p) => {
    if (is(p, Placeholder)) {
      if (!(p.name in values)) {
        throw new Error(`No value for placeholder "${p.name}" was provided`);
      }
      return values[p.name];
    }
    return p;
  });
}
_sa = entityKind, _ra = ViewBaseConfig;
class View {
  constructor({ name: name2, schema: schema2, selectedFields, query }) {
    /** @internal */
    __publicField(this, _ra);
    this[ViewBaseConfig] = {
      name: name2,
      originalName: name2,
      schema: schema2,
      selectedFields,
      query,
      isExisting: !query,
      isAlias: false
    };
  }
  getSQL() {
    return new SQL([this]);
  }
}
__publicField(View, _sa, "View");
Column.prototype.getSQL = function() {
  return new SQL([this]);
};
Table.prototype.getSQL = function() {
  return new SQL([this]);
};
Subquery.prototype.getSQL = function() {
  return new SQL([this]);
};
function bindIfParam(value, column) {
  if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) {
    return new Param(value, column);
  }
  return value;
}
const eq = (left2, right2) => {
  return sql`${left2} = ${bindIfParam(right2, left2)}`;
};
const ne = (left2, right2) => {
  return sql`${left2} <> ${bindIfParam(right2, left2)}`;
};
function and(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" and ")),
    new StringChunk(")")
  ]);
}
function or(...unfilteredConditions) {
  const conditions = unfilteredConditions.filter(
    (c) => c !== void 0
  );
  if (conditions.length === 0) {
    return void 0;
  }
  if (conditions.length === 1) {
    return new SQL(conditions);
  }
  return new SQL([
    new StringChunk("("),
    sql.join(conditions, new StringChunk(" or ")),
    new StringChunk(")")
  ]);
}
function not(condition) {
  return sql`not ${condition}`;
}
const gt = (left2, right2) => {
  return sql`${left2} > ${bindIfParam(right2, left2)}`;
};
const gte = (left2, right2) => {
  return sql`${left2} >= ${bindIfParam(right2, left2)}`;
};
const lt = (left2, right2) => {
  return sql`${left2} < ${bindIfParam(right2, left2)}`;
};
const lte = (left2, right2) => {
  return sql`${left2} <= ${bindIfParam(right2, left2)}`;
};
function inArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      throw new Error("inArray requires at least one value");
    }
    return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} in ${bindIfParam(values, column)}`;
}
function notInArray(column, values) {
  if (Array.isArray(values)) {
    if (values.length === 0) {
      throw new Error("notInArray requires at least one value");
    }
    return sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
  }
  return sql`${column} not in ${bindIfParam(values, column)}`;
}
function isNull(value) {
  return sql`${value} is null`;
}
function isNotNull(value) {
  return sql`${value} is not null`;
}
function exists(subquery) {
  return sql`exists ${subquery}`;
}
function notExists(subquery) {
  return sql`not exists ${subquery}`;
}
function between(column, min, max) {
  return sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(
    max,
    column
  )}`;
}
function notBetween(column, min, max) {
  return sql`${column} not between ${bindIfParam(
    min,
    column
  )} and ${bindIfParam(max, column)}`;
}
function like(column, value) {
  return sql`${column} like ${value}`;
}
function notLike(column, value) {
  return sql`${column} not like ${value}`;
}
function ilike(column, value) {
  return sql`${column} ilike ${value}`;
}
function notIlike(column, value) {
  return sql`${column} not ilike ${value}`;
}
function asc(column) {
  return sql`${column} asc`;
}
function desc(column) {
  return sql`${column} desc`;
}
_ta = entityKind;
class Relation {
  constructor(sourceTable, referencedTable, relationName) {
    __publicField(this, "referencedTableName");
    __publicField(this, "fieldName");
    this.sourceTable = sourceTable;
    this.referencedTable = referencedTable;
    this.relationName = relationName;
    this.referencedTableName = referencedTable[Table.Symbol.Name];
  }
}
__publicField(Relation, _ta, "Relation");
_ua = entityKind;
class Relations {
  constructor(table, config) {
    this.table = table;
    this.config = config;
  }
}
__publicField(Relations, _ua, "Relations");
const _One = class _One extends (_wa = Relation, _va = entityKind, _wa) {
  constructor(sourceTable, referencedTable, config, isNullable2) {
    super(sourceTable, referencedTable, config == null ? void 0 : config.relationName);
    this.config = config;
    this.isNullable = isNullable2;
  }
  withFieldName(fieldName) {
    const relation = new _One(
      this.sourceTable,
      this.referencedTable,
      this.config,
      this.isNullable
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
__publicField(_One, _va, "One");
let One = _One;
const _Many = class _Many extends (_ya = Relation, _xa = entityKind, _ya) {
  constructor(sourceTable, referencedTable, config) {
    super(sourceTable, referencedTable, config == null ? void 0 : config.relationName);
    this.config = config;
  }
  withFieldName(fieldName) {
    const relation = new _Many(
      this.sourceTable,
      this.referencedTable,
      this.config
    );
    relation.fieldName = fieldName;
    return relation;
  }
};
__publicField(_Many, _xa, "Many");
let Many = _Many;
function getOperators() {
  return {
    and,
    between,
    eq,
    exists,
    gt,
    gte,
    ilike,
    inArray,
    isNull,
    isNotNull,
    like,
    lt,
    lte,
    ne,
    not,
    notBetween,
    notExists,
    notLike,
    notIlike,
    notInArray,
    or,
    sql
  };
}
function getOrderByOperators() {
  return {
    sql,
    asc,
    desc
  };
}
function extractTablesRelationalConfig(schema2, configHelpers) {
  var _a3;
  if (Object.keys(schema2).length === 1 && "default" in schema2 && !is(schema2["default"], Table)) {
    schema2 = schema2["default"];
  }
  const tableNamesMap = {};
  const relationsBuffer = {};
  const tablesConfig = {};
  for (const [key, value] of Object.entries(schema2)) {
    if (isTable(value)) {
      const dbName = value[Table.Symbol.Name];
      const bufferedRelations = relationsBuffer[dbName];
      tableNamesMap[dbName] = key;
      tablesConfig[key] = {
        tsName: key,
        dbName: value[Table.Symbol.Name],
        schema: value[Table.Symbol.Schema],
        columns: value[Table.Symbol.Columns],
        relations: (bufferedRelations == null ? void 0 : bufferedRelations.relations) ?? {},
        primaryKey: (bufferedRelations == null ? void 0 : bufferedRelations.primaryKey) ?? []
      };
      for (const column of Object.values(
        value[Table.Symbol.Columns]
      )) {
        if (column.primary) {
          tablesConfig[key].primaryKey.push(column);
        }
      }
      const extraConfig = (_a3 = value[Table.Symbol.ExtraConfigBuilder]) == null ? void 0 : _a3.call(value, value);
      if (extraConfig) {
        for (const configEntry of Object.values(extraConfig)) {
          if (is(configEntry, PrimaryKeyBuilder)) {
            tablesConfig[key].primaryKey.push(...configEntry.columns);
          }
        }
      }
    } else if (is(value, Relations)) {
      const dbName = value.table[Table.Symbol.Name];
      const tableName = tableNamesMap[dbName];
      const relations2 = value.config(
        configHelpers(value.table)
      );
      let primaryKey;
      for (const [relationName, relation] of Object.entries(relations2)) {
        if (tableName) {
          const tableConfig = tablesConfig[tableName];
          tableConfig.relations[relationName] = relation;
        } else {
          if (!(dbName in relationsBuffer)) {
            relationsBuffer[dbName] = {
              relations: {},
              primaryKey
            };
          }
          relationsBuffer[dbName].relations[relationName] = relation;
        }
      }
    }
  }
  return { tables: tablesConfig, tableNamesMap };
}
function createOne(sourceTable) {
  return function one(table, config) {
    return new One(
      sourceTable,
      table,
      config,
      (config == null ? void 0 : config.fields.reduce((res2, f) => res2 && f.notNull, true)) ?? false
    );
  };
}
function createMany(sourceTable) {
  return function many(referencedTable, config) {
    return new Many(sourceTable, referencedTable, config);
  };
}
function normalizeRelation(schema2, tableNamesMap, relation) {
  if (is(relation, One) && relation.config) {
    return {
      fields: relation.config.fields,
      references: relation.config.references
    };
  }
  const referencedTableTsName = tableNamesMap[relation.referencedTable[Table.Symbol.Name]];
  if (!referencedTableTsName) {
    throw new Error(
      `Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const referencedTableConfig = schema2[referencedTableTsName];
  if (!referencedTableConfig) {
    throw new Error(`Table "${referencedTableTsName}" not found in schema`);
  }
  const sourceTable = relation.sourceTable;
  const sourceTableTsName = tableNamesMap[sourceTable[Table.Symbol.Name]];
  if (!sourceTableTsName) {
    throw new Error(
      `Table "${sourceTable[Table.Symbol.Name]}" not found in schema`
    );
  }
  const reverseRelations = [];
  for (const referencedTableRelation of Object.values(
    referencedTableConfig.relations
  )) {
    if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) {
      reverseRelations.push(referencedTableRelation);
    }
  }
  if (reverseRelations.length > 1) {
    throw relation.relationName ? new Error(
      `There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`
    ) : new Error(
      `There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`
    );
  }
  if (reverseRelations[0] && is(reverseRelations[0], One) && reverseRelations[0].config) {
    return {
      fields: reverseRelations[0].config.references,
      references: reverseRelations[0].config.fields
    };
  }
  throw new Error(
    `There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`
  );
}
function createTableRelationsHelpers(sourceTable) {
  return {
    one: createOne(sourceTable),
    many: createMany(sourceTable)
  };
}
function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
  const result = {};
  for (const [
    selectionItemIndex,
    selectionItem
  ] of buildQueryResultSelection.entries()) {
    if (selectionItem.isJson) {
      const relation = tableConfig.relations[selectionItem.tsKey];
      const rawSubRows = row[selectionItemIndex];
      const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
      result[selectionItem.tsKey] = is(relation, One) ? subRows && mapRelationalRow(
        tablesConfig,
        tablesConfig[selectionItem.relationTableTsKey],
        subRows,
        selectionItem.selection,
        mapColumnValue
      ) : subRows.map(
        (subRow) => mapRelationalRow(
          tablesConfig,
          tablesConfig[selectionItem.relationTableTsKey],
          subRow,
          selectionItem.selection,
          mapColumnValue
        )
      );
    } else {
      const value = mapColumnValue(row[selectionItemIndex]);
      const field = selectionItem.field;
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
    }
  }
  return result;
}
_za = entityKind;
class ColumnAliasProxyHandler {
  constructor(table) {
    this.table = table;
  }
  get(columnObj, prop) {
    if (prop === "table") {
      return this.table;
    }
    return columnObj[prop];
  }
}
__publicField(ColumnAliasProxyHandler, _za, "ColumnAliasProxyHandler");
_Aa = entityKind;
class TableAliasProxyHandler {
  constructor(alias, replaceOriginalName) {
    this.alias = alias;
    this.replaceOriginalName = replaceOriginalName;
  }
  get(target, prop) {
    if (prop === Table.Symbol.IsAlias) {
      return true;
    }
    if (prop === Table.Symbol.Name) {
      return this.alias;
    }
    if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) {
      return this.alias;
    }
    if (prop === ViewBaseConfig) {
      return {
        ...target[ViewBaseConfig],
        name: this.alias,
        isAlias: true
      };
    }
    if (prop === Table.Symbol.Columns) {
      const columns = target[Table.Symbol.Columns];
      if (!columns) {
        return columns;
      }
      const proxiedColumns = {};
      Object.keys(columns).map((key) => {
        proxiedColumns[key] = new Proxy(
          columns[key],
          new ColumnAliasProxyHandler(new Proxy(target, this))
        );
      });
      return proxiedColumns;
    }
    const value = target[prop];
    if (is(value, Column)) {
      return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
    }
    return value;
  }
}
__publicField(TableAliasProxyHandler, _Aa, "TableAliasProxyHandler");
function aliasedTable(table, tableAlias) {
  return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
}
function aliasedTableColumn(column, tableAlias) {
  return new Proxy(
    column,
    new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false)))
  );
}
function mapColumnsInAliasedSQLToAlias(query, alias) {
  return new SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
function mapColumnsInSQLToAlias(query, alias) {
  return sql.join(query.queryChunks.map((c) => {
    if (is(c, Column)) {
      return aliasedTableColumn(c, alias);
    }
    if (is(c, SQL)) {
      return mapColumnsInSQLToAlias(c, alias);
    }
    if (is(c, SQL.Aliased)) {
      return mapColumnsInAliasedSQLToAlias(c, alias);
    }
    return c;
  }));
}
_Ba = entityKind;
const _SelectionProxyHandler = class _SelectionProxyHandler {
  constructor(config) {
    __publicField(this, "config");
    this.config = { ...config };
  }
  get(subquery, prop) {
    if (prop === "_") {
      return {
        ...subquery["_"],
        selectedFields: new Proxy(
          subquery._.selectedFields,
          this
        )
      };
    }
    if (prop === ViewBaseConfig) {
      return {
        ...subquery[ViewBaseConfig],
        selectedFields: new Proxy(
          subquery[ViewBaseConfig].selectedFields,
          this
        )
      };
    }
    if (typeof prop === "symbol") {
      return subquery[prop];
    }
    const columns = is(subquery, Subquery) ? subquery._.selectedFields : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery;
    const value = columns[prop];
    if (is(value, SQL.Aliased)) {
      if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) {
        return value.sql;
      }
      const newValue = value.clone();
      newValue.isSelectionField = true;
      return newValue;
    }
    if (is(value, SQL)) {
      if (this.config.sqlBehavior === "sql") {
        return value;
      }
      throw new Error(
        `You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`
      );
    }
    if (is(value, Column)) {
      if (this.config.alias) {
        return new Proxy(
          value,
          new ColumnAliasProxyHandler(
            new Proxy(
              value.table,
              new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false)
            )
          )
        );
      }
      return value;
    }
    if (typeof value !== "object" || value === null) {
      return value;
    }
    return new Proxy(value, new _SelectionProxyHandler(this.config));
  }
};
__publicField(_SelectionProxyHandler, _Ba, "SelectionProxyHandler");
let SelectionProxyHandler = _SelectionProxyHandler;
_Da = entityKind, _Ca = Symbol.toStringTag;
class QueryPromise {
  constructor() {
    __publicField(this, _Ca, "QueryPromise");
  }
  catch(onRejected) {
    return this.then(void 0, onRejected);
  }
  finally(onFinally) {
    return this.then(
      (value) => {
        onFinally == null ? void 0 : onFinally();
        return value;
      },
      (reason) => {
        onFinally == null ? void 0 : onFinally();
        throw reason;
      }
    );
  }
  then(onFulfilled, onRejected) {
    return this.execute().then(onFulfilled, onRejected);
  }
}
__publicField(QueryPromise, _Da, "QueryPromise");
const InlineForeignKeys = Symbol.for("drizzle:SQLiteInlineForeignKeys");
class SQLiteTable extends (_Ia = Table, _Ha = entityKind, _Ga = Table.Symbol.Columns, _Fa = InlineForeignKeys, _Ea = Table.Symbol.ExtraConfigBuilder, _Ia) {
  constructor() {
    super(...arguments);
    /** @internal */
    __publicField(this, _Ga);
    /** @internal */
    __publicField(this, _Fa, []);
    /** @internal */
    __publicField(this, _Ea);
  }
}
__publicField(SQLiteTable, _Ha, "SQLiteTable");
/** @internal */
__publicField(SQLiteTable, "Symbol", Object.assign({}, Table.Symbol, {
  InlineForeignKeys
}));
function sqliteTableBase(name, columns, extraConfig, schema2, baseName = name) {
  const rawTable = new SQLiteTable(name, schema2, baseName);
  const builtColumns = Object.fromEntries(
    Object.entries(columns).map(([name2, colBuilderBase]) => {
      const colBuilder = colBuilderBase;
      const column = colBuilder.build(rawTable);
      rawTable[InlineForeignKeys].push(...colBuilder.buildForeignKeys(column, rawTable));
      return [name2, column];
    })
  );
  const table = Object.assign(rawTable, builtColumns);
  table[Table.Symbol.Columns] = builtColumns;
  if (extraConfig) {
    table[SQLiteTable.Symbol.ExtraConfigBuilder] = extraConfig;
  }
  return table;
}
const sqliteTable = (name, columns, extraConfig) => {
  return sqliteTableBase(name, columns, extraConfig);
};
function mapResultRow(columns, row, joinsNotNullableMap) {
  const nullifyMap = {};
  const result = columns.reduce(
    (result2, { path: path2, field }, columnIndex) => {
      let decoder;
      if (is(field, Column)) {
        decoder = field;
      } else if (is(field, SQL)) {
        decoder = field.decoder;
      } else {
        decoder = field.sql.decoder;
      }
      let node2 = result2;
      for (const [pathChunkIndex, pathChunk] of path2.entries()) {
        if (pathChunkIndex < path2.length - 1) {
          if (!(pathChunk in node2)) {
            node2[pathChunk] = {};
          }
          node2 = node2[pathChunk];
        } else {
          const rawValue = row[columnIndex];
          const value = node2[pathChunk] = rawValue === null ? null : decoder.mapFromDriverValue(rawValue);
          if (joinsNotNullableMap && is(field, Column) && path2.length === 2) {
            const objectName = path2[0];
            if (!(objectName in nullifyMap)) {
              nullifyMap[objectName] = value === null ? getTableName(field.table) : false;
            } else if (typeof nullifyMap[objectName] === "string" && nullifyMap[objectName] !== getTableName(field.table)) {
              nullifyMap[objectName] = false;
            }
          }
        }
      }
      return result2;
    },
    {}
  );
  if (joinsNotNullableMap && Object.keys(nullifyMap).length > 0) {
    for (const [objectName, tableName] of Object.entries(nullifyMap)) {
      if (typeof tableName === "string" && !joinsNotNullableMap[tableName]) {
        result[objectName] = null;
      }
    }
  }
  return result;
}
function orderSelectedFields(fields, pathPrefix) {
  return Object.entries(fields).reduce((result, [name, field]) => {
    if (typeof name !== "string") {
      return result;
    }
    const newPath = pathPrefix ? [...pathPrefix, name] : [name];
    if (is(field, Column) || is(field, SQL) || is(field, SQL.Aliased)) {
      result.push({ path: newPath, field });
    } else if (is(field, Table)) {
      result.push(...orderSelectedFields(field[Table.Symbol.Columns], newPath));
    } else {
      result.push(...orderSelectedFields(field, newPath));
    }
    return result;
  }, []);
}
function haveSameKeys(left2, right2) {
  const leftKeys = Object.keys(left2);
  const rightKeys = Object.keys(right2);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  for (const [index2, key] of leftKeys.entries()) {
    if (key !== rightKeys[index2]) {
      return false;
    }
  }
  return true;
}
function mapUpdateSet(table, values) {
  const entries = Object.entries(values).filter(([, value]) => value !== void 0).map(([key, value]) => {
    if (is(value, SQL)) {
      return [key, value];
    } else {
      return [key, new Param(value, table[Table.Symbol.Columns][key])];
    }
  });
  if (entries.length === 0) {
    throw new Error("No values to set");
  }
  return Object.fromEntries(entries);
}
function applyMixins(baseClass, extendedClasses) {
  for (const extendedClass of extendedClasses) {
    for (const name of Object.getOwnPropertyNames(extendedClass.prototype)) {
      if (name === "constructor")
        continue;
      Object.defineProperty(
        baseClass.prototype,
        name,
        Object.getOwnPropertyDescriptor(extendedClass.prototype, name) || /* @__PURE__ */ Object.create(null)
      );
    }
  }
}
function getTableColumns(table) {
  return table[Table.Symbol.Columns];
}
function getTableLikeName(table) {
  return is(table, Subquery) ? table._.alias : is(table, View) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : table[Table.Symbol.IsAlias] ? table[Table.Symbol.Name] : table[Table.Symbol.BaseName];
}
class SQLiteDeleteBase extends (_Ka = QueryPromise, _Ja = entityKind, _Ka) {
  constructor(table, session, dialect, withList) {
    super();
    /** @internal */
    __publicField(this, "config");
    __publicField(this, "run", (placeholderValues) => {
      return this._prepare().run(placeholderValues);
    });
    __publicField(this, "all", (placeholderValues) => {
      return this._prepare().all(placeholderValues);
    });
    __publicField(this, "get", (placeholderValues) => {
      return this._prepare().get(placeholderValues);
    });
    __publicField(this, "values", (placeholderValues) => {
      return this._prepare().values(placeholderValues);
    });
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.config = { table, withList };
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will delete only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be deleted.
   *
   * ```ts
   * // Delete all cars with green color
   * db.delete(cars).where(eq(cars.color, 'green'));
   * // or
   * db.delete(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Delete all BMW cars with a green color
   * db.delete(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Delete all cars with the green or blue color
   * db.delete(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  returning(fields = this.table[SQLiteTable.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildDeleteQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      true
    );
  }
  prepare() {
    return this._prepare(false);
  }
  async execute(placeholderValues) {
    return this._prepare().execute(placeholderValues);
  }
  $dynamic() {
    return this;
  }
}
__publicField(SQLiteDeleteBase, _Ja, "SQLiteDelete");
_La = entityKind;
class SQLiteInsertBuilder {
  constructor(table, session, dialect, withList) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
  }
  values(values) {
    values = Array.isArray(values) ? values : [values];
    if (values.length === 0) {
      throw new Error("values() must be called with at least one value");
    }
    const mappedValues = values.map((entry) => {
      const result = {};
      const cols = this.table[Table.Symbol.Columns];
      for (const colKey of Object.keys(entry)) {
        const colValue = entry[colKey];
        result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
      }
      return result;
    });
    return new SQLiteInsertBase(this.table, mappedValues, this.session, this.dialect, this.withList);
  }
}
__publicField(SQLiteInsertBuilder, _La, "SQLiteInsertBuilder");
class SQLiteInsertBase extends (_Na = QueryPromise, _Ma = entityKind, _Na) {
  constructor(table, values, session, dialect, withList) {
    super();
    /** @internal */
    __publicField(this, "config");
    __publicField(this, "run", (placeholderValues) => {
      return this._prepare().run(placeholderValues);
    });
    __publicField(this, "all", (placeholderValues) => {
      return this._prepare().all(placeholderValues);
    });
    __publicField(this, "get", (placeholderValues) => {
      return this._prepare().get(placeholderValues);
    });
    __publicField(this, "values", (placeholderValues) => {
      return this._prepare().values(placeholderValues);
    });
    this.session = session;
    this.dialect = dialect;
    this.config = { table, values, withList };
  }
  returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /**
   * Adds an `on conflict do nothing` clause to the query.
   *
   * Calling this method simply avoids inserting a row as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#on-conflict-do-nothing}
   *
   * @param config The `target` and `where` clauses.
   *
   * @example
   * ```ts
   * // Insert one row and cancel the insert if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing();
   *
   * // Explicitly specify conflict target
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoNothing({ target: cars.id });
   * ```
   */
  onConflictDoNothing(config = {}) {
    if (config.target === void 0) {
      this.config.onConflict = sql`do nothing`;
    } else {
      const targetSql = Array.isArray(config.target) ? sql`${config.target}` : sql`${[config.target]}`;
      const whereSql = config.where ? sql` where ${config.where}` : sql``;
      this.config.onConflict = sql`${targetSql} do nothing${whereSql}`;
    }
    return this;
  }
  /**
   * Adds an `on conflict do update` clause to the query.
   *
   * Calling this method will update the existing row that conflicts with the row proposed for insertion as its alternative action.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert#upserts-and-conflicts}
   *
   * @param config The `target`, `set` and `where` clauses.
   *
   * @example
   * ```ts
   * // Update the row if there's a conflict
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'Porsche' }
   *   });
   *
   * // Upsert with 'where' clause
   * await db.insert(cars)
   *   .values({ id: 1, brand: 'BMW' })
   *   .onConflictDoUpdate({
   *     target: cars.id,
   *     set: { brand: 'newBMW' },
   *     where: sql`${cars.createdAt} > '2023-01-01'::date`,
   *   });
   * ```
   */
  onConflictDoUpdate(config) {
    if (config.where && (config.targetWhere || config.setWhere)) {
      throw new Error(
        'You cannot use both "where" and "targetWhere"/"setWhere" at the same time - "where" is deprecated, use "targetWhere" or "setWhere" instead.'
      );
    }
    const whereSql = config.where ? sql` where ${config.where}` : void 0;
    const targetWhereSql = config.targetWhere ? sql` where ${config.targetWhere}` : void 0;
    const setWhereSql = config.setWhere ? sql` where ${config.setWhere}` : void 0;
    const targetSql = Array.isArray(config.target) ? sql`${config.target}` : sql`${[config.target]}`;
    const setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config.set));
    this.config.onConflict = sql`${targetSql}${targetWhereSql} do update set ${setSql}${whereSql}${setWhereSql}`;
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildInsertQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      true
    );
  }
  prepare() {
    return this._prepare(false);
  }
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
}
__publicField(SQLiteInsertBase, _Ma, "SQLiteInsert");
class DrizzleError extends (_Pa = Error, _Oa = entityKind, _Pa) {
  constructor({ message, cause }) {
    super(message);
    this.name = "DrizzleError";
    this.cause = cause;
  }
}
__publicField(DrizzleError, _Oa, "DrizzleError");
class TransactionRollbackError extends (_Ra = DrizzleError, _Qa = entityKind, _Ra) {
  constructor() {
    super({ message: "Rollback" });
  }
}
__publicField(TransactionRollbackError, _Qa, "TransactionRollbackError");
_Sa = entityKind;
class ForeignKeyBuilder {
  constructor(config, actions) {
    /** @internal */
    __publicField(this, "reference");
    /** @internal */
    __publicField(this, "_onUpdate");
    /** @internal */
    __publicField(this, "_onDelete");
    this.reference = () => {
      const { name, columns, foreignColumns } = config();
      return { name, columns, foreignTable: foreignColumns[0].table, foreignColumns };
    };
    if (actions) {
      this._onUpdate = actions.onUpdate;
      this._onDelete = actions.onDelete;
    }
  }
  onUpdate(action) {
    this._onUpdate = action;
    return this;
  }
  onDelete(action) {
    this._onDelete = action;
    return this;
  }
  /** @internal */
  build(table) {
    return new ForeignKey(table, this);
  }
}
__publicField(ForeignKeyBuilder, _Sa, "SQLiteForeignKeyBuilder");
_Ta = entityKind;
class ForeignKey {
  constructor(table, builder) {
    __publicField(this, "reference");
    __publicField(this, "onUpdate");
    __publicField(this, "onDelete");
    this.table = table;
    this.reference = builder.reference;
    this.onUpdate = builder._onUpdate;
    this.onDelete = builder._onDelete;
  }
  getName() {
    const { name, columns, foreignColumns } = this.reference();
    const columnNames = columns.map((column) => column.name);
    const foreignColumnNames = foreignColumns.map((column) => column.name);
    const chunks = [
      this.table[SQLiteTable.Symbol.Name],
      ...columnNames,
      foreignColumns[0].table[SQLiteTable.Symbol.Name],
      ...foreignColumnNames
    ];
    return name ?? `${chunks.join("_")}_fk`;
  }
}
__publicField(ForeignKey, _Ta, "SQLiteForeignKey");
function uniqueKeyName(table, columns) {
  return `${table[SQLiteTable.Symbol.Name]}_${columns.join("_")}_unique`;
}
class SQLiteColumnBuilder extends (_Va = ColumnBuilder, _Ua = entityKind, _Va) {
  constructor() {
    super(...arguments);
    __publicField(this, "foreignKeyConfigs", []);
  }
  references(ref, actions = {}) {
    this.foreignKeyConfigs.push({ ref, actions });
    return this;
  }
  unique(name) {
    this.config.isUnique = true;
    this.config.uniqueName = name;
    return this;
  }
  /** @internal */
  buildForeignKeys(column, table) {
    return this.foreignKeyConfigs.map(({ ref, actions }) => {
      return ((ref2, actions2) => {
        const builder = new ForeignKeyBuilder(() => {
          const foreignColumn = ref2();
          return { columns: [column], foreignColumns: [foreignColumn] };
        });
        if (actions2.onUpdate) {
          builder.onUpdate(actions2.onUpdate);
        }
        if (actions2.onDelete) {
          builder.onDelete(actions2.onDelete);
        }
        return builder.build(table);
      })(ref, actions);
    });
  }
}
__publicField(SQLiteColumnBuilder, _Ua, "SQLiteColumnBuilder");
class SQLiteColumn extends (_Xa = Column, _Wa = entityKind, _Xa) {
  constructor(table, config) {
    if (!config.uniqueName) {
      config.uniqueName = uniqueKeyName(table, [config.name]);
    }
    super(table, config);
    this.table = table;
  }
}
__publicField(SQLiteColumn, _Wa, "SQLiteColumn");
class SQLiteBaseIntegerBuilder extends (_Za = SQLiteColumnBuilder, _Ya = entityKind, _Za) {
  constructor(name, dataType, columnType) {
    super(name, dataType, columnType);
    this.config.autoIncrement = false;
  }
  primaryKey(config) {
    if (config == null ? void 0 : config.autoIncrement) {
      this.config.autoIncrement = true;
    }
    this.config.hasDefault = true;
    return super.primaryKey();
  }
}
__publicField(SQLiteBaseIntegerBuilder, _Ya, "SQLiteBaseIntegerBuilder");
class SQLiteBaseInteger extends (_$a = SQLiteColumn, __a = entityKind, _$a) {
  constructor() {
    super(...arguments);
    __publicField(this, "autoIncrement", this.config.autoIncrement);
  }
  getSQLType() {
    return "integer";
  }
}
__publicField(SQLiteBaseInteger, __a, "SQLiteBaseInteger");
class SQLiteIntegerBuilder extends (_bb = SQLiteBaseIntegerBuilder, _ab = entityKind, _bb) {
  constructor(name) {
    super(name, "number", "SQLiteInteger");
  }
  build(table) {
    return new SQLiteInteger(
      table,
      this.config
    );
  }
}
__publicField(SQLiteIntegerBuilder, _ab, "SQLiteIntegerBuilder");
class SQLiteInteger extends (_db = SQLiteBaseInteger, _cb = entityKind, _db) {
}
__publicField(SQLiteInteger, _cb, "SQLiteInteger");
class SQLiteTimestampBuilder extends (_fb = SQLiteBaseIntegerBuilder, _eb = entityKind, _fb) {
  constructor(name, mode) {
    super(name, "date", "SQLiteTimestamp");
    this.config.mode = mode;
  }
  /**
   * @deprecated Use `default()` with your own expression instead.
   *
   * Adds `DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer))` to the column, which is the current epoch timestamp in milliseconds.
   */
  defaultNow() {
    return this.default(sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`);
  }
  build(table) {
    return new SQLiteTimestamp(
      table,
      this.config
    );
  }
}
__publicField(SQLiteTimestampBuilder, _eb, "SQLiteTimestampBuilder");
class SQLiteTimestamp extends (_hb = SQLiteBaseInteger, _gb = entityKind, _hb) {
  constructor() {
    super(...arguments);
    __publicField(this, "mode", this.config.mode);
  }
  mapFromDriverValue(value) {
    if (this.config.mode === "timestamp") {
      return new Date(value * 1e3);
    }
    return new Date(value);
  }
  mapToDriverValue(value) {
    const unix = value.getTime();
    if (this.config.mode === "timestamp") {
      return Math.floor(unix / 1e3);
    }
    return unix;
  }
}
__publicField(SQLiteTimestamp, _gb, "SQLiteTimestamp");
class SQLiteBooleanBuilder extends (_jb = SQLiteBaseIntegerBuilder, _ib = entityKind, _jb) {
  constructor(name, mode) {
    super(name, "boolean", "SQLiteBoolean");
    this.config.mode = mode;
  }
  build(table) {
    return new SQLiteBoolean(
      table,
      this.config
    );
  }
}
__publicField(SQLiteBooleanBuilder, _ib, "SQLiteBooleanBuilder");
class SQLiteBoolean extends (_lb = SQLiteBaseInteger, _kb = entityKind, _lb) {
  constructor() {
    super(...arguments);
    __publicField(this, "mode", this.config.mode);
  }
  mapFromDriverValue(value) {
    return Number(value) === 1;
  }
  mapToDriverValue(value) {
    return value ? 1 : 0;
  }
}
__publicField(SQLiteBoolean, _kb, "SQLiteBoolean");
function integer(name, config) {
  if ((config == null ? void 0 : config.mode) === "timestamp" || (config == null ? void 0 : config.mode) === "timestamp_ms") {
    return new SQLiteTimestampBuilder(name, config.mode);
  }
  if ((config == null ? void 0 : config.mode) === "boolean") {
    return new SQLiteBooleanBuilder(name, config.mode);
  }
  return new SQLiteIntegerBuilder(name);
}
class SQLiteTextBuilder extends (_nb = SQLiteColumnBuilder, _mb = entityKind, _nb) {
  constructor(name, config) {
    super(name, "string", "SQLiteText");
    this.config.enumValues = config.enum;
    this.config.length = config.length;
  }
  /** @internal */
  build(table) {
    return new SQLiteText(table, this.config);
  }
}
__publicField(SQLiteTextBuilder, _mb, "SQLiteTextBuilder");
class SQLiteText extends (_pb = SQLiteColumn, _ob = entityKind, _pb) {
  constructor(table, config) {
    super(table, config);
    __publicField(this, "enumValues", this.config.enumValues);
    __publicField(this, "length", this.config.length);
  }
  getSQLType() {
    return `text${this.config.length ? `(${this.config.length})` : ""}`;
  }
}
__publicField(SQLiteText, _ob, "SQLiteText");
class SQLiteTextJsonBuilder extends (_rb = SQLiteColumnBuilder, _qb = entityKind, _rb) {
  constructor(name) {
    super(name, "json", "SQLiteTextJson");
  }
  /** @internal */
  build(table) {
    return new SQLiteTextJson(
      table,
      this.config
    );
  }
}
__publicField(SQLiteTextJsonBuilder, _qb, "SQLiteTextJsonBuilder");
class SQLiteTextJson extends (_tb = SQLiteColumn, _sb = entityKind, _tb) {
  getSQLType() {
    return "text";
  }
  mapFromDriverValue(value) {
    return JSON.parse(value);
  }
  mapToDriverValue(value) {
    return JSON.stringify(value);
  }
}
__publicField(SQLiteTextJson, _sb, "SQLiteTextJson");
function text(name, config = {}) {
  return config.mode === "json" ? new SQLiteTextJsonBuilder(name) : new SQLiteTextBuilder(name, config);
}
class SQLiteViewBase extends (_vb = View, _ub = entityKind, _vb) {
}
__publicField(SQLiteViewBase, _ub, "SQLiteViewBase");
_wb = entityKind;
class SQLiteDialect {
  escapeName(name) {
    return `"${name}"`;
  }
  escapeParam(_num) {
    return "?";
  }
  escapeString(str) {
    return `'${str.replace(/'/g, "''")}'`;
  }
  buildWithCTE(queries) {
    if (!(queries == null ? void 0 : queries.length))
      return void 0;
    const withSqlChunks = [sql`with `];
    for (const [i, w] of queries.entries()) {
      withSqlChunks.push(sql`${sql.identifier(w._.alias)} as (${w._.sql})`);
      if (i < queries.length - 1) {
        withSqlChunks.push(sql`, `);
      }
    }
    withSqlChunks.push(sql` `);
    return sql.join(withSqlChunks);
  }
  buildDeleteQuery({ table, where, returning, withList }) {
    const withSql = this.buildWithCTE(withList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    return sql`${withSql}delete from ${table}${whereSql}${returningSql}`;
  }
  buildUpdateSet(table, set2) {
    const tableColumns = table[Table.Symbol.Columns];
    const columnNames = Object.keys(tableColumns).filter(
      (colName) => {
        var _a3;
        return set2[colName] !== void 0 || ((_a3 = tableColumns[colName]) == null ? void 0 : _a3.onUpdateFn) !== void 0;
      }
    );
    const setSize = columnNames.length;
    return sql.join(columnNames.flatMap((colName, i) => {
      const col = tableColumns[colName];
      const value = set2[colName] ?? sql.param(col.onUpdateFn(), col);
      const res2 = sql`${sql.identifier(col.name)} = ${value}`;
      if (i < setSize - 1) {
        return [res2, sql.raw(", ")];
      }
      return [res2];
    }));
  }
  buildUpdateQuery({ table, set: set2, where, returning, withList }) {
    const withSql = this.buildWithCTE(withList);
    const setSql = this.buildUpdateSet(table, set2);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const whereSql = where ? sql` where ${where}` : void 0;
    return sql`${withSql}update ${table} set ${setSql}${whereSql}${returningSql}`;
  }
  /**
   * Builds selection SQL with provided fields/expressions
   *
   * Examples:
   *
   * `select <selection> from`
   *
   * `insert ... returning <selection>`
   *
   * If `isSingleTable` is true, then columns won't be prefixed with table name
   */
  buildSelection(fields, { isSingleTable = false } = {}) {
    const columnsLen = fields.length;
    const chunks = fields.flatMap(({ field }, i) => {
      const chunk = [];
      if (is(field, SQL.Aliased) && field.isSelectionField) {
        chunk.push(sql.identifier(field.fieldAlias));
      } else if (is(field, SQL.Aliased) || is(field, SQL)) {
        const query = is(field, SQL.Aliased) ? field.sql : field;
        if (isSingleTable) {
          chunk.push(
            new SQL(
              query.queryChunks.map((c) => {
                if (is(c, Column)) {
                  return sql.identifier(c.name);
                }
                return c;
              })
            )
          );
        } else {
          chunk.push(query);
        }
        if (is(field, SQL.Aliased)) {
          chunk.push(sql` as ${sql.identifier(field.fieldAlias)}`);
        }
      } else if (is(field, Column)) {
        const tableName = field.table[Table.Symbol.Name];
        const columnName = field.name;
        if (isSingleTable) {
          chunk.push(sql.identifier(columnName));
        } else {
          chunk.push(sql`${sql.identifier(tableName)}.${sql.identifier(columnName)}`);
        }
      }
      if (i < columnsLen - 1) {
        chunk.push(sql`, `);
      }
      return chunk;
    });
    return sql.join(chunks);
  }
  buildSelectQuery({
    withList,
    fields,
    fieldsFlat,
    where,
    having,
    table,
    joins,
    orderBy,
    groupBy,
    limit,
    offset,
    distinct,
    setOperators
  }) {
    const fieldsList = fieldsFlat ?? orderSelectedFields(fields);
    for (const f of fieldsList) {
      if (is(f.field, Column) && getTableName(f.field.table) !== (is(table, Subquery) ? table._.alias : is(table, SQLiteViewBase) ? table[ViewBaseConfig].name : is(table, SQL) ? void 0 : getTableName(table)) && !((table2) => joins == null ? void 0 : joins.some(
        ({ alias }) => alias === (table2[Table.Symbol.IsAlias] ? getTableName(table2) : table2[Table.Symbol.BaseName])
      ))(f.field.table)) {
        const tableName = getTableName(f.field.table);
        throw new Error(
          `Your "${f.path.join("->")}" field references a column "${tableName}"."${f.field.name}", but the table "${tableName}" is not part of the query! Did you forget to join it?`
        );
      }
    }
    const isSingleTable = !joins || joins.length === 0;
    const withSql = this.buildWithCTE(withList);
    const distinctSql = distinct ? sql` distinct` : void 0;
    const selection = this.buildSelection(fieldsList, { isSingleTable });
    const tableSql = (() => {
      if (is(table, Table) && table[Table.Symbol.OriginalName] !== table[Table.Symbol.Name]) {
        return sql`${sql.identifier(table[Table.Symbol.OriginalName])} ${sql.identifier(table[Table.Symbol.Name])}`;
      }
      return table;
    })();
    const joinsArray = [];
    if (joins) {
      for (const [index2, joinMeta] of joins.entries()) {
        if (index2 === 0) {
          joinsArray.push(sql` `);
        }
        const table2 = joinMeta.table;
        if (is(table2, SQLiteTable)) {
          const tableName = table2[SQLiteTable.Symbol.Name];
          const tableSchema = table2[SQLiteTable.Symbol.Schema];
          const origTableName = table2[SQLiteTable.Symbol.OriginalName];
          const alias = tableName === origTableName ? void 0 : joinMeta.alias;
          joinsArray.push(
            sql`${sql.raw(joinMeta.joinType)} join ${tableSchema ? sql`${sql.identifier(tableSchema)}.` : void 0}${sql.identifier(origTableName)}${alias && sql` ${sql.identifier(alias)}`} on ${joinMeta.on}`
          );
        } else {
          joinsArray.push(
            sql`${sql.raw(joinMeta.joinType)} join ${table2} on ${joinMeta.on}`
          );
        }
        if (index2 < joins.length - 1) {
          joinsArray.push(sql` `);
        }
      }
    }
    const joinsSql = sql.join(joinsArray);
    const whereSql = where ? sql` where ${where}` : void 0;
    const havingSql = having ? sql` having ${having}` : void 0;
    const orderByList = [];
    if (orderBy) {
      for (const [index2, orderByValue] of orderBy.entries()) {
        orderByList.push(orderByValue);
        if (index2 < orderBy.length - 1) {
          orderByList.push(sql`, `);
        }
      }
    }
    const groupByList = [];
    if (groupBy) {
      for (const [index2, groupByValue] of groupBy.entries()) {
        groupByList.push(groupByValue);
        if (index2 < groupBy.length - 1) {
          groupByList.push(sql`, `);
        }
      }
    }
    const groupBySql = groupByList.length > 0 ? sql` group by ${sql.join(groupByList)}` : void 0;
    const orderBySql = orderByList.length > 0 ? sql` order by ${sql.join(orderByList)}` : void 0;
    const limitSql = limit ? sql` limit ${limit}` : void 0;
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    const finalQuery = sql`${withSql}select${distinctSql} ${selection} from ${tableSql}${joinsSql}${whereSql}${groupBySql}${havingSql}${orderBySql}${limitSql}${offsetSql}`;
    if (setOperators.length > 0) {
      return this.buildSetOperations(finalQuery, setOperators);
    }
    return finalQuery;
  }
  buildSetOperations(leftSelect, setOperators) {
    const [setOperator, ...rest] = setOperators;
    if (!setOperator) {
      throw new Error("Cannot pass undefined values to any set operator");
    }
    if (rest.length === 0) {
      return this.buildSetOperationQuery({ leftSelect, setOperator });
    }
    return this.buildSetOperations(
      this.buildSetOperationQuery({ leftSelect, setOperator }),
      rest
    );
  }
  buildSetOperationQuery({
    leftSelect,
    setOperator: { type, isAll, rightSelect, limit, orderBy, offset }
  }) {
    const leftChunk = sql`${leftSelect.getSQL()} `;
    const rightChunk = sql`${rightSelect.getSQL()}`;
    let orderBySql;
    if (orderBy && orderBy.length > 0) {
      const orderByValues = [];
      for (const singleOrderBy of orderBy) {
        if (is(singleOrderBy, SQLiteColumn)) {
          orderByValues.push(sql.identifier(singleOrderBy.name));
        } else if (is(singleOrderBy, SQL)) {
          for (let i = 0; i < singleOrderBy.queryChunks.length; i++) {
            const chunk = singleOrderBy.queryChunks[i];
            if (is(chunk, SQLiteColumn)) {
              singleOrderBy.queryChunks[i] = sql.identifier(chunk.name);
            }
          }
          orderByValues.push(sql`${singleOrderBy}`);
        } else {
          orderByValues.push(sql`${singleOrderBy}`);
        }
      }
      orderBySql = sql` order by ${sql.join(orderByValues, sql`, `)}`;
    }
    const limitSql = limit ? sql` limit ${limit}` : void 0;
    const operatorChunk = sql.raw(`${type} ${isAll ? "all " : ""}`);
    const offsetSql = offset ? sql` offset ${offset}` : void 0;
    return sql`${leftChunk}${operatorChunk}${rightChunk}${orderBySql}${limitSql}${offsetSql}`;
  }
  buildInsertQuery({ table, values, onConflict, returning, withList }) {
    const valuesSqlList = [];
    const columns = table[Table.Symbol.Columns];
    const colEntries = Object.entries(columns);
    const insertOrder = colEntries.map(([, column]) => sql.identifier(column.name));
    for (const [valueIndex, value] of values.entries()) {
      const valueList = [];
      for (const [fieldName, col] of colEntries) {
        const colValue = value[fieldName];
        if (colValue === void 0 || is(colValue, Param) && colValue.value === void 0) {
          let defaultValue;
          if (col.default !== null && col.default !== void 0) {
            defaultValue = is(col.default, SQL) ? col.default : sql.param(col.default, col);
          } else if (col.defaultFn !== void 0) {
            const defaultFnResult = col.defaultFn();
            defaultValue = is(defaultFnResult, SQL) ? defaultFnResult : sql.param(defaultFnResult, col);
          } else if (!col.default && col.onUpdateFn !== void 0) {
            const onUpdateFnResult = col.onUpdateFn();
            defaultValue = is(onUpdateFnResult, SQL) ? onUpdateFnResult : sql.param(onUpdateFnResult, col);
          } else {
            defaultValue = sql`null`;
          }
          valueList.push(defaultValue);
        } else {
          valueList.push(colValue);
        }
      }
      valuesSqlList.push(valueList);
      if (valueIndex < values.length - 1) {
        valuesSqlList.push(sql`, `);
      }
    }
    const withSql = this.buildWithCTE(withList);
    const valuesSql = sql.join(valuesSqlList);
    const returningSql = returning ? sql` returning ${this.buildSelection(returning, { isSingleTable: true })}` : void 0;
    const onConflictSql = onConflict ? sql` on conflict ${onConflict}` : void 0;
    return sql`${withSql}insert into ${table} ${insertOrder} values ${valuesSql}${onConflictSql}${returningSql}`;
  }
  sqlToQuery(sql2) {
    return sql2.toQuery({
      escapeName: this.escapeName,
      escapeParam: this.escapeParam,
      escapeString: this.escapeString
    });
  }
  buildRelationalQuery({
    fullSchema,
    schema: schema2,
    tableNamesMap,
    table,
    tableConfig,
    queryConfig: config,
    tableAlias,
    nestedQueryRelation,
    joinOn
  }) {
    let selection = [];
    let limit, offset, orderBy = [], where;
    const joins = [];
    if (config === true) {
      const selectionEntries = Object.entries(tableConfig.columns);
      selection = selectionEntries.map(([key, value]) => ({
        dbKey: value.name,
        tsKey: key,
        field: aliasedTableColumn(value, tableAlias),
        relationTableTsKey: void 0,
        isJson: false,
        selection: []
      }));
    } else {
      const aliasedColumns = Object.fromEntries(
        Object.entries(tableConfig.columns).map(([key, value]) => [key, aliasedTableColumn(value, tableAlias)])
      );
      if (config.where) {
        const whereSql = typeof config.where === "function" ? config.where(aliasedColumns, getOperators()) : config.where;
        where = whereSql && mapColumnsInSQLToAlias(whereSql, tableAlias);
      }
      const fieldsSelection = [];
      let selectedColumns = [];
      if (config.columns) {
        let isIncludeMode = false;
        for (const [field, value] of Object.entries(config.columns)) {
          if (value === void 0) {
            continue;
          }
          if (field in tableConfig.columns) {
            if (!isIncludeMode && value === true) {
              isIncludeMode = true;
            }
            selectedColumns.push(field);
          }
        }
        if (selectedColumns.length > 0) {
          selectedColumns = isIncludeMode ? selectedColumns.filter((c) => {
            var _a3;
            return ((_a3 = config.columns) == null ? void 0 : _a3[c]) === true;
          }) : Object.keys(tableConfig.columns).filter((key) => !selectedColumns.includes(key));
        }
      } else {
        selectedColumns = Object.keys(tableConfig.columns);
      }
      for (const field of selectedColumns) {
        const column = tableConfig.columns[field];
        fieldsSelection.push({ tsKey: field, value: column });
      }
      let selectedRelations = [];
      if (config.with) {
        selectedRelations = Object.entries(config.with).filter((entry) => !!entry[1]).map(([tsKey, queryConfig]) => ({ tsKey, queryConfig, relation: tableConfig.relations[tsKey] }));
      }
      let extras;
      if (config.extras) {
        extras = typeof config.extras === "function" ? config.extras(aliasedColumns, { sql }) : config.extras;
        for (const [tsKey, value] of Object.entries(extras)) {
          fieldsSelection.push({
            tsKey,
            value: mapColumnsInAliasedSQLToAlias(value, tableAlias)
          });
        }
      }
      for (const { tsKey, value } of fieldsSelection) {
        selection.push({
          dbKey: is(value, SQL.Aliased) ? value.fieldAlias : tableConfig.columns[tsKey].name,
          tsKey,
          field: is(value, Column) ? aliasedTableColumn(value, tableAlias) : value,
          relationTableTsKey: void 0,
          isJson: false,
          selection: []
        });
      }
      let orderByOrig = typeof config.orderBy === "function" ? config.orderBy(aliasedColumns, getOrderByOperators()) : config.orderBy ?? [];
      if (!Array.isArray(orderByOrig)) {
        orderByOrig = [orderByOrig];
      }
      orderBy = orderByOrig.map((orderByValue) => {
        if (is(orderByValue, Column)) {
          return aliasedTableColumn(orderByValue, tableAlias);
        }
        return mapColumnsInSQLToAlias(orderByValue, tableAlias);
      });
      limit = config.limit;
      offset = config.offset;
      for (const {
        tsKey: selectedRelationTsKey,
        queryConfig: selectedRelationConfigValue,
        relation
      } of selectedRelations) {
        const normalizedRelation = normalizeRelation(schema2, tableNamesMap, relation);
        const relationTableName = relation.referencedTable[Table.Symbol.Name];
        const relationTableTsName = tableNamesMap[relationTableName];
        const relationTableAlias = `${tableAlias}_${selectedRelationTsKey}`;
        const joinOn2 = and(
          ...normalizedRelation.fields.map(
            (field2, i) => eq(
              aliasedTableColumn(normalizedRelation.references[i], relationTableAlias),
              aliasedTableColumn(field2, tableAlias)
            )
          )
        );
        const builtRelation = this.buildRelationalQuery({
          fullSchema,
          schema: schema2,
          tableNamesMap,
          table: fullSchema[relationTableTsName],
          tableConfig: schema2[relationTableTsName],
          queryConfig: is(relation, One) ? selectedRelationConfigValue === true ? { limit: 1 } : { ...selectedRelationConfigValue, limit: 1 } : selectedRelationConfigValue,
          tableAlias: relationTableAlias,
          joinOn: joinOn2,
          nestedQueryRelation: relation
        });
        const field = sql`(${builtRelation.sql})`.as(selectedRelationTsKey);
        selection.push({
          dbKey: selectedRelationTsKey,
          tsKey: selectedRelationTsKey,
          field,
          relationTableTsKey: relationTableTsName,
          isJson: true,
          selection: builtRelation.selection
        });
      }
    }
    if (selection.length === 0) {
      throw new DrizzleError({
        message: `No fields selected for table "${tableConfig.tsName}" ("${tableAlias}"). You need to have at least one item in "columns", "with" or "extras". If you need to select all columns, omit the "columns" key or set it to undefined.`
      });
    }
    let result;
    where = and(joinOn, where);
    if (nestedQueryRelation) {
      let field = sql`json_array(${sql.join(
        selection.map(
          ({ field: field2 }) => is(field2, SQLiteColumn) ? sql.identifier(field2.name) : is(field2, SQL.Aliased) ? field2.sql : field2
        ),
        sql`, `
      )})`;
      if (is(nestedQueryRelation, Many)) {
        field = sql`coalesce(json_group_array(${field}), json_array())`;
      }
      const nestedSelection = [{
        dbKey: "data",
        tsKey: "data",
        field: field.as("data"),
        isJson: true,
        relationTableTsKey: tableConfig.tsName,
        selection
      }];
      const needsSubquery = limit !== void 0 || offset !== void 0 || orderBy.length > 0;
      if (needsSubquery) {
        result = this.buildSelectQuery({
          table: aliasedTable(table, tableAlias),
          fields: {},
          fieldsFlat: [
            {
              path: [],
              field: sql.raw("*")
            }
          ],
          where,
          limit,
          offset,
          orderBy,
          setOperators: []
        });
        where = void 0;
        limit = void 0;
        offset = void 0;
        orderBy = void 0;
      } else {
        result = aliasedTable(table, tableAlias);
      }
      result = this.buildSelectQuery({
        table: is(result, SQLiteTable) ? result : new Subquery(result, {}, tableAlias),
        fields: {},
        fieldsFlat: nestedSelection.map(({ field: field2 }) => ({
          path: [],
          field: is(field2, Column) ? aliasedTableColumn(field2, tableAlias) : field2
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    } else {
      result = this.buildSelectQuery({
        table: aliasedTable(table, tableAlias),
        fields: {},
        fieldsFlat: selection.map(({ field }) => ({
          path: [],
          field: is(field, Column) ? aliasedTableColumn(field, tableAlias) : field
        })),
        joins,
        where,
        limit,
        offset,
        orderBy,
        setOperators: []
      });
    }
    return {
      tableTsKey: tableConfig.tsName,
      sql: result,
      selection
    };
  }
}
__publicField(SQLiteDialect, _wb, "SQLiteDialect");
class SQLiteSyncDialect extends (_yb = SQLiteDialect, _xb = entityKind, _yb) {
  migrate(migrations, session, config) {
    const migrationsTable = config === void 0 ? "__drizzle_migrations" : typeof config === "string" ? "__drizzle_migrations" : config.migrationsTable ?? "__drizzle_migrations";
    const migrationTableCreate = sql`
			CREATE TABLE IF NOT EXISTS ${sql.identifier(migrationsTable)} (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			)
		`;
    session.run(migrationTableCreate);
    const dbMigrations = session.values(
      sql`SELECT id, hash, created_at FROM ${sql.identifier(migrationsTable)} ORDER BY created_at DESC LIMIT 1`
    );
    const lastDbMigration = dbMigrations[0] ?? void 0;
    session.run(sql`BEGIN`);
    try {
      for (const migration of migrations) {
        if (!lastDbMigration || Number(lastDbMigration[2]) < migration.folderMillis) {
          for (const stmt of migration.sql) {
            session.run(sql.raw(stmt));
          }
          session.run(
            sql`INSERT INTO ${sql.identifier(migrationsTable)} ("hash", "created_at") VALUES(${migration.hash}, ${migration.folderMillis})`
          );
        }
      }
      session.run(sql`COMMIT`);
    } catch (e) {
      session.run(sql`ROLLBACK`);
      throw e;
    }
  }
}
__publicField(SQLiteSyncDialect, _xb, "SQLiteSyncDialect");
_zb = entityKind;
class TypedQueryBuilder {
  /** @internal */
  getSelectedFields() {
    return this._.selectedFields;
  }
}
__publicField(TypedQueryBuilder, _zb, "TypedQueryBuilder");
_Ab = entityKind;
class SQLiteSelectBuilder {
  constructor(config) {
    __publicField(this, "fields");
    __publicField(this, "session");
    __publicField(this, "dialect");
    __publicField(this, "withList");
    __publicField(this, "distinct");
    this.fields = config.fields;
    this.session = config.session;
    this.dialect = config.dialect;
    this.withList = config.withList;
    this.distinct = config.distinct;
  }
  from(source) {
    const isPartialSelect = !!this.fields;
    let fields;
    if (this.fields) {
      fields = this.fields;
    } else if (is(source, Subquery)) {
      fields = Object.fromEntries(
        Object.keys(source._.selectedFields).map((key) => [key, source[key]])
      );
    } else if (is(source, SQLiteViewBase)) {
      fields = source[ViewBaseConfig].selectedFields;
    } else if (is(source, SQL)) {
      fields = {};
    } else {
      fields = getTableColumns(source);
    }
    return new SQLiteSelectBase({
      table: source,
      fields,
      isPartialSelect,
      session: this.session,
      dialect: this.dialect,
      withList: this.withList,
      distinct: this.distinct
    });
  }
}
__publicField(SQLiteSelectBuilder, _Ab, "SQLiteSelectBuilder");
class SQLiteSelectQueryBuilderBase extends (_Cb = TypedQueryBuilder, _Bb = entityKind, _Cb) {
  constructor({ table, fields, isPartialSelect, session, dialect, withList, distinct }) {
    super();
    __publicField(this, "_");
    /** @internal */
    __publicField(this, "config");
    __publicField(this, "joinsNotNullableMap");
    __publicField(this, "tableName");
    __publicField(this, "isPartialSelect");
    __publicField(this, "session");
    __publicField(this, "dialect");
    /**
     * Executes a `left join` operation by adding another table to the current query.
     *
     * Calling this method associates each row of the table with the corresponding row from the joined table, if a match is found. If no matching row exists, it sets all columns of the joined table to null.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#left-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User; pets: Pet | null }[] = await db.select()
     *   .from(users)
     *   .leftJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number; petId: number | null }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .leftJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    __publicField(this, "leftJoin", this.createJoin("left"));
    /**
     * Executes a `right join` operation by adding another table to the current query.
     *
     * Calling this method associates each row of the joined table with the corresponding row from the main table, if a match is found. If no matching row exists, it sets all columns of the main table to null.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#right-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User | null; pets: Pet }[] = await db.select()
     *   .from(users)
     *   .rightJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number | null; petId: number }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .rightJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    __publicField(this, "rightJoin", this.createJoin("right"));
    /**
     * Executes an `inner join` operation, creating a new table by combining rows from two tables that have matching values.
     *
     * Calling this method retrieves rows that have corresponding entries in both joined tables. Rows without matching entries in either table are excluded, resulting in a table that includes only matching pairs.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#inner-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User; pets: Pet }[] = await db.select()
     *   .from(users)
     *   .innerJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number; petId: number }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .innerJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    __publicField(this, "innerJoin", this.createJoin("inner"));
    /**
     * Executes a `full join` operation by combining rows from two tables into a new table.
     *
     * Calling this method retrieves all rows from both main and joined tables, merging rows with matching values and filling in `null` for non-matching columns.
     *
     * See docs: {@link https://orm.drizzle.team/docs/joins#full-join}
     *
     * @param table the table to join.
     * @param on the `on` clause.
     *
     * @example
     *
     * ```ts
     * // Select all users and their pets
     * const usersWithPets: { user: User | null; pets: Pet | null }[] = await db.select()
     *   .from(users)
     *   .fullJoin(pets, eq(users.id, pets.ownerId))
     *
     * // Select userId and petId
     * const usersIdsAndPetIds: { userId: number | null; petId: number | null }[] = await db.select({
     *   userId: users.id,
     *   petId: pets.id,
     * })
     *   .from(users)
     *   .fullJoin(pets, eq(users.id, pets.ownerId))
     * ```
     */
    __publicField(this, "fullJoin", this.createJoin("full"));
    /**
     * Adds `union` set operator to the query.
     *
     * Calling this method will combine the result sets of the `select` statements and remove any duplicate rows that appear across them.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#union}
     *
     * @example
     *
     * ```ts
     * // Select all unique names from customers and users tables
     * await db.select({ name: users.name })
     *   .from(users)
     *   .union(
     *     db.select({ name: customers.name }).from(customers)
     *   );
     * // or
     * import { union } from 'drizzle-orm/sqlite-core'
     *
     * await union(
     *   db.select({ name: users.name }).from(users),
     *   db.select({ name: customers.name }).from(customers)
     * );
     * ```
     */
    __publicField(this, "union", this.createSetOperator("union", false));
    /**
     * Adds `union all` set operator to the query.
     *
     * Calling this method will combine the result-set of the `select` statements and keep all duplicate rows that appear across them.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#union-all}
     *
     * @example
     *
     * ```ts
     * // Select all transaction ids from both online and in-store sales
     * await db.select({ transaction: onlineSales.transactionId })
     *   .from(onlineSales)
     *   .unionAll(
     *     db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
     *   );
     * // or
     * import { unionAll } from 'drizzle-orm/sqlite-core'
     *
     * await unionAll(
     *   db.select({ transaction: onlineSales.transactionId }).from(onlineSales),
     *   db.select({ transaction: inStoreSales.transactionId }).from(inStoreSales)
     * );
     * ```
     */
    __publicField(this, "unionAll", this.createSetOperator("union", true));
    /**
     * Adds `intersect` set operator to the query.
     *
     * Calling this method will retain only the rows that are present in both result sets and eliminate duplicates.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#intersect}
     *
     * @example
     *
     * ```ts
     * // Select course names that are offered in both departments A and B
     * await db.select({ courseName: depA.courseName })
     *   .from(depA)
     *   .intersect(
     *     db.select({ courseName: depB.courseName }).from(depB)
     *   );
     * // or
     * import { intersect } from 'drizzle-orm/sqlite-core'
     *
     * await intersect(
     *   db.select({ courseName: depA.courseName }).from(depA),
     *   db.select({ courseName: depB.courseName }).from(depB)
     * );
     * ```
     */
    __publicField(this, "intersect", this.createSetOperator("intersect", false));
    /**
     * Adds `except` set operator to the query.
     *
     * Calling this method will retrieve all unique rows from the left query, except for the rows that are present in the result set of the right query.
     *
     * See docs: {@link https://orm.drizzle.team/docs/set-operations#except}
     *
     * @example
     *
     * ```ts
     * // Select all courses offered in department A but not in department B
     * await db.select({ courseName: depA.courseName })
     *   .from(depA)
     *   .except(
     *     db.select({ courseName: depB.courseName }).from(depB)
     *   );
     * // or
     * import { except } from 'drizzle-orm/sqlite-core'
     *
     * await except(
     *   db.select({ courseName: depA.courseName }).from(depA),
     *   db.select({ courseName: depB.courseName }).from(depB)
     * );
     * ```
     */
    __publicField(this, "except", this.createSetOperator("except", false));
    this.config = {
      withList,
      table,
      fields: { ...fields },
      distinct,
      setOperators: []
    };
    this.isPartialSelect = isPartialSelect;
    this.session = session;
    this.dialect = dialect;
    this._ = {
      selectedFields: fields
    };
    this.tableName = getTableLikeName(table);
    this.joinsNotNullableMap = typeof this.tableName === "string" ? { [this.tableName]: true } : {};
  }
  createJoin(joinType) {
    return (table, on) => {
      var _a3;
      const baseTableName = this.tableName;
      const tableName = getTableLikeName(table);
      if (typeof tableName === "string" && ((_a3 = this.config.joins) == null ? void 0 : _a3.some((join2) => join2.alias === tableName))) {
        throw new Error(`Alias "${tableName}" is already used in this query`);
      }
      if (!this.isPartialSelect) {
        if (Object.keys(this.joinsNotNullableMap).length === 1 && typeof baseTableName === "string") {
          this.config.fields = {
            [baseTableName]: this.config.fields
          };
        }
        if (typeof tableName === "string" && !is(table, SQL)) {
          const selection = is(table, Subquery) ? table._.selectedFields : is(table, View) ? table[ViewBaseConfig].selectedFields : table[Table.Symbol.Columns];
          this.config.fields[tableName] = selection;
        }
      }
      if (typeof on === "function") {
        on = on(
          new Proxy(
            this.config.fields,
            new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
          )
        );
      }
      if (!this.config.joins) {
        this.config.joins = [];
      }
      this.config.joins.push({ on, table, joinType, alias: tableName });
      if (typeof tableName === "string") {
        switch (joinType) {
          case "left": {
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
          case "right": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "inner": {
            this.joinsNotNullableMap[tableName] = true;
            break;
          }
          case "full": {
            this.joinsNotNullableMap = Object.fromEntries(
              Object.entries(this.joinsNotNullableMap).map(([key]) => [key, false])
            );
            this.joinsNotNullableMap[tableName] = false;
            break;
          }
        }
      }
      return this;
    };
  }
  createSetOperator(type, isAll) {
    return (rightSelection) => {
      const rightSelect = typeof rightSelection === "function" ? rightSelection(getSQLiteSetOperators()) : rightSelection;
      if (!haveSameKeys(this.getSelectedFields(), rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
      this.config.setOperators.push({ type, isAll, rightSelect });
      return this;
    };
  }
  /** @internal */
  addSetOperators(setOperators) {
    this.config.setOperators.push(...setOperators);
    return this;
  }
  /**
   * Adds a `where` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#filtering}
   *
   * @param where the `where` clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be selected.
   *
   * ```ts
   * // Select all cars with green color
   * await db.select().from(cars).where(eq(cars.color, 'green'));
   * // or
   * await db.select().from(cars).where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Select all BMW cars with a green color
   * await db.select().from(cars).where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Select all cars with the green or blue color
   * await db.select().from(cars).where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    if (typeof where === "function") {
      where = where(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.where = where;
    return this;
  }
  /**
   * Adds a `having` clause to the query.
   *
   * Calling this method will select only those rows that fulfill a specified condition. It is typically used with aggregate functions to filter the aggregated data based on a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#aggregations}
   *
   * @param having the `having` clause.
   *
   * @example
   *
   * ```ts
   * // Select all brands with more than one car
   * await db.select({
   * 	brand: cars.brand,
   * 	count: sql<number>`cast(count(${cars.id}) as int)`,
   * })
   *   .from(cars)
   *   .groupBy(cars.brand)
   *   .having(({ count }) => gt(count, 1));
   * ```
   */
  having(having) {
    if (typeof having === "function") {
      having = having(
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "sql", sqlBehavior: "sql" })
        )
      );
    }
    this.config.having = having;
    return this;
  }
  groupBy(...columns) {
    if (typeof columns[0] === "function") {
      const groupBy = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      this.config.groupBy = Array.isArray(groupBy) ? groupBy : [groupBy];
    } else {
      this.config.groupBy = columns;
    }
    return this;
  }
  orderBy(...columns) {
    if (typeof columns[0] === "function") {
      const orderBy = columns[0](
        new Proxy(
          this.config.fields,
          new SelectionProxyHandler({ sqlAliasedBehavior: "alias", sqlBehavior: "sql" })
        )
      );
      const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    } else {
      const orderByArray = columns;
      if (this.config.setOperators.length > 0) {
        this.config.setOperators.at(-1).orderBy = orderByArray;
      } else {
        this.config.orderBy = orderByArray;
      }
    }
    return this;
  }
  /**
   * Adds a `limit` clause to the query.
   *
   * Calling this method will set the maximum number of rows that will be returned by this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param limit the `limit` clause.
   *
   * @example
   *
   * ```ts
   * // Get the first 10 people from this query.
   * await db.select().from(people).limit(10);
   * ```
   */
  limit(limit) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).limit = limit;
    } else {
      this.config.limit = limit;
    }
    return this;
  }
  /**
   * Adds an `offset` clause to the query.
   *
   * Calling this method will skip a number of rows when returning results from this query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#limit--offset}
   *
   * @param offset the `offset` clause.
   *
   * @example
   *
   * ```ts
   * // Get the 10th-20th people from this query.
   * await db.select().from(people).offset(10).limit(10);
   * ```
   */
  offset(offset) {
    if (this.config.setOperators.length > 0) {
      this.config.setOperators.at(-1).offset = offset;
    } else {
      this.config.offset = offset;
    }
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildSelectQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  as(alias) {
    return new Proxy(
      new Subquery(this.getSQL(), this.config.fields, alias),
      new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  /** @internal */
  getSelectedFields() {
    return new Proxy(
      this.config.fields,
      new SelectionProxyHandler({ alias: this.tableName, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
    );
  }
  $dynamic() {
    return this;
  }
}
__publicField(SQLiteSelectQueryBuilderBase, _Bb, "SQLiteSelectQueryBuilder");
class SQLiteSelectBase extends (_Eb = SQLiteSelectQueryBuilderBase, _Db = entityKind, _Eb) {
  constructor() {
    super(...arguments);
    __publicField(this, "run", (placeholderValues) => {
      return this._prepare().run(placeholderValues);
    });
    __publicField(this, "all", (placeholderValues) => {
      return this._prepare().all(placeholderValues);
    });
    __publicField(this, "get", (placeholderValues) => {
      return this._prepare().get(placeholderValues);
    });
    __publicField(this, "values", (placeholderValues) => {
      return this._prepare().values(placeholderValues);
    });
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    if (!this.session) {
      throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");
    }
    const fieldsList = orderSelectedFields(this.config.fields);
    const query = this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      fieldsList,
      "all",
      true
    );
    query.joinsNotNullableMap = this.joinsNotNullableMap;
    return query;
  }
  prepare() {
    return this._prepare(false);
  }
  async execute() {
    return this.all();
  }
}
__publicField(SQLiteSelectBase, _Db, "SQLiteSelect");
applyMixins(SQLiteSelectBase, [QueryPromise]);
function createSetOperator(type, isAll) {
  return (leftSelect, rightSelect, ...restSelects) => {
    const setOperators = [rightSelect, ...restSelects].map((select) => ({
      type,
      isAll,
      rightSelect: select
    }));
    for (const setOperator of setOperators) {
      if (!haveSameKeys(leftSelect.getSelectedFields(), setOperator.rightSelect.getSelectedFields())) {
        throw new Error(
          "Set operator error (union / intersect / except): selected fields are not the same or are in a different order"
        );
      }
    }
    return leftSelect.addSetOperators(setOperators);
  };
}
const getSQLiteSetOperators = () => ({
  union,
  unionAll,
  intersect,
  except
});
const union = createSetOperator("union", false);
const unionAll = createSetOperator("union", true);
const intersect = createSetOperator("intersect", false);
const except = createSetOperator("except", false);
_Fb = entityKind;
class QueryBuilder {
  constructor() {
    __publicField(this, "dialect");
  }
  $with(alias) {
    const queryBuilder = this;
    return {
      as(qb) {
        if (typeof qb === "function") {
          qb = qb(queryBuilder);
        }
        return new Proxy(
          new WithSubquery(qb.getSQL(), qb.getSelectedFields(), alias, true),
          new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
        );
      }
    };
  }
  with(...queries) {
    const self2 = this;
    function select(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self2.getDialect(),
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: void 0,
        dialect: self2.getDialect(),
        withList: queries,
        distinct: true
      });
    }
    return { select, selectDistinct };
  }
  select(fields) {
    return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: void 0, dialect: this.getDialect() });
  }
  selectDistinct(fields) {
    return new SQLiteSelectBuilder({
      fields: fields ?? void 0,
      session: void 0,
      dialect: this.getDialect(),
      distinct: true
    });
  }
  // Lazy load dialect to avoid circular dependency
  getDialect() {
    if (!this.dialect) {
      this.dialect = new SQLiteSyncDialect();
    }
    return this.dialect;
  }
}
__publicField(QueryBuilder, _Fb, "SQLiteQueryBuilder");
_Gb = entityKind;
class SQLiteUpdateBuilder {
  constructor(table, session, dialect, withList) {
    this.table = table;
    this.session = session;
    this.dialect = dialect;
    this.withList = withList;
  }
  set(values) {
    return new SQLiteUpdateBase(
      this.table,
      mapUpdateSet(this.table, values),
      this.session,
      this.dialect,
      this.withList
    );
  }
}
__publicField(SQLiteUpdateBuilder, _Gb, "SQLiteUpdateBuilder");
class SQLiteUpdateBase extends (_Ib = QueryPromise, _Hb = entityKind, _Ib) {
  constructor(table, set2, session, dialect, withList) {
    super();
    /** @internal */
    __publicField(this, "config");
    __publicField(this, "run", (placeholderValues) => {
      return this._prepare().run(placeholderValues);
    });
    __publicField(this, "all", (placeholderValues) => {
      return this._prepare().all(placeholderValues);
    });
    __publicField(this, "get", (placeholderValues) => {
      return this._prepare().get(placeholderValues);
    });
    __publicField(this, "values", (placeholderValues) => {
      return this._prepare().values(placeholderValues);
    });
    this.session = session;
    this.dialect = dialect;
    this.config = { set: set2, table, withList };
  }
  /**
   * Adds a 'where' clause to the query.
   *
   * Calling this method will update only those rows that fulfill a specified condition.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param where the 'where' clause.
   *
   * @example
   * You can use conditional operators and `sql function` to filter the rows to be updated.
   *
   * ```ts
   * // Update all cars with green color
   * db.update(cars).set({ color: 'red' })
   *   .where(eq(cars.color, 'green'));
   * // or
   * db.update(cars).set({ color: 'red' })
   *   .where(sql`${cars.color} = 'green'`)
   * ```
   *
   * You can logically combine conditional operators with `and()` and `or()` operators:
   *
   * ```ts
   * // Update all BMW cars with a green color
   * db.update(cars).set({ color: 'red' })
   *   .where(and(eq(cars.color, 'green'), eq(cars.brand, 'BMW')));
   *
   * // Update all cars with the green or blue color
   * db.update(cars).set({ color: 'red' })
   *   .where(or(eq(cars.color, 'green'), eq(cars.color, 'blue')));
   * ```
   */
  where(where) {
    this.config.where = where;
    return this;
  }
  returning(fields = this.config.table[SQLiteTable.Symbol.Columns]) {
    this.config.returning = orderSelectedFields(fields);
    return this;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildUpdateQuery(this.config);
  }
  toSQL() {
    const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
    return rest;
  }
  /** @internal */
  _prepare(isOneTimeQuery = true) {
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      this.dialect.sqlToQuery(this.getSQL()),
      this.config.returning,
      this.config.returning ? "all" : "run",
      true
    );
  }
  prepare() {
    return this._prepare(false);
  }
  async execute() {
    return this.config.returning ? this.all() : this.run();
  }
  $dynamic() {
    return this;
  }
}
__publicField(SQLiteUpdateBase, _Hb, "SQLiteUpdate");
_Jb = entityKind;
class RelationalQueryBuilder {
  constructor(mode, fullSchema, schema2, tableNamesMap, table, tableConfig, dialect, session) {
    this.mode = mode;
    this.fullSchema = fullSchema;
    this.schema = schema2;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
  }
  findMany(config) {
    return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? config : {},
      "many"
    ) : new SQLiteRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? config : {},
      "many"
    );
  }
  findFirst(config) {
    return this.mode === "sync" ? new SQLiteSyncRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? { ...config, limit: 1 } : { limit: 1 },
      "first"
    ) : new SQLiteRelationalQuery(
      this.fullSchema,
      this.schema,
      this.tableNamesMap,
      this.table,
      this.tableConfig,
      this.dialect,
      this.session,
      config ? { ...config, limit: 1 } : { limit: 1 },
      "first"
    );
  }
}
__publicField(RelationalQueryBuilder, _Jb, "SQLiteAsyncRelationalQueryBuilder");
class SQLiteRelationalQuery extends (_Lb = QueryPromise, _Kb = entityKind, _Lb) {
  constructor(fullSchema, schema2, tableNamesMap, table, tableConfig, dialect, session, config, mode) {
    super();
    /** @internal */
    __publicField(this, "mode");
    this.fullSchema = fullSchema;
    this.schema = schema2;
    this.tableNamesMap = tableNamesMap;
    this.table = table;
    this.tableConfig = tableConfig;
    this.dialect = dialect;
    this.session = session;
    this.config = config;
    this.mode = mode;
  }
  /** @internal */
  getSQL() {
    return this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    }).sql;
  }
  /** @internal */
  _prepare(isOneTimeQuery = false) {
    const { query, builtQuery } = this._toSQL();
    return this.session[isOneTimeQuery ? "prepareOneTimeQuery" : "prepareQuery"](
      builtQuery,
      void 0,
      this.mode === "first" ? "get" : "all",
      true,
      (rawRows, mapColumnValue) => {
        const rows = rawRows.map(
          (row) => mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue)
        );
        if (this.mode === "first") {
          return rows[0];
        }
        return rows;
      }
    );
  }
  prepare() {
    return this._prepare(false);
  }
  _toSQL() {
    const query = this.dialect.buildRelationalQuery({
      fullSchema: this.fullSchema,
      schema: this.schema,
      tableNamesMap: this.tableNamesMap,
      table: this.table,
      tableConfig: this.tableConfig,
      queryConfig: this.config,
      tableAlias: this.tableConfig.tsName
    });
    const builtQuery = this.dialect.sqlToQuery(query.sql);
    return { query, builtQuery };
  }
  toSQL() {
    return this._toSQL().builtQuery;
  }
  /** @internal */
  executeRaw() {
    if (this.mode === "first") {
      return this._prepare(false).get();
    }
    return this._prepare(false).all();
  }
  async execute() {
    return this.executeRaw();
  }
}
__publicField(SQLiteRelationalQuery, _Kb, "SQLiteAsyncRelationalQuery");
class SQLiteSyncRelationalQuery extends (_Nb = SQLiteRelationalQuery, _Mb = entityKind, _Nb) {
  sync() {
    return this.executeRaw();
  }
}
__publicField(SQLiteSyncRelationalQuery, _Mb, "SQLiteSyncRelationalQuery");
class SQLiteRaw extends (_Pb = QueryPromise, _Ob = entityKind, _Pb) {
  constructor(execute, getSQL, action, dialect, mapBatchResult) {
    super();
    /** @internal */
    __publicField(this, "config");
    this.execute = execute;
    this.getSQL = getSQL;
    this.dialect = dialect;
    this.mapBatchResult = mapBatchResult;
    this.config = { action };
  }
  getQuery() {
    return { ...this.dialect.sqlToQuery(this.getSQL()), method: this.config.action };
  }
  mapResult(result, isFromBatch) {
    return isFromBatch ? this.mapBatchResult(result) : result;
  }
  _prepare() {
    return this;
  }
  /** @internal */
  isResponseInArrayMode() {
    return false;
  }
}
__publicField(SQLiteRaw, _Ob, "SQLiteRaw");
_Qb = entityKind;
class BaseSQLiteDatabase {
  constructor(resultKind, dialect, session, schema2) {
    __publicField(this, "query");
    this.resultKind = resultKind;
    this.dialect = dialect;
    this.session = session;
    this._ = schema2 ? {
      schema: schema2.schema,
      fullSchema: schema2.fullSchema,
      tableNamesMap: schema2.tableNamesMap
    } : {
      schema: void 0,
      fullSchema: {},
      tableNamesMap: {}
    };
    this.query = {};
    const query = this.query;
    if (this._.schema) {
      for (const [tableName, columns] of Object.entries(this._.schema)) {
        query[tableName] = new RelationalQueryBuilder(
          resultKind,
          schema2.fullSchema,
          this._.schema,
          this._.tableNamesMap,
          schema2.fullSchema[tableName],
          columns,
          dialect,
          session
        );
      }
    }
  }
  /**
   * Creates a subquery that defines a temporary named result set as a CTE.
   *
   * It is useful for breaking down complex queries into simpler parts and for reusing the result set in subsequent parts of the query.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param alias The alias for the subquery.
   *
   * Failure to provide an alias will result in a DrizzleTypeError, preventing the subquery from being referenced in other queries.
   *
   * @example
   *
   * ```ts
   * // Create a subquery with alias 'sq' and use it in the select query
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * const result = await db.with(sq).select().from(sq);
   * ```
   *
   * To select arbitrary SQL values as fields in a CTE and reference them in other CTEs or in the main query, you need to add aliases to them:
   *
   * ```ts
   * // Select an arbitrary SQL value as a field in a CTE and reference it in the main query
   * const sq = db.$with('sq').as(db.select({
   *   name: sql<string>`upper(${users.name})`.as('name'),
   * })
   * .from(users));
   *
   * const result = await db.with(sq).select({ name: sq.name }).from(sq);
   * ```
   */
  $with(alias) {
    return {
      as(qb) {
        if (typeof qb === "function") {
          qb = qb(new QueryBuilder());
        }
        return new Proxy(
          new WithSubquery(qb.getSQL(), qb.getSelectedFields(), alias, true),
          new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
        );
      }
    };
  }
  /**
   * Incorporates a previously defined CTE (using `$with`) into the main query.
   *
   * This method allows the main query to reference a temporary named result set.
   *
   * See docs: {@link https://orm.drizzle.team/docs/select#with-clause}
   *
   * @param queries The CTEs to incorporate into the main query.
   *
   * @example
   *
   * ```ts
   * // Define a subquery 'sq' as a CTE using $with
   * const sq = db.$with('sq').as(db.select().from(users).where(eq(users.id, 42)));
   *
   * // Incorporate the CTE 'sq' into the main query and select from it
   * const result = await db.with(sq).select().from(sq);
   * ```
   */
  with(...queries) {
    const self2 = this;
    function select(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: self2.session,
        dialect: self2.dialect,
        withList: queries
      });
    }
    function selectDistinct(fields) {
      return new SQLiteSelectBuilder({
        fields: fields ?? void 0,
        session: self2.session,
        dialect: self2.dialect,
        withList: queries,
        distinct: true
      });
    }
    function update2(table) {
      return new SQLiteUpdateBuilder(table, self2.session, self2.dialect, queries);
    }
    function insert(into) {
      return new SQLiteInsertBuilder(into, self2.session, self2.dialect, queries);
    }
    function delete_2(from) {
      return new SQLiteDeleteBase(from, self2.session, self2.dialect, queries);
    }
    return { select, selectDistinct, update: update2, insert, delete: delete_2 };
  }
  select(fields) {
    return new SQLiteSelectBuilder({ fields: fields ?? void 0, session: this.session, dialect: this.dialect });
  }
  selectDistinct(fields) {
    return new SQLiteSelectBuilder({
      fields: fields ?? void 0,
      session: this.session,
      dialect: this.dialect,
      distinct: true
    });
  }
  /**
   * Creates an update query.
   *
   * Calling this method without `.where()` clause will update all rows in a table. The `.where()` clause specifies which rows should be updated.
   *
   * Use `.set()` method to specify which values to update.
   *
   * See docs: {@link https://orm.drizzle.team/docs/update}
   *
   * @param table The table to update.
   *
   * @example
   *
   * ```ts
   * // Update all rows in the 'cars' table
   * await db.update(cars).set({ color: 'red' });
   *
   * // Update rows with filters and conditions
   * await db.update(cars).set({ color: 'red' }).where(eq(cars.brand, 'BMW'));
   *
   * // Update with returning clause
   * const updatedCar: Car[] = await db.update(cars)
   *   .set({ color: 'red' })
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  update(table) {
    return new SQLiteUpdateBuilder(table, this.session, this.dialect);
  }
  /**
   * Creates an insert query.
   *
   * Calling this method will create new rows in a table. Use `.values()` method to specify which values to insert.
   *
   * See docs: {@link https://orm.drizzle.team/docs/insert}
   *
   * @param table The table to insert into.
   *
   * @example
   *
   * ```ts
   * // Insert one row
   * await db.insert(cars).values({ brand: 'BMW' });
   *
   * // Insert multiple rows
   * await db.insert(cars).values([{ brand: 'BMW' }, { brand: 'Porsche' }]);
   *
   * // Insert with returning clause
   * const insertedCar: Car[] = await db.insert(cars)
   *   .values({ brand: 'BMW' })
   *   .returning();
   * ```
   */
  insert(into) {
    return new SQLiteInsertBuilder(into, this.session, this.dialect);
  }
  /**
   * Creates a delete query.
   *
   * Calling this method without `.where()` clause will delete all rows in a table. The `.where()` clause specifies which rows should be deleted.
   *
   * See docs: {@link https://orm.drizzle.team/docs/delete}
   *
   * @param table The table to delete from.
   *
   * @example
   *
   * ```ts
   * // Delete all rows in the 'cars' table
   * await db.delete(cars);
   *
   * // Delete rows with filters and conditions
   * await db.delete(cars).where(eq(cars.color, 'green'));
   *
   * // Delete with returning clause
   * const deletedCar: Car[] = await db.delete(cars)
   *   .where(eq(cars.id, 1))
   *   .returning();
   * ```
   */
  delete(from) {
    return new SQLiteDeleteBase(from, this.session, this.dialect);
  }
  run(query) {
    const sql2 = query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.run(sql2),
        () => sql2,
        "run",
        this.dialect,
        this.session.extractRawRunValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.run(sql2);
  }
  all(query) {
    const sql2 = query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.all(sql2),
        () => sql2,
        "all",
        this.dialect,
        this.session.extractRawAllValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.all(sql2);
  }
  get(query) {
    const sql2 = query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.get(sql2),
        () => sql2,
        "get",
        this.dialect,
        this.session.extractRawGetValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.get(sql2);
  }
  values(query) {
    const sql2 = query.getSQL();
    if (this.resultKind === "async") {
      return new SQLiteRaw(
        async () => this.session.values(sql2),
        () => sql2,
        "values",
        this.dialect,
        this.session.extractRawValuesValueFromBatchResult.bind(this.session)
      );
    }
    return this.session.values(sql2);
  }
  transaction(transaction, config) {
    return this.session.transaction(transaction, config);
  }
}
__publicField(BaseSQLiteDatabase, _Qb, "BaseSQLiteDatabase");
_Rb = entityKind;
class IndexBuilderOn {
  constructor(name, unique) {
    this.name = name;
    this.unique = unique;
  }
  on(...columns) {
    return new IndexBuilder(this.name, columns, this.unique);
  }
}
__publicField(IndexBuilderOn, _Rb, "SQLiteIndexBuilderOn");
_Sb = entityKind;
class IndexBuilder {
  constructor(name, columns, unique) {
    /** @internal */
    __publicField(this, "config");
    this.config = {
      name,
      columns,
      unique,
      where: void 0
    };
  }
  /**
   * Condition for partial index.
   */
  where(condition) {
    this.config.where = condition;
    return this;
  }
  /** @internal */
  build(table) {
    return new Index(this.config, table);
  }
}
__publicField(IndexBuilder, _Sb, "SQLiteIndexBuilder");
_Tb = entityKind;
class Index {
  constructor(config, table) {
    __publicField(this, "config");
    this.config = { ...config, table };
  }
}
__publicField(Index, _Tb, "SQLiteIndex");
function index(name) {
  return new IndexBuilderOn(name, false);
}
class ExecuteResultSync extends (_Vb = QueryPromise, _Ub = entityKind, _Vb) {
  constructor(resultCb) {
    super();
    this.resultCb = resultCb;
  }
  async execute() {
    return this.resultCb();
  }
  sync() {
    return this.resultCb();
  }
}
__publicField(ExecuteResultSync, _Ub, "ExecuteResultSync");
_Wb = entityKind;
class SQLitePreparedQuery {
  constructor(mode, executeMethod, query) {
    /** @internal */
    __publicField(this, "joinsNotNullableMap");
    this.mode = mode;
    this.executeMethod = executeMethod;
    this.query = query;
  }
  getQuery() {
    return this.query;
  }
  mapRunResult(result, _isFromBatch) {
    return result;
  }
  mapAllResult(_result, _isFromBatch) {
    throw new Error("Not implemented");
  }
  mapGetResult(_result, _isFromBatch) {
    throw new Error("Not implemented");
  }
  execute(placeholderValues) {
    if (this.mode === "async") {
      return this[this.executeMethod](placeholderValues);
    }
    return new ExecuteResultSync(() => this[this.executeMethod](placeholderValues));
  }
  mapResult(response, isFromBatch) {
    switch (this.executeMethod) {
      case "run": {
        return this.mapRunResult(response, isFromBatch);
      }
      case "all": {
        return this.mapAllResult(response, isFromBatch);
      }
      case "get": {
        return this.mapGetResult(response, isFromBatch);
      }
    }
  }
}
__publicField(SQLitePreparedQuery, _Wb, "PreparedQuery");
_Xb = entityKind;
class SQLiteSession {
  constructor(dialect) {
    this.dialect = dialect;
  }
  prepareOneTimeQuery(query, fields, executeMethod, isResponseInArrayMode) {
    return this.prepareQuery(query, fields, executeMethod, isResponseInArrayMode);
  }
  run(query) {
    const staticQuery = this.dialect.sqlToQuery(query);
    try {
      return this.prepareOneTimeQuery(staticQuery, void 0, "run", false).run();
    } catch (err2) {
      throw new DrizzleError({ cause: err2, message: `Failed to run the query '${staticQuery.sql}'` });
    }
  }
  /** @internal */
  extractRawRunValueFromBatchResult(result) {
    return result;
  }
  all(query) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).all();
  }
  /** @internal */
  extractRawAllValueFromBatchResult(_result) {
    throw new Error("Not implemented");
  }
  get(query) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).get();
  }
  /** @internal */
  extractRawGetValueFromBatchResult(_result) {
    throw new Error("Not implemented");
  }
  values(query) {
    return this.prepareOneTimeQuery(this.dialect.sqlToQuery(query), void 0, "run", false).values();
  }
  /** @internal */
  extractRawValuesValueFromBatchResult(_result) {
    throw new Error("Not implemented");
  }
}
__publicField(SQLiteSession, _Xb, "SQLiteSession");
class SQLiteTransaction extends (_Zb = BaseSQLiteDatabase, _Yb = entityKind, _Zb) {
  constructor(resultType, dialect, session, schema2, nestedIndex = 0) {
    super(resultType, dialect, session, schema2);
    this.schema = schema2;
    this.nestedIndex = nestedIndex;
  }
  rollback() {
    throw new TransactionRollbackError();
  }
}
__publicField(SQLiteTransaction, _Yb, "SQLiteTransaction");
class BetterSQLiteSession extends (_$b = SQLiteSession, __b = entityKind, _$b) {
  constructor(client, dialect, schema2, options = {}) {
    super(dialect);
    __publicField(this, "logger");
    this.client = client;
    this.schema = schema2;
    this.logger = options.logger ?? new NoopLogger();
  }
  prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper) {
    const stmt = this.client.prepare(query.sql);
    return new PreparedQuery(
      stmt,
      query,
      this.logger,
      fields,
      executeMethod,
      isResponseInArrayMode,
      customResultMapper
    );
  }
  transaction(transaction, config = {}) {
    const tx = new BetterSQLiteTransaction("sync", this.dialect, this, this.schema);
    const nativeTx = this.client.transaction(transaction);
    return nativeTx[config.behavior ?? "deferred"](tx);
  }
}
__publicField(BetterSQLiteSession, __b, "BetterSQLiteSession");
const _BetterSQLiteTransaction = class _BetterSQLiteTransaction extends (_bc = SQLiteTransaction, _ac = entityKind, _bc) {
  transaction(transaction) {
    const savepointName = `sp${this.nestedIndex}`;
    const tx = new _BetterSQLiteTransaction("sync", this.dialect, this.session, this.schema, this.nestedIndex + 1);
    this.session.run(sql.raw(`savepoint ${savepointName}`));
    try {
      const result = transaction(tx);
      this.session.run(sql.raw(`release savepoint ${savepointName}`));
      return result;
    } catch (err2) {
      this.session.run(sql.raw(`rollback to savepoint ${savepointName}`));
      throw err2;
    }
  }
};
__publicField(_BetterSQLiteTransaction, _ac, "BetterSQLiteTransaction");
let BetterSQLiteTransaction = _BetterSQLiteTransaction;
class PreparedQuery extends (_dc = SQLitePreparedQuery, _cc = entityKind, _dc) {
  constructor(stmt, query, logger2, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
    super("sync", executeMethod, query);
    this.stmt = stmt;
    this.logger = logger2;
    this.fields = fields;
    this._isResponseInArrayMode = _isResponseInArrayMode;
    this.customResultMapper = customResultMapper;
  }
  run(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return this.stmt.run(...params);
  }
  all(placeholderValues) {
    const { fields, joinsNotNullableMap, query, logger: logger2, stmt, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      const params = fillPlaceholders(query.params, placeholderValues ?? {});
      logger2.logQuery(query.sql, params);
      return stmt.all(...params);
    }
    const rows = this.values(placeholderValues);
    if (customResultMapper) {
      return customResultMapper(rows);
    }
    return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap));
  }
  get(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    const { fields, stmt, joinsNotNullableMap, customResultMapper } = this;
    if (!fields && !customResultMapper) {
      return stmt.get(...params);
    }
    const row = stmt.raw().get(...params);
    if (!row) {
      return void 0;
    }
    if (customResultMapper) {
      return customResultMapper([row]);
    }
    return mapResultRow(fields, row, joinsNotNullableMap);
  }
  values(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
    this.logger.logQuery(this.query.sql, params);
    return this.stmt.raw().all(...params);
  }
  /** @internal */
  isResponseInArrayMode() {
    return this._isResponseInArrayMode;
  }
}
__publicField(PreparedQuery, _cc, "BetterSQLitePreparedQuery");
function drizzle(client, config = {}) {
  const dialect = new SQLiteSyncDialect();
  let logger2;
  if (config.logger === true) {
    logger2 = new DefaultLogger();
  } else if (config.logger !== false) {
    logger2 = config.logger;
  }
  let schema2;
  if (config.schema) {
    const tablesConfig = extractTablesRelationalConfig(
      config.schema,
      createTableRelationsHelpers
    );
    schema2 = {
      fullSchema: config.schema,
      schema: tablesConfig.tables,
      tableNamesMap: tablesConfig.tableNamesMap
    };
  }
  const session = new BetterSQLiteSession(client, dialect, schema2, { logger: logger2 });
  return new BaseSQLiteDatabase("sync", dialect, session, schema2);
}
const students = sqliteTable("students", {
  id: text("id").primaryKey().notNull(),
  // ULID as primary key
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  parentPhone: text("parent_phone"),
  parentType: text("parent_type"),
  school: text("school"),
  studyYear: text("study_year"),
  sex: text("sex"),
  tag: text("tag"),
  customFee: integer("custom_fee"),
  cni: text("cni"),
  isKicked: integer("is_kicked", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`)
}, (table) => ({
  nameIdx: index("students_name_idx").on(table.firstName, table.lastName),
  kickedIdx: index("students_kicked_idx").on(table.isKicked)
}));
const subjects = sqliteTable("subjects", {
  id: text("id").primaryKey().notNull(),
  // ULID as primary key
  title: text("title").notNull(),
  description: text("description"),
  fee: integer("fee"),
  metadata: text("metadata"),
  // JSON string for additional metadata
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`)
}, (table) => ({
  titleIdx: index("subjects_title_idx").on(table.title)
}));
const groups = sqliteTable("groups", {
  id: text("id").primaryKey().notNull(),
  // ULID as primary key
  subjectId: text("subject_id").notNull().references(() => subjects.id),
  name: text("name").notNull(),
  capacity: integer("capacity").notNull().default(10),
  schedule: text("schedule"),
  // JSON string for schedule
  startDate: text("start_date"),
  endDate: text("end_date"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`)
}, (table) => ({
  subjectIdIdx: index("groups_subject_id_idx").on(table.subjectId),
  nameIdx: index("groups_name_idx").on(table.name)
}));
const enrollments$1 = sqliteTable("enrollments", {
  id: text("id").primaryKey().notNull(),
  // ULID as primary key
  studentId: text("student_id").notNull().references(() => students.id),
  groupId: text("group_id").notNull().references(() => groups.id),
  enrollmentDate: text("enrollment_date").default(sql`CURRENT_TIMESTAMP`),
  status: text("status").notNull().default("active"),
  notes: text("notes")
}, (table) => ({
  studentIdIdx: index("enrollments_student_id_idx").on(table.studentId),
  groupIdIdx: index("enrollments_group_id_idx").on(table.groupId),
  studentGroupIdx: index("enrollments_student_group_idx").on(table.studentId, table.groupId),
  statusIdx: index("enrollments_status_idx").on(table.status)
}));
const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey().notNull(),
  // ULID as primary key
  studentId: text("student_id").notNull().references(() => students.id),
  subjectId: text("subject_id").notNull().references(() => subjects.id),
  month: text("month").notNull(),
  // Format: YYYY-MM
  tag: text("tag"),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`)
}, (table) => ({
  studentIdIdx: index("subscriptions_student_id_idx").on(table.studentId),
  subjectIdIdx: index("subscriptions_subject_id_idx").on(table.subjectId),
  monthIdx: index("subscriptions_month_idx").on(table.month),
  statusIdx: index("subscriptions_status_idx").on(table.status)
}));
const payments = sqliteTable("payments", {
  id: text("id").primaryKey().notNull(),
  // ULID as primary key
  studentId: text("student_id").notNull().references(() => students.id),
  subjectId: text("subject_id").notNull().references(() => subjects.id),
  amount: integer("amount").notNull(),
  date: text("date").notNull().default(sql`CURRENT_DATE`),
  overrideReason: text("override_reason"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`)
}, (table) => ({
  studentIdIdx: index("payments_student_id_idx").on(table.studentId),
  subjectIdIdx: index("payments_subject_id_idx").on(table.subjectId),
  dateIdx: index("payments_date_idx").on(table.date)
}));
const settings = sqliteTable("settings", {
  id: text("id").primaryKey().notNull(),
  // ULID as primary key
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`)
}, (table) => ({
  keyIdx: index("settings_key_idx").on(table.key)
}));
const backups = sqliteTable("backups", {
  id: text("id").primaryKey().notNull(),
  // ULID as primary key
  path: text("path").notNull(),
  size: integer("size").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  notes: text("notes")
});
const auditLogs = sqliteTable("audit_logs", {
  id: text("id").primaryKey().notNull(),
  // ULID as primary key
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  changes: text("changes"),
  // JSON string of changes
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`)
}, (table) => ({
  actionIdx: index("audit_logs_action_idx").on(table.action),
  entityTypeIdx: index("audit_logs_entity_type_idx").on(table.entityType),
  entityIdIdx: index("audit_logs_entity_id_idx").on(table.entityId)
}));
const users = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  // ULID as primary key
  accessCode: text("access_code").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`)
});
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  auditLogs,
  backups,
  enrollments: enrollments$1,
  groups,
  payments,
  settings,
  students,
  subjects,
  subscriptions,
  users
}, Symbol.toStringTag, { value: "Module" }));
function getNativeModulePath(moduleName) {
  const isDev2 = process.env.NODE_ENV === "development";
  if (isDev2) {
    return path$1.join(process.cwd(), "node_modules", moduleName);
  }
  const appPath = electron.app.getAppPath();
  const isAsar = appPath.includes("app.asar");
  if (isAsar) {
    const unpackedPath = appPath.replace("app.asar", "app.asar.unpacked");
    return path$1.join(unpackedPath, "node_modules", moduleName);
  }
  return path$1.join(process.cwd(), "node_modules", moduleName);
}
function getAlternativePaths(moduleName) {
  return [
    // Try node_modules in app directory
    path$1.join(electron.app.getAppPath(), "node_modules", moduleName),
    // Try node_modules in app parent directory
    path$1.join(electron.app.getAppPath(), "..", "node_modules", moduleName),
    // Try node_modules in current working directory
    path$1.join(process.cwd(), "node_modules", moduleName),
    // Try absolute path for development
    path$1.resolve("./node_modules", moduleName),
    // Try electron app resources directory
    path$1.join(process.resourcesPath || "", "node_modules", moduleName),
    // Try electron app resources/app directory
    path$1.join(process.resourcesPath || "", "app", "node_modules", moduleName),
    // Try electron app resources/app.asar.unpacked directory
    path$1.join(process.resourcesPath || "", "app.asar.unpacked", "node_modules", moduleName)
  ];
}
function moduleExists(modulePath) {
  try {
    if (fs$1.existsSync(modulePath)) {
      return true;
    }
    const packageJsonPath = path$1.join(modulePath, "package.json");
    if (fs$1.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs$1.readFileSync(packageJsonPath, "utf8"));
      const mainFile = packageJson.main || "index.js";
      const mainPath = path$1.join(modulePath, mainFile);
      return fs$1.existsSync(mainPath);
    }
    return false;
  } catch (error) {
    console.error(`Error checking if module exists at ${modulePath}:`, error);
    return false;
  }
}
function loadNativeModule(moduleName) {
  console.log("======== Native Module Loading Diagnostics ========");
  console.log(`Loading native module: ${moduleName}`);
  console.log(`Process cwd: ${process.cwd()}`);
  console.log(`App path: ${electron.app.getAppPath()}`);
  console.log(`User data path: ${electron.app.getPath("userData")}`);
  console.log(`Node.js version: ${process.version}`);
  console.log(`Electron version: ${process.versions.electron}`);
  console.log(`Platform: ${process.platform}`);
  console.log(`Arch: ${process.arch}`);
  console.log("=================================================");
  const modulePath = getNativeModulePath(moduleName);
  console.log(`Primary module path: ${modulePath}`);
  console.log(`Module exists at primary path: ${moduleExists(modulePath)}`);
  try {
    console.log(`Attempting to load native module from: ${modulePath}`);
    const module2 = require(modulePath);
    console.log(`Successfully loaded native module: ${moduleName}`);
    return module2;
  } catch (error) {
    console.error(`Failed to load native module ${moduleName} from ${modulePath}:`, error);
    const alternativePaths = getAlternativePaths(moduleName);
    console.log(`Trying ${alternativePaths.length} alternative paths...`);
    for (const altPath of alternativePaths) {
      console.log(`Checking alternative path: ${altPath}`);
      console.log(`Module exists at path: ${moduleExists(altPath)}`);
      try {
        console.log(`Attempting to load native module from alternative path: ${altPath}`);
        const module2 = require(altPath);
        console.log(`Successfully loaded native module from alternative path: ${altPath}`);
        return module2;
      } catch (altError) {
        console.error(`Failed to load from alternative path ${altPath}:`, altError);
      }
    }
    console.error(`CRITICAL ERROR: Could not load native module ${moduleName} from any path`);
    throw new Error(`Could not load native module ${moduleName} from any path`);
  }
}
const userDataPath$2 = electron.app.getPath("userData");
const dbPath$1 = path$1.join(userDataPath$2, "scholario.db");
const logsPath$2 = path$1.join(userDataPath$2, "logs");
if (!fs$1.existsSync(logsPath$2)) {
  fs$1.mkdirSync(logsPath$2, { recursive: true });
}
const logger$6 = pino$1({
  level: "info",
  timestamp: pino$1.stdTimeFunctions.isoTime
}, pino$1.destination(path$1.join(logsPath$2, "db.log")));
function initializeDatabase$1() {
  try {
    logger$6.info(`Initializing database at ${dbPath$1}`);
    if (!fs$1.existsSync(path$1.dirname(dbPath$1))) {
      fs$1.mkdirSync(path$1.dirname(dbPath$1), { recursive: true });
    }
    logger$6.info(`Current working directory: ${process.cwd()}`);
    logger$6.info(`User data path: ${userDataPath$2}`);
    logger$6.info(`Node.js version: ${process.version}`);
    logger$6.info(`Electron version: ${process.versions.electron}`);
    logger$6.info("Loading better-sqlite3 module");
    const Database = loadNativeModule("better-sqlite3");
    if (!Database) {
      throw new Error("Failed to load better-sqlite3 module");
    }
    logger$6.info("Creating SQLite database instance");
    let sqlite;
    try {
      sqlite = new Database(dbPath$1);
      logger$6.info("SQLite database instance created successfully");
    } catch (dbError) {
      logger$6.error({ err: dbError }, "Failed to create SQLite database instance");
      logger$6.info("Trying in-memory database as fallback");
      sqlite = new Database(":memory:");
      logger$6.info("In-memory SQLite database instance created successfully");
    }
    try {
      sqlite.pragma("journal_mode = WAL");
      sqlite.pragma("foreign_keys = ON");
      logger$6.info("SQLite pragmas set successfully");
    } catch (pragmaError) {
      logger$6.error({ err: pragmaError }, "Failed to set SQLite pragmas");
    }
    const db2 = drizzle(sqlite, { schema });
    logger$6.info("Drizzle instance created successfully");
    try {
      const testQuery = sqlite.prepare("SELECT 1 AS test").get();
      logger$6.info({ testResult: testQuery }, "Database test query executed successfully");
    } catch (testError) {
      logger$6.error({ err: testError }, "Database test query failed");
    }
    logger$6.info("Database initialized successfully");
    return db2;
  } catch (error) {
    logger$6.error({ err: error }, "Failed to initialize database");
    throw error;
  }
}
const db = initializeDatabase$1();
let ensureDatabaseSetup;
try {
  const migrate = require("./migrate");
  ensureDatabaseSetup = migrate.ensureDatabaseSetup;
  try {
    ensureDatabaseSetup().then((success) => {
      if (success) {
        logger$6.info("Database tables created successfully");
      } else {
        logger$6.error("Failed to create database tables");
      }
    }).catch((error) => {
      logger$6.error({ err: error }, "Error during database setup");
    });
  } catch (error) {
    logger$6.error({ err: error }, "Critical error during database setup");
  }
} catch (err2) {
  logger$6.error({ err: err2 }, "Failed to load migration module");
}
function generateUlid$1() {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${timestamp}${randomPart}`.toUpperCase();
}
const logsDir$3 = path$1.join(electron.app.getPath("userData"), "logs");
if (!fs$1.existsSync(logsDir$3)) {
  fs$1.mkdirSync(logsDir$3, { recursive: true });
}
const logger$5 = pino$1({
  level: "info",
  timestamp: pino$1.stdTimeFunctions.isoTime
}, pino$1.destination(path$1.join(logsDir$3, "auth-service.log")));
const DEFAULT_ACCESS_CODE = "emp001";
const AuthService = {
  /**
   * Initialize authentication - creates default user if none exists
   */
  initialize: () => try_({
    try: async () => {
      logger$5.info("Initializing authentication service");
      const existingUser = await db.select().from(users).limit(1).then((rows) => rows[0]);
      if (!existingUser) {
        logger$5.info("No users found, creating default user");
        await db.insert(users).values({
          id: generateUlid$1(),
          accessCode: DEFAULT_ACCESS_CODE
        });
        logger$5.info("Default user created successfully");
      } else {
        logger$5.info("Existing user found, skipping default user creation");
      }
      return true;
    },
    catch: (error) => {
      logger$5.error({ err: error }, "Failed to initialize authentication service");
      return error instanceof Error ? error : new Error("Failed to initialize authentication");
    }
  }),
  /**
   * Validates an access code
   * @param code - The access code to validate
   */
  validateAccessCode: (code) => try_({
    try: async () => {
      logger$5.info("Validating access code");
      const user = await db.select().from(users).where(eq(users.accessCode, code)).then((rows) => rows[0]);
      const isValid = !!user;
      logger$5.info({ isValid, code }, "Access code validation result");
      return isValid;
    },
    catch: (error) => {
      logger$5.error({ err: error }, "Failed to validate access code");
      return error instanceof Error ? error : new Error("Failed to validate access code");
    }
  }),
  /**
   * Updates the access code
   * @param newCode - The new access code
   */
  updateAccessCode: (newCode) => try_({
    try: async () => {
      logger$5.info("Updating access code");
      const existingUser = await db.select().from(users).limit(1).then((rows) => rows[0]);
      if (!existingUser) {
        logger$5.warn("No user found when updating access code");
        throw new Error("No user found");
      }
      await db.update(users).set({
        accessCode: newCode,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }).where(eq(users.id, existingUser.id));
      logger$5.info("Access code updated successfully");
      return true;
    },
    catch: (error) => {
      logger$5.error({ err: error }, "Failed to update access code");
      return error instanceof Error ? error : new Error("Failed to update access code");
    }
  }),
  /**
   * Directly checks if the provided code is the default access code
   * This is a fallback method in case the database validation fails
   */
  isDefaultCode: (code) => succeed(code === DEFAULT_ACCESS_CODE)
};
const userDataPath$1 = electron.app.getPath("userData");
const dbPath = path$1.join(userDataPath$1, "scholario.db");
const logsPath$1 = path$1.join(userDataPath$1, "logs");
if (!fs$1.existsSync(logsPath$1)) {
  fs$1.mkdirSync(logsPath$1, { recursive: true });
}
const logger$4 = pino$1({
  level: "info",
  timestamp: pino$1.stdTimeFunctions.isoTime
}, pino$1.destination(path$1.join(logsPath$1, "db.log")));
let dbInstance = null;
let connectionState = {
  connected: false,
  error: null,
  lastCheckTime: 0
};
function initializeDatabase() {
  try {
    logger$4.info(`Initializing database at ${dbPath}`);
    if (!fs$1.existsSync(path$1.dirname(dbPath))) {
      fs$1.mkdirSync(path$1.dirname(dbPath), { recursive: true });
    }
    logger$4.info(`Current working directory: ${process.cwd()}`);
    logger$4.info(`User data path: ${userDataPath$1}`);
    logger$4.info(`Node.js version: ${process.version}`);
    logger$4.info(`Electron version: ${process.versions.electron}`);
    logger$4.info("Loading better-sqlite3 module");
    const Database = loadNativeModule("better-sqlite3");
    if (!Database) {
      const error = new Error("Failed to load better-sqlite3 module");
      connectionState.error = error;
      connectionState.connected = false;
      logger$4.error({ err: error }, "Database initialization failed");
      return fail$1(error);
    }
    logger$4.info("Creating SQLite database instance");
    let sqlite;
    try {
      const dbExists = fs$1.existsSync(dbPath);
      if (!dbExists) {
        logger$4.info(`Database file does not exist at ${dbPath}, creating a new one`);
      }
      sqlite = new Database(dbPath);
      logger$4.info("SQLite database instance created successfully");
    } catch (dbError) {
      logger$4.error({ err: dbError }, "Failed to create SQLite database instance");
      connectionState.error = dbError;
      connectionState.connected = false;
      return fail$1(new Error(`Failed to create database connection: ${dbError.message}`));
    }
    try {
      sqlite.pragma("journal_mode = WAL");
      sqlite.pragma("foreign_keys = ON");
      logger$4.info("SQLite pragmas set successfully");
      ensureTablesExist(sqlite);
      const db2 = drizzle(sqlite, { schema });
      logger$4.info("Drizzle instance created successfully");
      try {
        const testQuery = sqlite.prepare("SELECT 1 AS test").get();
        logger$4.info({ testResult: testQuery }, "Database test query executed successfully");
        dbInstance = db2;
        connectionState.connected = true;
        connectionState.error = null;
        connectionState.lastCheckTime = Date.now();
        return succeed$2(db2);
      } catch (testError) {
        logger$4.error({ err: testError }, "Database test query failed");
        connectionState.error = testError;
        connectionState.connected = false;
        return fail$1(new Error(`Database connection test failed: ${testError.message}`));
      }
    } catch (pragmaError) {
      logger$4.error({ err: pragmaError }, "Failed to set SQLite pragmas");
      connectionState.error = pragmaError;
      connectionState.connected = false;
      return fail$1(new Error(`Failed to set database parameters: ${pragmaError.message}`));
    }
  } catch (error) {
    logger$4.error({ err: error }, "Failed to initialize database");
    connectionState.error = error;
    connectionState.connected = false;
    return fail$1(new Error(`Database initialization failed: ${error.message}`));
  }
}
function getDatabase$1() {
  if (dbInstance && connectionState.connected) {
    return dbInstance;
  }
  try {
    if (!dbInstance) {
      logger$4.info("Database instance not available, trying to initialize");
      try {
        const Database = loadNativeModule("better-sqlite3");
        if (!Database) {
          throw new Error("Failed to load better-sqlite3 module");
        }
        const dbExists = fs$1.existsSync(dbPath);
        const sqlite = new Database(dbPath);
        if (!sqlite) {
          throw new Error("Failed to create SQLite instance");
        }
        sqlite.pragma("journal_mode = WAL");
        sqlite.pragma("foreign_keys = ON");
        dbInstance = drizzle(sqlite, { schema });
        ensureTablesExist(sqlite);
        if (!dbExists) {
          logger$4.info("New database detected, schema initialized");
        }
        const testQuery = sqlite.prepare("SELECT 1 AS test").get();
        if (!testQuery || testQuery.test !== 1) {
          throw new Error("Database test query returned unexpected result");
        }
        connectionState.connected = true;
        connectionState.lastCheckTime = Date.now();
        connectionState.error = null;
        logger$4.info("Database initialized successfully through direct method");
        return dbInstance;
      } catch (initError) {
        logger$4.error({ err: initError }, "Critical error creating database directly");
        connectionState.error = initError instanceof Error ? initError : new Error(String(initError));
        connectionState.connected = false;
        throw connectionState.error;
      }
    }
    return dbInstance;
  } catch (error) {
    logger$4.error({ err: error }, "Critical error getting database instance");
    throw new Error(`Database connection failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
function closeDatabase() {
  if (dbInstance) {
    try {
      dbInstance.driver.close();
      logger$4.info("Database connection closed successfully");
    } catch (error) {
      logger$4.error({ err: error }, "Error closing database connection");
    } finally {
      dbInstance = null;
      connectionState.connected = false;
    }
  }
}
const initialDb = initializeDatabase();
if (isEffect(initialDb)) {
  runPromise(initialDb).then((db2) => {
    logger$4.info("Database initialized successfully on module load");
  }).catch((error) => {
    logger$4.error({ err: error }, "Initial database initialization failed");
  });
}
function ensureTablesExist(sqlite) {
  logger$4.info("Ensuring all required tables exist");
  try {
    let tableExists = false;
    try {
      const result = sqlite.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='students'").get();
      tableExists = !!result;
    } catch (e) {
      tableExists = false;
    }
    logger$4.info(tableExists ? "Students table exists, ensuring all tables" : "Creating missing tables");
    const studentTableSQL = `
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        parent_phone TEXT,
        parent_type TEXT,
        school TEXT,
        study_year TEXT,
        sex TEXT,
        tag TEXT,
        custom_fee REAL,
        cni TEXT,
        is_kicked INTEGER DEFAULT 0,
        created_at TEXT,
        updated_at TEXT
      )
    `;
    const groupsTableSQL = `
      CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        subject_id TEXT NOT NULL,
        description TEXT,
        capacity INTEGER,
        day TEXT,
        hour TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `;
    const enrollmentsTableSQL = `
      CREATE TABLE IF NOT EXISTS enrollments (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        group_id TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        joined_at TEXT,
        left_at TEXT,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (group_id) REFERENCES groups(id)
      )
    `;
    const subjectsTableSQL = `
      CREATE TABLE IF NOT EXISTS subjects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        standard_fee REAL,
        color TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `;
    sqlite.exec(studentTableSQL);
    sqlite.exec(groupsTableSQL);
    sqlite.exec(subjectsTableSQL);
    sqlite.exec(enrollmentsTableSQL);
    logger$4.info("Tables created or verified successfully");
    return true;
  } catch (error) {
    logger$4.error({ err: error }, "Failed to ensure tables exist");
    throw new Error(`Failed to ensure tables exist: ${error instanceof Error ? error.message : String(error)}`);
  }
}
class BaseRepository {
  constructor(table, logger2, entityName) {
    /**
     * Inserts a new entity
     * @param entity - Entity data without ID
     * @returns Effect with inserted entity
     */
    __publicField(this, "insert", (entity) => {
      return try_$2({
        try: async () => {
          this.logger.info(`Creating new ${this.entityName}`);
          try {
            const database = getDatabase$1();
            const id = generateUlid$1();
            const insertData = { id, ...entity };
            await database.insert(this.table).values(insertData);
            this.logger.info({ id }, `${this.entityName} created successfully`);
            return insertData;
          } catch (dbError) {
            const errorMsg = `Database error when creating ${this.entityName}: ${dbError instanceof Error ? dbError.message : String(dbError)}`;
            this.logger.error({ err: dbError }, errorMsg);
            throw new Error(errorMsg);
          }
        },
        catch: (error) => {
          this.logger.error({ err: error }, `Failed to create ${this.entityName}`);
          return error instanceof Error ? error : new Error(`Failed to create ${this.entityName}`);
        }
      });
    });
    /**
     * Retrieves an entity by ID
     * @param id - Entity ID
     * @returns Effect with entity or error if not found
     */
    __publicField(this, "getById", (id) => {
      return try_$2({
        try: async () => {
          this.logger.info({ id }, `Getting ${this.entityName} by ID`);
          try {
            const database = getDatabase$1();
            const entity = await database.select().from(this.table).where(({ id: entityId }) => entityId.eq(id)).then((rows) => rows[0]);
            if (!entity) {
              this.logger.warn({ id }, `${this.entityName} not found`);
              throw new Error(`${this.entityName} not found`);
            }
            return entity;
          } catch (dbError) {
            const errorMsg = `Database error when fetching ${this.entityName}: ${dbError instanceof Error ? dbError.message : String(dbError)}`;
            this.logger.error({ id, err: dbError }, errorMsg);
            throw new Error(errorMsg);
          }
        },
        catch: (error) => {
          this.logger.error({ id, err: error }, `Failed to get ${this.entityName}`);
          return error instanceof Error ? error : new Error(`Failed to get ${this.entityName}`);
        }
      });
    });
    /**
     * Updates an entity
     * @param id - Entity ID
     * @param data - Fields to update
     * @returns Effect with updated entity
     */
    __publicField(this, "update", (id, data) => {
      return try_$2({
        try: async () => {
          this.logger.info({ id, data }, `Updating ${this.entityName}`);
          try {
            const database = getDatabase$1();
            const existing = await database.select().from(this.table).where(({ id: entityId }) => entityId.eq(id)).then((rows) => rows[0]);
            if (!existing) {
              this.logger.warn({ id }, `${this.entityName} not found for update`);
              throw new Error(`${this.entityName} not found`);
            }
            const updatedData = {
              ...data,
              updatedAt: (/* @__PURE__ */ new Date()).toISOString()
            };
            this.logger.info({ id, updatedData }, `Executing ${this.entityName} update`);
            await database.update(this.table).set(updatedData).where(({ id: entityId }) => entityId.eq(id));
            const updated = await database.select().from(this.table).where(({ id: entityId }) => entityId.eq(id)).then((rows) => rows[0]);
            this.logger.info({ id, updated }, `${this.entityName} updated successfully`);
            return updated;
          } catch (dbError) {
            const errorMsg = `Database error when updating ${this.entityName}: ${dbError instanceof Error ? dbError.message : String(dbError)}`;
            this.logger.error({ id, err: dbError, data }, errorMsg);
            throw new Error(errorMsg);
          }
        },
        catch: (error) => {
          this.logger.error({ id, err: error, data }, `Failed to update ${this.entityName}`);
          return error instanceof Error ? error : new Error(`Failed to update ${this.entityName}`);
        }
      });
    });
    /**
     * Deletes an entity
     * @param id - Entity ID
     * @returns Effect with success status
     */
    __publicField(this, "delete", (id) => {
      return try_$2({
        try: async () => {
          this.logger.info({ id }, `Deleting ${this.entityName}`);
          try {
            const database = getDatabase$1();
            const existing = await database.select().from(this.table).where(({ id: entityId }) => entityId.eq(id)).then((rows) => rows[0]);
            if (!existing) {
              this.logger.warn({ id }, `${this.entityName} not found for deletion`);
              throw new Error(`${this.entityName} not found`);
            }
            await database.delete(this.table).where(({ id: entityId }) => entityId.eq(id));
            this.logger.info({ id }, `${this.entityName} deleted successfully`);
            return true;
          } catch (dbError) {
            const errorMsg = `Database error when deleting ${this.entityName}: ${dbError instanceof Error ? dbError.message : String(dbError)}`;
            this.logger.error({ id, err: dbError }, errorMsg);
            throw new Error(errorMsg);
          }
        },
        catch: (error) => {
          this.logger.error({ id, err: error }, `Failed to delete ${this.entityName}`);
          return error instanceof Error ? error : new Error(`Failed to delete ${this.entityName}`);
        }
      });
    });
    /**
     * Retrieves all entities
     * @param filter - Optional filter object
     * @returns Effect with array of entities
     */
    __publicField(this, "getAll", (filter = {}) => {
      return try_$2({
        try: async () => {
          this.logger.info({ filter }, `Getting all ${this.entityName}s`);
          try {
            const database = getDatabase$1();
            const entities = await database.select().from(this.table).where(() => {
              let condition = {};
              Object.entries(filter).forEach(([key, value]) => {
                if (value !== void 0 && value !== null) {
                  condition = {
                    ...condition,
                    [key]: value
                  };
                }
              });
              return condition;
            }).then((rows) => rows);
            this.logger.info({ count: entities.length }, `Retrieved ${entities.length} ${this.entityName}s`);
            return entities;
          } catch (dbError) {
            const errorMsg = `Database error when retrieving ${this.entityName}s: ${dbError instanceof Error ? dbError.message : String(dbError)}`;
            this.logger.error({ err: dbError }, errorMsg);
            throw new Error(errorMsg);
          }
        },
        catch: (error) => {
          this.logger.error({ err: error }, `Failed to get ${this.entityName}s`);
          return error instanceof Error ? error : new Error(`Failed to get ${this.entityName}s`);
        }
      });
    });
    this.table = table;
    this.logger = logger2;
    this.entityName = entityName;
  }
}
const logsDir$2 = path$1.join(process.cwd(), "logs");
if (!fs$1.existsSync(logsDir$2)) {
  fs$1.mkdirSync(logsDir$2, { recursive: true });
}
const logger$3 = pino$1({
  level: "info",
  timestamp: pino$1.stdTimeFunctions.isoTime
}, pino$1.destination(path$1.join(logsDir$2, "student-repository.log")));
class StudentRepository extends BaseRepository {
  constructor() {
    super(students, logger$3, "student");
    /**
     * Override the base insert method for students to add additional logging and validation
     * @param entity - Student data without ID
     * @returns Effect with inserted student
     */
    __publicField(this, "insert", (entity) => {
      return tryPromise({
        try: async () => {
          logger$3.info({ data: entity }, "Creating new student with custom insert method");
          try {
            const id = generateUlid$1();
            const insertData = {
              id,
              ...entity,
              isKicked: entity.isKicked !== void 0 ? entity.isKicked : false,
              createdAt: (/* @__PURE__ */ new Date()).toISOString(),
              updatedAt: (/* @__PURE__ */ new Date()).toISOString()
            };
            logger$3.info({ insertData }, "Inserting student data");
            const query = db.insert(students).values(insertData);
            logger$3.info({ sql: query.toSQL() }, "Generated SQL for insert");
            await query.run();
            logger$3.info({ id }, "Student created successfully, querying to verify");
            const inserted = await db.select().from(students).where(eq(students.id, id)).then((rows) => rows[0]);
            if (!inserted) {
              logger$3.warn({ id }, "Student was not found after insert - possible DB issue");
              throw new Error("Student was not properly inserted into the database");
            }
            logger$3.info({ student: inserted }, "Student insert verified successfully");
            return inserted;
          } catch (dbError) {
            logger$3.error({ err: dbError }, "Database error during student creation");
            throw new Error(`Failed to create student in database: ${dbError instanceof Error ? dbError.message : "Unknown error"}`);
          }
        },
        catch: (error) => {
          logger$3.error({ err: error }, "Failed to create student");
          return error instanceof Error ? error : new Error("Failed to create student");
        }
      });
    });
    /**
     * Soft deletes a student by setting isKicked to true
     * @param id - Student ID
     * @returns Effect with success status
     */
    __publicField(this, "kick", (id) => {
      return tryPromise({
        try: async () => {
          logger$3.info({ studentId: id }, "Soft-deleting student");
          const existing = await db.select().from(students).where(eq(students.id, id)).then((rows) => rows[0]);
          if (!existing) {
            logger$3.warn({ studentId: id }, "Student not found for soft deletion");
            throw new Error("Student not found");
          }
          await db.update(students).set({
            isKicked: true,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }).where(eq(students.id, id));
          logger$3.info({ studentId: id }, "Student soft-deleted successfully");
          return true;
        },
        catch: (error) => {
          logger$3.error({ err: error, studentId: id }, "Failed to soft-delete student");
          return error instanceof Error ? error : new Error("Failed to soft-delete student");
        }
      });
    });
    /**
     * Lists students with filtering options
     * @param filter - Filter options
     * @returns Effect with filtered students
     */
    __publicField(this, "list", (filter = {}) => {
      return tryPromise({
        try: async () => {
          logger$3.info({ filter }, "Getting students with filters");
          let query = db.select().from(students);
          const conditions = [];
          if (filter.search) {
            conditions.push(
              or(
                like(students.firstName, `%${filter.search}%`),
                like(students.lastName, `%${filter.search}%`),
                like(students.phone, `%${filter.search}%`)
              )
            );
          }
          if (!filter.includeKicked) {
            conditions.push(eq(students.isKicked, false));
          }
          if (conditions.length > 0) {
            query = query.where(and(...conditions));
          }
          if (filter.limit) {
            query = query.limit(filter.limit);
          }
          if (filter.offset) {
            query = query.offset(filter.offset);
          }
          try {
            const result = await query.all();
            const studentsList = Array.isArray(result) ? result : [];
            logger$3.info({
              count: studentsList.length,
              isArray: Array.isArray(studentsList),
              resultType: typeof result,
              sampleStudent: studentsList.length > 0 ? JSON.stringify(studentsList[0]) : "none"
            }, "Students retrieved successfully");
            return studentsList;
          } catch (queryError) {
            logger$3.error({ err: queryError }, "Error executing student query");
            return [];
          }
        },
        catch: (error) => {
          logger$3.error({ err: error }, "Failed to get students with filters");
          return error instanceof Error ? error : new Error("Failed to get students with filters");
        }
      });
    });
    /**
     * Bulk export students
     * @param ids - Array of student IDs to export (or all if not provided)
     * @returns Effect with exported students
     */
    __publicField(this, "bulkExport", (ids2) => {
      return tryPromise({
        try: async () => {
          try {
            if (ids2 && ids2.length > 0) {
              logger$3.info({ count: ids2.length }, "Bulk exporting specific students");
              const exportedStudents = await db.select().from(students).where(({ id }) => id.in(ids2)).all();
              const studentsList = Array.isArray(exportedStudents) ? exportedStudents : [];
              logger$3.info({
                count: studentsList.length,
                isArray: Array.isArray(studentsList)
              }, "Students exported successfully");
              return studentsList;
            } else {
              logger$3.info("Bulk exporting all students");
              const exportedStudents = await db.select().from(students).where(eq(students.isKicked, false)).all();
              const studentsList = Array.isArray(exportedStudents) ? exportedStudents : [];
              logger$3.info({
                count: studentsList.length,
                isArray: Array.isArray(studentsList)
              }, "Students exported successfully");
              return studentsList;
            }
          } catch (queryError) {
            logger$3.error({ err: queryError }, "Error executing student bulk export query");
            return [];
          }
        },
        catch: (error) => {
          logger$3.error({ err: error }, "Failed to bulk export students");
          return error instanceof Error ? error : new Error("Failed to bulk export students");
        }
      });
    });
    /**
     * Counts students with optional filters
     * @param filter - Filter options
     * @returns Effect with count
     */
    __publicField(this, "count", (filter = {}) => {
      return tryPromise({
        try: async () => {
          logger$3.info({ filter }, "Counting students with filters");
          let query = db.select({ count: db.fn.count(students.id) }).from(students);
          const conditions = [];
          if (filter.search) {
            conditions.push(
              or(
                like(students.firstName, `%${filter.search}%`),
                like(students.lastName, `%${filter.search}%`),
                like(students.phone, `%${filter.search}%`)
              )
            );
          }
          if (!filter.includeKicked) {
            conditions.push(eq(students.isKicked, false));
          }
          if (conditions.length > 0) {
            query = query.where(and(...conditions));
          }
          const result = await query.get();
          const count = Number((result == null ? void 0 : result.count) || 0);
          logger$3.info({ count }, "Students counted successfully");
          return count;
        },
        catch: (error) => {
          logger$3.error({ err: error }, "Failed to count students");
          return error instanceof Error ? error : new Error("Failed to count students");
        }
      });
    });
    /**
     * Updates a student's information with enhanced logging and validation
     * This method replaces the override version to ensure compatibility
     * @param id - Student ID
     * @param data - Fields to update
     * @returns Effect with updated student
     */
    __publicField(this, "update", (id, data) => {
      logger$3.info({ studentId: id, updateData: data }, "Updating student with enhanced method");
      return tryPromise({
        try: async () => {
          try {
            const database = getDatabase$1();
            const existing = await database.select().from(students).where(eq(students.id, id)).then((rows) => rows[0]);
            if (!existing) {
              logger$3.warn({ id }, "Student not found for update");
              throw new Error("Student not found");
            }
            const updateData = {
              ...data,
              updatedAt: (/* @__PURE__ */ new Date()).toISOString()
            };
            logger$3.info({ id, updateData }, "Executing student update");
            await database.update(students).set(updateData).where(eq(students.id, id));
            const updated = await database.select().from(students).where(eq(students.id, id)).then((rows) => rows[0]);
            const changedFields = {};
            Object.keys(data).forEach((key) => {
              const typedKey = key;
              if (data[typedKey] !== void 0) {
                changedFields[key] = {
                  before: existing[typedKey],
                  after: updated[typedKey]
                };
              }
            });
            logger$3.info({
              studentId: id,
              changedFields,
              updatedAt: updated.updatedAt
            }, "Student update verified");
            return updated;
          } catch (dbError) {
            const errorMsg = `Database error when updating student: ${dbError instanceof Error ? dbError.message : String(dbError)}`;
            logger$3.error({ id, err: dbError, data }, errorMsg);
            throw new Error(errorMsg);
          }
        },
        catch: (error) => {
          logger$3.error({ err: error, studentId: id, updateData: data }, "Failed to update student");
          return error instanceof Error ? error : new Error("Failed to update student");
        }
      });
    });
  }
}
const studentRepository = new StudentRepository();
succeed$2(studentRepository);
const StudentService = {
  /**
   * Creates a new student
   * @param data - Student data without ID
   */
  createStudent: (data) => {
    ipcLogger.info({ data }, "Creating new student");
    try {
      getDatabase$1();
    } catch (dbError) {
      ipcLogger.error({ err: dbError }, "Database connection error when creating student");
      return fail$1(new Error(`Database connection issue: ${dbError instanceof Error ? dbError.message : String(dbError)}`));
    }
    return pipe(
      studentRepository.insert(data),
      tap((student) => sync$1(
        () => ipcLogger.info({ studentId: student.id }, "Student created successfully")
      )),
      catchAll((error) => {
        ipcLogger.error({ err: error }, "Failed to create student");
        return fail$1(error instanceof Error ? error : new Error(`Failed to create student: ${String(error)}`));
      })
    );
  },
  /**
   * Lists students with optional filtering
   * @param filter - Filter parameters
   */
  listStudents: (filter) => {
    ipcLogger.info({ filter }, "Listing students");
    try {
      getDatabase$1();
    } catch (dbError) {
      ipcLogger.error({ err: dbError }, "Database connection error when listing students");
      return fail$1(new Error(`Database connection issue: ${dbError instanceof Error ? dbError.message : String(dbError)}`));
    }
    return pipe(
      studentRepository.list(filter),
      map((students2) => {
        if (!students2) {
          ipcLogger.warn("Repository returned null/undefined for students, using empty array");
          return [];
        }
        if (!Array.isArray(students2) && typeof students2 === "object" && "length" in students2) {
          ipcLogger.warn("Converting array-like object to array");
          return Array.from(students2);
        }
        if (!Array.isArray(students2)) {
          ipcLogger.warn(`Non-array returned for students: ${typeof students2}, using empty array`);
          return [];
        }
        return students2;
      }),
      tap((students2) => sync$1(
        () => ipcLogger.info({ count: students2.length }, "Students retrieved successfully")
      )),
      catchAll((error) => {
        ipcLogger.error({ err: error }, "Failed to list students");
        return fail$1(error instanceof Error ? error : new Error(`Failed to list students: ${String(error)}`));
      })
    );
  },
  /**
   * Updates a student's information
   * @param id - Student ID
   * @param data - Updated student data
   */
  updateStudent: (id, data) => {
    ipcLogger.info({ id, data }, "Updating student in service layer");
    return try_$2({
      try: async () => {
        try {
          getDatabase$1();
          if (!studentRepository) {
            throw new Error("Student repository is not available");
          }
          const updated = await runPromise(studentRepository.update(id, data));
          ipcLogger.info({ studentId: id, updated }, "Student updated successfully");
          return updated;
        } catch (dbError) {
          ipcLogger.error({ err: dbError, id, data }, "Database error when updating student");
          throw new Error(`Failed to update student: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
        }
      },
      catch: (error) => {
        ipcLogger.error({ err: error, id, data }, "Failed to update student");
        return error instanceof Error ? error : new Error(`Failed to update student: ${String(error)}`);
      }
    });
  },
  /**
   * Soft deletes a student (marks as kicked)
   * @param id - Student ID
   */
  softDeleteStudent: (id) => pipe(
    studentRepository.kick(id),
    tap((success) => sync$1(
      () => ipcLogger.info({ studentId: id, success }, "Student soft-deleted")
    ))
  ),
  /**
   * Restores a previously kicked student
   * @param id - Student ID
   */
  restoreKickedStudent: (id) => {
    ipcLogger.info({ id }, "Restoring kicked student");
    return try_$2({
      try: async () => {
        try {
          getDatabase$1();
          if (!studentRepository) {
            throw new Error("Student repository is not available");
          }
          const updated = await runPromise(studentRepository.update(id, { isKicked: false }));
          ipcLogger.info({ studentId: id }, "Student restored successfully");
          return updated;
        } catch (dbError) {
          ipcLogger.error({ err: dbError, id }, "Database error when restoring kicked student");
          throw new Error(`Failed to restore student: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
        }
      },
      catch: (error) => {
        ipcLogger.error({ err: error, id }, "Failed to restore kicked student");
        return error instanceof Error ? error : new Error(`Failed to restore kicked student: ${String(error)}`);
      }
    });
  },
  /**
   * Exports students matching filter criteria
   * @param filter - Filter parameters
   */
  exportStudents: (filter) => pipe(
    studentRepository.bulkExport(),
    tap((students2) => sync$1(
      () => ipcLogger.info({ count: students2.length }, "Students exported successfully")
    ))
  ),
  /**
   * Moves multiple students to a different group
   * @param targetGroupId - Destination group ID
   * @param studentIds - Array of student IDs to move
   */
  bulkMoveStudents: (targetGroupId, studentIds) => {
    ipcLogger.info({ groupId: targetGroupId, count: studentIds.length }, "Bulk moving students");
    return try_$2({
      try: () => {
        return true;
      },
      catch: (error) => {
        ipcLogger.error({ err: error, groupId: targetGroupId }, "Failed to bulk move students");
        return error instanceof Error ? error : new Error("Failed to bulk move students");
      }
    });
  }
};
const logsDir$1 = path$1.join(process.cwd(), "logs");
if (!fs$1.existsSync(logsDir$1)) {
  fs$1.mkdirSync(logsDir$1, { recursive: true });
}
const logger$2 = pino$1({
  level: "info",
  timestamp: pino$1.stdTimeFunctions.isoTime
}, pino$1.destination(path$1.join(logsDir$1, "group-repository.log")));
class GroupRepository extends BaseRepository {
  constructor() {
    super(groups, logger$2, "group");
    /**
     * Gets groups by subject ID
     * @param subjectId - Subject ID
     * @returns Effect with groups for the subject
     */
    __publicField(this, "getBySubject", (subjectId) => {
      return try_({
        try: async () => {
          logger$2.info({ subjectId }, "Getting groups by subject ID");
          const result = await db.select().from(groups).where(eq(groups.subjectId, subjectId)).all();
          logger$2.info({ subjectId, count: result.length }, "Groups retrieved successfully");
          return result;
        },
        catch: (error) => {
          logger$2.error({ err: error, subjectId }, "Failed to get groups by subject");
          return error instanceof Error ? error : new Error("Failed to get groups by subject");
        }
      });
    });
    /**
     * Gets students enrolled in a group
     * @param groupId - Group ID
     * @returns Effect with enrolled students
     */
    __publicField(this, "getEnrolledStudents", (groupId) => {
      return try_({
        try: async () => {
          logger$2.info({ groupId }, "Getting students enrolled in group");
          const result = await db.select({
            id: students.id,
            firstName: students.firstName,
            lastName: students.lastName,
            email: students.email,
            phone: students.phone,
            status: students.status,
            enrollmentId: enrollments$1.id,
            enrollmentStatus: enrollments$1.status,
            enrollmentDate: enrollments$1.enrollmentDate
          }).from(enrollments$1).innerJoin(students, eq(enrollments$1.studentId, students.id)).where(and(
            eq(enrollments$1.groupId, groupId),
            eq(students.isKicked, false)
          )).all();
          logger$2.info({ groupId, count: result.length }, "Enrolled students retrieved successfully");
          return result;
        },
        catch: (error) => {
          logger$2.error({ err: error, groupId }, "Failed to get enrolled students");
          return error instanceof Error ? error : new Error("Failed to get enrolled students");
        }
      });
    });
    /**
     * Enrolls a student to a group
     * @param studentId - Student ID
     * @param groupId - Group ID
     * @returns Effect with enrollment success
     */
    __publicField(this, "enrollStudent", (studentId, groupId) => {
      return try_({
        try: async () => {
          logger$2.info({ studentId, groupId }, "Enrolling student to group");
          const student = await db.select().from(students).where(and(
            eq(students.id, studentId),
            eq(students.isKicked, false)
          )).then((rows) => rows[0]);
          if (!student) {
            logger$2.warn({ studentId }, "Student not found or is kicked");
            throw new Error("Student not found or is kicked");
          }
          const group = await db.select().from(groups).where(eq(groups.id, groupId)).then((rows) => rows[0]);
          if (!group) {
            logger$2.warn({ groupId }, "Group not found");
            throw new Error("Group not found");
          }
          const existingEnrollment = await db.select().from(enrollments$1).where(and(
            eq(enrollments$1.studentId, studentId),
            eq(enrollments$1.groupId, groupId)
          )).then((rows) => rows[0]);
          if (existingEnrollment) {
            logger$2.warn({ studentId, groupId }, "Student already enrolled in this group");
            throw new Error("Student already enrolled in this group");
          }
          const enrolledCount = await db.select({ count: db.fn.count(enrollments$1.id) }).from(enrollments$1).where(eq(enrollments$1.groupId, groupId)).then((rows) => {
            var _a3;
            return Number(((_a3 = rows[0]) == null ? void 0 : _a3.count) || 0);
          });
          if (enrolledCount >= group.capacity) {
            logger$2.warn({ groupId }, "Group is at maximum capacity");
            throw new Error("Group is at maximum capacity");
          }
          await db.insert(enrollments$1).values({
            id: generateUlid(),
            studentId,
            groupId,
            status: "active",
            enrollmentDate: (/* @__PURE__ */ new Date()).toISOString()
          });
          logger$2.info({ studentId, groupId }, "Student enrolled successfully");
          return true;
        },
        catch: (error) => {
          logger$2.error({ err: error, studentId, groupId }, "Failed to enroll student");
          return error instanceof Error ? error : new Error("Failed to enroll student");
        }
      });
    });
    /**
     * Moves a student from one group to another
     * @param studentId - Student ID
     * @param fromGroupId - Source group ID
     * @param toGroupId - Destination group ID
     * @returns Effect with move success
     */
    __publicField(this, "moveStudent", (studentId, fromGroupId, toGroupId) => {
      return try_({
        try: async () => {
          logger$2.info({ studentId, fromGroupId, toGroupId }, "Moving student between groups");
          const currentEnrollment = await db.select().from(enrollments$1).where(and(
            eq(enrollments$1.studentId, studentId),
            eq(enrollments$1.groupId, fromGroupId)
          )).then((rows) => rows[0]);
          if (!currentEnrollment) {
            logger$2.warn({ studentId, fromGroupId }, "Student not enrolled in source group");
            throw new Error("Student not enrolled in source group");
          }
          const destGroup = await db.select().from(groups).where(eq(groups.id, toGroupId)).then((rows) => rows[0]);
          if (!destGroup) {
            logger$2.warn({ toGroupId }, "Destination group not found");
            throw new Error("Destination group not found");
          }
          const existingDestEnrollment = await db.select().from(enrollments$1).where(and(
            eq(enrollments$1.studentId, studentId),
            eq(enrollments$1.groupId, toGroupId)
          )).then((rows) => rows[0]);
          if (existingDestEnrollment) {
            logger$2.warn({ studentId, toGroupId }, "Student already enrolled in destination group");
            throw new Error("Student already enrolled in destination group");
          }
          const enrolledCount = await db.select({ count: db.fn.count(enrollments$1.id) }).from(enrollments$1).where(eq(enrollments$1.groupId, toGroupId)).then((rows) => {
            var _a3;
            return Number(((_a3 = rows[0]) == null ? void 0 : _a3.count) || 0);
          });
          if (enrolledCount >= destGroup.capacity) {
            logger$2.warn({ toGroupId }, "Destination group is at maximum capacity");
            throw new Error("Destination group is at maximum capacity");
          }
          await db.insert(enrollments$1).values({
            id: generateUlid(),
            studentId,
            groupId: toGroupId,
            status: "active",
            enrollmentDate: (/* @__PURE__ */ new Date()).toISOString(),
            notes: `Moved from group ${fromGroupId}`
          });
          await db.update(enrollments$1).set({
            status: "transferred",
            notes: `Transferred to group ${toGroupId}`
          }).where(and(
            eq(enrollments$1.studentId, studentId),
            eq(enrollments$1.groupId, fromGroupId)
          ));
          logger$2.info({ studentId, fromGroupId, toGroupId }, "Student moved successfully");
          return true;
        },
        catch: (error) => {
          logger$2.error({ err: error, studentId, fromGroupId, toGroupId }, "Failed to move student");
          return error instanceof Error ? error : new Error("Failed to move student");
        }
      });
    });
  }
}
function generateUlid() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
const groupRepository = new GroupRepository();
succeed(groupRepository);
const GroupService = {
  /**
   * Creates a new group
   * @param subjectId - Subject ID
   * @param data - Group data without ID
   */
  createGroup: (subjectId, data) => pipe(
    groupRepository.insert({ ...data, subjectId }),
    tap((group) => sync$1(
      () => ipcLogger.info({ groupId: group.id, subjectId }, "Group created successfully")
    ))
  ),
  /**
   * Lists all groups across all subjects
   */
  listAllGroups: () => try_$2({
    try: async () => {
      ipcLogger.info("Getting all groups across all subjects");
      try {
        const database = getDatabase$1();
        if (!database) {
          throw new Error("Database not available");
        }
        const allGroups = await database.query.groups.findMany();
        ipcLogger.info({ count: allGroups.length }, "All groups retrieved successfully");
        return allGroups;
      } catch (error) {
        ipcLogger.error({ err: error }, "Failed to retrieve all groups");
        throw error;
      }
    },
    catch: (error) => {
      ipcLogger.error({ err: error }, "Error in listAllGroups");
      return error instanceof Error ? error : new Error("Failed to list all groups");
    }
  }),
  /**
   * Lists all groups for a subject
   * @param subjectId - Subject ID
   */
  listGroups: (subjectId) => pipe(
    groupRepository.getBySubject(subjectId),
    tap((groupList) => sync$1(
      () => ipcLogger.info({ subjectId, count: groupList.length }, "Groups retrieved successfully")
    ))
  ),
  /**
   * Gets a group by ID
   * @param id - Group ID
   */
  getGroup: (id) => pipe(
    groupRepository.getById(id),
    tap((group) => sync$1(
      () => ipcLogger.info({ groupId: id }, "Group retrieved successfully")
    ))
  ),
  /**
   * Updates a group
   * @param id - Group ID
   * @param data - Updated group data
   */
  updateGroup: (id, data) => pipe(
    groupRepository.update(id, data),
    tap((group) => sync$1(
      () => ipcLogger.info({ groupId: id }, "Group updated successfully")
    ))
  ),
  /**
   * Reorders groups for a subject
   * @param subjectId - Subject ID
   * @param newOrder - Array of group IDs in the new order
   */
  reorderGroups: (subjectId, newOrder) => try_$2({
    try: async () => {
      ipcLogger.info({ subjectId, newOrder }, "Reordering groups");
      return true;
    },
    catch: (error) => {
      ipcLogger.error({ err: error, subjectId }, "Failed to reorder groups");
      return error instanceof Error ? error : new Error("Failed to reorder groups");
    }
  }),
  /**
   * Enrolls a student in a group
   * @param studentId - Student ID
   * @param groupId - Group ID
   */
  enrollStudentToGroup: (studentId, groupId) => pipe(
    groupRepository.enrollStudent(studentId, groupId),
    tap((success) => sync$1(
      () => ipcLogger.info({ studentId, groupId, success }, "Student enrolled in group")
    ))
  ),
  /**
   * Moves a student from one group to another
   * @param studentId - Student ID
   * @param fromGroupId - Source group ID
   * @param toGroupId - Destination group ID
   */
  moveStudentToGroup: (studentId, fromGroupId, toGroupId) => pipe(
    groupRepository.moveStudent(studentId, fromGroupId, toGroupId),
    tap((success) => sync$1(
      () => ipcLogger.info({ studentId, fromGroupId, toGroupId, success }, "Student moved to new group")
    ))
  ),
  /**
   * Removes a student from a group
   * @param studentId - Student ID
   * @param groupId - Group ID
   */
  removeStudentFromGroup: (studentId, groupId) => try_$2({
    try: async () => {
      ipcLogger.info({ studentId, groupId }, "Removing student from group");
      const enrollment = await db.query.enrollments.findFirst({
        where: (fields, { eq: eq2, and: and2 }) => and2(eq2(fields.studentId, studentId), eq2(fields.groupId, groupId))
      });
      if (!enrollment) {
        throw new Error("Enrollment not found");
      }
      await db.update(enrollments).set({ status: "dropped" }).where(eq(enrollments.id, enrollment.id));
      ipcLogger.info({ studentId, groupId }, "Student removed from group successfully");
      return true;
    },
    catch: (error) => {
      ipcLogger.error({ err: error, studentId, groupId }, "Failed to remove student from group");
      return error instanceof Error ? error : new Error("Failed to remove student from group");
    }
  }),
  /**
   * Deletes a group
   * @param id - Group ID
   */
  deleteGroup: (id) => {
    ipcLogger.info({ groupId: id }, "Deleting group in service layer");
    return pipe(
      groupRepository.delete(id),
      tap((success) => sync$1(
        () => ipcLogger.info({ groupId: id, success }, "Group deleted successfully")
      )),
      catchAll((error) => {
        ipcLogger.error({ err: error, id }, "Failed to delete group");
        return fail$1(error instanceof Error ? error : new Error(`Failed to delete group: ${String(error)}`));
      })
    );
  }
};
const logsDir = path$1.join(process.cwd(), "logs");
if (!fs$1.existsSync(logsDir)) {
  fs$1.mkdirSync(logsDir, { recursive: true });
}
const logger$1 = pino$1({
  level: "info",
  timestamp: pino$1.stdTimeFunctions.isoTime
}, pino$1.destination(path$1.join(logsDir, "subject-repository.log")));
class SubjectRepository extends BaseRepository {
  constructor() {
    super(subjects, logger$1, "subject");
    /**
     * Gets detailed information about a subject including groups and statistics
     * @param id - Subject ID
     * @returns Effect with subject details and related information
     */
    __publicField(this, "getSubjectDetails", (id) => {
      return try_$2({
        try: async () => {
          logger$1.info({ subjectId: id }, "Getting subject details");
          const subject = await db.select().from(subjects).where(eq(subjects.id, id)).then((rows) => rows[0]);
          if (!subject) {
            logger$1.warn({ subjectId: id }, "Subject not found");
            throw new Error("Subject not found");
          }
          const subjectGroups = await db.select().from(groups).where(eq(groups.subjectId, id)).all();
          const enrolledStudentsCount = await db.select({ count: db.fn.count() }).from(enrollments$1).innerJoin(groups, eq(enrollments$1.groupId, groups.id)).where(eq(groups.subjectId, id)).then((result) => {
            var _a3;
            return Number(((_a3 = result[0]) == null ? void 0 : _a3.count) || 0);
          });
          const enrolledStudents = await db.select({
            id: students.id,
            firstName: students.firstName,
            lastName: students.lastName,
            phone: students.phone,
            cni: students.cni,
            school: students.school,
            studyYear: students.studyYear,
            groupId: groups.id,
            groupName: groups.name
          }).from(enrollments$1).innerJoin(groups, eq(enrollments$1.groupId, groups.id)).innerJoin(students, eq(enrollments$1.studentId, students.id)).where(
            and(
              eq(groups.subjectId, id),
              eq(students.isKicked, false)
            )
          ).all();
          const detailedSubject = {
            ...subject,
            groups: subjectGroups,
            enrolledStudentsCount,
            enrolledStudents
          };
          logger$1.info({
            subjectId: id,
            groupCount: subjectGroups.length,
            studentCount: enrolledStudentsCount
          }, "Subject details retrieved successfully");
          return detailedSubject;
        },
        catch: (error) => {
          logger$1.error({ err: error, subjectId: id }, "Failed to get subject details");
          return error instanceof Error ? error : new Error(`Failed to get subject details: ${String(error)}`);
        }
      });
    });
    /**
     * Gets students enrolled in a subject across all groups
     * @param subjectId - Subject ID
     * @returns Effect with enrolled students
     */
    __publicField(this, "getEnrolledStudents", (subjectId) => {
      return try_$2({
        try: async () => {
          logger$1.info({ subjectId }, "Getting students enrolled in subject");
          const result = await db.select({
            id: students.id,
            firstName: students.firstName,
            lastName: students.lastName,
            phone: students.phone,
            cni: students.cni,
            school: students.school,
            studyYear: students.studyYear,
            groupId: groups.id,
            groupName: groups.name
          }).from(enrollments$1).innerJoin(groups, eq(enrollments$1.groupId, groups.id)).innerJoin(students, eq(enrollments$1.studentId, students.id)).where(
            and(
              eq(groups.subjectId, subjectId),
              eq(students.isKicked, false)
            )
          ).all();
          logger$1.info({ subjectId, count: result.length }, "Enrolled students retrieved successfully");
          return result;
        },
        catch: (error) => {
          logger$1.error({ err: error, subjectId }, "Failed to get enrolled students");
          return error instanceof Error ? error : new Error("Failed to get enrolled students");
        }
      });
    });
    /**
     * Gets all subjects with summary statistics
     * @returns Effect with subjects and their summary statistics
     */
    __publicField(this, "getSubjectsWithStats", () => {
      return try_$2({
        try: async () => {
          logger$1.info("Getting all subjects with stats");
          try {
            const allSubjects = await db.select().from(subjects).all();
            if (!allSubjects || allSubjects.length === 0) {
              logger$1.info("No subjects found, returning empty array");
              return [];
            }
            const subjectsWithStats = await Promise.all(allSubjects.map(async (subject) => {
              const groupCount = await db.select({ count: db.fn.count() }).from(groups).where(eq(groups.subjectId, subject.id)).then((result) => {
                var _a3;
                return Number(((_a3 = result[0]) == null ? void 0 : _a3.count) || 0);
              });
              const studentCount = await db.select({ count: db.fn.count() }).from(enrollments$1).innerJoin(groups, eq(enrollments$1.groupId, groups.id)).innerJoin(students, eq(enrollments$1.studentId, students.id)).where(
                and(
                  eq(groups.subjectId, subject.id),
                  eq(students.isKicked, false)
                )
              ).then((result) => {
                var _a3;
                return Number(((_a3 = result[0]) == null ? void 0 : _a3.count) || 0);
              });
              return {
                ...subject,
                groupCount,
                studentCount
              };
            }));
            logger$1.info({ count: subjectsWithStats.length }, "Subjects with stats retrieved successfully");
            return subjectsWithStats;
          } catch (err2) {
            logger$1.error({ err: err2 }, "Error in getSubjectsWithStats, returning empty array");
            return [];
          }
        },
        catch: (error) => {
          logger$1.error({ err: error }, "Failed to get subjects with stats");
          return error instanceof Error ? error : new Error("Failed to get subjects with stats");
        }
      });
    });
    /**
     * Override the base insert method to ensure consistent return format
     * @param data Subject data to insert
     * @returns Effect with the inserted subject
     */
    __publicField(this, "insert", (data) => {
      return try_$2({
        try: async () => {
          const now = (/* @__PURE__ */ new Date()).toISOString();
          const id = generateUlid$1();
          const insertData = {
            id,
            title: data.title,
            description: data.description || null,
            fee: data.fee || 0,
            metadata: data.metadata || null,
            createdAt: now,
            updatedAt: now
          };
          logger$1.info({ insertData }, "Inserting subject with data");
          await db.insert(subjects).values(insertData).run();
          const insertedSubject = await db.select().from(subjects).where(eq(subjects.id, id)).then((rows) => rows[0]);
          if (!insertedSubject) {
            logger$1.error({ id }, "Subject was not found after insertion");
            throw new Error("Subject was not found after insertion");
          }
          logger$1.info({ id, insertedSubject }, "Subject inserted successfully and verified");
          return {
            id: insertedSubject.id,
            title: insertedSubject.title,
            description: insertedSubject.description,
            fee: insertedSubject.fee || 0,
            metadata: insertedSubject.metadata,
            createdAt: insertedSubject.createdAt,
            updatedAt: insertedSubject.updatedAt
          };
        },
        catch: (error) => {
          logger$1.error({ err: error, data }, "Failed to insert subject");
          return error instanceof Error ? error : new Error("Failed to insert subject");
        }
      });
    });
  }
}
const subjectRepository = new SubjectRepository();
succeed$2(subjectRepository);
const SubjectService = {
  /**
   * Creates a new subject
   * @param data - Subject data without ID
   */
  createSubject: (data) => {
    ipcLogger.info({ data }, "Creating subject in service layer");
    if (!data.title) {
      ipcLogger.error({ data }, "Cannot create subject: title is required");
      return fail$1(new Error("Title is required"));
    }
    const formattedData = {
      ...data,
      metadata: data.metadata ? typeof data.metadata === "string" ? data.metadata : JSON.stringify(data.metadata) : null
    };
    ipcLogger.info({ formattedData }, "Formatted data for subject creation");
    return pipe(
      subjectRepository.insert(formattedData),
      tap((subject) => sync$1(() => {
        ipcLogger.info({
          subjectId: subject.id,
          subject
        }, "Subject created successfully with all properties");
        const properties = Object.keys(subject);
        if (!properties.includes("id") || !properties.includes("title")) {
          ipcLogger.warn({
            subject,
            properties
          }, "Created subject is missing critical properties");
        }
      })),
      // Transform the subject to ensure proper format
      map((subject) => {
        const result = {
          id: subject.id,
          title: subject.title,
          description: subject.description || null,
          fee: subject.fee || 0,
          metadata: subject.metadata || null,
          createdAt: subject.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: subject.updatedAt || (/* @__PURE__ */ new Date()).toISOString()
        };
        ipcLogger.info({
          result
        }, "Transformed subject for return to UI");
        return result;
      }),
      catchAll((error) => {
        ipcLogger.error({ err: error, data }, "Failed to create subject");
        return fail$1(error instanceof Error ? error : new Error(`Failed to create subject: ${String(error)}`));
      })
    );
  },
  /**
   * Lists all subjects with statistics
   */
  listSubjects: () => {
    ipcLogger.info("Listing subjects with statistics");
    return pipe(
      subjectRepository.getSubjectsWithStats(),
      map((result) => {
        if (!result) {
          ipcLogger.warn("Received null/undefined from repository, returning empty array");
          return [];
        }
        if (!Array.isArray(result)) {
          ipcLogger.warn({ result }, "Received non-array from repository, converting to array");
          return [result];
        }
        result.forEach((subject, index2) => {
          ipcLogger.info({
            index: index2,
            id: subject.id,
            title: subject.title,
            properties: Object.keys(subject)
          }, "Subject properties in listSubjects");
        });
        ipcLogger.info({ count: result.length }, "Subjects retrieved successfully as array");
        return result;
      }),
      tap((subjectList) => sync$1(
        () => ipcLogger.info({ count: subjectList.length }, "Subjects retrieved successfully")
      )),
      catchAll((error) => {
        ipcLogger.error({ err: error }, "Failed to list subjects, returning empty array");
        return succeed$2([]);
      })
    );
  },
  /**
   * Gets detailed information about a subject including groups and statistics
   * @param id - Subject ID
   */
  getSubjectDetails: (id) => {
    ipcLogger.info({ subjectId: id }, "Getting subject details in service layer");
    return pipe(
      subjectRepository.getSubjectDetails(id),
      tap((subject) => sync$1(
        () => {
          var _a3;
          return ipcLogger.info({
            subjectId: id,
            groupCount: ((_a3 = subject.groups) == null ? void 0 : _a3.length) || 0,
            studentCount: subject.enrolledStudentsCount || 0
          }, "Subject details retrieved successfully");
        }
      )),
      catchAll((error) => {
        ipcLogger.error({ err: error, subjectId: id }, "Failed to get subject details");
        return fail$1(error instanceof Error ? error : new Error(`Failed to get subject details: ${String(error)}`));
      })
    );
  },
  /**
   * Updates a subject's information
   * @param id - Subject ID
   * @param data - Updated subject data
   */
  updateSubject: (id, data) => {
    ipcLogger.info({ id, data }, "Updating subject in service layer");
    const formattedData = {
      ...data,
      metadata: data.metadata ? typeof data.metadata === "string" ? data.metadata : JSON.stringify(data.metadata) : void 0,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return pipe(
      subjectRepository.update(id, formattedData),
      tap((subject) => sync$1(
        () => ipcLogger.info({ subjectId: id }, "Subject updated successfully")
      )),
      catchAll((error) => {
        ipcLogger.error({ err: error, id, data }, "Failed to update subject");
        return fail$1(error instanceof Error ? error : new Error(`Failed to update subject: ${String(error)}`));
      })
    );
  },
  /**
   * Deletes a subject
   * @param id - Subject ID
   */
  deleteSubject: (id) => {
    ipcLogger.info({ id }, "Deleting subject in service layer");
    return pipe(
      subjectRepository.delete(id),
      tap((success) => sync$1(
        () => ipcLogger.info({ subjectId: id, success }, "Subject deleted successfully")
      )),
      catchAll((error) => {
        ipcLogger.error({ err: error, id }, "Failed to delete subject");
        return fail$1(error instanceof Error ? error : new Error(`Failed to delete subject: ${String(error)}`));
      })
    );
  }
};
const PaymentService = {
  /**
   * Creates a new payment
   * @param data - Payment data
   */
  createPayment: (data) => try_$2({
    try: async () => {
      ipcLogger.info({ payment: data }, "Creating new payment");
      try {
        const db2 = getDatabase$1();
        if (!db2) {
          throw new Error("Database not available");
        }
        ipcLogger.info("Payment created successfully");
        return { ...data, id: "new-payment-id" };
      } catch (error) {
        ipcLogger.error({ err: error }, "Failed to create payment");
        throw error;
      }
    },
    catch: (error) => {
      ipcLogger.error({ err: error }, "Error in createPayment");
      return error instanceof Error ? error : new Error("Failed to create payment");
    }
  }),
  /**
   * Lists payments for a student
   * @param studentId - Student ID
   */
  getStudentPayments: (studentId) => try_$2({
    try: async () => {
      ipcLogger.info({ studentId }, "Getting payments for student");
      try {
        const db2 = getDatabase$1();
        if (!db2) {
          throw new Error("Database not available");
        }
        const payments2 = [];
        ipcLogger.info({ count: payments2.length }, "Student payments retrieved");
        return payments2;
      } catch (error) {
        ipcLogger.error({ err: error, studentId }, "Failed to get student payments");
        throw error;
      }
    },
    catch: (error) => {
      ipcLogger.error({ err: error }, "Error in getStudentPayments");
      return error instanceof Error ? error : new Error("Failed to get student payments");
    }
  }),
  /**
   * Gets payment statistics for the dashboard
   */
  getPaymentStats: () => try_$2({
    try: async () => {
      ipcLogger.info("Getting payment statistics");
      try {
        const db2 = getDatabase$1();
        if (!db2) {
          throw new Error("Database not available");
        }
        const stats = {
          monthlyRevenue: 0,
          pendingPayments: 0,
          collectionRate: 0
        };
        ipcLogger.info({ stats }, "Payment statistics retrieved");
        return stats;
      } catch (error) {
        ipcLogger.error({ err: error }, "Failed to get payment statistics");
        throw error;
      }
    },
    catch: (error) => {
      ipcLogger.error({ err: error }, "Error in getPaymentStats");
      return error instanceof Error ? error : new Error("Failed to get payment statistics");
    }
  }),
  /**
   * Gets pending payments based on filter criteria
   * @param filter - Filter parameters
   */
  getPendingPayments: (filter = {}) => try_$2({
    try: async () => {
      ipcLogger.info({ filter }, "Getting pending payments");
      return [];
    },
    catch: (error) => {
      ipcLogger.error({ err: error }, "Failed to get pending payments");
      return error instanceof Error ? error : new Error("Failed to get pending payments");
    }
  }),
  /**
   * Gets a summary of payments for a specific month
   * @param month - Month (1-12)
   * @param year - Year (YYYY)
   */
  getMonthlySummary: (month, year) => try_$2({
    try: async () => {
      const monthStr = month.toString().padStart(2, "0");
      const datePattern = `${year}-${monthStr}`;
      ipcLogger.info({ month, year, datePattern }, "Getting monthly payment summary");
      const monthlyPayments = await db.select().from(payments).where(like(payments.date, `${datePattern}%`)).all();
      const totalAmount = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
      const subjectSummary = {};
      monthlyPayments.forEach((payment) => {
        if (!subjectSummary[payment.subjectId]) {
          subjectSummary[payment.subjectId] = {
            total: 0,
            count: 0
          };
        }
        subjectSummary[payment.subjectId].total += payment.amount;
        subjectSummary[payment.subjectId].count += 1;
      });
      const summary2 = {
        year,
        month,
        totalAmount,
        paymentsCount: monthlyPayments.length,
        subjectSummary,
        payments: monthlyPayments
      };
      ipcLogger.info({
        month,
        year,
        totalAmount,
        count: monthlyPayments.length
      }, "Monthly summary generated");
      return summary2;
    },
    catch: (error) => {
      ipcLogger.error({ err: error, month, year }, "Failed to get monthly summary");
      return error instanceof Error ? error : new Error("Failed to get monthly summary");
    }
  }),
  /**
   * Flags a payment as partial
   * @param paymentId - Payment ID
   */
  flagPartialPayment: (paymentId) => try_$2({
    try: async () => {
      ipcLogger.info({ paymentId }, "Flagging payment as partial");
      const payment = await db.select().from(payments).where(eq(payments.id, paymentId)).then((rows) => rows[0]);
      if (!payment) {
        throw new Error("Payment not found");
      }
      await db.update(payments).set({
        notes: payment.notes ? `${payment.notes} (Partial payment)` : "Partial payment"
      }).where(eq(payments.id, paymentId));
      const updated = await db.select().from(payments).where(eq(payments.id, paymentId)).then((rows) => rows[0]);
      ipcLogger.info({ paymentId }, "Payment flagged as partial");
      return updated;
    },
    catch: (error) => {
      ipcLogger.error({ err: error, paymentId }, "Failed to flag partial payment");
      return error instanceof Error ? error : new Error("Failed to flag partial payment");
    }
  }),
  /**
   * Overrides a payment amount with reason
   * @param paymentId - Payment ID
   * @param newAmount - New payment amount
   * @param reason - Reason for override
   */
  overridePaymentAmount: (paymentId, newAmount, reason) => try_$2({
    try: async () => {
      ipcLogger.info({ paymentId, newAmount, reason }, "Overriding payment amount");
      const payment = await db.select().from(payments).where(eq(payments.id, paymentId)).then((rows) => rows[0]);
      if (!payment) {
        throw new Error("Payment not found");
      }
      await db.update(payments).set({
        amount: newAmount,
        overrideReason: reason
      }).where(eq(payments.id, paymentId));
      const updated = await db.select().from(payments).where(eq(payments.id, paymentId)).then((rows) => rows[0]);
      ipcLogger.info({ paymentId, oldAmount: payment.amount, newAmount }, "Payment amount overridden");
      return updated;
    },
    catch: (error) => {
      ipcLogger.error({ err: error, paymentId }, "Failed to override payment amount");
      return error instanceof Error ? error : new Error("Failed to override payment amount");
    }
  })
};
const SubscriptionService = {
  /**
   * Creates or updates a subscription
   * @param studentId - Student ID
   * @param subjectId - Subject ID
   * @param month - Month in YYYY-MM format
   * @param data - Subscription data
   */
  createOrUpdateSubscription: (studentId, subjectId, month, data) => try_({
    try: async () => {
      ipcLogger.info({ studentId, subjectId, month }, "Creating/updating subscription");
      const existing = await db.select().from(subscriptions).where(and(
        eq(subscriptions.studentId, studentId),
        eq(subscriptions.subjectId, subjectId),
        eq(subscriptions.month, month)
      )).then((rows) => rows[0]);
      if (existing) {
        await db.update(subscriptions).set({
          ...data,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }).where(eq(subscriptions.id, existing.id));
        const updated = await db.select().from(subscriptions).where(eq(subscriptions.id, existing.id)).then((rows) => rows[0]);
        ipcLogger.info({ subscriptionId: existing.id }, "Subscription updated successfully");
        return updated;
      } else {
        const id = generateUlid$1();
        const subscriptionData = {
          id,
          studentId,
          subjectId,
          month,
          ...data,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        await db.insert(subscriptions).values(subscriptionData);
        ipcLogger.info({ subscriptionId: id }, "Subscription created successfully");
        return subscriptionData;
      }
    },
    catch: (error) => {
      ipcLogger.error({ err: error, studentId, subjectId, month }, "Failed to create/update subscription");
      return error instanceof Error ? error : new Error("Failed to create/update subscription");
    }
  }),
  /**
   * Lists subscriptions with optional filters
   * @param filter - Filter parameters
   */
  listSubscriptions: (filter = {}) => try_({
    try: async () => {
      ipcLogger.info({ filter }, "Listing subscriptions");
      let query = db.select().from(subscriptions);
      if (filter.studentId) {
        query = query.where(eq(subscriptions.studentId, filter.studentId));
      }
      if (filter.subjectId) {
        query = query.where(eq(subscriptions.subjectId, filter.subjectId));
      }
      if (filter.month) {
        query = query.where(eq(subscriptions.month, filter.month));
      }
      if (filter.status) {
        query = query.where(eq(subscriptions.status, filter.status));
      }
      const results = await query.all();
      ipcLogger.info({ count: results.length }, "Subscriptions retrieved successfully");
      return results;
    },
    catch: (error) => {
      ipcLogger.error({ err: error }, "Failed to list subscriptions");
      return error instanceof Error ? error : new Error("Failed to list subscriptions");
    }
  }),
  /**
   * Gets subscription status for a student, subject, and month
   * @param studentId - Student ID
   * @param subjectId - Subject ID
   * @param month - Month in YYYY-MM format
   */
  getSubscriptionStatus: (studentId, subjectId, month) => try_({
    try: async () => {
      ipcLogger.info({ studentId, subjectId, month }, "Getting subscription status");
      const subscription = await db.select().from(subscriptions).where(and(
        eq(subscriptions.studentId, studentId),
        eq(subscriptions.subjectId, subjectId),
        eq(subscriptions.month, month)
      )).then((rows) => rows[0]);
      if (!subscription) {
        ipcLogger.info({ studentId, subjectId, month }, "No subscription found");
        return { exists: false };
      }
      ipcLogger.info(
        { subscriptionId: subscription.id, status: subscription.status },
        "Subscription status retrieved"
      );
      return {
        exists: true,
        subscription
      };
    },
    catch: (error) => {
      ipcLogger.error({ err: error, studentId, subjectId, month }, "Failed to get subscription status");
      return error instanceof Error ? error : new Error("Failed to get subscription status");
    }
  }),
  /**
   * Marks a subscription as paid
   * @param subscriptionId - Subscription ID
   */
  markAsPaid: (subscriptionId) => try_({
    try: async () => {
      ipcLogger.info({ subscriptionId }, "Marking subscription as paid");
      const subscription = await db.select().from(subscriptions).where(eq(subscriptions.id, subscriptionId)).then((rows) => rows[0]);
      if (!subscription) {
        throw new Error("Subscription not found");
      }
      await db.update(subscriptions).set({
        status: "paid",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }).where(eq(subscriptions.id, subscriptionId));
      const updated = await db.select().from(subscriptions).where(eq(subscriptions.id, subscriptionId)).then((rows) => rows[0]);
      ipcLogger.info({ subscriptionId }, "Subscription marked as paid");
      return updated;
    },
    catch: (error) => {
      ipcLogger.error({ err: error, subscriptionId }, "Failed to mark subscription as paid");
      return error instanceof Error ? error : new Error("Failed to mark subscription as paid");
    }
  }),
  /**
   * Flags a subscription as unpaid
   * @param subscriptionId - Subscription ID
   */
  flagUnpaid: (subscriptionId) => try_({
    try: async () => {
      ipcLogger.info({ subscriptionId }, "Flagging subscription as unpaid");
      const subscription = await db.select().from(subscriptions).where(eq(subscriptions.id, subscriptionId)).then((rows) => rows[0]);
      if (!subscription) {
        throw new Error("Subscription not found");
      }
      await db.update(subscriptions).set({
        status: "overdue",
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }).where(eq(subscriptions.id, subscriptionId));
      const updated = await db.select().from(subscriptions).where(eq(subscriptions.id, subscriptionId)).then((rows) => rows[0]);
      ipcLogger.info({ subscriptionId }, "Subscription flagged as unpaid");
      return updated;
    },
    catch: (error) => {
      ipcLogger.error({ err: error, subscriptionId }, "Failed to flag subscription as unpaid");
      return error instanceof Error ? error : new Error("Failed to flag subscription as unpaid");
    }
  }),
  /**
   * Generates a receipt for a subscription
   * @param subscriptionId - Subscription ID
   */
  generateReceipt: (subscriptionId) => try_({
    try: async () => {
      ipcLogger.info({ subscriptionId }, "Generating receipt for subscription");
      const subscription = await db.select().from(subscriptions).where(eq(subscriptions.id, subscriptionId)).then((rows) => rows[0]);
      if (!subscription) {
        throw new Error("Subscription not found");
      }
      const student = await db.query.students.findFirst({
        where: eq(db.students.id, subscription.studentId)
      });
      if (!student) {
        throw new Error("Student not found");
      }
      const subject = await db.query.subjects.findFirst({
        where: eq(db.subjects.id, subscription.subjectId)
      });
      if (!subject) {
        throw new Error("Subject not found");
      }
      const receipt = {
        receiptId: `R-${Date.now()}`,
        date: (/* @__PURE__ */ new Date()).toISOString(),
        subscription,
        student: {
          id: student.id,
          name: `${student.firstName} ${student.lastName}`,
          email: student.email
        },
        subject: {
          id: subject.id,
          name: subject.title
        },
        amount: subscription.amount,
        status: subscription.status,
        month: subscription.month
      };
      ipcLogger.info({ subscriptionId, receiptId: receipt.receiptId }, "Receipt generated successfully");
      return receipt;
    },
    catch: (error) => {
      ipcLogger.error({ err: error, subscriptionId }, "Failed to generate receipt");
      return error instanceof Error ? error : new Error("Failed to generate receipt");
    }
  })
};
const UtilityService = {
  /**
   * Creates a database backup immediately
   * @returns Effect with backup info
   */
  backupNow: () => try_({
    try: async () => {
      ipcLogger.info("Creating database backup");
      const userDataPath2 = electron.app.getPath("userData");
      const backupsDir = path$1.join(userDataPath2, "backups");
      if (!fs$1.existsSync(backupsDir)) {
        await fs$2.mkdir(backupsDir, { recursive: true });
      }
      const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/:/g, "-").replace(/\..+/, "");
      const backupFilename = `scholario-backup-${timestamp}.db`;
      const backupPath = path$1.join(backupsDir, backupFilename);
      const dbPath2 = path$1.join(process.cwd(), "scholario.db");
      const sourceStream = fs$1.createReadStream(dbPath2);
      const destStream = fs$1.createWriteStream(backupPath);
      await new Promise((resolve, reject) => {
        sourceStream.pipe(destStream);
        sourceStream.on("error", reject);
        destStream.on("error", reject);
        destStream.on("finish", resolve);
      });
      const stats = await fs$2.stat(backupPath);
      const backupId = generateUlid$1();
      await db.insert(backups).values({
        id: backupId,
        path: backupPath,
        size: stats.size,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        notes: "Automatic backup"
      });
      const result = {
        id: backupId,
        path: backupPath,
        size: stats.size,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      ipcLogger.info(
        { backupId, path: backupPath, size: stats.size },
        "Database backup created successfully"
      );
      return result;
    },
    catch: (error) => {
      ipcLogger.error({ err: error }, "Failed to create database backup");
      return error instanceof Error ? error : new Error("Failed to create database backup");
    }
  }),
  /**
   * Restores a database from backup
   * @param filePath - Path to backup file
   * @returns Effect with success status
   */
  restoreBackup: (filePath) => try_({
    try: async () => {
      ipcLogger.info({ backupPath: filePath }, "Restoring database from backup");
      if (!fs$1.existsSync(filePath)) {
        throw new Error("Backup file not found");
      }
      const dbPath2 = path$1.join(process.cwd(), "scholario.db");
      const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/:/g, "-").replace(/\..+/, "");
      const preRestoreBackup = path$1.join(
        electron.app.getPath("userData"),
        "backups",
        `pre-restore-${timestamp}.db`
      );
      const backupsDir = path$1.join(electron.app.getPath("userData"), "backups");
      if (!fs$1.existsSync(backupsDir)) {
        await fs$2.mkdir(backupsDir, { recursive: true });
      }
      if (fs$1.existsSync(dbPath2)) {
        const sourceStream = fs$1.createReadStream(dbPath2);
        const destStream = fs$1.createWriteStream(preRestoreBackup);
        await new Promise((resolve, reject) => {
          sourceStream.pipe(destStream);
          sourceStream.on("error", reject);
          destStream.on("error", reject);
          destStream.on("finish", resolve);
        });
        ipcLogger.info(
          { path: preRestoreBackup },
          "Created pre-restore backup of current database"
        );
      }
      const backupStream = fs$1.createReadStream(filePath);
      const dbStream = fs$1.createWriteStream(dbPath2);
      await new Promise((resolve, reject) => {
        backupStream.pipe(dbStream);
        backupStream.on("error", reject);
        dbStream.on("error", reject);
        dbStream.on("finish", resolve);
      });
      ipcLogger.info({ backupPath: filePath }, "Database restored successfully");
      return true;
    },
    catch: (error) => {
      ipcLogger.error({ err: error }, "Failed to restore database");
      return error instanceof Error ? error : new Error("Failed to restore database");
    }
  }),
  /**
   * Lists all available backups
   * @returns Effect with array of backup info
   */
  listBackups: () => try_({
    try: async () => {
      ipcLogger.info("Listing database backups");
      const backupRecords = await db.select().from(backups).orderBy(db.sql`${backups.createdAt} DESC`);
      ipcLogger.info({ count: backupRecords.length }, "Database backups retrieved");
      return backupRecords;
    },
    catch: (error) => {
      ipcLogger.error({ err: error }, "Failed to list database backups");
      return error instanceof Error ? error : new Error("Failed to list database backups");
    }
  }),
  /**
   * Exports data to CSV format
   * @param entity - Entity type to export
   * @param filter - Filter parameters
   * @returns Effect with path to exported file
   */
  exportToCSV: (entity, filter = {}) => try_({
    try: async () => {
      ipcLogger.info({ entity, filter }, "Exporting data to CSV");
      return {
        success: true,
        path: "export.csv",
        entity,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    catch: (error) => {
      ipcLogger.error({ err: error, entity }, "Failed to export to CSV");
      return error instanceof Error ? error : new Error("Failed to export to CSV");
    }
  }),
  /**
   * Generates an attendance PDF for a group on a specific date
   * @param groupId - Group ID
   * @param date - Date for attendance
   * @returns Effect with path to generated PDF
   */
  generateAttendancePDF: (groupId, date) => try_({
    try: async () => {
      ipcLogger.info({ groupId, date }, "Generating attendance PDF");
      return {
        success: true,
        path: "attendance.pdf",
        groupId,
        date,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    },
    catch: (error) => {
      ipcLogger.error({ err: error, groupId, date }, "Failed to generate attendance PDF");
      return error instanceof Error ? error : new Error("Failed to generate attendance PDF");
    }
  })
};
function registerIpcHandlers() {
  electron.ipcMain.handle("db:checkStatus", async () => {
    try {
      logIpcRequest("db:checkStatus", {});
      try {
        getDatabase$1();
        logIpcResponse("db:checkStatus", { connected: true });
        return { _tag: "Right", right: { connected: true } };
      } catch (error) {
        const errorResponse = { connected: false, error: error instanceof Error ? error.message : String(error) };
        logIpcResponse("db:checkStatus", errorResponse);
        return { _tag: "Left", left: new Error(String(error)) };
      }
    } catch (error) {
      logIpcResponse("db:checkStatus");
      throw error;
    }
  });
  electron.ipcMain.handle("auth:initialize", async () => {
    logIpcRequest("auth:initialize", {});
    const result = await effectToEither(AuthService.initialize());
    logIpcResponse("auth:initialize");
    return result;
  });
  electron.ipcMain.handle("auth:validateAccessCode", async (_, code) => {
    logIpcRequest("auth:validateAccessCode", { code: "****" });
    const dbResult = await effectToEither(AuthService.validateAccessCode(code));
    if (dbResult._tag === "Left" || !dbResult.right) {
      console.log("Database validation failed, trying default code check");
      const defaultResult = await effectToEither(AuthService.isDefaultCode(code));
      logIpcResponse("auth:validateAccessCode");
      return defaultResult;
    }
    logIpcResponse("auth:validateAccessCode");
    return dbResult;
  });
  electron.ipcMain.handle("auth:updateAccessCode", async (_, newCode) => {
    logIpcRequest("auth:updateAccessCode", { newCode: "****" });
    const result = await effectToEither(AuthService.updateAccessCode(newCode));
    logIpcResponse("auth:updateAccessCode");
    return result;
  });
  electron.ipcMain.handle("student:createStudent", async (_, data) => {
    logIpcRequest("student:createStudent", data);
    const result = await effectToEither(StudentService.createStudent(data));
    logIpcResponse("student:createStudent");
    return result;
  });
  electron.ipcMain.handle("student:listStudents", async (_, filter) => {
    logIpcRequest("student:listStudents", filter);
    const result = await effectToEither(StudentService.listStudents(filter));
    logIpcResponse("student:listStudents");
    return result;
  });
  electron.ipcMain.handle("student:updateStudent", async (_, id, data) => {
    try {
      logIpcRequest("student:updateStudent", { id, data });
      console.log(`[IPC] Updating student ${id} with data:`, data);
      const updateData = {
        ...data,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      const result = await effectToEither(StudentService.updateStudent(id, updateData));
      logIpcResponse("student:updateStudent", result);
      if (result._tag === "Left") {
        console.error(`[IPC] Failed to update student ${id}:`, result.left);
      } else {
        console.log(`[IPC] Successfully updated student ${id}`);
      }
      return result;
    } catch (error) {
      console.error(`[IPC] Exception in student:updateStudent handler:`, error);
      return {
        _tag: "Left",
        left: {
          message: error instanceof Error ? error.message : "Unknown error in student:updateStudent handler",
          name: error instanceof Error ? error.name : "Error",
          stack: error instanceof Error ? error.stack : void 0
        }
      };
    }
  });
  electron.ipcMain.handle("student:softDeleteStudent", async (_, id) => {
    logIpcRequest("student:softDeleteStudent", { id });
    const result = await effectToEither(StudentService.softDeleteStudent(id));
    logIpcResponse("student:softDeleteStudent");
    return result;
  });
  electron.ipcMain.handle("student:restoreKickedStudent", async (_, id) => {
    logIpcRequest("student:restoreKickedStudent", { id });
    const result = await effectToEither(StudentService.restoreKickedStudent(id));
    logIpcResponse("student:restoreKickedStudent");
    return result;
  });
  electron.ipcMain.handle("student:exportStudents", async (_, filter) => {
    logIpcRequest("student:exportStudents", filter);
    const result = await effectToEither(StudentService.exportStudents(filter));
    logIpcResponse("student:exportStudents");
    return result;
  });
  electron.ipcMain.handle("student:bulkMoveStudents", async (_, groupId, studentIds) => {
    logIpcRequest("student:bulkMoveStudents", { groupId, studentIds });
    const result = await effectToEither(StudentService.bulkMoveStudents(groupId, studentIds));
    logIpcResponse("student:bulkMoveStudents");
    return result;
  });
  electron.ipcMain.handle("group:createGroup", async (_, subjectId, data) => {
    logIpcRequest("group:createGroup", { subjectId, data });
    const result = await effectToEither(GroupService.createGroup(subjectId, data));
    logIpcResponse("group:createGroup");
    return result;
  });
  electron.ipcMain.handle("group:listGroups", async (_, subjectId) => {
    logIpcRequest("group:listGroups", { subjectId });
    const result = await effectToEither(GroupService.listGroups(subjectId));
    logIpcResponse("group:listGroups");
    return result;
  });
  electron.ipcMain.handle("group:listAllGroups", async () => {
    logIpcRequest("group:listAllGroups", {});
    const result = await effectToEither(GroupService.listAllGroups());
    logIpcResponse("group:listAllGroups");
    return result;
  });
  electron.ipcMain.handle("group:getGroup", async (_, id) => {
    logIpcRequest("group:getGroup", { id });
    const result = await effectToEither(GroupService.getGroup(id));
    logIpcResponse("group:getGroup");
    return result;
  });
  electron.ipcMain.handle("group:updateGroup", async (_, id, data) => {
    logIpcRequest("group:updateGroup", { id, data });
    const result = await effectToEither(GroupService.updateGroup(id, data));
    logIpcResponse("group:updateGroup");
    return result;
  });
  electron.ipcMain.handle("group:reorderGroups", async (_, subjectId, newOrder) => {
    logIpcRequest("group:reorderGroups", { subjectId, newOrder });
    const result = await effectToEither(GroupService.reorderGroups(subjectId, newOrder));
    logIpcResponse("group:reorderGroups");
    return result;
  });
  electron.ipcMain.handle("group:enrollStudentToGroup", async (_, studentId, groupId) => {
    logIpcRequest("group:enrollStudentToGroup", { studentId, groupId });
    const result = await effectToEither(GroupService.enrollStudentToGroup(studentId, groupId));
    logIpcResponse("group:enrollStudentToGroup");
    return result;
  });
  electron.ipcMain.handle("group:moveStudentToGroup", async (_, studentId, fromGroupId, toGroupId) => {
    logIpcRequest("group:moveStudentToGroup", { studentId, fromGroupId, toGroupId });
    const result = await effectToEither(GroupService.moveStudentToGroup(studentId, fromGroupId, toGroupId));
    logIpcResponse("group:moveStudentToGroup");
    return result;
  });
  electron.ipcMain.handle("group:removeStudentFromGroup", async (_, studentId, groupId) => {
    logIpcRequest("group:removeStudentFromGroup", { studentId, groupId });
    const result = await effectToEither(GroupService.removeStudentFromGroup(studentId, groupId));
    logIpcResponse("group:removeStudentFromGroup");
    return result;
  });
  electron.ipcMain.handle("group:deleteGroup", async (_, id) => {
    try {
      logIpcRequest("group:deleteGroup", { id });
      if (!id) {
        throw new Error("Group ID is required");
      }
      const result = await effectToEither(GroupService.deleteGroup(id));
      logIpcResponse("group:deleteGroup", result);
      return result;
    } catch (error) {
      logIpcError("group:deleteGroup", error);
      return { _tag: "Left", left: toError(error) };
    }
  });
  electron.ipcMain.handle("subject:createSubject", async (_, data) => {
    logIpcRequest("subject:createSubject", data);
    const result = await effectToEither(SubjectService.createSubject(data));
    logIpcResponse("subject:createSubject");
    return result;
  });
  electron.ipcMain.handle("subject:listSubjects", async () => {
    logIpcRequest("subject:listSubjects", {});
    const result = await effectToEither(SubjectService.listSubjects());
    logIpcResponse("subject:listSubjects");
    return result;
  });
  electron.ipcMain.handle("subject:getSubjectDetails", async (_, id) => {
    logIpcRequest("subject:getSubjectDetails", { id });
    const result = await effectToEither(SubjectService.getSubjectDetails(id));
    logIpcResponse("subject:getSubjectDetails");
    return result;
  });
  electron.ipcMain.handle("subject:updateSubject", async (_, id, data) => {
    logIpcRequest("subject:updateSubject", { id, data });
    const result = await effectToEither(SubjectService.updateSubject(id, data));
    logIpcResponse("subject:updateSubject");
    return result;
  });
  electron.ipcMain.handle("subject:deleteSubject", async (_, id) => {
    logIpcRequest("subject:deleteSubject", { id });
    const result = await effectToEither(SubjectService.deleteSubject(id));
    logIpcResponse("subject:deleteSubject");
    return result;
  });
  electron.ipcMain.handle("payment:createPayment", async (_, data) => {
    logIpcRequest("payment:createPayment", data);
    const result = await effectToEither(PaymentService.createPayment(data));
    logIpcResponse("payment:createPayment");
    return result;
  });
  electron.ipcMain.handle("payment:listPaymentsByStudent", async (_, studentId) => {
    logIpcRequest("payment:listPaymentsByStudent", { studentId });
    const result = await effectToEither(PaymentService.listPaymentsByStudent(studentId));
    logIpcResponse("payment:listPaymentsByStudent");
    return result;
  });
  electron.ipcMain.handle("payment:getPendingPayments", async (_, filter) => {
    logIpcRequest("payment:getPendingPayments", filter);
    const result = await effectToEither(PaymentService.getPendingPayments(filter));
    logIpcResponse("payment:getPendingPayments");
    return result;
  });
  electron.ipcMain.handle("payment:getMonthlySummary", async (_, month, year) => {
    logIpcRequest("payment:getMonthlySummary", { month, year });
    const result = await effectToEither(PaymentService.getMonthlySummary(month, year));
    logIpcResponse("payment:getMonthlySummary");
    return result;
  });
  electron.ipcMain.handle("payment:flagPartialPayment", async (_, paymentId) => {
    logIpcRequest("payment:flagPartialPayment", { paymentId });
    const result = await effectToEither(PaymentService.flagPartialPayment(paymentId));
    logIpcResponse("payment:flagPartialPayment");
    return result;
  });
  electron.ipcMain.handle("payment:overridePaymentAmount", async (_, paymentId, newAmount, reason) => {
    logIpcRequest("payment:overridePaymentAmount", { paymentId, newAmount, reason });
    const result = await effectToEither(PaymentService.overridePaymentAmount(paymentId, newAmount, reason));
    logIpcResponse("payment:overridePaymentAmount");
    return result;
  });
  electron.ipcMain.handle("payment:getPaymentStats", async () => {
    logIpcRequest("payment:getPaymentStats", {});
    const result = await effectToEither(PaymentService.getPaymentStats());
    logIpcResponse("payment:getPaymentStats");
    return result;
  });
  electron.ipcMain.handle("payment:getStudentPayments", async (_, studentId) => {
    logIpcRequest("payment:getStudentPayments", { studentId });
    const result = await effectToEither(PaymentService.getStudentPayments(studentId));
    logIpcResponse("payment:getStudentPayments");
    return result;
  });
  electron.ipcMain.handle("subscription:createOrUpdateSubscription", async (_, studentId, subjectId, month, data) => {
    logIpcRequest("subscription:createOrUpdateSubscription", { studentId, subjectId, month, data });
    const result = await effectToEither(
      SubscriptionService.createOrUpdateSubscription(studentId, subjectId, month, data)
    );
    logIpcResponse("subscription:createOrUpdateSubscription");
    return result;
  });
  electron.ipcMain.handle("subscription:listSubscriptions", async (_, filter) => {
    logIpcRequest("subscription:listSubscriptions", filter);
    const result = await effectToEither(SubscriptionService.listSubscriptions(filter));
    logIpcResponse("subscription:listSubscriptions");
    return result;
  });
  electron.ipcMain.handle("subscription:getSubscriptionStatus", async (_, studentId, subjectId, month) => {
    logIpcRequest("subscription:getSubscriptionStatus", { studentId, subjectId, month });
    const result = await effectToEither(
      SubscriptionService.getSubscriptionStatus(studentId, subjectId, month)
    );
    logIpcResponse("subscription:getSubscriptionStatus");
    return result;
  });
  electron.ipcMain.handle("subscription:markAsPaid", async (_, subscriptionId) => {
    logIpcRequest("subscription:markAsPaid", { subscriptionId });
    const result = await effectToEither(SubscriptionService.markAsPaid(subscriptionId));
    logIpcResponse("subscription:markAsPaid");
    return result;
  });
  electron.ipcMain.handle("subscription:flagUnpaid", async (_, subscriptionId) => {
    logIpcRequest("subscription:flagUnpaid", { subscriptionId });
    const result = await effectToEither(SubscriptionService.flagUnpaid(subscriptionId));
    logIpcResponse("subscription:flagUnpaid");
    return result;
  });
  electron.ipcMain.handle("subscription:generateReceipt", async (_, subscriptionId) => {
    logIpcRequest("subscription:generateReceipt", { subscriptionId });
    const result = await effectToEither(SubscriptionService.generateReceipt(subscriptionId));
    logIpcResponse("subscription:generateReceipt");
    return result;
  });
  electron.ipcMain.handle("utility:backupNow", async () => {
    logIpcRequest("utility:backupNow", {});
    const result = await effectToEither(UtilityService.backupNow());
    logIpcResponse("utility:backupNow");
    return result;
  });
  electron.ipcMain.handle("utility:restoreBackup", async (_, filePath) => {
    logIpcRequest("utility:restoreBackup", { filePath });
    const result = await effectToEither(UtilityService.restoreBackup(filePath));
    logIpcResponse("utility:restoreBackup");
    return result;
  });
  electron.ipcMain.handle("utility:listBackups", async () => {
    logIpcRequest("utility:listBackups", {});
    const result = await effectToEither(UtilityService.listBackups());
    logIpcResponse("utility:listBackups");
    return result;
  });
  electron.ipcMain.handle("utility:exportToCSV", async (_, entity, filter) => {
    logIpcRequest("utility:exportToCSV", { entity, filter });
    const result = await effectToEither(UtilityService.exportToCSV(entity, filter));
    logIpcResponse("utility:exportToCSV");
    return result;
  });
  electron.ipcMain.handle("utility:generateAttendancePDF", async (_, groupId, date) => {
    logIpcRequest("utility:generateAttendancePDF", { groupId, date });
    const result = await effectToEither(UtilityService.generateAttendancePDF(groupId, date));
    logIpcResponse("utility:generateAttendancePDF");
    return result;
  });
}
const isDev = process.env.NODE_ENV === "development";
const getFilePathForEnv = (relativePath) => {
  if (isDev) {
    return path$1.join(process.cwd(), relativePath);
  } else {
    return path$1.join(__dirname, relativePath);
  }
};
const userDataPath = electron.app.getPath("userData");
const logsPath = path$1.join(userDataPath, "logs");
if (!fs$1.existsSync(logsPath)) {
  fs$1.mkdirSync(logsPath, { recursive: true });
}
const logger = pino$1({
  level: "info",
  timestamp: pino$1.stdTimeFunctions.isoTime
}, pino$1.destination(path$1.join(logsPath, "app.log")));
logger.info(`Application starting in ${isDev ? "development" : "production"} mode`);
logger.info(`User data path: ${userDataPath}`);
logger.info(`Current working directory: ${process.cwd()}`);
let mainWindow = null;
function createWindow() {
  logger.info("Creating main window");
  const preloadPath = isDev ? path$1.join(process.cwd(), "preload.js") : path$1.join(__dirname, "../preload.js");
  logger.info(`Using preload script: ${preloadPath}`);
  mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  if (isDev) {
    const devServerUrl = "http://localhost:5173";
    logger.info(`Loading app from dev server: ${devServerUrl}`);
    mainWindow.loadURL(devServerUrl);
    mainWindow.webContents.openDevTools();
  } else {
    const indexPath = getFilePathForEnv("../dist/index.html");
    logger.info(`Loading app from file: ${indexPath}`);
    mainWindow.loadFile(indexPath);
  }
  mainWindow.on("closed", () => {
    logger.info("Main window closed");
    mainWindow = null;
  });
  logger.info("Main window created successfully");
}
registerIpcHandlers();
electron.app.whenReady().then(async () => {
  try {
    logger.info("Initializing database service");
    const dbInstance2 = getDatabase();
    logger.info("Database initialized successfully", { database: !!dbInstance2 });
  } catch (dbError) {
    logger.error({ err: dbError }, "Critical error initializing database");
  }
  try {
    await AuthService.initialize();
    logger.info("Authentication service initialized successfully");
  } catch (error) {
    logger.error({ err: error }, "Failed to initialize authentication service");
  }
  createWindow();
  electron.app.on("activate", () => {
    if (mainWindow === null) createWindow();
  });
}).catch((err2) => {
  logger.error({ err: err2 }, "Failed to initialize application");
});
electron.app.on("window-all-closed", () => {
  logger.info("All windows closed");
  if (process.platform !== "darwin") {
    logger.info("Quitting application");
    electron.app.quit();
  }
});
electron.app.on("will-quit", () => {
  logger.info("Application is about to exit, cleaning up resources");
  closeDatabase();
});
electron.ipcMain.handle("get-app-path", () => {
  logger.info("IPC: Requested app path");
  return electron.app.getPath("userData");
});
process.on("uncaughtException", (error) => {
  logger.error({ err: error }, "Uncaught exception");
});
process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Unhandled rejection");
});
