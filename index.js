'use strict';

/**
 * Creates a new cordova project in the current directory.
 *
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  22 April 2015
 */

// module dependencies
var path = require('path'),
    through = require('through2'),
    gutil = require('gulp-util'),
    Q = require('q'),
    cordovaLib = require('cordova-lib'),
    cordova = cordovaLib.cordova;

module.exports = function(plugin) {

    return through.obj(function(file, enc, cb) {
        process.env.PWD = file.path;

        this.push(file);

        Q.fcall(function() {
            console.log('\tadd ' + plugin);

            cordova.plugin('add', plugin);
        })
        .then(cb);
    });
};
