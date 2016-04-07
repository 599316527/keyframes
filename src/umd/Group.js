(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['Util', 'Event', 'EventEmitter', 'Compiler'], factory);
    }
    else {
        root.Group = factory(root.Util, root.Event, root.EventEmitter, root.Compiler);
    }
}(this, function (Util, Event, EventEmitter, Compiler) {
    function Group(frames) {
	    Group.superClass.call(this);
	    this._frames = frames;
	}
	Util.inherit(Group, EventEmitter);
	Group.prototype.onEnd = function (fn, option) {
	    this.on(Event.end, fn, option);
	    return this;
	};
	Group.prototype.start = function () {
	    var status = [];
	    var me = this;
	    function over(evt, st) {
	        status.push(st);
	        if (status.length === me._frames.length) {
	            me.emit(Event.end, status);
	        }
	    }
	    Util.each(this._frames, function (frame) {
	        frame.start();
	        frame.on(Event.over, over);
	    });
	    return this;
	};
	Group.prototype.clear = function (clearCSS) {
	    Util.each(this._frames, function (frame) {
	        frame.stop();
	    });
	    if (clearCSS) {
	        Compiler.instance().clear();
	    }
	    return this;
	};
	
    return Group;
}));