const fs = require('fs');
const path = require('path');

const extensionRegex = /(.*\/)?(\..*?|.*?)(\.[^.]*?)?(#.*$|\?.*$|$)/;

const uploadFileToBackend = async (file, baseUrl) => {
  return new Promise((resolve, reject) => {
    const { originalname } = file;
    const fileStream = fs.createReadStream(file.path);

    const fileExtension = originalname.match(extensionRegex)[3] || path.extname(originalname);
    const fileName = `${Date.now()}${fileExtension}`;
    const uploadDir = path.join(__dirname, '../uploads');
    const uploadPath = path.join(uploadDir, fileName);
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const writeStream = fs.createWriteStream(uploadPath);

    fileStream.on('error', (error) => {
      reject(error);
    });

    writeStream.on('error', (error) => {
      reject(error);
    });

    writeStream.on('finish', () => {
      fs.unlink(file.path, (err) => {
        if (err) reject(err);
        const fileUrl = `${baseUrl}/uploads/${fileName}`;
        resolve(fileUrl);
      });
    });

    fileStream.pipe(writeStream);
  });
};

module.exports = {
  uploadFileToBackend,
};