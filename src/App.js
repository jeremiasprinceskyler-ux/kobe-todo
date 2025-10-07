import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import Header from "./Header";


// ✅ SearchBar Component
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const handleChange = (e) => { setQuery(e.target.value); onSearch(e.target.value); };
  return (
    <div className="search-bar">
      <input type="text" placeholder="Search tasks..." value={query} onChange={handleChange} />
    </div>
  );
};

// ✅ Confirmation Modal Component
const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ✅ Sample Data
const tasksData = [
  { id: 1, title: "Sort Microsoft Account login details", due: null, completed: false, important: true },
  { id: 2, title: "Follow up with Justin about his choice in to-do apps", due: "Mon, 25 Nov", completed: false, important: false },
  { id: 3, title: "Buy groceries", due: "Today", completed: false, important: true },
  { id: 4, title: "Finish React project", due: "Tomorrow", completed: true, important: false },
];

export default function App() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Initialize tasks from localStorage; if none, use sample data
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : tasksData;
  });
  const [filter, setFilter] = useState("all"); // ✅ Sidebar filter state
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [tempDueDate, setTempDueDate] = useState("");
  // New state for Remind Me modal
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderText, setReminderText] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderMonth, setReminderMonth] = useState("");
  const fileInputRef = useRef(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Persist tasks in localStorage whenever they change.
  useEffect(() => { localStorage.setItem("tasks", JSON.stringify(tasks)); }, [tasks]);

  const handleAddTaskClick = () => {
    setIsAddingTask(true);
  };

  const toggleComplete = (taskId) => {
    setTasks(tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const toggleImportant = (taskId) => {
    setTasks(tasks.map((task) =>
      task.id === taskId ? { ...task, important: !task.important } : task
    ));
  };

  // Delete the task permanently.
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    setTaskToDelete(null);
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
    }
  };

  // Save the reminder and update the selected task.
  const saveReminder = () => {
    if (selectedTask) {
      // Combine reminder details into a string (customize as needed)
      const combinedReminder = `${reminderText.trim()} | ${reminderTime} ${reminderDate} ${reminderMonth}`;
      setTasks(tasks.map(task =>
        task.id === selectedTask.id ? { ...task, reminders: combinedReminder } : task
      ));
      // Clear reminder modal fields and hide modal.
      setReminderText("");
      setReminderTime("");
      setReminderDate("");
      setReminderMonth("");
      setShowReminderModal(false);
    }
  };

  const cancelReminder = () => {
    setReminderText("");
    setReminderTime("");
    setReminderDate("");
    setReminderMonth("");
    setShowReminderModal(false);
  };

  // ✅ Filter logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    switch (filter) {
      case "myDay":
        return task.due === "Today";
      case "important":
        return task.important;
      case "planned":
        return task.due !== null;
      case "completed":
        return task.completed;
      case "assigned":
        return task.title.toLowerCase().includes("assigned");
      case "flagged":
        return task.title.toLowerCase().includes("email");
      case "tasks":
        return true;
      default:
        return true;
    }
  });

  return (
    <div className={`app`} 
         style={{ backgroundImage: "url('/download (3).jfif')", backgroundSize: "cover" }}>
      <SearchBar onSearch={(value) => setSearchTerm(value)} />

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="button-bar">
          <button onClick={() => setFilter("myDay")}>☀️ My Day</button>
          <button onClick={() => setFilter("important")}>⭐ Important</button>
          <button onClick={() => setFilter("planned")}>📅 Planned</button>
          <button onClick={() => setFilter("all")}>📂 All</button>
          <button onClick={() => setFilter("completed")}>✅ Completed</button>
          <button onClick={() => setFilter("assigned")}>👤 Assigned to Me</button>
          <button onClick={() => setFilter("flagged")}>✉️ Flagged Email</button>
          <button onClick={() => setFilter("tasks")}>📋 Tasks</button>
        </div>
      </aside>

      

      {/* Main content */}
      <main className="main">
        <div className="overlay">
          <Header />
          <div className="content">
            {/* Task List */}
            <div className="task-list">
              {filteredTasks.map((task) => (
                <div key={task.id} className="task" onClick={() => setSelectedTask(task)}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                  />
                  <div>
                    <span>{task.title}</span>
                    {task.due && <p className="due">📅 {task.due}</p>}
                    {task.important && <p className="important">⭐ Important</p>}
                    {task.reminders && <p className="due">{task.reminders}</p>}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toggleImportant(task.id); }}>⭐</button>
                  <button onClick={(e) => { e.stopPropagation(); setTaskToDelete(task); }}>Delete</button>
                </div>
              ))}
              {/* Add Task Bar */}
              <div className="add-task-bar"
                   onClick={() => { if (!isAddingTask) handleAddTaskClick(); }}>
                {isAddingTask ? (
                  <input
                    type="text"
                    placeholder="Enter new task title..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        if (newTaskTitle.trim() !== "") {
                          const newTask = {
                            id: Date.now(),
                            title: newTaskTitle,
                            due: null,
                            steps: [],
                            reminders: null,
                            files: [],
                            notes: "",
                            completed: false,
                            important: false,
                          };
                          setTasks([...tasks, newTask]);
                          setNewTaskTitle("");
                        }
                        setIsAddingTask(false);
                      }
                    }}
                  />
                ) : (
                  <span>Add a Task</span>
                )}
              </div>
            </div>

            {selectedTask && (
              <div className="details">
                <h2>{selectedTask.title}</h2>
                
                {/* My Day Button in Task Details */}
                <div className="detail-section">
                  <button onClick={() => {
                    if (selectedTask.due === "Today") {
                      alert("You have Already add to your MY DAY");
                    } else {
                      setTasks(tasks.map(task =>
                        task.id === selectedTask.id ? { ...task, due: "Today" } : task
                      ));
                      setFilter("myDay");
                    }
                  }}>
                    Add to My Day
                  </button>
                </div>
                
                {/* Add Step */}
                <div className="detail-section">
                  <button onClick={() => {
                    const newStep = prompt("Enter a new step:");
                    if (newStep) {
                      setTasks(tasks.map(task =>
                        task.id === selectedTask.id
                          ? { ...task, steps: [...(task.steps || []), newStep] }
                          : task
                      ));
                    }
                  }}>
                  Add Step
                  </button>
                  {selectedTask.steps && selectedTask.steps.length > 0 && (
                    <ul>
                      {selectedTask.steps.map((step, idx) => (
                        <li key={idx}>✅ {step}</li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {/* Remind Me */}
                <div className="detail-section">
                  <button onClick={() => setShowReminderModal(true)}>
                    Remind Me
                  </button>
                  {selectedTask.reminders && <p>🔔 {selectedTask.reminders}</p>}
                </div>

                {/* Add Due Date */}
                <div className="detail-section">
                  <button onClick={() => { setTempDueDate(""); setShowDateModal(true); }}>
                    Add Due Date
                  </button>
                  {selectedTask.due && <p>📅 {selectedTask.due}</p>}
                </div>

                {/* Repeat */}
                <div className="detail-section">
                  <button onClick={() => {
                    const repeat = prompt("Enter repeat option (e.g., daily, weekly):");
                    if (repeat) {
                      setTasks(tasks.map(task =>
                        task.id === selectedTask.id ? { ...task, repeat } : task
                      ));
                    }
                  }}>
                    Repeat
                  </button>
                  {selectedTask.repeat && <p>🔁 {selectedTask.repeat}</p>}
                </div>

                {/* Add File */}
                <div className="detail-section">
                  <button onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                    Add File
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{ display: "none" }} 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setTasks(tasks.map(task =>
                          task.id === selectedTask.id
                            ? { ...task, files: [...(task.files || []), file.name] }
                            : task
                        ));
                      }
                      e.target.value = "";
                    }}
                  />
                  {selectedTask.files && selectedTask.files.length > 0 && (
                    <ul>
                      {selectedTask.files.map((f, idx) => (
                        <li key={idx}>📎 {f}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Add Note */}
                <div className="detail-section">
                  <button onClick={() => {
                    const note = prompt("Enter note:");
                    if (note) {
                      setTasks(tasks.map(task =>
                        task.id === selectedTask.id
                          ? { ...task, notes: note }
                          : task
                      ));
                    }
                  }}>
                    Add Note
                  </button>
                  {selectedTask.notes && <p>📝 {selectedTask.notes}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal for Deletion */}
      {taskToDelete && (
        <ConfirmModal 
          message={`Are you sure you want to delete "${taskToDelete.title}"? This action cannot be undone.`}
          onConfirm={() => deleteTask(taskToDelete.id)}
          onCancel={() => setTaskToDelete(null)}
        />
      )}

      {/* Due Date Modal */}
      {showDateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Select Due Date</p>
            <input type="date" value={tempDueDate} onChange={(e) => setTempDueDate(e.target.value)} />
            <div className="modal-buttons">
              <button onClick={() => {
                if (tempDueDate && selectedTask) {
                  const formattedDate = new Date(tempDueDate).toLocaleDateString("en-US", {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  });
                  setTasks(tasks.map(task =>
                    task.id === selectedTask.id ? { ...task, due: formattedDate } : task
                  ));
                  setShowDateModal(false);
                }
              }}>Confirm</button>
              <button onClick={() => setShowDateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Remind Me Modal */}
      {showReminderModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Set Reminder</h2>
            <textarea 
              placeholder="Type your reminder message here..." 
              rows="4" 
              value={reminderText} 
              onChange={(e) => setReminderText(e.target.value)}
            ></textarea>
            <div className="reminder-inputs" style={{display:"flex", justifyContent:"space-between", marginTop:"10px"}}>
              <input 
                type="time" 
                value={reminderTime} 
                onChange={(e) => setReminderTime(e.target.value)} 
                style={{width:"30%"}}
              />
              <input 
                type="date" 
                value={reminderDate} 
                onChange={(e) => setReminderDate(e.target.value)} 
                style={{width:"30%"}}
              />
              <input 
                type="month" 
                value={reminderMonth} 
                onChange={(e) => setReminderMonth(e.target.value)} 
                style={{width:"30%"}}
              />
            </div>
            <div className="modal-buttons" style={{marginTop:"15px"}}>
              <button onClick={saveReminder}>Confirm</button>
              <button onClick={cancelReminder}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}