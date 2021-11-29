const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

// Inisialisasi nama aplikasi
const app = express();

// Memanggil Router
const authRouter = require("./src/routes/auth");
const blogRouter = require("./src/routes/blog");
const { options } = require("mongoose");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Setting midleware
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// Setting CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Membuat endpoint
app.use("/v1/auth", authRouter);
app.use("/v1/blog", blogRouter);

app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({ message: message, data: data });
});

const uri =
  "mongodb://arifnur:HjM56SapEWmxGjT@cluster0-shard-00-00.vaatj.mongodb.net:27017,cluster0-shard-00-01.vaatj.mongodb.net:27017,cluster0-shard-00-02.vaatj.mongodb.net:27017/blog?ssl=true&replicaSet=atlas-13snj1-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(4000, () => console.log("Connection Success"));
  })
  .catch((err) => console.log(err));

// app.listen(4000);
