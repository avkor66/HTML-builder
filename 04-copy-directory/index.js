const { readdir, mkdir, rm } = require('fs/promises');
const fs = require('fs')
const path = require('path');


async function createFolder(newDir, fromDir) {
  await rm(path.resolve(__dirname, newDir), { recursive: true, force: true }, (err) => {
    if (err) throw err;
  })
  await mkdir(path.resolve(__dirname, newDir), { recursive: true }, (err) => {
    if (err) throw err;
  })
  await copyFiles(path.resolve(__dirname, fromDir), newDir)
}

async function copyFiles(params, newDir) {
  const filesForCopy = await readdir(params);
  filesForCopy.forEach(fl => {
    let readStream = fs.createReadStream(path.resolve(params, fl));
    let writeStream = fs.createWriteStream(path.resolve(__dirname, newDir, fl));
    let temp = ''
    readStream.on('data', (chunk) => {
      temp += chunk.toString();
    })
    readStream.on('end', () => {
      writeStream.write(temp)
    })
  })
}

createFolder('files-copy', 'files')
