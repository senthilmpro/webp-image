const async = require('async');
const webpConvert = require('./src/webp-convert');
const { initSettings, getSourceFiles } = require('./src/webp-helper');

require('dotenv').config();

const main = async () => {
    initSettings();
    const srcFiles = await getSourceFiles();
    const srcFilesDir = srcFiles && srcFiles.length > 0 && srcFiles.map(x => x.path);
    async.eachLimit(srcFilesDir, 1, (item, next) => {
        webpConvert(item).then(() => next()).catch(err => {
            console.log("ERROR CONVERTING : ", err);
            next();
        })
    });
}

main();