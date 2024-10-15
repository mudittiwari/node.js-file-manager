const fs = require("fs");
const path = require('path');



const groupFilesDate = (directory, recursiveFlag, extensionsArray) => {
    console.log(directory, recursiveFlag, extensionsArray);
    const filesMap = getAllFiles(directory, new Map(), recursiveFlag, extensionsArray);
    const resultMap = processFilesMap(filesMap, directory);
    return resultMap;
}


/**
 * @param {string} directory
 * @param {Map<string, string[]>} filesMap
 */
function processFilesMap(filesMap, directory) {
    const resultMap = new Map();
    const newDirectory = directory + "\\mergedfiles"
    if (fs.existsSync(newDirectory)) {
        fs.rmSync(newDirectory, { recursive: true, force: true });
    }
    fs.mkdirSync(newDirectory)
    filesMap.forEach(function (arr, key) {
        const keyDirectory = newDirectory + `\\${key.replace(/\//g, "-")}`
        try {
            fs.mkdirSync(keyDirectory)
            arr.forEach(function ({ fullPath, fileName, fileSize }) {
                const destinationPath = `${keyDirectory}\\${fileName}`;
                try {
                    if (!fs.existsSync(destinationPath)) {
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



//use extensions array in this function only 

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
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            if (path.basename(fullPath) !== "mergedfiles") {
                if (recursiveFlag) {
                    getAllFiles(fullPath, filesMap, recursiveFlag, extensionsArray);
                }
            }
        } else {
            if (extensionsArray.includes(extension)) {
                let fileName = path.basename(fullPath).split(".")[0];
                const stats = fs.statSync(fullPath);
                const fileSize = stats["size"] / (1024)
                const creationDate = stats["birthtime"];
                const istTime = convertToIst(creationDate);
                if (filesMap.has(istTime)) {
                    filesMap.set(istTime, [...filesMap.get(istTime), { fullPath, fileName, fileSize }]);
                } else {
                    filesMap.set(istTime, [{ fullPath, fileName, fileSize }]);
                }
            }
        }
    });

    return filesMap;
}

function convertToIst(utcDate) {
    const istDate = utcDate.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
    return istDate;
}

module.exports = {
    groupFilesDate
}