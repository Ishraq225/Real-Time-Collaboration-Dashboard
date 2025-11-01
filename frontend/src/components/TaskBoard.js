import React, { useEffect, useState } from "react";
import API from "../api/api";
import TaskForm from "./TaskForm";
import ActivityPanel from "./ActivityPanel";
import socket from "../socket"; 

const TaskBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    const { data } = await API.get("/tasks");
    setTasks(data);
  };

  const startEditing = (task) => {
    setEditingTask(task);
  };

  const updateTask = async (updatedTask) => {
    await API.put(`/tasks/${updatedTask._id}`, updatedTask);
    socket.emit("taskUpdated");
    setEditingTask(null);
  };

  useEffect(() => {
    console.log("✅ Socket connected:", socket.id);
    socket.on("userCount", (count) => setUserCount(count));
    socket.on("refreshTasks", fetchTasks);
    fetchTasks();
    return () => {
      socket.off("refreshTasks");
      socket.off("userCount");
    };
  }, []);

  const addTask = async (task) => {
    await API.post("/tasks", task);
    socket.emit("taskUpdated");
  };

  const updateStatus = async (id, status) => {
    await API.put(`/tasks/${id}`, { status });
    socket.emit("taskUpdated");
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    socket.emit("taskUpdated");
  };

  const columns = ["Todo", "In Progress", "Done"];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        gap: "1.5rem",
        padding: "2rem",
        background: "#f5f7fb",
        fontFamily: "Inter, sans-serif",
        minHeight: "100vh",
      }}
    >
      {/* Left: Task Board */}
      <div>
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "700",
            marginBottom: "1rem",
            color: "#333",
            textAlign: "center",
          }}
        >
          🗂️ Real-Time Task Board
        </h2>

        <div
          style={{
            background: "#e7f7ef",
            color: "#1b7f5b",
            fontWeight: "500",
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: "8px",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          👥 Users Online: {userCount}
        </div>

        {/* ✅ Task Form - supports Add + Edit modes */}
        <TaskForm
          onSubmit={editingTask ? updateTask : addTask}
          editingTask={editingTask}
          onCancel={() => setEditingTask(null)}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          {columns.map((col) => (
            <div
              key={col}
              style={{
                background: "#ffffff",
                borderRadius: "12px",
                padding: "1rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                transition: "0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  marginBottom: "0.8rem",
                  color: "#444",
                  textAlign: "center",
                }}
              >
                {col}
              </h3>

              {tasks
                .filter((task) => task.status === col)
                .map((task) => (
                  <div
                    key={task._id}
                    style={{
                      background: "#f9fafc",
                      border: "1px solid #e3e6ee",
                      borderRadius: "8px",
                      padding: "0.8rem",
                      marginBottom: "0.7rem",
                      transition: "0.25s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0,0,0,0.06)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow = "none")
                    }
                  >
                    <h4
                      style={{
                        fontWeight: "600",
                        color: "#333",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {task.title}
                    </h4>
                    <p
                      style={{
                        color: "#666",
                        fontSize: "0.9rem",
                        marginBottom: "0.4rem",
                      }}
                    >
                      {task.description}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#888",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <strong>Assigned to:</strong>{" "}
                      {task.assignedTo || "N/A"}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "0.3rem",
                      }}
                    >
                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateStatus(task._id, e.target.value)
                        }
                        style={{
                          padding: "4px 6px",
                          border: "1px solid #ccc",
                          borderRadius: "6px",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          background: "#fff",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.borderColor = "#6b9eff")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.borderColor = "#ccc")
                        }
                      >
                        {columns.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <div style={{ display: "flex", gap: "8px" }}>
                        {/* ✏️ Edit Button */}
                        <button
                          onClick={() => startEditing(task)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#0077b6",
                            fontSize: "1rem",
                            cursor: "pointer",
                            transition: "0.3s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.2)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        >
                          ✏️
                        </button>

                        {/* 🗑️ Delete Button */}
                        <button
                          onClick={() => deleteTask(task._id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#e63946",
                            fontSize: "1rem",
                            cursor: "pointer",
                            transition: "0.3s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.2)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Right: Activity Panel */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "12px",
          padding: "1rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <ActivityPanel />
      </div>
    </div>
  );
};

export default TaskBoard;
