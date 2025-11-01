import React from "react";
import TaskBoard from "./components/TaskBoard";
import "./App.css";

function App() {
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        backgroundColor: "#dbeafe", 
        padding: "1.5rem",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Company Logo Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <img
          src="/company-logo.png"
          alt="Company Logo"
          style={{
            width: "280px",
            height: "auto",
            borderRadius: "12px", 
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", 
            marginBottom: "20px"
          }}
        />
      </div>

      {/* Heading */}
      <h1
        style={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: "700",
          color: "#1e3a8a",
          marginBottom: "1.5rem",
        }}
      >
        🚀 Real-Time Collaboration Dashboard
      </h1>

      {/* Main Task Board */}
      <TaskBoard />
    </div>
  );
}

export default App;
