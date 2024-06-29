/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/autolink-js/autolink-min.js":
/*!**************************************************!*\
  !*** ./node_modules/autolink-js/autolink-min.js ***!
  \**************************************************/
/***/ (function() {

(function () {
  var h = [].slice;
  String.prototype.autoLink = function () {
    var b, f, d, a, e, g;
    a = 1 <= arguments.length ? h.call(arguments, 0) : [];
    e = /(^|[\s\n]|<[A-Za-z]*\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
    if (!(0 < a.length)) return this.replace(e, "$1<a href='$2'>$2</a>");
    d = a[0];
    f = function () {
      var c;
      c = [];
      for (b in d) {
        g = d[b], "callback" !== b && c.push(" " + b + "='" + g + "'");
      }
      return c;
    }().join("");
    return this.replace(e, function (c, b, a) {
      c = ("function" === typeof d.callback ? d.callback(a) : void 0) || "<a href='" + a + "'" + f + ">" + a + "</a>";
      return "" + b + c;
    });
  };
}).call(this);

/***/ }),

/***/ "./src/forum/components/UserBio.js":
/*!*****************************************!*\
  !*** ./src/forum/components/UserBio.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ UserBio)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/utils/extractText */ "flarum/common/utils/extractText");
/* harmony import */ var flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_6__);








/**
 * The `UserBio` component displays a user's bio, optionally letting the user
 * edit it.
 */
var UserBio = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(UserBio, _Component);
  function UserBio() {
    return _Component.apply(this, arguments) || this;
  }
  var _proto = UserBio.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    /**
     * Whether the bio is currently being edited.
     *
     * @type {boolean}
     */
    this.editing = false;

    /**
     * Whether the bio is currently being saved.
     *
     * @type {boolean}
     */
    this.loading = false;

    /**
     * The rows to show in the textarea by default when editing.
     * This is set to 5 by default, but can be overridden by the `--bio-max-lines` CSS variable.
     *
     * @type {string}
     */
    this.textareaRows = '5';

    /**
     * The max configured character count the bio may be
     */
    this.bioMaxLength = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('fof-user-bio.maxLength');

    /**
     * The placeholder shown in the bio textbox when no input is set.
     */
    this.bioPlaceholder = (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session) && (flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session).user && flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().session.user.id() === this.attrs.user.id() ?
    // Normal placeholder if they're looking at their own profile
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-user-bio.forum.userbioPlaceholder') :
    // Special placeholder if someone else is viewing their profile with edit access
    flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-user-bio.forum.userbioPlaceholderOtherUser', {
      username: this.attrs.user.displayName()
    });
  };
  _proto.view = function view() {
    var _this = this;
    var user = this.attrs.user;
    var editable = this.attrs.editable && this.attrs.user.attribute('canEditBio');
    var content;
    if (this.editing) {
      var tempBio = this.tempBio;
      var value = tempBio != null ? tempBio : user.bio();
      var focusIfErrored = function focusIfErrored(vnode) {
        var textarea = vnode.dom;
        textarea.value = value;
        if (tempBio !== undefined) {
          textarea.value = tempBio;
          textarea.focus();
          if (_this.tempSelector !== undefined) {
            textarea.selectionStart = _this.tempSelector;
            textarea.selectionEnd = _this.tempSelector;
            delete _this.tempSelector;
          }
        }
      };
      content = m("form", {
        onsubmit: this.save.bind(this)
      }, m("textarea", {
        className: "FormControl",
        placeholder: flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_6___default()(this.bioPlaceholder),
        rows: this.textareaRows,
        maxlength: this.bioMaxLength,
        oncreate: focusIfErrored
      }), m("div", {
        className: "UserBio-actions"
      }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
        className: "Button Button--primary",
        type: "submit"
      }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-user-bio.forum.profile.save_button')), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_4___default()), {
        className: "Button",
        type: "reset",
        onclick: this.reset.bind(this)
      }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-user-bio.forum.profile.cancel_button'))));
    } else {
      var subContent;
      if (this.loading) {
        subContent = m("p", {
          className: "UserBio-placeholder"
        }, m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default()), null));
      } else {
        var bioHtml = user.bioHtml();
        if (bioHtml) {
          subContent = m.trust(bioHtml);
        } else if (user.bio()) {
          subContent = m.trust('<p>' + $('<div/>').text(user.bio()).html().replace(/\n/g, '<br>').autoLink({
            rel: 'nofollow ugc'
          }) + '</p>');
        } else if (editable) {
          subContent = m("p", {
            className: "UserBio-placeholder"
          }, this.bioPlaceholder);
        }
      }
      var maxLines = flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().forum.attribute('fof-user-bio.maxLines') || 5;
      content = m("div", {
        className: "UserBio-content"
        // onclick={editable ? this.edit.bind(this) : () => undefined}
        ,
        onclick: editable ? this.edit.bind(this) : function () {
          return undefined;
        },
        onkeydown: editable ? this.onkeydown.bind(this) : function () {
          return undefined;
        },
        style: {
          '--bio-max-lines': maxLines
        },
        role: editable ? 'button' : undefined,
        tabindex: editable ? '0' : undefined,
        "aria-label": editable ? flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-user-bio.forum.profile.edit_bio_label') : undefined
      }, subContent);
    }
    return m("div", {
      className: 'UserBio ' + flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_5___default()({
        editable: editable,
        editing: this.editing
      })
    }, content);
  };
  _proto.onkeydown = function onkeydown(e) {
    // Allow keyboard navigation to turn editing mode on
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.edit(e);
    }
  }

  /**
   * Edit the bio.
   * @param {MouseEvent} e
   */;
  _proto.edit = function edit(e) {
    // If the click is special, do not switch to editing mode.
    // e.g. allows for Ctrl+Click to open a link in a new tab
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();

    // Maintain the scroll position & cursor position when editing
    var selection = window.getSelection();
    var lineIndex = selection.anchorOffset;

    // Sometimes, links are clicked and the anchorNode is either null or the UserBio-content itself
    var clickedNode = !selection.anchorNode || !e.target.className.includes('UserBio') ? e.target : selection.anchorNode;
    var lengthBefore = this.countTextLengthBefore(clickedNode);
    var currentScroll = e.currentTarget.scrollTop;
    var index = lengthBefore + lineIndex;

    // Show the same number of lines to avoid layout shift
    this.textareaRows = getComputedStyle(e.currentTarget).getPropertyValue('--bio-max-lines') || '5';
    this.editing = true;
    m.redraw.sync();
    this.$('textarea').trigger('focus').prop('selectionStart', index).prop('selectionEnd', index).prop('scrollTop', currentScroll);
  }

  /**
   * Save the bio.
   */;
  _proto.save = function save(e) {
    var _this2 = this;
    e.preventDefault();
    var value = this.$('textarea').val();
    var user = this.attrs.user;
    var tempSelector = this.$('textarea').prop('selectionStart');

    // Don't constantly try to save when blurring textarea
    if (this.isDirty()) {
      this.loading = true;
      user.save({
        bio: value
      })["catch"](function () {
        _this2.tempBio = value;
        _this2.tempSelector = tempSelector;
        _this2.edit();
      }).then(function () {
        _this2.loading = false;
        delete _this2.tempBio;
        m.redraw();
      });
    }
    this.editing = false;
    m.redraw();
  };
  _proto.reset = function reset(e) {
    // Don't want to actually reset the form
    e.preventDefault();

    // Either nothing changed or we want to confirm the loss of changes
    if (!this.isDirty() || confirm(flarum_common_utils_extractText__WEBPACK_IMPORTED_MODULE_6___default()(flarum_forum_app__WEBPACK_IMPORTED_MODULE_1___default().translator.trans('fof-user-bio.forum.profile.cancel_confirm')))) {
      this.editing = false;
      delete this.tempBio;
      m.redraw();
    }
  };
  _proto.isDirty = function isDirty() {
    var value = this.$('textarea').val();
    var user = this.attrs.user;
    return user.bio() !== value;
  }

  /**
   *
   * @param {Node} anchorNode
   * @returns {number}
   */;
  _proto.countTextLengthBefore = function countTextLengthBefore(anchorNode) {
    if (!anchorNode || anchorNode instanceof HTMLElement && anchorNode.className.includes('UserBio')) return 0;
    var length = 0;
    if (anchorNode.previousSibling) {
      for (var prev = anchorNode.previousSibling; prev; prev = prev.previousSibling) {
        length += prev.textContent.length;
      }
    }
    var parent = anchorNode.parentNode;

    // We need to recursively call this function if the anchorNode is not a direct child of UserBio-content
    return length + this.countTextLengthBefore(anchorNode.parentNode);
  };
  return UserBio;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_2___default()));


/***/ }),

/***/ "./src/forum/components/index.js":
/*!***************************************!*\
  !*** ./src/forum/components/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* binding */ components)
/* harmony export */ });
/* harmony import */ var _UserBio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UserBio */ "./src/forum/components/UserBio.js");

var components = {
  UserBio: _UserBio__WEBPACK_IMPORTED_MODULE_0__["default"]
};

/***/ }),

/***/ "./src/forum/index.js":
/*!****************************!*\
  !*** ./src/forum/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_7__.components)
/* harmony export */ });
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var autolink_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! autolink-js */ "./node_modules/autolink-js/autolink-min.js");
/* harmony import */ var autolink_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(autolink_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/components/UserCard */ "flarum/forum/components/UserCard");
/* harmony import */ var flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/models/User */ "flarum/common/models/User");
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_User__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _components_UserBio__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/UserBio */ "./src/forum/components/UserBio.js");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components */ "./src/forum/components/index.js");








flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('fof-user-bio', function () {
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_4___default().prototype).bio = flarum_common_Model__WEBPACK_IMPORTED_MODULE_5___default().attribute('bio');
  (flarum_common_models_User__WEBPACK_IMPORTED_MODULE_4___default().prototype).bioHtml = flarum_common_Model__WEBPACK_IMPORTED_MODULE_5___default().attribute('bioHtml');
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_3___default().prototype), 'infoItems', function (items) {
    var user = this.attrs.user;
    if (!user.attribute('canViewBio')) {
      return;
    }
    items.add('bio', m(_components_UserBio__WEBPACK_IMPORTED_MODULE_6__["default"], {
      user: user,
      editable: this.attrs.editable
    }), -100);
  });
});

/***/ }),

/***/ "flarum/common/Component":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['common/Component']" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Component'];

/***/ }),

/***/ "flarum/common/Model":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['common/Model']" ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Model'];

/***/ }),

/***/ "flarum/common/components/Button":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Button']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Button'];

/***/ }),

/***/ "flarum/common/components/LoadingIndicator":
/*!***************************************************************************!*\
  !*** external "flarum.core.compat['common/components/LoadingIndicator']" ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/LoadingIndicator'];

/***/ }),

/***/ "flarum/common/extend":
/*!******************************************************!*\
  !*** external "flarum.core.compat['common/extend']" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/extend'];

/***/ }),

/***/ "flarum/common/models/User":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['common/models/User']" ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/models/User'];

/***/ }),

/***/ "flarum/common/utils/classList":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/utils/classList']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/classList'];

/***/ }),

/***/ "flarum/common/utils/extractText":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/utils/extractText']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/extractText'];

/***/ }),

/***/ "flarum/forum/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['forum/app']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/app'];

/***/ }),

/***/ "flarum/forum/components/UserCard":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['forum/components/UserCard']" ***!
  \******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/UserCard'];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inheritsLoose)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./forum.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   components: () => (/* reexport safe */ _src_forum__WEBPACK_IMPORTED_MODULE_0__.components)
/* harmony export */ });
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.js");

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=forum.js.map