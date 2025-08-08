"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/dashboard/transactions/route";
exports.ids = ["app/api/dashboard/transactions/route"];
exports.modules = {

/***/ "@prisma/client/runtime/library.js":
/*!****************************************************!*\
  !*** external "@prisma/client/runtime/library.js" ***!
  \****************************************************/
/***/ ((module) => {

module.exports = require("@prisma/client/runtime/library.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist\\client\\components\\action-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist\\client\\components\\action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist\\client\\components\\request-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist\\client\\components\\request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!*********************************************************************************************!*\
  !*** external "next/dist\\client\\components\\static-generation-async-storage.external.js" ***!
  \*********************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist\\client\\components\\static-generation-async-storage.external.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdashboard%2Ftransactions%2Froute&page=%2Fapi%2Fdashboard%2Ftransactions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Ftransactions%2Froute.ts&appDir=C%3A%5CUsers%5CGiiT%5CDesktop%5Ccashflow%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CGiiT%5CDesktop%5Ccashflow&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdashboard%2Ftransactions%2Froute&page=%2Fapi%2Fdashboard%2Ftransactions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Ftransactions%2Froute.ts&appDir=C%3A%5CUsers%5CGiiT%5CDesktop%5Ccashflow%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CGiiT%5CDesktop%5Ccashflow&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_GiiT_Desktop_cashflow_app_api_dashboard_transactions_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/dashboard/transactions/route.ts */ \"(rsc)/./app/api/dashboard/transactions/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/dashboard/transactions/route\",\n        pathname: \"/api/dashboard/transactions\",\n        filename: \"route\",\n        bundlePath: \"app/api/dashboard/transactions/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\GiiT\\\\Desktop\\\\cashflow\\\\app\\\\api\\\\dashboard\\\\transactions\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_GiiT_Desktop_cashflow_app_api_dashboard_transactions_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/dashboard/transactions/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZkYXNoYm9hcmQlMkZ0cmFuc2FjdGlvbnMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmRhc2hib2FyZCUyRnRyYW5zYWN0aW9ucyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmRhc2hib2FyZCUyRnRyYW5zYWN0aW9ucyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNHaWlUJTVDRGVza3RvcCU1Q2Nhc2hmbG93JTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNHaWlUJTVDRGVza3RvcCU1Q2Nhc2hmbG93JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQytCO0FBQzVHO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsdUdBQXVHO0FBQy9HO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDNko7O0FBRTdKIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2FzaGZsb3ctY29ubmVjdC8/NTk2OSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxHaWlUXFxcXERlc2t0b3BcXFxcY2FzaGZsb3dcXFxcYXBwXFxcXGFwaVxcXFxkYXNoYm9hcmRcXFxcdHJhbnNhY3Rpb25zXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9kYXNoYm9hcmQvdHJhbnNhY3Rpb25zL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvZGFzaGJvYXJkL3RyYW5zYWN0aW9uc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvZGFzaGJvYXJkL3RyYW5zYWN0aW9ucy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXEdpaVRcXFxcRGVza3RvcFxcXFxjYXNoZmxvd1xcXFxhcHBcXFxcYXBpXFxcXGRhc2hib2FyZFxcXFx0cmFuc2FjdGlvbnNcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgaGVhZGVySG9va3MsIHN0YXRpY0dlbmVyYXRpb25CYWlsb3V0IH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvZGFzaGJvYXJkL3RyYW5zYWN0aW9ucy9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBoZWFkZXJIb29rcywgc3RhdGljR2VuZXJhdGlvbkJhaWxvdXQsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdashboard%2Ftransactions%2Froute&page=%2Fapi%2Fdashboard%2Ftransactions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Ftransactions%2Froute.ts&appDir=C%3A%5CUsers%5CGiiT%5CDesktop%5Ccashflow%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CGiiT%5CDesktop%5Ccashflow&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/dashboard/transactions/route.ts":
/*!*************************************************!*\
  !*** ./app/api/dashboard/transactions/route.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(rsc)/./node_modules/next/dist/server/web/exports/next-response.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\n\n\nasync function GET(request) {\n    try {\n        const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_2__.authOptions);\n        if (!session?.user?.id) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                message: \"Unauthorized\"\n            }, {\n                status: 401\n            });\n        }\n        const transactions = await _lib_prisma__WEBPACK_IMPORTED_MODULE_3__.prisma.transaction.findMany({\n            where: {\n                userId: session.user.id\n            },\n            take: 5,\n            orderBy: {\n                createdAt: \"desc\"\n            },\n            include: {\n                agent: true\n            }\n        });\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            transactions\n        }, {\n            status: 200\n        });\n    } catch (error) {\n        console.error(\"Dashboard transactions error:\", error);\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            message: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2Rhc2hib2FyZC90cmFuc2FjdGlvbnMvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQXVEO0FBQ1g7QUFDSjtBQUNIO0FBRTlCLGVBQWVJLElBQUlDLE9BQW9CO0lBQzVDLElBQUk7UUFDRixNQUFNQyxVQUFVLE1BQU1MLDJEQUFnQkEsQ0FBQ0Msa0RBQVdBO1FBRWxELElBQUksQ0FBQ0ksU0FBU0MsTUFBTUMsSUFBSTtZQUN0QixPQUFPUixrRkFBWUEsQ0FBQ1MsSUFBSSxDQUN0QjtnQkFBRUMsU0FBUztZQUFlLEdBQzFCO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSxNQUFNQyxlQUFlLE1BQU1ULCtDQUFNQSxDQUFDVSxXQUFXLENBQUNDLFFBQVEsQ0FBQztZQUNyREMsT0FBTztnQkFBRUMsUUFBUVYsUUFBUUMsSUFBSSxDQUFDQyxFQUFFO1lBQUM7WUFDakNTLE1BQU07WUFDTkMsU0FBUztnQkFBRUMsV0FBVztZQUFPO1lBQzdCQyxTQUFTO2dCQUNQQyxPQUFPO1lBQ1Q7UUFDRjtRQUVBLE9BQU9yQixrRkFBWUEsQ0FBQ1MsSUFBSSxDQUN0QjtZQUFFRztRQUFhLEdBQ2Y7WUFBRUQsUUFBUTtRQUFJO0lBR2xCLEVBQUUsT0FBT1csT0FBTztRQUNkQyxRQUFRRCxLQUFLLENBQUMsaUNBQWlDQTtRQUMvQyxPQUFPdEIsa0ZBQVlBLENBQUNTLElBQUksQ0FDdEI7WUFBRUMsU0FBUztRQUF3QixHQUNuQztZQUFFQyxRQUFRO1FBQUk7SUFFbEI7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL2Nhc2hmbG93LWNvbm5lY3QvLi9hcHAvYXBpL2Rhc2hib2FyZC90cmFuc2FjdGlvbnMvcm91dGUudHM/NGI1MSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInXG5pbXBvcnQgeyBnZXRTZXJ2ZXJTZXNzaW9uIH0gZnJvbSAnbmV4dC1hdXRoJ1xuaW1wb3J0IHsgYXV0aE9wdGlvbnMgfSBmcm9tICdAL2xpYi9hdXRoJ1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJ1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpXG4gICAgXG4gICAgaWYgKCFzZXNzaW9uPy51c2VyPy5pZCkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgICB7IG1lc3NhZ2U6ICdVbmF1dGhvcml6ZWQnIH0sXG4gICAgICAgIHsgc3RhdHVzOiA0MDEgfVxuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IHRyYW5zYWN0aW9ucyA9IGF3YWl0IHByaXNtYS50cmFuc2FjdGlvbi5maW5kTWFueSh7XG4gICAgICB3aGVyZTogeyB1c2VySWQ6IHNlc3Npb24udXNlci5pZCB9LFxuICAgICAgdGFrZTogNSxcbiAgICAgIG9yZGVyQnk6IHsgY3JlYXRlZEF0OiAnZGVzYycgfSxcbiAgICAgIGluY2x1ZGU6IHtcbiAgICAgICAgYWdlbnQ6IHRydWVcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyB0cmFuc2FjdGlvbnMgfSxcbiAgICAgIHsgc3RhdHVzOiAyMDAgfVxuICAgIClcblxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Rhc2hib2FyZCB0cmFuc2FjdGlvbnMgZXJyb3I6JywgZXJyb3IpXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxuICAgICAgeyBtZXNzYWdlOiAnSW50ZXJuYWwgc2VydmVyIGVycm9yJyB9LFxuICAgICAgeyBzdGF0dXM6IDUwMCB9XG4gICAgKVxuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2V0U2VydmVyU2Vzc2lvbiIsImF1dGhPcHRpb25zIiwicHJpc21hIiwiR0VUIiwicmVxdWVzdCIsInNlc3Npb24iLCJ1c2VyIiwiaWQiLCJqc29uIiwibWVzc2FnZSIsInN0YXR1cyIsInRyYW5zYWN0aW9ucyIsInRyYW5zYWN0aW9uIiwiZmluZE1hbnkiLCJ3aGVyZSIsInVzZXJJZCIsInRha2UiLCJvcmRlckJ5IiwiY3JlYXRlZEF0IiwiaW5jbHVkZSIsImFnZW50IiwiZXJyb3IiLCJjb25zb2xlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/dashboard/transactions/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var _prisma__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\n\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                phone: {\n                    label: \"Phone\",\n                    type: \"text\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.phone || !credentials?.password) {\n                    throw new Error(\"Phone and password are required\");\n                }\n                let user;\n                try {\n                    user = await _prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n                        where: {\n                            phone: credentials.phone\n                        },\n                        include: {\n                            subscription: true,\n                            agentProfile: true\n                        }\n                    });\n                } catch (error) {\n                    console.log(\"Database error during auth, trying without subscription:\", error);\n                    // If there's a schema mismatch, try without including subscription\n                    user = await _prisma__WEBPACK_IMPORTED_MODULE_2__.prisma.user.findUnique({\n                        where: {\n                            phone: credentials.phone\n                        }\n                    });\n                }\n                if (!user || !user.password) {\n                    throw new Error(\"Invalid phone or password\");\n                }\n                const isValidPassword = await bcryptjs__WEBPACK_IMPORTED_MODULE_1__[\"default\"].compare(credentials.password, user.password);\n                if (!isValidPassword) {\n                    throw new Error(\"Invalid phone or password\");\n                }\n                if (!user.isVerified) {\n                    throw new Error(\"Please verify your account before logging in\");\n                }\n                return {\n                    id: user.id,\n                    phone: user.phone,\n                    email: user.email,\n                    name: user.name,\n                    role: user.role,\n                    image: user.image,\n                    kycCompleted: user.kycCompleted,\n                    subscription: user.subscription,\n                    agentProfile: user.agentProfile\n                };\n            }\n        })\n    ],\n    session: {\n        strategy: \"jwt\",\n        maxAge: 30 * 24 * 60 * 60\n    },\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.role = user.role;\n                token.phone = user.phone;\n                token.kycCompleted = user.kycCompleted;\n                token.subscription = user.subscription;\n                token.agentProfile = user.agentProfile;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (token) {\n                session.user.id = token.sub;\n                session.user.role = token.role;\n                session.user.phone = token.phone;\n                session.user.kycCompleted = token.kycCompleted;\n                session.user.subscription = token.subscription;\n                session.user.agentProfile = token.agentProfile;\n            }\n            return session;\n        }\n    },\n    pages: {\n        signIn: \"/auth/signin\",\n        error: \"/auth/error\"\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UUFBUWpCLElBQUksQ0FBQ0ksWUFBWSxHQUFHa0IsTUFBTWxCLFlBQVk7Z0JBQzlDYSxRQUFRakIsSUFBSSxDQUFDSyxZQUFZLEdBQUdpQixNQUFNakIsWUFBWTtZQUNoRDtZQUNBLE9BQU9ZO1FBQ1Q7SUFDRjtJQUNBTyxPQUFPO1FBQ0xDLFFBQVE7UUFDUm5CLE9BQU87SUFDVDtJQUNBb0IsUUFBUUMsUUFBUUMsR0FBRyxDQUFDQyxlQUFlO0FBQ3JDLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYXNoZmxvdy1jb25uZWN0Ly4vbGliL2F1dGgudHM/YmY3ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0QXV0aE9wdGlvbnMgfSBmcm9tICduZXh0LWF1dGgnXG5pbXBvcnQgQ3JlZGVudGlhbHNQcm92aWRlciBmcm9tICduZXh0LWF1dGgvcHJvdmlkZXJzL2NyZWRlbnRpYWxzJ1xuaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHRqcydcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJy4vcHJpc21hJ1xuaW1wb3J0IHsgVXNlclJvbGUgfSBmcm9tICdAcHJpc21hL2NsaWVudCdcblxuZXhwb3J0IGNvbnN0IGF1dGhPcHRpb25zOiBOZXh0QXV0aE9wdGlvbnMgPSB7XG4gIHByb3ZpZGVyczogW1xuICAgIENyZWRlbnRpYWxzUHJvdmlkZXIoe1xuICAgICAgbmFtZTogJ2NyZWRlbnRpYWxzJyxcbiAgICAgIGNyZWRlbnRpYWxzOiB7XG4gICAgICAgIHBob25lOiB7IGxhYmVsOiAnUGhvbmUnLCB0eXBlOiAndGV4dCcgfSxcbiAgICAgICAgcGFzc3dvcmQ6IHsgbGFiZWw6ICdQYXNzd29yZCcsIHR5cGU6ICdwYXNzd29yZCcgfVxuICAgICAgfSxcbiAgICAgIGFzeW5jIGF1dGhvcml6ZShjcmVkZW50aWFscykge1xuICAgICAgICBpZiAoIWNyZWRlbnRpYWxzPy5waG9uZSB8fCAhY3JlZGVudGlhbHM/LnBhc3N3b3JkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQaG9uZSBhbmQgcGFzc3dvcmQgYXJlIHJlcXVpcmVkJylcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB1c2VyXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoe1xuICAgICAgICAgICAgd2hlcmU6IHsgcGhvbmU6IGNyZWRlbnRpYWxzLnBob25lIH0sXG4gICAgICAgICAgICBpbmNsdWRlOiB7XG4gICAgICAgICAgICAgIHN1YnNjcmlwdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgYWdlbnRQcm9maWxlOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnRGF0YWJhc2UgZXJyb3IgZHVyaW5nIGF1dGgsIHRyeWluZyB3aXRob3V0IHN1YnNjcmlwdGlvbjonLCBlcnJvcilcbiAgICAgICAgICAvLyBJZiB0aGVyZSdzIGEgc2NoZW1hIG1pc21hdGNoLCB0cnkgd2l0aG91dCBpbmNsdWRpbmcgc3Vic2NyaXB0aW9uXG4gICAgICAgICAgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoe1xuICAgICAgICAgICAgd2hlcmU6IHsgcGhvbmU6IGNyZWRlbnRpYWxzLnBob25lIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF1c2VyIHx8ICF1c2VyLnBhc3N3b3JkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHBob25lIG9yIHBhc3N3b3JkJylcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzVmFsaWRQYXNzd29yZCA9IGF3YWl0IGJjcnlwdC5jb21wYXJlKGNyZWRlbnRpYWxzLnBhc3N3b3JkLCB1c2VyLnBhc3N3b3JkKVxuXG4gICAgICAgIGlmICghaXNWYWxpZFBhc3N3b3JkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHBob25lIG9yIHBhc3N3b3JkJylcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdXNlci5pc1ZlcmlmaWVkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgdmVyaWZ5IHlvdXIgYWNjb3VudCBiZWZvcmUgbG9nZ2luZyBpbicpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgIHBob25lOiB1c2VyLnBob25lLFxuICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgIG5hbWU6IHVzZXIubmFtZSxcbiAgICAgICAgICByb2xlOiB1c2VyLnJvbGUsXG4gICAgICAgICAgaW1hZ2U6IHVzZXIuaW1hZ2UsXG4gICAgICAgICAga3ljQ29tcGxldGVkOiB1c2VyLmt5Y0NvbXBsZXRlZCxcbiAgICAgICAgICBzdWJzY3JpcHRpb246IHVzZXIuc3Vic2NyaXB0aW9uLFxuICAgICAgICAgIGFnZW50UHJvZmlsZTogdXNlci5hZ2VudFByb2ZpbGVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIF0sXG4gIHNlc3Npb246IHtcbiAgICBzdHJhdGVneTogJ2p3dCcsXG4gICAgbWF4QWdlOiAzMCAqIDI0ICogNjAgKiA2MCwgLy8gMzAgZGF5c1xuICB9LFxuICBjYWxsYmFja3M6IHtcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICB0b2tlbi5yb2xlID0gdXNlci5yb2xlXG4gICAgICAgIHRva2VuLnBob25lID0gdXNlci5waG9uZVxuICAgICAgICB0b2tlbi5reWNDb21wbGV0ZWQgPSB1c2VyLmt5Y0NvbXBsZXRlZFxuICAgICAgICB0b2tlbi5zdWJzY3JpcHRpb24gPSB1c2VyLnN1YnNjcmlwdGlvblxuICAgICAgICB0b2tlbi5hZ2VudFByb2ZpbGUgPSB1c2VyLmFnZW50UHJvZmlsZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRva2VuXG4gICAgfSxcbiAgICBhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfSkge1xuICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgIHNlc3Npb24udXNlci5pZCA9IHRva2VuLnN1YiFcbiAgICAgICAgc2Vzc2lvbi51c2VyLnJvbGUgPSB0b2tlbi5yb2xlIGFzIFVzZXJSb2xlXG4gICAgICAgIHNlc3Npb24udXNlci5waG9uZSA9IHRva2VuLnBob25lIGFzIHN0cmluZ1xuICAgICAgICBzZXNzaW9uLnVzZXIua3ljQ29tcGxldGVkID0gdG9rZW4ua3ljQ29tcGxldGVkIGFzIGJvb2xlYW5cbiAgICAgICAgc2Vzc2lvbi51c2VyLnN1YnNjcmlwdGlvbiA9IHRva2VuLnN1YnNjcmlwdGlvblxuICAgICAgICBzZXNzaW9uLnVzZXIuYWdlbnRQcm9maWxlID0gdG9rZW4uYWdlbnRQcm9maWxlXG4gICAgICB9XG4gICAgICByZXR1cm4gc2Vzc2lvblxuICAgIH1cbiAgfSxcbiAgcGFnZXM6IHtcbiAgICBzaWduSW46ICcvYXV0aC9zaWduaW4nLFxuICAgIGVycm9yOiAnL2F1dGgvZXJyb3InXG4gIH0sXG4gIHNlY3JldDogcHJvY2Vzcy5lbnYuTkVYVEFVVEhfU0VDUkVUXG59XG4iXSwibmFtZXMiOlsiQ3JlZGVudGlhbHNQcm92aWRlciIsImJjcnlwdCIsInByaXNtYSIsImF1dGhPcHRpb25zIiwicHJvdmlkZXJzIiwibmFtZSIsImNyZWRlbnRpYWxzIiwicGhvbmUiLCJsYWJlbCIsInR5cGUiLCJwYXNzd29yZCIsImF1dGhvcml6ZSIsIkVycm9yIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImluY2x1ZGUiLCJzdWJzY3JpcHRpb24iLCJhZ2VudFByb2ZpbGUiLCJlcnJvciIsImNvbnNvbGUiLCJsb2ciLCJpc1ZhbGlkUGFzc3dvcmQiLCJjb21wYXJlIiwiaXNWZXJpZmllZCIsImlkIiwiZW1haWwiLCJyb2xlIiwiaW1hZ2UiLCJreWNDb21wbGV0ZWQiLCJzZXNzaW9uIiwic3RyYXRlZ3kiLCJtYXhBZ2UiLCJjYWxsYmFja3MiLCJqd3QiLCJ0b2tlbiIsInN1YiIsInBhZ2VzIiwic2lnbkluIiwic2VjcmV0IiwicHJvY2VzcyIsImVudiIsIk5FWFRBVVRIX1NFQ1JFVCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _barrel_optimize_names_PrismaClient_prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! __barrel_optimize__?names=PrismaClient!=!@prisma/client */ \"(rsc)/./node_modules/@prisma/client/default.js\");\n/* harmony import */ var _barrel_optimize_names_PrismaClient_prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_barrel_optimize_names_PrismaClient_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _barrel_optimize_names_PrismaClient_prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE2QztBQUU3QyxNQUFNQyxrQkFBa0JDO0FBSWpCLE1BQU1DLFNBQVNGLGdCQUFnQkUsTUFBTSxJQUFJLElBQUlILDJGQUFZQSxHQUFFO0FBRWxFLElBQUlJLElBQXlCLEVBQWNILGdCQUFnQkUsTUFBTSxHQUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL2Nhc2hmbG93LWNvbm5lY3QvLi9saWIvcHJpc21hLnRzPzk4MjIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXG5cbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXMgYXMgdW5rbm93biBhcyB7XG4gIHByaXNtYTogUHJpc21hQ2xpZW50IHwgdW5kZWZpbmVkXG59XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/IG5ldyBQcmlzbWFDbGllbnQoKVxuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYVxuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbFRoaXMiLCJwcmlzbWEiLCJwcm9jZXNzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@prisma","vendor-chunks/next-auth","vendor-chunks/jose","vendor-chunks/prisma","vendor-chunks/openid-client","vendor-chunks/bcryptjs","vendor-chunks/@babel","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/preact-render-to-string","vendor-chunks/yallist","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fdashboard%2Ftransactions%2Froute&page=%2Fapi%2Fdashboard%2Ftransactions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fdashboard%2Ftransactions%2Froute.ts&appDir=C%3A%5CUsers%5CGiiT%5CDesktop%5Ccashflow%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CGiiT%5CDesktop%5Ccashflow&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();