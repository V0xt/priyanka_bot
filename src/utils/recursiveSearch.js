const fs = require('fs');
const path = require('path');

module.exports = read;

function read(root, filter, files, prefix) {
	prefix = prefix || '';
	files = files || [];
	filter = filter || noDotFiles;

	const dir = path.join(root, prefix);
	if (!fs.existsSync(dir)) return files;
	if (fs.statSync(dir).isDirectory()) {
		fs.readdirSync(dir)
			.filter(function(name, index) {
				return filter(name, index, dir);
			})
			.forEach(function(name) {
				read(root, filter, files, path.join(prefix, name));
			});
	}
	else {
		files.push(prefix);
	}

	return files;
}

const noDotFiles = (x) => {
	return x[0] !== '.';
};