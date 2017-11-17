const gulp = require('gulp');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const rimraf = require('rimraf');
const combineMq = require('gulp-combine-mq');
const p = require('gulp-load-plugins')();

const SRC = 'src';
const DEST = 'demo';

function plumberNotify(){
  return p.plumber({errorHandler: p.notify.onError("<%= error.message %>")});
}


// -------------------------------------------------------------------
// Tasks
// -------------------------------------------------------------------

// CSS
// -------------------------------------------------------------------
gulp.task('sass', function () {
  return gulp.src([
    SRC + '/**/*.scss',
    '!src/**/_*.scss'
  ],{
    base: SRC
  })
  .pipe(p.using())
  .pipe(plumberNotify())
  .pipe(p.sass({outputStyle: 'expanded'}).on('error', p.sass.logError))
  .pipe(p.combineMq({beautify: true}))
  .pipe(p.autoprefixer({
    browsers: ['last 2 versions', 'ie 10-11', 'iOS >= 8', 'Android >= 4.4'],
    cascade: false
  }))
  .pipe(gulp.dest(DEST))
});


// File Management
// -------------------------------------------------------------------
gulp.task('clean', function (cb) {
  rimraf(DEST, cb);
});

gulp.task('copy', function(){
  return gulp.src([
    SRC + '/**/*.html'
  ])
  .pipe(gulp.dest(DEST))
});


// Environment
// -------------------------------------------------------------------
gulp.task('server', function(){
  browserSync({
    server: {
      baseDir: DEST,
      index: 'index.html'
    }
  });
});

gulp.task('watch', ['server'], function(){
  gulp.watch([
    SRC + '/**/*',
    '!src/**/*.scss',
  ], ['copy', browserSync.reload]);
  gulp.watch([SRC + '/**/*.html'], ['copy', browserSync.reload]);
  gulp.watch([SRC + '/**/*.scss'], ['sass', browserSync.reload]);
});


// -------------------------------------------------------------------
// Execution
// -------------------------------------------------------------------
gulp.task('default', function (cb) {
  runSequence(
    'clean',
    'copy',
    'sass',
    'watch',
    cb
  );
});
