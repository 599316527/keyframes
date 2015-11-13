var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
var jshint = require('gulp-jshint');

gulp.task('lint',['concat'], function() {
    return gulp.src(['src/*.js', 'src/*/*.js'])
        // This is available for modules like jshint-jsx, which
        // expose the normal jshint function as JSHINT and the
        // jsxhint function as JSXHINT
        .pipe(jshint()).pipe(jshint.reporter('default'));
});

gulp.task('concat', function() {
    return gulp.src(['src/Util.js', 'src/Event.js', 'src/EventEmitter.js', 'src/Checker.js', 'src/Pitch.js', 'src/Compatible.js', 'src/KFCompatible.js', 'src/Compiler.js', 'src/ClassProxy.js','src/FrameProxy.js','src/Group.js','src/Keyframe.js'])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('src/'));
});
gulp.task('amd', function() {
    var fs = require('fs');
    var path = require('path');
    var files = fs.readdirSync('src');
    var combine = [];
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
                    combine.push("define('" + domain + "', ['" + dependency.replace(/\s+/g, "', '") + "'], function (" + dependency.replace(/\s+/g, ", ") + ") {\r\n\t" + content.replace(/\n/g, function($0) {
                        return '\n\t';
                    }) + 'return ' + domain + ';\r});');
                    content = "define(['" + dependency.replace(/\s+/g, "', '") + "'], function (" + dependency.replace(/\s+/g, ", ") + ") {\r\n\t" + content.replace(/\n/g, function($0) {
                        return '\n\t';
                    }) + 'return ' + domain + ';\r});';
                }
                else {
                    combine.push("define('" + domain + "', function () {\r\n\t" + content.replace(/\n/g, function($0) {
                        return  '\n\t';
                    }) + 'return ' + domain + ';\r});');
                    content = "define(function () {\r\n\t" + content.replace(/\n/g, function($0) {
                        return  '\n\t';
                    }) + 'return ' + domain + ';\r});';
                }
                fs.writeFileSync(path.join('src', 'amd', files[i]), content);
            }
        }
    }
    fs.writeFileSync(path.join('src', 'amd', 'lib.js'), combine.join('\r'));
    return true;
});

gulp.task('pack', ['lint'], function() {
    return gulp.src(['src/*.js', 'src/*/*.js'])
        .pipe(uglify())
        .pipe(rename(function (path) {
            //path.dirname += "/ciao";
            if (path.dirname==='amd') {

            }
            else {
                path.basename += ".min";
            }
            //path.extname = ".md"
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['amd', 'pack'], function () {
});