var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var jshint = require('gulp-jshint');
var mergeMap = {};
var generateMap = {
    'Keyframe': [],
    'Transform': []
};
gulp.task('lint',['concat'], function() {
    return gulp.src(['src/*.js', 'src/*/*.js'])
        // This is available for modules like jshint-jsx, which
        // expose the normal jshint function as JSHINT and the
        // jsxhint function as JSXHINT
        .pipe(jshint()).pipe(jshint.reporter('default'));
});

gulp.task('concat', ['amd'],  function() {
    function contains(a, obj) {
        var i = a.length;
        while (i--) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }
    var all = [];
    for (var key in generateMap) {
        gulp.src(generateMap[key]).pipe(concat(key + '.js')).pipe(gulp.dest('src/lib'));
        for (var i = 0; i< generateMap[key].length; i++) {
            if (contains(all, generateMap[key][i])) {

            }
            else {
                all.push(generateMap[key][i]);
            }
        }
    }
    gulp.src(all).pipe(concat('lib.js')).pipe(gulp.dest('src/'));
    return true;
});
gulp.task('amd', function() {
    var fs = require('fs');
    var path = require('path');
    var files = fs.readdirSync('src');
    //var combine = [];
    for(var i in files)
    {
        var domain = files[i];
        domain = domain.substring(0, domain.length - 3);
        var fName = 'src' + path.sep + files[i];
        var stat = fs.lstatSync(fName);
        if(stat.isDirectory() === false)
        {
            if (domain !== 'lib') {
                var content = fs.readFileSync(fName, 'utf-8').toString();
                var result = /\/\*\s*global\s+(.*?)\s*\*\/\s*/.exec(content);
                var dependency;
                var domain = /\/\*\s*define\s+(.*?)\s*\*\/\s*/.exec(content);
                var index = domain.index + domain[0].length;
                content = content.substring(index);
                domain = domain[1];
                if (result) {
                    dependency = result[1];
                    /*combine.push("define('" + domain + "', ['" + dependency.replace(/\s+/g, "', '") + "'], function (" + dependency.replace(/\s+/g, ", ") + ") {\r\n\t" + content.replace(/\n/g, function($0) {
                        return '\n\t';
                    }) + 'return ' + domain + ';\r});');*/
                    mergeMap[domain] = {path: fName, dependency: dependency.trim().split(/\s+/), content: "define('" + domain + "', ['" + dependency.replace(/\s+/g, "', '") + "'], function (" + dependency.replace(/\s+/g, ", ") + ") {\r\n\t" + content.replace(/\n/g, function($0) {
                        return '\n\t';
                    }) + 'return ' + domain + ';\r});'};
                    content = "define(['" + dependency.replace(/\s+/g, "', '") + "'], function (" + dependency.replace(/\s+/g, ", ") + ") {\r\n\t" + content.replace(/\n/g, function($0) {
                        return '\n\t';
                    }) + 'return ' + domain + ';\r});';
                }
                else {
                    /*combine.push("define('" + domain + "', function () {\r\n\t" + content.replace(/\n/g, function($0) {
                        return  '\n\t';
                    }) + 'return ' + domain + ';\r});');*/
                    mergeMap[domain] = {path: fName, content: "define('" + domain + "', function () {\r\n\t" + content.replace(/\n/g, function($0) {
                        return  '\n\t';
                    }) + 'return ' + domain + ';\r});'};
                    content = "define(function () {\r\n\t" + content.replace(/\n/g, function($0) {
                        return  '\n\t';
                    }) + 'return ' + domain + ';\r});';
                }
                fs.writeFileSync(path.join('src', 'amd', files[i]), content);
            }
        }
    }

    function merger (denpendency, parentMoudleName, record, order) {
        var result = '';
        var moduleName;
        var module;
        if (denpendency) {
            console.log(denpendency, parentMoudleName);
            for (var i = 0; i < denpendency.length; i++) {
                moduleName = denpendency[i];
                module = mergeMap[moduleName];
                if (!record[moduleName]) {
                    result += merger(module.dependency, moduleName, record, order) + module.content + '\r';
                    record[moduleName] = true;
                    order.push(module.path);
                    console.log(moduleName + ' loadede!!');
                }
            }
        }
        return result;
    }
    for (var key in generateMap) {
        fs.writeFileSync(path.join('src', 'amd','lib', key + '.js'), merger([key], '', {}, generateMap[key]));
    }
    return true;
});

gulp.task('default', ['concat'], function() {
    return gulp.src(['src/*.js', 'src/*/*.js', 'src/*/*/*.js'])
        .pipe(uglify())
        .pipe(rename(function (path) {
            //path.dirname += "/ciao";
            if (path.dirname.indexOf('amd') > -1) {

            }
            else {
                path.basename += ".min";
            }
            //path.extname = ".md"
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('cdn', [], function () {
    var http = require('http');
    var fs = require('fs');

    function walk(path, floor, handleFile) {
        floor++;
        var files = fs.readdirSync(path);
        files.forEach(function(item) {
            var tmpPath = path + '/' + item;
            var stats = fs.statSync(tmpPath);
            if (stats.isDirectory()) {
                walk(tmpPath, floor, handleFile);
            } else {
                handleFile(tmpPath, floor);
            }
        });
    }
    var array = [];
    var cwd = process.cwd();
    var path = require('path');
/*    walk(cwd + '/dist', 0, function (path) {
        array.push(path.replace(cwd, ''));
    });*/
    walk(cwd + '/demo', 0, function (path) {
        array.push(path.replace(cwd, ''));
    });
    //walk(cwd + '/example', 0, function (path) {
    //    array.push(path.replace(cwd, ''));
    //});
    //array.push('example/doc.html');
//http://ecma.bdimg.com/public03/zhidao_native/-dev.app.js
    var url = "http://cp01-ocean-1312.epc.baidu.com:8033/bcs/delete.php?p=bcs&s=";
    var fixed = 'http://ecma.bdimg.com/public01/keyframes';
    function clearCDN(current, dev) {
        if (current < array.length) {
            setTimeout(function () {
                http.get(url + encodeURIComponent(fixed + array[current]), function(res) {
                    console.log("Got response: " + res.statusCode);
                    res.on('data', function(data) {
                        console.log(fixed + array[current] + " got data: " + data);
                    });
                    clearCDN(current + 1, dev);
                }).on('error', function(e) {
                    console.log("Got error: " + e.message);
                });
            }, 1000);
        }
    }
    clearCDN(0, '');
});
gulp.task('define', function () {
    var fs = require('fs');
    var path = require('path');
    var content = fs.readFileSync(path.join('dist', 'amd', 'lib', 'Transform.js')).toString();
    fs.writeFileSync(path.join('dist', 'amd', 'lib', 'Transform.js'), "window['define'] = typeof ESL_define === 'function' ? ESL_define : window['define'];" + content);
    return true;
});
gulp.task('upload', function() {
    var path = require('path');
    var exec = require('child_process').exec;
    exec('edp bcs dist' + path.sep + 'amd bs://public01/keyframes/dist/amd',
        function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            console.log(stdout);
        });
    exec('edp bcs dist' + path.sep + 'lib bs://public01/keyframes/dist/lib',
        function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            console.log(stdout);
        });
    exec('edp bcs dist' + path.sep + 'lib.min.js bs://public01/keyframes/dist/',
        function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
            console.log(stdout);
        });
    return true;
});