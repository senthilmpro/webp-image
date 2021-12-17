require('dotenv').config();
const fs = require('fs');
const path = require('path');

const { DEST_IMAGES_FOLDER, SRC_IMAGES_FOLDER } = process.env;
const initSettings = () => {
    // create destination folder if it doesn't exist.
    if (DEST_IMAGES_FOLDER && !fs.existsSync(DEST_IMAGES_FOLDER)) {
        fs.mkdirSync(DEST_IMAGES_FOLDER, { recursive: true });
    }

    // check if source directory exists
    if (!fs.existsSync(SRC_IMAGES_FOLDER)) {
        throw new Error(`Source directory doesn't exist : ${SRC_IMAGES_FOLDER}. Please check .env file`);
    }
}

const getAllFiles = async (filePath = "./") => {
    const entries = await fs.readdirSync(filePath, {
        withFileTypes: true
    });

    // Get files within the current directory and add a path key to the file objects
    const files = entries
        .filter(file => !file.isDirectory())
        .map(file => ({
            ...file,
            path: path.join(filePath, file.name)
        }));

    // Get folders within the current directory
    const folders = entries.filter(folder => folder.isDirectory());

    for (const folder of folders)
        /*
          Add the found files within the subdirectory to the files array by calling the
          current function itself
        */
        files.push(...await FileService.getAllFiles(`${filePath}${folder.name}/`));

    return files;
}

const getSourceFiles = async () => {
    let files = await getAllFiles(SRC_IMAGES_FOLDER);
    return files;
}

module.exports = {
    initSettings,
    getSourceFiles
};