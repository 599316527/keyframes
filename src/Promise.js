function Promise() {
    Promise.superClass.call(this);
}
Promise.event = {
    success: 'success',
    error: 'error',
    progress: 'progress'
};
Util.inherit(Promise, EventEmitter);
Promise.prototype.then = function (fulfilledHandler, errorHandler, progressHandler) {
    if (fulfilledHandler) {
        this.on(Promise.event.success, fulfilledHandler);
    }
    if (errorHandler) {
        this.on(Promise.event.error, errorHandler);
    }
    if (progressHandler) {
        this.on(Promise.event.progress, progressHandler);
    }
    return this;
};