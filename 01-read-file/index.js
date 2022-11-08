const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const filePath = path.join(__dirname, 'text.txt');
const readble = fs.createReadStream(filePath, 'utf-8');

readble.pipe(stdout);