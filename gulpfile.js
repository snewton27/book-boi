"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); // Runs a local dev server to serve application
var open = require('gulp-open'); // Opens a url in a web browser automatically
var browserify = require('browserify'); // Bundles JS into a single file
var reactify = require('reactify'); // Transform React JSX to JS
var source = require('vinyl-source-stream'); // Use conventional text streams with gulp

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/.js',
        dist: './dist',
        mainJs: './src/main.js'
    }
};

// Starts a local development server
gulp.task('connect', function() {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

// Get file and open it in browser at specified url. Will call 'connect' task before running this
gulp.task('open', ['connect'], function() {
    gulp.src('dist/index.html')
    .pipe(open({ uri: config.devBaseUrl + ":" + config.port + "/" }));
});

// Copy html files to distribution folder and restart server
gulp.task('html', function() {
    gulp.src(config.paths.html)
    .pipe(gulp.dest(config.paths.dist))
    .pipe(connect.reload()); // re-do connect task
});

gulp.task('js', function() {
   browserify(config.paths.mainJs)
       .transform(reactify)
       .bundle()
       .on('error', console.error.bind(console))
       .pipe(source('bundle.js'))
       .pipe(gulp.dest(config.paths.dist + '/scripts'))
       .pipe(connect.reload());
});

// Task to make gulp watch for file changes, and restart everything when this occurs
gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
});

// Setup default gulp task.
gulp.task('default', ['html', 'js', 'open', 'watch']);
