# gulp-cordova-plugin

> Second step in creating a cordova project with gulp. Adding cordova plugins.

## Installation

```bash
npm install --save-dev gulp-cordova-plugin
```

**Not yet available**

## Usage

```JavaScript
var gulp = require('gulp'),
    create = require('gulp-cordova-create'),
    plugin = require('gulp-cordova-plugin');

gulp.task('build', function() {
    return gulp.src('www')
        .pipe(create())
        .pipe(plugin('org.apache.cordova.dialogs'))
        .pipe(plugin('org.apache.cordova.camera'));
});
```

By using this plugin, you can add Cordova plugins to your Cordova project. In this case, both ```org.apache.cordova.dialogs``` and
```org.apache.cordova.camera``` will be added.

## Related

See [`gulp-cordova-create`](https://github.com/SamVerschueren/gulp-cordova-create) for creating a cordova project.

## Contributors

- Sam Verschueren [<sam.verschueren@gmail.com>]

## License

MIT © Sam Verschueren
