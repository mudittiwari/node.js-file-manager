const fs = require("fs");
const path = require('path');



const groupFilesDate = (directory, recursiveFlag, extensionsArray) => {
    console.log(directory,recursiveFlag,extensionsArray);
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
        const keyDirectory = newDirectory + `\\${key.replace(/\//g, "-")}`
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
                    getAllFiles(fullPath, filesMap, recursiveFlag,extensionsArray);
                }
            }
        } else {
            if (extensionsArray.includes(extension)) {
                const creationDate = stats["birthtime"];
                const istTime = convertToIst(creationDate);
                if (filesMap.has(istTime)) {
                    filesMap.set(istTime, [...filesMap.get(istTime), fullPath]);
                } else {
                    filesMap.set(istTime, [fullPath]);
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