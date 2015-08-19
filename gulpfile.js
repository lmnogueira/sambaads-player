var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var del = require('del');
 
var paths = {
  scripts:  'src/scripts/',
  images:   'src/images/**/*',
};

var buid_verion = process.env.CIRCLE_BUILD_NUM || "development";

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task("build-scripts", ['clean'], function(){
	gulp.src(paths.scripts + "sambaads.player.js")
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename('sambaads.player.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/' + buid_verion + "/"));

    gulp.src(paths.scripts + "player.js")
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/' + buid_verion + "/"));
});

gulp.task("default", ['watch','build-scripts']);
gulp.task("ci", ['build-scripts']);

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['build-scripts']);
  gulp.watch(paths.images, ['images']);
});
