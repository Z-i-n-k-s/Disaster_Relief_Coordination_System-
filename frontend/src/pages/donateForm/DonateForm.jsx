import { useState } from "react";
import bg from '../../assets/donate.png';
import apiClient from "../../api/Api";
import { toast } from "react-toastify";

const DonateForm = () => {
  const [donorData, setDonorData] = useState({
    name: "",
    donationType: "",
    quantity: "",
    associatedCenter: "",
  });

  const centers = [
    "Dhaka Relief Center",
    "Chattogram Aid Hub",
    "Sylhet Support Unit",
    "Khulna Welfare Center",
    "Rajshahi Assistance Point",
    "Barisal Help Center",
    "Rangpur Emergency Base"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setLoading(true);
      const response = await apiClient.submitDonation({
        donorData
      });
      if(response.success){
      console.log(donorData);
      toast.success("Donation Submitted Successfully");
      }
    setDonorData({
      name: "",
      donationType: "",
      quantity: "",
      associatedCenter: "",
    });
    }catch(error){
      console.error("Error during donation", error)
      }finally {
        setLoading(false); // Hide loader
      }
  };


  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md bg-black p-10 mt-20 mb-20">
          <h1 className="mb-5 text-5xl font-bold text-yellow-300">Make a Donation</h1>
          {loading ? (
                <div className="flex flex-col items-center">
                  <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
                  <p className="mt-4 text-blue-500">Donating...</p>
                </div>
              ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-lg font-medium">Donor's Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={donorData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="donationType" className="block text-lg font-medium">Donation Type</label>
              <select
                id="donationType"
                name="donationType"
                value={donorData.donationType}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">Select Donation Type</option>
                <option value="Clothes">Clothes</option>
                <option value="Food">Food</option>
                <option value="Money">Money</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-lg font-medium">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={donorData.quantity}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="associatedCenter" className="block text-lg font-medium">Select Center</label>
              <select
                id="associatedCenter"
                name="associatedCenter"
                value={donorData.associatedCenter}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="" className="text-2xl font-bold text-white ">Select a Center</option>
                {centers.map((center, index) => (
                  <option key={index} value={center} className="text-gray-400">
                    {center}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn mt-10 bg-yellow-300 text-black font-bold w-full">
              Submit Donation
            </button>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonateForm;
