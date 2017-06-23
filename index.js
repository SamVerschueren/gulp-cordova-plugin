'use strict';
const through = require('through2');
const gutil = require('gulp-util');
const cordova = require('cordova-lib').cordova.raw;
const pLimit = require('p-limit');
const isPlainObj = require('is-plain-obj');

const limit = pLimit(2);

const parseInput = (plugins, options) => {
	let ret = {};

	if (typeof plugins === 'string') {
		ret[plugins] = options || {};
	} else if (isPlainObj(plugins)) {
		ret = plugins;
	} else if (Array.isArray(plugins)) {
		for (const plugin of plugins) {
			ret[plugin] = {};
		}
	}

	return ret;
};

const add = (plugin, opts) => {
	if (plugin.indexOf('http') === 0 || plugin.indexOf('git') === 0) {
		plugin = plugin.replace(/\/+$/, '');
		plugin = opts.version && opts.version !== 'latest' ? plugin + '#v' + opts.version : plugin;
	} else {
		plugin = opts.version ? plugin + '@' + opts.version : plugin;
	}

	delete opts.version;

	gutil.log('\tadd ' + plugin);

	return cordova.plugin('add', plugin, opts);
};

module.exports = (plugins, options) => {
	const pluginObject = parseInput(plugins, options);

	return through.obj(function (file, enc, cb) {
		process.env.PWD = file.path;

		const promises = [];

		for (const plugin of Object.keys(pluginObject)) {
			const opts = {};
			const options = pluginObject[plugin];

			if (options.variables) {
				opts.cli_variables = options.variables;					// eslint-disable-line camelcase
			}

			if (options.version || typeof options === 'string') {
				opts.version = options.version || options;
			}

			promises.push(limit(() => add(plugin, opts)));
		}

		Promise.all(promises)
			.then(() => {
				this.push(file);

				cb();
			})
			.catch(err => {
				cb(new gutil.PluginError('gulp-cordova-plugin', err.message));
			});
	});
};
