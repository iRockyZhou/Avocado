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
var RevAll = require('gulp-rev-all');
var replace = require('gulp-replace');

/**
 * CDN URL perfix
 */
var cdnPrefix = 'http://demo.cdnsite.cn/';

/**
 * Paths config
 */
var paths = {
  src: {
    index: 'src/',
    html: 'src/html/',
    js: 'src/js/',
    css: 'src/css/',
    images: 'src/images/'
  },
  dist: {
    index: 'dist/',
    html: 'dist/html/',
    js: 'dist/js/',
    css: 'dist/css/',
    images: 'dist/images/'
  },
  cdn: {
    index: 'cdn/'
  }
};

/**
 * Aliyun OSS config
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
gulp.task('release', ['revision', 'replaceVersionRef', 'upload']);

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
  gulp.src(paths.src.index + '*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeScriptTypeAttributes: true,
      minifyJS: true,
      minifyCss: true
    }))
    .pipe(gulp.dest(paths.dist.index));
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
  del.sync([paths.dist.index + '**']);
});

gulp.task('clean:cdn', function () {
  del.sync([paths.cdn.index + '**']);
});

gulp.task('revision', function() {
  var revAll = new RevAll({
    transformPath: function(rev, source) {
      if (/lib\//.test(rev)) {
        return cdnPrefix + source.replace(/\.\//, '');
      }
      return rev.replace(/^\.\//, cdnPrefix);
    },
    dontRenameFile: [/lib\//g]
    // ,
    // dontUpdateReference: [/lib\//g]
  });
  return gulp.src(paths.dist.index + '**')
    .pipe(revAll.revision())
    .pipe(gulp.dest('cdn/'));
});

gulp.task('replaceVersionRef', function() {
  return gulp.src('cdn/*.html')
    .pipe(replace(/index\.([\d\w]{8,12})\.html/, '$1'))
    .pipe(gulp.dest('cdn'));
});

gulp.task('upload', function(){
  return gulp.src([paths.cdn.index + '**']).pipe(oss(ossOptions));
});