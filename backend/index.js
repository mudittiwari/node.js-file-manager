const express = require("express");
const cors = require("cors")
const app = express();
const {checkValidDirectory}=require("./utils/CommonUtils")
const {groupFiles}=require("./utils/GroupFiles");
const {groupFilesDate} = require("./utils/GroupFilesDate");
const {deleteFiles} = require("./utils/DeleteFiles");
const {SearchFiles} = require("./utils/SearchFiles");
app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use(express.json())

app.get("/", (req, res) => {

});

app.post("/groupFiles", async(req, res) => {
  if(checkValidDirectory(req.body.directory)){
    const resultMap=groupFiles(req.body.directory,req.body.isRecursive,req.body.selectedExtensionsService);
    return res.status(200).json({"message":"files grouped successfully","resultMap":[...resultMap]})
  }
  return res.status(400).json({"error":"invalid directory path given"});
});


function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

app.post("/groupFilesDates", (req, res) => {

  if(checkValidDirectory(req.body.directory)){
    const resultMap=groupFilesDate(req.body.directory,req.body.isRecursive,req.body.selectedExtensionsService);
    return res.status(200).json({"message":"files grouped successfully","resultMap":[...resultMap]})
  }
  return res.status(400).json({"error":"invalid directory path given"});
});


app.post("/deleteFiles", (req, res) => {

  if(checkValidDirectory(req.body.directory)){
    const resultMap=deleteFiles(req.body.directory,req.body.isRecursive,req.body.selectedExtensionsService,req.body.timeLimit,req.body.mininumSize);
    return res.status(200).json({"message":"files deleted successfully","resultMap":[...resultMap]})
  }
  return res.status(400).json({"error":"invalid directory path given"});
});

app.post("/searchFiles",(req,res)=>{
  if(checkValidDirectory(req.body.directory)){
    const resultMap=SearchFiles(req.body.directory,req.body.isRecursive,req.body.fileNames,req.body.selectedExtensionsService,req.body.dateRange,req.body.sizeRange)
    return res.status(200).json({"message":"files search successful","resultMap":[...resultMap]});
  }
  else{
    return res.status(400).json({"error":"invalid directory path given"});
  }
});

app.listen(5000, () => {
  console.log("app running on port 5000");
});