require('dotenv').config();
const fs = require('fs');
const path = require('path');
const async = require('async');
const { getFilesRecursive, getFilesWithExtensions } = require('./helper');
const webpConvert = require('./webp-convert');
const { join } = require('path/posix');


const convert = async (srcPath, destPath) => {
    const dest = path.resolve(destPath);
    const src = path.resolve(srcPath);

    if(!fs.existsSync(dest)) {
        fs.mkdirSync(dest, {recursive: true});
    }

    if(!fs.existsSync(src)){
        throw new Error("Source Directory doesn't exist");
    }

    const entries = await fs.readdirSync(src, {
        withFileTypes: true
    });

    const subFolders = entries.filter(folder => folder.isDirectory()).map(x => x.name);
    const sleeper = (delay) => new Promise(res => setTimeout(res, delay));
    let queue = [];
    const convertSubFolders = async (folders) => {
        await folders.reduce(async (memo, item) => {
            await memo;
            const itemPath = path.resolve(src, item);
            // filter only permitted extensions.
            let filteredFiles = await getFilesWithExtensions(itemPath);
            let q = filteredFiles.map(x => ({
                src: x.path,
                destFolder: path.resolve(dest,item)
            }));
            queue = [...queue, ...q];
        }, undefined);

        let counter = 0;
        const SOURCE_FILES_LENGTH = queue.length;
        async.eachLimit(queue, 3, (item, next) => {
            console.log(`Converting ${++counter} of ${SOURCE_FILES_LENGTH}`);
            if(!fs.existsSync(item.destFolder)){
                fs.mkdirSync(item.destFolder, {recursive: true});
            }
            webpConvert(item.src, item.destFolder).then(() => next()).catch(err => {
                console.log("ERROR CONVERTING : ", err);
                next();
            })
        });
        
        console.log("COMPLETED");
    }

    convertSubFolders(subFolders);
}



module.exports = {
    convert
}