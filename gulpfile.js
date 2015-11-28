var gulp = require('gulp'),
    path = require('path');

gulp.eslint = require('gulp-eslint');
gulp.clean = require('gulp-clean');
gulp.watch = require('gulp-watch');
gulp.sass = require('gulp-sass');
gulp.concat = require('gulp-concat');
gulp.rename = require('gulp-rename');
gulp.uglify = require('gulp-uglify');
gulp.minifyCss = require('gulp-minify-css');
gulp.templateCache = require('gulp-angular-templatecache');
gulp.zip = require('gulp-zip');
gulp.toSASSURI = require('gulp-svg-sass-uri');
gulp.runSequence = require('gulp-run-sequence');

gulp.task('clean:chrome', function () {
    return gulp.src('chrome-pkg', {'read': false})
        .pipe(gulp.clean());
});

gulp.task('clean:common', function () {
    return gulp.src('.tmp', {'read': false})
        .pipe(gulp.clean());
});

gulp.task('svg:common', function () {
    return gulp.src('app/svg/**/*.svg')
        .pipe(gulp.toSASSURI())
        .pipe(gulp.dest('.tmp/'));
});

gulp.task('templates:common', function () {
    return gulp.src('app/**/*.tpl.html')
        .pipe(gulp.templateCache({
            'module': 'filters',
            'transformUrl': function (url) {
                return path.basename(url);
            }
        }))
        .pipe(gulp.dest('.tmp/'));
});

gulp.task('concat:common_sass', function () {
    return gulp.src(['.tmp/svg.scss', 'app/app.scss', 'app/**/*.scss'])
        .pipe(gulp.concat('common.scss'))
        .pipe(gulp.dest('.tmp/'));
});

gulp.task('concat:common_js', function () {
    return gulp.src([
        'vendor/sweetalert/**/*.js',
        'vendor/canvas-to-blob/**/*.js',
        'vendor/angular/**/*.js',
        'vendor/angular-ui-router/**/*.js',
        'app/app.js',
        'app/**/*.js',
        '.tmp/templates.js'
    ]).pipe(gulp.concat('common.js')).pipe(gulp.dest('.tmp/'));
});

gulp.task('concat:chrome_sass', function () {
    return gulp.src(['.tmp/common.scss', 'chrome-app/app/**/**.scss'])
        .pipe(gulp.concat('chrome.scss'))
        .pipe(gulp.dest('.tmp/'));
});

gulp.task('sass:chrome', function () {
    return gulp.src('.tmp/chrome.scss')
        .pipe(gulp.sass({
            'includePaths': ['vendor/bootstrap-sass/'],
            'file': 'chrome.css'
        }).on('error', gulp.sass.logError))
        .pipe(gulp.dest('.tmp/'));
});

gulp.task('copy:chrome_js', function () {
    return gulp.src(['.tmp/common.js', 'chrome-app/app/**/**.js'])
        .pipe(gulp.concat('app.js'))
        .pipe(gulp.dest('chrome-pkg/'));
});

gulp.task('copy:chrome_css', function () {
    return gulp.src([
        'vendor/sweetalert/**/*.css',
        'vendor/angular/angular-csp.css',
        '.tmp/chrome.css'
    ]).pipe(gulp.concat('app.css')).pipe(gulp.dest('chrome-pkg/'));
});

gulp.task('copy:chrome_assets', function () {
    return gulp.src(['!chrome-app/app{,/**}', 'chrome-app/**', 'assets/**'])
        .pipe(gulp.dest('chrome-pkg/'));
});

gulp.task('copy:chrome_views', function () {
    var pages = [];

    ['index'].forEach(function (page) {
        pages.push(path.join('app', page + '.html'));
    });
    return gulp.src(pages).pipe(gulp.dest('chrome-pkg/'));
});

gulp.task('uglify:chrome', function () {
    return gulp.src(['chrome-pkg/app.js', 'chrome-pkg/background.js'])
        .pipe(gulp.uglify())
        .pipe(gulp.dest('chrome-pkg/'));
});

gulp.task('cssmin:chrome', function () {
    return gulp.src('chrome-pkg/app.css')
        .pipe(gulp.minifyCss())
        .pipe(gulp.dest('chrome-pkg/'));
});

gulp.task('compress:chrome', function () {
    return gulp.src('chrome-pkg/**')
        .pipe(gulp.zip('app.zip'))
        .pipe(gulp.dest('chrome-pkg/'));
});

gulp.task('concat:background', function () {
    return gulp.src([
        'chrome-background/vendor/**/*.js',
        'chrome-background/main.js'
    ]).pipe(gulp.concat('background.js')).pipe(gulp.dest('chrome-pkg/'));
});

gulp.task('copy:chrome', [
    'copy:chrome_js',
    'copy:chrome_css',
    'copy:chrome_assets',
    'copy:chrome_views'
]);

gulp.task('common', ['clean:common'], function (done) {
    gulp.runSequence([
        'svg:common',
        'templates:common'
    ], 'concat:common_sass', 'concat:common_js', done);
});

gulp.task('build:chrome', ['clean:chrome', 'common'], function (done) {
    return gulp.runSequence(
        'eslint',
        'concat:chrome_sass',
        'sass:chrome',
        'copy:chrome',
        'concat:background',
        done
    );
});

gulp.task('package:chrome', ['build:chrome'], function (done) {
    gulp.runSequence([
        'uglify:chrome',
        'cssmin:chrome'
    ], 'compress:chrome', done);
});

gulp.task('watch:chrome', function () {
    return gulp.watch(['chrome-app/**', 'app/**', 'vendor/**'], function () {
        gulp.start('build:chrome');
    });
});

gulp.task('default', function () {
    gulp.runSequence('build:chrome', 'watch:chrome');
});

gulp.task('eslint', function () {
    return gulp.src([
        './gulpfile.js',
        './app/**/*.js',
        './chrome-app/**/*.js'
    ]).pipe(gulp.eslint({
        'ignore': false
    })).pipe(gulp.eslint.format())
    .pipe(gulp.eslint.failAfterError());
});
