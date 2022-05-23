const { readdir, rm, mkdir } = require('fs/promises');
const fs = require('fs');
const path = require('path');

async function createFolder(newDir) {
  await rm(path.resolve(__dirname, newDir), { recursive: true, force: true }, (err) => { if (err) throw err; });
  await mkdir(path.resolve(__dirname, newDir), { recursive: true, force: true }, (err) => { if (err) throw err; });
}

async function copyFiles(from, toDir) {
  const filesForCopy = await readdir(path.resolve(__dirname, from), { withFileTypes: true });
  filesForCopy.forEach(async file => {
    if (file.name === '.DS_Store') return; // for macOS
    if (file.isDirectory()) {
      await createFolder(`${toDir}/${file.name}`);
      await copyFiles(`${from}/${file.name}`, `${toDir}/${file.name}`);
    }
    if (file.isFile()) {
      if (path.extname(file.name) === '.jpg') {
        let writeStream = fs.createWriteStream(path.resolve(__dirname, toDir, file.name), {encoding: 'base64'});
        let readStream = fs.createReadStream(path.resolve(__dirname, from, file.name), {encoding: 'base64'});
        let temp = '';
        readStream.on('data', (chunk) => { temp += chunk; });
        readStream.on('end', () => { writeStream.write(temp); });
      } else {
        let writeStream = fs.createWriteStream(path.resolve(__dirname, toDir, file.name));
        let readStream = fs.createReadStream(path.resolve(__dirname, from, file.name));
        let temp = '';
        readStream.on('data', (chunk) => { temp += chunk.toString(); });
        readStream.on('end', () => { writeStream.write(temp); });
      }
    }
  });
}

async function createCss() {
  try {
    const files = await readdir(path.resolve(__dirname, 'styles'), { withFileTypes: true });
    let writeStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'style.css'), { flags: 'w+' });
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        let readStream = fs.createReadStream(path.resolve(__dirname, 'styles', file.name));
        let temp = '';
        readStream.on('data', (chunk) => { temp += chunk.toString(); });
        readStream.on('end', () => { writeStream.write(temp); });
      }
    }
  } catch (err) { console.error(err); }
}
async function createHTML() {
  try {
    const components = await readdir(path.resolve(__dirname, 'components'), { withFileTypes: true });
    const obj = {};
    for (const file of components) {
      if (file.isFile() && path.extname(file.name) === '.html') {
        let readStream = fs.createReadStream(path.resolve(__dirname, 'components', file.name));
        let temp = '';
        readStream.on('data', (chunk) => { temp += chunk.toString(); });
        readStream.on('end', () => { obj[file.name.replace('.html', '')] = temp; });
      }
    }
    let writeIndexHTML = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'index.html'), { flags: 'w+' });
    let readTemplateHTML = fs.createReadStream(path.resolve(__dirname, 'template.html'));
    let html = '';
    readTemplateHTML.on('data', (chunk) => {
      html += chunk.toString();
    });
    readTemplateHTML.on('end', () => {
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          const element = obj[key];
          const reg = new RegExp(`{{${key}}}`, 'i');
          html = html.replace(reg, element);
          html = html.replace(reg, element);
        }
      }
      writeIndexHTML.write(html);
    });
  } catch (err) { console.error(err); }
}

async function buildTask() {
  await createFolder('project-dist');
  await copyFiles('assets', 'project-dist/assets');
  await createCss();
  await createHTML();
}

buildTask();