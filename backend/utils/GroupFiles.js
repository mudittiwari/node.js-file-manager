const fs = require("fs");
const path = require('path');


const groupFiles = (directory,recursiveFlag,extensionsArray) => {
    const filesMap = getAllFiles(directory, new Map(), recursiveFlag, extensionsArray);
    const resultMap=processFilesMap(filesMap, directory);
    return resultMap;
}

/**
 * @param {string} directory
 * @param {Map<string, string[]>} filesMap
 * @returns {Map<string, string[]>} resultMap
 */
function processFilesMap(filesMap, directory) {
    const resultMap=new Map();
    const newDirectory = directory + "\\mergedfiles"
    if (fs.existsSync(newDirectory)) {
        fs.rmSync(newDirectory, { recursive: true, force: true });
    }
    fs.mkdirSync(newDirectory)
    filesMap.forEach(function (arr, key) {

        const keyDirectory = newDirectory + `\\${key}`
        try {
            fs.mkdirSync(keyDirectory)
            arr.forEach(function ({ fullPath, fileName, fileSize }) {
                const extension = path.extname(fullPath);
                const destinationPath = path.join(keyDirectory, `${fileName}${extension}`);
                try {
                    if (!fs.existsSync(destinationPath)){
                        fs.copyFileSync(fullPath, destinationPath);
                        if (resultMap.has(key)) {
                            resultMap.set(key, [...resultMap.get(key), { destinationPath, fileName, fileSize }]);
                        } else {
                            resultMap.set(key, [{ destinationPath, fileName, fileSize }]);
                        }
                    }
                } catch (error) {
                    console.log(error)
                }

            });
        } catch (error) {
            console.log(error)
        }
    });
    return resultMap;
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
            let fileName=path.basename(fullPath).split(".")[0];
            const stats = fs.statSync(fullPath);
            const fileSize = stats["size"] / (1024)
            if (extensionsArray.includes(extension)) {
                if (filesMap.has(extension)) {
                    filesMap.set(extension, [...filesMap.get(extension), {fullPath,fileName,fileSize}]);
                } else {
                    filesMap.set(extension, [{fullPath,fileName,fileSize}]);
                }
            }

        }
    });

    return filesMap;
}

module.exports = {
    groupFiles
};