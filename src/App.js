import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
      const fetchedTasks = response.data;
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (task) => {
    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/todos', {
        title: task,
        completed: false,
      });
      const newTask = response.data;
      setTasks([...tasks, newTask]);
      setInputValue('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') {
      alert('Please fill out the task');
      return;
    }

    const taskInEditMode = tasks.find((task) => task.editMode);
    if (taskInEditMode) {
      alert('Please save or cancel the current task edit');
      return;
    }

    addTask(inputValue);
    setTasks([...tasks, { task: inputValue, completed: false, editMode: false }]);
    setInputValue('');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleTaskEdit = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].editMode = true;
    setTasks(updatedTasks);
  };

  const handleTaskSave = (index, newTask) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].task = newTask;
    updatedTasks[index].editMode = false;
    setTasks(updatedTasks);
  };

  const handleTaskCancel = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].editMode = false;
    setTasks(updatedTasks);
  };

  const handleTaskDelete = (index) => {
    if (showCompletedTasks) {
      const updatedCompletedTasks = [...completedTasks];
      updatedCompletedTasks.splice(index, 1);
      setCompletedTasks(updatedCompletedTasks);
    } else {
      const updatedTasks = [...tasks];
      updatedTasks.splice(index, 1);
      setTasks(updatedTasks);
    }
  };

  const handleTaskComplete = (index) => {
    const completedTask = tasks[index];
    const updatedTasks = tasks.filter((task, i) => i !== index);
    setTasks(updatedTasks);
    setCompletedTasks([...completedTasks, completedTask]);
  };

  const handleTaskIncomplete = (index) => {
    const incompleteTask = completedTasks[index];
    const updatedCompletedTasks = completedTasks.filter((task, i) => i !== index);
    setCompletedTasks(updatedCompletedTasks);
    setTasks([...tasks, incompleteTask]);
  };

  const handleToggleCompletedTasks = () => {
    setShowCompletedTasks(!showCompletedTasks);
  };

  const handleBackToTasks = () => {
    setShowCompletedTasks(false);
  };

  const handleTaskSelection = (index) => {
    const selectedTaskIndex = selectedTasks.indexOf(index);
    if (selectedTaskIndex === -1) {
      setSelectedTasks([...selectedTasks, index]);
    } else {
      const updatedSelectedTasks = [...selectedTasks];
      updatedSelectedTasks.splice(selectedTaskIndex, 1);
      setSelectedTasks(updatedSelectedTasks);
    }
  };

  const handleDeleteSelectedTasks = () => {
    const updatedTasks = tasks.filter((_, index) => !selectedTasks.includes(index));
    setTasks(updatedTasks);
    setSelectedTasks([]);
  };

  const handleMarkSelectedTasksCompleted = () => {
    const updatedTasks = tasks.filter((_, index) => !selectedTasks.includes(index));
    const selectedTasksData = tasks.filter((_, index) => selectedTasks.includes(index));
    setTasks(updatedTasks);
    setCompletedTasks([...completedTasks, ...selectedTasksData]);
    setSelectedTasks([]);
  };

  return (
    <div className="App">
      <header>
        <h1 className="heading">
          <strong>
            <i className="fa-sharp fa-solid fa-list"></i>
            &nbsp; TO-DO LIST
          </strong>
        </h1>
        <h2 className="headingPlan">Plan</h2>
        <form className="taskAddingBar" onSubmit={handleSubmit}>
          <input
            type="text"
            id="list-input"
            placeholder="Enter Your Task Here!"
            value={inputValue}
            onChange={handleInputChange}
          />
          <input type="submit" id="list-submit" value="ADD" />
        </form>
      </header>
      <main>
        <section className="task-list">
          {!showCompletedTasks && (
            <div>
              <h2 className="headingTasks">
                <i className="fa-sharp fa-solid fa-list-check"></i>
                &nbsp; Tasks
              </h2>
              <div id="tasks">
                {tasks.map((task, index) => (
                  <div className="task" key={index}>
                    <div className="content">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(index)}
                        onChange={() => handleTaskSelection(index)}
                      />
                      {task.editMode ? (
                        <input
                          type="text"
                          className="text"
                          value={task.task}
                          onChange={(e) => {
                            const newTask = e.target.value;
                            const updatedTasks = [...tasks];
                            updatedTasks[index].task = newTask;
                            setTasks(updatedTasks);
                          }}
                        />
                      ) : (
                        <span>{task.title}</span>
                      )}
                    </div>
                    <div className="actions">
                      {task.editMode ? (
                        <div>
                          <button
                            className="save"
                            onClick={() => handleTaskSave(index, task.task)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel"
                            onClick={() => handleTaskCancel(index)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            className="edit"
                            onClick={() => handleTaskEdit(index)}
                          >
                            Edit
                          </button>
                          {!task.completed && (
                            <button
                              className="delete"
                              onClick={() => handleTaskDelete(index)}
                            >
                              Delete
                            </button>
                          )}
                          {task.completed && (
                            <button
                              className="incomplete"
                              onClick={() => handleTaskIncomplete(index)}
                            >
                              Mark as Incomplete
                            </button>
                          )}
                        </>
                      )}
                      {!task.completed && (
                        <button
                          className="complete"
                          onClick={() => handleTaskComplete(index)}
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="task-actions">
                {selectedTasks.length > 0 && (
                  <div>
                    <button
                      className="delete-selected"
                      onClick={handleDeleteSelectedTasks}
                    >
                      Delete Selected
                    </button>
                    <button
                      className="mark-selected"
                      onClick={handleMarkSelectedTasksCompleted}
                    >
                      Mark as Complete
                    </button>
                  </div>
                )}
                <button
                  className="toggle-completed"
                  onClick={handleToggleCompletedTasks}
                >
                  Show Completed Tasks
                </button>
              </div>
            </div>
          )}

          {showCompletedTasks && (
            <div>
              <h2 className="headingTasks">
                <i className="fa-sharp fa-solid fa-check"></i>
                &nbsp; Completed Tasks
              </h2>
              <div id="completed-tasks">
                {completedTasks.map((task, index) => (
                  <div className="task" key={index}>
                    <div className="content">
                      <span>{task.title}</span>
                    </div>
                    <div className="actions">
                      <button
                        className="delete"
                        onClick={() => handleTaskDelete(index)}
                      >
                        Delete
                      </button>
                      <button
                        className="incomplete"
                        onClick={() => handleTaskIncomplete(index)}
                      >
                        Mark as Incomplete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="back" onClick={handleBackToTasks}>
                Back to Tasks
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
