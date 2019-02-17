const gulp = require('gulp'); // Подключаем Gulp
const sass = require('gulp-sass'); //Подключаем Sass пакет,
const browserSync = require('browser-sync'); // Подключаем Browser Sync
const del = require('del'); // Подключаем библиотеку для удаления файлов и папок
const imagemin = require('gulp-imagemin'); // Подключаем библиотеку для работы с изображениями
const pngquant = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png
const cache = require('gulp-cache'); // Подключаем библиотеку кеширования
const autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

gulp.task('sass', function(){ // Создаем таск Sass
    return gulp.src('app/scss/**/*.scss') // Берем источник
        .pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('watch', function() {
    gulp.watch('app/scss/**/*.scss', gulp.parallel('sass')); // Наблюдение за sass файлами в папке sass
    gulp.watch('app/index.html', function(){
        return browserSync.reload();
    }); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', function(){
    return browserSync.reload;
    });   // Наблюдение за JS файлами в папке js
});

gulp.task('clean', function() {
    return del('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});

gulp.task('build', gulp.series('clean', gulp.parallel('img')), function() {

    gulp.src( // Переносим библиотеки в продакшен
        'app/css/main.css'
        )
    .pipe(gulp.dest('dist/css'))

    gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    gulp.src('app/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));
});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', gulp.parallel('watch', 'browser-sync'));