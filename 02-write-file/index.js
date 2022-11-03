const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath, 'utf-8');
const readlineInterface = readline.createInterface({input: stdin, output: stdout});

const writeNewLine = (line) => {
    line === 'exit' ? readlineInterface.close() : writeStream.write(`${line}\n`);
}

readlineInterface.question(`Write your message, please:\n`, (line) => writeNewLine(line));

readlineInterface.on('line', (line) => writeNewLine(line));

readlineInterface.on('close', () => {
    console.log('End of write. Your message saved in "text.txt"');
    writeStream.end();
});





// console.log(filePath)

// const writeStream = fs.createWriteStream(filePath, 'utf-8');
// writeStream.pipe(stdout);