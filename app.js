var createError = require("http-errors");
var hbs = require('hbs');
var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require('body-parser');

hbs.registerHelper('dateFormat', require('handlebars-dateformat'));


// 1st party dependencies
var configData = require("./config/connection");
var indexRouter = require("./routes/index");
var pictures = require("./routes/pictures");
const upload = require('./routes/upload');
const data = require('./routes/data');

async function getApp() {

  // Database
  var connectionInfo = await configData.getConnectionInfo();
  mongoose.connect(connectionInfo.DATABASE_URL);

  var app = express();

  var port = normalizePort(process.env.PORT || '3001');
  app.set('port', port);

  // view engine setup
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "hbs");

  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  app.use("/", indexRouter);
  app.use("/pictures", pictures);
  app.use('/upload', upload);
  app.use('/data', data);
  app.use("/bootstrap/js", express.static(__dirname + "/node_modules/bootstrap/dist/js")); // redirect bootstrap JS
  app.use(
    "/bootstrap/css",
    express.static(__dirname + "/node_modules/bootstrap/dist/css")
  ); // redirect CSS bootstrap

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });

  return app;
}
/**
 * Normalize a port into a number, string, or false.
 */

 function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
module.exports = {
  getApp
};
