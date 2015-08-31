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
  scripts:  './src/scripts/',
  images:   './src/images/',
  css:      './src/styles/',
};

var config = require("./app/config/env.json");

var buid_verion = process.env.CIRCLE_BUILD_NUM || "development";

gulp.task('clean', function(cb) {
  del(['build'], cb);
});

gulp.task("build-javascripts", function(){
	gulp.src(paths.scripts + "sambaads.player.js")
    .pipe(sourcemaps.init())
    .pipe(preprocess({context: config.development}))
    .pipe(uglify())
    .pipe(rename('sambaads.player.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/public/javascripts/'));

    gulp.src([paths.scripts + "widget/sambaads.widget.view.js",
              paths.scripts + "widget/sambaads.widget.controller.js"])
    .pipe(sourcemaps.init())
    .pipe(preprocess({context: config.development}))
    .pipe(concat_util.header('\"use strict\";'))
    .pipe(concat("sambaads.widget.js"))
    .pipe(uglify())
    .pipe(rename('sambaads.widget.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/public/javascripts/'));

    gulp.src([paths.scripts + "widget/widget.js",paths.scripts + "modal.js"])
    .pipe(sourcemaps.init())
    .pipe(preprocess({context: config.development}))
    .pipe(concat("widget.js"))
    .pipe(concat_util.header('\"use strict\";(function(cw){'))
    .pipe(concat_util.footer('})(this);'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/public/javascripts/'));

    gulp.src(paths.scripts + "player.js")
    .pipe(sourcemaps.init())
    .pipe(preprocess({context: config.development}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/public/javascripts/'));

    gulp.src([paths.scripts + "layout/jquery-1.11.3.min.js",paths.scripts + "layout/jquery.dotdotdot.js", paths.scripts + "layout/jquery.colorbox.js", paths.scripts + "layout/bootstrap.js", paths.scripts + "layout/sambaads.layout.js"])
    .pipe(sourcemaps.init())
    .pipe(concat("sambaads.base.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/public/javascripts/'));
});

gulp.task("build-scripts", function(){
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

gulp.task("build-images", function(){
	gulp.src(paths.images + "*.*")
    .pipe(gulp.dest('app/public/images/'));

    gulp.src(paths.images + "/layout/**/*")
    .pipe(gulp.dest('app/public/images/'));
});

gulp.task("build-css", function(){
    gulp.src(paths.css + "sambaads.widget.css")
    .pipe(sourcemaps.init())
    .pipe(minify_css())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/public/stylesheets/'));

    gulp.src([paths.css + "layout/bootstrap.css", paths.css + "layout/widget_pagina_videos.css", paths.css + "layout/colorbox.css"])
    .pipe(sourcemaps.init())
    .pipe(concat("sambaads.base.css"))
    .pipe(minify_css())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/public/stylesheets/'));
});

gulp.task("default", ['watch','build-javascripts', 'build-css', 'build-images']);
gulp.task("staging", ['watch','build-javascripts', 'build-css', 'build-images']);
gulp.task("production", ['watch','build-javascripts', 'build-css', 'build-images']);
gulp.task("ci", ['clean','build-scripts', 'build-images', 'build-css']);

gulp.task('watch', function() {
  gulp.watch(paths.scripts + "**/*.js", ['build-javascripts']);
  gulp.watch(paths.css + "**/*.css", ['build-css']);
  gulp.watch(paths.images, ['build-images']);
});
