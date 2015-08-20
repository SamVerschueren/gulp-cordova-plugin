'use strict';

/**
 * Test runner for gulp-cordova-plugin.
 * 
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  19 Aug. 2015
 */

// module dependencies
var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    cordova = require('cordova-lib').cordova.raw,
    Q = require('q'),
    gutil = require('gulp-util');

// Use should flavour and use sinon-chai
chai.should();
chai.use(sinonChai);

var plugin = require('./');

describe('gulp-cordova-plugin', function() {
    
    beforeEach(function() {
        // Set the plugin method to a spy function
        cordova.plugin = sinon.spy();
    });
    
    describe('Simple plugin', function() {
        
        it('Should add the `cordova-plugin-globalization` plugin', function(done) {
            var stream = plugin('cordova-plugin-globalization');
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWithExactly('add', 'cordova-plugin-globalization', {});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the `cordova-plugin-globalization@1.0.0` plugin if the version is provided as 2nd argument', function(done) {
            var stream = plugin('cordova-plugin-globalization', '1.0.0');
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'cordova-plugin-globalization@1.0.0', {});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the `cordova-plugin-globalization@1.0.0` plugin if the version is provided in the object as 2nd argument', function(done) {
            var stream = plugin('cordova-plugin-globalization', {version: '1.0.0'});
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'cordova-plugin-globalization@1.0.0', {});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the `plugin.google.maps` plugin with variables if the variables are added in the options object', function(done) {
            var vars = {
                'API_KEY_FOR_ANDROID': 'ANDROID_KEY',
                'API_KEY_FOR_IOS': 'IOS_KEY'
            };
            
            var stream = plugin('plugin.google.maps', {variables: vars});
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'plugin.google.maps', {cli_variables: vars});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the `plugin.google.maps@latest` plugin with variables if the version and variables are added in the options object', function(done) {
            var vars = {
                'API_KEY_FOR_ANDROID': 'ANDROID_KEY',
                'API_KEY_FOR_IOS': 'IOS_KEY'
            };
            
            var stream = plugin('plugin.google.maps', {version: 'latest', variables: vars});
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'plugin.google.maps@latest', {cli_variables: vars});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the git based `plugin.google.maps`', function(done) {
            var stream = plugin('https://github.com/wf9a5m75/phonegap-googlemaps-plugin');
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'https://github.com/wf9a5m75/phonegap-googlemaps-plugin', {});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the git based `plugin.google.maps` plugin with one trailing slash', function(done) {
            var stream = plugin('https://github.com/wf9a5m75/phonegap-googlemaps-plugin/');
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'https://github.com/wf9a5m75/phonegap-googlemaps-plugin', {});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the git based `plugin.google.maps` plugin with multiple trailing slashes', function(done) {
            var stream = plugin('https://github.com/wf9a5m75/phonegap-googlemaps-plugin///');
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'https://github.com/wf9a5m75/phonegap-googlemaps-plugin', {});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the git based `plugin.google.maps` plugin with no version if the version `latest` is provided', function(done) {
            var stream = plugin('https://github.com/wf9a5m75/phonegap-googlemaps-plugin', 'latest');
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'https://github.com/wf9a5m75/phonegap-googlemaps-plugin', {});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the git based `plugin.google.maps@1.2.0` plugin if a version is provided', function(done) {
            var stream = plugin('https://github.com/wf9a5m75/phonegap-googlemaps-plugin', '1.2.0');
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'https://github.com/wf9a5m75/phonegap-googlemaps-plugin#v1.2.0', {});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the git based `plugin.google.maps@1.2.0` plugin if the version is provided in the object as 2nd argument', function(done) {
            var stream = plugin('https://github.com/wf9a5m75/phonegap-googlemaps-plugin', {version: '1.2.0'});
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'https://github.com/wf9a5m75/phonegap-googlemaps-plugin#v1.2.0', {});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the git based `plugin.google.maps` plugin with variables if the variables are added in the options object', function(done) {
            var vars = {
                'API_KEY_FOR_ANDROID': 'ANDROID_KEY',
                'API_KEY_FOR_IOS': 'IOS_KEY'
            };
            
            var stream = plugin('https://github.com/wf9a5m75/phonegap-googlemaps-plugin', {variables: vars});
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'https://github.com/wf9a5m75/phonegap-googlemaps-plugin', {cli_variables: vars});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the git based `plugin.google.maps@1.2.0` plugin with variables if the version and variables are added in the options object', function(done) {
            var vars = {
                'API_KEY_FOR_ANDROID': 'ANDROID_KEY',
                'API_KEY_FOR_IOS': 'IOS_KEY'
            };
            
            var stream = plugin('https://github.com/wf9a5m75/phonegap-googlemaps-plugin', {version: '1.2.0', variables: vars});
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'https://github.com/wf9a5m75/phonegap-googlemaps-plugin#v1.2.0', {cli_variables: vars});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the git based `plugin.google.maps` plugin with variables if the version `latest` and variables are added in the options object', function(done) {
            var vars = {
                'API_KEY_FOR_ANDROID': 'ANDROID_KEY',
                'API_KEY_FOR_IOS': 'IOS_KEY'
            };
            
            var stream = plugin('https://github.com/wf9a5m75/phonegap-googlemaps-plugin', {version: 'latest', variables: vars});
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'https://github.com/wf9a5m75/phonegap-googlemaps-plugin', {cli_variables: vars});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
    });
    
    describe('Plugin list', function() {
        
        it('Should call the add plugin method twice if two plugins are provided', function(done) {
            var stream = plugin([
                'org.apache.cordova.dialogs',
                'org.apache.cordova.camera',
                'https://github.com/kristianhristov/cordova-cookie-master'
            ]);
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledThrice;
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the `org.apache.cordova.dialogs` and `org.apache.cordova.camera` plugins', function(done) {
            var stream = plugin([
                'org.apache.cordova.dialogs',
                'org.apache.cordova.camera',
                'https://github.com/kristianhristov/cordova-cookie-master'
            ]);
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'org.apache.cordova.dialogs', {});
                cordova.plugin.should.have.been.calledWith('add', 'org.apache.cordova.camera', {});
                cordova.plugin.should.have.been.calledWith('add', 'https://github.com/kristianhristov/cordova-cookie-master', {});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should do nothing with the options object if provided', function(done) {
            var stream = plugin([
                'org.apache.cordova.dialogs',
                'org.apache.cordova.camera'
            ], {version: '1.0.0', variables: {foo: 'bar'}});
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'org.apache.cordova.dialogs', {});
                cordova.plugin.should.have.been.calledWith('add', 'org.apache.cordova.camera', {});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
    });
    
    describe('Plugin object', function() {
        
        it('Should call the add plugin method twice if two plugins are provided', function(done) {
            var stream = plugin({
                'org.apache.cordova.dialogs': 'latest',
                'org.apache.cordova.camera': '1.0.0'
            });
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledTwice;
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the `org.apache.cordova.dialogs@latest` and `org.apache.cordova.camera@1.0.0` plugins', function(done) {
            var stream = plugin({
                'org.apache.cordova.dialogs': 'latest',
                'org.apache.cordova.camera': '1.0.0',
                'https://github.com/wf9a5m75/phonegap-googlemaps-plugin': 'latest'
            });
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'org.apache.cordova.dialogs@latest', {});
                cordova.plugin.should.have.been.calledWith('add', 'org.apache.cordova.camera@1.0.0', {});
                cordova.plugin.should.have.been.calledWith('add', 'https://github.com/wf9a5m75/phonegap-googlemaps-plugin', {});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the `org.apache.cordova.dialogs@latest`, `org.apache.cordova.camera@1.0.0` and `plugin.google.maps` with variables', function(done) {
            var stream = plugin({
                'org.apache.cordova.dialogs': 'latest',
                'org.apache.cordova.camera': '1.0.0',
                'plugin.google.maps': {
                    variables : {
                        'API_KEY_FOR_ANDROID': 'ANDROID_KEY',
                        'API_KEY_FOR_IOS': 'IOS_KEY'
                    }
                }
            });
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'org.apache.cordova.dialogs@latest', {});
                cordova.plugin.should.have.been.calledWith('add', 'org.apache.cordova.camera@1.0.0', {});
                cordova.plugin.should.have.been.calledWith('add', 'plugin.google.maps', { cli_variables: { 'API_KEY_FOR_ANDROID': 'ANDROID_KEY', 'API_KEY_FOR_IOS': 'IOS_KEY' }});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the `org.apache.cordova.dialogs@latest`, `org.apache.cordova.camera@1.0.0` and `plugin.google.maps@1.0.0` with variables', function(done) {
            var stream = plugin({
                'org.apache.cordova.dialogs': 'latest',
                'org.apache.cordova.camera': '1.0.0',
                'plugin.google.maps': {
                    version: '1.0.0',
                    variables : {
                        'API_KEY_FOR_ANDROID': 'ANDROID_KEY',
                        'API_KEY_FOR_IOS': 'IOS_KEY'
                    }
                }
            });
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'org.apache.cordova.dialogs@latest', {});
                cordova.plugin.should.have.been.calledWith('add', 'org.apache.cordova.camera@1.0.0', {});
                cordova.plugin.should.have.been.calledWith('add', 'plugin.google.maps@1.0.0', { cli_variables: { 'API_KEY_FOR_ANDROID': 'ANDROID_KEY', 'API_KEY_FOR_IOS': 'IOS_KEY' }});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the git based `https://github.com/wf9a5m75/phonegap-googlemaps-plugin` plugin', function(done) {
            var stream = plugin({
                'https://github.com/wf9a5m75/phonegap-googlemaps-plugin': {
                    variables : {
                        'API_KEY_FOR_ANDROID': 'ANDROID_KEY',
                        'API_KEY_FOR_IOS': 'IOS_KEY'
                    }
                }
            });
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'https://github.com/wf9a5m75/phonegap-googlemaps-plugin', { cli_variables: { 'API_KEY_FOR_ANDROID': 'ANDROID_KEY', 'API_KEY_FOR_IOS': 'IOS_KEY' }});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the git based `plugin.google.maps` plugin with variables if the version `latest` and variables are added in the options object', function(done) {
            var stream = plugin({
                'https://github.com/wf9a5m75/phonegap-googlemaps-plugin': {
                    version: 'latest',
                    variables : {
                        'API_KEY_FOR_ANDROID': 'ANDROID_KEY',
                        'API_KEY_FOR_IOS': 'IOS_KEY'
                    }
                }
            });
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'https://github.com/wf9a5m75/phonegap-googlemaps-plugin', { cli_variables: { 'API_KEY_FOR_ANDROID': 'ANDROID_KEY', 'API_KEY_FOR_IOS': 'IOS_KEY' }});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should add the git based `plugin.google.maps@1.2.0` plugin with the version and variables in the options object', function(done) {
            var stream = plugin({
                'https://github.com/wf9a5m75/phonegap-googlemaps-plugin': {
                    version: '1.2.0',
                    variables : {
                        'API_KEY_FOR_ANDROID': 'ANDROID_KEY',
                        'API_KEY_FOR_IOS': 'IOS_KEY'
                    }
                }
            });
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'https://github.com/wf9a5m75/phonegap-googlemaps-plugin#v1.2.0', { cli_variables: { 'API_KEY_FOR_ANDROID': 'ANDROID_KEY', 'API_KEY_FOR_IOS': 'IOS_KEY' }});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
        
        it('Should do nothing with the options object if provided', function(done) {
            var stream = plugin({
                'org.apache.cordova.dialogs': 'latest',
                'org.apache.cordova.camera': '1.0.0'
            }, {version: '1.0.0', variables: {foo: 'bar'}});
            
            stream.on('end', function() {
                cordova.plugin.should.have.been.calledWith('add', 'org.apache.cordova.dialogs@latest', {});
                cordova.plugin.should.have.been.calledWith('add', 'org.apache.cordova.camera@1.0.0', {});
                
                done();
            });
            
            stream.on('data', function() {});
            
            stream.end();
        });
    });
});