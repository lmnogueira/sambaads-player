var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    del = require('del'),
    concat_util = require('gulp-concat-util'),
    minify_css = require('gulp-minify-css'),
    preprocess = require('gulp-preprocess');

var jwplayer_version = "7.4.4";

var paths = {
    scripts:  './src/scripts/',
    images:   './src/images/',
    css:      './src/styles/',
    skins:    './src/skins/'
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
  gulp.src([
      paths.scripts + "vendor/jquery.1.11.0.min.js",
      paths.scripts + "vendor/circle_progress.js",
      paths.scripts + "vendor/jquery.nanoscroller.min.js",
      paths.scripts + "vendor/jquery.lightSlider.min.js",

      paths.scripts + "player.event.js",
      paths.scripts + "player.view.state.js",
      paths.scripts + "player.controller.collector.tracker.js",

      paths.scripts + "player.messagebroker.js",
      paths.scripts + "player.postmessage.js",
      paths.scripts + "player.util.js",
      paths.scripts + "player.core.js",
      paths.scripts + "player.view.js",
      paths.scripts + "player.view.playlist.js",
      paths.scripts + "player.view.play.js",
      paths.scripts + "player.view.buffer.js",
      paths.scripts + "player.view.descriptionbar.js",
      paths.scripts + "player.view.share.js",
      paths.scripts + "player.view.next.js",
      paths.scripts + "player.configurator.js",
      paths.scripts + "player.controller.js",
      paths.scripts + "player.controller.collector.js",
      paths.scripts + "player.controller.comscore.js",
      paths.scripts + "player.controller.timehandler.js",
      paths.scripts + "player.advertising.js"
    ])
    .pipe(sourcemaps.init())
    .pipe(preprocess({context: contextEnv}))
    .pipe(concat("sambaads.player.js"))
    //.pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/public/javascripts/'));

    gulp.src(paths.scripts + "player.js")
        .pipe(sourcemaps.init())
        .pipe(preprocess({context: contextEnv}))
        //.pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('app/public/javascripts/'));
});

gulp.task("build-jwplayer", function(){
    gulp.src(
        [
            paths.scripts + 'vendor/jwplayer-' + jwplayer_version + '/**/*'
        ]
    )
    .pipe(gulp.dest('app/public/javascripts/player'));
});

gulp.task("build-images", function(){
	gulp.src(paths.images + "*.*")
        .pipe(gulp.dest('app/public/images/'));
});

gulp.task("build-crossdomain", function(){
    gulp.src('./src/crossdomain/*.*')
        .pipe(gulp.dest('app/public/'));
});

gulp.task("build-css", function(){
    gulp.src(paths.css + "sambaads.player.css")
        .pipe(sourcemaps.init())
        .pipe(minify_css())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('app/public/stylesheets/'));
});

gulp.task('build-css-skin', function(){
    gulp.src(paths.skins + '**/*.css')
        .pipe(gulp.dest('app/public/stylesheets/skin/'));
});

gulp.task('watch', function() {
  gulp.watch([paths.scripts + "**.*"], ["build-javascripts-player"]);
  gulp.watch(paths.css + "**/*.css", ['build-css']);
  gulp.watch(paths.skins + '**/*.css', ['build-css-skin']);
  gulp.watch(paths.images, ['build-images']);
});

gulp.task("default",
    [
        'development-context',
        'build-css',
        'build-css-skin',
        'build-images',
        "build-javascripts-player",
        "build-jwplayer",
        'watch'
    ]
);
gulp.task("staging",
    [
        'staging-context',
        'build-css',
        'build-css-skin',
        'build-images',
        "build-javascripts-player",
        "build-crossdomain",
        "build-jwplayer"
    ]
);
gulp.task("production",
    [
        'production-context',
        'build-css',
        'build-css-skin',
        'build-images',
        "build-javascripts-player",
        "build-crossdomain",
        "build-jwplayer"
    ]
);
