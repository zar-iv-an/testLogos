const gulp = require('gulp');
const {series,parallel} = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');

const html = () => {
   return gulp.src('src/pug/*.pug')
   .pipe(pug({pretty:true }))
   .pipe(gulp.dest('build'))
};

const styles = () => {
 return gulp.src('src/styles/*.scss')
 .pipe(sass().on('err',sass.logError))
 .pipe(autoprefixer()
 .pipe(cssnano()))
 .pipe(rename({suffix:'.min'}))
 .pipe(gulp.dest('build/css'))
};

const images = () => {
   return gulp.src('src/images/*.*')
   .pipe(imagemin())
   .pipe(gulp.dest('build/images'))
};
const server = () =>  {
   browserSync.init({
      server: {
         baseDir: './build'
      },
      notify:false
   });
   browserSync.watch('build',browserSync.reload);
};

 const deleteBuild = (cd) => {
   return del('build/**/*.*').then(() => { cd()})
};

const watch = () => {
   gulp.watch('src/pug/**',html);
   gulp.watch('src/styles/**/*.scss',styles);
   gulp.watch('src/images/*.*',images);
};
exports.default = series(
   deleteBuild, 
   parallel(html,styles,images),
   parallel(watch,server)
);


