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
    Q = require('q'),
    _ = require('lodash');

// export the module
module.exports = function(plugins, options) {

    options = options || {};

    var pluginList;
    
    if(Array.isArray(plugins) || _.isPlainObject(plugins)) {
        pluginList = plugins;
    }
    else {
        pluginList = [plugins];
    }

    return through.obj(function(file, enc, cb) {
        // Change the working directory
        process.env.PWD = file.path;

        // Pipe the file to the next step
        this.push(file);

        cb();
    }, function(cb) {
        var promises = _.map(pluginList, function(plugin, key) {
            if(_.isPlainObject(pluginList)) {
                // If the plugin list is an object, we should switch the plugin and key
                var temp = key;
                
                key = plugin;
                plugin = temp;
            }
            
            var opts = {};
            
            if(key.variables || options.variables) {
                // Add the cli variables
                opts.cli_variables = key.variables || options.variables;
            }
            
            if(key.version || options.version || _.isString(key)) {
                // Add the version to the options object
                opts.version = key.version || options.version || key;
            }
            
            // Fire the add method
            return add(plugin, opts);
        });
        
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

/**
 * Returns a promise that will add the plugin to the current working
 * directory cordova project.
 * 
 * @param {String} plugin   The name of the plugin that should be added.
 * @param {Object} opts     The options object.
 */
function add(plugin, opts) {    
    return Q.fcall(function() {
        // Make sure the version is attached if it is specified        
        plugin = opts.version ? plugin + '@' + opts.version : plugin;
        
        // Print which plugin will be added
        gutil.log('\tadd ' + plugin);
        
        // Add the plugin without options
        return cordova.plugin('add', plugin, opts);
    });
}
