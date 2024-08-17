const readline = require("readline");
const fs = require("fs");
const path = require('path');



const deleteFiles = () => {
    const rl = initializeReadLine();
    const readLine = rl();
    let filesMap = undefined;
    readLine.question("Enter the directory", function (directory) {
        //we will fetch the extensions which are present in the folder and then we will give the user a list to select from that
        let extensionsArray = ["pdf", "png"];
        readLine.question("Do you want recursive flag", function (flag) {
            readLine.question("what is the time limit", function (days) {
                readLine.question("what is the minimum size of the file in mb", function (size) {
                    let daysNumber = Number(days);
                    let sizeNumber = Number(size)
                    filesMap = getAllFiles(directory, new Map(), flag);
                    deleteFilesLoop(filesMap, extensionsArray, daysNumber, sizeNumber);
                    readLine.close();
                });

            })

        });
    });
}

/**
 * @param {Map<string, string[]>} filesMap
 * @param {Number} days
 * @param {Number} size
 */
function deleteFilesLoop(filesMap, days, size) {
    filesMap.forEach(function (arr, key) {

        arr.forEach(function (location) {
            changeATime(location, fs.statSync(location))
            const stats = fs.statSync(location);
            const fileSize = stats["size"] / (1024 * 1024)
            if (filterOlderDate(days, stats["atime"]) && fileSize > size) {
                try {
                    fs.unlinkSync(location);
                    console.log(`${location} deleted successfully`);
                } catch (err) {
                    console.error(`Error deleting ${location}: ${err.message}`);
                }
            }

        });
    });
}

//this funtion is used to do the testing of delete files utility.
function changeATime(directory, stats) {
    const newATime = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
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
function getAllFiles(dirPath, filesMap, recursiveFlag, extensionsArray = ["pdf"]) {

    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const extension = path.extname(fullPath).slice(1);

        if (fs.statSync(fullPath).isDirectory()) {
            if (recursiveFlag === 'Y') {
                getAllFiles(fullPath, filesMap, recursiveFlag);
            }
        } else {
            if (extensionsArray.includes(key)) {
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



function initializeReadLine() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });


    rl.on("close", function () {
        console.log("\nBYE BYE !!!");
        process.exit(0);
    });

    function getReadLine() {
        return rl;
    }
    return getReadLine;
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