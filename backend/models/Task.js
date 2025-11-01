const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["Todo", "In Progress", "Done"],
    default: "Todo",
  },
  assignedTo: String,
},
 { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);