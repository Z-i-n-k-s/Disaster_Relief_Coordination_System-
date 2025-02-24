import React, { useState } from 'react';

const RequestAid = () => {
  const [formData, setFormData] = useState({
    UserID: '',
    AreaID: '',
    RequesterName: '',
    ContactInfo: '',
    RequestType: '',
    Description: '',
    UrgencyLevel: '',
    Status: '',
    NumberOfPeople: '',
    RequestDate: '',
    ResponseTime: ''
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
    try {
      // Adjust the endpoint as needed for your backend
      const response = await fetch('/api/aid-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Failed to create aid request');
      }
      const data = await response.json();
      alert('Aid request submitted successfully!');
      // Reset the form if needed
      setFormData({
        UserID: '',
        AreaID: '',
        RequesterName: '',
        ContactInfo: '',
        RequestType: '',
        Description: '',
        UrgencyLevel: '',
        Status: '',
        NumberOfPeople: '',
        RequestDate: '',
        ResponseTime: ''
      });
    } catch (error) {
      console.error(error);
      alert('Error submitting aid request');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold text-yellow-500 mb-8">Request Aid</h1>
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-xl bg-gray-900 p-6 rounded shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="UserID" className="block text-yellow-500 mb-2">
            User ID
          </label>
          <input
            type="text"
            id="UserID"
            name="UserID"
            value={formData.UserID}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-yellow-500 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="AreaID" className="block text-yellow-500 mb-2">
            Area ID
          </label>
          <input
            type="text"
            id="AreaID"
            name="AreaID"
            value={formData.AreaID}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-yellow-500 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="RequesterName" className="block text-yellow-500 mb-2">
            Requester Name
          </label>
          <input
            type="text"
            id="RequesterName"
            name="RequesterName"
            value={formData.RequesterName}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-yellow-500 rounded"
            required
          />
        </div>
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
            className="w-full p-2 bg-gray-800 border border-yellow-500 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="RequestType" className="block text-yellow-500 mb-2">
            Request Type
          </label>
          <input
            type="text"
            id="RequestType"
            name="RequestType"
            value={formData.RequestType}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-yellow-500 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="Description" className="block text-yellow-500 mb-2">
            Description
          </label>
          <textarea
            id="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-yellow-500 rounded"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="UrgencyLevel" className="block text-yellow-500 mb-2">
            Urgency Level
          </label>
          <input
            type="number"
            id="UrgencyLevel"
            name="UrgencyLevel"
            value={formData.UrgencyLevel}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-yellow-500 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="Status" className="block text-yellow-500 mb-2">
            Status
          </label>
          <input
            type="text"
            id="Status"
            name="Status"
            value={formData.Status}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-yellow-500 rounded"
            required
          />
        </div>
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
            className="w-full p-2 bg-gray-800 border border-yellow-500 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="RequestDate" className="block text-yellow-500 mb-2">
            Request Date
          </label>
          <input
            type="date"
            id="RequestDate"
            name="RequestDate"
            value={formData.RequestDate}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-yellow-500 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="ResponseTime" className="block text-yellow-500 mb-2">
            Response Time
          </label>
          <input
            type="text"
            id="ResponseTime"
            name="ResponseTime"
            value={formData.ResponseTime}
            onChange={handleChange}
            className="w-full p-2 bg-gray-800 border border-yellow-500 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestAid;
