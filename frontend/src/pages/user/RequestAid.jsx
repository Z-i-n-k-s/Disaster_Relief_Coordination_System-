import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { toast } from 'react-toastify';
import apiClient from '../../api/Api';
import reqAid from '../../assets/reqAid.jpeg';

const RequestAid = () => {
  const user = useSelector((state) => state?.user?.user);

  // State to store affected areas and a loader indicator.
  const [areas, setAreas] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  // Cooldown state in seconds (6 hours = 21600 seconds)
  const [cooldown, setCooldown] = useState(0);

  // Function to fetch affected areas.
  const fetchAreas = async () => {
    try {
      setShowLoader(true);
      const data = await apiClient.getAffectedArea();
      console.log('data ', data);
      setAreas(data);
    } catch (error) {
      toast.error("Failed to load affected areas.");
    } finally {
      setShowLoader(false);
    }
  };

  // Function to create an aid request using the API client.
  const createAidRequest = async (reqData) => {
    try {
      const response = await apiClient.createAidRequest(reqData);
      return response;
    } catch (error) {
      return error.response?.data || error.message;
    }
  };

  // Fetch areas on component mount.
  useEffect(() => {
    fetchAreas();
  }, []);

  // On component mount, check if there is an existing cooldown using localStorage.
  useEffect(() => {
    const lastRequest = localStorage.getItem("lastAidRequestTime");
    if (lastRequest) {
      const lastTime = parseInt(lastRequest, 10);
      const now = Date.now();
      const diff = Math.floor((now - lastTime) / 1000); // seconds passed
      const remaining = 21600 - diff; // 6 hours cooldown in seconds
      if (remaining > 0) {
        setCooldown(remaining);
      }
    }
  }, []);

  // Countdown timer effect that decreases every second.
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Only include fields that need user input.
  const [formData, setFormData] = useState({
    AreaID: '',
    ContactInfo: '',
    RequestType: '',
    Description: '',
    UrgencyLevel: '',
    NumberOfPeople: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if cooldown is active.
    if (cooldown > 0) {
      toast.info(`Please wait ${formatTime(cooldown)} before submitting another aid request.`);
      return;
    }

    // Manual validation: Ensure all fields are filled.
    for (const field in formData) {
      if (!formData[field]) {
        toast.error(`Please fill out the ${field} field.`);
        return;
      }
    }

    // Format the current date to "YYYY-MM-DD HH:MM:SS"
    const formattedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Build the payload with auto-filled fields and default Status set to "Pending".
    const payload = {
      UserID: user?.UserID,
      RequesterName: user?.Name,
      RequestDate: formattedDate,
      ResponseTime: null,
      Status: "Pending",
      ...formData,
    };

    try {
      const result = await createAidRequest(payload);
      // On successful submission, save the current time in localStorage and set the cooldown.
      localStorage.setItem("lastAidRequestTime", Date.now());
      setCooldown(21600); // 6 hours cooldown
      toast.success("Aid request submitted successfully!");
      // Reset user input fields.
      setFormData({
        AreaID: '',
        ContactInfo: '',
        RequestType: '',
        Description: '',
        UrgencyLevel: '',
        NumberOfPeople: '',
      });
    } catch (error) {
      console.error(error);
      toast.error("Error submitting aid request");
    }
  };

  // Helper function to format seconds into HH:MM:SS format.
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pb-10 pt-10">
      {/* Banner Section
      <div
        className="relative w-full self-stretch h-64 mb-8 bg-cover bg-center h-[400px]"
        style={{ backgroundImage: `url(${reqAid})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div> */}
  
      <div className="relative z-10 flex flex-col items-center justify-center h-full mb-20">
          <h1 className="text-5xl font-bold text-yellow-600">Need Immediate Aid?</h1>
          <p className="mt-2 text-xl mt-3">
            Submit your request below and get help as soon as possible.
          </p>
        </div>
  
      {/* Countdown Timer */}
      {cooldown > 0 && (
        <div className="mb-4 text-red-400 font-bold text-2xl">
          You can request aid again in: {formatTime(cooldown)}
        </div>
      )}
  
      {/* Form Container */}
      <div className="relative w-full max-w-xl">
        <form 
          onSubmit={handleSubmit} 
          className={`bg-black p-6 rounded shadow-md border border-white ${cooldown > 0 ? 'filter blur-sm pointer-events-none' : ''}`}
        >
          {/* Area Dropdown */}
          <div className="mb-4">
            <label htmlFor="AreaID" className="block text-yellow-500 mb-2">
              Area
            </label>
            <select
              id="AreaID"
              name="AreaID"
              value={formData.AreaID}
              onChange={handleChange}
              className="w-full p-2 bg-black border border-white text-white rounded"
              required
            >
              <option value="">Select Area</option>
              {areas.map((area) => (
                <option key={area.AreaID} value={area.AreaID}>
                  {area.AreaName} (Type: {area.AreaType}, Severity: {area.SeverityLevel})
                </option>
              ))}
            </select>
          </div>
  
          {/* Contact Info */}
          <div className="mb-4">
            <label htmlFor="ContactInfo" className="block text-yellow-500 mb-2">
              Contact Info
            </label>
            <input
              type="text"
              id="ContactInfo"
              name="ContactInfo"
              value={formData.ContactInfo}
              onChange={handleChange}
              className="w-full p-2 bg-black border border-white text-white rounded"
              required
            />
          </div>
  
          {/* Request Type Dropdown */}
          <div className="mb-4">
            <label htmlFor="RequestType" className="block text-yellow-500 mb-2">
              Request Type
            </label>
            <select
              id="RequestType"
              name="RequestType"
              value={formData.RequestType}
              onChange={handleChange}
              className="w-full p-2 bg-black border border-white text-white rounded"
              required
            >
              <option value="">Select Request Type</option>
              <option value="Aid">Aid</option>
              <option value="Rescue">Rescue</option>
            </select>
          </div>
  
          {/* Description */}
          <div className="mb-4">
            <label htmlFor="Description" className="block text-yellow-500 mb-2">
              Description
            </label>
            <textarea
              id="Description"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              className="w-full p-2 bg-black border border-white text-white rounded"
              rows="4"
              required
            />
          </div>
  
          {/* Urgency Level Dropdown */}
          <div className="mb-4">
            <label htmlFor="UrgencyLevel" className="block text-yellow-500 mb-2">
              Urgency Level
            </label>
            <select
              id="UrgencyLevel"
              name="UrgencyLevel"
              value={formData.UrgencyLevel}
              onChange={handleChange}
              className="w-full p-2 bg-black border border-white text-white rounded"
              required
            >
              <option value="">Select Urgency Level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
  
          {/* Number of People */}
          <div className="mb-4">
            <label htmlFor="NumberOfPeople" className="block text-yellow-500 mb-2">
              Number Of People
            </label>
            <input
              type="number"
              id="NumberOfPeople"
              name="NumberOfPeople"
              value={formData.NumberOfPeople}
              onChange={handleChange}
              className="w-full p-2 bg-black border border-white text-white rounded"
              required
            />
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded"
          >
            Submit Request
          </button>
        </form>
  
        {/* Timer Overlay */}
        {cooldown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-4xl font-bold text-white">
              {formatTime(cooldown)}
            </div>
          </div>
        )}
      </div>
  
      {showLoader && <div className="loader mt-4">Loading...</div>}
    </div>
  );
  
};

export default RequestAid;
