(function (root, factory) {
if (typeof define === 'function' && define.amd) {
    define(factory);
} else {
    root.Event = factory();
}
}(this, function () {
	/**
	 * @namespace
	 */
	var Event = {
	    style: 'Style',
	    css: 'CSS',
	    clear: 'Clear',
	    beforeStart: 'BeforeStart',
	    pause: 'Pause',
	    start: 'Start',
	    iteration: 'Iteration',
	    end: 'End',
	    next: 'Next',
	    over: 'Over',
	    on: 'On',
	    off: 'Off',
	    stop: 'Stop',
	    goon: 'Goon',
	    once: 'Once',
	    all: 'All',
	    emit: 'Emit'
	};
	return Event;}));