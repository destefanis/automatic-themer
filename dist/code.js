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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugin/controller.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/plugin/controller.ts":
/*!**********************************!*\
  !*** ./src/plugin/controller.ts ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dark_theme__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dark-theme */ "./src/plugin/dark-theme.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__, { width: 320, height: 368 });

function serializeNodes(nodes) {
    let serializedNodes = JSON.stringify(nodes, [
        "name",
        "type",
        "children",
        "id"
    ]);
    return serializedNodes;
}
const flatten = (obj) => {
    const array = Array.isArray(obj) ? obj : [obj];
    return array.reduce((acc, value) => {
        acc.push(value);
        if (value.children) {
            acc = acc.concat(flatten(value.children));
            delete value.children;
        }
        return acc;
    }, []);
};
figma.ui.onmessage = msg => {
    let skippedLayers = [];
    if (msg.type === "run-app") {
        if (figma.currentPage.selection.length === 0) {
            figma.ui.postMessage({
                type: "selection-updated",
                message: 0,
            });
        }
        else {
            let selectedNodes = flatten(figma.currentPage.selection);
            figma.ui.postMessage({
                type: "selection-updated",
                message: serializeNodes(selectedNodes),
            });
        }
    }
    if (msg.type === "theme-update") {
        let nodesToTheme = flatten(figma.currentPage.selection);
        if (msg.message === "light-theme") {
            nodesToTheme.map(selected => updateTheme(selected));
        }
        setTimeout(function () {
            figma.ui.postMessage({
                type: "layers-skipped",
                message: serializeNodes(skippedLayers),
            });
        }, 500);
        figma.notify(`Themeing complete`, { timeout: 750 });
    }
    if (msg.type === "select-layer") {
        let layer = figma.getNodeById(msg.id);
        let layerArray = [];
        layerArray.push(layer);
        figma.notify(`Layer ${layer.name} selected`, { timeout: 750 });
        figma.currentPage.selection = layerArray;
        figma.viewport.scrollAndZoomIntoView(layerArray);
    }
    function replaceStyles(node, style, mappings, applyStyle) {
        return __awaiter(this, void 0, void 0, function* () {
            let importedStyle = yield figma.importStyleByKeyAsync(style.key);
            if (mappings[importedStyle.key] !== undefined) {
                let mappingStyle = mappings[importedStyle.key];
                let newStyle = yield figma.importStyleByKeyAsync(mappingStyle.mapsToKey);
                applyStyle(node, newStyle.id);
            }
            else {
                skippedLayers.push(node);
            }
        });
    }
    function replaceFills(node, style, mappings) {
        return __awaiter(this, void 0, void 0, function* () {
            yield replaceStyles(node, style, mappings, (node, styleId) => node.fillStyleId = styleId);
        });
    }
    function updateTheme(node) {
        console.log(node);
        switch (node.type) {
            case "COMPONENT":
            case "GROUP":
            case "INSTANCE":
            case "RECTANGLE":
            case "ELLIPSE":
            case "POLYGON":
            case "STAR":
            case "LINE":
            case "BOOLEAN_OPERATION":
            case "FRAME":
            case "VECTOR": {
                if (node.fills) {
                    if (node.fillStyleId && typeof node.fillStyleId !== "symbol") {
                        let style = figma.getStyleById(node.fillStyleId);
                        replaceFills(node, style, _dark_theme__WEBPACK_IMPORTED_MODULE_0__["darkTheme"]);
                    }
                    else {
                        skippedLayers.push(node);
                    }
                }
                break;
            }
            case "TEXT": {
                if (node.fillStyleId && typeof node.fillStyleId !== "symbol") {
                    replaceFills(node, figma.getStyleById(node.fillStyleId), _dark_theme__WEBPACK_IMPORTED_MODULE_0__["darkTheme"]);
                }
                else {
                    skippedLayers.push(node);
                }
            }
            default: {
            }
        }
    }
};


/***/ }),

/***/ "./src/plugin/dark-theme.ts":
/*!**********************************!*\
  !*** ./src/plugin/dark-theme.ts ***!
  \**********************************/
/*! exports provided: darkTheme */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "darkTheme", function() { return darkTheme; });
const darkTheme = {
    "5c1691cbeaaf4270107d34f1a12f02fdd04afa02": {
        name: "Dark / Header / Primary (White)",
        mapsToName: "Light / Header / Primary (900)",
        mapsToKey: "b19a14675b8adeb1528ab5f84e57b2eeed10d46c"
    },
    bc090cb3b1c7313ae276acbd791b5b87b478ec59: {
        name: "Dark / Header / Secondary (300)",
        mapsToName: "Light / Header / Secondary (600)",
        mapsToKey: "608f2ea1aa64ff7f202e8c22cc4147a02be9d85b"
    },
    "5c77a96137b698b5575557c069cabd6877d66e1e": {
        name: "Dark / Text / Normal (200)",
        mapsToName: "Light / Text / Normal (700)",
        mapsToKey: "546c7d46e754ac2b23b338783d72f206b77b6436"
    },
    "5d84ad92f3ad152f196e2093a3c0542a08dfba11": {
        name: "Dark / Text / Muted (400)",
        mapsToName: "Light / Text / Muted (500)",
        mapsToKey: "7d8703ec132ddaf6968f6d190d1e80031c559d7c"
    },
    bf03232753079bdd5bec6c55343b659876b5283f: {
        name: "Dark / Text / Link",
        mapsToName: "Light / Text / Link",
        mapsToKey: "64d3058dd508a4985670b2d19418a06a3503c9c2"
    },
    "287463bade90c1eed5ea4cb0b5d63794daa8aec2": {
        name: "Dark / Interactive Text & Icons / Normal (300)",
        mapsToName: "Light / Interactive Text & Icons / Normal (600)",
        mapsToKey: "9c23a031773711e026394f4354661c37ee5b4682"
    },
    "502dcdf04992818dcbaed125ad711b446dee4c68": {
        name: "Dark / Interactive Text & Icons / Hover (200)",
        mapsToName: "Light / Interactive Text & Icons / Hover (700)",
        mapsToKey: "e9542e95adf3bbe74286c2cf279fee64f7ba3279"
    },
    "3eddc15e90bbd7064aea7cc13dc13e23a712f0b0": {
        name: "Dark / Interactive Text & Icons / Active (White)",
        mapsToName: "Light / Interactive Text & Icons / Active (900)",
        mapsToKey: "620c98e8f9255a6107dee91745669e5b702b413c"
    },
    fa698aa2a724522a7c29efb0a662aec75a1be5a1: {
        name: "Dark / Interactive Text & Icons / Muted (500)",
        mapsToName: "Light / Interactive Text & Icons / Muted (300)",
        mapsToKey: "9328cd78a39149b070d68f98d9fe4df7a92bf67d"
    },
    "4b93d40f61be15e255e87948a715521c3ae957e6": {
        name: "Dark / Background / Primary (600)",
        mapsToName: "Light / Background / Primary (White)",
        mapsToKey: "2449a2983d43793d80baa20c6c60e8a48e7f3a0c"
    },
    fb1358e5bd6dec072801298238cf49ff77b79a4b: {
        name: "Dark / Background / Secondary (630)",
        mapsToName: "Light / Background / Secondary (130)",
        mapsToKey: "83704278c845a6a7ceb1f837387972ccb6d41960"
    },
    ef179b6abe6cb8779857e05a6333d33f7a2b9320: {
        name: "Dark / Background / Tertiary (700)",
        mapsToName: "Light / Background / Tertiary (200)",
        mapsToKey: "dbd02a76b7b77c1976114c04068f0fbc22015fab"
    },
    "3dd0e30ce0a8287eb91ec1fbeff92031e634ed01": {
        name: "Dark / Background / Accent (500)",
        mapsToName: "Light / Interactive Text & Icons / Muted (300)",
        mapsToKey: "9328cd78a39149b070d68f98d9fe4df7a92bf67d"
    },
    "11516f4b43f381afb5a6bdf2c34b9437f0eecde1": {
        name: "Dark / Background / Floating (800)",
        mapsToName: "Light / Background / Floating (White)",
        mapsToKey: "6c8b08a42f9614842e880bf7bb795014d8fbae94"
    },
    d6c9270834b11c99ee651f0f5072ad2c63701165: {
        name: "Dark / Background Mod / Hover",
        mapsToName: "Light / Background Mod / Hover",
        mapsToKey: "35307396ae29aaeb583ae65891c69ec689f0c41e"
    },
    bcf890d7a215c65deef97fb3d3f5bcebc9869bab: {
        name: "Dark / Background Mod / Active",
        mapsToName: "Light / Background Mod / Active",
        mapsToKey: "ddadf76919d9bacb925242a024dc1e2f5f517a46"
    },
    ce012db42f35fb58b4fe1d6d8b46c4905a8fad0a: {
        name: "Dark / Background Mod / Selected",
        mapsToName: "Light / Background Mod / Selected",
        mapsToKey: "5af2eaf14901472c26b641997796bdba76ee1794"
    },
    a6a3dc153f0e589408186176ebf8f20ed2f9bda3: {
        name: "Dark / Background Mod / Accent",
        mapsToName: "Light / Background Mod / Accent",
        mapsToKey: "08c7091f8d6950dc3f616afe8ed45b086f9124c7"
    }
};



/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vZGFyay10aGVtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQSxpQkFBaUIsU0FBSSxJQUFJLFNBQUk7QUFDN0I7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IsaUVBQWlFLHVCQUF1QixFQUFFLDRCQUE0QjtBQUNySjtBQUNBLEtBQUs7QUFDTDtBQUNBLHdCQUF3QiwwQkFBMEI7QUFDVDtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1QsMkNBQTJDLGVBQWU7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixXQUFXLGFBQWEsZUFBZTtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxxREFBUztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2RUFBNkUscURBQVM7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUMzSEE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ3FCIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wbHVnaW4vY29udHJvbGxlci50c1wiKTtcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAzMjAsIGhlaWdodDogMzY4IH0pO1xuaW1wb3J0IHsgZGFya1RoZW1lIH0gZnJvbSBcIi4vZGFyay10aGVtZVwiO1xuZnVuY3Rpb24gc2VyaWFsaXplTm9kZXMobm9kZXMpIHtcbiAgICBsZXQgc2VyaWFsaXplZE5vZGVzID0gSlNPTi5zdHJpbmdpZnkobm9kZXMsIFtcbiAgICAgICAgXCJuYW1lXCIsXG4gICAgICAgIFwidHlwZVwiLFxuICAgICAgICBcImNoaWxkcmVuXCIsXG4gICAgICAgIFwiaWRcIlxuICAgIF0pO1xuICAgIHJldHVybiBzZXJpYWxpemVkTm9kZXM7XG59XG5jb25zdCBmbGF0dGVuID0gKG9iaikgPT4ge1xuICAgIGNvbnN0IGFycmF5ID0gQXJyYXkuaXNBcnJheShvYmopID8gb2JqIDogW29ial07XG4gICAgcmV0dXJuIGFycmF5LnJlZHVjZSgoYWNjLCB2YWx1ZSkgPT4ge1xuICAgICAgICBhY2MucHVzaCh2YWx1ZSk7XG4gICAgICAgIGlmICh2YWx1ZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgYWNjID0gYWNjLmNvbmNhdChmbGF0dGVuKHZhbHVlLmNoaWxkcmVuKSk7XG4gICAgICAgICAgICBkZWxldGUgdmFsdWUuY2hpbGRyZW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCBbXSk7XG59O1xuZmlnbWEudWkub25tZXNzYWdlID0gbXNnID0+IHtcbiAgICBsZXQgc2tpcHBlZExheWVycyA9IFtdO1xuICAgIGlmIChtc2cudHlwZSA9PT0gXCJydW4tYXBwXCIpIHtcbiAgICAgICAgaWYgKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInNlbGVjdGlvbi11cGRhdGVkXCIsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogMCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IHNlbGVjdGVkTm9kZXMgPSBmbGF0dGVuKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbik7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzZWxlY3Rpb24tdXBkYXRlZFwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHNlcmlhbGl6ZU5vZGVzKHNlbGVjdGVkTm9kZXMpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSBcInRoZW1lLXVwZGF0ZVwiKSB7XG4gICAgICAgIGxldCBub2Rlc1RvVGhlbWUgPSBmbGF0dGVuKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbik7XG4gICAgICAgIGlmIChtc2cubWVzc2FnZSA9PT0gXCJsaWdodC10aGVtZVwiKSB7XG4gICAgICAgICAgICBub2Rlc1RvVGhlbWUubWFwKHNlbGVjdGVkID0+IHVwZGF0ZVRoZW1lKHNlbGVjdGVkKSk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJsYXllcnMtc2tpcHBlZFwiLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHNlcmlhbGl6ZU5vZGVzKHNraXBwZWRMYXllcnMpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIDUwMCk7XG4gICAgICAgIGZpZ21hLm5vdGlmeShgVGhlbWVpbmcgY29tcGxldGVgLCB7IHRpbWVvdXQ6IDc1MCB9KTtcbiAgICB9XG4gICAgaWYgKG1zZy50eXBlID09PSBcInNlbGVjdC1sYXllclwiKSB7XG4gICAgICAgIGxldCBsYXllciA9IGZpZ21hLmdldE5vZGVCeUlkKG1zZy5pZCk7XG4gICAgICAgIGxldCBsYXllckFycmF5ID0gW107XG4gICAgICAgIGxheWVyQXJyYXkucHVzaChsYXllcik7XG4gICAgICAgIGZpZ21hLm5vdGlmeShgTGF5ZXIgJHtsYXllci5uYW1lfSBzZWxlY3RlZGAsIHsgdGltZW91dDogNzUwIH0pO1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBsYXllckFycmF5O1xuICAgICAgICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcobGF5ZXJBcnJheSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlcGxhY2VTdHlsZXMobm9kZSwgc3R5bGUsIG1hcHBpbmdzLCBhcHBseVN0eWxlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBsZXQgaW1wb3J0ZWRTdHlsZSA9IHlpZWxkIGZpZ21hLmltcG9ydFN0eWxlQnlLZXlBc3luYyhzdHlsZS5rZXkpO1xuICAgICAgICAgICAgaWYgKG1hcHBpbmdzW2ltcG9ydGVkU3R5bGUua2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hcHBpbmdTdHlsZSA9IG1hcHBpbmdzW2ltcG9ydGVkU3R5bGUua2V5XTtcbiAgICAgICAgICAgICAgICBsZXQgbmV3U3R5bGUgPSB5aWVsZCBmaWdtYS5pbXBvcnRTdHlsZUJ5S2V5QXN5bmMobWFwcGluZ1N0eWxlLm1hcHNUb0tleSk7XG4gICAgICAgICAgICAgICAgYXBwbHlTdHlsZShub2RlLCBuZXdTdHlsZS5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBza2lwcGVkTGF5ZXJzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZXBsYWNlRmlsbHMobm9kZSwgc3R5bGUsIG1hcHBpbmdzKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCByZXBsYWNlU3R5bGVzKG5vZGUsIHN0eWxlLCBtYXBwaW5ncywgKG5vZGUsIHN0eWxlSWQpID0+IG5vZGUuZmlsbFN0eWxlSWQgPSBzdHlsZUlkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRoZW1lKG5vZGUpIHtcbiAgICAgICAgY29uc29sZS5sb2cobm9kZSk7XG4gICAgICAgIHN3aXRjaCAobm9kZS50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFwiQ09NUE9ORU5UXCI6XG4gICAgICAgICAgICBjYXNlIFwiR1JPVVBcIjpcbiAgICAgICAgICAgIGNhc2UgXCJJTlNUQU5DRVwiOlxuICAgICAgICAgICAgY2FzZSBcIlJFQ1RBTkdMRVwiOlxuICAgICAgICAgICAgY2FzZSBcIkVMTElQU0VcIjpcbiAgICAgICAgICAgIGNhc2UgXCJQT0xZR09OXCI6XG4gICAgICAgICAgICBjYXNlIFwiU1RBUlwiOlxuICAgICAgICAgICAgY2FzZSBcIkxJTkVcIjpcbiAgICAgICAgICAgIGNhc2UgXCJCT09MRUFOX09QRVJBVElPTlwiOlxuICAgICAgICAgICAgY2FzZSBcIkZSQU1FXCI6XG4gICAgICAgICAgICBjYXNlIFwiVkVDVE9SXCI6IHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5maWxscykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5maWxsU3R5bGVJZCAmJiB0eXBlb2Ygbm9kZS5maWxsU3R5bGVJZCAhPT0gXCJzeW1ib2xcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN0eWxlID0gZmlnbWEuZ2V0U3R5bGVCeUlkKG5vZGUuZmlsbFN0eWxlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGFjZUZpbGxzKG5vZGUsIHN0eWxlLCBkYXJrVGhlbWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2tpcHBlZExheWVycy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBcIlRFWFRcIjoge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLmZpbGxTdHlsZUlkICYmIHR5cGVvZiBub2RlLmZpbGxTdHlsZUlkICE9PSBcInN5bWJvbFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2VGaWxscyhub2RlLCBmaWdtYS5nZXRTdHlsZUJ5SWQobm9kZS5maWxsU3R5bGVJZCksIGRhcmtUaGVtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBza2lwcGVkTGF5ZXJzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcbiIsImNvbnN0IGRhcmtUaGVtZSA9IHtcbiAgICBcIjVjMTY5MWNiZWFhZjQyNzAxMDdkMzRmMWExMmYwMmZkZDA0YWZhMDJcIjoge1xuICAgICAgICBuYW1lOiBcIkRhcmsgLyBIZWFkZXIgLyBQcmltYXJ5IChXaGl0ZSlcIixcbiAgICAgICAgbWFwc1RvTmFtZTogXCJMaWdodCAvIEhlYWRlciAvIFByaW1hcnkgKDkwMClcIixcbiAgICAgICAgbWFwc1RvS2V5OiBcImIxOWExNDY3NWI4YWRlYjE1MjhhYjVmODRlNTdiMmVlZWQxMGQ0NmNcIlxuICAgIH0sXG4gICAgYmMwOTBjYjNiMWM3MzEzYWUyNzZhY2JkNzkxYjViODdiNDc4ZWM1OToge1xuICAgICAgICBuYW1lOiBcIkRhcmsgLyBIZWFkZXIgLyBTZWNvbmRhcnkgKDMwMClcIixcbiAgICAgICAgbWFwc1RvTmFtZTogXCJMaWdodCAvIEhlYWRlciAvIFNlY29uZGFyeSAoNjAwKVwiLFxuICAgICAgICBtYXBzVG9LZXk6IFwiNjA4ZjJlYTFhYTY0ZmY3ZjIwMmU4YzIyY2M0MTQ3YTAyYmU5ZDg1YlwiXG4gICAgfSxcbiAgICBcIjVjNzdhOTYxMzdiNjk4YjU1NzU1NTdjMDY5Y2FiZDY4NzdkNjZlMWVcIjoge1xuICAgICAgICBuYW1lOiBcIkRhcmsgLyBUZXh0IC8gTm9ybWFsICgyMDApXCIsXG4gICAgICAgIG1hcHNUb05hbWU6IFwiTGlnaHQgLyBUZXh0IC8gTm9ybWFsICg3MDApXCIsXG4gICAgICAgIG1hcHNUb0tleTogXCI1NDZjN2Q0NmU3NTRhYzJiMjNiMzM4NzgzZDcyZjIwNmI3N2I2NDM2XCJcbiAgICB9LFxuICAgIFwiNWQ4NGFkOTJmM2FkMTUyZjE5NmUyMDkzYTNjMDU0MmEwOGRmYmExMVwiOiB7XG4gICAgICAgIG5hbWU6IFwiRGFyayAvIFRleHQgLyBNdXRlZCAoNDAwKVwiLFxuICAgICAgICBtYXBzVG9OYW1lOiBcIkxpZ2h0IC8gVGV4dCAvIE11dGVkICg1MDApXCIsXG4gICAgICAgIG1hcHNUb0tleTogXCI3ZDg3MDNlYzEzMmRkYWY2OTY4ZjZkMTkwZDFlODAwMzFjNTU5ZDdjXCJcbiAgICB9LFxuICAgIGJmMDMyMzI3NTMwNzliZGQ1YmVjNmM1NTM0M2I2NTk4NzZiNTI4M2Y6IHtcbiAgICAgICAgbmFtZTogXCJEYXJrIC8gVGV4dCAvIExpbmtcIixcbiAgICAgICAgbWFwc1RvTmFtZTogXCJMaWdodCAvIFRleHQgLyBMaW5rXCIsXG4gICAgICAgIG1hcHNUb0tleTogXCI2NGQzMDU4ZGQ1MDhhNDk4NTY3MGIyZDE5NDE4YTA2YTM1MDNjOWMyXCJcbiAgICB9LFxuICAgIFwiMjg3NDYzYmFkZTkwYzFlZWQ1ZWE0Y2IwYjVkNjM3OTRkYWE4YWVjMlwiOiB7XG4gICAgICAgIG5hbWU6IFwiRGFyayAvIEludGVyYWN0aXZlIFRleHQgJiBJY29ucyAvIE5vcm1hbCAoMzAwKVwiLFxuICAgICAgICBtYXBzVG9OYW1lOiBcIkxpZ2h0IC8gSW50ZXJhY3RpdmUgVGV4dCAmIEljb25zIC8gTm9ybWFsICg2MDApXCIsXG4gICAgICAgIG1hcHNUb0tleTogXCI5YzIzYTAzMTc3MzcxMWUwMjYzOTRmNDM1NDY2MWMzN2VlNWI0NjgyXCJcbiAgICB9LFxuICAgIFwiNTAyZGNkZjA0OTkyODE4ZGNiYWVkMTI1YWQ3MTFiNDQ2ZGVlNGM2OFwiOiB7XG4gICAgICAgIG5hbWU6IFwiRGFyayAvIEludGVyYWN0aXZlIFRleHQgJiBJY29ucyAvIEhvdmVyICgyMDApXCIsXG4gICAgICAgIG1hcHNUb05hbWU6IFwiTGlnaHQgLyBJbnRlcmFjdGl2ZSBUZXh0ICYgSWNvbnMgLyBIb3ZlciAoNzAwKVwiLFxuICAgICAgICBtYXBzVG9LZXk6IFwiZTk1NDJlOTVhZGYzYmJlNzQyODZjMmNmMjc5ZmVlNjRmN2JhMzI3OVwiXG4gICAgfSxcbiAgICBcIjNlZGRjMTVlOTBiYmQ3MDY0YWVhN2NjMTNkYzEzZTIzYTcxMmYwYjBcIjoge1xuICAgICAgICBuYW1lOiBcIkRhcmsgLyBJbnRlcmFjdGl2ZSBUZXh0ICYgSWNvbnMgLyBBY3RpdmUgKFdoaXRlKVwiLFxuICAgICAgICBtYXBzVG9OYW1lOiBcIkxpZ2h0IC8gSW50ZXJhY3RpdmUgVGV4dCAmIEljb25zIC8gQWN0aXZlICg5MDApXCIsXG4gICAgICAgIG1hcHNUb0tleTogXCI2MjBjOThlOGY5MjU1YTYxMDdkZWU5MTc0NTY2OWU1YjcwMmI0MTNjXCJcbiAgICB9LFxuICAgIGZhNjk4YWEyYTcyNDUyMmE3YzI5ZWZiMGE2NjJhZWM3NWExYmU1YTE6IHtcbiAgICAgICAgbmFtZTogXCJEYXJrIC8gSW50ZXJhY3RpdmUgVGV4dCAmIEljb25zIC8gTXV0ZWQgKDUwMClcIixcbiAgICAgICAgbWFwc1RvTmFtZTogXCJMaWdodCAvIEludGVyYWN0aXZlIFRleHQgJiBJY29ucyAvIE11dGVkICgzMDApXCIsXG4gICAgICAgIG1hcHNUb0tleTogXCI5MzI4Y2Q3OGEzOTE0OWIwNzBkNjhmOThkOWZlNGRmN2E5MmJmNjdkXCJcbiAgICB9LFxuICAgIFwiNGI5M2Q0MGY2MWJlMTVlMjU1ZTg3OTQ4YTcxNTUyMWMzYWU5NTdlNlwiOiB7XG4gICAgICAgIG5hbWU6IFwiRGFyayAvIEJhY2tncm91bmQgLyBQcmltYXJ5ICg2MDApXCIsXG4gICAgICAgIG1hcHNUb05hbWU6IFwiTGlnaHQgLyBCYWNrZ3JvdW5kIC8gUHJpbWFyeSAoV2hpdGUpXCIsXG4gICAgICAgIG1hcHNUb0tleTogXCIyNDQ5YTI5ODNkNDM3OTNkODBiYWEyMGM2YzYwZThhNDhlN2YzYTBjXCJcbiAgICB9LFxuICAgIGZiMTM1OGU1YmQ2ZGVjMDcyODAxMjk4MjM4Y2Y0OWZmNzdiNzlhNGI6IHtcbiAgICAgICAgbmFtZTogXCJEYXJrIC8gQmFja2dyb3VuZCAvIFNlY29uZGFyeSAoNjMwKVwiLFxuICAgICAgICBtYXBzVG9OYW1lOiBcIkxpZ2h0IC8gQmFja2dyb3VuZCAvIFNlY29uZGFyeSAoMTMwKVwiLFxuICAgICAgICBtYXBzVG9LZXk6IFwiODM3MDQyNzhjODQ1YTZhN2NlYjFmODM3Mzg3OTcyY2NiNmQ0MTk2MFwiXG4gICAgfSxcbiAgICBlZjE3OWI2YWJlNmNiODc3OTg1N2UwNWE2MzMzZDMzZjdhMmI5MzIwOiB7XG4gICAgICAgIG5hbWU6IFwiRGFyayAvIEJhY2tncm91bmQgLyBUZXJ0aWFyeSAoNzAwKVwiLFxuICAgICAgICBtYXBzVG9OYW1lOiBcIkxpZ2h0IC8gQmFja2dyb3VuZCAvIFRlcnRpYXJ5ICgyMDApXCIsXG4gICAgICAgIG1hcHNUb0tleTogXCJkYmQwMmE3NmI3Yjc3YzE5NzYxMTRjMDQwNjhmMGZiYzIyMDE1ZmFiXCJcbiAgICB9LFxuICAgIFwiM2RkMGUzMGNlMGE4Mjg3ZWI5MWVjMWZiZWZmOTIwMzFlNjM0ZWQwMVwiOiB7XG4gICAgICAgIG5hbWU6IFwiRGFyayAvIEJhY2tncm91bmQgLyBBY2NlbnQgKDUwMClcIixcbiAgICAgICAgbWFwc1RvTmFtZTogXCJMaWdodCAvIEludGVyYWN0aXZlIFRleHQgJiBJY29ucyAvIE11dGVkICgzMDApXCIsXG4gICAgICAgIG1hcHNUb0tleTogXCI5MzI4Y2Q3OGEzOTE0OWIwNzBkNjhmOThkOWZlNGRmN2E5MmJmNjdkXCJcbiAgICB9LFxuICAgIFwiMTE1MTZmNGI0M2YzODFhZmI1YTZiZGYyYzM0Yjk0MzdmMGVlY2RlMVwiOiB7XG4gICAgICAgIG5hbWU6IFwiRGFyayAvIEJhY2tncm91bmQgLyBGbG9hdGluZyAoODAwKVwiLFxuICAgICAgICBtYXBzVG9OYW1lOiBcIkxpZ2h0IC8gQmFja2dyb3VuZCAvIEZsb2F0aW5nIChXaGl0ZSlcIixcbiAgICAgICAgbWFwc1RvS2V5OiBcIjZjOGIwOGE0MmY5NjE0ODQyZTg4MGJmN2JiNzk1MDE0ZDhmYmFlOTRcIlxuICAgIH0sXG4gICAgZDZjOTI3MDgzNGIxMWM5OWVlNjUxZjBmNTA3MmFkMmM2MzcwMTE2NToge1xuICAgICAgICBuYW1lOiBcIkRhcmsgLyBCYWNrZ3JvdW5kIE1vZCAvIEhvdmVyXCIsXG4gICAgICAgIG1hcHNUb05hbWU6IFwiTGlnaHQgLyBCYWNrZ3JvdW5kIE1vZCAvIEhvdmVyXCIsXG4gICAgICAgIG1hcHNUb0tleTogXCIzNTMwNzM5NmFlMjlhYWViNTgzYWU2NTg5MWM2OWVjNjg5ZjBjNDFlXCJcbiAgICB9LFxuICAgIGJjZjg5MGQ3YTIxNWM2NWRlZWY5N2ZiM2QzZjViY2ViYzk4NjliYWI6IHtcbiAgICAgICAgbmFtZTogXCJEYXJrIC8gQmFja2dyb3VuZCBNb2QgLyBBY3RpdmVcIixcbiAgICAgICAgbWFwc1RvTmFtZTogXCJMaWdodCAvIEJhY2tncm91bmQgTW9kIC8gQWN0aXZlXCIsXG4gICAgICAgIG1hcHNUb0tleTogXCJkZGFkZjc2OTE5ZDliYWNiOTI1MjQyYTAyNGRjMWUyZjVmNTE3YTQ2XCJcbiAgICB9LFxuICAgIGNlMDEyZGI0MmYzNWZiNThiNGZlMWQ2ZDhiNDZjNDkwNWE4ZmFkMGE6IHtcbiAgICAgICAgbmFtZTogXCJEYXJrIC8gQmFja2dyb3VuZCBNb2QgLyBTZWxlY3RlZFwiLFxuICAgICAgICBtYXBzVG9OYW1lOiBcIkxpZ2h0IC8gQmFja2dyb3VuZCBNb2QgLyBTZWxlY3RlZFwiLFxuICAgICAgICBtYXBzVG9LZXk6IFwiNWFmMmVhZjE0OTAxNDcyYzI2YjY0MTk5Nzc5NmJkYmE3NmVlMTc5NFwiXG4gICAgfSxcbiAgICBhNmEzZGMxNTNmMGU1ODk0MDgxODYxNzZlYmY4ZjIwZWQyZjliZGEzOiB7XG4gICAgICAgIG5hbWU6IFwiRGFyayAvIEJhY2tncm91bmQgTW9kIC8gQWNjZW50XCIsXG4gICAgICAgIG1hcHNUb05hbWU6IFwiTGlnaHQgLyBCYWNrZ3JvdW5kIE1vZCAvIEFjY2VudFwiLFxuICAgICAgICBtYXBzVG9LZXk6IFwiMDhjNzA5MWY4ZDY5NTBkYzNmNjE2YWZlOGVkNDViMDg2ZjkxMjRjN1wiXG4gICAgfVxufTtcbmV4cG9ydCB7IGRhcmtUaGVtZSB9O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==