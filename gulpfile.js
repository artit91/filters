var gulp = require('gulp'),
    path = require('path');

gulp.eslint = require('gulp-eslint');
gulp.clean = require('gulp-clean');
gulp.sass = require('gulp-sass');
gulp.concat = require('gulp-concat');
gulp.uglify = require('gulp-uglify');
gulp.minifyCss = require('gulp-minify-css');
gulp.templateCache = require('gulp-angular-templatecache');
gulp.runSequence = require('gulp-run-sequence');

gulp.task('clean', function () {
    return gulp.src(
        [
            '.tmp',
            'dist'
        ],
        {'read': false}
    ).pipe(
        gulp.clean()
    );
});

gulp.task('templates', function () {
    return gulp.src(
        'app/**/*.tpl.html'
    ).pipe(
        gulp.templateCache({
            'module': 'filters',
            'transformUrl': function (url) {
                return path.basename(url);
            }
        })
    ).pipe(
        gulp.dest('.tmp/')
    );
});

gulp.task('concat:sass', function () {
    return gulp.src(
        ['app/app.scss', 'app/**/*.scss']
    ).pipe(
        gulp.concat('app.scss')
    ).pipe(
        gulp.dest('.tmp/')
    );
});

gulp.task('concat:js', function () {
    return gulp.src(
        [
            'vendor/canvas-to-blob/**/*.js',
            'vendor/sweetalert/**/*.js',
            'vendor/angular/**/*.js',
            'vendor/angular-ui-router/**/*.js',
            'app/app.js',
            'app/**/*.js',
            '.tmp/templates.js'
        ]
    ).pipe(
        gulp.concat('app.js')
    ).pipe(
        gulp.dest('dist/')
    );
});

gulp.task('sass', function () {
    return gulp.src(
        '.tmp/app.scss'
    ).pipe(
        gulp.sass(
            {
                'file': 'app.css'
            }
        ).on('error', gulp.sass.logError)
    ).pipe(
        gulp.dest('.tmp/')
    );
});

gulp.task('copy:css', function () {
    return gulp.src(
        [
            'vendor/sweetalert/**/*.css',
            'vendor/angular/angular-csp.css',
            '.tmp/app.css'
        ]
    ).pipe(
        gulp.concat('app.css')
    ).pipe(
        gulp.dest('dist/')
    );
});

gulp.task('copy:assets', function () {
    return gulp.src(
        'assets/**'
    ).pipe(
        gulp.dest('dist/')
    );
});

gulp.task('copy:views', function () {
    var pages = [];

    ['index'].forEach(function (page) {
        pages.push(path.join('app', page + '.html'));
    });

    return gulp.src(
        pages
    ).pipe(
        gulp.dest('dist/')
    );
});

gulp.task('uglify', function () {
    return gulp.src(
        ['dist/app.js', 'dist/background.js']
    ).pipe(
        gulp.uglify()
    ).pipe(
        gulp.dest('dist/')
    );
});

gulp.task('cssmin', function () {
    return gulp.src(
        'dist/app.css'
    ).pipe(
        gulp.minifyCss()
    ).pipe(
        gulp.dest('dist/')
    );
});

gulp.task('build', ['clean'], function (done) {
    return gulp.runSequence(
        'eslint',
        'templates',
        [
            'concat:sass',
            'concat:js',
            'copy:assets',
            'copy:views'
        ],
        'sass',
        'copy:css',
        done
    );
});

gulp.task('package', ['build'], function (done) {
    gulp.runSequence([
        'uglify',
        'cssmin'
    ], done);
});

gulp.task('default', function () {
    gulp.runSequence('build');
});

gulp.task('eslint', function () {
    return gulp.src(
        [
            './gulpfile.js',
            './app/**/*.js',
            './assets/**/*.js'
        ]
    ).pipe(
        gulp.eslint({
            'ignore': false
        })
    ).pipe(
        gulp.eslint.format()
    ).pipe(
        gulp.eslint.failAfterError()
    );
});
