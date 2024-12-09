const express = require('express');
const router = express.Router();
const { getHomeDirectoryDetails, getDirectoryDetails, deleteFile, renameFile, getDirectories, getDirectoriesInside, copyOrCutFile } = require("../utils/BaseOperations");
const path = require("path");
const fs = require("fs");

router.get("/", (req, res) => {
    try {
        const homeDirectoryDetails = getHomeDirectoryDetails();
        return res.status(200).json({ result: homeDirectoryDetails });
    } catch (error) {
        console.error("Error retrieving home directory details:", error);
        return res.status(500).json({ error: "Failed to retrieve home directory details." });
    }
});
router.post("/subdirectory", (req, res) => {
    if (!req.body || typeof req.body.path !== "string") {
        return res.status(400).json({ error: "Invalid request. 'path' must be provided and should be a string." });
    }
    try {
        const subdirectoryDetails = getDirectoryDetails(req.body.path);
        return res.status(200).json({ result: subdirectoryDetails });
    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve subdirectory details." });
    }
});


router.post("/deleteFile", async (req, res) => {
    try {
        const { path: filePath } = req.body;
        if (!filePath) {
            return res.status(400).json({ error: "File path is required." });
        }
        await deleteFile(filePath);
        return res.status(200).json({ message: "File deleted successfully." });
    } catch (error) {
        console.error("Error deleting file:", error);
        return res.status(500).json({ error: error.message });
    }
});

router.post("/renameFile", async (req, res) => {
    try {
        const { filePath, newName } = req.body;
        if (!filePath || !newName) {
            return res.status(400).json({ message: "Invalid request. Both 'filePath' and 'newName' are required." });
        }
        await renameFile(filePath, newName);
        return res.status(200).json({ message: "File renamed successfully." });
    } catch (error) {
        console.error("Error in /renameFile route:", error);
        return res.status(500).json({ message: error });
    }
});

const exposeContentDisposition = (req, res, next) => {
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    next();
};

router.get("/downloadFile",exposeContentDisposition ,(req, res) => {
    try {
        const filePath = req.query.path;
        if (!filePath) {
            return res.status(400).json({ error: "File path is required" });
        }
        const absolutePath = path.resolve(filePath);
        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ error: "File not found" });
        }
        const fileStat = fs.statSync(absolutePath);
        if (!fileStat.isFile()) {
            return res.status(400).json({ error: "Path does not point to a valid file" });
        }
        res.download(absolutePath, path.basename(absolutePath), (err) => {
            if (err) {
                console.error(`Error sending file: ${err.message}`);
                return res.status(500).json({ error: "Error downloading file" });
            }
        });
    } catch (error) {
        console.error(`Unexpected error: ${error.message}`);
        res.status(500).json({ error: "Unexpected error occurred" });
    }
});

router.get("/directories", (req, res) => {
    try {
        const homeDirectoryDetails = getDirectories();
        return res.status(200).json({ result: homeDirectoryDetails });
    } catch (error) {
        console.error("Error retrieving home directory details:", error);
        return res.status(500).json({ error: "Failed to retrieve home directory details." });
    }
})

router.post("/directoriesInside", (req, res) => {
    if (!req.body || typeof req.body.path !== "string") {
        return res.status(400).json({ error: "Invalid request. 'path' must be provided and should be a string." });
    }
    try {
        const subdirectoryDetails = getDirectoriesInside(req.body.path);
        return res.status(200).json({ result: subdirectoryDetails });
    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve subdirectory details." });
    }
});


router.post("/copyOrCutFile", async (req, res) => {
    const { sourcePath, destinationPath, operation } = req.body;
    console.log(sourcePath, destinationPath, operation);
    if (!sourcePath || !destinationPath || !operation) {
        return res.status(400).json({ error: "Source path, destination path, and operation are required." });
    }
    try {
        const message = await copyOrCutFile(sourcePath, destinationPath, operation);
        res.status(200).json({ message });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;