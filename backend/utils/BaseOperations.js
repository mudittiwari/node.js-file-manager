const fs = require("fs");
const path = require('path');
const os = require('os');

const getHomeDirectoryDetails = () => {
    const homeDir = os.homedir();

    try {
        const filesAndDirectories = fs.readdirSync(homeDir, { withFileTypes: true });

        return filesAndDirectories.map((entry) => {
            const fullPath = path.join(homeDir, entry.name);
            const stats = fs.statSync(fullPath);

            return {
                name: entry.name,
                type: entry.isDirectory() ? 'directory' : 'file',
                size: stats.size,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime,
                fullPath: fullPath
            };
        });
    } catch (error) {
        console.error('Error reading the directory:', error);
        return [];
    }
};

/**
 * @param {string} directory
 */
function getDirectoryDetails(directory) {
    try {
        const filesAndDirectories = fs.readdirSync(directory, { withFileTypes: true });
        return filesAndDirectories.map((entry) => {
            const fullPath = path.join(directory, entry.name);
            const stats = fs.statSync(fullPath);
            return {
                name: entry.name,
                type: entry.isDirectory() ? 'directory' : 'file',
                size: stats.size,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime,
                fullPath: fullPath
            };
        });
    } catch (error) {
        console.error('Error reading the directory:', error);
        return [];
    }
}

const getDirectories = () => {
    const homeDir = os.homedir();

    try {
        const filesAndDirectories = fs.readdirSync(homeDir, { withFileTypes: true });
        return filesAndDirectories
            .filter((entry) => entry.isDirectory())
            .map((entry) => {
                const fullPath = path.join(homeDir, entry.name);
                const stats = fs.statSync(fullPath);

                return {
                    name: entry.name,
                    type: 'directory',
                    size: stats.size,
                    createdAt: stats.birthtime,
                    modifiedAt: stats.mtime,
                    fullPath: fullPath,
                };
            });
    } catch (error) {
        console.error('Error reading the directory:', error);
        return [];
    }
};


/**
 * @param {string} directory
 */
function getDirectoriesInside(directory) {
    try {
        const filesAndDirectories = fs.readdirSync(directory, { withFileTypes: true });
        return filesAndDirectories
            .filter((entry) => entry.isDirectory())
            .map((entry) => {
                const fullPath = path.join(directory, entry.name);
                const stats = fs.statSync(fullPath);

                return {
                    name: entry.name,
                    type: 'directory',
                    size: stats.size,
                    createdAt: stats.birthtime,
                    modifiedAt: stats.mtime,
                    fullPath: fullPath,
                };
            });
    } catch (error) {
        console.error('Error reading the directory:', error);
        return [];
    }
}

/**
 * @param {string} filePath
 * @returns {Promise<void>}
 * @throws
 */
const deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        if (!filePath || typeof filePath !== "string") {
            return reject(new Error("Invalid file path."));
        }
        const resolvedPath = path.resolve(filePath);
        fs.access(resolvedPath, fs.constants.F_OK, (accessErr) => {
            if (accessErr) {
                return reject(new Error("File does not exist."));
            }
            fs.unlink(resolvedPath, (unlinkErr) => {
                if (unlinkErr) {
                    return reject(new Error("Failed to delete the file."));
                }
                resolve();
            });
        });
    });
};

/**
 * @param {string} sourcePath
 * @param {string} destinationPath
 * @param {string} operation
 * @returns {Promise<void>}
 * @throws
 */
const copyOrCutFile = (sourcePath, destinationPath, operation) => {
    return new Promise((resolve, reject) => {
        const sourceFileName = path.basename(sourcePath);
        const resolvedSourcePath = path.resolve(sourcePath);
        const resolvedDestinationPath = path.join(destinationPath, sourceFileName)
        fs.access(resolvedSourcePath, fs.constants.F_OK, (accessErr) => {
            if (accessErr) {
                return reject(new Error("Source file does not exist."));
            }
            if (operation === "COPY") {
                fs.copyFile(resolvedSourcePath, resolvedDestinationPath, (copyErr) => {
                    if (copyErr) {
                        return reject(new Error("Failed to copy the file."));
                    }
                    resolve("File copied successfully.");
                });
            } else if (operation === "CUT") {
                fs.rename(resolvedSourcePath, resolvedDestinationPath, (renameErr) => {
                    if (renameErr) {
                        return reject(new Error("Failed to move the file."));
                    }
                    resolve("File moved successfully.");
                });
            } else {
                return reject(new Error("Invalid operation. Use 'copy' or 'cut'."));
            }
        });
    });
};



/**
 * @param {string} filePath
 * @param {string} newName
 * @returns {Promise<void>} 
 * @throws 
 */

const renameFile = (filePath, newName) => {
    return new Promise((resolve, reject) => {
        try {
            if (!filePath || !newName) {
                reject("Invalid arguments. Both 'filePath' and 'newName' are required.");
                return;
            }
            const directory = path.dirname(filePath);
            const originalExtension = path.extname(filePath);
            const newExtension = path.extname(newName);
            const newFileName = newExtension ? newName : `${newName}${originalExtension}`;
            const newFilePath = path.join(directory, newFileName);

            fs.rename(filePath, newFilePath, (err) => {
                if (err) {
                    reject(`Error renaming file: ${err.message}`);
                } else {
                    resolve(`File renamed successfully to: ${newFileName}`);
                }
            });
        } catch (error) {
            reject(`Unexpected error: ${error.message}`);
        }
    });
};


module.exports = {
    getHomeDirectoryDetails,
    getDirectoryDetails,
    deleteFile,
    renameFile,
    getDirectories,
    getDirectoriesInside,
    copyOrCutFile
}