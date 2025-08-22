require("dotenv").config();
const mongoose = require("mongoose");

//connecting mongoose database
// mongoose.connect("mongodb+srv://jaydeepmeena62:qzanQm5k3KPf4wlV@iiita-classroom.iy8hix9.mongodb.net/?retryWrites=true&w=majority&appName=IIITA-Classroom")
// .then((response) =>{
//     console.log("Database connected successfully")
// })
// .catch((error) => {
//     console.log("Database not connected")

// })
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully"))
  .catch((error) => {
    console.error("Database not connected:", error.message);
  });

//Schemas

const CourseRecordSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  attendance: [
    {
      date: String,
      present: Boolean,
    },
  ],
  midSem: {
    quiz: Number,
    review: Number,
    assignment: Number,
  },
  endSem: {
    quiz: Number,
    review: Number,
    assignment: Number,
  },
});

const CourseRecordSchema1 = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
});

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rollno: { type: String, required: true, unique: true },
    courses: [CourseRecordSchema],
    image: { type: String, required: false },
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }],
  },
  { timestamps: true }
);

const AdminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    image: { type: String, required: false },
  },
  { timestamps: true }
);

const ProfessorSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    id: { type: String, unique: true },
    image: { type: String, required: false },
    courses: [CourseRecordSchema1],
    teachingAssistant: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { timestamps: true }
);

const CourseSchema = new mongoose.Schema(
  {
    coursename: String,
    courseid: { type: String, unique: true },
    courseImage: String,
    posts: [
      {
        author: { type: String, required: true },
        authorImage: { type: String, required: false },
        date: { type: Date, default: Date.now },
        content: { type: String, required: true },
        fileUrl: { type: String, required: false },
      },
    ],
    professor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Professor",
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    midSemWeightage: {
      quiz: Number,
      reviewTest: Number,
      assignments: Number,
    },
    endSemWeightage: {
      quiz: Number,
      reviewTest: Number,
      assignments: Number,
    },
    assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
  },
  { timestamps: true }
);

const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    files: [{ type: String, required: false }],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Professor" },
    postedOn: { type: Date, default: Date.now },
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }],
  },
  { timestamps: true }
);

const SubmissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    submissionFile: { type: String, required: true },
    submittedOn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", StudentSchema);
const Admin = mongoose.model("Admin", AdminSchema);
const Professor = mongoose.model("Professor", ProfessorSchema);
const Course = mongoose.model("Course", CourseSchema);
const Assignment = mongoose.model("Assignment", AssignmentSchema);
const Submission = mongoose.model("Submission", SubmissionSchema);

module.exports = {
  Student,
  Admin,
  Professor,
  Course,
  Assignment,
  Submission,
};
