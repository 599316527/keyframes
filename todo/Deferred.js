function Deferred() {
    this.state = Deferred.state.unfulfilled;
    this.promise = new Promise();
}
Deferred.state = {
    unfulfilled: 'unfulfilled',
    fulfilled: 'fulfilled',
    failed: 'failed'
};
Deferred.prototype.resolve = function(obj) {
    this.state = Deferred.state.fulfilled;
    var promise = this.promise;
    var handler;
    while ((handler = promise.queue.shift())) {
        if (handler && handler.fulfilled) {
            var ret = handler.fulfilled(obj);
            if (ret && ret.isPromise) {
                ret.queue = promise.queue;
                this.promise = ret;
                return;
            }
        }
    }
};
Deferred.prototype.reject = function(err) {
    var promise = this.promise;
    var handler;
    while ((handler = promise.queue.shift())) {
        if (handler && handler.error) {
            var ret = handler.error(err);
            if (ret && ret.isPromise) {
                ret.queue = promise.queue;
                this.promise = ret;
                return;
            }
        }
    }
};
Deferred.prototype.callback = function () {
    var that = this;
    return function (err, obj) {
        if (err) {
            return that.reject(err);
        }
        that.resolve(obj);
    };
};