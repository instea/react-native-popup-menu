(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react-native'), require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react-native', 'react'], factory) :
  (global = global || self, factory(global.ReactNativePopupMenu = {}, global.reactNative, global.React));
}(this, function (exports, reactNative, React) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  // platform select polyfil for older RN versions

  if (!reactNative.Platform.select) {
    reactNative.Platform.select = function (obj) {
      return obj[reactNative.Platform.OS];
    };
  }

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

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  /**
   * Promisifies measure's callback function and returns layout object.
   */

  var measure = function measure(ref) {
    return new Promise(function (resolve) {
      ref.measure(function (x, y, width, height, pageX, pageY) {
        resolve({
          x: pageX,
          y: pageY,
          width: width,
          height: height
        });
      });
    });
  };
  /**
   * Create unique menu name across all menu instances.
   */

  var makeName = function () {
    var nextID = 1;
    return function () {
      return "menu-".concat(nextID++);
    };
  }();
  /**
   * Create touchable component based on passed parameter and platform.
   * It also returns default props for specific touchable types.
   */

  function makeTouchable(TouchableComponent) {
    var Touchable = TouchableComponent || reactNative.Platform.select({
      android: reactNative.TouchableNativeFeedback,
      ios: reactNative.TouchableHighlight,
      default: reactNative.TouchableHighlight
    });
    var defaultTouchableProps = {};

    if (Touchable === reactNative.TouchableHighlight) {
      defaultTouchableProps = {
        underlayColor: 'rgba(0, 0, 0, 0.1)'
      };
    }

    return {
      Touchable: Touchable,
      defaultTouchableProps: defaultTouchableProps
    };
  }
  /**
  Converts iterator to array
  */

  function iterator2array(it) {
    // workaround around https://github.com/instea/react-native-popup-menu/issues/41#issuecomment-340290127
    var arr = [];

    for (var next = it.next(); !next.done; next = it.next()) {
      arr.push(next.value);
    }

    return arr;
  }
  /**
   * Higher order component to deprecate usage of component.
   * message - deprecate warning message
   * methods - array of method names to be delegated to deprecated component
   */

  function deprecatedComponent(message) {
    var methods = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    return function deprecatedComponentHOC(Component) {
      var _temp;

      return _temp =
      /*#__PURE__*/
      function (_React$Component) {
        _inherits(DeprecatedComponent, _React$Component);

        function DeprecatedComponent() {
          var _getPrototypeOf2;

          var _this;

          _classCallCheck(this, DeprecatedComponent);

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DeprecatedComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));

          _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onRef", function (ref) {
            return _this.ref = ref;
          });

          methods.forEach(function (name) {
            // delegate methods to the component
            _this[name] = function () {
              var _this$ref;

              return _this.ref && (_this$ref = _this.ref)[name].apply(_this$ref, arguments);
            };
          });
          return _this;
        }

        _createClass(DeprecatedComponent, [{
          key: "render",
          value: function render() {
            return React__default.createElement(Component, _extends({}, this.props, {
              ref: this.onRef
            }));
          }
        }, {
          key: "componentDidMount",
          value: function componentDidMount() {
            console.warn(message);
          }
        }]);

        return DeprecatedComponent;
      }(React__default.Component), _temp;
    };
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
  	if (val === null || val === undefined) {
  		throw new TypeError('Object.assign cannot be called with null or undefined');
  	}

  	return Object(val);
  }

  function shouldUseNative() {
  	try {
  		if (!Object.assign) {
  			return false;
  		}

  		// Detect buggy property enumeration order in older V8 versions.

  		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
  		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
  		test1[5] = 'de';
  		if (Object.getOwnPropertyNames(test1)[0] === '5') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test2 = {};
  		for (var i = 0; i < 10; i++) {
  			test2['_' + String.fromCharCode(i)] = i;
  		}
  		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
  			return test2[n];
  		});
  		if (order2.join('') !== '0123456789') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test3 = {};
  		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
  			test3[letter] = letter;
  		});
  		if (Object.keys(Object.assign({}, test3)).join('') !==
  				'abcdefghijklmnopqrst') {
  			return false;
  		}

  		return true;
  	} catch (err) {
  		// We don't expect any of the above to throw, but better to be safe.
  		return false;
  	}
  }

  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  	var from;
  	var to = toObject(target);
  	var symbols;

  	for (var s = 1; s < arguments.length; s++) {
  		from = Object(arguments[s]);

  		for (var key in from) {
  			if (hasOwnProperty.call(from, key)) {
  				to[key] = from[key];
  			}
  		}

  		if (getOwnPropertySymbols) {
  			symbols = getOwnPropertySymbols(from);
  			for (var i = 0; i < symbols.length; i++) {
  				if (propIsEnumerable.call(from, symbols[i])) {
  					to[symbols[i]] = from[symbols[i]];
  				}
  			}
  		}
  	}

  	return to;
  };

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

  var ReactPropTypesSecret_1 = ReactPropTypesSecret;

  var printWarning = function() {};

  {
    var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
    var loggedTypeFailures = {};

    printWarning = function(text) {
      var message = 'Warning: ' + text;
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };
  }

  /**
   * Assert that the values match with the type specs.
   * Error messages are memorized and will only be shown once.
   *
   * @param {object} typeSpecs Map of name to a ReactPropType
   * @param {object} values Runtime values that need to be type-checked
   * @param {string} location e.g. "prop", "context", "child context"
   * @param {string} componentName Name of the component for error messages.
   * @param {?Function} getStack Returns the component stack.
   * @private
   */
  function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
    {
      for (var typeSpecName in typeSpecs) {
        if (typeSpecs.hasOwnProperty(typeSpecName)) {
          var error;
          // Prop type validation may throw. In case they do, we don't want to
          // fail the render phase where it didn't fail before. So we log it.
          // After these have been cleaned up, we'll let them throw.
          try {
            // This is intentionally an invariant that gets caught. It's the same
            // behavior as without this statement except with a better message.
            if (typeof typeSpecs[typeSpecName] !== 'function') {
              var err = Error(
                (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
                'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
              );
              err.name = 'Invariant Violation';
              throw err;
            }
            error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
          } catch (ex) {
            error = ex;
          }
          if (error && !(error instanceof Error)) {
            printWarning(
              (componentName || 'React class') + ': type specification of ' +
              location + ' `' + typeSpecName + '` is invalid; the type checker ' +
              'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
              'You may have forgotten to pass an argument to the type checker ' +
              'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
              'shape all require an argument).'
            );

          }
          if (error instanceof Error && !(error.message in loggedTypeFailures)) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures[error.message] = true;

            var stack = getStack ? getStack() : '';

            printWarning(
              'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
            );
          }
        }
      }
    }
  }

  var checkPropTypes_1 = checkPropTypes;

  var printWarning$1 = function() {};

  {
    printWarning$1 = function(text) {
      var message = 'Warning: ' + text;
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };
  }

  function emptyFunctionThatReturnsNull() {
    return null;
  }

  var factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
    /* global Symbol */
    var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
    var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

    /**
     * Returns the iterator method function contained on the iterable object.
     *
     * Be sure to invoke the function with the iterable as context:
     *
     *     var iteratorFn = getIteratorFn(myIterable);
     *     if (iteratorFn) {
     *       var iterator = iteratorFn.call(myIterable);
     *       ...
     *     }
     *
     * @param {?object} maybeIterable
     * @return {?function}
     */
    function getIteratorFn(maybeIterable) {
      var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
      if (typeof iteratorFn === 'function') {
        return iteratorFn;
      }
    }

    /**
     * Collection of methods that allow declaration and validation of props that are
     * supplied to React components. Example usage:
     *
     *   var Props = require('ReactPropTypes');
     *   var MyArticle = React.createClass({
     *     propTypes: {
     *       // An optional string prop named "description".
     *       description: Props.string,
     *
     *       // A required enum prop named "category".
     *       category: Props.oneOf(['News','Photos']).isRequired,
     *
     *       // A prop named "dialog" that requires an instance of Dialog.
     *       dialog: Props.instanceOf(Dialog).isRequired
     *     },
     *     render: function() { ... }
     *   });
     *
     * A more formal specification of how these methods are used:
     *
     *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
     *   decl := ReactPropTypes.{type}(.isRequired)?
     *
     * Each and every declaration produces a function with the same signature. This
     * allows the creation of custom validation functions. For example:
     *
     *  var MyLink = React.createClass({
     *    propTypes: {
     *      // An optional string or URI prop named "href".
     *      href: function(props, propName, componentName) {
     *        var propValue = props[propName];
     *        if (propValue != null && typeof propValue !== 'string' &&
     *            !(propValue instanceof URI)) {
     *          return new Error(
     *            'Expected a string or an URI for ' + propName + ' in ' +
     *            componentName
     *          );
     *        }
     *      }
     *    },
     *    render: function() {...}
     *  });
     *
     * @internal
     */

    var ANONYMOUS = '<<anonymous>>';

    // Important!
    // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
    var ReactPropTypes = {
      array: createPrimitiveTypeChecker('array'),
      bool: createPrimitiveTypeChecker('boolean'),
      func: createPrimitiveTypeChecker('function'),
      number: createPrimitiveTypeChecker('number'),
      object: createPrimitiveTypeChecker('object'),
      string: createPrimitiveTypeChecker('string'),
      symbol: createPrimitiveTypeChecker('symbol'),

      any: createAnyTypeChecker(),
      arrayOf: createArrayOfTypeChecker,
      element: createElementTypeChecker(),
      instanceOf: createInstanceTypeChecker,
      node: createNodeChecker(),
      objectOf: createObjectOfTypeChecker,
      oneOf: createEnumTypeChecker,
      oneOfType: createUnionTypeChecker,
      shape: createShapeTypeChecker,
      exact: createStrictShapeTypeChecker,
    };

    /**
     * inlined Object.is polyfill to avoid requiring consumers ship their own
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
     */
    /*eslint-disable no-self-compare*/
    function is(x, y) {
      // SameValue algorithm
      if (x === y) {
        // Steps 1-5, 7-10
        // Steps 6.b-6.e: +0 != -0
        return x !== 0 || 1 / x === 1 / y;
      } else {
        // Step 6.a: NaN == NaN
        return x !== x && y !== y;
      }
    }
    /*eslint-enable no-self-compare*/

    /**
     * We use an Error-like object for backward compatibility as people may call
     * PropTypes directly and inspect their output. However, we don't use real
     * Errors anymore. We don't inspect their stack anyway, and creating them
     * is prohibitively expensive if they are created too often, such as what
     * happens in oneOfType() for any type before the one that matched.
     */
    function PropTypeError(message) {
      this.message = message;
      this.stack = '';
    }
    // Make `instanceof Error` still work for returned errors.
    PropTypeError.prototype = Error.prototype;

    function createChainableTypeChecker(validate) {
      {
        var manualPropTypeCallCache = {};
        var manualPropTypeWarningCount = 0;
      }
      function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
        componentName = componentName || ANONYMOUS;
        propFullName = propFullName || propName;

        if (secret !== ReactPropTypesSecret_1) {
          if (throwOnDirectAccess) {
            // New behavior only for users of `prop-types` package
            var err = new Error(
              'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
              'Use `PropTypes.checkPropTypes()` to call them. ' +
              'Read more at http://fb.me/use-check-prop-types'
            );
            err.name = 'Invariant Violation';
            throw err;
          } else if (typeof console !== 'undefined') {
            // Old behavior for people using React.PropTypes
            var cacheKey = componentName + ':' + propName;
            if (
              !manualPropTypeCallCache[cacheKey] &&
              // Avoid spamming the console because they are often not actionable except for lib authors
              manualPropTypeWarningCount < 3
            ) {
              printWarning$1(
                'You are manually calling a React.PropTypes validation ' +
                'function for the `' + propFullName + '` prop on `' + componentName  + '`. This is deprecated ' +
                'and will throw in the standalone `prop-types` package. ' +
                'You may be seeing this warning due to a third-party PropTypes ' +
                'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.'
              );
              manualPropTypeCallCache[cacheKey] = true;
              manualPropTypeWarningCount++;
            }
          }
        }
        if (props[propName] == null) {
          if (isRequired) {
            if (props[propName] === null) {
              return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
            }
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
          }
          return null;
        } else {
          return validate(props, propName, componentName, location, propFullName);
        }
      }

      var chainedCheckType = checkType.bind(null, false);
      chainedCheckType.isRequired = checkType.bind(null, true);

      return chainedCheckType;
    }

    function createPrimitiveTypeChecker(expectedType) {
      function validate(props, propName, componentName, location, propFullName, secret) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== expectedType) {
          // `propValue` being instance of, say, date/regexp, pass the 'object'
          // check, but we can offer a more precise error message here rather than
          // 'of type `object`'.
          var preciseType = getPreciseType(propValue);

          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createAnyTypeChecker() {
      return createChainableTypeChecker(emptyFunctionThatReturnsNull);
    }

    function createArrayOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== 'function') {
          return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
        }
        var propValue = props[propName];
        if (!Array.isArray(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
        }
        for (var i = 0; i < propValue.length; i++) {
          var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret_1);
          if (error instanceof Error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createElementTypeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        if (!isValidElement(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createInstanceTypeChecker(expectedClass) {
      function validate(props, propName, componentName, location, propFullName) {
        if (!(props[propName] instanceof expectedClass)) {
          var expectedClassName = expectedClass.name || ANONYMOUS;
          var actualClassName = getClassName(props[propName]);
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createEnumTypeChecker(expectedValues) {
      if (!Array.isArray(expectedValues)) {
        printWarning$1('Invalid argument supplied to oneOf, expected an instance of array.');
        return emptyFunctionThatReturnsNull;
      }

      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        for (var i = 0; i < expectedValues.length; i++) {
          if (is(propValue, expectedValues[i])) {
            return null;
          }
        }

        var valuesString = JSON.stringify(expectedValues);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
      }
      return createChainableTypeChecker(validate);
    }

    function createObjectOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== 'function') {
          return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
        }
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
        }
        for (var key in propValue) {
          if (propValue.hasOwnProperty(key)) {
            var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
            if (error instanceof Error) {
              return error;
            }
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createUnionTypeChecker(arrayOfTypeCheckers) {
      if (!Array.isArray(arrayOfTypeCheckers)) {
        printWarning$1('Invalid argument supplied to oneOfType, expected an instance of array.');
        return emptyFunctionThatReturnsNull;
      }

      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (typeof checker !== 'function') {
          printWarning$1(
            'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
            'received ' + getPostfixForTypeWarning(checker) + ' at index ' + i + '.'
          );
          return emptyFunctionThatReturnsNull;
        }
      }

      function validate(props, propName, componentName, location, propFullName) {
        for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
          var checker = arrayOfTypeCheckers[i];
          if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret_1) == null) {
            return null;
          }
        }

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
      }
      return createChainableTypeChecker(validate);
    }

    function createNodeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        if (!isNode(props[propName])) {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createShapeTypeChecker(shapeTypes) {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
        }
        for (var key in shapeTypes) {
          var checker = shapeTypes[key];
          if (!checker) {
            continue;
          }
          var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }

    function createStrictShapeTypeChecker(shapeTypes) {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== 'object') {
          return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
        }
        // We need to check all keys in case some are required but missing from
        // props.
        var allKeys = objectAssign({}, props[propName], shapeTypes);
        for (var key in allKeys) {
          var checker = shapeTypes[key];
          if (!checker) {
            return new PropTypeError(
              'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
              '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
              '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
            );
          }
          var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret_1);
          if (error) {
            return error;
          }
        }
        return null;
      }

      return createChainableTypeChecker(validate);
    }

    function isNode(propValue) {
      switch (typeof propValue) {
        case 'number':
        case 'string':
        case 'undefined':
          return true;
        case 'boolean':
          return !propValue;
        case 'object':
          if (Array.isArray(propValue)) {
            return propValue.every(isNode);
          }
          if (propValue === null || isValidElement(propValue)) {
            return true;
          }

          var iteratorFn = getIteratorFn(propValue);
          if (iteratorFn) {
            var iterator = iteratorFn.call(propValue);
            var step;
            if (iteratorFn !== propValue.entries) {
              while (!(step = iterator.next()).done) {
                if (!isNode(step.value)) {
                  return false;
                }
              }
            } else {
              // Iterator will provide entry [k,v] tuples rather than values.
              while (!(step = iterator.next()).done) {
                var entry = step.value;
                if (entry) {
                  if (!isNode(entry[1])) {
                    return false;
                  }
                }
              }
            }
          } else {
            return false;
          }

          return true;
        default:
          return false;
      }
    }

    function isSymbol(propType, propValue) {
      // Native Symbol.
      if (propType === 'symbol') {
        return true;
      }

      // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
      if (propValue['@@toStringTag'] === 'Symbol') {
        return true;
      }

      // Fallback for non-spec compliant Symbols which are polyfilled.
      if (typeof Symbol === 'function' && propValue instanceof Symbol) {
        return true;
      }

      return false;
    }

    // Equivalent of `typeof` but with special handling for array and regexp.
    function getPropType(propValue) {
      var propType = typeof propValue;
      if (Array.isArray(propValue)) {
        return 'array';
      }
      if (propValue instanceof RegExp) {
        // Old webkits (at least until Android 4.0) return 'function' rather than
        // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
        // passes PropTypes.object.
        return 'object';
      }
      if (isSymbol(propType, propValue)) {
        return 'symbol';
      }
      return propType;
    }

    // This handles more types than `getPropType`. Only used for error messages.
    // See `createPrimitiveTypeChecker`.
    function getPreciseType(propValue) {
      if (typeof propValue === 'undefined' || propValue === null) {
        return '' + propValue;
      }
      var propType = getPropType(propValue);
      if (propType === 'object') {
        if (propValue instanceof Date) {
          return 'date';
        } else if (propValue instanceof RegExp) {
          return 'regexp';
        }
      }
      return propType;
    }

    // Returns a string that is postfixed to a warning about an invalid type.
    // For example, "undefined" or "of type array"
    function getPostfixForTypeWarning(value) {
      var type = getPreciseType(value);
      switch (type) {
        case 'array':
        case 'object':
          return 'an ' + type;
        case 'boolean':
        case 'date':
        case 'regexp':
          return 'a ' + type;
        default:
          return type;
      }
    }

    // Returns class name of the object, if any.
    function getClassName(propValue) {
      if (!propValue.constructor || !propValue.constructor.name) {
        return ANONYMOUS;
      }
      return propValue.constructor.name;
    }

    ReactPropTypes.checkPropTypes = checkPropTypes_1;
    ReactPropTypes.PropTypes = ReactPropTypes;

    return ReactPropTypes;
  };

  var propTypes = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  {
    var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
      Symbol.for &&
      Symbol.for('react.element')) ||
      0xeac7;

    var isValidElement = function(object) {
      return typeof object === 'object' &&
        object !== null &&
        object.$$typeof === REACT_ELEMENT_TYPE;
    };

    // By explicitly using `prop-types` you are opting into new development behavior.
    // http://fb.me/prop-types-in-prod
    var throwOnDirectAccess = true;
    module.exports = factoryWithTypeCheckers(isValidElement, throwOnDirectAccess);
  }
  });

  function withContext(Context) {
    var propName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "context";
    return function wrap(Component) {
      var EnhanceContext =
      /*#__PURE__*/
      function (_React$Component) {
        _inherits(EnhanceContext, _React$Component);

        function EnhanceContext() {
          _classCallCheck(this, EnhanceContext);

          return _possibleConstructorReturn(this, _getPrototypeOf(EnhanceContext).apply(this, arguments));
        }

        _createClass(EnhanceContext, [{
          key: "render",
          value: function render() {
            var _this$props = this.props,
                forwardedRef = _this$props.forwardedRef,
                rest = _objectWithoutProperties(_this$props, ["forwardedRef"]);

            return React__default.createElement(Context.Consumer, null, function (value) {
              var _custom;

              var custom = (_custom = {}, _defineProperty(_custom, propName, value), _defineProperty(_custom, "ref", forwardedRef), _custom);
              return React__default.createElement(Component, _extends({}, custom, rest));
            });
          }
        }]);

        return EnhanceContext;
      }(React__default.Component);

      var name = Component.displayName || Component.name || "Component";
      var consumerName = Context.Consumer.displayName || Context.Consumer.name || "Context.Consumer";

      function enhanceForwardRef(props, ref) {
        return React__default.createElement(EnhanceContext, _extends({}, props, {
          forwardedRef: ref
        }));
      }

      enhanceForwardRef.displayName = "enhanceContext-".concat(consumerName, "(").concat(name, ")");
      var FC = React__default.forwardRef(enhanceForwardRef);
      FC.defaultProps = Component.defaultProps;
      FC.propTypes = Component.propTypes;
      return FC;
    };
  }

  /**
   * Registry to subscribe, unsubscribe and update data of menus.
   *
   * menu data: {
   *   instance: react instance
   *   triggerLayout: Object - layout of menu trigger if known
   *   optionsLayout: Object - layout of menu options if known
   *   optionsCustomStyles: Object - custom styles of options
   * }
  */

  function makeMenuRegistry() {
    var menus = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Map();

    /**
     * Subscribes menu instance.
     */
    function subscribe(instance) {
      var name = instance.getName();

      if (menus.get(name)) {
        console.warn("incorrect usage of popup menu - menu with name ".concat(name, " already exists"));
      }

      menus.set(name, {
        name: name,
        instance: instance
      });
    }
    /**
     * Unsubscribes menu instance.
     */


    function unsubscribe(instance) {
      menus.delete(instance.getName());
    }
    /**
     * Updates layout infomration.
     */


    function updateLayoutInfo(name) {
      var layouts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!menus.has(name)) {
        return;
      }

      var menu = Object.assign({}, menus.get(name));

      if (layouts.hasOwnProperty('triggerLayout')) {
        menu.triggerLayout = layouts.triggerLayout;
      }

      if (layouts.hasOwnProperty('optionsLayout')) {
        menu.optionsLayout = layouts.optionsLayout;
      }

      menus.set(name, menu);
    }

    function setOptionsCustomStyles(name, optionsCustomStyles) {
      if (!menus.has(name)) {
        return;
      }

      var menu = _objectSpread({}, menus.get(name), {
        optionsCustomStyles: optionsCustomStyles
      });

      menus.set(name, menu);
    }
    /**
     * Get `menu data` by name.
     */


    function getMenu(name) {
      return menus.get(name);
    }
    /**
     * Returns all subscribed menus as array of `menu data`
     */


    function getAll() {
      return iterator2array(menus.values());
    }

    return {
      subscribe: subscribe,
      unsubscribe: unsubscribe,
      updateLayoutInfo: updateLayoutInfo,
      getMenu: getMenu,
      getAll: getAll,
      setOptionsCustomStyles: setOptionsCustomStyles
    };
  }

  var OPEN_ANIM_DURATION = 225;
  var CLOSE_ANIM_DURATION = 195;
  var USE_NATIVE_DRIVER = reactNative.Platform.OS !== "web";

  var Backdrop =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Backdrop, _Component);

    function Backdrop() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Backdrop);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Backdrop)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.fadeAnim = new reactNative.Animated.Value(0.001);
      return _this;
    }

    _createClass(Backdrop, [{
      key: "open",
      value: function open() {
        var _this2 = this;

        return new Promise(function (resolve) {
          reactNative.Animated.timing(_this2.fadeAnim, {
            duration: OPEN_ANIM_DURATION,
            toValue: 1,
            useNativeDriver: USE_NATIVE_DRIVER
          }).start(resolve);
        });
      }
    }, {
      key: "close",
      value: function close() {
        var _this3 = this;

        return new Promise(function (resolve) {
          reactNative.Animated.timing(_this3.fadeAnim, {
            duration: CLOSE_ANIM_DURATION,
            toValue: 0,
            useNativeDriver: USE_NATIVE_DRIVER
          }).start(resolve);
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            onPress = _this$props.onPress,
            style = _this$props.style;
        return React__default.createElement(reactNative.TouchableWithoutFeedback, {
          onPress: onPress
        }, React__default.createElement(reactNative.Animated.View, {
          style: [styles.fullscreen, {
            opacity: this.fadeAnim
          }]
        }, React__default.createElement(reactNative.View, {
          style: [styles.fullscreen, style]
        })));
      }
    }]);

    return Backdrop;
  }(React.Component);

  Backdrop.propTypes = {
    onPress: propTypes.func.isRequired
  };
  var styles = reactNative.StyleSheet.create({
    fullscreen: {
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    }
  });

  var CFG = {
    debug: false
    /**
     * Debug logger depending on `Menu.debug` static porperty.
     */

  };
  var debug = function debug() {
    var _console;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    CFG.debug && (_console = console).log.apply(_console, ['react-native-popup-menu'].concat(args));
  };

  var MenuPlaceholder =
  /*#__PURE__*/
  function (_Component) {
    _inherits(MenuPlaceholder, _Component);

    function MenuPlaceholder(props) {
      var _this;

      _classCallCheck(this, MenuPlaceholder);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(MenuPlaceholder).call(this, props));
      _this.state = {};
      return _this;
    }

    _createClass(MenuPlaceholder, [{
      key: "shouldComponentUpdate",
      value: function shouldComponentUpdate() {
        // don't terminate closing animation
        return !this.props.ctx._isMenuClosing;
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            ctx = _this$props.ctx,
            backdropStyles = _this$props.backdropStyles;

        var shouldRenderMenu = ctx.isMenuOpen() && ctx._isInitialized();

        debug('MenuPlaceholder should render', shouldRenderMenu);

        if (!shouldRenderMenu) {
          return null;
        }

        return React__default.createElement(reactNative.View, {
          style: styles$1.placeholder
        }, React__default.createElement(Backdrop, {
          onPress: ctx._onBackdropPress,
          style: backdropStyles,
          ref: ctx.onBackdropRef
        }), ctx._makeOptions());
      }
    }]);

    return MenuPlaceholder;
  }(React.Component);
  var styles$1 = reactNative.StyleSheet.create({
    placeholder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden'
    }
  });

  var computePosition = function computePosition(_ref) {
    var windowLayout = _ref.windowLayout;
    return {
      top: windowLayout.height,
      left: windowLayout.width
    };
  };

  var MenuOutside = function MenuOutside(props) {
    var style = props.style,
        children = props.children,
        layouts = props.layouts,
        other = _objectWithoutProperties(props, ["style", "children", "layouts"]);

    var position = computePosition(layouts);
    return React__default.createElement(reactNative.View, _extends({}, other, {
      style: [styles$2.options, style, position],
      collapsable: false
    }), children);
  };

  var styles$2 = reactNative.StyleSheet.create({
    options: {
      position: 'absolute'
    }
  });

  var defaultOptionsContainerRenderer = function defaultOptionsContainerRenderer(options) {
    return options;
  };

  var layoutsEqual = function layoutsEqual(a, b) {
    return a === b || a && b && a.width === b.width && a.height === b.height;
  };

  var isFunctional = function isFunctional(Component) {
    return !Component.prototype.render;
  };

  if (!React__default.forwardRef) {
    throw new Error('This version of popup-menu requires RN 0.55+. Check our compatibility table.');
  }

  var PopupMenuContext = React.createContext({});
  var withCtx = withContext(PopupMenuContext, "ctx"); // count of MenuProvider instances

  var instanceCount = 0;

  var MenuProvider =
  /*#__PURE__*/
  function (_Component) {
    _inherits(MenuProvider, _Component);

    function MenuProvider(props) {
      var _this;

      _classCallCheck(this, MenuProvider);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(MenuProvider).call(this, props));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_handleBackButton", function () {
        var backHandler = _this.props.backHandler;
        debug('_handleBackButton called', backHandler); // Default handler if true is passed

        if (backHandler === true) {
          if (_this.isMenuOpen()) {
            _this.closeMenu();

            return true;
          }
        } // Custom handler called with MenuProvider instance id function is passed


        if (typeof backHandler === 'function') {
          return backHandler(_assertThisInitialized(_assertThisInitialized(_this)));
        }

        return false;
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onBackdropRef", function (r) {
        _this.backdropRef = r;
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onOptionsRef", function (r) {
        _this.optionsRef = r;
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onPlaceholderRef", function (r) {
        return _this._placeholderRef = r;
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onBackdropPress", function () {
        debug('on backdrop press');

        var menu = _this._getOpenedMenu();

        if (menu) {
          menu.instance.props.onBackdropPress();
        }

        _this.closeMenu();
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onLayout", function (_ref) {
        var layout = _ref.nativeEvent.layout;

        if (layoutsEqual(_this._ownLayout, layout)) {
          return;
        }

        _this._ownLayout = layout;
        debug('context layout has changed', _this._ownLayout);

        if (!_this.isMenuOpen()) {
          return;
        }

        var _this$_getOpenedMenu = _this._getOpenedMenu(),
            instance = _this$_getOpenedMenu.instance;

        var trigger = instance._getTrigger();

        measure(trigger).then(function (triggerLayout) {
          debug('got trigger measurements after context layout change', triggerLayout);

          _this._menuRegistry.updateLayoutInfo(instance.getName(), {
            triggerLayout: triggerLayout
          }); // force update as own layout has changed


          _this._notify(true);
        });
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "_onSafeAreaLayout", function (_ref2) {
        var layout = _ref2.nativeEvent.layout;

        if (layoutsEqual(_this._safeAreaLayout, layout)) {
          return;
        }

        _this._safeAreaLayout = layout;
        debug('safeArea layout has changed', _this._safeAreaLayout);

        if (!_this.isMenuOpen()) {
          return;
        }

        _this._notify(true);
      });

      _this._menuRegistry = makeMenuRegistry();
      _this._isMenuClosing = false;
      var menuActions = {
        openMenu: function openMenu(name) {
          return _this.openMenu(name);
        },
        closeMenu: function closeMenu() {
          return _this.closeMenu();
        },
        toggleMenu: function toggleMenu(name) {
          return _this.toggleMenu(name);
        },
        isMenuOpen: function isMenuOpen() {
          return _this.isMenuOpen();
        },
        _getOpenedMenu: function _getOpenedMenu() {
          return _this._getOpenedMenu();
        },
        _notify: function _notify(force) {
          return _this._notify(force);
        }
      };
      _this.menuCtx = {
        menuRegistry: _this._menuRegistry,
        menuActions: menuActions
      };
      return _this;
    }

    _createClass(MenuProvider, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        if (reactNative.BackHandler) {
          reactNative.BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
        } else {
          var backHandler = this.props.backHandler;

          if (backHandler === true || typeof backHandler === 'function') {
            console.warn('backHandler prop cannot be used if BackHandler is not present (RN >= 0.44 required)');
          }
        }

        var _this$props = this.props,
            customStyles = _this$props.customStyles,
            skipInstanceCheck = _this$props.skipInstanceCheck;

        if (customStyles.menuContextWrapper) {
          console.warn('menuContextWrapper custom style is deprecated and it might be removed in future releases, use menuProviderWrapper instead.');
        }

        if (!skipInstanceCheck) {
          instanceCount++;
        }

        if (instanceCount > 1) {
          console.warn('In most cases you should not have more MenuProviders in your app (see API documentation). In other cases use skipInstanceCheck prop.');
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        debug('unmounting menu provider');

        if (reactNative.BackHandler) {
          reactNative.BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);
        }

        var skipInstanceCheck = this.props.skipInstanceCheck;

        if (!skipInstanceCheck) {
          instanceCount--;
        }
      }
    }, {
      key: "isMenuOpen",
      value: function isMenuOpen() {
        return !!this._getOpenedMenu();
      }
    }, {
      key: "openMenu",
      value: function openMenu(name) {
        var menu = this._menuRegistry.getMenu(name);

        if (!menu) {
          console.warn("menu with name ".concat(name, " does not exist"));
          return Promise.resolve();
        }

        debug('open menu', name);

        menu.instance._setOpened(true);

        return this._notify();
      }
    }, {
      key: "closeMenu",
      value: function closeMenu() {
        // has no effect on controlled menus
        debug('close menu');

        this._menuRegistry.getAll().filter(function (menu) {
          return menu.instance._getOpened();
        }).forEach(function (menu) {
          return menu.instance._setOpened(false);
        });

        return this._notify();
      }
    }, {
      key: "_invalidateTriggerLayouts",
      value: function _invalidateTriggerLayouts() {
        var _this2 = this;

        // invalidate layouts for closed menus,
        // both controlled and uncontrolled menus
        this._menuRegistry.getAll().filter(function (menu) {
          return !menu.instance.isOpen();
        }).forEach(function (menu) {
          _this2._menuRegistry.updateLayoutInfo(menu.name, {
            triggerLayout: undefined
          });
        });
      }
    }, {
      key: "_beforeClose",
      value: function _beforeClose(menu) {
        var _this3 = this;

        debug('before close', menu.name);
        var hideMenu = this.optionsRef && this.optionsRef.close && this.optionsRef.close() || Promise.resolve();
        var hideBackdrop = this.backdropRef && this.backdropRef.close();

        this._invalidateTriggerLayouts();

        this._isMenuClosing = true;
        return Promise.all([hideMenu, hideBackdrop]).then(function () {
          _this3._isMenuClosing = false;
        }).catch(function (err) {
          _this3._isMenuClosing = false;
          throw err;
        });
      }
    }, {
      key: "toggleMenu",
      value: function toggleMenu(name) {
        var menu = this._menuRegistry.getMenu(name);

        if (!menu) {
          console.warn("menu with name ".concat(name, " does not exist"));
          return Promise.resolve();
        }

        debug('toggle menu', name);

        if (menu.instance._getOpened()) {
          return this.closeMenu();
        } else {
          return this.openMenu(name);
        }
      }
    }, {
      key: "_notify",
      value: function _notify(forceUpdate) {
        var _this4 = this;

        var NULL = {};
        var prev = this.openedMenu || NULL;
        var next = this._menuRegistry.getAll().find(function (menu) {
          return menu.instance.isOpen();
        }) || NULL; // set newly opened menu before any callbacks are called

        this.openedMenu = next === NULL ? undefined : next;

        if (!forceUpdate && !this._isRenderNeeded(prev, next)) {
          return Promise.resolve();
        }

        debug('notify: next menu:', next.name, ' prev menu:', prev.name);
        var afterSetState = undefined;

        var beforeSetState = function beforeSetState() {
          return Promise.resolve();
        };

        if (prev.name !== next.name) {
          if (prev !== NULL && !prev.instance.isOpen()) {
            beforeSetState = function beforeSetState() {
              return _this4._beforeClose(prev).then(function () {
                return prev.instance.props.onClose();
              });
            };
          }

          if (next !== NULL) {
            next.instance.props.onOpen();

            afterSetState = function afterSetState() {
              return _this4._initOpen(next);
            };
          }
        }

        return beforeSetState().then(function () {
          if (!_this4._placeholderRef) {
            debug('setState ignored - maybe the context was unmounted');
            return;
          }

          _this4._placeholderRef.setState({
            openedMenuName: _this4.openedMenu && _this4.openedMenu.name
          }, afterSetState);

          debug('notify ended');
        });
      }
      /**
      Compares states of opened menu to determine if rerender is needed.
      */

    }, {
      key: "_isRenderNeeded",
      value: function _isRenderNeeded(prev, next) {
        if (prev === next) {
          debug('_isRenderNeeded: skipping - no change');
          return false;
        }

        if (prev.name !== next.name) {
          return true;
        }

        var triggerLayout = next.triggerLayout,
            optionsLayout = next.optionsLayout;

        if (!triggerLayout || !optionsLayout) {
          debug('_isRenderNeeded: skipping - no trigger or options layout');
          return false;
        }

        return true;
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props2 = this.props,
            style = _this$props2.style,
            customStyles = _this$props2.customStyles;
        debug('render menu', this.isMenuOpen(), this._ownLayout);
        return React__default.createElement(PopupMenuContext.Provider, {
          value: this.menuCtx
        }, React__default.createElement(reactNative.View, {
          style: styles$3.flex1,
          onLayout: this._onLayout
        }, React__default.createElement(reactNative.View, {
          style: [styles$3.flex1, customStyles.menuContextWrapper, customStyles.menuProviderWrapper, style]
        }, this.props.children), React__default.createElement(reactNative.SafeAreaView, {
          style: styles$3.safeArea,
          pointerEvents: "box-none"
        }, React__default.createElement(reactNative.View, {
          style: styles$3.flex1,
          collapsable: false,
          pointerEvents: "box-none",
          onLayout: this._onSafeAreaLayout
        }), React__default.createElement(MenuPlaceholder, {
          ctx: this,
          backdropStyles: customStyles.backdrop,
          ref: this._onPlaceholderRef
        }))));
      }
    }, {
      key: "_getOpenedMenu",
      value: function _getOpenedMenu() {
        var name = this._placeholderRef && this._placeholderRef.state.openedMenuName;
        var menu = name ? this._menuRegistry.getMenu(name) : undefined;
        debug('_getOpenedMenu', name, !!menu);
        return menu;
      }
    }, {
      key: "_isInitialized",
      value: function _isInitialized() {
        return !!this._ownLayout;
      }
    }, {
      key: "_initOpen",
      value: function _initOpen(menu) {
        var _this5 = this;

        debug('opening', menu.name);

        var trigger = menu.instance._getTrigger();

        measure(trigger).then(function (triggerLayout) {
          debug('got trigger measurements', triggerLayout);

          _this5._menuRegistry.updateLayoutInfo(menu.name, {
            triggerLayout: triggerLayout
          });

          _this5.backdropRef && _this5.backdropRef.open();

          _this5._notify();
        });
      }
    }, {
      key: "_onOptionsLayout",
      value: function _onOptionsLayout(e, name, isOutside) {
        var optionsLayout = e.nativeEvent.layout;
        optionsLayout.isOutside = isOutside;
        debug('got options layout', optionsLayout);

        this._menuRegistry.updateLayoutInfo(name, {
          optionsLayout: optionsLayout
        });

        this._notify();
      }
    }, {
      key: "_makeOptions",
      value: function _makeOptions() {
        var _this6 = this;

        var _this$_getOpenedMenu2 = this._getOpenedMenu(),
            instance = _this$_getOpenedMenu2.instance,
            triggerLayout = _this$_getOpenedMenu2.triggerLayout,
            optionsLayout = _this$_getOpenedMenu2.optionsLayout;

        var options = instance._getOptions();

        var _instance$props = instance.props,
            renderer = _instance$props.renderer,
            rendererProps = _instance$props.rendererProps;
        var windowLayout = this._ownLayout;
        var safeAreaLayout = this._safeAreaLayout;
        var _options$props = options.props,
            optionsContainerStyle = _options$props.optionsContainerStyle,
            renderOptionsContainer = _options$props.renderOptionsContainer,
            customStyles = _options$props.customStyles;
        var optionsRenderer = renderOptionsContainer || defaultOptionsContainerRenderer;
        var isOutside = !triggerLayout || !optionsLayout;

        var onLayout = function onLayout(e) {
          return _this6._onOptionsLayout(e, instance.getName(), isOutside);
        };

        var style = [optionsContainerStyle, customStyles.optionsContainer];
        var layouts = {
          windowLayout: windowLayout,
          triggerLayout: triggerLayout,
          optionsLayout: optionsLayout,
          safeAreaLayout: safeAreaLayout
        };

        var props = _objectSpread({}, rendererProps, {
          style: style,
          onLayout: onLayout,
          layouts: layouts
        });

        var optionsType = isOutside ? MenuOutside : renderer;

        if (!isFunctional(optionsType)) {
          props.ref = this.onOptionsRef;
        }

        return React__default.createElement(optionsType, props, optionsRenderer(options));
      }
    }]);

    return MenuProvider;
  }(React.Component);
  MenuProvider.propTypes = {
    customStyles: propTypes.object,
    backHandler: propTypes.oneOfType([propTypes.bool, propTypes.func]),
    skipInstanceCheck: propTypes.bool
  };
  MenuProvider.defaultProps = {
    customStyles: {},
    backHandler: false,
    skipInstanceCheck: false
  };
  var styles$3 = reactNative.StyleSheet.create({
    flex1: {
      flex: 1
    },
    safeArea: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  });

  var MenuOptions =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(MenuOptions, _React$Component);

    function MenuOptions() {
      _classCallCheck(this, MenuOptions);

      return _possibleConstructorReturn(this, _getPrototypeOf(MenuOptions).apply(this, arguments));
    }

    _createClass(MenuOptions, [{
      key: "updateCustomStyles",
      value: function updateCustomStyles(_props) {
        var customStyles = _props.customStyles;

        var menu = this.props.ctx.menuActions._getOpenedMenu(); // FIXME react 16.3 workaround for ControlledExample!


        if (!menu) return;
        var menuName = menu.instance.getName();
        this.props.ctx.menuRegistry.setOptionsCustomStyles(menuName, customStyles);
      }
    }, {
      key: "componentDidMount",
      value: function componentDidMount() {
        this.updateCustomStyles(this.props);
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        this.updateCustomStyles(this.props);
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            customStyles = _this$props.customStyles,
            style = _this$props.style,
            children = _this$props.children;
        return React__default.createElement(reactNative.View, {
          style: [customStyles.optionsWrapper, style]
        }, children);
      }
    }]);

    return MenuOptions;
  }(React__default.Component);
  MenuOptions.propTypes = {
    customStyles: propTypes.object,
    renderOptionsContainer: propTypes.func,
    optionsContainerStyle: propTypes.oneOfType([propTypes.object, propTypes.number, propTypes.array])
  };
  MenuOptions.defaultProps = {
    customStyles: {}
  };
  var MenuOptions$1 = withCtx(MenuOptions);

  var MenuTrigger =
  /*#__PURE__*/
  function (_Component) {
    _inherits(MenuTrigger, _Component);

    function MenuTrigger() {
      _classCallCheck(this, MenuTrigger);

      return _possibleConstructorReturn(this, _getPrototypeOf(MenuTrigger).apply(this, arguments));
    }

    _createClass(MenuTrigger, [{
      key: "_onPress",
      value: function _onPress() {
        debug('trigger onPress');
        this.props.onPress && this.props.onPress();
        this.props.ctx.menuActions.openMenu(this.props.menuName);
      }
    }, {
      key: "render",
      value: function render() {
        var _this = this;

        var _this$props = this.props,
            disabled = _this$props.disabled,
            onRef = _this$props.onRef,
            text = _this$props.text,
            children = _this$props.children,
            style = _this$props.style,
            customStyles = _this$props.customStyles,
            menuName = _this$props.menuName,
            triggerOnLongPress = _this$props.triggerOnLongPress,
            onAlternativeAction = _this$props.onAlternativeAction,
            other = _objectWithoutProperties(_this$props, ["disabled", "onRef", "text", "children", "style", "customStyles", "menuName", "triggerOnLongPress", "onAlternativeAction"]);

        var onPress = function onPress() {
          return !disabled && _this._onPress();
        };

        var _makeTouchable = makeTouchable(customStyles.TriggerTouchableComponent),
            Touchable = _makeTouchable.Touchable,
            defaultTouchableProps = _makeTouchable.defaultTouchableProps;

        return React__default.createElement(reactNative.View, {
          ref: onRef,
          collapsable: false,
          style: customStyles.triggerOuterWrapper
        }, React__default.createElement(Touchable, _extends({
          onPress: triggerOnLongPress ? onAlternativeAction : onPress,
          onLongPress: triggerOnLongPress ? onPress : onAlternativeAction
        }, defaultTouchableProps, customStyles.triggerTouchable), React__default.createElement(reactNative.View, _extends({}, other, {
          style: [customStyles.triggerWrapper, style]
        }), text ? React__default.createElement(reactNative.Text, {
          style: customStyles.triggerText
        }, text) : children)));
      }
    }]);

    return MenuTrigger;
  }(React.Component);
  MenuTrigger.propTypes = {
    disabled: propTypes.bool,
    text: propTypes.string,
    onPress: propTypes.func,
    onAlternativeAction: propTypes.func,
    customStyles: propTypes.object,
    triggerOnLongPress: propTypes.bool
  };
  MenuTrigger.defaultProps = {
    disabled: false,
    customStyles: {}
  };
  var MenuTrigger$1 = withCtx(MenuTrigger);

  var axisPosition = function axisPosition(oDim, wDim, tPos, tDim) {
    // if options are bigger than window dimension, then render at 0
    if (oDim > wDim) {
      return 0;
    } // render at trigger position if possible


    if (tPos + oDim <= wDim) {
      return tPos;
    } // aligned to the trigger from the bottom (right)


    if (tPos + tDim - oDim >= 0) {
      return tPos + tDim - oDim;
    } // compute center position


    var pos = Math.round(tPos + tDim / 2 - oDim / 2); // check top boundary

    if (pos < 0) {
      return 0;
    } // check bottom boundary


    if (pos + oDim > wDim) {
      return wDim - oDim;
    } // if everything ok, render in center position


    return pos;
  };

  function fit(pos, len, minPos, maxPos) {
    if (pos === undefined) {
      return undefined;
    }

    if (pos + len > maxPos) {
      pos = maxPos - len;
    }

    if (pos < minPos) {
      pos = minPos;
    }

    return pos;
  } // fits options (position) into safeArea


  var fitPositionIntoSafeArea = function fitPositionIntoSafeArea(position, layouts) {
    var windowLayout = layouts.windowLayout,
        safeAreaLayout = layouts.safeAreaLayout,
        optionsLayout = layouts.optionsLayout;

    if (!safeAreaLayout) {
      return position;
    }

    var saX = safeAreaLayout.x,
        saY = safeAreaLayout.y,
        saHeight = safeAreaLayout.height,
        saWidth = safeAreaLayout.width;
    var oHeight = optionsLayout.height,
        oWidth = optionsLayout.width;
    var wWidth = windowLayout.width;
    var top = position.top,
        left = position.left,
        right = position.right;
    top = fit(top, oHeight, saY, saY + saHeight);
    left = fit(left, oWidth, saX, saX + saWidth);
    right = fit(right, oWidth, wWidth - saX - saWidth, saX);
    return {
      top: top,
      left: left,
      right: right
    };
  };
  var computePosition$1 = function computePosition(layouts, isRTL) {
    var windowLayout = layouts.windowLayout,
        triggerLayout = layouts.triggerLayout,
        optionsLayout = layouts.optionsLayout;
    var wX = windowLayout.x,
        wY = windowLayout.y,
        wWidth = windowLayout.width,
        wHeight = windowLayout.height;
    var tX = triggerLayout.x,
        tY = triggerLayout.y,
        tHeight = triggerLayout.height,
        tWidth = triggerLayout.width;
    var oHeight = optionsLayout.height,
        oWidth = optionsLayout.width;
    var top = axisPosition(oHeight, wHeight, tY - wY, tHeight);
    var left = axisPosition(oWidth, wWidth, tX - wX, tWidth);
    var start = isRTL ? 'right' : 'left';

    var position = _defineProperty({
      top: top
    }, start, left);

    return fitPositionIntoSafeArea(position, layouts);
  };

  var ContextMenu =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(ContextMenu, _React$Component);

    function ContextMenu(props) {
      var _this;

      _classCallCheck(this, ContextMenu);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ContextMenu).call(this, props));
      _this.state = {
        scaleAnim: new reactNative.Animated.Value(0.1)
      };
      return _this;
    }

    _createClass(ContextMenu, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        reactNative.Animated.timing(this.state.scaleAnim, {
          duration: OPEN_ANIM_DURATION,
          toValue: 1,
          easing: reactNative.Easing.out(reactNative.Easing.cubic),
          useNativeDriver: USE_NATIVE_DRIVER
        }).start();
      }
    }, {
      key: "close",
      value: function close() {
        var _this2 = this;

        return new Promise(function (resolve) {
          reactNative.Animated.timing(_this2.state.scaleAnim, {
            duration: CLOSE_ANIM_DURATION,
            toValue: 0,
            easing: reactNative.Easing.in(reactNative.Easing.cubic),
            useNativeDriver: USE_NATIVE_DRIVER
          }).start(resolve);
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            style = _this$props.style,
            children = _this$props.children,
            layouts = _this$props.layouts,
            other = _objectWithoutProperties(_this$props, ["style", "children", "layouts"]);

        var animation = {
          transform: [{
            scale: this.state.scaleAnim
          }],
          opacity: this.state.scaleAnim
        };
        var position = computePosition$1(layouts, reactNative.I18nManager.isRTL);
        return React__default.createElement(reactNative.Animated.View, _extends({}, other, {
          style: [styles$4.options, style, animation, position]
        }), children);
      }
    }]);

    return ContextMenu;
  }(React__default.Component); // public exports
  ContextMenu.computePosition = computePosition$1;
  ContextMenu.fitPositionIntoSafeArea = fitPositionIntoSafeArea;
  var styles$4 = reactNative.StyleSheet.create({
    options: {
      position: 'absolute',
      borderRadius: 2,
      backgroundColor: 'white',
      width: reactNative.PixelRatio.roundToNearestPixel(200),
      // Shadow only works on iOS.
      shadowColor: 'black',
      shadowOpacity: 0.3,
      shadowOffset: {
        width: 3,
        height: 3
      },
      shadowRadius: 4,
      // This will elevate the view on Android, causing shadow to be drawn.
      elevation: 5
    }
  });

  var isRegularComponent = function isRegularComponent(c) {
    return c.type !== MenuOptions$1 && c.type !== MenuTrigger$1;
  };

  var isTrigger = function isTrigger(c) {
    return c.type === MenuTrigger$1;
  };

  var isMenuOptions = function isMenuOptions(c) {
    return c.type === MenuOptions$1;
  };

  var Menu =
  /*#__PURE__*/
  function (_Component) {
    _inherits(Menu, _Component);

    function Menu(props) {
      var _this;

      _classCallCheck(this, Menu);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Menu).call(this, props));
      _this._name = _this.props.name || makeName();
      _this._forceClose = false;
      var ctx = props.ctx;

      if (!(ctx && ctx.menuActions)) {
        throw new Error("Menu component must be ancestor of MenuProvider");
      }

      return _this;
    }

    _createClass(Menu, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        if (!this._validateChildren()) {
          return;
        }

        debug('subscribing menu', this._name);
        this.props.ctx.menuRegistry.subscribe(this);

        this.props.ctx.menuActions._notify();
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps) {
        if (this.props.name !== prevProps.name) {
          console.warn('Menu name cannot be changed');
        } // force update if menu is opened as its content might have changed


        var force = this.isOpen();
        debug('component did update', this._name, force);

        this.props.ctx.menuActions._notify(force);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        debug('unsubscribing menu', this._name);

        if (this.isOpen()) {
          this._forceClose = true;

          this.props.ctx.menuActions._notify();
        }

        this.props.ctx.menuRegistry.unsubscribe(this);
      }
    }, {
      key: "open",
      value: function open() {
        return this.props.ctx.menuActions.openMenu(this._name);
      }
    }, {
      key: "close",
      value: function close() {
        return this.props.ctx.menuActions.closeMenu();
      }
    }, {
      key: "isOpen",
      value: function isOpen() {
        if (this._forceClose) {
          return false;
        }

        return this.props.hasOwnProperty('opened') ? this.props.opened : this._opened;
      }
    }, {
      key: "getName",
      value: function getName() {
        return this._name;
      }
    }, {
      key: "render",
      value: function render() {
        var style = this.props.style;

        var children = this._reduceChildren();

        return React__default.createElement(reactNative.View, {
          style: style
        }, children);
      }
    }, {
      key: "_reduceChildren",
      value: function _reduceChildren() {
        var _this2 = this;

        return React__default.Children.toArray(this.props.children).reduce(function (r, child) {
          if (isTrigger(child)) {
            r.push(React__default.cloneElement(child, {
              key: null,
              menuName: _this2._name,
              onRef: function onRef(t) {
                return _this2._trigger = t;
              }
            }));
          }

          if (isRegularComponent(child)) {
            r.push(child);
          }

          return r;
        }, []);
      }
    }, {
      key: "_getTrigger",
      value: function _getTrigger() {
        return this._trigger;
      }
    }, {
      key: "_getOptions",
      value: function _getOptions() {
        return React__default.Children.toArray(this.props.children).find(isMenuOptions);
      }
    }, {
      key: "_getOpened",
      value: function _getOpened() {
        return this._opened;
      }
    }, {
      key: "_setOpened",
      value: function _setOpened(opened) {
        this._opened = opened;
      }
    }, {
      key: "_validateChildren",
      value: function _validateChildren() {
        var children = React__default.Children.toArray(this.props.children);
        var options = children.find(isMenuOptions);

        if (!options) {
          console.warn('Menu has to contain MenuOptions component');
        }

        var trigger = children.find(isTrigger);

        if (!trigger) {
          console.warn('Menu has to contain MenuTrigger component');
        }

        return options && trigger;
      }
    }]);

    return Menu;
  }(React.Component);
  Menu.propTypes = {
    name: propTypes.string,
    renderer: propTypes.func,
    rendererProps: propTypes.object,
    onSelect: propTypes.func,
    onOpen: propTypes.func,
    onClose: propTypes.func,
    opened: propTypes.bool,
    onBackdropPress: propTypes.func
  };
  Menu.defaultProps = {
    renderer: ContextMenu,
    rendererProps: {},
    onSelect: function onSelect() {},
    onOpen: function onOpen() {},
    onClose: function onClose() {},
    onBackdropPress: function onBackdropPress() {}
  };
  var MenuExternal = withCtx(Menu);
  Object.defineProperty(MenuExternal, 'debug', {
    get: function get() {
      return CFG.debug;
    },
    set: function set(val) {
      CFG.debug = val;
    }
  });

  MenuExternal.setDefaultRenderer = function (renderer) {
    Menu.defaultProps.renderer = renderer;
  };

  MenuExternal.setDefaultRendererProps = function (rendererProps) {
    Menu.defaultProps.rendererProps = rendererProps;
  };

  var MenuOption =
  /*#__PURE__*/
  function (_Component) {
    _inherits(MenuOption, _Component);

    function MenuOption() {
      _classCallCheck(this, MenuOption);

      return _possibleConstructorReturn(this, _getPrototypeOf(MenuOption).apply(this, arguments));
    }

    _createClass(MenuOption, [{
      key: "_onSelect",
      value: function _onSelect() {
        var value = this.props.value;

        var onSelect = this.props.onSelect || this._getMenusOnSelect();

        var shouldClose = onSelect(value) !== false;
        debug('select option', value, shouldClose);

        if (shouldClose) {
          this.props.ctx.menuActions.closeMenu();
        }
      }
    }, {
      key: "_getMenusOnSelect",
      value: function _getMenusOnSelect() {
        var menu = this.props.ctx.menuActions._getOpenedMenu();

        return menu.instance.props.onSelect;
      }
    }, {
      key: "_getCustomStyles",
      value: function _getCustomStyles() {
        // FIXME react 16.3 workaround for ControlledExample!
        var menu = this.props.ctx.menuActions._getOpenedMenu() || {};
        var optionsCustomStyles = menu.optionsCustomStyles;
        return _objectSpread({}, optionsCustomStyles, this.props.customStyles);
      }
    }, {
      key: "render",
      value: function render() {
        var _this = this;

        var _this$props = this.props,
            text = _this$props.text,
            disabled = _this$props.disabled,
            disableTouchable = _this$props.disableTouchable,
            children = _this$props.children,
            style = _this$props.style;

        var customStyles = this._getCustomStyles();

        if (text && React__default.Children.count(children) > 0) {
          console.warn("MenuOption: Please don't use text property together with explicit children. Children are ignored.");
        }

        if (disabled) {
          var disabledStyles = [defaultStyles.optionTextDisabled, customStyles.optionText];
          return React__default.createElement(reactNative.View, {
            style: [defaultStyles.option, customStyles.optionWrapper, style]
          }, text ? React__default.createElement(reactNative.Text, {
            style: disabledStyles
          }, text) : children);
        }

        var rendered = React__default.createElement(reactNative.View, {
          style: [defaultStyles.option, customStyles.optionWrapper, style]
        }, text ? React__default.createElement(reactNative.Text, {
          style: customStyles.optionText
        }, text) : children);

        if (disableTouchable) {
          return rendered;
        } else {
          var _makeTouchable = makeTouchable(customStyles.OptionTouchableComponent),
              Touchable = _makeTouchable.Touchable,
              defaultTouchableProps = _makeTouchable.defaultTouchableProps;

          return React__default.createElement(Touchable, _extends({
            onPress: function onPress() {
              return _this._onSelect();
            }
          }, defaultTouchableProps, customStyles.optionTouchable), rendered);
        }
      }
    }]);

    return MenuOption;
  }(React.Component);
  MenuOption.propTypes = {
    disabled: propTypes.bool,
    disableTouchable: propTypes.bool,
    onSelect: propTypes.func,
    text: propTypes.string,
    value: propTypes.any,
    customStyles: propTypes.object
  };
  MenuOption.defaultProps = {
    disabled: false,
    disableTouchable: false,
    customStyles: {}
  };
  var defaultStyles = reactNative.StyleSheet.create({
    option: {
      padding: 5,
      backgroundColor: 'transparent'
    },
    optionTextDisabled: {
      color: '#ccc'
    }
  });
  var MenuOption$1 = withCtx(MenuOption);

  /**
  Simplified version of ContextMenu without animation.
  */

  var NotAnimatedContextMenu =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(NotAnimatedContextMenu, _React$Component);

    function NotAnimatedContextMenu() {
      _classCallCheck(this, NotAnimatedContextMenu);

      return _possibleConstructorReturn(this, _getPrototypeOf(NotAnimatedContextMenu).apply(this, arguments));
    }

    _createClass(NotAnimatedContextMenu, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            style = _this$props.style,
            children = _this$props.children,
            layouts = _this$props.layouts,
            other = _objectWithoutProperties(_this$props, ["style", "children", "layouts"]);

        var position = computePosition$1(layouts);
        return React__default.createElement(reactNative.View, _extends({}, other, {
          style: [styles$4.options, style, position]
        }), children);
      }
    }]);

    return NotAnimatedContextMenu;
  }(React__default.Component);

  var computePosition$2 = function computePosition(layouts) {
    var windowLayout = layouts.windowLayout,
        optionsLayout = layouts.optionsLayout;
    var wHeight = windowLayout.height;
    var oHeight = optionsLayout.height;
    var top = wHeight - oHeight;
    var left = 0,
        right = 0;
    var position = {
      top: top,
      left: left,
      right: right
    }; // TODO what is the best way to handle safeArea?
    // most likely some extra paddings inside SlideInMenu 

    return position;
  };

  var SlideInMenu =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(SlideInMenu, _React$Component);

    function SlideInMenu(props) {
      var _this;

      _classCallCheck(this, SlideInMenu);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SlideInMenu).call(this, props));
      _this.state = {
        slide: new reactNative.Animated.Value(0)
      };
      return _this;
    }

    _createClass(SlideInMenu, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        reactNative.Animated.timing(this.state.slide, {
          duration: OPEN_ANIM_DURATION,
          toValue: 1,
          easing: reactNative.Easing.out(reactNative.Easing.cubic),
          useNativeDriver: USE_NATIVE_DRIVER
        }).start();
      }
    }, {
      key: "close",
      value: function close() {
        var _this2 = this;

        return new Promise(function (resolve) {
          reactNative.Animated.timing(_this2.state.slide, {
            duration: CLOSE_ANIM_DURATION,
            toValue: 0,
            easing: reactNative.Easing.in(reactNative.Easing.cubic),
            useNativeDriver: USE_NATIVE_DRIVER
          }).start(resolve);
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            style = _this$props.style,
            children = _this$props.children,
            layouts = _this$props.layouts,
            other = _objectWithoutProperties(_this$props, ["style", "children", "layouts"]);

        var oHeight = layouts.optionsLayout.height;
        var animation = {
          transform: [{
            translateY: this.state.slide.interpolate({
              inputRange: [0, 1],
              outputRange: [oHeight, 0]
            })
          }]
        };
        var position = computePosition$2(layouts);
        return React__default.createElement(reactNative.Animated.View, _extends({
          style: [styles$5.options, style, animation, position]
        }, other), children);
      }
    }]);

    return SlideInMenu;
  }(React__default.Component);
  var styles$5 = reactNative.StyleSheet.create({
    options: {
      position: 'absolute',
      backgroundColor: 'white',
      // Shadow only works on iOS.
      shadowColor: 'black',
      shadowOpacity: 0.3,
      shadowOffset: {
        width: 3,
        height: 3
      },
      shadowRadius: 4,
      // This will elevate the view on Android, causing shadow to be drawn.
      elevation: 5
    }
  });

  var popoverPadding = 7;
  var anchorSize = 15;
  var anchorHyp = Math.sqrt(anchorSize * anchorSize + anchorSize * anchorSize);
  var anchorOffset = (anchorHyp + anchorSize) / 2 - popoverPadding; // left/top placement

  function axisNegativeSideProperties(_ref) {
    var oDim = _ref.oDim,
        tPos = _ref.tPos;
    return {
      position: tPos - oDim
    };
  } // right/bottom placement


  function axisPositiveSideProperties(_ref2) {
    var tPos = _ref2.tPos,
        tDim = _ref2.tDim;
    // substract also anchor placeholder from the beginning
    return {
      position: tPos + tDim - anchorSize
    };
  } // computes offsets (off screen overlap) of popover when trying to align it to the center


  function centeringProperties(_ref3) {
    var oDim = _ref3.oDim,
        wDim = _ref3.wDim,
        tPos = _ref3.tPos,
        tDim = _ref3.tDim;
    var center = Math.round(tPos + tDim / 2);
    var leftOffset = oDim / 2 - center;
    var rightOffset = center + oDim / 2 - wDim;
    return {
      center: center,
      leftOffset: leftOffset,
      rightOffset: rightOffset
    };
  }
  /**
   * Computes position and offset of popover when trying to align it to the triger center.
   * It consideres window boundaries.
   * Returns object with keys:
   *   - position: <Number> Absolute position - top/left,
   *   - offset: <Number> window overlapping size if window boundaries were not considered
   */


  function axisCenteredPositionProperties(options) {
    var oDim = options.oDim,
        wDim = options.wDim;

    var _centeringProperties = centeringProperties(options),
        center = _centeringProperties.center,
        leftOffset = _centeringProperties.leftOffset,
        rightOffset = _centeringProperties.rightOffset;

    if (leftOffset > 0 || rightOffset > 0) {
      // right/bottom position is better
      if (leftOffset < rightOffset) {
        return {
          offset: rightOffset,
          position: wDim - oDim
        };
      } // left/top position is better


      if (rightOffset < leftOffset) {
        return {
          offset: -leftOffset,
          position: 0
        };
      }
    } // centered position


    return {
      offset: 0,
      position: center - oDim / 2
    };
  }
  /* Evaluate centering placement */


  function getCenteringPrice(options) {
    var _centeringProperties2 = centeringProperties(options),
        leftOffset = _centeringProperties2.leftOffset,
        rightOffset = _centeringProperties2.rightOffset; // TODO: currently shifted popovers have higher price,
    // popover shift could be taken into account with the same price


    return Math.max(0, leftOffset) + Math.max(0, rightOffset);
  }
  /* Evaluate top placement */


  function getTopPrice(hOptions, vOptions) {
    var centerOffset = getCenteringPrice(vOptions);
    var sideOffset = Math.max(0, hOptions.oDim - hOptions.tPos);
    return centerOffset + sideOffset;
  }
  /* Evaluate bottom placement */


  function getBottomPrice(hOptions, vOptions) {
    var centerOffset = getCenteringPrice(vOptions);
    var sideOffset = Math.max(0, hOptions.tPos + hOptions.tDim + hOptions.oDim - hOptions.wDim);
    return centerOffset + sideOffset;
  }
  /* Evaluate left placement */


  function getLeftPrice(hOptions, vOptions) {
    var centerOffset = getCenteringPrice(hOptions);
    var sideOffset = Math.max(0, vOptions.oDim - vOptions.tPos);
    return centerOffset + sideOffset;
  }
  /* Evaluate right placement */


  function getRightPrice(hOptions, vOptions) {
    var centerOffset = getCenteringPrice(hOptions);
    var sideOffset = Math.max(0, vOptions.tPos + vOptions.tDim + vOptions.oDim - vOptions.wDim);
    return centerOffset + sideOffset;
  }

  function getStartPosKey(isRTL) {
    return isRTL ? 'right' : 'left';
  }

  function topProperties(hOptions, vOptions, isRTL) {
    var centered = axisCenteredPositionProperties(vOptions);
    var side = axisNegativeSideProperties(hOptions);
    return {
      position: _defineProperty({
        top: side.position
      }, getStartPosKey(isRTL), centered.position),
      offset: centered.offset,
      placement: 'top'
    };
  }

  function bottomProperties(hOptions, vOptions, isRTL) {
    var centered = axisCenteredPositionProperties(vOptions);
    var side = axisPositiveSideProperties(hOptions);
    return {
      position: _defineProperty({
        top: side.position
      }, getStartPosKey(isRTL), centered.position),
      offset: centered.offset,
      placement: 'bottom'
    };
  }

  function rightProperties(hOptions, vOptions, isRTL) {
    var centered = axisCenteredPositionProperties(hOptions);
    var side = axisPositiveSideProperties(vOptions);
    return {
      position: _defineProperty({
        top: centered.position
      }, getStartPosKey(isRTL), side.position),
      offset: centered.offset,
      placement: 'right'
    };
  }

  function leftProperties(hOptions, vOptions, isRTL) {
    var centered = axisCenteredPositionProperties(hOptions);
    var side = axisNegativeSideProperties(vOptions);
    return {
      position: _defineProperty({
        top: centered.position
      }, getStartPosKey(isRTL), side.position),
      offset: centered.offset,
      placement: 'left'
    };
  } // maps placement to function which computes correct properties


  var propertiesByPlacement = {
    top: topProperties,
    bottom: bottomProperties,
    left: leftProperties,
    right: rightProperties
  };
  /**
   * Computes properties needed for drawing popover.
   * Returns object with keys:
   *   - position: <Object> { top: Number, left: Number } - popover absolute position
   *   - placement: <Enum> top|left|top|bottom - position to the trigger
   *   - offset: <Number> value by which must be anchor shifted
   */

  function computeProperties(_ref4, placement, preferredPlacement, isRTL) {
    var windowLayout = _ref4.windowLayout,
        triggerLayout = _ref4.triggerLayout,
        optionsLayout = _ref4.optionsLayout;
    var wX = windowLayout.x,
        wY = windowLayout.y,
        wWidth = windowLayout.width,
        wHeight = windowLayout.height;
    var tX = triggerLayout.x,
        tY = triggerLayout.y,
        tHeight = triggerLayout.height,
        tWidth = triggerLayout.width;
    var oHeight = optionsLayout.height,
        oWidth = optionsLayout.width;
    var hOptions = {
      oDim: oHeight + popoverPadding * 2,
      wDim: wHeight,
      tPos: tY - wY,
      tDim: tHeight
    };
    var vOptions = {
      oDim: oWidth + popoverPadding * 2,
      wDim: wWidth,
      tPos: tX - wX,
      tDim: tWidth
    };

    if (placement !== 'auto' && propertiesByPlacement[placement]) {
      return propertiesByPlacement[placement](hOptions, vOptions, isRTL);
    }

    var prices = {
      top: getTopPrice(hOptions, vOptions),
      bottom: getBottomPrice(hOptions, vOptions),
      right: getRightPrice(hOptions, vOptions),
      left: getLeftPrice(hOptions, vOptions)
    };
    var bestPrice = Object.values(prices).sort(function (a, b) {
      return a - b;
    })[0];
    var bestPlacement = prices[preferredPlacement] === bestPrice ? preferredPlacement : Object.keys(prices).find(function (pl) {
      return prices[pl] === bestPrice;
    });
    return propertiesByPlacement[bestPlacement](hOptions, vOptions, isRTL);
  }

  var Popover =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(Popover, _React$Component);

    function Popover(props) {
      var _this;

      _classCallCheck(this, Popover);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Popover).call(this, props));
      _this.state = {
        scaleAnim: new reactNative.Animated.Value(0.1)
      };
      return _this;
    }

    _createClass(Popover, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        reactNative.Animated.timing(this.state.scaleAnim, {
          duration: OPEN_ANIM_DURATION,
          toValue: 1,
          easing: reactNative.Easing.out(reactNative.Easing.cubic),
          useNativeDriver: USE_NATIVE_DRIVER
        }).start();
      }
    }, {
      key: "close",
      value: function close() {
        var _this2 = this;

        return new Promise(function (resolve) {
          reactNative.Animated.timing(_this2.state.scaleAnim, {
            duration: CLOSE_ANIM_DURATION,
            toValue: 0,
            easing: reactNative.Easing.in(reactNative.Easing.cubic),
            useNativeDriver: USE_NATIVE_DRIVER
          }).start(resolve);
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            style = _this$props.style,
            children = _this$props.children,
            layouts = _this$props.layouts,
            anchorStyle = _this$props.anchorStyle,
            preferredPlacement = _this$props.preferredPlacement,
            userPlacement = _this$props.placement,
            other = _objectWithoutProperties(_this$props, ["style", "children", "layouts", "anchorStyle", "preferredPlacement", "placement"]);

        var isRTL = reactNative.I18nManager.isRTL;
        var animation = {
          transform: [{
            scale: this.state.scaleAnim
          }],
          opacity: this.state.scaleAnim
        };

        var _computeProperties = computeProperties(layouts, userPlacement, preferredPlacement, isRTL),
            position = _computeProperties.position,
            placement = _computeProperties.placement,
            offset = _computeProperties.offset;

        return React__default.createElement(reactNative.Animated.View, {
          style: [styles$6.animated, animation, position, getContainerStyle({
            placement: placement,
            isRTL: isRTL
          })],
          pointerEvents: "box-none"
        }, React__default.createElement(reactNative.View, {
          style: [styles$6.anchor, dynamicAnchorStyle({
            placement: placement,
            offset: offset,
            isRTL: isRTL
          }), anchorStyle]
        }), React__default.createElement(reactNative.View, _extends({}, other, {
          style: [styles$6.options, style]
        }), children));
      }
    }]);

    return Popover;
  }(React__default.Component);
  Popover.propTypes = {
    anchorStyle: propTypes.oneOfType([propTypes.object, propTypes.number, propTypes.array]),
    placement: propTypes.oneOf(['auto', 'top', 'right', 'bottom', 'left']),
    preferredPlacement: propTypes.oneOf(['top', 'right', 'bottom', 'left'])
  };
  Popover.defaultProps = {
    preferredPlacement: 'top',
    placement: 'auto'
  };

  var getContainerStyle = function getContainerStyle(_ref5) {
    var placement = _ref5.placement,
        isRTL = _ref5.isRTL;
    return {
      left: {
        flexDirection: isRTL ? 'row' : 'row-reverse'
      },
      right: {
        flexDirection: isRTL ? 'row-reverse' : 'row'
      },
      top: {
        flexDirection: 'column-reverse'
      },
      bottom: {
        flexDirection: 'column'
      }
    }[placement];
  };

  var dynamicAnchorStyle = function dynamicAnchorStyle(_ref6) {
    var _ref7, _ref8;

    var offset = _ref6.offset,
        placement = _ref6.placement,
        isRTL = _ref6.isRTL;
    var start = getStartPosKey(isRTL);

    switch (placement) {
      case 'right':
        return {
          top: offset,
          transform: [{
            translateX: anchorOffset
          }, {
            rotate: '45deg'
          }]
        };

      case 'left':
        return {
          top: offset,
          transform: [{
            translateX: -anchorOffset
          }, {
            rotate: '45deg'
          }]
        };

      case 'top':
        return _ref7 = {}, _defineProperty(_ref7, start, offset), _defineProperty(_ref7, "transform", [{
          translateY: -anchorOffset
        }, {
          rotate: '45deg'
        }]), _ref7;

      case 'bottom':
        return _ref8 = {}, _defineProperty(_ref8, start, offset), _defineProperty(_ref8, "transform", [{
          translateY: anchorOffset
        }, {
          rotate: '45deg'
        }]), _ref8;
    }
  };

  var styles$6 = reactNative.StyleSheet.create({
    animated: {
      padding: popoverPadding,
      backgroundColor: 'transparent',
      position: 'absolute',
      alignItems: 'center'
    },
    options: {
      borderRadius: 2,
      minWidth: anchorHyp,
      minHeight: anchorHyp,
      backgroundColor: 'white',
      // Shadow only works on iOS.
      shadowColor: 'black',
      shadowOpacity: 0.3,
      shadowOffset: {
        width: 3,
        height: 3
      },
      shadowRadius: 4,
      // This will elevate the view on Android, causing shadow to be drawn.
      elevation: 5
    },
    anchor: {
      width: anchorSize,
      height: anchorSize,
      backgroundColor: 'white',
      elevation: 5
    }
  });

  var renderers = {
    ContextMenu: ContextMenu,
    SlideInMenu: SlideInMenu,
    NotAnimatedContextMenu: NotAnimatedContextMenu,
    Popover: Popover
  };
  var MenuContext = deprecatedComponent('MenuContext is deprecated and it might be removed in future releases, use MenuProvider instead.', ['openMenu', 'toggleMenu', 'closeMenu', 'isMenuOpen'])(MenuProvider);

  exports.default = MenuExternal;
  exports.Menu = MenuExternal;
  exports.MenuProvider = MenuProvider;
  exports.MenuContext = MenuContext;
  exports.MenuOption = MenuOption$1;
  exports.MenuOptions = MenuOptions$1;
  exports.MenuTrigger = MenuTrigger$1;
  exports.renderers = renderers;
  exports.withMenuContext = withCtx;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=rnpm.js.map
