const express = require('express');
const router = express.Router();
const JWT = require("jsonwebtoken");

router.post("/",(req,res)=>{
    const config = require('dotenv').config();
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).json({ error: "Username and Password are required"}); 
    }
    if(username === config.parsed.USERNAME && password === config.parsed.PASSWORD){
        const payload = {
            username: username, 
          };
          const token = JWT.sign(payload, process.env.JWT_SECRET);
          return res.status(200).json({'token':token});
    }
    else{
        return res.status(400).json({ error: "Username and Password are incorrect"});
    }

});



module.exports = router;