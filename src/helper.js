const fs = require('fs'),
    path = require('path');

const getFilesRecursive = async (filePath = './') => {
    console.log("FILEPATH ", filePath)
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
        files.push(...await getFilesRecursive(`${filePath}/${folder.name}/`));

    return files;
}
const DEFAULT_FILTERS = ['.jpg', '.png', '.jpeg'];

const getFilesWithExtensions = async (srcFilePath, EXTENSIONS = DEFAULT_FILTERS) => {
    let files = await getFilesRecursive(srcFilePath);
    const targetFiles = files.filter(file => {
        const fileExt = path.extname(file.name).toLowerCase();
        return EXTENSIONS.includes(fileExt);
    });
    console.log("FILES LENGTH : ", files.length);
    console.log("targetFiles LENGTH : ", targetFiles.length);
    return targetFiles;
}

module.exports = {
    getFilesRecursive,
    getFilesWithExtensions
}