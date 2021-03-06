const gulp = require("gulp");
const clean = require("gulp-clean");
const zip = require('gulp-zip');
const env = require('gulp-env');

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

// Bucket settings

const staging_admin_frontend_bucket = process.env.S3_STAGING_BUCKET;
const production_admin_frontend_bucket = process.env.S3_PRODUCTION_BUCKET;
const public_read = 'public-read';
const retry_count = 5;

/**
 * Initialize AWS Config
 */

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    useIAM: true
};

const s3 = require('gulp-s3-upload')(awsConfig);

/**
 * Task to zip the build directory
 */

gulp.task('zip:staging', () => {
    return gulp
        .src(['build/**/*'],{dot: true})
        .pipe(zip(filename+'-staging-'+version+'.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('zip:prod', () => {
    return gulp
        .src(['build/**/*'],{dot: true})
        .pipe(zip(filename+'-prod-'+version+'.zip'))
        .pipe(gulp.dest('dist'));
});

/**
 * Task to deploy build files directly to AWS S3 hosted website Bucket.
 */

gulp.task('deploy:staging', function() {
	return gulp.src(['build/**/*'])
		.pipe(s3({
			Bucket: staging_admin_frontend_bucket,
			ACL:    public_read
		}, {
			maxRetries: retry_count
		}))
		;
});

gulp.task('deploy:prod', function() {
	return gulp.src(['build/**/*'])
		.pipe(s3({
			Bucket: production_admin_frontend_bucket,
			ACL:    public_read
		}, {
			maxRetries: retry_count
		}))
		;
});

/**
 * Task to deploy maintenance page directly to AWS S3 hosted website Bucket.
 */

gulp.task('deploy:staging:maintenance', function() {
	return gulp.src(['src/maintenance-page/*'])
		.pipe(s3({
			Bucket: staging_admin_frontend_bucket,
			ACL:    public_read
		}, {
			maxRetries: retry_count
		}))
		;
});

gulp.task('deploy:prod:maintenance', function() {
	return gulp.src(['src/maintenance-page/*'])
		.pipe(s3({
			Bucket: production_admin_frontend_bucket,
			ACL:    public_read
		}, {
			maxRetries: retry_count
		}))
		;
});

gulp.task('clean-scripts', function () {
	return gulp.src(['src/app/**/*.js', 'src/app/**/*.js.map'], {read: false, force: true})
		.pipe(clean());
});