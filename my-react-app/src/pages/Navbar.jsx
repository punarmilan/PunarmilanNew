import { useState } from "react";
import { LogIn, UserPlus, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 bg-white/60 backdrop-blur-xl border-b border-gray-200 z-50 shadow-sm">
      <div className="w-full px-4 sm:px-8 md:max-w-7xl md:mx-auto py-4 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wide">
          Truth Life
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          {["Home", "Community", "Courses", "Dashboard", "Contact"].map((item, index) => (
            <Link
              key={index}
              to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
              className="relative text-gray-700 font-semibold hover:text-indigo-700 transition duration-300 after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-indigo-600 after:transition-all hover:after:w-full"
            >
              {item}
            </Link>
          ))}

          <Link
            to="/login"
            className="flex items-center gap-2 px-5 py-2 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-50 transition duration-300 shadow-sm"
          >
            <LogIn size={18} />
            Login
          </Link>

          <Link
            to="/signup"
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-md hover:scale-105 transition duration-300"
          >
            <UserPlus size={18} />
            Sign Up
          </Link>
        </div>

        {/* Hamburger */}
        <div className="md:hidden cursor-pointer">
          {open ? (
            <X size={28} onClick={() => setOpen(false)} />
          ) : (
            <Menu size={28} onClick={() => setOpen(true)} />
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white/90 backdrop-blur-xl shadow-xl px-6 pb-6 animate-slideDown">
          <div className="flex flex-col gap-5 mt-4">
            {["Home", "Community", "Courses", "Dashboard", "Contact"].map((item, index) => (
              <Link
                key={index}
                to={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="text-gray-700 font-semibold text-lg hover:text-indigo-700 transition"
              >
                {item}
              </Link>
            ))}

            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 px-5 py-2 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-50 transition"
            >
              <LogIn size={18} />
              Login
            </Link>

            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-md"
            >
              <UserPlus size={18} />
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;