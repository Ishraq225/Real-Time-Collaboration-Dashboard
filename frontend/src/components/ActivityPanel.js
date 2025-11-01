import React, { useEffect, useState } from "react";
import API from "../api/api";

import socket from "../socket";


const ActivityPanel = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    const { data } = await API.get("/activities");
    setLogs(data);
  };

  useEffect(() => {
    fetchLogs();

    socket.on("activityUpdated", () => {
      fetchLogs();
    });
    
    return () => {
      socket.off("activityUpdated");
    };
  }, []);

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-md h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-3">📜 Activity Logs</h3>
      {logs.length === 0 ? (
        <p className="text-gray-500 text-sm">No recent activity</p>
      ) : (
        <ul className="space-y-2">
          {logs
            .slice()
            .reverse()
            .map((log, index) => (
              <li
                key={index}
                className="text-sm border-b border-gray-200 pb-1"
              >
                <span>{log.message}</span>
                <br />
                <span className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityPanel;
