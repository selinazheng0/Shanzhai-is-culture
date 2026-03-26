const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs'); // REQUIRED

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

//
// VIEW ENGINE
//
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//
// MIDDLEWARE
//
app.use(logger('dev'));

// IMPORTANT: this allows raw file uploads
app.use(express.raw({ type: '*/*', limit: '10mb' }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

//
// ROUTES
//
app.use('/', indexRouter);
app.use('/users', usersRouter);

//
// UPLOAD ROUTE
//
app.post('/uploadFile', (req, res) => {
  const fileData = req.body; // raw binary data
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

  const imagesDir = path.join(__dirname, 'images');

  // prevent overwrite (recommended)
  const uniqueName = Date.now() + '-' + fileName;
  const savePath = path.join(imagesDir, uniqueName);

  try {
    // create folder if it doesn't exist
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

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

//
// 404 HANDLER
//
app.use(function(req, res, next) {
  next(createError(404));
});

//
// ERROR HANDLER
//
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;