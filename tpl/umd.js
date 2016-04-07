(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define({%domain?%}{%dependency%}factory);
    }
    else {
        root.{%domain%} = factory({%dependency!%});
    }
}(this, function ({%dependency~%}) {
    {%content%}
    return {%domain%};
}));