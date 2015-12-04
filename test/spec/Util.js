describe('Util.js', function() {

    it('each', function() {
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

    it('forIn', function() {
        var demo  = { a: 1, b: 'b', c: true};
        var array = [];
        Util.forIn(demo, function (key, value) {
            array.push({key: key, value: value});
        })
        expect(array.length).toBe(3);
        Util.each(array, function (item) {
            expect(item.value).toBe(demo[item.key]);
        });
    });

    it('define', function() {
        Util.define('a.b.c');
        expect(a.b.c).toBeDefined();
    });

    it('arg2Ary', function() {
        function fn () {
            var ary = Util.arg2Ary(arguments);
            expect(ary instanceof Array).toBe(true);
            expect(ary.length).toBe(demo.length);
            Util.each(ary, function (item, i) {
                expect(item).toBe(demo[i]);
            });
        }
        var demo = ['a', 1, true]
        fn.apply(null, demo);
    });

    it('xInA', function() {
        var demo = ['a', 'b', 1, 30, true, 'c'];
        expect(Util.xInA('a', demo)).toBe(0);
        expect(Util.xInA(true, demo)).toBe(4);
        expect(Util.xInA(1, demo)).toBe(2);
        expect(Util.xInA('c', demo)).toBe(5);
    });

});