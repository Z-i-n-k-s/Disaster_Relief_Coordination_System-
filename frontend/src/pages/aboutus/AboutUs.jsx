import { motion } from 'framer-motion';
import img1 from "../../assets/about1.jpeg";
import img2 from "../../assets/about2.avif";
import img3 from "../../assets/about3.jpg";
import imgbg from "../../assets/AUbg.jpg";
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div>
    <div
  className="hero h-[400px] relative" 
  style={{
    backgroundImage: `url(${imgbg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <div className=" absolute inset-0 bg-gradient-to-r from-black/80 to-green-900/80"></div>
  
  <div className="hero-content text-neutral-content text-center z-10 pt-10">
    <div className="max-w-md">
      <h1 className="mb-5 text-5xl font-bold text-yellow-300">Join JonojibonAid</h1>
      <p className="mb-5 text-white">
        Together, we can help change lives by providing support and resources where they are needed the most. Be a part of something bigger.
      </p>
     <Link to="/login"> <button className="btn bg-yellow-300 text-black font-bold">JOIN US</button></Link>
    </div>
  </div>
</div>


      {/* Second Section with 3 Images */}
      <div className="hero bg-base-200 min-h-screen relative ">
        <div className="hero-content flex flex-col lg:flex-row items-center justify-center relative">
          {/* Left side: 3 images */}
          <div className="flex flex-col w-full lg:w-1/2 items-center relative z-10">
        
            <motion.img
              src={img1}
              animate={{ y: [20,80,20] }} 
              transition={{ duration: 10, repeat: Infinity }}
              className="max-w-sm rounded-t-[40px] rounded-br-[40px] shadow-2xl border-l-4 border-b-4 grayscale transition-all duration-300 ease-in-out hover:grayscale-0 -mt-16 z-10"
              alt="Image 1"
            />

           
            <div className="absolute inset-0 z-0 mb-5">
              <img
                src={img3}
                className="h-[550px] w-[600px] ml-2 rounded-lg shadow-2xl object-cover grayscale transition-all duration-300 ease-in-out hover:grayscale-0"
                alt="Image 3"
              />
            </div>

          
            <motion.img
              src={img2}
              animate={{ x: [150,50,150] }}  
              transition={{ duration: 10, repeat: Infinity }}
              className="max-w-sm rounded-t-[40px] rounded-bl-[40px] shadow-2xl border-l-4 border-b-4 grayscale transition-all duration-300 ease-in-out hover:grayscale-0 mt-30 z-10"
              alt="Image 2"
            />
          </div>

          {/* Right side: Text Content */}
          <div className="w-full lg:w-1/2 mt-10 lg:mt-0 text-center lg:text-left px-6">
            <h2 className="text-3xl font-bold mb-4 text-yellow-300 text-center">---About Us---</h2>
            <p className="py-4 text-lg text-gray-300">
              We believe that we can save more lives with you. Donate is the largest global crowdfunding community
              connecting nonprofits, donors, and companies in nearly every country. We help nonprofits from Afghanistan
              to Zimbabwe (and hundreds of places in between) access the tools, training, and support they need to be more
              effective and make our world a better place.
            </p>

            <div className="space-y-4">
              {/* Charity items with icons */}
              <div className="flex items-center justify-center lg:justify-start text-lg font-bold">
                <span className="w-6 h-6 bg-green-500 text-white  rounded-full flex items-center justify-center mr-3">
                  ✓
                </span>
                Charity For Foods
              </div>
              <div className="flex items-center justify-center lg:justify-start text-lg font-bold">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center mr-3">
                  ✓
                </span>
                Charity For Water
              </div>
              <div className="flex items-center justify-center lg:justify-start text-lg font-bold">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center mr-3">
                  ✓
                </span>
                Charity For Education
              </div>
              <div className="flex items-center justify-center lg:justify-start text-lg font-bold">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center mr-3">
                  ✓
                </span>
                Charity For Medical
              </div>
            </div>

            {/* About More */}
            <div className="mt-6">
              <a href="#" className=" btn bg-yellow-400 text-black rounded-xl p-5 hover:bg-green-600 text-xl">Learn More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
