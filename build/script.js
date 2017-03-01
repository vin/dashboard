// Copyright 2015 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Gulp tasks for processing and compiling frontend JavaScript files.
 */
import async from 'async';
import closureCompiler from 'google-closure-compiler';
import gulp from 'gulp';
import gulpHtmlmin from 'gulp-htmlmin';
import gulpModify from 'gulp-modify';
import gulpRename from 'gulp-rename';
import path from 'path';
import through from 'through2';
import webpackStream from 'webpack-stream';

import conf from './conf';
import {processI18nMessages} from './i18n';

const gulpClosureCompiler = closureCompiler.gulp();

/**
 * Returns function creating a stream that compiles frontend JavaScript files into development bundle located in
 * {conf.paths.serve}
 * directory. This has to be done because currently browsers do not handle ES6 syntax and
 * modules correctly.
 *
 * Only dependencies of root application module are included in the bundle.
 * @param {boolean} throwError - whether task should throw an error in case of JS syntax errors.
 * @return {function()} - a function with a 'next' callback as parameter.
 * When executed, it runs the gulp compilation stream and calls next() when done. Required by
 * 'async'.
 */
function createScriptsStream(throwError) {
  return function() {
    let webpackOptions = {
      devtool: 'inline-source-map',
      module: {
        // ES6 modules have to be preprocessed with Babel loader to work in browsers.
        loaders: [{test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader']}],
      },
      output: {filename: 'app-dev.js'},
      resolve: {
        // Set the module resolve root, so that webpack knows how to process non-relative imports.
        // Should be kept in sync with respective Closure Compiler option.
        root: conf.paths.frontendSrc,
      },
      quiet: true,
    };
    let compiled = gulp.src(path.join(conf.paths.frontendSrc, 'index_module.js'))
                       .pipe(webpackStream(webpackOptions));

    if (!throwError) {
      // prevent gulp from crashing during watch task in case of JS syntax errors
      compiled = compiled.on('error', function handleScriptSyntaxError(err) {
        compiled.emit('end');
        console.log(err.toString());
      });
    }

    return compiled.pipe(gulp.dest(conf.paths.serve));
  };
}
/**
 * Compiles frontend JavaScript files into development bundle located in
 * {conf.paths.serve} directory. This has to be done because currently browsers do not handle ES6
 * syntax and modules correctly.
 *
 * Only dependencies of root application module are included in the bundle.
 *
 * Throws an error in case of JS syntax errors.
 */
gulp.task('scripts', createScriptsStream(true));

/**
 * Compiles frontend JavaScript files into development bundle located in
 * {conf.paths.serve} directory. This has to be done because currently browsers do not handle ES6
 * syntax and modules correctly.
 *
 * Only dependencies of root application module are included in the bundle.
 *
 * Prints an error and fails silently in case of JS syntax errors.
 * This is useful during development - watch task no longer breaks due to syntax errors.
 */
gulp.task('scripts-watch', createScriptsStream(false));

/**
 * Creates a google-closure compilation stream in which the .js sources are localized
 * for a specific translation / locale.
 * @param {undefined|Object} translation - optional translation spec, otherwise compiles the default
 * application logic.
 * @return {function(function(Object, Object))} - a function with a 'next' callback as parameter.
 * When executed, it runs the gulp compilation stream and calls next() when done. Required by
 * 'async'.
 */
function createCompileTask(translation) {
  let externs = [
    path.join(conf.paths.nodeModules, 'google-closure-compiler/contrib/externs/angular-1.5.js'),
    path.join(
        conf.paths.nodeModules,
        'google-closure-compiler/contrib/externs/angular-1.5-http-promise_templated.js'),
    path.join(
        conf.paths.nodeModules,
        'google-closure-compiler/contrib/externs/angular-1.5-q_templated.js'),
    path.join(
        conf.paths.nodeModules, 'google-closure-compiler/contrib/externs/angular-material.js'),
    path.join(
        conf.paths.nodeModules, 'google-closure-compiler/contrib/externs/angular_ui_router.js'),
    path.join(
        conf.paths.nodeModules, 'google-closure-compiler/contrib/externs/angular-1.4-resource.js'),
    path.join(
        conf.paths.bowerComponents,
        'cljsjs-packages-externs/d3/resources/cljsjs/d3/common/d3.ext.js'),
    path.join(
        conf.paths.bowerComponents,
        'cljsjs-packages-externs/nvd3/resources/cljsjs/nvd3/common/nvd3.ext.js'),
    // Dashboard externs
    path.join(conf.paths.externs, 'backendapi.js'),
    path.join(conf.paths.externs, 'ansiup.js'),
    path.join(conf.paths.externs, 'uirouter.js'),
  ];

  let closureCompilerConfig = {
    // ---- BASIC OPTIONS ----
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    js_output_file: 'app.js',
    language_in: 'ECMASCRIPT6_STRICT',
    language_out: 'ECMASCRIPT3',
    externs: externs,

    // ---- OUTPUT ----
    generate_exports: true,
    export_local_property_definitions: true,

    // ---- WARNING AND ERROR MANAGEMENT ----
    // Enable all compiler checks by default and make them errors.
    jscomp_error: '*',
    // Disable checks that are not applicable to the project.
    jscomp_off: [
      // Let ESLint handle all lint checks.
      'lintChecks',
      // This checks aren't working with current google-closure-library version. Will be deleted
      // once it's fixed there.
      'analyzerChecks',
    ],

    // ---- DEPENDENCY MANAGEMENT ----
    dependency_mode: 'LOOSE',
    entry_point: 'index_module',

    // ---- JS MODULES ----
    js_module_root: `/${path.relative(conf.paths.base, conf.paths.frontendSrc)}`,

    // ---- LIBRARY AND FRAMEWORK SPECIFIC OPTIONS ----
    angular_pass: true,
  };

  if (translation && translation.path) {
    closureCompilerConfig.translations_file = translation.path;
  }

  let outputDir =
      translation ? path.join(conf.paths.i18nProd, `/${translation.key}`) : conf.paths.prodTmp;

  return (
      (next) =>
          gulp.src([
                // Application source files.
                path.join(conf.paths.frontendSrc, '**/*.js'),
                // Partials generated by other tasks, e.g., Angular templates.
                path.join(conf.paths.partials, '**/*.js'),
                // Include base.js to enable some compiler functions, e.g., @export annotation
                // handling and getMsg() translations.
                path.join(
                    conf.paths.bowerComponents, 'google-closure-library/closure/goog/base.js'),
              ])
              .pipe(gulpClosureCompiler(closureCompilerConfig))
              .pipe(gulp.dest(outputDir))
              .on('end', next));
}

/**
 * Compiles frontend JavaScript files into production bundle located in {conf.paths.prodTmp}
 * directory. A separated bundle is created for each i18n locale.
 */
gulp.task('scripts:prod', ['angular-templates', 'generate-xtbs'], function(doneFn) {
  // add a compilation step to stream for each translation file
  let streams = conf.translations.map((translation) => {
    return createCompileTask(translation);
  });

  // add a default compilation task (no localization)
  streams = streams.concat(createCompileTask());

  // TODO (taimir) : do not run the tasks sequentially once
  // gulp-closure-compiler can be run in parallel
  async.series(streams, doneFn);
});

/**
 * Compiles each Angular HTML template file (path/foo.html) into three processed forms:
 *   * serve/path/foo.html - minified html with i18n messages stripped out into english form
 *   * partials/path/foo.html.js - JS module file with template added to $templateCache, ready to be
 *         compiled by closure compiler
 *   * messages_for_extraction/path/foo.html.js - file with only MSG_FOO i18n message
 *         definitions - used to extract messages
 */
gulp.task('angular-templates', ['buildExistingI18nCache'], function() {
  return gulp.src(path.join(conf.paths.frontendSrc, '**/!(index).html'))
      .pipe(gulpHtmlmin({
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
      }))
      .pipe(gulpModify({fileModifier: processI18nMessages}))
      .pipe(gulpModify({
        fileModifier: function(file) {
          return file.pureHtmlContent;
        },
      }))
      .pipe(gulp.dest(conf.paths.serve))
      .pipe(gulpModify({
        fileModifier: function(file) {
          return file.moduleContent;
        },
      }))
      .pipe(gulpRename(function(path) {
        path.extname = '.html.js';
      }))
      .pipe(gulp.dest(conf.paths.partials))
      .pipe(gulpModify({
        fileModifier: function(file) {
          return file.messages;
        },
      }))
      .pipe(gulp.dest(conf.paths.messagesForExtraction));
});

// Can be used as gulp pipe function to replace specific string in file
// Example usage:
// gulp.src([
//   path.join(conf.paths.frontendSrc, '**/*.js'),
// ])
//     .pipe(replace('some_file.js', 'SOME_TEST_STRING_1', 'REPLACED_STRING'))
//     .pipe(xxx())
//     .pipe(gulp.dest(out))
//
// Remove once replace is used.
/* eslint no-unused-vars: 0*/
function replace(fileName, searchString, replaceString) {
  function update(file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isBuffer() && file.path.includes(fileName)) {
      let updatedFile = file.contents.toString().replace(searchString, replaceString);
      file.contents = new Buffer(updatedFile, 'utf-8');
    }

    return callback(null, file);
  }

  return through.obj(update);
}
