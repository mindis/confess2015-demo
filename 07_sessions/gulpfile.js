var gulp = require("gulp");
var less = require("gulp-less");
var LessPluginAutoPrefix = require("less-plugin-autoprefix");
var LessPluginCleanCSS = require("less-plugin-clean-css");
var del = require("del");

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
