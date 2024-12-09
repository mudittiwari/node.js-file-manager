const express = require("express");
const cors = require("cors")
const advancedOperationsRouter = require("./routes/AdvancedOperations");
const basicOperationsRouter = require("./routes/BasicOperations");
const loginRouter = require("./routes/LoginRouter");
require('dotenv').config();


const app = express();
app.use(cors({ origin: '*' })); 
app.use(express.urlencoded({extended: false}));
app.use(express.json())


const PORT = 8080;
const HOST = '0.0.0.0';


app.use("/api/advancedOperations",advancedOperationsRouter);

app.use("/api",basicOperationsRouter);

app.use("/api/login", loginRouter);


app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});