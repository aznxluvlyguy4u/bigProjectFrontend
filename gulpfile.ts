const gulp = require("gulp");
const clean = require("gulp-clean");
const zip = require('gulp-zip');
const env = require('gulp-env');
const s3 = require('gulp-s3-upload')(awsConfig);

var fs = require('fs');
var packageJson = JSON.parse(fs.readFileSync('./package.json'));
var version = packageJson.version;
var filename = 'nsfo-admin-build';

const zip_files_bucket = 'nsfo/deployments/frontend';
const staging_admin_frontend_bucket = 'dev-admin.nsfo.nl';
const production_admin_frontend_bucket = 'admin.nsfo.nl';
const public_read = 'public-read';
const retry_count = 5;

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

gulp.task('publish:staging', function() {
	return gulp.src(['build/**/*'])
		.pipe(s3({
			Bucket: staging_admin_frontend_bucket,
			ACL:    public_read
		}, {
			maxRetries: retry_count
		}))
		;
});

gulp.task('publish:prod', function() {
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
 * Task to deploy the zip file to AWS S3 Bucket
 */

gulp.task('publish:zip:staging', function() {
	let zipname = filename + '-staging-';
	return gulp.src('dist/'+zipname+version+'.zip')
		.pipe(s3({
			Bucket: zip_files_bucket,
			ACL:    public_read
		}, {
			maxRetries: retry_count
		}))
		;
});

gulp.task('publish:zip:prod', function() {
	let zipname = filename + '-production-';
  return gulp.src('dist/'+zipname+version+'.zip')
		.pipe(s3({
				Bucket: zip_files_bucket,
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