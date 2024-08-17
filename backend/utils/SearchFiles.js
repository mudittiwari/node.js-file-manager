const readline = require("readline");
const fs = require("fs");
const path = require('path');

const SearchFiles=()=>{
    const rl=initializeReadLine();
    const readLine=rl();

    readLine.question("Enter the directory",function(directory){
        readLine.question("")
    });
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
