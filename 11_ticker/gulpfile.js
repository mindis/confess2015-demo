var gulp = require("gulp");
var less = require("gulp-less");
var LessPluginAutoPrefix = require("less-plugin-autoprefix");
var LessPluginCleanCSS = require("less-plugin-clean-css");
var del = require("del");
var amdOptimize = require("amd-optimize");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var runSequence = require("run-sequence");

var autoprefixPlugin = new LessPluginAutoPrefix({
    browsers: ["> 1%", "last 2 versions", "ie 9"]
});
var cleanCSSPlugin = new LessPluginCleanCSS();

gulp.task("less:clean", function(cb) {
    del("./lesscss/main.css", cb)
});

gulp.task("less:build", function() {
    return gulp.src("./less/main.less")
        .pipe(less({
            plugins: [autoprefixPlugin, cleanCSSPlugin]
        }))
        .pipe(gulp.dest("./lesscss/"));
});

gulp.task("less:watch", function() {
    gulp.watch("./less/**/*.less", ["less:build"]);
});

gulp.task("js:clean", function(cb) {
    del("./js/build/main.js", cb)
});

gulp.task("js:build", function() {
    return gulp.src([
            "./js/app/**/*.js",
            "./js/app/**/*.html"
        ])
        .pipe(amdOptimize("main"))
        .pipe(concat("main.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./js/build"));
});

gulp.task("clean", ["less:clean", "js:clean"], function(cb) {
    cb();
});

gulp.task("build", ["less:build", "js:build"], function(cb) {
    cb();
});

gulp.task("default", [], function(cb) {
    runSequence(
        "clean",
        "build",
        cb
    );
});
