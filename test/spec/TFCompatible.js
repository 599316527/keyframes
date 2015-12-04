/**
 * @file TFCompatible.js ~ 2015/08/13 11:47:13
 * @author tingkl(dingguoliang01@baidu.com)
 **/
describe('TFCompatible.js', function () {
    var tfc;
    beforeEach(function () {
        tfc = TFCompatible.instance();
    });

    afterEach(function () {
        tfc = null;
    });
    it('peelMould', function () {
        var config = {
            'delay': '2s',
            'function': 'ease-in-out',
            'duration': '1s',
            'mix': {
                'function': 'linear',
                'duration': '22s'
            }
        };
        var tmp = tfc.peelMould(config);
        var array = [];
        Util.forIn(tmp, function (key, value) {
            array.push({key: key, value: value});
        });
        Util.each(array, function (item) {
            expect(item.value).toBe(config[item.key]);
        });
        expect(array.length).toBe(3);
    });

    it('instance', function () {
        expect(TFCompatible.instance()).toBe(tfc);
    });

    it('cssMap', function () {
        expect(tfc.cssMap('backgroundColor')).toBe('background-color');
        expect(tfc.cssMap('right')).toBe('right');
    });

    it('parseTransition', function () {
        var config = {
            'function': '<function>',
            'property': '<property>',
            'duration': '<duration>',
            'delay': '<delay>'
        };
        expect(tfc.parseTransition(config)).toBe('<property> <duration> <function> <delay>');
    });

});
