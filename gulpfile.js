var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
gulp.task('concat', function() {
    return gulp.src(['src/Util.js', 'src/EventEmitter.js', 'src/Event.js', 'src/Checker.js', 'src/Pitch.js', 'src/Compatible.js', 'src/Compiler.js'])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('src/'));
});

gulp.task('pack', ['concat'], function() {
    return gulp.src('src/*.js')
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