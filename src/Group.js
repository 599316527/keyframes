function Group(frames) {
    this._frames = frames;
}
Group.prototype.start = function () {
    Util.each(this._frames, function(frame) {
        frame.start();
    });
    return this;
};