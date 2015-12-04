/**
 * @file EventEmitter.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
describe('EventEmitter.js', function () {
    var emt;
    beforeEach(function () {
        emt = new EventEmitter();
    });

    afterEach(function () {
        emt = null;
    });

    it('on', function () {
        var fn1 = function () {};
        var fn2 = function () {};
        emt.on('test', fn1);
        expect(emt._triggers.test.length).toBe(1);
        emt.on('test', fn2);
        expect(emt._triggers.test.length).toBe(2);
        expect(emt._triggers.test[0].fn).toBe(fn1);
        expect(emt._triggers.test[1].fn).toBe(fn2);
    });

    it('off', function () {
        var fn1 = function () {};
        emt.on('test', fn1);
        expect(emt._triggers.test.length).toBe(1);
        expect(emt._triggers.test[0].fn).toBe(fn1);
        emt.off('test', fn1);
        expect(emt._triggers.test.length).toBe(0);

        emt.on('test', fn1);
        emt.on('test', fn1);
        expect(emt._triggers.test.length).toBe(2);
        emt.off('test');
        expect(emt._triggers.test.length).toBe(0);
    });

    it('once emit', function () {
        var fn1Run = false;
        var fn2Run = false;
        var fn1 = function () {
            fn1Run = true;
        };
        var fn2 = function () {
            fn2Run = true;
        };
        emt.once('test', fn1);
        expect(emt._triggers.test.length).toBe(1);
        expect(emt._triggers.test[0].fn).toBe(fn1);
        emt.on('test', fn2);
        expect(emt._triggers.test.length).toBe(2);
        emt.emit('test');
        expect(emt._triggers.test.length).toBe(1);
        expect(fn1Run).toBe(true);
        expect(fn2Run).toBe(true);
    });

    it('all emit', function () {
        var fn1Run = false;
        var fn2Run = false;
        var fn3Run = false;
        var fn1 = function () {
            fn1Run = true;
        };
        var fn2 = function () {
            fn2Run = true;
        };
        var fn3 = function () {
            fn3Run = true;
        };
        emt.once('test1', fn1);
        emt.on('test2', fn2);
        expect(emt._triggers.test1.length).toBe(1);
        expect(emt._triggers.test2.length).toBe(1);
        emt.all(['test1', 'test2'], fn3);
        expect(emt._triggers.test1.length).toBe(2);
        expect(emt._triggers.test2.length).toBe(2);
        emt.emit('test1');
        expect(fn1Run).toBe(true);
        expect(emt._triggers.test1).not.toBeDefined();
        emt.emit('test2');
        expect(fn2Run).toBe(true);
        expect(emt._triggers.test2.length).toBe(1);
        expect(fn3Run).toBe(true);
    });
});
