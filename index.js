'use strict';
var through = require('through2');
var gutil = require('gulp-util');
var cordova = require('cordova-lib').cordova.raw;
var Promise = require('pinkie-promise');
var _ = require('lodash');

module.exports = function (plugins, options) {
	options = options || {};

	var pluginList;

	if (Array.isArray(plugins) || _.isPlainObject(plugins)) {
		pluginList = plugins;
		options = {};
	} else {
		pluginList = [plugins];
	}

	return through.obj(function (file, enc, cb) {
		process.env.PWD = file.path;

		var self = this;

		var promises = _.map(pluginList, function (plugin, key) {
			if (_.isPlainObject(pluginList)) {
				var temp = key;

				key = plugin;
				plugin = temp;
			}

			var opts = {};

			if (key.variables || options.variables) {
				opts.cli_variables = key.variables || options.variables;
			}

			if (key.version || options.version || _.isString(key) || _.isString(options)) {
				opts.version = key.version || options.version || key || options;
			}

			return add(plugin, opts);
		});

		Promise.all(promises)
			.then(function () {
				self.push(file);

				cb();
			})
			.catch(function (err) {
				cb(new gutil.PluginError('gulp-cordova-plugin', err.message));
			});
	});
};

function add(plugin, opts) {
	if (plugin.indexOf('http') === 0 || plugin.indexOf('git') === 0) {
		plugin = plugin.replace(/\/+$/, '');
		plugin = opts.version && opts.version !== 'latest' ? plugin + '#v' + opts.version : plugin;
	} else {
		plugin = opts.version ? plugin + '@' + opts.version : plugin;
	}

	delete opts.version;

	gutil.log('\tadd ' + plugin);

	return cordova.plugin('add', plugin, opts);
}
