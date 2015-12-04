/**
 * @file Checker.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
describe('Checker.js', function () {

    /*

     Checker.sFunction = new Checker('string', 'function');
     Checker.array = new Checker(Array);*/
    function wrong (checker) {
        return function () {
            expect(checker.check(arguments)).toBe(false);
        };
    }
    function right (checker) {
        return function () {
            expect(checker.check(arguments)).toBe(true);
        };
    }
    it('check stringObject', function () {
        var kind = 'stringObject';
        right(Checker[kind])('string', {});
        wrong(Checker[kind])('string');
        wrong(Checker[kind])('string', {}, 1);
    });

    it('check objectString', function () {
        var kind = 'objectString';
        right(Checker[kind])({}, 'string');
        wrong(Checker[kind])('string');
        wrong(Checker[kind])('string', {}, 1);
    });

    it('check object', function () {
        var kind = 'object';
        right(Checker[kind])({});
        wrong(Checker[kind])('string');
        wrong(Checker[kind])('string', {}, 1);
    });

    it('check string', function () {
        var kind = 'string';
        right(Checker[kind])('string');
        wrong(Checker[kind])('string', {}, 1);
    });

    it('check sFunction', function () {
        var kind = 'sFunction';
        right(Checker[kind])('string', function () {});
        wrong(Checker[kind])('string', {}, 1);
    });

    it('check ssFunction', function () {
        var kind = 'ssFunction';
        right(Checker[kind])('string', 'string', function () {});
        wrong(Checker[kind])('string', {}, 1);
    });

    it('check array', function () {
        var kind = 'array';
        right(Checker[kind])([]);
        wrong(Checker[kind])('string', {}, 1);
    });
});
