/**
 * @file 群组动画管理
 * @author tingkl(dingguoliang01@baidu.com)
 **/
/* global Util Event EventEmitter*/
/* define Group */
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
Group.prototype.clear = function () {
    Util.each(this._frames, function (frame) {
        frame.stop();
    });
    return this;
};
