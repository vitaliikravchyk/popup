const gulp = require("gulp"); // Подключаем Gulp
const sass = require("gulp-sass"); //Подключаем Sass пакет,
const browserSync = require("browser-sync"); // Подключаем Browser Sync
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const rigger = require("gulp-rigger"); 
const batch = require("gulp-batch");
const del = require("del"); // Подключаем библиотеку для удаления файлов и папок
const imagemin = require("gulp-imagemin"); // Подключаем библиотеку для работы с изображениями
const cssmin = require('gulp-minify-css');
const pngquant = require("imagemin-pngquant"); // Подключаем библиотеку для работы с png
const cache = require("gulp-cache"); // Подключаем библиотеку кеширования
const autoprefixer = require("gulp-autoprefixer"); // Подключаем библиотеку для автоматического добавления префиксов

gulp.task("scss", function() {
  // Создаем таск Sass
  return gulp
		.src("app/scss/main.scss")
		.pipe(sourcemaps.init()) // Берем источник
    .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
    .pipe(
      autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
        cascade: true
      })
		) // Создаем префиксы
		.pipe(cssmin())
		.pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/css")) // Выгружаем результата в папку dist/css
    .pipe(browserSync.reload({ stream: true })); // Обновляем CSS на странице при изменении
});

gulp.task("scripts", function () {
	return gulp
		.src("app/js/main.js", {allowEmpty: true})
		.pipe(rigger())
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("dist/js"))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task("html", function () {
	return gulp
		.src('app/*.html')
		.pipe(rigger()) //  позволяет использовать такую конструкцию для импорта файлов: (//= template/footer.html)
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({ stream: true }));
	});

gulp.task("img", function() {
  return gulp
  	.src("app/img/**/*") // Берем все изображения из app
  	.pipe(
      cache(
        imagemin({
          // Сжимаем их с наилучшими настройками с учетом кеширования
          interlaced: true,
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          use: [pngquant()]
        })
      )
    )
		.pipe(gulp.dest("dist/img")) // Выгружаем на продакшен
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task("fonts", function(){
	return gulp
		.src("app/fonts/**/*")
		.pipe(gulp.dest("dist/fonts"))
})
gulp.task("server", function() {
  // Создаем таск server
  browserSync({
    // Выполняем browserSync
    server: {
      // Определяем параметры сервера
      baseDir: "dist" // Директория для сервера - app
    },
		notify: false, // Отключаем уведомления
  });
});

gulp.task("clean", function() {
  return del("dist"); // Удаляем папку dist перед сборкой
});

gulp.task("build", gulp.series("clean", gulp.parallel("html", "scss", "img", "scripts", "fonts")));

gulp.task('watch', function () {
	gulp.watch(['app/**/*.html', 'app/scss/**/*.scss'], gulp.series('build'))
});


gulp.task("clear", function() { //clear cache
  return cache.clearAll();
});

gulp.task("default", gulp.series("build", gulp.parallel("server", "watch")));
