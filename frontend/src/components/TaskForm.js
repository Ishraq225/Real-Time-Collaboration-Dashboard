import React, { useState, useEffect } from "react";

const TaskForm = ({ onSubmit, editingTask, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setAssignedTo(editingTask.assignedTo || "");
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return alert("Task title is required");
    const taskData = editingTask
      ? { ...editingTask, title, description, assignedTo }
      : { title, description, assignedTo };
    onSubmit(taskData);
    setTitle("");
    setDescription("");
    setAssignedTo("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-2xl shadow-md mb-6 transition-all duration-200 hover:shadow-lg"
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
        {editingTask ? "✏️ Edit Task" : "📝 Add a New Task"}
      </h3>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
        />

        <input
          type="text"
          placeholder="Assigned To"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
        />
      </div>

      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 rounded-lg p-2.5 mt-3 w-full min-h-[70px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
      />

      <div className="flex justify-end mt-4 gap-3">
        {editingTask && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2.5 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={`${
            editingTask
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-green-500 hover:bg-green-600"
          } text-white font-semibold px-5 py-2.5 rounded-lg transition duration-200`}
        >
          {editingTask ? "Update Task" : "Add Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
