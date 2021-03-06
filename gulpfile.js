(function() {
  'use strict';

  const gulp = require('gulp'),
  sourcemaps = require('gulp-sourcemaps'),
  del = require('del'),
  notify = require('gulp-notify'),
  concat = require('gulp-concat'),
  concatCss = require('gulp-concat-css'),
  uglifyJs = require('gulp-uglifyes'),
  uglifycss = require('gulp-uglifycss'),
  pug = require('gulp-pug'),
  rename = require('gulp-rename'),
  browserSync = require('browser-sync').create(),
  postcss = require('gulp-postcss'),
  sugarss = require('sugarss'),
  watch = require('gulp-watch'),
  cached = require('gulp-cached'),
  gulpWatchPug = require('gulp-watch-pug'),
  cssbeautify = require('gulp-cssbeautify'),
  stripCssComments = require('gulp-strip-css-comments'),
  cssDeclarationSorter = require('css-declaration-sorter'),
  babel = require('gulp-babel'),
  cheerio = require('gulp-cheerio'),
  svgmin = require('gulp-svgmin'),
  replace = require('gulp-replace'),
  svgSprite = require('gulp-svg-sprite');

  var svgSpriteConfig = {
    mode: {
        inline: true,
        symbol: {
          render: {
            scss: true
          },
          example: true
        }
      }
    }

  //create svg sprite
  gulp.task('svg-sprite', function () {
    return gulp.src('app/assets/img/svg-for-sprite/*.svg')
    .pipe(svgmin({
      js2svg: {
        pretty: true
      }
    }))
    .pipe(cheerio({
      run: function ($) {
        $('[fill]').removeAttr('fill');
        $('[style]').removeAttr('style');
        $('[stroke]').removeAttr('stroke');
        $('[opacity]').removeAttr('opacity');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite(svgSpriteConfig))
    .pipe(gulp.dest('app/assets/img'));
  });

  //write html by pug
  gulp.task('views', function buildHTML() {
    return gulp
    .src('app/assets/views/*.pug')
    .pipe(
      pug({
        pretty: true
      })
      )
    .pipe(gulp.dest('dest/'));
  });

  const processors = [
  require('postcss-import'),
  require('postcss-alias'),
  require('postcss-for'),
  require('postcss-each'),
  require('postcss-assets')({
    loadPaths: ['img/', 'img/icons'],
    basePath: 'dest/',
    relative: 'styles/'
  }),
  require('postcss-nested-ancestors'),
  require('postcss-nested'),
  require('postcss-inline-media'),
  require('postcss-short-spacing'),
  require('postcss-size'),
  require('postcss-position'),
  require('postcss-flexbox'),
  require('postcss-simple-vars'),
  require('postcss-short-text'),
  require('postcss-responsive-type'),
  require('postcss-extend'),
  require('postcss-mixins'),
  require('postcss-inline-svg')({
    path: 'app/assets/img/'
  }),
  require('autoprefixer'),
  require('postcss-pxtorem')({
    selectorBlackList: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    '.btn',
    ]
  }),
  require('postcss-unique-selectors'),
  require('css-mqpacker')({
    sort: true
  }),
  require('postcss-sorting')
  ];

  //write style
  gulp.task('postcss', function() {
    return (
      gulp
      .src(['app/styles/main.sss'])
      .pipe(sourcemaps.init())
      .pipe(
        postcss(processors, { parser: sugarss }).on('error', notify.onError())
        )
      .pipe(
        cssbeautify({
          indent: '  ',
          autosemicolon: true
        })
        )
      .pipe(rename({ extname: '.css' }))
        //.pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('dest/styles/'))
        );
  });

  // write js
  gulp.task('scripts', function() {
    return gulp.src('app/scripts/**').pipe(
      babel({
        presets: ['@babel/env']
      })
      ).pipe(gulp.dest('dest/scripts'));
  });

  //delete dest folder
  gulp.task('clean', function() {
    return del('dest');
  });

  //lib
  gulp.task('libs-css', function() {
    return gulp
    .src('app/libs/**/*.css')
    .pipe(uglifycss())
    .pipe(concat('libs.min.css'))
    .pipe(gulp.dest('dest/styles/'));
  });

  gulp.task('libs-js', function() {
    return gulp
    .src('app/libs/**/*.js')
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest('dest/scripts/'));
  });

  //copy all assets files
  gulp.task('assets', function() {
    return gulp
    .src('app/assets/**', {
      since: gulp.lastRun('assets')
    })
    .pipe(cached('app/assets'))
    .pipe(gulp.dest('dest'));
  });

  //run task for build once
  gulp.task(
    'build',
    gulp.series(
      'clean',
      gulp.parallel(
        'assets',
        'postcss',
        'views',
        'libs-css',
        'libs-js',
        'scripts',
        'svg-sprite'
        )
      )
    );

  //up static server; watching change in dest and reload page
  gulp.task('server', function() {
    browserSync.init({
      server: 'dest',
      notify: false
    });

    browserSync.watch('dest/**/*.*').on('change', browserSync.reload);
  });

  //watching by all files in dest
  gulp.task('watch', function() {
    gulp.watch('app/styles/**/*.*', gulp.series('postcss'));
    gulp.watch('app/scripts/**/*.*', gulp.series('scripts'));
    gulp.watch('app/assets/**/*.*', gulp.series('assets'));
    gulp.watch('app/assets/views/**/*.*', gulp.series('views'));
    gulp.watch('app/libs/**/*.js', gulp.series('libs-js'));
    gulp.watch('app/libs/**/*.css', gulp.series('libs-css'));
    gulp.watch('app/assets/img/svg-for-sprite/*.svg', gulp.series('svg-sprite'));
  });

  gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'server')));
})();
