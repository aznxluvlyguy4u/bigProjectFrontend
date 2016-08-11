var gulp = require("gulp");
var del = require("del");
var tsc = require("gulp-typescript");
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var replace = require('gulp-replace');
var tsProject = tsc.createProject('tsconfig.json');
var zip = require('gulp-zip');
var upload = require('gulp-artifactory-upload');
var runSequence = require('run-sequence');
var gnf = require('gulp-npm-files');
var env = require('gulp-env');
env({
    file: 'env.json'
});
gulp.task('clean:build', function (cb) {
    return del(['build'], cb);
});
gulp.task('clean:dist', function (cb) {
    return del(['dist'], cb);
});
gulp.task('create:build', function () {
    return gulp.src(['src/**/*', '!src/assets/sass/**', '!src/app/**/*.ts', '!src/app/**/*.js', '!src/app/**/*.js.map'], { dot: true })
        .pipe(gulp.dest('build'));
});
gulp.task('compress:css', function () {
    return gulp.src('src/assets/sass/main.sass')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(gulp.dest('build/assets/css/.'));
});
gulp.task('compile:app', function () {
    var tsResult = gulp
        .src('src/app/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));
    return tsResult.js
        .pipe(uglify({ mangle: false, compress: true }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("build/app/."));
});
gulp.task('create:lib', function () {
    gulp.src(gnf(), { base: './' }).pipe(gulp.dest('build/.'));
});
gulp.task('zip:staging', function () {
    return gulp
        .src(['build/**/*'], { dot: true })
        .pipe(zip('nsfo-admin-build-staging.zip'))
        .pipe(gulp.dest('dist'));
});
gulp.task('zip:prod', function () {
    return gulp
        .src(['build/**/*'], { dot: true })
        .pipe(zip('nsfo-admin-build-prod.zip'))
        .pipe(gulp.dest('dist'));
});
gulp.task('publish:staging', function () {
    return gulp.src('dist/nsfo-admin-build-staging.zip')
        .pipe(upload({
        url: process.env.ARTIFACTORY_URL,
        username: process.env.ARTIFACTORY_USERNAME,
        password: process.env.ARTIFACTORY_PASSWORD
    }));
});
gulp.task('publish:prod', function () {
    return gulp.src('dist/nsfo-admin-build-prod.zip')
        .pipe(upload({
        url: process.env.ARTIFACTORY_URL,
        username: process.env.ARTIFACTORY_USERNAME,
        password: process.env.ARTIFACTORY_PASSWORD
    }));
});
gulp.task('build', function () {
    runSequence('clean:build', 'clean:dist', 'create:build', 'compress:css', 'compile:app', 'create:lib');
});
//# sourceMappingURL=gulpfile.js.map