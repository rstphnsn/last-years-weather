const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const debug = require('gulp-debug');
const del = require('del');
const runSequence = require('run-sequence');

const paths = {
  src: './src/',
  build: './html/',
  index: 'index.html',
  scss: 'assets/scss/*.scss',
  images: 'assets/images/**/*',
  js: 'assets/js/**/*',
  root: 'assets/root/**/*',
};

gulp.task('copy:assets:js', () => {
  return gulp.src(paths.src + paths.js)
    .pipe(gulp.dest(paths.build + 'assets/js'))
});

gulp.task('copy:assets:images', () => {
  return gulp.src(paths.src + paths.images)
    .pipe(gulp.dest(paths.build + 'assets/images'))
});

gulp.task('copy:assets:root',  () => {
  return gulp.src(paths.src + paths.root)
    .pipe(gulp.dest(paths.build))
});

gulp.task('copy:assets:scss', () => {
  return gulp.src(paths.src + paths.scss)
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(rename('styles.min.css'))
    .pipe(debug({title: 'unicorn:'}))
    .pipe(gulp.dest(paths.build + 'assets/css'));
});

gulp.task('copy:app', () => {
  gulp.src(paths.src + paths.index)
    .pipe(gulp.dest(paths.build));
});

gulp.task('clean', () => {
  return del(paths.build + '*');
});

gulp.task('watch', () => {
  gulp.watch(paths.js, { cwd: paths.src }, ['lint:assets:js','copy:assets:js']);
  gulp.watch(paths.images, { cwd: paths.src }, ['copy:assets:images']);
  gulp.watch(paths.root, { cwd: paths.src }, ['copy:assets:root']);
  gulp.watch(paths.scss, { cwd: paths.src }, ['copy:assets:scss']);
  gulp.watch([
    paths.index,
  ], { cwd: paths.src }, ['copy:app']);
});

gulp.task('lint:assets:js', () => {
  return gulp.src([
      paths.src + paths.js
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint', done => {
  runSequence(
    'lint:assets:js',
     () => {
      done();
    }
  )
});

gulp.task('default', done => {
  runSequence(
    'clean',
    'copy:app',
    'copy:assets:js',
    'copy:assets:images',
    'copy:assets:root',
    'copy:assets:scss',
    'lint',
     () => {
      done();
    }
  )
});
