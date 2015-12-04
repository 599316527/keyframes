/**
 * @file Util.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
describe('Util.js', function () {

    it('each', function () {
        var array = ['a', 1, true];
        var count = 0;
        expect(Util.each(array, function (value, i) {
            expect(value).toBe(array[i]);
            count++;
        })).toBe(true);
        expect(array.length).toBe(count);

        expect(Util.each(array, function (item, i) {
            count = i;
            expect(item).toBe('a');
            return false;
        })).toBe(false);
        expect(count).toBe(0);

        count = 0;
        expect(Util.each(array, function (item, i) {
            count = i;
            return true;
        })).toBe(true);
        expect(count).toBe(2);
    });

    it('forIn', function () {
        var demo  = {a: 1, b: 'b', c: true};
        var array = [];
        Util.forIn(demo, function (key, value) {
            array.push({key: key, value: value});
        });
        expect(array.length).toBe(3);
        Util.each(array, function (item) {
            expect(item.value).toBe(demo[item.key]);
        });
    });

    it('define', function () {
        Util.define('a.b.c');
        expect(a.b.c).toBeDefined();
    });

    it('arg2Ary', function () {
        var demo = ['a', 1, true];
        function fn() {
            var ary = Util.arg2Ary(arguments);
            expect(ary instanceof Array).toBe(true);
            expect(ary.length).toBe(demo.length);
            Util.each(ary, function (item, i) {
                expect(item).toBe(demo[i]);
            });
        }
        fn.apply(null, demo);
    });

    it('xInA', function () {
        var demo = ['a', 'b', 1, 30, true, 'c'];
        expect(Util.xInA('a', demo)).toBe(0);
        expect(Util.xInA(true, demo)).toBe(4);
        expect(Util.xInA(1, demo)).toBe(2);
        expect(Util.xInA('c', demo)).toBe(5);
    });

    it('random.name', function () {
        var name = Util.random.name(8);
        expect(name.length).toBe(8);
        expect(name).toMatch(/[a-zA-Z][a-zA-Z0-9]{7}/);
    });

    beforeEach(function () {
        var div = document.createElement('div');
        div.id = 'hello-word';
        div.style.width = '100px';
        document.body.appendChild(div);
    });

    afterEach(function () {
        var div = document.getElementById('hello-word');
        if (div) {
            document.body.removeChild(div);
        }
    });

    it('addClass removeClass', function () {
        var dom = document.getElementById('hello-word');
        Util.addClass(dom, 'aClassName');
        expect(dom.className).toBe('aClassName');
        Util.addClass(dom, 'aClassName');
        expect(dom.className).toBe('aClassName');
        Util.removeClass(dom, 'aClassName');
        expect(dom.className).toBe('');
    });

    it('css', function () {
        expect(Util.css(document.getElementById('hello-word'), 'width')).toBe('100px');
        expect(Util.css(document.getElementById('hello-word'), 'width', '200px')).toBe('200px');
        expect(Util.css(document.getElementById('hello-word'), 'width')).toBe('200px');
    });


    function fireClickEvent(el) {
        var event;
        if (document.createEvent) {
            event = document.createEvent('MouseEvent');
            event.initEvent('click', true, true);
            el.dispatchEvent(event);
        }
        else if (el.fireEvent) {
            event = document.createEventObject();
            el.fireEvent('onclick', event);
        }
    }
    it('on', function (done) {
        var div = document.getElementById('hello-word');
        var count = 0;
        Util.on(document.getElementById('hello-word'), 'click', function (event) {
            expect(this).toBe(div);
            expect(event.type).toBe('click');
            if (++count === 2) {
                done();
            }
        });
        fireClickEvent(div);
        fireClickEvent(div);
    });

    it('off', function (done) {
        var div = document.getElementById('hello-word');
        var count = 0;
        var callback = function () {
            count++;
            Util.off(div, 'click', callback);
        };
        Util.on(div, 'click', callback);
        fireClickEvent(div);
        fireClickEvent(div);
        setTimeout(function () {
            expect(count).toBe(1);
            done();
        });
    });

    it('extend', function () {
        var objA = {a: 1, b: true, c: 'test'};
        var objB = {a: 2, b: false, c: '!test', d: [0, 0], e: 'word e'};
        Util.extend(objA, objB);
        expect(objA.a).toBe(1);
        expect(objA.e).toBe('word e');
        expect(objA.d).toBe(objB.d);
        var tmp = Util.extend(null, objB);
        expect(tmp).toBe(objB);
    });

    it('rewrite', function () {
        var objA = {a: 1, b: true, c: 'test'};
        var objB = {a: 2, b: false, c: '!test', d: [0, 0], e: 'word e'};
        Util.rewrite(objA, objB);
        expect(objA.a).toBe(2);
        expect(objA.e).toBe('word e');
        expect(objA.d).toBe(objB.d);
    });
});
