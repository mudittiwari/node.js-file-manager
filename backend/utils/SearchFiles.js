const readline = require("readline");
const fs = require("fs");
const path = require('path');
const { start } = require("repl");

const SearchFiles=(directory,recursiveFlag,fileNames,extensionsArray,dateRange,sizeRange)=>{
    const resultMap=getAllFiles(directory,new Map(),recursiveFlag,extensionsArray,fileNames,dateRange,sizeRange);
    return resultMap;
}
/**
 * @param {string} dirPath
 * @param {Map<string, string[]>} filesMap
 * @param {string} recursiveFlag
 * @param {string[]} extensionsArray
 * @param {String[]} fileNames
 * @param {Object} dateRange
 * @param {Object} sizeRange
 * @returns {Map<string, string[]>}
 */
function getAllFiles(dirPath, filesMap, recursiveFlag, extensionsArray,fileNames,dateRange,sizeRange) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const extension = path.extname(fullPath).slice(1);

        if (fs.statSync(fullPath).isDirectory()) {
            if (path.basename(fullPath) !== "mergedfiles") {
                if (recursiveFlag) {
                    getAllFiles(fullPath, filesMap, recursiveFlag, extensionsArray,fileNames,dateRange,sizeRange);
                }
            }
        } else {
            let fileName=path.basename(fullPath).split(".")[0];
            const stats = fs.statSync(fullPath);
            const fileSize = stats["size"] / (1024)
            if (extensionsArray.includes(extension) && checkFileNameValid(fileName,fileNames) && checkFileSizeValid(Number(sizeRange.minSize),Number(sizeRange.maxSize),fileSize) && checkDateValid(dateRange.startDate,dateRange.endDate,stats.ctime)) {
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


/**
 * @param {string} fileName
 * @param {String[]} validNames
 * @returns {Boolean}
 */
function checkFileNameValid(fileName,validNames){
    if(validNames.length==1 && validNames[0].trim().length==0)
        return true;
    if(validNames.includes(fileName))
        return true;
    return false;
}

/**
 * @param {Number} minSize
 * @param {Number} MaxSize
 * @param {Number} fileSize
 * @returns {Boolean}
 */
function checkFileSizeValid(minSize,maxSize,fileSize){
    if(minSize == 0 && maxSize == 0)
        return true;
    if(fileSize>=minSize && fileSize<=maxSize)
        return true;
    return false;
}



/**
 * @param {String} startDate
 * @param {String} endDate
 * @param {Date} givenDate
 * @returns {Boolean}
 */
function checkDateValid(startDate,endDate,givenDate){
    if(startDate.trim().length==0 && endDate.trim().length==0)
        return true;

    else if(startDate.trim().length==0){
        endDate=new Date(endDate);
        endDate=endDate.setDate(endDate.getDate()+1)
        if(givenDate<=endDate)
            return true;
        return false;
    }
    else if(endDate.trim().length==0){
        startDate=new Date(startDate);
        if(givenDate>=startDate)
            return true;
        return false;
    }
    else{
        startDate=new Date(startDate);
        endDate=new Date(endDate);
        endDate=endDate.setDate(endDate.getDate()+1)
        if(givenDate>=startDate && givenDate<=endDate)
            return true;
        return false;
    }
}

module.exports={
    SearchFiles
}