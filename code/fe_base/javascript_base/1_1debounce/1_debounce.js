function debounce(fn, wait) {
    if (wait === void 0) { wait = 1000; }
    var timeout = null;
    return function () {
        if (timeout !== null) {
            clearTimeout(timeout);
            timeout = null;
        }
        timeout = setTimeout(fn, wait);
    };
}
