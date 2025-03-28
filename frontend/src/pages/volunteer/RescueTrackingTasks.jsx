import  { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { ThreeDots } from 'react-loader-spinner';
import apiClient from '../../api/Api';

// Helper function to format date as "YYYY-MM-DD HH:mm:ss"
const formatDateTime = (date) => {
  const pad = (n) => (n < 10 ? '0' + n : n);
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    ' ' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds())
  );
};

const RescueTrackingTasks = () => {
  const user = useSelector((state) => state?.user?.user);
  const [volunteersResTasks, setVolunteersResTasks] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [updatedPeopleHelped, setUpdatedPeopleHelped] = useState(0);

  const fetchVolunteersResTasks = useCallback(async () => {
    if (!user?.UserID) return;
    setShowLoader(true);
    try {
      const dataResponse = await apiClient.getVolunteersResTasks(user.volunteer.VolunteerID);
      console.log(dataResponse);
      if (dataResponse) {
        setVolunteersResTasks(dataResponse.data);
      } else {
        toast.error(dataResponse?.message || 'No data received.');
      }
    } catch (error) {
      toast.error('Error fetching tasks');
      console.error('Error:', error);
    } finally {
      setShowLoader(false);
    }
  }, [user]);

  useEffect(() => {
    fetchVolunteersResTasks();
  }, [fetchVolunteersResTasks]);

  // Update task info without changing status or completion time.
  const handleUpdateSubmit = async () => {
    try {
      const payload = {
        TrackingStatus: selectedTask.status, // maintain previous status
        NumberOfPeopleHelped: updatedPeopleHelped,
      };
      const response = await apiClient.updateRescueTracking(selectedTask.task_id, payload);
      if (response) {
        toast.success(`Task ${selectedTask.task_id} updated successfully.`);
        setVolunteersResTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.task_id === selectedTask.task_id
              ? { ...t, number_of_people_helped: updatedPeopleHelped }
              : t
          )
        );
        handleCloseModal();
      }
    } catch (error) {
      toast.error('Error updating task');
      console.error(error);
    }
  };

  // Updates the aid request status using the provided req_id and new status.
  const handleRequestStatusUpdate = async (requestId, newStatus) => {
    try {
      const updatedRequest = await apiClient.updateAidRequestStatus(requestId, newStatus);
      if (!updatedRequest) {
        toast.error("Failed to update request status.");
      }
    } catch (error) {
      toast.error("Error updating request status.");
      console.error("Status update error:", error);
    }
  };

  // Mark task as completed with current datetime.
  const handleMarkCompleted = async (task) => {
    try {
      const currentTime = new Date();
      const formattedTime = formatDateTime(currentTime);
      const payload = {
        TrackingStatus: 'Completed',
        NumberOfPeopleHelped: task.number_of_people_helped,
        CompletionTime: formattedTime,
      };
      const response = await apiClient.updateRescueTracking(task.task_id, payload);
      if (response) {
        toast.success(`Task ${task.task_id} marked as completed.`);
        setVolunteersResTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.task_id === task.task_id
              ? { 
                  ...t, 
                  status: 'Completed', 
                  request_status: 'Completed', 
                  CompletionTime: formattedTime 
                }
              : t
          )
        );
        // Call handleRequestStatusUpdate with "Completed" status and the task's req_id.
        handleRequestStatusUpdate(task.req_id, 'Completed');
      }
    } catch (error) {
      toast.error('Error marking task as completed');
      console.error(error);
    }
  };

  const handleOpenUpdateModal = (task) => {
    setSelectedTask(task);
    setUpdatedPeopleHelped(task.number_of_people_helped);
    setShowUpdateModal(true);
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setSelectedTask(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl text-center m-5 pb-10 font-bold text-yellow-500 mb-4">Assigned Tasks</h1>
      <div className="bg-black pb-4 rounded">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black border">
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2 text-left">Area Name</th>
              <th className="px-4 py-2 text-left">Requester Name</th>
              <th className="px-4 py-2 text-left">Contact Info</th>
              <th className="px-4 py-2 text-left">Request Type</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Urgency Level</th>
              <th className="px-4 py-2 text-left">People We Helped</th>
              <th className="px-4 py-2 text-left">Total Needed People</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {showLoader ? (
              <tr>
                <td colSpan="10" className="text-center p-4">
                  <div className="flex justify-center items-center">
                    <ThreeDots color="#7542ff" height={80} width={80} />
                  </div>
                </td>
              </tr>
            ) : volunteersResTasks.length > 0 ? (
              volunteersResTasks.map((task, index) => (
                <tr key={task.task_id} className="hover:text-white hover:transform hover:scale-95 transition-all duration-200">
                  <td className="px-4 py-2 text-center border-b border-gray-600">{index + 1}</td>
                  <td className="px-4 py-2 border-b border-gray-600">{task.area_name}</td>
                  <td className="px-4 py-2 border-b border-gray-600">{task.RequesterName}</td>
                  <td className="px-4 py-2 border-b border-gray-600">{task.ContactInfo}</td>
                  <td className="px-4 py-2 border-b border-gray-600">{task.RequestType}</td>
                  <td className="px-4 py-2 border-b border-gray-600">{task.Description}</td>
                  <td className="px-4 py-2 border-b border-gray-600">{task.UrgencyLevel}</td>
                  <td className="px-4 py-2 border-b border-gray-600">{task.number_of_people_helped}</td>
                  <td className="px-4 py-2 border-b border-gray-600">{task.NumberOfPeople}</td>
                  <td className="px-4 py-2 text-center border-b border-gray-600">
                    {task.status === 'Completed' ? (
                      <button
                        disabled
                        className="text-green-600 px-2 py-1 rounded cursor-not-allowed"
                      >
                        Completed
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleMarkCompleted(task)}
                          className="bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                        >
                          Mark as Completed
                        </button>
                        <button
                          onClick={() => handleOpenUpdateModal(task)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          Update Info
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center p-4">No tasks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Update Info Modal */}
      {showUpdateModal && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4 text-yellow-500">
              Update Task #{selectedTask.task_id}
            </h2>
            <div className="mb-4">
              <p>
                <span className="font-semibold">Description:</span> {selectedTask.Description}
              </p>
              <p>
                <span className="font-semibold">Urgency Level:</span> {selectedTask.UrgencyLevel}
              </p>
              <p>
                <span className="font-semibold">Total People:</span> {selectedTask.NumberOfPeople}
              </p>
              <p>
                <span className="font-semibold">People Helped:</span> {selectedTask.number_of_people_helped}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-yellow-500 mb-1">Update People Helped</label>
              <input
                type="number"
                value={updatedPeopleHelped}
                onChange={(e) => setUpdatedPeopleHelped(parseInt(e.target.value, 10))}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RescueTrackingTasks;
