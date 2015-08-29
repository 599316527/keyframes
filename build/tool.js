/**
 * Created by dingguoliang01 on 2015/8/28.
 */
var arg = process.argv;
var fs = require('fs');
var path = require('path');
var namespace =  arg[2];
var template = {};
var jsPath = (function (namespace) {
    template.domain = namespace;
    var parts = namespace.split('.');
    var depth = new Array(parts.length + 1);
    var name = parts[parts.length - 1];
    template.name = name;
    parts[parts.length - 1] = template.camelCase = name[0].toLowerCase() + name.substr(1);
    parts.unshift('src');
    template.depth = depth.join('../');
    template.src  = template.depth + parts.join('/') + '.js';
    parts.unshift(path.resolve(__dirname, '../'));
    return parts.join(path.sep) + '.js';
}) (namespace);

var htmlPath = (function (namespace) {
    var parts = namespace.split('.');
    parts[parts.length - 1] = template.camelCase;
    parts.unshift('example');
    parts.unshift(path.resolve(__dirname, '../'));
    return parts.join(path.sep) + '.html';
}) (namespace);

var htmlContent = (function () {
    var txt = fs.readFileSync(path.resolve(__dirname, 'template.html')).toString();
    return txt.replace(/\{%(.*?)%\}/g, function($0, $1) {
        return template[$1];
    });
})();
var jsContent = (function () {
    var txt = fs.readFileSync(path.resolve(__dirname, 'template.js')).toString();
    return txt.replace(/\{%(.*?)%\}/g, function($0, $1) {
        return template[$1];
    });
})();
function mkdirs(dirpath, mode, callback) {
    callback = callback ||
    function() {};

    fs.exists(dirpath,
        function(exitsmain) {
            if (!exitsmain) {
                //目录不存在
                var pathtmp;
                var pathlist = dirpath.split(path.sep);
                var pathlistlength = pathlist.length;
                var pathlistlengthseed = 0;

                mkdir_auto_next(mode, pathlist, pathlist.length,
                    function(callresult) {
                        if (callresult) {
                            callback(true);
                        }
                        else {
                            callback(false);
                        }
                    });

            }
            else {
                callback(true);
            }

        });
}
function mkdir_auto_next(mode, pathlist, pathlistlength, callback, pathlistlengthseed, pathtmp) {
    callback = callback ||
    function() {};
    if (pathlistlength > 0) {

        if (!pathlistlengthseed) {
            pathlistlengthseed = 0;
        }

        if (pathlistlengthseed >= pathlistlength) {
            callback(true);
        }
        else {

            if (pathtmp) {
                pathtmp = path.join(pathtmp, pathlist[pathlistlengthseed]);
            }
            else {
                pathtmp = pathlist[pathlistlengthseed];
            }

            fs.exists(pathtmp,
                function(exists) {
                    if (!exists) {
                        fs.mkdir(pathtmp, mode,
                            function(isok) {
                                if (!isok) {
                                    mkdir_auto_next(mode, pathlist, pathlistlength,
                                        function(callresult) {
                                            callback(callresult);
                                        },
                                        pathlistlengthseed + 1, pathtmp);
                                }
                                else {
                                    callback(false);
                                }
                            });
                    }
                    else {
                        mkdir_auto_next(mode, pathlist, pathlistlength,
                            function(callresult) {
                                callback(callresult);
                            },
                            pathlistlengthseed + 1, pathtmp);
                    }
                });

        }

    }
    else {
        callback(true);
    }

}
mkdirs(path.resolve(jsPath, '../'), '0777', function () {
    fs.writeFileSync(jsPath, jsContent, 'utf-8');
});
mkdirs(path.resolve(htmlPath, '../'), '0777', function () {
    fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
});


console.log('done');