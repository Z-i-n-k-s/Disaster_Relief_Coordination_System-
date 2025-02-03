import { useState } from "react";
import { Link } from "react-router-dom";
import bg from "../../assets/signup.jpg";

const bgStyle = {
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    width: "100%",
};

const SignUp = () => {
    const [isVolunteer, setIsVolunteer] = useState(false);

    const centers = [
        "Dhaka Relief Center",
        "Chattogram Aid Hub",
        "Sylhet Support Unit",
        "Khulna Welfare Center",
        "Rajshahi Assistance Point",
        "Barisal Help Center",
        "Rangpur Emergency Base"
    ];

    return (
        <div style={bgStyle}>
            <div className="min-h-[650px] md:min-h-[750px] bg-gradient-to-r from-black/90 to-green-900/70 pt-32 pb-10 md:pt-48">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 text-white">
                        {/* Left Side Text */}
                        <div className="text-left p-20">
                            <h1 className="text-5xl font-bold text-yellow-400">
                                {isVolunteer ? "Become a Volunteer" : "Join Us in Making a Difference"}
                            </h1>
                            <p className="mt-6 text-lg text-gray-300">
                                {isVolunteer
                                    ? "Sign up to volunteer with Jonojibon Aid and help disaster victims in Bangladesh. Your time and dedication can bring hope to those in need."
                                    : "Sign up to be a part of Jonojibon Aid. Your contribution can help disaster victims in Bangladesh and bring hope to those in need. Whether you are donating or volunteering, every effort counts."}
                            </p>
                        </div>

                        {/* Right Side Form */}
                        <div className="bg-black text-white p-6 rounded-lg shadow-lg w-full md:w-[400px] mx-auto">
                            <h2 className="text-3xl font-semibold mb-6 text-center">
                                {isVolunteer ? <><span className="text-yellow-300">Volunteer</span> Signup</> : <>Sign Up for <br /><span className="text-yellow-300"> Jonojibon Aid</span></>}
                            </h2>
                            <form className="space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                {isVolunteer && (
                                    <div>
                                        <label className="block text-sm font-medium">Contact Info</label>
                                        <input
                                            type="text"
                                            name="contact"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                )}

                                {/* Password Fields */}
                                <div>
                                    <label className="block text-sm font-medium">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Create a password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Confirm your password"
                                    />
                                </div>

                                {isVolunteer && (
                                    <div>
                                        <label className="block text-sm font-medium">Assigned Center</label>
                                        <select
                                            name="assigned_center"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="" className="bg-black text-white text-center text-2xl">Select a Center</option>
                                            {centers.map((center, index) => (
                                                <option key={index} value={center} className="bg-gray-300 text-black">{center}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="w-full p-3 bg-yellow-300 text-black font-bold rounded-md hover:bg-primary-dark focus:outline-none"
                                    >
                                        {isVolunteer ? "Sign Up as Volunteer" : "Sign Up"}
                                    </button>
                                </div>
                            </form>

                            {/* Switch between Normal Signup and Volunteer Signup */}
                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => setIsVolunteer(!isVolunteer)}
                                    className="text-yellow-300 hover:underline"
                                >
                                    {isVolunteer ? "Switch to Regular Signup" : "Sign Up as Volunteer"}
                                </button>
                            </div>

                            {!isVolunteer && (
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-gray-300">
                                        Already have an account? <Link to="/login" className="text-yellow-300 hover:underline">Login here</Link>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
