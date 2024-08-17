const readline = require("readline");
const fs = require("fs");
const path = require('path');



const groupFilesDate = () => {
    const rl = initializeReadLine();
    let filesMap = undefined;
    const readLine = rl();
    readLine.question("please provide the directory", function (directory) {
        readLine.question("Do you want recursive", function (recursiveFlag) {
            //use a prompt or some function that will be responsible for getting the extensions array
            filesMap = getAllFiles(directory, new Map(), recursiveFlag);
            processFilesMap(filesMap, "C:\\Users\\user\\Desktop\\projects");
            readLine.close();
        })
    })
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
function getAllFiles(dirPath, filesMap, recursiveFlag, extensionsArray = ["pdf"]) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const extension = path.extname(fullPath).slice(1);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            if (recursiveFlag === 'Y') {
                getAllFiles(fullPath, filesMap, recursiveFlag);
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

module.exports = {
    groupFilesDate
}