 const fs = require('fs');
const path = require('path');
const { stdin } = require('process');

let writeStream = fs.createWriteStream(path.resolve(__dirname, 'random.txt'));
console.log('Привет, введите текст для записи в файл "random.txt"');
stdin.on('data', chunk => {
  let temp = chunk.toString().substring(0, chunk.toString().length - 1);
  temp = temp;
  if (temp === 'exit') { 
    console.log('Спасибо, запись прервана, данные в файле: "random.txt"');
    process.exit();
  } else writeStream.write(temp + '\n')
})
process.on('SIGINT', function() {
  console.log('\nСпасибо, запись прервана, данные в файле: "random.txt"');
  process.exit();
});