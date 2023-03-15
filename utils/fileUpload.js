const multer = require("multer"); //requiring in multer
const path = require("path"); //requiring in path

const storage = multer.diskStorage({
  //Returns a StorageEngine implementation configured to store files on the local file system.
  destination: (req, file, cb) => {
    //where will the content be stored
    cb(null, "content");
  },
  filename: (req, file, cb) => {
    //what will be the file name
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  //Returns a Multer instance that provides several methods for generating middleware that process files uploaded in multipart/form-data format.
  storage, //storage config declared above
  limits: { fileSize: 100000 * 100 }, //An object specifying various limits on incoming data.
  fileFilter: (req, file, cb) => {
    //Optional function to control which files are uploaded. This is called for every file that is processed.
    const fileTypes = /jpg|png|mp4|mkv|flv|mov|wmv|gif|jpeg/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(path.extname(file.originalname));
    console.log(mimeType, extName, file);
    if (mimeType && extName) {
      //if right mimeType & extName then callback fn will be called
      return cb(null, true);
    }

    cb("Give proper files formate to upload"); //else error
  },
}).single("content"); //Returns middleware that processes a single file associated with the given form field. //single file at a time

module.exports = upload;
