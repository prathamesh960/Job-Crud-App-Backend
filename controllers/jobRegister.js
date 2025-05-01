const { db } = require('../config');





const addJobPost = async (req, res) => {
  try {
    const { title, content, status } = req.body;
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    const resumeFilename = resumeFile.filename;

    const sql = `
      INSERT INTO jobs (title, content, status, resume)
      VALUES (?, ?, ?, ?)
    `;

    const values = [title, content, status, resumeFilename];

    await db.execute(sql, values);

    res.status(200).json({ message: 'Job added successfully' });
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a job
const addJobDelete = (req, res) => {
  const { id } = req.params;

  const deleteQuery = `DELETE FROM jobs WHERE id = ?`;
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error("Error deleting job:", err);
      return res.status(500).send({ error: "Failed to delete job" });
    }

    if (result.affectedRows > 0) {
      // Fetch the updated  jobs
      db.query("SELECT * FROM jobs", (err, jobs) => {
        if (err) {
          console.error("Error fetching jobs:", err);
          return res.status(500).send({ error: "Failed to fetch jobs" });
        }
        res.send(jobs);
      });
    } else {
      res.status(404).send({ message: "Record not found" });
    }
  });
};




const addJobPut = async (req, res) => {
  console.log("req.params", req.params);
  try {
    const { id } = req.params;
    const { title, content, status } = req.body;

    if (!title || !content || !status) {
      return res.status(400).send({ error: "All fields (title, content, status) are required" });
    }

    const updateQuery = `
      UPDATE jobs 
      SET title = ?, content = ?, status = ? 
      WHERE id = ?`;
    const values = [title, content, status, id];

    // Using promise-compatible query method
    const [result] = await db.query(updateQuery, values);

    if (result.affectedRows > 0) {
      const [updatedJob] = await db.query("SELECT * FROM jobs WHERE id = ?", [id]);
      res.send(updatedJob[0]);
    } else {
      res.status(404).send({ message: "Record not found" });
    }
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).send({ error: "Failed to update job" });
  }
};


// Get all jobs
const addJobGet = async (req, res) => {
  const query = "SELECT * FROM jobs";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(results);
  });
};

module.exports = { addJobPost, addJobDelete, addJobPut, addJobGet };

