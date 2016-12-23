const gulp = require("gulp");
const zip = require('gulp-zip');
const env = require('gulp-env');
const s3 = require('gulp-s3-upload')(awsConfig);

/**
 * Change Gulp ENV Options
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
 * Task to deploy the zip file to AWS S3 Bucket
 */

gulp.task('publish:staging', function() {
    return gulp.src('dist/nsfo-admin-build-staging.zip')
        .pipe(s3({
            Bucket: 'nsfo/deployments/frontend',
            ACL:    'public-read'
        }, {
            maxRetries: 5
        }))
        ;
});

gulp.task('publish:prod', function() {
    return gulp.src('dist/nsfo-admin-build-prod.zip')
        .pipe(s3({
            Bucket: 'nsfo/deployments/frontend',
            ACL:    'public-read'
        }, {
            maxRetries: 5
        }))
        ;
});