require('dotenv').config();
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

const { DEST_IMAGES_FOLDER, IMAGE_QUALITY } = process.env
const CONVERT_QUALITY = IMAGE_QUALITY || 80;

const webpConvert = async (srcFilePath, destFolder = DEST_IMAGES_FOLDER) => {
    //console.log({srcFilePath, destFolder, CONVERT_QUALITY});
    await imagemin([srcFilePath], {
        destination: destFolder,
        plugins: [
            imageminWebp({ quality: CONVERT_QUALITY })
        ]
    });

    console.log('Images optimized ', srcFilePath.split('/').pop());
}

module.exports = webpConvert;