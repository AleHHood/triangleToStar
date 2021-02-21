"use strict";

const gulp = require("gulp");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");
const sass = require('gulp-sass');
const rigger = require('gulp-rigger');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const { src } = require("gulp");

const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');

const dist = "./dist/";



gulp.task('server', function() {

  browsersync({
      server: {
          baseDir: "dist"
      }
  });

  gulp.watch('dist/*.html').on('change', browsersync.reload);
});


 
gulp.task('html', function () {
  return gulp.src('src/pages/*.html')
        .pipe(rigger())
        .pipe(gulp.dest(dist));
});





gulp.task("build-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'script.js'
                    },
                    watch: false,
                    devtool: "source-map",
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist))
                .on("end", browsersync.reload);
});

gulp.task("copy-assets", () => {
    return gulp.src("./src/assets/**/*.*")
                .pipe(gulp.dest(dist + "/assets"))
                .on("end", browsersync.reload);
});


gulp.task('images', function () {
  return gulp.src("src/img/**/*")
      .pipe(imagemin())
      .pipe(gulp.dest("dist/img"));
});

gulp.task('fonts', function () {
  return gulp.src("src/fonts/**/*")
      .pipe(gulp.dest("dist/fonts"));
});


gulp.task('styles', function() {
  return gulp.src("src/styles/**/**/*.+(scss|sass)")
      .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(rename({suffix: '.min', prefix: ''}))
      .pipe(autoprefixer())
      .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest("src/css"))
      .pipe(gulp.dest("dist/css"))
      .pipe(browsersync.stream());
});



gulp.task("watch", () => {


    gulp.watch("src/styles/**/**/*.+(scss|sass)", gulp.parallel('styles'));
    gulp.watch('src/pages/**/*.html', gulp.parallel('html'));
    gulp.watch("./src/assets/**/*.*", gulp.parallel("copy-assets"));
    gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
});









gulp.task("build", gulp.parallel('fonts','images', 'html', 'styles', "copy-assets", "build-js"));

gulp.task("build-prod-js", () => {
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'production',
                    output: {
                        filename: 'script.js'
                    },
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist));
});

gulp.task("default", gulp.parallel("watch", "build", 'server', 'styles', 'html'));