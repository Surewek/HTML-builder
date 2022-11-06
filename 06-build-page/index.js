const fs = require('fs');
const { readdir, mkdir, copyFile, readFile } = require('fs/promises');
const { join, parse } = require('path');

const config = {
    'distPath': join(__dirname, 'project-dist'),
    'indexPath': join(__dirname, 'project-dist', 'index.html'),
    'templatePath': join(__dirname, 'template.html'),
    'copmponentsPath': join(__dirname, 'components'),
    'assetsSourcePath': join(__dirname, 'assets'),
    'assetsTargetPath': join(__dirname, 'project-dist', 'assets'),
    'stylesSourcePath': join(__dirname, 'styles'),
    'stylesTargetPath': join(__dirname, 'project-dist', 'style.css'),
}

createBundle(config);

async function createBundle(config) {
    try {
        await mkdir(config.distPath, { recursive: true });
        await copyDirectory(config.assetsSourcePath, config.assetsTargetPath);
        await mergeStyles(config.stylesSourcePath, config.stylesTargetPath);

        const components = await getFolderFiles(config.copmponentsPath);

        let template = await readFile(config.templatePath, { encoding: 'utf-8' });

        for (let component of components) {
            const templateTagName = new RegExp(`({{${component.name}}})`, 'g');
            const content = await readFile(component.path, 'utf-8', { encoding: 'utf-8' })

            template = template.replace(templateTagName, content);
        }

        fs.writeFile(config.indexPath, template, err => { if (err) { throw err } })
    } catch (err) {
        console.error(err)
    }
}

async function copyDirectory(source, target) {
    try {
        await mkdir(target, { recursive: true });
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

async function getFolderFiles(folderPath) {
    try {
        const files = await readdir(folderPath, { withFileTypes: true });
        const filesInfo = []

        files.filter(item => item.isFile()).forEach(file => {
            const filePath = join(folderPath, file.name);
            const { base, name, ext } = parse(filePath);

            if (ext === '.html') {
                filesInfo.push({ 'name': name, 'path': filePath });
            }

        });

        return filesInfo;
    } catch (err) {
        console.error(err);
    }

}

async function mergeStyles(source, target) {
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