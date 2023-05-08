const fs = require("fs");
const dir = "./images/recipe";
const { uuid } = require("uuidv4");
const multer = require("multer");
const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, "images/recipe");
  },
  filename: function (req, file, cb) {
    cb(null, uuid() + "-" + file.originalname.split(" ").join("_"));
  },
});
const upload = multer({ storage: storageConfig });
module.exports = upload;