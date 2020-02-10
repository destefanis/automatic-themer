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
figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
    if (msg.type === 'run-app') {
        const nodes = [];
        console.log(msg.message);
        figma.ui.postMessage({
            type: 'theme-selected',
            message: `Dark Theme Applied`,
        });
        if (figma.currentPage.selection.length === 0) {
            const frameNodes = figma.currentPage.children;
            const allNodes = figma.currentPage.findAll();
            allNodes.map(selected => updateTheme(selected));
        }
        else if (figma.currentPage.selection.length === 1) {
            let allNodes = figma.currentPage.selection[0].findAll();
            allNodes.unshift(figma.currentPage.selection[0]);
            allNodes.map(selected => updateTheme(selected));
        }
        else {
            let allNodes = [];
            let nodeLength = figma.currentPage.selection.length;
            for (let i = 0; i < nodeLength; i++) {
                allNodes.push(figma.currentPage.selection[i].findAll());
            }
            allNodes.forEach(function (selectedNode) {
                selectedNode.map(selected => updateTheme(selected));
            });
        }
    }
    function updateTheme(node) {
        switch (node.type) {
            case 'COMPONENT':
            case 'INSTANCE':
            case 'RECTANGLE':
            case 'ELLIPSE':
            case 'POLYGON':
            case 'STAR':
            case 'LINE':
            case 'BOOLEAN_OPERATION':
            case 'FRAME':
            case 'VECTOR': {
                if (node.fillStyleId) {
                    let style = figma.getStyleById(node.fillStyleId);
                    replaceStyles(node, style, _dark_theme__WEBPACK_IMPORTED_MODULE_0__["darkTheme"]);
                }
                else if (node.backgroundStyleId) {
                    let style = figma.getStyleById(node.backgroundStyleId);
                    replaceBackground(node, style, _dark_theme__WEBPACK_IMPORTED_MODULE_0__["darkTheme"]);
                }
                break;
            }
            case 'TEXT': {
                if (node.fillStyleId) {
                    let style = figma.getStyleById(node.fillStyleId);
                    replaceStyles(node, style, _dark_theme__WEBPACK_IMPORTED_MODULE_0__["darkTheme"]);
                }
            }
            default: {
            }
        }
    }
    function replaceStyles(node, style, mappings) {
        let importedStyle = figma.importStyleByKeyAsync(style.key);
        importedStyle.then((object) => {
            if (mappings[object.key] !== undefined) {
                let mappingStyle = mappings[object.key];
                let newStyle = figma.importStyleByKeyAsync(mappingStyle.mapsToKey);
                newStyle.then(function (object) {
                    node.fillStyleId = object.id;
                });
            }
        });
    }
    function replaceBackground(node, style, mappings) {
        let importedStyle = figma.importStyleByKeyAsync(style.key);
        importedStyle.then((object) => {
            if (mappings[object.key] !== undefined) {
                let mappingStyle = mappings[object.key];
                let newStyle = figma.importStyleByKeyAsync(mappingStyle.mapsToKey);
                newStyle.then(function (object) {
                    node.backgroundStyleId = object.id;
                });
            }
        });
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
    '5c1691cbeaaf4270107d34f1a12f02fdd04afa02': {
        name: 'Dark / Header / Primary (White)',
        mapsToName: "Light / Header / Primary (900)",
        mapsToKey: 'b19a14675b8adeb1528ab5f84e57b2eeed10d46c',
    },
    'bc090cb3b1c7313ae276acbd791b5b87b478ec59': {
        name: "Dark / Header / Secondary (300)",
        mapsToName: "Light / Header / Secondary (600)",
        mapsToKey: "608f2ea1aa64ff7f202e8c22cc4147a02be9d85b",
    },
    "5c77a96137b698b5575557c069cabd6877d66e1e": {
        name: 'Dark / Text / Normal (200)',
        mapsToName: "Light / Text / Normal (700)",
        mapsToKey: "546c7d46e754ac2b23b338783d72f206b77b6436",
    },
    '5d84ad92f3ad152f196e2093a3c0542a08dfba11': {
        name: "Dark / Text / Muted (400)",
        mapsToName: "Light / Text / Muted (500)",
        mapsToKey: "7d8703ec132ddaf6968f6d190d1e80031c559d7c",
    },
    'bf03232753079bdd5bec6c55343b659876b5283f': {
        name: "Dark / Text / Link",
        mapsToName: "Light / Text / Link",
        mapsToKey: "64d3058dd508a4985670b2d19418a06a3503c9c2",
    },
    '287463bade90c1eed5ea4cb0b5d63794daa8aec2': {
        name: "Dark / Interactive Text & Icons / Normal (300)",
        mapsToName: "Light / Interactive Text & Icons / Normal (600)",
        mapsToKey: "9c23a031773711e026394f4354661c37ee5b4682",
    },
    '502dcdf04992818dcbaed125ad711b446dee4c68': {
        name: "Dark / Interactive Text & Icons / Hover (200)",
        mapsToName: "Light / Interactive Text & Icons / Hover (700)",
        mapsToKey: "e9542e95adf3bbe74286c2cf279fee64f7ba3279",
    },
    '3eddc15e90bbd7064aea7cc13dc13e23a712f0b0': {
        name: "Dark / Interactive Text & Icons / Active (White)",
        mapsToName: "Light / Interactive Text & Icons / Active (900)",
        mapsToKey: "620c98e8f9255a6107dee91745669e5b702b413c",
    },
    'fa698aa2a724522a7c29efb0a662aec75a1be5a1': {
        name: "Dark / Interactive Text & Icons / Muted (500)",
        mapsToName: "Light / Interactive Text & Icons / Muted (300)",
        mapsToKey: "9328cd78a39149b070d68f98d9fe4df7a92bf67d",
    },
    '4b93d40f61be15e255e87948a715521c3ae957e6': {
        name: 'Dark / Background / Primary (600)',
        mapsToName: "Light / Background / Primary (White)",
        mapsToKey: "2449a2983d43793d80baa20c6c60e8a48e7f3a0c",
    },
    'fb1358e5bd6dec072801298238cf49ff77b79a4b': {
        name: "Dark / Background / Secondary (630)",
        mapsToName: "Light / Background / Secondary (130)",
        mapsToKey: "83704278c845a6a7ceb1f837387972ccb6d41960",
    },
    "ef179b6abe6cb8779857e05a6333d33f7a2b9320": {
        name: "Dark / Background / Tertiary (700)",
        mapsToName: "Light / Background / Tertiary (200)",
        mapsToKey: "dbd02a76b7b77c1976114c04068f0fbc22015fab",
    },
    "3dd0e30ce0a8287eb91ec1fbeff92031e634ed01": {
        name: "Dark / Background / Accent (500)",
        mapsToName: "Light / Interactive Text & Icons / Muted (300)",
        mapsToKey: "9328cd78a39149b070d68f98d9fe4df7a92bf67d",
    },
    "11516f4b43f381afb5a6bdf2c34b9437f0eecde1": {
        name: "Dark / Background / Floating (800)",
        mapsToName: "Light / Background / Floating (White)",
        mapsToKey: "6c8b08a42f9614842e880bf7bb795014d8fbae94",
    },
    'd6c9270834b11c99ee651f0f5072ad2c63701165': {
        name: 'Dark / Background Mod / Hover',
        mapsToName: "Light / Background Mod / Hover",
        mapsToKey: "35307396ae29aaeb583ae65891c69ec689f0c41e",
    },
    "bcf890d7a215c65deef97fb3d3f5bcebc9869bab": {
        name: "Dark / Background Mod / Active",
        mapsToName: "Light / Background Mod / Active",
        mapsToKey: "ddadf76919d9bacb925242a024dc1e2f5f517a46",
    },
    "ce012db42f35fb58b4fe1d6d8b46c4905a8fad0a": {
        name: "Dark / Background Mod / Selected",
        mapsToName: "Light / Background Mod / Selected",
        mapsToKey: "5af2eaf14901472c26b641997796bdba76ee1794",
    },
    "a6a3dc153f0e589408186176ebf8f20ed2f9bda3": {
        name: "Dark / Background Mod / Accent",
        mapsToName: "Light / Background Mod / Accent",
        mapsToKey: "08c7091f8d6950dc3f616afe8ed45b086f9124c7",
    },
};



/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3BsdWdpbi9jb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9wbHVnaW4vZGFyay10aGVtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUN5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixnQkFBZ0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MscURBQVM7QUFDeEQ7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELHFEQUFTO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxxREFBUztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLFNBQVM7QUFDVDtBQUNBOzs7Ozs7Ozs7Ozs7O0FDdkZBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3FCIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9wbHVnaW4vY29udHJvbGxlci50c1wiKTtcbiIsImZpZ21hLnNob3dVSShfX2h0bWxfXyk7XG5pbXBvcnQgeyBkYXJrVGhlbWUgfSBmcm9tIFwiLi9kYXJrLXRoZW1lXCI7XG5maWdtYS51aS5vbm1lc3NhZ2UgPSAobXNnKSA9PiB7XG4gICAgaWYgKG1zZy50eXBlID09PSAncnVuLWFwcCcpIHtcbiAgICAgICAgY29uc3Qgbm9kZXMgPSBbXTtcbiAgICAgICAgY29uc29sZS5sb2cobXNnLm1lc3NhZ2UpO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICB0eXBlOiAndGhlbWUtc2VsZWN0ZWQnLFxuICAgICAgICAgICAgbWVzc2FnZTogYERhcmsgVGhlbWUgQXBwbGllZGAsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc3QgZnJhbWVOb2RlcyA9IGZpZ21hLmN1cnJlbnRQYWdlLmNoaWxkcmVuO1xuICAgICAgICAgICAgY29uc3QgYWxsTm9kZXMgPSBmaWdtYS5jdXJyZW50UGFnZS5maW5kQWxsKCk7XG4gICAgICAgICAgICBhbGxOb2Rlcy5tYXAoc2VsZWN0ZWQgPT4gdXBkYXRlVGhlbWUoc2VsZWN0ZWQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBsZXQgYWxsTm9kZXMgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0uZmluZEFsbCgpO1xuICAgICAgICAgICAgYWxsTm9kZXMudW5zaGlmdChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0pO1xuICAgICAgICAgICAgYWxsTm9kZXMubWFwKHNlbGVjdGVkID0+IHVwZGF0ZVRoZW1lKHNlbGVjdGVkKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgYWxsTm9kZXMgPSBbXTtcbiAgICAgICAgICAgIGxldCBub2RlTGVuZ3RoID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aDtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZUxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYWxsTm9kZXMucHVzaChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25baV0uZmluZEFsbCgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFsbE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKHNlbGVjdGVkTm9kZSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkTm9kZS5tYXAoc2VsZWN0ZWQgPT4gdXBkYXRlVGhlbWUoc2VsZWN0ZWQpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRoZW1lKG5vZGUpIHtcbiAgICAgICAgc3dpdGNoIChub2RlLnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ0NPTVBPTkVOVCc6XG4gICAgICAgICAgICBjYXNlICdJTlNUQU5DRSc6XG4gICAgICAgICAgICBjYXNlICdSRUNUQU5HTEUnOlxuICAgICAgICAgICAgY2FzZSAnRUxMSVBTRSc6XG4gICAgICAgICAgICBjYXNlICdQT0xZR09OJzpcbiAgICAgICAgICAgIGNhc2UgJ1NUQVInOlxuICAgICAgICAgICAgY2FzZSAnTElORSc6XG4gICAgICAgICAgICBjYXNlICdCT09MRUFOX09QRVJBVElPTic6XG4gICAgICAgICAgICBjYXNlICdGUkFNRSc6XG4gICAgICAgICAgICBjYXNlICdWRUNUT1InOiB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuZmlsbFN0eWxlSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0eWxlID0gZmlnbWEuZ2V0U3R5bGVCeUlkKG5vZGUuZmlsbFN0eWxlSWQpO1xuICAgICAgICAgICAgICAgICAgICByZXBsYWNlU3R5bGVzKG5vZGUsIHN0eWxlLCBkYXJrVGhlbWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChub2RlLmJhY2tncm91bmRTdHlsZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHlsZSA9IGZpZ21hLmdldFN0eWxlQnlJZChub2RlLmJhY2tncm91bmRTdHlsZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgcmVwbGFjZUJhY2tncm91bmQobm9kZSwgc3R5bGUsIGRhcmtUaGVtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAnVEVYVCc6IHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZS5maWxsU3R5bGVJZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3R5bGUgPSBmaWdtYS5nZXRTdHlsZUJ5SWQobm9kZS5maWxsU3R5bGVJZCk7XG4gICAgICAgICAgICAgICAgICAgIHJlcGxhY2VTdHlsZXMobm9kZSwgc3R5bGUsIGRhcmtUaGVtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlcGxhY2VTdHlsZXMobm9kZSwgc3R5bGUsIG1hcHBpbmdzKSB7XG4gICAgICAgIGxldCBpbXBvcnRlZFN0eWxlID0gZmlnbWEuaW1wb3J0U3R5bGVCeUtleUFzeW5jKHN0eWxlLmtleSk7XG4gICAgICAgIGltcG9ydGVkU3R5bGUudGhlbigob2JqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAobWFwcGluZ3Nbb2JqZWN0LmtleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxldCBtYXBwaW5nU3R5bGUgPSBtYXBwaW5nc1tvYmplY3Qua2V5XTtcbiAgICAgICAgICAgICAgICBsZXQgbmV3U3R5bGUgPSBmaWdtYS5pbXBvcnRTdHlsZUJ5S2V5QXN5bmMobWFwcGluZ1N0eWxlLm1hcHNUb0tleSk7XG4gICAgICAgICAgICAgICAgbmV3U3R5bGUudGhlbihmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUuZmlsbFN0eWxlSWQgPSBvYmplY3QuaWQ7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiByZXBsYWNlQmFja2dyb3VuZChub2RlLCBzdHlsZSwgbWFwcGluZ3MpIHtcbiAgICAgICAgbGV0IGltcG9ydGVkU3R5bGUgPSBmaWdtYS5pbXBvcnRTdHlsZUJ5S2V5QXN5bmMoc3R5bGUua2V5KTtcbiAgICAgICAgaW1wb3J0ZWRTdHlsZS50aGVuKChvYmplY3QpID0+IHtcbiAgICAgICAgICAgIGlmIChtYXBwaW5nc1tvYmplY3Qua2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1hcHBpbmdTdHlsZSA9IG1hcHBpbmdzW29iamVjdC5rZXldO1xuICAgICAgICAgICAgICAgIGxldCBuZXdTdHlsZSA9IGZpZ21hLmltcG9ydFN0eWxlQnlLZXlBc3luYyhtYXBwaW5nU3R5bGUubWFwc1RvS2V5KTtcbiAgICAgICAgICAgICAgICBuZXdTdHlsZS50aGVuKGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5iYWNrZ3JvdW5kU3R5bGVJZCA9IG9iamVjdC5pZDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbiIsImNvbnN0IGRhcmtUaGVtZSA9IHtcbiAgICAnNWMxNjkxY2JlYWFmNDI3MDEwN2QzNGYxYTEyZjAyZmRkMDRhZmEwMic6IHtcbiAgICAgICAgbmFtZTogJ0RhcmsgLyBIZWFkZXIgLyBQcmltYXJ5IChXaGl0ZSknLFxuICAgICAgICBtYXBzVG9OYW1lOiBcIkxpZ2h0IC8gSGVhZGVyIC8gUHJpbWFyeSAoOTAwKVwiLFxuICAgICAgICBtYXBzVG9LZXk6ICdiMTlhMTQ2NzViOGFkZWIxNTI4YWI1Zjg0ZTU3YjJlZWVkMTBkNDZjJyxcbiAgICB9LFxuICAgICdiYzA5MGNiM2IxYzczMTNhZTI3NmFjYmQ3OTFiNWI4N2I0NzhlYzU5Jzoge1xuICAgICAgICBuYW1lOiBcIkRhcmsgLyBIZWFkZXIgLyBTZWNvbmRhcnkgKDMwMClcIixcbiAgICAgICAgbWFwc1RvTmFtZTogXCJMaWdodCAvIEhlYWRlciAvIFNlY29uZGFyeSAoNjAwKVwiLFxuICAgICAgICBtYXBzVG9LZXk6IFwiNjA4ZjJlYTFhYTY0ZmY3ZjIwMmU4YzIyY2M0MTQ3YTAyYmU5ZDg1YlwiLFxuICAgIH0sXG4gICAgXCI1Yzc3YTk2MTM3YjY5OGI1NTc1NTU3YzA2OWNhYmQ2ODc3ZDY2ZTFlXCI6IHtcbiAgICAgICAgbmFtZTogJ0RhcmsgLyBUZXh0IC8gTm9ybWFsICgyMDApJyxcbiAgICAgICAgbWFwc1RvTmFtZTogXCJMaWdodCAvIFRleHQgLyBOb3JtYWwgKDcwMClcIixcbiAgICAgICAgbWFwc1RvS2V5OiBcIjU0NmM3ZDQ2ZTc1NGFjMmIyM2IzMzg3ODNkNzJmMjA2Yjc3YjY0MzZcIixcbiAgICB9LFxuICAgICc1ZDg0YWQ5MmYzYWQxNTJmMTk2ZTIwOTNhM2MwNTQyYTA4ZGZiYTExJzoge1xuICAgICAgICBuYW1lOiBcIkRhcmsgLyBUZXh0IC8gTXV0ZWQgKDQwMClcIixcbiAgICAgICAgbWFwc1RvTmFtZTogXCJMaWdodCAvIFRleHQgLyBNdXRlZCAoNTAwKVwiLFxuICAgICAgICBtYXBzVG9LZXk6IFwiN2Q4NzAzZWMxMzJkZGFmNjk2OGY2ZDE5MGQxZTgwMDMxYzU1OWQ3Y1wiLFxuICAgIH0sXG4gICAgJ2JmMDMyMzI3NTMwNzliZGQ1YmVjNmM1NTM0M2I2NTk4NzZiNTI4M2YnOiB7XG4gICAgICAgIG5hbWU6IFwiRGFyayAvIFRleHQgLyBMaW5rXCIsXG4gICAgICAgIG1hcHNUb05hbWU6IFwiTGlnaHQgLyBUZXh0IC8gTGlua1wiLFxuICAgICAgICBtYXBzVG9LZXk6IFwiNjRkMzA1OGRkNTA4YTQ5ODU2NzBiMmQxOTQxOGEwNmEzNTAzYzljMlwiLFxuICAgIH0sXG4gICAgJzI4NzQ2M2JhZGU5MGMxZWVkNWVhNGNiMGI1ZDYzNzk0ZGFhOGFlYzInOiB7XG4gICAgICAgIG5hbWU6IFwiRGFyayAvIEludGVyYWN0aXZlIFRleHQgJiBJY29ucyAvIE5vcm1hbCAoMzAwKVwiLFxuICAgICAgICBtYXBzVG9OYW1lOiBcIkxpZ2h0IC8gSW50ZXJhY3RpdmUgVGV4dCAmIEljb25zIC8gTm9ybWFsICg2MDApXCIsXG4gICAgICAgIG1hcHNUb0tleTogXCI5YzIzYTAzMTc3MzcxMWUwMjYzOTRmNDM1NDY2MWMzN2VlNWI0NjgyXCIsXG4gICAgfSxcbiAgICAnNTAyZGNkZjA0OTkyODE4ZGNiYWVkMTI1YWQ3MTFiNDQ2ZGVlNGM2OCc6IHtcbiAgICAgICAgbmFtZTogXCJEYXJrIC8gSW50ZXJhY3RpdmUgVGV4dCAmIEljb25zIC8gSG92ZXIgKDIwMClcIixcbiAgICAgICAgbWFwc1RvTmFtZTogXCJMaWdodCAvIEludGVyYWN0aXZlIFRleHQgJiBJY29ucyAvIEhvdmVyICg3MDApXCIsXG4gICAgICAgIG1hcHNUb0tleTogXCJlOTU0MmU5NWFkZjNiYmU3NDI4NmMyY2YyNzlmZWU2NGY3YmEzMjc5XCIsXG4gICAgfSxcbiAgICAnM2VkZGMxNWU5MGJiZDcwNjRhZWE3Y2MxM2RjMTNlMjNhNzEyZjBiMCc6IHtcbiAgICAgICAgbmFtZTogXCJEYXJrIC8gSW50ZXJhY3RpdmUgVGV4dCAmIEljb25zIC8gQWN0aXZlIChXaGl0ZSlcIixcbiAgICAgICAgbWFwc1RvTmFtZTogXCJMaWdodCAvIEludGVyYWN0aXZlIFRleHQgJiBJY29ucyAvIEFjdGl2ZSAoOTAwKVwiLFxuICAgICAgICBtYXBzVG9LZXk6IFwiNjIwYzk4ZThmOTI1NWE2MTA3ZGVlOTE3NDU2NjllNWI3MDJiNDEzY1wiLFxuICAgIH0sXG4gICAgJ2ZhNjk4YWEyYTcyNDUyMmE3YzI5ZWZiMGE2NjJhZWM3NWExYmU1YTEnOiB7XG4gICAgICAgIG5hbWU6IFwiRGFyayAvIEludGVyYWN0aXZlIFRleHQgJiBJY29ucyAvIE11dGVkICg1MDApXCIsXG4gICAgICAgIG1hcHNUb05hbWU6IFwiTGlnaHQgLyBJbnRlcmFjdGl2ZSBUZXh0ICYgSWNvbnMgLyBNdXRlZCAoMzAwKVwiLFxuICAgICAgICBtYXBzVG9LZXk6IFwiOTMyOGNkNzhhMzkxNDliMDcwZDY4Zjk4ZDlmZTRkZjdhOTJiZjY3ZFwiLFxuICAgIH0sXG4gICAgJzRiOTNkNDBmNjFiZTE1ZTI1NWU4Nzk0OGE3MTU1MjFjM2FlOTU3ZTYnOiB7XG4gICAgICAgIG5hbWU6ICdEYXJrIC8gQmFja2dyb3VuZCAvIFByaW1hcnkgKDYwMCknLFxuICAgICAgICBtYXBzVG9OYW1lOiBcIkxpZ2h0IC8gQmFja2dyb3VuZCAvIFByaW1hcnkgKFdoaXRlKVwiLFxuICAgICAgICBtYXBzVG9LZXk6IFwiMjQ0OWEyOTgzZDQzNzkzZDgwYmFhMjBjNmM2MGU4YTQ4ZTdmM2EwY1wiLFxuICAgIH0sXG4gICAgJ2ZiMTM1OGU1YmQ2ZGVjMDcyODAxMjk4MjM4Y2Y0OWZmNzdiNzlhNGInOiB7XG4gICAgICAgIG5hbWU6IFwiRGFyayAvIEJhY2tncm91bmQgLyBTZWNvbmRhcnkgKDYzMClcIixcbiAgICAgICAgbWFwc1RvTmFtZTogXCJMaWdodCAvIEJhY2tncm91bmQgLyBTZWNvbmRhcnkgKDEzMClcIixcbiAgICAgICAgbWFwc1RvS2V5OiBcIjgzNzA0Mjc4Yzg0NWE2YTdjZWIxZjgzNzM4Nzk3MmNjYjZkNDE5NjBcIixcbiAgICB9LFxuICAgIFwiZWYxNzliNmFiZTZjYjg3Nzk4NTdlMDVhNjMzM2QzM2Y3YTJiOTMyMFwiOiB7XG4gICAgICAgIG5hbWU6IFwiRGFyayAvIEJhY2tncm91bmQgLyBUZXJ0aWFyeSAoNzAwKVwiLFxuICAgICAgICBtYXBzVG9OYW1lOiBcIkxpZ2h0IC8gQmFja2dyb3VuZCAvIFRlcnRpYXJ5ICgyMDApXCIsXG4gICAgICAgIG1hcHNUb0tleTogXCJkYmQwMmE3NmI3Yjc3YzE5NzYxMTRjMDQwNjhmMGZiYzIyMDE1ZmFiXCIsXG4gICAgfSxcbiAgICBcIjNkZDBlMzBjZTBhODI4N2ViOTFlYzFmYmVmZjkyMDMxZTYzNGVkMDFcIjoge1xuICAgICAgICBuYW1lOiBcIkRhcmsgLyBCYWNrZ3JvdW5kIC8gQWNjZW50ICg1MDApXCIsXG4gICAgICAgIG1hcHNUb05hbWU6IFwiTGlnaHQgLyBJbnRlcmFjdGl2ZSBUZXh0ICYgSWNvbnMgLyBNdXRlZCAoMzAwKVwiLFxuICAgICAgICBtYXBzVG9LZXk6IFwiOTMyOGNkNzhhMzkxNDliMDcwZDY4Zjk4ZDlmZTRkZjdhOTJiZjY3ZFwiLFxuICAgIH0sXG4gICAgXCIxMTUxNmY0YjQzZjM4MWFmYjVhNmJkZjJjMzRiOTQzN2YwZWVjZGUxXCI6IHtcbiAgICAgICAgbmFtZTogXCJEYXJrIC8gQmFja2dyb3VuZCAvIEZsb2F0aW5nICg4MDApXCIsXG4gICAgICAgIG1hcHNUb05hbWU6IFwiTGlnaHQgLyBCYWNrZ3JvdW5kIC8gRmxvYXRpbmcgKFdoaXRlKVwiLFxuICAgICAgICBtYXBzVG9LZXk6IFwiNmM4YjA4YTQyZjk2MTQ4NDJlODgwYmY3YmI3OTUwMTRkOGZiYWU5NFwiLFxuICAgIH0sXG4gICAgJ2Q2YzkyNzA4MzRiMTFjOTllZTY1MWYwZjUwNzJhZDJjNjM3MDExNjUnOiB7XG4gICAgICAgIG5hbWU6ICdEYXJrIC8gQmFja2dyb3VuZCBNb2QgLyBIb3ZlcicsXG4gICAgICAgIG1hcHNUb05hbWU6IFwiTGlnaHQgLyBCYWNrZ3JvdW5kIE1vZCAvIEhvdmVyXCIsXG4gICAgICAgIG1hcHNUb0tleTogXCIzNTMwNzM5NmFlMjlhYWViNTgzYWU2NTg5MWM2OWVjNjg5ZjBjNDFlXCIsXG4gICAgfSxcbiAgICBcImJjZjg5MGQ3YTIxNWM2NWRlZWY5N2ZiM2QzZjViY2ViYzk4NjliYWJcIjoge1xuICAgICAgICBuYW1lOiBcIkRhcmsgLyBCYWNrZ3JvdW5kIE1vZCAvIEFjdGl2ZVwiLFxuICAgICAgICBtYXBzVG9OYW1lOiBcIkxpZ2h0IC8gQmFja2dyb3VuZCBNb2QgLyBBY3RpdmVcIixcbiAgICAgICAgbWFwc1RvS2V5OiBcImRkYWRmNzY5MTlkOWJhY2I5MjUyNDJhMDI0ZGMxZTJmNWY1MTdhNDZcIixcbiAgICB9LFxuICAgIFwiY2UwMTJkYjQyZjM1ZmI1OGI0ZmUxZDZkOGI0NmM0OTA1YThmYWQwYVwiOiB7XG4gICAgICAgIG5hbWU6IFwiRGFyayAvIEJhY2tncm91bmQgTW9kIC8gU2VsZWN0ZWRcIixcbiAgICAgICAgbWFwc1RvTmFtZTogXCJMaWdodCAvIEJhY2tncm91bmQgTW9kIC8gU2VsZWN0ZWRcIixcbiAgICAgICAgbWFwc1RvS2V5OiBcIjVhZjJlYWYxNDkwMTQ3MmMyNmI2NDE5OTc3OTZiZGJhNzZlZTE3OTRcIixcbiAgICB9LFxuICAgIFwiYTZhM2RjMTUzZjBlNTg5NDA4MTg2MTc2ZWJmOGYyMGVkMmY5YmRhM1wiOiB7XG4gICAgICAgIG5hbWU6IFwiRGFyayAvIEJhY2tncm91bmQgTW9kIC8gQWNjZW50XCIsXG4gICAgICAgIG1hcHNUb05hbWU6IFwiTGlnaHQgLyBCYWNrZ3JvdW5kIE1vZCAvIEFjY2VudFwiLFxuICAgICAgICBtYXBzVG9LZXk6IFwiMDhjNzA5MWY4ZDY5NTBkYzNmNjE2YWZlOGVkNDViMDg2ZjkxMjRjN1wiLFxuICAgIH0sXG59O1xuZXhwb3J0IHsgZGFya1RoZW1lIH07XG4iXSwic291cmNlUm9vdCI6IiJ9