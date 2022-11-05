const fs = require('fs');
const { readdir } = require('fs/promises');
const { join, parse } = require('path');

const sourcePath = join(__dirname, 'styles');
const targetPath = join(__dirname, 'project-dist', 'bundle.css');

async function makeBundle(source, target) {
    try {
        const files = await readdir(source, { withFileTypes: true });
        const writeStream = fs.createWriteStream(target, 'utf-8');

        for (let file of files) {
            const filePath = join(source, file.name);
            const { ext } = parse(filePath);

            if (ext === '.css' && file.isFile()) {
                const readStream = fs.createReadStream(filePath, 'utf-8');
                readStream.pipe(writeStream);
            }
        }

    } catch (err) {
        console.log(err);
    }
}

makeBundle(sourcePath, targetPath);