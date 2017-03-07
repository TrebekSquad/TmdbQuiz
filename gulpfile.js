'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;


gulp.task('styles', () => {
	return gulp.src('./dev/css/**/*.scss') // '**' any folder inside of, '*' any file with the extension of .scss
		.pipe(sass().on('error', sass.logError)) // on Error display message: 'error'
		.pipe(autoprefixer())
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./public/css'))
		.pipe(reload({stream: true}));
});


gulp.task('javascript', () => {
	return gulp.src('./dev/scripts/main.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('./public/scripts'))
		.pipe(reload({stream: true}));
});


gulp.task('browser-sync', () => {
  browserSync.init({
    server: './public'  
  })
});


gulp.task('watch', () => {
	return gulp.watch('./dev/styles/**/*.scss', ['styles']);
});


gulp.task('default', ['styles', 'javascript', 'browser-sync', 'watch']) // 'watch' should be last task