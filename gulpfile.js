var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var del = require('del');
var concat_util = require('gulp-concat-util');
var minify_css = require('gulp-minify-css');
var preprocess = require('gulp-preprocess');

var paths = {
  skins:    './src/skins/', 
  scripts:  './src/scripts/',
  images:   './src/images/',
  css:      './src/styles/',
};

var config = require("./app/config/env.json");
var contextEnv = {};

var buid_verion = process.env.CIRCLE_BUILD_NUM || "development";

gulp.task("production-context", function(){
    contextEnv = config.production;
});

gulp.task("staging-context", function(){
    contextEnv = config.staging;
});

gulp.task("development-context", function(){
    contextEnv = config.development;
});

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task("build-javascripts-player", function(){
    gulp.src([paths.scripts + "vendor/circle_progress.js", paths.scripts + "sambaads.player.js"])
    .pipe(sourcemaps.init())
    .pipe(preprocess({context: contextEnv}))
    .pipe(concat("sambaads.player.js"))
    .pipe(uglify())
    .pipe(rename('sambaads.player.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/public/javascripts/'));

    gulp.src(paths.scripts + "player.js")
    .pipe(sourcemaps.init())
    .pipe(preprocess({context: contextEnv}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/public/javascripts/'));
});

// gulp.task("build-javascripts-base", function(){
//     gulp.src([
//       //paths.scripts + "vendor/jquery.1.11.0.min.js",
//       paths.scripts + "vendor/circle_progress.js",
//       //paths.scripts + "vendor/jquery.nanoscroller.min.js",
//       //paths.scripts + "vendor/jquery.lightSlider.min.js",
//     ])
//     .pipe(sourcemaps.init())
//     .pipe(concat("sambaads.player.base.js"))
//     .pipe(uglify())
//     .pipe(sourcemaps.write('./'))
//     .pipe(gulp.dest('app/public/javascripts/'));
// });

gulp.task("build-skins", function(){
  gulp.src(paths.skins + "**/*.*")
    .pipe(gulp.dest('app/public/skins/'));
});

gulp.task("build-images", function(){
	gulp.src(paths.images + "*.*")
    .pipe(gulp.dest('app/public/images/'));
});

gulp.task("build-crossdomain", function(){
  gulp.src('./src/crossdomain/*.*')
    .pipe(gulp.dest('app/public/'));
});

gulp.task("build-error-pages", function(){
  gulp.src('./src/error_pages/*.*')
    .pipe(gulp.dest('app/public/'));
});

gulp.task("build-css", function(){
    gulp.src(paths.css + "sambaads.player.css")
    .pipe(sourcemaps.init())
    .pipe(minify_css())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/public/stylesheets/'));
});

gulp.task("default", ['development-context', 'build-skins', 'build-css', 'build-images', "build-javascripts-player", 'watch']);
gulp.task("staging", ['staging-context', 'build-css', 'build-skins', 'build-images', "build-javascripts-player", "build-crossdomain", "build-error-pages"]);
gulp.task("production", ['production-context', 'build-skins', 'build-css', 'build-images', "build-javascripts-player", "build-crossdomain", "build-error-pages"]);

gulp.task('watch', function() {
  gulp.watch([paths.scripts + "sambaads.player.js", paths.scripts + "player.js"], ["build-javascripts-player"]);
  gulp.watch(paths.css + "**/*.css", ['build-css']);
  gulp.watch(paths.images, ['build-images']);
  gulp.watch(paths.skins + "**/*.*", ['build-skins']);
});
