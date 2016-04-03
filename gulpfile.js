var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');
var useref = require('gulp-useref');
var imageMin = require('gulp-imagemin');
var browserSync = require('browser-sync')
var pngquant = require('imagemin-pngquant');
var oss = require('gulp-alioss');
const del = require('del');
var jsHint = require('gulp-jshint');

/**
 * Paths config
 */
var paths = {
  src: {
    index: 'src/',
    src: 'src/',
    html: 'src/html/',
    js: 'src/js/',
    css: 'src/css/',
    images: 'src/images/'
  },
  dist: {
    index: 'dist/',
    dist: 'dist/',
    html: 'dist/html/',
    js: 'dist/js/',
    css: 'dist/css/',
    images: 'dist/images/'
  }
};

/**
 * Aliyun OSS config
 * @type {Object}
 */
var ossOptions = {
  accessKeyId: '******',
  secretAccessKey: '******',
  endpoint: 'http://oss-cn-******.aliyuncs.com',
  apiVersion: '2013-10-15',
  prefix: 'YOUR_SITE_PREFIX',
  bucket: 'YOUR_BARKET_NAME'
};

/**
 * Default task
 */
gulp.task('default', function() {
  console.info('\n', '\033[33mPlease Use: \033[0m', 'gulp dev|build|upload', '\n');
});
/**
 * Connect to the browser
 * Sync code and browser
 */
gulp.task('dev', function() {
  browserSyncTask(paths.src.index);
});
/**
 * Build whole site
 */
gulp.task('build', ['clean:dist', 'htmlmin', 'cssmin', 'uglify', 'imagesmin'], function() {
  browserSyncTask(paths.dist.index);
});
/**
 * Upload to Aliyun OSS
 */
gulp.task('release', ['upload']);

function browserSyncTask(path) {
  browserSync({
    port: 3000,
    open: true,
    files: paths.src.index + '**',
    server: {
      // directory: true,
      baseDir: path
    }
  });
}

gulp.task('htmlmin', function() {
  gulp.src(paths.src.src + '*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeScriptTypeAttributes: true,
      minifyJS: true,
      minifyCss: true
    }))
    .pipe(gulp.dest(paths.dist.dist));
  gulp.src(paths.src.html + '**')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeScriptTypeAttributes: true,
      minifyJS: true,
      minifyCss: true
    }))
    .pipe(gulp.dest(paths.dist.html));
});

gulp.task('cssmin', function() {
  return gulp.src(paths.src.css + '**')
    .pipe(cleanCSS({
      compatibility: 'ie6'
    }))
    .pipe(gulp.dest(paths.dist.css));
});

gulp.task('uglify', function() {
  return gulp.src(paths.src.js + '**')
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js));
});

gulp.task('jshint', function() {
  return gulp.src(paths.src.js + '*.js')
    .pipe(jsHint())
    .pipe(jsHint.reporter('default'));
});

gulp.task('imagesmin', function() {
  return gulp.src([paths.src.images + '**'])
    .pipe(imageMin({
      progressive: true,
      use: [pngquant({
        quality: '65-80',
        speed: 4
      })]
    }))
    .pipe(gulp.dest(paths.dist.images));
});

gulp.task('clean:dist', function () {
  del.sync(['./dist/**']);
});

gulp.task('upload', function(){
  return gulp.src([paths.dist.dist + '**']).pipe(oss(ossOptions));
});