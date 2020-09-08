const gutil = require('gulp-util');
const PluginError = gutil.PluginError;
const through = require('through2');

const pluginName = 'gulp-webp-html2';

module.exports = function () {
	var extensions = ['.jpg', '.png', '.jpeg'];
	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}
		if (file.isStream()) {
			cb(new PluginError(pluginName, 'Streaming not supported'));
			return;
		}
		try {
			var SplitPicture = '<picture>';
			var RePicture = /([\s\S]*?<\/picture>)([\s\S]*)/;
			var SplitImg = '<img ';
			var ReImg = /<img([^>]*)src=[\"\'](\S+)[\"\']([^>]*)>/;
			const data = file.contents.toString()
				.split(SplitPicture)
				.map(function (line) {
					var picture = '';
					if (RePicture.test(line)) {
						var lineA = line.match(RePicture);
						picture = lineA[1];
						line = lineA[2];
					}
					if (~ line.indexOf(SplitImg)) {
						var lineNew = line
							.split(SplitImg)
							.map(function (subLine) {
								var lineImg = (SplitImg + subLine).toString();
								if (ReImg.test(lineImg)) {
									subLine = lineImg;
									var regexpArray = lineImg.match(ReImg);
									var imgTag = regexpArray[0];
									var newUrl = regexpArray[2];
									if (! ~ newUrl.indexOf('.webp')
										&& ! /\sdata-no-webp[\=\s]/g.test(imgTag)) {
										for (var k in extensions) {
											if (~ newUrl.indexOf(extensions[k])) {
												newUrl = newUrl.replace(extensions[k], '.webp');
												var newHTML = '<picture><source srcset="'
													+ newUrl + '" type="image/webp">'
													+ imgTag + '</picture>';
												subLine = lineImg.replace(imgTag, newHTML);
												break;
											}
										}
									}
								}
								return subLine;
							})
							.join('');
						line = lineNew;
					}
					return picture + line;
				})
				.join(SplitPicture);
			file.contents = new Buffer(data);
			this.push(file);
		} catch (err) {
			this.emit('error', new PluginError(pluginName, err));
		}
		cb();
	});
};
