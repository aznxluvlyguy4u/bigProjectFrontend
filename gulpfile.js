var gulp = require("gulp");
var clean = require("gulp-clean");
var zip = require('gulp-zip');
var env = require('gulp-env');
var s3 = require('gulp-s3-upload')(awsConfig);
var fs = require('fs');
var packageJson = JSON.parse(fs.readFileSync('./package.json'));
var version = packageJson.version;
var filename = 'nsfo-admin-build';
var zip_files_bucket = 'nsfo/deployments/frontend';
var staging_admin_frontend_bucket = 'dev-admin.nsfo.nl';
var production_admin_frontend_bucket = 'admin.nsfo.nl';
var public_read = 'public-read';
var retry_count = 5;
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
 * Task to deploy build files directly to AWS S3 hosted website Bucket.
 */
gulp.task('publish:staging', function () {
    return gulp.src(['build/**/*'])
        .pipe(s3({
        Bucket: staging_admin_frontend_bucket,
        ACL: public_read
    }, {
        maxRetries: retry_count
    }));
});
gulp.task('publish:prod', function () {
    return gulp.src(['build/**/*'])
        .pipe(s3({
        Bucket: production_admin_frontend_bucket,
        ACL: public_read
    }, {
        maxRetries: retry_count
    }));
});
/**
 * Task to deploy maintenance page directly to AWS S3 hosted website Bucket.
 */
gulp.task('publish:staging:maintenance', function () {
    return gulp.src(['src/maintenance-page/*'])
        .pipe(s3({
        Bucket: staging_admin_frontend_bucket,
        ACL: public_read
    }, {
        maxRetries: retry_count
    }));
});
gulp.task('publish:prod:maintenance', function () {
    return gulp.src(['src/maintenance-page/*'])
        .pipe(s3({
        Bucket: production_admin_frontend_bucket,
        ACL: public_read
    }, {
        maxRetries: retry_count
    }));
});
/**
 * Task to deploy the zip file to AWS S3 Bucket
 */
gulp.task('publish:zip:staging', function () {
    var zipname = filename + '-staging-';
    return gulp.src('dist/' + zipname + version + '.zip')
        .pipe(s3({
        Bucket: zip_files_bucket,
        ACL: public_read
    }, {
        maxRetries: retry_count
    }));
});
gulp.task('publish:zip:prod', function () {
    var zipname = filename + '-production-';
    return gulp.src('dist/' + zipname + version + '.zip')
        .pipe(s3({
        Bucket: zip_files_bucket,
        ACL: public_read
    }, {
        maxRetries: retry_count
    }));
});
gulp.task('clean-scripts', function () {
    return gulp.src(['src/app/**/*.js', 'src/app/**/*.js.map'], { read: false, force: true })
        .pipe(clean());
});
