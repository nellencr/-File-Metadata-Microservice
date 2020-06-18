"use strict";

const express = require('express');
const app = express();

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const port = process.env.PORT;
// const port =  8888;

let sassMiddleware = require("node-sass-middleware");
app.use(sassMiddleware({
  src: __dirname + '/public',
  dest: '/tmp'
}));
//insert favicon and avoid relentless favicon errors
let favicon = require('serve-favicon');
let path = require('path');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));  //this eventally stopped my favicon woes
app.use(express.static('/tmp'));  //'/tmp' folder holds temporary sass file

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.post('/profile', upload.single('uploadFile'), function (request, response) {
  let suffix = "Bytes";
  let size = request.file.size;
  if (size > 1000) {
    suffix = "KB";
    size /= 1000;
  };
  if (size > 1000000) {
    suffix = "MB";
    size /= 1000000;
  };
  if (size > 1000000000) {
    suffix = "GB";
    size /= 1000000000;
  };
  let info = {
    name: request.file.originalname,
    size: (size + " " + suffix)
  };
  response.status(200).json(info);
  // response.status(200).json({size:( size + " " + suffix)});
});

app.use(function (err, request, response, next) {
  console.error(err.stack);
  response.send('500: Internal Server Error. Try to select file again.');
});

app.use(function (request, response, next) {
  response.send('404: Page not found!');
});

let listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});