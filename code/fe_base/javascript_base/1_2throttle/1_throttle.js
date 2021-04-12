/* 1_throttle.ts */
console.log('throttle version1');
function throttle(fn, wait) {
    if (wait === void 0) { wait = 1000; }
    var previous = 0;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var now = +new Date();
        var result;
        if (now - previous >= wait) {
            result = fn.apply(this, args);
            previous = now;
        }
        return result;
    };
}
