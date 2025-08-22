const { Router } = require("express");
const { Admin, Student, Professor, Course } = require("../models/index");
const router = Router();
const bcrypt = require("bcrypt");
const upload = require("../middleware/Upload");

router.post("/addStudent", upload.single("image"), async (req, res) => {
  const { name, email, password, rollno } = req.body;
  const imageUrl = req.file ? req.file.location : null;

  const isExist = await Student.findOne({ email: email });
  if (isExist) {
    return res.status(400).json({ msg: "Student already exists" });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const studentDetails = await Student.create({
    name,
    email,
    password: hashedPassword,
    rollno,
    image: imageUrl,
  });

  studentDetails.password = undefined;
  res.status(200).json({
    msg: "Student added successfully",
    studentDetails,
  });
});

router.post("/addStudentSubject", async (req, res) => {
  const { courseName, courseId } = req.body;
  const email = req.headers.email;

  try {
    const courseDetails = await Course.findOne({
      coursename: courseName,
      courseid: courseId,
    });
    if (!courseDetails) {
      return res.status(404).json({ msg: "Course not found" });
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { email: email },
      {
        $push: {
          courses: {
            course: courseDetails._id,
            attendance: [],
            midSem: {},
            endSem: {},
          },
        },
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ msg: "Student not found" });
    }

    await Course.updateOne(
      { _id: courseDetails._id },
      { $addToSet: { students: updatedStudent._id } }
    );
    updatedStudent.password = undefined;
    res.status(200).json({
      msg: "Course added to student successfully",
      updatedStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Failed to add course to student",
      error: error.message,
    });
  }
});

router.post("/addProfessor", upload.single("image"), async (req, res) => {
  const { name, email, password, id } = req.body;
  const imageUrl = req.file ? req.file.location : null;

  const isExist = await Professor.findOne({ email: email, id: id });
  if (isExist) {
    return res.status(400).json({ msg: "Professor already exists" });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const professorDetails = await Professor.create({
    id,
    name,
    email,
    password: hashedPassword,
    image: imageUrl,
  });

  professorDetails.password = undefined;
  res.status(200).json({
    msg: "Professor added successfully",
    professorDetails,
  });
});

router.post("/addProfessorSubject", async (req, res) => {
  const { courseName, courseId } = req.body;
  const email = req.headers.email;

  try {
    const courseDetails = await Course.findOne({
      coursename: courseName,
      courseid: courseId,
    });
    const professorDetails = await Professor.findOne({ email: email });
    if (!courseDetails) {
      return res.status(404).json({ msg: "Course not found" });
    }

    const updatedProfessor = await Professor.findOneAndUpdate(
      { email: email },
      {
        $push: {
          courses: {
            course: courseDetails._id,
          },
        },
      },
      { new: true }
    );

    if (!updatedProfessor) {
      return res.status(404).json({ msg: "Professor not found" });
    }
    const updatedCourse = await Course.findOneAndUpdate(
      { coursename: courseName, courseid: courseId },
      {
        $addToSet: {
          professor: professorDetails._id,
        },
      },
      { new: true }
    );
    res.status(200).json({
      msg: "Course added to professor successfully",
      updatedProfessor,
      updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Failed to add course to professor",
      error: error.message,
    });
  }
});

router.post("/addAdmin", async (req, res) => {
  const { name, email, password } = req.body;

  const isExist = await Admin.findOne({ email: email });
  if (isExist) {
    return res.status(400).json({
      msg: "Admin Already Exists",
    });
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await Admin.create({
    name: name,
    email: email,
    password: hashedPassword,
  });
  res.status(200).json({
    msg: "Admin added successfully",
  });
});

module.exports = router;
