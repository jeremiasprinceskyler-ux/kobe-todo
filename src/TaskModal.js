// TaskModal.js
import React, { useState } from "react";
import "./TaskModal.css";

export default function TaskModal({ onSubmit, onClose }) {
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit(title);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Task</h2>
        <input
          type="text"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="modal-buttons">
          <button className="confirm" onClick={handleSubmit}>
            Add Task
          </button>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
