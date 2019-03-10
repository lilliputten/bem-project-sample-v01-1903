/* eslint-env commonjs */
/**
 * @module objects
 * @overview Расширяем методы objects.
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.05.23, 12:50
 * @version 2018.11.02, 04:50
 *
 * $Date: 2018-07-17 14:16:29 +0300 (Tue, 17 Jul 2018) $
 * $Id: objects.js 10357 2018-07-17 11:16:29Z miheev $
 *
 * @see {@link objects}
 *
 *    WEB_TINTS\source\libs\bem-core\common.blocks\objects\
 *    WEB_TINTS\source\libs\bem-core\common.blocks\objects\objects.vanilla.js
 *
 * TODO:
 *
 * - 2018.11.02, 05:51 -- Move general methods to `helpers__objects`
 *
 */

modules.define('objects', [
], function(provide,
objectsBase) {

  var typeArray = '[object Array]';
  var typeObject = '[object Object]';

  var hasOwnProp = Object.prototype.hasOwnProperty;
  var isArray = Array.isArray;

  var objectsExtend = /** @lends objects.prototype */ {

    /** isComprised ** {{{ Проверяем, включается ли один объект в другой, как подмножество (с равными значениями ключей)
     * @param {Object} src - Исходный (включаемый) объект
     * @param {Object} [tgt] - Объект для сравнения (включающий)
     */
    isComprised : function (src, tgt) {
      var isComprised = true;
      src && Object.keys(src).map(function(key){
        if ( !tgt || tgt[key] === undefined || src[key] !== tgt[key] ) {
          isComprised = false;
        }
      });
      return isComprised;
    },/*}}}*/

    /** walkComprised * {{{ Найти (при помощи isComprised) все соответствующие объекты.
     * @param {Object|Array} container - Контейнер, в котором ищем объекты
     * @param {Object} tgt - Ключи и значения для искомого объекта
     * @param {Function} fn callback: `function(obj, key, container){}`
     * @param {Object} [ctx] callbacks's context
     */
    walkComprised : function (container, tgt, fn, ctx) {
      for ( var key in container ) {
        if ( hasOwnProp.call(container, key) && this.isComprised(tgt, container[key]) ) {
          ctx ? fn.call(ctx, container[key], key, container) : fn(container[key], key, container);
          // return key;
        }
      }
    },/*}}}*/

    /** walkDeepComprised * {{{ Найти (при помощи isComprised) все соответствующие вложенные объекты.
     * @param {Object|Array} container - Контейнер, в котором ищем объекты
     * @param {Object} tgt - Ключи и значения для искомого объекта
     * @param {Function} fn callback: `function(obj, key, container){}`
     * @param {Object} [ctx] callbacks's context
     */
    walkDeepComprised : function (container, tgt, fn, ctx) {
      this.walkComprised.apply(this, arguments);
      for ( var key in container ) {
        if ( hasOwnProp.call(container, key) && typeof container[key] === 'object' ) {
          this.walkDeepComprised(container[key], tgt, fn, ctx);
        }
      }
    },/*}}}*/

    /** deepCopyAndWalkComprised * {{{ Найти (при помощи isComprised) все соответствующие вложенные объекты.
     * @param {Object|Array} container - Контейнер, в котором ищем объекты
     * @param {Object} tgt - Ключи и значения для искомого объекта
     * @param {Function} fn callback: `function(obj, key, container){}`
     * @param {Object} [ctx] callbacks's context
     * @returns {Object}
     */
    deepCopyAndWalkComprised : function (container, tgt, fn, ctx) {
      container = this.clone(container);
      for ( var key in container ) {
        if ( hasOwnProp.call(container, key) && typeof container[key] === 'object' ) {
          container[key] = this.deepCopyAndWalkComprised(container[key], tgt, fn, ctx);
        }
      }
      typeof fn === 'function' && this.walkComprised(container, tgt, fn, ctx);
      return container;
    },/*}}}*/

    /** clone ** {{{ Клонировать объект
     * @param {Object|Array} obj - Исходный объект
     * @returns {Object|Array} - Клонированный объект
     */
    clone : function (obj) {

      if ( isArray(obj) ) {
        obj = obj.slice(0);
      }
      else {
        obj = Object.assign({}, obj);
      }

      return obj;

    },/*}}}*/

    /** deepExtend ** {{{ Расширить объект с объединением свойств
     * @param {Object} obj1 - Исходный объект для расширения
     * @param {Object} obj2 - Объект для расширения
     * @returns {Object} - Расширенный объект
     * TODO: Если разные типы (напр., Object & Boolean), то просто заменять значения!
     */
    deepExtend : function (obj1, obj2) {

      obj1 == null && ( obj1 = {} );
      obj2 == null && ( obj2 = {} );

      var obj1type = typeof obj1,
        obj2type = typeof obj2,
        keys = ( obj1 && obj1type === 'object' ) ? Object.keys(obj1) : []
      ;

      // Объединяем ключи первого и второго объектов
      if ( obj2 && obj2type === 'object' ) {
        Object.keys(obj2).map(function(id){
          keys.includes(id) || keys.push(id);
        });
      }
      // Если второй объект -- скаляр, возвращаем его
      else {
        return obj2;
      }

      var obj = {};
      keys.map(function(id){
        var
          v1 = obj1[id], t1 = typeof v1,
          v2 = obj2[id], t2 = typeof v2,
          v
        ;
        // Если типы разные или не объект и не массив, то сохраняем одно из свойств (у второго преимущество)
        if ( v1 == null && v2 == null ) {
          v = v2;
        }
        else if ( t1 !== 'object' && t2 !== 'object' ) {
          v = ( v2 != null ) ? v2 : v1;
        }
        else if ( v1 == null ) {
          v = this.clone(v2);
        }
        else if ( v2 == null ) {
          v = this.clone(v1);
        }
        // Если массивы, то объединяем
        else if ( isArray(v1) && isArray(v2) ) {
          v = v1.concat(v2);
        }
        // Если объекты, то расширяем (рекурсивно)
        else {
          v = this.deepExtend(v1, v2);
        }
        obj[id] = v;
      }, this);

      return obj;

    },/*}}}*/

    /** arrayHasOne ** {{{ Содержит ли массив хотя бы одно из значений
     * @param {Array} arr - Массив для поиска
     * @param {Array} vals - Искомые значения
     * @returns {Boolean}
     */
    arrayHasOne : function (arr, vals) {
      if ( !isArray(arr) || !isArray(vals) ) {
        return false;
      }
      for ( var i=0; i<vals.length; i++ ) {
        if ( arr.includes(vals[i]) ) {
          return true;
        }
      }
      return false;
    },/*}}}*/

    /** average ** {{{ Рассчитываем среднее значение для массива
     * TODO: Move to objects?
     * @param {Number[]} ary - Массив значений
     * @return {Number}
     */
    average : function (ary) {
      var avg = 0;
      if ( isArray(ary) && ary.length ) {
        for ( var i=0; i<ary.length; i++ ) {
          avg += Number(ary[i]);
        }
        avg /= ary.length;
      }
      return avg;
    },/*}}}*/

    /** getByKey ** {{{ Получить элемент объекта по "глубокому" ключу (напр., obj.a.b.c)
     * @param {Object} obj - Объект
     * @param {String|String[]} keysPath - Ключ свойства (напр. 'a.b.c' или ['a','b','c')
     * @param {String} [DEFAULT_VALUE=null] - Значение по умолчанию
     * */
    getByKey : function (obj, keysPath, DEFAULT_VALUE) {

      // DEFAULT_VALUE = DEFAULT_VALUE || null;

      if ( !isArray(keysPath) ) {
        if ( typeof keysPath !== 'string' ) {
          throw new Error('keyPath must be array or string.');
        }
        keysPath = keysPath.split('.');
      }

      keysPath.forEach(function(id) {
        var type = typeof obj;
        if ( type === 'object' ) {
          obj = ( obj[id] != null ) ? obj[id] : DEFAULT_VALUE;
        }
      });

      return obj;

    },/*}}}*/

    /** getContextValue ** {{{ Получение значение элемента из контекста
     * @param {Object|Function|Object[]|Function[]} ctx - Объект или метод для получения значений
     * @param {String|String[]} id - Ключ свойства (напр. 'a.b.c' или ['a','b','c')
     * @param {String} [DEFAULT_VALUE=null] - Значение по умолчанию
     * @param {Object} [callCtx] - Контекст вызова метода (если typeof ctx == 'function')
    */
    getContextValue : function (ctx, id, DEFAULT_VALUE, callCtx) {

      var val;

      if ( isArray(ctx) ) {
        for ( var i = 0; i < ctx.length; i++ ) {
          val = this.getContextValue(ctx[i], id, null, callCtx);
          if ( val != null ) {
            return val;
          }
        }
        return DEFAULT_VALUE;
      }

      if ( typeof ctx === 'function' ) {
        val = callCtx ? ctx.call(callCtx, id) : ctx(id);
        return ( val != null ) ? val : DEFAULT_VALUE;
      }

      return this.getByKey(ctx, id, DEFAULT_VALUE);

    },/*}}}*/

    /** compareValues ** {{{ Сравниваем два значения (вспомогательный метод для `isEqual`)
     * @param {*} item1
     * @param {*} item2
     * @return {Boolean}
     */
    compareValues : function (item1, item2) {

      // Get the object type
      var itemType = Object.prototype.toString.call(item1);

      // If an object or array, compare recursively
      if ([typeArray, typeObject].indexOf(itemType) >= 0) {
        if (!this.isEqual(item1, item2)) {
          return false;
        }
      }

      // Otherwise, do a simple comparison
      else {

        // If the two items are not the same type, return false
        if (itemType !== Object.prototype.toString.call(item2)) {
          return false;
        }

        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (itemType === '[object Function]') {
          if (item1.toString() !== item2.toString()) {
            return false;
          }
        } else {
          if (item1 !== item2) {
            return false;
          }
        }

      }

    },/*}}}*/

    /** isEqual ** {{{ Сравниваем два (любых) значения
     * @see [Check if two arrays or objects are equal with JavaScript | Go Make Things](https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/)
     * @param {*} value
     * @param {*} other
     * @return {Boolean}
     */
    isEqual : function (value, other) {

      // Get the value type
      var type = Object.prototype.toString.call(value);

      // If the two objects are not the same type, return false...
      if (type !== Object.prototype.toString.call(other)) {
        return false;
      }
      // If null-like objects...
      else if ( value == null && other == null ) {
        return false;
      }
      // If items are not an object or array, return comparsion result...
      else if ([typeArray, typeObject].indexOf(type) < 0) {
        return ( value === other );
      }

      // Is array?
      var isArray = ( type === typeArray );

      // Compare the length of the length of the two items (types are same)
      var valueLen = isArray ? value.length : Object.keys(value).length;
      var otherLen = isArray ? other.length : Object.keys(other).length;
      if (valueLen !== otherLen) {
        return false;
      }

      // Compare properties
      if ( isArray ) {
        for ( var i = 0; i < valueLen; i++ ) {
          if ( !this.compareValues(value[i], other[i]) ) {
            return false;
          }
        }
      }
      else {
        for ( var key in value ) {
          if ( value.hasOwnProperty(key) && !this.compareValues(value[key], other[key]) ) {
            return false;
          }
        }
      }

      // If nothing failed, return true
      return true;

    },/*}}}*/

  };

  var objects = objectsBase.extend(objectsBase, objectsExtend);

  // Export
  provide(objects);

});
