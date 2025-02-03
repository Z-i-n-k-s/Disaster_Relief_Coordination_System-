import { Link } from "react-router-dom";

const Navbar = () => {
    const navOptions = (
      <>
       <Link to='/'> <li><a>Home</a></li></Link>
        <Link to="aboutus"><li><a>About Us</a></li></Link>
      </>
    );
  
    return (
      <div className="navbar fixed z-10 bg-black/30 shadow-sm max-w-screen-xl mx-auto">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {navOptions}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl text-yellow-300">JonojibonAid</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navOptions}</ul>
        </div>
        <div className="navbar-end">
         <Link to="/login">  <a className="btn bg-yellow-300 text-black border-none">SignIn</a></Link>
        </div>
      </div>
    );
};
  
export default Navbar;
