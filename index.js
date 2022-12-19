const express = require("express");
const { createServer } = require("http");
const cors = require("cors");
const compression = require("compression");
const bodyParser = require("body-parser");
const routes = require("./routes");
const injectApplicationConstants = require("./middleware/injectApplicationConstants");

// const utils = require('./utils');
const config = require("./config");
const { port } = config;
const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(injectApplicationConstants);

app.use("/", routes);

//HTTP server
const httpServer = createServer(app);
const server = httpServer.listen(port, () => {
  console.log("****************** SERVER STARTED ************************");
  console.log("listening on port:", port);
});

// server.timeout = DEFAULT_TIMEOUT;
module.exports = app;
