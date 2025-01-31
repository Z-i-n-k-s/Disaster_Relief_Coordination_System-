import { Link } from 'react-router-dom';
import bg from '../../assets/signup.jpg';

const bgStyle = {
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    width: "100%",
};

const SignUp = () => {
    return (
        <div style={bgStyle}>
            <div className="min-h-[650px] md:min-h-[750px] bg-gradient-to-r from-black/90 to-green-900/70 pt-32 pb-10 md:pt-48">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 text-white">
                        {/* Left Side Text - Centered */}
                        <div className="text-left p-20">
                            <h1 className="text-5xl font-bold text-yellow-400">Join Us in Making a Difference</h1>
                            <p className="mt-6 text-lg text-gray-300">
                                Sign up to be a part of Jonojibon Aid. Your contribution can help disaster victims in Bangladesh and bring hope to those in need. Whether you are donating or volunteering, every effort counts.
                            </p>
                        </div>

                        {/* Right Side Form - Less Width and Balanced */}
                        <div className="bg-black text-white p-6 rounded-lg shadow-lg w-full md:w-[400px] mx-auto">
                            <h2 className="text-3xl font-semibold mb-6 text-center">Sign Up for Jonojibon Aid</h2>
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

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label className="block text-sm font-medium">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Create a password"
                                    />
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label className="block text-sm font-medium">Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        placeholder="Confirm your password"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="w-full p-3 bg-yellow-300 text-black font-bold rounded-md hover:bg-primary-dark focus:outline-none"
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </form>

                            {/* Login Link */}
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-300">
                                    Already have an account? <Link to="/login" className="text-yellow-300 hover:underline">Login here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
