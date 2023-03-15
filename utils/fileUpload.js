const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "content");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100000 * 100 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpg|png|mp4|mkv|flv|mov|wmv|gif|jpeg/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(path.extname(file.originalname));
    console.log(mimeType, extName, file);
    if (mimeType && extName) {
      return cb(null, true);
    }

    cb("Give proper files formate to upload");
  },
}).single("content");

module.exports = upload;
