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
    for (var key in generateMap) {
        gulp.src(generateMap[key]).pipe(concat(key + '.js')).pipe(gulp.dest('src/lib'));
    }
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

gulp.task('pack', ['concat'], function() {
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

gulp.task('default', ['pack'], function () {
});