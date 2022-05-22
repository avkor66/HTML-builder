const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');

const rl = readline.createInterface({ input, output });
let writeStream = fs.createWriteStream(path.resolve(__dirname, 'random.txt'));

console.log('Привет, введите текст для записи в файл "random.txt"');
rl.on('line', (input) => {
  if (input === 'exit' ) { 
    console.log('Спасибо, запись прервана, данные в файле: "random.txt"');
    process.exit();
  } else writeStream.write(input + '\n');
});
rl.on('SIGINT', () => {
  console.log('Спасибо, запись прервана, данные в файле: "random.txt"');
  process.exit();
});
