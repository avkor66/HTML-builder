 const fs = require('fs');
const path = require('path');
const { stdin } = require('process');


let writeStream = fs.createWriteStream(path.resolve(__dirname, 'random.txt'));
console.log('Введите текст для записи в файл "random.txt"');
stdin.on('data', chunk => {
  let temp = chunk.toString();
  temp = temp.substring(0, temp.length - 1);
  if (temp === 'exit') { 
    console.log('Запись прервана, данные в файле: "random.txt"');
    process.exit();
  } else {
    writeStream.write(temp + '\n', () => {
      console.log(`Записано: "${temp}"`);
    })
  }
})
process.on('SIGINT', function() {
  console.log('\nЗапись прервана, данные в файле: "random.txt"');
  process.exit();
});