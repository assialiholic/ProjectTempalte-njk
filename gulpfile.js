const gulp = require('gulp'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    through2 = require('through2'),
    rimraf = require('rimraf'),
    p = require('gulp-load-plugins')();

const SRC = 'src',
    DEST = 'public_html';

function plumberNotify(){
  return p.plumber({errorHandler: p.notify.onError("<%= error.message %>")});
}


// -------------------------------------------------------------------
// CSS
// -------------------------------------------------------------------
//scssファイルをcomb
gulp.task('comb', function () {
  return gulp.src([
    SRC + '/**/*.scss',
    '!src/**/_vars.scss',
    '!src/**/_functions.scss',
    '!src/**/_mixins.scss',
    '!src/**/_base.scss',
    '!src/**/_helper.scss'
  ],{
    base: SRC
  })
  .pipe(p.using())
  .pipe(plumberNotify())
  .pipe(p.csscomb())
  .pipe(gulp.dest(SRC))
});


//sassのコンパイル
gulp.task('sass', function () {
  return gulp.src([
    SRC + '/**/*.scss',
    '!src/**/_*.scss'
  ],{
    base: SRC
  })
  .pipe(p.using())
  .pipe(plumberNotify())
  .pipe(p.sourcemaps.init())
  .pipe(p.sass({outputStyle: 'expanded'}).on('error', p.sass.logError))
  .pipe(p.autoprefixer({
    browsers: ['last 2 versions', 'ie 10-11', 'iOS >= 8', 'Android >= 4.4'],
    cascade: false
  }))
  .pipe(p.sourcemaps.write('../' + DEST))
  .pipe(gulp.dest(DEST))
});


//clean
gulp.task('clean', function (cb) {
  rimraf(DEST, cb);
});


//copy
gulp.task('copy', function(){
  return gulp.src([
    SRC + '/**/*.html'
  ])
  .pipe(gulp.dest(DEST))
});


// -------------------------------------------------------------------
// コンパイル実行処理
// -------------------------------------------------------------------

//server
gulp.task('server', function(){
  browserSync({
    server: {
      baseDir: DEST,
      index: 'index.html'
    }
  });
});


//watch
gulp.task('watch', ['server'], function(){
  gulp.watch([
    SRC + '/**/*',
    '!src/**/*.scss',
  ], ['copy', browserSync.reload]);
  gulp.watch([SRC + '/**/*.html'], ['copy', browserSync.reload]);
  gulp.watch([SRC + '/**/*.scss'], ['sass', browserSync.reload]);
});


gulp.task('default', function (cb) {
  runSequence(
    'clean',
    'copy',
    'sass',
    'watch',
    cb
  );
});

