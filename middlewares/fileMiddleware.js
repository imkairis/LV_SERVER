const multer = require('multer');
const path = require('path');

// Configure storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const uploadSingle = (fieldName) => multer({ storage }).single(fieldName);

const uploadMultiple = (fieldName, length=10) => multer({ storage }).array(fieldName, length); 

const uploadFields = (fieldsArray) => {
  return multer({ storage }).fields(fieldsArray);
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadFields,
};
