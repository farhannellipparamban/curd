import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import { addTask,deleteTask, getAllTask } from "../api/taskApi";

const TaskList = () => {
  const [taskList, settaskList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [edittask, setEdittask] = useState(null);
  const [newtask, setNewtask] = useState({
    task: "",
    description: "",
    status: "",
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    taskId: null,
  });

  const dataPerPage = 5;

  const getTask = async () => {
    try {
      const response = await getAllTask();
      if (response && response.data && Array.isArray(response.data)) {
        settaskList(response.data);
      } else {
        console.error("Unexpected data format from API:", response);
        settaskList([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  const handleEdit = (task) => {
    setEdittask(task);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const { message } = await deleteTask(id);
      settaskList((prevTask) =>
        prevTask.filter((task) => task._id !== id)
      );
      toast.success(message);
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error("Failed to delete task. Please try again later.");
    }
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  

  const filteredData = !searchInput
    ? taskList
    : taskList.filter((task) =>
        task.name?.toLowerCase().includes(searchInput.toLowerCase())
      );

  const lastIndex = currentPage * dataPerPage;
  const firstIndex = lastIndex - dataPerPage;
  const taskListInSinglePage = filteredData.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filteredData.length / dataPerPage);

  const numbers = [];
  for (let i = 1; i <= totalPages; i++) {
    numbers.push(i);
  }

  return (
    <div className="container mx-auto px-1 sm:px-3">
      <div className="flex flex-col sm:flex-row justify-between items-center my-3">
        <h1 className="font-bold text-3xl mb-3 sm:mb-0">Task</h1>
        <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-5">
          <input
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            placeholder="Search..."
            className="px-3 py-2 pr-28 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200 ease-in-out transform hover:scale-105 placeholder-gray-500 mb-3 sm:mb-0 w-full sm:w-auto"
          />
          <button
            onClick={() => {
              setEdittask(null);
              setShowModal(true);
            }}
            className="px-3 py-2 sm:py-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <div className="flex sm:hidden justify-center items-center w-full">
              <span>Add</span>
            </div>{" "}
            <span className="hidden sm:inline">ADD NEW TASK</span>
          </button>
          {showModal &&
            (edittask ? (
              <EditTask
                showModal={showModal}
                setShowModal={setShowModal}
                task={edittask}
                updatetaskList={getTask}
              />
            ) : (
              <AddTask
                showModal={showModal}
                setShowModal={setShowModal}
                newtask={newtask}
                setNewtask={setNewtask}
                addtask={AddTask}
                updatetaskList={getTask}
              />
            ))}
        </div>
      </div>
      <div className="py-8">
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow-lg overflow-hidden border border-gray-400 sm:rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                      >
                        Task
                      </th>
                      <th
                        scope="col"
                        className="hidden px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:table-cell sm:px-6"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                      >
                        Status
                      </th>
                      
                      <th
                        scope="col"
                        className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-6"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {taskListInSinglePage &&
                      taskListInSinglePage.length > 0 &&
                      taskListInSinglePage.map((task) => (
                        <tr
                          key={task._id}
                          className="hover:bg-gray-100 transition-colors"
                        >
                          <td className="px-1 py-4 whitespace-nowrap sm:px-6">
                            <div className="flex items-center text-sm text-black">
                              <img
                                src="/download (1).png"
                                alt=""
                                className="rounded-full w-8 h-8 mr-2"
                              />
                              <span className="font-semibold">
                                {task.task}
                              </span>
                            </div>
                          </td>
                          <td className="hidden px-4 py-4 whitespace-nowrap sm:table-cell">
                            <div className="text-sm text-black">
                              {task.description}
                            </div>
                          </td>
                          <td className="px-2 py-6 whitespace-nowrap sm:px-6">
                            <span className="text-sm text-black">
                              {task.status}
                            </span>
                          </td>
                          
                          <td className="px-2 py-4 whitespace-nowrap sm:px-6">
                            <div className="flex gap-2">
                              <FontAwesomeIcon
                                icon={faEdit}
                                onClick={() => handleEdit(task)}
                                className="text-blue-600 cursor-pointer"
                              />
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                onClick={() =>
                                  setDeleteConfirmation({
                                    show: true,
                                    taskId: task._id,
                                  })
                                }
                                className="text-red-500 cursor-pointer"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {deleteConfirmation.show && (
                  <div className="fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
                    <div className="w-full max-w-lg bg-white shadow-lg rounded-md p-6 relative">
                      <div className="my-8 text-center">
                        <h4 className="text-lg font-semibold mt-6">
                          Are you sure you want to delete task{" "}
                          {
                            taskList.find(
                              (task) =>
                                task._id === deleteConfirmation.taskId
                            )?.name
                          }{" "}
                          ?
                        </h4>
                      </div>
                      <div className="text-center space-x-4 space-y-3">
                        <button
                          type="button"
                          onClick={() => {
                            handleDelete(deleteConfirmation.taskId);
                            setDeleteConfirmation({ show: false });
                          }}
                          className="px-16 py-2.5 rounded-md text-white text-sm font-semibold border-none outline-none bg-green-500 hover:bg-green-700 active:bg-green-500"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmation({ show: false })}
                          className="px-16 py-2.5 rounded-md text-white text-sm font-semibold border-none outline-none bg-orange-700 hover:bg-orange-800 active:bg-orange-700"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default TaskList;
