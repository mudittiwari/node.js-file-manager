const express = require('express');
const router = express.Router();
const {checkValidDirectory}=require("../utils/CommonUtils")
const {groupFiles}=require("../utils/GroupFiles");
const {groupFilesDate} = require("../utils/GroupFilesDate");
const {deleteFiles} = require("../utils/DeleteFiles");
const {SearchFiles} = require("../utils/SearchFiles");

router.post("/groupFiles", async (req, res) => {
    if (checkValidDirectory(req.body.selectedDirectory)) {
        const resultMap = groupFiles(req.body.selectedDirectory, req.body.isRecursive, req.body.selectedExtensionsService);
        return res.status(200).json({ "message": "files grouped successfully", "resultMap": [...resultMap] })
    }
    return res.status(400).json({ "error": "invalid directory path given" });
});


function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

router.post("/groupFilesDates", (req, res) => {

    if (checkValidDirectory(req.body.selectedDirectory)) {
        const resultMap = groupFilesDate(req.body.selectedDirectory, req.body.isRecursive, req.body.selectedExtensionsService);
        return res.status(200).json({ "message": "files grouped successfully", "resultMap": [...resultMap] })
    }
    return res.status(400).json({ "error": "invalid directory path given" });
});


router.post("/deleteFiles", (req, res) => {

    if (checkValidDirectory(req.body.selectedDirectory)) {
        const resultMap = deleteFiles(req.body.selectedDirectory, req.body.isRecursive, req.body.selectedExtensionsService, req.body.timeLimit, req.body.mininumSize);
        return res.status(200).json({ "message": "files deleted successfully", "resultMap": [...resultMap] })
    }
    return res.status(400).json({ "error": "invalid directory path given" });
});

router.post("/searchFiles", (req, res) => {
    if (checkValidDirectory(req.body.selectedDirectory)) {
        const resultMap = SearchFiles(req.body.selectedDirectory, req.body.isRecursive, req.body.fileNames, req.body.selectedExtensionsService, req.body.dateRange, req.body.sizeRange)
        return res.status(200).json({ "message": "files search successful", "resultMap": [...resultMap] });
    }
    else {
        return res.status(400).json({ "error": "invalid directory path given" });
    }
});


module.exports = router;