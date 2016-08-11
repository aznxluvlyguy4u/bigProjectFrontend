const gulp = require("gulp");
const del = require("del");
const tsc = require("gulp-typescript");
const sourcemaps = require ('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const replace = require('gulp-replace');
const tsProject = tsc.createProject('tsconfig.json');
const zip = require('gulp-zip');
const upload = require('gulp-artifactory-upload');
const runSequence = require('run-sequence');
const gnf = require('gulp-npm-files');
const env = require('gulp-env');


/**
 * Change Gulp ENV Options
 */

env({
    file: 'env.json'
});

/**
 * Remove build directory.
 */

gulp.task('clean:build', (cb) => {
    return del(['build'], cb);
});


/**
 * Remove dist directory.
 */

gulp.task('clean:dist', (cb) => {
    return del(['dist'], cb);
});


/**
 * Copy src to dist directory.
 */
gulp.task('create:build', () => {
    return gulp.src(['src/**/*', '!src/assets/sass/**', '!src/app/**/*.ts', '!src/app/**/*.js', '!src/app/**/*.js.map'], {dot: true})
        .pipe(gulp.dest('build'))
});


/**
 * Compile Sass files.
 */

gulp.task('compress:css', () => {
    return gulp.src('src/assets/sass/main.sass')
        .pipe(sass({ outputStyle: 'compressed'}))
        .pipe(gulp.dest('build/assets/css/.'));
});


/**
 * Compile TypeScript sources and create sourcemaps in build directory.
 */

gulp.task('compile:app', () => {
    var tsResult = gulp
        .src('src/app/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));
    return tsResult.js
        .pipe(uglify({mangle: false, compress: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("build/app/."));
});


/**
 * Copy NPM Dependencies
 */

gulp.task('create:lib', function() {
    gulp.src(gnf(), {base:'./'}).pipe(gulp.dest('build/.'));
});


/**
 * Zip build directory
 */

gulp.task('zip:staging', () => {
    return gulp
        .src(['build/**/*'],{dot: true})
        .pipe(zip('nsfo-admin-build-staging.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('zip:prod', () => {
    return gulp
        .src(['build/**/*'],{dot: true})
        .pipe(zip('nsfo-admin-build-prod.zip'))
        .pipe(gulp.dest('dist'));
});


/**
 * Deploy build directory
 */

gulp.task('publish:staging', function() {
    return gulp.src('dist/nsfo-admin-build-staging.zip')
        .pipe(upload({
            url: process.env.ARTIFACTORY_URL,
            username: process.env.ARTIFACTORY_USERNAME,
            password: process.env.ARTIFACTORY_PASSWORD
        }))
});

gulp.task('publish:prod', function() {
    return gulp.src('dist/nsfo-admin-build-prod.zip')
        .pipe(upload({
            url: process.env.ARTIFACTORY_URL,
            username: process.env.ARTIFACTORY_USERNAME,
            password: process.env.ARTIFACTORY_PASSWORD
        }))
});

/**
 * Build the project: Production.
 */

gulp.task('build', function() {
    runSequence(
        'clean:build',
        'clean:dist',
        'create:build',
        'compress:css',
        'compile:app',
        'create:lib'
    );
});
