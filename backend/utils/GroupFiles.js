const fs = require("fs");
const path = require('path');


const groupFiles = (directory,recursiveFlag,extensionsArray) => {
    const filesMap = getAllFiles(directory, new Map(), recursiveFlag, extensionsArray);
    processFilesMap(filesMap, directory);
}

/**
 * @param {string} directory
 * @param {Map<string, string[]>} filesMap
 */
function processFilesMap(filesMap, directory) {
    const newDirectory = directory + "\\mergedfiles"
    if (fs.existsSync(newDirectory)) {
        fs.rmSync(newDirectory, { recursive: true, force: true });
    }
    fs.mkdirSync(newDirectory)
    filesMap.forEach(function (arr, key) {

        const keyDirectory = newDirectory + `\\${key}`
        try {
            fs.mkdirSync(keyDirectory)
            arr.forEach(function (pathOfFile) {
                const fileName = path.basename(pathOfFile);
                const destinationPath = `${keyDirectory}\\${fileName}`;
                try {
                    if (!fs.existsSync(destinationPath))
                        fs.copyFileSync(pathOfFile, destinationPath);
                } catch (error) {
                    console.log(error)
                }

            });
        } catch (error) {
            console.log(error)
        }
    });
}



/**
 * @param {string} dirPath
 * @param {Map<string, string[]>} filesMap
 * @param {string} recursiveFlag
 * @param {string[]} extensionsArray
 * @returns {Map<string, string[]>}
 */
function getAllFiles(dirPath, filesMap, recursiveFlag, extensionsArray) {

    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const extension = path.extname(fullPath).slice(1);
        if (fs.statSync(fullPath).isDirectory()) {
            if (path.basename(fullPath) !== "mergedfiles") {
                if (recursiveFlag) {
                    getAllFiles(fullPath, filesMap, recursiveFlag, extensionsArray);
                }
            }
        } else {
            if (extensionsArray.includes(extension)) {
                if (filesMap.has(extension)) {
                    filesMap.set(extension, [...filesMap.get(extension), fullPath]);
                } else {
                    filesMap.set(extension, [fullPath]);
                }
            }

        }
    });

    return filesMap;
}

module.exports = {
    groupFiles
};