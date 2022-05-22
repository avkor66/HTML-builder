const { readdir } = require('fs/promises');
const fs = require('fs');
const path = require('path');

(async () => {
  try {
    const files = await readdir(path.resolve(__dirname, 'styles'), { withFileTypes: true });
    let writeStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'bundle.css'), { flags: 'w+' });
    for (const file of files) {
      if (!file.isDirectory() && path.extname(file.name) === '.css') {
        let readStream = fs.createReadStream(path.resolve(__dirname, 'styles', file.name));
        let temp = '';
        readStream.on('data', (chunk) => {
          temp += chunk.toString();
        });
        readStream.on('end', () => {
          writeStream.write(temp);
        });
      }
    }
  } catch (err) { console.error(err); }
})();