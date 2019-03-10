/* eslint-disable no-unused-vars */
/**
 * @module polyfills
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2018.10.27 00:14
 * @version 2018.10.27 00:14
 */

/*{{{ Global polyfill definitions... */

  /* Object.values {{{ */
  if ( !Object.values ) {
      Object.values = function values(O) {
          return Object.keys(O).reduce(function (v, k) { return v.concat(typeof k === 'string' && O.hasOwnProperty(k) ? [O[k]] : []); }, []);
      };
  }/*}}}*/

  /* Object.entries {{{ */
  if ( !Object.entries ) {
      Object.entries = function entries(O) {
          return Object.keys(O).reduce(function (e, k) { return e.concat(typeof k === 'string' && O.hasOwnProperty(k) ? [[k, O[k]]] : []); }, []);
      };
  }/*}}}*/

  /* Object.assign {{{ */
  if ( typeof Object.assign !== 'function') {
      Object.assign = function(target, varArgs) { // .length of function is 2
          'use strict';
          if (target == null) { // TypeError if undefined or null
              throw new TypeError('Cannot convert undefined or null to object');
          }

          var to = Object(target);

          for (var index = 1; index < arguments.length; index++) {
              var nextSource = arguments[index];

              if (nextSource != null) { // Skip over if undefined or null
                  for (var nextKey in nextSource) {
                      // Avoid bugs when hasOwnProperty is shadowed
                      if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                          to[nextKey] = nextSource[nextKey];
                      }
                  }
              }
          }
          return to;
      };
  }/*}}}*/

  /*{{{ Date.now() */if ( !Date.now ) {
      Date.now = function now () {
          return new Date().getTime();
      };
  }/*}}}*/

  /*{{{ String.includes() */if ( !String.prototype.includes ) {
      Object.defineProperty(String.prototype, 'includes', { value : function(search, start) {
          'use strict';
          if (typeof start !== 'number') {
              start = 0;
          }

          if (start + search.length > this.length) {
              return false;
          }
          else {
              return this.indexOf(search, start) !== -1;
          }
      }});
  }/*}}}*/

  /*{{{ String.startsWith() */if ( !String.prototype.startsWith ) {
      Object.defineProperty(String.prototype, 'startsWith', { value : function startsWith (searchString, position){
          position = position || 0;
          return this.substr(position, searchString.length) === searchString;
      }});
  }/*}}}*/

  /*{{{ String.endsWith() */if ( !String.prototype.endsWith ) {
      Object.defineProperty(String.prototype, 'endsWith', { value : function endsWith (searchString, position) {
          var subjectString = this.toString();
          if ( typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length ) {
              position = subjectString.length;
          }
          position -= searchString.length;
          var lastIndex = subjectString.indexOf(searchString, position);
          return lastIndex !== -1 && lastIndex === position;
      }});
  }/*}}}*/

  /*{{{ String.repeat() */if (!String.prototype.repeat) {
      String.prototype.repeat = function(count) {
          'use strict';
          if (this == null) {
              throw new TypeError('can\'t convert ' + this + ' to object');
          }
          var str = '' + this;
          count = +count;
          if (count !== count) {
              count = 0;
          }
          if (count < 0) {
              throw new RangeError('repeat count must be non-negative');
          }
          if (count === Infinity) {
              throw new RangeError('repeat count must be less than infinity');
          }
          count = Math.floor(count);
          if (str.length === 0 || count === 0) {
              return '';
          }
          // Ensuring count is a 31-bit integer allows us to heavily optimize the
          // main part. But anyway, most current (August 2014) browsers can't handle
          // strings 1 << 28 chars or longer, so:
          if ( (str.length * count) >= (1 << 28) ) {
              throw new RangeError('repeat count must not overflow maximum string size');
          }
          var rpt = '';
          for (;;) {
              if ((count & 1) === 1) {
                  rpt += str;
              }
              count >>>= 1;
              if (count === 0) {
                  break;
              }
              str += str;
          }
          // Could we try:
          // return Array(count + 1).join(this);
          return rpt;
      };
  }/*}}}*/

  /*{{{ Array.includes */if ( !Array.prototype.includes ) { // https://tc39.github.io/ecma262/#sec-array.prototype.includes
      Object.defineProperty(Array.prototype, 'includes', { value: function(searchElement, fromIndex) {

          // 1. Let O be ? ToObject(this value).
          if ( this === null || this === undefined ) {
              throw new TypeError('"this" is null or not defined');
          }

          var o = Object(this);

          // 2. Let len be ? ToLength(? Get(O, "length")).
          var len = Number(o.length); // o.length >>> 0;

          // 3. If len is 0, return false.
          if ( !len ) { // len === 0) {
              return false;
          }

          // 4. Let n be ? ToInteger(fromIndex).
          //    (If fromIndex is undefined, this step produces the value 0.)
          var n = fromIndex || 0;

          // 5. If n ≥ 0, then
          //  a. Let k be n.
          // 6. Else n < 0,
          //  a. Let k be len + n.
          //  b. If k < 0, let k be 0.
          var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

          function sameValueZero(x, y) {
              return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
          }

          // 7. Repeat, while k < len
          while (k < len) {
              // a. Let elementK be the result of ? Get(O, ! ToString(k)).
              // b. If SameValueZero(searchElement, elementK) is true, return true.
              // c. Increase k by 1.
              if (sameValueZero(o[k], searchElement)) {
                  return true;
              }
              k++;
          }

          // 8. Return false
          return false;
      }});
  }/*}}}*/

  /*{{{ Array.reduce */
  if ( !Array.prototype.reduce ) { // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
      Object.defineProperty(Array.prototype, 'reduce', {
          value: function(callback /*, initialValue*/) {
              if (this === null) {
                  throw new TypeError( 'Array.prototype.reduce ' +
                      'called on null or undefined' );
              }
              if (typeof callback !== 'function') {
                  throw new TypeError( callback +
                      ' is not a function');
              }

              // 1. Let O be ? ToObject(this value).
              var o = Object(this);

              // 2. Let len be ? ToLength(? Get(O, "length")).
              var len = Number(o.length);//o.length >>> 0;

              // Steps 3, 4, 5, 6, 7
              var k = 0;
              var value;

              if (arguments.length >= 2) {
                  value = arguments[1];
              } else {
                  while (k < len && !(k in o)) {
                      k++;
                  }

                  // 3. If len is 0 and initialValue is not present,
                  //    throw a TypeError exception.
                  if (k >= len) {
                      throw new TypeError( 'Reduce of empty array ' +
                          'with no initial value' );
                  }
                  value = o[k++];
              }

              // 8. Repeat, while k < len
              while (k < len) {
                  // a. Let Pk be ! ToString(k).
                  // b. Let kPresent be ? HasProperty(O, Pk).
                  // c. If kPresent is true, then
                  //    i.  Let kValue be ? Get(O, Pk).
                  //    ii. Let accumulator be ? Call(
                  //          callbackfn, undefined,
                  //          « accumulator, kValue, k, O »).
                  if (k in o) {
                      value = callback(value, o[k], k, o);
                  }

                  // d. Increase k by 1.
                  k++;
              }

              // 9. Return accumulator.
              return value;
          }
      });
  }
  /*}}}*/

  /*{{{ Array.from */
  // Production steps of ECMA-262, Edition 6, 22.1.2.1
  // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from
  if ( !Array.from ) {
      Array.from = (function () {
          var toStr = Object.prototype.toString;
          var isCallable = function (fn) {
              return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
          };
          var toInteger = function (value) {
              var number = Number(value);
              if (isNaN(number)) { return 0; }
              if (number === 0 || !isFinite(number)) { return number; }
              return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
          };
          var maxSafeInteger = Math.pow(2, 53) - 1;
          var toLength = function (value) {
              var len = toInteger(value);
              return Math.min(Math.max(len, 0), maxSafeInteger);
          };

          // The length property of the from method is 1.
          return function from(arrayLike/*, mapFn, thisArg */) {
              // 1. Let C be the this value.
              var C = this;

              // 2. Let items be ToObject(arrayLike).
              var items = Object(arrayLike);

              // 3. ReturnIfAbrupt(items).
              if (arrayLike === null) {
                  throw new TypeError('Array.from requires an array-like object - not null or undefined');
              }

              // 4. If mapfn is undefined, then let mapping be false.
              var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
              var T;
              if (typeof mapFn !== 'undefined') {
                  // 5. else
                  // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                  if (!isCallable(mapFn)) {
                      throw new TypeError('Array.from: when provided, the second argument must be a function');
                  }

                  // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                  if (arguments.length > 2) {
                      T = arguments[2];
                  }
              }

              // 10. Let lenValue be Get(items, "length").
              // 11. Let len be ToLength(lenValue).
              var len = toLength(items.length);

              // 13. If IsConstructor(C) is true, then
              // 13. a. Let A be the result of calling the [[Construct]] internal method
              // of C with an argument list containing the single item len.
              // 14. a. Else, Let A be ArrayCreate(len).
              var A = isCallable(C) ? Object(new C(len)) : new Array(len);

              // 16. Let k be 0.
              var k = 0;
              // 17. Repeat, while k < len… (also steps a - h)
              var kValue;
              while (k < len) {
                  kValue = items[k];
                  if (mapFn) {
                      A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                  } else {
                      A[k] = kValue;
                  }
                  k += 1;
              }
              // 18. Let putStatus be Put(A, "length", len, true).
              A.length = len;
              // 20. Return A.
              return A;
          };
      }());
  }
  /*}}}*/

/*}}}*/

modules.define('polyfills', [
],
function define(provide,
// eslint-disable-next-line no-unused-vars
__BASE) {

  /**
   * @exports
   * @class polyfills
   * @bem
   */
  var _polyfills_proto = /* @lends polyfills.prototype */ {
  };

  // Provide...
  provide(_polyfills_proto);

}); // Module end
