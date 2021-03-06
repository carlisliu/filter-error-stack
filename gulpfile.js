var gulp = require('gulp');
var rollup = require('rollup').rollup;
var json = require('rollup-plugin-json');
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var version = require('./package.json').version;

gulp.task('rollup', function() {
    return rollup({
        input: 'index.js',
        plugins: [
            json(),
            nodeResolve({
                jsnext: true,
                main: true,
                browser: true,
                externals: ['window']
            }),
            commonjs()
        ]
    }).then(function(bundle) {
        return bundle.write({
            format: 'iife',
            file: `dist/bundle.js`,
            globals: {
                window: 'window',
            },
            name: 'FS',
            interop: false,
            strict: false
        });
    }, function(error) {
        console.error(error);
        throw error;
    });
});

gulp.task('default', ['rollup'], function() {
    gulp.src(`dist/bundle.js`)
        .pipe(uglify({
            output: {
                comments: /^@license/
            },
            mangle: {
                reserved: ['__reserved__']
            },
            ie8: true
        }))
        .pipe(rename(`filter-stack.min.js`))
        .pipe(gulp.dest('dist/'));
});