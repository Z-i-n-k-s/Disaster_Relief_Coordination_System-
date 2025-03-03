import  { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";
import apiClient from "../../api/Api";
import { useSelector } from "react-redux";

const AssignedTasks = () => {
  const user = useSelector((state) => state?.user?.user);
  const [volunteersAidTasks, setVolunteersAidTasks] = useState([]);
  const [centers, setCenters] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [openResourceModal, setOpenResourceModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  // For Aid/Rescue tasks: state for selected resources and their deduction amounts
  const [selectedResources, setSelectedResources] = useState([]);

  // Fetch tasks assigned to the volunteer, then for each Aid or Rescue task, fetch its corresponding resources.
  const fetchVolunteersAidTasks = useCallback(async () => {
    if (!user?.UserID) return;
    setShowLoader(true);
    try {
      const dataResponse = await apiClient.getVolunteersAidPrepTasks(
        user.volunteer.VolunteerID
      );
      console.log(dataResponse);
      if (dataResponse) {
        // dataResponse.data is expected to be an array of tasks.
        const tasks = dataResponse.data;
        // For each task, if it's Aid or Rescue, fetch its corresponding resources using the same function.
        const tasksWithResources = await Promise.all(
          tasks.map(async (task) => {
            if (["Aid", "Rescue"].includes(task.RequestType)) {
              const response = await apiClient.getAidResource(task.task_id);
              console.log("prep id with resources", response);
              let hasAidResources = false;
              let aidResources = [];
              if (
                response &&
                response.success &&
                Array.isArray(response.data)
              ) {
                aidResources = response.data.filter(
                  (item) => item.PreparationID === task.task_id
                );
                hasAidResources = aidResources.some(
                  (item) => item.QuantityUsed > 0
                );
              }
              return { ...task, hasAidResources, aidResources };
            }
            return task;
          })
        );
        setVolunteersAidTasks(tasksWithResources);
      } else {
        toast.error(dataResponse?.message || "No data received.");
      }
    } catch (error) {
      toast.error("Error fetching volunteers");
      console.error("Error:", error);
    } finally {
      setShowLoader(false);
    }
  }, [user]);

  // Fetch all relief centers (with resources)
  const fetchAllReliefCenters = async () => {
    setShowLoader(true);
    try {
      const dataResponse = await apiClient.getAllReliefCenters();
      console.log("res relief ", dataResponse);
      if (Array.isArray(dataResponse)) {
        setCenters(dataResponse);
      } else if (dataResponse.success) {
        setCenters(dataResponse.data);
      } else if (dataResponse.error) {
        toast.error(dataResponse.message);
      }
    } catch (error) {
      toast.error("An error occurred while fetching data.");
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    fetchVolunteersAidTasks();
  }, [fetchVolunteersAidTasks]);

  // When opening the modal, if the task is Aid or Rescue, load the relief centers.
  const handleAddResource = (task) => {
    setSelectedTask(task);
    if (["Aid", "Rescue"].includes(task.RequestType)) {
      fetchAllReliefCenters();
      setSelectedResources([]);
    }
    setOpenResourceModal(true);
  };

  const closeModal = () => {
    setOpenResourceModal(false);
    setSelectedTask(null);
    setSelectedResources([]);
  };

  // For simple resource submit (for other task types).
  const handleResourceSubmit = (e) => {
    e.preventDefault();
    toast.success("Resources added!");
    closeModal();
  };

  // For both Aid and Rescue tasks: add a resource deduction.
  const handleAddResourceDeduction = (resource) => {
    // For simplicity, prompt the user to enter a deduction quantity.
    const qty = parseInt(window.prompt("Enter quantity to deduct:", "0"), 10);
    if (isNaN(qty) || qty <= 0) {
      toast.error("Invalid quantity");
      return;
    }
    // Check if the resource already exists in the selectedResources array.
    const existing = selectedResources.find(
      (r) => r.ResourceID === resource.ResourceID
    );
    if (existing) {
      // Update quantity (ensure not exceeding available)
      const newQty = existing.deducted + qty;
      if (newQty > resource.Quantity) {
        toast.error("Exceeds available quantity");
        return;
      }
      setSelectedResources(
        selectedResources.map((r) =>
          r.ResourceID === resource.ResourceID ? { ...r, deducted: newQty } : r
        )
      );
    } else {
      if (qty > resource.Quantity) {
        toast.error("Exceeds available quantity");
        return;
      }
      setSelectedResources([
        ...selectedResources,
        { ...resource, deducted: qty },
      ]);
    }
  };

  // Remove a resource deduction from the selected list.
  const handleRemoveSelectedResource = (resourceID) => {
    setSelectedResources(
      selectedResources.filter((r) => r.ResourceID !== resourceID)
    );
  };

  // Handler for both Aid and Rescue "Prepare" button to mark task as done.
  const handleAidPrepare = async () => {
    if (!selectedTask) return;
    const preparationId = selectedTask.task_id;
    try {
      setShowLoader(true);
      // Process each selected resource.
      for (const resource of selectedResources) {
        const reqData = {
          ResourceID: resource.ResourceID,
          QuantityUsed: resource.deducted,
        };
        console.log(
          "Calling createAidResource with:",
          reqData,
          "for prepId:",
          preparationId
        );
        const response = await apiClient.createAidResource(
          reqData,
          preparationId
        );
        console.log("Response from createAidResource:", response);
        if (!response.success) {
          throw new Error(response.message || "Error creating aid resource");
        }
      }
      toast.success(
        `${selectedTask.RequestType === "Aid" ? "Aid" : "Rescue"} task prepared!`
      );
      closeModal();
    } catch (error) {
      toast.error("Error creating aid resource: " + error.message);
      console.error("createAidResource error:", error);
    } finally {
      setShowLoader(false);
    }
  };

  // Handler for marking the task as completed if it already has resources.
  const handleMarkComplete = async (task) => {
    try {
      setShowLoader(true);
      const reqData = { Status: "Completed" };
      const response = await apiClient.updateAidPrepStatus(
        task.task_id,
        reqData
      );
      console.log("Response from updateAidPrepStatus:", response);
      if (response.success) {
        toast.success(`Task ${task.task_id} marked as completed!`);
      } else {
        toast.error(response.message || "Error marking task as completed.");
      }
      // Optionally, re-fetch tasks to update the UI.
      fetchVolunteersAidTasks();
    } catch (error) {
      toast.error("Error marking task as completed: " + error.message);
      console.error("updateAidPrepStatus error:", error);
    } finally {
      setShowLoader(false);
    }
  };

  // For display: if not filtering by type, show all tasks.
  const tasksToShow = volunteersAidTasks;

  // Flatten available resources from centers.
  const availableResources = centers.flatMap((center) =>
    (center.resources || []).map((resource) => ({
      ...resource,
      CenterName: center.CenterName,
    }))
  );

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl m-5 pb-10 text-center font-bold text-yellow-500 mb-4">
        Assigned Tasks
      </h1>

      {/* Tasks Table */}
      <div className="bg-black pb-4 rounded">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black border">
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2 text-left">Request Type</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Urgency Level</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {showLoader ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  <div className="flex justify-center items-center">
                    <ThreeDots color="#7542ff" height={80} width={80} />
                  </div>
                </td>
              </tr>
            ) : tasksToShow.length > 0 ? (
              tasksToShow.map((task, index) => (
                <tr key={task.task_id} className="hover:text-white hover:transform hover:scale-95 transition-all duration-200">
                  <td className="px-4 py-2 text-center border-b border-gray-600">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {task.RequestType}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {task.Description}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {task.UrgencyLevel}
                  </td>
                  <td className="px-4 py-2 text-center border-b border-gray-600">
                    {["Aid", "Rescue"].includes(task.RequestType) ? (
                      <div className="flex gap-2 justify-center">
                        {task.task_status === "Completed" ? (
                          <button
                            disabled
                            className="text-green-600 px-4 py-2 rounded"
                          >
                            Completed preparations
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleAddResource(task)}
                              className="bg-gray-800 text-white px-4 py-2 rounded"
                            >
                              {task.RequestType === "Aid"
                                ? "Prepare Aid"
                                : "Prepare Rescue"}
                            </button>
                            {task.hasAidResources && (
                              <button
                                onClick={() => handleMarkComplete(task)}
                                className="bg-yellow-600 text-white px-4 py-2 rounded"
                              >
                                Mark as Completed
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddResource(task)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Add Resources
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {openResourceModal && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {["Aid", "Rescue"].includes(selectedTask.RequestType) ? (
            // Modal for Aid and Rescue: Two tables side by side.
            <div className="bg-gray-800 p-6 rounded shadow-md w-11/12 md:w-4/5">
              <h2 className="text-xl font-bold mb-4 text-yellow-500">
                {selectedTask.RequestType === "Aid"
                  ? `Prepare Aid Task #${selectedTask.task_id}`
                  : `Prepare Rescue Task #${selectedTask.task_id}`}
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Available Resources Table */}
                <div className="w-full md:w-1/2">
                  <h3 className="text-lg font-semibold mb-2">
                    Available Resources
                  </h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="px-2 py-1">ID</th>
                        <th className="px-2 py-1">Type</th>
                        <th className="px-2 py-1">Quantity</th>
                        <th className="px-2 py-1">Center</th>
                        <th className="px-2 py-1">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableResources.length > 0 ? (
                        availableResources.map((resource) => (
                          <tr
                            key={resource.ResourceID}
                            className="hover:bg-gray-700"
                          >
                            <td className="px-2 py-1 border">
                              {resource.ResourceID}
                            </td>
                            <td className="px-2 py-1 border">
                              {resource.ResourceType}
                            </td>
                            <td className="px-2 py-1 border">
                              {resource.Quantity}
                            </td>
                            <td className="px-2 py-1 border">
                              {resource.CenterName}
                            </td>
                            <td className="px-2 py-1 border">
                              <button
                                onClick={() =>
                                  handleAddResourceDeduction(resource)
                                }
                                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                              >
                                Add
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center p-2">
                            No resources available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Selected Resources Table */}
                <div className="w-full md:w-1/2">
                  <h3 className="text-lg font-semibold mb-2">
                    Selected Deductions
                  </h3>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="px-2 py-1">Type</th>
                        <th className="px-2 py-1">Deducted</th>
                        <th className="px-2 py-1">Center</th>
                        <th className="px-2 py-1">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedResources.length > 0 ? (
                        selectedResources.map((res) => (
                          <tr
                            key={res.ResourceID}
                            className="hover:bg-gray-700"
                          >
                            <td className="px-2 py-1 border">
                              {res.ResourceType}
                            </td>
                            <td className="px-2 py-1 border">{res.deducted}</td>
                            <td className="px-2 py-1 border">
                              {res.CenterName}
                            </td>
                            <td className="px-2 py-1 border">
                              <button
                                onClick={() =>
                                  handleRemoveSelectedResource(res.ResourceID)
                                }
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center p-2">
                            No selections
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Prepare button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleAidPrepare}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
                >
                  {selectedTask.RequestType === "Aid"
                    ? "Prepare Aid"
                    : "Prepare Rescue"}
                </button>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Other Modal: Simple resource addition form.
            <div className="bg-gray-800 p-6 rounded shadow-md w-96">
              <h2 className="text-xl font-bold mb-4 text-yellow-500">
                Add Resources for Task #{selectedTask.task_id}
              </h2>
              <form onSubmit={handleResourceSubmit}>
                <div className="mb-4">
                  <label className="block text-yellow-500 mb-1">
                    Resource Name:
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                    placeholder="Enter resource name"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignedTasks;