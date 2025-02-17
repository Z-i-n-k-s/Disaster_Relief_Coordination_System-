import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import bg from "../../assets/donate.png";
import apiClient from "../../api/Api";
import { toast } from "react-toastify";

const Donate = () => {
  // Get user data from Redux store
  const user = useSelector((state) => state?.user?.user);

  // Initialize donation data state (without donor name)
  const [donationData, setDonationData] = useState({
    donationType: "",
    quantity: "",
    associatedCenter: "", // This will now hold the center's ID
  });

  // Manage centers as state instead of a fixed array
  const [centers, setCenters] = useState([]);

  // Cooldown state in seconds (30 minutes = 1800 seconds)
  const [cooldown, setCooldown] = useState(0);

  // Fetch centers from the backend
  const getReliefCenters = async () => {
    try {
      const response = await apiClient.getReliefCenters();
      console.log("API Response:", response);
      
      if (!Array.isArray(response)) {
        console.error("Expected an array but got:", response);
        return;
      }

      // Assuming each center in the response has CenterID and CenterName
      setCenters(response);
    } catch (error) {
      console.error("Error fetching relief centers:", error);
    }
  };

  useEffect(() => {
    getReliefCenters();
  }, []);

  // On component mount, check if there is an existing cooldown using localStorage
  useEffect(() => {
    const lastDonation = localStorage.getItem("lastDonationTime");
    if (lastDonation) {
      const lastTime = parseInt(lastDonation, 10);
      const now = Date.now();
      const diff = Math.floor((now - lastTime) / 1000); // seconds passed
      const remaining = 1800 - diff; // 30 minutes cooldown
      if (remaining > 0) {
        setCooldown(remaining);
      }
    }
  }, []);

  // Countdown timer effect that decreases every second
  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent donation if cooldown is active
    if (cooldown > 0) {
      toast.info("Please wait for the cooldown period to finish before donating again.");
      return;
    }

    try {
      setLoading(true);
      // Construct donation payload using data from Redux store for donor info
      const donationPayload = {
        DonorName: user?.Name, // User's name from Redux store
        DonationType: donationData.donationType,
        Quantity: Number(donationData.quantity),
        DateReceived: new Date(), // Current date
        AssociatedCenter: donationData.associatedCenter,
        UserID: user?.UserID, // User's ID from Redux store
      };

      const response = await apiClient.submitDonation(donationPayload);
      
      if (response.success) {
        console.log(donationPayload);
        toast.success("Donation Submitted Successfully");

        // Save the current time in localStorage and set a 30-minute cooldown
        localStorage.setItem("lastDonationTime", Date.now());
        setCooldown(1800);
      }
      
      // Reset form after submission
      setDonationData({
        donationType: "",
        quantity: "",
        associatedCenter: "",
      });
    } catch (error) {
      console.error("Error during donation", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format seconds into MM:SS format
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="hero min-h-screen"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md bg-black p-10 mt-20 mb-20">
          <h1 className="mb-5 text-5xl font-bold text-yellow-300">
            Make a Donation
          </h1>
          
          {cooldown > 0 && (
            <div className="mb-4 text-red-400 font-bold">
              You can donate again in: {formatTime(cooldown)}
            </div>
          )}
          
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
              <p className="mt-4 text-blue-500">Donating...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Donor name is no longer needed from the form */}

              <div>
                <label
                  htmlFor="donationType"
                  className="block text-lg font-medium"
                >
                  Donation Type
                </label>
                <select
                  id="donationType"
                  name="donationType"
                  value={donationData.donationType}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                  disabled={cooldown > 0}
                >
                  <option value="">Select Donation Type</option>
                  <option value="Clothes">Clothes</option>
                  <option value="Food">Food</option>
                  <option value="Money">Money</option>
                  <option value="Water">Water</option>
                </select>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-lg font-medium">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={donationData.quantity}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  required
                  disabled={cooldown > 0}
                />
              </div>

              <div>
                <label
                  htmlFor="associatedCenter"
                  className="block text-lg font-medium"
                >
                  Select Center
                </label>
                <select
                  id="associatedCenter"
                  name="associatedCenter"
                  value={donationData.associatedCenter}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                  required
                  disabled={cooldown > 0}
                >
                  <option value="">Select a Center</option>
                  {centers.map((center) => (
                    <option
                      key={center.CenterID}
                      value={center.CenterID}
                    >
                      {center.CenterName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="btn mt-10 bg-yellow-300 text-black font-bold w-full"
                disabled={cooldown > 0}
              >
                {cooldown > 0
                  ? `Please wait ${formatTime(cooldown)}`
                  : "Submit Donation"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donate;
