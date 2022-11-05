const path = require('path');
const { stat } = require('fs');
const { readdir } = require('fs/promises');

const folderPath = path.join(__dirname, 'secret-folder');

async function getFolderFiles(folderPath) {
    try {
        const files = await readdir(folderPath, { withFileTypes: true });

        files.filter(item => !item.isDirectory()).forEach(file => {
            const filePath = path.join(folderPath, file.name);
            const { name, ext } = path.parse(filePath);

            stat(filePath, (err, stats) => {
                if (err) throw err;
                const fileSize = stats.size >= 1000 ? `${stats.size / 1000}kb` : `${stats.size}b`;
                console.log(`${name} - ${ext.slice(1)} - ${fileSize}`)
            });
        });
    } catch (err) {
        console.error(err);
    }

}

getFolderFiles(folderPath);