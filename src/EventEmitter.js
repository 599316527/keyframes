function EventEmitter() {
    this._triggers = {};
}

EventEmitter.type = {
    once: 'once',
    all: 'all'
};

EventEmitter.prototype.on = function(eventName, fn, option) {
    if (eventName) {
        if (eventName in this._triggers) {
            this._triggers[eventName].push({fn:fn, option:option});
        } else {
            this._triggers[eventName] = [{fn:fn, option:option}];
        }
        this.emit(Event.on, eventName, option);
    }
    else {
        throw new Error('undefined event！');
    }
};
EventEmitter.prototype.off = function(eventName, fn) {
    if (Checker.string.check(arguments)) {
        if (eventName in this._triggers) {
            this._triggers[eventName] = [];
            this.emit(Event.off, eventName);
        }
    }
    else if (Checker.sFunction.check(arguments)) {
        if (eventName in this._triggers) {
            var index = -1;
            Util.each(this._triggers[eventName], function (item, i) {
                if (item.fn === fn) {
                    index = i;
                    return false;
                }
            });
            if (index > -1) {
                this._triggers[eventName].splice(index, 1);
                this.emit(Event.off, eventName);
            }
        }
    }
    else {
        throw new Error('incorrect parameter!');
    }
};
EventEmitter.prototype.once = function(eventName, fn, option) {
    if (!option) {
        option = {};
    }
    option.type = EventEmitter.type.once;
    this.emit(Event.once, eventName, option);
    this.on(eventName, fn, option);
};

EventEmitter.prototype.callWithScope = function(fn, option, params) {
    params = params || [];
    if(option && ('scope' in option)) {
        /* jshint ignore:start */
        fn.apply(option['scope'], params);
        /* jshint ignore:end */
    }
    else
    {
        fn.apply(this, params);
    }
};

EventEmitter.prototype.all = function(dependency, fn, option) {
    var record = {},
        results = [];
    if (dependency.length === 0) {
        this.callWithScope(fn, option);
        return;
    }
    var me = this;
    var proxyCallback = function(index) {
        return  function(eventName, result) {
            if (eventName in record) {
                record[eventName] = true;
                results[index] = result;
            }
            var trigger = true;
            for (var item in record) {
                if (record[item] === false) {
                    trigger = false;
                    break;
                }
            }
            if (trigger) {
                me.callWithScope(fn, option, results);
            }
        };
    };
    Util.each(dependency, function (eventName, i) {
        record[eventName] = false;
        this.on(eventName, proxyCallback(i), {type:EventEmitter.type.all});
    });
    this.emit(Event.all, dependency, option);
};

EventEmitter.prototype.emit = function(eventName) {
    var fns = this._triggers[eventName],
        itemFn, scope, type, fn, option,
        offs = [], itemOff;
    var args = arguments;
    if (fns) {
        var me = this;
        Util.each(fns, function(itemFn) {
            fn = itemFn.fn;
            option = itemFn.option;
            if (option) {
                scope = option.scope;
                type = option.type;
            } else {
                scope = false;
                type = false;
            }

            if (scope) {
                fn.apply(scope, Util.arg2Ary(args));
            } else {
                fn.apply(me, Util.arg2Ary(args));
            }

            if (type) {
                //type === EventEmitter.type.once or type === EventEmitter.type.all
                offs.push(itemFn);
            }
        });
        if (offs.length > 0) {
            var newFns = [];
            var fnsIndex = 0, offIndex = 0,
                sizeFns = fns.length,
                sizeOffs = offs.length;
            itemOff = offs[offIndex];
            while(fnsIndex < sizeFns) {
                itemFn = fns[fnsIndex];
                if (itemFn === itemOff) {
                    offIndex ++;
                    if (offIndex <sizeOffs) {
                        itemOff = offs[offIndex];
                    } else {
                        itemOff = -1;
                    }
                } else {
                    newFns.push(itemFn);
                }
                fnsIndex ++;
            }
            if(newFns.length === 0) {
                delete this._triggers[eventName];
            } else {
                this._triggers[eventName] = newFns;
            }
        }
    }
};