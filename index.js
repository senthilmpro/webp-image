const async = require('async');
const webpConvert = require('./src/webp-convert');
const { initSettings, getSourceFiles } = require('./src/webp-helper');

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

main();