var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
 
var paths = {
  scripts: ['scripts/**/*.js'],
  images:   'images/**/*'
};

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task("build-scripts", ['clean'], function(){
	return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/'));
});

gulp.task("ci", ['watch','build-scripts']);

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['build-scripts']);
  gulp.watch(paths.images, ['images']);
});
