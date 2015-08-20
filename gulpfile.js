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
    return gulp.src(['src/Util.js', 'src/EventEmitter.js', 'src/Event.js', 'src/Promise.js','src/Deferred.js','src/Checker.js', 'src/Pitch.js', 'src/Compatible.js', 'src/Compiler.js', 'src/ClassProxy.js','src/FrameProxy.js','src/Keyframe.js'])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('src/'));
});

gulp.task('pack', ['lint'], function() {
    return gulp.src(['src/*.js', 'src/*/*.js'])
        .pipe(uglify())
        .pipe(rename(function (path) {
            //path.dirname += "/ciao";
            path.basename += ".min";
            //path.extname = ".md"
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['pack'], function () {
});