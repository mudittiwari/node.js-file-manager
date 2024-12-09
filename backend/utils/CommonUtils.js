const fs=require("fs");


const checkValidDirectory=(path)=>{
    try {
        const stats=fs.statSync(path);
        console.log(stats);
        if(stats.isDirectory)
            return true;
        return false;
    } catch (error) {
        return false;
    }
}


module.exports={
    checkValidDirectory
}