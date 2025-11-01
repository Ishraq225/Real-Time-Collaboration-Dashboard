const express = require("express");
const Task = require("../models/Task");
const router = express.Router();
const ActivityLogs = require("../models/ActivityLogs");


//  Create
router.post("/", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  await ActivityLogs.create({ message: `🟢 ${task.assignedTo || "Someone"} created task "${task.title}"` });
  res.json(task);
});

//  Read all
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

//  Update
router.put("/:id", async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await ActivityLogs.create({ message: `🟡 Task "${updated.title}" updated to "${updated.status}"` });

  res.json(updated);
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);
    await ActivityLogs.create({
      message: `🔴 Task "${task.title}" was deleted`,
    });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
