/* 3_1throttle.ts */
console.log('throttle version3_1');
function throttle(fn, wait) {
    if (wait === void 0) { wait = 1000; }
    //* in order to execute callback the first time
    var previous = 0;
    var timeout = null;
    var clear = function () {
        clearTimeout(timeout);
        timeout = null;
    };
    return function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var result;
        var now = +new Date();
        // debugger
        // the rest time to execute
        //! to avoid the time of system has been modify
        // if time has been forward, it will be very dangerous
        // if time has been backward, it will be waiting for more time to execute.
        var remaining = wait - (now - previous);
        if (remaining <= 0 || remaining > wait) {
            if (timeout !== null)
                clear();
            previous = now;
            result = fn.apply(this, args);
        }
        else if (timeout === null) {
            timeout = setTimeout(function () {
                fn.apply(_this, args);
                previous = +new Date();
                timeout = null;
            }, remaining);
        }
        return result;
    };
}
