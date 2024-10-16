const readline = require("readline");
const fs = require("fs");
const path = require('path');



const deleteFiles = (directory, recursiveFlag, extensionsArray, days, size) => {
    let daysNumber = Number(days);
    let sizeNumber = Number(size);
    const filesMap = getAllFiles(directory, new Map(), recursiveFlag, extensionsArray);
    const resultMap=deleteFilesLoop(filesMap, daysNumber, sizeNumber);
    return resultMap;
}

/**
 * @param {Map<string, string[]>} filesMap
 * @param {Number} days
 * @param {Number} size
 */
function deleteFilesLoop(filesMap, days, size) {
    const resultMap=new Map();
    filesMap.forEach(function (arr, key) {

        arr.forEach(function ({fullPath,fileName,fileSize}) {
            const stats = fs.statSync(fullPath);
            if (filterOlderDate(days, stats["atime"]) && fileSize > size) {
                try {
                    fs.unlinkSync(fullPath);
                    if (resultMap.has(key)) {
                        resultMap.set(key, [...resultMap.get(key), {fullPath,fileName,fileSize}]);
                    } else {
                        resultMap.set(key, [{fullPath,fileName,fileSize}]);
                    }
                } catch (err) {
                    console.error(`Error deleting ${fullPath}: ${err.message}`);
                }
            }

        });
    });
    return resultMap;
}

//this funtion is used to do the testing of delete files utility.
function changeATime(directory, stats) {
    const newATime = new Date(Date.now() - 1000 * 24 * 60 * 60 * 1000);
    const mTime = stats["mtime"];
    fs.utimesSync(directory, newATime, mTime);
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

function convertToIst(utcDate) {
    const istDate = utcDate.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
    return istDate;
}

function filterOlderDate(days, givenDate) {
    const thresholdDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return new Date(givenDate) < thresholdDate;
}


module.exports = {
    deleteFiles
};