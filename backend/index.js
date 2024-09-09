const express = require("express");
const cors = require("cors")
const app = express();
const {checkValidDirectory}=require("./utils/CommonUtils")
const {groupFiles}=require("./utils/GroupFiles");
const {groupFilesDate} = require("./utils/GroupFilesDate");
const {deleteFiles} = require("./utils/DeleteFiles");
app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.json())

app.get("/", (req, res) => {

});

app.post("/groupFiles", (req, res) => {

  if(checkValidDirectory(req.body.directory)){
    groupFiles(req.body.directory,req.body.isRecursive,req.body.selectedExtensions);
    return res.status(200).json({"message":"files grouped successfully"})
  }
  return res.status(400).json({"error":"invalid directory path given"});
});


app.post("/groupFilesDates", (req, res) => {

  if(checkValidDirectory(req.body.directory)){
    groupFilesDate(req.body.directory,req.body.isRecursive,req.body.selectedExtensions);
    return res.status(200).json({"message":"files grouped successfully"})
  }
  return res.status(400).json({"error":"invalid directory path given"});
});


app.post("/deleteFiles", (req, res) => {

  if(checkValidDirectory(req.body.directory)){
    deleteFiles(req.body.directory,req.body.isRecursive,req.body.selectedExtensions,req.body.timeLimit,req.body.minSize);
    return res.status(200).json({"message":"files deleted successfully"})
  }
  return res.status(400).json({"error":"invalid directory path given"});
});
app.listen(5000, () => {
  console.log("app running on port 5000");
});
