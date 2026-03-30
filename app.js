const fs = require('fs');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
const options = {
  type: 'application/octet-stream',
};
app.use(bodyParser.raw(options));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.static(__dirname));
app.use('/users', usersRouter);

app.post('/uploadFile', (req, res) => {
  var fileData = req.body;
  console.log(fileData)
  const originalFileName = req.headers['x-file-name'];

  if (!originalFileName) {
    return res.status(400).send('Missing file name');
  }

  const fileName = path.basename(originalFileName);
  const fileExtension = path.extname(fileName).toLowerCase();

  // allow only images
  if (!['.png', '.jpg', '.jpeg'].includes(fileExtension)) {
    return res.status(400).send('Invalid file type');
  }

  const imagesDir = path.join(__dirname, 'userimages');

  // prevent overwrite (recommended)
  const uniqueName = Date.now() + '-' + fileName;
  const savePath = path.join(imagesDir, uniqueName);

  try {
    // create folder if it doesn't exist
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    console.log("54")
    // save file
    fs.writeFileSync(savePath, fileData);

    res.send({
      message: "File uploaded successfully",
      fileName: uniqueName
    });
  } catch (error) {
    res.status(500).send({
      message: "Failed to upload file",
      error: error.message
    });
  }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;