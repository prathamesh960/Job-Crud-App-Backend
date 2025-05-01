// manageJob.js

const express = require("express");
const router = express.Router();
const {
  addJobPost,
  addJobDelete,
  addJobPut,
  addJobGet
} = require("../controllers/jobRegister");
const fileUpload = require("../middleware/fileUpload"); 


router.post("/add-job", fileUpload.single("resume"), addJobPost);

router.delete("/:id", addJobDelete);
router.put("/:id", addJobPut);
router.get("/get-job", addJobGet);

module.exports = router;
