import test from 'ava';
import {cordova} from 'cordova-lib';
import sinon from 'sinon';
import gutil from 'gulp-util';
import fn from './';

function plugin(plugin, opts) {
	return new Promise((resolve, reject) => {
		const stream = fn(plugin, opts);

		stream.on('data', () => { });

		stream.on('error', reject);

		stream.on('end', resolve);

		stream.write(new gutil.File());

		stream.end();
	});
}

test.beforeEach(() => {
	cordova.raw.plugin = sinon.stub().returns(Promise.resolve());
});

test.serial('add plugin', async t => {
	await plugin('foo');

	t.deepEqual(cordova.raw.plugin.lastCall.args, ['add', 'foo', {}]);
});

test.serial('remove trailing / from git-based plugin', async t => {
	await plugin('https://github.com/SamVerschueren/cordova-ua-bb10///');

	t.deepEqual(cordova.raw.plugin.lastCall.args, ['add', 'https://github.com/SamVerschueren/cordova-ua-bb10', {}]);
});

test.serial('add specific version', async t => {
	await plugin('foo', '1.0.0');

	t.deepEqual(cordova.raw.plugin.lastCall.args, ['add', 'foo@1.0.0', {}]);
});

test.serial('add version to git-based plugin', async t => {
	await plugin('https://github.com/SamVerschueren/cordova-ua-bb10', '1.0.0');

	t.deepEqual(cordova.raw.plugin.lastCall.args, ['add', 'https://github.com/SamVerschueren/cordova-ua-bb10#v1.0.0', {}]);
});

test.serial('add specific version object', async t => {
	await plugin('foo', {version: '1.0.0'});

	t.deepEqual(cordova.raw.plugin.lastCall.args, ['add', 'foo@1.0.0', {}]);
});

test.serial('add object version to git-based plugin', async t => {
	await plugin('https://github.com/SamVerschueren/cordova-ua-bb10', {version: '1.0.0'});

	t.deepEqual(cordova.raw.plugin.lastCall.args, ['add', 'https://github.com/SamVerschueren/cordova-ua-bb10#v1.0.0', {}]);
});

test.serial('add `latest` version to git-based plugin', async t => {
	await plugin('https://github.com/SamVerschueren/cordova-ua-bb10', {version: 'latest'});

	t.deepEqual(cordova.raw.plugin.lastCall.args, ['add', 'https://github.com/SamVerschueren/cordova-ua-bb10', {}]);
});

test.serial('add plugin with variables', async t => {
	await plugin('foo', {variables: {bar: 'bar', baz: 'baz'}});

	t.deepEqual(cordova.raw.plugin.lastCall.args, ['add', 'foo', {cli_variables: {bar: 'bar', baz: 'baz'}}]);					// eslint-disable-line camelcase
});

test.serial('add plugin with version and variables', async t => {
	await plugin('foo', {version: 'latest', variables: {bar: 'bar', baz: 'baz'}});

	t.deepEqual(cordova.raw.plugin.lastCall.args, ['add', 'foo@latest', {cli_variables: {bar: 'bar', baz: 'baz'}}]);			// eslint-disable-line camelcase
});

test.serial('add two plugins when array is provided', async t => {
	await plugin(['foo', 'bar']);

	t.deepEqual(cordova.raw.plugin.args[0], ['add', 'foo', {}]);
	t.deepEqual(cordova.raw.plugin.args[1], ['add', 'bar', {}]);
});

test.serial('emit options object when array is provided', async t => {
	await plugin(['foo', 'bar'], {version: '1.0.0', variables: {baz: 'baz'}});

	t.deepEqual(cordova.raw.plugin.args[0], ['add', 'foo', {}]);
	t.deepEqual(cordova.raw.plugin.args[1], ['add', 'bar', {}]);
});

test.serial('add two plugins when object is provided', async t => {
	await plugin({foo: 'latest', bar: '1.0.0'});

	t.deepEqual(cordova.raw.plugin.args[0], ['add', 'foo@latest', {}]);
	t.deepEqual(cordova.raw.plugin.args[1], ['add', 'bar@1.0.0', {}]);
});

test.serial('options object in plugin object', async t => {
	await plugin({foo: 'latest', bar: {version: '1.0.0', variables: {baz: 'baz'}}});

	t.deepEqual(cordova.raw.plugin.args[0], ['add', 'foo@latest', {}]);
	t.deepEqual(cordova.raw.plugin.args[1], ['add', 'bar@1.0.0', {cli_variables: {baz: 'baz'}}]);								// eslint-disable-line camelcase
});

test.serial('throw error', async t => {
	cordova.raw.plugin = function () {
		return new Promise((resolve, reject) => {
			reject(new Error('something went wrong'));
		});
	};

	await t.throws(plugin('foo'), 'something went wrong');
});
