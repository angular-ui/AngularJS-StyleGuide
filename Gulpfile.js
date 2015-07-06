////
// !!RECOMMEND WRITING YOUR OWN GULPFILE FROM SCRATCH!!
//
// Think of tasks as their actions and NOT what they act on.
// Icons, fonts, images are separate groups, but share the same actions.
//
// 1. Configure Folder Paths for groups
// 2. Setup global defaults and flags (default, `--prod`, `gulp watch`, `gulp build`)
// 3. Create tasks
//    3.1. Create wrapper (default) task
//    3.2. Create variations of task with path+configuration passed to reusable generator
//    3.3. Reusable task generator, configuration is abstracted and passed in
////

var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    mainBowerFiles = require('main-bower-files'),
    del = require('del');


////// PATH CONFIGURATIONS //////
// NOTE: Refrane from configuring tasks here
// NOTE: `watch` key is optional, falls back to `src`

var paths = {
  clean: ['public/'],
  rev: {
    src: ['app/views/layouts/application.html.erb'],
    dest: 'app/views/layouts/'
  },
  static: {
    client: {
      src: ['client/static/**'],
      dest: 'public/',
    },
    images: {
      src: ['app/assets/images/**'],
      dest: 'public/images/',
    },
    fonts: {
      src: ['bower_components/font-awesome/fonts/*'],
      dest: 'public/fonts',
    }
  },
  html: {
    client: {
      src: ['client/modules/**/*.html'],
      dest: 'public/modules/',
    }
  },
  styles: {
    client: {
      src: ['client/modules/townsquared.scss'],
      dest: 'public/',
      watch: ['client/modules/**/*.scss', 'client/styles/**/*.scss'],
      includes: ['app/assets/stylesheets', 'client/modules', 'client/styles', 'bower_components']
    }
  },
  scripts: {
    client: {
      src: ['client/modules/**/*.js'],
      dest: 'public/modules/',
      file: 'townsquared.js',
    },
    vendors: {
      src: mainBowerFiles({ filter: '**/*.js' }),
      dest: 'public/',
      file: 'vendors.js',
      watch: ['bower_components/**/*.js']
    }
  }
};


////// GLOBALS //////

// `--prod` can be used on any task
var isProduction = plugins.util.env.prod;

gulp.task('default', ['build']);

if (isProduction)
  gulp.task('build', plugins.sequence('clean', ['static', 'html', 'styles', 'scripts'], 'rev'));
else
  gulp.task('build', plugins.sequence('clean', ['static', 'html', 'styles', 'scripts']));
  
  
////// WATCH //////

gulp.task('watch', ['build'], function(){
  plugins.livereload.listen();
  gulp.watch(paths.static.client.watch || paths.static.client.src, ['static:client']);
  gulp.watch(paths.static.images.watch || paths.static.images.src, ['static:images']);
  gulp.watch(paths.html.client.watch || paths.html.client.src, ['html:client']);
  gulp.watch(paths.styles.client.watch || paths.styles.client.src, ['styles:client']);
  gulp.watch(paths.scripts.client.watch || paths.scripts.client.src, ['scripts:client']);
});


////// CLEAN //////

gulp.task('clean', ['clean:files', 'clean:rev']);
gulp.task('clean:files', clean(paths.clean));
gulp.task('clean:rev', rev(paths.rev, true));
function clean(paths) {
  return function(cb) {
    del(paths, cb);

  };
}


////// REVISION //////
// TODO: Don't use query params for cachebusting (proxies won't cache them)
gulp.task('rev', rev(paths.rev));
function rev(paths, reset) {
  return function() {
    return gulp.src(paths.src)
      .pipe(plugins.replace(/\?CACHEBUST=(\d+)/g, '?CACHEBUST=' + ( reset ? 0 : Date.now() )))
      .pipe(gulp.dest(paths.dest));
  };
}



////// STATIC //////

gulp.task('static', ['static:client', 'static:images', 'static:fonts'])
gulp.task('static:client', static(paths.static.client));
gulp.task('static:images', static(paths.static.images));
gulp.task('static:fonts', static(paths.static.fonts));
function static(paths) {
  return function() {
    return gulp.src(paths.src)
      .pipe(gulp.dest(paths.dest))
      .pipe(plugins.livereload());
  };
}


////// HTML //////

gulp.task('html', ['html:client']);
gulp.task('html:client', static(paths.html.client));
function html(paths) {
  return function() {
    return gulp.src(paths.src)
      .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
      .pipe(plugins.if(isProduction,
        plugins.angularTemplatecache()
      ))
      .pipe(gulp.dest(paths.dest))
      .pipe(plugins.livereload());
  };
}


////// STYLES //////

gulp.task('styles', ['styles:client']);
gulp.task('styles:client', styles(paths.styles.client));
function styles(paths) {
  return function() {
    return gulp.src(paths.src)
      .pipe(plugins.if(!isProduction,
        plugins.sourcemaps.init()
      ))
      .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>\n<%= error.fileName %>:<%= error.lineNumber %>") }))
      .pipe(plugins.sass({
        includePaths: paths.includes
      }))
      .pipe(plugins.autoprefixer())
      .pipe(plugins.bless())
      .pipe(plugins.if(!isProduction,
        plugins.sourcemaps.write('.')
      ))
      .pipe(gulp.dest(paths.dest))
      // .pipe(plugins.ignore.exclude('**/*.map'))
      .pipe(plugins.livereload());
  };
}


////// SCRIPTS //////

gulp.task('scripts', ['scripts:client', 'scripts:vendors']);
gulp.task('scripts:client', scripts(paths.scripts.client, true, true));
gulp.task('scripts:vendors', scripts(paths.scripts.vendors));
function scripts(paths, sort, parse) {
  return function() {
    return gulp.src(paths.src)
      .pipe(plugins.if(!isProduction,
        plugins.sourcemaps.init()
      ))
      .pipe(plugins.plumber({ errorHandler: plugins.notify.onError("Error: <%= error.message %>") }))
      .pipe(plugins.if(parse,
        plugins.babel({
          blacklist: ["strict"]
        })
      ))
      .pipe(plugins.if(sort,
        plugins.angularFilesort()
      ))
      .pipe(plugins.concat(paths.file))
      // TODO: no annotate due to rumors of issues with ui-router
      // .pipe(plugins.if(isProduction,
      //   plugins.ngAnnotate()
      // ))
      .pipe(plugins.if(isProduction,
        plugins.uglify({ mangle: false })
      ))
      .pipe(plugins.if(!isProduction,
        plugins.sourcemaps.write('.')
      ))
      .pipe(gulp.dest(paths.dest))
      .pipe(plugins.livereload());

  };
}
