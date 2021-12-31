
require('dotenv').config();
const async = require('async');
const webpConvert = require('./src/webp-convert');
const { initSettings, getSourceFiles } = require('./src/webp-helper');
const { convert } = require('./src/converter');

const main = async () => {
    initSettings();
    const srcFiles = await getSourceFiles();
    const srcFilesDir = srcFiles && srcFiles.length > 0 && srcFiles.map(x => x.path);
    let counter = 0; const SOURCE_FILES_LENGTH = srcFilesDir.length;
    async.eachLimit(srcFilesDir, 1, (item, next) => {
        console.log(`Converting ${++counter} of ${SOURCE_FILES_LENGTH}`);
        webpConvert(item).then(() => next()).catch(err => {
            console.log("ERROR CONVERTING : ", err);
            next();
        })
    });
}

const mainSubFolders = async () => {
    const { SRC_IMAGES_FOLDER, DEST_IMAGES_FOLDER } = process.env;
    await convert(SRC_IMAGES_FOLDER, DEST_IMAGES_FOLDER);
}

mainSubFolders();