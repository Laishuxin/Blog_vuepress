/* 6_debounce.ts */
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
function debounce(fn, wait, immediate) {
    if (wait === void 0) { wait = 1000; }
    if (immediate === void 0) { immediate = true; }
    var timeout = null;
    function debouncedFn() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var callNow = timeout === null;
        var result;
        if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
        }
        if (immediate) {
            timeout = setTimeout(function () { return (timeout = null); }, wait);
            if (callNow) {
                result = fn.apply(this, args);
            }
        }
        else {
            timeout = setTimeout(fn.bind.apply(fn, __spreadArrays([this], args)), wait);
        }
        return result;
    }
    debouncedFn.cancel = function () {
        clearTimeout(timeout);
        timeout = null;
    };
    return debouncedFn;
}
