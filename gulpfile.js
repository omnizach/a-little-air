var babelify    = require('babelify'),
    browserify  = require('browserify'),
    browserSync = require('browser-sync').create(),
    buffer      = require('vinyl-buffer'),
    concat      = require('gulp-concat'),
    cssmin      = require('gulp-cssmin'),
    del         = require('del'),
    gulp        = require('gulp'),
    rename      = require('gulp-rename'),
    source      = require('vinyl-source-stream'),
    sourcemaps  = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    watchify    = require('watchify');

var config = {
  css: [
    './node_modules/purecss/build/pure.css',
    './node_modules/font-awesome/css/font-awesome.css',
    './src/css/**/*'
  ],
  js: './src/js/main.js'
};

gulp.task('clean', function() {
  del.sync('./public/**/*');
});

function scripts(watch) {
  var bundler, rebundle;
  bundler = browserify(config.js, {
    basedir: __dirname, 
    debug: true, 
    cache: {}, // required for watchify
    packageCache: {}, // required for watchify
    fullPaths: watch // required to be true only for watchify
  });
  if(watch) {
    bundler = watchify(bundler);
  }

  bundler.transform(babelify, { presets: ['es2015'] });

  rebundle = function() {
    //console.log('rebundling');
    var stream = bundler.bundle();
    //stream.on('error', handleError('Browserify'));
    stream.on('error', function() {
      console.error('error');
    })
    stream = stream.pipe(source('app.js'))
                   .pipe(buffer())
                   .pipe(sourcemaps.init({loadMaps: true}))
                   .pipe(sourcemaps.write('.'))
                   .pipe(gulp.dest('./public/js'))
                   .pipe(browserSync.reload({ stream: true }));
    //stream.on('end', function() { console.log('done'); });
    return stream;
  };

  bundler.on('update', rebundle);
  return rebundle();
}

gulp.task('js', function() {
  return scripts(false);
});

gulp.task('js-prod', ['clean'], function() {
  return browserify(config.js)
          .transform(babelify, { presets: ['es2015'] })
          .bundle()
          .pipe(source('app.min.js'))
          .pipe(buffer())
          .pipe(uglify().on('error', console.log))
          .pipe(gulp.dest('./public/js'));
});

gulp.task('watch-js', function() {
  return scripts(true);
});

gulp.task('html', function() {
  return gulp.src('./src/index.html')
             .pipe(gulp.dest('./public'));
});

gulp.task('watch-html', function() {
  gulp.watch('./src/**/*.html', ['html', 'refresh']);
});

gulp.task('css', function() {
  return gulp.src(config.css)
             .pipe(sourcemaps.init({loadMaps: true}))
             .pipe(concat("style.min.css"))
             //.pipe(cssmin())
             .pipe(sourcemaps.write('.'))
             .pipe(gulp.dest('./public/css'));
});

gulp.task('css-prod', ['clean'], function() {
  return gulp.src(config.css)
             .pipe(concat('style.min.css'))
             .pipe(cssmin())
             .pipe(gulp.dest('./public/css'));
})

gulp.task('watch-css', function() {
  gulp.watch('./src/css/**/*', ['css', 'refresh']);
});

gulp.task('fonts', function() {
  return gulp.src([
      './src/fonts/**/*',
      './node_modules/font-awesome/fonts/**/*'
    ])
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('build', ['html', 'js', 'css', 'fonts']);

gulp.task('watch', ['watch-html', 'watch-css', 'watch-js']);

gulp.task('serve', ['build'], function() {
  return browserSync.init({ 
    server:  { 
      baseDir: './public' 
    },
    injectChanges: false,
    delay: 50
  });
});

gulp.task('refresh', browserSync.reload);

gulp.task('default', ['watch', 'serve']);

gulp.task('build-prod', ['js-prod', 'css-prod', 'html', 'fonts']);
