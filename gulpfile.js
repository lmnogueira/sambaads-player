var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    del = require('del'),
    concat_util = require('gulp-concat-util'),
    minify_css = require('gulp-clean-css'),
    preprocess = require('gulp-preprocess');
    htmlmin = require('gulp-htmlmin');
    base64 = require('gulp-base64');
    inlinesource = require('gulp-inline-source'),
    merge = require('merge-stream'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');

var jwplayer_version = "7.4.4";

var paths = {
    scripts:  './src/scripts/',
    images:   './src/images/',
    css:      './src/styles/',
    scss:      './src/scss/',
    skins:    './src/skins/',
    templates:'./src/templates/',
    native:'./src/native/'
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

gulp.task("local-staging-context", function(){
    contextEnv = config.local_staging;
});

gulp.task("local-production-context", function(){
    contextEnv = config.local_production;
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
      paths.scripts + "player.controller.native.js",
      paths.scripts + "player.controller.timehandler.js",
      paths.scripts + "player.advertising.js"
    ])
    .pipe(sourcemaps.init())
    .pipe(preprocess({context: contextEnv}))
    .pipe(concat("sambaads.player.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/public/javascripts/'));

    // .on('error', function(e){
    //         console.log(e);
    //      })

    gulp.src(paths.scripts + "player.js")
        .pipe(sourcemaps.init())
        .pipe(preprocess({context: contextEnv}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('app/public/javascripts/'));
});

gulp.task("dev-javascripts-player", function(){
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
      paths.scripts + "player.controller.native.js",
      paths.scripts + "player.controller.timehandler.js",
      paths.scripts + "player.advertising.js"
    ])
    .pipe(sourcemaps.init())
    .pipe(preprocess({context: contextEnv}))
    .pipe(concat("sambaads.player.js"))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('app/public/javascripts/'));

    gulp.src(paths.scripts + "player.js")
        .pipe(sourcemaps.init())
        .pipe(preprocess({context: contextEnv}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('app/public/javascripts/'));
});

gulp.task("build-videojs.ima", function(){
    gulp.src(
        [
            paths.scripts + 'vendor/videojs-ima/*'
        ]
    )
    .pipe(gulp.dest('app/public/javascripts'));
    gulp.src(
        [
            paths.css + 'videojs.ima.css'
        ]
    )
    .pipe(gulp.dest('app/public/stylesheets/'));
});

gulp.task("build-images", function(){
	gulp.src(paths.images + "*.*")
        .pipe(gulp.dest('app/public/images/'));
});

gulp.task("build-native", function(){
	gulp.src(paths.native + "**/*")
        .pipe(gulp.dest('app/public/native/'));
});

gulp.task("build-crossdomain", function(){
    gulp.src('./src/crossdomain/*.*')
        .pipe(gulp.dest('app/public/'));
});

gulp.task("build-error-pages", function(){
  gulp.src('./src/error_pages/*.*')
    .pipe(gulp.dest('app/public/'));
});

gulp.task("build-error-pages", function(){
  gulp.src('./src/error_pages/*.*')
    .pipe(gulp.dest('app/public/'));
});

gulp.task("build-css", function(){
    var css = gulp.src(paths.css + 'sambaads.player.css'),
        scss = gulp.src(paths.scss + '/**/*.scss')
                .pipe(sass({outputStyle: 'expanded'})
                .on('error', sass.logError));

    var mergedStream = merge(css, scss)
           .pipe(concat('styles.css'))
           .pipe(sourcemaps.init())
           .pipe(autoprefixer({
               browsers: [
                   '> 1%',
                   'last 2 versions',
                   'Firefox ESR',
                   'Opera 12.1',
                   'last 20 Android versions',
                   'last 20 iOS versions',
                   'last 20 ChromeAndroid versions',
                   'Explorer >= 9'
               ],
               cascade: false
           }))
           .pipe(concat('sambaads.player.css'))
           .pipe(minify_css())
           .pipe(base64())
           .pipe(sourcemaps.write('./'))
           .pipe(gulp.dest('app/public/stylesheets/'));

    return mergedStream;
});

gulp.task('build-css-skin', function(){
    gulp.src(paths.skins + '**/*.css')
        .pipe(minify_css())
        .pipe(base64())
        .pipe(gulp.dest('app/public/stylesheets/skin/'));
});

gulp.task('build-errors-pages', function() {
  return gulp.src(paths.templates + '/error_pages/*')
    .pipe(inlinesource())
    .pipe(base64())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('app/public/'));
});

gulp.task('build-templates', function() {
  return gulp.src(paths.templates + 'iframe.ejs')
    .pipe(inlinesource())
    .pipe(base64())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('app/views/player/'));
});

gulp.task('watch', function() {
  gulp.watch([paths.scripts + "**/**.*"], ["dev-javascripts-player"]);
  gulp.watch([paths.css + '**/*.css', paths.scss + '**/*.scss'], ['build-css']);
  gulp.watch(paths.skins + '**/*.css', ['build-css-skin']);
  gulp.watch(paths.images, ['build-images']);
  gulp.watch(paths.native, ['build-native']);
  gulp.watch([paths.templates + '**/*.ejs', paths.templates + '**/*.html'], ['build-templates']);
});

gulp.task("default",
    [
        'development-context',
        'build-css',
        'build-css-skin',
        'build-images',
        'build-native',
        'build-javascripts-player',
        'build-templates',
        'build-errors-pages',
        'build-videojs.ima',
        'watch'
    ]
);
gulp.task("local-staging",
    [
        'local-staging-context',
        'build-css',
        'build-css-skin',
        'build-images',
        'build-native',
        'dev-javascripts-player',
        'build-templates',
        'build-errors-pages',
        'build-videojs.ima',
        'watch'
    ]
);
gulp.task("local-production",
    [
        'local-production-context',
        'build-css',
        'build-css-skin',
        'build-images',
        'build-native',
        'dev-javascripts-player',
        'build-templates',
        'build-errors-pages',
        'build-videojs.ima',
        'watch'
    ]
);
gulp.task("staging",
    [
        'staging-context',
        'build-css',
        'build-css-skin',
        'build-images',
        'build-native',
        'build-javascripts-player',
        'build-crossdomain',
        'build-templates',
        'build-errors-pages',
        'build-videojs.ima'

    ]
);
gulp.task("production",
    [
        'production-context',
        'build-css',
        'build-css-skin',
        'build-images',
        'build-native',
        'build-javascripts-player',
        'build-crossdomain',
        'build-templates',
        'build-errors-pages',
        'build-videojs.ima'
    ]
);
