// const groupFilesUtil = require("./utils/GroupFiles");
// const deleteFilesUtil = require("./utils/DeleteFiles");
// const groupFilesDateUtil = require("./utils/GroupFilesDate")
// groupFilesUtil.groupFiles();
// deleteFilesUtil.deleteFiles();

// groupFilesDateUtil.groupFilesDate();

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  console.log("hello world");
  return res.send("hello");
});

app.listen(5000, () => {
  console.log("app running on port 5000");
});
