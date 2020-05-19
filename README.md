# gulp-webp-html2

My version [gulp-webp-html](https://www.npmjs.com/package/gulp-webp-html). Fixed bug with the disappearance of line breaks after the execution of the plugin.

## Example
```html
// Input
<img src="/images/catalogImage.jpg">

// Output
<picture>
    <source srcset="/images/catalogImage.webp" type="image/webp">
    <img src="/images/catalogImage.jpg">
</picture>
```
## Install
```bash
npm i -D git://github.com/TigroWeb/gulp-webp-html2.git
```
## Usage
```javascript
var GulpWebpHtml2 = require('gulp-webp-html2');

gulp.task('html',function(){
    gulp.src('./assets/**/*.html')
        .pipe(GulpWebpHtml2())
        .pipe(gulp.dest('./public/'))
});
```
