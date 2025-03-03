import React, { useState, useEffect, useCallback } from "react";
import apiClient from "../../api/Api";
import { toast } from "react-toastify";

const AidPreparations = () => {
  // Helper function to get today's date in datetime-local format
  const getTodayDateTimeLocal = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [allAidPrepDetails, setAllAidPrepDetails] = useState([]);
  // modalStep: null, "timing", or "volunteer"
  const [modalStep, setModalStep] = useState(null);
  const [selectedPreparation, setSelectedPreparation] = useState(null);
  const [departureTime, setDepartureTime] = useState(getTodayDateTimeLocal());
  const [estimatedArrival, setEstimatedArrival] = useState(getTodayDateTimeLocal());

  // Full list of volunteers for the volunteer modal
  const [allVolunteers, setAllVolunteers] = useState([]);
  const [allTrackingVolunteers, setAllTrackingVolunteers] = useState([]);
  const [trackingData, setTrackingData] = useState([]);
  const [currentTrackingData, setCurrentTrackingData] = useState([]);
  // New state to store all tracking records
  const [allTracking, setAllTracking] = useState([]);

  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    try {
      const isoString = dateString.includes("Z")
        ? dateString
        : `${dateString.replace(" ", "T")}Z`;
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Helper to format datetime for the backend (YYYY-MM-DD HH:MM:SS)
  const formatDateTimeForBackend = (dateInput) => {
    const date = new Date(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const fetchAllAidPrepDetails = useCallback(async () => {
    try {
      const dataResponse = await apiClient.getAidPrepDetails();
      if (dataResponse?.success) {
        setAllAidPrepDetails(dataResponse.data);
      } else {
        toast.error(dataResponse?.message || "No data received.");
      }
    } catch (error) {
      toast.error("Error fetching aid preparations");
      console.error("Error:", error);
    }
  }, []);

  // When "Send Volunteers to Help" is clicked
  const handleSendVolunteers = (prep) => {
    console.log(prep);
    setSelectedPreparation(prep);
    setDepartureTime(
      prep.DepartureTime
        ? formatDateTimeLocal(prep.DepartureTime)
        : getTodayDateTimeLocal()
    );
    setEstimatedArrival(
      prep.EstimatedArrival
        ? formatDateTimeLocal(prep.EstimatedArrival)
        : getTodayDateTimeLocal()
    );
    // Start with the timing step
    setModalStep("timing");
  };

  const fetchTrackingVolunteers = useCallback(async () => {
    try {
      const dataResponse = await apiClient.getRescueTrackingVolunteers();
      console.log("tracking vols", dataResponse);
      if (dataResponse) {
        setAllTrackingVolunteers(dataResponse);
      } else {
        toast.error(dataResponse?.message || "No data received.");
      }
    } catch (error) {
      toast.error("Error fetching tracking volunteers");
      console.error("Error:", error);
    }
  }, []);

  const fetchAllTracking = useCallback(async () => {
    try {
      const dataResponse = await apiClient.getTracking();
      console.log("trackings info", dataResponse);
      if (dataResponse && dataResponse.success) {
        setAllTracking(dataResponse.data);
      } else {
        toast.error(dataResponse?.message || "No tracking data received.");
      }
    } catch (error) {
      toast.error("Error fetching tracking records");
      console.error("Error:", error);
    }
  }, []);

  useEffect(() => {
    fetchAllTracking();
    fetchAllAidPrepDetails();
  }, [fetchAllAidPrepDetails, fetchAllTracking]);

  const fetchAllVolunteers = useCallback(async () => {
    try {
      const dataResponse = await apiClient.getAllVolunteers();
      if (dataResponse && dataResponse.success) {
        setAllVolunteers(dataResponse.data);
      } else {
        toast.error(dataResponse?.message || "No data received.");
      }
    } catch (error) {
      toast.error("Error fetching volunteers");
      console.error("Error:", error);
    }
  }, []);

  // then switches the modal step to "volunteer" without closing the module.
  const handleAddVolunteers = async () => {
    try {
      const timesData = {
        DepartureTime: departureTime
          ? formatDateTimeForBackend(departureTime)
          : null,
        EstimatedArrival: estimatedArrival
          ? formatDateTimeForBackend(estimatedArrival)
          : null,
      };
      await apiClient.updateAidPrepTimes(
        selectedPreparation.PreparationID,
        timesData
      );

      const trackingData = {
        request_id: selectedPreparation.requestInfo.RequestID,
        departure_time: departureTime
          ? formatDateTimeForBackend(departureTime)
          : null,
      };
      console.log("tracking data ", trackingData);

      const res = await apiClient.createRescueTracking(trackingData);
      setCurrentTrackingData(res);
      console.log("current tracking data ", res);

      setTrackingData(trackingData);
      toast.success("Timing updated successfully");
      // Instead of closing the modal, switch its content to volunteer list
      await fetchAllVolunteers();
      await fetchTrackingVolunteers();
      setModalStep("volunteer");
    } catch (error) {
      toast.error("Error updating timing details");
      console.error("Error:", error);
    }
  };

  // Handler for when the user is finished with the rescue process
  const handleDone = async () => {
    setModalStep(null);
    setSelectedPreparation(null);
  };

  const handleJoinRescue = async (volunteerId) => {
    // Optimistically update the UI
    try {
      const res = await apiClient.createRescueTracking(trackingData);
      console.log("create tracking res", res);
      if (res) {
        const data = {
          TrackingID: res.TrackingID, // As required by the API
          VolunteerID: volunteerId,
        };

        const response = await apiClient.createRescueTrackingVolunteer(data);
        console.log(response);
        if (response) {
          await fetchTrackingVolunteers();
          setAllTrackingVolunteers((prev) => [
            ...prev,
            { TrackingID: res.TrackingID, VolunteerID: volunteerId },
          ]);
          console.log("all track vols ", allTrackingVolunteers);
          toast.success("Volunteer added to rescue team");
        } else {
          // Roll back optimistic update if the API call did not succeed
          toast.error(response.message || "Failed to add volunteer");
        }
      }
    } catch (error) {
      // Roll back optimistic update on error
      toast.error("Error adding volunteer to rescue team");
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-yellow-500">Aid Preparations</h1>
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-6xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-700 text-gray-300 uppercase text-sm">
            <tr>
              <th className="px-6 py-3">Request Type</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Urgency Level</th>
              <th className="px-6 py-3">People Affected</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {allAidPrepDetails.length > 0 ? (
              allAidPrepDetails.map((prep, index) => {
                const { requestInfo, Status, PreparationID } = prep;
                // Find the tracking record for this request (if any)
                const trackingRecord = allTracking.find(
                  (t) => Number(t.RequestID) === Number(requestInfo.RequestID)
                );
                return (
                  <tr
                    key={PreparationID}
                    className={`border-b border-gray-700 ${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                    }`}
                  >
                    <td className="px-6 py-4">{requestInfo.RequestType}</td>
                    <td className="px-6 py-4">{requestInfo.Description}</td>
                    <td className="px-6 py-4">{requestInfo.UrgencyLevel}</td>
                    <td className="px-6 py-4 text-center">{requestInfo.NumberOfPeople}</td>
                    <td className="px-6 py-4 text-center">
                      {Status === "Completed" ? (
                        // If a tracking record exists and is Completed, show a disabled button;
                        // otherwise, show the button to send volunteers
                        trackingRecord && trackingRecord.TrackingStatus === "Completed" ? (
                          <button
                            disabled
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                          >
                            Tracking Completed
                          </button>
                        ) : (
                          <button
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition"
                            onClick={() => handleSendVolunteers(prep)}
                          >
                            Send Volunteers to Help
                          </button>
                        )
                      ) : (
                        <span className="text-gray-400">Ongoing</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Combined modal for both timing and volunteer steps */}
      {modalStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded p-6 w-11/12 max-w-md">
            {modalStep === "timing" && (
              <>
                <h2 className="text-2xl font-bold mb-4">Set Timing Details</h2>
                <div className="mb-4">
                  <p className="mb-2 font-semibold">Departure Time:</p>
                  <input
                    id="departureTime"
                    type="datetime-local"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                  />
                </div>
                <div className="mb-6">
                  <label className="mb-2 block font-semibold">Estimated Arrival:</label>
                  <input
                    id="estimatedArrival"
                    type="datetime-local"
                    value={estimatedArrival}
                    onChange={(e) => setEstimatedArrival(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setModalStep(null)}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleAddVolunteers}
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
                    disabled={!departureTime || !estimatedArrival}
                  >
                    Add Volunteers to Rescue
                  </button>
                </div>
              </>
            )}
            {modalStep === "volunteer" && (
              <div className="max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Volunteers</h2>
                <div className="max-h-80 overflow-y-auto">
                  {allVolunteers.length > 0 ? (
                    allVolunteers.map((volunteer) => {
                      // Check if the volunteer is already joined for the current tracking id
                      const isJoined =
                        currentTrackingData &&
                        allTrackingVolunteers.some(
                          (item) =>
                            Number(item.VolunteerID) === Number(volunteer.VolunteerID) &&
                            Number(item.TrackingID) === Number(currentTrackingData.TrackingID)
                        );

                      return (
                        <div
                          key={volunteer.VolunteerID}
                          className="mb-2 border-b border-gray-600 pb-2 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-semibold mr-2">{volunteer.Name}</span>
                            <span className="ml-2 text-sm">
                              {volunteer.reliefCenter?.CenterName || "N/A"}
                            </span>
                          </div>
                          {isJoined ? (
                            <button
                              disabled
                              className="bg-gray-600 text-white px-3 py-1 rounded cursor-not-allowed"
                            >
                              Joined
                            </button>
                          ) : (
                            <button
                              onClick={() => handleJoinRescue(volunteer.VolunteerID)}
                              className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded"
                            >
                              Join Rescue Team
                            </button>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p>No volunteers found.</p>
                  )}
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => setModalStep(null)}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDone}
                    className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AidPreparations;
