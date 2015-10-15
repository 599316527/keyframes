function Promise() {
    this.queue = [];
    this.isPromise = true;
}

Promise.event = {
    success: 'success',
    error: 'error',
    progress: 'progress'
};

Promise.prototype.then = function (fulfilledHandler, errorHandler, progressHandler) {
    var handler = {};
    if (typeof fulfilledHandler === 'function') {
        handler.fulfilled = fulfilledHandler;
    }
    if (typeof errorHandler === 'function') {
        handler.error = errorHandler;
    }
    this.queue.push(handler);
    return this;
};