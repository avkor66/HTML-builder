const fs = require('fs')
const path = require('PATH')

let readStream = fs.createReadStream(path.resolve(__dirname, 'text.txt'));

let temp = ''
readStream.on('data', (chunk) => {
    temp += chunk.toString();
})
 readStream.on('end', () => {
     console.log(temp);
 })
