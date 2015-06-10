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
    cordova = require('cordova-lib').cordova.raw,
    Q = require('q');

// export the module
module.exports = function(plugins) {

    // Make sure it is an array of plugins
    plugins = [].concat(plugins);

    return through.obj(function(file, enc, cb) {
        // Change the working directory
        process.env.PWD = file.path;

        // Pipe the file to the next step
        this.push(file);

        cb();
    }, function(cb) {
        var promises = plugins.map(add);
        
        Q.all(promises)
            .then(function() {
                // Call the callback if all the plugins are added correctly
                cb();
            })
            .catch(function(err) {
                // Return an error if something happened
                cb(new gutil.PluginError('gulp-cordova-plugin', err.message));
            });
    });
};

function add(plugin) {
    return Q.fcall(function() {
        // Print which plugin will be added
        gutil.log('\tadd ' + plugin);
        
        // Add the plugin
        return cordova.plugin('add', plugin);
    });
}
