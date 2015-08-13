function EventEmitter() {
    this._routes = {};

}
EventEmitter.event = {
    once: 'once',
    all: 'all'
};
EventEmitter.prototype.on = function(eventName, fn, option) {
    if (eventName in this._routes) {
        this._routes[eventName].push({fn:fn, option:option});
    } else {
        this._routes[eventName] = [{fn:fn, option:option}];
    }
}
EventEmitter.prototype.once = function(eventName, fn, option) {
    if (!option) {
        option = {};
    }
    option.type = EventEmitter.event.once;
    this.on(eventName, fn, option);
}
EventEmitter.prototype.callWithScope = function(fn, option, params) {
    //params可能为undefined如 define([], 'classname', function(){})这种dependency为空数组的不规范写法
    params = params || [];
    if(option && ('scope' in option)) {
        fn.apply(option['scope'], params);
    }
    else
    {
        fn.apply(this, params);
    }
}
EventEmitter.prototype.all = function(dependency, fn, option) {
    var record = {},
        results = [],
        eventName,
        index,
        length = dependency.length;
    if (length === 0) {

        this.callWithScope(fn, option);
        return;
    }
    for (index = 0; index < length ; index++) {
        eventName = dependency[index];
        record[eventName] = false;
    }
    var that = this;
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
                that.callWithScope(fn, option, results);
            }
        }
    }

    for (index = 0; index < length ; index++) {
        eventName = dependency[index];
        this.on(eventName, proxyCallback(index), {type:EventEmitter.event.all})
    }

}
EventEmitter.prototype.emit = function(eventName) {
    var fns = this._routes[eventName],
        itemFn, scope, type, fn, option,
        offs = [], itemOff;
    if (fns) {
        for (var i = 0, l = fns.length; i < l; i++) {
            itemFn = fns[i];
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
                fn.apply(scope, Util.arg2Ary(arguments));
            } else {
                fn.apply(this, Util.arg2Ary(arguments));
            }

            if (!type) {
                continue;
            } else if (type === EventEmitter.event.once) {
                offs.push(itemFn);
            } else if (type === EventEmitter.event.all) {
                offs.push(itemFn);
            }
        }

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
                delete this._routes[eventName];
            } else {
                this._routes[eventName] = newFns;
            }
        }
    }
}