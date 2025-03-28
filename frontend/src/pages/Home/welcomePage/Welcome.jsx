import { FaHandsHelping, FaHeartbeat, FaGraduationCap, FaHandHoldingUsd, FaLeaf, FaUtensils } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

const Welcome = () => {
  return (
    <div className="text-center p-10">
      {/* Header Section */}
      <h1 className="text-4xl font-bold text-yellow-300 mb-4">--- Welcome to JonojibonAid ---</h1>
      <p className="text-lg text-gray-300 mb-10">Empowering lives through compassion, generosity, and social impact.</p>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
        {/* Card Data */}
        {[
          { icon: <FaHandsHelping className="text-green-700 text-3xl" />, bg: "bg-green-100", title: "Volunteering", desc: "Join hands to make a difference in people's lives through community service." },
          { icon: <FaHeartbeat className="text-red-700 text-3xl" />, bg: "bg-red-100", title: "Healthcare Support", desc: "Providing medical aid and health resources to those in need." },
          { icon: <FaGraduationCap className="text-blue-700 text-3xl" />, bg: "bg-blue-100", title: "Education Aid", desc: "Supporting underprivileged students with scholarships and resources." },
          { icon: <FaHandHoldingUsd className="text-yellow-700 text-3xl" />, bg: "bg-yellow-100", title: "Financial Assistance", desc: "Helping families in crisis with financial aid and support." },
          { icon: <FaLeaf className="text-green-700 text-3xl" />, bg: "bg-green-100", title: "Environmental Efforts", desc: "Promoting sustainability and eco-friendly initiatives." },
          { icon: <FaUtensils className="text-orange-700 text-3xl" />, bg: "bg-orange-100", title: "Food & Nutrition", desc: "Providing food aid to families in need and combating hunger." }
        ].map((item, index) => (
          <div 
            key={index} 
            className="card bg-white shadow-lg p-6 rounded-lg transition-all duration-300 hover:bg-green-900 hover:text-white group"
          >
            <div className={`flex items-center justify-center ${item.bg} p-4 rounded-full w-16 h-16 mx-auto group-hover:bg-white`}>
              {item.icon}
            </div>
            <h2 className="text-xl font-bold mt-4 text-black group-hover:text-white">{item.title}</h2>
            <p className="text-gray-600 group-hover:text-white">{item.desc}</p>
            <button className="mt-4 font-bold flex items-center gap-2 text-green-700 group-hover:text-yellow-300 transition-all duration-300">
              Read More <FaArrowRight />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Welcome;
