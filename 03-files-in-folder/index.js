const { readdir } = require('fs/promises');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const files = await readdir(path.resolve(__dirname, 'secret-folder'), { withFileTypes: true });
    for (const file of files) {
      if (!file.isDirectory()) {
        const ext = path.extname(file.name);
        fs.stat(path.resolve(__dirname, 'secret-folder', file.name), function (err, stats) {
          if (stats.isFile()) {
            console.log(`${file.name.replace(ext, '')} - ${ext.substring(1, ext.length)} - ${stats.size}b`);
          }
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
})();