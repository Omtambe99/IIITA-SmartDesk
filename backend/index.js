// calling .config() ehich reads .env file and
// loads all the environment variables
require("dotenv").config();
// multer is lib that handle file upload (images,pdfs)
const multer = require("multer");

// Your routes import a different upload middleware from middleware/Upload.js
// we can remove upload
const upload = multer();

// express lib -> framework used to build the backend server
const express = require("express");
// creating application instance (oject)
// creating a server-> if stores *settings(port, env. variables) *Middlewares(function to process requests), *routes
const app = express();

// By default,browser block HTTP request from a web page to different domains,protocol, or port this is called Same Origin Policy
// cors lib package automatically sets the correct HTTP header so broweser knows yours backend allows requests from another origin
const cors = require("cors");

// JSON parsing
// In modern Express you can instead do app.use(express.json()). body-parser still works but express.json() is built-in.
const bodyParser = require("body-parser");

// each of these load routes modelules
// ex. /routes/student is code that handles the /student request
const studentRouter = require("./routes/student");
const adminRouter = require("./routes/admin");
const courseRouter = require("./routes/course");
const postRouter = require("./routes/post");
const professorRouter = require("./routes/professor");
const userLoginRouter = require("./routes/userLogin");
const attendanceRouter = require("./routes/markAttendance");
const viewAttendanceRouter = require("./routes/viewAttendance");
const resultRouter = require("./routes/results");
const todoRouter = require("./routes/todo");

// bcrypt is a hashing library mainly used for securely storing passwords
// while storing pasword it convert them in hashing form.
// const bcrypt = require('bcrypt');

// Enables cross-origin requests from any origin (default).
// Simple and convenient while developing. In production you might restrict allowed origins for security.
app.use(cors());

// Tells the server: “for every incoming request, if it has JSON body, parse it and put the result in req.body.”
// Example: If client sends { "email": "om@example.com" }, you can read req.body.email.
app.use(bodyParser.json());

// request /student-> hands it to the studentRouter as imported above
app.use("/student", studentRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);
app.use("/post", postRouter);
app.use("/professor", professorRouter);
app.use("/user", userLoginRouter);
app.use("/markAttendance", attendanceRouter);
app.use("/viewAttendance", viewAttendanceRouter);
app.use("/results", resultRouter);
app.use("/todo", todoRouter);

// process.env.PORT means reads the port value from the .enc file
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started running on port ${PORT}`);
});
