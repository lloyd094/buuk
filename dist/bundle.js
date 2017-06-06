/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 332);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Utilities
//



function _class(obj) { return Object.prototype.toString.call(obj); }

function isString(obj) { return _class(obj) === '[object String]'; }

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function has(object, key) {
  return _hasOwnProperty.call(object, key);
}

// Merge objects
//
function assign(obj /*from1, from2, from3, ...*/) {
  var sources = Array.prototype.slice.call(arguments, 1);

  sources.forEach(function (source) {
    if (!source) { return; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be object');
    }

    Object.keys(source).forEach(function (key) {
      obj[key] = source[key];
    });
  });

  return obj;
}

// Remove element from array and put another array at those position.
// Useful for some operations with tokens
function arrayReplaceAt(src, pos, newElements) {
  return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
}

////////////////////////////////////////////////////////////////////////////////

function isValidEntityCode(c) {
  /*eslint no-bitwise:0*/
  // broken sequence
  if (c >= 0xD800 && c <= 0xDFFF) { return false; }
  // never used
  if (c >= 0xFDD0 && c <= 0xFDEF) { return false; }
  if ((c & 0xFFFF) === 0xFFFF || (c & 0xFFFF) === 0xFFFE) { return false; }
  // control codes
  if (c >= 0x00 && c <= 0x08) { return false; }
  if (c === 0x0B) { return false; }
  if (c >= 0x0E && c <= 0x1F) { return false; }
  if (c >= 0x7F && c <= 0x9F) { return false; }
  // out of range
  if (c > 0x10FFFF) { return false; }
  return true;
}

function fromCodePoint(c) {
  /*eslint no-bitwise:0*/
  if (c > 0xffff) {
    c -= 0x10000;
    var surrogate1 = 0xd800 + (c >> 10),
        surrogate2 = 0xdc00 + (c & 0x3ff);

    return String.fromCharCode(surrogate1, surrogate2);
  }
  return String.fromCharCode(c);
}


var UNESCAPE_MD_RE  = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g;
var ENTITY_RE       = /&([a-z#][a-z0-9]{1,31});/gi;
var UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + '|' + ENTITY_RE.source, 'gi');

var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i;

var entities = __webpack_require__(17);

function replaceEntityPattern(match, name) {
  var code = 0;

  if (has(entities, name)) {
    return entities[name];
  }

  if (name.charCodeAt(0) === 0x23/* # */ && DIGITAL_ENTITY_TEST_RE.test(name)) {
    code = name[1].toLowerCase() === 'x' ?
      parseInt(name.slice(2), 16)
    :
      parseInt(name.slice(1), 10);
    if (isValidEntityCode(code)) {
      return fromCodePoint(code);
    }
  }

  return match;
}

/*function replaceEntities(str) {
  if (str.indexOf('&') < 0) { return str; }

  return str.replace(ENTITY_RE, replaceEntityPattern);
}*/

function unescapeMd(str) {
  if (str.indexOf('\\') < 0) { return str; }
  return str.replace(UNESCAPE_MD_RE, '$1');
}

function unescapeAll(str) {
  if (str.indexOf('\\') < 0 && str.indexOf('&') < 0) { return str; }

  return str.replace(UNESCAPE_ALL_RE, function (match, escaped, entity) {
    if (escaped) { return escaped; }
    return replaceEntityPattern(match, entity);
  });
}

////////////////////////////////////////////////////////////////////////////////

var HTML_ESCAPE_TEST_RE = /[&<>"]/;
var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
var HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};

function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}

function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
}

////////////////////////////////////////////////////////////////////////////////

var REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;

function escapeRE(str) {
  return str.replace(REGEXP_ESCAPE_RE, '\\$&');
}

////////////////////////////////////////////////////////////////////////////////

function isSpace(code) {
  switch (code) {
    case 0x09:
    case 0x20:
      return true;
  }
  return false;
}

// Zs (unicode class) || [\t\f\v\r\n]
function isWhiteSpace(code) {
  if (code >= 0x2000 && code <= 0x200A) { return true; }
  switch (code) {
    case 0x09: // \t
    case 0x0A: // \n
    case 0x0B: // \v
    case 0x0C: // \f
    case 0x0D: // \r
    case 0x20:
    case 0xA0:
    case 0x1680:
    case 0x202F:
    case 0x205F:
    case 0x3000:
      return true;
  }
  return false;
}

////////////////////////////////////////////////////////////////////////////////

/*eslint-disable max-len*/
var UNICODE_PUNCT_RE = __webpack_require__(12);

// Currently without astral characters support.
function isPunctChar(ch) {
  return UNICODE_PUNCT_RE.test(ch);
}


// Markdown ASCII punctuation characters.
//
// !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~
// http://spec.commonmark.org/0.15/#ascii-punctuation-character
//
// Don't confuse with unicode punctuation !!! It lacks some chars in ascii range.
//
function isMdAsciiPunct(ch) {
  switch (ch) {
    case 0x21/* ! */:
    case 0x22/* " */:
    case 0x23/* # */:
    case 0x24/* $ */:
    case 0x25/* % */:
    case 0x26/* & */:
    case 0x27/* ' */:
    case 0x28/* ( */:
    case 0x29/* ) */:
    case 0x2A/* * */:
    case 0x2B/* + */:
    case 0x2C/* , */:
    case 0x2D/* - */:
    case 0x2E/* . */:
    case 0x2F/* / */:
    case 0x3A/* : */:
    case 0x3B/* ; */:
    case 0x3C/* < */:
    case 0x3D/* = */:
    case 0x3E/* > */:
    case 0x3F/* ? */:
    case 0x40/* @ */:
    case 0x5B/* [ */:
    case 0x5C/* \ */:
    case 0x5D/* ] */:
    case 0x5E/* ^ */:
    case 0x5F/* _ */:
    case 0x60/* ` */:
    case 0x7B/* { */:
    case 0x7C/* | */:
    case 0x7D/* } */:
    case 0x7E/* ~ */:
      return true;
    default:
      return false;
  }
}

// Hepler to unify [reference labels].
//
function normalizeReference(str) {
  // use .toUpperCase() instead of .toLowerCase()
  // here to avoid a conflict with Object.prototype
  // members (most notably, `__proto__`)
  return str.trim().replace(/\s+/g, ' ').toUpperCase();
}

////////////////////////////////////////////////////////////////////////////////

// Re-export libraries commonly used in both markdown-it and its plugins,
// so plugins won't have to depend on them explicitly, which reduces their
// bundled size (e.g. a browser build).
//
exports.lib                 = {};
exports.lib.mdurl           = __webpack_require__(21);
exports.lib.ucmicro         = __webpack_require__(298);

exports.assign              = assign;
exports.isString            = isString;
exports.has                 = has;
exports.unescapeMd          = unescapeMd;
exports.unescapeAll         = unescapeAll;
exports.isValidEntityCode   = isValidEntityCode;
exports.fromCodePoint       = fromCodePoint;
// exports.replaceEntities     = replaceEntities;
exports.escapeHtml          = escapeHtml;
exports.arrayReplaceAt      = arrayReplaceAt;
exports.isSpace             = isSpace;
exports.isWhiteSpace        = isWhiteSpace;
exports.isMdAsciiPunct      = isMdAsciiPunct;
exports.isPunctChar         = isPunctChar;
exports.escapeRE            = escapeRE;
exports.normalizeReference  = normalizeReference;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  scopeId,
  cssModules
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  // inject cssModules
  if (cssModules) {
    var computed = options.computed || (options.computed = {})
    Object.keys(cssModules).forEach(function (key) {
      var module = cssModules[key]
      computed[key] = function () { return module }
    })
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = {
	"app": "Bük",
	"version": "3.0.x",
	"description": "Markdown based documentation generator.",
	"sub": "Bük is a fast and simple markdown based static site generator geared towards documentation.",
	"options": {
		"advanced_slugs": true,
		"theme": "default",
		"lang": "en"
	},
	"articles": {
		"Getting Started": [
			{
				"title": "About Bük",
				"tags": [
					"getting started",
					"about",
					"fuzzy",
					"search",
					"no server"
				]
			},
			{
				"title": "Quickstart",
				"tags": [
					"installation",
					"how to"
				]
			},
			{
				"title": "References",
				"tags": [
					"licence",
					"author",
					"misc"
				]
			}
		],
		"Usage": [
			{
				"title": "Manifest.json",
				"tags": [
					"usage",
					"manifest.js",
					"how to write"
				]
			}
		],
		"Example Nested Categories": {
			"Category 1": [
				{
					"title": "About Bük",
					"tags": [
						"getting started",
						"about",
						"fuzzy",
						"search",
						"no server"
					],
					"slug": "getting-started-about-buk"
				},
				{
					"title": "About Bük",
					"tags": [
						"getting started",
						"about",
						"fuzzy",
						"search",
						"no server"
					],
					"slug": "getting-started-about-buk"
				}
			],
			"Category 2": {
				"Nested Again": [
					{
						"title": "References",
						"tags": [
							"licence",
							"author",
							"misc"
						],
						"slug": "getting-started-references"
					}
				]
			}
		}
	}
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(322)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 5 */,
/* 6 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.3.3
 * (c) 2014-2017 Evan You
 * Released under the MIT License.
 */


/*  */

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}
/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

var _toString = Object.prototype.toString;

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /([^-])([A-Z])/g;
var hyphenate = cached(function (str) {
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
});

/**
 * Simple bind, faster than native
 */
function bind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length;
  return boundFn
}

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 */
function noop () {}

/**
 * Always return false.
 */
var no = function () { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      return JSON.stringify(a) === JSON.stringify(b)
    } catch (e) {
      // possible circular reference
      return a === b
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "production" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "production" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

var emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

var warn = noop;
var tip = noop;
var formatComponentName = (null); // work around flow check

if (false) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.error("[Vue warn]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var name = typeof vm === 'string'
      ? vm
      : typeof vm === 'function' && vm.options
        ? vm.options.name
        : vm._isVue
          ? vm.$options.name || vm.$options._componentTag
          : vm.name;

    var file = vm._isVue && vm.$options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  var generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

function handleError (err, vm, info) {
  if (config.errorHandler) {
    config.errorHandler.call(null, err, vm, info);
  } else {
    if (false) {
      warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
    }
    /* istanbul ignore else */
    if (inBrowser && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }
}

/*  */
/* globals MutationObserver */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = UA && UA.indexOf('android') > 0;
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    } )); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
var nextTick = (function () {
  var callbacks = [];
  var pending = false;
  var timerFunc;

  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // the nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore if */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    var logError = function (err) { console.error(err); };
    timerFunc = function () {
      p.then(nextTickHandler).catch(logError);
      // in problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
  } else if (typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // use MutationObserver where native Promise is not available,
    // e.g. PhantomJS IE11, iOS7, Android 4.4
    var counter = 1;
    var observer = new MutationObserver(nextTickHandler);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
  } else {
    // fallback to setTimeout
    /* istanbul ignore next */
    timerFunc = function () {
      setTimeout(nextTickHandler, 0);
    };
  }

  return function queueNextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        _resolve = resolve;
      })
    }
  }
})();

var _Set;
/* istanbul ignore if */
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var arguments$1 = arguments;

    // avoid leaking arguments:
    // http://jsperf.com/closure-with-arguments
    var i = arguments.length;
    var args = new Array(i);
    while (i--) {
      args[i] = arguments$1[i];
    }
    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
        inserted = args;
        break
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
var observerState = {
  shouldConvert: true,
  isSettingProps: false
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (false) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && typeof key === 'number') {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (hasOwn(target, key)) {
    target[key] = val;
    return val
  }
  var ob = (target ).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "production" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && typeof key === 'number') {
    target.splice(key, 1);
    return
  }
  var ob = (target ).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    "production" !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (false) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (typeof childVal !== 'function') {
      "production" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        childVal.call(this),
        parentVal.call(this)
      )
    }
  } else if (parentVal || childVal) {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : undefined;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (parentVal, childVal) {
  var res = Object.create(parentVal || null);
  return childVal
    ? extend(res, childVal)
    : res
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (parentVal, childVal) {
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key in childVal) {
    var parent = ret[key];
    var child = childVal[key];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key] = parent
      ? parent.concat(child)
      : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.computed = function (parentVal, childVal) {
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  extend(ret, childVal);
  return ret
};

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    var lower = key.toLowerCase();
    if (isBuiltInTag(lower) || config.isReservedTag(lower)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + key
      );
    }
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (false) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (false) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (false) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // handle boolean props
  if (isType(Boolean, prop.type)) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (!isType(String, prop.type) && (value === '' || value === hyphenate(key))) {
      value = true;
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldConvert = observerState.shouldConvert;
    observerState.shouldConvert = true;
    observe(value);
    observerState.shouldConvert = prevShouldConvert;
  }
  if (false) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (false) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }
  if (!valid) {
    warn(
      'Invalid prop: type check failed for prop "' + name + '".' +
      ' Expected ' + expectedTypes.map(capitalize).join(', ') +
      ', got ' + Object.prototype.toString.call(value).slice(8, -1) + '.',
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    valid = typeof value === expectedType.toLowerCase();
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isType (type, fn) {
  if (!Array.isArray(fn)) {
    return getType(fn) === getType(type)
  }
  for (var i = 0, len = fn.length; i < len; i++) {
    if (getType(fn[i]) === getType(type)) {
      return true
    }
  }
  /* istanbul ignore next */
  return false
}

/*  */

var mark;
var measure;

if (false) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      perf.clearMeasures(name);
    };
  }
}

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (false) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      "referenced during render. Make sure to declare reactive data " +
      "properties in the data option.",
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' &&
    Proxy.toString().match(/native code/);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
      if (!has && !isAllowed) {
        warnNonPresent(target, key);
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        warnNonPresent(target, key);
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
};

var prototypeAccessors = { child: {} };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function () {
  var node = new VNode();
  node.text = '';
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.isCloned = true;
  return cloned
}

function cloneVNodes (vnodes) {
  var len = vnodes.length;
  var res = new Array(len);
  for (var i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i]);
  }
  return res
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      for (var i = 0; i < fns.length; i++) {
        fns[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, cur, old, event;
  for (name in on) {
    cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      "production" !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (false) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    last = res[res.length - 1];
    //  nested
    if (Array.isArray(c)) {
      res.push.apply(res, normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i)));
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        (last).text += String(c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[res.length - 1] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      "production" !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                 false
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && isDef(c.componentOptions)) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once$$1) {
  if (once$$1) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        this$1.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (arguments.length === 1) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (false) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        cbs[i].apply(vm, args);
      }
    }
    return vm
  };
}

/*  */

/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  var defaultSlot = [];
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.functionalContext === context) &&
      child.data && child.data.slot != null
    ) {
      var name = child.data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children);
      } else {
        slot.push(child);
      }
    } else {
      defaultSlot.push(child);
    }
  }
  // ignore whitespace
  if (!defaultSlot.every(isWhitespace)) {
    slots.default = defaultSlot;
  }
  return slots
}

function isWhitespace (node) {
  return node.isComment || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // remove reference to DOM nodes (prevents leak)
    vm.$options._parentElm = vm.$options._refElm = null;
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (false) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (false) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure((name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure((name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  vm._watcher = new Watcher(vm, updateComponent, noop);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render
  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update props
  if (propsData && vm.$options.props) {
    observerState.shouldConvert = false;
    if (false) {
      observerState.isSettingProps = true;
    }
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      props[key] = validateProp(key, vm.$options.props, propsData, vm);
    }
    observerState.shouldConvert = true;
    if (false) {
      observerState.isSettingProps = false;
    }
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  // update listeners
  if (listeners) {
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);
  }
  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
}

/*  */


var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (false) {
    circular = {};
  }
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (false) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdateHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdateHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options
) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  false
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      "production" !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  if (this.user) {
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    }
  } else {
    value = this.getter.call(vm, vm);
  }
  // "touch" every property so they are all tracked as
  // dependencies for deep watching
  if (this.deep) {
    traverse(value);
  }
  popTarget();
  this.cleanupDeps();
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
var seenObjects = new _Set();
function traverse (val) {
  seenObjects.clear();
  _traverse(val, seenObjects);
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch) { initWatch(vm, opts.watch); }
}

var isReservedProp = {
  key: 1,
  ref: 1,
  slot: 1
};

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  observerState.shouldConvert = isRoot;
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (false) {
      if (isReservedProp[key] || config.isReservedAttr(key)) {
        warn(
          ("\"" + key + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (vm.$parent && !observerState.isSettingProps) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive$$1(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  observerState.shouldConvert = true;
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    "production" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var i = keys.length;
  while (i--) {
    if (props && hasOwn(props, keys[i])) {
      "production" !== 'production' && warn(
        "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(keys[i])) {
      proxy(vm, "_data", keys[i]);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  try {
    return data.call(vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  var watchers = vm._computedWatchers = Object.create(null);

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (false) {
      if (getter === undefined) {
        warn(
          ("No getter function has been defined for computed property \"" + key + "\"."),
          vm
        );
        getter = noop;
      }
    }
    // create internal watcher for the computed property.
    watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions);

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (false) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (target, key, userDef) {
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
    if (false) {
      if (methods[key] == null) {
        warn(
          "method \"" + key + "\" has an undefined value in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
    }
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (vm, key, handler) {
  var options;
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  vm.$watch(key, handler, options);
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (false) {
    dataDef.set = function (newData) {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (false) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive$$1(vm, key, result[key]);
      }
    });
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    // isArray here
    var isArray = Array.isArray(inject);
    var result = Object.create(null);
    var keys = isArray
      ? inject
      : hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = isArray ? key : inject[key];
      var source = vm;
      while (source) {
        if (source._provided && provideKey in source._provided) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
    }
    return result
  }
}

/*  */

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  context,
  children
) {
  var props = {};
  var propOptions = Ctor.options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || {});
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var _context = Object.create(context);
  var h = function (a, b, c, d) { return createElement(_context, a, b, c, d, true); };
  var vnode = Ctor.options.render.call(null, h, {
    data: data,
    props: props,
    children: children,
    parent: context,
    listeners: data.on || {},
    injections: resolveInject(Ctor.options.inject, context),
    slots: function () { return resolveSlots(children, context); }
  });
  if (vnode instanceof VNode) {
    vnode.functionalContext = context;
    vnode.functionalOptions = Ctor.options;
    if (data.slot) {
      (vnode.data || (vnode.data = {})).slot = data.slot;
    }
  }
  return vnode
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

// hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (!vnode.componentInstance || vnode.componentInstance._isDestroyed) {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    } else if (vnode.data.keepAlive) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (false) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  if (isUndef(Ctor.cid)) {
    Ctor = resolveAsyncComponent(Ctor, baseCtor, context);
    if (Ctor === undefined) {
      // return nothing if this is indeed an async component
      // wait for the callback to trigger parent update.
      return
    }
  }

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  data = data || {};

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners
    data = {};
  }

  // merge component management hooks onto the placeholder node
  mergeHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }
  );
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var vnodeComponentOptions = vnode.componentOptions;
  var options = {
    _isComponent: true,
    parent: parent,
    propsData: vnodeComponentOptions.propsData,
    _componentTag: vnodeComponentOptions.tag,
    _parentVnode: vnode,
    _parentListeners: vnodeComponentOptions.listeners,
    _renderChildren: vnodeComponentOptions.children,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnodeComponentOptions.Ctor(options)
}

function mergeHooks (data) {
  if (!data.hook) {
    data.hook = {};
  }
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var fromParent = data.hook[key];
    var ours = componentVNodeHooks[key];
    data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
  }
}

function mergeHook$1 (one, two) {
  return function (a, b, c, d) {
    one(a, b, c, d);
    two(a, b, c, d);
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    "production" !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (isDef(vnode)) {
    if (ns) { applyNS(vnode, ns); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    return
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && isUndef(child.ns)) {
        applyNS(child, ns);
      }
    }
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      extend(props, bindObject);
    }
    return scopedSlotFn(props) || fallback
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes && "production" !== 'production') {
      slotNodes._rendered && warn(
        "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
        "- this will likely cause render errors.",
        this
      );
      slotNodes._rendered = true;
    }
    return slotNodes || fallback
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

/**
 * Runtime helper for checking keyCodes from config.
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInAlias
) {
  var keyCodes = config.keyCodes[key] || builtInAlias;
  if (Array.isArray(keyCodes)) {
    return keyCodes.indexOf(eventKeyCode) === -1
  } else {
    return keyCodes !== eventKeyCode
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp
) {
  if (value) {
    if (!isObject(value)) {
      "production" !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      for (var key in value) {
        if (key === 'class' || key === 'style') {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];
        }
      }
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var tree = this._staticTrees[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree by doing a shallow clone.
  if (tree && !isInFor) {
    return Array.isArray(tree)
      ? cloneVNodes(tree)
      : cloneVNode(tree)
  }
  // otherwise, render a fresh tree.
  tree = this._staticTrees[index] =
    this.$options.staticRenderFns[index].call(this._renderProxy);
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null;
  var parentVnode = vm.$vnode = vm.$options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(vm.$options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };
}

function renderMixin (Vue) {
  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var staticRenderFns = ref.staticRenderFns;
    var _parentVnode = ref._parentVnode;

    if (vm._isMounted) {
      // clone slot nodes on re-renders
      for (var key in vm.$slots) {
        vm.$slots[key] = cloneVNodes(vm.$slots[key]);
      }
    }

    vm.$scopedSlots = (_parentVnode && _parentVnode.data.scopedSlots) || emptyObject;

    if (staticRenderFns && !vm._staticTrees) {
      vm._staticTrees = [];
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render function");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (false) {
        vnode = vm.$options.renderError
          ? vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
          : vm._vnode;
      } else {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (false) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };

  // internal render helpers.
  // these are exposed on the instance prototype to reduce generated render
  // code size.
  Vue.prototype._o = markOnce;
  Vue.prototype._n = toNumber;
  Vue.prototype._s = toString;
  Vue.prototype._l = renderList;
  Vue.prototype._t = renderSlot;
  Vue.prototype._q = looseEqual;
  Vue.prototype._i = looseIndexOf;
  Vue.prototype._m = renderStatic;
  Vue.prototype._f = resolveFilter;
  Vue.prototype._k = checkKeyCodes;
  Vue.prototype._b = bindObjectProps;
  Vue.prototype._v = createTextVNode;
  Vue.prototype._e = createEmptyVNode;
  Vue.prototype._u = resolveScopedSlots;
}

/*  */

var uid$1 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$1++;

    var startTag, endTag;
    /* istanbul ignore if */
    if (false) {
      startTag = "vue-perf-init:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (false) {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (false) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(((vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  opts.parent = options.parent;
  opts.propsData = options.propsData;
  opts._parentVnode = options._parentVnode;
  opts._parentListeners = options._parentListeners;
  opts._renderChildren = options._renderChildren;
  opts._componentTag = options._componentTag;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;
  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue$3 (options) {
  if (false
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue$3);
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);
renderMixin(Vue$3);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    /* istanbul ignore if */
    if (plugin.installed) {
      return this
    }
    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    plugin.installed = true;
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (false) {
      if (!/^[a-zA-Z][\w-]*$/.test(name)) {
        warn(
          'Invalid component name: "' + name + '". Component names ' +
          'can only contain alphanumeric characters and the hyphen, ' +
          'and must start with a letter.'
        );
      }
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (false) {
          if (type === 'component' && config.isReservedTag(id)) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            );
          }
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

var patternTypes = [String, RegExp];

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (cache, current, filter) {
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        if (cachedNode !== current) {
          pruneCacheEntry(cachedNode);
        }
        cache[key] = null;
      }
    }
  }
}

function pruneCacheEntry (vnode) {
  if (vnode) {
    vnode.componentInstance.$destroy();
  }
}

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes
  },

  created: function created () {
    this.cache = Object.create(null);
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache[key]);
    }
  },

  watch: {
    include: function include (val) {
      pruneCache(this.cache, this._vnode, function (name) { return matches(val, name); });
    },
    exclude: function exclude (val) {
      pruneCache(this.cache, this._vnode, function (name) { return !matches(val, name); });
    }
  },

  render: function render () {
    var vnode = getFirstComponentChild(this.$slots.default);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
      )) {
        return vnode
      }
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (this.cache[key]) {
        vnode.componentInstance = this.cache[key].componentInstance;
      } else {
        this.cache[key] = vnode;
      }
      vnode.data.keepAlive = true;
    }
    return vnode
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (false) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue$3);

Object.defineProperty(Vue$3.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue$3.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode.ssrContext
  }
});

Vue$3.version = '2.3.3';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return genClassFromData(data)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function genClassFromData (data) {
  var dynamicClass = data.class;
  var staticClass = data.staticClass;
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (isUndef(value)) {
    return ''
  }
  if (typeof value === 'string') {
    return value
  }
  var res = '';
  if (Array.isArray(value)) {
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (isDef(value[i])) {
        if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
          res += stringified + ' ';
        }
      }
    }
    return res.slice(0, -1)
  }
  if (isObject(value)) {
    for (var key in value) {
      if (value[key]) { res += key + ' '; }
    }
    return res.slice(0, -1)
  }
  /* istanbul ignore next */
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isPreTag = function (tag) { return tag === 'pre'; };

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      "production" !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setAttribute (node, key, val) {
  node.setAttribute(key, val);
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setAttribute: setAttribute
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!key) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (Array.isArray(refs[key]) && refs[key].indexOf(ref) < 0) {
        refs[key].push(ref);
      } else {
        refs[key] = [ref];
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *

/*
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    isDef(a.data) === isDef(b.data) &&
    sameInputType(a, b)
  )
}

// Some browsers do not support dynamically changing type for <input>
// so they need to be treated as different nodes
function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  var inPre = 0;
  function createElm (vnode, insertedVnodeQueue, parentElm, refElm, nested) {
    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (false) {
        if (data && data.pre) {
          inPre++;
        }
        if (
          !inPre &&
          !vnode.ns &&
          !(config.ignoredElements.length && config.ignoredElements.indexOf(tag) > -1) &&
          config.isUnknownElement(tag)
        ) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }
      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if (false) {
        inPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref) {
    if (isDef(parent)) {
      if (isDef(ref)) {
        if (ref.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    var ancestor = vnode;
    while (ancestor) {
      if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
        nodeOps.setAttribute(vnode.elm, i, '');
      }
      ancestor = ancestor.parent;
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setAttribute(vnode.elm, i, '');
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          /* istanbul ignore if */
          if (false) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            );
          }
          if (sameVnode(elmToMove, newStartVnode)) {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          }
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }
    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.elm = oldVnode.elm;
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }
    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }
    var elm = vnode.elm = oldVnode.elm;
    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var bailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  var isRenderedModule = makeMap('attrs,style,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue) {
    if (false) {
      if (!assertNodeMatch(elm, vnode)) {
        return false
      }
    }
    vnode.elm = elm;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          var childrenMatch = true;
          var childNode = elm.firstChild;
          for (var i$1 = 0; i$1 < children.length; i$1++) {
            if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue)) {
              childrenMatch = false;
              break
            }
            childNode = childNode.nextSibling;
          }
          // if childNode is not null, it means the actual childNodes list is
          // longer than the virtual children list.
          if (!childrenMatch || childNode) {
            if (false
            ) {
              bailed = true;
              console.warn('Parent: ', elm);
              console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
            }
            return false
          }
        }
      }
      if (isDef(data)) {
        for (var key in data) {
          if (!isRenderedModule(key)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode) {
    if (isDef(vnode.tag)) {
      return (
        vnode.tag.indexOf('vue-component') === 0 ||
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (false) {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }
        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        if (isDef(vnode.parent)) {
          // component root element replaced.
          // update parent placeholder node element, recursively
          var ancestor = vnode.parent;
          while (ancestor) {
            ancestor.elm = vnode.elm;
            ancestor = ancestor.parent;
          }
          if (isPatchable(vnode)) {
            for (var i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent);
            }
          }
        }

        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  /* istanbul ignore if */
  if (isIE9 && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, key);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;

function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) {
      if (c === 0x27 && prev !== 0x5C) { inSingle = false; }
    } else if (inDouble) {
      if (c === 0x22 && prev !== 0x5C) { inDouble = false; }
    } else if (inTemplateString) {
      if (c === 0x60 && prev !== 0x5C) { inTemplateString = false; }
    } else if (inRegex) {
      if (c === 0x2f && prev !== 0x5C) { inRegex = false; }
    } else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) {
      if (expression === undefined) {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } else {
        pushFilter();
      }
    } else {
      switch (c) {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) {
          p = exp.charAt(j);
          if (p !== ' ') { break }
        }
        if (!p || !validDivisionCharRE.test(p)) {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) {
    expression = exp.slice(0, i).trim();
  } else if (lastFilterIndex !== 0) {
    pushFilter();
  }

  function pushFilter () {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) {
    for (i = 0; i < filters.length; i++) {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}

function wrapFilter (exp, filter) {
  var i = filter.indexOf('(');
  if (i < 0) {
    // _f: resolveFilter
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } else {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}

function pluckModuleFunction (
  modules,
  key
) {
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}

function addProp (el, name, value) {
  (el.props || (el.props = [])).push({ name: name, value: value });
}

function addAttr (el, name, value) {
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}

function addDirective (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) {
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) {
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    false
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }
  // check capture modifier
  if (modifiers && modifiers.capture) {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers && modifiers.once) {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers && modifiers.passive) {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }
  var events;
  if (modifiers && modifiers.native) {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } else {
    events = el.events || (el.events = {});
  }
  var newHandler = { value: value, modifiers: modifiers };
  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } else if (handlers) {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } else {
    events[name] = newHandler;
  }
}

function getBindingAttr (
  el,
  name,
  getStatic
) {
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  if (dynamicValue != null) {
    return parseFilters(dynamicValue)
  } else if (getStatic !== false) {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) {
      return JSON.stringify(staticValue)
    }
  }
}

function getAndRemoveAttr (el, name) {
  var val;
  if ((val = el.attrsMap[name]) != null) {
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i].name === name) {
        list.splice(i, 1);
        break
      }
    }
  }
  return val
}

/*  */

/**
 * Cross-platform code generation for component v-model
 */
function genComponentModel (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;

  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
function genAssignmentCode (
  value,
  assignment
) {
  var modelRs = parseModel(value);
  if (modelRs.idx === null) {
    return (value + "=" + assignment)
  } else {
    return "var $$exp = " + (modelRs.exp) + ", $$idx = " + (modelRs.idx) + ";" +
      "if (!Array.isArray($$exp)){" +
        value + "=" + assignment + "}" +
      "else{$$exp.splice($$idx, 1, " + assignment + ")}"
  }
}

/**
 * parse directive model to do the array update transform. a[idx] = val => $$a.splice($$idx, 1, val)
 *
 * for loop possible cases:
 *
 * - test
 * - test[idx]
 * - test[test1[idx]]
 * - test["a"][idx]
 * - xxx.test[a[a].test1[idx]]
 * - test.xxx.a["asa"][test1[idx]]
 *
 */

var len;
var str;
var chr;
var index$1;
var expressionPos;
var expressionEndPos;

function parseModel (val) {
  str = val;
  len = str.length;
  index$1 = expressionPos = expressionEndPos = 0;

  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    return {
      exp: val,
      idx: null
    }
  }

  while (!eof()) {
    chr = next();
    /* istanbul ignore if */
    if (isStringStart(chr)) {
      parseString(chr);
    } else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }

  return {
    exp: val.substring(0, expressionPos),
    idx: val.substring(expressionPos + 1, expressionEndPos)
  }
}

function next () {
  return str.charCodeAt(++index$1)
}

function eof () {
  return index$1 >= len
}

function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}

function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index$1;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    if (chr === 0x5B) { inBracket++; }
    if (chr === 0x5D) { inBracket--; }
    if (inBracket === 0) {
      expressionEndPos = index$1;
      break
    }
  }
}

function parseString (chr) {
  var stringQuote = chr;
  while (!eof()) {
    chr = next();
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$1;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

function model (
  el,
  dir,
  _warn
) {
  warn$1 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  if (false) {
    var dynamicType = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
    if (tag === 'input' && dynamicType) {
      warn$1(
        "<input :type=\"" + dynamicType + "\" v-model=\"" + value + "\">:\n" +
        "v-model does not support dynamic input types. Use v-if branches instead."
      );
    }
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }

  if (tag === 'select') {
    genSelect(el, value, modifiers);
  } else if (tag === 'input' && type === 'checkbox') {
    genCheckboxModel(el, value, modifiers);
  } else if (tag === 'input' && type === 'radio') {
    genRadioModel(el, value, modifiers);
  } else if (tag === 'input' || tag === 'textarea') {
    genDefaultModel(el, value, modifiers);
  } else if (!config.isReservedTag(tag)) {
    genComponentModel(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } else if (false) {
    warn$1(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}

function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
      "?_i(" + value + "," + valueBinding + ")>-1" + (
        trueValueBinding === 'true'
          ? (":(" + value + ")")
          : (":_q(" + value + "," + trueValueBinding + ")")
      )
  );
  addHandler(el, CHECKBOX_RADIO_TOKEN,
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$c){$$i<0&&(" + value + "=$$a.concat($$v))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + (genAssignmentCode(value, '$$c')) + "}",
    null, true
  );
}

function genRadioModel (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, CHECKBOX_RADIO_TOKEN, genAssignmentCode(value, valueBinding), null, true);
}

function genSelect (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode(value, assignment));
  addHandler(el, 'change', code, null, true);
}

function genDefaultModel (
  el,
  value,
  modifiers
) {
  var type = el.attrsMap.type;
  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';

  var valueExpression = '$event.target.value';
  if (trim) {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode(value, valueExpression);
  if (needCompositionGuard) {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number || type === 'number') {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  var event;
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    // Chrome fires microtasks in between click/change, leads to #4521
    event = isChrome ? 'click' : 'change';
    on[event] = [].concat(on[CHECKBOX_RADIO_TOKEN], on[event] || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  if (once$$1) {
    var oldHandler = handler;
    var _target = target$1; // save current target element in closure
    handler = function (ev) {
      var res = arguments.length === 1
        ? oldHandler(ev)
        : oldHandler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, handler, capture, _target);
      }
    };
  }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(event, handler, capture);
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, vnode, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (
  elm,
  vnode,
  checkVal
) {
  return (!elm.composing && (
    vnode.tag === 'option' ||
    isDirty(elm, checkVal) ||
    isInputChanged(elm, checkVal)
  ))
}

function isDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is not equal to the updated value
  return document.activeElement !== elm && elm.value !== checkVal
}

function isInputChanged (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if ((isDef(modifiers) && modifiers.number) || elm.type === 'number') {
    return toNumber(value) !== toNumber(newVal)
  }
  if (isDef(modifiers) && modifiers.trim) {
    return value.trim() !== newVal.trim()
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (childNode.data && (styleData = normalizeStyleData(childNode.data))) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var prefixes = ['Webkit', 'Moz', 'ms'];

var testEl;
var normalize = cached(function (prop) {
  testEl = testEl || document.createElement('div');
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in testEl.style)) {
    return prop
  }
  var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < prefixes.length; i++) {
    var prefixed = prefixes[i] + upper;
    if (prefixed in testEl.style) {
      return prefixed
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likley wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    el.setAttribute('class', cur.trim());
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser && window.requestAnimationFrame
  ? window.requestAnimationFrame.bind(window)
  : setTimeout;

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  (el._transitionClasses || (el._transitionClasses = [])).push(cls);
  addClass(el, cls);
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if (false) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      addTransitionClass(el, toClass);
      removeTransitionClass(el, startClass);
      if (!cb.cancelled && !userWantsControl) {
        if (isValidDuration(explicitEnterDuration)) {
          setTimeout(cb, explicitEnterDuration);
        } else {
          whenTransitionEnds(el, type, cb);
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if (false) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        addTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled && !userWantsControl) {
          if (isValidDuration(explicitLeaveDuration)) {
            setTimeout(cb, explicitLeaveDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var model$1 = {
  inserted: function inserted (el, binding, vnode) {
    if (vnode.tag === 'select') {
      var cb = function () {
        setSelected(el, binding, vnode.context);
      };
      cb();
      /* istanbul ignore if */
      if (isIE || isEdge) {
        setTimeout(cb, 0);
      }
    } else if (vnode.tag === 'textarea' || el.type === 'text' || el.type === 'password') {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },
  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var needReset = el.multiple
        ? binding.value.some(function (v) { return hasNoMatchingOption(v, el.options); })
        : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
      if (needReset) {
        trigger(el, 'change');
      }
    }
  }
};

function setSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    "production" !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  for (var i = 0, l = options.length; i < l; i++) {
    if (looseEqual(getValue(options[i]), value)) {
      return false
    }
  }
  return true
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition && !isIE9) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (value === oldValue) { return }
    vnode = locateNode(vnode);
    var transition = vnode.data && vnode.data.transition;
    if (transition && !isIE9) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: model$1,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag; });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (false) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (false
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (oldChild && oldChild.data && !isSameChild(child, oldChild)) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild && (oldChild.data.transition = extend({}, data));
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (false) {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    var body = document.body;
    var f = body.offsetHeight; // eslint-disable-line

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      if (this._hasMove != null) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue$3.config.mustUseProp = mustUseProp;
Vue$3.config.isReservedTag = isReservedTag;
Vue$3.config.isReservedAttr = isReservedAttr;
Vue$3.config.getTagNamespace = getTagNamespace;
Vue$3.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue$3.options.directives, platformDirectives);
extend(Vue$3.options.components, platformComponents);

// install platform patch function
Vue$3.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
setTimeout(function () {
  if (config.devtools) {
    if (devtools) {
      devtools.emit('init', Vue$3);
    } else if (false) {
      console[console.info ? 'info' : 'log'](
        'Download the Vue Devtools extension for a better development experience:\n' +
        'https://github.com/vuejs/vue-devtools'
      );
    }
  }
  if (false
  ) {
    console[console.info ? 'info' : 'log'](
      "You are running Vue in development mode.\n" +
      "Make sure to turn on production mode when deploying for production.\n" +
      "See more tips at https://vuejs.org/guide/deployment.html"
    );
  }
}, 0);

/*  */

// check whether current browser encodes a char inside attribute values
function shouldDecode (content, encoded) {
  var div = document.createElement('div');
  div.innerHTML = "<div a=\"" + content + "\">";
  return div.innerHTML.indexOf(encoded) > 0
}

// #3663
// IE encodes newlines inside attribute values while other browsers don't
var shouldDecodeNewlines = inBrowser ? shouldDecode('\n', '&#10;') : false;

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/*  */

var decoder;

function decode (html) {
  decoder = decoder || document.createElement('div');
  decoder.innerHTML = html;
  return decoder.textContent
}

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
var singleAttrIdentifier = /([^\s"'<>/=]+)/;
var singleAttrAssign = /(?:=)/;
var singleAttrValues = [
  // attr value double quotes
  /"([^"]*)"+/.source,
  // attr value, single quotes
  /'([^']*)'+/.source,
  // attr value, no quotes
  /([^\s"'=<>`]+)/.source
];
var attribute = new RegExp(
  '^\\s*' + singleAttrIdentifier.source +
  '(?:\\s*(' + singleAttrAssign.source + ')' +
  '\\s*(?:' + singleAttrValues.join('|') + '))?'
);

// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
var qnameCapture = '((?:' + ncname + '\\:)?' + ncname + ')';
var startTagOpen = new RegExp('^<' + qnameCapture);
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>');
var doctype = /^<!DOCTYPE [^>]+>/i;
var comment = /^<!--/;
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

// Special Elements (can contain anything)
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};

var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
};
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}

function parseHTML (html, options) {
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) {
    last = html;
    // Make sure we're not in a plaintext content element like script/style
    if (!lastTag || !isPlainTextElement(lastTag)) {
      var textEnd = html.indexOf('<');
      if (textEnd === 0) {
        // Comment:
        if (comment.test(html)) {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) {
            advance(commentEnd + 3);
            continue
          }
        }

        // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
        if (conditionalComment.test(html)) {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) {
            advance(conditionalEnd + 2);
            continue
          }
        }

        // Doctype:
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) {
          advance(doctypeMatch[0].length);
          continue
        }

        // End tag:
        var endTagMatch = html.match(endTag);
        if (endTagMatch) {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        // Start tag:
        var startTagMatch = parseStartTag();
        if (startTagMatch) {
          handleStartTag(startTagMatch);
          continue
        }
      }

      var text = (void 0), rest$1 = (void 0), next = (void 0);
      if (textEnd >= 0) {
        rest$1 = html.slice(textEnd);
        while (
          !endTag.test(rest$1) &&
          !startTagOpen.test(rest$1) &&
          !comment.test(rest$1) &&
          !conditionalComment.test(rest$1)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest$1.indexOf('<', 1);
          if (next < 0) { break }
          textEnd += next;
          rest$1 = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) {
        text = html;
        html = '';
      }

      if (options.chars && text) {
        options.chars(text);
      }
    } else {
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var endTagLength = 0;
      var rest = html.replace(reStackedTag, function (all, text, endTag) {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (options.chars) {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest.length;
      html = rest;
      parseEndTag(stackedTag, index - endTagLength, index);
    }

    if (html === last) {
      options.chars && options.chars(html);
      if (false) {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }

  // Clean up any remaining tags
  parseEndTag();

  function advance (n) {
    index += n;
    html = html.substring(n);
  }

  function parseStartTag () {
    var start = html.match(startTagOpen);
    if (start) {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      advance(start[0].length);
      var end, attr;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      if (end) {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }

  function handleStartTag (match) {
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;

    if (expectHTML) {
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
        parseEndTag(lastTag);
      }
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || tagName === 'html' && lastTag === 'head' || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
        if (args[3] === '') { delete args[3]; }
        if (args[4] === '') { delete args[4]; }
        if (args[5] === '') { delete args[5]; }
      }
      var value = args[3] || args[4] || args[5] || '';
      attrs[i] = {
        name: args[1],
        value: decodeAttr(
          value,
          options.shouldDecodeNewlines
        )
      };
    }

    if (!unary) {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }

  function parseEndTag (tagName, start, end) {
    var pos, lowerCasedTagName;
    if (start == null) { start = index; }
    if (end == null) { end = index; }

    if (tagName) {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) {
          break
        }
      }
    } else {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) {
        if (false
        ) {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } else if (lowerCasedTagName === 'br') {
      if (options.start) {
        options.start(tagName, [], true, start, end);
      }
    } else if (lowerCasedTagName === 'p') {
      if (options.start) {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});

function parseText (
  text,
  delimiters
) {
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  if (!tagRE.test(text)) {
    return
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  while ((match = tagRE.exec(text))) {
    index = match.index;
    // push text token
    if (index > lastIndex) {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(decode);

// configurable state
var warn$2;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;

/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
) {
  warn$2 = options.warn || baseWarn;
  platformGetTagNamespace = options.getTagNamespace || no;
  platformMustUseProp = options.mustUseProp || no;
  platformIsPreTag = options.isPreTag || no;
  preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
  transforms = pluckModuleFunction(options.modules, 'transformNode');
  postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');
  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;

  function warnOnce (msg) {
    if (!warned) {
      warned = true;
      warn$2(msg);
    }
  }

  function endPre (element) {
    // check pre state
    if (element.pre) {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) {
      inPre = false;
    }
  }

  parseHTML(template, {
    warn: warn$2,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    start: function start (tag, attrs, unary) {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE && ns === 'svg') {
        attrs = guardIESVGBug(attrs);
      }

      var element = {
        type: 1,
        tag: tag,
        attrsList: attrs,
        attrsMap: makeAttrsMap(attrs),
        parent: currentParent,
        children: []
      };
      if (ns) {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering()) {
        element.forbidden = true;
        "production" !== 'production' && warn$2(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) {
        preTransforms[i](element, options);
      }

      if (!inVPre) {
        processPre(element);
        if (element.pre) {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) {
        inPre = true;
      }
      if (inVPre) {
        processRawAttrs(element);
      } else {
        processFor(element);
        processIf(element);
        processOnce(element);
        processKey(element);

        // determine whether this is a plain element after
        // removing structural attributes
        element.plain = !element.key && !attrs.length;

        processRef(element);
        processSlot(element);
        processComponent(element);
        for (var i$1 = 0; i$1 < transforms.length; i$1++) {
          transforms[i$1](element, options);
        }
        processAttrs(element);
      }

      function checkRootConstraints (el) {
        if (false) {
          if (el.tag === 'slot' || el.tag === 'template') {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) {
        root = element;
        checkRootConstraints(root);
      } else if (!stack.length) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else if (false) {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else if (element.slotScope) { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } else {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) {
        currentParent = element;
        stack.push(element);
      } else {
        endPre(element);
      }
      // apply post-transforms
      for (var i$2 = 0; i$2 < postTransforms.length; i$2++) {
        postTransforms[i$2](element, options);
      }
    },

    end: function end () {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },

    chars: function chars (text) {
      if (!currentParent) {
        if (false) {
          if (text === template) {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } else if ((text = text.trim())) {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText(text, delimiters))) {
          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    }
  });
  return root
}

function processPre (el) {
  if (getAndRemoveAttr(el, 'v-pre') != null) {
    el.pre = true;
  }
}

function processRawAttrs (el) {
  var l = el.attrsList.length;
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}

function processKey (el) {
  var exp = getBindingAttr(el, 'key');
  if (exp) {
    if (false) {
      warn$2("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}

function processRef (el) {
  var ref = getBindingAttr(el, 'ref');
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}

function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr(el, 'v-for'))) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      "production" !== 'production' && warn$2(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim();
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}

function processIf (el) {
  var exp = getAndRemoveAttr(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}

function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, {
      exp: el.elseif,
      block: el
    });
  } else if (false) {
    warn$2(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}

function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if (false) {
        warn$2(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}

function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}

function processOnce (el) {
  var once$$1 = getAndRemoveAttr(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}

function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr(el, 'name');
    if (false) {
      warn$2(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
    }
    if (el.tag === 'template') {
      el.slotScope = getAndRemoveAttr(el, 'scope');
    }
  }
}

function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}

function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || platformMustUseProp(el.tag, el.attrsMap.type, name)) {
          addProp(el, name, value);
        } else {
          addAttr(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler(el, name, value, modifiers, false, warn$2);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective(el, name, rawName, value, arg, modifiers);
        if (false) {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      if (false) {
        var expression = parseText(value, delimiters);
        if (expression) {
          warn$2(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr(el, name, JSON.stringify(value));
    }
  }
}

function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}

function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}

function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      false
    ) {
      warn$2('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}

function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/* istanbul ignore next */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}

function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic$1(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}

function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}

function markStatic$1 (node) {
  node.static = isStatic(node);
  if (node.type === 1) {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      markStatic$1(child);
      if (!child.static) {
        node.static = false;
      }
    }
  }
}

function markStaticRoots (node, isInFor) {
  if (node.type === 1) {
    if (node.static || node.once) {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) {
      node.staticRoot = true;
      return
    } else {
      node.staticRoot = false;
    }
    if (node.children) {
      for (var i = 0, l = node.children.length; i < l; i++) {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) {
      walkThroughConditionsBlocks(node.ifConditions, isInFor);
    }
  }
}

function walkThroughConditionsBlocks (conditionBlocks, isInFor) {
  for (var i = 1, len = conditionBlocks.length; i < len; i++) {
    markStaticRoots(conditionBlocks[i].block, isInFor);
  }
}

function isStatic (node) {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}

function isDirectChildOfTemplateFor (node) {
  while (node.parent) {
    node = node.parent;
    if (node.tag !== 'template') {
      return false
    }
    if (node.for) {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = {
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};

function genHandlers (
  events,
  isNative,
  warn
) {
  var res = isNative ? 'nativeOn:{' : 'on:{';
  for (var name in events) {
    var handler = events[name];
    // #5330: warn click.right, since right clicks do not actually fire click events.
    if (false
    ) {
      warn(
        "Use \"contextmenu\" instead of \"click.right\" since right clicks " +
        "do not actually fire \"click\" events."
      );
    }
    res += "\"" + name + "\":" + (genHandler(name, handler)) + ",";
  }
  return res.slice(0, -1) + '}'
}

function genHandler (
  name,
  handler
) {
  if (!handler) {
    return 'function(){}'
  }

  if (Array.isArray(handler)) {
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression
      ? handler.value
      : ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? ("(" + (handler.value) + ")($event)")
        : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}

function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}

function genFilterCode (key) {
  var keyVal = parseInt(key, 10);
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  var alias = keyCodes[key];
  return ("_k($event.keyCode," + (JSON.stringify(key)) + (alias ? ',' + JSON.stringify(alias) : '') + ")")
}

/*  */

function bind$1 (el, dir) {
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + (dir.modifiers && dir.modifiers.prop ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  bind: bind$1,
  cloak: noop
};

/*  */

// configurable state
var warn$3;
var transforms$1;
var dataGenFns;
var platformDirectives$1;
var isPlatformReservedTag$1;
var staticRenderFns;
var onceCount;
var currentOptions;

function generate (
  ast,
  options
) {
  // save previous staticRenderFns so generate calls can be nested
  var prevStaticRenderFns = staticRenderFns;
  var currentStaticRenderFns = staticRenderFns = [];
  var prevOnceCount = onceCount;
  onceCount = 0;
  currentOptions = options;
  warn$3 = options.warn || baseWarn;
  transforms$1 = pluckModuleFunction(options.modules, 'transformCode');
  dataGenFns = pluckModuleFunction(options.modules, 'genData');
  platformDirectives$1 = options.directives || {};
  isPlatformReservedTag$1 = options.isReservedTag || no;
  var code = ast ? genElement(ast) : '_c("div")';
  staticRenderFns = prevStaticRenderFns;
  onceCount = prevOnceCount;
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: currentStaticRenderFns
  }
}

function genElement (el) {
  if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el)
  } else if (el.for && !el.forProcessed) {
    return genFor(el)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return genChildren(el) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el)
  } else {
    // component or element
    var code;
    if (el.component) {
      code = genComponent(el.component, el);
    } else {
      var data = el.plain ? undefined : genData(el);

      var children = el.inlineTemplate ? null : genChildren(el, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < transforms$1.length; i++) {
      code = transforms$1[i](el, code);
    }
    return code
  }
}

// hoist static sub-trees out
function genStatic (el) {
  el.staticProcessed = true;
  staticRenderFns.push(("with(this){return " + (genElement(el)) + "}"));
  return ("_m(" + (staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

// v-once
function genOnce (el) {
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "production" !== 'production' && warn$3(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el)
    }
    return ("_o(" + (genElement(el)) + "," + (onceCount++) + (key ? ("," + key) : "") + ")")
  } else {
    return genStatic(el)
  }
}

function genIf (el) {
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice())
}

function genIfConditions (conditions) {
  if (!conditions.length) {
    return '_e()'
  }

  var condition = conditions.shift();
  if (condition.exp) {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions)))
  } else {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  function genTernaryExp (el) {
    return el.once ? genOnce(el) : genElement(el)
  }
}

function genFor (el) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if (
    false
  ) {
    warn$3(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genElement(el)) +
    '})'
}

function genData (el) {
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < dataGenFns.length; i++) {
    data += dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, warn$3)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, warn$3)) + ",";
  }
  // slot target
  if (el.slotTarget) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  return data
}

function genDirectives (el) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = platformDirectives$1[dir.name] || baseDirectives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, warn$3);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el) {
  var ast = el.children[0];
  if (false) {
    warn$3('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, currentOptions);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (slots) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) { return genScopedSlot(key, slots[key]); }).join(',')) + "])")
}

function genScopedSlot (key, el) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el)
  }
  return "{key:" + key + ",fn:function(" + (String(el.attrsMap.scope)) + "){" +
    "return " + (el.tag === 'template'
      ? genChildren(el) || 'void 0'
      : genElement(el)) + "}}"
}

function genForScopedSlot (key, el) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el)) +
    '})'
}

function genChildren (el, checkSkip) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return genElement(el$1)
    }
    var normalizationType = checkSkip ? getNormalizationType(children) : 0;
    return ("[" + (children.map(genNode).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (children) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function maybeComponent (el) {
  return !isPlatformReservedTag$1(el.tag)
}

function genNode (node) {
  if (node.type === 1) {
    return genElement(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genSlot (el) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
function genComponent (componentName, el) {
  var children = el.inlineTemplate ? null : genChildren(el, true);
  return ("_c(" + componentName + "," + (genData(el)) + (children ? ("," + children) : '') + ")")
}

function genProps (props) {
  var res = '';
  for (var i = 0; i < props.length; i++) {
    var prop = props[i];
    res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
  }
  return res.slice(0, -1)
}

// #3895, #4268
function transformSpecialNewlines (text) {
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// check valid identifier for v-for
var identRE = /[A-Za-z_$][\w$]*/;

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (ident, type, text, errors) {
  if (typeof ident === 'string' && !identRE.test(ident)) {
    errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
      );
    } else {
      errors.push(("invalid expression: " + (text.trim())));
    }
  }
}

/*  */

function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  optimize(ast, options);
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
}

function makeFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err: err, code: code });
    return noop
  }
}

function createCompiler (baseOptions) {
  var functionCompileCache = Object.create(null);

  function compile (
    template,
    options
  ) {
    var finalOptions = Object.create(baseOptions);
    var errors = [];
    var tips = [];
    finalOptions.warn = function (msg, tip$$1) {
      (tip$$1 ? tips : errors).push(msg);
    };

    if (options) {
      // merge custom modules
      if (options.modules) {
        finalOptions.modules = (baseOptions.modules || []).concat(options.modules);
      }
      // merge custom directives
      if (options.directives) {
        finalOptions.directives = extend(
          Object.create(baseOptions.directives),
          options.directives
        );
      }
      // copy other options
      for (var key in options) {
        if (key !== 'modules' && key !== 'directives') {
          finalOptions[key] = options[key];
        }
      }
    }

    var compiled = baseCompile(template, finalOptions);
    if (false) {
      errors.push.apply(errors, detectErrors(compiled.ast));
    }
    compiled.errors = errors;
    compiled.tips = tips;
    return compiled
  }

  function compileToFunctions (
    template,
    options,
    vm
  ) {
    options = options || {};

    /* istanbul ignore if */
    if (false) {
      // detect possible CSP restriction
      try {
        new Function('return 1');
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (functionCompileCache[key]) {
      return functionCompileCache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    if (false) {
      if (compiled.errors && compiled.errors.length) {
        warn(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(function (msg) { return tip(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = makeFunction(compiled.render, fnGenErrors);
    var l = compiled.staticRenderFns.length;
    res.staticRenderFns = new Array(l);
    for (var i = 0; i < l; i++) {
      res.staticRenderFns[i] = makeFunction(compiled.staticRenderFns[i], fnGenErrors);
    }

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    if (false) {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (functionCompileCache[key] = res)
  }

  return {
    compile: compile,
    compileToFunctions: compileToFunctions
  }
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if (false) {
    var expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass$1 = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData$1
};

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    if (false) {
      var expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$2 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style$1 = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$2
};

var modules$1 = [
  klass$1,
  style$1
];

/*  */

function text (el, dir) {
  if (dir.value) {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

function html (el, dir) {
  if (dir.value) {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives$1 = {
  model: model,
  text: text,
  html: html
};

/*  */

var baseOptions = {
  expectHTML: true,
  modules: modules$1,
  directives: directives$1,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules$1)
};

var ref$1 = createCompiler(baseOptions);
var compileToFunctions = ref$1.compileToFunctions;

/*  */

var idToTemplate = cached(function (id) {
  var el = query(id);
  return el && el.innerHTML
});

var mount = Vue$3.prototype.$mount;
Vue$3.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    "production" !== 'production' && warn(
      "Do not mount Vue to <html> or <body> - mount to normal elements instead."
    );
    return this
  }

  var options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    var template = options.template;
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (false) {
            warn(
              ("Template element not found or is empty: " + (options.template)),
              this
            );
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (false) {
          warn('invalid template option:' + template, this);
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (false) {
        mark('compile');
      }

      var ref = compileToFunctions(template, {
        shouldDecodeNewlines: shouldDecodeNewlines,
        delimiters: options.delimiters
      }, this);
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (false) {
        mark('compile end');
        measure(((this._name) + " compile"), 'compile', 'compile end');
      }
    }
  }
  return mount.call(this, el, hydrating)
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div');
    container.appendChild(el.cloneNode(true));
    return container.innerHTML
  }
}

Vue$3.compile = compileToFunctions;

module.exports = Vue$3;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Registers all bootstrappers.
 *
 * A bootstrapper is a standalone module exporting a boot() method.
 *
 */

// Register all bootstrappers.
module.exports = {
    render: __webpack_require__(325).boot(),
    slug: __webpack_require__(329).boot(),
    search: __webpack_require__(327).boot(),
    theme: __webpack_require__(330).boot(),
    routes: __webpack_require__(326).boot(),
    localization: __webpack_require__(324).boot(),
    sidebar: __webpack_require__(328).boot()
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * class Ruler
 *
 * Helper class, used by [[MarkdownIt#core]], [[MarkdownIt#block]] and
 * [[MarkdownIt#inline]] to manage sequences of functions (rules):
 *
 * - keep rules in defined order
 * - assign the name to each rule
 * - enable/disable rules
 * - add/replace rules
 * - allow assign rules to additional named chains (in the same)
 * - cacheing lists of active rules
 *
 * You will not need use this class directly until write plugins. For simple
 * rules control use [[MarkdownIt.disable]], [[MarkdownIt.enable]] and
 * [[MarkdownIt.use]].
 **/



/**
 * new Ruler()
 **/
function Ruler() {
  // List of added rules. Each element is:
  //
  // {
  //   name: XXX,
  //   enabled: Boolean,
  //   fn: Function(),
  //   alt: [ name2, name3 ]
  // }
  //
  this.__rules__ = [];

  // Cached rule chains.
  //
  // First level - chain name, '' for default.
  // Second level - diginal anchor for fast filtering by charcodes.
  //
  this.__cache__ = null;
}

////////////////////////////////////////////////////////////////////////////////
// Helper methods, should not be used directly


// Find rule index by name
//
Ruler.prototype.__find__ = function (name) {
  for (var i = 0; i < this.__rules__.length; i++) {
    if (this.__rules__[i].name === name) {
      return i;
    }
  }
  return -1;
};


// Build rules lookup cache
//
Ruler.prototype.__compile__ = function () {
  var self = this;
  var chains = [ '' ];

  // collect unique names
  self.__rules__.forEach(function (rule) {
    if (!rule.enabled) { return; }

    rule.alt.forEach(function (altName) {
      if (chains.indexOf(altName) < 0) {
        chains.push(altName);
      }
    });
  });

  self.__cache__ = {};

  chains.forEach(function (chain) {
    self.__cache__[chain] = [];
    self.__rules__.forEach(function (rule) {
      if (!rule.enabled) { return; }

      if (chain && rule.alt.indexOf(chain) < 0) { return; }

      self.__cache__[chain].push(rule.fn);
    });
  });
};


/**
 * Ruler.at(name, fn [, options])
 * - name (String): rule name to replace.
 * - fn (Function): new rule function.
 * - options (Object): new rule options (not mandatory).
 *
 * Replace rule by name with new function & options. Throws error if name not
 * found.
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * Replace existing typorgapher replacement rule with new one:
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.core.ruler.at('replacements', function replace(state) {
 *   //...
 * });
 * ```
 **/
Ruler.prototype.at = function (name, fn, options) {
  var index = this.__find__(name);
  var opt = options || {};

  if (index === -1) { throw new Error('Parser rule not found: ' + name); }

  this.__rules__[index].fn = fn;
  this.__rules__[index].alt = opt.alt || [];
  this.__cache__ = null;
};


/**
 * Ruler.before(beforeName, ruleName, fn [, options])
 * - beforeName (String): new rule will be added before this one.
 * - ruleName (String): name of added rule.
 * - fn (Function): rule function.
 * - options (Object): rule options (not mandatory).
 *
 * Add new rule to chain before one with given name. See also
 * [[Ruler.after]], [[Ruler.push]].
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
 *   //...
 * });
 * ```
 **/
Ruler.prototype.before = function (beforeName, ruleName, fn, options) {
  var index = this.__find__(beforeName);
  var opt = options || {};

  if (index === -1) { throw new Error('Parser rule not found: ' + beforeName); }

  this.__rules__.splice(index, 0, {
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.__cache__ = null;
};


/**
 * Ruler.after(afterName, ruleName, fn [, options])
 * - afterName (String): new rule will be added after this one.
 * - ruleName (String): name of added rule.
 * - fn (Function): rule function.
 * - options (Object): rule options (not mandatory).
 *
 * Add new rule to chain after one with given name. See also
 * [[Ruler.before]], [[Ruler.push]].
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.inline.ruler.after('text', 'my_rule', function replace(state) {
 *   //...
 * });
 * ```
 **/
Ruler.prototype.after = function (afterName, ruleName, fn, options) {
  var index = this.__find__(afterName);
  var opt = options || {};

  if (index === -1) { throw new Error('Parser rule not found: ' + afterName); }

  this.__rules__.splice(index + 1, 0, {
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.__cache__ = null;
};

/**
 * Ruler.push(ruleName, fn [, options])
 * - ruleName (String): name of added rule.
 * - fn (Function): rule function.
 * - options (Object): rule options (not mandatory).
 *
 * Push new rule to the end of chain. See also
 * [[Ruler.before]], [[Ruler.after]].
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.core.ruler.push('my_rule', function replace(state) {
 *   //...
 * });
 * ```
 **/
Ruler.prototype.push = function (ruleName, fn, options) {
  var opt = options || {};

  this.__rules__.push({
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.__cache__ = null;
};


/**
 * Ruler.enable(list [, ignoreInvalid]) -> Array
 * - list (String|Array): list of rule names to enable.
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Enable rules with given names. If any rule name not found - throw Error.
 * Errors can be disabled by second param.
 *
 * Returns list of found rule names (if no exception happened).
 *
 * See also [[Ruler.disable]], [[Ruler.enableOnly]].
 **/
Ruler.prototype.enable = function (list, ignoreInvalid) {
  if (!Array.isArray(list)) { list = [ list ]; }

  var result = [];

  // Search by name and enable
  list.forEach(function (name) {
    var idx = this.__find__(name);

    if (idx < 0) {
      if (ignoreInvalid) { return; }
      throw new Error('Rules manager: invalid rule name ' + name);
    }
    this.__rules__[idx].enabled = true;
    result.push(name);
  }, this);

  this.__cache__ = null;
  return result;
};


/**
 * Ruler.enableOnly(list [, ignoreInvalid])
 * - list (String|Array): list of rule names to enable (whitelist).
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Enable rules with given names, and disable everything else. If any rule name
 * not found - throw Error. Errors can be disabled by second param.
 *
 * See also [[Ruler.disable]], [[Ruler.enable]].
 **/
Ruler.prototype.enableOnly = function (list, ignoreInvalid) {
  if (!Array.isArray(list)) { list = [ list ]; }

  this.__rules__.forEach(function (rule) { rule.enabled = false; });

  this.enable(list, ignoreInvalid);
};


/**
 * Ruler.disable(list [, ignoreInvalid]) -> Array
 * - list (String|Array): list of rule names to disable.
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Disable rules with given names. If any rule name not found - throw Error.
 * Errors can be disabled by second param.
 *
 * Returns list of found rule names (if no exception happened).
 *
 * See also [[Ruler.enable]], [[Ruler.enableOnly]].
 **/
Ruler.prototype.disable = function (list, ignoreInvalid) {
  if (!Array.isArray(list)) { list = [ list ]; }

  var result = [];

  // Search by name and disable
  list.forEach(function (name) {
    var idx = this.__find__(name);

    if (idx < 0) {
      if (ignoreInvalid) { return; }
      throw new Error('Rules manager: invalid rule name ' + name);
    }
    this.__rules__[idx].enabled = false;
    result.push(name);
  }, this);

  this.__cache__ = null;
  return result;
};


/**
 * Ruler.getRules(chainName) -> Array
 *
 * Return array of active functions (rules) for given chain name. It analyzes
 * rules configuration, compiles caches if not exists and returns result.
 *
 * Default chain name is `''` (empty string). It can't be skipped. That's
 * done intentionally, to keep signature monomorphic for high speed.
 **/
Ruler.prototype.getRules = function (chainName) {
  if (this.__cache__ === null) {
    this.__compile__();
  }

  // Chain can be empty, if rules disabled. But we still have to return Array.
  return this.__cache__[chainName] || [];
};

module.exports = Ruler;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Token class




/**
 * class Token
 **/

/**
 * new Token(type, tag, nesting)
 *
 * Create new token and fill passed properties.
 **/
function Token(type, tag, nesting) {
  /**
   * Token#type -> String
   *
   * Type of the token (string, e.g. "paragraph_open")
   **/
  this.type     = type;

  /**
   * Token#tag -> String
   *
   * html tag name, e.g. "p"
   **/
  this.tag      = tag;

  /**
   * Token#attrs -> Array
   *
   * Html attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
   **/
  this.attrs    = null;

  /**
   * Token#map -> Array
   *
   * Source map info. Format: `[ line_begin, line_end ]`
   **/
  this.map      = null;

  /**
   * Token#nesting -> Number
   *
   * Level change (number in {-1, 0, 1} set), where:
   *
   * -  `1` means the tag is opening
   * -  `0` means the tag is self-closing
   * - `-1` means the tag is closing
   **/
  this.nesting  = nesting;

  /**
   * Token#level -> Number
   *
   * nesting level, the same as `state.level`
   **/
  this.level    = 0;

  /**
   * Token#children -> Array
   *
   * An array of child nodes (inline and img tokens)
   **/
  this.children = null;

  /**
   * Token#content -> String
   *
   * In a case of self-closing tag (code, html, fence, etc.),
   * it has contents of this tag.
   **/
  this.content  = '';

  /**
   * Token#markup -> String
   *
   * '*' or '_' for emphasis, fence string for fence, etc.
   **/
  this.markup   = '';

  /**
   * Token#info -> String
   *
   * fence infostring
   **/
  this.info     = '';

  /**
   * Token#meta -> Object
   *
   * A place for plugins to store an arbitrary data
   **/
  this.meta     = null;

  /**
   * Token#block -> Boolean
   *
   * True for block-level tokens, false for inline tokens.
   * Used in renderer to calculate line breaks
   **/
  this.block    = false;

  /**
   * Token#hidden -> Boolean
   *
   * If it's true, ignore this element when rendering. Used for tight lists
   * to hide paragraphs.
   **/
  this.hidden   = false;
}


/**
 * Token.attrIndex(name) -> Number
 *
 * Search attribute index by name.
 **/
Token.prototype.attrIndex = function attrIndex(name) {
  var attrs, i, len;

  if (!this.attrs) { return -1; }

  attrs = this.attrs;

  for (i = 0, len = attrs.length; i < len; i++) {
    if (attrs[i][0] === name) { return i; }
  }
  return -1;
};


/**
 * Token.attrPush(attrData)
 *
 * Add `[ name, value ]` attribute to list. Init attrs if necessary
 **/
Token.prototype.attrPush = function attrPush(attrData) {
  if (this.attrs) {
    this.attrs.push(attrData);
  } else {
    this.attrs = [ attrData ];
  }
};


/**
 * Token.attrSet(name, value)
 *
 * Set `name` attribute to `value`. Override old value if exists.
 **/
Token.prototype.attrSet = function attrSet(name, value) {
  var idx = this.attrIndex(name),
      attrData = [ name, value ];

  if (idx < 0) {
    this.attrPush(attrData);
  } else {
    this.attrs[idx] = attrData;
  }
};


/**
 * Token.attrGet(name)
 *
 * Get the value of attribute `name`, or null if it does not exist.
 **/
Token.prototype.attrGet = function attrGet(name) {
  var idx = this.attrIndex(name), value = null;
  if (idx >= 0) {
    value = this.attrs[idx][1];
  }
  return value;
};


/**
 * Token.attrJoin(name, value)
 *
 * Join value to existing attribute via space. Or create new attribute if not
 * exists. Useful to operate with token classes.
 **/
Token.prototype.attrJoin = function attrJoin(name, value) {
  var idx = this.attrIndex(name);

  if (idx < 0) {
    this.attrPush([ name, value ]);
  } else {
    this.attrs[idx][1] = this.attrs[idx][1] + ' ' + value;
  }
};


module.exports = Token;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports=/[!-#%-\*,-/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E44\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD807[\uDC41-\uDC45\uDC70\uDC71]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(37),
  /* template */
  __webpack_require__(310),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(319)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(41),
  /* template */
  __webpack_require__(312),
  /* scopeId */
  "data-v-74c453ce",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Store */
/* unused harmony export mapState */
/* unused harmony export mapMutations */
/* unused harmony export mapGetters */
/* unused harmony export mapActions */
/**
 * vuex v2.3.0
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    var usesInit = Vue.config._lifecycleHooks.indexOf('init') > -1;
    Vue.mixin(usesInit ? { init: vuexInit } : { beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: {} };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  var this$1 = this;

  // register root module (Vuex.Store options)
  this.root = new Module(rawRootModule, false);

  // register all nested modules
  if (rawRootModule.modules) {
    forEachValue(rawRootModule.modules, function (rawModule, key) {
      this$1.register([key], rawModule, false);
    });
  }
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update(this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  var parent = this.get(path.slice(0, -1));
  var newModule = new Module(rawModule, runtime);
  parent.addChild(path[path.length - 1], newModule);

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (targetModule, newModule) {
  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        console.warn(
          "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
          'manual reload is needed'
        );
        return
      }
      update(targetModule.getChild(key), newModule.modules[key]);
    }
  }
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
  assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");

  var state = options.state; if ( state === void 0 ) state = {};
  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.concat(devtoolPlugin).forEach(function (plugin) { return plugin(this$1); });
};

var prototypeAccessors = { state: {} };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  assert(false, "Use store.replaceState() to explicit replace store state.");
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    console.error(("[vuex] unknown mutation type: " + type));
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (options && options.silent) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var entry = this._actions[type];
  if (!entry) {
    console.error(("[vuex] unknown action type: " + type));
    return
  }
  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  var subs = this._subscribers;
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  assert(typeof getter === 'function', "store.watch only accepts a function.");
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule) {
  if (typeof path === 'string') { path = [path]; }
  assert(Array.isArray(path), "module path must be a string or an Array.");
  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path));
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }
  assert(Array.isArray(path), "module path must be a string or an Array.");
  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var namespacedType = namespace + key;
    registerAction(store, namespacedType, action, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (!store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (!store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler(local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler({
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    console.error(("[vuex] duplicate getter key: " + type));
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue) {
    console.error(
      '[vuex] already installed. Vue.use(Vuex) should be called only once.'
    );
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

// auto install in dist mode
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (namespace && !getModuleByNamespace(this.$store, 'mapMutations', namespace)) {
        return
      }
      return this.$store.commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (!(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (namespace && !getModuleByNamespace(this.$store, 'mapActions', namespace)) {
        return
      }
      return this.$store.dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if (!module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '2.3.0',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions
};

/* harmony default export */ __webpack_exports__["a"] = (index_esm);


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// HTML5 entities map: { name -> utf16string }
//


/*eslint quotes:0*/
module.exports = __webpack_require__(55);


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Regexps to match html elements



var attr_name     = '[a-zA-Z_:][a-zA-Z0-9:._-]*';

var unquoted      = '[^"\'=<>`\\x00-\\x20]+';
var single_quoted = "'[^']*'";
var double_quoted = '"[^"]*"';

var attr_value  = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';

var attribute   = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + attr_value + ')?)';

var open_tag    = '<[A-Za-z][A-Za-z0-9\\-]*' + attribute + '*\\s*\\/?>';

var close_tag   = '<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>';
var comment     = '<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->';
var processing  = '<[?].*?[?]>';
var declaration = '<![A-Z]+\\s+[^>]*>';
var cdata       = '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>';

var HTML_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + '|' + comment +
                        '|' + processing + '|' + declaration + '|' + cdata + ')');
var HTML_OPEN_CLOSE_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + ')');

module.exports.HTML_TAG_RE = HTML_TAG_RE;
module.exports.HTML_OPEN_CLOSE_TAG_RE = HTML_OPEN_CLOSE_TAG_RE;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process *this* and _that_
//



// Insert each marker as a separate text token, and add it to delimiter list
//
module.exports.tokenize = function emphasis(state, silent) {
  var i, scanned, token,
      start = state.pos,
      marker = state.src.charCodeAt(start);

  if (silent) { return false; }

  if (marker !== 0x5F /* _ */ && marker !== 0x2A /* * */) { return false; }

  scanned = state.scanDelims(state.pos, marker === 0x2A);

  for (i = 0; i < scanned.length; i++) {
    token         = state.push('text', '', 0);
    token.content = String.fromCharCode(marker);

    state.delimiters.push({
      // Char code of the starting marker (number).
      //
      marker: marker,

      // Total length of these series of delimiters.
      //
      length: scanned.length,

      // An amount of characters before this one that's equivalent to
      // current one. In plain English: if this delimiter does not open
      // an emphasis, neither do previous `jump` characters.
      //
      // Used to skip sequences like "*****" in one step, for 1st asterisk
      // value will be 0, for 2nd it's 1 and so on.
      //
      jump:   i,

      // A position of the token this delimiter corresponds to.
      //
      token:  state.tokens.length - 1,

      // Token level.
      //
      level:  state.level,

      // If this delimiter is matched as a valid opener, `end` will be
      // equal to its position, otherwise it's `-1`.
      //
      end:    -1,

      // Boolean flags that determine if this delimiter could open or close
      // an emphasis.
      //
      open:   scanned.can_open,
      close:  scanned.can_close
    });
  }

  state.pos += scanned.length;

  return true;
};


// Walk through delimiter list and replace text tokens with tags
//
module.exports.postProcess = function emphasis(state) {
  var i,
      startDelim,
      endDelim,
      token,
      ch,
      isStrong,
      delimiters = state.delimiters,
      max = state.delimiters.length;

  for (i = 0; i < max; i++) {
    startDelim = delimiters[i];

    if (startDelim.marker !== 0x5F/* _ */ && startDelim.marker !== 0x2A/* * */) {
      continue;
    }

    // Process only opening markers
    if (startDelim.end === -1) {
      continue;
    }

    endDelim = delimiters[startDelim.end];

    // If the next delimiter has the same marker and is adjacent to this one,
    // merge those into one strong delimiter.
    //
    // `<em><em>whatever</em></em>` -> `<strong>whatever</strong>`
    //
    isStrong = i + 1 < max &&
               delimiters[i + 1].end === startDelim.end - 1 &&
               delimiters[i + 1].token === startDelim.token + 1 &&
               delimiters[startDelim.end - 1].token === endDelim.token - 1 &&
               delimiters[i + 1].marker === startDelim.marker;

    ch = String.fromCharCode(startDelim.marker);

    token         = state.tokens[startDelim.token];
    token.type    = isStrong ? 'strong_open' : 'em_open';
    token.tag     = isStrong ? 'strong' : 'em';
    token.nesting = 1;
    token.markup  = isStrong ? ch + ch : ch;
    token.content = '';

    token         = state.tokens[endDelim.token];
    token.type    = isStrong ? 'strong_close' : 'em_close';
    token.tag     = isStrong ? 'strong' : 'em';
    token.nesting = -1;
    token.markup  = isStrong ? ch + ch : ch;
    token.content = '';

    if (isStrong) {
      state.tokens[delimiters[i + 1].token].content = '';
      state.tokens[delimiters[startDelim.end - 1].token].content = '';
      i++;
    }
  }
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// ~~strike through~~
//



// Insert each marker as a separate text token, and add it to delimiter list
//
module.exports.tokenize = function strikethrough(state, silent) {
  var i, scanned, token, len, ch,
      start = state.pos,
      marker = state.src.charCodeAt(start);

  if (silent) { return false; }

  if (marker !== 0x7E/* ~ */) { return false; }

  scanned = state.scanDelims(state.pos, true);
  len = scanned.length;
  ch = String.fromCharCode(marker);

  if (len < 2) { return false; }

  if (len % 2) {
    token         = state.push('text', '', 0);
    token.content = ch;
    len--;
  }

  for (i = 0; i < len; i += 2) {
    token         = state.push('text', '', 0);
    token.content = ch + ch;

    state.delimiters.push({
      marker: marker,
      jump:   i,
      token:  state.tokens.length - 1,
      level:  state.level,
      end:    -1,
      open:   scanned.can_open,
      close:  scanned.can_close
    });
  }

  state.pos += scanned.length;

  return true;
};


// Walk through delimiter list and replace text tokens with tags
//
module.exports.postProcess = function strikethrough(state) {
  var i, j,
      startDelim,
      endDelim,
      token,
      loneMarkers = [],
      delimiters = state.delimiters,
      max = state.delimiters.length;

  for (i = 0; i < max; i++) {
    startDelim = delimiters[i];

    if (startDelim.marker !== 0x7E/* ~ */) {
      continue;
    }

    if (startDelim.end === -1) {
      continue;
    }

    endDelim = delimiters[startDelim.end];

    token         = state.tokens[startDelim.token];
    token.type    = 's_open';
    token.tag     = 's';
    token.nesting = 1;
    token.markup  = '~~';
    token.content = '';

    token         = state.tokens[endDelim.token];
    token.type    = 's_close';
    token.tag     = 's';
    token.nesting = -1;
    token.markup  = '~~';
    token.content = '';

    if (state.tokens[endDelim.token - 1].type === 'text' &&
        state.tokens[endDelim.token - 1].content === '~') {

      loneMarkers.push(endDelim.token - 1);
    }
  }

  // If a marker sequence has an odd number of characters, it's splitted
  // like this: `~~~~~` -> `~` + `~~` + `~~`, leaving one marker at the
  // start of the sequence.
  //
  // So, we have to move all those markers after subsequent s_close tags.
  //
  while (loneMarkers.length) {
    i = loneMarkers.pop();
    j = i + 1;

    while (j < state.tokens.length && state.tokens[j].type === 's_close') {
      j++;
    }

    j--;

    if (i !== j) {
      token = state.tokens[j];
      state.tokens[j] = state.tokens[i];
      state.tokens[i] = token;
    }
  }
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



module.exports.encode = __webpack_require__(284);
module.exports.decode = __webpack_require__(283);
module.exports.format = __webpack_require__(285);
module.exports.parse  = __webpack_require__(286);


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "# Uh oh\n\nYou seemed to have disrupted the delicate internal balance of my housekeeper by reaching this page."

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports=/[\0-\x1F\x7F-\x9F]/

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports=/[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/

/***/ }),
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(45);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(6)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./app.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./app.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(320)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(35),
  /* template */
  __webpack_require__(313),
  /* scopeId */
  "data-v-78c4b035",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
  * vue-router v2.5.3
  * (c) 2017 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (false) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

var View = {
  name: 'router-view',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also regiseter instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    data.props = resolveProps(route, matched.props && matched.props[name]);

    return h(component, data, children)
  }
};

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (false) {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    "production" !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    var val = extraQuery[key];
    parsedQuery[key] = Array.isArray(val) ? val.slice() : val;
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.slice().forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */


var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;
  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: location.query || {},
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) { return String(a[key]) === String(b[key]); })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'router-link',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
            ? 'router-link-active'
            : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
            ? 'router-link-exact-active'
            : globalExactActiveClass;
    var activeClass = this.activeClass == null
            ? activeClassFallback
            : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
            ? exactActiveClassFallback
            : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var extend = _Vue.util.extend;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
};

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed) { return }
  install.installed = true;

  _Vue = Vue;

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this.$root._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this.$root._route }
  });

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var index$1 = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var index = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (index$1(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (index$1(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

index.parse = parse_1;
index.compile = compile_1;
index.tokensToFunction = tokensToFunction_1;
index.tokensToRegExp = tokensToRegExp_1;

/*  */

var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = index.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (false) {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  var pathMap = oldPathMap || Object.create(null);
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (false) {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var normalizedPath = normalizePath(path, parent);
  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (false) {
      if (route.name && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    if (Array.isArray(route.alias)) {
      route.alias.forEach(function (alias) {
        var aliasRoute = {
          path: alias,
          children: route.children
        };
        addRouteRecord(pathList, pathMap, nameMap, aliasRoute, parent, record.path);
      });
    } else {
      var aliasRoute = {
        path: route.alias,
        children: route.children
      };
      addRouteRecord(pathList, pathMap, nameMap, aliasRoute, parent, record.path);
    }
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (false) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path) {
  var regex = index(path);
  if (false) {
    var keys = {};
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent) {
  path = path.replace(/\/$/, '');
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */


function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = assign({}, next);
    next._normalized = true;
    var params = assign(assign({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (false) {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

function assign (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

/*  */


function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (false) {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
        ? originalRedirect(createRoute(record, location, null, router))
        : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (false) {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (false) {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (false) {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      params[key.name] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */


var positionStore = Object.create(null);

function setupScroll () {
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (false) {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior(to, from, isPop ? position : null);
    if (!shouldScroll) {
      return
    }
    var isObject = typeof shouldScroll === 'object';
    if (isObject && typeof shouldScroll.selector === 'string') {
      var el = document.querySelector(shouldScroll.selector);
      if (el) {
        position = getElementPosition(el);
      } else if (isValidPosition(shouldScroll)) {
        position = normalizePosition(shouldScroll);
      }
    } else if (isObject && isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }

    if (position) {
      window.scrollTo(position.x, position.y);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left,
    y: elRect.top - docRect.top
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (instances[key]) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          "production" !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    if (called) { return }
    called = true;
    return fn.apply(this, arguments)
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

/*  */


var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;

    if (expectScroll) {
      setupScroll();
    }

    window.addEventListener('popstate', function (e) {
      this$1.transitionTo(getLocation(this$1.base), function (route) {
        if (expectScroll) {
          handleScroll(router, route, this$1.current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = window.location.pathname;
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */


var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    window.addEventListener('hashchange', function () {
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        replaceHash(route.fullPath);
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : href.slice(index + 1)
}

function pushHash (path) {
  window.location.hash = path;
}

function replaceHash (path) {
  var i = window.location.href.indexOf('#');
  window.location.replace(
    window.location.href.slice(0, i >= 0 ? i : 0) + '#' + path
  );
}

/*  */


var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */

var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (false) {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: {} };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  "production" !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '2.5.3';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["a"] = (VueRouter);


/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(16);


const manifest = __webpack_require__(3)

const bootstrap = __webpack_require__(9)
const articles = bootstrap.slug
const searchArticles = bootstrap.search
const localizations = bootstrap.localization
const logo = bootstrap.sidebar

__WEBPACK_IMPORTED_MODULE_0_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* default */])

const store = new __WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* default */].Store({
    state: {
        app: manifest.app,
        description: manifest.description,
        sub: manifest.sub,
        logo,
        localizations,

        articles,

        query: "",
        searchArticles,
        searchResults: []
    },

    mutations: {
        searchResults(state, payload) {
            state.searchResults = payload.searchResults
        },

        resetSearchResults(state) {
            state.searchResults = []
        },

        updateQuery(state, payload) {
            state.query = payload.query
        },

        resetQuery(state) {
            state.query = ""
        }
    },

    actions: {
        /**
         * Reset search results and search query.
         *
         * @param commit
         */
        resetSearch({ commit }) {
            commit('resetSearchResults')
            commit('resetQuery')
        }
    }
})

/* harmony default export */ __webpack_exports__["a"] = (store);

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./amblin.scss": 294,
	"./default.scss": 295,
	"./github.scss": 296
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 33;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./404.md": 22,
	"./getting-started-about-buk.md": 288,
	"./getting-started-quickstart.md": 289,
	"./getting-started-references.md": 290,
	"./index.md": 291,
	"./usage-manifest.json.md": 292
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 34;

/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: 'app',

    data: function data() {
        return {
            isFullScreen: false
        };
    },


    components: {
        fab: __webpack_require__(300),
        sidebar: __webpack_require__(305),
        articleContainer: __webpack_require__(13),
        navigation: __webpack_require__(302)
    },

    mounted: function mounted() {
        /**
         * Initialize mobile menu trigger.
         *
         */
        $(".button-collapse").sideNav({
            draggable: true
        });

        /**
         * Initialize tooltip.
         *
         */
        $('.tooltipped').tooltip({ delay: 50 });
    }
});

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        searchResults: __webpack_require__(14)
    },

    mounted: function mounted() {
        // Clear up search every time we load a new article.
        this.$store.dispatch('resetSearch');
    }
});

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    name: 'article-container',

    components: {
        searchResults: __webpack_require__(14)
    },

    data: function data() {
        return {
            file: ""
        };
    },


    // We need to watch route and re-render since every page loads a different .md file.
    watch: {
        '$route': 'requiring'
    },

    mounted: function mounted() {
        this.requiring();
    },


    methods: {
        requiring: function requiring() {
            // Initialize our markdown parser.
            var md = __webpack_require__(9).render;

            // Clear up the viewport.
            this.$store.dispatch('resetSearch');

            // Go on top of viewport.
            window.scrollTo(0, 0);

            // Load the relevant md.
            try {
                this.file = md.render(__webpack_require__(34)("./" + this.$route.params.article + '.md'));
            } catch (e) {
                this.file = md.render(__webpack_require__(22));
            }
        }
    }
});

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    methods: {
        /**
         * Toggle full screen.
         */
        toggleFullScreen: function toggleFullScreen() {
            this.isFullScreen = !this.isFullScreen;

            // This is not data driven. It's gross.
            switch (this.isFullScreen) {
                case true:
                    $('#nav-mobile').css('transform', 'translateX(-300px)');
                    $("main").css("margin-left", 0);
                    break;
                default:
                    $('#nav-mobile').css('transform', 'translateX(0px)');
                    $("main").css("margin-left", 300);
            }
        }
    }
});

/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['link', 'action'],

    computed: {
        /**
         * Returns the position of the navigator (left / right)
         *
         * @returns {{btn-navigator-left: boolean, btn-navigator-right: boolean}}
         */
        position: function position() {
            return {
                "btn-navigator-left": this.action === 'previous',
                "btn-navigator-right": this.action === 'next'
            };
        }
    }
});

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//

var _ = window._;

/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        articleNavigator: __webpack_require__(301)
    },

    watch: {
        // We need to watch $route so we can render the right arrows every time we switch articles.
        '$route': 'getArticlePosition'
    },

    computed: {
        /**
         * Returns the previous article slug.
         *
         * @returns {boolean|number}
         * */
        getPreviousArticle: function getPreviousArticle() {
            if (this.getArticlePosition() <= 0) {
                return false;
            } else return this.$store.state.searchArticles[this.getArticlePosition() - 1].slug;
        },


        /**
         * Returns the next article slug.
         *
         * @returns {boolean|number}
         * */
        getNextArticle: function getNextArticle() {
            if (this.getArticlePosition() === this.$store.state.searchArticles.length - 1) {
                return false;
            } else return this.$store.state.searchArticles[this.getArticlePosition() + 1].slug;
        },


        /**
         * Determine if we are on mobile.
         *
         * @returns {boolean}
         * */
        isMobile: function isMobile() {
            return window.innerWidth < 993;
        }
    },

    methods: {
        /**
         * Returns the index of the current article viewed from our flatten articles array.
         *
         * NOTES: This won't work as intended if there are duplicate articles with the same slug since
         * we trim duplicate articles based on slug uniqueness.
         *
         * @returns {number|boolean}
         */
        getArticlePosition: function getArticlePosition() {
            // Get the article slug.
            var current = this.$route.fullPath.substr(1);

            // Return where we are in a flat array of articles.
            return _.findIndex(this.$store.state.searchArticles, function (article) {
                return article.slug === current;
            });
        }
    }
});

/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['q'],

    methods: {
        clearSearch: function clearSearch() {
            this.$emit('update:q', "");
            this.$store.dispatch('resetSearch');
        }
    }
});

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var _ = window._;
var Fuse = __webpack_require__(56);

/* harmony default export */ __webpack_exports__["default"] = ({
    components: {
        searchResults: __webpack_require__(14)
    },

    data: function data() {
        return {
            q: "",
            searchedArticles: [],
            isDebouncing: false,
            fuse: null,
            isFocused: false
        };
    },
    mounted: function mounted() {
        this.initSearch();
    },


    watch: {
        q: function q() {
            this.searchResults();
        }
    },

    methods: {
        /**
         * Initialize our search feature.
         *
         */
        initSearch: function initSearch() {
            var options = {
                keys: [{
                    name: 'tags',
                    weight: 0.8
                }, {
                    name: 'title',
                    weight: 0.1
                }, {
                    name: 'slug',
                    weight: 0.1
                }],
                threshold: 0.5
            };

            this.fuse = new Fuse(this.$store.state.searchArticles, options);
        },


        /**
         * Perform the search.
         *
         */
        searchResults: _.debounce(function () {
            if (this.q === "") {
                this.$store.commit({
                    type: 'searchResults',
                    searchResults: []
                });
            }

            // Sync our query with the store query so that we can display/hide search module.
            this.$store.commit({
                type: 'updateQuery',
                query: this.q
            });

            // Fetch store results array.
            this.$store.commit({
                type: 'searchResults',
                searchResults: this.fuse.search(this.q)
            });

            this.isDebouncing = !this.isDebouncing;
        }, 250)
    }
});

/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
    props: ['articles', 'category'],

    methods: {
        isDeep: function isDeep(array) {
            return _.isArray(array);
        }
    },

    name: "sidebar-item"
});

/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var Vue = __webpack_require__(8);

/* harmony default export */ __webpack_exports__["default"] = ({
    name: 'sidebar',

    components: {
        search: __webpack_require__(303),
        'sidebar-item': __webpack_require__(304)
    },

    mounted: function mounted() {
        Vue.nextTick(function () {
            $('.collapsible').collapsible({
                accordion: false
            });
        });
    }
});

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Lato);", ""]);
exports.push([module.i, "@import url(http://fonts.googleapis.com/icon?family=Material+Icons);", ""]);

// module
exports.push([module.i, ".materialize-red{background-color:#e51c23!important}.materialize-red-text{color:#e51c23!important}.materialize-red.lighten-5{background-color:#fdeaeb!important}.materialize-red-text.text-lighten-5{color:#fdeaeb!important}.materialize-red.lighten-4{background-color:#f8c1c3!important}.materialize-red-text.text-lighten-4{color:#f8c1c3!important}.materialize-red.lighten-3{background-color:#f3989b!important}.materialize-red-text.text-lighten-3{color:#f3989b!important}.materialize-red.lighten-2{background-color:#ee6e73!important}.materialize-red-text.text-lighten-2{color:#ee6e73!important}.materialize-red.lighten-1{background-color:#ea454b!important}.materialize-red-text.text-lighten-1{color:#ea454b!important}.materialize-red.darken-1{background-color:#d0181e!important}.materialize-red-text.text-darken-1{color:#d0181e!important}.materialize-red.darken-2{background-color:#b9151b!important}.materialize-red-text.text-darken-2{color:#b9151b!important}.materialize-red.darken-3{background-color:#a21318!important}.materialize-red-text.text-darken-3{color:#a21318!important}.materialize-red.darken-4{background-color:#8b1014!important}.materialize-red-text.text-darken-4{color:#8b1014!important}.red{background-color:#f44336!important}.red-text{color:#f44336!important}.red.lighten-5{background-color:#ffebee!important}.red-text.text-lighten-5{color:#ffebee!important}.red.lighten-4{background-color:#ffcdd2!important}.red-text.text-lighten-4{color:#ffcdd2!important}.red.lighten-3{background-color:#ef9a9a!important}.red-text.text-lighten-3{color:#ef9a9a!important}.red.lighten-2{background-color:#e57373!important}.red-text.text-lighten-2{color:#e57373!important}.red.lighten-1{background-color:#ef5350!important}.red-text.text-lighten-1{color:#ef5350!important}.red.darken-1{background-color:#e53935!important}.red-text.text-darken-1{color:#e53935!important}.red.darken-2{background-color:#d32f2f!important}.red-text.text-darken-2{color:#d32f2f!important}.red.darken-3{background-color:#c62828!important}.red-text.text-darken-3{color:#c62828!important}.red.darken-4{background-color:#b71c1c!important}.red-text.text-darken-4{color:#b71c1c!important}.red.accent-1{background-color:#ff8a80!important}.red-text.text-accent-1{color:#ff8a80!important}.red.accent-2{background-color:#ff5252!important}.red-text.text-accent-2{color:#ff5252!important}.red.accent-3{background-color:#ff1744!important}.red-text.text-accent-3{color:#ff1744!important}.red.accent-4{background-color:#d50000!important}.red-text.text-accent-4{color:#d50000!important}.pink{background-color:#e91e63!important}.pink-text{color:#e91e63!important}.pink.lighten-5{background-color:#fce4ec!important}.pink-text.text-lighten-5{color:#fce4ec!important}.pink.lighten-4{background-color:#f8bbd0!important}.pink-text.text-lighten-4{color:#f8bbd0!important}.pink.lighten-3{background-color:#f48fb1!important}.pink-text.text-lighten-3{color:#f48fb1!important}.pink.lighten-2{background-color:#f06292!important}.pink-text.text-lighten-2{color:#f06292!important}.pink.lighten-1{background-color:#ec407a!important}.pink-text.text-lighten-1{color:#ec407a!important}.pink.darken-1{background-color:#d81b60!important}.pink-text.text-darken-1{color:#d81b60!important}.pink.darken-2{background-color:#c2185b!important}.pink-text.text-darken-2{color:#c2185b!important}.pink.darken-3{background-color:#ad1457!important}.pink-text.text-darken-3{color:#ad1457!important}.pink.darken-4{background-color:#880e4f!important}.pink-text.text-darken-4{color:#880e4f!important}.pink.accent-1{background-color:#ff80ab!important}.pink-text.text-accent-1{color:#ff80ab!important}.pink.accent-2{background-color:#ff4081!important}.pink-text.text-accent-2{color:#ff4081!important}.pink.accent-3{background-color:#f50057!important}.pink-text.text-accent-3{color:#f50057!important}.pink.accent-4{background-color:#c51162!important}.pink-text.text-accent-4{color:#c51162!important}.purple{background-color:#9c27b0!important}.purple-text{color:#9c27b0!important}.purple.lighten-5{background-color:#f3e5f5!important}.purple-text.text-lighten-5{color:#f3e5f5!important}.purple.lighten-4{background-color:#e1bee7!important}.purple-text.text-lighten-4{color:#e1bee7!important}.purple.lighten-3{background-color:#ce93d8!important}.purple-text.text-lighten-3{color:#ce93d8!important}.purple.lighten-2{background-color:#ba68c8!important}.purple-text.text-lighten-2{color:#ba68c8!important}.purple.lighten-1{background-color:#ab47bc!important}.purple-text.text-lighten-1{color:#ab47bc!important}.purple.darken-1{background-color:#8e24aa!important}.purple-text.text-darken-1{color:#8e24aa!important}.purple.darken-2{background-color:#7b1fa2!important}.purple-text.text-darken-2{color:#7b1fa2!important}.purple.darken-3{background-color:#6a1b9a!important}.purple-text.text-darken-3{color:#6a1b9a!important}.purple.darken-4{background-color:#4a148c!important}.purple-text.text-darken-4{color:#4a148c!important}.purple.accent-1{background-color:#ea80fc!important}.purple-text.text-accent-1{color:#ea80fc!important}.purple.accent-2{background-color:#e040fb!important}.purple-text.text-accent-2{color:#e040fb!important}.purple.accent-3{background-color:#d500f9!important}.purple-text.text-accent-3{color:#d500f9!important}.purple.accent-4{background-color:#a0f!important}.purple-text.text-accent-4{color:#a0f!important}.deep-purple{background-color:#673ab7!important}.deep-purple-text{color:#673ab7!important}.deep-purple.lighten-5{background-color:#ede7f6!important}.deep-purple-text.text-lighten-5{color:#ede7f6!important}.deep-purple.lighten-4{background-color:#d1c4e9!important}.deep-purple-text.text-lighten-4{color:#d1c4e9!important}.deep-purple.lighten-3{background-color:#b39ddb!important}.deep-purple-text.text-lighten-3{color:#b39ddb!important}.deep-purple.lighten-2{background-color:#9575cd!important}.deep-purple-text.text-lighten-2{color:#9575cd!important}.deep-purple.lighten-1{background-color:#7e57c2!important}.deep-purple-text.text-lighten-1{color:#7e57c2!important}.deep-purple.darken-1{background-color:#5e35b1!important}.deep-purple-text.text-darken-1{color:#5e35b1!important}.deep-purple.darken-2{background-color:#512da8!important}.deep-purple-text.text-darken-2{color:#512da8!important}.deep-purple.darken-3{background-color:#4527a0!important}.deep-purple-text.text-darken-3{color:#4527a0!important}.deep-purple.darken-4{background-color:#311b92!important}.deep-purple-text.text-darken-4{color:#311b92!important}.deep-purple.accent-1{background-color:#b388ff!important}.deep-purple-text.text-accent-1{color:#b388ff!important}.deep-purple.accent-2{background-color:#7c4dff!important}.deep-purple-text.text-accent-2{color:#7c4dff!important}.deep-purple.accent-3{background-color:#651fff!important}.deep-purple-text.text-accent-3{color:#651fff!important}.deep-purple.accent-4{background-color:#6200ea!important}.deep-purple-text.text-accent-4{color:#6200ea!important}.indigo{background-color:#3f51b5!important}.indigo-text{color:#3f51b5!important}.indigo.lighten-5{background-color:#e8eaf6!important}.indigo-text.text-lighten-5{color:#e8eaf6!important}.indigo.lighten-4{background-color:#c5cae9!important}.indigo-text.text-lighten-4{color:#c5cae9!important}.indigo.lighten-3{background-color:#9fa8da!important}.indigo-text.text-lighten-3{color:#9fa8da!important}.indigo.lighten-2{background-color:#7986cb!important}.indigo-text.text-lighten-2{color:#7986cb!important}.indigo.lighten-1{background-color:#5c6bc0!important}.indigo-text.text-lighten-1{color:#5c6bc0!important}.indigo.darken-1{background-color:#3949ab!important}.indigo-text.text-darken-1{color:#3949ab!important}.indigo.darken-2{background-color:#303f9f!important}.indigo-text.text-darken-2{color:#303f9f!important}.indigo.darken-3{background-color:#283593!important}.indigo-text.text-darken-3{color:#283593!important}.indigo.darken-4{background-color:#1a237e!important}.indigo-text.text-darken-4{color:#1a237e!important}.indigo.accent-1{background-color:#8c9eff!important}.indigo-text.text-accent-1{color:#8c9eff!important}.indigo.accent-2{background-color:#536dfe!important}.indigo-text.text-accent-2{color:#536dfe!important}.indigo.accent-3{background-color:#3d5afe!important}.indigo-text.text-accent-3{color:#3d5afe!important}.indigo.accent-4{background-color:#304ffe!important}.indigo-text.text-accent-4{color:#304ffe!important}.blue{background-color:#2196f3!important}.blue-text{color:#2196f3!important}.blue.lighten-5{background-color:#e3f2fd!important}.blue-text.text-lighten-5{color:#e3f2fd!important}.blue.lighten-4{background-color:#bbdefb!important}.blue-text.text-lighten-4{color:#bbdefb!important}.blue.lighten-3{background-color:#90caf9!important}.blue-text.text-lighten-3{color:#90caf9!important}.blue.lighten-2{background-color:#64b5f6!important}.blue-text.text-lighten-2{color:#64b5f6!important}.blue.lighten-1{background-color:#42a5f5!important}.blue-text.text-lighten-1{color:#42a5f5!important}.blue.darken-1{background-color:#1e88e5!important}.blue-text.text-darken-1{color:#1e88e5!important}.blue.darken-2{background-color:#1976d2!important}.blue-text.text-darken-2{color:#1976d2!important}.blue.darken-3{background-color:#1565c0!important}.blue-text.text-darken-3{color:#1565c0!important}.blue.darken-4{background-color:#0d47a1!important}.blue-text.text-darken-4{color:#0d47a1!important}.blue.accent-1{background-color:#82b1ff!important}.blue-text.text-accent-1{color:#82b1ff!important}.blue.accent-2{background-color:#448aff!important}.blue-text.text-accent-2{color:#448aff!important}.blue.accent-3{background-color:#2979ff!important}.blue-text.text-accent-3{color:#2979ff!important}.blue.accent-4{background-color:#2962ff!important}.blue-text.text-accent-4{color:#2962ff!important}.light-blue{background-color:#03a9f4!important}.light-blue-text{color:#03a9f4!important}.light-blue.lighten-5{background-color:#e1f5fe!important}.light-blue-text.text-lighten-5{color:#e1f5fe!important}.light-blue.lighten-4{background-color:#b3e5fc!important}.light-blue-text.text-lighten-4{color:#b3e5fc!important}.light-blue.lighten-3{background-color:#81d4fa!important}.light-blue-text.text-lighten-3{color:#81d4fa!important}.light-blue.lighten-2{background-color:#4fc3f7!important}.light-blue-text.text-lighten-2{color:#4fc3f7!important}.light-blue.lighten-1{background-color:#29b6f6!important}.light-blue-text.text-lighten-1{color:#29b6f6!important}.light-blue.darken-1{background-color:#039be5!important}.light-blue-text.text-darken-1{color:#039be5!important}.light-blue.darken-2{background-color:#0288d1!important}.light-blue-text.text-darken-2{color:#0288d1!important}.light-blue.darken-3{background-color:#0277bd!important}.light-blue-text.text-darken-3{color:#0277bd!important}.light-blue.darken-4{background-color:#01579b!important}.light-blue-text.text-darken-4{color:#01579b!important}.light-blue.accent-1{background-color:#80d8ff!important}.light-blue-text.text-accent-1{color:#80d8ff!important}.light-blue.accent-2{background-color:#40c4ff!important}.light-blue-text.text-accent-2{color:#40c4ff!important}.light-blue.accent-3{background-color:#00b0ff!important}.light-blue-text.text-accent-3{color:#00b0ff!important}.light-blue.accent-4{background-color:#0091ea!important}.light-blue-text.text-accent-4{color:#0091ea!important}.cyan{background-color:#00bcd4!important}.cyan-text{color:#00bcd4!important}.cyan.lighten-5{background-color:#e0f7fa!important}.cyan-text.text-lighten-5{color:#e0f7fa!important}.cyan.lighten-4{background-color:#b2ebf2!important}.cyan-text.text-lighten-4{color:#b2ebf2!important}.cyan.lighten-3{background-color:#80deea!important}.cyan-text.text-lighten-3{color:#80deea!important}.cyan.lighten-2{background-color:#4dd0e1!important}.cyan-text.text-lighten-2{color:#4dd0e1!important}.cyan.lighten-1{background-color:#26c6da!important}.cyan-text.text-lighten-1{color:#26c6da!important}.cyan.darken-1{background-color:#00acc1!important}.cyan-text.text-darken-1{color:#00acc1!important}.cyan.darken-2{background-color:#0097a7!important}.cyan-text.text-darken-2{color:#0097a7!important}.cyan.darken-3{background-color:#00838f!important}.cyan-text.text-darken-3{color:#00838f!important}.cyan.darken-4{background-color:#006064!important}.cyan-text.text-darken-4{color:#006064!important}.cyan.accent-1{background-color:#84ffff!important}.cyan-text.text-accent-1{color:#84ffff!important}.cyan.accent-2{background-color:#18ffff!important}.cyan-text.text-accent-2{color:#18ffff!important}.cyan.accent-3{background-color:#00e5ff!important}.cyan-text.text-accent-3{color:#00e5ff!important}.cyan.accent-4{background-color:#00b8d4!important}.cyan-text.text-accent-4{color:#00b8d4!important}.teal{background-color:#009688!important}.teal-text{color:#009688!important}.teal.lighten-5{background-color:#e0f2f1!important}.teal-text.text-lighten-5{color:#e0f2f1!important}.teal.lighten-4{background-color:#b2dfdb!important}.teal-text.text-lighten-4{color:#b2dfdb!important}.teal.lighten-3{background-color:#80cbc4!important}.teal-text.text-lighten-3{color:#80cbc4!important}.teal.lighten-2{background-color:#4db6ac!important}.teal-text.text-lighten-2{color:#4db6ac!important}.teal.lighten-1{background-color:#26a69a!important}.teal-text.text-lighten-1{color:#26a69a!important}.teal.darken-1{background-color:#00897b!important}.teal-text.text-darken-1{color:#00897b!important}.teal.darken-2{background-color:#00796b!important}.teal-text.text-darken-2{color:#00796b!important}.teal.darken-3{background-color:#00695c!important}.teal-text.text-darken-3{color:#00695c!important}.teal.darken-4{background-color:#004d40!important}.teal-text.text-darken-4{color:#004d40!important}.teal.accent-1{background-color:#a7ffeb!important}.teal-text.text-accent-1{color:#a7ffeb!important}.teal.accent-2{background-color:#64ffda!important}.teal-text.text-accent-2{color:#64ffda!important}.teal.accent-3{background-color:#1de9b6!important}.teal-text.text-accent-3{color:#1de9b6!important}.teal.accent-4{background-color:#00bfa5!important}.teal-text.text-accent-4{color:#00bfa5!important}.green{background-color:#4caf50!important}.green-text{color:#4caf50!important}.green.lighten-5{background-color:#e8f5e9!important}.green-text.text-lighten-5{color:#e8f5e9!important}.green.lighten-4{background-color:#c8e6c9!important}.green-text.text-lighten-4{color:#c8e6c9!important}.green.lighten-3{background-color:#a5d6a7!important}.green-text.text-lighten-3{color:#a5d6a7!important}.green.lighten-2{background-color:#81c784!important}.green-text.text-lighten-2{color:#81c784!important}.green.lighten-1{background-color:#66bb6a!important}.green-text.text-lighten-1{color:#66bb6a!important}.green.darken-1{background-color:#43a047!important}.green-text.text-darken-1{color:#43a047!important}.green.darken-2{background-color:#388e3c!important}.green-text.text-darken-2{color:#388e3c!important}.green.darken-3{background-color:#2e7d32!important}.green-text.text-darken-3{color:#2e7d32!important}.green.darken-4{background-color:#1b5e20!important}.green-text.text-darken-4{color:#1b5e20!important}.green.accent-1{background-color:#b9f6ca!important}.green-text.text-accent-1{color:#b9f6ca!important}.green.accent-2{background-color:#69f0ae!important}.green-text.text-accent-2{color:#69f0ae!important}.green.accent-3{background-color:#00e676!important}.green-text.text-accent-3{color:#00e676!important}.green.accent-4{background-color:#00c853!important}.green-text.text-accent-4{color:#00c853!important}.light-green{background-color:#8bc34a!important}.light-green-text{color:#8bc34a!important}.light-green.lighten-5{background-color:#f1f8e9!important}.light-green-text.text-lighten-5{color:#f1f8e9!important}.light-green.lighten-4{background-color:#dcedc8!important}.light-green-text.text-lighten-4{color:#dcedc8!important}.light-green.lighten-3{background-color:#c5e1a5!important}.light-green-text.text-lighten-3{color:#c5e1a5!important}.light-green.lighten-2{background-color:#aed581!important}.light-green-text.text-lighten-2{color:#aed581!important}.light-green.lighten-1{background-color:#9ccc65!important}.light-green-text.text-lighten-1{color:#9ccc65!important}.light-green.darken-1{background-color:#7cb342!important}.light-green-text.text-darken-1{color:#7cb342!important}.light-green.darken-2{background-color:#689f38!important}.light-green-text.text-darken-2{color:#689f38!important}.light-green.darken-3{background-color:#558b2f!important}.light-green-text.text-darken-3{color:#558b2f!important}.light-green.darken-4{background-color:#33691e!important}.light-green-text.text-darken-4{color:#33691e!important}.light-green.accent-1{background-color:#ccff90!important}.light-green-text.text-accent-1{color:#ccff90!important}.light-green.accent-2{background-color:#b2ff59!important}.light-green-text.text-accent-2{color:#b2ff59!important}.light-green.accent-3{background-color:#76ff03!important}.light-green-text.text-accent-3{color:#76ff03!important}.light-green.accent-4{background-color:#64dd17!important}.light-green-text.text-accent-4{color:#64dd17!important}.lime{background-color:#cddc39!important}.lime-text{color:#cddc39!important}.lime.lighten-5{background-color:#f9fbe7!important}.lime-text.text-lighten-5{color:#f9fbe7!important}.lime.lighten-4{background-color:#f0f4c3!important}.lime-text.text-lighten-4{color:#f0f4c3!important}.lime.lighten-3{background-color:#e6ee9c!important}.lime-text.text-lighten-3{color:#e6ee9c!important}.lime.lighten-2{background-color:#dce775!important}.lime-text.text-lighten-2{color:#dce775!important}.lime.lighten-1{background-color:#d4e157!important}.lime-text.text-lighten-1{color:#d4e157!important}.lime.darken-1{background-color:#c0ca33!important}.lime-text.text-darken-1{color:#c0ca33!important}.lime.darken-2{background-color:#afb42b!important}.lime-text.text-darken-2{color:#afb42b!important}.lime.darken-3{background-color:#9e9d24!important}.lime-text.text-darken-3{color:#9e9d24!important}.lime.darken-4{background-color:#827717!important}.lime-text.text-darken-4{color:#827717!important}.lime.accent-1{background-color:#f4ff81!important}.lime-text.text-accent-1{color:#f4ff81!important}.lime.accent-2{background-color:#eeff41!important}.lime-text.text-accent-2{color:#eeff41!important}.lime.accent-3{background-color:#c6ff00!important}.lime-text.text-accent-3{color:#c6ff00!important}.lime.accent-4{background-color:#aeea00!important}.lime-text.text-accent-4{color:#aeea00!important}.yellow{background-color:#ffeb3b!important}.yellow-text{color:#ffeb3b!important}.yellow.lighten-5{background-color:#fffde7!important}.yellow-text.text-lighten-5{color:#fffde7!important}.yellow.lighten-4{background-color:#fff9c4!important}.yellow-text.text-lighten-4{color:#fff9c4!important}.yellow.lighten-3{background-color:#fff59d!important}.yellow-text.text-lighten-3{color:#fff59d!important}.yellow.lighten-2{background-color:#fff176!important}.yellow-text.text-lighten-2{color:#fff176!important}.yellow.lighten-1{background-color:#ffee58!important}.yellow-text.text-lighten-1{color:#ffee58!important}.yellow.darken-1{background-color:#fdd835!important}.yellow-text.text-darken-1{color:#fdd835!important}.yellow.darken-2{background-color:#fbc02d!important}.yellow-text.text-darken-2{color:#fbc02d!important}.yellow.darken-3{background-color:#f9a825!important}.yellow-text.text-darken-3{color:#f9a825!important}.yellow.darken-4{background-color:#f57f17!important}.yellow-text.text-darken-4{color:#f57f17!important}.yellow.accent-1{background-color:#ffff8d!important}.yellow-text.text-accent-1{color:#ffff8d!important}.yellow.accent-2{background-color:#ff0!important}.yellow-text.text-accent-2{color:#ff0!important}.yellow.accent-3{background-color:#ffea00!important}.yellow-text.text-accent-3{color:#ffea00!important}.yellow.accent-4{background-color:#ffd600!important}.yellow-text.text-accent-4{color:#ffd600!important}.amber{background-color:#ffc107!important}.amber-text{color:#ffc107!important}.amber.lighten-5{background-color:#fff8e1!important}.amber-text.text-lighten-5{color:#fff8e1!important}.amber.lighten-4{background-color:#ffecb3!important}.amber-text.text-lighten-4{color:#ffecb3!important}.amber.lighten-3{background-color:#ffe082!important}.amber-text.text-lighten-3{color:#ffe082!important}.amber.lighten-2{background-color:#ffd54f!important}.amber-text.text-lighten-2{color:#ffd54f!important}.amber.lighten-1{background-color:#ffca28!important}.amber-text.text-lighten-1{color:#ffca28!important}.amber.darken-1{background-color:#ffb300!important}.amber-text.text-darken-1{color:#ffb300!important}.amber.darken-2{background-color:#ffa000!important}.amber-text.text-darken-2{color:#ffa000!important}.amber.darken-3{background-color:#ff8f00!important}.amber-text.text-darken-3{color:#ff8f00!important}.amber.darken-4{background-color:#ff6f00!important}.amber-text.text-darken-4{color:#ff6f00!important}.amber.accent-1{background-color:#ffe57f!important}.amber-text.text-accent-1{color:#ffe57f!important}.amber.accent-2{background-color:#ffd740!important}.amber-text.text-accent-2{color:#ffd740!important}.amber.accent-3{background-color:#ffc400!important}.amber-text.text-accent-3{color:#ffc400!important}.amber.accent-4{background-color:#ffab00!important}.amber-text.text-accent-4{color:#ffab00!important}.orange{background-color:#ff9800!important}.orange-text{color:#ff9800!important}.orange.lighten-5{background-color:#fff3e0!important}.orange-text.text-lighten-5{color:#fff3e0!important}.orange.lighten-4{background-color:#ffe0b2!important}.orange-text.text-lighten-4{color:#ffe0b2!important}.orange.lighten-3{background-color:#ffcc80!important}.orange-text.text-lighten-3{color:#ffcc80!important}.orange.lighten-2{background-color:#ffb74d!important}.orange-text.text-lighten-2{color:#ffb74d!important}.orange.lighten-1{background-color:#ffa726!important}.orange-text.text-lighten-1{color:#ffa726!important}.orange.darken-1{background-color:#fb8c00!important}.orange-text.text-darken-1{color:#fb8c00!important}.orange.darken-2{background-color:#f57c00!important}.orange-text.text-darken-2{color:#f57c00!important}.orange.darken-3{background-color:#ef6c00!important}.orange-text.text-darken-3{color:#ef6c00!important}.orange.darken-4{background-color:#e65100!important}.orange-text.text-darken-4{color:#e65100!important}.orange.accent-1{background-color:#ffd180!important}.orange-text.text-accent-1{color:#ffd180!important}.orange.accent-2{background-color:#ffab40!important}.orange-text.text-accent-2{color:#ffab40!important}.orange.accent-3{background-color:#ff9100!important}.orange-text.text-accent-3{color:#ff9100!important}.orange.accent-4{background-color:#ff6d00!important}.orange-text.text-accent-4{color:#ff6d00!important}.deep-orange{background-color:#ff5722!important}.deep-orange-text{color:#ff5722!important}.deep-orange.lighten-5{background-color:#fbe9e7!important}.deep-orange-text.text-lighten-5{color:#fbe9e7!important}.deep-orange.lighten-4{background-color:#ffccbc!important}.deep-orange-text.text-lighten-4{color:#ffccbc!important}.deep-orange.lighten-3{background-color:#ffab91!important}.deep-orange-text.text-lighten-3{color:#ffab91!important}.deep-orange.lighten-2{background-color:#ff8a65!important}.deep-orange-text.text-lighten-2{color:#ff8a65!important}.deep-orange.lighten-1{background-color:#ff7043!important}.deep-orange-text.text-lighten-1{color:#ff7043!important}.deep-orange.darken-1{background-color:#f4511e!important}.deep-orange-text.text-darken-1{color:#f4511e!important}.deep-orange.darken-2{background-color:#e64a19!important}.deep-orange-text.text-darken-2{color:#e64a19!important}.deep-orange.darken-3{background-color:#d84315!important}.deep-orange-text.text-darken-3{color:#d84315!important}.deep-orange.darken-4{background-color:#bf360c!important}.deep-orange-text.text-darken-4{color:#bf360c!important}.deep-orange.accent-1{background-color:#ff9e80!important}.deep-orange-text.text-accent-1{color:#ff9e80!important}.deep-orange.accent-2{background-color:#ff6e40!important}.deep-orange-text.text-accent-2{color:#ff6e40!important}.deep-orange.accent-3{background-color:#ff3d00!important}.deep-orange-text.text-accent-3{color:#ff3d00!important}.deep-orange.accent-4{background-color:#dd2c00!important}.deep-orange-text.text-accent-4{color:#dd2c00!important}.brown{background-color:#795548!important}.brown-text{color:#795548!important}.brown.lighten-5{background-color:#efebe9!important}.brown-text.text-lighten-5{color:#efebe9!important}.brown.lighten-4{background-color:#d7ccc8!important}.brown-text.text-lighten-4{color:#d7ccc8!important}.brown.lighten-3{background-color:#bcaaa4!important}.brown-text.text-lighten-3{color:#bcaaa4!important}.brown.lighten-2{background-color:#a1887f!important}.brown-text.text-lighten-2{color:#a1887f!important}.brown.lighten-1{background-color:#8d6e63!important}.brown-text.text-lighten-1{color:#8d6e63!important}.brown.darken-1{background-color:#6d4c41!important}.brown-text.text-darken-1{color:#6d4c41!important}.brown.darken-2{background-color:#5d4037!important}.brown-text.text-darken-2{color:#5d4037!important}.brown.darken-3{background-color:#4e342e!important}.brown-text.text-darken-3{color:#4e342e!important}.brown.darken-4{background-color:#3e2723!important}.brown-text.text-darken-4{color:#3e2723!important}.blue-grey{background-color:#607d8b!important}.blue-grey-text{color:#607d8b!important}.blue-grey.lighten-5{background-color:#eceff1!important}.blue-grey-text.text-lighten-5{color:#eceff1!important}.blue-grey.lighten-4{background-color:#cfd8dc!important}.blue-grey-text.text-lighten-4{color:#cfd8dc!important}.blue-grey.lighten-3{background-color:#b0bec5!important}.blue-grey-text.text-lighten-3{color:#b0bec5!important}.blue-grey.lighten-2{background-color:#90a4ae!important}.blue-grey-text.text-lighten-2{color:#90a4ae!important}.blue-grey.lighten-1{background-color:#78909c!important}.blue-grey-text.text-lighten-1{color:#78909c!important}.blue-grey.darken-1{background-color:#546e7a!important}.blue-grey-text.text-darken-1{color:#546e7a!important}.blue-grey.darken-2{background-color:#455a64!important}.blue-grey-text.text-darken-2{color:#455a64!important}.blue-grey.darken-3{background-color:#37474f!important}.blue-grey-text.text-darken-3{color:#37474f!important}.blue-grey.darken-4{background-color:#263238!important}.blue-grey-text.text-darken-4{color:#263238!important}.grey{background-color:#9e9e9e!important}.grey-text{color:#9e9e9e!important}.grey.lighten-5{background-color:#fafafa!important}.grey-text.text-lighten-5{color:#fafafa!important}.grey.lighten-4{background-color:#f5f5f5!important}.grey-text.text-lighten-4{color:#f5f5f5!important}.grey.lighten-3{background-color:#eee!important}.grey-text.text-lighten-3{color:#eee!important}.grey.lighten-2{background-color:#e0e0e0!important}.grey-text.text-lighten-2{color:#e0e0e0!important}.grey.lighten-1{background-color:#bdbdbd!important}.grey-text.text-lighten-1{color:#bdbdbd!important}.grey.darken-1{background-color:#757575!important}.grey-text.text-darken-1{color:#757575!important}.grey.darken-2{background-color:#616161!important}.grey-text.text-darken-2{color:#616161!important}.grey.darken-3{background-color:#424242!important}.grey-text.text-darken-3{color:#424242!important}.grey.darken-4{background-color:#212121!important}.grey-text.text-darken-4{color:#212121!important}.black{background-color:#000!important}.black-text{color:#000!important}.white{background-color:#fff!important}.white-text{color:#fff!important}.transparent{background-color:transparent!important}.transparent-text{color:transparent!important}/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background-color:transparent}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:700}dfn{font-style:italic}h1{font-size:2em;margin:.67em 0}mark{background:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{box-sizing:content-box;height:0}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{overflow:visible}button,select{text-transform:none}button,html input[type=button],input[type=reset],input[type=submit]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input[type=checkbox],input[type=radio]{box-sizing:border-box;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]{-webkit-appearance:textfield;box-sizing:content-box}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend{border:0;padding:0}textarea{overflow:auto}optgroup{font-weight:700}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}html{box-sizing:border-box}*,:after,:before{box-sizing:inherit}ul:not(.browser-default){padding-left:0;list-style-type:none}ul:not(.browser-default) li{list-style-type:none}a{color:#039be5;-webkit-tap-highlight-color:transparent}.valign-wrapper{display:flex;align-items:center}.clearfix{clear:both}.z-depth-0{box-shadow:none!important}.btn,.btn-floating,.btn-large,.card,.card-panel,.collapsible,.dropdown-content,.side-nav,.toast,.z-depth-1,nav{box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12),0 3px 1px -2px rgba(0,0,0,.2)}.btn-floating:hover,.btn-large:hover,.btn:hover,.z-depth-1-half{box-shadow:0 3px 3px 0 rgba(0,0,0,.14),0 1px 7px 0 rgba(0,0,0,.12),0 3px 1px -1px rgba(0,0,0,.2)}.z-depth-2{box-shadow:0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12),0 2px 4px -1px rgba(0,0,0,.3)}.z-depth-3{box-shadow:0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.3)}.modal,.z-depth-4{box-shadow:0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12),0 5px 5px -3px rgba(0,0,0,.3)}.z-depth-5{box-shadow:0 16px 24px 2px rgba(0,0,0,.14),0 6px 30px 5px rgba(0,0,0,.12),0 8px 10px -5px rgba(0,0,0,.3)}.hoverable{transition:box-shadow .25s;box-shadow:0}.hoverable:hover{transition:box-shadow .25s;box-shadow:0 8px 17px 0 rgba(0,0,0,.2),0 6px 20px 0 rgba(0,0,0,.19)}.divider{height:1px;overflow:hidden;background-color:#e0e0e0}blockquote{margin:20px 0;padding-left:1.5rem;border-left:5px solid #ee6e73}i{line-height:inherit}i.left{float:left;margin-right:15px}i.right{float:right;margin-left:15px}i.tiny{font-size:1rem}i.small{font-size:2rem}i.medium{font-size:4rem}i.large{font-size:6rem}img.responsive-img,video.responsive-video{max-width:100%;height:auto}.pagination li{display:inline-block;border-radius:2px;text-align:center;vertical-align:top;height:30px}.pagination li a{color:#444;display:inline-block;font-size:1.2rem;padding:0 10px;line-height:30px}.pagination li.active a{color:#fff}.pagination li.active{background-color:#ee6e73}.pagination li.disabled a{cursor:default;color:#999}.pagination li i{font-size:2rem}.pagination li.pages ul li{display:inline-block;float:none}@media only screen and (max-width:992px){.pagination{width:100%}.pagination li.next,.pagination li.prev{width:10%}.pagination li.pages{width:80%;overflow:hidden;white-space:nowrap}}.breadcrumb{font-size:18px;color:hsla(0,0%,100%,.7)}.breadcrumb [class*=mdi-],.breadcrumb [class^=mdi-],.breadcrumb i,.breadcrumb i.material-icons{display:inline-block;float:left;font-size:24px}.breadcrumb:before{content:\"\\E5CC\";color:hsla(0,0%,100%,.7);vertical-align:top;display:inline-block;font-family:Material Icons;font-weight:400;font-style:normal;font-size:25px;margin:0 10px 0 8px;-webkit-font-smoothing:antialiased}.breadcrumb:first-child:before{display:none}.breadcrumb:last-child{color:#fff}.parallax-container{position:relative;overflow:hidden;height:500px}.parallax{top:0;left:0;right:0;z-index:-1}.parallax,.parallax img{position:absolute;bottom:0}.parallax img{display:none;left:50%;min-width:100%;min-height:100%;-webkit-transform:translateZ(0);transform:translateZ(0);transform:translateX(-50%)}.pin-bottom,.pin-top{position:relative}.pinned{position:fixed!important}.fade-in,ul.staggered-list li{opacity:0}.fade-in{transform-origin:0 50%}@media only screen and (max-width:600px){.hide-on-small-and-down,.hide-on-small-only{display:none!important}}@media only screen and (max-width:992px){.hide-on-med-and-down{display:none!important}}@media only screen and (min-width:601px){.hide-on-med-and-up{display:none!important}}@media only screen and (min-width:600px) and (max-width:992px){.hide-on-med-only{display:none!important}}@media only screen and (min-width:993px){.hide-on-large-only{display:none!important}}@media only screen and (min-width:993px){.show-on-large{display:block!important}}@media only screen and (min-width:600px) and (max-width:992px){.show-on-medium{display:block!important}}@media only screen and (max-width:600px){.show-on-small{display:block!important}}@media only screen and (min-width:601px){.show-on-medium-and-up{display:block!important}}@media only screen and (max-width:992px){.show-on-medium-and-down{display:block!important}}@media only screen and (max-width:600px){.center-on-small-only{text-align:center}}.page-footer{padding-top:20px;background-color:#ee6e73}.page-footer .footer-copyright{overflow:hidden;min-height:50px;display:flex;align-items:center;padding:10px 0;color:hsla(0,0%,100%,.8);background-color:rgba(51,51,51,.08)}table,td,th{border:none}table{width:100%;display:table}table.bordered>tbody>tr,table.bordered>thead>tr{border-bottom:1px solid #d0d0d0}table.striped>tbody>tr:nth-child(odd){background-color:#f2f2f2}table.striped>tbody>tr>td{border-radius:0}table.highlight>tbody>tr{transition:background-color .25s ease}table.highlight>tbody>tr:hover{background-color:#f2f2f2}table.centered tbody tr td,table.centered thead tr th{text-align:center}thead{border-bottom:1px solid #d0d0d0}td,th{padding:15px 5px;display:table-cell;text-align:left;vertical-align:middle;border-radius:2px}@media only screen and (max-width:992px){table.responsive-table{width:100%;border-collapse:collapse;border-spacing:0;display:block;position:relative}table.responsive-table td:empty:before{content:\"\\A0\"}table.responsive-table td,table.responsive-table th{margin:0;vertical-align:top}table.responsive-table th{text-align:left}table.responsive-table thead{display:block;float:left}table.responsive-table thead tr{display:block;padding:0 10px 0 0}table.responsive-table thead tr th:before{content:\"\\A0\"}table.responsive-table tbody{display:block;width:auto;position:relative;overflow-x:auto;white-space:nowrap}table.responsive-table tbody tr{display:inline-block;vertical-align:top}table.responsive-table th{display:block;text-align:right}table.responsive-table td{display:block;min-height:1.25em;text-align:left}table.responsive-table tr{padding:0 10px}table.responsive-table thead{border:0;border-right:1px solid #d0d0d0}table.responsive-table.bordered th{border-bottom:0;border-left:0}table.responsive-table.bordered td{border-left:0;border-right:0;border-bottom:0}table.responsive-table.bordered tr{border:0}table.responsive-table.bordered tbody tr{border-right:1px solid #d0d0d0}}.collection{margin:.5rem 0 1rem;border:1px solid #e0e0e0;border-radius:2px;overflow:hidden;position:relative}.collection .collection-item{background-color:#fff;line-height:1.5rem;padding:10px 20px;margin:0;border-bottom:1px solid #e0e0e0}.collection .collection-item.avatar{min-height:84px;padding-left:72px;position:relative}.collection .collection-item.avatar .circle{position:absolute;width:42px;height:42px;overflow:hidden;left:15px;display:inline-block;vertical-align:middle}.collection .collection-item.avatar i.circle{font-size:18px;line-height:42px;color:#fff;background-color:#999;text-align:center}.collection .collection-item.avatar .title{font-size:16px}.collection .collection-item.avatar p{margin:0}.collection .collection-item.avatar .secondary-content{position:absolute;top:16px;right:16px}.collection .collection-item:last-child{border-bottom:none}.collection .collection-item.active{background-color:#26a69a;color:#eafaf9}.collection .collection-item.active .secondary-content{color:#fff}.collection a.collection-item{display:block;transition:.25s;color:#26a69a}.collection a.collection-item:not(.active):hover{background-color:#ddd}.collection.with-header .collection-header{background-color:#fff;border-bottom:1px solid #e0e0e0;padding:10px 20px}.collection.with-header .collection-item{padding-left:30px}.collection.with-header .collection-item.avatar{padding-left:72px}.secondary-content{float:right;color:#26a69a}.collapsible .collection{margin:0;border:none}.video-container{position:relative;padding-bottom:56.25%;height:0;overflow:hidden}.video-container embed,.video-container iframe,.video-container object{position:absolute;top:0;left:0;width:100%;height:100%}.progress{position:relative;height:4px;display:block;width:100%;background-color:#acece6;border-radius:2px;margin:.5rem 0 1rem;overflow:hidden}.progress .determinate{position:absolute;top:0;left:0;bottom:0;transition:width .3s linear}.progress .determinate,.progress .indeterminate{background-color:#26a69a}.progress .indeterminate:before{animation:indeterminate 2.1s cubic-bezier(.65,.815,.735,.395) infinite}.progress .indeterminate:after,.progress .indeterminate:before{content:\"\";position:absolute;background-color:inherit;top:0;left:0;bottom:0;will-change:left,right}.progress .indeterminate:after{animation:indeterminate-short 2.1s cubic-bezier(.165,.84,.44,1) infinite;animation-delay:1.15s}@keyframes indeterminate{0%{left:-35%;right:100%}60%{left:100%;right:-90%}to{left:100%;right:-90%}}@keyframes indeterminate-short{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}.hide{display:none!important}.left-align{text-align:left}.right-align{text-align:right}.center,.center-align{text-align:center}.left{float:left!important}.right{float:right!important}.no-select,input[type=range],input[type=range]+.thumb{-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.circle{border-radius:50%}.center-block{display:block;margin-left:auto;margin-right:auto}.truncate{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.no-padding{padding:0!important}span.badge{min-width:3rem;padding:0 6px;margin-left:14px;text-align:center;font-size:1rem;line-height:22px;height:22px;color:#757575;float:right;box-sizing:border-box}span.badge.new{font-weight:300;font-size:.8rem;color:#fff;background-color:#26a69a;border-radius:2px}span.badge.new:after{content:\" new\"}span.badge[data-badge-caption]:after{content:\" \" attr(data-badge-caption)}nav ul a span.badge{display:inline-block;float:none;margin-left:4px;line-height:22px;height:22px}.collection-item span.badge{margin-top:calc(.75rem - 11px)}.collapsible span.badge{margin-top:calc(1.5rem - 11px)}.side-nav span.badge{margin-top:13px}.material-icons{text-rendering:optimizeLegibility;font-feature-settings:\"liga\"}.container{margin:0 auto;max-width:1280px;width:90%}@media only screen and (min-width:601px){.container{width:85%}}@media only screen and (min-width:993px){.container{width:70%}}.container .row{margin-left:-.75rem;margin-right:-.75rem}.section{padding-top:1rem;padding-bottom:1rem}.section.no-pad{padding:0}.section.no-pad-bot{padding-bottom:0}.section.no-pad-top{padding-top:0}.row{margin-left:auto;margin-right:auto;margin-bottom:20px}.row:after{content:\"\";display:table;clear:both}.row .col{float:left;box-sizing:border-box;padding:0 .75rem;min-height:1px}.row .col[class*=pull-],.row .col[class*=push-]{position:relative}.row .col.s1{width:8.33333%}.row .col.s1,.row .col.s2{margin-left:auto;left:auto;right:auto}.row .col.s2{width:16.66667%}.row .col.s3{width:25%}.row .col.s3,.row .col.s4{margin-left:auto;left:auto;right:auto}.row .col.s4{width:33.33333%}.row .col.s5{width:41.66667%}.row .col.s5,.row .col.s6{margin-left:auto;left:auto;right:auto}.row .col.s6{width:50%}.row .col.s7{width:58.33333%}.row .col.s7,.row .col.s8{margin-left:auto;left:auto;right:auto}.row .col.s8{width:66.66667%}.row .col.s9{width:75%}.row .col.s9,.row .col.s10{margin-left:auto;left:auto;right:auto}.row .col.s10{width:83.33333%}.row .col.s11{width:91.66667%}.row .col.s11,.row .col.s12{margin-left:auto;left:auto;right:auto}.row .col.s12{width:100%}.row .col.offset-s1{margin-left:8.33333%}.row .col.pull-s1{right:8.33333%}.row .col.push-s1{left:8.33333%}.row .col.offset-s2{margin-left:16.66667%}.row .col.pull-s2{right:16.66667%}.row .col.push-s2{left:16.66667%}.row .col.offset-s3{margin-left:25%}.row .col.pull-s3{right:25%}.row .col.push-s3{left:25%}.row .col.offset-s4{margin-left:33.33333%}.row .col.pull-s4{right:33.33333%}.row .col.push-s4{left:33.33333%}.row .col.offset-s5{margin-left:41.66667%}.row .col.pull-s5{right:41.66667%}.row .col.push-s5{left:41.66667%}.row .col.offset-s6{margin-left:50%}.row .col.pull-s6{right:50%}.row .col.push-s6{left:50%}.row .col.offset-s7{margin-left:58.33333%}.row .col.pull-s7{right:58.33333%}.row .col.push-s7{left:58.33333%}.row .col.offset-s8{margin-left:66.66667%}.row .col.pull-s8{right:66.66667%}.row .col.push-s8{left:66.66667%}.row .col.offset-s9{margin-left:75%}.row .col.pull-s9{right:75%}.row .col.push-s9{left:75%}.row .col.offset-s10{margin-left:83.33333%}.row .col.pull-s10{right:83.33333%}.row .col.push-s10{left:83.33333%}.row .col.offset-s11{margin-left:91.66667%}.row .col.pull-s11{right:91.66667%}.row .col.push-s11{left:91.66667%}.row .col.offset-s12{margin-left:100%}.row .col.pull-s12{right:100%}.row .col.push-s12{left:100%}@media only screen and (min-width:601px){.row .col.m1{width:8.33333%}.row .col.m1,.row .col.m2{margin-left:auto;left:auto;right:auto}.row .col.m2{width:16.66667%}.row .col.m3{width:25%}.row .col.m3,.row .col.m4{margin-left:auto;left:auto;right:auto}.row .col.m4{width:33.33333%}.row .col.m5{width:41.66667%}.row .col.m5,.row .col.m6{margin-left:auto;left:auto;right:auto}.row .col.m6{width:50%}.row .col.m7{width:58.33333%}.row .col.m7,.row .col.m8{margin-left:auto;left:auto;right:auto}.row .col.m8{width:66.66667%}.row .col.m9{width:75%}.row .col.m9,.row .col.m10{margin-left:auto;left:auto;right:auto}.row .col.m10{width:83.33333%}.row .col.m11{width:91.66667%}.row .col.m11,.row .col.m12{margin-left:auto;left:auto;right:auto}.row .col.m12{width:100%}.row .col.offset-m1{margin-left:8.33333%}.row .col.pull-m1{right:8.33333%}.row .col.push-m1{left:8.33333%}.row .col.offset-m2{margin-left:16.66667%}.row .col.pull-m2{right:16.66667%}.row .col.push-m2{left:16.66667%}.row .col.offset-m3{margin-left:25%}.row .col.pull-m3{right:25%}.row .col.push-m3{left:25%}.row .col.offset-m4{margin-left:33.33333%}.row .col.pull-m4{right:33.33333%}.row .col.push-m4{left:33.33333%}.row .col.offset-m5{margin-left:41.66667%}.row .col.pull-m5{right:41.66667%}.row .col.push-m5{left:41.66667%}.row .col.offset-m6{margin-left:50%}.row .col.pull-m6{right:50%}.row .col.push-m6{left:50%}.row .col.offset-m7{margin-left:58.33333%}.row .col.pull-m7{right:58.33333%}.row .col.push-m7{left:58.33333%}.row .col.offset-m8{margin-left:66.66667%}.row .col.pull-m8{right:66.66667%}.row .col.push-m8{left:66.66667%}.row .col.offset-m9{margin-left:75%}.row .col.pull-m9{right:75%}.row .col.push-m9{left:75%}.row .col.offset-m10{margin-left:83.33333%}.row .col.pull-m10{right:83.33333%}.row .col.push-m10{left:83.33333%}.row .col.offset-m11{margin-left:91.66667%}.row .col.pull-m11{right:91.66667%}.row .col.push-m11{left:91.66667%}.row .col.offset-m12{margin-left:100%}.row .col.pull-m12{right:100%}.row .col.push-m12{left:100%}}@media only screen and (min-width:993px){.row .col.l1{width:8.33333%}.row .col.l1,.row .col.l2{margin-left:auto;left:auto;right:auto}.row .col.l2{width:16.66667%}.row .col.l3{width:25%}.row .col.l3,.row .col.l4{margin-left:auto;left:auto;right:auto}.row .col.l4{width:33.33333%}.row .col.l5{width:41.66667%}.row .col.l5,.row .col.l6{margin-left:auto;left:auto;right:auto}.row .col.l6{width:50%}.row .col.l7{width:58.33333%}.row .col.l7,.row .col.l8{margin-left:auto;left:auto;right:auto}.row .col.l8{width:66.66667%}.row .col.l9{width:75%}.row .col.l9,.row .col.l10{margin-left:auto;left:auto;right:auto}.row .col.l10{width:83.33333%}.row .col.l11{width:91.66667%}.row .col.l11,.row .col.l12{margin-left:auto;left:auto;right:auto}.row .col.l12{width:100%}.row .col.offset-l1{margin-left:8.33333%}.row .col.pull-l1{right:8.33333%}.row .col.push-l1{left:8.33333%}.row .col.offset-l2{margin-left:16.66667%}.row .col.pull-l2{right:16.66667%}.row .col.push-l2{left:16.66667%}.row .col.offset-l3{margin-left:25%}.row .col.pull-l3{right:25%}.row .col.push-l3{left:25%}.row .col.offset-l4{margin-left:33.33333%}.row .col.pull-l4{right:33.33333%}.row .col.push-l4{left:33.33333%}.row .col.offset-l5{margin-left:41.66667%}.row .col.pull-l5{right:41.66667%}.row .col.push-l5{left:41.66667%}.row .col.offset-l6{margin-left:50%}.row .col.pull-l6{right:50%}.row .col.push-l6{left:50%}.row .col.offset-l7{margin-left:58.33333%}.row .col.pull-l7{right:58.33333%}.row .col.push-l7{left:58.33333%}.row .col.offset-l8{margin-left:66.66667%}.row .col.pull-l8{right:66.66667%}.row .col.push-l8{left:66.66667%}.row .col.offset-l9{margin-left:75%}.row .col.pull-l9{right:75%}.row .col.push-l9{left:75%}.row .col.offset-l10{margin-left:83.33333%}.row .col.pull-l10{right:83.33333%}.row .col.push-l10{left:83.33333%}.row .col.offset-l11{margin-left:91.66667%}.row .col.pull-l11{right:91.66667%}.row .col.push-l11{left:91.66667%}.row .col.offset-l12{margin-left:100%}.row .col.pull-l12{right:100%}.row .col.push-l12{left:100%}}@media only screen and (min-width:1201px){.row .col.xl1{width:8.33333%}.row .col.xl1,.row .col.xl2{margin-left:auto;left:auto;right:auto}.row .col.xl2{width:16.66667%}.row .col.xl3{width:25%}.row .col.xl3,.row .col.xl4{margin-left:auto;left:auto;right:auto}.row .col.xl4{width:33.33333%}.row .col.xl5{width:41.66667%}.row .col.xl5,.row .col.xl6{margin-left:auto;left:auto;right:auto}.row .col.xl6{width:50%}.row .col.xl7{width:58.33333%}.row .col.xl7,.row .col.xl8{margin-left:auto;left:auto;right:auto}.row .col.xl8{width:66.66667%}.row .col.xl9{width:75%}.row .col.xl9,.row .col.xl10{margin-left:auto;left:auto;right:auto}.row .col.xl10{width:83.33333%}.row .col.xl11{width:91.66667%}.row .col.xl11,.row .col.xl12{margin-left:auto;left:auto;right:auto}.row .col.xl12{width:100%}.row .col.offset-xl1{margin-left:8.33333%}.row .col.pull-xl1{right:8.33333%}.row .col.push-xl1{left:8.33333%}.row .col.offset-xl2{margin-left:16.66667%}.row .col.pull-xl2{right:16.66667%}.row .col.push-xl2{left:16.66667%}.row .col.offset-xl3{margin-left:25%}.row .col.pull-xl3{right:25%}.row .col.push-xl3{left:25%}.row .col.offset-xl4{margin-left:33.33333%}.row .col.pull-xl4{right:33.33333%}.row .col.push-xl4{left:33.33333%}.row .col.offset-xl5{margin-left:41.66667%}.row .col.pull-xl5{right:41.66667%}.row .col.push-xl5{left:41.66667%}.row .col.offset-xl6{margin-left:50%}.row .col.pull-xl6{right:50%}.row .col.push-xl6{left:50%}.row .col.offset-xl7{margin-left:58.33333%}.row .col.pull-xl7{right:58.33333%}.row .col.push-xl7{left:58.33333%}.row .col.offset-xl8{margin-left:66.66667%}.row .col.pull-xl8{right:66.66667%}.row .col.push-xl8{left:66.66667%}.row .col.offset-xl9{margin-left:75%}.row .col.pull-xl9{right:75%}.row .col.push-xl9{left:75%}.row .col.offset-xl10{margin-left:83.33333%}.row .col.pull-xl10{right:83.33333%}.row .col.push-xl10{left:83.33333%}.row .col.offset-xl11{margin-left:91.66667%}.row .col.pull-xl11{right:91.66667%}.row .col.push-xl11{left:91.66667%}.row .col.offset-xl12{margin-left:100%}.row .col.pull-xl12{right:100%}.row .col.push-xl12{left:100%}}nav{color:#fff;background-color:#ee6e73;width:100%;height:56px;line-height:56px}nav.nav-extended{height:auto}nav.nav-extended .nav-wrapper{min-height:56px;height:auto}nav.nav-extended .nav-content{position:relative;line-height:normal}nav a{color:#fff}nav [class*=mdi-],nav [class^=mdi-],nav i,nav i.material-icons{display:block;font-size:24px;height:56px;line-height:56px}nav .nav-wrapper{position:relative;height:100%}@media only screen and (min-width:993px){nav a.button-collapse{display:none}}nav .button-collapse{float:left;position:relative;z-index:1;height:56px;margin:0 18px}nav .button-collapse i{height:56px;line-height:56px}nav .brand-logo{position:absolute;color:#fff;display:inline-block;font-size:2.1rem;padding:0;white-space:nowrap}nav .brand-logo.center{left:50%;transform:translateX(-50%)}@media only screen and (max-width:992px){nav .brand-logo{left:50%;transform:translateX(-50%)}nav .brand-logo.left,nav .brand-logo.right{padding:0;transform:none}nav .brand-logo.left{left:.5rem}nav .brand-logo.right{right:.5rem;left:auto}}nav .brand-logo.right{right:.5rem;padding:0}nav .brand-logo [class*=mdi-],nav .brand-logo [class^=mdi-],nav .brand-logo i,nav .brand-logo i.material-icons{float:left;margin-right:15px}nav .nav-title{display:inline-block;font-size:32px;padding:28px 0}nav ul{margin:0}nav ul li{transition:background-color .3s;float:left;padding:0}nav ul li.active{background-color:rgba(0,0,0,.1)}nav ul a{transition:background-color .3s;font-size:1rem;color:#fff;display:block;padding:0 15px;cursor:pointer}nav ul a.btn,nav ul a.btn-flat,nav ul a.btn-floating,nav ul a.btn-large{margin-top:-2px;margin-left:15px;margin-right:15px}nav ul a.btn-flat>.material-icons,nav ul a.btn-floating>.material-icons,nav ul a.btn-large>.material-icons,nav ul a.btn>.material-icons{height:inherit;line-height:inherit}nav ul a:hover{background-color:rgba(0,0,0,.1)}nav ul.left{float:left}nav form{height:100%}nav .input-field{margin:0;height:100%}nav .input-field input{height:100%;font-size:1.2rem;border:none;padding-left:2rem}nav .input-field input:focus,nav .input-field input[type=date]:valid,nav .input-field input[type=email]:valid,nav .input-field input[type=password]:valid,nav .input-field input[type=text]:valid,nav .input-field input[type=url]:valid{border:none;box-shadow:none}nav .input-field label{top:0;left:0}nav .input-field label i{color:hsla(0,0%,100%,.7);transition:color .3s}nav .input-field label.active i{color:#fff}.navbar-fixed{position:relative;height:56px;z-index:997}.navbar-fixed nav{position:fixed}@media only screen and (min-width:601px){nav.nav-extended .nav-wrapper{min-height:64px}nav,nav .nav-wrapper i,nav a.button-collapse,nav a.button-collapse i{height:64px;line-height:64px}.navbar-fixed{height:64px}}@font-face{font-family:Roboto;src:local(Roboto Thin),url(\"/dist/fonts/roboto/Roboto-Thin.woff2\") format(\"woff2\"),url(\"/dist/fonts/roboto/Roboto-Thin.woff\") format(\"woff\");font-weight:100}@font-face{font-family:Roboto;src:local(Roboto Light),url(\"/dist/fonts/roboto/Roboto-Light.woff2\") format(\"woff2\"),url(\"/dist/fonts/roboto/Roboto-Light.woff\") format(\"woff\");font-weight:300}@font-face{font-family:Roboto;src:local(Roboto Regular),url(\"/dist/fonts/roboto/Roboto-Regular.woff2\") format(\"woff2\"),url(\"/dist/fonts/roboto/Roboto-Regular.woff\") format(\"woff\");font-weight:400}@font-face{font-family:Roboto;src:local(Roboto Medium),url(\"/dist/fonts/roboto/Roboto-Medium.woff2\") format(\"woff2\"),url(\"/dist/fonts/roboto/Roboto-Medium.woff\") format(\"woff\");font-weight:500}@font-face{font-family:Roboto;src:local(Roboto Bold),url(\"/dist/fonts/roboto/Roboto-Bold.woff2\") format(\"woff2\"),url(\"/dist/fonts/roboto/Roboto-Bold.woff\") format(\"woff\");font-weight:700}a{text-decoration:none}html{line-height:1.5;font-family:Roboto,sans-serif;font-weight:400;color:rgba(0,0,0,.87)}@media only screen and (min-width:0){html{font-size:14px}}@media only screen and (min-width:992px){html{font-size:14.5px}}@media only screen and (min-width:1200px){html{font-size:15px}}h1,h2,h3,h4,h5,h6{font-weight:400;line-height:1.1}h1 a,h2 a,h3 a,h4 a,h5 a,h6 a{font-weight:inherit}h1{font-size:4.2rem;margin:2.1rem 0 1.68rem}h1,h2{line-height:110%}h2{font-size:3.56rem;margin:1.78rem 0 1.424rem}h3{font-size:2.92rem;margin:1.46rem 0 1.168rem}h3,h4{line-height:110%}h4{font-size:2.28rem;margin:1.14rem 0 .912rem}h5{font-size:1.64rem;margin:.82rem 0 .656rem}h5,h6{line-height:110%}h6{font-size:1rem;margin:.5rem 0 .4rem}em{font-style:italic}strong{font-weight:500}small{font-size:75%}.light,.page-footer .footer-copyright{font-weight:300}.thin{font-weight:200}.flow-text{font-weight:300}@media only screen and (min-width:360px){.flow-text{font-size:1.2rem}}@media only screen and (min-width:390px){.flow-text{font-size:1.224rem}}@media only screen and (min-width:420px){.flow-text{font-size:1.248rem}}@media only screen and (min-width:450px){.flow-text{font-size:1.272rem}}@media only screen and (min-width:480px){.flow-text{font-size:1.296rem}}@media only screen and (min-width:510px){.flow-text{font-size:1.32rem}}@media only screen and (min-width:540px){.flow-text{font-size:1.344rem}}@media only screen and (min-width:570px){.flow-text{font-size:1.368rem}}@media only screen and (min-width:600px){.flow-text{font-size:1.392rem}}@media only screen and (min-width:630px){.flow-text{font-size:1.416rem}}@media only screen and (min-width:660px){.flow-text{font-size:1.44rem}}@media only screen and (min-width:690px){.flow-text{font-size:1.464rem}}@media only screen and (min-width:720px){.flow-text{font-size:1.488rem}}@media only screen and (min-width:750px){.flow-text{font-size:1.512rem}}@media only screen and (min-width:780px){.flow-text{font-size:1.536rem}}@media only screen and (min-width:810px){.flow-text{font-size:1.56rem}}@media only screen and (min-width:840px){.flow-text{font-size:1.584rem}}@media only screen and (min-width:870px){.flow-text{font-size:1.608rem}}@media only screen and (min-width:900px){.flow-text{font-size:1.632rem}}@media only screen and (min-width:930px){.flow-text{font-size:1.656rem}}@media only screen and (min-width:960px){.flow-text{font-size:1.68rem}}@media only screen and (max-width:360px){.flow-text{font-size:1.2rem}}.scale-transition{transition:transform .3s cubic-bezier(.53,.01,.36,1.63)!important}.scale-transition.scale-out{transform:scale(0);transition:transform .2s!important}.scale-transition.scale-in{transform:scale(1)}.card-panel{padding:24px}.card,.card-panel{transition:box-shadow .25s;margin:.5rem 0 1rem;border-radius:2px;background-color:#fff}.card{position:relative}.card .card-title{font-size:24px;font-weight:300}.card .card-title.activator{cursor:pointer}.card.large,.card.medium,.card.small{position:relative}.card.large .card-image,.card.medium .card-image,.card.small .card-image{max-height:60%;overflow:hidden}.card.large .card-image+.card-content,.card.medium .card-image+.card-content,.card.small .card-image+.card-content{max-height:40%}.card.large .card-content,.card.medium .card-content,.card.small .card-content{max-height:100%;overflow:hidden}.card.large .card-action,.card.medium .card-action,.card.small .card-action{position:absolute;bottom:0;left:0;right:0}.card.small{height:300px}.card.medium{height:400px}.card.large{height:500px}.card.horizontal{display:flex}.card.horizontal.large .card-image,.card.horizontal.medium .card-image,.card.horizontal.small .card-image{height:100%;max-height:none;overflow:visible}.card.horizontal.large .card-image img,.card.horizontal.medium .card-image img,.card.horizontal.small .card-image img{height:100%}.card.horizontal .card-image{max-width:50%}.card.horizontal .card-image img{border-radius:2px 0 0 2px;max-width:100%;width:auto}.card.horizontal .card-stacked{display:flex;flex-direction:column;flex:1;position:relative}.card.horizontal .card-stacked .card-content{flex-grow:1}.card.sticky-action .card-action{z-index:2}.card.sticky-action .card-reveal{z-index:1;padding-bottom:64px}.card .card-image{position:relative}.card .card-image img{display:block;border-radius:2px 2px 0 0;position:relative;left:0;right:0;top:0;bottom:0;width:100%}.card .card-image .card-title{color:#fff;position:absolute;bottom:0;left:0;max-width:100%;padding:24px}.card .card-content{padding:24px;border-radius:0 0 2px 2px}.card .card-content p{margin:0;color:inherit}.card .card-content .card-title{display:block;line-height:32px;margin-bottom:8px}.card .card-content .card-title i{line-height:32px}.card .card-action{position:relative;background-color:inherit;border-top:1px solid hsla(0,0%,63%,.2);padding:16px 24px}.card .card-action:last-child{border-radius:0 0 2px 2px}.card .card-action a:not(.btn):not(.btn-large):not(.btn-large):not(.btn-floating){color:#ffab40;margin-right:24px;transition:color .3s ease;text-transform:uppercase}.card .card-action a:not(.btn):not(.btn-large):not(.btn-large):not(.btn-floating):hover{color:#ffd8a6}.card .card-reveal{padding:24px;position:absolute;background-color:#fff;width:100%;overflow-y:auto;left:0;top:100%;height:100%;z-index:3;display:none}.card .card-reveal .card-title{cursor:pointer;display:block}#toast-container{display:block;position:fixed;z-index:10000}@media only screen and (max-width:600px){#toast-container{min-width:100%;bottom:0}}@media only screen and (min-width:601px) and (max-width:992px){#toast-container{left:5%;bottom:7%;max-width:90%}}@media only screen and (min-width:993px){#toast-container{top:10%;right:7%;max-width:86%}}.toast{border-radius:2px;top:35px;width:auto;clear:both;margin-top:10px;position:relative;max-width:100%;height:auto;min-height:48px;line-height:1.5em;word-break:break-all;background-color:#323232;padding:10px 25px;font-size:1.1rem;font-weight:300;color:#fff;display:flex;align-items:center;justify-content:space-between}.toast .btn,.toast .btn-flat,.toast .btn-large{margin:0;margin-left:3rem}.toast.rounded{border-radius:24px}@media only screen and (max-width:600px){.toast{width:100%;border-radius:0}}@media only screen and (min-width:601px) and (max-width:992px){.toast{float:left}}@media only screen and (min-width:993px){.toast{float:right}}.tabs{position:relative;overflow-x:auto;overflow-y:hidden;height:48px;width:100%;background-color:#fff;margin:0 auto;white-space:nowrap}.tabs.tabs-transparent{background-color:transparent}.tabs.tabs-transparent .tab.disabled a,.tabs.tabs-transparent .tab.disabled a:hover,.tabs.tabs-transparent .tab a{color:hsla(0,0%,100%,.7)}.tabs.tabs-transparent .tab a.active,.tabs.tabs-transparent .tab a:hover{color:#fff}.tabs.tabs-transparent .indicator{background-color:#fff}.tabs.tabs-fixed-width{display:flex}.tabs.tabs-fixed-width .tab{-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1}.tabs .tab{display:inline-block;text-align:center;line-height:48px;height:48px;padding:0;margin:0;text-transform:uppercase}.tabs .tab a{color:rgba(238,110,115,.7);display:block;width:100%;height:100%;padding:0 24px;font-size:14px;text-overflow:ellipsis;overflow:hidden;transition:color .28s ease}.tabs .tab a.active,.tabs .tab a:hover{background-color:transparent;color:#ee6e73}.tabs .tab.disabled a,.tabs .tab.disabled a:hover{color:rgba(238,110,115,.7);cursor:default}.tabs .indicator{position:absolute;bottom:0;height:2px;background-color:#f6b2b5;will-change:left,right}@media only screen and (max-width:992px){.tabs{display:flex}.tabs .tab{-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1}.tabs .tab a{padding:0 12px}}.material-tooltip{padding:10px 8px;font-size:1rem;z-index:2000;background-color:transparent;border-radius:2px;color:#fff;min-height:36px;line-height:120%;text-align:center;max-width:calc(100% - 4px);overflow:hidden;left:0;top:0;pointer-events:none}.backdrop,.material-tooltip{opacity:0;position:absolute;visibility:hidden}.backdrop{height:7px;width:14px;border-radius:0 0 50% 50%;background-color:#323232;z-index:-1;transform-origin:50% 0}.btn,.btn-flat,.btn-large{border:none;border-radius:2px;display:inline-block;height:36px;line-height:36px;padding:0 2rem;text-transform:uppercase;vertical-align:middle;-webkit-tap-highlight-color:transparent}.btn-flat.disabled,.btn-flat:disabled,.btn-flat[disabled],.btn-floating.disabled,.btn-floating:disabled,.btn-floating[disabled],.btn-large.disabled,.btn-large:disabled,.btn-large[disabled],.btn.disabled,.btn:disabled,.btn[disabled],.disabled.btn-large,[disabled].btn-large{pointer-events:none;background-color:#dfdfdf!important;box-shadow:none;color:#9f9f9f!important;cursor:default}.btn-flat.disabled:hover,.btn-flat:disabled:hover,.btn-flat[disabled]:hover,.btn-floating.disabled:hover,.btn-floating:disabled:hover,.btn-floating[disabled]:hover,.btn-large.disabled:hover,.btn-large:disabled:hover,.btn-large[disabled]:hover,.btn.disabled:hover,.btn:disabled:hover,.btn[disabled]:hover,.disabled.btn-large:hover,[disabled].btn-large:hover{background-color:#dfdfdf!important;color:#9f9f9f!important}.btn,.btn-flat,.btn-floating,.btn-large{font-size:1rem;outline:0}.btn-flat i,.btn-floating i,.btn-large i,.btn i{font-size:1.3rem;line-height:inherit}.btn-floating:focus,.btn-large:focus,.btn:focus{background-color:#1d7d74}.btn,.btn-large{text-decoration:none;color:#fff;background-color:#26a69a;text-align:center;letter-spacing:.5px;transition:.2s ease-out;cursor:pointer}.btn-large:hover,.btn:hover{background-color:#2bbbad}.btn-floating{display:inline-block;color:#fff;position:relative;overflow:hidden;z-index:1;width:40px;height:40px;line-height:40px;padding:0;border-radius:50%;transition:.3s;cursor:pointer;vertical-align:middle}.btn-floating,.btn-floating:hover{background-color:#26a69a}.btn-floating:before{border-radius:0}.btn-floating.btn-large{width:56px;height:56px}.btn-floating.btn-large.halfway-fab{bottom:-28px}.btn-floating.btn-large i{line-height:56px}.btn-floating.halfway-fab{position:absolute;right:24px;bottom:-20px}.btn-floating.halfway-fab.left{right:auto;left:24px}.btn-floating i{width:inherit;display:inline-block;text-align:center;color:#fff;font-size:1.6rem;line-height:40px}button.btn-floating{border:none}.fixed-action-btn{position:fixed;right:23px;bottom:23px;padding-top:15px;margin-bottom:0;z-index:998}.fixed-action-btn.active ul{visibility:visible}.fixed-action-btn.horizontal{padding:0 0 0 15px}.fixed-action-btn.horizontal ul{text-align:right;right:64px;top:50%;transform:translateY(-50%);height:100%;left:auto;width:500px}.fixed-action-btn.horizontal ul li{display:inline-block;margin:15px 15px 0 0}.fixed-action-btn.toolbar{padding:0;height:56px}.fixed-action-btn.toolbar.active>a i{opacity:0}.fixed-action-btn.toolbar ul{display:flex;top:0;bottom:0}.fixed-action-btn.toolbar ul li{flex:1;display:inline-block;margin:0;height:100%;transition:none}.fixed-action-btn.toolbar ul li a{display:block;overflow:hidden;position:relative;width:100%;height:100%;background-color:transparent;box-shadow:none;color:#fff;line-height:56px;z-index:1}.fixed-action-btn.toolbar ul li a i{line-height:inherit}.fixed-action-btn ul{left:0;right:0;text-align:center;position:absolute;bottom:64px;margin:0;visibility:hidden}.fixed-action-btn ul li{margin-bottom:15px}.fixed-action-btn ul a.btn-floating{opacity:0}.fixed-action-btn .fab-backdrop{position:absolute;top:0;left:0;z-index:-1;width:40px;height:40px;background-color:#26a69a;border-radius:50%;transform:scale(0)}.btn-flat{background-color:transparent;color:#343434;cursor:pointer;transition:background-color .2s}.btn-flat,.btn-flat:focus,.btn-flat:hover{box-shadow:none}.btn-flat:focus{background-color:rgba(0,0,0,.1)}.btn-flat.disabled{background-color:transparent!important;color:#b3b3b3!important;cursor:default}.btn-large{height:54px;line-height:54px}.btn-large i{font-size:1.6rem}.btn-block{display:block}.dropdown-content{background-color:#fff;margin:0;display:none;min-width:100px;max-height:650px;overflow-y:auto;opacity:0;position:absolute;z-index:999;will-change:width,height}.dropdown-content li{clear:both;color:rgba(0,0,0,.87);cursor:pointer;min-height:50px;line-height:1.5rem;width:100%;text-align:left;text-transform:none}.dropdown-content li.active,.dropdown-content li.selected,.dropdown-content li:hover{background-color:#eee}.dropdown-content li.active.selected{background-color:#e1e1e1}.dropdown-content li.divider{min-height:0;height:1px}.dropdown-content li>a,.dropdown-content li>span{font-size:16px;color:#26a69a;display:block;line-height:22px;padding:14px 16px}.dropdown-content li>span>label{top:1px;left:0;height:18px}.dropdown-content li>a>i{height:inherit;line-height:inherit;float:left;margin:0 24px 0 0;width:24px}.input-field.col .dropdown-content [type=checkbox]+label{top:1px;left:0;height:18px}/*!\n * Waves v0.6.0\n * http://fian.my.id/Waves\n *\n * Copyright 2014 Alfiana E. Sibuea and other contributors\n * Released under the MIT license\n * https://github.com/fians/Waves/blob/master/LICENSE\n */.waves-effect{position:relative;cursor:pointer;display:inline-block;overflow:hidden;user-select:none;-webkit-tap-highlight-color:transparent;vertical-align:middle;z-index:1;transition:.3s ease-out}.waves-effect .waves-ripple{position:absolute;border-radius:50%;width:20px;height:20px;margin-top:-10px;margin-left:-10px;opacity:0;background:rgba(0,0,0,.2);transition:all .7s ease-out;transition-property:transform,opacity;transform:scale(0);pointer-events:none}.waves-effect.waves-light .waves-ripple{background-color:hsla(0,0%,100%,.45)}.waves-effect.waves-red .waves-ripple{background-color:rgba(244,67,54,.7)}.waves-effect.waves-yellow .waves-ripple{background-color:rgba(255,235,59,.7)}.waves-effect.waves-orange .waves-ripple{background-color:rgba(255,152,0,.7)}.waves-effect.waves-purple .waves-ripple{background-color:rgba(156,39,176,.7)}.waves-effect.waves-green .waves-ripple{background-color:rgba(76,175,80,.7)}.waves-effect.waves-teal .waves-ripple{background-color:rgba(0,150,136,.7)}.waves-effect input[type=button],.waves-effect input[type=reset],.waves-effect input[type=submit]{border:0;font-style:normal;font-size:inherit;text-transform:inherit;background:none}.waves-effect img{position:relative;z-index:-1}.waves-notransition{transition:none!important}.waves-circle{transform:translateZ(0);-webkit-mask-image:-webkit-radial-gradient(circle,#fff 100%,#000 0)}.waves-input-wrapper{border-radius:.2em;vertical-align:bottom}.waves-input-wrapper .waves-button-input{position:relative;top:0;left:0;z-index:1}.waves-circle{text-align:center;width:2.5em;height:2.5em;line-height:2.5em;border-radius:50%;-webkit-mask-image:none}.waves-block{display:block}.waves-effect .waves-ripple{z-index:-1}.modal{display:none;position:fixed;left:0;right:0;background-color:#fafafa;padding:0;max-height:70%;width:55%;margin:auto;overflow-y:auto;border-radius:2px;will-change:top,opacity}@media only screen and (max-width:992px){.modal{width:80%}}.modal h1,.modal h2,.modal h3,.modal h4{margin-top:0}.modal .modal-content{padding:24px}.modal .modal-close{cursor:pointer}.modal .modal-footer{border-radius:0 0 2px 2px;background-color:#fafafa;padding:4px 6px;height:56px;width:100%}.modal .modal-footer .btn,.modal .modal-footer .btn-flat,.modal .modal-footer .btn-large{float:right;margin:6px 0}.modal-overlay{position:fixed;z-index:999;top:-100px;left:0;bottom:0;right:0;height:125%;width:100%;background:#000;display:none;will-change:opacity}.modal.modal-fixed-footer{padding:0;height:70%}.modal.modal-fixed-footer .modal-content{position:absolute;height:calc(100% - 56px);max-height:100%;width:100%;overflow-y:auto}.modal.modal-fixed-footer .modal-footer{border-top:1px solid rgba(0,0,0,.1);position:absolute;bottom:0}.modal.bottom-sheet{top:auto;bottom:-100%;margin:0;width:100%;max-height:45%;border-radius:0;will-change:bottom,opacity}.collapsible{border-top:1px solid #ddd;border-right:1px solid #ddd;border-left:1px solid #ddd;margin:.5rem 0 1rem}.collapsible-header{display:block;cursor:pointer;-webkit-tap-highlight-color:transparent;min-height:3rem;line-height:3rem;padding:0 1rem;background-color:#fff;border-bottom:1px solid #ddd}.collapsible-header i{width:2rem;font-size:1.6rem;line-height:3rem;display:block;float:left;text-align:center;margin-right:1rem}.collapsible-body{display:none;border-bottom:1px solid #ddd;box-sizing:border-box;padding:2rem}.side-nav .collapsible,.side-nav.fixed .collapsible{border:none;box-shadow:none}.side-nav .collapsible li,.side-nav.fixed .collapsible li{padding:0}.side-nav .collapsible-header,.side-nav.fixed .collapsible-header{background-color:transparent;border:none;line-height:inherit;height:inherit;padding:0 16px}.side-nav .collapsible-header:hover,.side-nav.fixed .collapsible-header:hover{background-color:rgba(0,0,0,.05)}.side-nav .collapsible-header i,.side-nav.fixed .collapsible-header i{line-height:inherit}.side-nav .collapsible-body,.side-nav.fixed .collapsible-body{border:0;background-color:#fff}.side-nav .collapsible-body li a,.side-nav.fixed .collapsible-body li a{padding:0 23.5px 0 31px}.collapsible.popout{border:none;box-shadow:none}.collapsible.popout>li{box-shadow:0 2px 5px 0 rgba(0,0,0,.16),0 2px 10px 0 rgba(0,0,0,.12);margin:0 24px;transition:margin .35s cubic-bezier(.25,.46,.45,.94)}.collapsible.popout>li.active{box-shadow:0 5px 11px 0 rgba(0,0,0,.18),0 4px 15px 0 rgba(0,0,0,.15);margin:16px 0}.chip{display:inline-block;height:32px;font-size:13px;font-weight:500;color:rgba(0,0,0,.6);line-height:32px;padding:0 12px;border-radius:16px;background-color:#e4e4e4;margin-bottom:5px;margin-right:5px}.chip>img{float:left;margin:0 8px 0 -12px;height:32px;width:32px;border-radius:50%}.chip .close{cursor:pointer;float:right;font-size:16px;line-height:32px;padding-left:8px}.chips{border:none;border-bottom:1px solid #9e9e9e;box-shadow:none;margin:0 0 20px;min-height:45px;outline:none;transition:all .3s}.chips.focus{border-bottom:1px solid #26a69a;box-shadow:0 1px 0 0 #26a69a}.chips:hover{cursor:text}.chips .chip.selected{background-color:#26a69a;color:#fff}.chips .input{background:none;border:0;color:rgba(0,0,0,.6);display:inline-block;font-size:1rem;height:3rem;line-height:32px;outline:0;margin:0;padding:0!important;width:120px!important}.chips .input:focus{border:0!important;box-shadow:none!important}.chips .autocomplete-content{margin-top:0}.prefix~.chips{margin-left:3rem;width:92%;width:calc(100% - 3rem)}.chips:empty~label{font-size:.8rem;transform:translateY(-140%)}.materialboxed{display:block;cursor:zoom-in;position:relative;transition:opacity .4s;-webkit-backface-visibility:hidden}.materialboxed:hover:not(.active){opacity:.8}.materialboxed.active{cursor:zoom-out}#materialbox-overlay{top:0;right:0;background-color:#292929;will-change:opacity}#materialbox-overlay,.materialbox-caption{position:fixed;bottom:0;left:0;z-index:1000}.materialbox-caption{display:none;color:#fff;line-height:50px;width:100%;text-align:center;padding:0 15%;height:50px;-webkit-font-smoothing:antialiased}select:focus{outline:1px solid #c9f3ef}button:focus{outline:none;background-color:#2ab7a9}label{font-size:.8rem;color:#9e9e9e}::-webkit-input-placeholder{color:#d1d1d1}:-moz-placeholder,::-moz-placeholder{color:#d1d1d1}:-ms-input-placeholder{color:#d1d1d1}input:not([type]),input[type=date],input[type=datetime-local],input[type=datetime],input[type=email],input[type=number],input[type=password],input[type=search],input[type=tel],input[type=text],input[type=time],input[type=url],textarea.materialize-textarea{background-color:transparent;border:none;border-bottom:1px solid #9e9e9e;border-radius:0;outline:none;height:3rem;width:100%;font-size:1rem;margin:0 0 20px;padding:0;box-shadow:none;box-sizing:content-box;transition:all .3s}input:not([type]):disabled,input:not([type])[readonly=readonly],input[type=date]:disabled,input[type=date][readonly=readonly],input[type=datetime-local]:disabled,input[type=datetime-local][readonly=readonly],input[type=datetime]:disabled,input[type=datetime][readonly=readonly],input[type=email]:disabled,input[type=email][readonly=readonly],input[type=number]:disabled,input[type=number][readonly=readonly],input[type=password]:disabled,input[type=password][readonly=readonly],input[type=search]:disabled,input[type=search][readonly=readonly],input[type=tel]:disabled,input[type=tel][readonly=readonly],input[type=text]:disabled,input[type=text][readonly=readonly],input[type=time]:disabled,input[type=time][readonly=readonly],input[type=url]:disabled,input[type=url][readonly=readonly],textarea.materialize-textarea:disabled,textarea.materialize-textarea[readonly=readonly]{color:rgba(0,0,0,.26);border-bottom:1px dotted rgba(0,0,0,.26)}input:not([type]):disabled+label,input:not([type])[readonly=readonly]+label,input[type=date]:disabled+label,input[type=date][readonly=readonly]+label,input[type=datetime-local]:disabled+label,input[type=datetime-local][readonly=readonly]+label,input[type=datetime]:disabled+label,input[type=datetime][readonly=readonly]+label,input[type=email]:disabled+label,input[type=email][readonly=readonly]+label,input[type=number]:disabled+label,input[type=number][readonly=readonly]+label,input[type=password]:disabled+label,input[type=password][readonly=readonly]+label,input[type=search]:disabled+label,input[type=search][readonly=readonly]+label,input[type=tel]:disabled+label,input[type=tel][readonly=readonly]+label,input[type=text]:disabled+label,input[type=text][readonly=readonly]+label,input[type=time]:disabled+label,input[type=time][readonly=readonly]+label,input[type=url]:disabled+label,input[type=url][readonly=readonly]+label,textarea.materialize-textarea:disabled+label,textarea.materialize-textarea[readonly=readonly]+label{color:rgba(0,0,0,.26)}input:not([type]):focus:not([readonly]),input[type=date]:focus:not([readonly]),input[type=datetime-local]:focus:not([readonly]),input[type=datetime]:focus:not([readonly]),input[type=email]:focus:not([readonly]),input[type=number]:focus:not([readonly]),input[type=password]:focus:not([readonly]),input[type=search]:focus:not([readonly]),input[type=tel]:focus:not([readonly]),input[type=text]:focus:not([readonly]),input[type=time]:focus:not([readonly]),input[type=url]:focus:not([readonly]),textarea.materialize-textarea:focus:not([readonly]){border-bottom:1px solid #26a69a;box-shadow:0 1px 0 0 #26a69a}input:not([type]):focus:not([readonly])+label,input[type=date]:focus:not([readonly])+label,input[type=datetime-local]:focus:not([readonly])+label,input[type=datetime]:focus:not([readonly])+label,input[type=email]:focus:not([readonly])+label,input[type=number]:focus:not([readonly])+label,input[type=password]:focus:not([readonly])+label,input[type=search]:focus:not([readonly])+label,input[type=tel]:focus:not([readonly])+label,input[type=text]:focus:not([readonly])+label,input[type=time]:focus:not([readonly])+label,input[type=url]:focus:not([readonly])+label,textarea.materialize-textarea:focus:not([readonly])+label{color:#26a69a}input:not([type]).valid,input:not([type]):focus.valid,input[type=date].valid,input[type=date]:focus.valid,input[type=datetime-local].valid,input[type=datetime-local]:focus.valid,input[type=datetime].valid,input[type=datetime]:focus.valid,input[type=email].valid,input[type=email]:focus.valid,input[type=number].valid,input[type=number]:focus.valid,input[type=password].valid,input[type=password]:focus.valid,input[type=search].valid,input[type=search]:focus.valid,input[type=tel].valid,input[type=tel]:focus.valid,input[type=text].valid,input[type=text]:focus.valid,input[type=time].valid,input[type=time]:focus.valid,input[type=url].valid,input[type=url]:focus.valid,textarea.materialize-textarea.valid,textarea.materialize-textarea:focus.valid{border-bottom:1px solid #4caf50;box-shadow:0 1px 0 0 #4caf50}input:not([type]).valid+label:after,input:not([type]):focus.valid+label:after,input[type=date].valid+label:after,input[type=date]:focus.valid+label:after,input[type=datetime-local].valid+label:after,input[type=datetime-local]:focus.valid+label:after,input[type=datetime].valid+label:after,input[type=datetime]:focus.valid+label:after,input[type=email].valid+label:after,input[type=email]:focus.valid+label:after,input[type=number].valid+label:after,input[type=number]:focus.valid+label:after,input[type=password].valid+label:after,input[type=password]:focus.valid+label:after,input[type=search].valid+label:after,input[type=search]:focus.valid+label:after,input[type=tel].valid+label:after,input[type=tel]:focus.valid+label:after,input[type=text].valid+label:after,input[type=text]:focus.valid+label:after,input[type=time].valid+label:after,input[type=time]:focus.valid+label:after,input[type=url].valid+label:after,input[type=url]:focus.valid+label:after,textarea.materialize-textarea.valid+label:after,textarea.materialize-textarea:focus.valid+label:after{content:attr(data-success);color:#4caf50;opacity:1}input:not([type]).invalid,input:not([type]):focus.invalid,input[type=date].invalid,input[type=date]:focus.invalid,input[type=datetime-local].invalid,input[type=datetime-local]:focus.invalid,input[type=datetime].invalid,input[type=datetime]:focus.invalid,input[type=email].invalid,input[type=email]:focus.invalid,input[type=number].invalid,input[type=number]:focus.invalid,input[type=password].invalid,input[type=password]:focus.invalid,input[type=search].invalid,input[type=search]:focus.invalid,input[type=tel].invalid,input[type=tel]:focus.invalid,input[type=text].invalid,input[type=text]:focus.invalid,input[type=time].invalid,input[type=time]:focus.invalid,input[type=url].invalid,input[type=url]:focus.invalid,textarea.materialize-textarea.invalid,textarea.materialize-textarea:focus.invalid{border-bottom:1px solid #f44336;box-shadow:0 1px 0 0 #f44336}input:not([type]).invalid+label:after,input:not([type]):focus.invalid+label:after,input[type=date].invalid+label:after,input[type=date]:focus.invalid+label:after,input[type=datetime-local].invalid+label:after,input[type=datetime-local]:focus.invalid+label:after,input[type=datetime].invalid+label:after,input[type=datetime]:focus.invalid+label:after,input[type=email].invalid+label:after,input[type=email]:focus.invalid+label:after,input[type=number].invalid+label:after,input[type=number]:focus.invalid+label:after,input[type=password].invalid+label:after,input[type=password]:focus.invalid+label:after,input[type=search].invalid+label:after,input[type=search]:focus.invalid+label:after,input[type=tel].invalid+label:after,input[type=tel]:focus.invalid+label:after,input[type=text].invalid+label:after,input[type=text]:focus.invalid+label:after,input[type=time].invalid+label:after,input[type=time]:focus.invalid+label:after,input[type=url].invalid+label:after,input[type=url]:focus.invalid+label:after,textarea.materialize-textarea.invalid+label:after,textarea.materialize-textarea:focus.invalid+label:after{content:attr(data-error);color:#f44336;opacity:1}input:not([type]).validate+label,input[type=date].validate+label,input[type=datetime-local].validate+label,input[type=datetime].validate+label,input[type=email].validate+label,input[type=number].validate+label,input[type=password].validate+label,input[type=search].validate+label,input[type=tel].validate+label,input[type=text].validate+label,input[type=time].validate+label,input[type=url].validate+label,textarea.materialize-textarea.validate+label{width:100%;pointer-events:none}input:not([type])+label:after,input[type=date]+label:after,input[type=datetime-local]+label:after,input[type=datetime]+label:after,input[type=email]+label:after,input[type=number]+label:after,input[type=password]+label:after,input[type=search]+label:after,input[type=tel]+label:after,input[type=text]+label:after,input[type=time]+label:after,input[type=url]+label:after,textarea.materialize-textarea+label:after{display:block;content:\"\";position:absolute;top:60px;opacity:0;transition:opacity .2s ease-out,color .2s ease-out}.input-field{position:relative;margin-top:1rem}.input-field.inline{display:inline-block;vertical-align:middle;margin-left:5px}.input-field.inline .select-dropdown,.input-field.inline input{margin-bottom:1rem}.input-field.col label{left:.75rem}.input-field.col .prefix~.validate~label,.input-field.col .prefix~label{width:calc(100% - 3rem - 1.5rem)}.input-field label{color:#9e9e9e;position:absolute;top:.8rem;left:0;font-size:1rem;cursor:text;transition:.2s ease-out;text-align:initial}.input-field label:not(.label-icon).active{font-size:.8rem;transform:translateY(-140%)}.input-field .prefix{position:absolute;width:3rem;font-size:2rem;transition:color .2s}.input-field .prefix.active{color:#26a69a}.input-field .prefix~.autocomplete-content,.input-field .prefix~.validate~label,.input-field .prefix~input,.input-field .prefix~label,.input-field .prefix~textarea{margin-left:3rem;width:92%;width:calc(100% - 3rem)}.input-field .prefix~label{margin-left:3rem}@media only screen and (max-width:992px){.input-field .prefix~input{width:86%;width:calc(100% - 3rem)}}@media only screen and (max-width:600px){.input-field .prefix~input{width:80%;width:calc(100% - 3rem)}}.input-field input[type=search]{display:block;line-height:inherit;padding-left:4rem;width:calc(100% - 4rem)}.input-field input[type=search]:focus{background-color:#fff;border:0;box-shadow:none;color:#444}.input-field input[type=search]:focus+label i,.input-field input[type=search]:focus~.material-icons,.input-field input[type=search]:focus~.mdi-navigation-close{color:#444}.input-field input[type=search]+label{left:1rem}.input-field input[type=search]~.material-icons,.input-field input[type=search]~.mdi-navigation-close{position:absolute;top:0;right:1rem;color:transparent;cursor:pointer;font-size:2rem;transition:color .3s}textarea{width:100%;height:3rem;background-color:transparent}textarea.materialize-textarea{overflow-y:hidden;padding:.8rem 0 1.6rem;resize:none;min-height:3rem}.hiddendiv{display:none;white-space:pre-wrap;word-wrap:break-word;overflow-wrap:break-word;padding-top:1.2rem;position:absolute;top:0}.autocomplete-content{margin-top:-20px;display:block;opacity:1;position:static}.autocomplete-content li .highlight{color:#444}.autocomplete-content li img{height:40px;width:40px;margin:5px 15px}[type=radio]:checked,[type=radio]:not(:checked){position:absolute;left:-9999px;opacity:0}[type=radio]:checked+label,[type=radio]:not(:checked)+label{position:relative;padding-left:35px;cursor:pointer;display:inline-block;height:25px;line-height:25px;font-size:1rem;transition:.28s ease;user-select:none}[type=radio]+label:after,[type=radio]+label:before{content:\"\";position:absolute;left:0;top:0;margin:4px;width:16px;height:16px;z-index:0;transition:.28s ease}[type=radio].with-gap:checked+label:after,[type=radio].with-gap:checked+label:before,[type=radio]:checked+label:after,[type=radio]:checked+label:before,[type=radio]:not(:checked)+label:after,[type=radio]:not(:checked)+label:before{border-radius:50%}[type=radio]:not(:checked)+label:after,[type=radio]:not(:checked)+label:before{border:2px solid #5a5a5a}[type=radio]:not(:checked)+label:after{transform:scale(0)}[type=radio]:checked+label:before{border:2px solid transparent}[type=radio].with-gap:checked+label:after,[type=radio].with-gap:checked+label:before,[type=radio]:checked+label:after{border:2px solid #26a69a}[type=radio].with-gap:checked+label:after,[type=radio]:checked+label:after{background-color:#26a69a}[type=radio]:checked+label:after{transform:scale(1.02)}[type=radio].with-gap:checked+label:after{transform:scale(.5)}[type=radio].tabbed:focus+label:before{box-shadow:0 0 0 10px rgba(0,0,0,.1)}[type=radio].with-gap:disabled:checked+label:before{border:2px solid rgba(0,0,0,.26)}[type=radio].with-gap:disabled:checked+label:after{border:none;background-color:rgba(0,0,0,.26)}[type=radio]:disabled:checked+label:before,[type=radio]:disabled:not(:checked)+label:before{background-color:transparent;border-color:rgba(0,0,0,.26)}[type=radio]:disabled+label{color:rgba(0,0,0,.26)}[type=radio]:disabled:not(:checked)+label:before{border-color:rgba(0,0,0,.26)}[type=radio]:disabled:checked+label:after{background-color:rgba(0,0,0,.26);border-color:#bdbdbd}form p{margin-bottom:10px;text-align:left}form p:last-child{margin-bottom:0}[type=checkbox]:checked,[type=checkbox]:not(:checked){position:absolute;left:-9999px;opacity:0}[type=checkbox]+label{position:relative;padding-left:35px;cursor:pointer;display:inline-block;height:25px;line-height:25px;font-size:1rem;-webkit-user-select:none;-moz-user-select:none;-khtml-user-select:none;-ms-user-select:none}[type=checkbox]+label:before,[type=checkbox]:not(.filled-in)+label:after{content:\"\";position:absolute;top:0;left:0;width:18px;height:18px;z-index:0;border:2px solid #5a5a5a;border-radius:1px;margin-top:2px;transition:.2s}[type=checkbox]:not(.filled-in)+label:after{border:0;transform:scale(0)}[type=checkbox]:not(:checked):disabled+label:before{border:none;background-color:rgba(0,0,0,.26)}[type=checkbox].tabbed:focus+label:after{transform:scale(1);border:0;border-radius:50%;box-shadow:0 0 0 10px rgba(0,0,0,.1);background-color:rgba(0,0,0,.1)}[type=checkbox]:checked+label:before{top:-4px;left:-5px;width:12px;height:22px;border-top:2px solid transparent;border-left:2px solid transparent;border-right:2px solid #26a69a;border-bottom:2px solid #26a69a;transform:rotate(40deg);backface-visibility:hidden;transform-origin:100% 100%}[type=checkbox]:checked:disabled+label:before{border-right:2px solid rgba(0,0,0,.26);border-bottom:2px solid rgba(0,0,0,.26)}[type=checkbox]:indeterminate+label:before{top:-11px;left:-12px;width:10px;height:22px;border-top:none;border-left:none;border-right:2px solid #26a69a;border-bottom:none;transform:rotate(90deg);backface-visibility:hidden;transform-origin:100% 100%}[type=checkbox]:indeterminate:disabled+label:before{border-right:2px solid rgba(0,0,0,.26);background-color:transparent}[type=checkbox].filled-in+label:after{border-radius:2px}[type=checkbox].filled-in+label:after,[type=checkbox].filled-in+label:before{content:\"\";left:0;position:absolute;transition:border .25s,background-color .25s,width .2s .1s,height .2s .1s,top .2s .1s,left .2s .1s;z-index:1}[type=checkbox].filled-in:not(:checked)+label:before{width:0;height:0;border:3px solid transparent;left:6px;top:10px;-webkit-transform:rotate(37deg);transform:rotate(37deg);-webkit-transform-origin:20% 40%;transform-origin:100% 100%}[type=checkbox].filled-in:not(:checked)+label:after{height:20px;width:20px;background-color:transparent;border:2px solid #5a5a5a;top:0;z-index:0}[type=checkbox].filled-in:checked+label:before{top:0;left:1px;width:8px;height:13px;border-top:2px solid transparent;border-left:2px solid transparent;border-right:2px solid #fff;border-bottom:2px solid #fff;-webkit-transform:rotate(37deg);transform:rotate(37deg);-webkit-transform-origin:100% 100%;transform-origin:100% 100%}[type=checkbox].filled-in:checked+label:after{top:0;width:20px;height:20px;border:2px solid #26a69a;background-color:#26a69a;z-index:0}[type=checkbox].filled-in.tabbed:focus+label:after{border-radius:2px;border-color:#5a5a5a;background-color:rgba(0,0,0,.1)}[type=checkbox].filled-in.tabbed:checked:focus+label:after{border-radius:2px;background-color:#26a69a;border-color:#26a69a}[type=checkbox].filled-in:disabled:not(:checked)+label:before{background-color:transparent;border:2px solid transparent}[type=checkbox].filled-in:disabled:not(:checked)+label:after{border-color:transparent;background-color:#bdbdbd}[type=checkbox].filled-in:disabled:checked+label:before{background-color:transparent}[type=checkbox].filled-in:disabled:checked+label:after{background-color:#bdbdbd;border-color:#bdbdbd}.switch,.switch *{-webkit-user-select:none;-moz-user-select:none;-khtml-user-select:none;-ms-user-select:none}.switch label{cursor:pointer}.switch label input[type=checkbox]{opacity:0;width:0;height:0}.switch label input[type=checkbox]:checked+.lever{background-color:#84c7c1}.switch label input[type=checkbox]:checked+.lever:after{background-color:#26a69a;left:24px}.switch label .lever{content:\"\";display:inline-block;position:relative;width:40px;height:15px;background-color:#818181;border-radius:15px;margin-right:10px;transition:background .3s ease;vertical-align:middle;margin:0 16px}.switch label .lever:after{content:\"\";position:absolute;display:inline-block;width:21px;height:21px;background-color:#f1f1f1;border-radius:21px;box-shadow:0 1px 3px 1px rgba(0,0,0,.4);left:-5px;top:-3px;transition:left .3s ease,background .3s ease,box-shadow .1s ease}input[type=checkbox]:checked:not(:disabled).tabbed:focus~.lever:after,input[type=checkbox]:checked:not(:disabled)~.lever:active:after{box-shadow:0 1px 3px 1px rgba(0,0,0,.4),0 0 0 15px rgba(38,166,154,.1)}input[type=checkbox]:not(:disabled).tabbed:focus~.lever:after,input[type=checkbox]:not(:disabled)~.lever:active:after{box-shadow:0 1px 3px 1px rgba(0,0,0,.4),0 0 0 15px rgba(0,0,0,.08)}.switch input[type=checkbox][disabled]+.lever{cursor:default}.switch label input[type=checkbox][disabled]+.lever:after,.switch label input[type=checkbox][disabled]:checked+.lever:after{background-color:#bdbdbd}select{display:none}select.browser-default{display:block}select{background-color:hsla(0,0%,100%,.9);width:100%;padding:5px;border:1px solid #f2f2f2;border-radius:2px;height:3rem}.select-label{position:absolute}.select-wrapper{position:relative}.select-wrapper input.select-dropdown{position:relative;cursor:pointer;background-color:transparent;border:none;border-bottom:1px solid #9e9e9e;outline:none;height:3rem;line-height:3rem;width:100%;font-size:1rem;margin:0 0 20px;padding:0;display:block}.select-wrapper span.caret{color:initial;position:absolute;right:0;top:0;bottom:0;height:10px;margin:auto 0;font-size:10px;line-height:10px}.select-wrapper span.caret.disabled{color:rgba(0,0,0,.26)}.select-wrapper+label{position:absolute;top:-14px;font-size:.8rem}select:disabled{color:rgba(0,0,0,.3)}.select-wrapper input.select-dropdown:disabled{color:rgba(0,0,0,.3);cursor:default;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;border-bottom:1px solid rgba(0,0,0,.3)}.select-wrapper i{color:rgba(0,0,0,.3)}.select-dropdown li.disabled,.select-dropdown li.disabled>span,.select-dropdown li.optgroup{color:rgba(0,0,0,.3);background-color:transparent}.prefix~.select-wrapper{margin-left:3rem;width:92%;width:calc(100% - 3rem)}.prefix~label{margin-left:3rem}.select-dropdown li img{height:40px;width:40px;margin:5px 15px;float:right}.select-dropdown li.optgroup{border-top:1px solid #eee}.select-dropdown li.optgroup.selected>span{color:rgba(0,0,0,.7)}.select-dropdown li.optgroup>span{color:rgba(0,0,0,.4)}.select-dropdown li.optgroup~li.optgroup-option{padding-left:1rem}.file-field{position:relative}.file-field .file-path-wrapper{overflow:hidden;padding-left:10px}.file-field input.file-path{width:100%}.file-field .btn,.file-field .btn-large{float:left;height:3rem;line-height:3rem}.file-field span{cursor:pointer}.file-field input[type=file]{position:absolute;top:0;right:0;left:0;bottom:0;width:100%;margin:0;padding:0;font-size:20px;cursor:pointer;opacity:0;filter:alpha(opacity=0)}.range-field{position:relative}input[type=range],input[type=range]+.thumb{cursor:pointer}input[type=range]{position:relative;background-color:transparent;border:none;outline:none;width:100%;margin:15px 0;padding:0}input[type=range]:focus{outline:none}input[type=range]+.thumb{position:absolute;top:10px;left:0;border:none;height:0;width:0;border-radius:50%;background-color:#26a69a;margin-left:7px;transform-origin:50% 50%;transform:rotate(-45deg)}input[type=range]+.thumb .value{display:block;width:30px;text-align:center;color:#26a69a;font-size:0;transform:rotate(45deg)}input[type=range]+.thumb.active{border-radius:50% 50% 50% 0}input[type=range]+.thumb.active .value{color:#fff;margin-left:-1px;margin-top:8px;font-size:10px}input[type=range]{-webkit-appearance:none}input[type=range]::-webkit-slider-runnable-track{height:3px;background:#c2c0c2;border:none}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;border:none;height:14px;width:14px;border-radius:50%;background-color:#26a69a;transform-origin:50% 50%;margin:-5px 0 0;transition:.3s}input[type=range]:focus::-webkit-slider-runnable-track{background:#ccc}input[type=range]{border:1px solid #fff}input[type=range]::-moz-range-track{height:3px;background:#ddd;border:none}input[type=range]::-moz-range-thumb{border:none;height:14px;width:14px;border-radius:50%;background:#26a69a;margin-top:-5px}input[type=range]:-moz-focusring{outline:1px solid #fff;outline-offset:-1px}input[type=range]:focus::-moz-range-track{background:#ccc}input[type=range]::-ms-track{height:3px;background:transparent;border-color:transparent;border-width:6px 0;color:transparent}input[type=range]::-ms-fill-lower{background:#777}input[type=range]::-ms-fill-upper{background:#ddd}input[type=range]::-ms-thumb{border:none;height:14px;width:14px;border-radius:50%;background:#26a69a}input[type=range]:focus::-ms-fill-lower{background:#888}input[type=range]:focus::-ms-fill-upper{background:#ccc}.table-of-contents.fixed{position:fixed}.table-of-contents li{padding:2px 0}.table-of-contents a{font-weight:300;color:#757575;padding-left:20px;height:1.5rem;line-height:1.5rem;letter-spacing:.4;display:inline-block}.table-of-contents a:hover{color:#a8a8a8;padding-left:19px;border-left:1px solid #ee6e73}.table-of-contents a.active{font-weight:500;padding-left:18px;border-left:2px solid #ee6e73}.side-nav{position:fixed;width:300px;left:0;top:0;margin:0;transform:translateX(-100%);height:calc(100% + 60px);height:100%;padding-bottom:60px;background-color:#fff;z-index:999;overflow-y:auto;will-change:transform;backface-visibility:hidden;transform:translateX(-105%)}.side-nav.right-aligned{right:0;transform:translateX(105%);left:auto;transform:translateX(100%)}.side-nav .collapsible{margin:0}.side-nav li{float:none;line-height:48px}.side-nav li.active{background-color:rgba(0,0,0,.05)}.side-nav li>a{color:rgba(0,0,0,.87);display:block;font-size:14px;font-weight:500;height:48px;line-height:48px;padding:0 32px}.side-nav li>a:hover{background-color:rgba(0,0,0,.05)}.side-nav li>a.btn,.side-nav li>a.btn-flat,.side-nav li>a.btn-floating,.side-nav li>a.btn-large{margin:10px 15px}.side-nav li>a.btn,.side-nav li>a.btn-floating,.side-nav li>a.btn-large{color:#fff}.side-nav li>a.btn-flat{color:#343434}.side-nav li>a.btn-large:hover,.side-nav li>a.btn:hover{background-color:#2bbbad}.side-nav li>a.btn-floating:hover{background-color:#26a69a}.side-nav li>a>[class^=mdi-],.side-nav li>a>i,.side-nav li>a>i.material-icons,.side-nav li>a li>a>[class*=mdi-]{float:left;height:48px;line-height:48px;margin:0 32px 0 0;width:24px;color:rgba(0,0,0,.54)}.side-nav .divider{margin:8px 0 0}.side-nav .subheader{cursor:auto;pointer-events:none;color:rgba(0,0,0,.54);font-size:14px;font-weight:500;line-height:48px}.side-nav .subheader:hover{background-color:transparent}.side-nav .userView{position:relative;padding:32px 32px 0;margin-bottom:8px}.side-nav .userView>a{height:auto;padding:0}.side-nav .userView>a:hover{background-color:transparent}.side-nav .userView .background{overflow:hidden;position:absolute;top:0;right:0;bottom:0;left:0;z-index:-1}.side-nav .userView .circle,.side-nav .userView .email,.side-nav .userView .name{display:block}.side-nav .userView .circle{height:64px;width:64px}.side-nav .userView .email,.side-nav .userView .name{font-size:14px;line-height:24px}.side-nav .userView .name{margin-top:16px;font-weight:500}.side-nav .userView .email{padding-bottom:16px;font-weight:400}.drag-target{height:100%;width:10px;position:fixed;top:0;z-index:998}.side-nav.fixed{left:0;transform:translateX(0);position:fixed}.side-nav.fixed.right-aligned{right:0;left:auto}@media only screen and (max-width:992px){.side-nav.fixed{transform:translateX(-105%)}.side-nav.fixed.right-aligned{transform:translateX(105%)}.side-nav a{padding:0 16px}.side-nav .userView{padding:16px 16px 0}}.side-nav .collapsible-body>ul:not(.collapsible)>li.active,.side-nav.fixed .collapsible-body>ul:not(.collapsible)>li.active{background-color:#ee6e73}.side-nav .collapsible-body>ul:not(.collapsible)>li.active a,.side-nav.fixed .collapsible-body>ul:not(.collapsible)>li.active a{color:#fff}.side-nav .collapsible-body{padding:0}#sidenav-overlay{position:fixed;top:0;left:0;right:0;height:120vh;background-color:rgba(0,0,0,.5);z-index:997;will-change:opacity}.preloader-wrapper{display:inline-block;position:relative;width:50px;height:50px}.preloader-wrapper.small{width:36px;height:36px}.preloader-wrapper.big{width:64px;height:64px}.preloader-wrapper.active{-webkit-animation:container-rotate 1568ms linear infinite;animation:container-rotate 1568ms linear infinite}@-webkit-keyframes container-rotate{to{-webkit-transform:rotate(1turn)}}@keyframes container-rotate{to{transform:rotate(1turn)}}.spinner-layer{position:absolute;width:100%;height:100%;opacity:0;border-color:#26a69a}.spinner-blue,.spinner-blue-only{border-color:#4285f4}.spinner-red,.spinner-red-only{border-color:#db4437}.spinner-yellow,.spinner-yellow-only{border-color:#f4b400}.spinner-green,.spinner-green-only{border-color:#0f9d58}.active .spinner-layer.spinner-blue{-webkit-animation:fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1) infinite both,blue-fade-in-out 5332ms cubic-bezier(.4,0,.2,1) infinite both;animation:fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1) infinite both,blue-fade-in-out 5332ms cubic-bezier(.4,0,.2,1) infinite both}.active .spinner-layer.spinner-red{-webkit-animation:fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1) infinite both,red-fade-in-out 5332ms cubic-bezier(.4,0,.2,1) infinite both;animation:fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1) infinite both,red-fade-in-out 5332ms cubic-bezier(.4,0,.2,1) infinite both}.active .spinner-layer.spinner-yellow{-webkit-animation:fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1) infinite both,yellow-fade-in-out 5332ms cubic-bezier(.4,0,.2,1) infinite both;animation:fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1) infinite both,yellow-fade-in-out 5332ms cubic-bezier(.4,0,.2,1) infinite both}.active .spinner-layer.spinner-green{-webkit-animation:fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1) infinite both,green-fade-in-out 5332ms cubic-bezier(.4,0,.2,1) infinite both;animation:fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1) infinite both,green-fade-in-out 5332ms cubic-bezier(.4,0,.2,1) infinite both}.active .spinner-layer,.active .spinner-layer.spinner-blue-only,.active .spinner-layer.spinner-green-only,.active .spinner-layer.spinner-red-only,.active .spinner-layer.spinner-yellow-only{opacity:1;-webkit-animation:fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1) infinite both;animation:fill-unfill-rotate 5332ms cubic-bezier(.4,0,.2,1) infinite both}@-webkit-keyframes fill-unfill-rotate{12.5%{-webkit-transform:rotate(135deg)}25%{-webkit-transform:rotate(270deg)}37.5%{-webkit-transform:rotate(405deg)}50%{-webkit-transform:rotate(540deg)}62.5%{-webkit-transform:rotate(675deg)}75%{-webkit-transform:rotate(810deg)}87.5%{-webkit-transform:rotate(945deg)}to{-webkit-transform:rotate(3turn)}}@keyframes fill-unfill-rotate{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}to{transform:rotate(3turn)}}@-webkit-keyframes blue-fade-in-out{0%{opacity:1}25%{opacity:1}26%{opacity:0}89%{opacity:0}90%{opacity:1}to{opacity:1}}@keyframes blue-fade-in-out{0%{opacity:1}25%{opacity:1}26%{opacity:0}89%{opacity:0}90%{opacity:1}to{opacity:1}}@-webkit-keyframes red-fade-in-out{0%{opacity:0}15%{opacity:0}25%{opacity:1}50%{opacity:1}51%{opacity:0}}@keyframes red-fade-in-out{0%{opacity:0}15%{opacity:0}25%{opacity:1}50%{opacity:1}51%{opacity:0}}@-webkit-keyframes yellow-fade-in-out{0%{opacity:0}40%{opacity:0}50%{opacity:1}75%{opacity:1}76%{opacity:0}}@keyframes yellow-fade-in-out{0%{opacity:0}40%{opacity:0}50%{opacity:1}75%{opacity:1}76%{opacity:0}}@-webkit-keyframes green-fade-in-out{0%{opacity:0}65%{opacity:0}75%{opacity:1}90%{opacity:1}to{opacity:0}}@keyframes green-fade-in-out{0%{opacity:0}65%{opacity:0}75%{opacity:1}90%{opacity:1}to{opacity:0}}.gap-patch{position:absolute;top:0;left:45%;width:10%;height:100%;overflow:hidden;border-color:inherit}.gap-patch .circle{width:1000%;left:-450%}.circle-clipper{display:inline-block;position:relative;width:50%;height:100%;overflow:hidden;border-color:inherit}.circle-clipper .circle{width:200%;height:100%;border-width:3px;border-style:solid;border-color:inherit;border-bottom-color:transparent!important;border-radius:50%;-webkit-animation:none;animation:none;position:absolute;top:0;right:0;bottom:0}.circle-clipper.left .circle{left:0;border-right-color:transparent!important;-webkit-transform:rotate(129deg);transform:rotate(129deg)}.circle-clipper.right .circle{left:-100%;border-left-color:transparent!important;-webkit-transform:rotate(-129deg);transform:rotate(-129deg)}.active .circle-clipper.left .circle{-webkit-animation:left-spin 1333ms cubic-bezier(.4,0,.2,1) infinite both;animation:left-spin 1333ms cubic-bezier(.4,0,.2,1) infinite both}.active .circle-clipper.right .circle{-webkit-animation:right-spin 1333ms cubic-bezier(.4,0,.2,1) infinite both;animation:right-spin 1333ms cubic-bezier(.4,0,.2,1) infinite both}@-webkit-keyframes left-spin{0%{-webkit-transform:rotate(130deg)}50%{-webkit-transform:rotate(-5deg)}to{-webkit-transform:rotate(130deg)}}@keyframes left-spin{0%{transform:rotate(130deg)}50%{transform:rotate(-5deg)}to{transform:rotate(130deg)}}@-webkit-keyframes right-spin{0%{-webkit-transform:rotate(-130deg)}50%{-webkit-transform:rotate(5deg)}to{-webkit-transform:rotate(-130deg)}}@keyframes right-spin{0%{transform:rotate(-130deg)}50%{transform:rotate(5deg)}to{transform:rotate(-130deg)}}#spinnerContainer.cooldown{-webkit-animation:container-rotate 1568ms linear infinite,fade-out .4s cubic-bezier(.4,0,.2,1);animation:container-rotate 1568ms linear infinite,fade-out .4s cubic-bezier(.4,0,.2,1)}@-webkit-keyframes fade-out{0%{opacity:1}to{opacity:0}}@keyframes fade-out{0%{opacity:1}to{opacity:0}}.slider{position:relative;height:400px;width:100%}.slider.fullscreen{height:100%;width:100%;position:absolute;top:0;left:0;right:0;bottom:0}.slider.fullscreen ul.slides{height:100%}.slider.fullscreen ul.indicators{z-index:2;bottom:30px}.slider .slides{background-color:#9e9e9e;margin:0;height:400px}.slider .slides li{opacity:0;position:absolute;top:0;left:0;z-index:1;width:100%;height:inherit;overflow:hidden}.slider .slides li img{height:100%;width:100%;background-size:cover;background-position:50%}.slider .slides li .caption{color:#fff;position:absolute;top:15%;left:15%;width:70%;opacity:0}.slider .slides li .caption p{color:#e0e0e0}.slider .slides li.active{z-index:2}.slider .indicators{position:absolute;text-align:center;left:0;right:0;bottom:0;margin:0}.slider .indicators .indicator-item{display:inline-block;position:relative;cursor:pointer;height:16px;width:16px;margin:0 12px;background-color:#e0e0e0;transition:background-color .3s;border-radius:50%}.slider .indicators .indicator-item.active{background-color:#4caf50}.carousel{overflow:hidden;position:relative;width:100%;height:400px;perspective:500px;transform-style:preserve-3d;transform-origin:0 50%}.carousel.carousel-slider{top:0;left:0;height:0}.carousel.carousel-slider .carousel-fixed-item{position:absolute;left:0;right:0;bottom:20px;z-index:1}.carousel.carousel-slider .carousel-fixed-item.with-indicators{bottom:68px}.carousel.carousel-slider .carousel-item{width:100%;height:100%;min-height:400px;position:absolute;top:0;left:0}.carousel.carousel-slider .carousel-item h2{font-size:24px;font-weight:500;line-height:32px}.carousel.carousel-slider .carousel-item p{font-size:15px}.carousel .carousel-item{display:none;width:200px;height:200px;position:absolute;top:0;left:0}.carousel .carousel-item>img{width:100%}.carousel .indicators{position:absolute;text-align:center;left:0;right:0;bottom:0;margin:0}.carousel .indicators .indicator-item{display:inline-block;position:relative;cursor:pointer;height:8px;width:8px;margin:24px 4px;background-color:hsla(0,0%,100%,.5);transition:background-color .3s;border-radius:50%}.carousel .indicators .indicator-item.active{background-color:#fff}.carousel .carousel-item:not(.active) .materialboxed,.carousel.scrolling .carousel-item .materialboxed{pointer-events:none}.tap-target-wrapper{width:800px;height:800px;position:fixed;z-index:1000;visibility:hidden;transition:visibility 0s .3s}.tap-target-wrapper.open{visibility:visible;transition:visibility 0s}.tap-target-wrapper.open .tap-target{transform:scale(1);opacity:.95;transition:transform .3s ease-in-out,opacity .3s ease-in-out}.tap-target-wrapper.open .tap-target-wave:before{transform:scale(1)}.tap-target-wrapper.open .tap-target-wave:after{visibility:visible;animation:pulse-animation 1s cubic-bezier(.24,0,.38,1) infinite;transition:opacity .3s,transform .3s,visibility 0s 1s}.tap-target{position:absolute;font-size:1rem;border-radius:50%;background-color:#ee6e73;box-shadow:0 20px 20px 0 rgba(0,0,0,.14),0 10px 50px 0 rgba(0,0,0,.12),0 30px 10px -20px rgba(0,0,0,.2);width:100%;height:100%;opacity:0;transform:scale(0);transition:transform .3s ease-in-out,opacity .3s ease-in-out}.tap-target-content{position:relative;display:table-cell}.tap-target-wave{position:absolute;border-radius:50%;z-index:10001}.tap-target-wave:after,.tap-target-wave:before{content:\"\";display:block;position:absolute;width:100%;height:100%;border-radius:50%;background-color:#fff}.tap-target-wave:before{transform:scale(0);transition:transform .3s}.tap-target-wave:after{visibility:hidden;transition:opacity .3s,transform .3s,visibility 0s;z-index:-1}.tap-target-origin{top:50%;left:50%;transform:translate(-50%,-50%);z-index:10002;position:absolute!important}.tap-target-origin:not(.btn):not(.btn-large),.tap-target-origin:not(.btn):not(.btn-large):hover{background:none}@media only screen and (max-width:600px){.tap-target,.tap-target-wrapper{width:600px;height:600px}}.pulse{overflow:initial;position:relative}.pulse:before{content:\"\";display:block;position:absolute;width:100%;height:100%;top:0;left:0;background-color:inherit;border-radius:inherit;transition:opacity .3s,transform .3s;animation:pulse-animation 1s cubic-bezier(.24,0,.38,1) infinite;z-index:-1}@keyframes pulse-animation{0%{opacity:1;transform:scale(1)}50%{opacity:0;transform:scale(1.5)}to{opacity:0;transform:scale(1.5)}}.picker{font-size:16px;text-align:left;line-height:1.2;color:#000;position:absolute;z-index:10000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.picker__input{cursor:default}.picker__input.picker__input--active{border-color:#0089ec}.picker__holder{width:100%;overflow-y:auto;-webkit-overflow-scrolling:touch}/*!\n * Default mobile-first, responsive styling for pickadate.js\n * Demo: http://amsul.github.io/pickadate.js\n */.picker__frame,.picker__holder{bottom:0;left:0;right:0;top:100%}.picker__holder{position:fixed;transition:background .15s ease-out,top 0s .15s;-webkit-backface-visibility:hidden}.picker__frame{position:absolute;min-width:256px;width:300px;max-height:350px;-ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";filter:alpha(opacity=0);-moz-opacity:0;opacity:0;transition:all .15s ease-out}@media (min-height:28.875em){.picker__frame{overflow:visible;top:auto;bottom:-100%;max-height:80%}}@media (min-height:40.125em){.picker__frame{margin-bottom:7.5%}}.picker__wrap{display:table;width:100%;height:100%}@media (min-height:28.875em){.picker__wrap{display:block}}.picker__box{background:#fff;display:table-cell;vertical-align:middle}@media (min-height:28.875em){.picker__box{display:block;border:1px solid #777;border-top-color:#898989;border-bottom-width:0;border-radius:5px 5px 0 0;box-shadow:0 12px 36px 16px rgba(0,0,0,.24)}}.picker--opened .picker__holder{top:0;background:transparent;-ms-filter:\"progid:DXImageTransform.Microsoft.gradient(startColorstr=#1E000000,endColorstr=#1E000000)\";zoom:1;background:rgba(0,0,0,.32);transition:background .15s ease-out}.picker--opened .picker__frame{top:0;-ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)\";filter:alpha(opacity=100);-moz-opacity:1;opacity:1}@media (min-height:35.875em){.picker--opened .picker__frame{top:10%;bottom:auto}}.picker__input.picker__input--active{border-color:#e3f2fd}.picker__frame{margin:0 auto;max-width:325px}@media (min-height:38.875em){.picker--opened .picker__frame{top:10%;bottom:auto}}.picker__box{padding:0 1em}.picker__header{text-align:center;position:relative;margin-top:.75em}.picker__month,.picker__year{display:inline-block;margin-left:.25em;margin-right:.25em}.picker__select--month,.picker__select--year{height:2em;padding:0;margin-left:.25em;margin-right:.25em}.picker__select--month.browser-default{display:inline;background-color:#fff;width:40%}.picker__select--year.browser-default{display:inline;background-color:#fff;width:26%}.picker__select--month:focus,.picker__select--year:focus{border-color:rgba(0,0,0,.05)}.picker__nav--next,.picker__nav--prev{position:absolute;padding:.5em 1.25em;width:1em;height:1em;box-sizing:content-box;top:-.25em}.picker__nav--prev{left:-1em;padding-right:1.25em}.picker__nav--next{right:-1em;padding-left:1.25em}.picker__nav--disabled,.picker__nav--disabled:before,.picker__nav--disabled:before:hover,.picker__nav--disabled:hover{cursor:default;background:none;border-right-color:#f5f5f5;border-left-color:#f5f5f5}.picker__table{border-collapse:collapse;border-spacing:0;table-layout:fixed;font-size:1rem;width:100%;margin-top:.75em}.picker__table,.picker__table td,.picker__table th{text-align:center}.picker__table td{margin:0;padding:0}.picker__weekday{width:14.285714286%;font-size:.75em;padding-bottom:.25em;color:#999;font-weight:500}@media (min-height:33.875em){.picker__weekday{padding-bottom:.5em}}.picker__day--today{position:relative;color:#595959;letter-spacing:-.3;padding:.75rem 0;font-weight:400;border:1px solid transparent}.picker__day--disabled:before{border-top-color:#aaa}.picker__day--infocus:hover{cursor:pointer;color:#000;font-weight:500}.picker__day--outfocus{display:none;padding:.75rem 0;color:#fff}.picker__day--outfocus:hover{cursor:pointer;color:#ddd;font-weight:500}.picker--focused .picker__day--highlighted,.picker__day--highlighted:hover{cursor:pointer}.picker--focused .picker__day--selected,.picker__day--selected,.picker__day--selected:hover{transform:scale(.75);background:#0089ec}.picker--focused .picker__day--disabled,.picker__day--disabled,.picker__day--disabled:hover{background:#f5f5f5;border-color:#f5f5f5;color:#ddd;cursor:default}.picker__day--highlighted.picker__day--disabled,.picker__day--highlighted.picker__day--disabled:hover{background:#bbb}.picker__footer{text-align:center;display:flex;align-items:center;justify-content:space-between}.picker__button--clear,.picker__button--close,.picker__button--today{border:1px solid #fff;background:#fff;font-size:.8em;padding:.66em 0;font-weight:700;width:33%;display:inline-block;vertical-align:bottom}.picker__button--clear:hover,.picker__button--close:hover,.picker__button--today:hover{cursor:pointer;color:#000;background:#b1dcfb;border-bottom-color:#b1dcfb}.picker__button--clear:focus,.picker__button--close:focus,.picker__button--today:focus{background:#b1dcfb;border-color:rgba(0,0,0,.05);outline:none}.picker__button--clear:before,.picker__button--close:before,.picker__button--today:before{position:relative;display:inline-block;height:0}.picker__button--clear:before,.picker__button--today:before{content:\" \";margin-right:.45em}.picker__button--today:before{top:-.05em;width:0;border-top:.66em solid #0059bc;border-left:.66em solid transparent}.picker__button--clear:before{top:-.25em;width:.66em;border-top:3px solid #e20}.picker__button--close:before{content:\"\\D7\";top:-.1em;vertical-align:top;font-size:1.1em;margin-right:.35em;color:#777}.picker__button--today[disabled],.picker__button--today[disabled]:hover{background:#f5f5f5;border-color:#f5f5f5;color:#ddd;cursor:default}.picker__button--today[disabled]:before{border-top-color:#aaa}.picker__box{border-radius:2px;overflow:hidden}.picker__date-display{text-align:center;background-color:#26a69a;color:#fff;padding-bottom:15px;font-weight:300}.picker__nav--next:hover,.picker__nav--prev:hover{cursor:pointer;color:#000;background:#a1ded8}.picker__weekday-display{background-color:#1f897f;padding:10px;font-weight:200;letter-spacing:.5;font-size:1rem;margin-bottom:15px}.picker__month-display{text-transform:uppercase;font-size:2rem}.picker__day-display{font-size:4.5rem;font-weight:400}.picker__year-display{font-size:1.8rem;color:hsla(0,0%,100%,.4)}.picker__box{padding:0}.picker__calendar-container{padding:0 1rem}.picker__calendar-container thead{border:none}.picker__table{margin-top:0;margin-bottom:.5em}.picker__day--infocus{color:#595959;letter-spacing:-.3;padding:.75rem 0;font-weight:400;border:1px solid transparent}.picker__day.picker__day--today{color:#26a69a}.picker__day.picker__day--today.picker__day--selected{color:#fff}.picker__weekday{font-size:.9rem}.picker--focused .picker__day--selected,.picker__day--selected,.picker__day--selected:hover{border-radius:50%;transform:scale(.9);background-color:#26a69a;color:#fff}.picker--focused .picker__day--selected.picker__day--outfocus,.picker__day--selected.picker__day--outfocus,.picker__day--selected:hover.picker__day--outfocus{background-color:#a1ded8}.picker__footer{text-align:right;padding:5px 10px}.picker__close,.picker__today{font-size:1.1rem;padding:0 1rem;color:#26a69a}.picker__nav--next:before,.picker__nav--prev:before{content:\" \";border-top:.5em solid transparent;border-bottom:.5em solid transparent;border-right:.75em solid #676767;width:0;height:0;display:block;margin:0 auto}.picker__nav--next:before{border-right:0;border-left:.75em solid #676767}button.picker__clear:focus,button.picker__close:focus,button.picker__today:focus{background-color:#a1ded8}.picker__list{list-style:none;padding:.75em 0 4.2em;margin:0}.picker__list-item{border-bottom:1px solid #ddd;border-top:1px solid #ddd;margin-bottom:-1px;position:relative;background:#fff;padding:.75em 1.25em}@media (min-height:46.75em){.picker__list-item{padding:.5em 1em}}.picker__list-item:hover{cursor:pointer;color:#000;background:#b1dcfb}.picker__list-item--highlighted,.picker__list-item:hover{border-color:#0089ec;z-index:10}.picker--focused .picker__list-item--highlighted,.picker__list-item--highlighted:hover{cursor:pointer;color:#000;background:#b1dcfb}.picker--focused .picker__list-item--selected,.picker__list-item--selected,.picker__list-item--selected:hover{background:#0089ec;color:#fff;z-index:10}.picker--focused .picker__list-item--disabled,.picker__list-item--disabled,.picker__list-item--disabled:hover{background:#f5f5f5;border-color:#f5f5f5;color:#ddd;cursor:default;border-color:#ddd;z-index:auto}.picker--time .picker__button--clear{display:block;width:80%;margin:1em auto 0;padding:1em 1.25em;background:none;border:0;font-weight:500;font-size:.67em;text-align:center;text-transform:uppercase;color:#666}.picker--time .picker__button--clear:focus,.picker--time .picker__button--clear:hover{color:#000;background:#b1dcfb;background:#e20;border-color:#e20;cursor:pointer;color:#fff;outline:none}.picker--time .picker__button--clear:before{top:-.25em;color:#666;font-size:1.25em;font-weight:700}.picker--time .picker__button--clear:focus:before,.picker--time .picker__button--clear:hover:before{color:#fff}.picker--time .picker__frame{min-width:256px;max-width:320px}.picker--time .picker__box{font-size:1em;background:#f2f2f2;padding:0}@media (min-height:40.125em){.picker--time .picker__box{margin-bottom:5em}}h1,h2,h3,h4,h5,h6{font-family:Lato,sans-serif}hr{width:14%;margin:50px auto;border:0;border-top:1px solid #dededc}input[type=text]:focus:not([readonly]){border-bottom:1px solid #ef5350;box-shadow:0 1px 0 0 #ef5350}input[type=text]:focus:not([readonly])+label{color:#ef5350}@media only screen and (min-width:601px){#wrapper{width:100%}}code{padding:2px 4px;font-size:90%;color:#c7254e;background-color:#f9f2f4;border-radius:4px}img{display:block;max-width:100%;margin-left:auto;margin-right:auto}", ""]);

// exports


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "#wrapper a,#wrapper abbr,#wrapper acronym,#wrapper address,#wrapper blockquote,#wrapper caption,#wrapper code,#wrapper dd,#wrapper del,#wrapper dfn,#wrapper div,#wrapper dl,#wrapper dt,#wrapper em,#wrapper fieldset,#wrapper form,#wrapper h1,#wrapper h2,#wrapper h3,#wrapper h4,#wrapper h5,#wrapper h6,#wrapper iframe,#wrapper img,#wrapper label,#wrapper legend,#wrapper li,#wrapper object,#wrapper ol,#wrapper p,#wrapper pre,#wrapper q,#wrapper span,#wrapper table,#wrapper tbody,#wrapper td,#wrapper tfoot,#wrapper th,#wrapper thead,#wrapper tr,#wrapper ul{margin:0;padding:0;border:0;font-weight:inherit;font-style:inherit;font-size:100%;font-family:inherit;vertical-align:baseline}body{background:#fff;margin:1.5em 0}body #wrapper{line-height:1.8}#wrapper table{border-collapse:collapse;border-spacing:0}#wrapper caption,#wrapper td,#wrapper th{text-align:left;font-weight:400}#wrapper blockquote:after,#wrapper blockquote:before,#wrapper q:after,#wrapper q:before{content:\"\"}#wrapper blockquote,#wrapper q{quotes:\"\" \"\"}#wrapper a img{border:none}#wrapper input,#wrapper textarea{margin:0}body{-webkit-font-smoothing:antialiased;font-size:110%;margin:2em 0 0}@font-face{font-family:RokkittRegular;src:url(\"data:font/woff;base64,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\") format(\"woff\");font-weight:400;font-style:normal}@font-face{font-family:LiberationMonoRegular;src:url(\"data:font/woff;base64,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\") format(\"woff\");font-weight:400;font-style:normal}#wrapper{font-size:13px;padding:20px}#wrapper div,#wrapper dl,#wrapper input,#wrapper ol,#wrapper p,#wrapper td,#wrapper textarea,#wrapper ul{color:#333;font-family:Lucida Grande,Verdana,Helvetica,Arial,sans-serif}#wrapper h1,#wrapper h2,#wrapper h3,#wrapper h4,#wrapper h5,#wrapper h6{color:#333;font-family:Rockwell,Rokkitt,Georgia,serif;letter-spacing:0}#wrapper h1{font-size:3em;line-height:1;margin-bottom:.5em}#wrapper h2{font-size:2em;margin-bottom:.75em}#wrapper h3{font-size:1.5em;line-height:1;margin-bottom:1em}#wrapper h4{font-size:1.2em;line-height:1.25;margin-bottom:1.25em}#wrapper h5{margin-bottom:1.5em}#wrapper h5,#wrapper h6{font-size:1em}#wrapper p{margin:0 0 1.5em;font-size:1.2em}#wrapper ol,#wrapper ul{color:#444;margin:1em 2em}#wrapper ul{list-style-type:circle;font-size:1.05em}#wrapper ol{list-style-type:decimal}#wrapper li p{font-size:1em}#wrapper li>p:first-child{margin:0}#wrapper dl{margin:0 0 1.5em}#wrapper dl dt{font-weight:700}#wrapper dl dd{margin-left:1.5em}#wrapper abbr,#wrapper acronym{border-bottom:1px dotted #000}#wrapper address{margin-top:1.5em;font-style:italic}#wrapper del{color:#000}#wrapper a{color:#d33637;text-decoration:none;border-bottom:1px dotted #d33637;transition:color .2s ease-in-out}#wrapper a:hover{text-decoration:none;color:#666;border-bottom-color:#666}#wrapper a:active{outline:0;position:relative;top:1px}#wrapper blockquote{background:#e7e7e7;border-top:1px solid #ccc;margin:1.5em;color:#444;font-style:italic}#wrapper blockquote p{padding:1em;border-top:1px solid #fff}#wrapper strong{font-weight:700}#wrapper em{font-style:italic}#wrapper dfn{font-weight:700}#wrapper code,#wrapper pre,#wrapper tt{color:#8b8074;font-family:LiberationMonoRegular,Menlo,Monaco,monospace;font-size:1em;font-weight:700;text-align:left;margin:2em 0}#wrapper tt{display:block;margin:1.5em 0;line-height:1.5}#wrapper span.amp{font-family:Baskerville,Palatino,Book Antiqua,serif;font-style:italic}#wrapper img{max-width:100%;height:auto}#wrapper .footnote{font-size:.8em;vertical-align:super}#wrapper caption,#wrapper col,#wrapper colgroup,#wrapper table,#wrapper tbody,#wrapper td,#wrapper tfoot,#wrapper th,#wrapper thead,#wrapper tr{border-spacing:0}#wrapper caption{color:#666}#wrapper figure{display:inline-block;margin:.5em 0 1.8em;position:relative}#wrapper .poetry pre{display:block;font-family:Georgia,Garamond,serif!important;font-size:110%!important;font-style:italic;line-height:1.6em;margin-left:1em}#wrapper .poetry pre code{font-family:Georgia,Garamond,serif!important;word-break:break-all;word-break:break-word;-webkit-hyphens:auto;hyphens:auto;white-space:pre-wrap}#wrapper a.footnote,#wrapper sub,#wrapper sup{font-size:1.4ex;height:0;line-height:1;position:relative;vertical-align:super}#wrapper sub{vertical-align:sub;top:-1px}#wrapper table{width:100%;margin-bottom:2em;padding:0;font-size:13px;border:1px solid #ddd;border-collapse:separate;border-radius:4px;-moz-border-radius:4px;-webkit-border-radius:4px}#wrapper table td,#wrapper table th{padding:10px 10px 9px;line-height:18px;text-align:left}#wrapper table th{padding-top:9px;font-weight:700;vertical-align:middle}#wrapper table tbody th,#wrapper table td{vertical-align:top;border-top:1px solid #ddd}#wrapper table td+td,#wrapper table th+td,#wrapper table th+th{border-left:1px solid #ddd}#wrapper table tbody tr:first-child td:first-child,#wrapper table thead tr:first-child th:first-child{border-radius:4px 0 0 0;-moz-border-radius:4px 0 0 0;-webkit-border-radius:4px 0 0 0}#wrapper table tbody tr:first-child td:last-child,#wrapper table thead tr:first-child th:last-child{border-radius:0 4px 0 0;-moz-border-radius:0 4px 0 0;-webkit-border-radius:0 4px 0 0}#wrapper table tbody tr:last-child td:first-child{border-radius:0 0 0 4px;-moz-border-radius:0 0 0 4px;-webkit-border-radius:0 0 0 4px}#wrapper table tbody tr:last-child td:last-child{border-radius:0 0 4px 0;-moz-border-radius:0 0 4px 0;-webkit-border-radius:0 0 4px 0}#wrapper table tbody tr:nth-child(odd){background-color:rgba(0,0,0,.03)}@media print{body{overflow:auto}blockquote,figure,img,pre,table{page-break-inside:avoid}#wrapper{background:#fff;color:#303030;font-size:85%;padding:10px;position:relative;text-indent:0}}@media screen{#wrapper ::selection{background:rgba(157,193,200,.5)}#wrapper h1::selection{background-color:rgba(45,156,208,.3)}#wrapper h2::selection{background-color:rgba(90,182,224,.3)}#wrapper h3::selection,#wrapper h4::selection,#wrapper h5::selection,#wrapper h6::selection,#wrapper li::selection,#wrapper ol::selection{background-color:rgba(133,201,232,.3)}#wrapper code::selection{background-color:rgba(0,0,0,.7);color:#eee}#wrapper code span::selection{background-color:rgba(0,0,0,.7)!important;color:#eee!important}#wrapper a::selection{background-color:rgba(255,230,102,.2)}#wrapper .inverted a::selection{background-color:rgba(255,230,102,.6)}#wrapper caption::selection,#wrapper td::selection,#wrapper th::selection{background-color:rgba(180,237,95,.5)}.inverted{background:#0b2531}.inverted #wrapper{padding:20px;background:#0b2531}.inverted #wrapper .math,.inverted #wrapper code,.inverted #wrapper dd,.inverted #wrapper dt,.inverted #wrapper h1,.inverted #wrapper h2,.inverted #wrapper h3,.inverted #wrapper h4,.inverted #wrapper h5,.inverted #wrapper h6,.inverted #wrapper li,.inverted #wrapper p,.inverted #wrapper pre,.inverted #wrapper td,.inverted #wrapper th{color:#eee!important}.inverted #wrapper a{border-bottom:none;color:#fff;text-decoration:underline}.inverted #wrapper blockquote{background:hsla(0,0%,100%,.1);border-top-color:hsla(0,0%,100%,.1)}.inverted #wrapper blockquote p{border-top-color:hsla(0,0%,100%,.3)}.inverted #wrapper .footnote,.inverted #wrapper caption,.inverted #wrapper figcaption{color:hsla(0,0%,100%,.5)}.inverted #wrapper table{border-color:hsla(0,0%,100%,.3)}.inverted #wrapper table td{vertical-align:top;border-top:none}.inverted #wrapper table td+td,.inverted #wrapper table th+td,.inverted #wrapper table th+th{border-left:1px solid hsla(0,0%,100%,.3)}.inverted #wrapper table tbody tr:nth-child(odd){background-color:hsla(0,0%,100%,.1)}}", ""]);

// exports


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "#wrapper>*{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,mr-eaves-modern,sans-serif!important;-webkit-font-smoothing:antialiased}#wrapper{padding-top:50px;padding-bottom:50px}#wrapper ol,#wrapper p,#wrapper ul{font-size:17px;font-weight:400;font-style:normal;letter-spacing:-.021em;line-height:1.52947;color:#333}#wrapper li{margin-bottom:12px}#wrapper h1,#wrapper h2,#wrapper h3,#wrapper h4,#wrapper h5{font-weight:700;color:#333;text-rendering:optimizeLegibility}#wrapper h1{font-size:40px;line-height:1.05;letter-spacing:.008em;border-bottom-style:solid;border-bottom-width:1px}#wrapper h2{font-size:35px}#wrapper h3{font-size:30px}#wrapper h4{font-size:25px}#wrapper h5{font-size:20px}#wrapper h6{font-size:14px}#wrapper blockquote{margin:0;display:block;line-height:1.5;color:#333;border-left:3px solid #ef5350;padding-left:20px;margin-left:-26px;margin-bottom:30px;font-style:italic;letter-spacing:-.003em}#wrapper figure{margin:0;margin-bottom:30px;position:relative}#wrapper figcaption{position:relative;margin-top:10px;width:100%;text-align:center;color:#666665;font-style:italic;font-size:14px}#wrapper hr{width:100%;margin:50px auto 40px;border:0;border-top:1px solid #eeeff0}#wrapper pre{font-family:Monaco,Courier New,Courier,monospace;font-size:16px;margin-bottom:20px;padding:20px;border:0}", ""]);

// exports


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "body,html{color:#000}:not(\"#mkdbuttons\"){margin:0;padding:0}#wrapper{font:16px helvetica,arial,freesans,clean,sans-serif;-webkit-font-smoothing:antialiased;line-height:1.7;padding:3px;background:#fff;border-radius:3px;-moz-border-radius:3px;-webkit-border-radius:3px}p{margin:1em 0}a{color:#4183c4;text-decoration:none}#wrapper{background-color:#fff;padding:30px;margin:15px;font-size:15px;line-height:1.6}#wrapper>:first-child{margin-top:0!important}#wrapper>:last-child{margin-bottom:0!important}@media screen{#wrapper{box-shadow:0 0 0 1px #cacaca}}h1,h2,h3,h4,h5,h6{font-weight:700;line-height:1.7;cursor:text;position:relative;margin:1em 0 15px;padding:0}h1{font-size:2.5em;border-bottom:1px solid #ddd}h2{font-size:2em;border-bottom:1px solid #eee}h3{font-size:1.5em}h4{font-size:1.2em}h5,h6{font-size:1em}h6{color:#777}blockquote,p,pre,table{margin:15px 0}ol,ul{padding-left:30px}ol li ul:first-of-type{margin-top:0}hr{background:transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAECAYAAACtBE5DAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OENDRjNBN0E2NTZBMTFFMEI3QjRBODM4NzJDMjlGNDgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OENDRjNBN0I2NTZBMTFFMEI3QjRBODM4NzJDMjlGNDgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4Q0NGM0E3ODY1NkExMUUwQjdCNEE4Mzg3MkMyOUY0OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4Q0NGM0E3OTY1NkExMUUwQjdCNEE4Mzg3MkMyOUY0OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqqezsUAAAAfSURBVHjaYmRABcYwBiM2QSA4y4hNEKYDQxAEAAIMAHNGAzhkPOlYAAAAAElFTkSuQmCC) repeat-x 0 0;border:0 none;color:#ccc;height:4px;margin:15px 0;padding:0}#wrapper>h1:first-child,#wrapper>h1:first-child+h2,#wrapper>h2:first-child,#wrapper>h3:first-child,#wrapper>h4:first-child,#wrapper>h5:first-child,#wrapper>h6:first-child,a:first-child h1,a:first-child h2,a:first-child h3,a:first-child h4,a:first-child h5,a:first-child h6{margin-top:0;padding-top:0}h1+p,h2+p,h3+p,h4+p,h5+p,h6+p,ol li>:first-child,ul li>:first-child{margin-top:0}dl,dl dt{padding:0}dl dt{font-size:14px;font-weight:700;font-style:italic;margin:15px 0 5px}dl dt:first-child{padding:0}dl dt>:first-child{margin-top:0}dl dt>:last-child{margin-bottom:0}dl dd{margin:0 0 15px;padding:0 15px}dl dd>:first-child{margin-top:0}dl dd>:last-child{margin-bottom:0}blockquote{border-left:4px solid #ddd;padding:0 15px;color:#777}blockquote>:first-child{margin-top:0}blockquote>:last-child{margin-bottom:0}table{border-collapse:collapse;border-spacing:0;font-size:100%;font:inherit}table th{font-weight:700}table td,table th{border:1px solid #ccc;padding:6px 13px}table tr{border-top:1px solid #ccc;background-color:#fff}table tr:nth-child(2n){background-color:#f8f8f8}img{max-width:100%}code,tt{margin:0 2px;padding:0 5px;white-space:nowrap;border:1px solid #eaeaea;background-color:#f8f8f8;border-radius:3px;font-family:Consolas,Liberation Mono,Courier,monospace;font-size:12px;color:#333}pre>code{margin:0;padding:0;white-space:pre;border:none;background:transparent}.highlight pre{font-size:13px}.highlight pre,pre{background-color:#f8f8f8;border:1px solid #ccc;line-height:19px;overflow:auto;padding:6px 10px;border-radius:3px}pre{font-size:14px;margin:26px 0}pre code,pre tt{background-color:transparent;border:none}.poetry pre{font-style:italic;font-size:110%!important;line-height:1.6em;display:block;margin-left:1em}.poetry pre,.poetry pre code{font-family:Georgia,Garamond,serif!important}.poetry pre code{word-break:break-all;word-break:break-word;-webkit-hyphens:auto;hyphens:auto;white-space:pre-wrap}a.footnote,sub,sup{font-size:1.4ex;height:0;line-height:1;vertical-align:super;position:relative}sub{vertical-align:sub;top:-1px}@media print{body{background:#fff}blockquote,figure,img,pre,table{page-break-inside:avoid}#wrapper{background:#fff;border:none}pre code{overflow:visible}}@media screen{.inverted #wrapper,.inverted .math,.inverted blockquote,.inverted caption,.inverted dd,.inverted dt,.inverted h1,.inverted h2,.inverted h3,.inverted h4,.inverted h5,.inverted h6,.inverted hr,.inverted li,.inverted p,.inverted td,.inverted th,body.inverted{color:#eee!important;border-color:#555;box-shadow:none}.inverted td,.inverted th{background:#333}.inverted code,.inverted pre,.inverted tt{background:#eee!important;color:#111}.inverted h2{border-color:#555}.inverted hr{border-color:#777;border-width:1px!important}::selection{background:rgba(157,193,200,.5)}h1::selection{background-color:rgba(45,156,208,.3)}h2::selection{background-color:rgba(90,182,224,.3)}h3::selection,h4::selection,h5::selection,h6::selection,li::selection,ol::selection{background-color:rgba(133,201,232,.3)}code::selection{background-color:rgba(0,0,0,.7);color:#eee}code span::selection{background-color:rgba(0,0,0,.7)!important;color:#eee!important}a::selection{background-color:rgba(255,230,102,.2)}.inverted a::selection{background-color:rgba(255,230,102,.6)}caption::selection,td::selection,th::selection{background-color:rgba(180,237,95,.5)}.inverted{background:#0b2531;background:#252a2a}.inverted #wrapper{background:#252a2a}.inverted a{color:#acd1d5}}.highlight .c{color:#998;font-style:italic}.highlight .err{color:#a61717;background-color:#e3d2d2}.highlight .k,.highlight .o{font-weight:700}.highlight .cm{color:#998;font-style:italic}.highlight .cp{color:#999;font-weight:700}.highlight .c1{color:#998;font-style:italic}.highlight .cs{color:#999;font-weight:700;font-style:italic}.highlight .gd{color:#000;background-color:#fdd}.highlight .gd .x{color:#000;background-color:#faa}.highlight .ge{font-style:italic}.highlight .gr{color:#a00}.highlight .gh{color:#999}.highlight .gi{color:#000;background-color:#dfd}.highlight .gi .x{color:#000;background-color:#afa}.highlight .go{color:#888}.highlight .gp{color:#555}.highlight .gs,.highlight .gu{font-weight:700}.highlight .gu{color:purple}.highlight .gt{color:#a00}.highlight .kc,.highlight .kd,.highlight .kn,.highlight .kp,.highlight .kr,.highlight .kt{font-weight:700}.highlight .kt{color:#458}.highlight .m{color:#099}.highlight .s{color:#d14}.highlight .na{color:teal}.highlight .nb{color:#0086b3}.highlight .nc{color:#458;font-weight:700}.highlight .no{color:teal}.highlight .ni{color:purple}.highlight .ne,.highlight .nf{color:#900;font-weight:700}.highlight .nn{color:#555}.highlight .nt{color:navy}.highlight .nv{color:teal}.highlight .ow{font-weight:700}.highlight .w{color:#bbb}.highlight .mf,.highlight .mh,.highlight .mi,.highlight .mo{color:#099}.highlight .s2,.highlight .sb,.highlight .sc,.highlight .sd,.highlight .se,.highlight .sh,.highlight .si,.highlight .sx{color:#d14}.highlight .sr{color:#009926}.highlight .s1{color:#d14}.highlight .ss{color:#990073}.highlight .bp{color:#999}.highlight .vc,.highlight .vg,.highlight .vi{color:teal}.highlight .il{color:#099}.highlight .gc{color:#999;background-color:#eaf2f5}.type-csharp .highlight .k,.type-csharp .highlight .kt{color:#00f}.type-csharp .highlight .nf{color:#000;font-weight:400}.type-csharp .highlight .nc{color:#2b91af}.type-csharp .highlight .nn{color:#000}.type-csharp .highlight .s,.type-csharp .highlight .sc{color:#a31515}body.dark #wrapper{background:transparent!important;box-shadow:none!important}", ""]);

// exports


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".collapsible-body{padding:0 0 0 1rem!important}.is-link{text-decoration:underline;-webkit-text-decoration-style:dashed;text-decoration-style:dashed;-ms-text-underline-position:under;text-underline-position:under}.side-nav .collapsible-header,.side-nav.fixed .collapsible-header{padding:0 32px!important}", ""]);

// exports


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".fade-enter-active[data-v-3d5dcb70],.fade-leave-active[data-v-3d5dcb70]{transition:all .5s}.fade-enter[data-v-3d5dcb70],.fade-leave-to[data-v-3d5dcb70]{transform:translateY(10px);opacity:0}.search-wrapper[data-v-3d5dcb70]{margin:12px;transition:margin .25s ease}.search-wrapper.focused[data-v-3d5dcb70]{margin:12px 0}.search-wrapper #search[data-v-3d5dcb70]{display:block;font-size:16px;font-weight:300;width:100%;height:45px;margin:0;padding:0 45px 0 15px;border:0}.search-wrapper #search[data-v-3d5dcb70]:focus{box-shadow:none!important}", ""]);

// exports


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".side-nav[data-v-5b3f6bea]{overflow-x:hidden}.side-nav .collapsible-body[data-v-5b3f6bea]{padding:0}ul.side-nav.fixed ul.collapsible .collapsible-body li a[data-v-5b3f6bea]{font-weight:400;padding:0 37.5px 0 45px}.bold>a[data-v-5b3f6bea]{font-weight:700}.collapsible-header[data-v-5b3f6bea]{padding-left:32px!important}li.logo[data-v-5b3f6bea]{padding:2rem 0}", ""]);

// exports


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".collection[data-v-74c453ce]{position:absolute;width:100%;z-index:2;margin-top:0;border:none;box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12),0 3px 1px -2px rgba(0,0,0,.2)}", ""]);

// exports


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "main[data-v-78c4b035]{transition:all .3s ease-in}@media screen and (min-width:992px){main[data-v-78c4b035]{margin-left:300px}}", ""]);

// exports


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".btn-navigator{position:fixed!important;top:50%;transform:translateY(-50%)}.btn-navigator-left{margin-left:12px}.btn-navigator-right{right:12px}", ""]);

// exports


/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = {
	"Aacute": "Á",
	"aacute": "á",
	"Abreve": "Ă",
	"abreve": "ă",
	"ac": "∾",
	"acd": "∿",
	"acE": "∾̳",
	"Acirc": "Â",
	"acirc": "â",
	"acute": "´",
	"Acy": "А",
	"acy": "а",
	"AElig": "Æ",
	"aelig": "æ",
	"af": "⁡",
	"Afr": "𝔄",
	"afr": "𝔞",
	"Agrave": "À",
	"agrave": "à",
	"alefsym": "ℵ",
	"aleph": "ℵ",
	"Alpha": "Α",
	"alpha": "α",
	"Amacr": "Ā",
	"amacr": "ā",
	"amalg": "⨿",
	"amp": "&",
	"AMP": "&",
	"andand": "⩕",
	"And": "⩓",
	"and": "∧",
	"andd": "⩜",
	"andslope": "⩘",
	"andv": "⩚",
	"ang": "∠",
	"ange": "⦤",
	"angle": "∠",
	"angmsdaa": "⦨",
	"angmsdab": "⦩",
	"angmsdac": "⦪",
	"angmsdad": "⦫",
	"angmsdae": "⦬",
	"angmsdaf": "⦭",
	"angmsdag": "⦮",
	"angmsdah": "⦯",
	"angmsd": "∡",
	"angrt": "∟",
	"angrtvb": "⊾",
	"angrtvbd": "⦝",
	"angsph": "∢",
	"angst": "Å",
	"angzarr": "⍼",
	"Aogon": "Ą",
	"aogon": "ą",
	"Aopf": "𝔸",
	"aopf": "𝕒",
	"apacir": "⩯",
	"ap": "≈",
	"apE": "⩰",
	"ape": "≊",
	"apid": "≋",
	"apos": "'",
	"ApplyFunction": "⁡",
	"approx": "≈",
	"approxeq": "≊",
	"Aring": "Å",
	"aring": "å",
	"Ascr": "𝒜",
	"ascr": "𝒶",
	"Assign": "≔",
	"ast": "*",
	"asymp": "≈",
	"asympeq": "≍",
	"Atilde": "Ã",
	"atilde": "ã",
	"Auml": "Ä",
	"auml": "ä",
	"awconint": "∳",
	"awint": "⨑",
	"backcong": "≌",
	"backepsilon": "϶",
	"backprime": "‵",
	"backsim": "∽",
	"backsimeq": "⋍",
	"Backslash": "∖",
	"Barv": "⫧",
	"barvee": "⊽",
	"barwed": "⌅",
	"Barwed": "⌆",
	"barwedge": "⌅",
	"bbrk": "⎵",
	"bbrktbrk": "⎶",
	"bcong": "≌",
	"Bcy": "Б",
	"bcy": "б",
	"bdquo": "„",
	"becaus": "∵",
	"because": "∵",
	"Because": "∵",
	"bemptyv": "⦰",
	"bepsi": "϶",
	"bernou": "ℬ",
	"Bernoullis": "ℬ",
	"Beta": "Β",
	"beta": "β",
	"beth": "ℶ",
	"between": "≬",
	"Bfr": "𝔅",
	"bfr": "𝔟",
	"bigcap": "⋂",
	"bigcirc": "◯",
	"bigcup": "⋃",
	"bigodot": "⨀",
	"bigoplus": "⨁",
	"bigotimes": "⨂",
	"bigsqcup": "⨆",
	"bigstar": "★",
	"bigtriangledown": "▽",
	"bigtriangleup": "△",
	"biguplus": "⨄",
	"bigvee": "⋁",
	"bigwedge": "⋀",
	"bkarow": "⤍",
	"blacklozenge": "⧫",
	"blacksquare": "▪",
	"blacktriangle": "▴",
	"blacktriangledown": "▾",
	"blacktriangleleft": "◂",
	"blacktriangleright": "▸",
	"blank": "␣",
	"blk12": "▒",
	"blk14": "░",
	"blk34": "▓",
	"block": "█",
	"bne": "=⃥",
	"bnequiv": "≡⃥",
	"bNot": "⫭",
	"bnot": "⌐",
	"Bopf": "𝔹",
	"bopf": "𝕓",
	"bot": "⊥",
	"bottom": "⊥",
	"bowtie": "⋈",
	"boxbox": "⧉",
	"boxdl": "┐",
	"boxdL": "╕",
	"boxDl": "╖",
	"boxDL": "╗",
	"boxdr": "┌",
	"boxdR": "╒",
	"boxDr": "╓",
	"boxDR": "╔",
	"boxh": "─",
	"boxH": "═",
	"boxhd": "┬",
	"boxHd": "╤",
	"boxhD": "╥",
	"boxHD": "╦",
	"boxhu": "┴",
	"boxHu": "╧",
	"boxhU": "╨",
	"boxHU": "╩",
	"boxminus": "⊟",
	"boxplus": "⊞",
	"boxtimes": "⊠",
	"boxul": "┘",
	"boxuL": "╛",
	"boxUl": "╜",
	"boxUL": "╝",
	"boxur": "└",
	"boxuR": "╘",
	"boxUr": "╙",
	"boxUR": "╚",
	"boxv": "│",
	"boxV": "║",
	"boxvh": "┼",
	"boxvH": "╪",
	"boxVh": "╫",
	"boxVH": "╬",
	"boxvl": "┤",
	"boxvL": "╡",
	"boxVl": "╢",
	"boxVL": "╣",
	"boxvr": "├",
	"boxvR": "╞",
	"boxVr": "╟",
	"boxVR": "╠",
	"bprime": "‵",
	"breve": "˘",
	"Breve": "˘",
	"brvbar": "¦",
	"bscr": "𝒷",
	"Bscr": "ℬ",
	"bsemi": "⁏",
	"bsim": "∽",
	"bsime": "⋍",
	"bsolb": "⧅",
	"bsol": "\\",
	"bsolhsub": "⟈",
	"bull": "•",
	"bullet": "•",
	"bump": "≎",
	"bumpE": "⪮",
	"bumpe": "≏",
	"Bumpeq": "≎",
	"bumpeq": "≏",
	"Cacute": "Ć",
	"cacute": "ć",
	"capand": "⩄",
	"capbrcup": "⩉",
	"capcap": "⩋",
	"cap": "∩",
	"Cap": "⋒",
	"capcup": "⩇",
	"capdot": "⩀",
	"CapitalDifferentialD": "ⅅ",
	"caps": "∩︀",
	"caret": "⁁",
	"caron": "ˇ",
	"Cayleys": "ℭ",
	"ccaps": "⩍",
	"Ccaron": "Č",
	"ccaron": "č",
	"Ccedil": "Ç",
	"ccedil": "ç",
	"Ccirc": "Ĉ",
	"ccirc": "ĉ",
	"Cconint": "∰",
	"ccups": "⩌",
	"ccupssm": "⩐",
	"Cdot": "Ċ",
	"cdot": "ċ",
	"cedil": "¸",
	"Cedilla": "¸",
	"cemptyv": "⦲",
	"cent": "¢",
	"centerdot": "·",
	"CenterDot": "·",
	"cfr": "𝔠",
	"Cfr": "ℭ",
	"CHcy": "Ч",
	"chcy": "ч",
	"check": "✓",
	"checkmark": "✓",
	"Chi": "Χ",
	"chi": "χ",
	"circ": "ˆ",
	"circeq": "≗",
	"circlearrowleft": "↺",
	"circlearrowright": "↻",
	"circledast": "⊛",
	"circledcirc": "⊚",
	"circleddash": "⊝",
	"CircleDot": "⊙",
	"circledR": "®",
	"circledS": "Ⓢ",
	"CircleMinus": "⊖",
	"CirclePlus": "⊕",
	"CircleTimes": "⊗",
	"cir": "○",
	"cirE": "⧃",
	"cire": "≗",
	"cirfnint": "⨐",
	"cirmid": "⫯",
	"cirscir": "⧂",
	"ClockwiseContourIntegral": "∲",
	"CloseCurlyDoubleQuote": "”",
	"CloseCurlyQuote": "’",
	"clubs": "♣",
	"clubsuit": "♣",
	"colon": ":",
	"Colon": "∷",
	"Colone": "⩴",
	"colone": "≔",
	"coloneq": "≔",
	"comma": ",",
	"commat": "@",
	"comp": "∁",
	"compfn": "∘",
	"complement": "∁",
	"complexes": "ℂ",
	"cong": "≅",
	"congdot": "⩭",
	"Congruent": "≡",
	"conint": "∮",
	"Conint": "∯",
	"ContourIntegral": "∮",
	"copf": "𝕔",
	"Copf": "ℂ",
	"coprod": "∐",
	"Coproduct": "∐",
	"copy": "©",
	"COPY": "©",
	"copysr": "℗",
	"CounterClockwiseContourIntegral": "∳",
	"crarr": "↵",
	"cross": "✗",
	"Cross": "⨯",
	"Cscr": "𝒞",
	"cscr": "𝒸",
	"csub": "⫏",
	"csube": "⫑",
	"csup": "⫐",
	"csupe": "⫒",
	"ctdot": "⋯",
	"cudarrl": "⤸",
	"cudarrr": "⤵",
	"cuepr": "⋞",
	"cuesc": "⋟",
	"cularr": "↶",
	"cularrp": "⤽",
	"cupbrcap": "⩈",
	"cupcap": "⩆",
	"CupCap": "≍",
	"cup": "∪",
	"Cup": "⋓",
	"cupcup": "⩊",
	"cupdot": "⊍",
	"cupor": "⩅",
	"cups": "∪︀",
	"curarr": "↷",
	"curarrm": "⤼",
	"curlyeqprec": "⋞",
	"curlyeqsucc": "⋟",
	"curlyvee": "⋎",
	"curlywedge": "⋏",
	"curren": "¤",
	"curvearrowleft": "↶",
	"curvearrowright": "↷",
	"cuvee": "⋎",
	"cuwed": "⋏",
	"cwconint": "∲",
	"cwint": "∱",
	"cylcty": "⌭",
	"dagger": "†",
	"Dagger": "‡",
	"daleth": "ℸ",
	"darr": "↓",
	"Darr": "↡",
	"dArr": "⇓",
	"dash": "‐",
	"Dashv": "⫤",
	"dashv": "⊣",
	"dbkarow": "⤏",
	"dblac": "˝",
	"Dcaron": "Ď",
	"dcaron": "ď",
	"Dcy": "Д",
	"dcy": "д",
	"ddagger": "‡",
	"ddarr": "⇊",
	"DD": "ⅅ",
	"dd": "ⅆ",
	"DDotrahd": "⤑",
	"ddotseq": "⩷",
	"deg": "°",
	"Del": "∇",
	"Delta": "Δ",
	"delta": "δ",
	"demptyv": "⦱",
	"dfisht": "⥿",
	"Dfr": "𝔇",
	"dfr": "𝔡",
	"dHar": "⥥",
	"dharl": "⇃",
	"dharr": "⇂",
	"DiacriticalAcute": "´",
	"DiacriticalDot": "˙",
	"DiacriticalDoubleAcute": "˝",
	"DiacriticalGrave": "`",
	"DiacriticalTilde": "˜",
	"diam": "⋄",
	"diamond": "⋄",
	"Diamond": "⋄",
	"diamondsuit": "♦",
	"diams": "♦",
	"die": "¨",
	"DifferentialD": "ⅆ",
	"digamma": "ϝ",
	"disin": "⋲",
	"div": "÷",
	"divide": "÷",
	"divideontimes": "⋇",
	"divonx": "⋇",
	"DJcy": "Ђ",
	"djcy": "ђ",
	"dlcorn": "⌞",
	"dlcrop": "⌍",
	"dollar": "$",
	"Dopf": "𝔻",
	"dopf": "𝕕",
	"Dot": "¨",
	"dot": "˙",
	"DotDot": "⃜",
	"doteq": "≐",
	"doteqdot": "≑",
	"DotEqual": "≐",
	"dotminus": "∸",
	"dotplus": "∔",
	"dotsquare": "⊡",
	"doublebarwedge": "⌆",
	"DoubleContourIntegral": "∯",
	"DoubleDot": "¨",
	"DoubleDownArrow": "⇓",
	"DoubleLeftArrow": "⇐",
	"DoubleLeftRightArrow": "⇔",
	"DoubleLeftTee": "⫤",
	"DoubleLongLeftArrow": "⟸",
	"DoubleLongLeftRightArrow": "⟺",
	"DoubleLongRightArrow": "⟹",
	"DoubleRightArrow": "⇒",
	"DoubleRightTee": "⊨",
	"DoubleUpArrow": "⇑",
	"DoubleUpDownArrow": "⇕",
	"DoubleVerticalBar": "∥",
	"DownArrowBar": "⤓",
	"downarrow": "↓",
	"DownArrow": "↓",
	"Downarrow": "⇓",
	"DownArrowUpArrow": "⇵",
	"DownBreve": "̑",
	"downdownarrows": "⇊",
	"downharpoonleft": "⇃",
	"downharpoonright": "⇂",
	"DownLeftRightVector": "⥐",
	"DownLeftTeeVector": "⥞",
	"DownLeftVectorBar": "⥖",
	"DownLeftVector": "↽",
	"DownRightTeeVector": "⥟",
	"DownRightVectorBar": "⥗",
	"DownRightVector": "⇁",
	"DownTeeArrow": "↧",
	"DownTee": "⊤",
	"drbkarow": "⤐",
	"drcorn": "⌟",
	"drcrop": "⌌",
	"Dscr": "𝒟",
	"dscr": "𝒹",
	"DScy": "Ѕ",
	"dscy": "ѕ",
	"dsol": "⧶",
	"Dstrok": "Đ",
	"dstrok": "đ",
	"dtdot": "⋱",
	"dtri": "▿",
	"dtrif": "▾",
	"duarr": "⇵",
	"duhar": "⥯",
	"dwangle": "⦦",
	"DZcy": "Џ",
	"dzcy": "џ",
	"dzigrarr": "⟿",
	"Eacute": "É",
	"eacute": "é",
	"easter": "⩮",
	"Ecaron": "Ě",
	"ecaron": "ě",
	"Ecirc": "Ê",
	"ecirc": "ê",
	"ecir": "≖",
	"ecolon": "≕",
	"Ecy": "Э",
	"ecy": "э",
	"eDDot": "⩷",
	"Edot": "Ė",
	"edot": "ė",
	"eDot": "≑",
	"ee": "ⅇ",
	"efDot": "≒",
	"Efr": "𝔈",
	"efr": "𝔢",
	"eg": "⪚",
	"Egrave": "È",
	"egrave": "è",
	"egs": "⪖",
	"egsdot": "⪘",
	"el": "⪙",
	"Element": "∈",
	"elinters": "⏧",
	"ell": "ℓ",
	"els": "⪕",
	"elsdot": "⪗",
	"Emacr": "Ē",
	"emacr": "ē",
	"empty": "∅",
	"emptyset": "∅",
	"EmptySmallSquare": "◻",
	"emptyv": "∅",
	"EmptyVerySmallSquare": "▫",
	"emsp13": " ",
	"emsp14": " ",
	"emsp": " ",
	"ENG": "Ŋ",
	"eng": "ŋ",
	"ensp": " ",
	"Eogon": "Ę",
	"eogon": "ę",
	"Eopf": "𝔼",
	"eopf": "𝕖",
	"epar": "⋕",
	"eparsl": "⧣",
	"eplus": "⩱",
	"epsi": "ε",
	"Epsilon": "Ε",
	"epsilon": "ε",
	"epsiv": "ϵ",
	"eqcirc": "≖",
	"eqcolon": "≕",
	"eqsim": "≂",
	"eqslantgtr": "⪖",
	"eqslantless": "⪕",
	"Equal": "⩵",
	"equals": "=",
	"EqualTilde": "≂",
	"equest": "≟",
	"Equilibrium": "⇌",
	"equiv": "≡",
	"equivDD": "⩸",
	"eqvparsl": "⧥",
	"erarr": "⥱",
	"erDot": "≓",
	"escr": "ℯ",
	"Escr": "ℰ",
	"esdot": "≐",
	"Esim": "⩳",
	"esim": "≂",
	"Eta": "Η",
	"eta": "η",
	"ETH": "Ð",
	"eth": "ð",
	"Euml": "Ë",
	"euml": "ë",
	"euro": "€",
	"excl": "!",
	"exist": "∃",
	"Exists": "∃",
	"expectation": "ℰ",
	"exponentiale": "ⅇ",
	"ExponentialE": "ⅇ",
	"fallingdotseq": "≒",
	"Fcy": "Ф",
	"fcy": "ф",
	"female": "♀",
	"ffilig": "ﬃ",
	"fflig": "ﬀ",
	"ffllig": "ﬄ",
	"Ffr": "𝔉",
	"ffr": "𝔣",
	"filig": "ﬁ",
	"FilledSmallSquare": "◼",
	"FilledVerySmallSquare": "▪",
	"fjlig": "fj",
	"flat": "♭",
	"fllig": "ﬂ",
	"fltns": "▱",
	"fnof": "ƒ",
	"Fopf": "𝔽",
	"fopf": "𝕗",
	"forall": "∀",
	"ForAll": "∀",
	"fork": "⋔",
	"forkv": "⫙",
	"Fouriertrf": "ℱ",
	"fpartint": "⨍",
	"frac12": "½",
	"frac13": "⅓",
	"frac14": "¼",
	"frac15": "⅕",
	"frac16": "⅙",
	"frac18": "⅛",
	"frac23": "⅔",
	"frac25": "⅖",
	"frac34": "¾",
	"frac35": "⅗",
	"frac38": "⅜",
	"frac45": "⅘",
	"frac56": "⅚",
	"frac58": "⅝",
	"frac78": "⅞",
	"frasl": "⁄",
	"frown": "⌢",
	"fscr": "𝒻",
	"Fscr": "ℱ",
	"gacute": "ǵ",
	"Gamma": "Γ",
	"gamma": "γ",
	"Gammad": "Ϝ",
	"gammad": "ϝ",
	"gap": "⪆",
	"Gbreve": "Ğ",
	"gbreve": "ğ",
	"Gcedil": "Ģ",
	"Gcirc": "Ĝ",
	"gcirc": "ĝ",
	"Gcy": "Г",
	"gcy": "г",
	"Gdot": "Ġ",
	"gdot": "ġ",
	"ge": "≥",
	"gE": "≧",
	"gEl": "⪌",
	"gel": "⋛",
	"geq": "≥",
	"geqq": "≧",
	"geqslant": "⩾",
	"gescc": "⪩",
	"ges": "⩾",
	"gesdot": "⪀",
	"gesdoto": "⪂",
	"gesdotol": "⪄",
	"gesl": "⋛︀",
	"gesles": "⪔",
	"Gfr": "𝔊",
	"gfr": "𝔤",
	"gg": "≫",
	"Gg": "⋙",
	"ggg": "⋙",
	"gimel": "ℷ",
	"GJcy": "Ѓ",
	"gjcy": "ѓ",
	"gla": "⪥",
	"gl": "≷",
	"glE": "⪒",
	"glj": "⪤",
	"gnap": "⪊",
	"gnapprox": "⪊",
	"gne": "⪈",
	"gnE": "≩",
	"gneq": "⪈",
	"gneqq": "≩",
	"gnsim": "⋧",
	"Gopf": "𝔾",
	"gopf": "𝕘",
	"grave": "`",
	"GreaterEqual": "≥",
	"GreaterEqualLess": "⋛",
	"GreaterFullEqual": "≧",
	"GreaterGreater": "⪢",
	"GreaterLess": "≷",
	"GreaterSlantEqual": "⩾",
	"GreaterTilde": "≳",
	"Gscr": "𝒢",
	"gscr": "ℊ",
	"gsim": "≳",
	"gsime": "⪎",
	"gsiml": "⪐",
	"gtcc": "⪧",
	"gtcir": "⩺",
	"gt": ">",
	"GT": ">",
	"Gt": "≫",
	"gtdot": "⋗",
	"gtlPar": "⦕",
	"gtquest": "⩼",
	"gtrapprox": "⪆",
	"gtrarr": "⥸",
	"gtrdot": "⋗",
	"gtreqless": "⋛",
	"gtreqqless": "⪌",
	"gtrless": "≷",
	"gtrsim": "≳",
	"gvertneqq": "≩︀",
	"gvnE": "≩︀",
	"Hacek": "ˇ",
	"hairsp": " ",
	"half": "½",
	"hamilt": "ℋ",
	"HARDcy": "Ъ",
	"hardcy": "ъ",
	"harrcir": "⥈",
	"harr": "↔",
	"hArr": "⇔",
	"harrw": "↭",
	"Hat": "^",
	"hbar": "ℏ",
	"Hcirc": "Ĥ",
	"hcirc": "ĥ",
	"hearts": "♥",
	"heartsuit": "♥",
	"hellip": "…",
	"hercon": "⊹",
	"hfr": "𝔥",
	"Hfr": "ℌ",
	"HilbertSpace": "ℋ",
	"hksearow": "⤥",
	"hkswarow": "⤦",
	"hoarr": "⇿",
	"homtht": "∻",
	"hookleftarrow": "↩",
	"hookrightarrow": "↪",
	"hopf": "𝕙",
	"Hopf": "ℍ",
	"horbar": "―",
	"HorizontalLine": "─",
	"hscr": "𝒽",
	"Hscr": "ℋ",
	"hslash": "ℏ",
	"Hstrok": "Ħ",
	"hstrok": "ħ",
	"HumpDownHump": "≎",
	"HumpEqual": "≏",
	"hybull": "⁃",
	"hyphen": "‐",
	"Iacute": "Í",
	"iacute": "í",
	"ic": "⁣",
	"Icirc": "Î",
	"icirc": "î",
	"Icy": "И",
	"icy": "и",
	"Idot": "İ",
	"IEcy": "Е",
	"iecy": "е",
	"iexcl": "¡",
	"iff": "⇔",
	"ifr": "𝔦",
	"Ifr": "ℑ",
	"Igrave": "Ì",
	"igrave": "ì",
	"ii": "ⅈ",
	"iiiint": "⨌",
	"iiint": "∭",
	"iinfin": "⧜",
	"iiota": "℩",
	"IJlig": "Ĳ",
	"ijlig": "ĳ",
	"Imacr": "Ī",
	"imacr": "ī",
	"image": "ℑ",
	"ImaginaryI": "ⅈ",
	"imagline": "ℐ",
	"imagpart": "ℑ",
	"imath": "ı",
	"Im": "ℑ",
	"imof": "⊷",
	"imped": "Ƶ",
	"Implies": "⇒",
	"incare": "℅",
	"in": "∈",
	"infin": "∞",
	"infintie": "⧝",
	"inodot": "ı",
	"intcal": "⊺",
	"int": "∫",
	"Int": "∬",
	"integers": "ℤ",
	"Integral": "∫",
	"intercal": "⊺",
	"Intersection": "⋂",
	"intlarhk": "⨗",
	"intprod": "⨼",
	"InvisibleComma": "⁣",
	"InvisibleTimes": "⁢",
	"IOcy": "Ё",
	"iocy": "ё",
	"Iogon": "Į",
	"iogon": "į",
	"Iopf": "𝕀",
	"iopf": "𝕚",
	"Iota": "Ι",
	"iota": "ι",
	"iprod": "⨼",
	"iquest": "¿",
	"iscr": "𝒾",
	"Iscr": "ℐ",
	"isin": "∈",
	"isindot": "⋵",
	"isinE": "⋹",
	"isins": "⋴",
	"isinsv": "⋳",
	"isinv": "∈",
	"it": "⁢",
	"Itilde": "Ĩ",
	"itilde": "ĩ",
	"Iukcy": "І",
	"iukcy": "і",
	"Iuml": "Ï",
	"iuml": "ï",
	"Jcirc": "Ĵ",
	"jcirc": "ĵ",
	"Jcy": "Й",
	"jcy": "й",
	"Jfr": "𝔍",
	"jfr": "𝔧",
	"jmath": "ȷ",
	"Jopf": "𝕁",
	"jopf": "𝕛",
	"Jscr": "𝒥",
	"jscr": "𝒿",
	"Jsercy": "Ј",
	"jsercy": "ј",
	"Jukcy": "Є",
	"jukcy": "є",
	"Kappa": "Κ",
	"kappa": "κ",
	"kappav": "ϰ",
	"Kcedil": "Ķ",
	"kcedil": "ķ",
	"Kcy": "К",
	"kcy": "к",
	"Kfr": "𝔎",
	"kfr": "𝔨",
	"kgreen": "ĸ",
	"KHcy": "Х",
	"khcy": "х",
	"KJcy": "Ќ",
	"kjcy": "ќ",
	"Kopf": "𝕂",
	"kopf": "𝕜",
	"Kscr": "𝒦",
	"kscr": "𝓀",
	"lAarr": "⇚",
	"Lacute": "Ĺ",
	"lacute": "ĺ",
	"laemptyv": "⦴",
	"lagran": "ℒ",
	"Lambda": "Λ",
	"lambda": "λ",
	"lang": "⟨",
	"Lang": "⟪",
	"langd": "⦑",
	"langle": "⟨",
	"lap": "⪅",
	"Laplacetrf": "ℒ",
	"laquo": "«",
	"larrb": "⇤",
	"larrbfs": "⤟",
	"larr": "←",
	"Larr": "↞",
	"lArr": "⇐",
	"larrfs": "⤝",
	"larrhk": "↩",
	"larrlp": "↫",
	"larrpl": "⤹",
	"larrsim": "⥳",
	"larrtl": "↢",
	"latail": "⤙",
	"lAtail": "⤛",
	"lat": "⪫",
	"late": "⪭",
	"lates": "⪭︀",
	"lbarr": "⤌",
	"lBarr": "⤎",
	"lbbrk": "❲",
	"lbrace": "{",
	"lbrack": "[",
	"lbrke": "⦋",
	"lbrksld": "⦏",
	"lbrkslu": "⦍",
	"Lcaron": "Ľ",
	"lcaron": "ľ",
	"Lcedil": "Ļ",
	"lcedil": "ļ",
	"lceil": "⌈",
	"lcub": "{",
	"Lcy": "Л",
	"lcy": "л",
	"ldca": "⤶",
	"ldquo": "“",
	"ldquor": "„",
	"ldrdhar": "⥧",
	"ldrushar": "⥋",
	"ldsh": "↲",
	"le": "≤",
	"lE": "≦",
	"LeftAngleBracket": "⟨",
	"LeftArrowBar": "⇤",
	"leftarrow": "←",
	"LeftArrow": "←",
	"Leftarrow": "⇐",
	"LeftArrowRightArrow": "⇆",
	"leftarrowtail": "↢",
	"LeftCeiling": "⌈",
	"LeftDoubleBracket": "⟦",
	"LeftDownTeeVector": "⥡",
	"LeftDownVectorBar": "⥙",
	"LeftDownVector": "⇃",
	"LeftFloor": "⌊",
	"leftharpoondown": "↽",
	"leftharpoonup": "↼",
	"leftleftarrows": "⇇",
	"leftrightarrow": "↔",
	"LeftRightArrow": "↔",
	"Leftrightarrow": "⇔",
	"leftrightarrows": "⇆",
	"leftrightharpoons": "⇋",
	"leftrightsquigarrow": "↭",
	"LeftRightVector": "⥎",
	"LeftTeeArrow": "↤",
	"LeftTee": "⊣",
	"LeftTeeVector": "⥚",
	"leftthreetimes": "⋋",
	"LeftTriangleBar": "⧏",
	"LeftTriangle": "⊲",
	"LeftTriangleEqual": "⊴",
	"LeftUpDownVector": "⥑",
	"LeftUpTeeVector": "⥠",
	"LeftUpVectorBar": "⥘",
	"LeftUpVector": "↿",
	"LeftVectorBar": "⥒",
	"LeftVector": "↼",
	"lEg": "⪋",
	"leg": "⋚",
	"leq": "≤",
	"leqq": "≦",
	"leqslant": "⩽",
	"lescc": "⪨",
	"les": "⩽",
	"lesdot": "⩿",
	"lesdoto": "⪁",
	"lesdotor": "⪃",
	"lesg": "⋚︀",
	"lesges": "⪓",
	"lessapprox": "⪅",
	"lessdot": "⋖",
	"lesseqgtr": "⋚",
	"lesseqqgtr": "⪋",
	"LessEqualGreater": "⋚",
	"LessFullEqual": "≦",
	"LessGreater": "≶",
	"lessgtr": "≶",
	"LessLess": "⪡",
	"lesssim": "≲",
	"LessSlantEqual": "⩽",
	"LessTilde": "≲",
	"lfisht": "⥼",
	"lfloor": "⌊",
	"Lfr": "𝔏",
	"lfr": "𝔩",
	"lg": "≶",
	"lgE": "⪑",
	"lHar": "⥢",
	"lhard": "↽",
	"lharu": "↼",
	"lharul": "⥪",
	"lhblk": "▄",
	"LJcy": "Љ",
	"ljcy": "љ",
	"llarr": "⇇",
	"ll": "≪",
	"Ll": "⋘",
	"llcorner": "⌞",
	"Lleftarrow": "⇚",
	"llhard": "⥫",
	"lltri": "◺",
	"Lmidot": "Ŀ",
	"lmidot": "ŀ",
	"lmoustache": "⎰",
	"lmoust": "⎰",
	"lnap": "⪉",
	"lnapprox": "⪉",
	"lne": "⪇",
	"lnE": "≨",
	"lneq": "⪇",
	"lneqq": "≨",
	"lnsim": "⋦",
	"loang": "⟬",
	"loarr": "⇽",
	"lobrk": "⟦",
	"longleftarrow": "⟵",
	"LongLeftArrow": "⟵",
	"Longleftarrow": "⟸",
	"longleftrightarrow": "⟷",
	"LongLeftRightArrow": "⟷",
	"Longleftrightarrow": "⟺",
	"longmapsto": "⟼",
	"longrightarrow": "⟶",
	"LongRightArrow": "⟶",
	"Longrightarrow": "⟹",
	"looparrowleft": "↫",
	"looparrowright": "↬",
	"lopar": "⦅",
	"Lopf": "𝕃",
	"lopf": "𝕝",
	"loplus": "⨭",
	"lotimes": "⨴",
	"lowast": "∗",
	"lowbar": "_",
	"LowerLeftArrow": "↙",
	"LowerRightArrow": "↘",
	"loz": "◊",
	"lozenge": "◊",
	"lozf": "⧫",
	"lpar": "(",
	"lparlt": "⦓",
	"lrarr": "⇆",
	"lrcorner": "⌟",
	"lrhar": "⇋",
	"lrhard": "⥭",
	"lrm": "‎",
	"lrtri": "⊿",
	"lsaquo": "‹",
	"lscr": "𝓁",
	"Lscr": "ℒ",
	"lsh": "↰",
	"Lsh": "↰",
	"lsim": "≲",
	"lsime": "⪍",
	"lsimg": "⪏",
	"lsqb": "[",
	"lsquo": "‘",
	"lsquor": "‚",
	"Lstrok": "Ł",
	"lstrok": "ł",
	"ltcc": "⪦",
	"ltcir": "⩹",
	"lt": "<",
	"LT": "<",
	"Lt": "≪",
	"ltdot": "⋖",
	"lthree": "⋋",
	"ltimes": "⋉",
	"ltlarr": "⥶",
	"ltquest": "⩻",
	"ltri": "◃",
	"ltrie": "⊴",
	"ltrif": "◂",
	"ltrPar": "⦖",
	"lurdshar": "⥊",
	"luruhar": "⥦",
	"lvertneqq": "≨︀",
	"lvnE": "≨︀",
	"macr": "¯",
	"male": "♂",
	"malt": "✠",
	"maltese": "✠",
	"Map": "⤅",
	"map": "↦",
	"mapsto": "↦",
	"mapstodown": "↧",
	"mapstoleft": "↤",
	"mapstoup": "↥",
	"marker": "▮",
	"mcomma": "⨩",
	"Mcy": "М",
	"mcy": "м",
	"mdash": "—",
	"mDDot": "∺",
	"measuredangle": "∡",
	"MediumSpace": " ",
	"Mellintrf": "ℳ",
	"Mfr": "𝔐",
	"mfr": "𝔪",
	"mho": "℧",
	"micro": "µ",
	"midast": "*",
	"midcir": "⫰",
	"mid": "∣",
	"middot": "·",
	"minusb": "⊟",
	"minus": "−",
	"minusd": "∸",
	"minusdu": "⨪",
	"MinusPlus": "∓",
	"mlcp": "⫛",
	"mldr": "…",
	"mnplus": "∓",
	"models": "⊧",
	"Mopf": "𝕄",
	"mopf": "𝕞",
	"mp": "∓",
	"mscr": "𝓂",
	"Mscr": "ℳ",
	"mstpos": "∾",
	"Mu": "Μ",
	"mu": "μ",
	"multimap": "⊸",
	"mumap": "⊸",
	"nabla": "∇",
	"Nacute": "Ń",
	"nacute": "ń",
	"nang": "∠⃒",
	"nap": "≉",
	"napE": "⩰̸",
	"napid": "≋̸",
	"napos": "ŉ",
	"napprox": "≉",
	"natural": "♮",
	"naturals": "ℕ",
	"natur": "♮",
	"nbsp": " ",
	"nbump": "≎̸",
	"nbumpe": "≏̸",
	"ncap": "⩃",
	"Ncaron": "Ň",
	"ncaron": "ň",
	"Ncedil": "Ņ",
	"ncedil": "ņ",
	"ncong": "≇",
	"ncongdot": "⩭̸",
	"ncup": "⩂",
	"Ncy": "Н",
	"ncy": "н",
	"ndash": "–",
	"nearhk": "⤤",
	"nearr": "↗",
	"neArr": "⇗",
	"nearrow": "↗",
	"ne": "≠",
	"nedot": "≐̸",
	"NegativeMediumSpace": "​",
	"NegativeThickSpace": "​",
	"NegativeThinSpace": "​",
	"NegativeVeryThinSpace": "​",
	"nequiv": "≢",
	"nesear": "⤨",
	"nesim": "≂̸",
	"NestedGreaterGreater": "≫",
	"NestedLessLess": "≪",
	"NewLine": "\n",
	"nexist": "∄",
	"nexists": "∄",
	"Nfr": "𝔑",
	"nfr": "𝔫",
	"ngE": "≧̸",
	"nge": "≱",
	"ngeq": "≱",
	"ngeqq": "≧̸",
	"ngeqslant": "⩾̸",
	"nges": "⩾̸",
	"nGg": "⋙̸",
	"ngsim": "≵",
	"nGt": "≫⃒",
	"ngt": "≯",
	"ngtr": "≯",
	"nGtv": "≫̸",
	"nharr": "↮",
	"nhArr": "⇎",
	"nhpar": "⫲",
	"ni": "∋",
	"nis": "⋼",
	"nisd": "⋺",
	"niv": "∋",
	"NJcy": "Њ",
	"njcy": "њ",
	"nlarr": "↚",
	"nlArr": "⇍",
	"nldr": "‥",
	"nlE": "≦̸",
	"nle": "≰",
	"nleftarrow": "↚",
	"nLeftarrow": "⇍",
	"nleftrightarrow": "↮",
	"nLeftrightarrow": "⇎",
	"nleq": "≰",
	"nleqq": "≦̸",
	"nleqslant": "⩽̸",
	"nles": "⩽̸",
	"nless": "≮",
	"nLl": "⋘̸",
	"nlsim": "≴",
	"nLt": "≪⃒",
	"nlt": "≮",
	"nltri": "⋪",
	"nltrie": "⋬",
	"nLtv": "≪̸",
	"nmid": "∤",
	"NoBreak": "⁠",
	"NonBreakingSpace": " ",
	"nopf": "𝕟",
	"Nopf": "ℕ",
	"Not": "⫬",
	"not": "¬",
	"NotCongruent": "≢",
	"NotCupCap": "≭",
	"NotDoubleVerticalBar": "∦",
	"NotElement": "∉",
	"NotEqual": "≠",
	"NotEqualTilde": "≂̸",
	"NotExists": "∄",
	"NotGreater": "≯",
	"NotGreaterEqual": "≱",
	"NotGreaterFullEqual": "≧̸",
	"NotGreaterGreater": "≫̸",
	"NotGreaterLess": "≹",
	"NotGreaterSlantEqual": "⩾̸",
	"NotGreaterTilde": "≵",
	"NotHumpDownHump": "≎̸",
	"NotHumpEqual": "≏̸",
	"notin": "∉",
	"notindot": "⋵̸",
	"notinE": "⋹̸",
	"notinva": "∉",
	"notinvb": "⋷",
	"notinvc": "⋶",
	"NotLeftTriangleBar": "⧏̸",
	"NotLeftTriangle": "⋪",
	"NotLeftTriangleEqual": "⋬",
	"NotLess": "≮",
	"NotLessEqual": "≰",
	"NotLessGreater": "≸",
	"NotLessLess": "≪̸",
	"NotLessSlantEqual": "⩽̸",
	"NotLessTilde": "≴",
	"NotNestedGreaterGreater": "⪢̸",
	"NotNestedLessLess": "⪡̸",
	"notni": "∌",
	"notniva": "∌",
	"notnivb": "⋾",
	"notnivc": "⋽",
	"NotPrecedes": "⊀",
	"NotPrecedesEqual": "⪯̸",
	"NotPrecedesSlantEqual": "⋠",
	"NotReverseElement": "∌",
	"NotRightTriangleBar": "⧐̸",
	"NotRightTriangle": "⋫",
	"NotRightTriangleEqual": "⋭",
	"NotSquareSubset": "⊏̸",
	"NotSquareSubsetEqual": "⋢",
	"NotSquareSuperset": "⊐̸",
	"NotSquareSupersetEqual": "⋣",
	"NotSubset": "⊂⃒",
	"NotSubsetEqual": "⊈",
	"NotSucceeds": "⊁",
	"NotSucceedsEqual": "⪰̸",
	"NotSucceedsSlantEqual": "⋡",
	"NotSucceedsTilde": "≿̸",
	"NotSuperset": "⊃⃒",
	"NotSupersetEqual": "⊉",
	"NotTilde": "≁",
	"NotTildeEqual": "≄",
	"NotTildeFullEqual": "≇",
	"NotTildeTilde": "≉",
	"NotVerticalBar": "∤",
	"nparallel": "∦",
	"npar": "∦",
	"nparsl": "⫽⃥",
	"npart": "∂̸",
	"npolint": "⨔",
	"npr": "⊀",
	"nprcue": "⋠",
	"nprec": "⊀",
	"npreceq": "⪯̸",
	"npre": "⪯̸",
	"nrarrc": "⤳̸",
	"nrarr": "↛",
	"nrArr": "⇏",
	"nrarrw": "↝̸",
	"nrightarrow": "↛",
	"nRightarrow": "⇏",
	"nrtri": "⋫",
	"nrtrie": "⋭",
	"nsc": "⊁",
	"nsccue": "⋡",
	"nsce": "⪰̸",
	"Nscr": "𝒩",
	"nscr": "𝓃",
	"nshortmid": "∤",
	"nshortparallel": "∦",
	"nsim": "≁",
	"nsime": "≄",
	"nsimeq": "≄",
	"nsmid": "∤",
	"nspar": "∦",
	"nsqsube": "⋢",
	"nsqsupe": "⋣",
	"nsub": "⊄",
	"nsubE": "⫅̸",
	"nsube": "⊈",
	"nsubset": "⊂⃒",
	"nsubseteq": "⊈",
	"nsubseteqq": "⫅̸",
	"nsucc": "⊁",
	"nsucceq": "⪰̸",
	"nsup": "⊅",
	"nsupE": "⫆̸",
	"nsupe": "⊉",
	"nsupset": "⊃⃒",
	"nsupseteq": "⊉",
	"nsupseteqq": "⫆̸",
	"ntgl": "≹",
	"Ntilde": "Ñ",
	"ntilde": "ñ",
	"ntlg": "≸",
	"ntriangleleft": "⋪",
	"ntrianglelefteq": "⋬",
	"ntriangleright": "⋫",
	"ntrianglerighteq": "⋭",
	"Nu": "Ν",
	"nu": "ν",
	"num": "#",
	"numero": "№",
	"numsp": " ",
	"nvap": "≍⃒",
	"nvdash": "⊬",
	"nvDash": "⊭",
	"nVdash": "⊮",
	"nVDash": "⊯",
	"nvge": "≥⃒",
	"nvgt": ">⃒",
	"nvHarr": "⤄",
	"nvinfin": "⧞",
	"nvlArr": "⤂",
	"nvle": "≤⃒",
	"nvlt": "<⃒",
	"nvltrie": "⊴⃒",
	"nvrArr": "⤃",
	"nvrtrie": "⊵⃒",
	"nvsim": "∼⃒",
	"nwarhk": "⤣",
	"nwarr": "↖",
	"nwArr": "⇖",
	"nwarrow": "↖",
	"nwnear": "⤧",
	"Oacute": "Ó",
	"oacute": "ó",
	"oast": "⊛",
	"Ocirc": "Ô",
	"ocirc": "ô",
	"ocir": "⊚",
	"Ocy": "О",
	"ocy": "о",
	"odash": "⊝",
	"Odblac": "Ő",
	"odblac": "ő",
	"odiv": "⨸",
	"odot": "⊙",
	"odsold": "⦼",
	"OElig": "Œ",
	"oelig": "œ",
	"ofcir": "⦿",
	"Ofr": "𝔒",
	"ofr": "𝔬",
	"ogon": "˛",
	"Ograve": "Ò",
	"ograve": "ò",
	"ogt": "⧁",
	"ohbar": "⦵",
	"ohm": "Ω",
	"oint": "∮",
	"olarr": "↺",
	"olcir": "⦾",
	"olcross": "⦻",
	"oline": "‾",
	"olt": "⧀",
	"Omacr": "Ō",
	"omacr": "ō",
	"Omega": "Ω",
	"omega": "ω",
	"Omicron": "Ο",
	"omicron": "ο",
	"omid": "⦶",
	"ominus": "⊖",
	"Oopf": "𝕆",
	"oopf": "𝕠",
	"opar": "⦷",
	"OpenCurlyDoubleQuote": "“",
	"OpenCurlyQuote": "‘",
	"operp": "⦹",
	"oplus": "⊕",
	"orarr": "↻",
	"Or": "⩔",
	"or": "∨",
	"ord": "⩝",
	"order": "ℴ",
	"orderof": "ℴ",
	"ordf": "ª",
	"ordm": "º",
	"origof": "⊶",
	"oror": "⩖",
	"orslope": "⩗",
	"orv": "⩛",
	"oS": "Ⓢ",
	"Oscr": "𝒪",
	"oscr": "ℴ",
	"Oslash": "Ø",
	"oslash": "ø",
	"osol": "⊘",
	"Otilde": "Õ",
	"otilde": "õ",
	"otimesas": "⨶",
	"Otimes": "⨷",
	"otimes": "⊗",
	"Ouml": "Ö",
	"ouml": "ö",
	"ovbar": "⌽",
	"OverBar": "‾",
	"OverBrace": "⏞",
	"OverBracket": "⎴",
	"OverParenthesis": "⏜",
	"para": "¶",
	"parallel": "∥",
	"par": "∥",
	"parsim": "⫳",
	"parsl": "⫽",
	"part": "∂",
	"PartialD": "∂",
	"Pcy": "П",
	"pcy": "п",
	"percnt": "%",
	"period": ".",
	"permil": "‰",
	"perp": "⊥",
	"pertenk": "‱",
	"Pfr": "𝔓",
	"pfr": "𝔭",
	"Phi": "Φ",
	"phi": "φ",
	"phiv": "ϕ",
	"phmmat": "ℳ",
	"phone": "☎",
	"Pi": "Π",
	"pi": "π",
	"pitchfork": "⋔",
	"piv": "ϖ",
	"planck": "ℏ",
	"planckh": "ℎ",
	"plankv": "ℏ",
	"plusacir": "⨣",
	"plusb": "⊞",
	"pluscir": "⨢",
	"plus": "+",
	"plusdo": "∔",
	"plusdu": "⨥",
	"pluse": "⩲",
	"PlusMinus": "±",
	"plusmn": "±",
	"plussim": "⨦",
	"plustwo": "⨧",
	"pm": "±",
	"Poincareplane": "ℌ",
	"pointint": "⨕",
	"popf": "𝕡",
	"Popf": "ℙ",
	"pound": "£",
	"prap": "⪷",
	"Pr": "⪻",
	"pr": "≺",
	"prcue": "≼",
	"precapprox": "⪷",
	"prec": "≺",
	"preccurlyeq": "≼",
	"Precedes": "≺",
	"PrecedesEqual": "⪯",
	"PrecedesSlantEqual": "≼",
	"PrecedesTilde": "≾",
	"preceq": "⪯",
	"precnapprox": "⪹",
	"precneqq": "⪵",
	"precnsim": "⋨",
	"pre": "⪯",
	"prE": "⪳",
	"precsim": "≾",
	"prime": "′",
	"Prime": "″",
	"primes": "ℙ",
	"prnap": "⪹",
	"prnE": "⪵",
	"prnsim": "⋨",
	"prod": "∏",
	"Product": "∏",
	"profalar": "⌮",
	"profline": "⌒",
	"profsurf": "⌓",
	"prop": "∝",
	"Proportional": "∝",
	"Proportion": "∷",
	"propto": "∝",
	"prsim": "≾",
	"prurel": "⊰",
	"Pscr": "𝒫",
	"pscr": "𝓅",
	"Psi": "Ψ",
	"psi": "ψ",
	"puncsp": " ",
	"Qfr": "𝔔",
	"qfr": "𝔮",
	"qint": "⨌",
	"qopf": "𝕢",
	"Qopf": "ℚ",
	"qprime": "⁗",
	"Qscr": "𝒬",
	"qscr": "𝓆",
	"quaternions": "ℍ",
	"quatint": "⨖",
	"quest": "?",
	"questeq": "≟",
	"quot": "\"",
	"QUOT": "\"",
	"rAarr": "⇛",
	"race": "∽̱",
	"Racute": "Ŕ",
	"racute": "ŕ",
	"radic": "√",
	"raemptyv": "⦳",
	"rang": "⟩",
	"Rang": "⟫",
	"rangd": "⦒",
	"range": "⦥",
	"rangle": "⟩",
	"raquo": "»",
	"rarrap": "⥵",
	"rarrb": "⇥",
	"rarrbfs": "⤠",
	"rarrc": "⤳",
	"rarr": "→",
	"Rarr": "↠",
	"rArr": "⇒",
	"rarrfs": "⤞",
	"rarrhk": "↪",
	"rarrlp": "↬",
	"rarrpl": "⥅",
	"rarrsim": "⥴",
	"Rarrtl": "⤖",
	"rarrtl": "↣",
	"rarrw": "↝",
	"ratail": "⤚",
	"rAtail": "⤜",
	"ratio": "∶",
	"rationals": "ℚ",
	"rbarr": "⤍",
	"rBarr": "⤏",
	"RBarr": "⤐",
	"rbbrk": "❳",
	"rbrace": "}",
	"rbrack": "]",
	"rbrke": "⦌",
	"rbrksld": "⦎",
	"rbrkslu": "⦐",
	"Rcaron": "Ř",
	"rcaron": "ř",
	"Rcedil": "Ŗ",
	"rcedil": "ŗ",
	"rceil": "⌉",
	"rcub": "}",
	"Rcy": "Р",
	"rcy": "р",
	"rdca": "⤷",
	"rdldhar": "⥩",
	"rdquo": "”",
	"rdquor": "”",
	"rdsh": "↳",
	"real": "ℜ",
	"realine": "ℛ",
	"realpart": "ℜ",
	"reals": "ℝ",
	"Re": "ℜ",
	"rect": "▭",
	"reg": "®",
	"REG": "®",
	"ReverseElement": "∋",
	"ReverseEquilibrium": "⇋",
	"ReverseUpEquilibrium": "⥯",
	"rfisht": "⥽",
	"rfloor": "⌋",
	"rfr": "𝔯",
	"Rfr": "ℜ",
	"rHar": "⥤",
	"rhard": "⇁",
	"rharu": "⇀",
	"rharul": "⥬",
	"Rho": "Ρ",
	"rho": "ρ",
	"rhov": "ϱ",
	"RightAngleBracket": "⟩",
	"RightArrowBar": "⇥",
	"rightarrow": "→",
	"RightArrow": "→",
	"Rightarrow": "⇒",
	"RightArrowLeftArrow": "⇄",
	"rightarrowtail": "↣",
	"RightCeiling": "⌉",
	"RightDoubleBracket": "⟧",
	"RightDownTeeVector": "⥝",
	"RightDownVectorBar": "⥕",
	"RightDownVector": "⇂",
	"RightFloor": "⌋",
	"rightharpoondown": "⇁",
	"rightharpoonup": "⇀",
	"rightleftarrows": "⇄",
	"rightleftharpoons": "⇌",
	"rightrightarrows": "⇉",
	"rightsquigarrow": "↝",
	"RightTeeArrow": "↦",
	"RightTee": "⊢",
	"RightTeeVector": "⥛",
	"rightthreetimes": "⋌",
	"RightTriangleBar": "⧐",
	"RightTriangle": "⊳",
	"RightTriangleEqual": "⊵",
	"RightUpDownVector": "⥏",
	"RightUpTeeVector": "⥜",
	"RightUpVectorBar": "⥔",
	"RightUpVector": "↾",
	"RightVectorBar": "⥓",
	"RightVector": "⇀",
	"ring": "˚",
	"risingdotseq": "≓",
	"rlarr": "⇄",
	"rlhar": "⇌",
	"rlm": "‏",
	"rmoustache": "⎱",
	"rmoust": "⎱",
	"rnmid": "⫮",
	"roang": "⟭",
	"roarr": "⇾",
	"robrk": "⟧",
	"ropar": "⦆",
	"ropf": "𝕣",
	"Ropf": "ℝ",
	"roplus": "⨮",
	"rotimes": "⨵",
	"RoundImplies": "⥰",
	"rpar": ")",
	"rpargt": "⦔",
	"rppolint": "⨒",
	"rrarr": "⇉",
	"Rrightarrow": "⇛",
	"rsaquo": "›",
	"rscr": "𝓇",
	"Rscr": "ℛ",
	"rsh": "↱",
	"Rsh": "↱",
	"rsqb": "]",
	"rsquo": "’",
	"rsquor": "’",
	"rthree": "⋌",
	"rtimes": "⋊",
	"rtri": "▹",
	"rtrie": "⊵",
	"rtrif": "▸",
	"rtriltri": "⧎",
	"RuleDelayed": "⧴",
	"ruluhar": "⥨",
	"rx": "℞",
	"Sacute": "Ś",
	"sacute": "ś",
	"sbquo": "‚",
	"scap": "⪸",
	"Scaron": "Š",
	"scaron": "š",
	"Sc": "⪼",
	"sc": "≻",
	"sccue": "≽",
	"sce": "⪰",
	"scE": "⪴",
	"Scedil": "Ş",
	"scedil": "ş",
	"Scirc": "Ŝ",
	"scirc": "ŝ",
	"scnap": "⪺",
	"scnE": "⪶",
	"scnsim": "⋩",
	"scpolint": "⨓",
	"scsim": "≿",
	"Scy": "С",
	"scy": "с",
	"sdotb": "⊡",
	"sdot": "⋅",
	"sdote": "⩦",
	"searhk": "⤥",
	"searr": "↘",
	"seArr": "⇘",
	"searrow": "↘",
	"sect": "§",
	"semi": ";",
	"seswar": "⤩",
	"setminus": "∖",
	"setmn": "∖",
	"sext": "✶",
	"Sfr": "𝔖",
	"sfr": "𝔰",
	"sfrown": "⌢",
	"sharp": "♯",
	"SHCHcy": "Щ",
	"shchcy": "щ",
	"SHcy": "Ш",
	"shcy": "ш",
	"ShortDownArrow": "↓",
	"ShortLeftArrow": "←",
	"shortmid": "∣",
	"shortparallel": "∥",
	"ShortRightArrow": "→",
	"ShortUpArrow": "↑",
	"shy": "­",
	"Sigma": "Σ",
	"sigma": "σ",
	"sigmaf": "ς",
	"sigmav": "ς",
	"sim": "∼",
	"simdot": "⩪",
	"sime": "≃",
	"simeq": "≃",
	"simg": "⪞",
	"simgE": "⪠",
	"siml": "⪝",
	"simlE": "⪟",
	"simne": "≆",
	"simplus": "⨤",
	"simrarr": "⥲",
	"slarr": "←",
	"SmallCircle": "∘",
	"smallsetminus": "∖",
	"smashp": "⨳",
	"smeparsl": "⧤",
	"smid": "∣",
	"smile": "⌣",
	"smt": "⪪",
	"smte": "⪬",
	"smtes": "⪬︀",
	"SOFTcy": "Ь",
	"softcy": "ь",
	"solbar": "⌿",
	"solb": "⧄",
	"sol": "/",
	"Sopf": "𝕊",
	"sopf": "𝕤",
	"spades": "♠",
	"spadesuit": "♠",
	"spar": "∥",
	"sqcap": "⊓",
	"sqcaps": "⊓︀",
	"sqcup": "⊔",
	"sqcups": "⊔︀",
	"Sqrt": "√",
	"sqsub": "⊏",
	"sqsube": "⊑",
	"sqsubset": "⊏",
	"sqsubseteq": "⊑",
	"sqsup": "⊐",
	"sqsupe": "⊒",
	"sqsupset": "⊐",
	"sqsupseteq": "⊒",
	"square": "□",
	"Square": "□",
	"SquareIntersection": "⊓",
	"SquareSubset": "⊏",
	"SquareSubsetEqual": "⊑",
	"SquareSuperset": "⊐",
	"SquareSupersetEqual": "⊒",
	"SquareUnion": "⊔",
	"squarf": "▪",
	"squ": "□",
	"squf": "▪",
	"srarr": "→",
	"Sscr": "𝒮",
	"sscr": "𝓈",
	"ssetmn": "∖",
	"ssmile": "⌣",
	"sstarf": "⋆",
	"Star": "⋆",
	"star": "☆",
	"starf": "★",
	"straightepsilon": "ϵ",
	"straightphi": "ϕ",
	"strns": "¯",
	"sub": "⊂",
	"Sub": "⋐",
	"subdot": "⪽",
	"subE": "⫅",
	"sube": "⊆",
	"subedot": "⫃",
	"submult": "⫁",
	"subnE": "⫋",
	"subne": "⊊",
	"subplus": "⪿",
	"subrarr": "⥹",
	"subset": "⊂",
	"Subset": "⋐",
	"subseteq": "⊆",
	"subseteqq": "⫅",
	"SubsetEqual": "⊆",
	"subsetneq": "⊊",
	"subsetneqq": "⫋",
	"subsim": "⫇",
	"subsub": "⫕",
	"subsup": "⫓",
	"succapprox": "⪸",
	"succ": "≻",
	"succcurlyeq": "≽",
	"Succeeds": "≻",
	"SucceedsEqual": "⪰",
	"SucceedsSlantEqual": "≽",
	"SucceedsTilde": "≿",
	"succeq": "⪰",
	"succnapprox": "⪺",
	"succneqq": "⪶",
	"succnsim": "⋩",
	"succsim": "≿",
	"SuchThat": "∋",
	"sum": "∑",
	"Sum": "∑",
	"sung": "♪",
	"sup1": "¹",
	"sup2": "²",
	"sup3": "³",
	"sup": "⊃",
	"Sup": "⋑",
	"supdot": "⪾",
	"supdsub": "⫘",
	"supE": "⫆",
	"supe": "⊇",
	"supedot": "⫄",
	"Superset": "⊃",
	"SupersetEqual": "⊇",
	"suphsol": "⟉",
	"suphsub": "⫗",
	"suplarr": "⥻",
	"supmult": "⫂",
	"supnE": "⫌",
	"supne": "⊋",
	"supplus": "⫀",
	"supset": "⊃",
	"Supset": "⋑",
	"supseteq": "⊇",
	"supseteqq": "⫆",
	"supsetneq": "⊋",
	"supsetneqq": "⫌",
	"supsim": "⫈",
	"supsub": "⫔",
	"supsup": "⫖",
	"swarhk": "⤦",
	"swarr": "↙",
	"swArr": "⇙",
	"swarrow": "↙",
	"swnwar": "⤪",
	"szlig": "ß",
	"Tab": "\t",
	"target": "⌖",
	"Tau": "Τ",
	"tau": "τ",
	"tbrk": "⎴",
	"Tcaron": "Ť",
	"tcaron": "ť",
	"Tcedil": "Ţ",
	"tcedil": "ţ",
	"Tcy": "Т",
	"tcy": "т",
	"tdot": "⃛",
	"telrec": "⌕",
	"Tfr": "𝔗",
	"tfr": "𝔱",
	"there4": "∴",
	"therefore": "∴",
	"Therefore": "∴",
	"Theta": "Θ",
	"theta": "θ",
	"thetasym": "ϑ",
	"thetav": "ϑ",
	"thickapprox": "≈",
	"thicksim": "∼",
	"ThickSpace": "  ",
	"ThinSpace": " ",
	"thinsp": " ",
	"thkap": "≈",
	"thksim": "∼",
	"THORN": "Þ",
	"thorn": "þ",
	"tilde": "˜",
	"Tilde": "∼",
	"TildeEqual": "≃",
	"TildeFullEqual": "≅",
	"TildeTilde": "≈",
	"timesbar": "⨱",
	"timesb": "⊠",
	"times": "×",
	"timesd": "⨰",
	"tint": "∭",
	"toea": "⤨",
	"topbot": "⌶",
	"topcir": "⫱",
	"top": "⊤",
	"Topf": "𝕋",
	"topf": "𝕥",
	"topfork": "⫚",
	"tosa": "⤩",
	"tprime": "‴",
	"trade": "™",
	"TRADE": "™",
	"triangle": "▵",
	"triangledown": "▿",
	"triangleleft": "◃",
	"trianglelefteq": "⊴",
	"triangleq": "≜",
	"triangleright": "▹",
	"trianglerighteq": "⊵",
	"tridot": "◬",
	"trie": "≜",
	"triminus": "⨺",
	"TripleDot": "⃛",
	"triplus": "⨹",
	"trisb": "⧍",
	"tritime": "⨻",
	"trpezium": "⏢",
	"Tscr": "𝒯",
	"tscr": "𝓉",
	"TScy": "Ц",
	"tscy": "ц",
	"TSHcy": "Ћ",
	"tshcy": "ћ",
	"Tstrok": "Ŧ",
	"tstrok": "ŧ",
	"twixt": "≬",
	"twoheadleftarrow": "↞",
	"twoheadrightarrow": "↠",
	"Uacute": "Ú",
	"uacute": "ú",
	"uarr": "↑",
	"Uarr": "↟",
	"uArr": "⇑",
	"Uarrocir": "⥉",
	"Ubrcy": "Ў",
	"ubrcy": "ў",
	"Ubreve": "Ŭ",
	"ubreve": "ŭ",
	"Ucirc": "Û",
	"ucirc": "û",
	"Ucy": "У",
	"ucy": "у",
	"udarr": "⇅",
	"Udblac": "Ű",
	"udblac": "ű",
	"udhar": "⥮",
	"ufisht": "⥾",
	"Ufr": "𝔘",
	"ufr": "𝔲",
	"Ugrave": "Ù",
	"ugrave": "ù",
	"uHar": "⥣",
	"uharl": "↿",
	"uharr": "↾",
	"uhblk": "▀",
	"ulcorn": "⌜",
	"ulcorner": "⌜",
	"ulcrop": "⌏",
	"ultri": "◸",
	"Umacr": "Ū",
	"umacr": "ū",
	"uml": "¨",
	"UnderBar": "_",
	"UnderBrace": "⏟",
	"UnderBracket": "⎵",
	"UnderParenthesis": "⏝",
	"Union": "⋃",
	"UnionPlus": "⊎",
	"Uogon": "Ų",
	"uogon": "ų",
	"Uopf": "𝕌",
	"uopf": "𝕦",
	"UpArrowBar": "⤒",
	"uparrow": "↑",
	"UpArrow": "↑",
	"Uparrow": "⇑",
	"UpArrowDownArrow": "⇅",
	"updownarrow": "↕",
	"UpDownArrow": "↕",
	"Updownarrow": "⇕",
	"UpEquilibrium": "⥮",
	"upharpoonleft": "↿",
	"upharpoonright": "↾",
	"uplus": "⊎",
	"UpperLeftArrow": "↖",
	"UpperRightArrow": "↗",
	"upsi": "υ",
	"Upsi": "ϒ",
	"upsih": "ϒ",
	"Upsilon": "Υ",
	"upsilon": "υ",
	"UpTeeArrow": "↥",
	"UpTee": "⊥",
	"upuparrows": "⇈",
	"urcorn": "⌝",
	"urcorner": "⌝",
	"urcrop": "⌎",
	"Uring": "Ů",
	"uring": "ů",
	"urtri": "◹",
	"Uscr": "𝒰",
	"uscr": "𝓊",
	"utdot": "⋰",
	"Utilde": "Ũ",
	"utilde": "ũ",
	"utri": "▵",
	"utrif": "▴",
	"uuarr": "⇈",
	"Uuml": "Ü",
	"uuml": "ü",
	"uwangle": "⦧",
	"vangrt": "⦜",
	"varepsilon": "ϵ",
	"varkappa": "ϰ",
	"varnothing": "∅",
	"varphi": "ϕ",
	"varpi": "ϖ",
	"varpropto": "∝",
	"varr": "↕",
	"vArr": "⇕",
	"varrho": "ϱ",
	"varsigma": "ς",
	"varsubsetneq": "⊊︀",
	"varsubsetneqq": "⫋︀",
	"varsupsetneq": "⊋︀",
	"varsupsetneqq": "⫌︀",
	"vartheta": "ϑ",
	"vartriangleleft": "⊲",
	"vartriangleright": "⊳",
	"vBar": "⫨",
	"Vbar": "⫫",
	"vBarv": "⫩",
	"Vcy": "В",
	"vcy": "в",
	"vdash": "⊢",
	"vDash": "⊨",
	"Vdash": "⊩",
	"VDash": "⊫",
	"Vdashl": "⫦",
	"veebar": "⊻",
	"vee": "∨",
	"Vee": "⋁",
	"veeeq": "≚",
	"vellip": "⋮",
	"verbar": "|",
	"Verbar": "‖",
	"vert": "|",
	"Vert": "‖",
	"VerticalBar": "∣",
	"VerticalLine": "|",
	"VerticalSeparator": "❘",
	"VerticalTilde": "≀",
	"VeryThinSpace": " ",
	"Vfr": "𝔙",
	"vfr": "𝔳",
	"vltri": "⊲",
	"vnsub": "⊂⃒",
	"vnsup": "⊃⃒",
	"Vopf": "𝕍",
	"vopf": "𝕧",
	"vprop": "∝",
	"vrtri": "⊳",
	"Vscr": "𝒱",
	"vscr": "𝓋",
	"vsubnE": "⫋︀",
	"vsubne": "⊊︀",
	"vsupnE": "⫌︀",
	"vsupne": "⊋︀",
	"Vvdash": "⊪",
	"vzigzag": "⦚",
	"Wcirc": "Ŵ",
	"wcirc": "ŵ",
	"wedbar": "⩟",
	"wedge": "∧",
	"Wedge": "⋀",
	"wedgeq": "≙",
	"weierp": "℘",
	"Wfr": "𝔚",
	"wfr": "𝔴",
	"Wopf": "𝕎",
	"wopf": "𝕨",
	"wp": "℘",
	"wr": "≀",
	"wreath": "≀",
	"Wscr": "𝒲",
	"wscr": "𝓌",
	"xcap": "⋂",
	"xcirc": "◯",
	"xcup": "⋃",
	"xdtri": "▽",
	"Xfr": "𝔛",
	"xfr": "𝔵",
	"xharr": "⟷",
	"xhArr": "⟺",
	"Xi": "Ξ",
	"xi": "ξ",
	"xlarr": "⟵",
	"xlArr": "⟸",
	"xmap": "⟼",
	"xnis": "⋻",
	"xodot": "⨀",
	"Xopf": "𝕏",
	"xopf": "𝕩",
	"xoplus": "⨁",
	"xotime": "⨂",
	"xrarr": "⟶",
	"xrArr": "⟹",
	"Xscr": "𝒳",
	"xscr": "𝓍",
	"xsqcup": "⨆",
	"xuplus": "⨄",
	"xutri": "△",
	"xvee": "⋁",
	"xwedge": "⋀",
	"Yacute": "Ý",
	"yacute": "ý",
	"YAcy": "Я",
	"yacy": "я",
	"Ycirc": "Ŷ",
	"ycirc": "ŷ",
	"Ycy": "Ы",
	"ycy": "ы",
	"yen": "¥",
	"Yfr": "𝔜",
	"yfr": "𝔶",
	"YIcy": "Ї",
	"yicy": "ї",
	"Yopf": "𝕐",
	"yopf": "𝕪",
	"Yscr": "𝒴",
	"yscr": "𝓎",
	"YUcy": "Ю",
	"yucy": "ю",
	"yuml": "ÿ",
	"Yuml": "Ÿ",
	"Zacute": "Ź",
	"zacute": "ź",
	"Zcaron": "Ž",
	"zcaron": "ž",
	"Zcy": "З",
	"zcy": "з",
	"Zdot": "Ż",
	"zdot": "ż",
	"zeetrf": "ℨ",
	"ZeroWidthSpace": "​",
	"Zeta": "Ζ",
	"zeta": "ζ",
	"zfr": "𝔷",
	"Zfr": "ℨ",
	"ZHcy": "Ж",
	"zhcy": "ж",
	"zigrarr": "⇝",
	"zopf": "𝕫",
	"Zopf": "ℤ",
	"Zscr": "𝒵",
	"zscr": "𝓏",
	"zwj": "‍",
	"zwnj": "‌"
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @license
 * Fuse - Lightweight fuzzy-search
 *
 * Copyright (c) 2012-2016 Kirollos Risk <kirollos@gmail.com>.
 * All Rights Reserved. Apache Software License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
;(function (global) {
  'use strict'

  /** @type {function(...*)} */
  function log () {
    console.log.apply(console, arguments)
  }

  var defaultOptions = {
    // The name of the identifier property. If specified, the returned result will be a list
    // of the items' dentifiers, otherwise it will be a list of the items.
    id: null,

    // Indicates whether comparisons should be case sensitive.

    caseSensitive: false,

    // An array of values that should be included from the searcher's output. When this array
    // contains elements, each result in the list will be of the form `{ item: ..., include1: ..., include2: ... }`.
    // Values you can include are `score`, `matchedLocations`
    include: [],

    // Whether to sort the result list, by score
    shouldSort: true,

    // The search function to use
    // Note that the default search function ([[Function]]) must conform to the following API:
    //
    //  @param pattern The pattern string to search
    //  @param options The search option
    //  [[Function]].constructor = function(pattern, options)
    //
    //  @param text: the string to search in for the pattern
    //  @return Object in the form of:
    //    - isMatch: boolean
    //    - score: Int
    //  [[Function]].prototype.search = function(text)
    searchFn: BitapSearcher,

    // Default sort function
    sortFn: function (a, b) {
      return a.score - b.score
    },

    // The get function to use when fetching an object's properties.
    // The default will search nested paths *ie foo.bar.baz*
    getFn: deepValue,

    // List of properties that will be searched. This also supports nested properties.
    keys: [],

    // Will print to the console. Useful for debugging.
    verbose: false,

    // When true, the search algorithm will search individual words **and** the full string,
    // computing the final score as a function of both. Note that when `tokenize` is `true`,
    // the `threshold`, `distance`, and `location` are inconsequential for individual tokens.
    tokenize: false,

    // When true, the result set will only include records that match all tokens. Will only work
    // if `tokenize` is also true.
    matchAllTokens: false,

    // Regex used to separate words when searching. Only applicable when `tokenize` is `true`.
    tokenSeparator: / +/g,

    // Minimum number of characters that must be matched before a result is considered a match
    minMatchCharLength: 1,

    // When true, the algorithm continues searching to the end of the input even if a perfect
    // match is found before the end of the same input.
    findAllMatches: false
  }

  /**
   * @constructor
   * @param {!Array} list
   * @param {!Object<string, *>} options
   */
  function Fuse (list, options) {
    var key

    this.list = list
    this.options = options = options || {}

    for (key in defaultOptions) {
      if (!defaultOptions.hasOwnProperty(key)) {
        continue;
      }
      // Add boolean type options
      if (typeof defaultOptions[key] === 'boolean') {
        this.options[key] = key in options ? options[key] : defaultOptions[key];
      // Add all other options
      } else {
        this.options[key] = options[key] || defaultOptions[key]
      }
    }
  }

  Fuse.VERSION = '2.7.3'

  /**
   * Sets a new list for Fuse to match against.
   * @param {!Array} list
   * @return {!Array} The newly set list
   * @public
   */
  Fuse.prototype.set = function (list) {
    this.list = list
    return list
  }

  Fuse.prototype.search = function (pattern) {
    if (this.options.verbose) log('\nSearch term:', pattern, '\n')

    this.pattern = pattern
    this.results = []
    this.resultMap = {}
    this._keyMap = null

    this._prepareSearchers()
    this._startSearch()
    this._computeScore()
    this._sort()

    var output = this._format()
    return output
  }

  Fuse.prototype._prepareSearchers = function () {
    var options = this.options
    var pattern = this.pattern
    var searchFn = options.searchFn
    var tokens = pattern.split(options.tokenSeparator)
    var i = 0
    var len = tokens.length

    if (this.options.tokenize) {
      this.tokenSearchers = []
      for (; i < len; i++) {
        this.tokenSearchers.push(new searchFn(tokens[i], options))
      }
    }
    this.fullSeacher = new searchFn(pattern, options)
  }

  Fuse.prototype._startSearch = function () {
    var options = this.options
    var getFn = options.getFn
    var list = this.list
    var listLen = list.length
    var keys = this.options.keys
    var keysLen = keys.length
    var key
    var weight
    var item = null
    var i
    var j

    // Check the first item in the list, if it's a string, then we assume
    // that every item in the list is also a string, and thus it's a flattened array.
    if (typeof list[0] === 'string') {
      // Iterate over every item
      for (i = 0; i < listLen; i++) {
        this._analyze('', list[i], i, i)
      }
    } else {
      this._keyMap = {}
      // Otherwise, the first item is an Object (hopefully), and thus the searching
      // is done on the values of the keys of each item.
      // Iterate over every item
      for (i = 0; i < listLen; i++) {
        item = list[i]
        // Iterate over every key
        for (j = 0; j < keysLen; j++) {
          key = keys[j]
          if (typeof key !== 'string') {
            weight = (1 - key.weight) || 1
            this._keyMap[key.name] = {
              weight: weight
            }
            if (key.weight <= 0 || key.weight > 1) {
              throw new Error('Key weight has to be > 0 and <= 1')
            }
            key = key.name
          } else {
            this._keyMap[key] = {
              weight: 1
            }
          }
          this._analyze(key, getFn(item, key, []), item, i)
        }
      }
    }
  }

  Fuse.prototype._analyze = function (key, text, entity, index) {
    var options = this.options
    var words
    var scores
    var exists = false
    var existingResult
    var averageScore
    var finalScore
    var scoresLen
    var mainSearchResult
    var tokenSearcher
    var termScores
    var word
    var tokenSearchResult
    var hasMatchInText
    var checkTextMatches
    var i
    var j

    // Check if the text can be searched
    if (text === undefined || text === null) {
      return
    }

    scores = []

    var numTextMatches = 0

    if (typeof text === 'string') {
      words = text.split(options.tokenSeparator)

      if (options.verbose) log('---------\nKey:', key)

      if (this.options.tokenize) {
        for (i = 0; i < this.tokenSearchers.length; i++) {
          tokenSearcher = this.tokenSearchers[i]

          if (options.verbose) log('Pattern:', tokenSearcher.pattern)

          termScores = []
          hasMatchInText = false

          for (j = 0; j < words.length; j++) {
            word = words[j]
            tokenSearchResult = tokenSearcher.search(word)
            var obj = {}
            if (tokenSearchResult.isMatch) {
              obj[word] = tokenSearchResult.score
              exists = true
              hasMatchInText = true
              scores.push(tokenSearchResult.score)
            } else {
              obj[word] = 1
              if (!this.options.matchAllTokens) {
                scores.push(1)
              }
            }
            termScores.push(obj)
          }

          if (hasMatchInText) {
            numTextMatches++
          }

          if (options.verbose) log('Token scores:', termScores)
        }

        averageScore = scores[0]
        scoresLen = scores.length
        for (i = 1; i < scoresLen; i++) {
          averageScore += scores[i]
        }
        averageScore = averageScore / scoresLen

        if (options.verbose) log('Token score average:', averageScore)
      }

      mainSearchResult = this.fullSeacher.search(text)
      if (options.verbose) log('Full text score:', mainSearchResult.score)

      finalScore = mainSearchResult.score
      if (averageScore !== undefined) {
        finalScore = (finalScore + averageScore) / 2
      }

      if (options.verbose) log('Score average:', finalScore)

      checkTextMatches = (this.options.tokenize && this.options.matchAllTokens) ? numTextMatches >= this.tokenSearchers.length : true

      if (options.verbose) log('Check Matches', checkTextMatches)

      // If a match is found, add the item to <rawResults>, including its score
      if ((exists || mainSearchResult.isMatch) && checkTextMatches) {
        // Check if the item already exists in our results
        existingResult = this.resultMap[index]

        if (existingResult) {
          // Use the lowest score
          // existingResult.score, bitapResult.score
          existingResult.output.push({
            key: key,
            score: finalScore,
            matchedIndices: mainSearchResult.matchedIndices
          })
        } else {
          // Add it to the raw result list
          this.resultMap[index] = {
            item: entity,
            output: [{
              key: key,
              score: finalScore,
              matchedIndices: mainSearchResult.matchedIndices
            }]
          }

          this.results.push(this.resultMap[index])
        }
      }
    } else if (isArray(text)) {
      for (i = 0; i < text.length; i++) {
        this._analyze(key, text[i], entity, index)
      }
    }
  }

  Fuse.prototype._computeScore = function () {
    var i
    var j
    var keyMap = this._keyMap
    var totalScore
    var output
    var scoreLen
    var score
    var weight
    var results = this.results
    var bestScore
    var nScore

    if (this.options.verbose) log('\n\nComputing score:\n')

    for (i = 0; i < results.length; i++) {
      totalScore = 0
      output = results[i].output
      scoreLen = output.length

      bestScore = 1

      for (j = 0; j < scoreLen; j++) {
        score = output[j].score
        weight = keyMap ? keyMap[output[j].key].weight : 1

        nScore = score * weight

        if (weight !== 1) {
          bestScore = Math.min(bestScore, nScore)
        } else {
          totalScore += nScore
          output[j].nScore = nScore
        }
      }

      if (bestScore === 1) {
        results[i].score = totalScore / scoreLen
      } else {
        results[i].score = bestScore
      }

      if (this.options.verbose) log(results[i])
    }
  }

  Fuse.prototype._sort = function () {
    var options = this.options
    if (options.shouldSort) {
      if (options.verbose) log('\n\nSorting....')
      this.results.sort(options.sortFn)
    }
  }

  Fuse.prototype._format = function () {
    var options = this.options
    var getFn = options.getFn
    var finalOutput = []
    var i
    var len
    var results = this.results
    var replaceValue
    var getItemAtIndex
    var include = options.include

    if (options.verbose) log('\n\nOutput:\n\n', results)

    // Helper function, here for speed-up, which replaces the item with its value,
    // if the options specifies it,
    replaceValue = options.id ? function (index) {
      results[index].item = getFn(results[index].item, options.id, [])[0]
    } : function () {}

    getItemAtIndex = function (index) {
      var record = results[index]
      var data
      var j
      var output
      var _item
      var _result

      // If `include` has values, put the item in the result
      if (include.length > 0) {
        data = {
          item: record.item
        }
        if (include.indexOf('matches') !== -1) {
          output = record.output
          data.matches = []
          for (j = 0; j < output.length; j++) {
            _item = output[j]
            _result = {
              indices: _item.matchedIndices
            }
            if (_item.key) {
              _result.key = _item.key
            }
            data.matches.push(_result)
          }
        }

        if (include.indexOf('score') !== -1) {
          data.score = results[index].score
        }

      } else {
        data = record.item
      }

      return data
    }

    // From the results, push into a new array only the item identifier (if specified)
    // of the entire item.  This is because we don't want to return the <results>,
    // since it contains other metadata
    for (i = 0, len = results.length; i < len; i++) {
      replaceValue(i)
      finalOutput.push(getItemAtIndex(i))
    }

    return finalOutput
  }

  // Helpers

  function deepValue (obj, path, list) {
    var firstSegment
    var remaining
    var dotIndex
    var value
    var i
    var len

    if (!path) {
      // If there's no path left, we've gotten to the object we care about.
      list.push(obj)
    } else {
      dotIndex = path.indexOf('.')

      if (dotIndex !== -1) {
        firstSegment = path.slice(0, dotIndex)
        remaining = path.slice(dotIndex + 1)
      } else {
        firstSegment = path
      }

      value = obj[firstSegment]
      if (value !== null && value !== undefined) {
        if (!remaining && (typeof value === 'string' || typeof value === 'number')) {
          list.push(value)
        } else if (isArray(value)) {
          // Search each item in the array.
          for (i = 0, len = value.length; i < len; i++) {
            deepValue(value[i], remaining, list)
          }
        } else if (remaining) {
          // An object. Recurse further.
          deepValue(value, remaining, list)
        }
      }
    }

    return list
  }

  function isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

  /**
   * Adapted from "Diff, Match and Patch", by Google
   *
   *   http://code.google.com/p/google-diff-match-patch/
   *
   * Modified by: Kirollos Risk <kirollos@gmail.com>
   * -----------------------------------------------
   * Details: the algorithm and structure was modified to allow the creation of
   * <Searcher> instances with a <search> method which does the actual
   * bitap search. The <pattern> (the string that is searched for) is only defined
   * once per instance and thus it eliminates redundant re-creation when searching
   * over a list of strings.
   *
   * Licensed under the Apache License, Version 2.0 (the "License")
   * you may not use this file except in compliance with the License.
   *
   * @constructor
   */
  function BitapSearcher (pattern, options) {
    options = options || {}
    this.options = options
    this.options.location = options.location || BitapSearcher.defaultOptions.location
    this.options.distance = 'distance' in options ? options.distance : BitapSearcher.defaultOptions.distance
    this.options.threshold = 'threshold' in options ? options.threshold : BitapSearcher.defaultOptions.threshold
    this.options.maxPatternLength = options.maxPatternLength || BitapSearcher.defaultOptions.maxPatternLength

    this.pattern = options.caseSensitive ? pattern : pattern.toLowerCase()
    this.patternLen = pattern.length

    if (this.patternLen <= this.options.maxPatternLength) {
      this.matchmask = 1 << (this.patternLen - 1)
      this.patternAlphabet = this._calculatePatternAlphabet()
    }
  }

  BitapSearcher.defaultOptions = {
    // Approximately where in the text is the pattern expected to be found?
    location: 0,

    // Determines how close the match must be to the fuzzy location (specified above).
    // An exact letter match which is 'distance' characters away from the fuzzy location
    // would score as a complete mismatch. A distance of '0' requires the match be at
    // the exact location specified, a threshold of '1000' would require a perfect match
    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
    distance: 100,

    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
    // (of both letters and location), a threshold of '1.0' would match anything.
    threshold: 0.6,

    // Machine word size
    maxPatternLength: 32
  }

  /**
   * Initialize the alphabet for the Bitap algorithm.
   * @return {Object} Hash of character locations.
   * @private
   */
  BitapSearcher.prototype._calculatePatternAlphabet = function () {
    var mask = {},
      i = 0

    for (i = 0; i < this.patternLen; i++) {
      mask[this.pattern.charAt(i)] = 0
    }

    for (i = 0; i < this.patternLen; i++) {
      mask[this.pattern.charAt(i)] |= 1 << (this.pattern.length - i - 1)
    }

    return mask
  }

  /**
   * Compute and return the score for a match with `e` errors and `x` location.
   * @param {number} errors Number of errors in match.
   * @param {number} location Location of match.
   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
   * @private
   */
  BitapSearcher.prototype._bitapScore = function (errors, location) {
    var accuracy = errors / this.patternLen,
      proximity = Math.abs(this.options.location - location)

    if (!this.options.distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy
    }
    return accuracy + (proximity / this.options.distance)
  }

  /**
   * Compute and return the result of the search
   * @param {string} text The text to search in
   * @return {{isMatch: boolean, score: number}} Literal containing:
   *                          isMatch - Whether the text is a match or not
   *                          score - Overall score for the match
   * @public
   */
  BitapSearcher.prototype.search = function (text) {
    var options = this.options
    var i
    var j
    var textLen
    var findAllMatches
    var location
    var threshold
    var bestLoc
    var binMin
    var binMid
    var binMax
    var start, finish
    var bitArr
    var lastBitArr
    var charMatch
    var score
    var locations
    var matches
    var isMatched
    var matchMask
    var matchedIndices
    var matchesLen
    var match

    text = options.caseSensitive ? text : text.toLowerCase()

    if (this.pattern === text) {
      // Exact match
      return {
        isMatch: true,
        score: 0,
        matchedIndices: [[0, text.length - 1]]
      }
    }

    // When pattern length is greater than the machine word length, just do a a regex comparison
    if (this.patternLen > options.maxPatternLength) {
      matches = text.match(new RegExp(this.pattern.replace(options.tokenSeparator, '|')))
      isMatched = !!matches

      if (isMatched) {
        matchedIndices = []
        for (i = 0, matchesLen = matches.length; i < matchesLen; i++) {
          match = matches[i]
          matchedIndices.push([text.indexOf(match), match.length - 1])
        }
      }

      return {
        isMatch: isMatched,
        // TODO: revisit this score
        score: isMatched ? 0.5 : 1,
        matchedIndices: matchedIndices
      }
    }

    findAllMatches = options.findAllMatches

    location = options.location
    // Set starting location at beginning text and initialize the alphabet.
    textLen = text.length
    // Highest score beyond which we give up.
    threshold = options.threshold
    // Is there a nearby exact match? (speedup)
    bestLoc = text.indexOf(this.pattern, location)

    // a mask of the matches
    matchMask = []
    for (i = 0; i < textLen; i++) {
      matchMask[i] = 0
    }

    if (bestLoc != -1) {
      threshold = Math.min(this._bitapScore(0, bestLoc), threshold)
      // What about in the other direction? (speed up)
      bestLoc = text.lastIndexOf(this.pattern, location + this.patternLen)

      if (bestLoc != -1) {
        threshold = Math.min(this._bitapScore(0, bestLoc), threshold)
      }
    }

    bestLoc = -1
    score = 1
    locations = []
    binMax = this.patternLen + textLen

    for (i = 0; i < this.patternLen; i++) {
      // Scan for the best match; each iteration allows for one more error.
      // Run a binary search to determine how far from the match location we can stray
      // at this error level.
      binMin = 0
      binMid = binMax
      while (binMin < binMid) {
        if (this._bitapScore(i, location + binMid) <= threshold) {
          binMin = binMid
        } else {
          binMax = binMid
        }
        binMid = Math.floor((binMax - binMin) / 2 + binMin)
      }

      // Use the result from this iteration as the maximum for the next.
      binMax = binMid
      start = Math.max(1, location - binMid + 1)
      if (findAllMatches) {
        finish = textLen;
      } else {
        finish = Math.min(location + binMid, textLen) + this.patternLen
      }

      // Initialize the bit array
      bitArr = Array(finish + 2)

      bitArr[finish + 1] = (1 << i) - 1

      for (j = finish; j >= start; j--) {
        charMatch = this.patternAlphabet[text.charAt(j - 1)]

        if (charMatch) {
          matchMask[j - 1] = 1
        }

        bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch

        if (i !== 0) {
          // Subsequent passes: fuzzy match.
          bitArr[j] |= (((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1) | lastBitArr[j + 1]
        }
        if (bitArr[j] & this.matchmask) {
          score = this._bitapScore(i, j - 1)

          // This match will almost certainly be better than any existing match.
          // But check anyway.
          if (score <= threshold) {
            // Indeed it is
            threshold = score
            bestLoc = j - 1
            locations.push(bestLoc)

            // Already passed loc, downhill from here on in.
            if (bestLoc <= location) {
              break
            }

            // When passing loc, don't exceed our current distance from loc.
            start = Math.max(1, 2 * location - bestLoc)
          }
        }
      }

      // No hope for a (better) match at greater error levels.
      if (this._bitapScore(i + 1, location) > threshold) {
        break
      }
      lastBitArr = bitArr
    }

    matchedIndices = this._getMatchedIndices(matchMask)

    // Count exact matches (those with a score of 0) to be "almost" exact
    return {
      isMatch: bestLoc >= 0,
      score: score === 0 ? 0.001 : score,
      matchedIndices: matchedIndices
    }
  }

  BitapSearcher.prototype._getMatchedIndices = function (matchMask) {
    var matchedIndices = []
    var start = -1
    var end = -1
    var i = 0
    var match
    var len = matchMask.length
    for (; i < len; i++) {
      match = matchMask[i]
      if (match && start === -1) {
        start = i
      } else if (!match && start !== -1) {
        end = i - 1
        if ((end - start) + 1 >= this.options.minMatchCharLength) {
            matchedIndices.push([start, end])
        }
        start = -1
      }
    }
    if (matchMask[i - 1]) {
      if ((i-1 - start) + 1 >= this.options.minMatchCharLength) {
        matchedIndices.push([start, i - 1])
      }
    }
    return matchedIndices
  }

  // Export to Common JS Loader
  if (true) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = Fuse
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function () {
      return Fuse
    })
  } else {
    // Browser globals (root is window)
    global.Fuse = Fuse
  }

})(this);


/***/ }),
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



////////////////////////////////////////////////////////////////////////////////
// Helpers

// Merge objects
//
function assign(obj /*from1, from2, from3, ...*/) {
  var sources = Array.prototype.slice.call(arguments, 1);

  sources.forEach(function (source) {
    if (!source) { return; }

    Object.keys(source).forEach(function (key) {
      obj[key] = source[key];
    });
  });

  return obj;
}

function _class(obj) { return Object.prototype.toString.call(obj); }
function isString(obj) { return _class(obj) === '[object String]'; }
function isObject(obj) { return _class(obj) === '[object Object]'; }
function isRegExp(obj) { return _class(obj) === '[object RegExp]'; }
function isFunction(obj) { return _class(obj) === '[object Function]'; }


function escapeRE(str) { return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'); }

////////////////////////////////////////////////////////////////////////////////


var defaultOptions = {
  fuzzyLink: true,
  fuzzyEmail: true,
  fuzzyIP: false
};


function isOptionsObj(obj) {
  return Object.keys(obj || {}).reduce(function (acc, k) {
    return acc || defaultOptions.hasOwnProperty(k);
  }, false);
}


var defaultSchemas = {
  'http:': {
    validate: function (text, pos, self) {
      var tail = text.slice(pos);

      if (!self.re.http) {
        // compile lazily, because "host"-containing variables can change on tlds update.
        self.re.http =  new RegExp(
          '^\\/\\/' + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path, 'i'
        );
      }
      if (self.re.http.test(tail)) {
        return tail.match(self.re.http)[0].length;
      }
      return 0;
    }
  },
  'https:':  'http:',
  'ftp:':    'http:',
  '//':      {
    validate: function (text, pos, self) {
      var tail = text.slice(pos);

      if (!self.re.no_http) {
      // compile lazily, because "host"-containing variables can change on tlds update.
        self.re.no_http =  new RegExp(
          '^' +
          self.re.src_auth +
          // Don't allow single-level domains, because of false positives like '//test'
          // with code comments
          '(?:localhost|(?:(?:' + self.re.src_domain + ')\\.)+' + self.re.src_domain_root + ')' +
          self.re.src_port +
          self.re.src_host_terminator +
          self.re.src_path,

          'i'
        );
      }

      if (self.re.no_http.test(tail)) {
        // should not be `://` & `///`, that protects from errors in protocol name
        if (pos >= 3 && text[pos - 3] === ':') { return 0; }
        if (pos >= 3 && text[pos - 3] === '/') { return 0; }
        return tail.match(self.re.no_http)[0].length;
      }
      return 0;
    }
  },
  'mailto:': {
    validate: function (text, pos, self) {
      var tail = text.slice(pos);

      if (!self.re.mailto) {
        self.re.mailto =  new RegExp(
          '^' + self.re.src_email_name + '@' + self.re.src_host_strict, 'i'
        );
      }
      if (self.re.mailto.test(tail)) {
        return tail.match(self.re.mailto)[0].length;
      }
      return 0;
    }
  }
};

/*eslint-disable max-len*/

// RE pattern for 2-character tlds (autogenerated by ./support/tlds_2char_gen.js)
var tlds_2ch_src_re = 'a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]';

// DON'T try to make PRs with changes. Extend TLDs with LinkifyIt.tlds() instead
var tlds_default = 'biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф'.split('|');

/*eslint-enable max-len*/

////////////////////////////////////////////////////////////////////////////////

function resetScanCache(self) {
  self.__index__ = -1;
  self.__text_cache__   = '';
}

function createValidator(re) {
  return function (text, pos) {
    var tail = text.slice(pos);

    if (re.test(tail)) {
      return tail.match(re)[0].length;
    }
    return 0;
  };
}

function createNormalizer() {
  return function (match, self) {
    self.normalize(match);
  };
}

// Schemas compiler. Build regexps.
//
function compile(self) {

  // Load & clone RE patterns.
  var re = self.re = __webpack_require__(235)(self.__opts__);

  // Define dynamic patterns
  var tlds = self.__tlds__.slice();

  self.onCompile();

  if (!self.__tlds_replaced__) {
    tlds.push(tlds_2ch_src_re);
  }
  tlds.push(re.src_xn);

  re.src_tlds = tlds.join('|');

  function untpl(tpl) { return tpl.replace('%TLDS%', re.src_tlds); }

  re.email_fuzzy      = RegExp(untpl(re.tpl_email_fuzzy), 'i');
  re.link_fuzzy       = RegExp(untpl(re.tpl_link_fuzzy), 'i');
  re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), 'i');
  re.host_fuzzy_test  = RegExp(untpl(re.tpl_host_fuzzy_test), 'i');

  //
  // Compile each schema
  //

  var aliases = [];

  self.__compiled__ = {}; // Reset compiled data

  function schemaError(name, val) {
    throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
  }

  Object.keys(self.__schemas__).forEach(function (name) {
    var val = self.__schemas__[name];

    // skip disabled methods
    if (val === null) { return; }

    var compiled = { validate: null, link: null };

    self.__compiled__[name] = compiled;

    if (isObject(val)) {
      if (isRegExp(val.validate)) {
        compiled.validate = createValidator(val.validate);
      } else if (isFunction(val.validate)) {
        compiled.validate = val.validate;
      } else {
        schemaError(name, val);
      }

      if (isFunction(val.normalize)) {
        compiled.normalize = val.normalize;
      } else if (!val.normalize) {
        compiled.normalize = createNormalizer();
      } else {
        schemaError(name, val);
      }

      return;
    }

    if (isString(val)) {
      aliases.push(name);
      return;
    }

    schemaError(name, val);
  });

  //
  // Compile postponed aliases
  //

  aliases.forEach(function (alias) {
    if (!self.__compiled__[self.__schemas__[alias]]) {
      // Silently fail on missed schemas to avoid errons on disable.
      // schemaError(alias, self.__schemas__[alias]);
      return;
    }

    self.__compiled__[alias].validate =
      self.__compiled__[self.__schemas__[alias]].validate;
    self.__compiled__[alias].normalize =
      self.__compiled__[self.__schemas__[alias]].normalize;
  });

  //
  // Fake record for guessed links
  //
  self.__compiled__[''] = { validate: null, normalize: createNormalizer() };

  //
  // Build schema condition
  //
  var slist = Object.keys(self.__compiled__)
                      .filter(function (name) {
                        // Filter disabled & fake schemas
                        return name.length > 0 && self.__compiled__[name];
                      })
                      .map(escapeRE)
                      .join('|');
  // (?!_) cause 1.5x slowdown
  self.re.schema_test   = RegExp('(^|(?!_)(?:[><\uff5c]|' + re.src_ZPCc + '))(' + slist + ')', 'i');
  self.re.schema_search = RegExp('(^|(?!_)(?:[><\uff5c]|' + re.src_ZPCc + '))(' + slist + ')', 'ig');

  self.re.pretest       = RegExp(
                            '(' + self.re.schema_test.source + ')|' +
                            '(' + self.re.host_fuzzy_test.source + ')|' +
                            '@',
                            'i');

  //
  // Cleanup
  //

  resetScanCache(self);
}

/**
 * class Match
 *
 * Match result. Single element of array, returned by [[LinkifyIt#match]]
 **/
function Match(self, shift) {
  var start = self.__index__,
      end   = self.__last_index__,
      text  = self.__text_cache__.slice(start, end);

  /**
   * Match#schema -> String
   *
   * Prefix (protocol) for matched string.
   **/
  this.schema    = self.__schema__.toLowerCase();
  /**
   * Match#index -> Number
   *
   * First position of matched string.
   **/
  this.index     = start + shift;
  /**
   * Match#lastIndex -> Number
   *
   * Next position after matched string.
   **/
  this.lastIndex = end + shift;
  /**
   * Match#raw -> String
   *
   * Matched string.
   **/
  this.raw       = text;
  /**
   * Match#text -> String
   *
   * Notmalized text of matched string.
   **/
  this.text      = text;
  /**
   * Match#url -> String
   *
   * Normalized url of matched string.
   **/
  this.url       = text;
}

function createMatch(self, shift) {
  var match = new Match(self, shift);

  self.__compiled__[match.schema].normalize(match, self);

  return match;
}


/**
 * class LinkifyIt
 **/

/**
 * new LinkifyIt(schemas, options)
 * - schemas (Object): Optional. Additional schemas to validate (prefix/validator)
 * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
 *
 * Creates new linkifier instance with optional additional schemas.
 * Can be called without `new` keyword for convenience.
 *
 * By default understands:
 *
 * - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
 * - "fuzzy" links and emails (example.com, foo@bar.com).
 *
 * `schemas` is an object, where each key/value describes protocol/rule:
 *
 * - __key__ - link prefix (usually, protocol name with `:` at the end, `skype:`
 *   for example). `linkify-it` makes shure that prefix is not preceeded with
 *   alphanumeric char and symbols. Only whitespaces and punctuation allowed.
 * - __value__ - rule to check tail after link prefix
 *   - _String_ - just alias to existing rule
 *   - _Object_
 *     - _validate_ - validator function (should return matched length on success),
 *       or `RegExp`.
 *     - _normalize_ - optional function to normalize text & url of matched result
 *       (for example, for @twitter mentions).
 *
 * `options`:
 *
 * - __fuzzyLink__ - recognige URL-s without `http(s):` prefix. Default `true`.
 * - __fuzzyIP__ - allow IPs in fuzzy links above. Can conflict with some texts
 *   like version numbers. Default `false`.
 * - __fuzzyEmail__ - recognize emails without `mailto:` prefix.
 *
 **/
function LinkifyIt(schemas, options) {
  if (!(this instanceof LinkifyIt)) {
    return new LinkifyIt(schemas, options);
  }

  if (!options) {
    if (isOptionsObj(schemas)) {
      options = schemas;
      schemas = {};
    }
  }

  this.__opts__           = assign({}, defaultOptions, options);

  // Cache last tested result. Used to skip repeating steps on next `match` call.
  this.__index__          = -1;
  this.__last_index__     = -1; // Next scan position
  this.__schema__         = '';
  this.__text_cache__     = '';

  this.__schemas__        = assign({}, defaultSchemas, schemas);
  this.__compiled__       = {};

  this.__tlds__           = tlds_default;
  this.__tlds_replaced__  = false;

  this.re = {};

  compile(this);
}


/** chainable
 * LinkifyIt#add(schema, definition)
 * - schema (String): rule name (fixed pattern prefix)
 * - definition (String|RegExp|Object): schema definition
 *
 * Add new rule definition. See constructor description for details.
 **/
LinkifyIt.prototype.add = function add(schema, definition) {
  this.__schemas__[schema] = definition;
  compile(this);
  return this;
};


/** chainable
 * LinkifyIt#set(options)
 * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
 *
 * Set recognition options for links without schema.
 **/
LinkifyIt.prototype.set = function set(options) {
  this.__opts__ = assign(this.__opts__, options);
  return this;
};


/**
 * LinkifyIt#test(text) -> Boolean
 *
 * Searches linkifiable pattern and returns `true` on success or `false` on fail.
 **/
LinkifyIt.prototype.test = function test(text) {
  // Reset scan cache
  this.__text_cache__ = text;
  this.__index__      = -1;

  if (!text.length) { return false; }

  var m, ml, me, len, shift, next, re, tld_pos, at_pos;

  // try to scan for link with schema - that's the most simple rule
  if (this.re.schema_test.test(text)) {
    re = this.re.schema_search;
    re.lastIndex = 0;
    while ((m = re.exec(text)) !== null) {
      len = this.testSchemaAt(text, m[2], re.lastIndex);
      if (len) {
        this.__schema__     = m[2];
        this.__index__      = m.index + m[1].length;
        this.__last_index__ = m.index + m[0].length + len;
        break;
      }
    }
  }

  if (this.__opts__.fuzzyLink && this.__compiled__['http:']) {
    // guess schemaless links
    tld_pos = text.search(this.re.host_fuzzy_test);
    if (tld_pos >= 0) {
      // if tld is located after found link - no need to check fuzzy pattern
      if (this.__index__ < 0 || tld_pos < this.__index__) {
        if ((ml = text.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {

          shift = ml.index + ml[1].length;

          if (this.__index__ < 0 || shift < this.__index__) {
            this.__schema__     = '';
            this.__index__      = shift;
            this.__last_index__ = ml.index + ml[0].length;
          }
        }
      }
    }
  }

  if (this.__opts__.fuzzyEmail && this.__compiled__['mailto:']) {
    // guess schemaless emails
    at_pos = text.indexOf('@');
    if (at_pos >= 0) {
      // We can't skip this check, because this cases are possible:
      // 192.168.1.1@gmail.com, my.in@example.com
      if ((me = text.match(this.re.email_fuzzy)) !== null) {

        shift = me.index + me[1].length;
        next  = me.index + me[0].length;

        if (this.__index__ < 0 || shift < this.__index__ ||
            (shift === this.__index__ && next > this.__last_index__)) {
          this.__schema__     = 'mailto:';
          this.__index__      = shift;
          this.__last_index__ = next;
        }
      }
    }
  }

  return this.__index__ >= 0;
};


/**
 * LinkifyIt#pretest(text) -> Boolean
 *
 * Very quick check, that can give false positives. Returns true if link MAY BE
 * can exists. Can be used for speed optimization, when you need to check that
 * link NOT exists.
 **/
LinkifyIt.prototype.pretest = function pretest(text) {
  return this.re.pretest.test(text);
};


/**
 * LinkifyIt#testSchemaAt(text, name, position) -> Number
 * - text (String): text to scan
 * - name (String): rule (schema) name
 * - position (Number): text offset to check from
 *
 * Similar to [[LinkifyIt#test]] but checks only specific protocol tail exactly
 * at given position. Returns length of found pattern (0 on fail).
 **/
LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text, schema, pos) {
  // If not supported schema check requested - terminate
  if (!this.__compiled__[schema.toLowerCase()]) {
    return 0;
  }
  return this.__compiled__[schema.toLowerCase()].validate(text, pos, this);
};


/**
 * LinkifyIt#match(text) -> Array|null
 *
 * Returns array of found link descriptions or `null` on fail. We strongly
 * recommend to use [[LinkifyIt#test]] first, for best speed.
 *
 * ##### Result match description
 *
 * - __schema__ - link schema, can be empty for fuzzy links, or `//` for
 *   protocol-neutral  links.
 * - __index__ - offset of matched text
 * - __lastIndex__ - index of next char after mathch end
 * - __raw__ - matched text
 * - __text__ - normalized text
 * - __url__ - link, generated from matched text
 **/
LinkifyIt.prototype.match = function match(text) {
  var shift = 0, result = [];

  // Try to take previous element from cache, if .test() called before
  if (this.__index__ >= 0 && this.__text_cache__ === text) {
    result.push(createMatch(this, shift));
    shift = this.__last_index__;
  }

  // Cut head if cache was used
  var tail = shift ? text.slice(shift) : text;

  // Scan string until end reached
  while (this.test(tail)) {
    result.push(createMatch(this, shift));

    tail = tail.slice(this.__last_index__);
    shift += this.__last_index__;
  }

  if (result.length) {
    return result;
  }

  return null;
};


/** chainable
 * LinkifyIt#tlds(list [, keepOld]) -> this
 * - list (Array): list of tlds
 * - keepOld (Boolean): merge with current list if `true` (`false` by default)
 *
 * Load (or merge) new tlds list. Those are user for fuzzy links (without prefix)
 * to avoid false positives. By default this algorythm used:
 *
 * - hostname with any 2-letter root zones are ok.
 * - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
 *   are ok.
 * - encoded (`xn--...`) root zones are ok.
 *
 * If list is replaced, then exact match for 2-chars root zones will be checked.
 **/
LinkifyIt.prototype.tlds = function tlds(list, keepOld) {
  list = Array.isArray(list) ? list : [ list ];

  if (!keepOld) {
    this.__tlds__ = list.slice();
    this.__tlds_replaced__ = true;
    compile(this);
    return this;
  }

  this.__tlds__ = this.__tlds__.concat(list)
                                  .sort()
                                  .filter(function (el, idx, arr) {
                                    return el !== arr[idx - 1];
                                  })
                                  .reverse();

  compile(this);
  return this;
};

/**
 * LinkifyIt#normalize(match)
 *
 * Default normalizer (if schema does not define it's own).
 **/
LinkifyIt.prototype.normalize = function normalize(match) {

  // Do minimal possible changes by default. Need to collect feedback prior
  // to move forward https://github.com/markdown-it/linkify-it/issues/1

  if (!match.schema) { match.url = 'http://' + match.url; }

  if (match.schema === 'mailto:' && !/^mailto:/i.test(match.url)) {
    match.url = 'mailto:' + match.url;
  }
};


/**
 * LinkifyIt#onCompile()
 *
 * Override to modify basic RegExp-s.
 **/
LinkifyIt.prototype.onCompile = function onCompile() {
};


module.exports = LinkifyIt;


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



module.exports = function (opts) {
  var re = {};

  // Use direct extract instead of `regenerate` to reduse browserified size
  re.src_Any = __webpack_require__(25).source;
  re.src_Cc  = __webpack_require__(23).source;
  re.src_Z   = __webpack_require__(24).source;
  re.src_P   = __webpack_require__(12).source;

  // \p{\Z\P\Cc\CF} (white spaces + control + format + punctuation)
  re.src_ZPCc = [ re.src_Z, re.src_P, re.src_Cc ].join('|');

  // \p{\Z\Cc} (white spaces + control)
  re.src_ZCc = [ re.src_Z, re.src_Cc ].join('|');

  // Experimental. List of chars, completely prohibited in links
  // because can separate it from other part of text
  var text_separators = '[><\uff5c]';

  // All possible word characters (everything without punctuation, spaces & controls)
  // Defined via punctuation & spaces to save space
  // Should be something like \p{\L\N\S\M} (\w but without `_`)
  re.src_pseudo_letter       = '(?:(?!' + text_separators + '|' + re.src_ZPCc + ')' + re.src_Any + ')';
  // The same as abothe but without [0-9]
  // var src_pseudo_letter_non_d = '(?:(?![0-9]|' + src_ZPCc + ')' + src_Any + ')';

  ////////////////////////////////////////////////////////////////////////////////

  re.src_ip4 =

    '(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

  // Prohibit any of "@/[]()" in user/pass to avoid wrong domain fetch.
  re.src_auth    = '(?:(?:(?!' + re.src_ZCc + '|[@/\\[\\]()]).)+@)?';

  re.src_port =

    '(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?';

  re.src_host_terminator =

    '(?=$|' + text_separators + '|' + re.src_ZPCc + ')(?!-|_|:\\d|\\.-|\\.(?!$|' + re.src_ZPCc + '))';

  re.src_path =

    '(?:' +
      '[/?#]' +
        '(?:' +
          '(?!' + re.src_ZCc + '|' + text_separators + '|[()[\\]{}.,"\'?!\\-]).|' +
          '\\[(?:(?!' + re.src_ZCc + '|\\]).)*\\]|' +
          '\\((?:(?!' + re.src_ZCc + '|[)]).)*\\)|' +
          '\\{(?:(?!' + re.src_ZCc + '|[}]).)*\\}|' +
          '\\"(?:(?!' + re.src_ZCc + '|["]).)+\\"|' +
          "\\'(?:(?!" + re.src_ZCc + "|[']).)+\\'|" +
          "\\'(?=" + re.src_pseudo_letter + '|[-]).|' +  // allow `I'm_king` if no pair found
          '\\.{2,3}[a-zA-Z0-9%/]|' + // github has ... in commit range links. Restrict to
                                     // - english
                                     // - percent-encoded
                                     // - parts of file path
                                     // until more examples found.
          '\\.(?!' + re.src_ZCc + '|[.]).|' +
          (opts && opts['---'] ?
            '\\-(?!--(?:[^-]|$))(?:-*)|' // `---` => long dash, terminate
          :
            '\\-+|'
          ) +
          '\\,(?!' + re.src_ZCc + ').|' +      // allow `,,,` in paths
          '\\!(?!' + re.src_ZCc + '|[!]).|' +
          '\\?(?!' + re.src_ZCc + '|[?]).' +
        ')+' +
      '|\\/' +
    ')?';

  re.src_email_name =

    '[\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]+';

  re.src_xn =

    'xn--[a-z0-9\\-]{1,59}';

  // More to read about domain names
  // http://serverfault.com/questions/638260/

  re.src_domain_root =

    // Allow letters & digits (http://test1)
    '(?:' +
      re.src_xn +
      '|' +
      re.src_pseudo_letter + '{1,63}' +
    ')';

  re.src_domain =

    '(?:' +
      re.src_xn +
      '|' +
      '(?:' + re.src_pseudo_letter + ')' +
      '|' +
      // don't allow `--` in domain names, because:
      // - that can conflict with markdown &mdash; / &ndash;
      // - nobody use those anyway
      '(?:' + re.src_pseudo_letter + '(?:-(?!-)|' + re.src_pseudo_letter + '){0,61}' + re.src_pseudo_letter + ')' +
    ')';

  re.src_host =

    '(?:' +
    // Don't need IP check, because digits are already allowed in normal domain names
    //   src_ip4 +
    // '|' +
      '(?:(?:(?:' + re.src_domain + ')\\.)*' + re.src_domain/*_root*/ + ')' +
    ')';

  re.tpl_host_fuzzy =

    '(?:' +
      re.src_ip4 +
    '|' +
      '(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))' +
    ')';

  re.tpl_host_no_ip_fuzzy =

    '(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))';

  re.src_host_strict =

    re.src_host + re.src_host_terminator;

  re.tpl_host_fuzzy_strict =

    re.tpl_host_fuzzy + re.src_host_terminator;

  re.src_host_port_strict =

    re.src_host + re.src_port + re.src_host_terminator;

  re.tpl_host_port_fuzzy_strict =

    re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;

  re.tpl_host_port_no_ip_fuzzy_strict =

    re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;


  ////////////////////////////////////////////////////////////////////////////////
  // Main rules

  // Rude test fuzzy links by host, for quick deny
  re.tpl_host_fuzzy_test =

    'localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:' + re.src_ZPCc + '|>|$))';

  re.tpl_email_fuzzy =

      '(^|' + text_separators + '|\\(|' + re.src_ZCc + ')(' + re.src_email_name + '@' + re.tpl_host_fuzzy_strict + ')';

  re.tpl_link_fuzzy =
      // Fuzzy link can't be prepended with .:/\- and non punctuation.
      // but can start with > (markdown blockquote)
      '(^|(?![.:/\\-_@])(?:[$+<=>^`|\uff5c]|' + re.src_ZPCc + '))' +
      '((?![$+<=>^`|\uff5c])' + re.tpl_host_port_fuzzy_strict + re.src_path + ')';

  re.tpl_link_no_ip_fuzzy =
      // Fuzzy link can't be prepended with .:/\- and non punctuation.
      // but can start with > (markdown blockquote)
      '(^|(?![.:/\\-_@])(?:[$+<=>^`|\uff5c]|' + re.src_ZPCc + '))' +
      '((?![$+<=>^`|\uff5c])' + re.tpl_host_port_no_ip_fuzzy_strict + re.src_path + ')';

  return re;
};


/***/ }),
/* 236 */
/***/ (function(module, exports) {

/**
 * Special language-specific overrides.
 *
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 *
 * @type {Object}
 */
var LANGUAGES = {
  tr: {
    regexp: /\u0130|\u0049|\u0049\u0307/g,
    map: {
      '\u0130': '\u0069',
      '\u0049': '\u0131',
      '\u0049\u0307': '\u0069'
    }
  },
  az: {
    regexp: /[\u0130]/g,
    map: {
      '\u0130': '\u0069',
      '\u0049': '\u0131',
      '\u0049\u0307': '\u0069'
    }
  },
  lt: {
    regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
    map: {
      '\u0049': '\u0069\u0307',
      '\u004A': '\u006A\u0307',
      '\u012E': '\u012F\u0307',
      '\u00CC': '\u0069\u0307\u0300',
      '\u00CD': '\u0069\u0307\u0301',
      '\u0128': '\u0069\u0307\u0303'
    }
  }
}

/**
 * Lowercase a string.
 *
 * @param  {String} str
 * @return {String}
 */
module.exports = function (str, locale) {
  var lang = LANGUAGES[locale]

  str = str == null ? '' : String(str)

  if (lang) {
    str = str.replace(lang.regexp, function (m) { return lang.map[m] })
  }

  return str.toLowerCase()
}


/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process -> center text <-



module.exports = function centertext_plugin(md) {

  function tokenize(state, silent) {
    var token,
        max = state.posMax,
        start = state.pos,
        marker = state.src.charCodeAt(start);
    if (start + 1 > max) { return false; }
    if (silent) { return false; } // don't run any pairs in validation mode

    if (marker === 45/* - */ &&
      state.src.charCodeAt(start + 1) === 62/* > */
      ) {
      state.scanDelims(state.pos, true);
      token         = state.push('text', '', 0);
      token.content = '->';
      state.delimiters.push({
        marker: token.content,
        jump:   0,
        token:  state.tokens.length - 1,
        level:  state.level,
        end:    -1,
        open:   true,
        close:  false
      });
    } else if (marker === 60/* < */ &&
      state.src.charCodeAt(start + 1) === 45/* - */
      ) {
      // found the close marker
      state.scanDelims(state.pos, true);
      token         = state.push('text', '', 0);
      token.content = '<-';
      state.delimiters.push({
        marker: token.content,
        jump:   0,
        token:  state.tokens.length - 1,
        level:  state.level,
        end:    -1,
        open:   false,
        close:  true
      });
    } else {
      // neither
      return false;
    }

    state.pos += 2;

    return true;
  }


  // Walk through delimiter list and replace text tokens with tags
  //
  function postProcess(state) {
    var i,
        foundStart = false,
        foundEnd = false,
        delim,
        token,
        delimiters = state.delimiters,
        max = state.delimiters.length;

    for (i = 0; i < max; i++) {
      delim = delimiters[i];
      if (delim.marker === '->') {
        foundStart = true;
      } else if (delim.marker === '<-') {
        foundEnd = true;
      }
    }
    if (foundStart && foundEnd) {
      for (i = 0; i < max; i++) {
        delim = delimiters[i];

        if (delim.marker === '->') {
          foundStart = true;
          token         = state.tokens[delim.token];
          token.type    = 'centertext_open';
          token.tag     = 'div';
          token.nesting = 1;
          token.markup  = '->';
          token.content = '';
          token.attrs = [ [ 'style', 'text-align: center;' ] ];
        } else if (delim.marker === '<-') {
          if (foundStart) {
            token         = state.tokens[delim.token];
            token.type    = 'centertext_close';
            token.tag     = 'div';
            token.nesting = -1;
            token.markup  = '<-';
            token.content = '';
          }
        }
      }
    }
  }

  md.inline.ruler.before('emphasis', 'centertext', tokenize);
  md.inline.ruler2.before('emphasis', 'centertext', postProcess);
};


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



module.exports = __webpack_require__(244);


/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// List of valid html blocks names, accorting to commonmark spec
// http://jgm.github.io/CommonMark/spec.html#html-blocks




module.exports = [
  'address',
  'article',
  'aside',
  'base',
  'basefont',
  'blockquote',
  'body',
  'caption',
  'center',
  'col',
  'colgroup',
  'dd',
  'details',
  'dialog',
  'dir',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'frame',
  'frameset',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'iframe',
  'legend',
  'li',
  'link',
  'main',
  'menu',
  'menuitem',
  'meta',
  'nav',
  'noframes',
  'ol',
  'optgroup',
  'option',
  'p',
  'param',
  'pre',
  'section',
  'source',
  'title',
  'summary',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'title',
  'tr',
  'track',
  'ul'
];


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Just a shortcut for bulk export



exports.parseLinkLabel       = __webpack_require__(242);
exports.parseLinkDestination = __webpack_require__(241);
exports.parseLinkTitle       = __webpack_require__(243);


/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Parse link destination
//



var isSpace     = __webpack_require__(0).isSpace;
var unescapeAll = __webpack_require__(0).unescapeAll;


module.exports = function parseLinkDestination(str, pos, max) {
  var code, level,
      lines = 0,
      start = pos,
      result = {
        ok: false,
        pos: 0,
        lines: 0,
        str: ''
      };

  if (str.charCodeAt(pos) === 0x3C /* < */) {
    pos++;
    while (pos < max) {
      code = str.charCodeAt(pos);
      if (code === 0x0A /* \n */ || isSpace(code)) { return result; }
      if (code === 0x3E /* > */) {
        result.pos = pos + 1;
        result.str = unescapeAll(str.slice(start + 1, pos));
        result.ok = true;
        return result;
      }
      if (code === 0x5C /* \ */ && pos + 1 < max) {
        pos += 2;
        continue;
      }

      pos++;
    }

    // no closing '>'
    return result;
  }

  // this should be ... } else { ... branch

  level = 0;
  while (pos < max) {
    code = str.charCodeAt(pos);

    if (code === 0x20) { break; }

    // ascii control characters
    if (code < 0x20 || code === 0x7F) { break; }

    if (code === 0x5C /* \ */ && pos + 1 < max) {
      pos += 2;
      continue;
    }

    if (code === 0x28 /* ( */) {
      level++;
      if (level > 1) { break; }
    }

    if (code === 0x29 /* ) */) {
      level--;
      if (level < 0) { break; }
    }

    pos++;
  }

  if (start === pos) { return result; }

  result.str = unescapeAll(str.slice(start, pos));
  result.lines = lines;
  result.pos = pos;
  result.ok = true;
  return result;
};


/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Parse link label
//
// this function assumes that first character ("[") already matches;
// returns the end of the label
//


module.exports = function parseLinkLabel(state, start, disableNested) {
  var level, found, marker, prevPos,
      labelEnd = -1,
      max = state.posMax,
      oldPos = state.pos;

  state.pos = start + 1;
  level = 1;

  while (state.pos < max) {
    marker = state.src.charCodeAt(state.pos);
    if (marker === 0x5D /* ] */) {
      level--;
      if (level === 0) {
        found = true;
        break;
      }
    }

    prevPos = state.pos;
    state.md.inline.skipToken(state);
    if (marker === 0x5B /* [ */) {
      if (prevPos === state.pos - 1) {
        // increase level if we find text `[`, which is not a part of any token
        level++;
      } else if (disableNested) {
        state.pos = oldPos;
        return -1;
      }
    }
  }

  if (found) {
    labelEnd = state.pos;
  }

  // restore old state
  state.pos = oldPos;

  return labelEnd;
};


/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Parse link title
//



var unescapeAll = __webpack_require__(0).unescapeAll;


module.exports = function parseLinkTitle(str, pos, max) {
  var code,
      marker,
      lines = 0,
      start = pos,
      result = {
        ok: false,
        pos: 0,
        lines: 0,
        str: ''
      };

  if (pos >= max) { return result; }

  marker = str.charCodeAt(pos);

  if (marker !== 0x22 /* " */ && marker !== 0x27 /* ' */ && marker !== 0x28 /* ( */) { return result; }

  pos++;

  // if opening marker is "(", switch it to closing marker ")"
  if (marker === 0x28) { marker = 0x29; }

  while (pos < max) {
    code = str.charCodeAt(pos);
    if (code === marker) {
      result.pos = pos + 1;
      result.lines = lines;
      result.str = unescapeAll(str.slice(start + 1, pos));
      result.ok = true;
      return result;
    } else if (code === 0x0A) {
      lines++;
    } else if (code === 0x5C /* \ */ && pos + 1 < max) {
      pos++;
      if (str.charCodeAt(pos) === 0x0A) {
        lines++;
      }
    }

    pos++;
  }

  return result;
};


/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Main parser class




var utils        = __webpack_require__(0);
var helpers      = __webpack_require__(240);
var Renderer     = __webpack_require__(251);
var ParserCore   = __webpack_require__(246);
var ParserBlock  = __webpack_require__(245);
var ParserInline = __webpack_require__(247);
var LinkifyIt    = __webpack_require__(234);
var mdurl        = __webpack_require__(21);
var punycode     = __webpack_require__(287);


var config = {
  'default': __webpack_require__(249),
  zero: __webpack_require__(250),
  commonmark: __webpack_require__(248)
};

////////////////////////////////////////////////////////////////////////////////
//
// This validator can prohibit more than really needed to prevent XSS. It's a
// tradeoff to keep code simple and to be secure by default.
//
// If you need different setup - override validator method as you wish. Or
// replace it with dummy function and use external sanitizer.
//

var BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
var GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;

function validateLink(url) {
  // url should be normalized at this point, and existing entities are decoded
  var str = url.trim().toLowerCase();

  return BAD_PROTO_RE.test(str) ? (GOOD_DATA_RE.test(str) ? true : false) : true;
}

////////////////////////////////////////////////////////////////////////////////


var RECODE_HOSTNAME_FOR = [ 'http:', 'https:', 'mailto:' ];

function normalizeLink(url) {
  var parsed = mdurl.parse(url, true);

  if (parsed.hostname) {
    // Encode hostnames in urls like:
    // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
    //
    // We don't encode unknown schemas, because it's likely that we encode
    // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
    //
    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
      try {
        parsed.hostname = punycode.toASCII(parsed.hostname);
      } catch (er) { /**/ }
    }
  }

  return mdurl.encode(mdurl.format(parsed));
}

function normalizeLinkText(url) {
  var parsed = mdurl.parse(url, true);

  if (parsed.hostname) {
    // Encode hostnames in urls like:
    // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
    //
    // We don't encode unknown schemas, because it's likely that we encode
    // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
    //
    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
      try {
        parsed.hostname = punycode.toUnicode(parsed.hostname);
      } catch (er) { /**/ }
    }
  }

  return mdurl.decode(mdurl.format(parsed));
}


/**
 * class MarkdownIt
 *
 * Main parser/renderer class.
 *
 * ##### Usage
 *
 * ```javascript
 * // node.js, "classic" way:
 * var MarkdownIt = require('markdown-it'),
 *     md = new MarkdownIt();
 * var result = md.render('# markdown-it rulezz!');
 *
 * // node.js, the same, but with sugar:
 * var md = require('markdown-it')();
 * var result = md.render('# markdown-it rulezz!');
 *
 * // browser without AMD, added to "window" on script load
 * // Note, there are no dash.
 * var md = window.markdownit();
 * var result = md.render('# markdown-it rulezz!');
 * ```
 *
 * Single line rendering, without paragraph wrap:
 *
 * ```javascript
 * var md = require('markdown-it')();
 * var result = md.renderInline('__markdown-it__ rulezz!');
 * ```
 **/

/**
 * new MarkdownIt([presetName, options])
 * - presetName (String): optional, `commonmark` / `zero`
 * - options (Object)
 *
 * Creates parser instanse with given config. Can be called without `new`.
 *
 * ##### presetName
 *
 * MarkdownIt provides named presets as a convenience to quickly
 * enable/disable active syntax rules and options for common use cases.
 *
 * - ["commonmark"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/commonmark.js) -
 *   configures parser to strict [CommonMark](http://commonmark.org/) mode.
 * - [default](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/default.js) -
 *   similar to GFM, used when no preset name given. Enables all available rules,
 *   but still without html, typographer & autolinker.
 * - ["zero"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/zero.js) -
 *   all rules disabled. Useful to quickly setup your config via `.enable()`.
 *   For example, when you need only `bold` and `italic` markup and nothing else.
 *
 * ##### options:
 *
 * - __html__ - `false`. Set `true` to enable HTML tags in source. Be careful!
 *   That's not safe! You may need external sanitizer to protect output from XSS.
 *   It's better to extend features via plugins, instead of enabling HTML.
 * - __xhtmlOut__ - `false`. Set `true` to add '/' when closing single tags
 *   (`<br />`). This is needed only for full CommonMark compatibility. In real
 *   world you will need HTML output.
 * - __breaks__ - `false`. Set `true` to convert `\n` in paragraphs into `<br>`.
 * - __langPrefix__ - `language-`. CSS language class prefix for fenced blocks.
 *   Can be useful for external highlighters.
 * - __linkify__ - `false`. Set `true` to autoconvert URL-like text to links.
 * - __typographer__  - `false`. Set `true` to enable [some language-neutral
 *   replacement](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js) +
 *   quotes beautification (smartquotes).
 * - __quotes__ - `“”‘’`, String or Array. Double + single quotes replacement
 *   pairs, when typographer enabled and smartquotes on. For example, you can
 *   use `'«»„“'` for Russian, `'„“‚‘'` for German, and
 *   `['«\xA0', '\xA0»', '‹\xA0', '\xA0›']` for French (including nbsp).
 * - __highlight__ - `null`. Highlighter function for fenced code blocks.
 *   Highlighter `function (str, lang)` should return escaped HTML. It can also
 *   return empty string if the source was not changed and should be escaped
 *   externaly. If result starts with <pre... internal wrapper is skipped.
 *
 * ##### Example
 *
 * ```javascript
 * // commonmark mode
 * var md = require('markdown-it')('commonmark');
 *
 * // default mode
 * var md = require('markdown-it')();
 *
 * // enable everything
 * var md = require('markdown-it')({
 *   html: true,
 *   linkify: true,
 *   typographer: true
 * });
 * ```
 *
 * ##### Syntax highlighting
 *
 * ```js
 * var hljs = require('highlight.js') // https://highlightjs.org/
 *
 * var md = require('markdown-it')({
 *   highlight: function (str, lang) {
 *     if (lang && hljs.getLanguage(lang)) {
 *       try {
 *         return hljs.highlight(lang, str, true).value;
 *       } catch (__) {}
 *     }
 *
 *     return ''; // use external default escaping
 *   }
 * });
 * ```
 *
 * Or with full wrapper override (if you need assign class to `<pre>`):
 *
 * ```javascript
 * var hljs = require('highlight.js') // https://highlightjs.org/
 *
 * // Actual default values
 * var md = require('markdown-it')({
 *   highlight: function (str, lang) {
 *     if (lang && hljs.getLanguage(lang)) {
 *       try {
 *         return '<pre class="hljs"><code>' +
 *                hljs.highlight(lang, str, true).value +
 *                '</code></pre>';
 *       } catch (__) {}
 *     }
 *
 *     return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
 *   }
 * });
 * ```
 *
 **/
function MarkdownIt(presetName, options) {
  if (!(this instanceof MarkdownIt)) {
    return new MarkdownIt(presetName, options);
  }

  if (!options) {
    if (!utils.isString(presetName)) {
      options = presetName || {};
      presetName = 'default';
    }
  }

  /**
   * MarkdownIt#inline -> ParserInline
   *
   * Instance of [[ParserInline]]. You may need it to add new rules when
   * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
   * [[MarkdownIt.enable]].
   **/
  this.inline = new ParserInline();

  /**
   * MarkdownIt#block -> ParserBlock
   *
   * Instance of [[ParserBlock]]. You may need it to add new rules when
   * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
   * [[MarkdownIt.enable]].
   **/
  this.block = new ParserBlock();

  /**
   * MarkdownIt#core -> Core
   *
   * Instance of [[Core]] chain executor. You may need it to add new rules when
   * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
   * [[MarkdownIt.enable]].
   **/
  this.core = new ParserCore();

  /**
   * MarkdownIt#renderer -> Renderer
   *
   * Instance of [[Renderer]]. Use it to modify output look. Or to add rendering
   * rules for new token types, generated by plugins.
   *
   * ##### Example
   *
   * ```javascript
   * var md = require('markdown-it')();
   *
   * function myToken(tokens, idx, options, env, self) {
   *   //...
   *   return result;
   * };
   *
   * md.renderer.rules['my_token'] = myToken
   * ```
   *
   * See [[Renderer]] docs and [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js).
   **/
  this.renderer = new Renderer();

  /**
   * MarkdownIt#linkify -> LinkifyIt
   *
   * [linkify-it](https://github.com/markdown-it/linkify-it) instance.
   * Used by [linkify](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/linkify.js)
   * rule.
   **/
  this.linkify = new LinkifyIt();

  /**
   * MarkdownIt#validateLink(url) -> Boolean
   *
   * Link validation function. CommonMark allows too much in links. By default
   * we disable `javascript:`, `vbscript:`, `file:` schemas, and almost all `data:...` schemas
   * except some embedded image types.
   *
   * You can change this behaviour:
   *
   * ```javascript
   * var md = require('markdown-it')();
   * // enable everything
   * md.validateLink = function () { return true; }
   * ```
   **/
  this.validateLink = validateLink;

  /**
   * MarkdownIt#normalizeLink(url) -> String
   *
   * Function used to encode link url to a machine-readable format,
   * which includes url-encoding, punycode, etc.
   **/
  this.normalizeLink = normalizeLink;

  /**
   * MarkdownIt#normalizeLinkText(url) -> String
   *
   * Function used to decode link url to a human-readable format`
   **/
  this.normalizeLinkText = normalizeLinkText;


  // Expose utils & helpers for easy acces from plugins

  /**
   * MarkdownIt#utils -> utils
   *
   * Assorted utility functions, useful to write plugins. See details
   * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/common/utils.js).
   **/
  this.utils = utils;

  /**
   * MarkdownIt#helpers -> helpers
   *
   * Link components parser functions, useful to write plugins. See details
   * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/helpers).
   **/
  this.helpers = utils.assign({}, helpers);


  this.options = {};
  this.configure(presetName);

  if (options) { this.set(options); }
}


/** chainable
 * MarkdownIt.set(options)
 *
 * Set parser options (in the same format as in constructor). Probably, you
 * will never need it, but you can change options after constructor call.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')()
 *             .set({ html: true, breaks: true })
 *             .set({ typographer, true });
 * ```
 *
 * __Note:__ To achieve the best possible performance, don't modify a
 * `markdown-it` instance options on the fly. If you need multiple configurations
 * it's best to create multiple instances and initialize each with separate
 * config.
 **/
MarkdownIt.prototype.set = function (options) {
  utils.assign(this.options, options);
  return this;
};


/** chainable, internal
 * MarkdownIt.configure(presets)
 *
 * Batch load of all options and compenent settings. This is internal method,
 * and you probably will not need it. But if you with - see available presets
 * and data structure [here](https://github.com/markdown-it/markdown-it/tree/master/lib/presets)
 *
 * We strongly recommend to use presets instead of direct config loads. That
 * will give better compatibility with next versions.
 **/
MarkdownIt.prototype.configure = function (presets) {
  var self = this, presetName;

  if (utils.isString(presets)) {
    presetName = presets;
    presets = config[presetName];
    if (!presets) { throw new Error('Wrong `markdown-it` preset "' + presetName + '", check name'); }
  }

  if (!presets) { throw new Error('Wrong `markdown-it` preset, can\'t be empty'); }

  if (presets.options) { self.set(presets.options); }

  if (presets.components) {
    Object.keys(presets.components).forEach(function (name) {
      if (presets.components[name].rules) {
        self[name].ruler.enableOnly(presets.components[name].rules);
      }
      if (presets.components[name].rules2) {
        self[name].ruler2.enableOnly(presets.components[name].rules2);
      }
    });
  }
  return this;
};


/** chainable
 * MarkdownIt.enable(list, ignoreInvalid)
 * - list (String|Array): rule name or list of rule names to enable
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Enable list or rules. It will automatically find appropriate components,
 * containing rules with given names. If rule not found, and `ignoreInvalid`
 * not set - throws exception.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')()
 *             .enable(['sub', 'sup'])
 *             .disable('smartquotes');
 * ```
 **/
MarkdownIt.prototype.enable = function (list, ignoreInvalid) {
  var result = [];

  if (!Array.isArray(list)) { list = [ list ]; }

  [ 'core', 'block', 'inline' ].forEach(function (chain) {
    result = result.concat(this[chain].ruler.enable(list, true));
  }, this);

  result = result.concat(this.inline.ruler2.enable(list, true));

  var missed = list.filter(function (name) { return result.indexOf(name) < 0; });

  if (missed.length && !ignoreInvalid) {
    throw new Error('MarkdownIt. Failed to enable unknown rule(s): ' + missed);
  }

  return this;
};


/** chainable
 * MarkdownIt.disable(list, ignoreInvalid)
 * - list (String|Array): rule name or list of rule names to disable.
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * The same as [[MarkdownIt.enable]], but turn specified rules off.
 **/
MarkdownIt.prototype.disable = function (list, ignoreInvalid) {
  var result = [];

  if (!Array.isArray(list)) { list = [ list ]; }

  [ 'core', 'block', 'inline' ].forEach(function (chain) {
    result = result.concat(this[chain].ruler.disable(list, true));
  }, this);

  result = result.concat(this.inline.ruler2.disable(list, true));

  var missed = list.filter(function (name) { return result.indexOf(name) < 0; });

  if (missed.length && !ignoreInvalid) {
    throw new Error('MarkdownIt. Failed to disable unknown rule(s): ' + missed);
  }
  return this;
};


/** chainable
 * MarkdownIt.use(plugin, params)
 *
 * Load specified plugin with given params into current parser instance.
 * It's just a sugar to call `plugin(md, params)` with curring.
 *
 * ##### Example
 *
 * ```javascript
 * var iterator = require('markdown-it-for-inline');
 * var md = require('markdown-it')()
 *             .use(iterator, 'foo_replace', 'text', function (tokens, idx) {
 *               tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar');
 *             });
 * ```
 **/
MarkdownIt.prototype.use = function (plugin /*, params, ... */) {
  var args = [ this ].concat(Array.prototype.slice.call(arguments, 1));
  plugin.apply(plugin, args);
  return this;
};


/** internal
 * MarkdownIt.parse(src, env) -> Array
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * Parse input string and returns list of block tokens (special token type
 * "inline" will contain list of inline tokens). You should not call this
 * method directly, until you write custom renderer (for example, to produce
 * AST).
 *
 * `env` is used to pass data between "distributed" rules and return additional
 * metadata like reference info, needed for the renderer. It also can be used to
 * inject data in specific cases. Usually, you will be ok to pass `{}`,
 * and then pass updated object to renderer.
 **/
MarkdownIt.prototype.parse = function (src, env) {
  if (typeof src !== 'string') {
    throw new Error('Input data should be a String');
  }

  var state = new this.core.State(src, this, env);

  this.core.process(state);

  return state.tokens;
};


/**
 * MarkdownIt.render(src [, env]) -> String
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * Render markdown string into html. It does all magic for you :).
 *
 * `env` can be used to inject additional metadata (`{}` by default).
 * But you will not need it with high probability. See also comment
 * in [[MarkdownIt.parse]].
 **/
MarkdownIt.prototype.render = function (src, env) {
  env = env || {};

  return this.renderer.render(this.parse(src, env), this.options, env);
};


/** internal
 * MarkdownIt.parseInline(src, env) -> Array
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * The same as [[MarkdownIt.parse]] but skip all block rules. It returns the
 * block tokens list with the single `inline` element, containing parsed inline
 * tokens in `children` property. Also updates `env` object.
 **/
MarkdownIt.prototype.parseInline = function (src, env) {
  var state = new this.core.State(src, this, env);

  state.inlineMode = true;
  this.core.process(state);

  return state.tokens;
};


/**
 * MarkdownIt.renderInline(src [, env]) -> String
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * Similar to [[MarkdownIt.render]] but for single paragraph content. Result
 * will NOT be wrapped into `<p>` tags.
 **/
MarkdownIt.prototype.renderInline = function (src, env) {
  env = env || {};

  return this.renderer.render(this.parseInline(src, env), this.options, env);
};


module.exports = MarkdownIt;


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** internal
 * class ParserBlock
 *
 * Block-level tokenizer.
 **/



var Ruler           = __webpack_require__(10);


var _rules = [
  // First 2 params - rule name & source. Secondary array - list of rules,
  // which can be terminated by this one.
  [ 'table',      __webpack_require__(263),      [ 'paragraph', 'reference' ] ],
  [ 'code',       __webpack_require__(253) ],
  [ 'fence',      __webpack_require__(254),      [ 'paragraph', 'reference', 'blockquote', 'list' ] ],
  [ 'blockquote', __webpack_require__(252), [ 'paragraph', 'reference', 'list' ] ],
  [ 'hr',         __webpack_require__(256),         [ 'paragraph', 'reference', 'blockquote', 'list' ] ],
  [ 'list',       __webpack_require__(259),       [ 'paragraph', 'reference', 'blockquote' ] ],
  [ 'reference',  __webpack_require__(261) ],
  [ 'heading',    __webpack_require__(255),    [ 'paragraph', 'reference', 'blockquote' ] ],
  [ 'lheading',   __webpack_require__(258) ],
  [ 'html_block', __webpack_require__(257), [ 'paragraph', 'reference', 'blockquote' ] ],
  [ 'paragraph',  __webpack_require__(260) ]
];


/**
 * new ParserBlock()
 **/
function ParserBlock() {
  /**
   * ParserBlock#ruler -> Ruler
   *
   * [[Ruler]] instance. Keep configuration of block rules.
   **/
  this.ruler = new Ruler();

  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1], { alt: (_rules[i][2] || []).slice() });
  }
}


// Generate tokens for input range
//
ParserBlock.prototype.tokenize = function (state, startLine, endLine) {
  var ok, i,
      rules = this.ruler.getRules(''),
      len = rules.length,
      line = startLine,
      hasEmptyLines = false,
      maxNesting = state.md.options.maxNesting;

  while (line < endLine) {
    state.line = line = state.skipEmptyLines(line);
    if (line >= endLine) { break; }

    // Termination condition for nested calls.
    // Nested calls currently used for blockquotes & lists
    if (state.sCount[line] < state.blkIndent) { break; }

    // If nesting level exceeded - skip tail to the end. That's not ordinary
    // situation and we should not care about content.
    if (state.level >= maxNesting) {
      state.line = endLine;
      break;
    }

    // Try all possible rules.
    // On success, rule should:
    //
    // - update `state.line`
    // - update `state.tokens`
    // - return true

    for (i = 0; i < len; i++) {
      ok = rules[i](state, line, endLine, false);
      if (ok) { break; }
    }

    // set state.tight iff we had an empty line before current tag
    // i.e. latest empty line should not count
    state.tight = !hasEmptyLines;

    // paragraph might "eat" one newline after it in nested lists
    if (state.isEmpty(state.line - 1)) {
      hasEmptyLines = true;
    }

    line = state.line;

    if (line < endLine && state.isEmpty(line)) {
      hasEmptyLines = true;
      line++;
      state.line = line;
    }
  }
};


/**
 * ParserBlock.parse(str, md, env, outTokens)
 *
 * Process input string and push block tokens into `outTokens`
 **/
ParserBlock.prototype.parse = function (src, md, env, outTokens) {
  var state;

  if (!src) { return; }

  state = new this.State(src, md, env, outTokens);

  this.tokenize(state, state.line, state.lineMax);
};


ParserBlock.prototype.State = __webpack_require__(262);


module.exports = ParserBlock;


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** internal
 * class Core
 *
 * Top-level rules executor. Glues block/inline parsers and does intermediate
 * transformations.
 **/



var Ruler  = __webpack_require__(10);


var _rules = [
  [ 'normalize',      __webpack_require__(267)      ],
  [ 'block',          __webpack_require__(264)          ],
  [ 'inline',         __webpack_require__(265)         ],
  [ 'linkify',        __webpack_require__(266)        ],
  [ 'replacements',   __webpack_require__(268)   ],
  [ 'smartquotes',    __webpack_require__(269)    ]
];


/**
 * new Core()
 **/
function Core() {
  /**
   * Core#ruler -> Ruler
   *
   * [[Ruler]] instance. Keep configuration of core rules.
   **/
  this.ruler = new Ruler();

  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }
}


/**
 * Core.process(state)
 *
 * Executes core chain rules.
 **/
Core.prototype.process = function (state) {
  var i, l, rules;

  rules = this.ruler.getRules('');

  for (i = 0, l = rules.length; i < l; i++) {
    rules[i](state);
  }
};

Core.prototype.State = __webpack_require__(270);


module.exports = Core;


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** internal
 * class ParserInline
 *
 * Tokenizes paragraph content.
 **/



var Ruler           = __webpack_require__(10);


////////////////////////////////////////////////////////////////////////////////
// Parser rules

var _rules = [
  [ 'text',            __webpack_require__(281) ],
  [ 'newline',         __webpack_require__(279) ],
  [ 'escape',          __webpack_require__(275) ],
  [ 'backticks',       __webpack_require__(272) ],
  [ 'strikethrough',   __webpack_require__(20).tokenize ],
  [ 'emphasis',        __webpack_require__(19).tokenize ],
  [ 'link',            __webpack_require__(278) ],
  [ 'image',           __webpack_require__(277) ],
  [ 'autolink',        __webpack_require__(271) ],
  [ 'html_inline',     __webpack_require__(276) ],
  [ 'entity',          __webpack_require__(274) ]
];

var _rules2 = [
  [ 'balance_pairs',   __webpack_require__(273) ],
  [ 'strikethrough',   __webpack_require__(20).postProcess ],
  [ 'emphasis',        __webpack_require__(19).postProcess ],
  [ 'text_collapse',   __webpack_require__(282) ]
];


/**
 * new ParserInline()
 **/
function ParserInline() {
  var i;

  /**
   * ParserInline#ruler -> Ruler
   *
   * [[Ruler]] instance. Keep configuration of inline rules.
   **/
  this.ruler = new Ruler();

  for (i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }

  /**
   * ParserInline#ruler2 -> Ruler
   *
   * [[Ruler]] instance. Second ruler used for post-processing
   * (e.g. in emphasis-like rules).
   **/
  this.ruler2 = new Ruler();

  for (i = 0; i < _rules2.length; i++) {
    this.ruler2.push(_rules2[i][0], _rules2[i][1]);
  }
}


// Skip single token by running all rules in validation mode;
// returns `true` if any rule reported success
//
ParserInline.prototype.skipToken = function (state) {
  var ok, i, pos = state.pos,
      rules = this.ruler.getRules(''),
      len = rules.length,
      maxNesting = state.md.options.maxNesting,
      cache = state.cache;


  if (typeof cache[pos] !== 'undefined') {
    state.pos = cache[pos];
    return;
  }

  if (state.level < maxNesting) {
    for (i = 0; i < len; i++) {
      // Increment state.level and decrement it later to limit recursion.
      // It's harmless to do here, because no tokens are created. But ideally,
      // we'd need a separate private state variable for this purpose.
      //
      state.level++;
      ok = rules[i](state, true);
      state.level--;

      if (ok) { break; }
    }
  } else {
    // Too much nesting, just skip until the end of the paragraph.
    //
    // NOTE: this will cause links to behave incorrectly in the following case,
    //       when an amount of `[` is exactly equal to `maxNesting + 1`:
    //
    //       [[[[[[[[[[[[[[[[[[[[[foo]()
    //
    // TODO: remove this workaround when CM standard will allow nested links
    //       (we can replace it by preventing links from being parsed in
    //       validation mode)
    //
    state.pos = state.posMax;
  }

  if (!ok) { state.pos++; }
  cache[pos] = state.pos;
};


// Generate tokens for input range
//
ParserInline.prototype.tokenize = function (state) {
  var ok, i,
      rules = this.ruler.getRules(''),
      len = rules.length,
      end = state.posMax,
      maxNesting = state.md.options.maxNesting;

  while (state.pos < end) {
    // Try all possible rules.
    // On success, rule should:
    //
    // - update `state.pos`
    // - update `state.tokens`
    // - return true

    if (state.level < maxNesting) {
      for (i = 0; i < len; i++) {
        ok = rules[i](state, false);
        if (ok) { break; }
      }
    }

    if (ok) {
      if (state.pos >= end) { break; }
      continue;
    }

    state.pending += state.src[state.pos++];
  }

  if (state.pending) {
    state.pushPending();
  }
};


/**
 * ParserInline.parse(str, md, env, outTokens)
 *
 * Process input string and push inline tokens into `outTokens`
 **/
ParserInline.prototype.parse = function (str, md, env, outTokens) {
  var i, rules, len;
  var state = new this.State(str, md, env, outTokens);

  this.tokenize(state);

  rules = this.ruler2.getRules('');
  len = rules.length;

  for (i = 0; i < len; i++) {
    rules[i](state);
  }
};


ParserInline.prototype.State = __webpack_require__(280);


module.exports = ParserInline;


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Commonmark default options




module.exports = {
  options: {
    html:         true,         // Enable HTML tags in source
    xhtmlOut:     true,         // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // autoconvert URL-like texts to links

    // Enable some language-neutral replacements + quotes beautification
    typographer:  false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '\u201c\u201d\u2018\u2019', /* “”‘’ */

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,

    maxNesting:   20            // Internal protection, recursion limit
  },

  components: {

    core: {
      rules: [
        'normalize',
        'block',
        'inline'
      ]
    },

    block: {
      rules: [
        'blockquote',
        'code',
        'fence',
        'heading',
        'hr',
        'html_block',
        'lheading',
        'list',
        'reference',
        'paragraph'
      ]
    },

    inline: {
      rules: [
        'autolink',
        'backticks',
        'emphasis',
        'entity',
        'escape',
        'html_inline',
        'image',
        'link',
        'newline',
        'text'
      ],
      rules2: [
        'balance_pairs',
        'emphasis',
        'text_collapse'
      ]
    }
  }
};


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// markdown-it default options




module.exports = {
  options: {
    html:         false,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // autoconvert URL-like texts to links

    // Enable some language-neutral replacements + quotes beautification
    typographer:  false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '\u201c\u201d\u2018\u2019', /* “”‘’ */

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,

    maxNesting:   100            // Internal protection, recursion limit
  },

  components: {

    core: {},
    block: {},
    inline: {}
  }
};


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// "Zero" preset, with nothing enabled. Useful for manual configuring of simple
// modes. For example, to parse bold/italic only.




module.exports = {
  options: {
    html:         false,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // autoconvert URL-like texts to links

    // Enable some language-neutral replacements + quotes beautification
    typographer:  false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '\u201c\u201d\u2018\u2019', /* “”‘’ */

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,

    maxNesting:   20            // Internal protection, recursion limit
  },

  components: {

    core: {
      rules: [
        'normalize',
        'block',
        'inline'
      ]
    },

    block: {
      rules: [
        'paragraph'
      ]
    },

    inline: {
      rules: [
        'text'
      ],
      rules2: [
        'balance_pairs',
        'text_collapse'
      ]
    }
  }
};


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * class Renderer
 *
 * Generates HTML from parsed token stream. Each instance has independent
 * copy of rules. Those can be rewritten with ease. Also, you can add new
 * rules if you create plugin and adds new token types.
 **/



var assign          = __webpack_require__(0).assign;
var unescapeAll     = __webpack_require__(0).unescapeAll;
var escapeHtml      = __webpack_require__(0).escapeHtml;


////////////////////////////////////////////////////////////////////////////////

var default_rules = {};


default_rules.code_inline = function (tokens, idx, options, env, slf) {
  var token = tokens[idx];

  return  '<code' + slf.renderAttrs(token) + '>' +
          escapeHtml(tokens[idx].content) +
          '</code>';
};


default_rules.code_block = function (tokens, idx, options, env, slf) {
  var token = tokens[idx];

  return  '<pre' + slf.renderAttrs(token) + '><code>' +
          escapeHtml(tokens[idx].content) +
          '</code></pre>\n';
};


default_rules.fence = function (tokens, idx, options, env, slf) {
  var token = tokens[idx],
      info = token.info ? unescapeAll(token.info).trim() : '',
      langName = '',
      highlighted, i, tmpAttrs, tmpToken;

  if (info) {
    langName = info.split(/\s+/g)[0];
  }

  if (options.highlight) {
    highlighted = options.highlight(token.content, langName) || escapeHtml(token.content);
  } else {
    highlighted = escapeHtml(token.content);
  }

  if (highlighted.indexOf('<pre') === 0) {
    return highlighted + '\n';
  }

  // If language exists, inject class gently, without mudofying original token.
  // May be, one day we will add .clone() for token and simplify this part, but
  // now we prefer to keep things local.
  if (info) {
    i        = token.attrIndex('class');
    tmpAttrs = token.attrs ? token.attrs.slice() : [];

    if (i < 0) {
      tmpAttrs.push([ 'class', options.langPrefix + langName ]);
    } else {
      tmpAttrs[i][1] += ' ' + options.langPrefix + langName;
    }

    // Fake token just to render attributes
    tmpToken = {
      attrs: tmpAttrs
    };

    return  '<pre><code' + slf.renderAttrs(tmpToken) + '>'
          + highlighted
          + '</code></pre>\n';
  }


  return  '<pre><code' + slf.renderAttrs(token) + '>'
        + highlighted
        + '</code></pre>\n';
};


default_rules.image = function (tokens, idx, options, env, slf) {
  var token = tokens[idx];

  // "alt" attr MUST be set, even if empty. Because it's mandatory and
  // should be placed on proper position for tests.
  //
  // Replace content with actual value

  token.attrs[token.attrIndex('alt')][1] =
    slf.renderInlineAsText(token.children, options, env);

  return slf.renderToken(tokens, idx, options);
};


default_rules.hardbreak = function (tokens, idx, options /*, env */) {
  return options.xhtmlOut ? '<br />\n' : '<br>\n';
};
default_rules.softbreak = function (tokens, idx, options /*, env */) {
  return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
};


default_rules.text = function (tokens, idx /*, options, env */) {
  return escapeHtml(tokens[idx].content);
};


default_rules.html_block = function (tokens, idx /*, options, env */) {
  return tokens[idx].content;
};
default_rules.html_inline = function (tokens, idx /*, options, env */) {
  return tokens[idx].content;
};


/**
 * new Renderer()
 *
 * Creates new [[Renderer]] instance and fill [[Renderer#rules]] with defaults.
 **/
function Renderer() {

  /**
   * Renderer#rules -> Object
   *
   * Contains render rules for tokens. Can be updated and extended.
   *
   * ##### Example
   *
   * ```javascript
   * var md = require('markdown-it')();
   *
   * md.renderer.rules.strong_open  = function () { return '<b>'; };
   * md.renderer.rules.strong_close = function () { return '</b>'; };
   *
   * var result = md.renderInline(...);
   * ```
   *
   * Each rule is called as independed static function with fixed signature:
   *
   * ```javascript
   * function my_token_render(tokens, idx, options, env, renderer) {
   *   // ...
   *   return renderedHTML;
   * }
   * ```
   *
   * See [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js)
   * for more details and examples.
   **/
  this.rules = assign({}, default_rules);
}


/**
 * Renderer.renderAttrs(token) -> String
 *
 * Render token attributes to string.
 **/
Renderer.prototype.renderAttrs = function renderAttrs(token) {
  var i, l, result;

  if (!token.attrs) { return ''; }

  result = '';

  for (i = 0, l = token.attrs.length; i < l; i++) {
    result += ' ' + escapeHtml(token.attrs[i][0]) + '="' + escapeHtml(token.attrs[i][1]) + '"';
  }

  return result;
};


/**
 * Renderer.renderToken(tokens, idx, options) -> String
 * - tokens (Array): list of tokens
 * - idx (Numbed): token index to render
 * - options (Object): params of parser instance
 *
 * Default token renderer. Can be overriden by custom function
 * in [[Renderer#rules]].
 **/
Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
  var nextToken,
      result = '',
      needLf = false,
      token = tokens[idx];

  // Tight list paragraphs
  if (token.hidden) {
    return '';
  }

  // Insert a newline between hidden paragraph and subsequent opening
  // block-level tag.
  //
  // For example, here we should insert a newline before blockquote:
  //  - a
  //    >
  //
  if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) {
    result += '\n';
  }

  // Add token name, e.g. `<img`
  result += (token.nesting === -1 ? '</' : '<') + token.tag;

  // Encode attributes, e.g. `<img src="foo"`
  result += this.renderAttrs(token);

  // Add a slash for self-closing tags, e.g. `<img src="foo" /`
  if (token.nesting === 0 && options.xhtmlOut) {
    result += ' /';
  }

  // Check if we need to add a newline after this tag
  if (token.block) {
    needLf = true;

    if (token.nesting === 1) {
      if (idx + 1 < tokens.length) {
        nextToken = tokens[idx + 1];

        if (nextToken.type === 'inline' || nextToken.hidden) {
          // Block-level tag containing an inline tag.
          //
          needLf = false;

        } else if (nextToken.nesting === -1 && nextToken.tag === token.tag) {
          // Opening tag + closing tag of the same type. E.g. `<li></li>`.
          //
          needLf = false;
        }
      }
    }
  }

  result += needLf ? '>\n' : '>';

  return result;
};


/**
 * Renderer.renderInline(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to renter
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * The same as [[Renderer.render]], but for single token of `inline` type.
 **/
Renderer.prototype.renderInline = function (tokens, options, env) {
  var type,
      result = '',
      rules = this.rules;

  for (var i = 0, len = tokens.length; i < len; i++) {
    type = tokens[i].type;

    if (typeof rules[type] !== 'undefined') {
      result += rules[type](tokens, i, options, env, this);
    } else {
      result += this.renderToken(tokens, i, options);
    }
  }

  return result;
};


/** internal
 * Renderer.renderInlineAsText(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to renter
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * Special kludge for image `alt` attributes to conform CommonMark spec.
 * Don't try to use it! Spec requires to show `alt` content with stripped markup,
 * instead of simple escaping.
 **/
Renderer.prototype.renderInlineAsText = function (tokens, options, env) {
  var result = '';

  for (var i = 0, len = tokens.length; i < len; i++) {
    if (tokens[i].type === 'text') {
      result += tokens[i].content;
    } else if (tokens[i].type === 'image') {
      result += this.renderInlineAsText(tokens[i].children, options, env);
    }
  }

  return result;
};


/**
 * Renderer.render(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to renter
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * Takes token stream and generates HTML. Probably, you will never need to call
 * this method directly.
 **/
Renderer.prototype.render = function (tokens, options, env) {
  var i, len, type,
      result = '',
      rules = this.rules;

  for (i = 0, len = tokens.length; i < len; i++) {
    type = tokens[i].type;

    if (type === 'inline') {
      result += this.renderInline(tokens[i].children, options, env);
    } else if (typeof rules[type] !== 'undefined') {
      result += rules[tokens[i].type](tokens, i, options, env, this);
    } else {
      result += this.renderToken(tokens, i, options, env);
    }
  }

  return result;
};

module.exports = Renderer;


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Block quotes



var isSpace = __webpack_require__(0).isSpace;


module.exports = function blockquote(state, startLine, endLine, silent) {
  var adjustTab,
      ch,
      i,
      initial,
      isOutdented,
      l,
      lastLineEmpty,
      lines,
      nextLine,
      offset,
      oldBMarks,
      oldBSCount,
      oldIndent,
      oldParentType,
      oldSCount,
      oldTShift,
      spaceAfterMarker,
      terminate,
      terminatorRules,
      token,
      oldLineMax = state.lineMax,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  // check the block quote marker
  if (state.src.charCodeAt(pos++) !== 0x3E/* > */) { return false; }

  // we know that it's going to be a valid blockquote,
  // so no point trying to find the end of it in silent mode
  if (silent) { return true; }

  // skip spaces after ">" and re-calculate offset
  initial = offset = state.sCount[startLine] + pos - (state.bMarks[startLine] + state.tShift[startLine]);

  // skip one optional space after '>'
  if (state.src.charCodeAt(pos) === 0x20 /* space */) {
    // ' >   test '
    //     ^ -- position start of line here:
    pos++;
    initial++;
    offset++;
    adjustTab = false;
    spaceAfterMarker = true;
  } else if (state.src.charCodeAt(pos) === 0x09 /* tab */) {
    spaceAfterMarker = true;

    if ((state.bsCount[startLine] + offset) % 4 === 3) {
      // '  >\t  test '
      //       ^ -- position start of line here (tab has width===1)
      pos++;
      initial++;
      offset++;
      adjustTab = false;
    } else {
      // ' >\t  test '
      //    ^ -- position start of line here + shift bsCount slightly
      //         to make extra space appear
      adjustTab = true;
    }
  } else {
    spaceAfterMarker = false;
  }

  oldBMarks = [ state.bMarks[startLine] ];
  state.bMarks[startLine] = pos;

  while (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (isSpace(ch)) {
      if (ch === 0x09) {
        offset += 4 - (offset + state.bsCount[startLine] + (adjustTab ? 1 : 0)) % 4;
      } else {
        offset++;
      }
    } else {
      break;
    }

    pos++;
  }

  oldBSCount = [ state.bsCount[startLine] ];
  state.bsCount[startLine] = state.sCount[startLine] + 1 + (spaceAfterMarker ? 1 : 0);

  lastLineEmpty = pos >= max;

  oldSCount = [ state.sCount[startLine] ];
  state.sCount[startLine] = offset - initial;

  oldTShift = [ state.tShift[startLine] ];
  state.tShift[startLine] = pos - state.bMarks[startLine];

  terminatorRules = state.md.block.ruler.getRules('blockquote');

  oldParentType = state.parentType;
  state.parentType = 'blockquote';

  // Search the end of the block
  //
  // Block ends with either:
  //  1. an empty line outside:
  //     ```
  //     > test
  //
  //     ```
  //  2. an empty line inside:
  //     ```
  //     >
  //     test
  //     ```
  //  3. another tag:
  //     ```
  //     > test
  //      - - -
  //     ```
  for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
    // check if it's outdented, i.e. it's inside list item and indented
    // less than said list item:
    //
    // ```
    // 1. anything
    //    > current blockquote
    // 2. checking this line
    // ```
    isOutdented = state.sCount[nextLine] < state.blkIndent;

    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos >= max) {
      // Case 1: line is not inside the blockquote, and this line is empty.
      break;
    }

    if (state.src.charCodeAt(pos++) === 0x3E/* > */ && !isOutdented) {
      // This line is inside the blockquote.

      // skip spaces after ">" and re-calculate offset
      initial = offset = state.sCount[nextLine] + pos - (state.bMarks[nextLine] + state.tShift[nextLine]);

      // skip one optional space after '>'
      if (state.src.charCodeAt(pos) === 0x20 /* space */) {
        // ' >   test '
        //     ^ -- position start of line here:
        pos++;
        initial++;
        offset++;
        adjustTab = false;
        spaceAfterMarker = true;
      } else if (state.src.charCodeAt(pos) === 0x09 /* tab */) {
        spaceAfterMarker = true;

        if ((state.bsCount[nextLine] + offset) % 4 === 3) {
          // '  >\t  test '
          //       ^ -- position start of line here (tab has width===1)
          pos++;
          initial++;
          offset++;
          adjustTab = false;
        } else {
          // ' >\t  test '
          //    ^ -- position start of line here + shift bsCount slightly
          //         to make extra space appear
          adjustTab = true;
        }
      } else {
        spaceAfterMarker = false;
      }

      oldBMarks.push(state.bMarks[nextLine]);
      state.bMarks[nextLine] = pos;

      while (pos < max) {
        ch = state.src.charCodeAt(pos);

        if (isSpace(ch)) {
          if (ch === 0x09) {
            offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
          } else {
            offset++;
          }
        } else {
          break;
        }

        pos++;
      }

      lastLineEmpty = pos >= max;

      oldBSCount.push(state.bsCount[nextLine]);
      state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);

      oldSCount.push(state.sCount[nextLine]);
      state.sCount[nextLine] = offset - initial;

      oldTShift.push(state.tShift[nextLine]);
      state.tShift[nextLine] = pos - state.bMarks[nextLine];
      continue;
    }

    // Case 2: line is not inside the blockquote, and the last line was empty.
    if (lastLineEmpty) { break; }

    // Case 3: another tag found.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }

    if (terminate) {
      // Quirk to enforce "hard termination mode" for paragraphs;
      // normally if you call `tokenize(state, startLine, nextLine)`,
      // paragraphs will look below nextLine for paragraph continuation,
      // but if blockquote is terminated by another tag, they shouldn't
      state.lineMax = nextLine;

      if (state.blkIndent !== 0) {
        // state.blkIndent was non-zero, we now set it to zero,
        // so we need to re-calculate all offsets to appear as
        // if indent wasn't changed
        oldBMarks.push(state.bMarks[nextLine]);
        oldBSCount.push(state.bsCount[nextLine]);
        oldTShift.push(state.tShift[nextLine]);
        oldSCount.push(state.sCount[nextLine]);
        state.sCount[nextLine] -= state.blkIndent;
      }

      break;
    }

    if (isOutdented) break;

    oldBMarks.push(state.bMarks[nextLine]);
    oldBSCount.push(state.bsCount[nextLine]);
    oldTShift.push(state.tShift[nextLine]);
    oldSCount.push(state.sCount[nextLine]);

    // A negative indentation means that this is a paragraph continuation
    //
    state.sCount[nextLine] = -1;
  }

  oldIndent = state.blkIndent;
  state.blkIndent = 0;

  token        = state.push('blockquote_open', 'blockquote', 1);
  token.markup = '>';
  token.map    = lines = [ startLine, 0 ];

  state.md.block.tokenize(state, startLine, nextLine);

  token        = state.push('blockquote_close', 'blockquote', -1);
  token.markup = '>';

  state.lineMax = oldLineMax;
  state.parentType = oldParentType;
  lines[1] = state.line;

  // Restore original tShift; this might not be necessary since the parser
  // has already been here, but just to make sure we can do that.
  for (i = 0; i < oldTShift.length; i++) {
    state.bMarks[i + startLine] = oldBMarks[i];
    state.tShift[i + startLine] = oldTShift[i];
    state.sCount[i + startLine] = oldSCount[i];
    state.bsCount[i + startLine] = oldBSCount[i];
  }
  state.blkIndent = oldIndent;

  return true;
};


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Code block (4 spaces padded)




module.exports = function code(state, startLine, endLine/*, silent*/) {
  var nextLine, last, token;

  if (state.sCount[startLine] - state.blkIndent < 4) { return false; }

  last = nextLine = startLine + 1;

  while (nextLine < endLine) {
    if (state.isEmpty(nextLine)) {
      nextLine++;
      continue;
    }

    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      nextLine++;
      last = nextLine;
      continue;
    }
    break;
  }

  state.line = last;

  token         = state.push('code_block', 'code', 0);
  token.content = state.getLines(startLine, last, 4 + state.blkIndent, true);
  token.map     = [ startLine, state.line ];

  return true;
};


/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// fences (``` lang, ~~~ lang)




module.exports = function fence(state, startLine, endLine, silent) {
  var marker, len, params, nextLine, mem, token, markup,
      haveEndMarker = false,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  if (pos + 3 > max) { return false; }

  marker = state.src.charCodeAt(pos);

  if (marker !== 0x7E/* ~ */ && marker !== 0x60 /* ` */) {
    return false;
  }

  // scan marker length
  mem = pos;
  pos = state.skipChars(pos, marker);

  len = pos - mem;

  if (len < 3) { return false; }

  markup = state.src.slice(mem, pos);
  params = state.src.slice(pos, max);

  if (params.indexOf(String.fromCharCode(marker)) >= 0) { return false; }

  // Since start is found, we can report success here in validation mode
  if (silent) { return true; }

  // search end of block
  nextLine = startLine;

  for (;;) {
    nextLine++;
    if (nextLine >= endLine) {
      // unclosed block should be autoclosed by end of document.
      // also block seems to be autoclosed by end of parent
      break;
    }

    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      // - ```
      //  test
      break;
    }

    if (state.src.charCodeAt(pos) !== marker) { continue; }

    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      // closing fence should be indented less than 4 spaces
      continue;
    }

    pos = state.skipChars(pos, marker);

    // closing code fence must be at least as long as the opening one
    if (pos - mem < len) { continue; }

    // make sure tail has spaces only
    pos = state.skipSpaces(pos);

    if (pos < max) { continue; }

    haveEndMarker = true;
    // found!
    break;
  }

  // If a fence has heading spaces, they should be removed from its inner block
  len = state.sCount[startLine];

  state.line = nextLine + (haveEndMarker ? 1 : 0);

  token         = state.push('fence', 'code', 0);
  token.info    = params;
  token.content = state.getLines(startLine + 1, nextLine, len, true);
  token.markup  = markup;
  token.map     = [ startLine, state.line ];

  return true;
};


/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// heading (#, ##, ...)



var isSpace = __webpack_require__(0).isSpace;


module.exports = function heading(state, startLine, endLine, silent) {
  var ch, level, tmp, token,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  ch  = state.src.charCodeAt(pos);

  if (ch !== 0x23/* # */ || pos >= max) { return false; }

  // count heading level
  level = 1;
  ch = state.src.charCodeAt(++pos);
  while (ch === 0x23/* # */ && pos < max && level <= 6) {
    level++;
    ch = state.src.charCodeAt(++pos);
  }

  if (level > 6 || (pos < max && !isSpace(ch))) { return false; }

  if (silent) { return true; }

  // Let's cut tails like '    ###  ' from the end of string

  max = state.skipSpacesBack(max, pos);
  tmp = state.skipCharsBack(max, 0x23, pos); // #
  if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) {
    max = tmp;
  }

  state.line = startLine + 1;

  token        = state.push('heading_open', 'h' + String(level), 1);
  token.markup = '########'.slice(0, level);
  token.map    = [ startLine, state.line ];

  token          = state.push('inline', '', 0);
  token.content  = state.src.slice(pos, max).trim();
  token.map      = [ startLine, state.line ];
  token.children = [];

  token        = state.push('heading_close', 'h' + String(level), -1);
  token.markup = '########'.slice(0, level);

  return true;
};


/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Horizontal rule



var isSpace = __webpack_require__(0).isSpace;


module.exports = function hr(state, startLine, endLine, silent) {
  var marker, cnt, ch, token,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  marker = state.src.charCodeAt(pos++);

  // Check hr marker
  if (marker !== 0x2A/* * */ &&
      marker !== 0x2D/* - */ &&
      marker !== 0x5F/* _ */) {
    return false;
  }

  // markers can be mixed with spaces, but there should be at least 3 of them

  cnt = 1;
  while (pos < max) {
    ch = state.src.charCodeAt(pos++);
    if (ch !== marker && !isSpace(ch)) { return false; }
    if (ch === marker) { cnt++; }
  }

  if (cnt < 3) { return false; }

  if (silent) { return true; }

  state.line = startLine + 1;

  token        = state.push('hr', 'hr', 0);
  token.map    = [ startLine, state.line ];
  token.markup = Array(cnt + 1).join(String.fromCharCode(marker));

  return true;
};


/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// HTML block




var block_names = __webpack_require__(239);
var HTML_OPEN_CLOSE_TAG_RE = __webpack_require__(18).HTML_OPEN_CLOSE_TAG_RE;

// An array of opening and corresponding closing sequences for html tags,
// last argument defines whether it can terminate a paragraph or not
//
var HTML_SEQUENCES = [
  [ /^<(script|pre|style)(?=(\s|>|$))/i, /<\/(script|pre|style)>/i, true ],
  [ /^<!--/,        /-->/,   true ],
  [ /^<\?/,         /\?>/,   true ],
  [ /^<![A-Z]/,     />/,     true ],
  [ /^<!\[CDATA\[/, /\]\]>/, true ],
  [ new RegExp('^</?(' + block_names.join('|') + ')(?=(\\s|/?>|$))', 'i'), /^$/, true ],
  [ new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + '\\s*$'),  /^$/, false ]
];


module.exports = function html_block(state, startLine, endLine, silent) {
  var i, nextLine, token, lineText,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  if (!state.md.options.html) { return false; }

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  lineText = state.src.slice(pos, max);

  for (i = 0; i < HTML_SEQUENCES.length; i++) {
    if (HTML_SEQUENCES[i][0].test(lineText)) { break; }
  }

  if (i === HTML_SEQUENCES.length) { return false; }

  if (silent) {
    // true if this sequence can be a terminator, false otherwise
    return HTML_SEQUENCES[i][2];
  }

  nextLine = startLine + 1;

  // If we are here - we detected HTML block.
  // Let's roll down till block end.
  if (!HTML_SEQUENCES[i][1].test(lineText)) {
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) { break; }

      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);

      if (HTML_SEQUENCES[i][1].test(lineText)) {
        if (lineText.length !== 0) { nextLine++; }
        break;
      }
    }
  }

  state.line = nextLine;

  token         = state.push('html_block', '', 0);
  token.map     = [ startLine, nextLine ];
  token.content = state.getLines(startLine, nextLine, state.blkIndent, true);

  return true;
};


/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// lheading (---, ===)




module.exports = function lheading(state, startLine, endLine/*, silent*/) {
  var content, terminate, i, l, token, pos, max, level, marker,
      nextLine = startLine + 1, oldParentType,
      terminatorRules = state.md.block.ruler.getRules('paragraph');

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  oldParentType = state.parentType;
  state.parentType = 'paragraph'; // use paragraph to match terminatorRules

  // jump line-by-line until empty one or EOF
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }

    //
    // Check for underline in setext header
    //
    if (state.sCount[nextLine] >= state.blkIndent) {
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];

      if (pos < max) {
        marker = state.src.charCodeAt(pos);

        if (marker === 0x2D/* - */ || marker === 0x3D/* = */) {
          pos = state.skipChars(pos, marker);
          pos = state.skipSpaces(pos);

          if (pos >= max) {
            level = (marker === 0x3D/* = */ ? 1 : 2);
            break;
          }
        }
      }
    }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue; }

    // Some tags can terminate paragraph without empty line.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }
  }

  if (!level) {
    // Didn't find valid underline
    return false;
  }

  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

  state.line = nextLine + 1;

  token          = state.push('heading_open', 'h' + String(level), 1);
  token.markup   = String.fromCharCode(marker);
  token.map      = [ startLine, state.line ];

  token          = state.push('inline', '', 0);
  token.content  = content;
  token.map      = [ startLine, state.line - 1 ];
  token.children = [];

  token          = state.push('heading_close', 'h' + String(level), -1);
  token.markup   = String.fromCharCode(marker);

  state.parentType = oldParentType;

  return true;
};


/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Lists



var isSpace = __webpack_require__(0).isSpace;


// Search `[-+*][\n ]`, returns next pos arter marker on success
// or -1 on fail.
function skipBulletListMarker(state, startLine) {
  var marker, pos, max, ch;

  pos = state.bMarks[startLine] + state.tShift[startLine];
  max = state.eMarks[startLine];

  marker = state.src.charCodeAt(pos++);
  // Check bullet
  if (marker !== 0x2A/* * */ &&
      marker !== 0x2D/* - */ &&
      marker !== 0x2B/* + */) {
    return -1;
  }

  if (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (!isSpace(ch)) {
      // " -test " - is not a list item
      return -1;
    }
  }

  return pos;
}

// Search `\d+[.)][\n ]`, returns next pos arter marker on success
// or -1 on fail.
function skipOrderedListMarker(state, startLine) {
  var ch,
      start = state.bMarks[startLine] + state.tShift[startLine],
      pos = start,
      max = state.eMarks[startLine];

  // List marker should have at least 2 chars (digit + dot)
  if (pos + 1 >= max) { return -1; }

  ch = state.src.charCodeAt(pos++);

  if (ch < 0x30/* 0 */ || ch > 0x39/* 9 */) { return -1; }

  for (;;) {
    // EOL -> fail
    if (pos >= max) { return -1; }

    ch = state.src.charCodeAt(pos++);

    if (ch >= 0x30/* 0 */ && ch <= 0x39/* 9 */) {

      // List marker should have no more than 9 digits
      // (prevents integer overflow in browsers)
      if (pos - start >= 10) { return -1; }

      continue;
    }

    // found valid marker
    if (ch === 0x29/* ) */ || ch === 0x2e/* . */) {
      break;
    }

    return -1;
  }


  if (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (!isSpace(ch)) {
      // " 1.test " - is not a list item
      return -1;
    }
  }
  return pos;
}

function markTightParagraphs(state, idx) {
  var i, l,
      level = state.level + 2;

  for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
    if (state.tokens[i].level === level && state.tokens[i].type === 'paragraph_open') {
      state.tokens[i + 2].hidden = true;
      state.tokens[i].hidden = true;
      i += 2;
    }
  }
}


module.exports = function list(state, startLine, endLine, silent) {
  var ch,
      contentStart,
      i,
      indent,
      indentAfterMarker,
      initial,
      isOrdered,
      itemLines,
      l,
      listLines,
      listTokIdx,
      markerCharCode,
      markerValue,
      max,
      nextLine,
      offset,
      oldIndent,
      oldLIndent,
      oldParentType,
      oldTShift,
      oldTight,
      pos,
      posAfterMarker,
      prevEmptyEnd,
      start,
      terminate,
      terminatorRules,
      token,
      isTerminatingParagraph = false,
      tight = true;

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  // limit conditions when list can interrupt
  // a paragraph (validation mode only)
  if (silent && state.parentType === 'paragraph') {
    // Next list item should still terminate previous list item;
    //
    // This code can fail if plugins use blkIndent as well as lists,
    // but I hope the spec gets fixed long before that happens.
    //
    if (state.tShift[startLine] >= state.blkIndent) {
      isTerminatingParagraph = true;
    }
  }

  // Detect list type and position after marker
  if ((posAfterMarker = skipOrderedListMarker(state, startLine)) >= 0) {
    isOrdered = true;
    start = state.bMarks[startLine] + state.tShift[startLine];
    markerValue = Number(state.src.substr(start, posAfterMarker - start - 1));

    // If we're starting a new ordered list right after
    // a paragraph, it should start with 1.
    if (isTerminatingParagraph && markerValue !== 1) return false;

  } else if ((posAfterMarker = skipBulletListMarker(state, startLine)) >= 0) {
    isOrdered = false;

  } else {
    return false;
  }

  // If we're starting a new unordered list right after
  // a paragraph, first line should not be empty.
  if (isTerminatingParagraph) {
    if (state.skipSpaces(posAfterMarker) >= state.eMarks[startLine]) return false;
  }

  // We should terminate list on style change. Remember first one to compare.
  markerCharCode = state.src.charCodeAt(posAfterMarker - 1);

  // For validation mode we can terminate immediately
  if (silent) { return true; }

  // Start list
  listTokIdx = state.tokens.length;

  if (isOrdered) {
    token       = state.push('ordered_list_open', 'ol', 1);
    if (markerValue !== 1) {
      token.attrs = [ [ 'start', markerValue ] ];
    }

  } else {
    token       = state.push('bullet_list_open', 'ul', 1);
  }

  token.map    = listLines = [ startLine, 0 ];
  token.markup = String.fromCharCode(markerCharCode);

  //
  // Iterate list items
  //

  nextLine = startLine;
  prevEmptyEnd = false;
  terminatorRules = state.md.block.ruler.getRules('list');

  oldParentType = state.parentType;
  state.parentType = 'list';

  while (nextLine < endLine) {
    pos = posAfterMarker;
    max = state.eMarks[nextLine];

    initial = offset = state.sCount[nextLine] + posAfterMarker - (state.bMarks[startLine] + state.tShift[startLine]);

    while (pos < max) {
      ch = state.src.charCodeAt(pos);

      if (isSpace(ch)) {
        if (ch === 0x09) {
          offset += 4 - (offset + state.bsCount[nextLine]) % 4;
        } else {
          offset++;
        }
      } else {
        break;
      }

      pos++;
    }

    contentStart = pos;

    if (contentStart >= max) {
      // trimming space in "-    \n  3" case, indent is 1 here
      indentAfterMarker = 1;
    } else {
      indentAfterMarker = offset - initial;
    }

    // If we have more than 4 spaces, the indent is 1
    // (the rest is just indented code block)
    if (indentAfterMarker > 4) { indentAfterMarker = 1; }

    // "  -  test"
    //  ^^^^^ - calculating total length of this thing
    indent = initial + indentAfterMarker;

    // Run subparser & write tokens
    token        = state.push('list_item_open', 'li', 1);
    token.markup = String.fromCharCode(markerCharCode);
    token.map    = itemLines = [ startLine, 0 ];

    oldIndent = state.blkIndent;
    oldTight = state.tight;
    oldTShift = state.tShift[startLine];
    oldLIndent = state.sCount[startLine];
    state.blkIndent = indent;
    state.tight = true;
    state.tShift[startLine] = contentStart - state.bMarks[startLine];
    state.sCount[startLine] = offset;

    if (contentStart >= max && state.isEmpty(startLine + 1)) {
      // workaround for this case
      // (list item is empty, list terminates before "foo"):
      // ~~~~~~~~
      //   -
      //
      //     foo
      // ~~~~~~~~
      state.line = Math.min(state.line + 2, endLine);
    } else {
      state.md.block.tokenize(state, startLine, endLine, true);
    }

    // If any of list item is tight, mark list as tight
    if (!state.tight || prevEmptyEnd) {
      tight = false;
    }
    // Item become loose if finish with empty line,
    // but we should filter last element, because it means list finish
    prevEmptyEnd = (state.line - startLine) > 1 && state.isEmpty(state.line - 1);

    state.blkIndent = oldIndent;
    state.tShift[startLine] = oldTShift;
    state.sCount[startLine] = oldLIndent;
    state.tight = oldTight;

    token        = state.push('list_item_close', 'li', -1);
    token.markup = String.fromCharCode(markerCharCode);

    nextLine = startLine = state.line;
    itemLines[1] = nextLine;
    contentStart = state.bMarks[startLine];

    if (nextLine >= endLine) { break; }

    //
    // Try to check if list is terminated or continued.
    //
    if (state.sCount[nextLine] < state.blkIndent) { break; }

    // fail if terminating block found
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }

    // fail if list has another type
    if (isOrdered) {
      posAfterMarker = skipOrderedListMarker(state, nextLine);
      if (posAfterMarker < 0) { break; }
    } else {
      posAfterMarker = skipBulletListMarker(state, nextLine);
      if (posAfterMarker < 0) { break; }
    }

    if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) { break; }
  }

  // Finilize list
  if (isOrdered) {
    token = state.push('ordered_list_close', 'ol', -1);
  } else {
    token = state.push('bullet_list_close', 'ul', -1);
  }
  token.markup = String.fromCharCode(markerCharCode);

  listLines[1] = nextLine;
  state.line = nextLine;

  state.parentType = oldParentType;

  // mark paragraphs tight if needed
  if (tight) {
    markTightParagraphs(state, listTokIdx);
  }

  return true;
};


/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Paragraph




module.exports = function paragraph(state, startLine/*, endLine*/) {
  var content, terminate, i, l, token, oldParentType,
      nextLine = startLine + 1,
      terminatorRules = state.md.block.ruler.getRules('paragraph'),
      endLine = state.lineMax;

  oldParentType = state.parentType;
  state.parentType = 'paragraph';

  // jump line-by-line until empty one or EOF
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue; }

    // Some tags can terminate paragraph without empty line.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }
  }

  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

  state.line = nextLine;

  token          = state.push('paragraph_open', 'p', 1);
  token.map      = [ startLine, state.line ];

  token          = state.push('inline', '', 0);
  token.content  = content;
  token.map      = [ startLine, state.line ];
  token.children = [];

  token          = state.push('paragraph_close', 'p', -1);

  state.parentType = oldParentType;

  return true;
};


/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var normalizeReference   = __webpack_require__(0).normalizeReference;
var isSpace              = __webpack_require__(0).isSpace;


module.exports = function reference(state, startLine, _endLine, silent) {
  var ch,
      destEndPos,
      destEndLineNo,
      endLine,
      href,
      i,
      l,
      label,
      labelEnd,
      oldParentType,
      res,
      start,
      str,
      terminate,
      terminatorRules,
      title,
      lines = 0,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine],
      nextLine = startLine + 1;

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  if (state.src.charCodeAt(pos) !== 0x5B/* [ */) { return false; }

  // Simple check to quickly interrupt scan on [link](url) at the start of line.
  // Can be useful on practice: https://github.com/markdown-it/markdown-it/issues/54
  while (++pos < max) {
    if (state.src.charCodeAt(pos) === 0x5D /* ] */ &&
        state.src.charCodeAt(pos - 1) !== 0x5C/* \ */) {
      if (pos + 1 === max) { return false; }
      if (state.src.charCodeAt(pos + 1) !== 0x3A/* : */) { return false; }
      break;
    }
  }

  endLine = state.lineMax;

  // jump line-by-line until empty one or EOF
  terminatorRules = state.md.block.ruler.getRules('reference');

  oldParentType = state.parentType;
  state.parentType = 'reference';

  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue; }

    // Some tags can terminate paragraph without empty line.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }
  }

  str = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
  max = str.length;

  for (pos = 1; pos < max; pos++) {
    ch = str.charCodeAt(pos);
    if (ch === 0x5B /* [ */) {
      return false;
    } else if (ch === 0x5D /* ] */) {
      labelEnd = pos;
      break;
    } else if (ch === 0x0A /* \n */) {
      lines++;
    } else if (ch === 0x5C /* \ */) {
      pos++;
      if (pos < max && str.charCodeAt(pos) === 0x0A) {
        lines++;
      }
    }
  }

  if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 0x3A/* : */) { return false; }

  // [label]:   destination   'title'
  //         ^^^ skip optional whitespace here
  for (pos = labelEnd + 2; pos < max; pos++) {
    ch = str.charCodeAt(pos);
    if (ch === 0x0A) {
      lines++;
    } else if (isSpace(ch)) {
      /*eslint no-empty:0*/
    } else {
      break;
    }
  }

  // [label]:   destination   'title'
  //            ^^^^^^^^^^^ parse this
  res = state.md.helpers.parseLinkDestination(str, pos, max);
  if (!res.ok) { return false; }

  href = state.md.normalizeLink(res.str);
  if (!state.md.validateLink(href)) { return false; }

  pos = res.pos;
  lines += res.lines;

  // save cursor state, we could require to rollback later
  destEndPos = pos;
  destEndLineNo = lines;

  // [label]:   destination   'title'
  //                       ^^^ skipping those spaces
  start = pos;
  for (; pos < max; pos++) {
    ch = str.charCodeAt(pos);
    if (ch === 0x0A) {
      lines++;
    } else if (isSpace(ch)) {
      /*eslint no-empty:0*/
    } else {
      break;
    }
  }

  // [label]:   destination   'title'
  //                          ^^^^^^^ parse this
  res = state.md.helpers.parseLinkTitle(str, pos, max);
  if (pos < max && start !== pos && res.ok) {
    title = res.str;
    pos = res.pos;
    lines += res.lines;
  } else {
    title = '';
    pos = destEndPos;
    lines = destEndLineNo;
  }

  // skip trailing spaces until the rest of the line
  while (pos < max) {
    ch = str.charCodeAt(pos);
    if (!isSpace(ch)) { break; }
    pos++;
  }

  if (pos < max && str.charCodeAt(pos) !== 0x0A) {
    if (title) {
      // garbage at the end of the line after title,
      // but it could still be a valid reference if we roll back
      title = '';
      pos = destEndPos;
      lines = destEndLineNo;
      while (pos < max) {
        ch = str.charCodeAt(pos);
        if (!isSpace(ch)) { break; }
        pos++;
      }
    }
  }

  if (pos < max && str.charCodeAt(pos) !== 0x0A) {
    // garbage at the end of the line
    return false;
  }

  label = normalizeReference(str.slice(1, labelEnd));
  if (!label) {
    // CommonMark 0.20 disallows empty labels
    return false;
  }

  // Reference can not terminate anything. This check is for safety only.
  /*istanbul ignore if*/
  if (silent) { return true; }

  if (typeof state.env.references === 'undefined') {
    state.env.references = {};
  }
  if (typeof state.env.references[label] === 'undefined') {
    state.env.references[label] = { title: title, href: href };
  }

  state.parentType = oldParentType;

  state.line = startLine + lines + 1;
  return true;
};


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Parser state class



var Token = __webpack_require__(11);
var isSpace = __webpack_require__(0).isSpace;


function StateBlock(src, md, env, tokens) {
  var ch, s, start, pos, len, indent, offset, indent_found;

  this.src = src;

  // link to parser instance
  this.md     = md;

  this.env = env;

  //
  // Internal state vartiables
  //

  this.tokens = tokens;

  this.bMarks = [];  // line begin offsets for fast jumps
  this.eMarks = [];  // line end offsets for fast jumps
  this.tShift = [];  // offsets of the first non-space characters (tabs not expanded)
  this.sCount = [];  // indents for each line (tabs expanded)

  // An amount of virtual spaces (tabs expanded) between beginning
  // of each line (bMarks) and real beginning of that line.
  //
  // It exists only as a hack because blockquotes override bMarks
  // losing information in the process.
  //
  // It's used only when expanding tabs, you can think about it as
  // an initial tab length, e.g. bsCount=21 applied to string `\t123`
  // means first tab should be expanded to 4-21%4 === 3 spaces.
  //
  this.bsCount = [];

  // block parser variables
  this.blkIndent  = 0; // required block content indent
                       // (for example, if we are in list)
  this.line       = 0; // line index in src
  this.lineMax    = 0; // lines count
  this.tight      = false;  // loose/tight mode for lists
  this.ddIndent   = -1; // indent of the current dd block (-1 if there isn't any)

  // can be 'blockquote', 'list', 'root', 'paragraph' or 'reference'
  // used in lists to determine if they interrupt a paragraph
  this.parentType = 'root';

  this.level = 0;

  // renderer
  this.result = '';

  // Create caches
  // Generate markers.
  s = this.src;
  indent_found = false;

  for (start = pos = indent = offset = 0, len = s.length; pos < len; pos++) {
    ch = s.charCodeAt(pos);

    if (!indent_found) {
      if (isSpace(ch)) {
        indent++;

        if (ch === 0x09) {
          offset += 4 - offset % 4;
        } else {
          offset++;
        }
        continue;
      } else {
        indent_found = true;
      }
    }

    if (ch === 0x0A || pos === len - 1) {
      if (ch !== 0x0A) { pos++; }
      this.bMarks.push(start);
      this.eMarks.push(pos);
      this.tShift.push(indent);
      this.sCount.push(offset);
      this.bsCount.push(0);

      indent_found = false;
      indent = 0;
      offset = 0;
      start = pos + 1;
    }
  }

  // Push fake entry to simplify cache bounds checks
  this.bMarks.push(s.length);
  this.eMarks.push(s.length);
  this.tShift.push(0);
  this.sCount.push(0);
  this.bsCount.push(0);

  this.lineMax = this.bMarks.length - 1; // don't count last fake line
}

// Push new token to "stream".
//
StateBlock.prototype.push = function (type, tag, nesting) {
  var token = new Token(type, tag, nesting);
  token.block = true;

  if (nesting < 0) { this.level--; }
  token.level = this.level;
  if (nesting > 0) { this.level++; }

  this.tokens.push(token);
  return token;
};

StateBlock.prototype.isEmpty = function isEmpty(line) {
  return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
};

StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
  for (var max = this.lineMax; from < max; from++) {
    if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
      break;
    }
  }
  return from;
};

// Skip spaces from given position.
StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
  var ch;

  for (var max = this.src.length; pos < max; pos++) {
    ch = this.src.charCodeAt(pos);
    if (!isSpace(ch)) { break; }
  }
  return pos;
};

// Skip spaces from given position in reverse.
StateBlock.prototype.skipSpacesBack = function skipSpacesBack(pos, min) {
  if (pos <= min) { return pos; }

  while (pos > min) {
    if (!isSpace(this.src.charCodeAt(--pos))) { return pos + 1; }
  }
  return pos;
};

// Skip char codes from given position
StateBlock.prototype.skipChars = function skipChars(pos, code) {
  for (var max = this.src.length; pos < max; pos++) {
    if (this.src.charCodeAt(pos) !== code) { break; }
  }
  return pos;
};

// Skip char codes reverse from given position - 1
StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code, min) {
  if (pos <= min) { return pos; }

  while (pos > min) {
    if (code !== this.src.charCodeAt(--pos)) { return pos + 1; }
  }
  return pos;
};

// cut lines range from source.
StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
  var i, lineIndent, ch, first, last, queue, lineStart,
      line = begin;

  if (begin >= end) {
    return '';
  }

  queue = new Array(end - begin);

  for (i = 0; line < end; line++, i++) {
    lineIndent = 0;
    lineStart = first = this.bMarks[line];

    if (line + 1 < end || keepLastLF) {
      // No need for bounds check because we have fake entry on tail.
      last = this.eMarks[line] + 1;
    } else {
      last = this.eMarks[line];
    }

    while (first < last && lineIndent < indent) {
      ch = this.src.charCodeAt(first);

      if (isSpace(ch)) {
        if (ch === 0x09) {
          lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
        } else {
          lineIndent++;
        }
      } else if (first - lineStart < this.tShift[line]) {
        // patched tShift masked characters to look like spaces (blockquotes, list markers)
        lineIndent++;
      } else {
        break;
      }

      first++;
    }

    if (lineIndent > indent) {
      // partially expanding tabs in code blocks, e.g '\t\tfoobar'
      // with indent=2 becomes '  \tfoobar'
      queue[i] = new Array(lineIndent - indent + 1).join(' ') + this.src.slice(first, last);
    } else {
      queue[i] = this.src.slice(first, last);
    }
  }

  return queue.join('');
};

// re-export Token class to use in block rules
StateBlock.prototype.Token = Token;


module.exports = StateBlock;


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// GFM table, non-standard



var isSpace = __webpack_require__(0).isSpace;


function getLine(state, line) {
  var pos = state.bMarks[line] + state.blkIndent,
      max = state.eMarks[line];

  return state.src.substr(pos, max - pos);
}

function escapedSplit(str) {
  var result = [],
      pos = 0,
      max = str.length,
      ch,
      escapes = 0,
      lastPos = 0,
      backTicked = false,
      lastBackTick = 0;

  ch  = str.charCodeAt(pos);

  while (pos < max) {
    if (ch === 0x60/* ` */) {
      if (backTicked) {
        // make \` close code sequence, but not open it;
        // the reason is: `\` is correct code block
        backTicked = false;
        lastBackTick = pos;
      } else if (escapes % 2 === 0) {
        backTicked = true;
        lastBackTick = pos;
      }
    } else if (ch === 0x7c/* | */ && (escapes % 2 === 0) && !backTicked) {
      result.push(str.substring(lastPos, pos));
      lastPos = pos + 1;
    }

    if (ch === 0x5c/* \ */) {
      escapes++;
    } else {
      escapes = 0;
    }

    pos++;

    // If there was an un-closed backtick, go back to just after
    // the last backtick, but as if it was a normal character
    if (pos === max && backTicked) {
      backTicked = false;
      pos = lastBackTick + 1;
    }

    ch = str.charCodeAt(pos);
  }

  result.push(str.substring(lastPos));

  return result;
}


module.exports = function table(state, startLine, endLine, silent) {
  var ch, lineText, pos, i, nextLine, columns, columnCount, token,
      aligns, t, tableLines, tbodyLines;

  // should have at least two lines
  if (startLine + 2 > endLine) { return false; }

  nextLine = startLine + 1;

  if (state.sCount[nextLine] < state.blkIndent) { return false; }

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[nextLine] - state.blkIndent >= 4) { return false; }

  // first character of the second line should be '|', '-', ':',
  // and no other characters are allowed but spaces;
  // basically, this is the equivalent of /^[-:|][-:|\s]*$/ regexp

  pos = state.bMarks[nextLine] + state.tShift[nextLine];
  if (pos >= state.eMarks[nextLine]) { return false; }

  ch = state.src.charCodeAt(pos++);
  if (ch !== 0x7C/* | */ && ch !== 0x2D/* - */ && ch !== 0x3A/* : */) { return false; }

  while (pos < state.eMarks[nextLine]) {
    ch = state.src.charCodeAt(pos);

    if (ch !== 0x7C/* | */ && ch !== 0x2D/* - */ && ch !== 0x3A/* : */ && !isSpace(ch)) { return false; }

    pos++;
  }

  lineText = getLine(state, startLine + 1);

  columns = lineText.split('|');
  aligns = [];
  for (i = 0; i < columns.length; i++) {
    t = columns[i].trim();
    if (!t) {
      // allow empty columns before and after table, but not in between columns;
      // e.g. allow ` |---| `, disallow ` ---||--- `
      if (i === 0 || i === columns.length - 1) {
        continue;
      } else {
        return false;
      }
    }

    if (!/^:?-+:?$/.test(t)) { return false; }
    if (t.charCodeAt(t.length - 1) === 0x3A/* : */) {
      aligns.push(t.charCodeAt(0) === 0x3A/* : */ ? 'center' : 'right');
    } else if (t.charCodeAt(0) === 0x3A/* : */) {
      aligns.push('left');
    } else {
      aligns.push('');
    }
  }

  lineText = getLine(state, startLine).trim();
  if (lineText.indexOf('|') === -1) { return false; }
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }
  columns = escapedSplit(lineText.replace(/^\||\|$/g, ''));

  // header row will define an amount of columns in the entire table,
  // and align row shouldn't be smaller than that (the rest of the rows can)
  columnCount = columns.length;
  if (columnCount > aligns.length) { return false; }

  if (silent) { return true; }

  token     = state.push('table_open', 'table', 1);
  token.map = tableLines = [ startLine, 0 ];

  token     = state.push('thead_open', 'thead', 1);
  token.map = [ startLine, startLine + 1 ];

  token     = state.push('tr_open', 'tr', 1);
  token.map = [ startLine, startLine + 1 ];

  for (i = 0; i < columns.length; i++) {
    token          = state.push('th_open', 'th', 1);
    token.map      = [ startLine, startLine + 1 ];
    if (aligns[i]) {
      token.attrs  = [ [ 'style', 'text-align:' + aligns[i] ] ];
    }

    token          = state.push('inline', '', 0);
    token.content  = columns[i].trim();
    token.map      = [ startLine, startLine + 1 ];
    token.children = [];

    token          = state.push('th_close', 'th', -1);
  }

  token     = state.push('tr_close', 'tr', -1);
  token     = state.push('thead_close', 'thead', -1);

  token     = state.push('tbody_open', 'tbody', 1);
  token.map = tbodyLines = [ startLine + 2, 0 ];

  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
    if (state.sCount[nextLine] < state.blkIndent) { break; }

    lineText = getLine(state, nextLine).trim();
    if (lineText.indexOf('|') === -1) { break; }
    if (state.sCount[nextLine] - state.blkIndent >= 4) { break; }
    columns = escapedSplit(lineText.replace(/^\||\|$/g, ''));

    token = state.push('tr_open', 'tr', 1);
    for (i = 0; i < columnCount; i++) {
      token          = state.push('td_open', 'td', 1);
      if (aligns[i]) {
        token.attrs  = [ [ 'style', 'text-align:' + aligns[i] ] ];
      }

      token          = state.push('inline', '', 0);
      token.content  = columns[i] ? columns[i].trim() : '';
      token.children = [];

      token          = state.push('td_close', 'td', -1);
    }
    token = state.push('tr_close', 'tr', -1);
  }
  token = state.push('tbody_close', 'tbody', -1);
  token = state.push('table_close', 'table', -1);

  tableLines[1] = tbodyLines[1] = nextLine;
  state.line = nextLine;
  return true;
};


/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



module.exports = function block(state) {
  var token;

  if (state.inlineMode) {
    token          = new state.Token('inline', '', 0);
    token.content  = state.src;
    token.map      = [ 0, 1 ];
    token.children = [];
    state.tokens.push(token);
  } else {
    state.md.block.parse(state.src, state.md, state.env, state.tokens);
  }
};


/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function inline(state) {
  var tokens = state.tokens, tok, i, l;

  // Parse inlines
  for (i = 0, l = tokens.length; i < l; i++) {
    tok = tokens[i];
    if (tok.type === 'inline') {
      state.md.inline.parse(tok.content, state.md, state.env, tok.children);
    }
  }
};


/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Replace link-like texts with link nodes.
//
// Currently restricted by `md.validateLink()` to http/https/ftp
//



var arrayReplaceAt = __webpack_require__(0).arrayReplaceAt;


function isLinkOpen(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose(str) {
  return /^<\/a\s*>/i.test(str);
}


module.exports = function linkify(state) {
  var i, j, l, tokens, token, currentToken, nodes, ln, text, pos, lastPos,
      level, htmlLinkLevel, url, fullUrl, urlText,
      blockTokens = state.tokens,
      links;

  if (!state.md.options.linkify) { return; }

  for (j = 0, l = blockTokens.length; j < l; j++) {
    if (blockTokens[j].type !== 'inline' ||
        !state.md.linkify.pretest(blockTokens[j].content)) {
      continue;
    }

    tokens = blockTokens[j].children;

    htmlLinkLevel = 0;

    // We scan from the end, to keep position when new tags added.
    // Use reversed logic in links start/end match
    for (i = tokens.length - 1; i >= 0; i--) {
      currentToken = tokens[i];

      // Skip content of markdown links
      if (currentToken.type === 'link_close') {
        i--;
        while (tokens[i].level !== currentToken.level && tokens[i].type !== 'link_open') {
          i--;
        }
        continue;
      }

      // Skip content of html tag links
      if (currentToken.type === 'html_inline') {
        if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
          htmlLinkLevel--;
        }
        if (isLinkClose(currentToken.content)) {
          htmlLinkLevel++;
        }
      }
      if (htmlLinkLevel > 0) { continue; }

      if (currentToken.type === 'text' && state.md.linkify.test(currentToken.content)) {

        text = currentToken.content;
        links = state.md.linkify.match(text);

        // Now split string to nodes
        nodes = [];
        level = currentToken.level;
        lastPos = 0;

        for (ln = 0; ln < links.length; ln++) {

          url = links[ln].url;
          fullUrl = state.md.normalizeLink(url);
          if (!state.md.validateLink(fullUrl)) { continue; }

          urlText = links[ln].text;

          // Linkifier might send raw hostnames like "example.com", where url
          // starts with domain name. So we prepend http:// in those cases,
          // and remove it afterwards.
          //
          if (!links[ln].schema) {
            urlText = state.md.normalizeLinkText('http://' + urlText).replace(/^http:\/\//, '');
          } else if (links[ln].schema === 'mailto:' && !/^mailto:/i.test(urlText)) {
            urlText = state.md.normalizeLinkText('mailto:' + urlText).replace(/^mailto:/, '');
          } else {
            urlText = state.md.normalizeLinkText(urlText);
          }

          pos = links[ln].index;

          if (pos > lastPos) {
            token         = new state.Token('text', '', 0);
            token.content = text.slice(lastPos, pos);
            token.level   = level;
            nodes.push(token);
          }

          token         = new state.Token('link_open', 'a', 1);
          token.attrs   = [ [ 'href', fullUrl ] ];
          token.level   = level++;
          token.markup  = 'linkify';
          token.info    = 'auto';
          nodes.push(token);

          token         = new state.Token('text', '', 0);
          token.content = urlText;
          token.level   = level;
          nodes.push(token);

          token         = new state.Token('link_close', 'a', -1);
          token.level   = --level;
          token.markup  = 'linkify';
          token.info    = 'auto';
          nodes.push(token);

          lastPos = links[ln].lastIndex;
        }
        if (lastPos < text.length) {
          token         = new state.Token('text', '', 0);
          token.content = text.slice(lastPos);
          token.level   = level;
          nodes.push(token);
        }

        // replace current node
        blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
      }
    }
  }
};


/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Normalize input string




var NEWLINES_RE  = /\r[\n\u0085]?|[\u2424\u2028\u0085]/g;
var NULL_RE      = /\u0000/g;


module.exports = function inline(state) {
  var str;

  // Normalize newlines
  str = state.src.replace(NEWLINES_RE, '\n');

  // Replace NULL characters
  str = str.replace(NULL_RE, '\uFFFD');

  state.src = str;
};


/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Simple typographyc replacements
//
// (c) (C) → ©
// (tm) (TM) → ™
// (r) (R) → ®
// +- → ±
// (p) (P) -> §
// ... → … (also ?.... → ?.., !.... → !..)
// ???????? → ???, !!!!! → !!!, `,,` → `,`
// -- → &ndash;, --- → &mdash;
//


// TODO:
// - fractionals 1/2, 1/4, 3/4 -> ½, ¼, ¾
// - miltiplication 2 x 4 -> 2 × 4

var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;

// Workaround for phantomjs - need regex without /g flag,
// or root check will fail every second time
var SCOPED_ABBR_TEST_RE = /\((c|tm|r|p)\)/i;

var SCOPED_ABBR_RE = /\((c|tm|r|p)\)/ig;
var SCOPED_ABBR = {
  c: '©',
  r: '®',
  p: '§',
  tm: '™'
};

function replaceFn(match, name) {
  return SCOPED_ABBR[name.toLowerCase()];
}

function replace_scoped(inlineTokens) {
  var i, token, inside_autolink = 0;

  for (i = inlineTokens.length - 1; i >= 0; i--) {
    token = inlineTokens[i];

    if (token.type === 'text' && !inside_autolink) {
      token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
    }

    if (token.type === 'link_open' && token.info === 'auto') {
      inside_autolink--;
    }

    if (token.type === 'link_close' && token.info === 'auto') {
      inside_autolink++;
    }
  }
}

function replace_rare(inlineTokens) {
  var i, token, inside_autolink = 0;

  for (i = inlineTokens.length - 1; i >= 0; i--) {
    token = inlineTokens[i];

    if (token.type === 'text' && !inside_autolink) {
      if (RARE_RE.test(token.content)) {
        token.content = token.content
                    .replace(/\+-/g, '±')
                    // .., ..., ....... -> …
                    // but ?..... & !..... -> ?.. & !..
                    .replace(/\.{2,}/g, '…').replace(/([?!])…/g, '$1..')
                    .replace(/([?!]){4,}/g, '$1$1$1').replace(/,{2,}/g, ',')
                    // em-dash
                    .replace(/(^|[^-])---([^-]|$)/mg, '$1\u2014$2')
                    // en-dash
                    .replace(/(^|\s)--(\s|$)/mg, '$1\u2013$2')
                    .replace(/(^|[^-\s])--([^-\s]|$)/mg, '$1\u2013$2');
      }
    }

    if (token.type === 'link_open' && token.info === 'auto') {
      inside_autolink--;
    }

    if (token.type === 'link_close' && token.info === 'auto') {
      inside_autolink++;
    }
  }
}


module.exports = function replace(state) {
  var blkIdx;

  if (!state.md.options.typographer) { return; }

  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

    if (state.tokens[blkIdx].type !== 'inline') { continue; }

    if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) {
      replace_scoped(state.tokens[blkIdx].children);
    }

    if (RARE_RE.test(state.tokens[blkIdx].content)) {
      replace_rare(state.tokens[blkIdx].children);
    }

  }
};


/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Convert straight quotation marks to typographic ones
//



var isWhiteSpace   = __webpack_require__(0).isWhiteSpace;
var isPunctChar    = __webpack_require__(0).isPunctChar;
var isMdAsciiPunct = __webpack_require__(0).isMdAsciiPunct;

var QUOTE_TEST_RE = /['"]/;
var QUOTE_RE = /['"]/g;
var APOSTROPHE = '\u2019'; /* ’ */


function replaceAt(str, index, ch) {
  return str.substr(0, index) + ch + str.substr(index + 1);
}

function process_inlines(tokens, state) {
  var i, token, text, t, pos, max, thisLevel, item, lastChar, nextChar,
      isLastPunctChar, isNextPunctChar, isLastWhiteSpace, isNextWhiteSpace,
      canOpen, canClose, j, isSingle, stack, openQuote, closeQuote;

  stack = [];

  for (i = 0; i < tokens.length; i++) {
    token = tokens[i];

    thisLevel = tokens[i].level;

    for (j = stack.length - 1; j >= 0; j--) {
      if (stack[j].level <= thisLevel) { break; }
    }
    stack.length = j + 1;

    if (token.type !== 'text') { continue; }

    text = token.content;
    pos = 0;
    max = text.length;

    /*eslint no-labels:0,block-scoped-var:0*/
    OUTER:
    while (pos < max) {
      QUOTE_RE.lastIndex = pos;
      t = QUOTE_RE.exec(text);
      if (!t) { break; }

      canOpen = canClose = true;
      pos = t.index + 1;
      isSingle = (t[0] === "'");

      // Find previous character,
      // default to space if it's the beginning of the line
      //
      lastChar = 0x20;

      if (t.index - 1 >= 0) {
        lastChar = text.charCodeAt(t.index - 1);
      } else {
        for (j = i - 1; j >= 0; j--) {
          if (tokens[j].type !== 'text') { continue; }

          lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
          break;
        }
      }

      // Find next character,
      // default to space if it's the end of the line
      //
      nextChar = 0x20;

      if (pos < max) {
        nextChar = text.charCodeAt(pos);
      } else {
        for (j = i + 1; j < tokens.length; j++) {
          if (tokens[j].type !== 'text') { continue; }

          nextChar = tokens[j].content.charCodeAt(0);
          break;
        }
      }

      isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
      isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

      isLastWhiteSpace = isWhiteSpace(lastChar);
      isNextWhiteSpace = isWhiteSpace(nextChar);

      if (isNextWhiteSpace) {
        canOpen = false;
      } else if (isNextPunctChar) {
        if (!(isLastWhiteSpace || isLastPunctChar)) {
          canOpen = false;
        }
      }

      if (isLastWhiteSpace) {
        canClose = false;
      } else if (isLastPunctChar) {
        if (!(isNextWhiteSpace || isNextPunctChar)) {
          canClose = false;
        }
      }

      if (nextChar === 0x22 /* " */ && t[0] === '"') {
        if (lastChar >= 0x30 /* 0 */ && lastChar <= 0x39 /* 9 */) {
          // special case: 1"" - count first quote as an inch
          canClose = canOpen = false;
        }
      }

      if (canOpen && canClose) {
        // treat this as the middle of the word
        canOpen = false;
        canClose = isNextPunctChar;
      }

      if (!canOpen && !canClose) {
        // middle of word
        if (isSingle) {
          token.content = replaceAt(token.content, t.index, APOSTROPHE);
        }
        continue;
      }

      if (canClose) {
        // this could be a closing quote, rewind the stack to get a match
        for (j = stack.length - 1; j >= 0; j--) {
          item = stack[j];
          if (stack[j].level < thisLevel) { break; }
          if (item.single === isSingle && stack[j].level === thisLevel) {
            item = stack[j];

            if (isSingle) {
              openQuote = state.md.options.quotes[2];
              closeQuote = state.md.options.quotes[3];
            } else {
              openQuote = state.md.options.quotes[0];
              closeQuote = state.md.options.quotes[1];
            }

            // replace token.content *before* tokens[item.token].content,
            // because, if they are pointing at the same token, replaceAt
            // could mess up indices when quote length != 1
            token.content = replaceAt(token.content, t.index, closeQuote);
            tokens[item.token].content = replaceAt(
              tokens[item.token].content, item.pos, openQuote);

            pos += closeQuote.length - 1;
            if (item.token === i) { pos += openQuote.length - 1; }

            text = token.content;
            max = text.length;

            stack.length = j;
            continue OUTER;
          }
        }
      }

      if (canOpen) {
        stack.push({
          token: i,
          pos: t.index,
          single: isSingle,
          level: thisLevel
        });
      } else if (canClose && isSingle) {
        token.content = replaceAt(token.content, t.index, APOSTROPHE);
      }
    }
  }
}


module.exports = function smartquotes(state) {
  /*eslint max-depth:0*/
  var blkIdx;

  if (!state.md.options.typographer) { return; }

  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

    if (state.tokens[blkIdx].type !== 'inline' ||
        !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) {
      continue;
    }

    process_inlines(state.tokens[blkIdx].children, state);
  }
};


/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Core state object
//


var Token = __webpack_require__(11);


function StateCore(src, md, env) {
  this.src = src;
  this.env = env;
  this.tokens = [];
  this.inlineMode = false;
  this.md = md; // link to parser instance
}

// re-export Token class to use in core rules
StateCore.prototype.Token = Token;


module.exports = StateCore;


/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process autolinks '<protocol:...>'




/*eslint max-len:0*/
var EMAIL_RE    = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/;
var AUTOLINK_RE = /^<([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)>/;


module.exports = function autolink(state, silent) {
  var tail, linkMatch, emailMatch, url, fullUrl, token,
      pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  tail = state.src.slice(pos);

  if (tail.indexOf('>') < 0) { return false; }

  if (AUTOLINK_RE.test(tail)) {
    linkMatch = tail.match(AUTOLINK_RE);

    url = linkMatch[0].slice(1, -1);
    fullUrl = state.md.normalizeLink(url);
    if (!state.md.validateLink(fullUrl)) { return false; }

    if (!silent) {
      token         = state.push('link_open', 'a', 1);
      token.attrs   = [ [ 'href', fullUrl ] ];
      token.markup  = 'autolink';
      token.info    = 'auto';

      token         = state.push('text', '', 0);
      token.content = state.md.normalizeLinkText(url);

      token         = state.push('link_close', 'a', -1);
      token.markup  = 'autolink';
      token.info    = 'auto';
    }

    state.pos += linkMatch[0].length;
    return true;
  }

  if (EMAIL_RE.test(tail)) {
    emailMatch = tail.match(EMAIL_RE);

    url = emailMatch[0].slice(1, -1);
    fullUrl = state.md.normalizeLink('mailto:' + url);
    if (!state.md.validateLink(fullUrl)) { return false; }

    if (!silent) {
      token         = state.push('link_open', 'a', 1);
      token.attrs   = [ [ 'href', fullUrl ] ];
      token.markup  = 'autolink';
      token.info    = 'auto';

      token         = state.push('text', '', 0);
      token.content = state.md.normalizeLinkText(url);

      token         = state.push('link_close', 'a', -1);
      token.markup  = 'autolink';
      token.info    = 'auto';
    }

    state.pos += emailMatch[0].length;
    return true;
  }

  return false;
};


/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Parse backticks



module.exports = function backtick(state, silent) {
  var start, max, marker, matchStart, matchEnd, token,
      pos = state.pos,
      ch = state.src.charCodeAt(pos);

  if (ch !== 0x60/* ` */) { return false; }

  start = pos;
  pos++;
  max = state.posMax;

  while (pos < max && state.src.charCodeAt(pos) === 0x60/* ` */) { pos++; }

  marker = state.src.slice(start, pos);

  matchStart = matchEnd = pos;

  while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1) {
    matchEnd = matchStart + 1;

    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60/* ` */) { matchEnd++; }

    if (matchEnd - matchStart === marker.length) {
      if (!silent) {
        token         = state.push('code_inline', 'code', 0);
        token.markup  = marker;
        token.content = state.src.slice(pos, matchStart)
                                 .replace(/[ \n]+/g, ' ')
                                 .trim();
      }
      state.pos = matchEnd;
      return true;
    }
  }

  if (!silent) { state.pending += marker; }
  state.pos += marker.length;
  return true;
};


/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// For each opening emphasis-like marker find a matching closing one
//



module.exports = function link_pairs(state) {
  var i, j, lastDelim, currDelim,
      delimiters = state.delimiters,
      max = state.delimiters.length;

  for (i = 0; i < max; i++) {
    lastDelim = delimiters[i];

    if (!lastDelim.close) { continue; }

    j = i - lastDelim.jump - 1;

    while (j >= 0) {
      currDelim = delimiters[j];

      if (currDelim.open &&
          currDelim.marker === lastDelim.marker &&
          currDelim.end < 0 &&
          currDelim.level === lastDelim.level) {

        // typeofs are for backward compatibility with plugins
        var odd_match = (currDelim.close || lastDelim.open) &&
                        typeof currDelim.length !== 'undefined' &&
                        typeof lastDelim.length !== 'undefined' &&
                        (currDelim.length + lastDelim.length) % 3 === 0;

        if (!odd_match) {
          lastDelim.jump = i - j;
          lastDelim.open = false;
          currDelim.end  = i;
          currDelim.jump = 0;
          break;
        }
      }

      j -= currDelim.jump + 1;
    }
  }
};


/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process html entity - &#123;, &#xAF;, &quot;, ...



var entities          = __webpack_require__(17);
var has               = __webpack_require__(0).has;
var isValidEntityCode = __webpack_require__(0).isValidEntityCode;
var fromCodePoint     = __webpack_require__(0).fromCodePoint;


var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,8}|[0-9]{1,8}));/i;
var NAMED_RE   = /^&([a-z][a-z0-9]{1,31});/i;


module.exports = function entity(state, silent) {
  var ch, code, match, pos = state.pos, max = state.posMax;

  if (state.src.charCodeAt(pos) !== 0x26/* & */) { return false; }

  if (pos + 1 < max) {
    ch = state.src.charCodeAt(pos + 1);

    if (ch === 0x23 /* # */) {
      match = state.src.slice(pos).match(DIGITAL_RE);
      if (match) {
        if (!silent) {
          code = match[1][0].toLowerCase() === 'x' ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
          state.pending += isValidEntityCode(code) ? fromCodePoint(code) : fromCodePoint(0xFFFD);
        }
        state.pos += match[0].length;
        return true;
      }
    } else {
      match = state.src.slice(pos).match(NAMED_RE);
      if (match) {
        if (has(entities, match[1])) {
          if (!silent) { state.pending += entities[match[1]]; }
          state.pos += match[0].length;
          return true;
        }
      }
    }
  }

  if (!silent) { state.pending += '&'; }
  state.pos++;
  return true;
};


/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Proceess escaped chars and hardbreaks



var isSpace = __webpack_require__(0).isSpace;

var ESCAPED = [];

for (var i = 0; i < 256; i++) { ESCAPED.push(0); }

'\\!"#$%&\'()*+,./:;<=>?@[]^_`{|}~-'
  .split('').forEach(function (ch) { ESCAPED[ch.charCodeAt(0)] = 1; });


module.exports = function escape(state, silent) {
  var ch, pos = state.pos, max = state.posMax;

  if (state.src.charCodeAt(pos) !== 0x5C/* \ */) { return false; }

  pos++;

  if (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (ch < 256 && ESCAPED[ch] !== 0) {
      if (!silent) { state.pending += state.src[pos]; }
      state.pos += 2;
      return true;
    }

    if (ch === 0x0A) {
      if (!silent) {
        state.push('hardbreak', 'br', 0);
      }

      pos++;
      // skip leading whitespaces from next line
      while (pos < max) {
        ch = state.src.charCodeAt(pos);
        if (!isSpace(ch)) { break; }
        pos++;
      }

      state.pos = pos;
      return true;
    }
  }

  if (!silent) { state.pending += '\\'; }
  state.pos++;
  return true;
};


/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process html tags




var HTML_TAG_RE = __webpack_require__(18).HTML_TAG_RE;


function isLetter(ch) {
  /*eslint no-bitwise:0*/
  var lc = ch | 0x20; // to lower case
  return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */);
}


module.exports = function html_inline(state, silent) {
  var ch, match, max, token,
      pos = state.pos;

  if (!state.md.options.html) { return false; }

  // Check start
  max = state.posMax;
  if (state.src.charCodeAt(pos) !== 0x3C/* < */ ||
      pos + 2 >= max) {
    return false;
  }

  // Quick fail on second char
  ch = state.src.charCodeAt(pos + 1);
  if (ch !== 0x21/* ! */ &&
      ch !== 0x3F/* ? */ &&
      ch !== 0x2F/* / */ &&
      !isLetter(ch)) {
    return false;
  }

  match = state.src.slice(pos).match(HTML_TAG_RE);
  if (!match) { return false; }

  if (!silent) {
    token         = state.push('html_inline', '', 0);
    token.content = state.src.slice(pos, pos + match[0].length);
  }
  state.pos += match[0].length;
  return true;
};


/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process ![image](<src> "title")



var normalizeReference   = __webpack_require__(0).normalizeReference;
var isSpace              = __webpack_require__(0).isSpace;


module.exports = function image(state, silent) {
  var attrs,
      code,
      content,
      label,
      labelEnd,
      labelStart,
      pos,
      ref,
      res,
      title,
      token,
      tokens,
      start,
      href = '',
      oldPos = state.pos,
      max = state.posMax;

  if (state.src.charCodeAt(state.pos) !== 0x21/* ! */) { return false; }
  if (state.src.charCodeAt(state.pos + 1) !== 0x5B/* [ */) { return false; }

  labelStart = state.pos + 2;
  labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);

  // parser failed to find ']', so it's not a valid link
  if (labelEnd < 0) { return false; }

  pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {
    //
    // Inline link
    //

    // [link](  <href>  "title"  )
    //        ^^ skipping these spaces
    pos++;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (!isSpace(code) && code !== 0x0A) { break; }
    }
    if (pos >= max) { return false; }

    // [link](  <href>  "title"  )
    //          ^^^^^^ parsing link destination
    start = pos;
    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
    if (res.ok) {
      href = state.md.normalizeLink(res.str);
      if (state.md.validateLink(href)) {
        pos = res.pos;
      } else {
        href = '';
      }
    }

    // [link](  <href>  "title"  )
    //                ^^ skipping these spaces
    start = pos;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (!isSpace(code) && code !== 0x0A) { break; }
    }

    // [link](  <href>  "title"  )
    //                  ^^^^^^^ parsing link title
    res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
    if (pos < max && start !== pos && res.ok) {
      title = res.str;
      pos = res.pos;

      // [link](  <href>  "title"  )
      //                         ^^ skipping these spaces
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos);
        if (!isSpace(code) && code !== 0x0A) { break; }
      }
    } else {
      title = '';
    }

    if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
      state.pos = oldPos;
      return false;
    }
    pos++;
  } else {
    //
    // Link reference
    //
    if (typeof state.env.references === 'undefined') { return false; }

    if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
      start = pos + 1;
      pos = state.md.helpers.parseLinkLabel(state, pos);
      if (pos >= 0) {
        label = state.src.slice(start, pos++);
      } else {
        pos = labelEnd + 1;
      }
    } else {
      pos = labelEnd + 1;
    }

    // covers label === '' and label === undefined
    // (collapsed reference link and shortcut reference link respectively)
    if (!label) { label = state.src.slice(labelStart, labelEnd); }

    ref = state.env.references[normalizeReference(label)];
    if (!ref) {
      state.pos = oldPos;
      return false;
    }
    href = ref.href;
    title = ref.title;
  }

  //
  // We found the end of the link, and know for a fact it's a valid link;
  // so all that's left to do is to call tokenizer.
  //
  if (!silent) {
    content = state.src.slice(labelStart, labelEnd);

    state.md.inline.parse(
      content,
      state.md,
      state.env,
      tokens = []
    );

    token          = state.push('image', 'img', 0);
    token.attrs    = attrs = [ [ 'src', href ], [ 'alt', '' ] ];
    token.children = tokens;
    token.content  = content;

    if (title) {
      attrs.push([ 'title', title ]);
    }
  }

  state.pos = pos;
  state.posMax = max;
  return true;
};


/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process [link](<to> "stuff")



var normalizeReference   = __webpack_require__(0).normalizeReference;
var isSpace              = __webpack_require__(0).isSpace;


module.exports = function link(state, silent) {
  var attrs,
      code,
      label,
      labelEnd,
      labelStart,
      pos,
      res,
      ref,
      title,
      token,
      href = '',
      oldPos = state.pos,
      max = state.posMax,
      start = state.pos,
      parseReference = true;

  if (state.src.charCodeAt(state.pos) !== 0x5B/* [ */) { return false; }

  labelStart = state.pos + 1;
  labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);

  // parser failed to find ']', so it's not a valid link
  if (labelEnd < 0) { return false; }

  pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {
    //
    // Inline link
    //

    // might have found a valid shortcut link, disable reference parsing
    parseReference = false;

    // [link](  <href>  "title"  )
    //        ^^ skipping these spaces
    pos++;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (!isSpace(code) && code !== 0x0A) { break; }
    }
    if (pos >= max) { return false; }

    // [link](  <href>  "title"  )
    //          ^^^^^^ parsing link destination
    start = pos;
    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
    if (res.ok) {
      href = state.md.normalizeLink(res.str);
      if (state.md.validateLink(href)) {
        pos = res.pos;
      } else {
        href = '';
      }
    }

    // [link](  <href>  "title"  )
    //                ^^ skipping these spaces
    start = pos;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (!isSpace(code) && code !== 0x0A) { break; }
    }

    // [link](  <href>  "title"  )
    //                  ^^^^^^^ parsing link title
    res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
    if (pos < max && start !== pos && res.ok) {
      title = res.str;
      pos = res.pos;

      // [link](  <href>  "title"  )
      //                         ^^ skipping these spaces
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos);
        if (!isSpace(code) && code !== 0x0A) { break; }
      }
    } else {
      title = '';
    }

    if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
      // parsing a valid shortcut link failed, fallback to reference
      parseReference = true;
    }
    pos++;
  }

  if (parseReference) {
    //
    // Link reference
    //
    if (typeof state.env.references === 'undefined') { return false; }

    if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
      start = pos + 1;
      pos = state.md.helpers.parseLinkLabel(state, pos);
      if (pos >= 0) {
        label = state.src.slice(start, pos++);
      } else {
        pos = labelEnd + 1;
      }
    } else {
      pos = labelEnd + 1;
    }

    // covers label === '' and label === undefined
    // (collapsed reference link and shortcut reference link respectively)
    if (!label) { label = state.src.slice(labelStart, labelEnd); }

    ref = state.env.references[normalizeReference(label)];
    if (!ref) {
      state.pos = oldPos;
      return false;
    }
    href = ref.href;
    title = ref.title;
  }

  //
  // We found the end of the link, and know for a fact it's a valid link;
  // so all that's left to do is to call tokenizer.
  //
  if (!silent) {
    state.pos = labelStart;
    state.posMax = labelEnd;

    token        = state.push('link_open', 'a', 1);
    token.attrs  = attrs = [ [ 'href', href ] ];
    if (title) {
      attrs.push([ 'title', title ]);
    }

    state.md.inline.tokenize(state);

    token        = state.push('link_close', 'a', -1);
  }

  state.pos = pos;
  state.posMax = max;
  return true;
};


/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Proceess '\n'



var isSpace = __webpack_require__(0).isSpace;


module.exports = function newline(state, silent) {
  var pmax, max, pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x0A/* \n */) { return false; }

  pmax = state.pending.length - 1;
  max = state.posMax;

  // '  \n' -> hardbreak
  // Lookup in pending chars is bad practice! Don't copy to other rules!
  // Pending string is stored in concat mode, indexed lookups will cause
  // convertion to flat mode.
  if (!silent) {
    if (pmax >= 0 && state.pending.charCodeAt(pmax) === 0x20) {
      if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 0x20) {
        state.pending = state.pending.replace(/ +$/, '');
        state.push('hardbreak', 'br', 0);
      } else {
        state.pending = state.pending.slice(0, -1);
        state.push('softbreak', 'br', 0);
      }

    } else {
      state.push('softbreak', 'br', 0);
    }
  }

  pos++;

  // skip heading spaces for next line
  while (pos < max && isSpace(state.src.charCodeAt(pos))) { pos++; }

  state.pos = pos;
  return true;
};


/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Inline parser state




var Token          = __webpack_require__(11);
var isWhiteSpace   = __webpack_require__(0).isWhiteSpace;
var isPunctChar    = __webpack_require__(0).isPunctChar;
var isMdAsciiPunct = __webpack_require__(0).isMdAsciiPunct;


function StateInline(src, md, env, outTokens) {
  this.src = src;
  this.env = env;
  this.md = md;
  this.tokens = outTokens;

  this.pos = 0;
  this.posMax = this.src.length;
  this.level = 0;
  this.pending = '';
  this.pendingLevel = 0;

  this.cache = {};        // Stores { start: end } pairs. Useful for backtrack
                          // optimization of pairs parse (emphasis, strikes).

  this.delimiters = [];   // Emphasis-like delimiters
}


// Flush pending text
//
StateInline.prototype.pushPending = function () {
  var token = new Token('text', '', 0);
  token.content = this.pending;
  token.level = this.pendingLevel;
  this.tokens.push(token);
  this.pending = '';
  return token;
};


// Push new token to "stream".
// If pending text exists - flush it as text token
//
StateInline.prototype.push = function (type, tag, nesting) {
  if (this.pending) {
    this.pushPending();
  }

  var token = new Token(type, tag, nesting);

  if (nesting < 0) { this.level--; }
  token.level = this.level;
  if (nesting > 0) { this.level++; }

  this.pendingLevel = this.level;
  this.tokens.push(token);
  return token;
};


// Scan a sequence of emphasis-like markers, and determine whether
// it can start an emphasis sequence or end an emphasis sequence.
//
//  - start - position to scan from (it should point at a valid marker);
//  - canSplitWord - determine if these markers can be found inside a word
//
StateInline.prototype.scanDelims = function (start, canSplitWord) {
  var pos = start, lastChar, nextChar, count, can_open, can_close,
      isLastWhiteSpace, isLastPunctChar,
      isNextWhiteSpace, isNextPunctChar,
      left_flanking = true,
      right_flanking = true,
      max = this.posMax,
      marker = this.src.charCodeAt(start);

  // treat beginning of the line as a whitespace
  lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 0x20;

  while (pos < max && this.src.charCodeAt(pos) === marker) { pos++; }

  count = pos - start;

  // treat end of the line as a whitespace
  nextChar = pos < max ? this.src.charCodeAt(pos) : 0x20;

  isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
  isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

  isLastWhiteSpace = isWhiteSpace(lastChar);
  isNextWhiteSpace = isWhiteSpace(nextChar);

  if (isNextWhiteSpace) {
    left_flanking = false;
  } else if (isNextPunctChar) {
    if (!(isLastWhiteSpace || isLastPunctChar)) {
      left_flanking = false;
    }
  }

  if (isLastWhiteSpace) {
    right_flanking = false;
  } else if (isLastPunctChar) {
    if (!(isNextWhiteSpace || isNextPunctChar)) {
      right_flanking = false;
    }
  }

  if (!canSplitWord) {
    can_open  = left_flanking  && (!right_flanking || isLastPunctChar);
    can_close = right_flanking && (!left_flanking  || isNextPunctChar);
  } else {
    can_open  = left_flanking;
    can_close = right_flanking;
  }

  return {
    can_open:  can_open,
    can_close: can_close,
    length:    count
  };
};


// re-export Token class to use in block rules
StateInline.prototype.Token = Token;


module.exports = StateInline;


/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Skip text characters for text token, place those to pending buffer
// and increment current pos




// Rule to skip pure text
// '{}$%@~+=:' reserved for extentions

// !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~

// !!!! Don't confuse with "Markdown ASCII Punctuation" chars
// http://spec.commonmark.org/0.15/#ascii-punctuation-character
function isTerminatorChar(ch) {
  switch (ch) {
    case 0x0A/* \n */:
    case 0x21/* ! */:
    case 0x23/* # */:
    case 0x24/* $ */:
    case 0x25/* % */:
    case 0x26/* & */:
    case 0x2A/* * */:
    case 0x2B/* + */:
    case 0x2D/* - */:
    case 0x3A/* : */:
    case 0x3C/* < */:
    case 0x3D/* = */:
    case 0x3E/* > */:
    case 0x40/* @ */:
    case 0x5B/* [ */:
    case 0x5C/* \ */:
    case 0x5D/* ] */:
    case 0x5E/* ^ */:
    case 0x5F/* _ */:
    case 0x60/* ` */:
    case 0x7B/* { */:
    case 0x7D/* } */:
    case 0x7E/* ~ */:
      return true;
    default:
      return false;
  }
}

module.exports = function text(state, silent) {
  var pos = state.pos;

  while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
    pos++;
  }

  if (pos === state.pos) { return false; }

  if (!silent) { state.pending += state.src.slice(state.pos, pos); }

  state.pos = pos;

  return true;
};

// Alternative implementation, for memory.
//
// It costs 10% of performance, but allows extend terminators list, if place it
// to `ParcerInline` property. Probably, will switch to it sometime, such
// flexibility required.

/*
var TERMINATOR_RE = /[\n!#$%&*+\-:<=>@[\\\]^_`{}~]/;

module.exports = function text(state, silent) {
  var pos = state.pos,
      idx = state.src.slice(pos).search(TERMINATOR_RE);

  // first char is terminator -> empty text
  if (idx === 0) { return false; }

  // no terminator -> text till end of string
  if (idx < 0) {
    if (!silent) { state.pending += state.src.slice(pos); }
    state.pos = state.src.length;
    return true;
  }

  if (!silent) { state.pending += state.src.slice(pos, pos + idx); }

  state.pos += idx;

  return true;
};*/


/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Merge adjacent text nodes into one, and re-calculate all token levels
//



module.exports = function text_collapse(state) {
  var curr, last,
      level = 0,
      tokens = state.tokens,
      max = state.tokens.length;

  for (curr = last = 0; curr < max; curr++) {
    // re-calculate levels
    level += tokens[curr].nesting;
    tokens[curr].level = level;

    if (tokens[curr].type === 'text' &&
        curr + 1 < max &&
        tokens[curr + 1].type === 'text') {

      // collapse two adjacent text nodes
      tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
    } else {
      if (curr !== last) { tokens[last] = tokens[curr]; }

      last++;
    }
  }

  if (curr !== last) {
    tokens.length = last;
  }
};


/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




/* eslint-disable no-bitwise */

var decodeCache = {};

function getDecodeCache(exclude) {
  var i, ch, cache = decodeCache[exclude];
  if (cache) { return cache; }

  cache = decodeCache[exclude] = [];

  for (i = 0; i < 128; i++) {
    ch = String.fromCharCode(i);
    cache.push(ch);
  }

  for (i = 0; i < exclude.length; i++) {
    ch = exclude.charCodeAt(i);
    cache[ch] = '%' + ('0' + ch.toString(16).toUpperCase()).slice(-2);
  }

  return cache;
}


// Decode percent-encoded string.
//
function decode(string, exclude) {
  var cache;

  if (typeof exclude !== 'string') {
    exclude = decode.defaultChars;
  }

  cache = getDecodeCache(exclude);

  return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
    var i, l, b1, b2, b3, b4, chr,
        result = '';

    for (i = 0, l = seq.length; i < l; i += 3) {
      b1 = parseInt(seq.slice(i + 1, i + 3), 16);

      if (b1 < 0x80) {
        result += cache[b1];
        continue;
      }

      if ((b1 & 0xE0) === 0xC0 && (i + 3 < l)) {
        // 110xxxxx 10xxxxxx
        b2 = parseInt(seq.slice(i + 4, i + 6), 16);

        if ((b2 & 0xC0) === 0x80) {
          chr = ((b1 << 6) & 0x7C0) | (b2 & 0x3F);

          if (chr < 0x80) {
            result += '\ufffd\ufffd';
          } else {
            result += String.fromCharCode(chr);
          }

          i += 3;
          continue;
        }
      }

      if ((b1 & 0xF0) === 0xE0 && (i + 6 < l)) {
        // 1110xxxx 10xxxxxx 10xxxxxx
        b2 = parseInt(seq.slice(i + 4, i + 6), 16);
        b3 = parseInt(seq.slice(i + 7, i + 9), 16);

        if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
          chr = ((b1 << 12) & 0xF000) | ((b2 << 6) & 0xFC0) | (b3 & 0x3F);

          if (chr < 0x800 || (chr >= 0xD800 && chr <= 0xDFFF)) {
            result += '\ufffd\ufffd\ufffd';
          } else {
            result += String.fromCharCode(chr);
          }

          i += 6;
          continue;
        }
      }

      if ((b1 & 0xF8) === 0xF0 && (i + 9 < l)) {
        // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx
        b2 = parseInt(seq.slice(i + 4, i + 6), 16);
        b3 = parseInt(seq.slice(i + 7, i + 9), 16);
        b4 = parseInt(seq.slice(i + 10, i + 12), 16);

        if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80 && (b4 & 0xC0) === 0x80) {
          chr = ((b1 << 18) & 0x1C0000) | ((b2 << 12) & 0x3F000) | ((b3 << 6) & 0xFC0) | (b4 & 0x3F);

          if (chr < 0x10000 || chr > 0x10FFFF) {
            result += '\ufffd\ufffd\ufffd\ufffd';
          } else {
            chr -= 0x10000;
            result += String.fromCharCode(0xD800 + (chr >> 10), 0xDC00 + (chr & 0x3FF));
          }

          i += 9;
          continue;
        }
      }

      result += '\ufffd';
    }

    return result;
  });
}


decode.defaultChars   = ';/?:@&=+$,#';
decode.componentChars = '';


module.exports = decode;


/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




var encodeCache = {};


// Create a lookup array where anything but characters in `chars` string
// and alphanumeric chars is percent-encoded.
//
function getEncodeCache(exclude) {
  var i, ch, cache = encodeCache[exclude];
  if (cache) { return cache; }

  cache = encodeCache[exclude] = [];

  for (i = 0; i < 128; i++) {
    ch = String.fromCharCode(i);

    if (/^[0-9a-z]$/i.test(ch)) {
      // always allow unencoded alphanumeric characters
      cache.push(ch);
    } else {
      cache.push('%' + ('0' + i.toString(16).toUpperCase()).slice(-2));
    }
  }

  for (i = 0; i < exclude.length; i++) {
    cache[exclude.charCodeAt(i)] = exclude[i];
  }

  return cache;
}


// Encode unsafe characters with percent-encoding, skipping already
// encoded sequences.
//
//  - string       - string to encode
//  - exclude      - list of characters to ignore (in addition to a-zA-Z0-9)
//  - keepEscaped  - don't encode '%' in a correct escape sequence (default: true)
//
function encode(string, exclude, keepEscaped) {
  var i, l, code, nextCode, cache,
      result = '';

  if (typeof exclude !== 'string') {
    // encode(string, keepEscaped)
    keepEscaped  = exclude;
    exclude = encode.defaultChars;
  }

  if (typeof keepEscaped === 'undefined') {
    keepEscaped = true;
  }

  cache = getEncodeCache(exclude);

  for (i = 0, l = string.length; i < l; i++) {
    code = string.charCodeAt(i);

    if (keepEscaped && code === 0x25 /* % */ && i + 2 < l) {
      if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
        result += string.slice(i, i + 3);
        i += 2;
        continue;
      }
    }

    if (code < 128) {
      result += cache[code];
      continue;
    }

    if (code >= 0xD800 && code <= 0xDFFF) {
      if (code >= 0xD800 && code <= 0xDBFF && i + 1 < l) {
        nextCode = string.charCodeAt(i + 1);
        if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
          result += encodeURIComponent(string[i] + string[i + 1]);
          i++;
          continue;
        }
      }
      result += '%EF%BF%BD';
      continue;
    }

    result += encodeURIComponent(string[i]);
  }

  return result;
}

encode.defaultChars   = ";/?:@&=+$,-_.!~*'()#";
encode.componentChars = "-_.!~*'()";


module.exports = encode;


/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




module.exports = function format(url) {
  var result = '';

  result += url.protocol || '';
  result += url.slashes ? '//' : '';
  result += url.auth ? url.auth + '@' : '';

  if (url.hostname && url.hostname.indexOf(':') !== -1) {
    // ipv6 address
    result += '[' + url.hostname + ']';
  } else {
    result += url.hostname || '';
  }

  result += url.port ? ':' + url.port : '';
  result += url.pathname || '';
  result += url.search || '';
  result += url.hash || '';

  return result;
};


/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



//
// Changes from joyent/node:
//
// 1. No leading slash in paths,
//    e.g. in `url.parse('http://foo?bar')` pathname is ``, not `/`
//
// 2. Backslashes are not replaced with slashes,
//    so `http:\\example.org\` is treated like a relative path
//
// 3. Trailing colon is treated like a part of the path,
//    i.e. in `http://example.org:foo` pathname is `:foo`
//
// 4. Nothing is URL-encoded in the resulting object,
//    (in joyent/node some chars in auth and paths are encoded)
//
// 5. `url.parse()` does not have `parseQueryString` argument
//
// 6. Removed extraneous result properties: `host`, `path`, `query`, etc.,
//    which can be constructed using other parts of the url.
//


function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.pathname = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = [ '<', '>', '"', '`', ' ', '\r', '\n', '\t' ],

    // RFC 2396: characters not allowed for various reasons.
    unwise = [ '{', '}', '|', '\\', '^', '`' ].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = [ '\'' ].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = [ '%', '/', '?', ';', '#' ].concat(autoEscape),
    hostEndingChars = [ '/', '?', '#' ],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    /* eslint-disable no-script-url */
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    };
    /* eslint-enable no-script-url */

function urlParse(url, slashesDenoteHost) {
  if (url && url instanceof Url) { return url; }

  var u = new Url();
  u.parse(url, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, slashesDenoteHost) {
  var i, l, lowerProto, hec, slashes,
      rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    lowerProto = proto.toLowerCase();
    this.protocol = proto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (i = 0; i < hostEndingChars.length; i++) {
      hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = auth;
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (i = 0; i < nonHostChars.length; i++) {
      hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1) {
      hostEnd = rest.length;
    }

    if (rest[hostEnd - 1] === ':') { hostEnd--; }
    var host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost(host);

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) { continue; }
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    }

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
    }
  }

  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    rest = rest.slice(0, qm);
  }
  if (rest) { this.pathname = rest; }
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '';
  }

  return this;
};

Url.prototype.parseHost = function(host) {
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) { this.hostname = host; }
};

module.exports = urlParse;


/***/ }),
/* 287 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)(module), __webpack_require__(7)))

/***/ }),
/* 288 */
/***/ (function(module, exports) {

module.exports = "# About Bük\n\nBük is a markdown based wiki generator written in Javascript. \n**No server needed.**  \n\nSimply drop in your .md files in a folder, update manifest.json and you get a blazing fast wiki with an integrated fuzzy search feature.\n\n# Extending Bük\n\nBük being open source, feel free to fork it and make it your own!  \nBuilt using [vue-cli](https://github.com/vuejs/vue-cli) with the [webpack-simple](https://github.com/vuejs-templates/webpack-simple) template, running a local version of Bük is incredibly easy:\n```shell\n    cd buk\n    npm install\n    npm run dev     // Serving on localhost:8080 by default\n    \n    npm run build   // To generate a minified production ready script.\n```\n\nPlease refer to [vue-cli](https://github.com/vuejs/vue-cli) documentation for further customization.\n"

/***/ }),
/* 289 */
/***/ (function(module, exports) {

module.exports = "# Quickstart\n\n1) Get Bük\n> ##### Git Clone\n```\ngit clone https://github.com/hang-up/buk.git buk\ncd buk\nnpm install\n```\n\n> ##### NPM\nAlternatively, use NPM.\n\n```\nnpm install buuk\n```\n---\n\n2) Drop your markdown files inside `dist/assets`.\n3) Update `manifest.json`\n4) `npm run build`\n\n**Refer to Usage/manifest.json to learn more about file naming conventions.** \n\n---\n#### Development caveats\n> Include `bundle.min.js` in production  \n\nDue to Webpack compilation flow and Uglify inablity to process ES2015 files, running `npm run build` will now call 2  npm scripts sequentially: `transpile` and `uglify`.\n\n1) `transpile` uses `babel-cli` with the `es2015`presets and outputs `dist/transpiled.js`\n2) `uglify` uses `uglifyjs` to compress `dist/transpiled.js` into `dist/bundle.min.js`\n\nDue to this compilation flow, you SHOULD include `dist/bundle.min.js` in your `index.html` when in production. \nIn development, leave the un-minified version `dist/bundle.js` to benefit from hot reloading."

/***/ }),
/* 290 */
/***/ (function(module, exports) {

module.exports = "# References\n\n### Built using:\n* [vue](https://vuejs.org/) -  [vuex](https://vuex.vuejs.org) - [vue-router](https://router.vuejs.org)\n* [fuse.js](http:http://fusejs.io/)\n\n### Parser\nBük is using [markdown-it](https://github.com/markdown-it/markdown-it) as a parser to display your markdown pages. If you encounter any parsing caveats, please address your issues [here](https://github.com/markdown-it/markdown-it/issues).  \n\n### Licence\nMIT"

/***/ }),
/* 291 */
/***/ (function(module, exports) {

module.exports = "# Bük\n> A fast and simple markdown based documentation generator.\n\nBük is a markdown based static site generator geared towards documentation.\n\n**This is a custom introductory page! It is just yet another markdown file you can edit however you like.** \n"

/***/ }),
/* 292 */
/***/ (function(module, exports) {

module.exports = "# Manifest.json\n\nThe heart of Bük is laying on its `manifest.json` file. The manifest for the current boilerplate follows this structure:\n```json\n    {\n        \"app\": \"Name of the wiki\",\n        \"version\": \"1.0.0\",\n        \"description\": \"General description of the wiki.\",\n        \"sub\": \"More details about the wiki.\",\n        \n        \"options\": {\n            \"advanced_slugs\": true,\n            \"theme\": \"default\"\n        },\n\n        \"articles\" : {                              // All articles to be indexed\n            \"Category 1\": [                         // Category name\n              {\n                \"title\": \"Article title\",           // Article name\n                \"tags\": [                           // Tags to use when searched\n                  \"tag 1\",\n                  \"tag 2\",\n                  \"tag 3\"\n                ]\n              }\n            ]\n        }\n    }\n```\n\n### File naming convention\n**Your markdown (.md) file names must match the slug generated by Bük or defined in `manifest.json`.**\nSee the options section below to know more about how we auto generate slugs.\n\n### Options\n#### advanced_slugs\n1. When `advanced_slugs` is set to `true` (default setting), Bük will generate a slug based on the following pattern: `direct-parent-category-title-of-the-article` (eg. usage-manifest.json).\n2. When set to `false`, Bük will simply take the title of the article as slugs (eg. manifest.json)\n\n> Advanced slugs are useful when having multiple articles with the same title defined in the manifest.\n\n#### Override slugs\nBy default, Bük will generate a slug for every article indexed in the manifest.json file based on its `title` key.  \nIf you wish to have a custom slug for an article, simply add a `\"slug\"` key to your article.\n```json\n{\n    \"title\": \"Article title\",   // Article name\n    \"tags\": [                   // Tags to use when searched\n        \"tag 1\",\n        \"tag 2\",\n        \"tag 3\"\n    ],\n    \"slug\": \"custom-slug\"       // Associated .md file must be named custom-slug.md\n}\n```\n\n### Nested categories\nBük allows an infinite degree of nested categories. Simply build your hierarchy inside `manifest.json` and name your markdown files accordingly. \nAn example of manifest using nested categories:\n```json\n{\n  \"articles\" : {\n      \"Level 0\": {\n          \"Level 1\" : {\n              \"Level 2 Category 1\": [\n                  {\n                      \"title\": \"Article Title\",   // level-2-category-1-article-title.md\n                      \"tags\": [\n                          \"licence\",\n                          \"author\",\n                          \"misc\"\n                      ]\n                  }\n              ],\n              \n              \"Level 2 Category 2\": [\n                  {\n                      \"title\": \"Article Title\",   // level-2-category-2-article-title.md\n                      \"tags\": [\n                          \"licence\",\n                          \"author\",\n                          \"misc\"\n                      ]\n                  }\n              ]\n          }\n      }\n  }\n}\n```\n\n### Theming\n> **New in 2.1**  \n#### theme\nBy default, Bük ships with [Marked 2](http://marked2app.com/help/Writing_Custom_CSS.html) compatible theme.\nIf you wish to add themes or change the theme used, simply \n1) Drop a `scss` stylesheet in `resources/assets/sass/themes`\n2) Reference it in `resources/components/utils/themify.js`\n3) Update the `theme` key in your manifest."

/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {


;(function (name, root, factory) {
  if (true) {
    module.exports = factory()
  }
  /* istanbul ignore next */
  else if (typeof define === 'function' && define.amd) {
    define(factory)
  }
  else {
    root[name] = factory()
  }
}('slugify', this, function () {
  var charMap = {
    // latin
    'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE',
    'Ç': 'C', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'Ì': 'I', 'Í': 'I',
    'Î': 'I', 'Ï': 'I', 'Ð': 'D', 'Ñ': 'N', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O',
    'Õ': 'O', 'Ö': 'O', 'Ő': 'O', 'Ø': 'O', 'Ù': 'U', 'Ú': 'U', 'Û': 'U',
    'Ü': 'U', 'Ű': 'U', 'Ý': 'Y', 'Þ': 'TH', 'ß': 'ss', 'à': 'a', 'á': 'a',
    'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c', 'è': 'e',
    'é': 'e', 'ê': 'e', 'ë': 'e', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'ð': 'd', 'ñ': 'n', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
    'ő': 'o', 'ø': 'o', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u', 'ű': 'u',
    'ý': 'y', 'þ': 'th', 'ÿ': 'y', 'ẞ': 'SS',
    // greek
    'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'h', 'θ': '8',
    'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': '3', 'ο': 'o', 'π': 'p',
    'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'x', 'ψ': 'ps', 'ω': 'w',
    'ά': 'a', 'έ': 'e', 'ί': 'i', 'ό': 'o', 'ύ': 'y', 'ή': 'h', 'ώ': 'w', 'ς': 's',
    'ϊ': 'i', 'ΰ': 'y', 'ϋ': 'y', 'ΐ': 'i',
    'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'H', 'Θ': '8',
    'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': '3', 'Ο': 'O', 'Π': 'P',
    'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'F', 'Χ': 'X', 'Ψ': 'PS', 'Ω': 'W',
    'Ά': 'A', 'Έ': 'E', 'Ί': 'I', 'Ό': 'O', 'Ύ': 'Y', 'Ή': 'H', 'Ώ': 'W', 'Ϊ': 'I',
    'Ϋ': 'Y',
    // turkish
    'ş': 's', 'Ş': 'S', 'ı': 'i', 'İ': 'I', 'ç': 'c', 'Ç': 'C', 'ü': 'u', 'Ü': 'U',
    'ö': 'o', 'Ö': 'O', 'ğ': 'g', 'Ğ': 'G',
    // russian
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
    'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': 'u', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
    'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo', 'Ж': 'Zh',
    'З': 'Z', 'И': 'I', 'Й': 'J', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
    'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C',
    'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sh', 'Ъ': 'U', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu',
    'Я': 'Ya',
    // ukranian
    'Є': 'Ye', 'І': 'I', 'Ї': 'Yi', 'Ґ': 'G', 'є': 'ye', 'і': 'i', 'ї': 'yi', 'ґ': 'g',
    // czech
    'č': 'c', 'ď': 'd', 'ě': 'e', 'ň': 'n', 'ř': 'r', 'š': 's', 'ť': 't', 'ů': 'u',
    'ž': 'z', 'Č': 'C', 'Ď': 'D', 'Ě': 'E', 'Ň': 'N', 'Ř': 'R', 'Š': 'S', 'Ť': 'T',
    'Ů': 'U', 'Ž': 'Z',
    // polish
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z',
    'ż': 'z', 'Ą': 'A', 'Ć': 'C', 'Ę': 'e', 'Ł': 'L', 'Ń': 'N', 'Ś': 'S',
    'Ź': 'Z', 'Ż': 'Z',
    // latvian
    'ā': 'a', 'č': 'c', 'ē': 'e', 'ģ': 'g', 'ī': 'i', 'ķ': 'k', 'ļ': 'l', 'ņ': 'n',
    'š': 's', 'ū': 'u', 'ž': 'z', 'Ā': 'A', 'Č': 'C', 'Ē': 'E', 'Ģ': 'G', 'Ī': 'i',
    'Ķ': 'k', 'Ļ': 'L', 'Ņ': 'N', 'Š': 'S', 'Ū': 'u', 'Ž': 'Z',
    // currency
    '€': 'euro', '₢': 'cruzeiro', '₣': 'french franc', '£': 'pound',
    '₤': 'lira', '₥': 'mill', '₦': 'naira', '₧': 'peseta', '₨': 'rupee',
    '₩': 'won', '₪': 'new shequel', '₫': 'dong', '₭': 'kip', '₮': 'tugrik',
    '₯': 'drachma', '₰': 'penny', '₱': 'peso', '₲': 'guarani', '₳': 'austral',
    '₴': 'hryvnia', '₵': 'cedi', '¢': 'cent', '¥': 'yen', '元': 'yuan',
    '円': 'yen', '﷼': 'rial', '₠': 'ecu', '¤': 'currency', '฿': 'baht',
    '$': 'dollar',
    // symbols
    '©': '(c)', 'œ': 'oe', 'Œ': 'OE', '∑': 'sum', '®': '(r)', '†': '+',
    '“': '"', '”': '"', '‘': "'", '’': "'", '∂': 'd', 'ƒ': 'f', '™': 'tm',
    '℠': 'sm', '…': '...', '˚': 'o', 'º': 'o', 'ª': 'a', '•': '*',
    '∆': 'delta', '∞': 'infinity', '♥': 'love', '&': 'and', '|': 'or',
    '<': 'less', '>': 'greater'
  }

  function replace (string, replacement) {
    return string.split('').reduce(function (result, ch) {
      if (charMap[ch]) {
        ch = charMap[ch]
      }
      // allowed
      ch = ch.replace(/[^\w\s$*_+~.()'"!\-:@]/g, '')
      result += ch
      return result
    }, '')
      // trim leading/trailing spaces
      .replace(/^\s+|\s+$/g, '')
      // convert spaces
      .replace(/[-\s]+/g, replacement || '-')
      // remove trailing separator
      .replace('#{replacement}$', '')
  }

  replace.extend = function (customMap) {
    for (var key in customMap) {
      charMap[key] = customMap[key]
    }
  }

  return replace
}))


/***/ }),
/* 294 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(46);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(6)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./amblin.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./amblin.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(47);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(6)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./default.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./default.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 296 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(48);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(6)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./github.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./github.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 297 */
/***/ (function(module, exports) {

module.exports=/[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804\uDCBD|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/

/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.Any = __webpack_require__(25);
exports.Cc  = __webpack_require__(23);
exports.Cf  = __webpack_require__(297);
exports.P   = __webpack_require__(12);
exports.Z   = __webpack_require__(24);


/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(36),
  /* template */
  __webpack_require__(315),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(38),
  /* template */
  __webpack_require__(307),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(321)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(39),
  /* template */
  __webpack_require__(314),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(40),
  /* template */
  __webpack_require__(308),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(317)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(42),
  /* template */
  __webpack_require__(309),
  /* scopeId */
  "data-v-3d5dcb70",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(316)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(43),
  /* template */
  __webpack_require__(306),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(318)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(44),
  /* template */
  __webpack_require__(311),
  /* scopeId */
  "data-v-5b3f6bea",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 306 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (!_vm.isDeep(_vm.articles)) ? _c('li', [_c('a', {
    staticClass: "collapsible-header waves-effect waves-red"
  }, [_vm._v(_vm._s(_vm.category))]), _vm._v(" "), _c('div', {
    staticClass: "collapsible-body"
  }, [_c('ul', {
    staticClass: "collapsible",
    attrs: {
      "data-collapsible": "accordion"
    }
  }, [_c('li', [_c('div', [_c('ul', {
    staticClass: "collapsible",
    attrs: {
      "data-collapsible": "accordion"
    }
  }, _vm._l((_vm.articles), function(a, c) {
    return _c('sidebar-item', {
      attrs: {
        "articles": a,
        "category": c
      }
    })
  }))])])])])]) : _c('li', [_c('a', {
    staticClass: "collapsible-header waves-effect waves-red"
  }, [_vm._v(_vm._s(_vm.category))]), _vm._v(" "), _c('div', {
    staticClass: "collapsible-body"
  }, [_c('ul', _vm._l((_vm.articles), function(article) {
    return _c('li', [_c('router-link', {
      staticClass: "waves-effect waves-light is-link",
      staticStyle: {
        "font-weight": "400"
      },
      attrs: {
        "to": article.slug
      }
    }, [_vm._v("\n                    " + _vm._s(article.title) + "\n                ")])], 1)
  }))])])
},staticRenderFns: []}

/***/ }),
/* 307 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "fixed-action-btn click-to-toggle horizontal hide-on-med-and-down"
  }, [_vm._m(0), _vm._v(" "), _c('ul', [_c('li', [_c('a', {
    staticClass: "btn-floating blue btn-fullScreen tooltipped",
    attrs: {
      "data-position": "top",
      "data-delay": "50",
      "data-tooltip": _vm.$store.state.localizations.toggle_fs
    },
    on: {
      "click": _vm.toggleFullScreen
    }
  }, [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v("fullscreen")])])])])])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('a', {
    staticClass: "btn-floating btn-large red"
  }, [_c('i', {
    staticClass: "material-icons"
  }, [_vm._v("menu")])])
}]}

/***/ }),
/* 308 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (!_vm.isMobile) ? _c('div', [(_vm.getPreviousArticle) ? _c('article-navigator', {
    attrs: {
      "action": "previous",
      "link": _vm.getPreviousArticle
    }
  }, [_c('i', {
    staticClass: "material-icons",
    slot: "content"
  }, [_vm._v("keyboard_arrow_left")])]) : _vm._e(), _vm._v(" "), (_vm.getNextArticle) ? _c('article-navigator', {
    attrs: {
      "action": "next",
      "link": _vm.getNextArticle
    }
  }, [_c('i', {
    staticClass: "material-icons",
    slot: "content"
  }, [_vm._v("keyboard_arrow_right")])]) : _vm._e()], 1) : _vm._e()
},staticRenderFns: []}

/***/ }),
/* 309 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    ref: "searchWrapper",
    staticClass: "search-wrapper card",
    class: {
      focused: _vm.isFocused
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.q),
      expression: "q"
    }],
    attrs: {
      "type": "text",
      "id": "search",
      "placeholder": _vm.$store.state.localizations.search
    },
    domProps: {
      "value": (_vm.q)
    },
    on: {
      "click": function($event) {
        _vm.isFocused = !_vm.isFocused
      },
      "blur": function($event) {
        _vm.isFocused = !_vm.isFocused
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.q = $event.target.value
      }
    }
  }), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade"
    }
  }, [(_vm.q != "") ? _c('i', {
    staticClass: "material-icons",
    staticStyle: {
      "position": "absolute",
      "right": "26px",
      "top": "10px",
      "cursor": "pointer"
    },
    on: {
      "click": function($event) {
        _vm.q = ""
      }
    }
  }, [_vm._v("clear")]) : _vm._e()]), _vm._v(" "), _c('search-results', {
    attrs: {
      "q": _vm.q
    },
    on: {
      "update:q": function($event) {
        _vm.q = $event
      }
    }
  })], 1)
},staticRenderFns: []}

/***/ }),
/* 310 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "col s12"
  }, [_c('div', {
    staticClass: "col s12 m9 l10",
    attrs: {
      "id": "wrapper"
    },
    domProps: {
      "innerHTML": _vm._s(_vm.file)
    }
  })])
},staticRenderFns: []}

/***/ }),
/* 311 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('ul', {
    staticClass: "side-nav fixed",
    attrs: {
      "id": "nav-mobile"
    }
  }, [(this.$store.state.logo) ? _c('li', {
    staticClass: "logo"
  }, [_c('sidebar-logo', {
    attrs: {
      "source": this.$store.state.logo
    }
  })], 1) : _vm._e(), _vm._v(" "), _c('li', [_c('search')], 1), _vm._v(" "), _c('li', [_c('router-link', {
    staticClass: "waves-effect waves-light",
    attrs: {
      "to": "/"
    }
  }, [_vm._v("\n            " + _vm._s(_vm.$store.state.localizations.introduction) + "\n        ")])], 1), _vm._v(" "), _c('li', [_c('ul', {
    staticClass: "collapsible",
    attrs: {
      "data-collapsible": "accordion"
    }
  }, _vm._l((_vm.$store.state.articles), function(articles, category) {
    return _c('sidebar-item', {
      attrs: {
        "articles": articles,
        "category": category
      }
    })
  }))])])
},staticRenderFns: []}

/***/ }),
/* 312 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.$store.state.searchResults.length && _vm.$store.state.query) ? _c('div', {
    staticClass: "collection"
  }, _vm._l((_vm.$store.state.searchResults), function(article) {
    return _c('router-link', {
      staticClass: "collection-item",
      attrs: {
        "to": article.slug
      },
      nativeOn: {
        "click": function($event) {
          _vm.clearSearch($event)
        }
      }
    }, [_c('span', [_vm._v(_vm._s(article.title))])])
  })) : (!_vm.$store.state.searchResults.length && _vm.$store.state.query != '') ? _c('ul', {
    staticClass: "collection"
  }, [_c('li', {
    staticClass: "collection-item"
  }, [_vm._v(_vm._s(_vm.$store.state.localizations.no_result))])]) : _vm._e()
},staticRenderFns: []}

/***/ }),
/* 313 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('sidebar'), _vm._v(" "), _c('main', [_c('navigation'), _vm._v(" "), _c('div', {
    staticClass: "container"
  }, [_c('fab'), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('router-view')], 1)], 1)], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('a', {
    staticClass: "top-nav waves-effect waves-light hide-on-large-only btn button-collapse",
    staticStyle: {
      "margin-top": "19.25px"
    },
    attrs: {
      "href": "#",
      "data-activates": "nav-mobile"
    }
  }, [_c('i', {
    staticClass: "material-icons left"
  }, [_vm._v("menu")]), _vm._v("\n                Menu\n            ")])
}]}

/***/ }),
/* 314 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('router-link', {
    staticClass: "btn-floating waves-effect waves-light grey lighten-2 btn-navigator",
    class: _vm.position,
    attrs: {
      "to": _vm.link
    }
  }, [_vm._t("content")], 2)
},staticRenderFns: []}

/***/ }),
/* 315 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "wrapper"
    }
  }, [_c('div', {
    staticClass: "col s12"
  }, [_c('h1', [_vm._v("\n            " + _vm._s(_vm.$store.state.app) + "\n        ")]), _vm._v(" "), _c('h4', [_vm._v("\n            " + _vm._s(_vm.$store.state.description) + "\n        ")]), _vm._v(" "), _c('p', [_vm._v("\n            " + _vm._s(_vm.$store.state.sub) + "\n        ")]), _vm._v(" "), _c('br'), _vm._v(" "), _c('ul', {
    staticClass: "collection with-header"
  }, [_c('li', {
    staticClass: "collection-header"
  }, [_c('h4', [_vm._v(_vm._s(_vm.$store.state.localizations.all_articles))])]), _vm._v(" "), _vm._l((this.$store.state.searchArticles), function(article) {
    return _c('router-link', {
      staticClass: "collection-item",
      attrs: {
        "to": article.slug
      }
    }, [_vm._v("\n                " + _vm._s(article.title) + "\n            ")])
  })], 2)])])
},staticRenderFns: []}

/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(49);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("8aa21138", content, true);

/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(50);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("183a50e6", content, true);

/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(51);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("32874453", content, true);

/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(52);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("0288eb3a", content, true);

/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(53);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("6de20902", content, true);

/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(54);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(4)("0ba5621a", content, true);

/***/ }),
/* 322 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 323 */,
/* 324 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["boot"] = boot;
const lang = __webpack_require__(3).options.lang

const en = {
    'all_articles': "All articles",
    'toggle_fs': "Toggle fullscreen",
    'search': "Search...",
    'no_result': 'No result found',
    'introduction': "Introduction"
}

const fr = {
    'all_articles': "Tous les articles",
    'toggle_fs': "Plein écran",
    'search': "Rechercher...",
    'no_result': "Aucun résultat",
    'introduction': "Introduction"
}

/**
 * This module is responsible for returning the right localizations.
 *
 * @returns {*}
 */
function boot() {
    switch (lang) {
        case 'en':
            return en
        break

        case 'fr':
            return fr
            break

        default:
            return en
        break
    }
}

/***/ }),
/* 325 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["boot"] = boot;
/**
 * This module returns the appropriate markdown parser.
 *
 */
function boot() {
    // Switch renderer here. UML support?
    const md = __webpack_require__(238)({
        breaks: true,
        typographer: true
    })
        .use(__webpack_require__(237))
        .use(window.highlightjs, "auto");

    return md
}

/***/ }),
/* 326 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["boot"] = boot;
const options = __webpack_require__(3).options

/**
 * This module registers all routes of the application.
 *
 * @returns {[*]}
 */
function boot() {
    let routes = [
        {
            path: '/:article',
            name: 'article',
            component: __webpack_require__(13)
        }
    ]
    if (options.introduction && options.introduction !== null) {
        routes.push({
            path: '/',
            redirect: `${options.introduction}`,
            component: __webpack_require__(13)
        })
    }
    else {
        routes.push({ path: '/', component: __webpack_require__(299) })
    }

    return routes;
}

/***/ }),
/* 327 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["boot"] = boot;
const articles = __webpack_require__(3).articles;
const _ = window._

/**
 * Simple object to hold a flattened array of articles.
 *
 */
let data = {
    flatArticles: []
}

/**
 * Recursively loop through a given set of articles to feed them into an array used by fuse.js.
 *
 * @param articles
 * @param res
 */
function searchify(articles) {
    _.forEach(_.flattenDeep(_.toArray(articles)), (category) => {
        // Loop through every article of the category and push an object of the format { title, slug, tags }


        if(!("title" in category)) {
            searchify(category)
        }
        else {
            data.flatArticles.push({
                title: category.title,
                slug: category.slug,
                tags: category.tags.toString()
            })
        }
    })
}

/**
 * This module will go through each article indexed in manifest.json and will initialize the search
 * feature while filtering duplicates.
 *
 */
function boot() {
    /**
     * Entry point.
     *
     * @returns {Array}
     */
    searchify(articles)

    // We filter our articles by their slug uniqueness.
    return _.uniqBy(data.flatArticles, 'slug')

}

/***/ }),
/* 328 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["boot"] = boot;
const options = __webpack_require__(3).options

/**
 * This module will bootstrap specific sidebar behaviour.
 *
 * @returns {*}
 */
function boot() {
    if (!options.logo)
        return undefined
    else
        return options.logo
}

/***/ }),
/* 329 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["boot"] = boot;
const slugger = __webpack_require__(293)
const lower = __webpack_require__(236)
const articles = __webpack_require__(3).articles;
const options = __webpack_require__(3).options;
const _ = window._

/**
 * Recursively loop through a given articles array to slug each article.
 * A slug will be of the following format:
 *      (direct parent)category-name-of-the-article
 *
 * @param articles
 * @returns {*}
 */
function slugify(articles) {

    _.forEach(articles, (categories, key) => {
        if (!_isDeep(categories)) {
            slugify(categories)
        }
        else {
            _.forEach(categories, (article, _) =>{

                // First we need to check if the current article has any custom slugs.
                if (!article.slug) {
                    let _slug = ""

                    // We get the name of the parent article(key) and concat it with
                    // the name of the current article.
                    if (options.advanced_slugs) {
                        _slug = lower(key) + "-" + lower(article.title)
                    }
                    // Otherwise we just create a simple slug based on the name of the article.
                    else {
                        _slug = lower(article.title)
                    }

                    article.slug = slugger(_slug)
                }
            })
        }
    })

    return articles
}

/**
 * Check if a category has any sub categories.
 *
 * @param array
 * @private
 */
function _isDeep(array) {
    return _.isArray(array)
}

/**
 * This will go through each article in the manifest and append a slug to them
 * (if they already don't have one). The slug format is either a simple one
 * (category-name) or an advanced one (direct parent)category-name-of-the-article.
 *
 */
function boot() {

    /**
     * Entry point.
     *
     * @returns {*}
     */
    return slugify(articles)
}


/***/ }),
/* 330 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["boot"] = boot;
const options = __webpack_require__(3).options;

/**
 * Set the appropriate theme.
 *
 * @returns {*}
 * @private
 */
function setTheme() {
    switch (options.theme) {
        case 'amblin':
            return 'amblin.scss'

        case 'github':
            return 'github.scss'

        case 'default':
            return 'default.scss'

        default:
            return 'default.scss'
    }
}

/**
 * This module is responsible for everything themeing related.
 *
 */
function boot() {
    return setTheme()
}

/***/ }),
/* 331 */,
/* 332 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__App_vue__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__App_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__App_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_router__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__js_data_store__ = __webpack_require__(32);





const bootstrap = __webpack_require__(9)
__webpack_require__(29)
__webpack_require__(33)(`./${bootstrap.theme}`)

__WEBPACK_IMPORTED_MODULE_1_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_2_vuex__["a" /* default */])
__WEBPACK_IMPORTED_MODULE_1_vue___default.a.use(__WEBPACK_IMPORTED_MODULE_3_vue_router__["a" /* default */])

const router = new __WEBPACK_IMPORTED_MODULE_3_vue_router__["a" /* default */]({
    routes: bootstrap.routes
})

new __WEBPACK_IMPORTED_MODULE_1_vue___default.a({
    el: '#app',
    store: __WEBPACK_IMPORTED_MODULE_4__js_data_store__["a" /* default */],
    router,
    render: h => h(__WEBPACK_IMPORTED_MODULE_0__App_vue___default.a)
})



/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map