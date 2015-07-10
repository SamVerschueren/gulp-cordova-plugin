# gulp-cordova-plugin

> Add plugins to your cordova project.

## Installation

```bash
npm install --save-dev gulp-cordova-plugin
```

## Usage

The following example will add two plugins to the cordova project.

```JavaScript
var gulp = require('gulp'),
    create = require('gulp-cordova-create'),
    plugin = require('gulp-cordova-plugin');

gulp.task('build', function() {
    return gulp.src('dist')
        .pipe(create())
        .pipe(plugin('org.apache.cordova.dialogs'))
        .pipe(plugin('org.apache.cordova.camera'));
});
```

You can also pass an array of plugins instead of one plugin at a time.

```JavaScript
var gulp = require('gulp'),
    create = require('gulp-cordova-create'),
    plugin = require('gulp-cordova-plugin');

gulp.task('build', function() {
    return gulp.src('dist')
        .pipe(create())
        .pipe(plugin([
            'org.apache.cordova.dialogs',
            'org.apache.cordova.camera'
        ]));
});
```

This method is faster because it adds the plugins in parallel instead of in series.

## API

### plugin(plugin)

#### plugin

*Required*  
Type: `string`

The plugin that should be added to the project.

### plugin(plugins)

#### plugins

*Required*  
Type: `string[]`

A list of plugins that should be added to the project.

## Related

See [`gulp-cordova`](https://github.com/SamVerschueren/gulp-cordova) for the full list of available packages.

## Contributors

- Sam Verschueren [<sam.verschueren@gmail.com>]

## License

MIT © Sam Verschueren
