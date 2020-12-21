// dist/index.xxxx.js
(function (modules) {
    // 已经加载过的模块
    var installedModules = {};

    // 模块加载函数
    function require(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        };
        modules[moduleId].call(module.exports, module, module.exports, require);
        module.l = true;
        console.log(module.exports)
        return module.exports;
    }
    require('./index.js');
})({
    /* index module */
    './index.js':
        (function (module, exports, require) {
            "use strict";
            var _add = _interopRequireDefault(require("./add.js"));
            var _minus = require("./minus.js");
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { "default": obj };
            }
            var addResult = (0, _add["default"])(2, 3);
            var minusResult = (0, _minus.minus)(3, 2);
            console.log('addResult: ', addResult);
            console.log('minusResult: ', minusResult);
        }),
    /* add module */
    './add.js':
        (function (module, exports, require) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports["default"] = void 0;
            var _default = function _default(a, b) {
                return a + b;
            };
            exports["default"] = _default;
        }),
    /* minus module */
    './minus.js':
        (function (module, exports, require) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            exports.minus = void 0;
            var minus = function minus(a, b) {
                return a - b;
            };
            exports.minus = minus;
        })
});
