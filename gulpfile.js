var gulp = require("gulp");
var zip = require('gulp-zip');
var env = require('gulp-env');
var s3 = require('gulp-s3-upload')(awsConfig);
var fs = require('fs');
var packageJson = JSON.parse(fs.readFileSync('./package.json'));
var version = packageJson.version;
var filename = 'nsfo-admin-build';
/**
 * Load environment variables from JSON File.
 */
env({
    file: 'env.json'
});
/**
 * Initialize AWS Config
 */
var awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    useIAM: true
};
/**
 * Task to zip the build directory
 */
gulp.task('zip:staging', function () {
    return gulp
        .src(['build/**/*'], { dot: true })
        .pipe(zip(filename + '-staging-' + version + '.zip'))
        .pipe(gulp.dest('dist'));
});
gulp.task('zip:prod', function () {
    return gulp
        .src(['build/**/*'], { dot: true })
        .pipe(zip(filename + '-prod-' + version + '.zip'))
        .pipe(gulp.dest('dist'));
});
/**
 * Task to deploy the zip file to AWS S3 Bucket
 */
gulp.task('publish:staging', function () {
    return gulp.src('dist/nsfo-admin-build-staging' + version + '.zip')
        .pipe(s3({
        Bucket: 'nsfo/deployments/frontend',
        ACL: 'public-read'
    }, {
        maxRetries: 5
    }));
});
gulp.task('publish:prod', function () {
    return gulp.src('dist/nsfo-admin-build-prod.zip')
        .pipe(s3({
        Bucket: 'nsfo/deployments/frontend',
        ACL: 'public-read'
    }, {
        maxRetries: 5
    }));
});
