const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const activityLogsRoutes = require("./routes/ActivityLogsRoutes");


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/activities", activityLogsRoutes);


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log(`⚡ User connected: ${socket.id}`);

  // 👥 Send live user count to everyone
  io.emit("userCount", io.engine.clientsCount);

  // 🔁 Task updates
  socket.on("taskUpdated", (data) => {
    io.emit("refreshTasks", data);
    io.emit("activityUpdated");
  });

  //  When user disconnects
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    io.emit("userCount", io.engine.clientsCount);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
