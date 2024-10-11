const path = require('path');
const fs = require('fs');

exports.deleteFile = (filename, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  fs.unlink(filePath, err => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
  });
};

