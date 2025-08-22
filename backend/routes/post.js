const { Router } = require("express");
const { Course, Professor } = require("../models/index");
const Userauthenticate = require("../middleware/user");
const upload = require("../middleware/Upload");
const router = Router();

router.post(
  "/:courseid",
  Userauthenticate,
  upload.single("file"),
  async (req, res) => {
    const courseid = req.params.courseid;
    const author = req.user.name || req.user.email;
    const content = req.body.content;
    const fileUrl = req.file ? req.file.location : null;
    const authorEmail = req.user.email;

    const courseDetails = await Course.findOne({ courseid: courseid });
    if (!courseDetails) {
      return res.status(404).json({ msg: "Course not found" });
    }
    const authorDetails = await Professor.findOne({ email: authorEmail });
    const authorImage = authorDetails ? authorDetails.image : null;
    await Course.updateOne(
      { courseid: courseid },
      {
        $push: {
          posts: {
            author: author,
            authorImage: authorImage,
            content: content,
            date: new Date().toISOString(),
            fileUrl: fileUrl,
          },
        },
      }
    );

    res.status(200).json({
      msg: "Post added successfully",
      post: {
        author,
        content,
        fileUrl,
        authorImage,
      },
    });
  }
);

module.exports = router;
