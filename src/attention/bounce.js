/**
 * Created by dingguoliang01 on 2014/11/24.
 */
Util.define('attention.Bounce');
attention.Bounce = function (dom, config) {
    attention.Bounce.superClass.call(this, dom, config, attention.Bounce.cf.init);
};

attention.Bounce.cf = {
    init: {
        'name': 'bounce',
        'duration': '1.8s'
    },
    frame: {
        'bounce': {
            '0 20 53 80 100': {
                'transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
                'translate3d': '0,0,0'
            },
            '40 43': {
                'transition-timing-function': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
                'translate3d': '0,-30px,0'
            },
            '70': {
                'transition-timing-function': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
                'translate3d': '0, -15px, 0'
            },
            '90': {
                'translate3d': '0,-4px,0'
            }
        }
    }
};
Keyframe.pack(attention.Bounce);

