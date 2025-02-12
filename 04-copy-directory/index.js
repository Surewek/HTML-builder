const { readdir, mkdir, copyFile, rm } = require('fs/promises');
const { join } = require('path');

const sourcePath = join(__dirname, 'files');
const targetPath = join(__dirname, 'files-copy');

async function copyDirectory(source, target) {
    try {
        await rm(target, { force: true, recursive: true });
        await mkdir(target, { recursive: true, force: true });
        const files = await readdir(source, { withFileTypes: true });

        for (let file of files) {
            const sourceFilePath = join(source, file.name);
            const targetFilePath = join(target, file.name);

            if (file.isDirectory()) {
                await copyDirectory(sourceFilePath, targetFilePath);
            } else {
                await copyFile(sourceFilePath, targetFilePath);
            }
        }
    } catch (err) {
        console.log(err);
    }

}

copyDirectory(sourcePath, targetPath);