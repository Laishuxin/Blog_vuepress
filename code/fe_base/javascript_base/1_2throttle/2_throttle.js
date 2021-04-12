/* 2_throttle.ts */
console.log('throttle version2');
function throttle(fn, wait) {
    if (wait === void 0) { wait = 3000; }
    var timeout = null;
    var result;
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timeout === null) {
            // result = fn.apply(this, args)
            timeout = setTimeout(function () {
                fn.apply(_this, args);
                timeout = null;
            }, wait);
        }
        return result;
    };
}
